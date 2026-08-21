import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true, strict: false })
export class Booking {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    mobile?: string;

    @Prop()
    email?: string;

    @Prop()
    date?: string;

    @Prop()
    time?: string;

    @Prop()
    birthDate?: string;

    @Prop()
    dob?: string;

    @Prop()
    birthTime?: string;

    @Prop()
    tob?: string;

    @Prop()
    birthPlace?: string;

    @Prop()
    pob?: string;

    @Prop()
    topic?: string;

    @Prop()
    astrologer?: string;

    @Prop()
    gender?: string;

    @Prop()
    preferredDate?: string;

    @Prop()
    preferredTime?: string;

    @Prop({ default: 'Pending' })
    status: string;

    @Prop()
    type?: string;

    @Prop()
    notes?: string;

    @Prop()
    createdAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
