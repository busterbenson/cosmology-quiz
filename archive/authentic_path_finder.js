#!/usr/bin/env node
/**
 * Authentic Path Finder
 * 
 * This script finds paths where someone who truly believes in each cosmology
 * would authentically answer the questions. This creates realistic paths that
 * represent genuine adherents rather than gaming the system.
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

// Function to determine authentic answer for a true believer
function determineAuthenticAnswer(questionKey, targetCosmology, cosmologiesData, questionsData) {
  // Find target cosmology's relationship to this question
  const targetCosmo = cosmologiesData.find(c => c.Cosmology === targetCosmology);
  if (!targetCosmo) return 'N'; // fallback
  
  const relation = targetCosmo[questionKey];
  
  // For true believers:
  // - If it's Required (R), they would answer Yes with conviction
  // - If it's a Deal Breaker (DB), they would answer No with conviction  
  // - If it's Not Required (NR), they might answer based on their broader worldview
  
  if (relation === 'R') {
    return 'Y';  // True believers affirm what their cosmology requires
  } else if (relation === 'DB') {
    return 'N';  // True believers reject what's a deal breaker for their cosmology
  } else {
    // For NR (Not Required) - this is where it gets interesting
    // True believers might have nuanced views, but let's use some heuristics
    
    const question = questionsData[questionKey];
    if (!question) return 'N'; // fallback
    
    // Look at the question content and the cosmology's category/nature
    const cosmologyCategory = targetCosmo.Category;
    const cosmologyName = targetCosmo.Cosmology;
    
    // Some heuristics for authentic responses to NR questions:
    
    // Religious/theistic cosmologies tend to be more conservative on certain topics
    if (cosmologyCategory.includes('Creationism') || cosmologyCategory.includes('Theism')) {
      if (questionKey.includes('aliens') || questionKey.includes('simulation')) {
        return 'N'; // Religious believers often skeptical of alien/simulation theories
      }
      if (questionKey.includes('scientific consensus')) {
        return 'N'; // May reject mainstream science if it conflicts with beliefs
      }
    }
    
    // Scientific/materialist cosmologies tend to favor evidence-based views
    if (cosmologyCategory.includes('Materialism') || cosmologyCategory.includes('Naturalism')) {
      if (questionKey.includes('scientific consensus')) {
        return 'Y'; // Scientists trust scientific consensus
      }
      if (questionKey.includes('aliens') && questionKey.includes('ancient')) {
        return 'N'; // Scientists skeptical of ancient alien theories
      }
      if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
        return 'N'; // Materialists don't see consciousness as fundamental
      }
    }
    
    // Consciousness-first cosmologies
    if (cosmologyCategory.includes('Consciousness') || cosmologyCategory.includes('Idealism')) {
      if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
        return 'Y'; // They believe consciousness is fundamental
      }
      if (questionKey.includes('material') && questionKey.includes('fundamental')) {
        return 'N'; // They don't believe matter is fundamental
      }
    }
    
    // Mystical/spiritual cosmologies
    if (cosmologyCategory.includes('Mystical') || cosmologyCategory.includes('Spiritual')) {
      if (questionKey.includes('direct experience')) {
        return 'Y'; // Mystics value direct experience
      }
      if (questionKey.includes('doctrine')) {
        return 'N'; // Often prefer experience over doctrine
      }
    }
    
    // Alternative/conspiracy-adjacent cosmologies
    if (cosmologyCategory.includes('Alternative') || cosmologyName.includes('Flat Earth') || 
        cosmologyName.includes('Ancient') || cosmologyName.includes('Conspiracy')) {
      if (questionKey.includes('scientific consensus')) {
        return 'N'; // Skeptical of mainstream science
      }
      if (questionKey.includes('aliens')) {
        return 'Y'; // More open to alternative explanations
      }
    }
    
    // Simulation cosmologies
    if (cosmologyName.includes('Simulation')) {
      if (questionKey.includes('simulation') || questionKey.includes('program')) {
        return 'Y'; // Obviously they believe in simulation
      }
    }
    
    // Default for NR: slight lean toward 'N' (more conservative)
    // This represents the natural human tendency to be somewhat skeptical
    return 'N';
  }
}

// Find authentic path for a specific cosmology
async function findAuthenticPath(targetCosmology, cosmologiesData, questionsData, verbose = false) {
  // Setup mocks
  global._mockDataLoader = createMockDataLoader(cosmologiesData, questionsData);
  global._mockQuestionScoring = createMockQuestionScoring();
  
  if (verbose) {
    console.log(`🙏 FINDING AUTHENTIC PATH FOR: ${targetCosmology}`);
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
    
    // Determine authentic answer for this cosmology
    const answer = determineAuthenticAnswer(bestQuestion, targetCosmology, cosmologiesData, questionsData);
    answersGiven.push(answer);
    
    if (verbose && iteration < 20) {
      console.log(`   Authentic answer: ${answer}`);
      
      // Show reasoning for the answer
      const targetCosmo = cosmologiesData.find(c => c.Cosmology === targetCosmology);
      const relation = targetCosmo ? targetCosmo[bestQuestion] : '';
      if (relation === 'R') {
        console.log(`   Reasoning: Required (R) - true believer affirms`);
      } else if (relation === 'DB') {
        console.log(`   Reasoning: Deal Breaker (DB) - true believer rejects`);
      } else {
        console.log(`   Reasoning: Not Required (NR) - based on worldview heuristics`);
      }
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
    
    // Apply concept boosts and eliminations (simplified version)
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

async function findAllAuthenticPaths() {
  // Load data files
  const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));
  
  console.log(`🙏 FINDING AUTHENTIC BELIEVER PATHS FOR ALL COSMOLOGIES`);
  console.log(`Total cosmologies: ${cosmologiesData.length}`);
  console.log('=' + '='.repeat(80));
  
  const results = {};
  let rank1Count = 0;
  
  for (let i = 0; i < cosmologiesData.length; i++) {
    const cosmology = cosmologiesData[i];
    const cosmologyName = cosmology.Cosmology;
    
    process.stdout.write(`\r⏳ Processing ${i + 1}/${cosmologiesData.length}: ${cosmologyName}...`);
    
    try {
      const result = await findAuthenticPath(cosmologyName, cosmologiesData, questionsData, false);
      
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
        rank1Count++;
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
  
  console.log(`\n\n✅ COMPLETED ALL AUTHENTIC PATHS`);
  console.log(`Cosmologies reaching rank #1: ${rank1Count}/${cosmologiesData.length}`);
  
  // Save results
  const outputFile = 'all_authentic_paths.json';
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
    
    console.log(`🙏 FINDING AUTHENTIC PATH FOR: ${targetCosmology}`);
    console.log('=' + '='.repeat(80));
    
    try {
      const result = await findAuthenticPath(targetCosmology, cosmologiesData, questionsData, true);
      
      console.log(`\n` + '=' + '='.repeat(80));
      console.log(`🙏 AUTHENTIC BELIEVER PATH RESULT:`);
      console.log(`Final rank: #${result.finalRank}`);
      console.log(`Final score: ${result.finalScore}`);
      console.log(`Total questions: ${result.totalQuestions}`);
      console.log(`Answer string: ${result.answerString}`);
      console.log(`Questions: [${result.questionsAsked.map(q => `"${q}"`).join(', ')}]`);
      
    } catch (error) {
      console.error(`❌ ERROR: ${error.message}`);
    }
  } else {
    // Find all authentic paths
    await findAllAuthenticPaths();
  }
}

if (require.main === module) {
  main();
}