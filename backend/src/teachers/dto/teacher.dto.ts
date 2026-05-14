import { IsString, IsEmail, IsOptional, IsArray, IsNumber, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTeacherDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  qualification?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @IsDateString()
  @IsOptional()
  joiningDate?: string;

  @IsString()
  @IsOptional()
  salaryType?: string;

  @IsNumber()
  @IsOptional()
  salaryAmount?: number;
}

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}
