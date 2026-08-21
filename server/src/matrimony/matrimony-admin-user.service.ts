import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatrimonyUser, MatrimonyUserDocument, MatrimonyUserRole } from './schemas/matrimony-user.schema';
import { MatrimonyAuditLog, MatrimonyAuditLogDocument, AuditAction } from './schemas/matrimony-audit-log.schema';
import { CreateMatrimonyUserDto } from './dto/create-matrimony-user.dto';
import { MatrimonyAuthService } from './matrimony-auth.service';

@Injectable()
export class MatrimonyAdminUserService {
  constructor(
    @InjectModel(MatrimonyUser.name)
    private readonly userModel: Model<MatrimonyUserDocument>,
    @InjectModel(MatrimonyAuditLog.name)
    private readonly auditModel: Model<MatrimonyAuditLogDocument>,
    private readonly authService: MatrimonyAuthService,
  ) {}

  /** List all matrimony user accounts (admin view) */
  async listUsers(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel
        .find({})
        .select('-password_hash -otp_hash -otp_expires_at')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(),
    ]);
    return { users, total, page, limit };
  }

  /** Create a new matrimony user account (super_admin or staff with can_create_accounts) */
  async createUser(dto: CreateMatrimonyUserDto, actor: any, ipAddress?: string) {
    // Staff can only create USER-role accounts
    if (
      actor.role === MatrimonyUserRole.STAFF &&
      dto.role &&
      dto.role !== MatrimonyUserRole.USER
    ) {
      throw new ForbiddenException('Staff can only create user-role accounts');
    }

    const createdBy = actor?.username || actor?.user_code || 'SUPER_ADMIN';
    return this.authService.createUser(dto, createdBy, ipAddress);
  }

  /** Suspend or reactivate an account */
  async setAccountStatus(
    userCode: string,
    isActive: boolean,
    actor: any,
    ipAddress?: string,
  ) {
    const user = await this.userModel.findOne({ user_code: userCode.toUpperCase() });
    if (!user) throw new NotFoundException(`User ${userCode} not found`);

    await this.userModel.findByIdAndUpdate(user._id, { is_active: isActive });

    await this.auditModel.create({
      actor: actor.username,
      action: isActive ? AuditAction.ACCOUNT_REACTIVATED : AuditAction.ACCOUNT_SUSPENDED,
      target: user.user_code,
      meta: { changed_by: actor.username },
      ip_address: ipAddress,
    });

    return { success: true, user_code: userCode, is_active: isActive };
  }

  /** Force a user to reset their password on next login */
  async forcePasswordReset(userCode: string, actor: any, ipAddress?: string) {
    const user = await this.userModel.findOne({ user_code: userCode.toUpperCase() });
    if (!user) throw new NotFoundException(`User ${userCode} not found`);

    await this.userModel.findByIdAndUpdate(user._id, { must_reset_password: true });

    await this.auditModel.create({
      actor: actor.username,
      action: AuditAction.PASSWORD_RESET_FORCED,
      target: user.user_code,
      meta: { forced_by: actor.username },
      ip_address: ipAddress,
    });

    return { success: true, message: `Password reset flag set for ${userCode}` };
  }

  /** Update role or permissions */
  async updatePermissions(
    userCode: string,
    updates: { role?: MatrimonyUserRole; can_create_accounts?: boolean },
    actor: any,
    ipAddress?: string,
  ) {
    // Only super_admin can promote to admin/super_admin
    if (updates.role && [MatrimonyUserRole.ADMIN, MatrimonyUserRole.SUPER_ADMIN].includes(updates.role)) {
      if (actor.role !== MatrimonyUserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Only super_admin can grant elevated roles');
      }
    }

    const user = await this.userModel.findOne({ user_code: userCode.toUpperCase() });
    if (!user) throw new NotFoundException(`User ${userCode} not found`);

    await this.userModel.findByIdAndUpdate(user._id, updates);

    await this.auditModel.create({
      actor: actor.username,
      action: AuditAction.PERMISSION_CHANGED,
      target: user.user_code,
      meta: { updates, changed_by: actor.username },
      ip_address: ipAddress,
    });

    return { success: true, user_code: userCode, ...updates };
  }

  /** Get audit log for a specific user (for accountability) */
  async getAuditLog(userCode: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.auditModel
        .find({ $or: [{ actor: userCode }, { target: userCode }] })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.auditModel.countDocuments({ $or: [{ actor: userCode }, { target: userCode }] }),
    ]);
    return { logs, total, page, limit };
  }

  /** Full audit log (super_admin only) */
  async getFullAuditLog(page = 1, limit = 100) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.auditModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.auditModel.countDocuments(),
    ]);
    return { logs, total, page, limit };
  }
}
