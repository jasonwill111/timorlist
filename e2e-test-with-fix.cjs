// E2E Test Fix Script - clears KV rate limits before testing
const { chromium } = require('playwright');
const Database = require('better-sqlite3');
const { execSync } = require('child_process');

// Clear KV rate limits
function clearRateLimits() {
  try {
    const kvPath = '.wrangler/state/v3/kv/miniflare-KVNamespaceObject';
    const files = require('fs').readdirSync(kvPath);
    for (const file of files) {
      if (file.endsWith('.sqlite')) {
        const db = new Database(`${kvPath}/${file}`);
        try {
          db.prepare('DELETE FROM _mf_entries').run();
          console.log('Cleared:', file);
        } catch(e) {
          // Not the right table
        }
        db.close();
      }
    }
    console.log('KV rate limits cleared');
  } catch(e) {
    console.log('Error clearing KV:', e.message);
  }
}

async function screenshot(page, name) {
  await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  console.log(`  [OK] test-results/${name}.png`);
}

async function main() {
  console.log('=== TIMORUP E2E TEST WITH RATE LIMIT FIX ===\n');

  // Step 1: Clear rate limits
  console.log('1. Clearing KV rate limits...');
  clearRateLimits();

  // Step 2: Restart server to clear in-memory rate limits
  console.log('2. Restarting server to clear in-memory limits...');
  try {
    execSync('taskkill /F /FI "WINDOWTITLE eq *wrangler*" 2>nul', { stdio: 'ignore' });
  } catch(e) {}
  await new Promise(r => setTimeout(r, 2000));

  console.log('3. Starting server...');
  const { spawn } = require('child_process');
  const server = spawn('npx', [
    'wrangler', 'dev', 'dist/server/entry.mjs',
    '--port', '8787',
    '--compatibility-date', '2024-01-01',
    '--config', 'wrangler.jsonc',
    '--log-level', 'error'
  ], { cwd: process.cwd(), detached: true, stdio: 'ignore' });
  server.unref();

  // Wait for server to start
  await new Promise(r => setTimeout(r, 18000));

  // Verify server is up
  try {
    require('http').get('http://127.0.0.1:8787/', () => {}).on('error', () => {
      throw new Error('Server not ready');
    });
    console.log('Server ready');
  } catch(e) {
    console.log('WARNING: Server may not be ready, continuing anyway...');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

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
    { url: '/listings', name: 'listings' },
  ];

  for (const p of publicPages) {
    try {
      const resp = await page.goto(`http://127.0.0.1:8787${p.url}`, { timeout: 15000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      const status = resp?.status() || 0;
      const title = await page.title();
      const bodyLen = await page.evaluate(() => document.body.innerHTML.length);
      const ok = status === 200 && bodyLen > 1000;
      console.log(`  ${ok ? '[OK]' : '[FAIL]'} ${p.url}: ${status} "${title}" (${bodyLen} bytes)`);
      await screenshot(page, p.name);
    } catch(e) {
      console.log(`  [ERROR] ${p.url}: ${e.message}`);
    }
  }

  // ========== LOGIN PAGE ==========
  console.log('\n## LOGIN PAGE ##\n');
  try {
    await page.goto('http://127.0.0.1:8787/login', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    console.log('  Login page loaded:', await page.title());
    await screenshot(page, 'login-page');
  } catch(e) {
    console.log('  [ERROR] Login page:', e.message);
  }

  // ========== USER LOGIN ==========
  console.log('\n## USER LOGIN (user1@timorup.com) ##\n');
  try {
    await page.locator('input[name="email"]').fill('user1@timorup.com');
    await page.locator('input[name="password"]').fill('user12345');
    await page.locator('#submit-btn').click({ force: true });
    await page.waitForTimeout(8000);

    const userUrl = page.url();
    console.log('  After login URL:', userUrl);
    await screenshot(page, 'user-after-login');

    if (userUrl.includes('account') || userUrl.includes('dashboard')) {
      console.log('  [OK] User logged in successfully');

      // Test user account pages
      for (const p of ['/account', '/account/profile']) {
        try {
          const r = await page.goto(`http://127.0.0.1:8787${p}`, { timeout: 15000 });
          await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
          const title = await page.title();
          const h1 = await page.locator('h1, h2').first().textContent().catch(() => title);
          console.log(`  ${p}: ${r?.status() || 0} "${h1.trim()}"`);
          await screenshot(page, `user${p.replace(/\//g, '-')}`);
        } catch(e) {
          console.log(`  [ERROR] ${p}: ${e.message}`);
        }
      }
    } else {
      // Check for error message
      const formMsg = await page.locator('#form-message').textContent().catch(() => '');
      console.log('  Login result:', formMsg || '(no error message)');
    }
  } catch(e) {
    console.log('  [ERROR] User login:', e.message);
  }

  // ========== ADMIN LOGIN ==========
  console.log('\n## ADMIN LOGIN (admin@timorup.com) ##\n');
  try {
    await context.clearCookies();
    await page.goto('http://127.0.0.1:8787/login', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
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
        try {
          const r = await page.goto(`http://127.0.0.1:8787${p.url}`, { timeout: 15000 });
          await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
          const h1 = await page.locator('h1, h2').first().textContent().catch(() => '(no heading)');
          console.log(`  ${p.url}: ${r?.status() || 0} "${h1.trim()}"`);
          await screenshot(page, p.name);
        } catch(e) {
          console.log(`  [ERROR] ${p.url}: ${e.message}`);
        }
      }
    } else {
      const formMsg = await page.locator('#form-message').textContent().catch(() => '');
      console.log('  Admin login result:', formMsg || '(no error message)');
    }
  } catch(e) {
    console.log('  [ERROR] Admin login:', e.message);
  }

  // ========== REGISTER PAGE ==========
  console.log('\n## REGISTER PAGE ##\n');
  try {
    await context.clearCookies();
    await page.goto('http://127.0.0.1:8787/register', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    console.log('  Register page:', await page.title());
    await screenshot(page, 'register-page');
  } catch(e) {
    console.log('  [ERROR] Register page:', e.message);
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