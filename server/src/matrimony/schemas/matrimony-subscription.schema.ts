import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonySubscriptionDocument = MatrimonySubscription & Document;

@Schema({ collection: 'matrimony_subscriptions', timestamps: true })
export class MatrimonySubscription {
  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['basic', 'premium'], default: 'basic', index: true })
  tier: string;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ type: String, enum: ['cash', 'online'], default: 'cash' })
  paymentMode: string;

  @Prop()
  receiptNumber: string;

  @Prop({ default: Date.now })
  validFrom: Date;

  @Prop()
  validTill: Date;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  grantedByAdmin: Types.ObjectId;

  @Prop()
  notes: string;
}

export const MatrimonySubscriptionSchema = SchemaFactory.createForClass(MatrimonySubscription);
MatrimonySubscriptionSchema.index({ userId: 1, validTill: 1 });
