const { chromium } = require('playwright');
const Database = require('better-sqlite3');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
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
      } catch(e) {}
    }
  }
  console.log('KV cleared\n');

  console.log('=== BEFORE LOGIN ===');
  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForLoadState('networkidle');
  
  // Fill form
  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');
  
  // Click submit
  await page.locator('#submit-btn').click({ force: true });
  
  // Wait for response
  await page.waitForTimeout(8000);
  
  // Check result
  const result = await page.evaluate(() => ({
    url: window.location.href,
    msg: document.getElementById('form-message')?.textContent?.trim()
  }));
  console.log('Login result:', result);
  
  // Check KV after
  const kvFiles = require('fs').readdirSync(kvPath);
  for (const f of kvFiles) {
    if (f.endsWith('.sqlite')) {
      const db = new Database(kvPath + '/' + f);
      const entries = db.prepare('SELECT key, expiration FROM _mf_entries').all();
      console.log('KV after:', JSON.stringify(entries));
      db.close();
    }
  }

  await page.screenshot({ path: 'test-results/login-attempt-result.png', fullPage: true });
  
  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});