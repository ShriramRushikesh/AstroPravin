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
    enum: ['pending_profile', 'pending_verification', 'verified', 'active', 'suspended', 'deleted'],
    default: 'pending_profile',
    index: true,
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  createdByAdmin: Types.ObjectId;

  @Prop({ default: Date.now })
  membershipPaidAt: Date;

  @Prop({ default: 0 })
  membershipAmount: number;

  @Prop({ type: String, enum: ['cash', 'online'], default: 'cash' })
  membershipMode: string;

  @Prop()
  membershipReceiptNumber: string;

  @Prop()
  lastLoginAt: Date;
}

export const MatrimonyUserSchema = SchemaFactory.createForClass(MatrimonyUser);
MatrimonyUserSchema.index({ status: 1, tier: 1 });
