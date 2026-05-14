import { BatchesService } from './batches.service';
import { CreateBatchDto, UpdateBatchDto } from './dto/batch.dto';
import { BatchStatus } from '@prisma/client';
export declare class BatchesController {
    private readonly batchesService;
    constructor(batchesService: BatchesService);
    create(createBatchDto: CreateBatchDto): import("@prisma/client").Prisma.Prisma__BatchClient<{
        teacher: {
            id: string;
            email: string | null;
            phone: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            qualification: string | null;
            subjects: string[];
            joiningDate: Date;
            salaryType: string | null;
            salaryAmount: number | null;
            photo: string | null;
        };
    } & {
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(skip?: string, take?: string, search?: string, status?: BatchStatus, teacherId?: string): Promise<{
        data: ({
            teacher: {
                id: string;
                email: string | null;
                phone: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                qualification: string | null;
                subjects: string[];
                joiningDate: Date;
                salaryType: string | null;
                salaryAmount: number | null;
                photo: string | null;
            };
            _count: {
                students: number;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        teacher: {
            id: string;
            email: string | null;
            phone: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            qualification: string | null;
            subjects: string[];
            joiningDate: Date;
            salaryType: string | null;
            salaryAmount: number | null;
            photo: string | null;
        };
        students: ({
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
            enrolledAt: Date;
            studentId: string;
            batchId: string;
        })[];
    } & {
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
    }>;
    update(id: string, updateBatchDto: UpdateBatchDto): Promise<{
        teacher: {
            id: string;
            email: string | null;
            phone: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            qualification: string | null;
            subjects: string[];
            joiningDate: Date;
            salaryType: string | null;
            salaryAmount: number | null;
            photo: string | null;
        };
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    assignStudent(id: string, studentId: string): Promise<{
        enrolledAt: Date;
        studentId: string;
        batchId: string;
    }>;
    removeStudent(id: string, studentId: string): Promise<{
        enrolledAt: Date;
        studentId: string;
        batchId: string;
    }>;
}
