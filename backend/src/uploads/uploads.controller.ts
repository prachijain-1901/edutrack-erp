import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  Body, 
  UseGuards, 
  Request,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentCategory } from '@prisma/client';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('student/:studentId')
  @UseInterceptors(FileInterceptor('file'))
  uploadStudentDocument(
    @Param('studentId') studentId: string,
    @Body('category') category: DocumentCategory,
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB limit
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadStudentDocument(file, studentId, req.user.id, category);
  }

  @Get('student/:studentId')
  getStudentDocuments(@Param('studentId') studentId: string) {
    return this.uploadsService.getStudentDocuments(studentId);
  }

  @Delete(':id')
  deleteDocument(@Param('id') id: string) {
    return this.uploadsService.deleteDocument(id);
  }
}
