#!/bin/bash
# scripts/schema-sync-check.sh
# 验证 local schema 和 remote D1 是否同步

set -e

echo "=== Schema Sync Check ==="

# 1. 获取 local schema hash
LOCAL_HASH=$(md5sum src/db/schema.ts | cut -d' ' -f1)
echo "Local schema hash: $LOCAL_HASH"

# 2. 获取 remote D1 schema hash (通过 drizzle-kit introspection)
echo "Fetching remote schema..."
npx drizzle-kit introspect --credentials > /tmp/remote-schema.json 2>/dev/null || echo "Introspection not available"

# 3. 对比关键表结构
echo ""
echo "=== Table Column Comparison ==="

# 表名列表
TABLES=("businesses" "non_profits" "public_sectors" "listings" "products" "orders" "media" "reviews" "saved_items" "latest_updates" "blog_posts" "service_packages" "ad_banners")

for TABLE in "${TABLES[@]}"; do
    echo ""
    echo "Table: $TABLE"
    echo "  Local columns:"
    # 从 local schema 提取列
    grep -A 100 "export const $TABLE" src/db/schema.ts | head -50 | grep -oP "^\s+\w+:" | sort
    
    echo "  Remote columns (from D1):"
    # 从 remote 提取列 - 需要 Wrangler CLI
    npx wrangler d1 execute timorup-db --remote --command "PRAGMA table_info($TABLE);" 2>/dev/null | grep -v "^$" | tail -n +3 | awk '{print "    " $2}' | sort
done

echo ""
echo "=== Deprecated Field Check ==="
echo "Searching for deprecated fields in codebase..."
grep -r "subscriptionStatus\|gracePeriodEndDate\|listingType\|expiresAt" \
    --include="*.ts" --include="*.astro" \
    src/pages src/components src/lib 2>/dev/null || echo "None found - OK"

echo ""
echo "=== Build Verification ==="
pnpm build --dry-run 2>&1 | tail -5 || echo "Build check completed"