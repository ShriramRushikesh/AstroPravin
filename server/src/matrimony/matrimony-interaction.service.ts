import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatrimonyInterest, MatrimonyInterestDocument, InterestStatus } from './schemas/matrimony-interest.schema';
import { MatrimonyShortlist, MatrimonyShortlistDocument } from './schemas/matrimony-shortlist.schema';
import { MatrimonyMessage, MatrimonyMessageDocument } from './schemas/matrimony-message.schema';
import { MatrimonySubscription, MatrimonySubscriptionDocument, PlanTier, PLAN_LIMITS } from './schemas/matrimony-subscription.schema';
import { MatrimonyProfile, MatrimonyProfileDocument } from './schemas/matrimony-profile.schema';
import { MatrimonyPhoto, MatrimonyPhotoDocument } from './schemas/matrimony-photo.schema';
import { MatrimonyAuditLog, MatrimonyAuditLogDocument, AuditAction } from './schemas/matrimony-audit-log.schema';
import { SendInterestDto, RespondInterestDto, SendMessageDto, AssignSubscriptionDto } from './dto/matrimony-interaction.dto';

@Injectable()
export class MatrimonyInteractionService {
  constructor(
    @InjectModel(MatrimonyInterest.name) private readonly interestModel: Model<MatrimonyInterestDocument>,
    @InjectModel(MatrimonyShortlist.name) private readonly shortlistModel: Model<MatrimonyShortlistDocument>,
    @InjectModel(MatrimonyMessage.name) private readonly messageModel: Model<MatrimonyMessageDocument>,
    @InjectModel(MatrimonySubscription.name) private readonly subscriptionModel: Model<MatrimonySubscriptionDocument>,
    @InjectModel(MatrimonyProfile.name) private readonly profileModel: Model<MatrimonyProfileDocument>,
    @InjectModel(MatrimonyPhoto.name) private readonly photoModel: Model<MatrimonyPhotoDocument>,
    @InjectModel(MatrimonyAuditLog.name) private readonly auditModel: Model<MatrimonyAuditLogDocument>,
  ) {}

  // ── Interest System ───────────────────────────────────────────────────────

  async sendInterest(fromProfileId: string, dto: SendInterestDto) {
    if (fromProfileId === dto.to_profile_id) {
      throw new BadRequestException('You cannot send an interest request to yourself');
    }

    const targetProfile = await this.profileModel.findById(dto.to_profile_id).lean();
    if (!targetProfile || targetProfile.is_deleted) {
      throw new NotFoundException('Target profile not found');
    }

    // Check existing interest
    const existing = await this.interestModel.findOne({
      $or: [
        { from_profile_id: fromProfileId, to_profile_id: dto.to_profile_id },
        { from_profile_id: dto.to_profile_id, to_profile_id: fromProfileId },
      ],
    });

    if (existing) {
      throw new BadRequestException(
        existing.status === InterestStatus.ACCEPTED
          ? 'Interest already accepted between these profiles'
          : 'An interest request already exists between these profiles',
      );
    }

    // Check daily interest limit
    const activeSub = await this.subscriptionModel.findOne({ profile_id: fromProfileId, is_active: true }).lean();
    const tier = activeSub && activeSub.end_date > new Date() ? activeSub.plan_tier : PlanTier.FREE;
    const dailyLimit = PLAN_LIMITS[tier].interests_per_day;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await this.interestModel.countDocuments({
      from_profile_id: fromProfileId,
      createdAt: { $gte: startOfDay },
    });

    if (todayCount >= dailyLimit) {
      throw new ForbiddenException(
        `Daily interest limit reached (${dailyLimit}/day for ${tier.toUpperCase()} tier). Upgrade your plan to send more.`,
      );
    }

    const interest = await this.interestModel.create({
      from_profile_id: fromProfileId,
      to_profile_id: dto.to_profile_id,
      message: dto.message ?? null,
      status: InterestStatus.PENDING,
    });

    return interest;
  }

  async respondInterest(interestId: string, responderProfileId: string, dto: RespondInterestDto) {
    const interest = await this.interestModel.findById(interestId);
    if (!interest) throw new NotFoundException('Interest request not found');

    if (interest.to_profile_id !== responderProfileId) {
      throw new ForbiddenException('Only the receiver can respond to this interest request');
    }

    interest.status = dto.status;
    interest.responded_at = new Date();
    await interest.save();

    return interest;
  }

  async getInterests(profileId: string, type: 'received' | 'sent' | 'accepted') {
    let query: Record<string, any> = {};

    if (type === 'received') {
      query = { to_profile_id: profileId, status: InterestStatus.PENDING };
    } else if (type === 'sent') {
      query = { from_profile_id: profileId, status: InterestStatus.PENDING };
    } else if (type === 'accepted') {
      query = {
        $or: [{ from_profile_id: profileId }, { to_profile_id: profileId }],
        status: InterestStatus.ACCEPTED,
      };
    }

    const interests = await this.interestModel.find(query).sort({ createdAt: -1 }).lean();

    // Attach target profile summaries
    const populated = await Promise.all(
      interests.map(async item => {
        const otherId = item.from_profile_id === profileId ? item.to_profile_id : item.from_profile_id;
        const profileSummary = await this.getProfileSummary(otherId);
        return {
          ...item,
          other_profile: profileSummary,
        };
      }),
    );

    return populated;
  }

  // ── Shortlist System ──────────────────────────────────────────────────────

  async toggleShortlist(ownerProfileId: string, targetProfileId: string) {
    if (ownerProfileId === targetProfileId) {
      throw new BadRequestException('You cannot shortlist your own profile');
    }

    const existing = await this.shortlistModel.findOne({
      owner_profile_id: ownerProfileId,
      target_profile_id: targetProfileId,
    });

    if (existing) {
      await this.shortlistModel.findByIdAndDelete(existing._id);
      return { shortlisted: false, message: 'Profile removed from shortlist' };
    } else {
      await this.shortlistModel.create({
        owner_profile_id: ownerProfileId,
        target_profile_id: targetProfileId,
      });
      return { shortlisted: true, message: 'Profile added to shortlist' };
    }
  }

  async getShortlist(ownerProfileId: string) {
    const list = await this.shortlistModel.find({ owner_profile_id: ownerProfileId }).sort({ createdAt: -1 }).lean();
    const populated = await Promise.all(
      list.map(async item => {
        const profile = await this.getProfileSummary(item.target_profile_id);
        return {
          shortlist_id: item._id,
          shortlisted_at: (item as any).createdAt,
          profile,
        };
      }),
    );
    return populated;
  }

  // ── Chat / Messaging System ───────────────────────────────────────────────

  async sendMessage(senderProfileId: string, dto: SendMessageDto) {
    if (senderProfileId === dto.receiver_profile_id) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    // 1. Check mutual interest status
    const mutualInterest = await this.interestModel.findOne({
      $or: [
        { from_profile_id: senderProfileId, to_profile_id: dto.receiver_profile_id },
        { from_profile_id: dto.receiver_profile_id, to_profile_id: senderProfileId },
      ],
      status: InterestStatus.ACCEPTED,
    });

    if (!mutualInterest) {
      throw new ForbiddenException('Chat is only available after mutual interest is accepted');
    }

    // 2. Check plan tier chat permission
    const activeSub = await this.subscriptionModel.findOne({ profile_id: senderProfileId, is_active: true }).lean();
    const tier = activeSub && activeSub.end_date > new Date() ? activeSub.plan_tier : PlanTier.FREE;
    if (!PLAN_LIMITS[tier].chat_enabled) {
      throw new ForbiddenException('Chat requires a paid plan (Silver, Gold, or Platinum). Upgrade to start chatting.');
    }

    const conversationId = [senderProfileId, dto.receiver_profile_id].sort().join('_');

    const message = await this.messageModel.create({
      conversation_id: conversationId,
      sender_profile_id: senderProfileId,
      receiver_profile_id: dto.receiver_profile_id,
      text: dto.text,
      is_read: false,
    });

    return message;
  }

  async getMessages(profileIdA: string, profileIdB: string, page = 1, limit = 50) {
    const conversationId = [profileIdA, profileIdB].sort().join('_');
    const skip = (page - 1) * limit;

    // Mark unread messages sent to profileIdA as read
    await this.messageModel.updateMany(
      { conversation_id: conversationId, receiver_profile_id: profileIdA, is_read: false },
      { is_read: true, read_at: new Date() },
    );

    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ conversation_id: conversationId, is_deleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.messageModel.countDocuments({ conversation_id: conversationId, is_deleted: false }),
    ]);

    return { messages: messages.reverse(), total, page, limit };
  }

  async getConversations(profileId: string) {
    // Accepted interests define available conversations
    const acceptedInterests = await this.interestModel
      .find({
        $or: [{ from_profile_id: profileId }, { to_profile_id: profileId }],
        status: InterestStatus.ACCEPTED,
      })
      .lean();

    const conversations = await Promise.all(
      acceptedInterests.map(async item => {
        const partnerId = item.from_profile_id === profileId ? item.to_profile_id : item.from_profile_id;
        const conversationId = [profileId, partnerId].sort().join('_');

        const [lastMsg, unreadCount, partnerSummary] = await Promise.all([
          this.messageModel.findOne({ conversation_id: conversationId, is_deleted: false }).sort({ createdAt: -1 }).lean(),
          this.messageModel.countDocuments({ conversation_id: conversationId, receiver_profile_id: profileId, is_read: false }),
          this.getProfileSummary(partnerId),
        ]);

        return {
          conversation_id: conversationId,
          partner: partnerSummary,
          last_message: lastMsg ? { text: lastMsg.text, sent_at: (lastMsg as any).createdAt, sender: lastMsg.sender_profile_id } : null,
          unread_count: unreadCount,
        };
      }),
    );

    return conversations.sort((a, b) => {
      const timeA = a.last_message ? new Date(a.last_message.sent_at).getTime() : 0;
      const timeB = b.last_message ? new Date(b.last_message.sent_at).getTime() : 0;
      return timeB - timeA;
    });
  }

  // ── Subscription Management ───────────────────────────────────────────────

  async assignSubscription(dto: AssignSubscriptionDto, adminUsername: string) {
    const startDate = new Date();
    const endDate = new Date(Date.now() + dto.duration_days * 24 * 60 * 60 * 1000);

    // Deactivate prior active subscriptions
    await this.subscriptionModel.updateMany(
      { profile_id: dto.profile_id, is_active: true },
      { is_active: false },
    );

    const subscription = await this.subscriptionModel.create({
      user_id: dto.user_id,
      profile_id: dto.profile_id,
      plan_tier: dto.plan_tier,
      start_date: startDate,
      end_date: endDate,
      is_active: true,
      amount_paid: dto.amount_paid ?? 0,
      payment_method: dto.payment_method ?? 'manual',
      payment_reference: dto.payment_reference ?? null,
      activated_by: adminUsername,
    });

    await this.auditModel.create({
      actor: adminUsername,
      action: AuditAction.PLAN_ASSIGNED,
      target: dto.profile_id,
      meta: { plan_tier: dto.plan_tier, duration_days: dto.duration_days, amount: dto.amount_paid },
    });

    return subscription;
  }

  // ── Helper ────────────────────────────────────────────────────────────────

  private async getProfileSummary(profileId: string) {
    const profile = await this.profileModel
      .findById(profileId)
      .select('code full_name gender age city state religion caste marital_status education.occupation')
      .lean();

    if (!profile) return null;

    const primaryPhoto = await this.photoModel
      .findOne({ profile_id: profileId, is_primary: true, is_approved: true })
      .select('file_path')
      .lean();

    return {
      ...profile,
      primary_photo: primaryPhoto?.file_path ?? null,
    };
  }
}
