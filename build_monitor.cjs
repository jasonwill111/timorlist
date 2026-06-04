const fs = require('fs');
const path = require('path');
const { setTimeout: sleep } = require('timers/promises');

async function waitForBuild(maxMs = 300000, interval = 5000) {
  const serverPath = 'D:\\Dev Projects\\timorup\\dist\\server';
  const logFile = 'D:\\Dev Projects\\timorup\\build_status.txt';
  const startTime = Date.now();
  
  fs.writeFileSync(logFile, `Build monitoring started at ${new Date().toISOString()}\n`);
  
  console.log('Waiting for build to complete...');
  
  while (Date.now() - startTime < maxMs) {
    let status = `Running... ${Math.round((Date.now() - startTime)/1000)}s elapsed\n`;
    
    if (fs.existsSync(serverPath)) {
      const files = fs.readdirSync(serverPath);
      status += `Server files: ${files.join(', ')}\n`;
      if (files.includes('entry.mjs')) {
        status += 'BUILD COMPLETE!\n';
        fs.writeFileSync(logFile, status);
        console.log('BUILD COMPLETE!');
        return true;
      }
    } else {
      status += 'dist/server not yet created\n';
    }
    
    fs.writeFileSync(logFile, status);
    console.log(status.trim());
    await sleep(interval);
  }
  
  fs.writeFileSync(logFile, 'TIMEOUT\n');
  console.log('TIMEOUT');
  return false;
}

waitForBuild().then(() => {
  console.log('Monitor done');
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
