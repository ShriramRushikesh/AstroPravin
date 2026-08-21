import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MatrimonyUser, MatrimonyUserDocument } from '../schemas/matrimony-user.schema';
import { MatrimonyProfile, MatrimonyProfileDocument } from '../schemas/matrimony-profile.schema';
import { MatrimonyLoginDto } from './dto/login.dto';
import { MatrimonyChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class MatrimonyAuthService {
  constructor(
    @InjectModel(MatrimonyUser.name) private userModel: Model<MatrimonyUserDocument>,
    @InjectModel(MatrimonyProfile.name) private profileModel: Model<MatrimonyProfileDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: MatrimonyLoginDto) {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username: username.trim() });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.status === 'suspended' || user.status === 'deleted') {
      throw new UnauthorizedException('Your matrimony account is suspended or deactivated. Contact support.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const profile = await this.profileModel.findOne({ userId: user._id });

    const payload = {
      sub: user._id.toString(),
      username: user.username,
      tier: user.tier,
      type: 'matrimony',
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        userId: user._id,
        username: user.username,
        tier: user.tier,
        status: user.status,
        isFirstLogin: user.isFirstLogin,
        membershipPaidAt: user.membershipPaidAt,
      },
      profile: profile
        ? {
            id: profile._id,
            fullName: profile.fullName,
            gender: profile.gender,
            completeness: profile.profileCompleteness || 0,
            isContactVisible: profile.isContactVisible,
            isProfileFeatured: profile.isProfileFeatured,
          }
        : null,
    };
  }

  async changePassword(userId: string, changePasswordDto: MatrimonyChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.isFirstLogin = false;
    await user.save();

    return {
      success: true,
      message: 'Password changed successfully',
      isFirstLogin: false,
    };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const profile = await this.profileModel.findOne({ userId: user._id });

    return {
      user: {
        userId: user._id,
        username: user.username,
        tier: user.tier,
        status: user.status,
        isFirstLogin: user.isFirstLogin,
        membershipPaidAt: user.membershipPaidAt,
      },
      profile,
    };
  }
}
