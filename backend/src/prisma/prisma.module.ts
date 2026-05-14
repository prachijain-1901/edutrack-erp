import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// ─────────────────────────────────────────────
// Prisma Module
// ─────────────────────────────────────────────
// Marked @Global so PrismaService is available
// throughout the entire application without
// importing PrismaModule in every feature module.

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
