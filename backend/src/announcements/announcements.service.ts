import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAnnouncementDto, userId: string) {
    return this.prisma.announcement.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  async findAll(type?: string, targetAudience?: string) {
    const where: any = {};
    if (type) where.type = type;
    if (targetAudience) where.targetAudience = targetAudience;

    return this.prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!announcement) throw new NotFoundException('Announcement not found');
    return announcement;
  }

  async update(id: string, data: UpdateAnnouncementDto) {
    return this.prisma.announcement.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
