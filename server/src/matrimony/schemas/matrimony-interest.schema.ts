import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonyInterestDocument = MatrimonyInterest & Document;

export enum InterestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Schema({ collection: 'matrimony_interests', timestamps: true })
export class MatrimonyInterest {
  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  receiverId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
    index: true,
  })
  status: string;
}

export const MatrimonyInterestSchema = SchemaFactory.createForClass(MatrimonyInterest);
MatrimonyInterestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
MatrimonyInterestSchema.index({ receiverId: 1, status: 1 });
MatrimonyInterestSchema.index({ senderId: 1, createdAt: -1 });
