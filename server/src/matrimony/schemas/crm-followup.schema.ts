import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CrmFollowUpDocument = CrmFollowUp & Document;

@Schema({ collection: 'crm_followups', timestamps: true })
export class CrmFollowUp {
  @Prop({ type: Types.ObjectId, ref: 'CrmLead', required: true, index: true })
  leadId: Types.ObjectId;

  @Prop({ required: true, index: true })
  scheduledAt: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  outcome: string;

  @Prop()
  nextAction: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  assignedTo: Types.ObjectId;
}

export const CrmFollowUpSchema = SchemaFactory.createForClass(CrmFollowUp);
CrmFollowUpSchema.index({ leadId: 1, scheduledAt: -1 });
