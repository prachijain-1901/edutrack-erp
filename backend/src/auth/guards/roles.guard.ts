import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';

// ─────────────────────────────────────────────
// Roles Guard
// ─────────────────────────────────────────────
// Enforces role-based access control (RBAC).
// Must be used AFTER JwtAuthGuard (which populates request.user).
//
//   @Roles(Role.ADMIN, Role.OWNER)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   deleteStudent() { ... }

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles required for this route
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no @Roles() decorator, allow any authenticated user
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRoles.join(' or ')}.`,
      );
    }

    return true;
  }
}
