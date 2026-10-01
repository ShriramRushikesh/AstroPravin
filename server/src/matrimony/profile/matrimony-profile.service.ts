import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MatrimonyProfile, MatrimonyProfileDocument } from '../schemas/matrimony-profile.schema';
import { MatrimonyUser, MatrimonyUserDocument } from '../schemas/matrimony-user.schema';
import { MatrimonyPhoto, MatrimonyPhotoDocument } from '../schemas/matrimony-photo.schema';
import { SaveProfileDto } from './dto/save-profile.dto';

@Injectable()
export class MatrimonyProfileService {
  constructor(
    @InjectModel(MatrimonyProfile.name) private profileModel: Model<MatrimonyProfileDocument>,
    @InjectModel(MatrimonyUser.name) private userModel: Model<MatrimonyUserDocument>,
    @InjectModel(MatrimonyPhoto.name) private photoModel: Model<MatrimonyPhotoDocument>,
  ) {}

  async getOwnProfile(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    let profile = await this.profileModel.findOne({ userId: userObjectId });
    const photos = await this.photoModel.find({ userId: userObjectId }).sort({ isProfilePicture: -1, createdAt: -1 });

    if (!profile) {
      // Return empty skeleton
      return {
        profile: null,
        photos,
        completeness: 0,
      };
    }

    return {
      profile,
      photos,
      completeness: profile.profileCompleteness || 0,
    };
  }

  async saveProfile(userId: string, dto: SaveProfileDto) {
    const userObjectId = new Types.ObjectId(userId);
    let profile = await this.profileModel.findOne({ userId: userObjectId });

    const updateData: any = { ...dto };
    delete updateData.currentStep;
    const isFinalSubmit = dto.isFinalSubmit;
    delete updateData.isFinalSubmit;

    if (!profile) {
      profile = new this.profileModel({
        userId: userObjectId,
        fullName: dto.fullName || 'Member',
        ...updateData,
      });
    } else {
      Object.assign(profile, updateData);
    }

    // Compute completeness
    const completeness = this.calculateCompleteness(profile);
    profile.profileCompleteness = completeness.percentage;

    await profile.save();

    // If final submit or completeness >= 70% and user was pending_profile, transition to pending_verification
    const user = await this.userModel.findById(userObjectId);
    if (user && (isFinalSubmit || user.status === 'pending_profile')) {
      if (isFinalSubmit || completeness.percentage >= 60) {
        user.status = 'pending_verification';
        await user.save();
      }
    }

    const photos = await this.photoModel.find({ userId: userObjectId });

    return {
      success: true,
      profile,
      photos,
      completeness: completeness.percentage,
      missingFields: completeness.missingFields,
    };
  }

  async addPhoto(userId: string, file: Express.Multer.File, isProfilePicture: boolean = false) {
    if (!file) {
      throw new BadRequestException('No photo file provided');
    }

    const userObjectId = new Types.ObjectId(userId);
    const existingPhotosCount = await this.photoModel.countDocuments({ userId: userObjectId });

    if (existingPhotosCount >= 10) {
      throw new BadRequestException('Maximum 10 photos allowed per profile');
    }

    const photoUrl = `/matrimony-photos/${file.filename}`;

    // If this is set as profile picture or it's the first photo, unset other profile pictures
    if (isProfilePicture || existingPhotosCount === 0) {
      await this.photoModel.updateMany({ userId: userObjectId }, { isProfilePicture: false });
    }

    const photo = await this.photoModel.create({
      userId: userObjectId,
      url: photoUrl,
      isProfilePicture: isProfilePicture || existingPhotosCount === 0,
      status: 'pending',
      uploadedAt: new Date(),
    });

    return photo;
  }

  async deletePhoto(userId: string, photoId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const photo = await this.photoModel.findOneAndDelete({ _id: new Types.ObjectId(photoId), userId: userObjectId });
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }
    return { success: true, message: 'Photo deleted successfully' };
  }

  async setProfilePicture(userId: string, photoId: string) {
    const userObjectId = new Types.ObjectId(userId);
    await this.photoModel.updateMany({ userId: userObjectId }, { isProfilePicture: false });
    const photo = await this.photoModel.findOneAndUpdate(
      { _id: new Types.ObjectId(photoId), userId: userObjectId },
      { isProfilePicture: true },
      { new: true },
    );
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }
    return photo;
  }

  async getCompleteness(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const profile = await this.profileModel.findOne({ userId: userObjectId });
    if (!profile) {
      return { percentage: 0, missingFields: ['Basic Information', 'Photos', 'Partner Preferences'] };
    }
    return this.calculateCompleteness(profile);
  }

  private calculateCompleteness(profile: MatrimonyProfileDocument) {
    const checks = [
      { field: 'fullName', label: 'Full Name', weight: 10 },
      { field: 'gender', label: 'Gender', weight: 10 },
      { field: 'dateOfBirth', label: 'Date of Birth', weight: 10 },
      { field: 'religion', label: 'Religion & Caste', weight: 10 },
      { field: 'education', label: 'Education', weight: 10 },
      { field: 'occupation', label: 'Occupation', weight: 10 },
      { field: 'currentCity', label: 'Current City', weight: 10 },
      { field: 'mobile', label: 'Mobile Number', weight: 10 },
      { field: 'rashi', label: 'Astrological Details (Rashi/Nakshatra)', weight: 10 },
      { field: 'partnerAgeMin', label: 'Partner Preferences', weight: 10 },
    ];

    let score = 0;
    const missingFields: string[] = [];

    for (const check of checks) {
      const val = (profile as any)[check.field];
      if (val !== undefined && val !== null && val !== '') {
        score += check.weight;
      } else {
        missingFields.push(check.label);
      }
    }

    return {
      percentage: Math.min(100, score),
      missingFields,
    };
  }
}
