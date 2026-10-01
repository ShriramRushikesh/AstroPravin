import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { MatrimonyGunMilanService } from './matrimony-gun-milan.service';
import { MatrimonyAuthGuard } from '../auth/matrimony-auth.guard';

@Controller('matrimony/gun-milan')
@UseGuards(MatrimonyAuthGuard)
export class MatrimonyGunMilanController {
  constructor(private readonly gunMilanService: MatrimonyGunMilanService) {}

  @Get(':targetProfileId')
  async getGunMilan(@Req() req: any, @Param('targetProfileId') targetProfileId: string) {
    return this.gunMilanService.calculateGunMilan(req.user._id, targetProfileId);
  }
}
