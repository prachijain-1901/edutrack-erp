import { PaymentMethod } from '@prisma/client';
export declare class RecordPaymentDto {
    studentFeeId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    utrNumber?: string;
    notes?: string;
}
