import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedController } from './shared.controller';
import { SharedService } from './shared.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { Video, VideoSchema } from './schemas/video.schema';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { Visitor, VisitorSchema } from './schemas/visitor.schema';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Video.name, schema: VideoSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Visitor.name, schema: VisitorSchema },
    ]),
  ],
  controllers: [SharedController],
  providers: [SharedService, EmailService],
  exports: [SharedService, EmailService, MongooseModule], // Export MongooseModule if needed elsewhere
})
export class SharedModule { }
