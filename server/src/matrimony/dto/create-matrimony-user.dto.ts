import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { MatrimonyUserRole } from '../schemas/matrimony-user.schema';

export class CreateMatrimonyUserDto {
  @IsString()
  @IsNotEmpty()
  user_code: string; // e.g. "MP-2024-001"

  @IsString()
  @IsNotEmpty()
  username: string;

  /** Temporary password — user will be forced to reset on first login */
  @IsString()
  @IsNotEmpty()
  initial_password: string;

  @IsEnum(MatrimonyUserRole)
  @IsOptional()
  role?: MatrimonyUserRole;

  @IsBoolean()
  @IsOptional()
  can_create_accounts?: boolean;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
