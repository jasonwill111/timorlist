// Global module declarations for Astro components
// Allows importing *.astro files from .ts and .js files

declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
  
  const component: AstroComponentFactory;
  export default component;
}

// Allow relative .astro imports (e.g., './my-component.astro')
declare module './**/*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
  const component: AstroComponentFactory;
  export default component;
}
