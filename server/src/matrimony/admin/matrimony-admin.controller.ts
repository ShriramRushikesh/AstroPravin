import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatrimonyAdminService } from './matrimony-admin.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';

@Controller('matrimony/admin')
@UseGuards(AuthGuard('jwt')) // Protected by the existing admin JWT authentication
export class MatrimonyAdminController {
  constructor(private readonly adminService: MatrimonyAdminService) {}

  @Get('users')
  async listUsers(@Query() query: any) {
    return this.adminService.listUsers(query);
  }

  @Post('users')
  async createMember(@Req() req: any, @Body() dto: CreateMemberDto) {
    const adminId = req.user?.id || req.user?._id;
    const ip = req.ip || req.connection?.remoteAddress;
    return this.adminService.createMember(dto, adminId, ip);
  }

  @Get('users/pending-verification')
  async getPendingVerification() {
    return this.adminService.getPendingVerifications();
  }

  @Get('users/pending-photos')
  async getPendingPhotos() {
    return this.adminService.getPendingPhotos();
  }

  @Get('users/:userId')
  async getMemberDetail(@Param('userId') userId: string) {
    return this.adminService.getMemberDetail(userId);
  }

  @Patch('users/:userId/status')
  async updateStatus(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberStatusDto,
  ) {
    const adminId = req.user?.id || req.user?._id;
    const ip = req.ip || req.connection?.remoteAddress;
    return this.adminService.updateMemberStatus(userId, dto.status, dto.rejectionReason, adminId, ip);
  }

  @Patch('users/:userId/tier')
  async updateTier(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body('tier') tier: string,
  ) {
    const adminId = req.user?.id || req.user?._id;
    const ip = req.ip || req.connection?.remoteAddress;
    return this.adminService.updateMemberTier(userId, tier, adminId, ip);
  }

  @Patch('users/:userId/contact-visibility')
  async toggleContactVisibility(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body('isContactVisible') isContactVisible: boolean,
  ) {
    const adminId = req.user?.id || req.user?._id;
    const ip = req.ip || req.connection?.remoteAddress;
    return this.adminService.toggleContactVisibility(userId, isContactVisible, adminId, ip);
  }

  @Patch('users/:userId/featured')
  async toggleFeatured(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body('isFeatured') isFeatured: boolean,
  ) {
    const adminId = req.user?.id || req.user?._id;
    const ip = req.ip || req.connection?.remoteAddress;
    return this.adminService.toggleFeatured(userId, isFeatured, adminId, ip);
  }

  @Post('users/:userId/reset-password')
  async resetPassword(@Req() req: any, @Param('userId') userId: string) {
    const adminId = req.user?.id || req.user?._id;
    const ip = req.ip || req.connection?.remoteAddress;
    return this.adminService.resetPassword(userId, adminId, ip);
  }

  @Patch('photos/:photoId/review')
  async reviewPhoto(
    @Req() req: any,
    @Param('photoId') photoId: string,
    @Body('status') status: 'approved' | 'rejected',
    @Body('reason') reason?: string,
  ) {
    const adminId = req.user?.id || req.user?._id;
    const ip = req.ip || req.connection?.remoteAddress;
    return this.adminService.reviewPhoto(photoId, status, reason, adminId, ip);
  }

  @Patch('users/:userId/verify-payment')
  async verifyPayment(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body('approved') approved: boolean,
    @Body('notes') notes?: string,
  ) {
    const adminId = req.user?.id || req.user?._id;
    const ip = req.ip || req.connection?.remoteAddress;
    return this.adminService.verifyMemberPayment(userId, approved, notes, adminId, ip);
  }

  @Get('analytics/overview')
  async getOverview() {
    return this.adminService.getOverviewAnalytics();
  }

  @Get('analytics/activity')
  async getActivity() {
    return this.adminService.getActivityAnalytics();
  }

  @Get('audit')
  async getAuditLogs(@Query() query: any) {
    return this.adminService.getAuditLogs(query);
  }
}
