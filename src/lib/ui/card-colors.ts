/**
 * Color palette and gradient mappings for entity cards.
 * Centralizes the Tailwind gradient classes used by BusinessCard, ListingCard,
 * ProductCard, and BusinessHeaderCard.
 */

export const ORG_TYPE_COLORS: Record<string, string> = {
  government: 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40',
  ngo: 'from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40',
  nonprofit: 'from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40',
  foundation: 'from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40',
};

export const LISTING_TYPE_COLORS: Record<string, string> = {
  product: 'from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40',
  job: 'from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40',
  service: 'from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40',
  property: 'from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40',
  vehicle: 'from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40',
  wanted: 'from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40',
};

export const PRODUCT_TYPE_COLORS: Record<string, string> = {
  product: 'from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40',
  service: 'from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40',
  rental: 'from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40',
  food: 'from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40',
  accommodation: 'from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40',
  project: 'from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40',
};

export const LISTING_TYPE_LABELS: Record<string, string> = {
  product: 'For Sale',
  job: 'Jobs',
  service: 'Services',
  property: 'Property',
  vehicle: 'Vehicles',
  wanted: 'Wanted',
};

export const ENTITY_TYPE_COLORS: Record<string, string> = {
  business: 'from-amber-100 to-orange-100',
  organization: 'from-amber-100 to-orange-100',
};

export const DEFAULT_GRADIENT = 'from-amber-100 to-orange-100';

/**
 * Resolve a gradient class for an organization based on its org type.
 * Falls back to default amber gradient.
 */
export function getOrgTypeGradient(orgType: string): string {
  return ORG_TYPE_COLORS[orgType] || DEFAULT_GRADIENT;
}

/**
 * Resolve a gradient class for a listing based on its listing type.
 */
export function getListingTypeGradient(listingType: string): string {
  return LISTING_TYPE_COLORS[listingType] || LISTING_TYPE_COLORS.product!;
}

/**
 * Resolve a gradient class for a product based on its product type.
 */
export function getProductTypeGradient(productType: string): string {
  return PRODUCT_TYPE_COLORS[productType] || PRODUCT_TYPE_COLORS.product!;
}

export const HEADER_TYPE_COLORS: Record<string, { gradient: string; icon: string }> = {
  business: {
    gradient: 'from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30',
    icon: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
  },
  government: {
    gradient: 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
    icon: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30',
  },
  nonprofit: {
    gradient: 'from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30',
    icon: 'text-orange-500 bg-orange-50 dark:bg-orange-900/30',
  },
};

export function getHeaderTypeColors(entityType: string): { gradient: string; icon: string } {
  return HEADER_TYPE_COLORS[entityType] || HEADER_TYPE_COLORS.business!;
}
