import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordPaymentDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ERP_EVENTS } from '../events/events.constants';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async recordPayment(data: RecordPaymentDto) {
    const fee = await this.prisma.studentFee.findUnique({
      where: { id: data.studentFeeId },
      include: { payments: true },
    });

    if (!fee) throw new NotFoundException('Fee record not found');

    const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount;
    
    if (totalPaid > fee.amount) {
      throw new BadRequestException('Payment amount exceeds fee balance');
    }

    let status: PaymentStatus = fee.status;
    if (totalPaid >= fee.amount) {
      status = 'PAID';
    } else if (totalPaid > 0) {
      status = 'PARTIAL';
    }

    const receiptNumber = `RCPT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const [payment] = await this.prisma.$transaction([
      this.prisma.payment.create({
        data: {
          studentFeeId: data.studentFeeId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          utrNumber: data.utrNumber,
          notes: data.notes,
          receiptNumber,
        },
      }),
      this.prisma.studentFee.update({
        where: { id: fee.id },
        data: { status },
      }),
    ]);

    this.eventEmitter.emit(ERP_EVENTS.FEE.PAYMENT_RECEIVED, { paymentId: payment.id });

    return payment;
  }

  async getPaymentsByStudent(studentId: string) {
    return this.prisma.payment.findMany({
      where: { studentFee: { studentId } },
      include: {
        studentFee: {
          include: { feePlan: true }
        }
      },
      orderBy: { paidAt: 'desc' },
    });
  }
}
