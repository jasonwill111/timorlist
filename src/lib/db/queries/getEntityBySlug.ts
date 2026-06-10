import { getRawDb } from '@/lib/db';

type EntityType = 'non-profit' | 'public-sector';

interface NonProfitRecord {
  id: string;
  title: string;
  slug: string;
  aboutUs: string | null;
  contact_name: string | null;
  contact_number: string | null;
  country_code: string | null;
  email: string | null;
  address: string | null;
  year_of_establishment: number | null;
  opening_hours: string | null;
  tags: string | null;
  social_links: string | null;
  likes: number | null;
  saves: number | null;
  views: number | null;
  category_id: string | null;
  status: string | null;
  profile_image_id: string | null;
  photo_gallery: string | null;
}

interface EntityImages {
  id: string;
  r2_key: string;
  alt: string | null;
}

interface EntityResult {
  entity: NonProfitRecord | null;
  category: { name: string } | null;
  socialLinks: Record<string, string>;
  tags: string[];
  galleryImages: EntityImages[];
  profileImage: { r2_key: string; alt: string | null } | null;
}

export async function getEntityBySlug(
  slug: string,
  entityType: EntityType
): Promise<EntityResult> {
  if (!slug) return { entity: null, category: null, socialLinks: {}, tags: [], galleryImages: [], profileImage: null };

  const db = await getRawDb();
  if (!db) return { entity: null, category: null, socialLinks: {}, tags: [], galleryImages: [], profileImage: null };

  const tableMap: Record<EntityType, string> = {
    'non-profit': 'non_profits',
    'public-sector': 'public_sectors',
  };
  const categoryTableMap: Record<EntityType, string> = {
    'non-profit': 'non_profit_categories',
    'public-sector': 'public_sector_categories',
  };

  const table = tableMap[entityType];
  const categoryTable = categoryTableMap[entityType];

  try {
    const entity = await db.prepare(`
      SELECT id, title, slug, aboutUs, contact_name, contact_number, country_code, email,
             address, year_of_establishment, opening_hours, tags, social_links,
             likes, saves, views, category_id, status, profile_image_id, photo_gallery
      FROM ${table} WHERE slug = ? LIMIT 1
    `).bind(slug).first() as NonProfitRecord | null;

    if (!entity) return { entity: null, category: null, socialLinks: {}, tags: [], galleryImages: [], profileImage: null };

    let category: { name: string } | null = null;
    if (entity.category_id) {
      category = await db.prepare(`SELECT name FROM ${categoryTable} WHERE id = ? LIMIT 1`)
        .bind(entity.category_id).first() as { name: string } | null;
    }

    let socialLinks: Record<string, string> = {};
    if (entity.social_links) {
      try { socialLinks = JSON.parse(entity.social_links); } catch {}
    }

    let tags: string[] = [];
    if (entity.tags) {
      try { tags = JSON.parse(entity.tags); } catch {}
    }

    let galleryImages: EntityImages[] = [];
    let profileImage: { r2_key: string; alt: string | null } | null = null;
    if (entity.photo_gallery || entity.profile_image_id) {
      const mediaIds: string[] = [];
      if (entity.profile_image_id) mediaIds.push(entity.profile_image_id);
      if (entity.photo_gallery) {
        try {
          const gallery: string[] = JSON.parse(entity.photo_gallery);
          mediaIds.push(...gallery.filter(id => !mediaIds.includes(id)));
        } catch {}
      }
      if (mediaIds.length) {
        const placeholders = mediaIds.map(() => '?').join(',');
        const imgsResult = await db.prepare(
          `SELECT id, r2_key, alt FROM media WHERE id IN (${placeholders})`
        ).bind(...mediaIds).all();
        const allImages = (imgsResult.results as unknown as EntityImages[]) || [];
        if (entity.profile_image_id) {
          profileImage = allImages.find(img => img.id === entity.profile_image_id) || null;
        }
        galleryImages = allImages.filter(img => img.id !== entity.profile_image_id);
      }
    }

    return { entity, category, socialLinks, tags, galleryImages, profileImage };
  } catch (e) {
    console.error('[getEntityBySlug] DB error:', e);
    return { entity: null, category: null, socialLinks: {}, tags: [], galleryImages: [], profileImage: null };
  }
}