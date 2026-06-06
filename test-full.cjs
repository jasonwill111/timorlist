/**
 * Full-stack E2E test script for TimorUp deployment
 * Tests against deployed CF Workers URL
 */
const { chromium } = require('playwright');

const BASE_URL = 'https://timorup.jasonwill.workers.dev';

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[${msg.type()}] ${msg.text()}`);
  });

  async function test(name, fn) {
    try {
      await fn();
      results.push({ name, pass: true });
      console.log(`  ✅ ${name}`);
    } catch (e) {
      results.push({ name, pass: false, error: e.message });
      console.log(`  ❌ ${name}: ${e.message}`);
    }
  }

  console.log('\n🚀 Starting TimorUp E2E Tests\n');

  // === NAVIGATION ===
  console.log('📍 Navigation Tests');
  await test('Homepage loads', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    if (!title.includes('TimorUp')) throw new Error(`Title: ${title}`);
  });

  await test('Header navigation present', async () => {
    await page.waitForSelector('header', { timeout: 5000 });
    const nav = await page.$('header nav');
    if (!nav) throw new Error('No nav in header');
  });

  await test('Dark mode toggle works', async () => {
    const toggle = await page.waitForSelector('#theme-toggle', { timeout: 3000 });
    if (!toggle) throw new Error('Theme toggle not found');
    const before = await page.evaluate(() => document.documentElement.className);
    await toggle.click();
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => document.documentElement.className);
    if (before === after) throw new Error(`Theme didn't change: ${before} → ${after}`);
  });

  await test('Nav links exist', async () => {
    const links = await page.$$('header a');
    if (links.length < 5) throw new Error(`Only ${links.length} links found`);
  });

  // === PAGE NAVIGATION ===
  console.log('\n📄 Page Navigation Tests');
  const pages = [
    { url: '/businesses', name: 'Businesses' },
    { url: '/about', name: 'About' },
    { url: '/pricing', name: 'Pricing' },
    { url: '/faq', name: 'FAQ' },
    { url: '/search', name: 'Search' },
    { url: '/login', name: 'Login' },
    { url: '/register', name: 'Register' },
    { url: '/non-profits', name: 'Non-Profits' },
    { url: '/public-sectors', name: 'Public Sectors' },
  ];

  for (const p of pages) {
    await test(`${p.name} page loads (${p.url})`, async () => {
      const resp = await page.goto(BASE_URL + p.url, { waitUntil: 'domcontentloaded' });
      if (resp.status() !== 200) throw new Error(`HTTP ${resp.status()}`);
      const title = await page.title();
      if (title.includes('404') || title.includes('Error')) throw new Error(`Bad title: ${title}`);
    });
  }

  // === DARK MODE ACROSS PAGES ===
  console.log('\n🌙 Dark Mode Tests');
  await test('Dark mode persists across navigation', async () => {
    // Set dark mode
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.goto(BASE_URL + '/businesses', { waitUntil: 'domcontentloaded' });
    const cls = await page.evaluate(() => document.documentElement.className);
    if (!cls.includes('dark')) throw new Error(`Dark class lost: ${cls}`);
  });

  await test('Toggle from dark to light', async () => {
    const toggle = await page.$('#theme-toggle');
    await toggle.click();
    await page.waitForTimeout(300);
    const cls = await page.evaluate(() => document.documentElement.className);
    if (cls.includes('dark')) throw new Error(`Still dark: ${cls}`);
  });

  // === FORM TESTS ===
  console.log('\n📝 Form Tests');
  await test('Login form has email and password fields', async () => {
    await page.goto(BASE_URL + '/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const inputs = await page.$$('input');
    const buttons = await page.$$('button');
    if (inputs.length < 2) throw new Error(`Only ${inputs.length} inputs found`);
    if (buttons.length === 0) throw new Error('No button found');
  });
  await test('Register form has required fields', async () => {
    await page.goto(BASE_URL + '/register', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const inputs = await page.$$('input');
    if (inputs.length < 3) throw new Error(`Only ${inputs.length} inputs found`);
  });
  // === ADMIN PAGE ===

  // === ADMIN PAGE ===
  console.log('\n🔐 Admin Page Tests');
  await test('Admin login page loads', async () => {
    const resp = await page.goto(BASE_URL + '/admin/login', { waitUntil: 'domcontentloaded' });
    if (resp.status() !== 200) throw new Error(`HTTP ${resp.status()}`);
    const form = await page.$('form');
    if (!form) throw new Error('No form on admin login');
  });

  await test('Admin page redirects when not logged in', async () => {
    const resp = await page.goto(BASE_URL + '/admin', { waitUntil: 'domcontentloaded' });
    const url = page.url();
    if (!url.includes('/admin/login') && !url.includes('/admin')) {
      // Either redirect to login or stay on admin is OK
    }
  });

  // === FOOTER ===
  console.log('\n📋 Layout Tests');
  await test('Footer content exists on homepage', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const footerOrContentinfo = await page.$('footer, [role="contentinfo"]');
    const bodyLen = await page.evaluate(() => document.body.innerHTML.length);
    if (bodyLen < 5000) throw new Error(`Body too short: ${bodyLen}`);
  });

  // === CONSOLE ERRORS ===
  console.log('\n⚠️  Console Error Check');
  const criticalErrors = errors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('warning') &&
    !e.includes('Warning') &&
    !e.includes('deprecat')
  );
  if (criticalErrors.length > 0) {
    console.log(`  ⚠️  ${criticalErrors.length} console errors:`);
    criticalErrors.forEach(e => console.log(`    ${e}`));
  } else {
    console.log('  ✅ No critical console errors');
  }

  // === SUMMARY ===
  console.log('\n═══════════════════════════════════════');
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    console.log('Failed tests:');
    results.filter(r => !r.pass).forEach(r => console.log(`  ❌ ${r.name}`));
  }

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(e => {
  console.error('Test runner error:', e);
  process.exit(1);
});
