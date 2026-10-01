import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true, strict: false })
export class Lead {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    mobile: string;

    @Prop()
    phone?: string;

    @Prop()
    email?: string;

    @Prop()
    dob?: string;

    @Prop()
    tob?: string;

    @Prop()
    pob?: string;

    @Prop()
    pdfPath?: string;

    @Prop({ default: 'pending' })
    whatsappStatus: string;

    @Prop({ default: 'Pending' })
    status?: string;

    @Prop()
    topic?: string;

    @Prop()
    createdAt?: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

