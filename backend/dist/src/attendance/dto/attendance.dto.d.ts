import { AttendanceStatus } from '@prisma/client';
export declare class MarkAttendanceDto {
    studentId: string;
    batchId: string;
    date: string;
    status: AttendanceStatus;
    remarks?: string;
}
export declare class BulkMarkAttendanceDto {
    records: MarkAttendanceDto[];
}
