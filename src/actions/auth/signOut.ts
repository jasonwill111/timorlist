// Auth Server Action - Sign Out
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';
import { env } from 'cloudflare:workers';

export const signOut = defineAction({
  accept: 'form',
  input: z.object({}),
  handler: async (_, { cookies }) => {
    const cookieHeader = cookies.get('better-auth.session_token')?.value || '';

    try {
      const authApi = (await initAuth()).api;

      if (cookieHeader) {
        await authApi.signOut({
          headers: { cookie: `better-auth.session_token=${cookieHeader}` },
        });

        // Delete KV session entry after successful signOut
        const kv = env.SESSION as KVNamespace | undefined;
        if (kv) {
          await kv.delete(`session:${cookieHeader}`);
        }
      }

      // Clear cookie with secure flags
      cookies.set('better-auth.session_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      return { success: true };
    } catch (error) {
      // Ignore sign out errors, still return success
      return { success: true };
    }
  },
});