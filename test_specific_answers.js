#!/usr/bin/env node
/**
 * Test Specific Answers
 * 
 * Test the specific answer sequence from the optimal path finder
 * to see what questions it gets and what results it produces.
 */

const fs = require('fs');

// Use the same mock setup as before
function createMockDataLoader(cosmologiesData, questionsData) {
  return {
    cosmologies: { value: cosmologiesData },
    questions: { value: questionsData },
    summaries: { value: {} },
    fullDescriptions: { value: {} },
    loadAllData: async () => true,
    getQuestionColumns: () => {
      return Object.keys(cosmologiesData[0]).filter(k => 
        !['Order', 'Category', 'Cosmology'].includes(k)
      );
    }
  };
}

function createMockQuestionScoring() {
  const CONFIG = {
    SCORE_ELIMINATE: -1000,
    SCORE_HEAVY_PENALTY: -100,
    CLEAR_WINNER_THRESHOLD: 5,
    DIMINISHING_RETURNS_THRESHOLD: 2,
    MINIMUM_QUESTIONS: 10,
    NOVELTY_BONUS: 1.5,
    CONSISTENCY_BONUS: 4.0,
    DRILL_DOWN_BONUS: 2.0,
    CONVICTION_PENALTY_FACTOR: 4,
    STRONG_STANCE_THRESHOLD: 2,
    UNYIELDING_STANCE_THRESHOLD: 3,
    CONCEPT_ELIMINATION_THRESHOLD: 3,
    CONCEPT_BOOST_FACTOR: 1.5,
    ENTROPY_WEIGHT: 0.3,
    PREDICTABLE_QUESTION_PENALTY: 0.1,
    MIN_PROBABILITY: 0.001,
    UNCERTAINTY_BONUS: 1.2,
    UNCERTAINTY_PENALTY: -2
  };

  return {
    scoreQuestion: (questionKey, question, activeCosmologies, convictionProfile, askedConcepts, dontKnowCount) => {
      const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length;
      const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length;
      const totalActive = activeCosmologies.length;
      
      if (totalActive === 0) {
        return {
          totalScore: 0, productScore: 0, entropyModifier: 0, uncertaintyBonus: 0,
          predictablePenalty: 0, pYes: 0, pNo: 0, yesEliminated, noEliminated,
          potentialEliminations: 0, bonuses: {}
        };
      }
      
      const pYes = Math.max(CONFIG.MIN_PROBABILITY, (totalActive - yesEliminated) / totalActive);
      const pNo = Math.max(CONFIG.MIN_PROBABILITY, (totalActive - noEliminated) / totalActive);
      
      const entropyYes = pYes > 0 ? -(pYes * Math.log2(pYes)) : 0;
      const entropyNo = pNo > 0 ? -(pNo * Math.log2(pNo)) : 0;
      const entropyModifier = CONFIG.ENTROPY_WEIGHT * (entropyYes + entropyNo);
      
      const productScore = yesEliminated * noEliminated;
      const potentialEliminations = Math.max(yesEliminated, noEliminated);
      const totalScore = productScore + entropyModifier;
      
      return {
        totalScore, productScore, entropyModifier, uncertaintyBonus: 0,
        predictablePenalty: 0, pYes, pNo, yesEliminated, noEliminated,
        potentialEliminations, bonuses: {}
      };
    },
    
    processAnswer: (questionKey, answer, cosmologies, scores) => {
      const newScores = [...scores];
      const eliminated = [];
      
      if (answer === 'Y' || answer === 'N') {
        cosmologies.forEach((cosmology, i) => {
          if (newScores[i] <= CONFIG.SCORE_ELIMINATE) return;
          
          const relation = cosmology[questionKey];
          
          if (answer === 'Y') {
            if (relation === 'DB') {
              newScores[i] = CONFIG.SCORE_ELIMINATE;
              eliminated.push(cosmology.Cosmology);
            } else if (relation === 'R') {
              newScores[i] += 10;
            } else if (relation === 'NR') {
              newScores[i] += 2;
            }
          } else if (answer === 'N') {
            if (relation === 'R') {
              newScores[i] = CONFIG.SCORE_ELIMINATE;
              eliminated.push(cosmology.Cosmology);
            } else if (relation === 'DB') {
              newScores[i] += 10;
            } else if (relation === 'NR') {
              newScores[i] += 2;
            }
          }
        });
      }
      
      return { eliminated, newScores };
    }
  };
}

// Global mock functions
global.useState = (key, initializer) => {
  if (!global._state) global._state = {};
  if (!(key in global._state)) {
    global._state[key] = typeof initializer === 'function' ? initializer() : initializer;
  }
  return { value: global._state[key] };
};

global.readonly = (ref) => ref;

async function testSpecificAnswers(answers, verbose = false) {
  // Load data files
  const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));
  
  // Setup mocks
  global._mockDataLoader = createMockDataLoader(cosmologiesData, questionsData);
  global._mockQuestionScoring = createMockQuestionScoring();
  
  if (verbose) {
    console.log(`🎯 TESTING SPECIFIC ANSWERS: ${answers.join('')}`);
    console.log('=' + '='.repeat(60));
  }
  
  const CONFIG = {
    SCORE_ELIMINATE: -1000,
    MINIMUM_QUESTIONS: 10,
    DIMINISHING_RETURNS_THRESHOLD: 2,
    CONCEPT_ELIMINATION_THRESHOLD: 3,
    CONCEPT_BOOST_FACTOR: 1.5
  };
  
  // Initialize quiz state
  const quizState = {
    scores: new Array(cosmologiesData.length).fill(0),
    askedQuestions: ['Order', 'Category', 'Cosmology'],
    sessionAnswers: [],
    convictionProfile: {},
    askedConcepts: new Set(),
    dontKnowCount: 0,
    questionNumber: 0,
    questionHistory: []
  };
  
  const questionsAsked = [];
  const questionScoring = global._mockQuestionScoring;
  
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    
    if (verbose) {
      console.log(`\n📍 QUESTION ${i + 1}: Will answer ${answer}`);
    }
    
    // Get active cosmologies
    const activeCosmologies = cosmologiesData.filter((_, idx) => 
      quizState.scores[idx] > CONFIG.SCORE_ELIMINATE
    );
    
    if (verbose) {
      console.log(`   Active cosmologies: ${activeCosmologies.length}`);
    }
    
    // Check stopping conditions
    if (activeCosmologies.length <= 1) {
      if (verbose) {
        console.log(`   🛑 STOPPING: Only ${activeCosmologies.length} cosmologies remaining`);
      }
      break;
    }
    
    if (quizState.questionNumber >= 30) {
      if (verbose) {
        console.log(`   🛑 STOPPING: Reached maximum questions (30)`);
      }
      break;
    }
    
    // Find potential questions
    const questionColumns = Object.keys(cosmologiesData[0]).filter(k => 
      !['Order', 'Category', 'Cosmology'].includes(k)
    );
    
    const potentialQuestions = questionColumns.filter(q => 
      !quizState.askedQuestions.includes(q) && q in questionsData
    );
    
    if (potentialQuestions.length === 0) {
      if (verbose) {
        console.log(`   🛑 STOPPING: No more potential questions`);
      }
      break;
    }
    
    // Filter to viable questions
    const viableQuestions = potentialQuestions.filter(questionKey => {
      const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length;
      const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length;
      
      // Skip questions involving concepts user has strongly rejected
      const question = questionsData[questionKey];
      if (question && question.concepts) {
        for (const concept of question.concepts) {
          const tag = concept.tag;
          if (tag in quizState.convictionProfile) {
            const conCount = quizState.convictionProfile[tag].con;
            if (conCount >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
              return false;
            }
          }
        }
      }
      
      return yesEliminated > 0 || noEliminated > 0;
    });
    
    if (viableQuestions.length === 0) {
      if (verbose) {
        console.log(`   🛑 STOPPING: No viable questions`);
      }
      break;
    }
    
    // Score questions and find best
    let bestQuestion = null;
    let bestScore = -1;
    let bestImpact = null;
    
    for (const questionKey of viableQuestions) {
      const question = questionsData[questionKey];
      if (!question) continue;
      
      const impact = questionScoring.scoreQuestion(
        questionKey, question, activeCosmologies,
        quizState.convictionProfile, quizState.askedConcepts, quizState.dontKnowCount
      );
      
      if (impact.totalScore > bestScore) {
        bestScore = impact.totalScore;
        bestQuestion = questionKey;
        bestImpact = impact;
      }
    }
    
    if (!bestQuestion) {
      if (verbose) {
        console.log(`   🛑 STOPPING: No scoreable questions`);
      }
      break;
    }
    
    questionsAsked.push(bestQuestion);
    quizState.askedQuestions.push(bestQuestion);
    
    if (verbose) {
      console.log(`   Question: "${bestQuestion}"`);
      console.log(`   Given answer: ${answer}`);
      console.log(`   Potential eliminations: ${bestImpact.potentialEliminations}`);
    }
    
    // Check diminishing returns AFTER finding question
    if (quizState.questionNumber > CONFIG.MINIMUM_QUESTIONS) {
      if (bestImpact.potentialEliminations !== undefined && 
          bestImpact.potentialEliminations <= CONFIG.DIMINISHING_RETURNS_THRESHOLD) {
        if (verbose) {
          console.log(`   🛑 STOPPING: Diminishing returns (eliminations: ${bestImpact.potentialEliminations} ≤ ${CONFIG.DIMINISHING_RETURNS_THRESHOLD})`);
        }
        break;
      }
    }
    
    // Process the given answer
    const { eliminated, newScores } = questionScoring.processAnswer(
      bestQuestion, answer, cosmologiesData, quizState.scores
    );
    
    quizState.scores = newScores;
    quizState.questionNumber++;
    
    // Update conviction profile (simplified)
    if (answer !== '?') {
      const question = questionsData[bestQuestion];
      if (question && question.concepts) {
        for (const concept of question.concepts) {
          const tag = concept.tag;
          const polarity = concept.polarity;
          
          if (!(tag in quizState.convictionProfile)) {
            quizState.convictionProfile[tag] = { pro: 0, con: 0 };
          }
          
          quizState.askedConcepts.add(tag);
          
          if (answer === 'Y') {
            quizState.convictionProfile[tag][polarity]++;
          } else if (answer === 'N') {
            const opposite = polarity === 'pro' ? 'con' : 'pro';
            quizState.convictionProfile[tag][opposite]++;
          }
        }
      }
    }
    
    // Update don't know count
    if (answer === '?') {
      quizState.dontKnowCount++;
    } else {
      quizState.dontKnowCount = 0;
    }
    
    if (verbose) {
      console.log(`   Eliminated: ${eliminated.length} cosmologies`);
      const remainingActive = quizState.scores.filter(s => s > CONFIG.SCORE_ELIMINATE).length;
      console.log(`   Active remaining: ${remainingActive}`);
      
      // Show Analytical Idealism rank
      const aiIndex = cosmologiesData.findIndex(c => c.Cosmology === 'Analytical Idealism');
      if (aiIndex !== -1) {
        const aiScore = quizState.scores[aiIndex];
        const rank = quizState.scores.filter(s => s > aiScore).length + 1;
        console.log(`   Analytical Idealism rank: #${rank} (score: ${aiScore})`);
      }
    }
  }
  
  // Generate final results
  const results = [];
  for (let i = 0; i < cosmologiesData.length; i++) {
    const cosmo = cosmologiesData[i];
    results.push({
      name: cosmo.Cosmology,
      category: cosmo.Category,
      score: quizState.scores[i]
    });
  }
  
  results.sort((a, b) => b.score - a.score);
  
  return {
    questionsAsked,
    answersGiven: answers.slice(0, quizState.questionNumber),
    totalQuestions: quizState.questionNumber,
    finalResults: results.slice(0, 10),
    allScores: quizState.scores
  };
}

async function main() {
  // Test the optimal path answer sequence
  const optimalAnswers = ['N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y'];
  
  console.log(`🔍 TESTING OPTIMAL PATH ANSWERS: ${optimalAnswers.join('')}`);
  console.log('=' + '='.repeat(80));
  
  try {
    const result = await testSpecificAnswers(optimalAnswers, true);
    
    console.log('\n' + '=' + '='.repeat(80));
    console.log(`🎯 RESULTS WITH OPTIMAL ANSWERS:`);
    console.log(`Questions processed: ${result.totalQuestions}`);
    console.log(`Questions asked: [${result.questionsAsked.map(q => `"${q}"`).join(', ')}]`);
    console.log(`Answers given: ${result.answersGiven.join('')}`);
    console.log(`\nTop 10 Results:`);
    for (let i = 0; i < Math.min(10, result.finalResults.length); i++) {
      const res = result.finalResults[i];
      const highlight = res.name === 'Analytical Idealism' ? ' ⭐' : '';
      console.log(`  ${i + 1}. ${res.name}: ${res.score}${highlight}`);
    }
    
  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
  }
}

if (require.main === module) {
  main();
}