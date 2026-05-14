import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

// ─────────────────────────────────────────────
// Users Controller
// ─────────────────────────────────────────────
// Base path: /users
// All routes require JWT authentication.

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users
   * Returns all users — restricted to ADMIN and OWNER roles.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.findAll();
  }

  /**
   * GET /users/me
   * Returns the currently authenticated user's profile.
   * Convenience alias for GET /auth/me.
   */
  @Get('me')
  getMe(@CurrentUser() user: Omit<User, 'password'>): Omit<User, 'password'> {
    return user;
  }

  /**
   * GET /users/:id
   * Returns a specific user — restricted to ADMIN and OWNER.
   */
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  async findOne(
    @Param('id') id: string,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.findById(id);
  }
}
