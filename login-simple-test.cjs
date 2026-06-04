const { chromium } = require('playwright');
const Database = require('better-sqlite3');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

  // Clear KV
  const kvPath = '.wrangler/state/v3/kv/miniflare-KVNamespaceObject';
  const files = fs.readdirSync(kvPath);
  for (const f of files) {
    if (f.endsWith('.sqlite')) {
      try {
        const db = new Database(kvPath + '/' + f);
        db.prepare('DELETE FROM _mf_entries').run();
        db.close();
      } catch(e) {}
    }
  }
  console.log('KV cleared');

  // Track network
  const requests = [];
  page.on('response', resp => requests.push({ url: resp.url(), status: resp.status() }));

  await page.goto('http://127.0.0.1:8787/login', { waitUntil: 'domcontentloaded', timeout: 10000 });
  console.log('Page loaded');
  
  await page.fill('input[name="email"]', 'admin@timorup.com');
  await page.fill('input[name="password"]', 'admin12345');
  
  // Click via JS
  await page.evaluate(() => {
    document.getElementById('submit-btn')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  
  await page.waitForTimeout(5000);
  
  console.log('API calls:', requests);
  console.log('URL:', page.url());
  console.log('Msg:', await page.locator('#form-message').textContent().catch(() => null));
  
  await page.screenshot({ path: 'test-results/login-network.png' });
  await browser.close();
}

main().catch(e => { console.error(e.message); process.exit(1); });