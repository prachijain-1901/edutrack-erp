import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// ─────────────────────────────────────────────
// Users Service
// ─────────────────────────────────────────────
// Handles user profile operations.
// Authentication is handled by AuthModule.

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a user by ID.
   * Returns user without the password field.
   */
  async findById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;
    return rest;
  }

  /**
   * Find a user by email.
   * Includes password hash — for use ONLY inside auth flows.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  /**
   * List all users (admin use only).
   * Excludes passwords.
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(({ password: _, ...rest }) => rest);
  }
}
