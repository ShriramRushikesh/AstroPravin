import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Product, ProductSchema } from '../shared/schemas/product.schema';
import { Order, OrderSchema } from '../shared/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [ProductsController, OrdersController],
  providers: [ProductsService, OrdersService],
  exports: [ProductsService, OrdersService],
})
export class ProductsModule {}
