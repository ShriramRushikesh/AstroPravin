import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    mobile: string;

    @Prop({ required: true })
    dob: string;

    @Prop({ required: true })
    tob: string;

    @Prop({ required: true })
    pob: string;

    @Prop()
    pdfPath: string;

    @Prop({ default: 'pending' })
    whatsappStatus: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
