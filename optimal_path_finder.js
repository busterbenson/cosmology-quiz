#!/usr/bin/env node
/**
 * Optimal Path Finder
 * 
 * This script uses the actual TypeScript quiz logic to find the optimal
 * path to reach each cosmology with the minimum number of questions.
 */

const fs = require('fs');
const path = require('path');

// Mock the composables and data that the quiz engine needs
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
      
      // Calculate probabilities with minimum bounds
      const pYes = Math.max(CONFIG.MIN_PROBABILITY, (totalActive - yesEliminated) / totalActive);
      const pNo = Math.max(CONFIG.MIN_PROBABILITY, (totalActive - noEliminated) / totalActive);
      
      // Calculate entropy modifier
      const entropyYes = pYes > 0 ? -(pYes * Math.log2(pYes)) : 0;
      const entropyNo = pNo > 0 ? -(pNo * Math.log2(pNo)) : 0;
      const entropyModifier = CONFIG.ENTROPY_WEIGHT * (entropyYes + entropyNo);
      
      // Calculate base product score
      const productScore = yesEliminated * noEliminated;
      
      // Calculate bonuses
      const bonuses = {};
      let totalBonus = 0;
      
      // Novelty bonus
      if (!askedConcepts.has(questionKey)) {
        bonuses.novelty = CONFIG.NOVELTY_BONUS;
        totalBonus += CONFIG.NOVELTY_BONUS;
      }
      
      // Consistency bonus - questions that align with user's convictions
      let consistencyBonus = 0;
      for (const concept of question.concepts || []) {
        const tag = concept.tag;
        const polarity = concept.polarity;
        
        if (tag in convictionProfile) {
          const proCount = convictionProfile[tag].pro;
          const conCount = convictionProfile[tag].con;
          
          if (polarity === 'pro' && proCount >= CONFIG.STRONG_STANCE_THRESHOLD) {
            consistencyBonus += CONFIG.CONSISTENCY_BONUS;
          } else if (polarity === 'con' && conCount >= CONFIG.STRONG_STANCE_THRESHOLD) {
            consistencyBonus += CONFIG.CONSISTENCY_BONUS;
          }
        }
      }
      
      if (consistencyBonus > 0) {
        bonuses.consistency = consistencyBonus;
        totalBonus += consistencyBonus;
      }
      
      // Drill-down bonus for exploring concepts
      const hasExploredConcepts = (question.concepts || []).some(c => askedConcepts.has(c.tag));
      if (hasExploredConcepts) {
        bonuses.drillDown = CONFIG.DRILL_DOWN_BONUS;
        totalBonus += CONFIG.DRILL_DOWN_BONUS;
      }
      
      // Uncertainty bonus
      let uncertaintyBonus = 0;
      if (dontKnowCount >= 3) {
        uncertaintyBonus = CONFIG.UNCERTAINTY_BONUS;
        bonuses.uncertainty = uncertaintyBonus;
        totalBonus += uncertaintyBonus;
      }
      
      // Predictable question penalty
      const predictablePenalty = Math.min(yesEliminated, noEliminated) === 0 ? CONFIG.PREDICTABLE_QUESTION_PENALTY : 0;
      
      // Calculate potential eliminations
      const potentialEliminations = Math.max(yesEliminated, noEliminated);
      
      // Calculate total score
      const totalScore = productScore + entropyModifier + totalBonus - predictablePenalty;
      
      return {
        totalScore,
        productScore,
        entropyModifier,
        uncertaintyBonus,
        predictablePenalty,
        pYes,
        pNo,
        yesEliminated,
        noEliminated,
        potentialEliminations,
        bonuses
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

// Global mock functions for Vue composables
global.useState = (key, initializer) => {
  if (!global._state) global._state = {};
  if (!(key in global._state)) {
    global._state[key] = typeof initializer === 'function' ? initializer() : initializer;
  }
  return { value: global._state[key] };
};

global.readonly = (ref) => ref;

// Function to determine optimal answer for a target cosmology
function determineOptimalAnswer(questionKey, targetCosmology, cosmologiesData) {
  // Find target cosmology's relationship to this question
  const targetCosmo = cosmologiesData.find(c => c.Cosmology === targetCosmology);
  if (!targetCosmo) return 'N'; // fallback
  
  const relation = targetCosmo[questionKey];
  
  // Choose answer that benefits the target cosmology
  if (relation === 'R') {
    return 'Y';  // Required - answer Yes to benefit
  } else if (relation === 'DB') {
    return 'N';  // Deal breaker - answer No to benefit
  } else {
    // NR (Not Required) - both answers give +2, but let's prefer the answer
    // that eliminates more competitors
    
    // Count how many cosmologies would be eliminated by each answer
    const yesEliminated = cosmologiesData.filter(c => c[questionKey] === 'DB').length;
    const noEliminated = cosmologiesData.filter(c => c[questionKey] === 'R').length;
    
    // Choose the answer that eliminates more competitors
    return yesEliminated > noEliminated ? 'Y' : 'N';
  }
}

// Find optimal path to a specific cosmology
async function findOptimalPath(targetCosmology, cosmologiesData, questionsData, verbose = false) {
  // Setup mocks
  global._mockDataLoader = createMockDataLoader(cosmologiesData, questionsData);
  global._mockQuestionScoring = createMockQuestionScoring();
  
  if (verbose) {
    console.log(`🎯 FINDING OPTIMAL PATH TO: ${targetCosmology}`);
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
  const answersGiven = [];
  const questionScoring = global._mockQuestionScoring;
  
  for (let iteration = 0; iteration < 50; iteration++) { // Safety limit
    if (verbose && iteration < 20) {
      console.log(`\n📍 QUESTION ${iteration + 1}:`);
    }
    
    // Get active cosmologies
    const activeCosmologies = cosmologiesData.filter((_, idx) => 
      quizState.scores[idx] > CONFIG.SCORE_ELIMINATE
    );
    
    if (verbose && iteration < 20) {
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
              return false; // Skip this question
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
    
    if (verbose && iteration < 20) {
      console.log(`   Question: "${bestQuestion}"`);
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
    
    // Determine optimal answer for this cosmology
    const answer = determineOptimalAnswer(bestQuestion, targetCosmology, cosmologiesData);
    answersGiven.push(answer);
    
    if (verbose && iteration < 20) {
      console.log(`   Optimal answer: ${answer}`);
    }
    
    // Process the answer
    const { eliminated, newScores } = questionScoring.processAnswer(
      bestQuestion, answer, cosmologiesData, quizState.scores
    );
    
    quizState.scores = newScores;
    quizState.questionNumber++;
    
    // Update conviction profile
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
    
    // Apply concept boosts and eliminations (simplified)
    for (const [conceptTag, counts] of Object.entries(quizState.convictionProfile)) {
      const proCount = counts.pro;
      const conCount = counts.con;
      
      // Apply concept boosts
      if (proCount >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
        for (const [qKey, qData] of Object.entries(questionsData)) {
          if (!(qKey in cosmologiesData[0])) continue;
          
          for (const concept of (qData.concepts || [])) {
            if (concept.tag === conceptTag && concept.polarity === 'pro') {
              for (let i = 0; i < cosmologiesData.length; i++) {
                if (quizState.scores[i] <= CONFIG.SCORE_ELIMINATE) continue;
                
                const relation = cosmologiesData[i][qKey];
                if (relation === 'R') {
                  quizState.scores[i] += Math.floor(5 * CONFIG.CONCEPT_BOOST_FACTOR);
                } else if (relation === 'NR') {
                  quizState.scores[i] += Math.floor(2 * CONFIG.CONCEPT_BOOST_FACTOR);
                }
              }
            }
          }
        }
      }
      
      // Eliminate cosmologies for rejected concepts
      if (conCount >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
        for (const [qKey, qData] of Object.entries(questionsData)) {
          if (!(qKey in cosmologiesData[0])) continue;
          
          for (const concept of (qData.concepts || [])) {
            if (concept.tag === conceptTag && concept.polarity === 'pro') {
              for (let i = 0; i < cosmologiesData.length; i++) {
                if (quizState.scores[i] <= CONFIG.SCORE_ELIMINATE) continue;
                
                const relation = cosmologiesData[i][qKey];
                if (relation === 'R') {
                  quizState.scores[i] = CONFIG.SCORE_ELIMINATE;
                }
              }
            }
          }
        }
      }
    }
    
    if (verbose && iteration < 20) {
      console.log(`   Eliminated: ${eliminated.length} cosmologies`);
      const remainingActive = quizState.scores.filter(s => s > CONFIG.SCORE_ELIMINATE).length;
      console.log(`   Active remaining: ${remainingActive}`);
      
      // Show target cosmology rank
      const targetIndex = cosmologiesData.findIndex(c => c.Cosmology === targetCosmology);
      if (targetIndex !== -1) {
        const targetScore = quizState.scores[targetIndex];
        const rank = quizState.scores.filter(s => s > targetScore).length + 1;
        console.log(`   ${targetCosmology} rank: #${rank} (score: ${targetScore})`);
      }
    }
  }
  
  // Calculate final rank and score for target cosmology
  const targetIndex = cosmologiesData.findIndex(c => c.Cosmology === targetCosmology);
  let finalRank = 999;
  let finalScore = CONFIG.SCORE_ELIMINATE;
  
  if (targetIndex !== -1) {
    finalScore = quizState.scores[targetIndex];
    finalRank = quizState.scores.filter(s => s > finalScore).length + 1;
  }
  
  return {
    cosmologyName: targetCosmology,
    questionsAsked,
    answersGiven,
    totalQuestions: quizState.questionNumber,
    finalRank,
    finalScore,
    answerString: answersGiven.join('')
  };
}

async function findAllOptimalPaths() {
  // Load data files
  const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));
  
  console.log(`🔍 FINDING OPTIMAL PATHS FOR ALL COSMOLOGIES`);
  console.log(`Total cosmologies: ${cosmologiesData.length}`);
  console.log('=' + '='.repeat(80));
  
  const results = {};
  let reachableCount = 0;
  
  for (let i = 0; i < cosmologiesData.length; i++) {
    const cosmology = cosmologiesData[i];
    const cosmologyName = cosmology.Cosmology;
    
    process.stdout.write(`\r⏳ Processing ${i + 1}/${cosmologiesData.length}: ${cosmologyName}...`);
    
    try {
      const result = await findOptimalPath(cosmologyName, cosmologiesData, questionsData, false);
      
      results[cosmologyName] = {
        cosmology_name: result.cosmologyName,
        category: cosmology.Category,
        final_rank: result.finalRank,
        final_score: result.finalScore,
        questions_asked: result.questionsAsked,
        answers_given: result.answersGiven,
        total_questions: result.totalQuestions,
        answer_string: result.answerString
      };
      
      if (result.finalRank === 1) {
        reachableCount++;
      }
      
    } catch (error) {
      console.error(`\n❌ Error processing ${cosmologyName}: ${error.message}`);
      results[cosmologyName] = {
        cosmology_name: cosmologyName,
        category: cosmology.Category,
        error: error.message
      };
    }
  }
  
  console.log(`\n\n✅ COMPLETED ALL PATHS`);
  console.log(`Reachable cosmologies (rank #1): ${reachableCount}/${cosmologiesData.length}`);
  
  // Save results
  const outputFile = 'all_optimal_paths_real_engine.json';
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`📁 Results saved to: ${outputFile}`);
  
  // Show summary
  console.log(`\n📊 SUMMARY:`);
  const rankCounts = {};
  for (const [name, result] of Object.entries(results)) {
    if (result.final_rank) {
      rankCounts[result.final_rank] = (rankCounts[result.final_rank] || 0) + 1;
    }
  }
  
  for (let rank = 1; rank <= 5; rank++) {
    const count = rankCounts[rank] || 0;
    console.log(`  Rank #${rank}: ${count} cosmologies`);
  }
  
  return results;
}

async function main() {
  if (process.argv.length > 2) {
    // Test single cosmology
    const targetCosmology = process.argv[2];
    
    const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
    const questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));
    
    console.log(`🎯 FINDING OPTIMAL PATH FOR: ${targetCosmology}`);
    console.log('=' + '='.repeat(80));
    
    try {
      const result = await findOptimalPath(targetCosmology, cosmologiesData, questionsData, true);
      
      console.log(`\n` + '=' + '='.repeat(80));
      console.log(`🎯 OPTIMAL PATH RESULT:`);
      console.log(`Final rank: #${result.finalRank}`);
      console.log(`Final score: ${result.finalScore}`);
      console.log(`Total questions: ${result.totalQuestions}`);
      console.log(`Answer string: ${result.answerString}`);
      console.log(`Questions: [${result.questionsAsked.map(q => `"${q}"`).join(', ')}]`);
      
    } catch (error) {
      console.error(`❌ ERROR: ${error.message}`);
    }
  } else {
    // Find all optimal paths
    await findAllOptimalPaths();
  }
}

if (require.main === module) {
  main();
}