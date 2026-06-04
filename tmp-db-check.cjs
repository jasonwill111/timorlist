const Database = require('better-sqlite3');
const path = require('path');
const dbPath = 'D:/Dev Projects/timorup/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/6b123a0a511434e0a5b0b552d2fd45a8a7170721bd777a2037c52e5c9f888f98.sqlite';
try {
  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare("SELECT id, title, slug FROM businesses LIMIT 5").all();
  console.log('Businesses in D1:', JSON.stringify(rows, null, 2));
  db.close();
} catch(e) {
  console.log('Error:', e.message);
}