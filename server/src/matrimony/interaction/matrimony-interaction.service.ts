import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MatrimonyProfile, MatrimonyProfileDocument } from '../schemas/matrimony-profile.schema';
import { MatrimonyUser, MatrimonyUserDocument } from '../schemas/matrimony-user.schema';
import { MatrimonyPhoto, MatrimonyPhotoDocument } from '../schemas/matrimony-photo.schema';
import { MatrimonyInterest, MatrimonyInterestDocument } from '../schemas/matrimony-interest.schema';
import { MatrimonyShortlist, MatrimonyShortlistDocument } from '../schemas/matrimony-shortlist.schema';
import { MatrimonyMessage, MatrimonyMessageDocument } from '../schemas/matrimony-message.schema';
import { MatrimonyProfileView, MatrimonyProfileViewDocument } from '../schemas/matrimony-profile-view.schema';

@Injectable()
export class MatrimonyInteractionService {
  constructor(
    @InjectModel(MatrimonyProfile.name) private profileModel: Model<MatrimonyProfileDocument>,
    @InjectModel(MatrimonyUser.name) private userModel: Model<MatrimonyUserDocument>,
    @InjectModel(MatrimonyPhoto.name) private photoModel: Model<MatrimonyPhotoDocument>,
    @InjectModel(MatrimonyInterest.name) private interestModel: Model<MatrimonyInterestDocument>,
    @InjectModel(MatrimonyShortlist.name) private shortlistModel: Model<MatrimonyShortlistDocument>,
    @InjectModel(MatrimonyMessage.name) private messageModel: Model<MatrimonyMessageDocument>,
    @InjectModel(MatrimonyProfileView.name) private viewModel: Model<MatrimonyProfileViewDocument>,
  ) {}

  async searchProfiles(userId: string, query: any) {
    const userObjectId = new Types.ObjectId(userId);
    const currentUserProfile = await this.profileModel.findOne({ userId: userObjectId });

    // 1. Find all active/verified users excluding self
    const activeUsers = await this.userModel.find({
      _id: { $ne: userObjectId },
      status: { $in: ['verified', 'active'] },
    }).select('_id tier');

    const activeUserIds = activeUsers.map(u => u._id);

    // 2. Filter only profiles that have at least one approved photo
    const usersWithApprovedPhotos = await this.photoModel.distinct('userId', {
      userId: { $in: activeUserIds },
      status: 'approved',
    });

    // Build Mongo search filter
    const filter: any = {
      userId: { $in: usersWithApprovedPhotos },
    };

    // Filter by opposite gender by default if current user has gender
    if (query.gender) {
      filter.gender = query.gender;
    } else if (currentUserProfile?.gender) {
      filter.gender = currentUserProfile.gender === 'male' ? 'female' : 'male';
    }

    if (query.religion) {
      filter.religion = new RegExp(query.religion, 'i');
    }

    if (query.caste) {
      filter.caste = new RegExp(query.caste, 'i');
    }

    if (query.city) {
      filter.currentCity = new RegExp(query.city, 'i');
    }

    if (query.maritalStatus) {
      const statuses = Array.isArray(query.maritalStatus) ? query.maritalStatus : [query.maritalStatus];
      filter.maritalStatus = { $in: statuses };
    }

    if (query.manglik && query.manglik !== 'any') {
      filter.manglik = query.manglik;
    }

    if (query.heightMin || query.heightMax) {
      filter.height = {};
      if (query.heightMin) filter.height.$gte = Number(query.heightMin);
      if (query.heightMax) filter.height.$lte = Number(query.heightMax);
    }

    if (query.ageMin || query.ageMax) {
      const now = new Date();
      filter.dateOfBirth = {};
      if (query.ageMax) {
        const minDob = new Date(now.getFullYear() - Number(query.ageMax) - 1, now.getMonth(), now.getDate());
        filter.dateOfBirth.$gte = minDob;
      }
      if (query.ageMin) {
        const maxDob = new Date(now.getFullYear() - Number(query.ageMin), now.getMonth(), now.getDate());
        filter.dateOfBirth.$lte = maxDob;
      }
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const [total, profiles] = await Promise.all([
      this.profileModel.countDocuments(filter),
      this.profileModel.find(filter)
        .sort({ isProfileFeatured: -1, profileCompleteness: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const targetUserIds = profiles.map(p => p.userId);

    // Fetch approved photos for these profiles
    const photos = await this.photoModel.find({
      userId: { $in: targetUserIds },
      status: 'approved',
    }).lean();

    // Fetch shortlists & interests from current user
    const [shortlists, sentInterests, receivedInterests] = await Promise.all([
      this.shortlistModel.find({ userId: userObjectId, targetUserId: { $in: targetUserIds } }).lean(),
      this.interestModel.find({ senderId: userObjectId, receiverId: { $in: targetUserIds } }).lean(),
      this.interestModel.find({ senderId: { $in: targetUserIds }, receiverId: userObjectId }).lean(),
    ]);

    const shortlistedSet = new Set(shortlists.map(s => s.targetUserId.toString()));
    const sentInterestsMap = new Map(sentInterests.map(i => [i.receiverId.toString(), i.status]));
    const receivedInterestsMap = new Map(receivedInterests.map(i => [i.senderId.toString(), i.status]));

    // Sanitize contact info unless mutual match + isContactVisible
    const items = profiles.map(p => {
      const pUserId = p.userId.toString();
      const userPhotos = photos.filter(ph => ph.userId.toString() === pUserId);
      const isMutualMatch = sentInterestsMap.get(pUserId) === 'accepted' || receivedInterestsMap.get(pUserId) === 'accepted';
      const allowContact = p.isContactVisible && isMutualMatch;

      return {
        _id: p._id,
        userId: p.userId,
        fullName: p.fullName,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        religion: p.religion,
        caste: p.caste,
        subCaste: p.subCaste,
        gotra: p.gotra,
        motherTongue: p.motherTongue,
        maritalStatus: p.maritalStatus,
        height: p.height,
        education: p.education,
        occupation: p.occupation,
        annualIncome: p.annualIncome,
        workCity: p.workCity,
        currentCity: p.currentCity,
        currentState: p.currentState,
        rashi: p.rashi,
        nakshatra: p.nakshatra,
        manglik: p.manglik,
        isProfileFeatured: p.isProfileFeatured,
        profileCompleteness: p.profileCompleteness,
        photos: userPhotos.map(ph => ({ id: ph._id, url: ph.url, isProfilePicture: ph.isProfilePicture })),
        isShortlisted: shortlistedSet.has(pUserId),
        interestStatus: sentInterestsMap.get(pUserId) || (receivedInterestsMap.has(pUserId) ? `received_${receivedInterestsMap.get(pUserId)}` : 'none'),
        isMutualMatch,
        contact: allowContact
          ? { mobile: p.mobile, email: p.email, alternatePhone: p.alternatePhone }
          : null,
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

  async getSingleProfile(viewerUserId: string, targetProfileId: string) {
    const viewerObjectId = new Types.ObjectId(viewerUserId);
    const profile = await this.profileModel.findById(targetProfileId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const targetUser = await this.userModel.findById(profile.userId);
    if (!targetUser || (targetUser.status !== 'verified' && targetUser.status !== 'active')) {
      throw new NotFoundException('Profile is not currently active');
    }

    // Log profile view (deduplicated per day)
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      await this.viewModel.findOneAndUpdate(
        { userId: profile.userId, viewedBy: viewerObjectId, dateKey: todayStr },
        { viewedAt: new Date() },
        { upsert: true },
      );
    } catch {}

    const [photos, isShortlisted, sentInterest, receivedInterest] = await Promise.all([
      this.photoModel.find({ userId: profile.userId, status: 'approved' }).sort({ isProfilePicture: -1 }).lean(),
      this.shortlistModel.exists({ userId: viewerObjectId, targetUserId: profile.userId }),
      this.interestModel.findOne({ senderId: viewerObjectId, receiverId: profile.userId }),
      this.interestModel.findOne({ senderId: profile.userId, receiverId: viewerObjectId }),
    ]);

    const isMutualMatch = (sentInterest?.status === 'accepted') || (receivedInterest?.status === 'accepted');
    const allowContact = profile.isContactVisible && isMutualMatch;

    return {
      profile,
      photos,
      isShortlisted: !!isShortlisted,
      interestStatus: sentInterest ? sentInterest.status : (receivedInterest ? `received_${receivedInterest.status}` : 'none'),
      isMutualMatch,
      contact: allowContact
        ? { mobile: profile.mobile, alternatePhone: profile.alternatePhone, email: profile.email }
        : null,
    };
  }

  async toggleShortlist(userId: string, targetUserId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const targetObjectId = new Types.ObjectId(targetUserId);

    const existing = await this.shortlistModel.findOne({ userId: userObjectId, targetUserId: targetObjectId });
    if (existing) {
      await this.shortlistModel.deleteOne({ _id: existing._id });
      return { shortlisted: false, message: 'Removed from shortlist' };
    } else {
      await this.shortlistModel.create({ userId: userObjectId, targetUserId: targetObjectId });
      return { shortlisted: true, message: 'Added to shortlist' };
    }
  }

  async getShortlistedProfiles(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const shortlists = await this.shortlistModel.find({ userId: userObjectId }).sort({ createdAt: -1 }).lean();
    const targetUserIds = shortlists.map(s => s.targetUserId);

    const [profiles, photos] = await Promise.all([
      this.profileModel.find({ userId: { $in: targetUserIds } }).lean(),
      this.photoModel.find({ userId: { $in: targetUserIds }, status: 'approved' }).lean(),
    ]);

    return profiles.map(p => {
      const pUserId = p.userId.toString();
      const userPhotos = photos.filter(ph => ph.userId.toString() === pUserId);
      return {
        ...p,
        photos: userPhotos,
      };
    });
  }

  async sendInterest(senderUserId: string, receiverUserId: string) {
    const senderObjectId = new Types.ObjectId(senderUserId);
    const receiverObjectId = new Types.ObjectId(receiverUserId);

    if (senderUserId === receiverUserId) {
      throw new BadRequestException('Cannot send interest to yourself');
    }

    const senderUser = await this.userModel.findById(senderObjectId);
    if (!senderUser) throw new NotFoundException('User not found');

    // 5 interest per day limit for basic tier
    if (senderUser.tier === 'basic') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const countToday = await this.interestModel.countDocuments({
        senderId: senderObjectId,
        createdAt: { $gte: startOfDay },
      });

      if (countToday >= 5) {
        throw new ForbiddenException('Daily limit reached (5 interests/day for Basic members). Please contact AstroPravin staff to upgrade to Premium.');
      }
    }

    const existing = await this.interestModel.findOne({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
    });

    if (existing) {
      return { success: true, interest: existing, message: 'Interest already sent' };
    }

    const interest = await this.interestModel.create({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      status: 'pending',
    });

    return { success: true, interest, message: 'Interest sent successfully' };
  }

  async respondInterest(receiverUserId: string, interestId: string, action: 'accept' | 'decline') {
    const receiverObjectId = new Types.ObjectId(receiverUserId);
    const interest = await this.interestModel.findOne({
      _id: new Types.ObjectId(interestId),
      receiverId: receiverObjectId,
    });

    if (!interest) {
      throw new NotFoundException('Interest request not found');
    }

    interest.status = action === 'accept' ? 'accepted' : 'declined';
    await interest.save();

    return { success: true, interest, message: `Interest ${action}ed successfully` };
  }

  async getInterests(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const [sent, received] = await Promise.all([
      this.interestModel.find({ senderId: userObjectId }).sort({ createdAt: -1 }).lean(),
      this.interestModel.find({ receiverId: userObjectId }).sort({ createdAt: -1 }).lean(),
    ]);

    const allUserIds = [...sent.map(s => s.receiverId), ...received.map(r => r.senderId)];

    const [profiles, photos] = await Promise.all([
      this.profileModel.find({ userId: { $in: allUserIds } }).lean(),
      this.photoModel.find({ userId: { $in: allUserIds }, status: 'approved' }).lean(),
    ]);

    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));
    const photoMap = new Map<string, any[]>();
    for (const ph of photos) {
      const uid = ph.userId.toString();
      if (!photoMap.has(uid)) photoMap.set(uid, []);
      photoMap.get(uid)!.push(ph);
    }

    const sentDecorated = sent.map(i => ({
      _id: i._id,
      status: i.status,
      createdAt: (i as any).createdAt,
      targetUser: profileMap.get(i.receiverId.toString()) || null,
      photos: photoMap.get(i.receiverId.toString()) || [],
    }));

    const receivedDecorated = received.map(i => ({
      _id: i._id,
      status: i.status,
      createdAt: (i as any).createdAt,
      senderUser: profileMap.get(i.senderId.toString()) || null,
      photos: photoMap.get(i.senderId.toString()) || [],
    }));

    return {
      sent: sentDecorated,
      received: receivedDecorated,
    };
  }

  async getMatches(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    // Mutual matches: where status is 'accepted'
    const [acceptedSent, acceptedReceived] = await Promise.all([
      this.interestModel.find({ senderId: userObjectId, status: 'accepted' }).lean(),
      this.interestModel.find({ receiverId: userObjectId, status: 'accepted' }).lean(),
    ]);

    const partnerIds = [
      ...acceptedSent.map(i => i.receiverId),
      ...acceptedReceived.map(i => i.senderId),
    ];

    const [profiles, photos] = await Promise.all([
      this.profileModel.find({ userId: { $in: partnerIds } }).lean(),
      this.photoModel.find({ userId: { $in: partnerIds }, status: 'approved' }).lean(),
    ]);

    const photoMap = new Map<string, any[]>();
    for (const ph of photos) {
      const uid = ph.userId.toString();
      if (!photoMap.has(uid)) photoMap.set(uid, []);
      photoMap.get(uid)!.push(ph);
    }

    return profiles.map(p => ({
      ...p,
      photos: photoMap.get(p.userId.toString()) || [],
    }));
  }

  // ── Chat Functions ──────────────────────────────────────────────────────────

  async getConversations(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const matches = await this.getMatches(userId);

    const conversations = await Promise.all(
      matches.map(async (partner) => {
        const partnerObjectId = new Types.ObjectId(partner.userId);
        const lastMsg = await this.messageModel.findOne({
          $or: [
            { senderId: userObjectId, receiverId: partnerObjectId },
            { senderId: partnerObjectId, receiverId: userObjectId },
          ],
        }).sort({ createdAt: -1 });

        const unreadCount = await this.messageModel.countDocuments({
          senderId: partnerObjectId,
          receiverId: userObjectId,
          status: { $ne: 'read' },
        });

        return {
          partnerProfile: partner,
          lastMessage: lastMsg,
          unreadCount,
        };
      }),
    );

    return conversations.sort((a, b) => {
      const timeA = a.lastMessage ? new Date((a.lastMessage as any).createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date((b.lastMessage as any).createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  async getMessages(userId: string, partnerUserId: string, page = 1, limit = 50) {
    const userObjectId = new Types.ObjectId(userId);
    const partnerObjectId = new Types.ObjectId(partnerUserId);

    // Mark incoming messages as read
    await this.messageModel.updateMany(
      { senderId: partnerObjectId, receiverId: userObjectId, status: { $ne: 'read' } },
      { status: 'read', readAt: new Date() },
    );

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.messageModel.find({
        $or: [
          { senderId: userObjectId, receiverId: partnerObjectId },
          { senderId: partnerObjectId, receiverId: userObjectId },
        ],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.messageModel.countDocuments({
        $or: [
          { senderId: userObjectId, receiverId: partnerObjectId },
          { senderId: partnerObjectId, receiverId: userObjectId },
        ],
      }),
    ]);

    return {
      messages: messages.reverse(),
      total,
      page,
      limit,
    };
  }

  async sendMessage(senderUserId: string, receiverUserId: string, messageText: string) {
    if (!messageText || !messageText.trim()) {
      throw new BadRequestException('Message cannot be empty');
    }

    const senderObjectId = new Types.ObjectId(senderUserId);
    const receiverObjectId = new Types.ObjectId(receiverUserId);

    // Verify mutual match exists
    const hasMutualMatch = await this.interestModel.exists({
      $or: [
        { senderId: senderObjectId, receiverId: receiverObjectId, status: 'accepted' },
        { senderId: receiverObjectId, receiverId: senderObjectId, status: 'accepted' },
      ],
    });

    if (!hasMutualMatch) {
      throw new ForbiddenException('Can only message members with whom you have a mutual match');
    }

    const message = await this.messageModel.create({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      message: messageText.trim(),
      status: 'sent',
    });

    return message;
  }
}
