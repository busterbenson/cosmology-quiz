#!/usr/bin/env node
/**
 * Test what the browser actually shows for a permalink
 */

const http = require('http');

async function testBrowserPermalink(answerString) {
  console.log(`Testing browser permalink: http://localhost:3000/results?answers=${answerString}`);
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/results?answers=${answerString}`,
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Node.js test)'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Look for the cosmology name in the HTML
        const cosmologyRegex = /<h2[^>]*class="[^"]*text-xl[^"]*font-bold[^"]*text-white[^"]*"[^>]*>([^<]+)<\/h2>/;
        const match = data.match(cosmologyRegex);
        
        if (match) {
          console.log(`Found top result: ${match[1]}`);
          resolve(match[1]);
        } else {
          // Try alternative pattern
          const altRegex = /<h2[^>]*>([^<]+)<\/h2>/;
          const altMatch = data.match(altRegex);
          if (altMatch) {
            console.log(`Found alternative match: ${altMatch[1]}`);
            resolve(altMatch[1]);
          } else {
            console.log('Could not find cosmology name in HTML');
            console.log('HTML sample:', data.slice(0, 500));
            resolve(null);
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function main() {
  const answerString = process.argv[2] || 'NNNNNNNNNYNN';
  
  try {
    const result = await testBrowserPermalink(answerString);
    console.log(`\nResult: ${result || 'Not found'}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  main();
}