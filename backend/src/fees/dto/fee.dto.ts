import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateFeePlanDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  billingCycle: string;

  @IsNumber()
  @IsOptional()
  dueDay?: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AssignFeePlanDto {
  @IsString()
  studentId: string;

  @IsString()
  feePlanId: string;

  @IsString()
  dueDate: string;
}
