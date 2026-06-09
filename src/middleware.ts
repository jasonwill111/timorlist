/**
 * Astro Middleware - Security Headers + Smart Cache
 * Updated 2026-06-09 (increment 0165):
 * - Remove custom CSRF: better-auth handles it via trustedOrigins + built-in CSRF
 * - Add HSTS, COOP, CORP headers (Cloudflare Workers best practice)
 * - Tighten CSP img-src (was 'https: blob:')
 * - Remove redundant X-Frame-Options (CSP frame-ancestors handles it)
 * - Remove deprecated X-XSS-Protection header
 * - Remove redundant Pragma/Expires (Cache-Control sufficient)
 */

import { defineMiddleware } from 'astro:middleware';

const SITE_URL = 'https://timorup.com';
const PRODUCTION_TRUSTED_HOSTS = new Set<string>([
  new URL(SITE_URL).host,
  'timorup.jasonwill.workers.dev',
  'timorup.pages.dev',
]);

export const onRequest = defineMiddleware(async (context, next) => {
  // CSRF is handled by better-auth's trustedOrigins + built-in CSRF protection.
  // Custom CSRF here would duplicate better-auth and cause false positives.
  void context;

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

  // === Static cache for immutable assets ===
  if (isStaticAsset) {
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (!hasExistingCacheControl) {
    newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }

  // === P1-A: CSP ===
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
  // Cloudflare Workers HSTS + Spectre mitigations
  newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
  newHeaders.set('Cross-Origin-Resource-Policy', 'same-origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
});