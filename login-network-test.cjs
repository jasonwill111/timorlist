const { chromium } = require('playwright');
const Database = require('better-sqlite3');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    viewport: { width: 1706, height: 1200 }
  });
  const page = await context.newPage();

  // Track network requests
  const requests = [];
  page.on('response', resp => {
    if (resp.url().includes('/api')) {
      requests.push({ url: resp.url(), status: resp.status() });
    }
  });

  // Clear KV
  const kvPath = '.wrangler/state/v3/kv/miniflare-KVNamespaceObject';
  const files = require('fs').readdirSync(kvPath);
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

  // Go to login page
  await page.goto('http://127.0.0.1:8787/login', { waitUntil: 'networkidle' });
  console.log('Login page loaded');
  
  // Fill form
  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');
  
  // Submit
  await page.locator('button[type="submit"]').click();
  
  // Wait for response
  await page.waitForTimeout(10000);
  
  // Check API requests
  console.log('API requests:', requests);
  
  // Check cookies
  const cookies = await context.cookies();
  console.log('Cookies:', cookies.map(c => c.name + '=' + c.value.slice(0, 20) + '...'));
  
  // Final state
  console.log('URL:', page.url());
  console.log('Message:', await page.locator('#form-message').textContent().catch(() => null));
  
  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});