// Auth Server Action - Verify Email
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getAuth } from '@/lib/auth';

export const verifyEmail = defineAction({
  accept: 'form',
  input: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
  handler: async (input) => {
    try {
      const auth = await getAuth();
      const authApi = auth.api as { verifyEmail?: (opts: { query: { token: string } }) => Promise<unknown> };
      if (authApi?.verifyEmail) {
        await authApi.verifyEmail({
          query: { token: input.token }
        });
      }
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: { code: 'VERIFY_ERROR', message } };
    }
  },
});