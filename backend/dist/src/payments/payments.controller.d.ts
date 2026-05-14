import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './dto/payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
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
