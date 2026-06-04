/**
 * Astro Middleware - Security Headers + Smart Cache
 * P0/P1 security fixes applied (2026-06-02):
 * - CSRF: compare origin against configured site URL (not Host header)
 * - Static cache: actually apply static asset cache headers
 * - CSP: documented unsafe-inline pattern (Tailwind v4 requires it)
 */

import { defineMiddleware } from 'astro:middleware';

const SITE_URL = 'https://timorup.com';
// Production trust set: the configured site host + any Cloudflare Workers preview/staging domains
const PRODUCTION_TRUSTED_HOSTS = new Set<string>([
  new URL(SITE_URL).host,
  'timorup.jasonwill.workers.dev', // Staging deployment
  'timorup.pages.dev', // Cloudflare Pages staging
]);
const DEV_TRUSTED_HOSTS = new Set<string>(['localhost', '127.0.0.1']);

const STATIC_CACHE = {
  'Cache-Control': 'public, max-age=31536000, immutable',
};

const DYNAMIC_CACHE_FALLBACK = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export const onRequest = defineMiddleware(async (context, next) => {
  const mutationMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

  // === P1-B: CSRF Protection ===
  // Compare origin host against the configured site host (production) or
  // any localhost/127.0.0.1 host (dev). This prevents Host header injection
  // bypass while still allowing local auth and API calls during development.
  if (mutationMethods.includes(context.request.method)) {
    const origin = context.request.headers.get('origin');
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const host = originUrl.host; // e.g. "localhost:4321" or "timorup.com"
        const hostname = originUrl.hostname;

        const isTrusted =
          PRODUCTION_TRUSTED_HOSTS.has(host) || DEV_TRUSTED_HOSTS.has(hostname);

        if (!isTrusted) {
          return new Response('CSRF validation failed', {
            status: 403,
            statusText: 'Forbidden',
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      } catch {
        return new Response('Invalid origin', {
          status: 403,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    }
  }

  const response = await next();

  const url = context.url;
  const isStaticAsset =
    url.pathname.startsWith('/_astro/') ||
    /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/.test(url.pathname);

  let hasExistingCacheControl = false;
  response.headers.forEach((_, key) => {
    if (key.toLowerCase() === 'cache-control') hasExistingCacheControl = true;
  });

  const newHeaders = new Headers();
  response.headers.forEach((value, key) => {
    newHeaders.set(key, value);
  });

  // === P2-L: Static cache headers - actually apply to static assets ===
  if (isStaticAsset) {
    newHeaders.set('Cache-Control', STATIC_CACHE['Cache-Control']);
    newHeaders.set('Pragma', 'public');
    newHeaders.set('Expires', new Date(Date.now() + 31536000000).toUTCString());
  } else if (!hasExistingCacheControl) {
    newHeaders.set('Cache-Control', DYNAMIC_CACHE_FALLBACK['Cache-Control']);
    newHeaders.set('Pragma', 'no-cache');
    newHeaders.set('Expires', '0');
  }

  // === P1-A: CSP ===
  // unsafe-inline for scripts: required for Astro framework + Tailwind v4
  // unsafe-inline for styles: required for Tailwind v4 CSS-in-JS approach
  // All script/style sources are restricted to self + Google Fonts
  // Consider migrating to nonce-based CSP in Astro 7+ with better framework support
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  newHeaders.set('X-XSS-Protection', '1; mode=block');
  newHeaders.set('Content-Security-Policy', csp);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
});