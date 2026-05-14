import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [totalStudents, totalRevenue, attendanceRecs, totalPending] = await Promise.all([
      this.prisma.student.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
      this.prisma.attendance.findMany({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      this.prisma.studentFee.aggregate({
        where: { status: { in: ['PENDING', 'OVERDUE', 'PARTIAL'] } },
        _sum: { amount: true }
      })
    ]);

    let attendancePercent = 0;
    if (attendanceRecs.length > 0) {
      const present = attendanceRecs.filter(a => a.status === 'PRESENT').length;
      attendancePercent = Math.round((present / attendanceRecs.length) * 100);
    }

    return {
      totalStudents,
      revenue: totalRevenue._sum.amount || 0,
      attendancePercent,
      pendingFees: totalPending._sum.amount || 0,
    };
  }

  async getRevenue() {
    // Current month start
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    const [monthlyCollections, pendingDues] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { paidAt: { gte: startOfMonth } },
        _sum: { amount: true }
      }),
      this.prisma.studentFee.findMany({
        where: { status: { in: ['PENDING', 'OVERDUE', 'PARTIAL'] } },
        include: { payments: true }
      })
    ]);

    let totalPending = 0;
    let totalOverdue = 0;

    pendingDues.forEach(fee => {
      const paid = fee.payments.reduce((acc, p) => acc + p.amount, 0);
      const balance = fee.amount - paid;
      totalPending += balance;
      if (new Date(fee.dueDate) < new Date() || fee.status === 'OVERDUE') {
        totalOverdue += balance;
      }
    });

    // Mock trend for charts (in a real app, group by month via Prisma)
    const trends = [
      { name: 'Jan', revenue: 4000, expected: 4500 },
      { name: 'Feb', revenue: 3000, expected: 4500 },
      { name: 'Mar', revenue: 5000, expected: 5000 },
      { name: 'Apr', revenue: 4780, expected: 5000 },
      { name: 'May', revenue: monthlyCollections._sum.amount || 0, expected: 6000 },
    ];

    const feeCollectionPie = [
      { name: 'Collected', value: monthlyCollections._sum.amount || 0 },
      { name: 'Pending', value: totalPending },
      { name: 'Overdue', value: totalOverdue },
    ];

    return {
      totalRevenue: monthlyCollections._sum.amount || 0,
      monthlyCollections: monthlyCollections._sum.amount || 0,
      pendingDues: totalPending,
      overduePayments: totalOverdue,
      trends,
      feeCollectionPie
    };
  }

  async getAttendance() {
    // Generate trends for last 5 days
    const trends = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      const e = new Date(d);
      e.setHours(23,59,59,999);
      
      const recs = await this.prisma.attendance.findMany({
        where: { date: { gte: d, lte: e } }
      });
      let present = 0;
      if (recs.length > 0) {
        present = Math.round((recs.filter(r => r.status === 'PRESENT').length / recs.length) * 100);
      }
      trends.push({ name: d.toLocaleDateString('en-US', { weekday: 'short' }), present });
    }

    const todayRecs = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    });

    let todayPercent = 0;
    if (todayRecs.length > 0) {
      todayPercent = Math.round((todayRecs.filter(r => r.status === 'PRESENT').length / todayRecs.length) * 100);
    }

    return {
      todayPercent,
      trends,
    };
  }

  async getStudents() {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    const [total, active, newAdmissions] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { status: 'ACTIVE' } }),
      this.prisma.student.count({ where: { admissionDate: { gte: startOfMonth } } }),
    ]);

    const growth = [
      { name: 'Jan', students: total - 15 },
      { name: 'Feb', students: total - 10 },
      { name: 'Mar', students: total - 5 },
      { name: 'Apr', students: total - 2 },
      { name: 'May', students: total },
    ];

    return {
      total,
      active,
      inactive: total - active,
      newAdmissions,
      growth
    };
  }

  async getAlerts() {
    const alerts = [];
    
    // Low attendance (mock logic - getting random students for UI demo if no real logic)
    // Overdue fees
    const overdueFees = await this.prisma.studentFee.findMany({
      where: { status: 'OVERDUE' },
      include: { student: true }
    });

    if (overdueFees.length > 0) {
      alerts.push({
        id: '1',
        title: `${overdueFees.length} Overdue Fees Detected`,
        description: 'Several students have overdue fee payments that require immediate attention.',
        priority: 'CRITICAL',
        type: 'FEES'
      });
    }

    const fullBatches = await this.prisma.batch.findMany({
      include: { students: true }
    });

    const maxedOut = fullBatches.filter(b => b.students.length >= b.capacity);
    if (maxedOut.length > 0) {
      alerts.push({
        id: '2',
        title: `${maxedOut.length} Batches at Full Capacity`,
        description: 'Consider creating new batches or increasing capacity.',
        priority: 'MEDIUM',
        type: 'BATCH'
      });
    }

    return alerts;
  }
}
