import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(data: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({ data });
    this.eventEmitter.emit('notification.created', notification);
    return notification;
  }

  async findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Helper logic requested: Attendance Alerts
  async generateLowAttendanceAlert(studentId: string, percentage: number) {
    return this.create({
      title: 'Low Attendance Alert',
      message: `Your attendance has dropped to ${percentage}%. Please ensure regular attendance to avoid penalties.`,
      recipientId: studentId, // In real world, send to Parent ID as well
      type: 'WARNING',
    });
  }

  // Helper logic requested: Fee Due Alerts
  async generateFeeOverdueAlert(studentId: string, amount: number) {
    return this.create({
      title: 'Fee Overdue',
      message: `You have an overdue fee amount of ₹${amount}. Please clear it as soon as possible.`,
      recipientId: studentId, // In real world, send to Parent ID as well
      type: 'ERROR',
    });
  }
}
