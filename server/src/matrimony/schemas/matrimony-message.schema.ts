import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonyMessageDocument = MatrimonyMessage & Document;

@Schema({ collection: 'matrimony_messages', timestamps: true })
export class MatrimonyMessage {
  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, index: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' })
  status: string;

  @Prop()
  readAt: Date;
}

export const MatrimonyMessageSchema = SchemaFactory.createForClass(MatrimonyMessage);
MatrimonyMessageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
MatrimonyMessageSchema.index({ receiverId: 1, status: 1 });
