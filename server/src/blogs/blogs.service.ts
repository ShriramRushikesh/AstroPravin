import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../shared/schemas/blog.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().sort({ createdAt: -1 }).exec();
  }

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogModel.findOne({ slug }).exec();
    if (!blog) {
      throw new NotFoundException(`Blog with slug "${slug}" not found`);
    }
    return blog;
  }

  async create(blogData: Partial<Blog>): Promise<Blog> {
    const newBlog = new this.blogModel(blogData);
    return newBlog.save();
  }

  async update(id: string, blogData: Partial<Blog>): Promise<Blog> {
    const updated = await this.blogModel.findByIdAndUpdate(id, blogData, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.blogModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return { message: 'Blog deleted successfully' };
  }
}
