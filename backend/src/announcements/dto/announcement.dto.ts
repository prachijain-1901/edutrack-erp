import { IsString, IsEnum, IsOptional } from 'class-validator';
import { AnnouncementType, TargetAudience } from '@prisma/client';

export class CreateAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(AnnouncementType)
  type: AnnouncementType;

  @IsEnum(TargetAudience)
  targetAudience: TargetAudience;
}

export class UpdateAnnouncementDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsEnum(AnnouncementType)
  @IsOptional()
  type?: AnnouncementType;

  @IsEnum(TargetAudience)
  @IsOptional()
  targetAudience?: TargetAudience;
}
