import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/6b123a0a511434e0a5b0b552d2fd45a8a7170721bd777a2037c52e5c9f888f98.sqlite',
  },
});
