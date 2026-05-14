import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentStatus } from '@prisma/client';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createStudentDto: CreateStudentDto): Promise<{
        parent: {
            id: string;
            email: string | null;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            fatherName: string | null;
            motherName: string | null;
            alternatePhone: string | null;
            address: string | null;
            occupation: string | null;
        };
    } & {
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
    }>;
    findAll(params: {
        skip?: number;
        take?: number;
        search?: string;
        status?: StudentStatus;
        grade?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: ({
            parent: {
                id: string;
                email: string | null;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                fatherName: string | null;
                motherName: string | null;
                alternatePhone: string | null;
                address: string | null;
                occupation: string | null;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        parent: {
            id: string;
            email: string | null;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            fatherName: string | null;
            motherName: string | null;
            alternatePhone: string | null;
            address: string | null;
            occupation: string | null;
        };
    } & {
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
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        parent: {
            id: string;
            email: string | null;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            fatherName: string | null;
            motherName: string | null;
            alternatePhone: string | null;
            address: string | null;
            occupation: string | null;
        };
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
