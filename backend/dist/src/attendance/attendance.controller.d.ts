import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto, BulkMarkAttendanceDto } from './dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markSingle(data: MarkAttendanceDto, req: any): Promise<{
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
    markBulk(data: BulkMarkAttendanceDto, req: any): Promise<{
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
    getByStudent(studentId: string, limit?: string): Promise<({
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
