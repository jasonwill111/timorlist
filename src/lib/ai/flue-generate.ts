// Flue AI Generation — Flue-backed content generation
// All 4 generator functions delegate to flue-bridge.ts (Flue agent harness)
import type {
  ListingOutput,
  SkuOutput,
  BlogOutput,
  LandingOutput,
} from '@/lib/ai/valibot-schemas';
import {
  generateListing as bridgeListing,
  generateSku as bridgeSku,
  generateBlog as bridgeBlog,
  generateLanding as bridgeLanding,
} from './flue-bridge';

export async function generateListing(data: Record<string, unknown>): Promise<ListingOutput> {
  return bridgeListing(data);
}

export async function generateSku(data: Record<string, unknown>): Promise<SkuOutput> {
  return bridgeSku(data);
}

export async function generateBlog(data: Record<string, unknown>): Promise<BlogOutput> {
  return bridgeBlog(data);
}

export async function generateLanding(data: Record<string, unknown>): Promise<LandingOutput> {
  return bridgeLanding(data);
}
