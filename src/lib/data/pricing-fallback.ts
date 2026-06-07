/**
 * Pricing fallback data
 * Used when DB is unavailable or empty.
 * Mirrors remote schema: service_type, service_relation_to, variants (JSON string)
 */
export type ServicePackage = {
  id: string;
  name: string;
  slug: string;
  service_type: string;
  service_relation_to: string | null;
  description: string | null;
  variants: string;
  is_active: number | null;
  sort_order: number | null;
};

export const FALLBACK_PRICING_PLANS: ServicePackage[] = [
  // Business Page Plans (subscription)
  { id: 'sp-business-basic', name: 'Basic', slug: 'basic-monthly', service_type: 'subscription', service_relation_to: 'business', description: 'For small businesses', variants: JSON.stringify({ variants: [{ name: 'Basic Monthly', price: 39, currency: 'USD', durationUnit: 'month', durationValue: 1, limits: { skuLimit: 10 }, features: ['Up to 10 products', 'Business profile', 'Reviews & ratings'] }] }), is_active: 1, sort_order: 10 },
  { id: 'sp-business-pro', name: 'Pro', slug: 'pro-monthly', service_type: 'subscription', service_relation_to: 'business', description: 'For growing businesses', variants: JSON.stringify({ variants: [{ name: 'Pro Monthly', price: 69, currency: 'USD', durationUnit: 'month', durationValue: 1, limits: { skuLimit: 30 }, features: ['Up to 30 products', 'Featured placement', 'Analytics'] }] }), is_active: 1, sort_order: 20 },
  { id: 'sp-business-max', name: 'Max', slug: 'max-monthly', service_type: 'subscription', service_relation_to: 'business', description: 'For established businesses', variants: JSON.stringify({ variants: [{ name: 'Max Monthly', price: 99, currency: 'USD', durationUnit: 'month', durationValue: 1, limits: { skuLimit: 60 }, features: ['Up to 60 products', 'Top placement', 'Priority support'] }] }), is_active: 1, sort_order: 30 },
  // Listing Renewals
  { id: 'sp-listing-7days', name: '7-Day Listing', slug: '7-day-listing', service_type: 'listing_renewal', service_relation_to: 'listing', description: '7 days', variants: JSON.stringify({ variants: [{ name: '7 Days', price: 8, currency: 'USD', durationUnit: 'days', durationValue: 7, features: ['7-day visibility', 'Up to 4 images'] }] }), is_active: 1, sort_order: 100 },
  { id: 'sp-listing-30days', name: '30-Day Listing', slug: '30-day-listing', service_type: 'listing_renewal', service_relation_to: 'listing', description: '30 days', variants: JSON.stringify({ variants: [{ name: '30 Days', price: 15, currency: 'USD', durationUnit: 'days', durationValue: 30, features: ['30-day visibility', 'Up to 6 images'] }] }), is_active: 1, sort_order: 110 },
  { id: 'sp-listing-365days', name: '365-Day Listing', slug: '365-day-listing', service_type: 'listing_renewal', service_relation_to: 'listing', description: '365 days', variants: JSON.stringify({ variants: [{ name: '365 Days', price: 120, currency: 'USD', durationUnit: 'days', durationValue: 365, features: ['365-day visibility', 'Up to 8 images', 'Priority support'] }] }), is_active: 1, sort_order: 120 },
];
