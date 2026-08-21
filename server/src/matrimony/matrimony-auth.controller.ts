import {
  Controller, Post, Body, Put, UseGuards, Req, HttpCode, HttpStatus, Get,
} from '@nestjs/common';
import { MatrimonyAuthService } from './matrimony-auth.service';
import {
  MatrimonyLoginDto, ResetPasswordDto, ForgotPasswordDto, VerifyOtpDto,
} from './dto/matrimony-auth.dto';
import { MatrimonyRolesGuard } from './guards/matrimony-roles.guard';
import type { Request } from 'express';

@Controller('matrimony/auth')
export class MatrimonyAuthController {
  constructor(private readonly authService: MatrimonyAuthService) {}

  /**
   * POST /api/matrimony/auth/login
   * Returns JWT. If must_reset_password=true, client must call /reset-password next.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: MatrimonyLoginDto, @Req() req: Request) {
    return this.authService.login(dto, req.ip);
  }

  /**
   * PUT /api/matrimony/auth/reset-password
   * Requires valid JWT. Clears must_reset_password flag.
   */
  @Put('reset-password')
  @UseGuards(MatrimonyRolesGuard)
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: any) {
    const userId = req.matrimony_user?.sub;
    return this.authService.resetPassword(userId, dto, req.ip);
  }

  /**
   * POST /api/matrimony/auth/forgot-password
   * Triggers OTP to registered email. Anti-enumeration: always 200.
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    return this.authService.forgotPassword(dto, req.ip);
  }

  /**
   * POST /api/matrimony/auth/verify-otp
   * Validates OTP + sets new password.
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto, @Req() req: Request) {
    return this.authService.verifyOtpAndReset(dto, req.ip);
  }
}
