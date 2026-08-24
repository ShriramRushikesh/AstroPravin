import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateStoreRazorpayOrderDto, VerifyStorePaymentDto, UpdateOrderStatusDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create-razorpay-order')
  async createRazorpayOrder(@Body() dto: CreateStoreRazorpayOrderDto) {
    return this.ordersService.createRazorpayOrder(dto);
  }

  @Post('verify-payment')
  async verifyPayment(@Body() dto: VerifyStorePaymentDto) {
    return this.ordersService.verifyPayment(dto);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
