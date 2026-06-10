/**
 * Admin Service Packages Query Functions
 */
import { getDb } from '@/lib/db';
import { servicePackages } from '@/db/schema';
import { desc } from 'drizzle-orm';

export interface PackageVariant {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationValue: number;
  durationUnit: string;
  limits: {
    skuLimit?: number;
    maxImages?: number;
    maxVideos?: number;
    maxBusinessImages?: number;
    maxBusinessVideos?: number;
  };
  features: string[];
}

export interface ServicePackageData {
  id: string;
  name: string;
  slug: string;
  serviceRelationTo: string;
  description: string | null;
  variants: PackageVariant[];
  isActive: boolean;
  sortOrder: number;
  createdAt: number | null;
  updatedAt: number | null;
}

export async function getAdminServicePackages(): Promise<ServicePackageData[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = db.select()
    .from(servicePackages)
    .orderBy(desc(servicePackages.sortOrder))
    .all();

  return rows.map(row => {
    let variants: PackageVariant[] = [];
    try {
      variants = row.variants ? JSON.parse(row.variants) : [];
    } catch {
      variants = [];
    }
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      serviceRelationTo: row.serviceRelationTo,
      description: row.description,
      variants,
      isActive: Boolean(row.isActive),
      sortOrder: row.sortOrder ?? 0,
      createdAt: row.createdAt ?? null,
      updatedAt: row.updatedAt ?? null,
    };
  });
}