import { PrismaService } from '../prisma/prisma.service';
import { RecordPaymentDto } from './dto/payment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PaymentsService {
    private readonly prisma;
    private readonly eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    recordPayment(data: RecordPaymentDto): Promise<{
        id: string;
        createdAt: Date;
        amount: number;
        studentFeeId: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        utrNumber: string | null;
        receiptNumber: string;
        notes: string | null;
        paidAt: Date;
    }>;
    getPaymentsByStudent(studentId: string): Promise<({
        studentFee: {
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            studentId: string;
            dueDate: Date;
            feePlanId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        amount: number;
        studentFeeId: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        utrNumber: string | null;
        receiptNumber: string;
        notes: string | null;
        paidAt: Date;
    })[]>;
}
