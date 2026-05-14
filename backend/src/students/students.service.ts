import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Prisma, StudentStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ERP_EVENTS } from '../events/events.constants';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { parent, ...studentData } = createStudentDto;

    const student = await this.prisma.student.create({
      data: {
        ...studentData,
        parent: {
          create: parent,
        },
      },
    });

    this.eventEmitter.emit(ERP_EVENTS.STUDENT.CREATED, { studentId: student.id });

    return student;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    status?: StudentStatus;
    grade?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { skip = 0, take = 10, search, status, grade, sortBy, sortOrder } = params;

    const where: Prisma.StudentWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (grade) {
      where.grade = grade;
    }

    const orderBy: Prisma.StudentOrderByWithRelationInput = {};
    if (sortBy) {
      (orderBy as any)[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        orderBy,
        include: {
          parent: true,
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data: students,
      meta: {
        total,
        page: Math.floor(Number(skip) / Number(take)) + 1,
        limit: Number(take),
        totalPages: Math.ceil(total / Number(take)),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        parent: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { parent, ...studentData } = updateStudentDto as any;

    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        ...studentData,
        ...(parent && {
          parent: {
            update: parent,
          },
        }),
      },
      include: {
        parent: true,
      },
    });
  }

  async remove(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return this.prisma.student.delete({
      where: { id },
    });
  }
}
