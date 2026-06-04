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

  console.log('=== DIRECT FORM TRIGGER TEST ===\n');
  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForLoadState('networkidle');

  // Fill form
  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');
  await page.waitForTimeout(500);

  // Check button state
  const btnState = await page.evaluate(() => {
    const btn = document.getElementById('submit-btn');
    return { disabled: btn?.disabled, classList: btn?.className?.slice(0, 50) };
  });
  console.log('Button state:', btnState);

  // Directly dispatch submit event on form
  console.log('\nDispatching submit event on form...');
  const submitResult = await page.evaluate(async () => {
    const form = document.getElementById('login-form');
    const emailInput = form?.querySelector('input[name="email"]');
    const passInput = form?.querySelector('input[name="password"]');
    
    // Log values
    console.log('Email value:', emailInput?.value);
    console.log('Password value:', passInput?.value);
    
    // Dispatch submit
    const evt = new Event('submit', { bubbles: true, cancelable: true });
    form?.dispatchEvent(evt);
    
    // Wait for potential fetch
    await new Promise(r => setTimeout(r, 2000));
    
    return {
      url: window.location.href,
      formMsg: document.getElementById('form-message')?.textContent?.trim(),
      emailValue: emailInput?.value
    };
  });
  
  console.log('After dispatch:', submitResult);
  
  // Wait more and check again
  await page.waitForTimeout(5000);
  
  const finalState = await page.evaluate(() => ({
    url: window.location.href,
    formMsg: document.getElementById('form-message')?.textContent?.trim()
  }));
  console.log('\nFinal state:', finalState);

  await page.screenshot({ path: 'test-results/form-trigger-test.png', fullPage: true });

  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});