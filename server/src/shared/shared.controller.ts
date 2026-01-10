import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { SharedService } from './shared.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api')
export class SharedController {
    constructor(private readonly sharedService: SharedService) { }

    // Upload
    @Post('upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/uploads', // Ensure this exists or use logic to create
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`;
        return { url: fileUrl };
    }

    // Products
    @Get('products') getProducts() { return this.sharedService.getProducts(); }
    @UseGuards(AuthGuard('jwt')) @Post('products') createProduct(@Body() b: any) { return this.sharedService.createProduct(b); }
    @UseGuards(AuthGuard('jwt')) @Put('products/:id') updateProduct(@Param('id') i: string, @Body() b: any) { return this.sharedService.updateProduct(i, b); }
    @UseGuards(AuthGuard('jwt')) @Delete('products/:id') deleteProduct(@Param('id') i: string) { return this.sharedService.deleteProduct(i); }

    // Videos
    @Get('videos') getVideos() { return this.sharedService.getVideos(); }
    @UseGuards(AuthGuard('jwt')) @Post('videos') createVideo(@Body() b: any) { return this.sharedService.createVideo(b); }
    @UseGuards(AuthGuard('jwt')) @Put('videos/:id') updateVideo(@Param('id') i: string, @Body() b: any) { return this.sharedService.updateVideo(i, b); }
    @UseGuards(AuthGuard('jwt')) @Delete('videos/:id') deleteVideo(@Param('id') i: string) { return this.sharedService.deleteVideo(i); }

    // Blogs
    @Get('blogs') getBlogs() { return this.sharedService.getBlogs(); }
    @Get('blogs/:slug') getBlog(@Param('slug') s: string) { return this.sharedService.getBlogBySlug(s); }
    @UseGuards(AuthGuard('jwt')) @Post('blogs') createBlog(@Body() b: any) { return this.sharedService.createBlog(b); }
    @UseGuards(AuthGuard('jwt')) @Put('blogs/:id') updateBlog(@Param('id') i: string, @Body() b: any) { return this.sharedService.updateBlog(i, b); }
    @UseGuards(AuthGuard('jwt')) @Delete('blogs/:id') deleteBlog(@Param('id') i: string) { return this.sharedService.deleteBlog(i); }

    // Orders
    @Post('orders') createOrder(@Body() b: any) { return this.sharedService.createOrder(b); }
    @UseGuards(AuthGuard('jwt')) @Get('orders') getOrders() { return this.sharedService.getOrders(); }
    @UseGuards(AuthGuard('jwt')) @Put('orders/:id') updateOrder(@Param('id') i: string, @Body() b: any) { return this.sharedService.updateOrder(i, b); }

    // Visitors
    @Get('visits') getVisits() { return this.sharedService.getVisitorCount(); }
    @Post('visits/increment') incrementVisits() { return this.sharedService.incrementVisitorCount(); }
}
