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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeachersService = class TeachersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createTeacherDto) {
        return this.prisma.teacher.create({
            data: createTeacherDto,
        });
    }
    async findAll(params) {
        const { skip = 0, take = 10, search } = params;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.teacher.findMany({
                skip: Number(skip),
                take: Number(take),
                where,
                include: { _count: { select: { batches: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.teacher.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page: Math.floor(Number(skip) / Number(take)) + 1,
                limit: Number(take),
                totalPages: Math.ceil(total / Number(take)),
            },
        };
    }
    async findOne(id) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: { batches: true },
        });
        if (!teacher)
            throw new common_1.NotFoundException(`Teacher with ID ${id} not found`);
        return teacher;
    }
    async update(id, updateTeacherDto) {
        const teacher = await this.prisma.teacher.findUnique({ where: { id } });
        if (!teacher)
            throw new common_1.NotFoundException(`Teacher with ID ${id} not found`);
        return this.prisma.teacher.update({
            where: { id },
            data: updateTeacherDto,
        });
    }
    async remove(id) {
        const teacher = await this.prisma.teacher.findUnique({ where: { id } });
        if (!teacher)
            throw new common_1.NotFoundException(`Teacher with ID ${id} not found`);
        return this.prisma.teacher.delete({ where: { id } });
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map