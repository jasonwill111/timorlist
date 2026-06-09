// Auth Server Action - Sign Up
// Rate limiting: better-auth 1.6+ built-in handles 'sign-up/email' (3/min) — no duplicate needed
import { defineAction } from 'astro:actions';
import * as z from 'zod';
import { getAuth } from '@/lib/auth';
import { emailSchema, requiredString } from '@/lib/schemas/common';
import { passwordSchema } from '@/lib/schemas/auth';
import { getErrorMessage, createErrorResponse } from '@/lib/errors';
import { ErrorCode } from '@/lib/errors';

export const signUp = defineAction({
  accept: 'json',
  input: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: requiredString('Name is required'),
  }),
  handler: async (input) => {
    try {
      const auth = await getAuth();
      const authApi = auth.api;

      const user = await authApi.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
        }
      });

      return { success: true, user };
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes('already exists') || message.includes('already registered')) {
        return createErrorResponse(ErrorCode.AUTH_USER_EXISTS, 'An account with this email already exists');
      }
      if (message.includes('password') || message.includes('Password')) {
        return createErrorResponse(ErrorCode.VALIDATION_PASSWORD_TOO_WEAK, message);
      }
      return createErrorResponse(ErrorCode.SERVER_ERROR, message);
    }
  },
});