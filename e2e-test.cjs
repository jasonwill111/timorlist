const { chromium } = require('playwright');

async function screenshot(page, name) {
  await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  console.log(`  [OK] test-results/${name}.png`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

  console.log('============================================================');
  console.log('TIMORUP COMPREHENSIVE E2E TEST');
  console.log('============================================================');

  // ========== PUBLIC PAGES ==========
  console.log('\n## PUBLIC PAGES ##\n');

  const publicPages = [
    { url: '/', name: 'home' },
    { url: '/businesses', name: 'businesses-listing' },
    { url: '/business/casa-maria-restaurant', name: 'business-detail-casa' },
    { url: '/business/dili-electronics', name: 'business-detail-dili' },
    { url: '/business/hotel-timor', name: 'business-detail-hotel' },
    { url: '/non-profits', name: 'non-profits' },
    { url: '/public-sectors', name: 'public-sectors' },
    { url: '/listings', name: 'classified-ads' },
  ];

  for (const p of publicPages) {
    const resp = await page.goto(`http://127.0.0.1:8787${p.url}`);
    await page.waitForLoadState('domcontentloaded');
    const status = resp?.status() || 0;
    const title = await page.title();
    console.log(`  ${p.url}: ${status} "${title}"`);
    await screenshot(page, p.name);
  }

  // ========== LOGIN PAGE ==========
  console.log('\n## LOGIN PAGE ##\n');
  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForLoadState('networkidle');
  console.log('  Login page loaded:', await page.title());
  await screenshot(page, 'login-page');

  // ========== USER LOGIN ==========
  console.log('\n## USER LOGIN (user1@timorup.com) ##\n');
  await page.waitForTimeout(2000);
  await page.locator('input[name="email"]').fill('user1@timorup.com');
  await page.locator('input[name="password"]').fill('user12345');

  // Use force click to bypass pointer-event interception from parent form
  await page.locator('#submit-btn').click({ force: true });
  await page.waitForTimeout(8000);

  const userUrl = page.url();
  console.log('  After login URL:', userUrl);
  await screenshot(page, 'user-after-login');

  if (userUrl.includes('account') || userUrl.includes('dashboard')) {
    console.log('  [OK] User logged in successfully');
    for (const p of ['/account', '/account/profile']) {
      const r = await page.goto(`http://127.0.0.1:8787${p}`);
      await page.waitForLoadState('domcontentloaded');
      console.log(`  ${p}: ${r?.status() || 0} "${await page.title()}"`);
      await screenshot(page, `user${p.replace(/\//g, '-')}`);
    }
  } else {
    console.log('  [WARN] Login did not redirect, checking for errors...');
    const formMsg = await page.locator('#form-message').textContent().catch(() => '');
    console.log('  Form message:', formMsg || '(empty)');
    const pageText = await page.evaluate(() => document.body.innerText.slice(0, 500));
    console.log('  Page text:', pageText);
  }

  // ========== ADMIN LOGIN ==========
  console.log('\n## ADMIN LOGIN (admin@timorup.com) ##\n');
  await context.clearCookies();
  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForTimeout(2000);
  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');
  await page.locator('#submit-btn').click({ force: true });
  await page.waitForTimeout(8000);

  const adminUrl = page.url();
  console.log('  After admin login URL:', adminUrl);
  await screenshot(page, 'admin-after-login');

  if (adminUrl.includes('admin') || adminUrl.includes('account')) {
    console.log('  [OK] Admin logged in successfully');

    const adminPages = [
      { url: '/admin', name: 'admin-dashboard' },
      { url: '/admin/products', name: 'admin-products' },
      { url: '/admin/orders', name: 'admin-orders' },
      { url: '/admin/ad-banners', name: 'admin-ad-banners' },
      { url: '/admin/service-packages', name: 'admin-service-packages' },
      { url: '/admin/users', name: 'admin-users' },
      { url: '/admin/categories', name: 'admin-categories' },
      { url: '/admin/settings', name: 'admin-settings' },
    ];

    for (const p of adminPages) {
      const r = await page.goto(`http://127.0.0.1:8787${p.url}`);
      await page.waitForLoadState('domcontentloaded');
      const h1 = await page.locator('h1, h2').first().textContent().catch(() => '(no heading)');
      console.log(`  ${p.url}: ${r?.status() || 0} "${h1.trim()}"`);
      await screenshot(page, p.name);
    }
  } else {
    console.log('  [WARN] Admin login did not redirect');
    const formMsg = await page.locator('#form-message').textContent().catch(() => '');
    console.log('  Form message:', formMsg || '(empty)');
  }

  // ========== REGISTER PAGE ==========
  console.log('\n## REGISTER PAGE ##\n');
  await context.clearCookies();
  await page.goto('http://127.0.0.1:8787/register');
  await page.waitForLoadState('networkidle');
  console.log('  Register page:', await page.title());
  await screenshot(page, 'register-page');

  // ========== SEARCH FUNCTIONALITY ==========
  console.log('\n## SEARCH FUNCTIONALITY ##\n');
  await page.goto('http://127.0.0.1:8787/businesses');
  await page.waitForLoadState('networkidle');
  const searchBox = page.locator('input[placeholder*="Search"], input[type="search"]').first();
  if (await searchBox.isVisible()) {
    await searchBox.fill('electronics');
    await searchBox.press('Enter');
    await page.waitForLoadState('networkidle');
    console.log('  Search "electronics" results:', await page.title());
    await screenshot(page, 'search-results');
  } else {
    console.log('  [SKIP] No search box found');
  }

  await browser.close();
  console.log('\n============================================================');
  console.log('TEST COMPLETE - All screenshots in test-results/');
  console.log('============================================================');
}

main().catch(e => {
  console.error('Test error:', e.message);
  process.exit(1);
});