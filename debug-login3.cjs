const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

  console.log('=== TESTING FORM SUBMIT HANDLER ===\n');

  await page.goto('http://127.0.0.1:8787/login');
  await page.waitForLoadState('networkidle');

  // Monitor ALL requests
  const postRequests = [];
  page.on('request', req => {
    if (req.method() === 'POST') {
      postRequests.push({ url: req.url(), contentType: req.headers()['content-type'], postData: req.postData()?.slice(0, 150) });
    }
  });

  await page.locator('input[name="email"]').fill('admin@timorup.com');
  await page.locator('input[name="password"]').fill('admin12345');
  await page.waitForTimeout(300);

  // Trigger the form submit event (not form.submit()) by dispatching submit
  console.log('Dispatching submit event on form...');
  await page.evaluate(() => {
    const form = document.getElementById('login-form');
    const evt = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(evt);
    console.log('Event dispatched, defaultPrevented:', evt.defaultPrevented);
  });

  // Also try clicking the button to trigger the event
  console.log('\nNow clicking the button...');
  await page.locator('#submit-btn').click({ force: true });

  await page.waitForTimeout(8000);

  console.log('\nPOST requests:', JSON.stringify(postRequests, null, 2));
  console.log('\nFinal URL:', page.url());

  // Get page text to see if there's any error
  const pageText = await page.evaluate(() => {
    const msg = document.getElementById('form-message');
    return { text: msg?.textContent?.trim(), visible: msg ? !msg.classList.contains('hidden') : false };
  });
  console.log('Form message:', pageText);

  await page.screenshot({ path: 'test-results/login-js-submit.png', fullPage: true });

  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});