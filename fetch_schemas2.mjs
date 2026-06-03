import { execSync } from 'child_process';

const tables = ['businesses','non_profits','public_sectors','listings','products','media','orders','service_packages','ad_banners','blog_posts','user','session','account','verification','reviews','saved_items','business_categories','non_profit_categories','public_sector_categories','listing_categories','product_categories','blog_categories','site_settings','latest_updates'];

const results = {};
for (const t of tables) {
  try {
    const out = execSync(
      `npx wrangler d1 execute timorup-db --remote --command "SELECT sql FROM sqlite_master WHERE type='table' AND name='${t}'"`,
      { cwd: 'D:/Dev Projects/timorup', timeout: 30000, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    // extract the sql from JSON output
    const match = out.match(/"sql":\s*"([^"]*(?:\\.[^"]*)*)"/s);
    results[t] = match ? match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : 'NO SQL FOUND';
  } catch (e) {
    results[t] = 'ERROR: ' + e.message.slice(0, 100);
  }
}

// Save to file
const fs = await import('fs');
let output = '';
for (const [t, sql] of Object.entries(results)) {
  output += `=== ${t} ===\n${sql}\n\n`;
}
fs.writeFileSync('remote_schemas.txt', output);
console.log('Saved to remote_schemas.txt');