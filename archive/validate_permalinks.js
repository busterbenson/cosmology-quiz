#!/usr/bin/env node
/**
 * Validate Permalinks
 * 
 * This tool tests actual browser URLs to see what they really return,
 * bypassing any simulation or API endpoints.
 */

const http = require('http');

class PermalinkValidator {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Test a permalink URL and extract the actual top results
   */
  async testPermalink(answerString) {
    const url = `${this.baseUrl}/results?answers=${answerString}`;
    console.log(`🔍 Testing: ${url}`);

    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 80,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Node.js permalink validator'
        }
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const results = this.parseHTMLResults(data);
            resolve({
              answerString,
              url,
              topResults: results,
              rawHTML: data.slice(0, 1000) // Keep sample for debugging
            });
          } catch (error) {
            reject(new Error(`Failed to parse results: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.setTimeout(15000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Parse HTML to extract cosmology results
   * This is a simple parser - looks for common patterns in the results page
   */
  parseHTMLResults(html) {
    const results = [];

    // Look for patterns that might contain cosmology names and scores
    // Since this is server-side rendered, we need to look for the actual content

    // Method 1: Look for structured data or JSON in the HTML
    const jsonMatch = html.match(/window\.__NUXT__\s*=\s*({.+?});?/s);
    if (jsonMatch) {
      try {
        const nuxtData = JSON.parse(jsonMatch[1]);
        // Try to extract quiz results from Nuxt data
        // This will depend on how Nuxt structures the data
        console.log('Found Nuxt data structure');
      } catch (e) {
        console.log('Could not parse Nuxt data');
      }
    }

    // Method 2: Look for cosmology names in text content
    const cosmologyNames = [
      'Classical Polytheism', 'Biblical Literalism', 'Analytical Idealism',
      'Many-Sided Reality', 'Eternal Universe', 'Multiple Realms',
      'Evolutionary Creationism', 'Classical Deism', 'Reductive Materialism',
      'Natural Process & Spontaneity', 'Pattern Correspondence & Complementarity'
    ];

    // Simple text search for cosmology names
    for (const name of cosmologyNames) {
      if (html.includes(name)) {
        // Try to find associated score
        const nameIndex = html.indexOf(name);
        const afterName = html.slice(nameIndex, nameIndex + 200);
        const scoreMatch = afterName.match(/(\d+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        
        results.push({
          cosmology: name,
          score: score,
          found: true
        });
      }
    }

    // Method 3: Look for specific UI patterns
    const topResultMatch = html.match(/(?:top.*result|best.*match|highest.*score)[^>]*>([^<]+)/i);
    if (topResultMatch) {
      console.log(`Possible top result indicator: ${topResultMatch[1]}`);
    }

    // Sort by score if we found any
    if (results.length > 0) {
      results.sort((a, b) => b.score - a.score);
    }

    return results;
  }

  /**
   * Validate the permalinks from our generated results
   */
  async validateGeneratedPermalinks() {
    console.log('🧪 VALIDATING GENERATED PERMALINKS');
    console.log('=' + '='.repeat(60));

    // Test the specific permalinks that our generator claimed were successful
    const testCases = [
      {
        name: 'Classical Polytheism',
        answerString: 'NNNNNNNNNYNN',
        claimedRank: 1,
        claimedScore: 88
      },
      {
        name: 'Analytical Idealism', 
        answerString: 'NNNNNNNNNNY',
        claimedRank: 1,
        claimedScore: 78
      },
      {
        name: 'Biblical Literalism',
        answerString: 'NYNNNNNNNNNYNNYNYYNNNNYNNNNNYN',
        claimedRank: 1,
        claimedScore: 292
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n📋 Testing ${testCase.name}`);
      console.log(`   Expected: Rank #${testCase.claimedRank}, Score ${testCase.claimedScore}`);
      console.log(`   Answer string: ${testCase.answerString}`);

      try {
        const result = await this.testPermalink(testCase.answerString);
        
        console.log(`   Found ${result.topResults.length} cosmologies in HTML`);
        
        if (result.topResults.length > 0) {
          console.log(`   Top results from HTML parsing:`);
          result.topResults.slice(0, 5).forEach((r, i) => {
            const highlight = r.cosmology === testCase.name ? ' ⭐' : '';
            console.log(`     ${i + 1}. ${r.cosmology}: ${r.score}${highlight}`);
          });

          // Check if our target cosmology is in the top results
          const targetResult = result.topResults.find(r => r.cosmology === testCase.name);
          if (targetResult) {
            const rank = result.topResults.findIndex(r => r.cosmology === testCase.name) + 1;
            console.log(`   ✅ ${testCase.name} found at rank #${rank} (score ${targetResult.score})`);
            
            if (rank !== testCase.claimedRank) {
              console.log(`   ⚠️  DISCREPANCY: Expected rank #${testCase.claimedRank}, got #${rank}`);
            }
          } else {
            console.log(`   ❌ ${testCase.name} not found in top results`);
          }
        } else {
          console.log(`   ⚠️  Could not extract results from HTML`);
          console.log(`   HTML sample: ${result.rawHTML.slice(0, 200)}...`);
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
  }
}

async function main() {
  const validator = new PermalinkValidator();
  
  if (process.argv[2] === 'test') {
    // Test single permalink
    const answerString = process.argv[3] || 'NNNNNNNNNYNN';
    try {
      const result = await validator.testPermalink(answerString);
      console.log('Results:', result.topResults);
    } catch (error) {
      console.error('Error:', error.message);
    }
  } else {
    // Validate our generated permalinks
    await validator.validateGeneratedPermalinks();
  }
}

if (require.main === module) {
  main().catch(console.error);
}