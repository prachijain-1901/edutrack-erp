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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_constants_1 = require("../events/events.constants");
let AttendanceService = class AttendanceService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async markSingle(data, userId) {
        const existing = await this.prisma.attendance.findUnique({
            where: {
                batchId_studentId_date: {
                    batchId: data.batchId,
                    studentId: data.studentId,
                    date: new Date(data.date),
                },
            },
        });
        let attendance;
        if (existing) {
            attendance = await this.prisma.attendance.update({
                where: { id: existing.id },
                data: { status: data.status, remarks: data.remarks, markedBy: userId },
            });
        }
        else {
            attendance = await this.prisma.attendance.create({
                data: {
                    studentId: data.studentId,
                    batchId: data.batchId,
                    date: new Date(data.date),
                    status: data.status,
                    remarks: data.remarks,
                    markedBy: userId,
                },
            });
        }
        this.eventEmitter.emit(events_constants_1.ERP_EVENTS.ATTENDANCE.MARKED, { attendanceId: attendance.id });
        if (attendance.status === 'ABSENT') {
            this.eventEmitter.emit(events_constants_1.ERP_EVENTS.ATTENDANCE.ABSENT, {
                studentId: attendance.studentId,
                batchId: attendance.batchId,
                date: attendance.date
            });
        }
        return attendance;
    }
    async markBulk(data, userId) {
        const results = await Promise.all(data.records.map((record) => this.markSingle(record, userId)));
        return results;
    }
    async getByBatch(batchId, date) {
        return this.prisma.attendance.findMany({
            where: {
                batchId,
                date: new Date(date),
            },
            include: {
                student: true,
            },
        });
    }
    async getByStudent(studentId, limit = 30) {
        return this.prisma.attendance.findMany({
            where: { studentId },
            orderBy: { date: 'desc' },
            take: limit,
            include: {
                batch: true,
            },
        });
    }
    async getSummary(date, batchId) {
        const whereClause = {};
        if (date)
            whereClause.date = new Date(date);
        if (batchId)
            whereClause.batchId = batchId;
        const records = await this.prisma.attendance.findMany({ where: whereClause });
        let present = 0;
        let absent = 0;
        let late = 0;
        let leave = 0;
        records.forEach((r) => {
            if (r.status === 'PRESENT')
                present++;
            else if (r.status === 'ABSENT')
                absent++;
            else if (r.status === 'LATE')
                late++;
            else if (r.status === 'LEAVE')
                leave++;
        });
        const total = present + absent + late + leave;
        const percentage = total === 0 ? 0 : Math.round((present + late) / total * 100);
        return {
            present,
            absent,
            late,
            leave,
            total,
            percentage,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map