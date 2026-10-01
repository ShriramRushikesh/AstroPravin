import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateMatrimonyOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['silver', 'gold', 'platinum'])
  planId: 'silver' | 'gold' | 'platinum';
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

  @IsNotEmpty()
  @IsString()
  @IsIn(['silver', 'gold', 'platinum'])
  planId: 'silver' | 'gold' | 'platinum';
}
