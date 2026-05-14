import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

// ─────────────────────────────────────────────
// @CurrentUser() Decorator
// ─────────────────────────────────────────────
// Extracts the authenticated user from the request object
// that was attached by the JWT strategy.
//
// Usage in controllers:
//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   getMe(@CurrentUser() user: User) { ... }

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);
