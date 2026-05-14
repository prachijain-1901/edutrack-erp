import { PrismaService } from '../prisma/prisma.service';
import { MarkAttendanceDto, BulkMarkAttendanceDto } from './dto/attendance.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class AttendanceService {
    private readonly prisma;
    private readonly eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    markSingle(data: MarkAttendanceDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        batchId: string;
        date: Date;
        remarks: string | null;
        markedBy: string | null;
    }>;
    markBulk(data: BulkMarkAttendanceDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        batchId: string;
        date: Date;
        remarks: string | null;
        markedBy: string | null;
    }[]>;
    getByBatch(batchId: string, date: string): Promise<({
        student: {
            id: string;
            email: string | null;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            state: string | null;
            photo: string | null;
            grade: string;
            status: import("@prisma/client").$Enums.StudentStatus;
            firstName: string;
            lastName: string;
            gender: string;
            dob: Date;
            schoolName: string | null;
            bloodGroup: string | null;
            admissionDate: Date;
            parentId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        batchId: string;
        date: Date;
        remarks: string | null;
        markedBy: string | null;
    })[]>;
    getByStudent(studentId: string, limit?: number): Promise<({
        batch: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            subject: string;
            grade: string;
            capacity: number;
            roomNumber: string | null;
            startTime: string;
            endTime: string;
            days: string[];
            status: import("@prisma/client").$Enums.BatchStatus;
            teacherId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        batchId: string;
        date: Date;
        remarks: string | null;
        markedBy: string | null;
    })[]>;
    getSummary(date?: string, batchId?: string): Promise<{
        present: number;
        absent: number;
        late: number;
        leave: number;
        total: number;
        percentage: number;
    }>;
}
