import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverview(): Promise<{
        totalStudents: number;
        revenue: number;
        attendancePercent: number;
        pendingFees: number;
    }>;
    getRevenue(): Promise<{
        totalRevenue: number;
        monthlyCollections: number;
        pendingDues: number;
        overduePayments: number;
        trends: {
            name: string;
            revenue: number;
            expected: number;
        }[];
        feeCollectionPie: {
            name: string;
            value: number;
        }[];
    }>;
    getAttendance(): Promise<{
        todayPercent: number;
        trends: {
            name: string;
            present: number;
        }[];
    }>;
    getStudents(): Promise<{
        total: number;
        active: number;
        inactive: number;
        newAdmissions: number;
        growth: {
            name: string;
            students: number;
        }[];
    }>;
    getAlerts(): Promise<{
        id: string;
        title: string;
        description: string;
        priority: string;
        type: string;
    }[]>;
}
