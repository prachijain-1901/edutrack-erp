import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  create(createTeacherDto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: createTeacherDto,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
  }) {
    const { skip = 0, take = 10, search } = params;
    const where: Prisma.TeacherWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: { _count: { select: { batches: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.teacher.count({ where }),
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
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { batches: true },
    });
    if (!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
    return this.prisma.teacher.update({
      where: { id },
      data: updateTeacherDto,
    });
  }

  async remove(id: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
    return this.prisma.teacher.delete({ where: { id } });
  }
}
