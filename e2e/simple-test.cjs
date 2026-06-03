// Test runner using curl subprocess (bypasses proxy issues)
const { execSync } = require('child_process');

const BASE_URL = 'http://127.0.0.1:8787';
const results = [];

function curlGet(path) {
  try {
    const cmd = `curl --noproxy "*" -s "http://127.0.0.1:8787${path}"`;
    const output = execSync(cmd, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (err) {
    throw new Error(`curl failed: ${err.message.substring(0, 100)}`);
  }
}

console.log('Starting tests...\n');

// Test 1: API categories
console.log('Test 1: API categories...');
try {
  const data = curlGet('/api/categories?type=listing');
  const cats = data.data ?? [];
  const count = Array.isArray(cats) ? cats.length : 0;
  results.push({ name: `API: ${count} categories (expected >= 89)`, passed: count >= 89, error: count >= 89 ? undefined : `Expected >= 89, got ${count}` });
} catch (err) {
  results.push({ name: 'API: categories', passed: false, error: String(err).substring(0, 80) });
}

// Test 2: formFields present
console.log('Test 2: formFields...');
try {
  const data = curlGet('/api/categories?type=listing');
  const cats = data.data ?? [];
  // formFields uses JS object notation: { name: "make", type: "text"... }
  const count = cats.filter((c) => {
    const ff = c.formFields;
    return typeof ff === 'string' && (ff.includes('{ name:') || ff.includes('{name:'));
  }).length;
  results.push({ name: `API: ${count} categories have formFields`, passed: count >= 10, error: count >= 10 ? undefined : `Expected >= 10, got ${count}` });
} catch (err) {
  results.push({ name: 'API: formFields', passed: false, error: String(err).substring(0, 80) });
}

// Test 3: viewType in property-sale
console.log('Test 3: viewType field...');
try {
  const data = curlGet('/api/categories?type=listing');
  const cats = data.data ?? [];
  const propSale = cats.find((c) => c.id === 'property-sale');
  const ff = propSale?.formFields;
  const hasViewType = typeof ff === 'string' ? ff.includes('viewType') : false;
  results.push({ name: 'Property Sale has viewType field', passed: hasViewType });
} catch (err) {
  results.push({ name: 'viewType field', passed: false, error: String(err).substring(0, 80) });
}

// Test 4: insured in services
console.log('Test 4: insured field...');
try {
  const data = curlGet('/api/categories?type=listing');
  const cats = data.data ?? [];
  const services = cats.find((c) => c.id === 'services');
  const ff = services?.formFields;
  const hasInsured = typeof ff === 'string' ? ff.includes('insured') : false;
  const hasBonded = typeof ff === 'string' ? ff.includes('bonded') : false;
  const passed = hasInsured && hasBonded;
  results.push({ name: 'Services has insured & bonded', passed, error: passed ? undefined : `insured:${hasInsured}, bonded:${hasBonded}` });
} catch (err) {
  results.push({ name: 'insured/bonded fields', passed: false, error: String(err).substring(0, 80) });
}

// Test 5: registrationPapers in pets
console.log('Test 5: registrationPapers field...');
try {
  const data = curlGet('/api/categories?type=listing');
  const cats = data.data ?? [];
  const pets = cats.find((c) => c.id === 'pets-animals');
  const ff = pets?.formFields;
  const hasRegPapers = typeof ff === 'string' ? ff.includes('registrationPapers') : false;
  const hasPedigree = typeof ff === 'string' ? ff.includes('pedigree') : false;
  const passed = hasRegPapers && hasPedigree;
  results.push({ name: 'Pets has registrationPapers & pedigree', passed, error: passed ? undefined : `reg:${hasRegPapers}, ped:${hasPedigree}` });
} catch (err) {
  results.push({ name: 'registrationPapers/pedigree fields', passed: false, error: String(err).substring(0, 80) });
}

// Test 6: soilType in agriculture
console.log('Test 6: soilType field...');
try {
  const data = curlGet('/api/categories?type=listing');
  const cats = data.data ?? [];
  const agriculture = cats.find((c) => c.id === 'agriculture');
  const ff = agriculture?.formFields;
  const hasSoilType = typeof ff === 'string' ? ff.includes('soilType') : false;
  const hasClimateZone = typeof ff === 'string' ? ff.includes('climateZone') : false;
  const passed = hasSoilType && hasClimateZone;
  results.push({ name: 'Agriculture has soilType & climateZone', passed, error: passed ? undefined : `soil:${hasSoilType}, climate:${hasClimateZone}` });
} catch (err) {
  results.push({ name: 'soilType/climateZone fields', passed: false, error: String(err).substring(0, 80) });
}

// Test 7: category hierarchy
console.log('Test 7: Category hierarchy...');
try {
  const data = curlGet('/api/categories?type=listing');
  const cats = data.data ?? [];
  const topLevel = cats.filter((c) => c.parentId === null).length;
  const subCategories = cats.length - topLevel;
  results.push({ name: `Hierarchy: ${topLevel} top / ${subCategories} sub`, passed: topLevel === 10 && subCategories === 89, error: `Top:${topLevel} (expected 10), Sub:${subCategories} (expected 89)` });
} catch (err) {
  results.push({ name: 'Category hierarchy', passed: false, error: String(err).substring(0, 80) });
}

// Test 8: listings API works
console.log('Test 8: Listings API...');
try {
  const data = curlGet('/api/listings?limit=1');
  const passed = data.success === true && Array.isArray(data.data);
  results.push({ name: 'Listings API works', passed });
} catch (err) {
  results.push({ name: 'Listings API', passed: false, error: String(err).substring(0, 80) });
}

// Test 9: Homepage
console.log('Test 9: Homepage...');
try {
  const cmd = 'curl --noproxy "*" -s -o NUL -w "%{http_code}" http://127.0.0.1:8787/';
  const status = execSync(cmd, { encoding: 'utf8' }).trim();
  const passed = status === '200';
  results.push({ name: 'Homepage loads (200 OK)', passed, error: passed ? undefined : `Status: ${status}` });
} catch (err) {
  results.push({ name: 'Homepage', passed: false, error: String(err).substring(0, 80) });
}

// Test 10: Listings page
console.log('Test 10: Listings page...');
try {
  const cmd = 'curl --noproxy "*" -s -o NUL -w "%{http_code}" http://127.0.0.1:8787/listings';
  const status = execSync(cmd, { encoding: 'utf8' }).trim();
  const passed = status === '200';
  results.push({ name: 'Listings page loads', passed, error: passed ? undefined : `Status: ${status}` });
} catch (err) {
  results.push({ name: 'Listings page', passed: false, error: String(err).substring(0, 80) });
}

// Print results
console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║              TIMORUP TAXONOMY TEST RESULTS              ║');
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

process.exit(passedCount === results.length ? 0 : 1);