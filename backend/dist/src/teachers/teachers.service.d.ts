import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { Prisma } from '@prisma/client';
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTeacherDto: CreateTeacherDto): Prisma.Prisma__TeacherClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(params: {
        skip?: number;
        take?: number;
        search?: string;
    }): Promise<{
        data: ({
            _count: {
                batches: number;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        batches: {
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
        }[];
    } & {
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
    }>;
    update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
