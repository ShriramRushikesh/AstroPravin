import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { MatrimonyAuthService } from './matrimony-auth.service';
import { MatrimonyLoginDto } from './dto/login.dto';
import { MatrimonyChangePasswordDto } from './dto/change-password.dto';
import { MatrimonyRegisterDto } from './dto/register.dto';
import { MatrimonySubmitPaymentDto } from './dto/payment.dto';
import { MatrimonyAuthGuard } from './matrimony-auth.guard';

@Controller('matrimony/auth')
export class MatrimonyAuthController {
  constructor(private readonly authService: MatrimonyAuthService) {}

  @Get('payment-config')
  getPaymentConfig() {
    return this.authService.getRegistrationConfig();
  }

  @Post('register')
  async register(@Body() registerDto: MatrimonyRegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: MatrimonyLoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(MatrimonyAuthGuard)
  @Post('submit-payment')
  async submitPayment(@Req() req: any, @Body() paymentDto: MatrimonySubmitPaymentDto) {
    return this.authService.submitPayment(req.user._id, paymentDto);
  }

  @UseGuards(MatrimonyAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: any, @Body() changePasswordDto: MatrimonyChangePasswordDto) {
    return this.authService.changePassword(req.user._id, changePasswordDto);
  }

  @UseGuards(MatrimonyAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user._id);
  }
}
