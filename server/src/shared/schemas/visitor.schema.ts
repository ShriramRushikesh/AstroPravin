import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VisitorDocument = Visitor & Document;

@Schema()
export class Visitor {
    @Prop({ default: 0 })
    count: number;

    @Prop({ default: Date.now })
    lastUpdated: Date;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
