// Flue Bridge — STUB (AI generation temporarily unavailable)
// @flue/runtime@0.9.2 does not export init(). AI generation returns errors until the harness is updated.
// Tracking: .specweave/increments/0161-build-fix-actions-ts
import * as v from 'valibot';
import {
  ListingDataSchema,
  SkuDataSchema,
  BlogDataSchema,
  LandingDataSchema,
  type ListingOutput,
  type SkuOutput,
  type BlogOutput,
  type LandingOutput,
} from '@/lib/ai/valibot-schemas';

const SCHEMA_MAP: Record<string, v.GenericSchema> = {
  listing: ListingDataSchema,
  sku: SkuDataSchema,
  blog: BlogDataSchema,
  landing: LandingDataSchema,
};

function notImplemented(type: string): never {
  throw new Error(`AI generation is temporarily unavailable (${type}). Please try again later.`);
}

export async function generate(
  type: 'listing' | 'sku' | 'blog' | 'landing',
  _userInput: string,
  _schema: v.GenericSchema,
): Promise<unknown> {
  notImplemented(type);
}

export async function generateListing(data: Record<string, unknown>): Promise<ListingOutput> {
  notImplemented('listing');
}

export async function generateSku(data: Record<string, unknown>): Promise<SkuOutput> {
  notImplemented('sku');
}

export async function generateBlog(data: Record<string, unknown>): Promise<BlogOutput> {
  notImplemented('blog');
}

export async function generateLanding(data: Record<string, unknown>): Promise<LandingOutput> {
  notImplemented('landing');
}