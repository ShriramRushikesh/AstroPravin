import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonyUserDocument = MatrimonyUser & Document;

export enum MatrimonyUserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  STAFF = 'staff',
}

@Schema({ collection: 'matrimony_users', timestamps: true })
export class MatrimonyUser {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: true })
  isFirstLogin: boolean;

  @Prop({ type: String, enum: ['basic', 'silver', 'gold', 'platinum', 'premium'], default: 'basic', index: true })
  tier: string;

  @Prop({
    type: String,
    enum: ['pending_payment', 'pending_profile', 'pending_verification', 'verified', 'active', 'suspended', 'deleted'],
    default: 'pending_payment',
    index: true,
  })
  status: string;

  @Prop()
  fullName: string;

  @Prop({ index: true })
  phone: string;

  @Prop()
  email: string;

  @Prop({ default: false })
  isSelfRegistered: boolean;

  @Prop({ type: String, enum: ['unpaid', 'submitted', 'verified'], default: 'unpaid', index: true })
  paymentStatus: string;

  @Prop({ type: Object, default: {} })
  paymentDetails: {
    amount?: number;
    transactionId?: string;
    orderId?: string;
    paymentId?: string;
    paymentMode?: string;
    planId?: string;
    planName?: string;
    submittedAt?: Date;
    verifiedAt?: Date;
    notes?: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  createdByAdmin: Types.ObjectId;

  @Prop({ required: false })
  membershipPaidAt?: Date;

  @Prop({ required: false })
  membershipExpiresAt?: Date;

  @Prop({ required: false })
  membershipPlanId?: string;

  @Prop()
  membershipPlanDuration: string;

  @Prop({ default: 299 })
  membershipAmount: number;

  @Prop({ type: String, default: 'razorpay' })
  membershipMode: string;

  @Prop()
  membershipReceiptNumber: string;

  @Prop()
  lastLoginAt: Date;
}

export const MatrimonyUserSchema = SchemaFactory.createForClass(MatrimonyUser);
MatrimonyUserSchema.index({ status: 1, tier: 1 });
MatrimonyUserSchema.index({ phone: 1 });
