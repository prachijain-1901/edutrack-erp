import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto, UpdateBatchDto } from './dto/batch.dto';
import { Prisma, BatchStatus } from '@prisma/client';

@Injectable()
export class BatchesService {
  constructor(private prisma: PrismaService) {}

  create(createBatchDto: CreateBatchDto) {
    return this.prisma.batch.create({
      data: createBatchDto,
      include: { teacher: true },
    });
  }

  async findAll(params: { skip?: number; take?: number; search?: string; status?: BatchStatus; teacherId?: string }) {
    const { skip = 0, take = 10, search, status, teacherId } = params;
    const where: Prisma.BatchWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (teacherId) where.teacherId = teacherId;

    const [data, total] = await Promise.all([
      this.prisma.batch.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: { 
          teacher: true,
          _count: { select: { students: true } }
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.batch.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Math.floor(Number(skip) / Number(take)) + 1,
        limit: Number(take),
        totalPages: Math.ceil(total / Number(take)),
      },
    };
  }

  async findOne(id: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        teacher: true,
        students: {
          include: { student: true }
        }
      },
    });
    if (!batch) throw new NotFoundException(`Batch with ID ${id} not found`);
    return batch;
  }

  async update(id: string, updateBatchDto: UpdateBatchDto) {
    const batch = await this.prisma.batch.findUnique({ where: { id } });
    if (!batch) throw new NotFoundException(`Batch with ID ${id} not found`);
    return this.prisma.batch.update({
      where: { id },
      data: updateBatchDto,
      include: { teacher: true },
    });
  }

  async remove(id: string) {
    const batch = await this.prisma.batch.findUnique({ where: { id } });
    if (!batch) throw new NotFoundException(`Batch with ID ${id} not found`);
    return this.prisma.batch.delete({ where: { id } });
  }

  // ─── STUDENT ASSIGNMENT ──────────────────────────────────────────────────

  async assignStudent(batchId: string, studentId: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      include: { _count: { select: { students: true } } }
    });

    if (!batch) throw new NotFoundException(`Batch with ID ${batchId} not found`);
    
    if (batch._count.students >= batch.capacity) {
      throw new BadRequestException('Batch is already at full capacity');
    }

    const existing = await this.prisma.studentBatch.findUnique({
      where: { studentId_batchId: { studentId, batchId } }
    });

    if (existing) {
      throw new BadRequestException('Student is already assigned to this batch');
    }

    return this.prisma.studentBatch.create({
      data: { studentId, batchId },
    });
  }

  async removeStudent(batchId: string, studentId: string) {
    const existing = await this.prisma.studentBatch.findUnique({
      where: { studentId_batchId: { studentId, batchId } }
    });

    if (!existing) {
      throw new NotFoundException('Student is not assigned to this batch');
    }

    return this.prisma.studentBatch.delete({
      where: { studentId_batchId: { studentId, batchId } }
    });
  }
}
