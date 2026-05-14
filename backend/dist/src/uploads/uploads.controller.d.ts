import { UploadsService } from './uploads.service';
import { DocumentCategory } from '@prisma/client';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadStudentDocument(studentId: string, category: DocumentCategory, req: any, file: Express.Multer.File): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        studentId: string;
        fileUrl: string;
        fileType: string;
        publicId: string;
        size: number;
        uploadedBy: string;
        category: import("@prisma/client").$Enums.DocumentCategory;
    }>;
    getStudentDocuments(studentId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        studentId: string;
        fileUrl: string;
        fileType: string;
        publicId: string;
        size: number;
        uploadedBy: string;
        category: import("@prisma/client").$Enums.DocumentCategory;
    }[]>;
    deleteDocument(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        studentId: string;
        fileUrl: string;
        fileType: string;
        publicId: string;
        size: number;
        uploadedBy: string;
        category: import("@prisma/client").$Enums.DocumentCategory;
    }>;
}
