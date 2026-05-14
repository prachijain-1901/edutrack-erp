import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/announcement.dto';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    create(createAnnouncementDto: CreateAnnouncementDto, req: any): Promise<{
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
    update(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<{
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
