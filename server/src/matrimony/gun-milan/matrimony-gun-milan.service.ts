import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MatrimonyProfile, MatrimonyProfileDocument } from '../schemas/matrimony-profile.schema';
import { GunMilanService } from '../../kundli/gun-milan.service';

@Injectable()
export class MatrimonyGunMilanService {
  constructor(
    @InjectModel(MatrimonyProfile.name) private profileModel: Model<MatrimonyProfileDocument>,
    private readonly gunMilanService: GunMilanService,
  ) {}

  async calculateGunMilan(userAId: string, targetProfileOrUserId: string) {
    const userAObjectId = new Types.ObjectId(userAId);

    // Profile A (Current User)
    const profileA = await this.profileModel.findOne({ userId: userAObjectId });
    if (!profileA) {
      throw new BadRequestException('Your profile must be created before calculating Gun Milan');
    }

    // Profile B (Target)
    let profileB = await this.profileModel.findById(targetProfileOrUserId);
    if (!profileB) {
      profileB = await this.profileModel.findOne({ userId: new Types.ObjectId(targetProfileOrUserId) });
    }

    if (!profileB) {
      throw new NotFoundException('Target profile not found');
    }

    if (!profileA.rashi || !profileA.nakshatra) {
      throw new BadRequestException('Please complete your Rashi and Nakshatra in your profile to calculate Gun Milan compatibility.');
    }

    if (!profileB.rashi || !profileB.nakshatra) {
      throw new BadRequestException(`Target profile (${profileB.fullName}) has not specified their Rashi or Nakshatra yet.`);
    }

    const result = this.gunMilanService.calculate(
      {
        rashi: profileA.rashi,
        nakshatra: profileA.nakshatra,
      },
      {
        rashi: profileB.rashi,
        nakshatra: profileB.nakshatra,
      },
    );

    return {
      success: true,
      profileA: {
        id: profileA._id,
        name: profileA.fullName,
        rashi: profileA.rashi,
        nakshatra: profileA.nakshatra,
        gender: profileA.gender,
      },
      profileB: {
        id: profileB._id,
        name: profileB.fullName,
        rashi: profileB.rashi,
        nakshatra: profileB.nakshatra,
        gender: profileB.gender,
      },
      result,
    };
  }
}
