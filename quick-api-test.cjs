const http = require('http');

async function test() {
  console.log('Testing /api/auth...');
  
  const data = JSON.stringify({ email: 'admin@timorup.com', password: 'admin12345' });
  
  const options = {
    hostname: '127.0.0.1',
    port: 8787,
    path: '/api/auth',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'User-Agent': 'test-node'
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', body);
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
  });

  req.write(data);
  req.end();
}

test();