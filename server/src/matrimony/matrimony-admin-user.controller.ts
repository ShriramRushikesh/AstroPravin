import {
  Controller, Post, Get, Put, Body, Param, Query,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { MatrimonyAdminUserService } from './matrimony-admin-user.service';
import { MatrimonyRolesGuard, MatrimonyRoles } from './guards/matrimony-roles.guard';
import { MatrimonyUserRole } from './schemas/matrimony-user.schema';
import { CreateMatrimonyUserDto } from './dto/create-matrimony-user.dto';

/** Guard shortcut for routes that require at least admin-level access */
const AdminGuard = UseGuards(MatrimonyRolesGuard);

@Controller('matrimony/admin')
@UseGuards(MatrimonyRolesGuard)
export class MatrimonyAdminUserController {
  constructor(private readonly service: MatrimonyAdminUserService) {}

  /**
   * POST /api/matrimony/admin/users
   * Creates a new matrimony user account. Requires: super_admin, admin,
   * or staff with can_create_accounts=true (service enforces staff restriction).
   */
  @Post('users')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN, MatrimonyUserRole.STAFF)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateMatrimonyUserDto, @Req() req: any) {
    return this.service.createUser(dto, req.matrimony_user, req.ip);
  }

  /**
   * GET /api/matrimony/admin/users
   * Lists all matrimony user accounts (excluding sensitive fields).
   */
  @Get('users')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN, MatrimonyUserRole.STAFF)
  async listUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.listUsers(Number(page) || 1, Number(limit) || 50);
  }

  /**
   * PUT /api/matrimony/admin/users/:userCode/status
   * Suspend or reactivate an account. Body: { is_active: boolean }
   */
  @Put('users/:userCode/status')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  async setStatus(
    @Param('userCode') userCode: string,
    @Body('is_active') isActive: boolean,
    @Req() req: any,
  ) {
    return this.service.setAccountStatus(userCode, isActive, req.matrimony_user, req.ip);
  }

  /**
   * PUT /api/matrimony/admin/users/:userCode/force-reset
   * Forces the user to reset their password on next login.
   */
  @Put('users/:userCode/force-reset')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  async forceReset(@Param('userCode') userCode: string, @Req() req: any) {
    return this.service.forcePasswordReset(userCode, req.matrimony_user, req.ip);
  }

  /**
   * PUT /api/matrimony/admin/users/:userCode/permissions
   * Update role or can_create_accounts flag. Super admin only for elevated roles.
   */
  @Put('users/:userCode/permissions')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  async updatePermissions(
    @Param('userCode') userCode: string,
    @Body() body: { role?: MatrimonyUserRole; can_create_accounts?: boolean },
    @Req() req: any,
  ) {
    return this.service.updatePermissions(userCode, body, req.matrimony_user, req.ip);
  }

  /**
   * GET /api/matrimony/admin/audit-log
   * Full audit log. Super admin only.
   */
  @Get('audit-log')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN)
  async getAuditLog(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.getFullAuditLog(Number(page) || 1, Number(limit) || 100);
  }

  /**
   * GET /api/matrimony/admin/audit-log/:userCode
   * Audit log for a specific user.
   */
  @Get('audit-log/:userCode')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  async getUserAuditLog(
    @Param('userCode') userCode: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getAuditLog(userCode, Number(page) || 1, Number(limit) || 50);
  }
}
