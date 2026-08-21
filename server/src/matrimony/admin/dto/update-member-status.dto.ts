import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateMemberStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
