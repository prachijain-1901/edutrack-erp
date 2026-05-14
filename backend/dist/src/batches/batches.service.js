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
exports.BatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BatchesService = class BatchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createBatchDto) {
        return this.prisma.batch.create({
            data: createBatchDto,
            include: { teacher: true },
        });
    }
    async findAll(params) {
        const { skip = 0, take = 10, search, status, teacherId } = params;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status)
            where.status = status;
        if (teacherId)
            where.teacherId = teacherId;
        const [data, total] = await Promise.all([
            this.prisma.batch.findMany({
                skip: Number(skip),
                take: Number(take),
                where,
                include: {
                    teacher: true,
                    _count: { select: { students: true } }
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.batch.count({ where }),
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
        const batch = await this.prisma.batch.findUnique({
            where: { id },
            include: {
                teacher: true,
                students: {
                    include: { student: true }
                }
            },
        });
        if (!batch)
            throw new common_1.NotFoundException(`Batch with ID ${id} not found`);
        return batch;
    }
    async update(id, updateBatchDto) {
        const batch = await this.prisma.batch.findUnique({ where: { id } });
        if (!batch)
            throw new common_1.NotFoundException(`Batch with ID ${id} not found`);
        return this.prisma.batch.update({
            where: { id },
            data: updateBatchDto,
            include: { teacher: true },
        });
    }
    async remove(id) {
        const batch = await this.prisma.batch.findUnique({ where: { id } });
        if (!batch)
            throw new common_1.NotFoundException(`Batch with ID ${id} not found`);
        return this.prisma.batch.delete({ where: { id } });
    }
    async assignStudent(batchId, studentId) {
        const batch = await this.prisma.batch.findUnique({
            where: { id: batchId },
            include: { _count: { select: { students: true } } }
        });
        if (!batch)
            throw new common_1.NotFoundException(`Batch with ID ${batchId} not found`);
        if (batch._count.students >= batch.capacity) {
            throw new common_1.BadRequestException('Batch is already at full capacity');
        }
        const existing = await this.prisma.studentBatch.findUnique({
            where: { studentId_batchId: { studentId, batchId } }
        });
        if (existing) {
            throw new common_1.BadRequestException('Student is already assigned to this batch');
        }
        return this.prisma.studentBatch.create({
            data: { studentId, batchId },
        });
    }
    async removeStudent(batchId, studentId) {
        const existing = await this.prisma.studentBatch.findUnique({
            where: { studentId_batchId: { studentId, batchId } }
        });
        if (!existing) {
            throw new common_1.NotFoundException('Student is not assigned to this batch');
        }
        return this.prisma.studentBatch.delete({
            where: { studentId_batchId: { studentId, batchId } }
        });
    }
};
exports.BatchesService = BatchesService;
exports.BatchesService = BatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BatchesService);
//# sourceMappingURL=batches.service.js.map