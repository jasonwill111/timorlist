import { drizzle } from 'drizzle-orm/d1';
import * as schema from './src/db/schema/index.ts';
import { sql, eq, and } from 'drizzle-orm';
import { D1Database } from '@cloudflare/workers-types';

// Test the query using wrangler's D1
import { execSync } from 'child_process';

const countResult = execSync('npx wrangler d1 execute timorup-db --remote --command "SELECT COUNT(*) as cnt FROM products WHERE active=1 AND deleted_at IS NULL"', {
  encoding: 'utf8',
  timeout: 20000
});

console.log('Raw count result:');
console.log(countResult);
