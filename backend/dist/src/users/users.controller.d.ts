import { User } from '@prisma/client';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Omit<User, 'password'>[]>;
    getMe(user: Omit<User, 'password'>): Omit<User, 'password'>;
    findOne(id: string): Promise<Omit<User, 'password'>>;
}
