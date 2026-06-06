/**
 * TDD Tests for signIn.ts - GREEN phase
 * Tests that verify the rate-limit module works correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkRateLimit, checkRateLimitInMemory } from '@/lib/rate-limit';

// Use vi.hoisted so mocks are available before vi.mock factory runs
const { mockSessionGet, mockSessionPut } = vi.hoisted(() => ({
  mockSessionGet: vi.fn(),
  mockSessionPut: vi.fn(),
}));

vi.mock('cloudflare:workers', () => ({
  env: {
    SESSION: {
      get: mockSessionGet,
      put: mockSessionPut,
    },
  },
}));

describe('signIn action - GREEN tests (rate limiting)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TC-01: checkRateLimit should use KV namespace', () => {
    it('should store rate limit in KV when available', async () => {
      const identifier = 'signin:test@example.com';
      // count=5 already made, after incrementing: count=6
      // MAX_REQUESTS_PER_WINDOW = 1000, so remaining = 1000 - 6 = 994
      const stored = { count: 5, resetTime: Date.now() + 60000 };

      mockSessionGet.mockResolvedValue(JSON.stringify(stored));
      mockSessionPut.mockResolvedValue(undefined);

      const result = await checkRateLimit(identifier);

      expect(mockSessionGet).toHaveBeenCalledWith(`ratelimit:${identifier}`);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(994);
    });

    it('should return allowed:false when limit exceeded (1000 requests)', async () => {
      const identifier = 'signin:test@example.com';
      // count=1000 means 1000 requests already made - next should be blocked
      const stored = { count: 1000, resetTime: Date.now() + 60000 };

      mockSessionGet.mockResolvedValue(JSON.stringify(stored));

      const result = await checkRateLimit(identifier);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should create new record when no existing record', async () => {
      const identifier = 'signin:test@example.com';
      mockSessionGet.mockResolvedValue(null);
      mockSessionPut.mockResolvedValue(undefined);

      const result = await checkRateLimit(identifier);

      expect(mockSessionPut).toHaveBeenCalled();
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(999);
    });
  });

  describe('TC-02: Rate limiting window and limits', () => {
    it('should use 60 second window by default', async () => {
      const identifier = 'signin:test@example.com';
      mockSessionGet.mockResolvedValue(null);
      mockSessionPut.mockResolvedValue(undefined);

      const result = await checkRateLimit(identifier);

      expect(result.resetIn).toBe(60);
    });

    it('should track remaining requests accurately', async () => {
      const identifier = 'signin:test@example.com';
      // count=50 already made, after 51st: remaining = 1000 - 51 = 949
      const stored = { count: 50, resetTime: Date.now() + 60000 };

      mockSessionGet.mockResolvedValue(JSON.stringify(stored));
      mockSessionPut.mockResolvedValue(undefined);

      const result = await checkRateLimit(identifier);

      expect(result.remaining).toBe(949);
    });
  });

  describe('TC-03: KV fallback to in-memory', () => {
    it('should fall back to in-memory when KV throws', async () => {
      const identifier = 'signin:test@example.com';
      mockSessionGet.mockRejectedValue(new Error('KV unavailable'));
      mockSessionPut.mockRejectedValue(new Error('KV unavailable'));

      const result = await checkRateLimit(identifier);

      // Should still return allowed (fallback works)
      expect(result.allowed).toBe(true);
    });

    it('should use in-memory when KV is not available', async () => {
      // KV returns undefined (not available)
      mockSessionGet.mockResolvedValue(undefined);

      // First request on fresh in-memory store: remaining = 1000 - 1 = 999
      const result = await checkRateLimit('signin:new@example.com');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(999);
    });
  });
});

describe('checkRateLimitInMemory for testing', () => {
  it('should return allowed:true for first request', () => {
    const result = checkRateLimitInMemory('test:memory@example.com');
    expect(result.allowed).toBe(true);
    // Default MAX_REQUESTS_PER_WINDOW = 1000, first request: remaining = 999
    expect(result.remaining).toBe(999);
  });

  it('should track requests in memory', () => {
    const identifier = 'test:memory2@example.com';
    const first = checkRateLimitInMemory(identifier);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(999);

    const second = checkRateLimitInMemory(identifier);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(998);
  });
});

describe('getErrorMessage in utils.ts', () => {
  it('should export getErrorMessage function', async () => {
    const { getErrorMessage } = await import('@/lib/utils');
    expect(typeof getErrorMessage).toBe('function');
  });

  it('should extract message from Error instance', async () => {
    const { getErrorMessage } = await import('@/lib/utils');
    const error = new Error('Test error message');
    expect(getErrorMessage(error)).toBe('Test error message');
  });

  it('should convert non-Error to string', async () => {
    const { getErrorMessage } = await import('@/lib/utils');
    expect(getErrorMessage('string error')).toBe('string error');
    expect(getErrorMessage(123)).toBe('123');
    expect(getErrorMessage(null)).toBe('null');
  });

  it('signIn.ts should handle errors gracefully', async () => {
    const fs = await import('fs');
    const signInPath = `${process.cwd()}/src/actions/auth/signIn.ts`;
    const content = fs.readFileSync(signInPath, 'utf-8');

    const hasTryCatch = content.includes('try {') && content.includes('catch (error)');
    const hasErrorResponse = content.includes('createErrorResponse') && content.includes('ErrorCode');

    expect(hasTryCatch).toBe(true);
    expect(hasErrorResponse).toBe(true);
  });
});
