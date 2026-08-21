import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonyShortlistDocument = MatrimonyShortlist & Document;

@Schema({ collection: 'matrimony_shortlists', timestamps: true })
export class MatrimonyShortlist {
  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  targetUserId: Types.ObjectId;
}

export const MatrimonyShortlistSchema = SchemaFactory.createForClass(MatrimonyShortlist);
MatrimonyShortlistSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });
