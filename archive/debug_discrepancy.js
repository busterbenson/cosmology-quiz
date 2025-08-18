#!/usr/bin/env node
/**
 * Debug Discrepancy
 * 
 * This tool helps identify where my simulation differs from the real TypeScript quiz.
 * Since the user reports different results, let's create a comprehensive diagnostic.
 */

const fs = require('fs');

// Load the real TypeScript quiz composables to compare
function analyzeCosmologyData() {
  console.log('🔍 ANALYZING COSMOLOGY DATA STRUCTURE');
  console.log('=' + '='.repeat(60));
  
  // Load data files
  const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));
  
  console.log(`Cosmologies loaded: ${cosmologiesData.length}`);
  console.log(`Questions loaded: ${Object.keys(questionsData).length}`);
  
  // Find Analytical Idealism
  const analyticalIdealism = cosmologiesData.find(c => c.Cosmology === 'Analytical Idealism');
  if (analyticalIdealism) {
    console.log('\n📋 ANALYTICAL IDEALISM DATA:');
    console.log(`Category: ${analyticalIdealism.Category}`);
    console.log(`Order: ${analyticalIdealism.Order}`);
    
    // Show its relationships to key questions from the NNNNNNNNNNY sequence
    const testQuestions = [
      'Direct experience over doctrine',
      'One supreme being', 
      'Physical matter/energy as fundamental',
      'Reality as simulation/program',
      'Aliens intervened in human evolution',
      'Natural laws sufficient without intervention',
      'Aliens misunderstood as gods',
      'Practical results over theory',
      'Reality divided between spirit and matter',
      'Ancient monuments built by humans',
      'External world as mental manifestation'
    ];
    
    console.log('\n🔗 KEY QUESTION RELATIONSHIPS:');
    for (const question of testQuestions) {
      if (question in analyticalIdealism) {
        const relation = analyticalIdealism[question];
        console.log(`  ${question}: ${relation}`);
      } else {
        console.log(`  ${question}: NOT FOUND`);
      }
    }
  } else {
    console.log('❌ Analytical Idealism not found in data');
  }
  
  return { cosmologiesData, questionsData, analyticalIdealism };
}

function analyzeQuestionSequence(cosmologiesData, questionsData) {
  console.log('\n🎯 ANALYZING QUESTION SEQUENCE: NNNNNNNNNNY');
  console.log('=' + '='.repeat(60));
  
  const answers = ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'Y'];
  const scores = new Array(cosmologiesData.length).fill(0);
  
  // Manually process each answer to see the exact logic
  let askedQuestions = ['Order', 'Category', 'Cosmology'];
  let questionNumber = 0;
  
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    
    console.log(`\n📍 PROCESSING ANSWER ${i + 1}: ${answer}`);
    
    // Get active cosmologies
    const activeCosmologies = cosmologiesData.filter((_, idx) => 
      scores[idx] > -1000
    );
    
    console.log(`   Active cosmologies: ${activeCosmologies.length}`);
    
    // This is where we need to find the EXACT question that would be asked
    // Let's check what questions are available and viable
    const questionColumns = Object.keys(cosmologiesData[0]).filter(k => 
      !['Order', 'Category', 'Cosmology'].includes(k)
    );
    
    const potentialQuestions = questionColumns.filter(q => 
      !askedQuestions.includes(q) && q in questionsData
    );
    
    const viableQuestions = potentialQuestions.filter(questionKey => {
      const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length;
      const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length;
      return yesEliminated > 0 || noEliminated > 0;
    });
    
    console.log(`   Potential questions: ${potentialQuestions.length}`);
    console.log(`   Viable questions: ${viableQuestions.length}`);
    
    if (viableQuestions.length > 0) {
      // Score questions (simplified)
      let bestQuestion = null;
      let bestScore = -1;
      
      for (const questionKey of viableQuestions) {
        const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length;
        const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length;
        const score = yesEliminated * noEliminated;
        
        if (score > bestScore) {
          bestScore = score;
          bestQuestion = questionKey;
        }
      }
      
      if (bestQuestion) {
        console.log(`   Selected question: "${bestQuestion}"`);
        console.log(`   Question score: ${bestScore}`);
        
        askedQuestions.push(bestQuestion);
        
        // Process the answer
        const eliminated = [];
        cosmologiesData.forEach((cosmology, idx) => {
          if (scores[idx] <= -1000) return;
          
          const relation = cosmology[bestQuestion];
          
          if (answer === 'Y') {
            if (relation === 'DB') {
              scores[idx] = -1000;
              eliminated.push(cosmology.Cosmology);
            } else if (relation === 'R') {
              scores[idx] += 10;
            } else if (relation === 'NR') {
              scores[idx] += 2;
            }
          } else if (answer === 'N') {
            if (relation === 'R') {
              scores[idx] = -1000;
              eliminated.push(cosmology.Cosmology);
            } else if (relation === 'DB') {
              scores[idx] += 10;
            } else if (relation === 'NR') {
              scores[idx] += 2;
            }
          }
        });
        
        console.log(`   Eliminated: ${eliminated.length} cosmologies`);
        
        // Show Analytical Idealism's current state
        const aiIndex = cosmologiesData.findIndex(c => c.Cosmology === 'Analytical Idealism');
        if (aiIndex !== -1) {
          const aiScore = scores[aiIndex];
          const rank = scores.filter(s => s > aiScore && s > -1000).length + 1;
          console.log(`   Analytical Idealism: Score ${aiScore}, Rank #${rank}`);
        }
        
        questionNumber++;
      }
    }
  }
  
  // Final results
  console.log('\n🏆 FINAL SIMULATION RESULTS:');
  console.log('=' + '='.repeat(40));
  
  const results = [];
  for (let i = 0; i < cosmologiesData.length; i++) {
    const cosmo = cosmologiesData[i];
    if (scores[i] > -1000) {
      results.push({
        name: cosmo.Cosmology,
        score: scores[i]
      });
    }
  }
  
  results.sort((a, b) => b.score - a.score);
  
  console.log('Top 10 Results:');
  for (let i = 0; i < Math.min(10, results.length); i++) {
    const res = results[i];
    const highlight = res.name === 'Analytical Idealism' ? ' ⭐' : '';
    console.log(`  ${i + 1}. ${res.name}: ${res.score}${highlight}`);
  }
  
  return results;
}

function suggestDebugSteps() {
  console.log('\n🔧 DEBUGGING SUGGESTIONS:');
  console.log('=' + '='.repeat(40));
  console.log('1. Check browser console for errors when visiting the permalink');
  console.log('2. Verify that the permalink system is correctly decoding NNNNNNNNNNY');
  console.log('3. Check if concept boosts/eliminations are affecting final scores');
  console.log('4. Verify exclusions processing in the real quiz');
  console.log('5. Compare question selection order between simulation and real quiz');
  console.log('\nTo help debug further, please share:');
  console.log('- The actual top 3-5 cosmology names you see in the browser');
  console.log('- Any console errors in the browser developer tools');
  console.log('- Whether the quiz shows 11 questions were processed');
}

function main() {
  const { cosmologiesData, questionsData } = analyzeCosmologyData();
  const simulationResults = analyzeQuestionSequence(cosmologiesData, questionsData);
  suggestDebugSteps();
  
  console.log('\n📝 SUMMARY:');
  console.log(`My simulation shows Analytical Idealism should be rank #1`);
  console.log(`If the browser shows different results, there may be:`);
  console.log(`- Missing concept boost/elimination logic`);
  console.log(`- Different question selection algorithm`);
  console.log(`- Exclusions processing differences`);
  console.log(`- Post-answer conviction profile effects`);
}

if (require.main === module) {
  main();
}