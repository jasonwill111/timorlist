/**
 * Astro Middleware - Auth Guard + Security Headers + Smart Cache
 * Updated 2026-06-10:
 * - Add auth guard for /listings/create (requires login)
 * - Wrap auth check in try-catch to prevent SSR 500s on D1 errors
 */
import { defineMiddleware } from 'astro:middleware';
import { getAdminUser } from '@/lib/admin-auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url;
  const pathname = url.pathname;

  // === Auth Guard: /listings/create requires login ===
  if (pathname === '/listings/create') {
    try {
      const user = await getAdminUser(context.request);
      if (!user) {
        const redirectTo = new URL('/login', url);
        redirectTo.searchParams.set('redirect', pathname);
        return context.redirect(redirectTo.toString(), 302);
      }
    } catch (e) {
      // If auth check fails (D1 unavailable), deny access rather than 500
      console.error('Auth guard error for /listings/create:', e);
      return new Response('Service Unavailable', { status: 503 });
    }
  }

  const response = await next();

  // === Static asset detection ===
  const isStaticAsset =
    pathname.startsWith('/_astro/') ||
    /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/.test(pathname);

  let hasExistingCacheControl = false;
  response.headers.forEach((_, key) => {
    if (key.toLowerCase() === 'cache-control') hasExistingCacheControl = true;
  });

  const newHeaders = new Headers();
  response.headers.forEach((value, key) => {
    newHeaders.set(key, value);
  });

  // === Cache control ===
  if (isStaticAsset) {
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (!hasExistingCacheControl) {
    newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }

  // === CSP (P1-A) ===
  // unsafe-inline required for: Astro framework runtime + Tailwind v4 CSS-in-JS
  // img-src: self + data: (inline SVG) + R2 public bucket + site domain (OG images)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://pub-timorup.jasonwill.workers.dev https://timorup.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  // === Security headers ===
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  newHeaders.set('Content-Security-Policy', csp);
  newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
  newHeaders.set('Cross-Origin-Resource-Policy', 'same-origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
});
