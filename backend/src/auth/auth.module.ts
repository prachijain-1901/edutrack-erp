import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

// ─────────────────────────────────────────────
// Auth Module
// ─────────────────────────────────────────────

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Async JWT config reads JWT_SECRET from ConfigService
    // so the environment is fully loaded before token signing.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    // Export guards so other modules can use them without re-importing AuthModule
    JwtAuthGuard,
    RolesGuard,
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}
