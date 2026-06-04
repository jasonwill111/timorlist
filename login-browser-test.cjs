const { chromium } = require('playwright');
const Database = require('better-sqlite3');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    viewport: { width: 1706, height: 1200 },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  // Clear KV
  const kvPath = '.wrangler/state/v3/kv/miniflare-KVNamespaceObject';
  const files = require('fs').readdirSync(kvPath);
  for (const file of files) {
    if (file.endsWith('.sqlite')) {
      try {
        const db = new Database(kvPath + '/' + file);
        db.prepare('DELETE FROM _mf_entries').run();
        db.close();
        console.log('Cleared KV');
      } catch(e) { console.log('KV clear error:', e.message); }
    }
  }

  // Go to login page
  await page.goto('http://127.0.0.1:8787/login', { waitUntil: 'networkidle' });
  console.log('Login page loaded');
  
  // Fill form
  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');
  
  // Click submit button using JS instead of Playwright click
  console.log('Submitting form...');
  await page.evaluate(() => {
    document.getElementById('submit-btn')?.click();
  });
  
  // Wait for response
  await page.waitForTimeout(10000);
  
  // Check result
  const url = page.url();
  const msg = await page.locator('#form-message').textContent().catch(() => null);
  console.log('Final URL:', url);
  console.log('Message:', msg?.trim());
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/login-browser-test.png', fullPage: true });
  console.log('Screenshot saved');
  
  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});