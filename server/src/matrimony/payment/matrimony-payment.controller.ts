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
    return this.paymentService.createOrder(req.user._id, createOrderDto);
  }

  @UseGuards(MatrimonyAuthGuard)
  @Post('verify-payment')
  async verifyPayment(@Req() req: any, @Body() verifyDto: VerifyMatrimonyPaymentDto) {
    return this.paymentService.verifyPayment(req.user._id, verifyDto);
  }
}
