import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class NotificationsService {
    private readonly prisma;
    private readonly eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    create(data: CreateNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        recipientId: string;
        isRead: boolean;
    }>;
    findAllForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        recipientId: string;
        isRead: boolean;
    }[]>;
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
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    generateLowAttendanceAlert(studentId: string, percentage: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        recipientId: string;
        isRead: boolean;
    }>;
    generateFeeOverdueAlert(studentId: string, amount: number): Promise<{
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
