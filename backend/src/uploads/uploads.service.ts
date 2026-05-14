import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentCategory } from '@prisma/client';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  uploadImage(file: Express.Multer.File, folder: string = 'edutrack'): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFromCloudinary(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete from cloudinary:', error);
    }
  }

  async uploadStudentDocument(
    file: Express.Multer.File,
    studentId: string,
    userId: string,
    category: DocumentCategory,
  ) {
    // 1. Upload to Cloudinary
    let cloudResult;
    try {
      cloudResult = await this.uploadImage(file, `edutrack/students/${studentId}`);
    } catch (e) {
      throw new BadRequestException('Failed to upload file to storage');
    }

    // 2. Save to DB
    return this.prisma.document.create({
      data: {
        name: file.originalname,
        fileUrl: cloudResult.secure_url,
        fileType: file.mimetype,
        publicId: cloudResult.public_id,
        size: file.size,
        uploadedBy: userId,
        category,
        studentId,
      },
    });
  }

  async getStudentDocuments(studentId: string) {
    return this.prisma.document.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // 1. Delete from Cloudinary
    await this.deleteFromCloudinary(document.publicId);

    // 2. Delete from DB
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
