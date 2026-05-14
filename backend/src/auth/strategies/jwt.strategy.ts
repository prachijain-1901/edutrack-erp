import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

// ─────────────────────────────────────────────
// JWT Payload Shape
// ─────────────────────────────────────────────

export interface JwtPayload {
  sub: string;    // userId (cuid)
  email: string;
  role: string;
}

// ─────────────────────────────────────────────
// JWT Passport Strategy
// ─────────────────────────────────────────────
// Extracts the Bearer token from the Authorization header,
// verifies its signature, and attaches the full User record
// to request.user for downstream guards and controllers.

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      // Extract token from: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Reject expired tokens
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Called automatically by Passport after token signature verification.
   * The returned value is attached to request.user.
   */
  async validate(payload: JwtPayload): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive or no longer exists.',
      );
    }

    // Remove password from the user object before attaching to request
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
