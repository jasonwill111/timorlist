import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:8787';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

interface FullTestResult {
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
  summary: {
    frontend: { passed: number; failed: number };
    backend: { passed: number; failed: number };
    database: { passed: number; failed: number };
  };
}

async function runTests(): Promise<FullTestResult> {
  const results: TestResult[] = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const frontend = { passed: 0, failed: 0 };
  const backend = { passed: 0, failed: 0 };
  const database = { passed: 0, failed: 0 };

  // Collect console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(`Page error: ${err.message}`);
  });

  try {
    // ========================
    // DATABASE TESTS
    // ========================

    // Test 1: API /api/categories returns all categories
    console.log('\n=== Testing Database/Backend ===\n');
    const start1 = Date.now();
    try {
      const response = await page.request.get(`${BASE_URL}/api/categories?type=listing`);
      const json = await response.json();
      const passed = json.success === true && Array.isArray(json.data) && json.data.length >= 10;
      results.push({
        name: 'API: GET /api/categories returns categories',
        passed,
        error: passed ? undefined : `Expected success=true and data array, got ${JSON.stringify(json).substring(0, 100)}`,
        duration: Date.now() - start1,
      });
      passed ? database.passed++ : database.failed++;
    } catch (err) {
      results.push({ name: 'API: GET /api/categories', passed: false, error: String(err), duration: Date.now() - start1 });
      database.failed++;
    }

    // Test 2: API returns 99 categories (10 top-level + 89 sub)
    const start2 = Date.now();
    try {
      const response = await page.request.get(`${BASE_URL}/api/categories?type=listing`);
      const json = await response.json();
      const catCount = json.data?.length ?? 0;
      const passed = catCount >= 89;
      results.push({
        name: `API: Returns ${catCount} categories (expected >= 89)`,
        passed,
        error: passed ? undefined : `Expected >= 89 categories, got ${catCount}`,
        duration: Date.now() - start2,
      });
      passed ? database.passed++ : database.failed++;
    } catch (err) {
      results.push({ name: 'API: Category count check', passed: false, error: String(err), duration: Date.now() - start2 });
      database.failed++;
    }

    // Test 3: Categories have form_fields
    const start3 = Date.now();
    try {
      const response = await page.request.get(`${BASE_URL}/api/categories?type=listing`);
      const json = await response.json();
      const categoriesWithFormFields = json.data?.filter((c: { form_fields?: unknown }) => c.form_fields && c.form_fields.length > 0) ?? [];
      const passed = categoriesWithFormFields.length >= 10;
      results.push({
        name: `API: ${categoriesWithFormFields.length} categories have form_fields`,
        passed,
        error: passed ? undefined : `Expected >= 10 categories with form_fields, got ${categoriesWithFormFields.length}`,
        duration: Date.now() - start3,
      });
      passed ? database.passed++ : database.failed++;
    } catch (err) {
      results.push({ name: 'API: form_fields check', passed: false, error: String(err), duration: Date.now() - start3 });
      database.failed++;
    }

    // Test 4: Vehicles category has viewType (Property Sale)
    const start4 = Date.now();
    try {
      const response = await page.request.get(`${BASE_URL}/api/categories?type=listing`);
      const json = await response.json();
      const propertySale = json.data?.find((c: { id: string }) => c.id === 'property-sale');
      const hasViewType = propertySale?.form_fields?.includes('viewType');
      results.push({
        name: 'API: property-sale has viewType field',
        passed: hasViewType === true,
        error: hasViewType ? undefined : 'viewType field not found in property-sale form_fields',
        duration: Date.now() - start4,
      });
      hasViewType ? database.passed++ : database.failed++;
    } catch (err) {
      results.push({ name: 'API: viewType check', passed: false, error: String(err), duration: Date.now() - start4 });
      database.failed++;
    }

    // Test 5: Services category has insured/bonded
    const start5 = Date.now();
    try {
      const response = await page.request.get(`${BASE_URL}/api/categories?type=listing`);
      const json = await response.json();
      const services = json.data?.find((c: { id: string }) => c.id === 'services');
      const hasInsured = services?.form_fields?.includes('insured');
      const hasBonded = services?.form_fields?.includes('bonded');
      const passed = hasInsured && hasBonded;
      results.push({
        name: 'API: services has insured and bonded fields',
        passed,
        error: passed ? undefined : `insured: ${hasInsured}, bonded: ${hasBonded}`,
        duration: Date.now() - start5,
      });
      passed ? database.passed++ : database.failed++;
    } catch (err) {
      results.push({ name: 'API: insured/bonded check', passed: false, error: String(err), duration: Date.now() - start5 });
      database.failed++;
    }

    // Test 6: Pets & Animals has registrationPapers and pedigree
    const start6 = Date.now();
    try {
      const response = await page.request.get(`${BASE_URL}/api/categories?type=listing`);
      const json = await response.json();
      const pets = json.data?.find((c: { id: string }) => c.id === 'pets-animals');
      const hasRegPapers = pets?.form_fields?.includes('registrationPapers');
      const hasPedigree = pets?.form_fields?.includes('pedigree');
      const passed = hasRegPapers && hasPedigree;
      results.push({
        name: 'API: pets-animals has registrationPapers and pedigree',
        passed,
        error: passed ? undefined : `registrationPapers: ${hasRegPapers}, pedigree: ${hasPedigree}`,
        duration: Date.now() - start6,
      });
      passed ? database.passed++ : database.failed++;
    } catch (err) {
      results.push({ name: 'API: pets fields check', passed: false, error: String(err), duration: Date.now() - start6 });
      database.failed++;
    }

    // Test 7: Agriculture has soilType and climateZone
    const start7 = Date.now();
    try {
      const response = await page.request.get(`${BASE_URL}/api/categories?type=listing`);
      const json = await response.json();
      const agriculture = json.data?.find((c: { id: string }) => c.id === 'agriculture');
      const hasSoilType = agriculture?.form_fields?.includes('soilType');
      const hasClimateZone = agriculture?.form_fields?.includes('climateZone');
      const passed = hasSoilType && hasClimateZone;
      results.push({
        name: 'API: agriculture has soilType and climateZone',
        passed,
        error: passed ? undefined : `soilType: ${hasSoilType}, climateZone: ${hasClimateZone}`,
        duration: Date.now() - start7,
      });
      passed ? database.passed++ : database.failed++;
    } catch (err) {
      results.push({ name: 'API: agriculture fields check', passed: false, error: String(err), duration: Date.now() - start7 });
      database.failed++;
    }

    // Test 8: Listings API works
    const start8 = Date.now();
    try {
      const response = await page.request.get(`${BASE_URL}/api/listings?limit=1`);
      const json = await response.json();
      const passed = json.success === true && Array.isArray(json.data);
      results.push({
        name: 'API: GET /api/listings works',
        passed,
        error: passed ? undefined : `Expected success=true and data array`,
        duration: Date.now() - start8,
      });
      passed ? backend.passed++ : backend.failed++;
    } catch (err) {
      results.push({ name: 'API: listings endpoint', passed: false, error: String(err), duration: Date.now() - start8 });
      backend.failed++;
    }

    // ========================
    // FRONTEND TESTS
    // ========================

    console.log('\n=== Testing Frontend ===\n');

    // Test 9: Homepage loads
    const start9 = Date.now();
    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      const title = await page.title();
      const passed = title.includes('TimorUp');
      results.push({
        name: 'Frontend: Homepage loads with correct title',
        passed,
        error: passed ? undefined : `Expected title to contain "TimorUp", got "${title}"`,
        duration: Date.now() - start9,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Homepage', passed: false, error: String(err), duration: Date.now() - start9 });
      frontend.failed++;
    }

    // Test 10: Homepage has navigation
    const start10 = Date.now();
    try {
      const nav = await page.locator('header').count();
      const passed = nav > 0;
      results.push({
        name: 'Frontend: Homepage has header/navigation',
        passed,
        error: passed ? undefined : 'No header found on homepage',
        duration: Date.now() - start10,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Header check', passed: false, error: String(err), duration: Date.now() - start10 });
      frontend.failed++;
    }

    // Test 11: Homepage has main content sections
    const start11 = Date.now();
    try {
      await page.waitForSelector('main', { timeout: 5000 });
      const mainContent = await page.locator('main').textContent();
      const passed = mainContent && mainContent.length > 100;
      results.push({
        name: 'Frontend: Homepage has main content',
        passed,
        error: passed ? undefined : 'Main content appears empty or too short',
        duration: Date.now() - start11,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Main content', passed: false, error: String(err), duration: Date.now() - start11 });
      frontend.failed++;
    }

    // Test 12: Listings page loads
    const start12 = Date.now();
    try {
      await page.goto(`${BASE_URL}/listings`, { waitUntil: 'domcontentloaded' });
      const title = await page.title();
      const passed = title.includes('Classified') || title.includes('TimorUp');
      results.push({
        name: 'Frontend: /listings page loads',
        passed,
        error: passed ? undefined : `Expected title to contain "Classified" or "TimorUp", got "${title}"`,
        duration: Date.now() - start12,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Listings page', passed: false, error: String(err), duration: Date.now() - start12 });
      frontend.failed++;
    }

    // Test 13: Listings page has search
    const start13 = Date.now();
    try {
      await page.goto(`${BASE_URL}/listings`, { waitUntil: 'domcontentloaded' });
      const searchBox = await page.locator('input[type="search"], input[placeholder*="Search"], [role="searchbox"]').count();
      const passed = searchBox > 0;
      results.push({
        name: 'Frontend: /listings has search functionality',
        passed,
        error: passed ? undefined : 'No search input found on listings page',
        duration: Date.now() - start13,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Search functionality', passed: false, error: String(err), duration: Date.now() - start13 });
      frontend.failed++;
    }

    // Test 14: Login page loads
    const start14 = Date.now();
    try {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
      const title = await page.title();
      const passed = title.includes('Log') || title.includes('TimorUp');
      results.push({
        name: 'Frontend: /login page loads',
        passed,
        error: passed ? undefined : `Expected title to contain "Log" or "TimorUp", got "${title}"`,
        duration: Date.now() - start14,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Login page', passed: false, error: String(err), duration: Date.now() - start14 });
      frontend.failed++;
    }

    // Test 15: Register page loads
    const start15 = Date.now();
    try {
      await page.goto(`${BASE_URL}/register`, { waitUntil: 'domcontentloaded' });
      const title = await page.title();
      const passed = title.includes('Register') || title.includes('Sign') || title.includes('TimorUp');
      results.push({
        name: 'Frontend: /register page loads',
        passed,
        error: passed ? undefined : `Expected title to contain "Register" or "Sign Up", got "${title}"`,
        duration: Date.now() - start15,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Register page', passed: false, error: String(err), duration: Date.now() - start15 });
      frontend.failed++;
    }

    // Test 16: No critical console errors
    const start16 = Date.now();
    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      const criticalErrors = consoleErrors.filter(e => 
        !e.includes('favicon') && 
        !e.includes('404') &&
        !e.includes('net::ERR')
      );
      const passed = criticalErrors.length === 0;
      results.push({
        name: 'Frontend: No critical console errors',
        passed,
        error: passed ? undefined : `Found ${criticalErrors.length} console errors: ${criticalErrors.slice(0, 3).join(', ')}`,
        duration: Date.now() - start16,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Console errors', passed: false, error: String(err), duration: Date.now() - start16 });
      frontend.failed++;
    }

    // Test 17: Category dropdown/filter exists on listings
    const start17 = Date.now();
    try {
      await page.goto(`${BASE_URL}/listings`, { waitUntil: 'domcontentloaded' });
      const dropdown = await page.locator('select, [role="combobox"], [aria-label*="category" i]').count();
      const passed = dropdown > 0;
      results.push({
        name: 'Frontend: /listings has category filter/dropdown',
        passed,
        error: passed ? undefined : 'No category dropdown found',
        duration: Date.now() - start17,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Category filter', passed: false, error: String(err), duration: Date.now() - start17 });
      frontend.failed++;
    }

    // Test 18: Footer exists
    const start18 = Date.now();
    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      const footer = await page.locator('footer').count();
      const passed = footer > 0;
      results.push({
        name: 'Frontend: Homepage has footer',
        passed,
        error: passed ? undefined : 'No footer found',
        duration: Date.now() - start18,
      });
      passed ? frontend.passed++ : frontend.failed++;
    } catch (err) {
      results.push({ name: 'Frontend: Footer check', passed: false, error: String(err), duration: Date.now() - start18 });
      frontend.failed++;
    }

  } finally {
    await browser.close();
  }

  // Calculate totals
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  return {
    total: results.length,
    passed,
    failed,
    results,
    summary: {
      frontend,
      backend,
      database,
    },
  };
}

// Run tests and print results
runTests().then(result => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║             TIMORUP COMPLETE TEST RESULTS                   ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║ Total Tests: ${result.total}                                              ║`);
  console.log(`║ Passed:     ${result.passed}                                              ║`);
  console.log(`║ Failed:     ${result.failed}                                              ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║ SUMMARY BY CATEGORY:                                      ║');
  console.log(`║ Frontend:  ${result.summary.frontend.passed} passed, ${result.summary.frontend.failed} failed                            ║`);
  console.log(`║ Backend:   ${result.summary.backend.passed} passed, ${result.summary.backend.failed} failed                              ║`);
  console.log(`║ Database:  ${result.summary.database.passed} passed, ${result.summary.database.failed} failed                            ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║ TEST DETAILS:                                             ║');
  
  result.results.forEach((r, i) => {
    const status = r.passed ? '✅' : '❌';
    const name = r.name.substring(0, 55).padEnd(55);
    console.log(`║ ${status} ${name} ║`);
    if (!r.passed && r.error) {
      console.log(`║    └─ ${r.error.substring(0, 50).padEnd(50)} ║`);
    }
  });
  
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // Exit with error code if any tests failed
  process.exit(result.failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});