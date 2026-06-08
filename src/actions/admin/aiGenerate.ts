// Astro Server Actions for Admin AI Content Generation
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';
import {
  generateListing,
  generateSku,
  generateBlog,
  generateLanding,
} from '@/lib/ai/flue-generate';

const AI_TIMEOUT = 120000; // 2 minutes

export const aiGenerate = defineAction({
  input: z.object({
    type: z.enum(['listing', 'sku', 'blog', 'landing']),
    data: z.record(z.string(), z.unknown()),
  }),
  handler: async (input, context) => {
    const request = context?.request;
    if (!request) {
      return createErrorResponse(ErrorCode.SERVER_ERROR, 'Request context not available');
    }

    const user = await getAdminUser(request);
    if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

    const data = input.data as Record<string, unknown>;

    try {
      const result = await Promise.race([
        (async () => {
          switch (input.type) {
            case 'listing': return generateListing(data);
            case 'sku': return generateSku(data);
            case 'blog': return generateBlog(data);
            case 'landing': return generateLanding(data);
          }
        })(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), AI_TIMEOUT)),
      ]);

      return { success: true, object: result as Record<string, unknown> };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      if (error.message === 'timeout') {
        return { success: false, error: { code: 'TIMEOUT', message: 'AI generation timed out' } };
      }

      console.error('[AI Generate] Error:', error);
      return { success: false, error: { code: 'ERROR', message: error.message } };
    }
  },
});