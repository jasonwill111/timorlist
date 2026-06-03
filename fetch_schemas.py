import subprocess, json

tables = ['businesses','non_profits','public_sectors','listings','products','media','orders','service_packages','ad_banners','blog_posts','user','session','account','verification','reviews','saved_items','business_categories','non_profit_categories','public_sector_categories','listing_categories','product_categories','blog_categories','site_settings','latest_updates']

results = {}
for t in tables:
    r = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'timorup-db', '--remote',
         f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{t}'"],
        capture_output=True, text=True, cwd='D:/Dev Projects/timorup', timeout=30
    )
    try:
        j = json.loads(r.stdout)
        sql = j['results'][0]['sql'] if j['results'] else ''
        results[t] = sql
    except Exception as e:
        results[t] = f'ERROR: {e} | {r.stdout[:300]}'

for t, sql in results.items():
    print(f'=== {t} ===')
    print(sql)
    print()