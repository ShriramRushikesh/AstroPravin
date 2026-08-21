import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { InterestStatus } from '../schemas/matrimony-interest.schema';
import { PlanTier } from '../schemas/matrimony-subscription.schema';

export class SendInterestDto {
  @IsString()
  @IsNotEmpty()
  to_profile_id: string;

  @IsString()
  @IsOptional()
  message?: string;
}

export class RespondInterestDto {
  @IsEnum(InterestStatus)
  status: InterestStatus;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  receiver_profile_id: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class AssignSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  profile_id: string;

  @IsEnum(PlanTier)
  plan_tier: PlanTier;

  @IsNumber()
  @Min(1)
  duration_days: number;

  @IsNumber()
  @IsOptional()
  amount_paid?: number;

  @IsString()
  @IsOptional()
  payment_method?: string;

  @IsString()
  @IsOptional()
  payment_reference?: string;
}
