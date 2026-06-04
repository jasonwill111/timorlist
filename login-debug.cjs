const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

  // Clear KV rate limits
  const Database = require('better-sqlite3');
  const kvPath = '.wrangler/state/v3/kv/miniflare-KVNamespaceObject';
  const files = require('fs').readdirSync(kvPath);
  for (const file of files) {
    if (file.endsWith('.sqlite')) {
      try {
        const db = new Database(kvPath + '/' + file);
        db.prepare('DELETE FROM _mf_entries').run();
        db.close();
      } catch(e) {}
    }
  }
  console.log('KV cleared\n');

  console.log('=== LOGIN DEBUG ===\n');
  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForLoadState('networkidle');

  // Check initial state
  const initState = await page.evaluate(() => ({
    url: window.location.href,
    emailValue: document.querySelector('input[name="email"]')?.value,
    passValue: document.querySelector('input[name="password"]')?.value?.length
  }));
  console.log('Initial state:', initState);

  // Fill form
  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');

  // Monitor fetch requests
  let fetchResponse = null;
  page.on('response', async resp => {
    if (resp.url().includes('api/auth') || resp.url().includes('/api/')) {
      try {
        const body = await resp.text();
        fetchResponse = { url: resp.url(), status: resp.status(), body: body.slice(0, 200) };
        console.log('API Response:', fetchResponse);
      } catch(e) {
        fetchResponse = { url: resp.url(), status: resp.status(), error: e.message };
      }
    }
  });

  // Click submit
  await page.locator('#submit-btn').click({ force: true });
  
  // Wait and check
  await page.waitForTimeout(8000);

  // Check final state
  const finalState = await page.evaluate(() => ({
    url: window.location.href,
    emailValue: document.querySelector('input[name="email"]')?.value,
    formMsg: document.getElementById('form-message')?.textContent?.trim(),
    bodyText: document.body.innerText.slice(0, 300)
  }));
  console.log('\nFinal state:', finalState);

  await page.screenshot({ path: 'test-results/login-debug-final.png', fullPage: true });

  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});