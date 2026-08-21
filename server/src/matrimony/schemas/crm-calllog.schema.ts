import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CrmCallLogDocument = CrmCallLog & Document;

export enum CallOutcome {
  ANSWERED = 'answered',
  NO_ANSWER = 'no_answer',
  BUSY = 'busy',
  VOICEMAIL = 'voicemail',
  WRONG_NUMBER = 'wrong_number',
  CALLBACK_REQUESTED = 'callback_requested',
}

@Schema({ timestamps: true })
export class CrmCallLog {
  @Prop({ required: true })
  lead_id: string;

  @Prop({ required: true })
  called_by: string; // Staff username

  @Prop({ enum: CallOutcome, required: true })
  outcome: CallOutcome;

  /** Duration in seconds */
  @Prop({ type: Number, default: 0 })
  duration_seconds: number;

  @Prop({ type: String, default: null })
  notes: string | null;

  /** Convenience field for reporting — date without time */
  @Prop({ type: String })
  call_date: string; // e.g. "2024-07-15"
}

export const CrmCallLogSchema = SchemaFactory.createForClass(CrmCallLog);
CrmCallLogSchema.index({ lead_id: 1, createdAt: -1 });
CrmCallLogSchema.index({ called_by: 1, createdAt: -1 }); // Per-staff reporting
CrmCallLogSchema.index({ call_date: 1 });
