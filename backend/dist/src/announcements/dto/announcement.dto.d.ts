import { AnnouncementType, TargetAudience } from '@prisma/client';
export declare class CreateAnnouncementDto {
    title: string;
    message: string;
    type: AnnouncementType;
    targetAudience: TargetAudience;
}
export declare class UpdateAnnouncementDto {
    title?: string;
    message?: string;
    type?: AnnouncementType;
    targetAudience?: TargetAudience;
}
