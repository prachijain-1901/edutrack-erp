import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudentStatus } from '@prisma/client';

export class CreateParentDto {
  @IsString()
  @IsOptional()
  fatherName?: string;

  @IsString()
  @IsOptional()
  motherName?: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  alternatePhone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  occupation?: string;
}

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  gender: string;

  @IsDateString()
  dob: string;

  @IsString()
  grade: string;

  @IsString()
  @IsOptional()
  schoolName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;

  @ValidateNested()
  @Type(() => CreateParentDto)
  parent: CreateParentDto;
}
