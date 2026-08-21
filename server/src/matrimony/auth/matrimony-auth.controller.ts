import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { MatrimonyAuthService } from './matrimony-auth.service';
import { MatrimonyLoginDto } from './dto/login.dto';
import { MatrimonyChangePasswordDto } from './dto/change-password.dto';
import { MatrimonyAuthGuard } from './matrimony-auth.guard';

@Controller('matrimony/auth')
export class MatrimonyAuthController {
  constructor(private readonly authService: MatrimonyAuthService) {}

  @Post('login')
  async login(@Body() loginDto: MatrimonyLoginDto) {
    return this.authService.login(loginDto);
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
