import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';

// ─────────────────────────────────────────────
// Auth Service
// ─────────────────────────────────────────────

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Login ─────────────────────────────────

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      // Use generic message to avoid user enumeration attacks
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 3. Check account status
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated. Please contact the administrator.',
      );
    }

    this.logger.log(`User logged in: ${user.email} [${user.role}]`);

    // 4. Sign JWT
    const accessToken = this.signToken(user);

    // 5. Return response (without password)
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  // ─── Get Current User ───────────────────────

  async getMe(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // ─── Private Helpers ────────────────────────

  private signToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d') as any,
    });
  }

  // ─── Utility: Hash Password ─────────────────
  // Used by seed scripts and future user creation flows

  static async hashPassword(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, 12);
  }
}
