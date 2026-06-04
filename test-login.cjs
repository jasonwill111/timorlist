const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 2568 } });
  const page = await context.newPage();

  // Helper
  async function screenshot(name) {
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
    console.log(`  Screenshot: test-results/${name}.png`);
  }

  async function login(email, password) {
    await page.goto('http://127.0.0.1:8787/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    // Submit form directly instead of clicking button
    await page.locator('form#login-form').evaluate(f => f.submit());
    // Wait for navigation or network idle
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
    return page.url();
  }

  console.log('=== Testing Login Flow ===\n');

  // Test 1: Regular user
  console.log('--- Login as user1@timorup.com ---');
  const userUrl = await login('user1@timorup.com', 'user12345');
  console.log('  Result URL:', userUrl);
  await screenshot('user-login-result');
  const userTitle = await page.title();
  console.log('  Page title:', userTitle);

  // Test 2: Admin
  console.log('\n--- Login as admin@timorup.com ---');
  const adminUrl = await login('admin@timorup.com', 'admin12345');
  console.log('  Result URL:', adminUrl);
  await screenshot('admin-login-result');
  const adminTitle = await page.title();
  console.log('  Page title:', adminTitle);

  // If on admin page, test admin pages
  if (adminUrl.includes('admin') || adminUrl.includes('account')) {
    console.log('\n--- Admin Pages ---');
    const adminPages = [
      '/admin/products',
      '/admin/orders',
      '/admin/ad-banners',
      '/admin/service-packages',
      '/admin/users',
      '/admin/categories',
      '/admin/settings'
    ];
    for (const p of adminPages) {
      await page.goto(`http://127.0.0.1:8787${p}`);
      await page.waitForLoadState('networkidle');
      const status = await page.locator('h1, h2').first().textContent().catch(() => 'no heading');
      console.log(`  ${p}: ${status}`);
      await screenshot(`admin${p.replace(/\//g, '-')}`);
    }
  }

  await browser.close();
  console.log('\n=== Test Complete ===');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});