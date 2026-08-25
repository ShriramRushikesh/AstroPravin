import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatrimonyUser, MatrimonyUserDocument } from '../schemas/matrimony-user.schema';
import { MatrimonyProfile, MatrimonyProfileDocument } from '../schemas/matrimony-profile.schema';
import { CreateMatrimonyOrderDto, VerifyMatrimonyPaymentDto } from './dto/payment.dto';
import * as crypto from 'crypto';

// Dynamic import or require for Razorpay
let RazorpayConstructor: any = null;
try {
  const RazorpayModule = require('razorpay');
  RazorpayConstructor = RazorpayModule.default || RazorpayModule;
} catch (e) {
  console.warn('⚠️ Razorpay package not found:', e);
}

export interface MatrimonyPlan {
  id: 'silver' | 'gold' | 'platinum';
  tier: 'silver' | 'gold' | 'platinum';
  name: string;
  tagline: string;
  amount: number;
  originalAmount: number;
  discountPercent: number;
  durationText: string;
  durationDays: number; // 0 means lifetime / until marriage
  badge?: string;
  popular?: boolean;
  vip?: boolean;
  features: string[];
}

export const MATRIMONY_PLANS: Record<string, MatrimonyPlan> = {
  silver: {
    id: 'silver',
    tier: 'silver',
    name: 'Silver Plan',
    tagline: 'Standard 3-Month Access',
    amount: 299,
    originalAmount: 599,
    discountPercent: 50,
    durationText: '3 Months Access',
    durationDays: 90,
    badge: 'Standard',
    popular: false,
    features: [
      '3 Months Full Platform Access',
      'Verified Candidate Search & Filters',
      'Ashta Koota 36-Guna Kundli Matchmaking',
      'Send Unlimited Express Interests',
      'Direct Chat with Mutual Matches',
      'Verified Phone & Photo Privacy Protection',
    ],
  },
  gold: {
    id: 'gold',
    tier: 'gold',
    name: 'Gold Plan',
    tagline: 'Most Popular for Serious Matchseekers',
    amount: 499,
    originalAmount: 1199,
    discountPercent: 58,
    durationText: '6 Months Access',
    durationDays: 180,
    badge: 'Most Popular',
    popular: true,
    features: [
      'Everything in Silver Plan',
      '6 Months Extended Membership',
      'Highlighted Gold Profile Badge',
      'Priority Higher Ranking in Search Results',
      'Direct Kundli Alignment Analysis',
      'Instant Notifications & Priority Verification',
    ],
  },
  platinum: {
    id: 'platinum',
    tier: 'platinum',
    name: 'Platinum VIP (Lifetime)',
    tagline: 'One-Time Payment • Valid Until Marriage',
    amount: 999,
    originalAmount: 2499,
    discountPercent: 60,
    durationText: 'Valid Until Marriage (Lifetime)',
    durationDays: 0, // Lifetime
    badge: 'Best Value • One-Time',
    popular: false,
    vip: true,
    features: [
      'One-Time Payment • Zero Recurring Renewals',
      'Valid Until You Find Your Life Partner',
      'Exclusive Platinum VIP Crown Profile Badge',
      'Top Priority Placement to Prospective Matches',
      'Direct Consultation Guidance with Pandit Pravin Shriram',
      'Comprehensive Horoscope & Mangal Dosha Review',
    ],
  },
};

@Injectable()
export class MatrimonyPaymentService {
  private razorpayInstance: any;

  constructor(
    @InjectModel(MatrimonyUser.name) private userModel: Model<MatrimonyUserDocument>,
    @InjectModel(MatrimonyProfile.name) private profileModel: Model<MatrimonyProfileDocument>,
  ) {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    try {
      if (RazorpayConstructor && keyId && keySecret) {
        this.razorpayInstance = new RazorpayConstructor({
          key_id: keyId,
          key_secret: keySecret,
        });
      }
    } catch (e: any) {
      console.warn('⚠️ Razorpay initialization warning:', e?.message || e);
    }
  }

  getPlans() {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    return {
      success: true,
      keyId,
      currency: 'INR',
      plans: Object.values(MATRIMONY_PLANS),
    };
  }

  async createOrder(userId: string, createOrderDto: CreateMatrimonyOrderDto) {
    const { planId } = createOrderDto;
    const plan = MATRIMONY_PLANS[planId];

    if (!plan) {
      throw new BadRequestException('Invalid matrimony plan selected.');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User account not found.');
    }

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!keyId || !keySecret) {
      console.error('❌ Razorpay credentials missing in process.env: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET');
      throw new BadRequestException('Payment gateway credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are not set in the server environment.');
    }

    try {
      this.razorpayInstance = new RazorpayConstructor({
        key_id: keyId,
        key_secret: keySecret,
      });
    } catch (e: any) {
      console.error('❌ Razorpay client init error:', e?.message || e);
      throw new BadRequestException('Payment gateway initialization failed.');
    }

    const amountInPaise = plan.amount * 100;
    const shortUserId = user._id.toString().slice(-6);
    const shortTs = Date.now().toString().slice(-6);
    const receipt = `rcpt_mat_${shortUserId}_${shortTs}`;

    try {
      const order = await this.razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          userId: user._id.toString(),
          username: user.username,
          phone: user.phone || '',
          planId: plan.id,
          planName: plan.name,
          durationDays: plan.durationDays,
        },
      });

      return {
        success: true,
        orderId: order.id,
        amount: plan.amount,
        amountInPaise,
        currency: 'INR',
        keyId,
        plan,
        user: {
          name: user.fullName || user.username,
          phone: user.phone,
          email: user.email,
        },
      };
    } catch (error: any) {
      console.error('❌ Razorpay order creation failed:', error?.error || error);
      throw new BadRequestException(error?.error?.description || error?.message || 'Could not initiate Razorpay order. Please try again.');
    }
  }

  async verifyPayment(userId: string, verifyDto: VerifyMatrimonyPaymentDto) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = verifyDto;
    const plan = MATRIMONY_PLANS[planId];

    if (!plan) {
      throw new BadRequestException('Invalid plan ID for verification.');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User account not found.');
    }

    // Anti-Replay: Check if this payment_id has already been claimed by another user
    const duplicatePayment = await this.userModel.findOne({
      $or: [
        { membershipReceiptNumber: razorpay_payment_id },
        { 'paymentDetails.paymentId': razorpay_payment_id },
      ],
      _id: { $ne: user._id },
    });

    if (duplicatePayment) {
      throw new BadRequestException('This payment reference has already been processed for another candidate.');
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    // Cryptographic HMAC SHA256 signature verification (Timing-Safe)
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const genBuf = Buffer.from(generatedSignature, 'utf-8');
    const recBuf = Buffer.from(razorpay_signature, 'utf-8');

    const isValidSignature = genBuf.length === recBuf.length && crypto.timingSafeEqual(genBuf, recBuf);

    if (!isValidSignature) {
      console.error('❌ Razorpay signature mismatch!', {
        received: razorpay_signature,
        generated: generatedSignature,
      });
      throw new BadRequestException('Payment verification failed: invalid signature.');
    }

    // Determine expiration date
    let expiresAt: Date | undefined = undefined;
    if (plan.durationDays > 0) {
      expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
    }

    // Upgrade user status and plan
    user.tier = plan.tier;
    user.paymentStatus = 'verified';
    if (user.status === 'pending_payment' || user.status === 'pending_payment_verification') {
      user.status = 'active';
    }
    user.membershipPaidAt = new Date();
    if (expiresAt) user.membershipExpiresAt = expiresAt;
    user.membershipPlanId = plan.id;
    user.membershipPlanDuration = plan.durationText;
    user.membershipAmount = plan.amount;
    user.membershipMode = 'razorpay';
    user.membershipReceiptNumber = razorpay_payment_id;

    user.paymentDetails = {
      amount: plan.amount,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      transactionId: razorpay_payment_id,
      paymentMode: 'razorpay',
      planId: plan.id,
      planName: plan.name,
      verifiedAt: new Date(),
      notes: `Online automated Razorpay payment for ${plan.name}`,
    };

    user.markModified('paymentDetails');
    await user.save();

    // Fetch updated profile if available
    const profile = await this.profileModel.findOne({ userId: user._id });

    return {
      success: true,
      message: `Congratulations! Your ${plan.name} has been activated successfully.`,
      plan,
      user: {
        userId: user._id,
        username: user.username,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        tier: user.tier,
        status: user.status,
        paymentStatus: user.paymentStatus,
        membershipPaidAt: user.membershipPaidAt,
        membershipExpiresAt: user.membershipExpiresAt,
        membershipPlanId: user.membershipPlanId,
        membershipPlanDuration: user.membershipPlanDuration,
        membershipAmount: user.membershipAmount,
        membershipReceiptNumber: user.membershipReceiptNumber,
      },
      profile,
    };
  }

  async handleWebhook(rawBody: any, signature?: string) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || '';

    // Verify webhook signature if present
    if (signature) {
      try {
        const bodyString = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(bodyString)
          .digest('hex');

        const expBuf = Buffer.from(expectedSignature, 'utf-8');
        const recBuf = Buffer.from(signature, 'utf-8');

        if (expBuf.length === recBuf.length && !crypto.timingSafeEqual(expBuf, recBuf)) {
          console.warn('⚠️ Razorpay webhook signature mismatch notice');
        }
      } catch (err: any) {
        console.warn('⚠️ Webhook signature validation notice:', err?.message);
      }
    }

    const event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    const eventType = event?.event;

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event?.payload?.payment?.entity;
      const orderEntity = event?.payload?.order?.entity;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};

      const userId = notes?.userId;
      const planId = (notes?.planId || 'silver') as 'silver' | 'gold' | 'platinum';
      const plan = MATRIMONY_PLANS[planId] || MATRIMONY_PLANS.silver;

      let user: MatrimonyUserDocument | null = null;
      if (userId) {
        user = await this.userModel.findById(userId);
      } else if (notes?.username) {
        user = await this.userModel.findOne({ username: notes.username });
      } else if (paymentEntity?.email) {
        user = await this.userModel.findOne({ email: paymentEntity.email.toLowerCase() });
      } else if (paymentEntity?.contact) {
        user = await this.userModel.findOne({ phone: paymentEntity.contact.replace(/\D/g, '') });
      }

      if (user && user.paymentStatus !== 'verified') {
        let expiresAt: Date | undefined = undefined;
        if (plan.durationDays > 0) {
          expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
        }

        user.tier = plan.tier;
        user.paymentStatus = 'verified';
        if (user.status === 'pending_payment' || user.status === 'pending_payment_verification') {
          user.status = 'active';
        }
        user.membershipPaidAt = new Date();
        if (expiresAt) user.membershipExpiresAt = expiresAt;
        user.membershipPlanId = plan.id;
        user.membershipPlanDuration = plan.durationText;
        user.membershipAmount = plan.amount;
        user.membershipMode = 'razorpay';
        user.membershipReceiptNumber = paymentEntity?.id || orderEntity?.id;

        user.paymentDetails = {
          amount: plan.amount,
          orderId: orderEntity?.id || paymentEntity?.order_id,
          paymentId: paymentEntity?.id,
          transactionId: paymentEntity?.id,
          paymentMode: 'razorpay_webhook',
          planId: plan.id,
          planName: plan.name,
          verifiedAt: new Date(),
          notes: `Automated server-to-server Razorpay webhook reconciliation for ${plan.name}`,
        };

        user.markModified('paymentDetails');
        await user.save();
        console.log(`✅ [Razorpay Webhook] Successfully auto-activated user: ${user.username} for ${plan.name}`);
      }
    }

    return { status: 'ok', message: 'Webhook processed successfully' };
  }
}

