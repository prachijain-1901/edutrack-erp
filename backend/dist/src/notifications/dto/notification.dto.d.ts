import { NotificationType } from '@prisma/client';
export declare class CreateNotificationDto {
    title: string;
    message: string;
    recipientId: string;
    type: NotificationType;
}
