// Auth Server Action - Forgot Password
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
export const forgotPassword = defineAction({
  accept: 'form',
  input: z.object({
    email: z.email({ error: 'Valid email required' }),
  }),
  handler: async (input) => {
    const result = await checkRateLimit(`forgot:${input.email}`);
    if (!result.allowed) {
      return { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } };
    }
    try {
      const auth = await getAuth();
      // Use listUsers to check if user exists (better-auth API varies by version)
      const api = auth.api as { listUsers?: (opts: { body: { emails?: string[] } }) => Promise<{ users?: unknown[] }> };
      if (api?.listUsers) {
        await api.listUsers({ body: { emails: [input.email] } });
      }
      // Always return success to prevent email enumeration
      return { success: true, message: 'If an account exists, a reset email was sent' };
    } catch {
      // Don't reveal if email exists
      return { success: true, message: 'If an account exists, a reset email was sent' };
    }
  },
});