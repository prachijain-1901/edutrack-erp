import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<Omit<User, 'password'>>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<Omit<User, 'password'>[]>;
}
