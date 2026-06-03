// Auth API - Session (Get current user)
// Reads session from database using raw SQL
// Note: 'cloudflare:workers' is a runtime virtual module; static import is not possible
export const prerender = false;

export async function GET({ request }: { request: Request }) {
  try {
    // eslint-disable-next-line ts-import-type, ts-no-dynamic-import
    const { env } = await import('cloudflare:workers');

    if (!env.DB) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = env.DB as D1Database;

    // Get token from cookie
    const cookieHeader = request.headers.get('cookie');
    const match = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);

    if (!match) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = match[1];
    const now = Math.floor(Date.now() / 1000);

    // Query session from database - uses camelCase columns
    const session = await db
      .prepare('SELECT id, userId, token, expiresAt, createdAt, updatedAt FROM session WHERE token = ? LIMIT 1')
      .bind(token)
      .first() as { id: string; userId: string; token: string; expiresAt: number; createdAt: number; updatedAt: number } | null;

    if (!session) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if session is expired (handle both number and string)
    const expiresAtMs = typeof session.expiresAt === 'number'
      ? (session.expiresAt < 1e12 ? session.expiresAt * 1000 : session.expiresAt)
      : new Date(session.expiresAt).getTime();

    if (expiresAtMs < Date.now()) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user info - try with 'user' table (singular)
    const user = await db
      .prepare('SELECT id, email, name, role, image FROM user WHERE id = ? LIMIT 1')
      .bind(session.userId)
      .first() as { id: string; email: string; name: string; role: string; image: string | null } | null;

    if (!user) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role || 'user',
        image: user.image,
      },
      session: {
        id: session.id,
        expiresAt: new Date(expiresAtMs).toISOString(),
        token: session.token,
        userId: session.userId,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Session] Error:', errorMessage);
    return new Response(JSON.stringify({
      error: errorMessage,
      user: null,
      session: null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}