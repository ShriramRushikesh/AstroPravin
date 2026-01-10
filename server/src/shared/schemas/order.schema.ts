import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    customerName: string;

    @Prop({ required: true })
    customerPhone: string;

    @Prop({ required: true })
    productName: string;

    @Prop({ required: true })
    productPrice: number;

    @Prop({ default: 'Pending', enum: ['Pending', 'Confirmed', 'Shipped', 'Completed', 'Cancelled'] })
    status: string;

    @Prop()
    notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
