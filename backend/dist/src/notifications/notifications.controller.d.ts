import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        recipientId: string;
        isRead: boolean;
    }[]>;
    markAllAsRead(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        recipientId: string;
        isRead: boolean;
    }>;
}
