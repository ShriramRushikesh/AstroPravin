import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMatrimonyOrderDto {
  @IsOptional()
  @IsString()
  planId?: string;
}

export class VerifyMatrimonyPaymentDto {
  @IsNotEmpty()
  @IsString()
  razorpay_order_id: string;

  @IsNotEmpty()
  @IsString()
  razorpay_payment_id: string;

  @IsNotEmpty()
  @IsString()
  razorpay_signature: string;

  @IsOptional()
  @IsString()
  planId?: string;
}

