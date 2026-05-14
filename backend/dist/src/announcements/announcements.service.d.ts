import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/announcement.dto';
export declare class AnnouncementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAnnouncementDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.AnnouncementType;
        targetAudience: import("@prisma/client").$Enums.TargetAudience;
        createdBy: string | null;
    }>;
    findAll(type?: string, targetAudience?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.AnnouncementType;
        targetAudience: import("@prisma/client").$Enums.TargetAudience;
        createdBy: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.AnnouncementType;
        targetAudience: import("@prisma/client").$Enums.TargetAudience;
        createdBy: string | null;
    }>;
    update(id: string, data: UpdateAnnouncementDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.AnnouncementType;
        targetAudience: import("@prisma/client").$Enums.TargetAudience;
        createdBy: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.AnnouncementType;
        targetAudience: import("@prisma/client").$Enums.TargetAudience;
        createdBy: string | null;
    }>;
}
