import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto, UpdateBatchDto } from './dto/batch.dto';
import { Prisma, BatchStatus } from '@prisma/client';
export declare class BatchesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBatchDto: CreateBatchDto): Prisma.Prisma__BatchClient<{
        teacher: {
            id: string;
            email: string | null;
            phone: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            photo: string | null;
            qualification: string | null;
            subjects: string[];
            joiningDate: Date;
            salaryType: string | null;
            salaryAmount: number | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        days: string[];
        grade: string;
        status: import("@prisma/client").$Enums.BatchStatus;
        subject: string;
        capacity: number;
        roomNumber: string | null;
        startTime: string;
        endTime: string;
        teacherId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(params: {
        skip?: number;
        take?: number;
        search?: string;
        status?: BatchStatus;
        teacherId?: string;
    }): Promise<{
        data: ({
            teacher: {
                id: string;
                email: string | null;
                phone: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                photo: string | null;
                qualification: string | null;
                subjects: string[];
                joiningDate: Date;
                salaryType: string | null;
                salaryAmount: number | null;
            };
            _count: {
                students: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            days: string[];
            grade: string;
            status: import("@prisma/client").$Enums.BatchStatus;
            subject: string;
            capacity: number;
            roomNumber: string | null;
            startTime: string;
            endTime: string;
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
            photo: string | null;
            qualification: string | null;
            subjects: string[];
            joiningDate: Date;
            salaryType: string | null;
            salaryAmount: number | null;
        };
        students: ({
            student: {
                id: string;
                email: string | null;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                firstName: string;
                lastName: string;
                gender: string;
                dob: Date;
                grade: string;
                schoolName: string | null;
                city: string | null;
                state: string | null;
                bloodGroup: string | null;
                status: import("@prisma/client").$Enums.StudentStatus;
                photo: string | null;
                admissionDate: Date;
                parentId: string;
            };
        } & {
            studentId: string;
            batchId: string;
            enrolledAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        days: string[];
        grade: string;
        status: import("@prisma/client").$Enums.BatchStatus;
        subject: string;
        capacity: number;
        roomNumber: string | null;
        startTime: string;
        endTime: string;
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
            photo: string | null;
            qualification: string | null;
            subjects: string[];
            joiningDate: Date;
            salaryType: string | null;
            salaryAmount: number | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        days: string[];
        grade: string;
        status: import("@prisma/client").$Enums.BatchStatus;
        subject: string;
        capacity: number;
        roomNumber: string | null;
        startTime: string;
        endTime: string;
        teacherId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        days: string[];
        grade: string;
        status: import("@prisma/client").$Enums.BatchStatus;
        subject: string;
        capacity: number;
        roomNumber: string | null;
        startTime: string;
        endTime: string;
        teacherId: string;
    }>;
    assignStudent(batchId: string, studentId: string): Promise<{
        studentId: string;
        batchId: string;
        enrolledAt: Date;
    }>;
    removeStudent(batchId: string, studentId: string): Promise<{
        studentId: string;
        batchId: string;
        enrolledAt: Date;
    }>;
}
