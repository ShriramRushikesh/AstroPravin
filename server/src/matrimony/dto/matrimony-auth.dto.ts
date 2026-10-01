import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class MatrimonyLoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}
