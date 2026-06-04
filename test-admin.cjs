// Test Admin Login Flow
const { chromium } = require('playwright');

async function testAdminFlow() {
  console.log('🚀 Testing Admin Login Flow...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Login as admin
    console.log('📍 Step 1: Login as admin');
    await page.goto('https://timorup.jasonwill.workers.dev/login', { waitUntil: 'networkidle' });
    await page.locator('input[name="email"]').fill('admin@timorup.com');
    await page.locator('input[name="password"]').fill('admin12345');
    await page.locator('input[name="password"]').press('Enter');
    await page.waitForTimeout(5000);
    
    const afterLoginUrl = page.url();
    console.log(`   Current URL: ${afterLoginUrl}`);
    
    // Navigate to admin if not already there
    if (!afterLoginUrl.includes('/admin')) {
      console.log('📍 Step 2: Navigate to admin page');
      await page.goto('https://timorup.jasonwill.workers.dev/admin', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
    }
    
    const adminUrl = page.url();
    console.log(`   Admin URL: ${adminUrl}`);
    
    // Get page content
    const bodyText = await page.textContent('body');
    console.log('\n📊 Page contains:');
    console.log(`   - "Admin": ${bodyText.includes('Admin')}`);
    console.log(`   - "Dashboard": ${bodyText.includes('Dashboard')}`);
    console.log(`   - "User": ${bodyText.includes('User')}`);
    console.log(`   - "Business": ${bodyText.includes('Business')}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/admin-page.png' });
    console.log('\n📸 Screenshot saved to test-results/admin-page.png');
    
    // Test business listing page
    console.log('\n📍 Step 3: Navigate to business listing page');
    await page.goto('https://timorup.jasonwill.workers.dev/businesses', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const businessUrl = page.url();
    console.log(`   Business URL: ${businessUrl}`);
    
    const businessText = await page.textContent('body');
    console.log(`   Page loaded: ${businessText.length > 100}`);
    
    // Test product page
    console.log('\n📍 Step 4: Navigate to product listing page');
    await page.goto('https://timorup.jasonwill.workers.dev/product', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const productUrl = page.url();
    console.log(`   Product URL: ${productUrl}`);
    
    console.log('\n✅ Admin flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'test-results/admin-error.png' }).catch(() => {});
  }
  
  await browser.close();
}

// Run the test
testAdminFlow()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });