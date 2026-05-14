import * as Joi from 'joi';

// ─────────────────────────────────────────────
// Environment Variable Validation Schema
// ─────────────────────────────────────────────
// Joi validates all required env vars at startup.
// The app will refuse to start if any are missing or malformed.

export const envValidationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),

  // Database
  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'DATABASE_URL is required. Set it in your .env file.',
  }),

  // JWT
  JWT_SECRET: Joi.string().min(16).required().messages({
    'any.required': 'JWT_SECRET is required.',
    'string.min': 'JWT_SECRET must be at least 16 characters.',
  }),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // CORS
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
});
