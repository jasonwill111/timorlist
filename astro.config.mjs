import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    kvNamespaces: [],
    imageService: 'cloudflare-binding',
  }),
  experimental: {
    queuedRendering: {
      enabled: true,
      poolSize: 2000,
    },
  },
  security: {
    checkOrigin: true,
    allowedDomains: [
      { hostname: '**.timorup.com', protocol: 'https' },
      { hostname: 'timorup.jasonwill.workers.dev', protocol: 'https' },
      { hostname: 'localhost:*', protocol: 'http' },
    ],
    actionBodySizeLimit: 2 * 1024 * 1024,
    serverIslandBodySizeLimit: 2 * 1024 * 1024,
  },
  site: 'https://timorup.com',

  prefetch: {
    defaultStrategy: 'viewport',
    defaultBundler: 'astro',
  },

  compressHTML: true,

  integrations: [],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    ssr: {
      external: ['cloudflare:workers', 'better-auth', '@better-auth/kysely-adapter'],
    },
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    optimizeDeps: {
      exclude: ['better-auth', '@better-auth/kysely-adapter'],
      noDiscovery: true,
    },
  },
});