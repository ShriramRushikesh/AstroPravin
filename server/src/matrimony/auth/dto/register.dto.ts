import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export class MatrimonyRegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string; // YYYY-MM-DD

  @IsString()
  @IsOptional()
  caste?: string;

  @IsString()
  @IsOptional()
  subCaste?: string;

  @IsString()
  @IsOptional()
  religion?: string;

  @IsString()
  @IsOptional()
  currentCity?: string;

  @IsString()
  @IsOptional()
  currentState?: string;

  @IsString()
  @IsOptional()
  motherTongue?: string;

  @IsString()
  @IsOptional()
  profileCreatedBy?: string; // Self, Parents, Sibling, Relative
}
