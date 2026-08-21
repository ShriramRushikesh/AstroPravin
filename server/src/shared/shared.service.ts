import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Video, VideoDocument } from './schemas/video.schema';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { Order, OrderDocument } from './schemas/order.schema';
import { Visitor, VisitorDocument } from './schemas/visitor.schema';

@Injectable()
export class SharedService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
        @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Visitor.name) private visitorModel: Model<VisitorDocument>,
    ) { }

    async getVisits(): Promise<{ count: number }> {
        const visitor = await this.visitorModel.findOne().exec();
        return { count: visitor ? visitor.count : 0 };
    }

    async incrementVisits(): Promise<{ count: number }> {
        const visitor = await this.visitorModel.findOneAndUpdate(
            {},
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        ).exec();
        return { count: visitor.count };
    }
}
