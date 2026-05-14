import { PrismaService } from '../prisma/prisma.service';
import { CreateFeePlanDto, AssignFeePlanDto } from './dto/fee.dto';
export declare class FeesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPlan(data: CreateFeePlanDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        billingCycle: string;
        dueDay: number | null;
        description: string | null;
    }>;
    getPlans(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        billingCycle: string;
        dueDay: number | null;
        description: string | null;
    }[]>;
    assignPlan(data: AssignFeePlanDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: number;
        studentId: string;
        dueDate: Date;
        feePlanId: string;
    }>;
    getStudentFees(studentId: string): Promise<({
        feePlan: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            billingCycle: string;
            dueDay: number | null;
            description: string | null;
        };
        payments: {
            id: string;
            createdAt: Date;
            amount: number;
            studentFeeId: string;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            utrNumber: string | null;
            receiptNumber: string;
            notes: string | null;
            paidAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: number;
        studentId: string;
        dueDate: Date;
        feePlanId: string;
    })[]>;
    getPendingFees(): Promise<({
        feePlan: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            billingCycle: string;
            dueDay: number | null;
            description: string | null;
        };
        student: {
            id: string;
            email: string | null;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            state: string | null;
            photo: string | null;
            grade: string;
            status: import("@prisma/client").$Enums.StudentStatus;
            firstName: string;
            lastName: string;
            gender: string;
            dob: Date;
            schoolName: string | null;
            bloodGroup: string | null;
            admissionDate: Date;
            parentId: string;
        };
        payments: {
            id: string;
            createdAt: Date;
            amount: number;
            studentFeeId: string;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            utrNumber: string | null;
            receiptNumber: string;
            notes: string | null;
            paidAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: number;
        studentId: string;
        dueDate: Date;
        feePlanId: string;
    })[]>;
}
