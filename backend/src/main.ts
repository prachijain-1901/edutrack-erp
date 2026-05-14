import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

import helmet from 'helmet';

// ─────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    // Disable verbose NestJS startup logs; we handle logging ourselves
    logger: ['error', 'warn', 'log'],
  });

  // ─── Security ──────────────────────────────
  app.use(helmet());

  // ─── Global API Prefix ─────────────────────
  // All routes will be prefixed with /api/v1
  // e.g. POST /api/v1/auth/login
  app.setGlobalPrefix('api/v1');

  // ─── CORS ──────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ─── Start Server ──────────────────────────
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  logger.log(`🚀 EduTrack ERP API running at: http://localhost:${port}/api/v1`);
  logger.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
}

bootstrap().catch((err: Error) => {
  new Logger('Bootstrap').error('Failed to start server', err.stack);
  process.exit(1);
});
