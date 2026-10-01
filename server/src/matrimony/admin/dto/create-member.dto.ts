import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsOptional()
  @IsNumber()
  membershipAmount?: number;

  @IsOptional()
  @IsString()
  membershipMode?: string;

  @IsOptional()
  @IsString()
  membershipReceiptNumber?: string;

  @IsOptional()
  @IsString()
  tier?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
