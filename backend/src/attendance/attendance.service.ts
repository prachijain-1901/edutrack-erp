import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarkAttendanceDto, BulkMarkAttendanceDto } from './dto/attendance.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ERP_EVENTS } from '../events/events.constants';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async markSingle(data: MarkAttendanceDto, userId: string) {
    const existing = await this.prisma.attendance.findUnique({
      where: {
        batchId_studentId_date: {
          batchId: data.batchId,
          studentId: data.studentId,
          date: new Date(data.date),
        },
      },
    });

    let attendance;

    if (existing) {
      attendance = await this.prisma.attendance.update({
        where: { id: existing.id },
        data: { status: data.status, remarks: data.remarks, markedBy: userId },
      });
    } else {
      attendance = await this.prisma.attendance.create({
        data: {
          studentId: data.studentId,
          batchId: data.batchId,
          date: new Date(data.date),
          status: data.status,
          remarks: data.remarks,
          markedBy: userId,
        },
      });
    }

    // Emit events
    this.eventEmitter.emit(ERP_EVENTS.ATTENDANCE.MARKED, { attendanceId: attendance.id });
    if (attendance.status === 'ABSENT') {
      this.eventEmitter.emit(ERP_EVENTS.ATTENDANCE.ABSENT, { 
        studentId: attendance.studentId, 
        batchId: attendance.batchId, 
        date: attendance.date 
      });
    }

    return attendance;
  }

  async markBulk(data: BulkMarkAttendanceDto, userId: string) {
    const results = await Promise.all(
      data.records.map((record) => this.markSingle(record, userId))
    );
    return results;
  }

  async getByBatch(batchId: string, date: string) {
    return this.prisma.attendance.findMany({
      where: {
        batchId,
        date: new Date(date),
      },
      include: {
        student: true,
      },
    });
  }

  async getByStudent(studentId: string, limit: number = 30) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        batch: true,
      },
    });
  }

  async getSummary(date?: string, batchId?: string) {
    const whereClause: any = {};
    if (date) whereClause.date = new Date(date);
    if (batchId) whereClause.batchId = batchId;

    const records = await this.prisma.attendance.findMany({ where: whereClause });
    
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;

    records.forEach((r) => {
      if (r.status === 'PRESENT') present++;
      else if (r.status === 'ABSENT') absent++;
      else if (r.status === 'LATE') late++;
      else if (r.status === 'LEAVE') leave++;
    });

    const total = present + absent + late + leave;
    const percentage = total === 0 ? 0 : Math.round((present + late) / total * 100);

    return {
      present,
      absent,
      late,
      leave,
      total,
      percentage,
    };
  }
}
