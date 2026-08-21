import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { extname } from 'path';
import { MatrimonyProfile, MatrimonyProfileDocument, VerificationStatus } from './schemas/matrimony-profile.schema';
import { MatrimonyPhoto, MatrimonyPhotoDocument } from './schemas/matrimony-photo.schema';
import { MatrimonyProfileView, MatrimonyProfileViewDocument } from './schemas/matrimony-profile-view.schema';
import { MatrimonyAuditLog, MatrimonyAuditLogDocument, AuditAction } from './schemas/matrimony-audit-log.schema';
import { MatrimonyUserStateService } from './matrimony-user-state.service';
import { CreateMatrimonyProfileDto, UpdateMatrimonyProfileDto, SearchProfilesDto } from './dto/matrimony-profile.dto';

const ALLOWED_PHOTO_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

@Injectable()
export class MatrimonyProfileService {
  constructor(
    @InjectModel(MatrimonyProfile.name)
    private readonly profileModel: Model<MatrimonyProfileDocument>,
    @InjectModel(MatrimonyPhoto.name)
    private readonly photoModel: Model<MatrimonyPhotoDocument>,
    @InjectModel(MatrimonyProfileView.name)
    private readonly viewModel: Model<MatrimonyProfileViewDocument>,
    @InjectModel(MatrimonyAuditLog.name)
    private readonly auditModel: Model<MatrimonyAuditLogDocument>,
    private readonly stateService: MatrimonyUserStateService,
  ) {}

  // ── Self: Get own profile ─────────────────────────────────────────────────
  async getMyProfile(userId: string) {
    const profile = await this.profileModel.findOne({ user_id: userId }).lean();
    if (!profile) return null;
    const photos = await this.photoModel.find({ profile_id: String(profile._id), is_approved: true }).lean();
    return { ...profile, photos };
  }

  // ── Self: Create or update own profile ───────────────────────────────────
  async upsertMyProfile(userId: string, userCode: string, dto: CreateMatrimonyProfileDto | UpdateMatrimonyProfileDto) {
    let profile = await this.profileModel.findOne({ user_id: userId });

    if (profile) {
      Object.assign(profile, dto);
      profile.age = this.calculateAge(dto.date_of_birth ?? profile.date_of_birth);
      profile.profile_completeness = 0; // Will recompute after save
      await profile.save();
    } else {
      profile = await this.profileModel.create({
        ...dto,
        user_id: userId,
        code: userCode,
        age: this.calculateAge(dto.date_of_birth),
        verification_status: VerificationStatus.PENDING,
        isApproved: false,
        profile_completeness: 0,
      });
    }

    // Recompute completeness
    const state = await this.stateService.resolveState(userId);
    await this.profileModel.findByIdAndUpdate(profile._id, {
      profile_completeness: state.completeness,
    });

    return this.getMyProfile(userId);
  }

  // ── Self: State resolver ──────────────────────────────────────────────────
  async getMyState(userId: string) {
    return this.stateService.resolveState(userId);
  }

  // ── Browse/Search ─────────────────────────────────────────────────────────
  async searchProfiles(dto: SearchProfilesDto, viewerProfileId?: string) {
    const query: Record<string, any> = {
      verification_status: VerificationStatus.VERIFIED,
      isApproved: true,
      is_deleted: false,
      is_suspended: false,
    };

    if (dto.gender) query.gender = dto.gender;
    if (dto.religion) query.religion = new RegExp(dto.religion, 'i');
    if (dto.caste) query.caste = new RegExp(dto.caste, 'i');
    if (dto.city) query.city = new RegExp(dto.city, 'i');
    if (dto.state) query.state = new RegExp(dto.state, 'i');
    if (dto.marital_status) query.marital_status = dto.marital_status;
    if (dto.min_age || dto.max_age) {
      query.age = {};
      if (dto.min_age) query.age.$gte = dto.min_age;
      if (dto.max_age) query.age.$lte = dto.max_age;
    }

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([
      this.profileModel
        .find(query)
        .select('-contact_phone -contact_email -whatsapp_phone -user_id') // Hide contact fields in search list
        .sort({ boosted_until: -1, profile_completeness: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.profileModel.countDocuments(query),
    ]);

    // Track profile views asynchronously (non-blocking)
    if (viewerProfileId) {
      profiles.forEach(p => {
        this.viewModel.findOneAndUpdate(
          { viewed_profile_id: String(p._id), viewer_profile_id: viewerProfileId },
          { $set: { viewed_at: new Date() } },
          { upsert: true },
        ).catch(() => {});
      });
    }

    const withPhotos = await Promise.all(
      profiles.map(async p => {
        const primaryPhoto = await this.photoModel
          .findOne({ profile_id: String(p._id), is_primary: true, is_approved: true })
          .lean();
        return { ...p, primary_photo: primaryPhoto?.file_path ?? null };
      }),
    );

    return { profiles: withPhotos, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // ── Public: Get profile by code ───────────────────────────────────────────
  async getProfileByCode(code: string, viewerProfileId?: string, viewerTier?: string) {
    const profile = await this.profileModel
      .findOne({ code: code.toUpperCase(), is_deleted: false })
      .lean();

    if (!profile) throw new NotFoundException(`Profile ${code} not found`);
    if (!profile.isApproved) throw new NotFoundException(`Profile not available`);

    // Track view
    if (viewerProfileId && viewerProfileId !== String(profile._id)) {
      this.viewModel.findOneAndUpdate(
        { viewed_profile_id: String(profile._id), viewer_profile_id: viewerProfileId },
        { $set: { viewed_at: new Date() } },
        { upsert: true },
      ).catch(() => {});
    }

    // Photos — filter by plan tier
    const photoQuery: Record<string, any> = {
      profile_id: String(profile._id),
      is_approved: true,
    };
    // Free tier: only public photos
    if (!viewerTier || viewerTier === 'free') {
      photoQuery.privacy = 'public';
    }
    const photos = await this.photoModel.find(photoQuery).lean();

    // Hide contact details for non-silver+ plans
    const canSeeContact = viewerTier && viewerTier !== 'free';
    const safeProfile: any = { ...profile };
    if (!canSeeContact) {
      delete safeProfile.contact_phone;
      delete safeProfile.contact_email;
      delete safeProfile.whatsapp_phone;
    }

    return { ...safeProfile, photos };
  }

  // ── Who viewed my profile ─────────────────────────────────────────────────
  async getProfileViewers(profileId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [views, total] = await Promise.all([
      this.viewModel
        .find({ viewed_profile_id: profileId })
        .sort({ viewed_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.viewModel.countDocuments({ viewed_profile_id: profileId }),
    ]);
    return { views, total, page, limit };
  }

  // ── Admin: Get all profiles (backward compat with existing admin UI) ────────
  async adminGetAllProfiles(filter?: string) {
    const query: Record<string, any> = { is_deleted: false };
    if (filter === 'pending') query.isApproved = false;
    if (filter === 'approved') query.isApproved = true;

    const profiles = await this.profileModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Attach primary photo path to each
    const withPhotos = await Promise.all(
      profiles.map(async p => {
        const photo = await this.photoModel
          .findOne({ profile_id: String(p._id), is_primary: true })
          .lean();
        return { ...p, photo: photo?.file_path ?? null };
      }),
    );
    return withPhotos;
  }

  // ── Admin: Update profile (backward compat PUT /profiles/:id) ─────────────
  async adminUpdateProfile(profileId: string, updates: any) {
    const profile = await this.profileModel.findByIdAndUpdate(profileId, updates, { new: true }).lean();
    if (!profile) throw new NotFoundException(`Profile ${profileId} not found`);
    return profile;
  }

  // ── Admin: Set approval status (backward compat PUT /profiles/:id/status) ──
  async adminSetStatus(profileId: string, isApproved: boolean, actor: string) {
    const profile = await this.profileModel.findById(profileId);
    if (!profile) throw new NotFoundException();

    profile.isApproved = isApproved;
    profile.verification_status = isApproved ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;
    await profile.save();

    await this.auditModel.create({
      actor,
      action: isApproved ? AuditAction.PROFILE_APPROVED : AuditAction.PROFILE_REJECTED,
      target: profile.code,
      meta: { profileId },
    });

    return profile;
  }

  // ── Admin: Delete profile ─────────────────────────────────────────────────
  async adminDeleteProfile(profileId: string, actor: string) {
    const profile = await this.profileModel.findById(profileId);
    if (!profile) throw new NotFoundException();

    profile.is_deleted = true;
    await profile.save();

    await this.auditModel.create({
      actor,
      action: AuditAction.PROFILE_DELETED,
      target: profile.code,
    });

    return { success: true };
  }

  // ── Photo upload ──────────────────────────────────────────────────────────
  async addPhoto(
    profileId: string,
    file: Express.Multer.File,
    isPrimary: boolean,
    privacy: string,
    actor: string,
  ) {
    // Server-side MIME validation — never trust client MIME type
    const detectedExt = extname(file.originalname).toLowerCase();
    if (!ALLOWED_PHOTO_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Only JPG, PNG, and WebP images are accepted');
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      throw new BadRequestException('Photo must be under 5MB');
    }

    // If setting as primary, unset other primary photos
    if (isPrimary) {
      await this.photoModel.updateMany({ profile_id: profileId }, { is_primary: false });
    }

    const photo = await this.photoModel.create({
      profile_id: profileId,
      file_path: `/public/matrimony-photos/${file.filename}`,
      original_name: file.originalname,
      mime_type: file.mimetype,
      size_bytes: file.size,
      is_primary: isPrimary,
      privacy: (privacy as any) ?? 'members_only',
      is_approved: false, // Requires admin approval
    });

    return photo;
  }

  // ── Admin: Approve/reject photo ───────────────────────────────────────────
  async adminApprovePhoto(photoId: string, approved: boolean, reason: string | null, actor: string) {
    const photo = await this.photoModel.findByIdAndUpdate(
      photoId,
      { is_approved: approved, rejection_reason: approved ? null : reason },
      { new: true },
    ).lean();

    if (!photo) throw new NotFoundException();

    await this.auditModel.create({
      actor,
      action: approved ? AuditAction.PHOTO_APPROVED : AuditAction.PHOTO_REJECTED,
      target: photoId,
      meta: { reason },
    });

    return photo;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private calculateAge(dobString: string): number {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }
}
