import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MatrimonyUser, MatrimonyUserDocument } from '../schemas/matrimony-user.schema';
import { MatrimonyProfile, MatrimonyProfileDocument } from '../schemas/matrimony-profile.schema';
import { MatrimonyPhoto, MatrimonyPhotoDocument } from '../schemas/matrimony-photo.schema';
import { MatrimonyAuditLog, MatrimonyAuditLogDocument } from '../schemas/matrimony-audit-log.schema';
import { MatrimonyInterest, MatrimonyInterestDocument } from '../schemas/matrimony-interest.schema';
import { MatrimonyMessage, MatrimonyMessageDocument } from '../schemas/matrimony-message.schema';
import { MatrimonyProfileView, MatrimonyProfileViewDocument } from '../schemas/matrimony-profile-view.schema';
import { CrmLead, CrmLeadDocument } from '../schemas/crm-lead.schema';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MatrimonyAdminService {
  constructor(
    @InjectModel(MatrimonyUser.name) private userModel: Model<MatrimonyUserDocument>,
    @InjectModel(MatrimonyProfile.name) private profileModel: Model<MatrimonyProfileDocument>,
    @InjectModel(MatrimonyPhoto.name) private photoModel: Model<MatrimonyPhotoDocument>,
    @InjectModel(MatrimonyAuditLog.name) private auditModel: Model<MatrimonyAuditLogDocument>,
    @InjectModel(MatrimonyInterest.name) private interestModel: Model<MatrimonyInterestDocument>,
    @InjectModel(MatrimonyMessage.name) private messageModel: Model<MatrimonyMessageDocument>,
    @InjectModel(MatrimonyProfileView.name) private viewModel: Model<MatrimonyProfileViewDocument>,
    @InjectModel(CrmLead.name) private leadModel: Model<CrmLeadDocument>,
  ) {}

  async listUsers(query: any) {
    const filter: any = {};

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }
    if (query.tier && query.tier !== 'all') {
      filter.tier = query.tier;
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    let userIdsFromSearch: Types.ObjectId[] | null = null;

    if (query.search) {
      const regex = new RegExp(query.search, 'i');
      const matchingProfiles = await this.profileModel.find({
        $or: [{ fullName: regex }, { mobile: regex }, { email: regex }, { currentCity: regex }],
      }).select('userId');

      const matchingUsers = await this.userModel.find({ username: regex }).select('_id');

      const profileUserIds = matchingProfiles.map(p => p.userId);
      const directUserIds = matchingUsers.map(u => u._id);

      userIdsFromSearch = [...new Set([...profileUserIds, ...directUserIds])];
      filter._id = { $in: userIdsFromSearch };
    }

    if (query.gender && query.gender !== 'all') {
      const genderProfiles = await this.profileModel.find({ gender: query.gender }).select('userId');
      const genderUserIds = genderProfiles.map(p => p.userId);
      if (filter._id) {
        filter._id.$in = filter._id.$in.filter((id: any) => genderUserIds.some(gid => gid.equals(id)));
      } else {
        filter._id = { $in: genderUserIds };
      }
    }

    const [total, users] = await Promise.all([
      this.userModel.countDocuments(filter),
      this.userModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-passwordHash')
        .lean(),
    ]);

    const userIds = users.map(u => u._id);

    const [profiles, photos] = await Promise.all([
      this.profileModel.find({ userId: { $in: userIds } }).lean(),
      this.photoModel.find({ userId: { $in: userIds } }).lean(),
    ]);

    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));
    const photoMap = new Map<string, any[]>();
    for (const ph of photos) {
      const uid = ph.userId.toString();
      if (!photoMap.has(uid)) photoMap.set(uid, []);
      photoMap.get(uid)!.push(ph);
    }

    const items = users.map(user => {
      const uid = user._id.toString();
      return {
        ...user,
        profile: profileMap.get(uid) || null,
        photos: photoMap.get(uid) || [],
      };
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createMember(dto: CreateMemberDto, adminId?: string, ipAddress?: string) {
    // Generate unique username: 'ap' + cleaned name part + 4 random digits
    const cleanedName = dto.fullName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
    let username = '';
    let isUnique = false;

    while (!isUnique) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      username = `ap_${cleanedName || 'user'}_${rand}`;
      const exists = await this.userModel.exists({ username });
      if (!exists) isUnique = true;
    }

    // Generate random 8-character temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex').toUpperCase();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    const adminObjectId = adminId ? new Types.ObjectId(adminId) : new Types.ObjectId();

    const user = await this.userModel.create({
      username,
      passwordHash,
      isFirstLogin: true,
      tier: dto.tier || 'basic',
      status: 'pending_profile',
      createdByAdmin: adminObjectId,
      membershipPaidAt: new Date(),
      membershipAmount: dto.membershipAmount || 0,
      membershipMode: dto.membershipMode || 'cash',
      membershipReceiptNumber: dto.membershipReceiptNumber || `REC-${Date.now()}`,
    });

    const profile = await this.profileModel.create({
      userId: user._id,
      fullName: dto.fullName.trim(),
      mobile: dto.mobile.trim(),
      email: dto.email ? dto.email.trim() : '',
      gender: dto.gender,
      adminNotes: dto.notes || '',
      profileCompleteness: 15,
    });

    // Write to audit log
    await this.logAudit({
      adminId: adminObjectId,
      action: 'CREATE_MEMBER',
      targetUserId: user._id,
      after: { username, tier: user.tier, amount: user.membershipAmount },
      ipAddress,
      notes: `Member created with receipt ${user.membershipReceiptNumber}`,
    });

    return {
      success: true,
      member: {
        userId: user._id,
        username,
        tempPassword,
        fullName: profile.fullName,
        mobile: profile.mobile,
        tier: user.tier,
        status: user.status,
        receiptNumber: user.membershipReceiptNumber,
      },
    };
  }

  async getMemberDetail(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId).select('-passwordHash');
    if (!user) throw new NotFoundException('Member not found');

    const [profile, photos, leads, audits] = await Promise.all([
      this.profileModel.findOne({ userId: userObjectId }),
      this.photoModel.find({ userId: userObjectId }).sort({ createdAt: -1 }),
      this.leadModel.find({ memberId: userObjectId }).sort({ createdAt: -1 }),
      this.auditModel.find({ targetUserId: userObjectId }).sort({ timestamp: -1 }).limit(20),
    ]);

    return {
      user,
      profile,
      photos,
      leads,
      audits,
    };
  }

  async updateMemberStatus(userId: string, status: string, rejectionReason?: string, adminId?: string, ipAddress?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId);
    if (!user) throw new NotFoundException('Member not found');

    const previousStatus = user.status;
    user.status = status;
    await user.save();

    const profile = await this.profileModel.findOne({ userId: userObjectId });
    if (profile) {
      if (status === 'verified' || status === 'active') {
        profile.verifiedAt = new Date();
        profile.verifiedByAdmin = adminId ? new Types.ObjectId(adminId) : undefined;
        profile.rejectionReason = '';
      } else if (status === 'rejected') {
        profile.rejectionReason = rejectionReason || 'Profile details rejected by administrator.';
      }
      await profile.save();
    }

    await this.logAudit({
      adminId: adminId ? new Types.ObjectId(adminId) : new Types.ObjectId(),
      action: 'UPDATE_STATUS',
      targetUserId: userObjectId,
      before: { status: previousStatus },
      after: { status, rejectionReason },
      ipAddress,
      notes: `Status changed from ${previousStatus} to ${status}`,
    });

    return { success: true, status: user.status };
  }

  async updateMemberTier(userId: string, tier: string, adminId?: string, ipAddress?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId);
    if (!user) throw new NotFoundException('Member not found');

    const previousTier = user.tier;
    user.tier = tier;
    await user.save();

    await this.logAudit({
      adminId: adminId ? new Types.ObjectId(adminId) : new Types.ObjectId(),
      action: 'UPDATE_TIER',
      targetUserId: userObjectId,
      before: { tier: previousTier },
      after: { tier },
      ipAddress,
      notes: `Tier upgraded from ${previousTier} to ${tier}`,
    });

    return { success: true, tier: user.tier };
  }

  async toggleContactVisibility(userId: string, isContactVisible: boolean, adminId?: string, ipAddress?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const profile = await this.profileModel.findOne({ userId: userObjectId });
    if (!profile) throw new NotFoundException('Profile not found');

    const prev = profile.isContactVisible;
    profile.isContactVisible = isContactVisible;
    await profile.save();

    await this.logAudit({
      adminId: adminId ? new Types.ObjectId(adminId) : new Types.ObjectId(),
      action: 'TOGGLE_CONTACT_VISIBILITY',
      targetUserId: userObjectId,
      before: { isContactVisible: prev },
      after: { isContactVisible },
      ipAddress,
    });

    return { success: true, isContactVisible: profile.isContactVisible };
  }

  async toggleFeatured(userId: string, isProfileFeatured: boolean, adminId?: string, ipAddress?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const profile = await this.profileModel.findOne({ userId: userObjectId });
    if (!profile) throw new NotFoundException('Profile not found');

    const prev = profile.isProfileFeatured;
    profile.isProfileFeatured = isProfileFeatured;
    await profile.save();

    await this.logAudit({
      adminId: adminId ? new Types.ObjectId(adminId) : new Types.ObjectId(),
      action: 'TOGGLE_FEATURED',
      targetUserId: userObjectId,
      before: { isProfileFeatured: prev },
      after: { isProfileFeatured },
      ipAddress,
    });

    return { success: true, isProfileFeatured: profile.isProfileFeatured };
  }

  async resetPassword(userId: string, adminId?: string, ipAddress?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId);
    if (!user) throw new NotFoundException('Member not found');

    const newTempPassword = crypto.randomBytes(4).toString('hex').toUpperCase();
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newTempPassword, salt);
    user.isFirstLogin = true;
    await user.save();

    await this.logAudit({
      adminId: adminId ? new Types.ObjectId(adminId) : new Types.ObjectId(),
      action: 'RESET_PASSWORD',
      targetUserId: userObjectId,
      ipAddress,
      notes: `Temporary password regenerated by admin`,
    });

    return {
      success: true,
      username: user.username,
      tempPassword: newTempPassword,
    };
  }

  async getPendingVerifications() {
    const users = await this.userModel.find({ status: 'pending_verification' }).select('_id username tier createdAt');
    const userIds = users.map(u => u._id);

    const [profiles, photos] = await Promise.all([
      this.profileModel.find({ userId: { $in: userIds } }).lean(),
      this.photoModel.find({ userId: { $in: userIds } }).lean(),
    ]);

    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));
    const photoMap = new Map<string, any[]>();
    for (const ph of photos) {
      const uid = ph.userId.toString();
      if (!photoMap.has(uid)) photoMap.set(uid, []);
      photoMap.get(uid)!.push(ph);
    }

    return users.map(u => {
      const uid = u._id.toString();
      return {
        _id: u._id,
        username: u.username,
        tier: u.tier,
        createdAt: (u as any).createdAt,
        profile: profileMap.get(uid) || null,
        photos: photoMap.get(uid) || [],
      };
    });
  }

  async getPendingPhotos() {
    const photos = await this.photoModel.find({ status: 'pending' }).sort({ uploadedAt: -1 }).lean();
    const userIds = photos.map(p => p.userId);
    const profiles = await this.profileModel.find({ userId: { $in: userIds } }).select('userId fullName gender').lean();
    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));

    return photos.map(ph => ({
      ...ph,
      profile: profileMap.get(ph.userId.toString()) || null,
    }));
  }

  async reviewPhoto(photoId: string, status: 'approved' | 'rejected', reason?: string, adminId?: string, ipAddress?: string) {
    const photoObjectId = new Types.ObjectId(photoId);
    const photo = await this.photoModel.findById(photoObjectId);
    if (!photo) throw new NotFoundException('Photo not found');

    const prev = photo.status;
    photo.status = status;
    photo.rejectionReason = status === 'rejected' ? (reason || 'Photo does not meet quality/guidelines') : '';
    photo.reviewedAt = new Date();
    photo.reviewedByAdmin = adminId ? new Types.ObjectId(adminId) : undefined;
    await photo.save();

    await this.logAudit({
      adminId: adminId ? new Types.ObjectId(adminId) : new Types.ObjectId(),
      action: status === 'approved' ? 'APPROVE_PHOTO' : 'REJECT_PHOTO',
      targetUserId: photo.userId,
      before: { status: prev },
      after: { status, reason },
      ipAddress,
    });

    return { success: true, photo };
  }

  async getOverviewAnalytics() {
    const [total, active, pending, verified, suspended, newThisMonth] = await Promise.all([
      this.userModel.countDocuments({ status: { $ne: 'deleted' } }),
      this.userModel.countDocuments({ status: 'active' }),
      this.userModel.countDocuments({ status: 'pending_verification' }),
      this.userModel.countDocuments({ status: 'verified' }),
      this.userModel.countDocuments({ status: 'suspended' }),
      this.userModel.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      }),
    ]);

    const pendingPhotos = await this.photoModel.countDocuments({ status: 'pending' });

    return {
      total,
      active,
      pending,
      verified,
      suspended,
      newThisMonth,
      pendingPhotos,
    };
  }

  async getActivityAnalytics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [views, interests, messages] = await Promise.all([
      this.viewModel.countDocuments({ viewedAt: { $gte: thirtyDaysAgo } }),
      this.interestModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      this.messageModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    return {
      viewsLast30Days: views,
      interestsLast30Days: interests,
      messagesLast30Days: messages,
    };
  }

  async getAuditLogs(query: any) {
    const filter: any = {};
    if (query.action) filter.action = query.action;
    if (query.targetUserId) filter.targetUserId = new Types.ObjectId(query.targetUserId);

    if (query.dateFrom || query.dateTo) {
      filter.timestamp = {};
      if (query.dateFrom) filter.timestamp.$gte = new Date(query.dateFrom);
      if (query.dateTo) filter.timestamp.$lte = new Date(query.dateTo);
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 25));
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.auditModel.countDocuments(filter),
      this.auditModel.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async logAudit(data: {
    adminId: Types.ObjectId;
    action: string;
    targetUserId?: Types.ObjectId;
    before?: any;
    after?: any;
    ipAddress?: string;
    notes?: string;
  }) {
    try {
      await this.auditModel.create({
        ...data,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('Failed to log audit event:', err);
    }
  }
}
