/**
 * Pricing data layer
 * Fetches service packages and categorizes them by type.
 * Extracted from PricingCards.astro for separation of concerns.
 */
import { getRawDb } from '@/lib/db';
import { FALLBACK_PRICING_PLANS, type ServicePackage } from '@/lib/data/pricing-fallback';

export type CategorizedPlans = {
  businessPlans: (ServicePackage & { variants: any[] })[];
  listingPlans: (ServicePackage & { variants: any[] })[];
  featuredPlans: (ServicePackage & { variants: any[] })[];
  addonPlans: (ServicePackage & { variants: any[] })[];
  bannerPlans: (ServicePackage & { variants: any[] })[];
};

function parseVariants(pkg: ServicePackage): ServicePackage & { variants: any[] } {
  const parsed = JSON.parse(pkg.variants || '{}');
  return { ...pkg, variants: parsed.variants || [] };
}

export async function getCategorizedPricingPlans(): Promise<CategorizedPlans> {
  const rawDb = await getRawDb();
  let packages: ServicePackage[] = [];

  try {
    if (rawDb) {
      const stmt = await rawDb.prepare('SELECT * FROM service_packages WHERE is_active = 1 ORDER BY sort_order ASC');
      const result = await stmt.all();
      packages = result as ServicePackage[];
    }
  } catch (e) {
    console.error('[Pricing] DB error, using fallback:', e);
  }

  // Use fallback if DB is empty
  if (packages.length === 0) {
    packages = FALLBACK_PRICING_PLANS;
  }

  return {
    businessPlans: packages
      .filter(p => p.service_type === 'subscription' && p.service_relation_to === 'business')
      .map(parseVariants),
    listingPlans: packages
      .filter(p => p.service_type === 'listing_renewal' && p.service_relation_to === 'listing')
      .map(parseVariants),
    featuredPlans: packages
      .filter(p => (p.service_type === 'listing' && p.service_relation_to === 'listing_page') ||
                   (p.service_type === 'business_page' && p.service_relation_to === 'business_page'))
      .map(parseVariants),
    addonPlans: packages
      .filter(p => p.service_type === 'business_page' && p.service_relation_to === 'business_product_page')
      .map(parseVariants),
    bannerPlans: packages
      .filter(p => p.service_type === 'ad_banner')
      .map(parseVariants),
  };
}
