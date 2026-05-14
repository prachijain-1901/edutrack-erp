import { StudentStatus } from '@prisma/client';
export declare class CreateParentDto {
    fatherName?: string;
    motherName?: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
    address?: string;
    occupation?: string;
}
export declare class CreateStudentDto {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    grade: string;
    schoolName?: string;
    email?: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    bloodGroup?: string;
    status?: StudentStatus;
    parent: CreateParentDto;
}
