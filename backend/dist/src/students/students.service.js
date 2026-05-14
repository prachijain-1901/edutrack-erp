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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudentDto) {
        const { parent, ...studentData } = createStudentDto;
        return this.prisma.student.create({
            data: {
                ...studentData,
                parent: {
                    create: parent,
                },
            },
            include: {
                parent: true,
            },
        });
    }
    async findAll(params) {
        const { skip = 0, take = 10, search, status, grade, sortBy, sortOrder } = params;
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status) {
            where.status = status;
        }
        if (grade) {
            where.grade = grade;
        }
        const orderBy = {};
        if (sortBy) {
            orderBy[sortBy] = sortOrder || 'asc';
        }
        else {
            orderBy.createdAt = 'desc';
        }
        const [students, total] = await Promise.all([
            this.prisma.student.findMany({
                skip: Number(skip),
                take: Number(take),
                where,
                orderBy,
                include: {
                    parent: true,
                },
            }),
            this.prisma.student.count({ where }),
        ]);
        return {
            data: students,
            meta: {
                total,
                page: Math.floor(Number(skip) / Number(take)) + 1,
                limit: Number(take),
                totalPages: Math.ceil(total / Number(take)),
            },
        };
    }
    async findOne(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: {
                parent: true,
            },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        return student;
    }
    async update(id, updateStudentDto) {
        const { parent, ...studentData } = updateStudentDto;
        const student = await this.prisma.student.findUnique({ where: { id } });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        return this.prisma.student.update({
            where: { id },
            data: {
                ...studentData,
                ...(parent && {
                    parent: {
                        update: parent,
                    },
                }),
            },
            include: {
                parent: true,
            },
        });
    }
    async remove(id) {
        const student = await this.prisma.student.findUnique({ where: { id } });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        return this.prisma.student.delete({
            where: { id },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map