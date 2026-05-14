import { IsString, IsInt, IsOptional, IsEnum, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { BatchStatus } from '@prisma/client';

export class CreateBatchDto {
  @IsString()
  name: string;

  @IsString()
  subject: string;

  @IsString()
  grade: string;

  @IsInt()
  capacity: number;

  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsArray()
  @IsString({ each: true })
  days: string[];

  @IsEnum(BatchStatus)
  @IsOptional()
  status?: BatchStatus;

  @IsString()
  teacherId: string;
}

export class UpdateBatchDto extends PartialType(CreateBatchDto) {}
