import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type MatrimonyAuditLogDocument = MatrimonyAuditLog & Document;

@Schema({ collection: 'matrimony_audit_logs', timestamps: true })
export class MatrimonyAuditLog {
  @Prop({ type: Types.ObjectId, ref: 'AdminUser', required: true, index: true })
  adminId: Types.ObjectId;

  @Prop({ required: true, index: true })
  action: string; // e.g. 'CREATE_MEMBER', 'VERIFY_PROFILE', 'APPROVE_PHOTO', 'REJECT_PHOTO', 'CHANGE_TIER', 'SUSPEND_MEMBER'

  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', index: true })
  targetUserId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.Mixed })
  before: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  after: any;

  @Prop()
  ipAddress: string;

  @Prop()
  notes: string;

  @Prop({ default: Date.now, index: true })
  timestamp: Date;
}

export const MatrimonyAuditLogSchema = SchemaFactory.createForClass(MatrimonyAuditLog);
MatrimonyAuditLogSchema.index({ targetUserId: 1, timestamp: -1 });
MatrimonyAuditLogSchema.index({ action: 1, timestamp: -1 });
