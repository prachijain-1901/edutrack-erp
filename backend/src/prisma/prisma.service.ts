import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// ─────────────────────────────────────────────
// Prisma Service
// ─────────────────────────────────────────────
// Wraps PrismaClient as a NestJS injectable service.
// Handles connection lifecycle cleanly with the module lifecycle hooks.

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'warn', 'error']
          : ['warn', 'error'],
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to PostgreSQL via Prisma…');
    await this.$connect();
    this.logger.log('Prisma connected ✓');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting Prisma…');
    await this.$disconnect();
  }
}
