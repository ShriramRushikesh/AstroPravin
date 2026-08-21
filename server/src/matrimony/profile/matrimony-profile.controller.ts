import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { MatrimonyProfileService } from './matrimony-profile.service';
import { SaveProfileDto } from './dto/save-profile.dto';
import { MatrimonyAuthGuard } from '../auth/matrimony-auth.guard';

const photoStorage = diskStorage({
  destination: './public/matrimony-photos',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `photo-${uniqueSuffix}${ext}`);
  },
});

@Controller('matrimony/profile')
@UseGuards(MatrimonyAuthGuard)
export class MatrimonyProfileController {
  constructor(private readonly profileService: MatrimonyProfileService) {}

  @Get()
  async getOwnProfile(@Req() req: any) {
    return this.profileService.getOwnProfile(req.user._id);
  }

  @Post()
  async saveProfilePost(@Req() req: any, @Body() dto: SaveProfileDto) {
    return this.profileService.saveProfile(req.user._id, dto);
  }

  @Patch()
  async saveProfilePatch(@Req() req: any, @Body() dto: SaveProfileDto) {
    return this.profileService.saveProfile(req.user._id, dto);
  }

  @Get('completeness')
  async getCompleteness(@Req() req: any) {
    return this.profileService.getCompleteness(req.user._id);
  }

  @Post('photos')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: photoStorage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new BadRequestException('Only JPG, PNG, and WebP image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadPhoto(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Body('isProfilePicture') isProfilePicture?: string) {
    const isMain = isProfilePicture === 'true' || isProfilePicture === '1';
    return this.profileService.addPhoto(req.user._id, file, isMain);
  }

  @Delete('photos/:photoId')
  async deletePhoto(@Req() req: any, @Param('photoId') photoId: string) {
    return this.profileService.deletePhoto(req.user._id, photoId);
  }

  @Patch('photos/:photoId/main')
  async setProfilePicture(@Req() req: any, @Param('photoId') photoId: string) {
    return this.profileService.setProfilePicture(req.user._id, photoId);
  }
}
