const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

  console.log('=== DEBUG LOGIN TEST ===\n');

  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForLoadState('networkidle');

  // Intercept network requests
  const responses = [];
  page.on('response', resp => {
    if (resp.url().includes('8787') && resp.url().includes('actions')) {
      responses.push({ url: resp.url().slice(-80), status: resp.status() });
    }
  });

  // Fill and submit
  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');

  console.log('Clicking submit...');
  await page.locator('#submit-btn').click({ force: true });
  await page.waitForTimeout(10000);

  console.log('Actions responses:', JSON.stringify(responses, null, 2));
  console.log('Final URL:', page.url());

  // Check console for errors
  const consoleLogs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="error"], [class*="alert"]')).map(el => el.textContent);
  });
  console.log('Error elements:', consoleLogs);

  await page.screenshot({ path: 'test-results/login-debug.png', fullPage: true });

  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});