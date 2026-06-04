/**
 * Generic entity query helpers.
 * Reduce duplication across the three entity types: businesses, non_profits, public_sectors.
 *
 * These helpers take a Drizzle table that has the canonical shape:
 *   - id: string primary key
 *   - slug: string
 *   - ownerId: string (foreign key to users)
 *   - status: 'live' | 'draft' | etc.
 *   - deletedAt: timestamp (for soft deletes)
 */
import { getDb } from '@/lib/db';
import { and, eq, isNull, type SQL } from 'drizzle-orm';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';

interface EntityTable {
  id: SQLiteColumn;
  slug: SQLiteColumn;
  ownerId: SQLiteColumn;
  status: SQLiteColumn;
  deletedAt: SQLiteColumn;
}

/**
 * Get an entity by its primary key.
 * Optionally include soft-deleted records.
 */
export async function getById<T extends EntityTable>(
  table: T,
  id: string,
  options: { includeDeleted?: boolean } = {},
): Promise<unknown | null> {
  const db = await getDb();
  if (!db) return null;
  const where = options.includeDeleted
    ? eq(table.id, id)
    : and(eq(table.id, id), isNull(table.deletedAt));
  const result = await db.select().from(table as never).where(where as SQL).limit(1).get();
  return result ?? null;
}

/**
 * Get an entity by its slug.
 */
export async function getBySlug<T extends EntityTable>(
  table: T,
  slug: string,
  options: { includeDeleted?: boolean } = {},
): Promise<unknown | null> {
  const db = await getDb();
  if (!db) return null;
  const where = options.includeDeleted
    ? eq(table.slug, slug)
    : and(eq(table.slug, slug), isNull(table.deletedAt));
  const result = await db.select().from(table as never).where(where as SQL).limit(1).get();
  return result ?? null;
}

/**
 * Get the entity owned by a specific user (one-per-user limit check).
 */
export async function getByOwner<T extends EntityTable>(
  table: T,
  ownerId: string,
): Promise<unknown | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(table as never)
    .where(and(eq(table.ownerId, ownerId), isNull(table.deletedAt)))
    .limit(1)
    .get();
  return result ?? null;
}

/**
 * Check if a slug already exists, optionally excluding a specific id.
 */
export async function slugExists<T extends EntityTable>(
  table: T,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const existing = await db
    .select({ id: table.id })
    .from(table as never)
    .where(eq(table.slug, slug))
    .limit(1)
    .get();
  if (!existing) return false;
  if (!excludeId) return true;
  return (existing as { id: string }).id !== excludeId;
}
