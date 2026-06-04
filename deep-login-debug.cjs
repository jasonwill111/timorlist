const { chromium } = require('playwright');
const Database = require('better-sqlite3');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1706, height: 1200 } });
  const page = await context.newPage();

  // Clear KV rate limits
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

  console.log('=== DEEP LOGIN DEBUG ===\n');

  // Test 1: Check if user exists in DB
  const db = new Database('.wrangler/state/v3/d1/miniflare-D1DatabaseObject/6b123a0a511434e0a5b0b552d2fd45a8a7170721bd777a2037c52e5c9f888f98.sqlite');
  
  // Get admin user
  const adminUser = db.prepare('SELECT id, email, name, role FROM user WHERE email = ?').bind('admin@timorup.com').all()[0];
  console.log('Admin user in DB:', adminUser);
  
  if (adminUser) {
    // Get admin account
    const adminAccount = db.prepare('SELECT id, userId, providerId, password FROM account WHERE userId = ? AND providerId = ?').bind(adminUser.id, 'email').all()[0];
    console.log('Admin account:', adminAccount ? { id: adminAccount.id, userId: adminAccount.userId, providerId: adminAccount.providerId, hasPassword: !!adminAccount.password } : 'NOT FOUND');
    
    // Check if password hash is valid
    if (adminAccount?.password) {
      const bcrypt = require('bcryptjs');
      const isValid = await bcrypt.compare('admin12345', adminAccount.password);
      console.log('Password validation:', isValid);
    }
  } else {
    console.log('No admin user found!');
    const users = db.prepare('SELECT email, role FROM user LIMIT 5').all();
    console.log('Available users:', users);
  }
  
  db.close();

  // Test 2: Try to login via fetch directly
  console.log('\n--- Testing direct fetch ---');
  const response = await page.evaluate(async () => {
    const result = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@timorup.com', password: 'admin12345' })
    });
    const data = await result.json();
    return { status: result.status, ok: result.ok, data };
  });
  console.log('API Response:', JSON.stringify(response, null, 2));

  await browser.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});