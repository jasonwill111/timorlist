import { test, expect, chromium, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8787';

// TC-001 RED: Homepage SSR must render full HTML content (not blank)
// TC-002 RED: No 500 Internal Server Error on homepage
// TC-003 RED: BusinessCard/ListingCard components must be defined
// TC-004 RED: Explore by Type section must render 4 entity cards

test.describe('Homepage SSR Rendering', () => {
  let browser: chromium.Browser;
  let context: chromium.BrowserContext;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('TC-001: Homepage renders full HTML content (not 15-byte blank)', async () => {
    const page = await context.newPage();
    const response = await page.goto(BASE_URL + '/');
    expect(response?.status()).toBe(200);

    const html = await page.content();
    console.log('HTML length:', html.length);

    // FAIL if HTML is blank (15 bytes = just <!DOCTYPE html>)
    expect(html.length).toBeGreaterThan(500);
    await page.close();
  });

  test('TC-002: No 500 Internal Server Error on homepage', async () => {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(BASE_URL + '/');
    await page.waitForLoadState('networkidle');

    // FAIL if any 500 error console message
    const serverErrors = errors.filter(e => e.includes('500') || e.includes('ReferenceError'));
    console.log('Console errors:', serverErrors);
    expect(serverErrors).toHaveLength(0);
    await page.close();
  });

  test('TC-003: BusinessCard component is defined and renders', async () => {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(BASE_URL + '/');
    await page.waitForLoadState('networkidle');

    expect(errors.some(e => e.includes('BusinessCard is not defined'))).toBe(false);
    await page.close();
  });

  test('TC-004: Explore by Type section renders 4 entity cards', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/');

    // Wait for the section heading to confirm SSR content loaded
    await page.waitForSelector('h2:has-text("Explore Timor-Leste")', { timeout: 10000 });

    // Check for the 4 entity card section headings (more reliable than href locators)
    await expect(page.locator('h3:has-text("Businesses")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Classified Ads")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Non-Profits")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Public Sectors")').first()).toBeVisible();
    await page.close();
  });

  test('TC-005: Page title contains TimorUp', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/');
    await expect(page).toHaveTitle(/TimorUp/);
    await page.close();
  });
});

test.describe('Homepage Card Hover Fix', () => {
  test('should load homepage and check entity cards', async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to homepage:', BASE_URL);
    await page.goto(BASE_URL + '/');
    await page.waitForSelector('h2:has-text("Explore Timor-Leste")', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    console.log('Checking page content...');
    const html = await page.content();
    console.log('HTML length:', html.length);

    await expect(page).toHaveTitle(/TimorUp/);

    // Count entity links in the Explore section (4 cards)
    const exploreCards = page.locator('h2:has-text("Explore Timor-Leste")')
      .locator('..')
      .locator('a[href="/businesses"], a[href="/listings"], a[href="/non-profits"], a[href="/public-sectors"]');
    console.log('Explore cards count:', await exploreCards.count());
    expect(await exploreCards.count()).toBe(4);

    await browser.close();
  });
});
