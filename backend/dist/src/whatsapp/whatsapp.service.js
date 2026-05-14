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
var WhatsAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    prisma;
    logger = new common_1.Logger(WhatsAppService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendMessage(dto) {
        const { recipient, message, templateId, variables } = dto;
        const log = await this.prisma.messageLog.create({
            data: {
                recipient,
                message,
                templateId,
                status: 'PENDING',
            },
        });
        try {
            this.logger.log(`Sending WhatsApp to ${recipient}: ${message.substring(0, 30)}...`);
            const success = true;
            if (success) {
                return await this.prisma.messageLog.update({
                    where: { id: log.id },
                    data: {
                        status: 'SENT',
                        sentAt: new Date(),
                    },
                });
            }
            else {
                throw new Error('Failed to send via Meta API');
            }
        }
        catch (error) {
            this.logger.error(`WhatsApp failed for ${recipient}: ${error.message}`);
            return await this.prisma.messageLog.update({
                where: { id: log.id },
                data: {
                    status: 'FAILED',
                    error: error.message,
                },
            });
        }
    }
    async getLogs(skip = 0, take = 50) {
        return this.prisma.messageLog.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: { template: true },
        });
    }
    async getStats() {
        const total = await this.prisma.messageLog.count();
        const sent = await this.prisma.messageLog.count({ where: { status: 'SENT' } });
        const failed = await this.prisma.messageLog.count({ where: { status: 'FAILED' } });
        const delivered = await this.prisma.messageLog.count({ where: { status: 'DELIVERED' } });
        return { total, sent, failed, delivered };
    }
    async retryFailedMessages() {
        const failedLogs = await this.prisma.messageLog.findMany({
            where: { status: 'FAILED' },
            take: 20,
        });
        this.logger.log(`Retrying ${failedLogs.length} failed messages...`);
        for (const log of failedLogs) {
            await this.sendMessage({
                recipient: log.recipient,
                message: log.message,
                templateId: log.templateId || undefined,
            });
            await this.prisma.messageLog.delete({ where: { id: log.id } });
        }
        return { retried: failedLogs.length };
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map