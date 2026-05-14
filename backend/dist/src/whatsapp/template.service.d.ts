import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/whatsapp.dto';
export declare class TemplateService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    getTemplateByName(name: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        variables: string[];
        content: string;
    }>;
    formatMessage(content: string, variables: Record<string, string>): string;
}
