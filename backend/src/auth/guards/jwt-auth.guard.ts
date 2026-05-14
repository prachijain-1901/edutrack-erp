import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ─────────────────────────────────────────────
// JWT Auth Guard
// ─────────────────────────────────────────────
// Apply to any route/controller that requires authentication:
//
//   @UseGuards(JwtAuthGuard)
//   @Get('protected-route')
//   getData(@CurrentUser() user: User) { ... }
//
// Delegates to JwtStrategy under the hood.

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
