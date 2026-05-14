import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentCategory } from '@prisma/client';
export declare class UploadsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse | UploadApiErrorResponse>;
    deleteFromCloudinary(publicId: string): Promise<void>;
    uploadStudentDocument(file: Express.Multer.File, studentId: string, userId: string, category: DocumentCategory): Promise<{
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
