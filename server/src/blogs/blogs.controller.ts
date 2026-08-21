import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog } from '../shared/schemas/blog.schema';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async findAll(): Promise<Blog[]> {
    return this.blogsService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string): Promise<Blog> {
    return this.blogsService.findBySlug(slug);
  }

  @Post()
  async create(@Body() blogData: Partial<Blog>): Promise<Blog> {
    return this.blogsService.create(blogData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() blogData: Partial<Blog>): Promise<Blog> {
    return this.blogsService.update(id, blogData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.blogsService.remove(id);
  }
}
