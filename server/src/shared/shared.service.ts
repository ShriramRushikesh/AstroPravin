import { Injectable, NotFoundException } from '@nestjs/common';
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

    // --- Products ---
    async getProducts() {
        return this.productModel.find({ inStock: true }).exec();
    }
    async createProduct(data: any) {
        return new this.productModel(data).save();
    }
    async updateProduct(id: string, data: any) {
        return this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async deleteProduct(id: string) {
        return this.productModel.findByIdAndDelete(id).exec();
    }

    // --- Videos ---
    async getVideos() {
        return this.videoModel.find().sort({ createdAt: -1 }).exec();
    }
    async createVideo(data: any) {
        return new this.videoModel(data).save();
    }
    async updateVideo(id: string, data: any) {
        return this.videoModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async deleteVideo(id: string) {
        return this.videoModel.findByIdAndDelete(id).exec();
    }

    // --- Blogs ---
    async getBlogs() {
        return this.blogModel.find().sort({ createdAt: -1 }).exec();
    }
    async getBlogBySlug(slug: string) {
        const blog = await this.blogModel.findOne({ slug }).exec();
        if (!blog) throw new NotFoundException('Blog not found');
        return blog;
    }
    async createBlog(data: any) {
        return new this.blogModel(data).save();
    }
    async updateBlog(id: string, data: any) {
        return this.blogModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async deleteBlog(id: string) {
        return this.blogModel.findByIdAndDelete(id).exec();
    }

    // --- Orders ---
    async getOrders() {
        return this.orderModel.find().sort({ createdAt: -1 }).exec();
    }
    async createOrder(data: any) {
        return new this.orderModel(data).save();
    }
    async updateOrder(id: string, data: any) {
        return this.orderModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    // --- Visitors ---
    async getVisitorCount() {
        let visitor = await this.visitorModel.findOne().exec();
        if (!visitor) {
            visitor = new this.visitorModel({ count: 0 });
            await visitor.save();
        }
        return { count: visitor.count };
    }
    async incrementVisitorCount() {
        let visitor = await this.visitorModel.findOne().exec();
        if (!visitor) {
            visitor = new this.visitorModel({ count: 1 });
        } else {
            visitor.count += 1;
            visitor.lastUpdated = new Date();
        }
        await visitor.save();
        return { count: visitor.count };
    }
}
