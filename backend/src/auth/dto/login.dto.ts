import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

// ─────────────────────────────────────────────
// Login DTO
// ─────────────────────────────────────────────
// Validated with class-validator via the global ValidationPipe.

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password: string;
}
