// Valibot schemas for Flue structured output
// Matches src/lib/ai/validation.ts — Zod → Valibot conversion
import * as v from 'valibot';

const OpeningHoursSchema = v.record(v.string(), v.object({
  open: v.string(),
  close: v.string(),
}));

export const ListingDataSchema = v.object({
  action: v.literal('create_listing'),
  data: v.object({
    entityType: v.picklist(['business', 'government', 'nonprofit', 'non-profit']),
    title: v.string(),
    slug: v.optional(v.string()),
    categoryId: v.optional(v.string()),
    contactName: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    registrationUrl: v.optional(v.string()),
    address: v.optional(v.string()),
    aboutUs: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    yearOfEstablishment: v.optional(v.number()),
    openingHours: v.optional(OpeningHoursSchema),
    locationLat: v.optional(v.number()),
    locationLng: v.optional(v.number()),
    status: v.optional(v.picklist(['draft', 'live', 'suspended'])),
    verifiedBadge: v.optional(v.boolean()),
    socialLinks: v.optional(v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      tiktok: v.optional(v.string()),
    })),
  }),
});

export const PriceFieldSchema = v.object({
  label: v.string(),
  value: v.string(),
  unit: v.optional(v.string()),
});

export const SkuDataSchema = v.object({
  action: v.literal('create_sku'),
  data: v.object({
    title: v.string(),
    description: v.optional(v.string()),
    productType: v.optional(v.picklist([
      'product', 'service', 'rental', 'food',
      'accommodation', 'automotive', 'healthcare', 'education', 'beauty', 'event',
    ])),
    priceFields: v.optional(v.array(PriceFieldSchema)),
    specifications: v.optional(v.record(v.string(), v.unknown())),
    featured: v.optional(v.boolean()),
    active: v.optional(v.boolean()),
  }),
});

export const BlogDataSchema = v.object({
  action: v.literal('create_blog'),
  data: v.object({
    title: v.string(),
    excerpt: v.optional(v.string()),
    content: v.string(),
    tags: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
    status: v.optional(v.picklist(['draft', 'published'])),
  }),
});

export const LandingFeatureSchema = v.object({
  title: v.string(),
  description: v.string(),
  icon: v.optional(v.string()),
});

export const LandingDataSchema = v.object({
  action: v.literal('create_landing_page'),
  data: v.object({
    hero: v.object({
      title: v.string(),
      subtitle: v.optional(v.string()),
      ctaText: v.optional(v.string()),
      ctaSecondary: v.optional(v.string()),
    }),
    description: v.optional(v.string()),
    features: v.optional(v.array(LandingFeatureSchema)),
    cta: v.optional(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      buttonText: v.optional(v.string()),
    })),
  }),
});

export type ListingOutput = v.InferOutput<typeof ListingDataSchema>;
export type SkuOutput = v.InferOutput<typeof SkuDataSchema>;
export type BlogOutput = v.InferOutput<typeof BlogDataSchema>;
export type LandingOutput = v.InferOutput<typeof LandingDataSchema>;
