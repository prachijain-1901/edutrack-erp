import { WhatsAppService } from './whatsapp.service';
import { TemplateService } from './template.service';
import { SendWhatsAppDto, CreateTemplateDto } from './dto/whatsapp.dto';
export declare class WhatsAppController {
    private readonly whatsappService;
    private readonly templateService;
    constructor(whatsappService: WhatsAppService, templateService: TemplateService);
    send(dto: SendWhatsAppDto): Promise<{
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
    retry(): Promise<{
        retried: number;
    }>;
    createTemplate(dto: CreateTemplateDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        variables: string[];
        content: string;
    }>;
    getTemplates(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        variables: string[];
        content: string;
    }[]>;
}
