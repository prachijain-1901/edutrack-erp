import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

// ─────────────────────────────────────────────
// Auth Controller
// ─────────────────────────────────────────────
// Base path: /auth

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   *
   * Accepts email + password credentials.
   * Returns a JWT access token and user profile on success.
   * Returns 401 on invalid credentials.
   *
   * @example
   * POST /auth/login
   * Body: { "email": "admin@edutrack.in", "password": "password123" }
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)   // Override default 201 → 200
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * GET /auth/me
   *
   * Returns the currently authenticated user's profile.
   * Requires a valid Bearer token in the Authorization header.
   *
   * @example
   * GET /auth/me
   * Authorization: Bearer <access_token>
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<Omit<User, 'password'>> {
    // user is already populated by JwtStrategy.validate()
    // Re-fetch from DB via service for freshest data
    return this.authService.getMe(user.id);
  }
}
