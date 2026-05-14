import { IsString, IsEnum, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client';

export class MarkAttendanceDto {
  @IsString()
  studentId: string;

  @IsString()
  batchId: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class BulkMarkAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkAttendanceDto)
  records: MarkAttendanceDto[];
}
