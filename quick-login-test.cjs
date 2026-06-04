// Quick test: bypass rate limit and test login directly
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

  console.log('=== QUICK LOGIN TEST ===\n');

  // Intercept requests to see what happens
  const responses = [];
  page.on('response', resp => {
    if (resp.url().includes('8787')) {
      responses.push({ url: resp.url().slice(-50), status: resp.status() });
    }
  });

  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForLoadState('networkidle');

  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');
  await page.locator('#submit-btn').click({ force: true });
  await page.waitForTimeout(10000);

  console.log('Responses from 8787:');
  responses.forEach(r => console.log(' ', r.status, r.url));

  console.log('\nFinal URL:', page.url());
  console.log('Page title:', await page.title());

  // Check body text for any error message
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 800));
  console.log('\nPage body (first 800 chars):');
  console.log(bodyText);

  await page.screenshot({ path: 'test-results/quick-login-test.png', fullPage: true });

  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});