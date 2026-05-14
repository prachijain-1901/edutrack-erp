import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// ─────────────────────────────────────────────
// @Roles() Decorator
// ─────────────────────────────────────────────
// Attaches role metadata to a route handler.
// Used in combination with RolesGuard.
//
// Usage:
//   @Roles(Role.ADMIN, Role.OWNER)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   deleteStudent() { ... }

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
