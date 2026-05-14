import { Role } from '@prisma/client';
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: Role;
        isActive: boolean;
    };
}
