import { execSync } from 'child_process';

const tables = ['businesses','non_profits','public_sectors','listings','products','media','orders','service_packages','ad_banners','blog_posts','user','session','account','verification','reviews','saved_items','business_categories','non_profit_categories','public_sector_categories','listing_categories','product_categories','blog_categories','site_settings','latest_updates'];

for (const t of tables) {
  try {
    const out = execSync(`npx wrangler d1 execute timorup-db --remote "SELECT sql FROM sqlite_master WHERE type='table' AND name='${t}'"`, {
      cwd: 'D:/Dev Projects/timorup',
      timeout: 30000,
      encoding: 'utf8'
    });
    try {
      const j = JSON.parse(out);
      const sql = j.results?.[0]?.sql ?? '';
      console.log(`=== ${t} ===`);
      console.log(sql);
      console.log();
    } catch {
      console.log(`=== ${t} (parse fail) ===`);
      console.log(out.slice(0, 300));
      console.log();
    }
  } catch (e) {
    console.log(`=== ${t} (error) ===`);
    console.log(e.message.slice(0, 200));
    console.log();
  }
}