import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, strict: false })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: false })
    originalPrice?: number;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: false, default: 'gemstones' })
    category: string;

    @Prop({ default: true })
    inStock: boolean;

    @Prop({ required: false })
    carat?: string;

    @Prop({ required: false })
    origin?: string;

    @Prop({ required: false })
    rulingPlanet?: string;

    @Prop({ required: false })
    power?: string;

    @Prop({ required: false })
    rating?: number;

    @Prop({ required: false })
    reviewsCount?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

