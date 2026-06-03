// Playwright browser test for TimorUp
const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:8787';

async function runBrowserTests() {
  console.log('Starting browser tests...\n');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // Test 1: Homepage loads
    console.log('Test 1: Homepage...');
    const r1 = await page.goto(BASE_URL, { timeout: 30000 });
    results.push({ name: 'Homepage loads (200 OK)', passed: r1?.status() === 200 });

    // Test 2: Homepage title
    console.log('Test 2: Title...');
    const title = await page.title();
    results.push({ name: 'Title contains "TimorUp"', passed: title.includes('TimorUp'), error: title.includes('TimorUp') ? undefined : `Got: "${title}"` });

    // Test 3: Header navigation
    console.log('Test 3: Header...');
    const headerVisible = await page.locator('header').first().isVisible({ timeout: 5000 }).catch(() => false);
    results.push({ name: 'Header is visible', passed: headerVisible });

    // Test 4: Listings page
    console.log('Test 4: Listings page...');
    const r4 = await page.goto(`${BASE_URL}/listings`, { timeout: 30000 });
    results.push({ name: 'Listings page loads', passed: r4?.status() === 200 });

    // Test 5: Create listing page (should redirect to login when not authenticated)
    console.log('Test 5: Create listing page...');
    const r5 = await page.goto(`${BASE_URL}/listings/create`, { timeout: 30000 });
    const passed5 = r5?.status() === 200 || r5?.status() === 302;
    results.push({ name: 'Create listing page loads', passed: passed5, error: passed5 ? undefined : `Status: ${r5?.status()}` });

    // Test 6: Login page
    console.log('Test 6: Login page...');
    const r6 = await page.goto(`${BASE_URL}/login`, { timeout: 30000 });
    results.push({ name: 'Login page loads', passed: r6?.status() === 200 });

    // Test 7: Register page
    console.log('Test 7: Register page...');
    const r7 = await page.goto(`${BASE_URL}/register`, { timeout: 30000 });
    results.push({ name: 'Register page loads', passed: r7?.status() === 200 });

    // Test 8: No critical console errors (ignore 404s which are common)
    console.log('Test 8: Console errors...');
    const criticalErrors = consoleErrors.filter(e => !e.includes('404') && !e.includes('Failed to load resource'));
    results.push({ name: 'No critical console errors', passed: criticalErrors.length === 0, error: criticalErrors.length === 0 ? undefined : `${criticalErrors.length} critical errors` });

  } finally {
    await browser.close();
  }

  // Print results
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║              TIMORUP BROWSER TEST RESULTS              ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');

  const passedCount = results.filter(r => r.passed).length;
  console.log(`║  Passed: ${passedCount}/${results.length}                                             ║`);
  console.log('╠═══════════════════════════════════════════════════════════╣');

  results.forEach((r) => {
    const icon = r.passed ? '✅' : '❌';
    const name = r.name.substring(0, 47).padEnd(47);
    console.log(`║ ${icon} ${name} ║`);
    if (!r.passed && r.error) {
      const err = r.error.substring(0, 44).padEnd(44);
      console.log(`║    └ ${err} ║`);
    }
  });

  console.log('╚═══════════════════════════════════════════════════════════╝');

  // Print any console errors found
  if (consoleErrors.length > 0) {
    console.log('\nAll console errors:');
    consoleErrors.slice(0, 5).forEach(e => console.log('  -', e.substring(0, 100)));
  }

  process.exit(passedCount === results.length ? 0 : 1);
}

runBrowserTests().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});