import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsObject } from 'class-validator';

export class SendWhatsAppDto {
  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsObject()
  @IsOptional()
  variables?: Record<string, string>;
}

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  variables?: string[];

  @IsString()
  @IsOptional()
  type?: 'TRANSACTIONAL' | 'PROMOTIONAL' | 'OTP';
}
