import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class MatrimonySubmitPaymentDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsOptional()
  paymentMode?: string; // upi, gpay, phonepe, paytm, netbanking, qr

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  instantVerify?: boolean;
}
