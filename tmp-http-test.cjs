const http = require('http');

function fetchVerbose(path) {
  return new Promise((resolve) => {
    const req = http.request({ hostname: 'localhost', port: 8787, path, method: 'GET', headers: { 'Accept-Encoding': 'identity' } }, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
      const chunks = [];
      res.on('data', (c) => { chunks.push(c); console.log(`chunk: ${c.length} bytes`); });
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        console.log(`Total: ${body.length} bytes`);
        console.log(`Body: ${JSON.stringify(body)}`);
        resolve(body);
      });
    });
    req.on('error', (e) => { console.error(`Error: ${e.message}`); resolve(null); });
    req.setTimeout(30000, () => { console.log('TIMEOUT'); req.destroy(); resolve(null); });
    req.end();
  });
}

async function main() {
  console.log('=== /business/aileu-language-school ===');
  await fetchVerbose('/business/aileu-language-school');
  console.log('\n=== /listings/3br-apartment ===');
  await fetchVerbose('/listings/3br-apartment');
}
main().catch(console.error);