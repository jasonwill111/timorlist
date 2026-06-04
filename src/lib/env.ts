// Cloudflare Workers Environment Access - type-safe wrapper
// Canonical location for all env/DB/Auth/KV access helpers.
// Re-exports from specialized modules to provide a single import path.

export function getEnv(): Env {
  if (typeof globalThis !== 'undefined' && 'env' in globalThis) {
    return (globalThis as unknown as { env: Env }).env;
  }
  return {} as Env;
}

// Re-export resource accessors from their canonical modules so callers
// can import everything from '@/lib/env' for a single source of truth.
export { getDb } from './db';
export { getAuth, initAuth } from './auth';

// MiniMax API Key - supports both environments:
// - Local dev: Vite loads .env into import.meta.env
// - Workers: nodejs_compat_populate_process_env populates process.env
export function getMinimaxApiKey(): string {
  if (typeof import.meta !== 'undefined' && (import.meta.env as Record<string, string>)?.MINIMAX_API_KEY) {
    return (import.meta.env as Record<string, string>).MINIMAX_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env?.MINIMAX_API_KEY) {
    return process.env.MINIMAX_API_KEY;
  }
  return getEnv().MINIMAX_API_KEY || '';
}
