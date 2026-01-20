import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    email: string;

    @Prop()
    date: string;

    @Prop()
    time: string;

    @Prop()
    birthDate: string;

    @Prop()
    birthTime: string;

    @Prop()
    birthPlace: string;

    @Prop()
    topic: string;

    @Prop()
    astrologer: string;

    @Prop()
    gender: string;

    @Prop()
    preferredDate: string; // Renamed from 'date' to match frontend

    @Prop()
    preferredTime: string; // Renamed from 'time' to match frontend

    @Prop({ default: 'Pending' })
    status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
