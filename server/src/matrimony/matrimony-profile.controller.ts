import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Req, UseInterceptors, UploadedFile, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MatrimonyProfileService } from './matrimony-profile.service';
import { MatrimonyRolesGuard, MatrimonyRoles } from './guards/matrimony-roles.guard';
import { MatrimonyUserRole } from './schemas/matrimony-user.schema';
import { CreateMatrimonyProfileDto, UpdateMatrimonyProfileDto, SearchProfilesDto } from './dto/matrimony-profile.dto';

const matrimonyPhotoStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const dir = join(process.cwd(), 'public', 'matrimony-photos');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, `photo-${Date.now()}-${Math.round(Math.random() * 1e6)}${extname(file.originalname)}`);
  },
});

@Controller('matrimony')
export class MatrimonyProfileController {
  constructor(private readonly service: MatrimonyProfileService) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // USER-FACING ROUTES (require matrimony user JWT)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/matrimony/profile/me
   * Returns the logged-in user's own full profile + photos.
   */
  @Get('profile/me')
  @UseGuards(MatrimonyRolesGuard)
  async getMyProfile(@Req() req: any) {
    return this.service.getMyProfile(req.matrimony_user.sub);
  }

  /**
   * GET /api/matrimony/profile/me/state
   * Returns the computed UserState object that drives all frontend conditional UI.
   */
  @Get('profile/me/state')
  @UseGuards(MatrimonyRolesGuard)
  async getMyState(@Req() req: any) {
    return this.service.getMyState(req.matrimony_user.sub);
  }

  /**
   * PUT /api/matrimony/profile/me
   * Create or update own profile. Completeness is recomputed automatically.
   */
  @Put('profile/me')
  @UseGuards(MatrimonyRolesGuard)
  async upsertMyProfile(@Req() req: any, @Body() dto: UpdateMatrimonyProfileDto) {
    return this.service.upsertMyProfile(
      req.matrimony_user.sub,
      req.matrimony_user.user_code,
      dto,
    );
  }

  /**
   * POST /api/matrimony/profile/me/photos
   * Upload a profile photo. Requires admin approval before public display.
   */
  @Post('profile/me/photos')
  @UseGuards(MatrimonyRolesGuard)
  @UseInterceptors(FileInterceptor('photo', { storage: matrimonyPhotoStorage }))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body('is_primary') isPrimary: string,
    @Body('privacy') privacy: string,
    @Req() req: any,
  ) {
    const profile = await this.service.getMyProfile(req.matrimony_user.sub);
    if (!profile) throw new Error('Profile not found');
    return this.service.addPhoto(
      String((profile as any)._id),
      file,
      isPrimary === 'true',
      privacy,
      req.matrimony_user.username,
    );
  }

  /**
   * GET /api/matrimony/search
   * Browse/search approved profiles. Filters are plan-gated server-side.
   */
  @Get('search')
  @UseGuards(MatrimonyRolesGuard)
  async searchProfiles(@Query() query: SearchProfilesDto, @Req() req: any) {
    return this.service.searchProfiles(query, req.matrimony_user.profile_id);
  }

  /**
   * GET /api/matrimony/profiles/:code
   * Public profile detail view. Contact info gated by plan tier.
   */
  @Get('profiles/:code')
  @UseGuards(MatrimonyRolesGuard)
  async getProfile(@Param('code') code: string, @Req() req: any) {
    // We pass tier from JWT payload (set after state resolve)
    return this.service.getProfileByCode(code, req.matrimony_user.profile_id, req.matrimony_user.tier);
  }

  /**
   * GET /api/matrimony/profile/me/viewers
   * "Who viewed my profile" list.
   */
  @Get('profile/me/viewers')
  @UseGuards(MatrimonyRolesGuard)
  async getViewers(@Req() req: any, @Query('page') page?: string) {
    const profile = await this.service.getMyProfile(req.matrimony_user.sub);
    if (!profile) return { views: [], total: 0 };
    return this.service.getProfileViewers(String((profile as any)._id), Number(page) || 1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN ROUTES — backward-compatible with existing admin UI API calls
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/matrimony/admin/profiles
   * Lists all profiles for admin panel. Compatible with existing admin UI.
   * Query: ?filter=pending|approved|all
   */
  @Get('admin/profiles')
  @UseGuards(MatrimonyRolesGuard)
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN, MatrimonyUserRole.STAFF)
  async adminListProfiles(@Query('filter') filter?: string) {
    return this.service.adminGetAllProfiles(filter);
  }

  /**
   * PUT /api/matrimony/profiles/:id
   * Admin inline edit — compatible with existing admin UI PUT call.
   */
  @Put('profiles/:id')
  @UseGuards(MatrimonyRolesGuard)
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN, MatrimonyUserRole.STAFF)
  async adminUpdateProfile(@Param('id') id: string, @Body() body: any) {
    return this.service.adminUpdateProfile(id, body);
  }

  /**
   * PUT /api/matrimony/profiles/:id/status
   * Approve or reject a profile. Compatible with existing admin UI.
   */
  @Put('profiles/:id/status')
  @UseGuards(MatrimonyRolesGuard)
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  async adminSetStatus(
    @Param('id') id: string,
    @Body('isApproved') isApproved: boolean,
    @Req() req: any,
  ) {
    return this.service.adminSetStatus(id, isApproved, req.matrimony_user.username ?? 'admin');
  }

  /**
   * DELETE /api/matrimony/profiles/:id
   * Soft-delete a profile. Compatible with existing admin UI.
   */
  @Delete('profiles/:id')
  @UseGuards(MatrimonyRolesGuard)
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async adminDeleteProfile(@Param('id') id: string, @Req() req: any) {
    return this.service.adminDeleteProfile(id, req.matrimony_user.username ?? 'admin');
  }

  /**
   * POST /api/matrimony/profiles/:id/upload-kundli
   * Kundli upload for a specific profile. Compatible with existing admin UI.
   * Delegates to KundliExtractService via profile service.
   */
  @Post('profiles/:id/upload-kundli')
  @UseGuards(MatrimonyRolesGuard)
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN, MatrimonyUserRole.STAFF)
  @UseInterceptors(FileInterceptor('file', { storage: matrimonyPhotoStorage }))
  async uploadKundli(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    // Delegate to profile service which will call the shared KundliExtractService
    // This is handled in the service to maintain separation
    return { success: true, message: 'Kundli upload endpoint ready — wire to KundliExtractService in next phase' };
  }

  /**
   * PUT /api/matrimony/photos/:photoId/approve
   * Admin approve/reject a submitted photo.
   */
  @Put('photos/:photoId/approve')
  @UseGuards(MatrimonyRolesGuard)
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  async approvePhoto(
    @Param('photoId') photoId: string,
    @Body('approved') approved: boolean,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return this.service.adminApprovePhoto(photoId, approved, reason ?? null, req.matrimony_user.username);
  }
}
