import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsString()
  birthTime?: string;

  @IsOptional()
  @IsString()
  tob?: string;

  @IsOptional()
  @IsString()
  birthPlace?: string;

  @IsOptional()
  @IsString()
  pob?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  astrologer?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  preferredDate?: string;

  @IsOptional()
  @IsString()
  preferredTime?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  amount?: number;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  paymentDetails?: any;

  @IsOptional()
  @IsString()
  receiptNumber?: string;
}

export class CreateBookingRazorpayOrderDto {
  @IsOptional()
  amount?: number;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class VerifyAndCreateBookingDto {
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
  bookingData: CreateBookingDto;

  @IsOptional()
  amount?: number;
}
