import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CrmCallLogDocument = CrmCallLog & Document;

@Schema({ collection: 'crm_call_logs', timestamps: true })
export class CrmCallLog {
  @Prop({ type: Types.ObjectId, ref: 'CrmLead', required: true, index: true })
  leadId: Types.ObjectId;

  @Prop({ default: Date.now, index: true })
  calledAt: Date;

  @Prop({ default: 0 })
  durationSeconds: number;

  @Prop({
    type: String,
    enum: ['answered', 'no_answer', 'busy', 'wrong_number'],
    default: 'answered',
  })
  outcome: string;

  @Prop()
  notes: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  loggedByAdmin: Types.ObjectId;
}

export const CrmCallLogSchema = SchemaFactory.createForClass(CrmCallLog);
CrmCallLogSchema.index({ leadId: 1, calledAt: -1 });
