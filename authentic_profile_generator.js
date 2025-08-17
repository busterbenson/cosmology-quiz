#!/usr/bin/env node
/**
 * Authentic Profile Generator
 * 
 * This tool generates complete answer profiles for each cosmology based on
 * authentic believer logic, then tests them against the real quiz engine
 * via the new auto-quiz API endpoint.
 */

const fs = require('fs');
const http = require('http');

class AuthenticProfileGenerator {
  constructor() {
    this.cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
    this.questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));
    this.allQuestionKeys = Object.keys(this.cosmologiesData[0]).filter(k => 
      !['Order', 'Category', 'Cosmology'].includes(k)
    );
  }

  /**
   * Generate a complete answer profile for a cosmology
   * This provides answers to ALL possible questions, not just the ones that might be asked
   */
  generateAuthenticProfile(cosmologyName) {
    const cosmology = this.cosmologiesData.find(c => c.Cosmology === cosmologyName);
    if (!cosmology) {
      throw new Error(`Cosmology "${cosmologyName}" not found`);
    }

    console.log(`🙏 Generating authentic profile for: ${cosmologyName}`);
    console.log(`   Category: ${cosmology.Category}`);

    const answerProfile = {};

    // Answer all questions based on authentic believer logic
    for (const questionKey of this.allQuestionKeys) {
      if (questionKey in cosmology) {
        const relation = cosmology[questionKey];
        
        if (relation === 'R') {
          // Required - true believer would definitely answer Yes
          answerProfile[questionKey] = 'Y';
        } else if (relation === 'DB') {
          // Deal Breaker - true believer would definitely answer No
          answerProfile[questionKey] = 'N';
        } else if (relation === 'NR') {
          // Not Required - use worldview heuristics
          answerProfile[questionKey] = this.getHeuristicAnswer(questionKey, cosmology);
        } else {
          // Unknown relation - fallback
          answerProfile[questionKey] = 'N';
        }
      } else {
        // Question not applicable to this cosmology
        answerProfile[questionKey] = 'N';
      }
    }

    console.log(`   Generated answers for ${Object.keys(answerProfile).length} questions`);
    console.log(`   Sample answers: R=${Object.values(answerProfile).filter(a => a === 'Y').length}, DB=${Object.values(answerProfile).filter(a => a === 'N').length}`);

    return answerProfile;
  }

  /**
   * Apply worldview heuristics for NR (Not Required) questions
   */
  getHeuristicAnswer(questionKey, cosmology) {
    const category = cosmology.Category;
    const cosmologyName = cosmology.Cosmology;
    
    // Religious/traditional cosmologies
    if (category.includes('Creationism') || category.includes('Theism') || 
        category.includes('Biblical') || category.includes('Traditional')) {
      
      if (questionKey.includes('aliens') || questionKey.includes('simulation')) {
        return 'N'; // Religious believers often skeptical of alien/simulation theories
      }
      if (questionKey.includes('scientific consensus') || questionKey.includes('evolution')) {
        return 'N'; // May reject mainstream science if it conflicts with beliefs
      }
      if (questionKey.includes('direct experience') && questionKey.includes('doctrine')) {
        return 'N'; // Traditional believers often prefer doctrine over personal experience
      }
      if (questionKey.includes('one') && questionKey.includes('being')) {
        return 'Y'; // Monotheistic tendency
      }
    }
    
    // Scientific/materialist cosmologies  
    if (category.includes('Materialism') || category.includes('Naturalism') || 
        category.includes('Scientific') || category.includes('Physics')) {
      
      if (questionKey.includes('scientific consensus')) {
        return 'Y'; // Scientists trust scientific consensus
      }
      if (questionKey.includes('aliens') && questionKey.includes('ancient')) {
        return 'N'; // Scientists skeptical of ancient alien theories
      }
      if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
        return 'N'; // Materialists don't see consciousness as fundamental
      }
      if (questionKey.includes('material') && questionKey.includes('fundamental')) {
        return 'Y'; // Materialists believe matter is fundamental
      }
      if (questionKey.includes('natural laws')) {
        return 'Y'; // Trust in natural laws
      }
    }
    
    // Consciousness-first cosmologies
    if (category.includes('Consciousness') || category.includes('Idealism') || 
        category.includes('Mind') || cosmologyName.includes('Consciousness')) {
      
      if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
        return 'Y'; // They believe consciousness is fundamental
      }
      if (questionKey.includes('material') && questionKey.includes('fundamental')) {
        return 'N'; // They don't believe matter is fundamental
      }
      if (questionKey.includes('external world') && questionKey.includes('mental')) {
        return 'Y'; // Idealists see external world as mental
      }
      if (questionKey.includes('reality') && (questionKey.includes('mental') || questionKey.includes('mind'))) {
        return 'Y'; // Mind-centric view of reality
      }
    }
    
    // Mystical/spiritual cosmologies
    if (category.includes('Mystical') || category.includes('Spiritual') || 
        category.includes('Buddhism') || category.includes('Zen') || 
        category.includes('Non-Dual')) {
      
      if (questionKey.includes('direct experience')) {
        return 'Y'; // Mystics value direct experience
      }
      if (questionKey.includes('doctrine') || questionKey.includes('theory')) {
        return 'N'; // Often prefer experience over doctrine/theory
      }
      if (questionKey.includes('self') && questionKey.includes('ultimate')) {
        return 'Y'; // Non-dual traditions see self as ultimate reality
      }
      if (questionKey.includes('diversity') && questionKey.includes('illusory')) {
        return 'Y'; // Many mystical traditions see diversity as illusory
      }
    }
    
    // Alternative/conspiracy-adjacent cosmologies
    if (category.includes('Alternative') || cosmologyName.includes('Flat Earth') || 
        cosmologyName.includes('Ancient') || cosmologyName.includes('Conspiracy') ||
        cosmologyName.includes('Hidden')) {
      
      if (questionKey.includes('scientific consensus')) {
        return 'N'; // Skeptical of mainstream science
      }
      if (questionKey.includes('aliens')) {
        return 'Y'; // More open to alternative explanations
      }
      if (questionKey.includes('ancient') && questionKey.includes('human')) {
        return 'N'; // Believe ancients had help/weren't just human
      }
      if (questionKey.includes('openness') && questionKey.includes('alternative')) {
        return 'Y'; // Open to alternative explanations
      }
    }
    
    // Simulation cosmologies
    if (cosmologyName.includes('Simulation') || cosmologyName.includes('Matrix') ||
        cosmologyName.includes('Computational') || cosmologyName.includes('Digital')) {
      
      if (questionKey.includes('simulation') || questionKey.includes('program')) {
        return 'Y'; // Obviously they believe in simulation
      }
      if (questionKey.includes('computation') || questionKey.includes('digital')) {
        return 'Y'; // Computational view of reality
      }
    }
    
    // Polytheistic cosmologies
    if (category.includes('Polytheism') || cosmologyName.includes('Polytheism')) {
      if (questionKey.includes('one') && questionKey.includes('being')) {
        return 'N'; // Reject monotheism
      }
      if (questionKey.includes('multiple') || questionKey.includes('many')) {
        return 'Y'; // Embrace multiplicity
      }
    }
    
    // Jain cosmologies (based on the real quiz results we saw)
    if (category.includes('Jain') || cosmologyName.includes('Jain')) {
      if (questionKey.includes('many') || questionKey.includes('multiple') || questionKey.includes('sided')) {
        return 'Y'; // Jain philosophy embraces multiple perspectives
      }
      if (questionKey.includes('eternal') || questionKey.includes('endless')) {
        return 'Y'; // Jain cosmology is eternal
      }
      if (questionKey.includes('violence') || questionKey.includes('harm')) {
        return 'N'; // Jain non-violence (ahimsa)
      }
    }
    
    // Default for NR: slight lean toward 'N' (more conservative)
    // This represents the natural human tendency to be somewhat skeptical
    return 'N';
  }

  /**
   * Test a complete answer profile against the real quiz engine
   */
  async testProfile(cosmologyName, answerProfile) {
    console.log(`\n🧪 Testing profile for ${cosmologyName} via auto-quiz API...`);

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        answerProfile: answerProfile
      });

      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auto-quiz',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.success) {
              const quizResult = result.data;
              const cosmologyRank = this.findCosmologyRank(quizResult.finalResults, cosmologyName);
              const cosmologyScore = this.findCosmologyScore(quizResult.finalResults, cosmologyName);

              console.log(`   ✅ Results: Rank #${cosmologyRank}, Score ${cosmologyScore}`);
              console.log(`   📝 Answer string: ${quizResult.answerString}`);
              console.log(`   🔗 Permalink: ${quizResult.permalink}`);
              console.log(`   🏆 Top result: ${quizResult.finalResults[0]?.cosmology || 'Unknown'}`);

              resolve({
                cosmologyName,
                rank: cosmologyRank,
                score: cosmologyScore,
                answerString: quizResult.answerString,
                permalink: quizResult.permalink,
                questionsAsked: quizResult.questionsAsked,
                totalQuestions: quizResult.totalQuestions,
                topResults: quizResult.finalResults.slice(0, 5)
              });
            } else {
              reject(new Error(`API error: ${result.message || 'Unknown error'}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  findCosmologyRank(results, cosmologyName) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].cosmology === cosmologyName) {
        return i + 1;
      }
    }
    return 999; // Not found in results
  }

  findCosmologyScore(results, cosmologyName) {
    const result = results.find(r => r.cosmology === cosmologyName);
    return result ? result.score : 0;
  }

  /**
   * Generate and test authentic profiles for all cosmologies
   */
  async generateAllAuthenticProfiles() {
    console.log('🎯 GENERATING AUTHENTIC PROFILES FOR ALL COSMOLOGIES');
    console.log(`Total cosmologies: ${this.cosmologiesData.length}`);
    console.log('=' + '='.repeat(80));

    const allResults = {};
    let successCount = 0;
    let rank1Count = 0;

    // Test a subset first to validate the approach
    const testCosmologies = this.cosmologiesData.slice(0, 10); // Start with first 10

    for (let i = 0; i < testCosmologies.length; i++) {
      const cosmology = testCosmologies[i];
      const cosmologyName = cosmology.Cosmology;

      console.log(`\n📋 [${i + 1}/${testCosmologies.length}] Processing: ${cosmologyName}`);

      try {
        // Generate authentic profile
        const answerProfile = this.generateAuthenticProfile(cosmologyName);

        // Test against real engine
        const result = await this.testProfile(cosmologyName, answerProfile);

        allResults[cosmologyName] = result;
        successCount++;

        if (result.rank === 1) {
          rank1Count++;
          console.log(`   🌟 SUCCESS: ${cosmologyName} reached rank #1!`);
        } else if (result.rank <= 3) {
          console.log(`   ⭐ GOOD: ${cosmologyName} reached rank #${result.rank}`);
        } else {
          console.log(`   📊 OK: ${cosmologyName} reached rank #${result.rank}`);
        }

      } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        allResults[cosmologyName] = {
          cosmologyName,
          error: error.message
        };
      }
    }

    // Save results
    const outputFile = 'authentic_profiles_results.json';
    fs.writeFileSync(outputFile, JSON.stringify(allResults, null, 2));

    console.log('\n' + '=' + '='.repeat(80));
    console.log('📊 SUMMARY:');
    console.log(`Cosmologies processed: ${successCount}/${testCosmologies.length}`);
    console.log(`Rank #1 achieved: ${rank1Count}/${successCount}`);
    console.log(`Results saved to: ${outputFile}`);

    // Show top performers
    const successful = Object.values(allResults).filter(r => !r.error && r.rank);
    successful.sort((a, b) => a.rank - b.rank);

    console.log('\n🏆 TOP PERFORMERS:');
    successful.slice(0, 5).forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.cosmologyName}: Rank #${result.rank} (Score ${result.score})`);
    });

    return allResults;
  }
}

async function main() {
  const generator = new AuthenticProfileGenerator();

  if (process.argv[2] === 'test') {
    // Test single cosmology
    const cosmologyName = process.argv[3] || 'Analytical Idealism';
    console.log(`🔍 Testing single cosmology: ${cosmologyName}`);

    try {
      const answerProfile = generator.generateAuthenticProfile(cosmologyName);
      const result = await generator.testProfile(cosmologyName, answerProfile);

      console.log('\n📊 DETAILED RESULTS:');
      console.log(`Cosmology: ${result.cosmologyName}`);
      console.log(`Final Rank: #${result.rank}`);
      console.log(`Final Score: ${result.score}`);
      console.log(`Questions Asked: ${result.totalQuestions}`);
      console.log(`Answer String: ${result.answerString}`);
      console.log(`Permalink: ${result.permalink}`);
      console.log('\nTop 5 Results:');
      result.topResults.forEach((r, i) => {
        const highlight = r.cosmology === cosmologyName ? ' ⭐' : '';
        console.log(`  ${i + 1}. ${r.cosmology}: ${r.score}${highlight}`);
      });

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }

  } else {
    // Generate all authentic profiles
    await generator.generateAllAuthenticProfiles();
  }
}

if (require.main === module) {
  main().catch(console.error);
}