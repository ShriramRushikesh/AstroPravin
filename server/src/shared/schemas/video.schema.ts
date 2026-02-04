import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    ytId: string;

    @Prop({ default: 'youtube' }) // 'youtube', 'instagram'
    platform: string;

    @Prop()
    image: string; // Custom thumbnail URL

    @Prop()
    description: string;

    @Prop({ default: '0' })
    views: string;

    @Prop()
    date: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
