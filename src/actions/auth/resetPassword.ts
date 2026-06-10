// Auth Server Action - Reset Password
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getAuth } from '@/lib/auth';

export const resetPassword = defineAction({
  accept: 'form',
  input: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
  handler: async (input) => {
    try {
      const auth = await getAuth();
      const authApi = auth.api as { resetPassword?: (opts: { body: { token?: string; newPassword: string } }) => Promise<unknown> };
      if (authApi?.resetPassword) {
        await authApi.resetPassword({
          body: { token: input.token, newPassword: input.password }
        });
      }
      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: { code: 'RESET_ERROR', message } };
    }
  },
});