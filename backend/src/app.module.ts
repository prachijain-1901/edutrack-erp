import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { envValidationSchema } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { BatchesModule } from './batches/batches.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FeesModule } from './fees/fees.module';
import { PaymentsModule } from './payments/payments.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { UploadsModule } from './uploads/uploads.module';
import { EventsModule } from './events/events.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { SocketModule } from './socket/socket.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

// ─────────────────────────────────────────────
// Root App Module
// ─────────────────────────────────────────────

@Module({
  imports: [
    // ─── Config: load .env and validate all vars at startup ───
    ConfigModule.forRoot({
      isGlobal: true,          // No need to import ConfigModule in each module
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,    // Ignore env vars not in the schema
        abortEarly: false,     // Report ALL missing vars, not just the first
      },
    }),

    // ─── Rate Limiting ─────────────────────────
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
      limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    }]),

    // ─── Database ─────────────────────────────
    PrismaModule,

    // ─── Feature Modules ──────────────────────
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    BatchesModule,
    AttendanceModule,
    FeesModule,
    PaymentsModule,
    AnnouncementsModule,
    NotificationsModule,
    DashboardModule,
    SettingsModule,
    UploadsModule,
    EventsModule,
    WhatsAppModule,
    SocketModule,
  ],
  providers: [
    // ─── Global Rate Limiter Guard ────────────
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // ─── Global Validation Pipe ───────────────
    // Validates all incoming request bodies against DTOs
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,          // Strip unknown properties
        forbidNonWhitelisted: true, // Throw if unknown properties are sent
        transform: true,          // Auto-transform types (string → number etc.)
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },

    // ─── Global Exception Filter ──────────────
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },

    // ─── Global Response Transform ────────────
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
