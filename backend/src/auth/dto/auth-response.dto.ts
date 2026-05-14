import { Role } from '@prisma/client';

// ─────────────────────────────────────────────
// Auth Response DTO
// ─────────────────────────────────────────────
// Defines the shape of successful login responses.
// Used as documentation and for future OpenAPI/Swagger.

export class AuthResponseDto {
  /** Signed JWT access token */
  accessToken: string;

  /** Stripped user object (no password) */
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role;
    isActive: boolean;
  };
}
