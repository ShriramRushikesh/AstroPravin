import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonyUserDocument = MatrimonyUser & Document;

@Schema({ collection: 'matrimony_users', timestamps: true })
export class MatrimonyUser {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: true })
  isFirstLogin: boolean;

  @Prop({ type: String, enum: ['basic', 'premium'], default: 'basic', index: true })
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
    paymentMode?: string;
    submittedAt?: Date;
    verifiedAt?: Date;
    notes?: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  createdByAdmin: Types.ObjectId;

  @Prop()
  membershipPaidAt: Date;

  @Prop({ default: 1100 })
  membershipAmount: number;

  @Prop({ type: String, enum: ['cash', 'online', 'upi'], default: 'upi' })
  membershipMode: string;

  @Prop()
  membershipReceiptNumber: string;

  @Prop()
  lastLoginAt: Date;
}

export const MatrimonyUserSchema = SchemaFactory.createForClass(MatrimonyUser);
MatrimonyUserSchema.index({ status: 1, tier: 1 });
MatrimonyUserSchema.index({ phone: 1 });
