import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CrmLeadDocument = CrmLead & Document;

@Schema({ collection: 'crm_leads', timestamps: true })
export class CrmLead {
  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', index: true })
  memberId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  email: string;

  @Prop()
  city: string;

  @Prop({ default: 'shop_visit' })
  source: string;

  @Prop({
    type: String,
    enum: ['new', 'contacted', 'interested', 'converted', 'lost'],
    default: 'new',
    index: true,
  })
  stage: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', index: true })
  assignedTo: Types.ObjectId;

  @Prop({ type: String, enum: ['high', 'medium', 'low'], default: 'medium', index: true })
  priority: string;

  @Prop()
  notes: string;

  @Prop({ index: true })
  nextFollowUpAt: Date;
}

export const CrmLeadSchema = SchemaFactory.createForClass(CrmLead);
CrmLeadSchema.index({ stage: 1, nextFollowUpAt: 1 });
CrmLeadSchema.index({ assignedTo: 1, stage: 1 });
