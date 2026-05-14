import { PrismaService } from '../prisma/prisma.service';
import { SendWhatsAppDto } from './dto/whatsapp.dto';
export declare class WhatsAppService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    sendMessage(dto: SendWhatsAppDto): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.WhatsAppStatus;
        message: string;
        recipient: string;
        templateId: string | null;
        sentAt: Date | null;
    }>;
    getLogs(skip?: number, take?: number): Promise<({
        template: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.MessageType;
            variables: string[];
            content: string;
        } | null;
    } & {
        error: string | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.WhatsAppStatus;
        message: string;
        recipient: string;
        templateId: string | null;
        sentAt: Date | null;
    })[]>;
    getStats(): Promise<{
        total: number;
        sent: number;
        failed: number;
        delivered: number;
    }>;
    retryFailedMessages(): Promise<{
        retried: number;
    }>;
}
