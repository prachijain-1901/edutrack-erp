"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_constants_1 = require("../events/events.constants");
let PaymentsService = class PaymentsService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async recordPayment(data) {
        const fee = await this.prisma.studentFee.findUnique({
            where: { id: data.studentFeeId },
            include: { payments: true },
        });
        if (!fee)
            throw new common_1.NotFoundException('Fee record not found');
        const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount;
        if (totalPaid > fee.amount) {
            throw new common_1.BadRequestException('Payment amount exceeds fee balance');
        }
        let status = fee.status;
        if (totalPaid >= fee.amount) {
            status = 'PAID';
        }
        else if (totalPaid > 0) {
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
        this.eventEmitter.emit(events_constants_1.ERP_EVENTS.FEE.PAYMENT_RECEIVED, { paymentId: payment.id });
        return payment;
    }
    async getPaymentsByStudent(studentId) {
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map