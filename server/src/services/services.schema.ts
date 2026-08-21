import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true, strict: false })
export class Service {
    @Prop({ required: false })
    name?: string;

    @Prop({ required: false })
    title?: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: false, default: 'General Consultation' })
    category: string;

    @Prop({ type: [String], default: [] })
    features: string[];

    @Prop({ required: false })
    badge?: string;

    @Prop({ required: false })
    icon?: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

