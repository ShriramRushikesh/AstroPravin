import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MatrimonyUser, MatrimonyUserDocument, MatrimonyUserRole } from './schemas/matrimony-user.schema';
import { MatrimonyAuditLog, MatrimonyAuditLogDocument, AuditAction } from './schemas/matrimony-audit-log.schema';
import { EmailService } from '../shared/email.service';
import {
  MatrimonyLoginDto,
  ResetPasswordDto,
  ForgotPasswordDto,
  VerifyOtpDto,
} from './dto/matrimony-auth.dto';
import { CreateMatrimonyUserDto } from './dto/create-matrimony-user.dto';

const BCRYPT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 10;

@Injectable()
export class MatrimonyAuthService {
  constructor(
    @InjectModel(MatrimonyUser.name)
    private readonly userModel: Model<MatrimonyUserDocument>,
    @InjectModel(MatrimonyAuditLog.name)
    private readonly auditModel: Model<MatrimonyAuditLogDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // ── Admin: Create user account ─────────────────────────────────────────────
  async createUser(
    dto: CreateMatrimonyUserDto,
    createdBy: string,
    ipAddress?: string,
  ) {
    // Check for duplicates
    const existingCode = await this.userModel.findOne({ user_code: dto.user_code.toUpperCase() });
    if (existingCode) {
      throw new ConflictException(`User code "${dto.user_code}" already exists`);
    }
    const existingUsername = await this.userModel.findOne({ username: dto.username.toLowerCase() });
    if (existingUsername) {
      throw new ConflictException(`Username "${dto.username}" is already taken`);
    }

    const password_hash = await bcrypt.hash(dto.initial_password, BCRYPT_ROUNDS);

    const user = await this.userModel.create({
      user_code: dto.user_code.toUpperCase(),
      username: dto.username.toLowerCase(),
      password_hash,
      must_reset_password: true, // Non-negotiable on account creation
      role: dto.role ?? MatrimonyUserRole.USER,
      can_create_accounts: dto.can_create_accounts ?? false,
      is_active: true,
      created_by: createdBy,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
    });

    // Write audit log — never log the password
    await this.writeAudit({
      actor: createdBy,
      action: AuditAction.ACCOUNT_CREATED,
      target: user.user_code,
      meta: { username: user.username, role: user.role, email: user.email },
      ip_address: ipAddress,
    });

    return {
      success: true,
      user_code: user.user_code,
      username: user.username,
      role: user.role,
      must_reset_password: user.must_reset_password,
      created_at: (user as any).createdAt,
    };
  }

  // ── User: Login ────────────────────────────────────────────────────────────
  async login(dto: MatrimonyLoginDto, ipAddress?: string) {
    const user = await this.userModel.findOne({ username: dto.username.toLowerCase() });

    if (!user) {
      await this.writeAudit({
        actor: dto.username,
        action: AuditAction.LOGIN_FAILED,
        target: dto.username,
        meta: { reason: 'user_not_found' },
        ip_address: ipAddress,
      });
      throw new UnauthorizedException('Invalid username or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('This account has been suspended. Please contact admin.');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordMatch) {
      await this.writeAudit({
        actor: dto.username,
        action: AuditAction.LOGIN_FAILED,
        target: user.user_code,
        meta: { reason: 'wrong_password' },
        ip_address: ipAddress,
      });
      throw new UnauthorizedException('Invalid username or password');
    }

    await this.writeAudit({
      actor: user.username,
      action: AuditAction.LOGIN_SUCCESS,
      target: user.user_code,
      ip_address: ipAddress,
    });

    const payload = {
      sub: user._id,
      user_code: user.user_code,
      username: user.username,
      role: user.role,
      profile_id: user.profile_id,
      must_reset_password: user.must_reset_password,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      token,
      must_reset_password: user.must_reset_password,
      user_code: user.user_code,
      username: user.username,
      role: user.role,
    };
  }

  // ── User: Forced password reset (first login) ──────────────────────────────
  async resetPassword(userId: string, dto: ResetPasswordDto, ipAddress?: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const passwordMatch = await bcrypt.compare(dto.current_password, user.password_hash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.new_password === dto.current_password) {
      throw new BadRequestException('New password must be different from current password');
    }

    const new_hash = await bcrypt.hash(dto.new_password, BCRYPT_ROUNDS);
    await this.userModel.findByIdAndUpdate(userId, {
      password_hash: new_hash,
      must_reset_password: false,
    });

    await this.writeAudit({
      actor: user.username,
      action: AuditAction.PASSWORD_RESET_FORCED,
      target: user.user_code,
      ip_address: ipAddress,
    });

    return { success: true, message: 'Password updated. Please log in again.' };
  }

  // ── User: Self-service forgot password (email OTP) ─────────────────────────
  async forgotPassword(dto: ForgotPasswordDto, ipAddress?: string) {
    const user = await this.userModel.findOne({ username: dto.username.toLowerCase() });

    // Always return same response to prevent username enumeration
    const genericResponse = {
      success: true,
      message: 'If this account exists and has an email registered, an OTP has been sent.',
    };

    if (!user || !user.email || !user.is_active) return genericResponse;

    const otp = this.generateOtp();
    const otp_hash = await bcrypt.hash(otp, 10);
    const otp_expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.userModel.findByIdAndUpdate(user._id, { otp_hash, otp_expires_at });

    // Send OTP via existing EmailService — never log the OTP
    await this.sendOtpEmail(user.email, user.username, otp);

    return genericResponse;
  }

  // ── User: Verify OTP + set new password ───────────────────────────────────
  async verifyOtpAndReset(dto: VerifyOtpDto, ipAddress?: string) {
    const user = await this.userModel.findOne({ username: dto.username.toLowerCase() });

    if (!user || !user.otp_hash || !user.otp_expires_at) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (new Date() > user.otp_expires_at) {
      // Clear expired OTP
      await this.userModel.findByIdAndUpdate(user._id, { otp_hash: null, otp_expires_at: null });
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    const otpMatch = await bcrypt.compare(dto.otp, user.otp_hash);
    if (!otpMatch) {
      throw new BadRequestException('Invalid OTP');
    }

    const new_hash = await bcrypt.hash(dto.new_password, BCRYPT_ROUNDS);
    await this.userModel.findByIdAndUpdate(user._id, {
      password_hash: new_hash,
      must_reset_password: false,
      otp_hash: null,
      otp_expires_at: null,
    });

    await this.writeAudit({
      actor: user.username,
      action: AuditAction.PASSWORD_RESET_SELF,
      target: user.user_code,
      ip_address: ipAddress,
    });

    return { success: true, message: 'Password reset successful. Please log in.' };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private generateOtp(): string {
    // 6-digit numeric OTP
    return String(crypto.randomInt(100000, 999999));
  }

  private async sendOtpEmail(to: string, name: string, otp: string) {
    // Reuse existing EmailService but with custom mail — extend it minimally
    try {
      const transporter = (this.emailService as any).transporter;
      if (!transporter) return;

      await transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject: 'Astro Pravin Matrimony — Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 480px;">
            <h2 style="color: #D97706;">Password Reset Request</h2>
            <p>Namaste <strong>${name}</strong>,</p>
            <p>Your One-Time Password (OTP) for resetting your matrimony account password:</p>
            <div style="font-size: 32px; font-weight: bold; color: #D97706; letter-spacing: 8px; padding: 16px 0;">${otp}</div>
            <p>This OTP is valid for <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
            <p style="color: #999; font-size: 12px;">
              If you did not request this, please ignore this email. Do not share this OTP with anyone.
            </p>
            <hr />
            <p><em>|| Shri Swami Samarth ||</em></p>
          </div>
        `,
      });
    } catch (error) {
      // OTP email failure is non-fatal — log but don't expose to client
      console.error('OTP email failed:', error?.message);
    }
  }

  private async writeAudit(params: {
    actor: string;
    action: AuditAction;
    target: string;
    meta?: Record<string, any>;
    ip_address?: string;
  }) {
    try {
      await this.auditModel.create({
        actor: params.actor,
        action: params.action,
        target: params.target,
        meta: params.meta ?? {},
        ip_address: params.ip_address ?? null,
      });
    } catch (err) {
      // Audit log failure must never block the actual operation
      console.error('Audit log write failed:', err?.message);
    }
  }
}
