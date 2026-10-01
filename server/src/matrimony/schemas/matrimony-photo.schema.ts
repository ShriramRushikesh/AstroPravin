import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonyPhotoDocument = MatrimonyPhoto & Document;

@Schema({ collection: 'matrimony_photos', timestamps: true })
export class MatrimonyPhoto {
  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ default: false })
  isProfilePicture: boolean;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true,
  })
  status: string;

  @Prop()
  rejectionReason: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop()
  reviewedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  reviewedByAdmin: Types.ObjectId;
}

export const MatrimonyPhotoSchema = SchemaFactory.createForClass(MatrimonyPhoto);
MatrimonyPhotoSchema.index({ userId: 1, status: 1 });
