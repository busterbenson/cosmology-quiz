#!/usr/bin/env node
/**
 * Real Engine Explorer
 * 
 * This tool maps the actual quiz engine's decision tree and finds
 * authentic paths by testing candidates against the real running quiz.
 * 
 * Strategy:
 * 1. Map question selection patterns by exploring the real engine
 * 2. Generate authentic believer candidates for each cosmology  
 * 3. Batch test candidates via permalink URLs
 * 4. Iteratively refine based on real results
 */

const fs = require('fs');
const https = require('https');
const http = require('http');

class RealEngineExplorer {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
    this.questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));
    this.questionTree = new Map(); // Cache of question sequences
  }

  /**
   * Strategy 1: Map question decision patterns
   * Test short sequences to understand what questions the real engine asks
   */
  async mapQuestionPatterns(maxDepth = 6) {
    console.log('🗺️  MAPPING REAL ENGINE QUESTION PATTERNS');
    console.log('=' + '='.repeat(60));
    
    const patterns = new Map();
    
    // Test key decision points with different answer combinations
    const testSequences = [
      'Y',      // Always yes
      'N',      // Always no  
      'YN',     // Mixed patterns
      'NY',
      'YYN',
      'NNY',
      'YNYN',
      'NYNY',
      'YYYYYY', // Long sequences
      'NNNNNN'
    ];
    
    for (const seq of testSequences) {
      if (seq.length <= maxDepth) {
        console.log(`\n🔍 Testing sequence: ${seq}`);
        try {
          const result = await this.testAnswerSequence(seq);
          patterns.set(seq, result.questionsAsked);
          console.log(`   Questions asked: ${result.questionsAsked.slice(0, 3).join(', ')}...`);
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    }
    
    return patterns;
  }

  /**
   * Strategy 2: Generate authentic believer candidates
   * Create plausible answer sequences based on cosmology characteristics
   */
  generateAuthenticCandidates(cosmologyName, numCandidates = 5) {
    const cosmology = this.cosmologiesData.find(c => c.Cosmology === cosmologyName);
    if (!cosmology) return [];
    
    const candidates = [];
    const category = cosmology.Category;
    
    // Base authentic strategy from my previous logic
    const baseAnswers = this.generateBaseAuthenticAnswers(cosmology);
    candidates.push(baseAnswers);
    
    // Generate variations by tweaking uncertain answers
    for (let i = 1; i < numCandidates; i++) {
      const variation = this.generateVariation(baseAnswers, cosmology, i);
      candidates.push(variation);
    }
    
    return candidates.map(answers => answers.join(''));
  }

  generateBaseAuthenticAnswers(cosmology) {
    // This uses the same logic as my authentic path finder
    // but focuses on the most likely questions to be asked first
    const likelyQuestions = [
      'Direct experience over doctrine',
      'One supreme being', 
      'Physical matter/energy as fundamental',
      'Reality as simulation/program',
      'Aliens intervened in human evolution',
      'Natural laws sufficient without intervention',
      'Practical results over theory',
      'Reality divided between spirit and matter',
      'Ancient monuments built by humans',
      'Consciousness fundamental to reality',
      'External world as mental manifestation',
      'All things possess consciousness'
    ];
    
    const answers = [];
    for (const questionKey of likelyQuestions) {
      if (questionKey in cosmology) {
        const relation = cosmology[questionKey];
        if (relation === 'R') {
          answers.push('Y');
        } else if (relation === 'DB') {
          answers.push('N');
        } else {
          // NR - use heuristics based on cosmology type
          answers.push(this.getHeuristicAnswer(questionKey, cosmology));
        }
      } else {
        answers.push('N'); // fallback
      }
    }
    
    return answers;
  }

  getHeuristicAnswer(questionKey, cosmology) {
    const category = cosmology.Category;
    const cosmologyName = cosmology.Cosmology;
    
    // Same heuristics as before
    if (category.includes('Creationism') || category.includes('Theism')) {
      if (questionKey.includes('aliens') || questionKey.includes('simulation')) return 'N';
      if (questionKey.includes('scientific consensus')) return 'N';
    }
    
    if (category.includes('Materialism') || category.includes('Naturalism')) {
      if (questionKey.includes('scientific consensus')) return 'Y';
      if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) return 'N';
    }
    
    if (category.includes('Consciousness') || category.includes('Idealism')) {
      if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) return 'Y';
      if (questionKey.includes('material') && questionKey.includes('fundamental')) return 'N';
    }
    
    return 'N'; // conservative default
  }

  generateVariation(baseAnswers, cosmology, variationIndex) {
    const variation = [...baseAnswers];
    
    // Introduce small variations for uncertain (NR) positions
    const numChanges = Math.min(2, Math.floor(variation.length / 4));
    
    for (let i = 0; i < numChanges; i++) {
      const index = (variationIndex * 3 + i * 2) % variation.length;
      // Only change answers that might be uncertain
      if (Math.random() > 0.5) {
        variation[index] = variation[index] === 'Y' ? 'N' : 'Y';
      }
    }
    
    return variation;
  }

  /**
   * Strategy 3: Batch test via permalink URLs
   * Test multiple answer sequences against the real running quiz
   */
  async batchTestCandidates(candidates, cosmologyName) {
    console.log(`\n🧪 BATCH TESTING ${candidates.length} CANDIDATES FOR: ${cosmologyName}`);
    console.log('-'.repeat(60));
    
    const results = [];
    
    for (let i = 0; i < candidates.length; i++) {
      const answerString = candidates[i];
      console.log(`\n📊 Testing candidate ${i + 1}: ${answerString.slice(0, 15)}...`);
      
      try {
        const result = await this.testAnswerSequence(answerString);
        results.push({
          answerString,
          cosmologyRank: this.findCosmologyRank(result.topResults, cosmologyName),
          cosmologyScore: this.findCosmologyScore(result.topResults, cosmologyName),
          questionsAsked: result.questionsAsked.length,
          topResult: result.topResults[0]
        });
        
        console.log(`   ${cosmologyName} rank: #${results[i].cosmologyRank}`);
        console.log(`   ${cosmologyName} score: ${results[i].cosmologyScore}`);
        console.log(`   Top result: ${result.topResults[0]?.name || 'Unknown'}`);
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        results.push({
          answerString,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Core method: Test an answer sequence against the real quiz
   */
  async testAnswerSequence(answerString) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}/results?answers=${answerString}`;
      const urlObj = new URL(url);
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET'
      };
      
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const req = protocol.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const results = this.parseResultsPage(data);
            resolve(results);
          } catch (error) {
            reject(new Error(`Failed to parse results: ${error.message}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  /**
   * Parse the HTML results page to extract cosmology rankings
   */
  parseResultsPage(html) {
    // Simple HTML parsing to extract results
    // This is a simplified parser - in practice might want to use a proper HTML parser
    
    const topResults = [];
    
    // Look for result patterns in the HTML
    // The exact pattern will depend on how the results page is structured
    const resultPattern = /<.*?>\s*(.+?)\s*<\/.*?>\s*\n.*?(\d+)\s*/g;
    
    let match;
    while ((match = resultPattern.exec(html)) !== null && topResults.length < 10) {
      const name = match[1].trim();
      const score = parseInt(match[2]);
      
      if (name && !isNaN(score)) {
        topResults.push({ name, score });
      }
    }
    
    // If simple parsing fails, look for JSON data in the page
    const jsonMatch = html.match(/window\.__NUXT__\s*=\s*({.+?})/);
    if (jsonMatch && topResults.length === 0) {
      try {
        const nuxtData = JSON.parse(jsonMatch[1]);
        // Extract results from Nuxt data structure
        // This will depend on the actual page structure
      } catch (e) {
        // Fallback parsing
      }
    }
    
    return {
      topResults,
      questionsAsked: [], // Would need to parse this from the page as well
      html: html.slice(0, 500) // Keep sample for debugging
    };
  }

  findCosmologyRank(results, cosmologyName) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].name === cosmologyName) {
        return i + 1;
      }
    }
    return 999; // Not found in top results
  }

  findCosmologyScore(results, cosmologyName) {
    const result = results.find(r => r.name === cosmologyName);
    return result ? result.score : 0;
  }

  /**
   * Strategy 4: Find best paths for all cosmologies
   */
  async findAllAuthenticPaths() {
    console.log('🎯 FINDING AUTHENTIC PATHS FOR ALL COSMOLOGIES');
    console.log('=' + '='.repeat(80));
    
    const allResults = {};
    
    for (const cosmology of this.cosmologiesData.slice(0, 5)) { // Start with first 5 for testing
      const cosmologyName = cosmology.Cosmology;
      console.log(`\n\n🔍 PROCESSING: ${cosmologyName}`);
      
      // Generate candidates
      const candidates = this.generateAuthenticCandidates(cosmologyName, 3);
      
      // Test candidates
      const testResults = await this.batchTestCandidates(candidates, cosmologyName);
      
      // Find best result
      const bestResult = testResults
        .filter(r => !r.error)
        .sort((a, b) => a.cosmologyRank - b.cosmologyRank)[0];
      
      allResults[cosmologyName] = {
        cosmologyName,
        category: cosmology.Category,
        bestRank: bestResult?.cosmologyRank || 999,
        bestScore: bestResult?.cosmologyScore || 0,
        bestAnswerString: bestResult?.answerString || '',
        allCandidates: testResults
      };
      
      console.log(`✅ Best rank for ${cosmologyName}: #${allResults[cosmologyName].bestRank}`);
    }
    
    return allResults;
  }
}

async function main() {
  const explorer = new RealEngineExplorer();
  
  if (process.argv[2] === 'map') {
    // Map question patterns
    const patterns = await explorer.mapQuestionPatterns();
    console.log('\n📋 QUESTION PATTERNS DISCOVERED:');
    for (const [seq, questions] of patterns) {
      console.log(`${seq}: ${questions.slice(0, 3).join(', ')}...`);
    }
    
  } else if (process.argv[2] === 'test') {
    // Test specific cosmology
    const cosmologyName = process.argv[3] || 'Analytical Idealism';
    const candidates = explorer.generateAuthenticCandidates(cosmologyName, 3);
    const results = await explorer.batchTestCandidates(candidates, cosmologyName);
    
    console.log(`\n📊 RESULTS FOR ${cosmologyName}:`);
    results.forEach((r, i) => {
      if (!r.error) {
        console.log(`Candidate ${i + 1}: Rank #${r.cosmologyRank}, Score ${r.cosmologyScore}`);
      }
    });
    
  } else {
    // Find all authentic paths  
    const allResults = await explorer.findAllAuthenticPaths();
    
    // Save results
    fs.writeFileSync('real_engine_paths.json', JSON.stringify(allResults, null, 2));
    console.log('\n💾 Results saved to real_engine_paths.json');
    
    // Summary
    console.log('\n📈 SUMMARY:');
    const rank1Count = Object.values(allResults).filter(r => r.bestRank === 1).length;
    console.log(`Cosmologies reaching rank #1: ${rank1Count}/${Object.keys(allResults).length}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}