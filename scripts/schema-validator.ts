// scripts/schema-validator.ts
// Validates schema sync across: local schema, remote D1, API types, frontend components
// Run: npx tsx scripts/schema-validator.ts --mode=full

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  localSchema: 'src/db/schema.ts',
  remoteDb: 'timorup-db',
  outputReport: 'reports/schema-sync-report.json',

  // Tables to validate
  tables: [
    'users', 'sessions', 'accounts', 'verifications',
    'businesses', 'non_profits', 'public_sectors', 'listings',
    'products', 'orders', 'service_packages', 'ad_banners',
    'media', 'reviews', 'saved_items', 'latest_updates',
    'blog_posts',
  ],

  // Deprecated fields that should NOT exist
  deprecatedFields: {
    businesses: ['subscriptionStatus', 'gracePeriodEndDate', 'latestUpdates', 'planSlug', 'planType', 'expiryDate'],
    non_profits: ['subscriptionStatus', 'gracePeriodEndDate', 'latestUpdates', 'ratingAverage', 'ratingCount', 'trialStartedAt'],
    public_sectors: ['subscriptionStatus', 'gracePeriodEndDate', 'latestUpdates', 'ratingAverage', 'ratingCount', 'planType', 'publishDate'],
    listings: ['listingType', 'gracePeriodEndAt'],
    orders: ['variantId'],
    saved_items: ['itemType', 'itemId'],
  },

  // Required fields for each table (must exist)
  requiredFields: {
    businesses: ['id', 'slug', 'title', 'ownerId', 'status', 'createdAt', 'updatedAt', 'views', 'deletedAt'],
    non_profits: ['id', 'slug', 'title', 'ownerId', 'status', 'createdAt', 'updatedAt', 'views', 'deletedAt'],
    public_sectors: ['id', 'slug', 'title', 'ownerId', 'status', 'createdAt', 'updatedAt', 'views', 'deletedAt'],
    listings: ['id', 'slug', 'title', 'ownerId', 'status', 'createdAt', 'updatedAt', 'planExpiresAt', 'shares'],
    products: ['id', 'businessId', 'title', 'createdAt', 'updatedAt', 'deletedAt'],
    orders: ['id', 'type', 'typeId', 'status', 'servicePackageId', 'planExpiresAt'],
    media: ['id', 'entityType', 'entityId', 'url', 'purpose', 'createdAt'],
  },
};

// ============================================================================
// VALIDATION PHASES
// ============================================================================

interface ValidationResult {
  phase: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details: any[];
}

interface FullReport {
  timestamp: string;
  phases: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

/**
 * Phase 1: Validate local schema structure
 */
async function validateLocalSchema(): Promise<ValidationResult> {
  const details: any[] = [];
  let status: 'pass' | 'fail' | 'warning' = 'pass';

  // Check if schema file exists
  if (!existsSync(CONFIG.localSchema)) {
    return {
      phase: 'Local Schema',
      status: 'fail',
      message: `Schema file not found: ${CONFIG.localSchema}`,
      details: [],
    };
  }

  const schemaContent = readFileSync(CONFIG.localSchema, 'utf-8');

  // Validate each table
  for (const table of Object.keys(CONFIG.requiredFields)) {
    const tablePattern = new RegExp(`export\\s+const\\s+${table}\\s*=`, 'i');
    const hasTable = tablePattern.test(schemaContent);

    if (!hasTable) {
      details.push({ table, issue: 'table not found', severity: 'error' });
      status = 'fail';
    } else {
      // Check required fields
      for (const field of CONFIG.requiredFields[table as keyof typeof CONFIG.requiredFields]) {
        const fieldPattern = new RegExp(`${field}\\s*:`, 'i');
        if (!fieldPattern.test(schemaContent)) {
          details.push({ table, field, issue: 'required field missing', severity: 'error' });
          status = 'fail';
        }
      }
    }
  }

  // Check deprecated fields are NOT present
  for (const [table, fields] of Object.entries(CONFIG.deprecatedFields)) {
    for (const field of fields) {
      const fieldPattern = new RegExp(`${field}\\s*[=:"]`, 'i');
      if (fieldPattern.test(schemaContent)) {
        details.push({ table, field, issue: 'deprecated field still in schema', severity: 'error' });
        status = 'fail';
      }
    }
  }

  return {
    phase: 'Local Schema',
    status,
    message: status === 'pass' ? 'Local schema structure OK' : 'Local schema has issues',
    details,
  };
}

/**
 * Phase 2: Validate remote D1 schema
 */
async function validateRemoteSchema(): Promise<ValidationResult> {
  const details: any[] = [];
  let status: 'pass' | 'fail' | 'warning' = 'pass';

  // Use wrangler to query D1 schema
  const { execSync } = await import('child_process');

  for (const table of CONFIG.tables) {
    try {
      const cmd = `npx wrangler d1 execute ${CONFIG.remoteDb} --remote --command "PRAGMA table_info(${table});" --output=json`;
      const result = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });

      const columns = JSON.parse(result);
      const columnNames = columns.map((c: any) => c.name);

      // Check required fields
      const requiredFields = CONFIG.requiredFields[table as keyof typeof CONFIG.requiredFields] || [];
      for (const field of requiredFields) {
        if (!columnNames.includes(field)) {
          details.push({ table, field, issue: 'required field missing in D1', severity: 'error' });
          status = 'fail';
        }
      }

      // Check deprecated fields are NOT present
      const deprecatedFields = CONFIG.deprecatedFields[table as keyof typeof CONFIG.deprecatedFields] || [];
      for (const field of deprecatedFields) {
        if (columnNames.includes(field)) {
          details.push({ table, field, issue: 'deprecated field still in D1', severity: 'error' });
          status = 'fail';
        }
      }

    } catch (e: any) {
      if (e.message?.includes('does not exist') || e.status === 1) {
        details.push({ table, issue: 'table not found in D1', severity: 'warning' });
      } else {
        details.push({ table, issue: `failed to query: ${e.message}`, severity: 'error' });
        status = 'fail';
      }
    }
  }

  return {
    phase: 'Remote D1 Schema',
    status,
    message: status === 'pass' ? 'Remote D1 schema OK' : 'Remote D1 schema has issues',
    details,
  };
}

/**
 * Phase 3: Validate API response types
 */
async function validateApiTypes(): Promise<ValidationResult> {
  const details: any[] = [];
  let status: 'pass' | 'fail' | 'warning' = 'pass';

  const apiDir = join(__dirname, '..', 'src', 'pages', 'api');

  if (!existsSync(apiDir)) {
    return {
      phase: 'API Types',
      status: 'warning',
      message: 'API directory not found, skipping',
      details: [],
    };
  }

  function scanDir(dir: string): string[] {
    const files: string[] = [];
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...scanDir(fullPath));
      } else if (entry.name.endsWith('.ts')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const apiFiles = scanDir(apiDir);

  for (const file of apiFiles) {
    const content = readFileSync(file, 'utf-8');
    const relativePath = file.replace(join(__dirname, '..'), '');

    // Check for deprecated field usage in returns
    for (const [table, fields] of Object.entries(CONFIG.deprecatedFields)) {
      for (const field of fields) {
        if (content.includes(`.${field}`) || content.includes(`"${field}"`)) {
          // Allow in type definitions but not in actual returns
          if (!content.includes('z.object') && !content.includes('type ') && !content.includes('interface ')) {
            details.push({
              file: relativePath,
              field,
              table,
              issue: 'deprecated field in API return/param',
              severity: 'error',
            });
            status = 'fail';
          }
        }
      }
    }
  }

  return {
    phase: 'API Types',
    status,
    message: status === 'pass' ? 'API types OK' : 'API types reference deprecated fields',
    details,
  };
}

/**
 * Phase 4: Validate frontend components
 */
async function validateFrontendComponents(): Promise<ValidationResult> {
  const details: any[] = [];
  let status: 'pass' | 'fail' | 'warning' = 'pass';

  const componentsDir = join(__dirname, '..', 'src');
  const extensions = ['.ts', '.tsx', '.astro'];

  function scanDir(dir: string, maxDepth = 3): string[] {
    if (maxDepth <= 0) return [];

    const files: string[] = [];
    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;

        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...scanDir(fullPath, maxDepth - 1));
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Ignore permission errors
    }

    return files;
  }

  const files = scanDir(componentsDir);

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const relativePath = file.replace(join(__dirname, '..'), '');

    // Check for deprecated field usage
    for (const [table, fields] of Object.entries(CONFIG.deprecatedFields)) {
      for (const field of fields) {
        // Patterns: .subscriptionStatus, "subscriptionStatus", subscriptionStatus:
        const patterns = [
          new RegExp(`\\.${field}\\b`, 'g'),
          new RegExp(`"${field}"\\s*:`, 'g'),
          new RegExp(`'${field}'\\s*:`, 'g'),
          new RegExp(`${field}\\s*[:=]`, 'g'),
        ];

        for (const pattern of patterns) {
          if (pattern.test(content)) {
            // Exclude comments and type definitions
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (pattern.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
                details.push({
                  file: relativePath,
                  field,
                  table,
                  line: i + 1,
                  issue: 'deprecated field usage in component',
                  severity: 'error',
                });
                status = 'fail';
              }
            }
          }
        }
      }
    }
  }

  return {
    phase: 'Frontend Components',
    status,
    message: status === 'pass' ? 'Frontend components OK' : 'Frontend components use deprecated fields',
    details,
  };
}

/**
 * Phase 5: Validate build
 */
async function validateBuild(): Promise<ValidationResult> {
  const { execSync } = await import('child_process');

  try {
    execSync('pnpm build 2>&1', { encoding: 'utf-8', stdio: 'pipe', timeout: 300000 });
    return {
      phase: 'Build',
      status: 'pass',
      message: 'Build successful',
      details: [],
    };
  } catch (e: any) {
    return {
      phase: 'Build',
      status: 'fail',
      message: 'Build failed',
      details: [{ issue: e.message?.slice(0, 500) }],
    };
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('\n🚀 Schema Sync Validator\n');
  console.log('='.repeat(60));

  const phases: Array<() => Promise<ValidationResult>> = [
    validateLocalSchema,
    validateRemoteSchema,
    validateApiTypes,
    validateFrontendComponents,
    validateBuild,
  ];

  const results: ValidationResult[] = [];

  for (const phase of phases) {
    console.log(`\n📋 Running: ${(await phase()).phase}...`);
    const result = await phase();
    results.push(result);

    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`   ${icon} ${result.message}`);

    if (result.details.length > 0) {
      console.log(`   Found ${result.details.length} issues:`);
      for (const detail of result.details.slice(0, 5)) {
        console.log(`     - ${detail.table || detail.file}: ${detail.field || detail.issue}`);
      }
      if (result.details.length > 5) {
        console.log(`     ... and ${result.details.length - 5} more`);
      }
    }
  }

  // Summary
  const summary = {
    total: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    warnings: results.filter(r => r.status === 'warning').length,
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total phases: ${summary.total}`);
  console.log(`Passed: ${summary.passed}`);
  console.log(`Failed: ${summary.failed}`);
  console.log(`Warnings: ${summary.warnings}`);

  // Write report
  const report: FullReport = {
    timestamp: new Date().toISOString(),
    phases: results,
    summary,
  };

  // Ensure reports directory exists
  const reportsDir = join(__dirname, '..', 'reports');
  if (!existsSync(reportsDir)) {
    require('fs').mkdirSync(reportsDir, { recursive: true });
  }

  writeFileSync(
    join(__dirname, '..', CONFIG.outputReport),
    JSON.stringify(report, null, 2)
  );

  console.log(`\n📄 Report saved to: ${CONFIG.outputReport}`);

  // Exit with error if any phase failed
  if (summary.failed > 0) {
    console.log('\n❌ VALIDATION FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ ALL VALIDATIONS PASSED');
    process.exit(0);
  }
}

main().catch(console.error);