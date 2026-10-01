import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatrimonyUser, MatrimonyUserDocument } from '../schemas/matrimony-user.schema';

@Injectable()
export class MatrimonyJwtStrategy extends PassportStrategy(Strategy, 'matrimony-jwt') {
  constructor(
    configService: ConfigService,
    @InjectModel(MatrimonyUser.name) private userModel: Model<MatrimonyUserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'astropravin_matrimony_secret_jwt_2026',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub || payload.type !== 'matrimony') {
      throw new UnauthorizedException('Invalid matrimony token payload');
    }
    const user = await this.userModel.findById(payload.sub).select('-passwordHash');
    if (!user || user.status === 'deleted' || user.status === 'suspended') {
      throw new UnauthorizedException('Account is inactive, suspended, or deleted');
    }
    return user;
  }
}
