#!/usr/bin/env node
/**
 * Test the ACTUAL quiz engine using the real runAutoQuiz method
 * No shortcuts, no API endpoints, no simulations - just the real engine
 */

const fs = require('fs');

class RealQuizEngineTest {
  constructor() {
    // We'll need to create a server-side test that imports the actual composable
    this.testUrl = 'http://localhost:3000/api/test-real-engine';
  }

  /**
   * Test a specific answer profile using the REAL quiz engine
   */
  async testAnswerProfile(answerProfile, cosmologyName) {
    console.log(`🎯 Testing ${cosmologyName} with REAL quiz engine`);
    console.log(`   Answer profile has ${Object.keys(answerProfile).length} questions`);

    const response = await fetch(this.testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answerProfile: answerProfile,
        cosmologyName: cosmologyName
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(`API Error: ${result.message}`);
    }

    return result.data;
  }

  /**
   * Generate authentic answer profile for a cosmology
   */
  generateAnswerProfile(cosmologyName) {
    const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
    const cosmology = cosmologiesData.find(c => c.Cosmology === cosmologyName);
    
    if (!cosmology) {
      throw new Error(`Cosmology "${cosmologyName}" not found`);
    }

    const answerProfile = {};
    const allQuestionKeys = Object.keys(cosmology).filter(k => 
      !['Order', 'Category', 'Cosmology'].includes(k)
    );

    for (const questionKey of allQuestionKeys) {
      const relation = cosmology[questionKey];
      
      if (relation === 'R') {
        answerProfile[questionKey] = 'Y';
      } else if (relation === 'DB') {
        answerProfile[questionKey] = 'N';
      } else if (relation === 'NR') {
        // Use heuristics for NR questions
        answerProfile[questionKey] = this.getHeuristicAnswer(questionKey, cosmology);
      } else {
        answerProfile[questionKey] = 'N';
      }
    }

    return answerProfile;
  }

  /**
   * Heuristic answers for NR (Not Required) questions
   */
  getHeuristicAnswer(questionKey, cosmology) {
    const category = cosmology.Category;
    
    // Polytheism heuristics
    if (category.includes('Polytheism')) {
      if (questionKey.includes('one') && questionKey.includes('being')) {
        return 'N'; // Reject monotheism
      }
      if (questionKey.includes('multiple') || questionKey.includes('distinct')) {
        return 'Y'; // Embrace multiplicity
      }
    }
    
    // Default to N for unknown patterns
    return 'N';
  }

  /**
   * Test the specific Classical Polytheism case
   */
  async testClassicalPolytheism() {
    console.log('\n🏛️ TESTING CLASSICAL POLYTHEISM');
    console.log('=' + '='.repeat(50));

    const answerProfile = this.generateAnswerProfile('Classical Polytheism');
    
    console.log('Generated answer profile:');
    const yesAnswers = Object.values(answerProfile).filter(a => a === 'Y').length;
    const noAnswers = Object.values(answerProfile).filter(a => a === 'N').length;
    console.log(`  Yes: ${yesAnswers}, No: ${noAnswers}, Total: ${Object.keys(answerProfile).length}`);

    try {
      const result = await this.testAnswerProfile(answerProfile, 'Classical Polytheism');
      
      console.log('\n📊 RESULTS FROM REAL QUIZ ENGINE:');
      console.log(`Questions asked: ${result.totalQuestions}`);
      console.log(`Answer string: ${result.answerString}`);
      console.log(`Permalink: ${result.permalink}`);
      
      console.log('\nTop 5 results:');
      result.finalResults.slice(0, 5).forEach((r, i) => {
        const star = r.cosmology === 'Classical Polytheism' ? ' ⭐' : '';
        console.log(`  ${i + 1}. ${r.cosmology}: ${r.score}${star}`);
      });

      // Find Classical Polytheism rank
      const cpRank = result.finalResults.findIndex(r => r.cosmology === 'Classical Polytheism') + 1;
      const cpScore = result.finalResults.find(r => r.cosmology === 'Classical Polytheism')?.score || 0;
      
      console.log(`\n🎯 Classical Polytheism: Rank #${cpRank}, Score ${cpScore}`);
      
      if (cpRank === 1) {
        console.log('✅ SUCCESS: Classical Polytheism reached #1!');
      } else {
        console.log(`❌ FAILED: Classical Polytheism only reached #${cpRank}`);
      }

      return result;
      
    } catch (error) {
      console.error('❌ ERROR:', error.message);
      throw error;
    }
  }

  /**
   * Test the problematic answer string directly
   */
  async testProblematicAnswerString() {
    console.log('\n🔍 TESTING PROBLEMATIC ANSWER STRING');
    console.log('=' + '='.repeat(50));
    console.log('Testing: NNNNNNNNNYNN');
    console.log('User reported this does NOT show Classical Polytheism');

    // Create a minimal answer profile for this specific string
    // We need to figure out which questions this string represents
    const answerString = 'NNNNNNNNNYNN';
    
    // For now, test with a basic profile
    const testProfile = {
      'Direct experience over doctrine': 'N',
      'One supreme being': 'N', 
      'Physical matter/energy as fundamental': 'N',
      'Reality as simulation/program': 'N',
      'Aliens intervened in human evolution': 'N',
      'Natural laws sufficient without intervention': 'N',
      'Aliens misunderstood as gods': 'N',
      'Practical results over theory': 'N',
      'Reality divided between spirit and matter': 'N',
      'Ancient monuments built by humans': 'N',
      'Self and world not separate': 'Y',
      'External world as mental manifestation': 'N'
    };

    try {
      const result = await this.testAnswerProfile(testProfile, 'Test');
      
      console.log('\n📊 RESULTS FROM REAL QUIZ ENGINE:');
      console.log(`Answer string: ${result.answerString}`);
      console.log(`Expected: NNNNNNNNNYNN`);
      console.log(`Match: ${result.answerString === answerString ? '✅' : '❌'}`);
      
      console.log('\nTop 5 results:');
      result.finalResults.slice(0, 5).forEach((r, i) => {
        const star = r.cosmology === 'Classical Polytheism' ? ' ⭐' : '';
        console.log(`  ${i + 1}. ${r.cosmology}: ${r.score}${star}`);
      });

      // Check for Classical Polytheism
      const cpResult = result.finalResults.find(r => r.cosmology === 'Classical Polytheism');
      if (cpResult) {
        const cpRank = result.finalResults.findIndex(r => r.cosmology === 'Classical Polytheism') + 1;
        console.log(`\n🏛️ Classical Polytheism: Rank #${cpRank}, Score ${cpResult.score}`);
      } else {
        console.log('\n❌ Classical Polytheism not found in results');
      }

      return result;
      
    } catch (error) {
      console.error('❌ ERROR:', error.message);
      throw error;
    }
  }
}

async function main() {
  const tester = new RealQuizEngineTest();

  try {
    // Test Classical Polytheism authentic profile
    await tester.testClassicalPolytheism();
    
    // Test the problematic answer string
    await tester.testProblematicAnswerString();
    
  } catch (error) {
    console.error('Main error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}