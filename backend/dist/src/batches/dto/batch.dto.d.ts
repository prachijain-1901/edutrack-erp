import { BatchStatus } from '@prisma/client';
export declare class CreateBatchDto {
    name: string;
    subject: string;
    grade: string;
    capacity: number;
    roomNumber?: string;
    startTime: string;
    endTime: string;
    days: string[];
    status?: BatchStatus;
    teacherId: string;
}
declare const UpdateBatchDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBatchDto>>;
export declare class UpdateBatchDto extends UpdateBatchDto_base {
}
export {};
