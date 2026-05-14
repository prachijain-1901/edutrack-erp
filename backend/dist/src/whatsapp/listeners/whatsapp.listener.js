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
var WhatsAppListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const whatsapp_service_1 = require("../whatsapp.service");
const template_service_1 = require("../template.service");
const events_constants_1 = require("../../events/events.constants");
const prisma_service_1 = require("../../prisma/prisma.service");
let WhatsAppListener = WhatsAppListener_1 = class WhatsAppListener {
    whatsappService;
    templateService;
    prisma;
    logger = new common_1.Logger(WhatsAppListener_1.name);
    constructor(whatsappService, templateService, prisma) {
        this.whatsappService = whatsappService;
        this.templateService = templateService;
        this.prisma = prisma;
    }
    async handleStudentCreated(payload) {
        try {
            const { studentId } = payload;
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
                include: { parent: true },
            });
            if (!student || !student.phone)
                return;
            const template = await this.templateService.getTemplateByName('WELCOME_STUDENT');
            const message = this.templateService.formatMessage(template.content, {
                name: student.firstName,
            });
            await this.whatsappService.sendMessage({
                recipient: student.phone,
                message,
                templateId: template.id,
            });
        }
        catch (error) {
            this.logger.error(`Error in handleStudentCreated: ${error.message}`);
        }
    }
    async handleStudentAbsent(payload) {
        try {
            const { studentId, batchId, date } = payload;
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
                include: { parent: true },
            });
            const batch = await this.prisma.batch.findUnique({
                where: { id: batchId },
            });
            if (!student || !student.phone)
                return;
            const template = await this.templateService.getTemplateByName('ATTENDANCE_ABSENT');
            const message = this.templateService.formatMessage(template.content, {
                name: student.firstName,
                batch: batch?.name || 'Batch',
                date: new Date(date).toLocaleDateString(),
            });
            await this.whatsappService.sendMessage({
                recipient: student.phone,
                message,
                templateId: template.id,
            });
        }
        catch (error) {
            this.logger.error(`Error in handleStudentAbsent: ${error.message}`);
        }
    }
    async handlePaymentReceived(payload) {
        try {
            const { paymentId } = payload;
            const payment = await this.prisma.payment.findUnique({
                where: { id: paymentId },
                include: { studentFee: { include: { student: true } } },
            });
            if (!payment || !payment.studentFee.student.phone)
                return;
            const template = await this.templateService.getTemplateByName('FEE_RECEIPT');
            const message = this.templateService.formatMessage(template.content, {
                name: payment.studentFee.student.firstName,
                amount: payment.amount.toString(),
                receipt: payment.receiptNumber,
            });
            await this.whatsappService.sendMessage({
                recipient: payment.studentFee.student.phone,
                message,
                templateId: template.id,
            });
        }
        catch (error) {
            this.logger.error(`Error in handlePaymentReceived: ${error.message}`);
        }
    }
};
exports.WhatsAppListener = WhatsAppListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constants_1.ERP_EVENTS.STUDENT.CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppListener.prototype, "handleStudentCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constants_1.ERP_EVENTS.ATTENDANCE.ABSENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppListener.prototype, "handleStudentAbsent", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constants_1.ERP_EVENTS.FEE.PAYMENT_RECEIVED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppListener.prototype, "handlePaymentReceived", null);
exports.WhatsAppListener = WhatsAppListener = WhatsAppListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsAppService,
        template_service_1.TemplateService,
        prisma_service_1.PrismaService])
], WhatsAppListener);
//# sourceMappingURL=whatsapp.listener.js.map