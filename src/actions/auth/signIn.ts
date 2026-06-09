// Auth Server Action - Sign In
// Rate limiting: better-auth 1.6+ built-in (configured in src/lib/auth.ts) — no duplicate needed
import { defineAction } from 'astro:actions';
import * as z from 'zod';
import { getAuth } from '@/lib/auth';
import { emailSchema, requiredString } from '@/lib/schemas/common';
import { createErrorResponse, getErrorMessage } from '@/lib/errors';
import { ErrorCode } from '@/lib/errors';

export const signIn = defineAction({
  accept: 'json',
  input: z.object({
    email: emailSchema,
    password: requiredString('Password is required'),
    rememberMe: z.boolean().optional().default(false),
  }),
  handler: async (input) => {
    try {
      // Use singleton getAuth - instance cached across requests
      const auth = await getAuth();

      const result = await auth.api.signInEmail({
        body: { email: input.email, password: input.password },
      });

      return {
        success: true,
        user: result.user,
        token: result.token,
      };
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes('invalid') || message.includes('incorrect') || message.includes('wrong')) {
        return createErrorResponse(ErrorCode.AUTH_INVALID_CREDENTIALS, 'Invalid email or password');
      }
      return createErrorResponse(ErrorCode.AUTH_INVALID, message);
    }
  },
});