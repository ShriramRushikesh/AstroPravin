import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatrimonyProfile, MatrimonyProfileDocument, VerificationStatus } from './schemas/matrimony-profile.schema';
import { MatrimonySubscription, MatrimonySubscriptionDocument, PlanTier, PLAN_LIMITS } from './schemas/matrimony-subscription.schema';
import { MatrimonyUser, MatrimonyUserDocument } from './schemas/matrimony-user.schema';

export interface UserState {
  /** 0-100 percentage */
  completeness: number;
  /** pending | verified | rejected */
  verification_status: VerificationStatus;
  /** free | silver | gold | platinum */
  tier: PlanTier;
  /** Role of the account */
  role: string;
  /** profile_for context — affects UI copy */
  profile_for: string | null;
  /** Whether must complete profile wizard before browsing */
  show_completion_wizard: boolean;
  /** Feature flags derived from plan tier */
  features: typeof PLAN_LIMITS[PlanTier.FREE];
  /** UI banner message — shown if verification is pending/rejected */
  banner: string | null;
  /** Is account suspended */
  is_suspended: boolean;
  /** Has an active subscription */
  has_active_subscription: boolean;
  /** When current subscription expires */
  subscription_expires_at: Date | null;
}

@Injectable()
export class MatrimonyUserStateService {
  constructor(
    @InjectModel(MatrimonyProfile.name)
    private readonly profileModel: Model<MatrimonyProfileDocument>,
    @InjectModel(MatrimonySubscription.name)
    private readonly subscriptionModel: Model<MatrimonySubscriptionDocument>,
    @InjectModel(MatrimonyUser.name)
    private readonly userModel: Model<MatrimonyUserDocument>,
  ) {}

  /**
   * Computes the current state of a matrimony user.
   * This single object drives all conditional UI rendering — the frontend
   * renders off this rather than hardcoded per-user logic.
   */
  async resolveState(userId: string): Promise<UserState> {
    const [user, profile, subscription] = await Promise.all([
      this.userModel.findById(userId).lean(),
      this.profileModel.findOne({ user_id: userId }).lean(),
      this.subscriptionModel.findOne({ user_id: userId, is_active: true }).lean(),
    ]);

    // Determine active plan tier
    const now = new Date();
    const tier: PlanTier = subscription && subscription.end_date > now
      ? subscription.plan_tier
      : PlanTier.FREE;

    const features = PLAN_LIMITS[tier];

    // Profile completeness
    const completeness = profile ? this.computeCompleteness(profile) : 0;

    // Verification status
    const verification_status = profile?.verification_status ?? VerificationStatus.PENDING;

    // Banner message based on state
    const banner = this.resolveBanner(verification_status, completeness, user?.is_active ?? true);

    return {
      completeness,
      verification_status,
      tier,
      role: user?.role ?? 'user',
      profile_for: profile?.profile_for ?? null,
      show_completion_wizard: completeness < 40,
      features,
      banner,
      is_suspended: !(user?.is_active ?? true),
      has_active_subscription: tier !== PlanTier.FREE,
      subscription_expires_at: subscription?.end_date ?? null,
    };
  }

  // ── Completeness calculator ────────────────────────────────────────────────
  /**
   * Weighted scoring across profile sections.
   * Each field group contributes a portion of the 100% total.
   */
  private computeCompleteness(profile: any): number {
    const checks: Array<{ weight: number; filled: boolean }> = [
      // Personal (30%)
      { weight: 5, filled: Boolean(profile.full_name) },
      { weight: 5, filled: Boolean(profile.date_of_birth) },
      { weight: 3, filled: Boolean(profile.height) },
      { weight: 3, filled: Boolean(profile.religion) },
      { weight: 3, filled: Boolean(profile.caste) },
      { weight: 4, filled: Boolean(profile.marital_status) },
      { weight: 4, filled: Boolean(profile.about_me) },
      { weight: 3, filled: Boolean(profile.city) },
      // Education/Career (20%)
      { weight: 5, filled: Boolean(profile.education?.highest_education) },
      { weight: 5, filled: Boolean(profile.education?.occupation) },
      { weight: 5, filled: Boolean(profile.education?.annual_income) },
      { weight: 5, filled: Boolean(profile.education?.employed_in) },
      // Family (20%)
      { weight: 5, filled: Boolean(profile.family?.family_type) },
      { weight: 5, filled: Boolean(profile.family?.father_name) },
      { weight: 5, filled: Boolean(profile.family?.mother_name) },
      { weight: 5, filled: profile.family?.brothers !== undefined },
      // Horoscope (15%)
      { weight: 5, filled: Boolean(profile.horoscope?.rashi) },
      { weight: 5, filled: Boolean(profile.horoscope?.nakshatra) },
      { weight: 5, filled: Boolean(profile.horoscope?.birth_date) },
      // Partner Preferences (10%)
      { weight: 5, filled: Boolean(profile.partner_preferences?.min_age) },
      { weight: 5, filled: Boolean(profile.partner_preferences?.religion) },
      // Contact (5%)
      { weight: 3, filled: Boolean(profile.contact_phone) },
      { weight: 2, filled: Boolean(profile.whatsapp_phone) },
    ];

    const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
    const earnedWeight = checks.filter(c => c.filled).reduce((sum, c) => sum + c.weight, 0);

    return Math.round((earnedWeight / totalWeight) * 100);
  }

  private resolveBanner(
    status: VerificationStatus,
    completeness: number,
    isActive: boolean,
  ): string | null {
    if (!isActive) {
      return '⛔ Your account has been suspended. Please contact our support team.';
    }
    if (status === VerificationStatus.REJECTED) {
      return '❌ Your profile has been rejected by our team. Please update the flagged details and resubmit.';
    }
    if (status === VerificationStatus.PENDING && completeness >= 40) {
      return '⏳ Your profile is under review. You have limited visibility until verified.';
    }
    if (completeness < 40) {
      return '📝 Complete your profile to start receiving matches. You are ' + completeness + '% done.';
    }
    return null;
  }
}
