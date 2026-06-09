// Auth Server Action - Sign Out
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getAuth } from '@/lib/auth';

export const signOut = defineAction({
  accept: 'form',
  input: z.object({}),
  handler: async (_, { cookies }) => {
    const cookieHeader = cookies.get('better-auth.session_token')?.value || '';

    try {
      const authApi = (await getAuth()).api;

      if (cookieHeader) {
        await authApi.signOut({
          headers: { cookie: `better-auth.session_token=${cookieHeader}` },
        });

        // Delete KV session entry after successful signOut
        const kv = (globalThis as Record<string, unknown>).SESSION as KVNamespace | undefined;
        if (kv) {
          await kv.delete(`session:${cookieHeader}`);
        }
      }

      // Clear cookie — secure flag must match how it was created (better-auth derives from baseURL protocol)
      cookies.set('better-auth.session_token', '', {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      return { success: true };
    } catch {
      // Ignore sign out errors, still return success
      return { success: true };
    }
  },
});