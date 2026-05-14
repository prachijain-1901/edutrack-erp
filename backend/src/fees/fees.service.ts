import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeePlanDto, AssignFeePlanDto } from './dto/fee.dto';

@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlan(data: CreateFeePlanDto) {
    return this.prisma.feePlan.create({ data });
  }

  async getPlans() {
    return this.prisma.feePlan.findMany();
  }

  async assignPlan(data: AssignFeePlanDto) {
    const plan = await this.prisma.feePlan.findUnique({
      where: { id: data.feePlanId },
    });
    if (!plan) throw new NotFoundException('Fee plan not found');

    return this.prisma.studentFee.create({
      data: {
        studentId: data.studentId,
        feePlanId: data.feePlanId,
        amount: plan.amount,
        dueDate: new Date(data.dueDate),
        status: 'PENDING',
      },
    });
  }

  async getStudentFees(studentId: string) {
    return this.prisma.studentFee.findMany({
      where: { studentId },
      include: {
        feePlan: true,
        payments: true,
      },
      orderBy: { dueDate: 'desc' },
    });
  }

  async getPendingFees() {
    return this.prisma.studentFee.findMany({
      where: {
        status: { in: ['PENDING', 'OVERDUE', 'PARTIAL'] },
      },
      include: {
        student: true,
        feePlan: true,
        payments: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }
}
