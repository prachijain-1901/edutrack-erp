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
exports.TemplateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TemplateService = class TemplateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTemplate(dto) {
        const existing = await this.prisma.messageTemplate.findUnique({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Template with this name already exists');
        }
        return this.prisma.messageTemplate.create({
            data: {
                name: dto.name,
                content: dto.content,
                variables: dto.variables || [],
                type: dto.type || 'TRANSACTIONAL',
            },
        });
    }
    async getTemplates() {
        return this.prisma.messageTemplate.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async getTemplateByName(name) {
        const template = await this.prisma.messageTemplate.findUnique({
            where: { name },
        });
        if (!template) {
            throw new common_1.NotFoundException(`Template ${name} not found`);
        }
        return template;
    }
    formatMessage(content, variables) {
        let message = content;
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            message = message.replace(regex, value);
        });
        return message;
    }
};
exports.TemplateService = TemplateService;
exports.TemplateService = TemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TemplateService);
//# sourceMappingURL=template.service.js.map