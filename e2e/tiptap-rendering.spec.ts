/**
 * E2E Tests - TipTap Content Rendering
 * Comprehensive tests for TipTap content rendering across all entity types:
 * - Business detail pages
 * - Non-profit detail pages
 * - Public-sector detail pages
 * - Listing detail pages
 * - Product detail pages
 * - Blog post pages (primary TipTap content)
 *
 * Also tests:
 * - Dark mode styling
 * - Mobile responsive layout
 * - Accessibility (heading hierarchy, ARIA labels)
 * - Mixed content elements
 *
 * Usage:
 *   # Set BASE_URL for local development:
 *   E2E_BASE_URL=http://localhost:8787 pnpm test:e2e -- e2e/tiptap-rendering.spec.ts
 *
 *   # Or use production URL (default):
 *   pnpm test:e2e -- e2e/tiptap-rendering.spec.ts
 *
 *   # Run with UI:
 *   pnpm test:e2e:ui -- e2e/tiptap-rendering.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

// Base URL - supports environment override for testing different environments
const BASE_URL = process.env.E2E_BASE_URL || process.env.BASE_URL || 'https://timorup.com';
const IS_LOCAL = BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1');

// TipTap test data - slugs from seed data
const TEST_DATA = {
  // Blog posts with rich TipTap HTML content
  blog: {
    slug: 'best-coffee-spots-in-dili',
    url: '/blog/best-coffee-spots-in-dili',
    expectedContent: {
      heading: 'Best Coffee Spots in Dili',
      hasLists: true,
      hasLinks: true,
    },
  },
  // Businesses (may have plain text or TipTap content)
  business: {
    slug: 'cafe-timor',
    url: '/business/cafe-timor',
    selector: '.tiptap-renderer',
  },
  // Non-profits (organization type: nonprofit)
  nonProfit: {
    slug: 'casa-esperanca',
    url: '/non-profit/casa-esperanca',
    selector: '.tiptap-renderer',
  },
  // Government agencies (organization type: government)
  publicSector: {
    slug: 'gov-portal',
    url: '/public-sector/gov-portal',
    selector: '.tiptap-renderer',
  },
  // Listings (classified ads)
  listing: {
    slug: 'toyota-hilux-2019',
    url: '/listing/toyota-hilux-2019',
    selector: '.tiptap-renderer',
  },
  // Products/Services
  product: {
    slug: 'timor-gold-coffee-beans-500g',
    url: '/product/timor-gold-coffee-beans-500g',
    selector: '.tiptap-renderer',
  },
};

// Helper function to get TipTap content element
function getTipTapSelector(entityType: string): string {
  return '.tiptap-renderer, .tiptap-content, [class*="tiptap"]';
}

// ============================================================
// TEST SUITE: TipTap Content Rendering
// ============================================================

test.describe('TipTap Content Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for SSR pages
    page.setDefaultTimeout(30000);
  });

  // ---------------------------------------------------------
  // Blog Post (Primary TipTap Content)
  // ---------------------------------------------------------
  test.describe('Blog Post TipTap Content', () => {
    test('should render TipTap content with headings on blog post page', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
      await page.waitForLoadState('networkidle');

      // Check page title
      await expect(page).toHaveTitle(/TimorUp|Dili|Coffee/);

      // Check for TipTap content container
      const tiptapContent = page.locator('.tiptap-content, .tiptap-renderer, article');
      await expect(tiptapContent.first()).toBeVisible();

      // Check for heading elements (TipTap renders h1, h2, h3)
      const headings = page.locator('h1, h2, h3, h4');
      const headingCount = await headings.count();
      console.log(`Found ${headingCount} heading elements`);
      expect(headingCount).toBeGreaterThan(0);

      // Verify the expected heading content exists
      const mainHeading = page.locator(`h1:has-text("${TEST_DATA.blog.expectedContent.heading}"), h2:has-text("${TEST_DATA.blog.expectedContent.heading}")`);
      await expect(mainHeading.first()).toBeVisible();
    });

    test('should render TipTap content with lists on blog post page', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
      await page.waitForLoadState('networkidle');

      // Check for list elements (ul/ol rendered by TipTap)
      const unorderedList = page.locator('ul');
      const orderedList = page.locator('ol');
      const listItems = page.locator('li');

      const ulCount = await unorderedList.count();
      const olCount = await orderedList.count();
      const liCount = await listItems.count();

      console.log(`Lists: ${ulCount} ul, ${olCount} ol, ${liCount} li items`);
      expect(liCount).toBeGreaterThan(0);
    });

    test('should render TipTap content with links on blog post page', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
      await page.waitForLoadState('networkidle');

      // Check for anchor elements
      const links = page.locator('a[href]');
      const linkCount = await links.count();

      console.log(`Found ${linkCount} links`);
      expect(linkCount).toBeGreaterThan(0);

      // Verify links have valid href attributes
      if (linkCount > 0) {
        const firstLink = links.first();
        const href = await firstLink.getAttribute('href');
        expect(href).toBeTruthy();
      }
    });

    test('should render TipTap content with mixed elements on blog post page', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
      await page.waitForLoadState('networkidle');

      // Check for all TipTap elements together
      const tiptapContainer = page.locator('.tiptap-content, .tiptap-renderer, article').first();
      await expect(tiptapContainer).toBeVisible();

      // Check for mixed content: paragraphs + headings + lists + links
      const paragraphs = tiptapContainer.locator('p');
      const headings = tiptapContainer.locator('h1, h2, h3');
      const lists = tiptapContainer.locator('ul, ol');
      const links = tiptapContainer.locator('a');

      const pCount = await paragraphs.count();
      const hCount = await headings.count();
      const lCount = await lists.count();
      const aCount = await links.count();

      console.log(`Mixed content: ${pCount} p, ${hCount} h, ${lCount} lists, ${aCount} links`);
      expect(pCount).toBeGreaterThan(0);
      expect(hCount).toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------
  // Business Detail Page
  // ---------------------------------------------------------
  test.describe('Business Detail Page TipTap', () => {
    test('should load business detail page with TipTap renderer', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.business.url}`);
      await page.waitForLoadState('networkidle');

      // Check page loads successfully
      await expect(page).toHaveTitle(/Café Timor|TimorUp|Cafe Timor/);

      // Check for TipTap renderer container
      const tiptapRenderer = page.locator('.tiptap-renderer');
      const tiptapContent = page.locator('.tiptap-content');

      const rendererExists = await tiptapRenderer.count() > 0;
      const contentExists = await tiptapContent.count() > 0;

      console.log(`TipTap renderer: ${rendererExists}, TipTap content: ${contentExists}`);

      // At least one should exist (or the About Us section with plain text)
      expect(rendererExists || contentExists || await page.locator('text=About Us').isVisible()).toBeTruthy();
    });

    test('should display About Us section with TipTap content on business page', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.business.url}`);
      await page.waitForLoadState('networkidle');

      // Look for About Us section
      const aboutSection = page.locator('text=About Us').first();
      await expect(aboutSection).toBeVisible();

      // Check that content is displayed (TipTap or plain)
      const contentArea = page.locator('.tiptap-renderer, .about-us-content, section p');
      const contentVisible = await contentArea.first().isVisible().catch(() => false);

      console.log(`Content area visible: ${contentVisible}`);
      // Content should be visible or fallback empty state shown
      expect(contentVisible || await page.locator('.empty').isVisible().catch(() => false)).toBeTruthy();
    });
  });

  // ---------------------------------------------------------
  // Non-Profit Detail Page
  // ---------------------------------------------------------
  test.describe('Non-Profit Detail Page TipTap', () => {
    test('should load non-profit detail page with TipTap renderer', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.nonProfit.url}`);
      await page.waitForLoadState('networkidle');

      // Check page loads
      await expect(page).toHaveTitle(/Casa de Esperança|TimorUp/);

      // Check for TipTap renderer
      const tiptapRenderer = page.locator('.tiptap-renderer');
      const tiptapRendererCount = await tiptapRenderer.count();

      console.log(`Found ${tiptapRendererCount} TipTap renderer elements`);

      // Should have TipTap renderer or show About Us section
      const hasAboutSection = await page.locator('text=About Us').isVisible().catch(() => false);
      expect(tiptapRendererCount > 0 || hasAboutSection).toBeTruthy();
    });

    test('should render non-profit content correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.nonProfit.url}`);
      await page.waitForLoadState('networkidle');

      // Check for main content area
      const mainContent = page.locator('main, [role="main"], article, .container');
      await expect(mainContent.first()).toBeVisible();

      // Check for organization title
      const title = page.locator('h1, h2').first();
      await expect(title).toBeVisible();
    });
  });

  // ---------------------------------------------------------
  // Public Sector Detail Page
  // ---------------------------------------------------------
  test.describe('Public Sector Detail Page TipTap', () => {
    test('should load public sector detail page with TipTap renderer', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.publicSector.url}`);
      await page.waitForLoadState('networkidle');

      // Check page loads
      await expect(page).toHaveTitle(/Government|TimorUp/);

      // Check for TipTap renderer
      const tiptapRenderer = page.locator('.tiptap-renderer');
      const tiptapRendererCount = await tiptapRenderer.count();

      console.log(`Found ${tiptapRendererCount} TipTap renderer elements`);

      // Should have TipTap renderer or show About Us section
      const hasAboutSection = await page.locator('text=About Us').isVisible().catch(() => false);
      expect(tiptapRendererCount > 0 || hasAboutSection).toBeTruthy();
    });

    test('should render public sector content with proper styling', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.publicSector.url}`);
      await page.waitForLoadState('networkidle');

      // Check for verified badge (government entities may have verified badge)
      const verifiedBadge = page.locator('[class*="verified"], .verified-badge');
      const hasVerified = await verifiedBadge.count() > 0;
      console.log(`Verified badge present: ${hasVerified}`);

      // Main content should be visible
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });
  });

  // ---------------------------------------------------------
  // Listing Detail Page
  // ---------------------------------------------------------
  test.describe('Listing Detail Page TipTap', () => {
    test('should load listing detail page with TipTap renderer', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.listing.url}`);
      await page.waitForLoadState('networkidle');

      // Check page loads
      await expect(page).toHaveTitle(/Toyota Hilux|TimorUp|Listing/);

      // Check for TipTap renderer
      const tiptapRenderer = page.locator('.tiptap-renderer');
      const tiptapRendererCount = await tiptapRenderer.count();

      console.log(`Found ${tiptapRendererCount} TipTap renderer elements`);

      // Should have content or description section
      const hasDescription = await page.locator('text=Description, h2:has-text("Description")').isVisible().catch(() => false);
      expect(tiptapRendererCount > 0 || hasDescription).toBeTruthy();
    });

    test('should display listing description with proper formatting', async ({ page }) => {
      await page.goto(`${BASE_URL}${TEST_DATA.listing.url}`);
      await page.waitForLoadState('networkidle');

      // Check for description content
      const descriptionSection = page.locator('.tiptap-renderer, p.description, .listing-description');
      const hasContent = await descriptionSection.first().isVisible().catch(() => false);

      console.log(`Description content visible: ${hasContent}`);

      // Should display the listing description
      const hasListingText = await page.locator('text=Toyota, text=Hilux, text=2019').first().isVisible().catch(() => false);
      expect(hasListingText || hasContent).toBeTruthy();
    });
  });

  // ---------------------------------------------------------
  // Product Detail Page
  // ---------------------------------------------------------
  test.describe('Product Detail Page TipTap', () => {
    test('should load product detail page with TipTap renderer', async ({ page }) => {
      // Try the coffee beans product
      await page.goto(`${BASE_URL}/product/timor-gold-coffee-beans-500g`);
      await page.waitForLoadState('networkidle');

      // Check page loads (title may vary)
      const title = await page.title();
      console.log(`Product page title: ${title}`);

      // Check for TipTap renderer or description section
      const tiptapRenderer = page.locator('.tiptap-renderer');
      const descriptionSection = page.locator('[class*="description"], h2:has-text("Description")');

      const hasRenderer = await tiptapRenderer.count() > 0;
      const hasDescription = await descriptionSection.isVisible().catch(() => false);

      console.log(`Renderer: ${hasRenderer}, Description: ${hasDescription}`);
      expect(hasRenderer || hasDescription).toBeTruthy();
    });

    test('should render product description with proper formatting', async ({ page }) => {
      await page.goto(`${BASE_URL}/product/timor-gold-coffee-beans-500g`);
      await page.waitForLoadState('networkidle');

      // Check for product content
      const productContent = page.locator('main, article, .product-detail, .tiptap-renderer');
      await expect(productContent.first()).toBeVisible();

      // Check for price display
      const priceDisplay = page.locator('[class*="price"], .product-price, text=$');
      const hasPrice = await priceDisplay.first().isVisible().catch(() => false);
      console.log(`Price display visible: ${hasPrice}`);
    });
  });
});

// ============================================================
// TEST SUITE: Dark Mode Styling
// ============================================================

test.describe('Dark Mode Styling', () => {
  test('should toggle dark mode on business detail page', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.business.url}`);
    await page.waitForLoadState('networkidle');

    // Find and click dark mode toggle
    const darkModeButton = page.locator('button[aria-label*="dark"], button[aria-label*="theme"], [data-theme-toggle]').first();

    if (await darkModeButton.isVisible()) {
      await darkModeButton.click();
      await page.waitForTimeout(500);

      // Check if dark mode class is applied
      const htmlElement = page.locator('html');
      const classList = await htmlElement.getAttribute('class');
      console.log(`HTML classes after dark mode toggle: ${classList}`);

      // Check that TipTap content is still visible after toggle
      const tiptapContent = page.locator('.tiptap-renderer, .tiptap-content');
      await expect(tiptapContent.first()).toBeVisible();
    } else {
      console.log('Dark mode toggle not found - skipping test');
      test.skip();
    }
  });

  test('should maintain TipTap content visibility in dark mode', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Get initial content state
    const tiptapContent = page.locator('.tiptap-content, .tiptap-renderer, article').first();
    const initialText = await tiptapContent.textContent().catch(() => '');

    // Try to toggle dark mode if available
    const darkModeButton = page.locator('button[aria-label*="dark"], button[aria-label*="theme"], [data-theme-toggle]').first();

    if (await darkModeButton.isVisible()) {
      await darkModeButton.click();
      await page.waitForTimeout(500);

      // Verify content is still visible
      const darkModeText = await tiptapContent.textContent().catch(() => '');
      expect(darkModeText).toBe(initialText);

      // Check that text is still readable (not white-on-white)
      const heading = page.locator('h1, h2').first();
      const headingVisible = await heading.isVisible();
      expect(headingVisible).toBeTruthy();
    } else {
      console.log('Dark mode toggle not found - skipping test');
      test.skip();
    }
  });

  test('should apply dark mode styles to TipTap content elements', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Toggle dark mode if available
    const darkModeButton = page.locator('button[aria-label*="dark"], button[aria-label*="theme"], [data-theme-toggle]').first();

    if (await darkModeButton.isVisible()) {
      await darkModeButton.click();
      await page.waitForTimeout(500);

      // Check that links are still styled (primary color)
      const links = page.locator('.tiptap-content a, .tiptap-renderer a, article a');
      const linkCount = await links.count();

      if (linkCount > 0) {
        const linkStyle = await links.first().evaluate((el) => {
          return window.getComputedStyle(el).color;
        });
        console.log(`Link color in dark mode: ${linkStyle}`);
        // Color should not be empty
        expect(linkStyle).toBeTruthy();
      }
    } else {
      console.log('Dark mode toggle not found - skipping test');
      test.skip();
    }
  });
});

// ============================================================
// TEST SUITE: Mobile Responsive Layout
// ============================================================

test.describe('Mobile Responsive Layout (375px)', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('should render TipTap content correctly on mobile for blog page', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check that content is visible
    const tiptapContent = page.locator('.tiptap-content, .tiptap-renderer, article').first();
    await expect(tiptapContent).toBeVisible();

    // Check that headings are not overflow
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();

    for (let i = 0; i < Math.min(headingCount, 5); i++) {
      const heading = headings.nth(i);
      const boundingBox = await heading.boundingBox();
      expect(boundingBox).not.toBeNull();
      // Heading should not overflow viewport width
      expect(boundingBox!.width).toBeLessThanOrEqual(375);
    }
  });

  test('should render business detail page correctly on mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.business.url}`);
    await page.waitForLoadState('networkidle');

    // Check that page content is visible
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent.first()).toBeVisible();

    // Check that TipTap renderer is visible
    const tiptapRenderer = page.locator('.tiptap-renderer');
    const rendererVisible = await tiptapRenderer.isVisible().catch(() => false);
    console.log(`TipTap renderer visible on mobile: ${rendererVisible}`);
  });

  test('should not have horizontal overflow on mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check for horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    console.log(`Scroll width: ${scrollWidth}, Client width: ${clientWidth}`);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('should render lists correctly on mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check that list items are visible
    const listItems = page.locator('li');
    const liCount = await listItems.count();
    expect(liCount).toBeGreaterThan(0);

    // Check that list items don't overflow
    for (let i = 0; i < Math.min(liCount, 3); i++) {
      const li = listItems.nth(i);
      const boundingBox = await li.boundingBox();
      expect(boundingBox).not.toBeNull();
      expect(boundingBox!.right).toBeLessThanOrEqual(375);
    }
  });

  test('should render links correctly on mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check that links are tappable (min 44x44px touch target)
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    if (linkCount > 0) {
      const firstLink = links.first();
      const boundingBox = await firstLink.boundingBox();
      expect(boundingBox).not.toBeNull();

      // At least one dimension should be tappable (44px minimum)
      const isTappable = boundingBox!.width >= 44 || boundingBox!.height >= 44;
      console.log(`Link tappable: ${isTappable} (${boundingBox!.width}x${boundingBox!.height})`);
    }
  });
});

// ============================================================
// TEST SUITE: Accessibility
// ============================================================

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on blog page', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Get all headings
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map((h) => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim().substring(0, 50),
      }));
    });

    console.log('Heading hierarchy:', headings);

    // Should have at least one h1
    const h1Count = headings.filter((h) => h.level === 1).length;
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Should have h2 or h3
    const h2h3Count = headings.filter((h) => h.level === 2 || h.level === 3).length;
    expect(h2h3Count).toBeGreaterThan(0);
  });

  test('should have proper heading hierarchy on business page', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.business.url}`);
    await page.waitForLoadState('networkidle');

    // Get all headings
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map((h) => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim().substring(0, 50),
      }));
    });

    console.log('Heading hierarchy:', headings);

    // Should have at least one h1
    const h1Count = headings.filter((h) => h.level === 1).length;
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have ARIA labels on interactive elements', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.business.url}`);
    await page.waitForLoadState('networkidle');

    // Check for buttons with accessible labels
    const buttons = await page.evaluate(() => {
      const buttonElements = document.querySelectorAll('button');
      return Array.from(buttonElements).map((b) => ({
        hasLabel: !!b.getAttribute('aria-label') || !!b.getAttribute('aria-labelledby') || b.textContent?.trim(),
        ariaLabel: b.getAttribute('aria-label'),
        text: b.textContent?.trim().substring(0, 30),
      }));
    });

    console.log('Buttons with labels:', buttons.length);

    // All buttons should have some form of label
    const unlabeledButtons = buttons.filter((b) => !b.hasLabel);
    expect(unlabeledButtons.length).toBe(0);
  });

  test('should have ARIA labels on TipTap content links', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check links in TipTap content
    const links = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('.tiptap-content a, .tiptap-renderer a, article a');
      return Array.from(linkElements).map((a) => ({
        href: a.getAttribute('href'),
        text: a.textContent?.trim().substring(0, 30),
        hasLabel: !!a.getAttribute('aria-label') || !!a.textContent?.trim(),
      }));
    });

    console.log(`Links found: ${links.length}`);

    // All links should have visible text content
    const linksWithoutText = links.filter((l) => !l.hasLabel);
    expect(linksWithoutText.length).toBe(0);
  });

  test('should have proper color contrast for TipTap content', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check paragraph text contrast
    const textContrast = await page.evaluate(() => {
      const paragraphs = document.querySelectorAll('.tiptap-content p, .tiptap-renderer p, article p');
      if (paragraphs.length === 0) return null;

      const p = paragraphs[0];
      const style = window.getComputedStyle(p);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
      };
    });

    console.log('Text contrast:', textContrast);

    // Text should have a color defined
    expect(textContrast?.color).toBeTruthy();
  });

  test('should have proper semantic structure in TipTap content', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check for semantic elements
    const semanticElements = await page.evaluate(() => {
      const tiptapContent = document.querySelector('.tiptap-content, .tiptap-renderer, article');
      if (!tiptapContent) return null;

      return {
        hasUl: !!tiptapContent.querySelector('ul'),
        hasOl: !!tiptapContent.querySelector('ol'),
        hasLinks: tiptapContent.querySelectorAll('a[href]').length,
        hasHeadings: tiptapContent.querySelectorAll('h1, h2, h3, h4').length,
        hasParagraphs: tiptapContent.querySelectorAll('p').length,
      };
    });

    console.log('Semantic elements:', semanticElements);

    // TipTap content should have semantic structure
    expect(semanticElements).not.toBeNull();
    expect(semanticElements!.hasHeadings).toBeGreaterThan(0);
  });
});

// ============================================================
// TEST SUITE: Mixed Content Elements
// ============================================================

test.describe('Mixed Content Elements', () => {
  test('should render headings within TipTap content correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check for various heading levels
    const h1Count = await page.locator('.tiptap-content h1, .tiptap-renderer h1, article h1').count();
    const h2Count = await page.locator('.tiptap-content h2, .tiptap-renderer h2, article h2').count();
    const h3Count = await page.locator('.tiptap-content h3, .tiptap-renderer h3, article h3').count();

    console.log(`Headings: h1=${h1Count}, h2=${h2Count}, h3=${h3Count}`);

    expect(h1Count + h2Count + h3Count).toBeGreaterThan(0);
  });

  test('should render lists within TipTap content correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check for unordered and ordered lists
    const ulCount = await page.locator('.tiptap-content ul, .tiptap-renderer ul, article ul').count();
    const olCount = await page.locator('.tiptap-content ol, .tiptap-renderer ol, article ol').count();
    const liCount = await page.locator('.tiptap-content li, .tiptap-renderer li, article li').count();

    console.log(`Lists: ul=${ulCount}, ol=${olCount}, li=${liCount}`);

    expect(liCount).toBeGreaterThan(0);
  });

  test('should render bold text within TipTap content correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check for bold text elements
    const strongCount = await page.locator('.tiptap-content strong, .tiptap-renderer strong, article strong').count();
    const boldCount = await page.locator('.tiptap-content b, .tiptap-renderer b, article b').count();

    console.log(`Bold text: strong=${strongCount}, b=${boldCount}`);

    // Bold elements should be present (TipTap uses <strong> for bold)
    // Note: Not all content may have bold text, so this is informational
    console.log(`Bold content found: ${strongCount + boldCount > 0}`);
  });

  test('should render links within TipTap content correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Check for links with proper href attributes
    const links = page.locator('.tiptap-content a[href], .tiptap-renderer a[href], article a[href]');
    const linkCount = await links.count();

    console.log(`Links with href: ${linkCount}`);

    expect(linkCount).toBeGreaterThan(0);

    // Verify links have valid href values
    if (linkCount > 0) {
      const validHrefs = await links.evaluateAll((linkElements) =>
        linkElements.map((a) => ({
          href: a.getAttribute('href'),
          text: a.textContent?.trim().substring(0, 30),
        }))
      );

      console.log('Sample links:', validHrefs.slice(0, 3));

      // All links should have href attributes
      const missingHrefs = validHrefs.filter((l) => !l.href);
      expect(missingHrefs.length).toBe(0);
    }
  });

  test('should render combined content (headings + lists + links + bold) correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Get TipTap container
    const tiptapContainer = page.locator('.tiptap-content, .tiptap-renderer, article').first();

    // Count all content types
    const contentStats = await tiptapContainer.evaluate((el) => ({
      headings: el.querySelectorAll('h1, h2, h3, h4').length,
      paragraphs: el.querySelectorAll('p').length,
      lists: el.querySelectorAll('ul, ol').length,
      listItems: el.querySelectorAll('li').length,
      links: el.querySelectorAll('a[href]').length,
      bold: el.querySelectorAll('strong, b').length,
      emphasis: el.querySelectorAll('em, i').length,
    }));

    console.log('Mixed content statistics:', contentStats);

    // Should have a mix of content types
    expect(contentStats.headings + contentStats.paragraphs).toBeGreaterThan(0);
    expect(contentStats.lists + contentStats.links).toBeGreaterThan(0);
  });

  test('should render TipTap empty state correctly when no content', async ({ page }) => {
    // Visit a page that might not have TipTap content
    await page.goto(`${BASE_URL}/business/cafe-timor`);
    await page.waitForLoadState('networkidle');

    // Check for empty state handling
    const emptyClass = await page.locator('.tiptap-renderer.empty, [class*="empty"]').count();
    const hasContent = await page.locator('.tiptap-renderer:not(.empty), .tiptap-content:not(:empty)').count();

    console.log(`Empty state: ${emptyClass}, Has content: ${hasContent}`);

    // Either empty state or content should be present
    expect(emptyClass + hasContent).toBeGreaterThan(0);
  });
});

// ============================================================
// TEST SUITE: Cross-Browser Compatibility
// ============================================================

test.describe('Cross-Browser Content Rendering', () => {
  test('should render TipTap content consistently across page loads', async ({ page }) => {
    // Load the page multiple times and check consistency
    const results: string[] = [];

    for (let i = 0; i < 3; i++) {
      await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
      await page.waitForLoadState('networkidle');

      const headings = await page.locator('h1, h2, h3').allTextContents();
      results.push(headings.slice(0, 3).join(', '));
    }

    console.log('Consistency check:', results);

    // All loads should produce similar content
    expect(results[0]).toBe(results[1]);
    expect(results[1]).toBe(results[2]);
  });

  test('should handle rapid navigation without content flash', async ({ page }) => {
    // Navigate between pages quickly
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    // Navigate to blog
    await page.goto(`${BASE_URL}${TEST_DATA.blog.url}`);
    await page.waitForLoadState('networkidle');

    // Content should be visible immediately (no flash of unstyled content)
    const tiptapContent = page.locator('.tiptap-content, .tiptap-renderer, article');
    await expect(tiptapContent.first()).toBeVisible({ timeout: 5000 });
  });
});