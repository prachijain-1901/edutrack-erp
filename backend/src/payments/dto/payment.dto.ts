import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class RecordPaymentDto {
  @IsString()
  studentFeeId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  utrNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
