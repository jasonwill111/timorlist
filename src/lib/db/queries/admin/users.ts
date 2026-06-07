/**
 * Admin Users Query Functions
 */
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { or, like, eq, desc } from 'drizzle-orm';

export interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export async function getAdminUsers(
  search?: string,
  role?: string,
  limit = 100
): Promise<UserData[]> {
  const db = await getDb();
  if (!db) return [];

  let query = db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    phone: users.phone,
    role: users.role,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }).from(users).orderBy(desc(users.createdAt)).limit(limit);

  return query.all();
}