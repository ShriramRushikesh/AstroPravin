import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
    @Prop({ required: true })
    title: string;

    @Prop()
    subtitle: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    content: string;

    @Prop({ default: 'Astro Pravin' })
    author: string;

    @Prop()
    image: string;

    @Prop({ default: 'Astrology' })
    category: string;

    @Prop({ default: 0 })
    views: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
