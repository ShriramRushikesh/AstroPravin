import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonyProfileViewDocument = MatrimonyProfileView & Document;

@Schema({ collection: 'matrimony_profile_views', timestamps: true })
export class MatrimonyProfileView {
  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  userId: Types.ObjectId; // The profile being viewed

  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  viewedBy: Types.ObjectId; // The viewer

  @Prop({ default: Date.now })
  viewedAt: Date;

  @Prop({ required: true, index: true })
  dateKey: string; // YYYY-MM-DD for daily deduplication
}

export const MatrimonyProfileViewSchema = SchemaFactory.createForClass(MatrimonyProfileView);
MatrimonyProfileViewSchema.index({ userId: 1, viewedBy: 1, dateKey: 1 }, { unique: true });
MatrimonyProfileViewSchema.index({ userId: 1, viewedAt: -1 });
