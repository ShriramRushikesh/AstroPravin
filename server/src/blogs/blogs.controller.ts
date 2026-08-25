import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() blogData: Partial<Blog>): Promise<Blog> {
    return this.blogsService.create(blogData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() blogData: Partial<Blog>): Promise<Blog> {
    return this.blogsService.update(id, blogData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.blogsService.remove(id);
  }
}
