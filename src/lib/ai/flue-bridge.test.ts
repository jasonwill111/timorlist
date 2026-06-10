// Tests for flue-bridge — message building and schema mapping
import { describe, it, expect } from 'vitest';
import { ListingDataSchema, SkuDataSchema, BlogDataSchema, LandingDataSchema } from './valibot-schemas';

// Test valibot schemas resolve (they're Zod schemas re-exported; verify they exist and are valid)
describe('Valibot Schema imports', () => {
  it('ListingDataSchema is a valid schema object', () => {
    expect(ListingDataSchema).toBeDefined();
    expect(typeof ListingDataSchema).toBe('object');
  });

  it('SkuDataSchema is a valid schema object', () => {
    expect(SkuDataSchema).toBeDefined();
    expect(typeof SkuDataSchema).toBe('object');
  });

  it('BlogDataSchema is a valid schema object', () => {
    expect(BlogDataSchema).toBeDefined();
    expect(typeof BlogDataSchema).toBe('object');
  });

  it('LandingDataSchema is a valid schema object', () => {
    expect(LandingDataSchema).toBeDefined();
    expect(typeof LandingDataSchema).toBe('object');
  });
});

describe('Message building logic (ported from flue-generate)', () => {
  // These test the message string construction logic
  // that was ported from the original flue-generate.ts functions

  function buildListingMessage(data: Record<string, unknown>): string {
    const title = String(data.title ?? '');
    const entityType = String(data.entityType ?? 'business');
    const contactName = String(data.contactName ?? '');
    const phone = String(data.phone ?? '');
    const email = String(data.email ?? '');
    const address = String(data.address ?? '');
    const about = String(data.about ?? '');
    const tags = Array.isArray(data.tags) ? data.tags : String(data.tags ?? '').split(',');
    return `Create a listing for "${title}" (${entityType}).
Contact: ${contactName || 'N/A'}
Phone: ${phone || 'N/A'}
Email: ${email || 'N/A'}
Address: ${address || 'N/A'}
About: ${about || 'N/A'}
Tags: ${Array.isArray(tags) ? tags.join(', ') : tags || 'N/A'}`;
  }

  function buildSkuMessage(data: Record<string, unknown>): string {
    const skuTitle = String(data.title ?? '');
    const skuDesc = String(data.description ?? '');
    const priceFields = Array.isArray(data.priceFields) ? data.priceFields : [];
    const priceInfo = priceFields.length > 0
      ? priceFields.map((p: { label: string; value: string; unit?: string }) =>
          `${p.label}: ${p.value} ${p.unit || ''}`).join(', ')
      : `Price: ${String(data.priceValue ?? 'N/A')}`;
    return `Create a ${data.productType || 'product'} called "${skuTitle}".
Description: ${skuDesc}
${priceInfo}`;
  }

  function buildBlogMessage(data: Record<string, unknown>): string {
    const topic = String(data.topic ?? '');
    return `Write a ${data.type || 'general'} article about "${topic}".
Length: ${data.length || 'medium'}
Requirements: ${data.prompt || 'N/A'}`;
  }

  function buildLandingMessage(data: Record<string, unknown>): string {
    const lpTitle = String(data.title ?? '');
    return `Create a ${data.type || 'promotion'} landing page for "${lpTitle}".
Description: ${data.description || 'N/A'}
Requirements: ${data.prompt || 'N/A'}`;
  }

  it('builds listing message with all fields', () => {
    const msg = buildListingMessage({
      title: 'Coffee Shop',
      entityType: 'business',
      contactName: 'Maria',
      phone: '77000000',
      email: 'cafe@example.tl',
      address: 'Dili',
      about: 'Best coffee in Timor-Leste',
      tags: ['coffee', 'cafe'],
    });
    expect(msg).toContain('Coffee Shop');
    expect(msg).toContain('Maria');
    expect(msg).toContain('77000000');
    expect(msg).toContain('cafe@example.tl');
    expect(msg).toContain('Best coffee');
    expect(msg).toContain('coffee, cafe');
  });

  it('builds sku message with priceFields', () => {
    const msg = buildSkuMessage({
      title: 'Handicraft',
      description: 'Beautiful weave',
      productType: 'product',
      priceFields: [{ label: 'Price', value: '25', unit: '/piece' }],
    });
    expect(msg).toContain('Handicraft');
    expect(msg).toContain('Beautiful weave');
    expect(msg).toContain('Price: 25 /piece');
  });

  it('builds sku message with priceValue fallback', () => {
    const msg = buildSkuMessage({
      title: 'Coffee',
      description: 'Local blend',
      priceValue: '15',
    });
    expect(msg).toContain('Coffee');
    expect(msg).toContain('Price: 15');
  });

  it('builds blog message', () => {
    const msg = buildBlogMessage({
      topic: 'Timor-Leste tourism',
      type: 'travel',
      length: 'long',
      prompt: 'Include beach recommendations',
    });
    expect(msg).toContain('Timor-Leste tourism');
    expect(msg).toContain('travel');
    expect(msg).toContain('long');
  });

  it('builds landing message', () => {
    const msg = buildLandingMessage({
      title: 'Business Landing',
      type: 'promotion',
      description: 'About our business',
      prompt: 'Include features',
    });
    expect(msg).toContain('Business Landing');
    expect(msg).toContain('promotion');
  });
});
