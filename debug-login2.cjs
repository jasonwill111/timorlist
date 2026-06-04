const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

  console.log('=== ADVANCED DEBUG LOGIN TEST ===\n');

  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForLoadState('networkidle');

  // Collect ALL network requests
  const allRequests = [];
  const allResponses = [];
  page.on('request', req => allRequests.push({ url: req.url().slice(-80), method: req.method() }));
  page.on('response', resp => allResponses.push({ url: resp.url().slice(-80), status: resp.status() }));

  // Inject JS to log form submit
  await page.evaluate(() => {
    window.formSubmitLogged = false;
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        console.log('[DEBUG] Form submit event triggered!');
        window.formSubmitLogged = true;
      }, { capture: true });
    }
    console.log('[DEBUG] Form listener attached');
  });

  // Fill form
  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');
  await page.waitForTimeout(500);

  // Try submitting via form.submit() directly
  console.log('Calling form.submit() directly...');
  await page.evaluate(() => {
    const form = document.getElementById('login-form');
    if (form) {
      console.log('[DEBUG] Submitting form...');
      form.submit();
    }
  });

  await page.waitForTimeout(8000);

  const formSubmitLogged = await page.evaluate(() => window.formSubmitLogged);
  console.log('Form submit event logged:', formSubmitLogged);
  console.log('\nAll requests:', allRequests.length);
  allRequests.forEach(r => console.log(' ', r.method, r.url));
  console.log('\nAll responses:');
  allResponses.forEach(r => console.log(' ', r.status, r.url));

  console.log('\nFinal URL:', page.url());
  await page.screenshot({ path: 'test-results/login-debug2.png', fullPage: true });

  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});