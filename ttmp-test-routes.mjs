const base = 'http://localhost:8787';

async function detailedFetch(url) {
  const r = await fetch(url);
  const headers = {};
  r.headers.forEach((v, k) => headers[k] = v);
  const chunks = [];
  const reader = r.body?.getReader();
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  }
  const buf = Buffer.concat(chunks);
  return { status: r.status, headers, body: buf.toString() };
}

// Test business page vs homepage
const [biz, home, api] = await Promise.all([
  detailedFetch(base + '/business/casa-maria-restaurant'),
  detailedFetch(base + '/'),
  detailedFetch(base + '/api/businesses?limit=1'),
]);

console.log('=== BUSINESS PAGE ===');
console.log('status:', biz.status);
console.log('headers:', JSON.stringify(biz.headers, null, 2));
console.log('body len:', biz.body.length);
console.log('body start:', biz.body.substring(0, 200));
console.log('\n=== HOMEPAGE ===');
console.log('status:', home.status);
console.log('body len:', home.body.length);
console.log('\n=== API ===');
console.log('status:', api.status);
console.log('body len:', api.body.length);
console.log('body start:', api.body.substring(0, 200));