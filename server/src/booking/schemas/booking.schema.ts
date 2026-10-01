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

    @Prop({ default: 1100 })
    amount?: number;

    @Prop({ default: 'paid' })
    paymentStatus?: string; // 'paid' | 'pending' | 'failed'

    @Prop({ default: 'razorpay' })
    paymentMethod?: string;

    @Prop({ type: Object })
    paymentDetails?: {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
        amount?: number;
        paidAt?: Date;
    };

    @Prop()
    receiptNumber?: string;

    @Prop()
    type?: string;

    @Prop()
    notes?: string;

    @Prop()
    createdAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
