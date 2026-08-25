import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MatrimonyPaymentService } from './matrimony-payment.service';
import { CreateMatrimonyOrderDto, VerifyMatrimonyPaymentDto } from './dto/payment.dto';
import { MatrimonyAuthGuard } from '../auth/matrimony-auth.guard';

@Controller('matrimony/payment')
export class MatrimonyPaymentController {
  constructor(private readonly paymentService: MatrimonyPaymentService) {}

  @Get('plans')
  getPlans() {
    return this.paymentService.getPlans();
  }

  @UseGuards(MatrimonyAuthGuard)
  @Post('create-order')
  async createOrder(@Req() req: any, @Body() createOrderDto: CreateMatrimonyOrderDto) {
    const userId = req.user?._id?.toString() || req.user?.id || req.user?.sub;
    return this.paymentService.createOrder(userId, createOrderDto);
  }

  @UseGuards(MatrimonyAuthGuard)
  @Post('verify-payment')
  async verifyPayment(@Req() req: any, @Body() verifyDto: VerifyMatrimonyPaymentDto) {
    const userId = req.user?._id?.toString() || req.user?.id || req.user?.sub;
    return this.paymentService.verifyPayment(userId, verifyDto);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: any, @Body() payload: any) {
    const signature = req.headers['x-razorpay-signature'] as string;
    return this.paymentService.handleWebhook(payload, signature);
  }
}

