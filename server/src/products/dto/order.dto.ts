import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class CreateStoreRazorpayOrderDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  items?: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    carat?: string;
    image?: string;
    category?: string;
  }>;

  @IsOptional()
  @IsObject()
  customer?: {
    name: string;
    phone: string;
    email?: string;
  };

  @IsOptional()
  @IsObject()
  shipping?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
}

export class VerifyStorePaymentDto {
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
  @IsArray()
  items?: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    carat?: string;
    image?: string;
    category?: string;
  }>;

  @IsOptional()
  @IsObject()
  customer?: {
    name: string;
    phone: string;
    email?: string;
  };

  @IsOptional()
  @IsObject()
  shipping?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  courierName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
