const base = 'http://localhost:8787';

// Check what business detail page actually renders
const r = await fetch(base + '/business/casa-maria-restaurant');
const t = await r.text();
console.log('Status:', r.status);
console.log('Content length:', t.length);
const title = t.match(/<title[^>]*>([^<]+)/);
console.log('Title:', title?.[1] || 'none');
const h1 = t.match(/<h1[^>]*>([^<]+)/);
console.log('H1:', h1?.[1] || 'none');
const body200 = t.match(/<body[^>]*>/);
console.log('Has body:', body200 ? 'yes' : 'no');
const notFound = t.match(/not found|404/i);
console.log('404 content:', notFound?.[0] || 'none');
console.log('First 500 chars:', t.substring(0,500));