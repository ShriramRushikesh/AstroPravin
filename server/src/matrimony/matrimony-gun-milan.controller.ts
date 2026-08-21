import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MatrimonyRolesGuard, MatrimonyRoles } from './guards/matrimony-roles.guard';
import { MatrimonyUserRole } from './schemas/matrimony-user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatrimonyProfile, MatrimonyProfileDocument } from './schemas/matrimony-profile.schema';
import { GunMilanService } from '../kundli/gun-milan.service';

/**
 * Gun Milan endpoint — backward-compatible with existing admin UI call:
 * POST /api/matrimony/gun-milan
 * Body: { profileAId, profileBId, generatePdf }
 *
 * Fetches horoscope data from both profiles and delegates to the existing
 * GunMilanService in the kundli module — no second implementation needed.
 */
@Controller('matrimony/gun-milan')
@UseGuards(MatrimonyRolesGuard)
export class MatrimonyGunMilanController {
  constructor(
    @InjectModel(MatrimonyProfile.name)
    private readonly profileModel: Model<MatrimonyProfileDocument>,
    private readonly gunMilanService: GunMilanService,
  ) {}

  @Post()
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN, MatrimonyUserRole.STAFF)
  async calculateGunMilan(
    @Body() body: { profileAId: string; profileBId: string; generatePdf?: boolean },
  ) {
    const [profileA, profileB] = await Promise.all([
      this.profileModel.findById(body.profileAId).lean(),
      this.profileModel.findById(body.profileBId).lean(),
    ]);

    if (!profileA || !profileB) {
      return { success: false, message: 'One or both profiles not found' };
    }

    const kundli1 = {
      name: profileA.full_name,
      rashi: profileA.horoscope?.rashi,
      nakshatra: profileA.horoscope?.nakshatra,
      nadi: profileA.horoscope?.nadi,
    };
    const kundli2 = {
      name: profileB.full_name,
      rashi: profileB.horoscope?.rashi,
      nakshatra: profileB.horoscope?.nakshatra,
      nadi: profileB.horoscope?.nadi,
    };

    const result = this.gunMilanService.calculate(kundli1, kundli2);

    return {
      success: true,
      profiles: {
        profileA: { name: profileA.full_name, code: profileA.code },
        profileB: { name: profileB.full_name, code: profileB.code },
      },
      gunaScore: result.totalScore,
      percentage: result.percentage,
      compatibility: result.compatibility,
      verdict: result.verdict,
      auspicious: result.auspicious,
      breakdown: result.breakdown,
      dosha: result.dosha,
      remedies: result.remedies,
    };
  }
}
