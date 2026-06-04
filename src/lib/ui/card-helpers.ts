/**
 * Helpers for building canonical entity hrefs in card components.
 * Centralizes route construction so URL changes happen in one place.
 */

export type EntityType = 'business' | 'nonprofit' | 'publicsector';

const SLUG_PREFIX: Record<EntityType, string> = {
  business: '/business',
  nonprofit: '/non-profit',
  publicsector: '/public-sector',
};

/**
 * Build href to an entity's public page.
 */
export function buildEntityHref(entityType: EntityType, slug: string): string {
  return `${SLUG_PREFIX[entityType]}/${slug}`;
}

/**
 * Build href to a listing detail page.
 */
export function buildListingHref(slug: string): string {
  return `/listings/${slug}`;
}
export function buildProductHref(businessSlug: string, productSlug: string = ''): string {
  if (!businessSlug) return '#';
  return productSlug
    ? `/business/${businessSlug}/product/${productSlug}`
    : `/business/${businessSlug}`;
}