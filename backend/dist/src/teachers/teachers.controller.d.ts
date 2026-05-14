import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    create(createTeacherDto: CreateTeacherDto): import("@prisma/client").Prisma.Prisma__TeacherClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(skip?: string, take?: string, search?: string): Promise<{
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
            photo: string | null;
            qualification: string | null;
            subjects: string[];
            joiningDate: Date;
            salaryType: string | null;
            salaryAmount: number | null;
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
            days: string[];
            grade: string;
            status: import("@prisma/client").$Enums.BatchStatus;
            subject: string;
            capacity: number;
            roomNumber: string | null;
            startTime: string;
            endTime: string;
            teacherId: string;
        }[];
    } & {
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
    }>;
    update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
