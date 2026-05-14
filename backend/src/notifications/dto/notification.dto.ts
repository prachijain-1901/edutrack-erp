import { IsString, IsEnum } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  recipientId: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}
