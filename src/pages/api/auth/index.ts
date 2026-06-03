// Auth API - Sign In (REST fallback for Astro actions issues)
export const prerender = false;

import { createErrorResponse } from '@/lib/errors';
import { ErrorCode } from '@/lib/errors';
import { checkRateLimit } from '@/lib/rate-limit';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';

// Session constants
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(21));
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}

export async function POST({ request }: { request: Request }) {
  try {
    // CORS check
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host && !originUrl.hostname.includes('localhost')) {
          return new Response(JSON.stringify({ error: 'CORS denied' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch {
        // Invalid origin, continue
      }
    }

    // Parse body
    let body: { email?: string; password?: string; name?: string };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { email, password, name } = body;

    // Validate
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Password validation
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Rate limit check
    const rateLimit = checkRateLimit('auth-sign-in');
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        error: 'Too many attempts. Please try again later.',
        resetIn: rateLimit.resetIn
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if name is provided (sign-up mode) or just password (sign-in mode)
    const isSignUp = !!name;

    // Get env
    const { env } = await import('cloudflare:workers');
    const db = env.DB as D1Database;

    if (!db) {
      return new Response(JSON.stringify({ error: 'Database unavailable' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (isSignUp) {
      // === SIGN UP ===

      // Check if user exists
      const existingUser = await db
        .prepare('SELECT id FROM user WHERE email = ?')
        .bind(email.toLowerCase())
        .first();
      if (existingUser) {
        return new Response(JSON.stringify({ error: 'Email already registered' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Hash password
      const passwordHash = await bcryptHash(password, 10);
      const userId = generateId();
      const now = Math.floor(Date.now() / 1000);
      // Create user
      await db
        .prepare(`
          INSERT INTO user (id, email, name, role, createdAt, updatedAt, emailVerified)
          VALUES (?, ?, ?, 'user', ?, ?, 1)
        `)
        .bind(userId, email.toLowerCase(), name, now, now)
        .run();
      // Create account
      const accountId = generateId();
      await db
        .prepare(`
          INSERT INTO account (id, userId, accountId, providerId, password, createdAt, updatedAt)
          VALUES (?, ?, ?, 'email', ?, ?, ?)
        `)
        .bind(accountId, userId, userId, passwordHash, now, now)
        .run();

      return new Response(JSON.stringify({
        success: true,
        user: { id: userId, email, name, role: 'user' }
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });

    } else {
      // === SIGN IN ===

      const userResult = await db
        .prepare('SELECT id, email, name, role FROM user WHERE email = ?')
        .bind(email.toLowerCase())
        .first();
      if (!userResult) {
        return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const accountResult = await db
        .prepare('SELECT password FROM account WHERE userId = ? AND providerId = ?')
        .bind(userResult.id, 'email')
        .first();
      if (!accountResult) {
        return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Verify password
      const passwordValid = await bcryptCompare(password, accountResult.password as string);
      if (!passwordValid) {
        return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Generate session
      const sessionToken = generateSessionToken();
      const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;

      // Store in KV
      const kv = env.SESSION as KVNamespace;
      if (kv) {
        await kv.put(
          `session:${sessionToken}`,
          JSON.stringify({ userId: userResult.id, email: userResult.email }),
          { expirationTtl: SESSION_TTL_SECONDS }
        );
      }
      // Store in database
      await db
        .prepare(`
          INSERT INTO session (id, userId, token, expiresAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(sessionToken, userResult.id, sessionToken, expiresAt, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000))
        .run();
      // Build cookie - omit Secure flag on localhost/127.0.0.1 (HTTP)
      const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1') || !host?.startsWith('https');
      const cookieStr = `better-auth.session_token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${!isLocalhost ? '; Secure' : ''}`;

      return new Response(JSON.stringify({
        success: true,
        user: {
          id: userResult.id,
          email: userResult.email,
          name: userResult.name,
          role: userResult.role
        },
        token: sessionToken
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieStr
        }
      });
    }
  } catch (error) {
    console.error('[Auth API] Error:', error);
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}