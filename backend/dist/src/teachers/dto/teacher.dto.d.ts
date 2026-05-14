export declare class CreateTeacherDto {
    name: string;
    email?: string;
    phone: string;
    qualification?: string;
    subjects?: string[];
    joiningDate?: string;
    salaryType?: string;
    salaryAmount?: number;
}
declare const UpdateTeacherDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTeacherDto>>;
export declare class UpdateTeacherDto extends UpdateTeacherDto_base {
}
export {};
