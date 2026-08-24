import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export class OrderItem {
    @Prop({ required: true })
    productId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 1 })
    quantity: number;

    @Prop()
    carat?: string;

    @Prop()
    image?: string;

    @Prop()
    category?: string;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    customerName: string;

    @Prop({ required: true })
    customerPhone: string;

    @Prop()
    customerEmail?: string;

    @Prop({ required: true })
    shippingAddress: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    pincode: string;

    @Prop()
    landmark?: string;

    @Prop({ type: Array, default: [] })
    items: OrderItem[];

    // Backwards compatibility for single product view
    @Prop()
    productName?: string;

    @Prop()
    productPrice?: number;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ default: 'razorpay', enum: ['razorpay', 'upi', 'cod'] })
    paymentMethod: string;

    @Prop({ type: Object, default: {} })
    paymentDetails: {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
        status?: string;
        paidAt?: Date;
    };

    @Prop({ default: 'Pending', enum: ['Pending', 'Paid', 'Confirmed', 'Processing', 'Shipped', 'Completed', 'Cancelled'] })
    status: string;

    @Prop()
    trackingNumber?: string;

    @Prop()
    courierName?: string;

    @Prop()
    notes?: string;

    @Prop()
    receiptNumber?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
