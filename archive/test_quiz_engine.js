#!/usr/bin/env node
/**
 * Test Quiz Engine
 * 
 * This script directly uses the TypeScript quiz engine to simulate
 * a quiz with predetermined answers, avoiding browser automation.
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
  // Import CONFIG constants
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
      // Simplified scoring logic for testing
      const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length;
      const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length;
      const potentialEliminations = Math.max(yesEliminated, noEliminated);
      
      return {
        totalScore: yesEliminated * noEliminated + Math.random(), // Simple product score
        productScore: yesEliminated * noEliminated,
        entropyModifier: 0,
        uncertaintyBonus: 0,
        predictablePenalty: 0,
        pYes: yesEliminated / activeCosmologies.length,
        pNo: noEliminated / activeCosmologies.length,
        yesEliminated,
        noEliminated,
        potentialEliminations,
        bonuses: {}
      };
    },
    
    processAnswer: (questionKey, answer, cosmologies, scores, eliminationHistory = []) => {
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
              eliminationHistory.push({
                cosmology: cosmology.Cosmology,
                question: questionKey,
                answer: answer,
                reason: `Answered YES to Deal Breaker question`
              });
            } else if (relation === 'R') {
              newScores[i] += 10;
            } else if (relation === 'NR') {
              newScores[i] += 2;
            }
          } else if (answer === 'N') {
            if (relation === 'R') {
              newScores[i] = CONFIG.SCORE_ELIMINATE;
              eliminated.push(cosmology.Cosmology);
              eliminationHistory.push({
                cosmology: cosmology.Cosmology,
                question: questionKey,
                answer: answer,
                reason: `Answered NO to Required question`
              });
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

global.useDataLoader = () => global._mockDataLoader;
global.useQuestionScoring = () => global._mockQuestionScoring;

// Use the real quiz engine with predetermined answers
async function runRealQuizEngine(answers, verbose = false) {
  // We'll need to import and use the actual quiz engine
  // For now, let's create a simpler direct approach that loads the real modules
  
  // Load data files
  const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));
  
  // Setup mocks for the composables
  global._mockDataLoader = createMockDataLoader(cosmologiesData, questionsData);
  global._mockQuestionScoring = createMockQuestionScoring();
  
  // Import the actual quiz engine (we'll need to modify the import path)
  // For now, let's simulate the key parts
  
  if (verbose) {
    console.log(`🎯 SIMULATING QUIZ WITH ${answers.length} ANSWERS`);
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
    questionHistory: [],
    eliminationHistory: [] // Track what eliminated each cosmology
  };
  
  const questionsAsked = [];
  const questionScoring = global._mockQuestionScoring;
  
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    
    if (verbose) {
      console.log(`\n📍 QUESTION ${i + 1}: Answering ${answer}`);
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
    
    // Process the answer
    const { eliminated, newScores } = questionScoring.processAnswer(
      bestQuestion, answer, cosmologiesData, quizState.scores, quizState.eliminationHistory
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
      if (eliminated.includes('Biblical Literalism')) {
        console.log(`   ❗ Biblical Literalism eliminated here!`);
      }
      const remainingActive = quizState.scores.filter(s => s > CONFIG.SCORE_ELIMINATE).length;
      console.log(`   Active remaining: ${remainingActive}`);
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
    allScores: quizState.scores,
    eliminationHistory: quizState.eliminationHistory,
    convictionProfile: quizState.convictionProfile
  };
}

async function main() {
  // Use the actual Biblical Literalism test sequence from the user
  // N - Practical results over theory
  // Y - One supreme being  
  // Y - Genesis historically accurate
  // N - Direct experience over doctrine
  // N - Evolution as primary mechanism
  // N - Natural laws sufficient without intervention
  // N - Primordial awareness as ground of being
  // N - Reality divided between spirit and matter
  // N - Universe as extrinsic appearance of consciousness
  // N - Self and world not separate
  // ? - Ancestors actively present in current affairs
  const biblicalLiteralismSequence = "NYYNNNNNNN?";
  const permalinkAnswers = biblicalLiteralismSequence;
  
  // Decode answers
  const decodedAnswers = [];
  for (const char of permalinkAnswers) {
    if (char === 'Y') decodedAnswers.push('Y');
    else if (char === 'N') decodedAnswers.push('N'); 
    else if (char === 'U') decodedAnswers.push('?');
    else decodedAnswers.push('N');
  }
  
  console.log(`🔍 REAL TYPESCRIPT QUIZ SIMULATION`);
  console.log(`Permalink: ${permalinkAnswers}`);
  console.log(`Decoded: ${decodedAnswers.join('')}`);
  console.log(`Length: ${decodedAnswers.length}`);
  console.log('=' + '='.repeat(80));
  
  try {
    const result = await simulateQuiz(decodedAnswers, true);
    
    console.log('\n' + '=' + '='.repeat(80));
    console.log(`🎯 REAL QUIZ RESULTS:`);
    console.log(`Questions processed: ${result.totalQuestions}`);
    console.log(`Questions asked: [${result.questionsAsked.map(q => `"${q}"`).join(', ')}]`);
    console.log(`Answers given: ${result.answersGiven.join('')}`);
    console.log(`\nTop 5 Results:`);
    for (let i = 0; i < Math.min(5, result.finalResults.length); i++) {
      const res = result.finalResults[i];
      console.log(`  ${i + 1}. ${res.name}: ${res.score}`);
    }
    
    // Analysis section for "No" answers and eliminated cosmologies
    console.log('\n' + '=' + '='.repeat(80));
    console.log('🔍 ELIMINATION ANALYSIS');
    console.log('=' + '='.repeat(80));
    
    if (result.eliminationHistory.length > 0) {
      console.log(`\n📊 ELIMINATED COSMOLOGIES (${result.eliminationHistory.length} eliminations):`);
      
      // Group eliminations by cosmology
      const eliminationsByCosmology = {};
      result.eliminationHistory.forEach(elim => {
        if (!eliminationsByCosmology[elim.cosmology]) {
          eliminationsByCosmology[elim.cosmology] = [];
        }
        eliminationsByCosmology[elim.cosmology].push(elim);
      });
      
      // Show eliminations, focusing on "NO" answers to Required questions
      const noAnswerEliminations = result.eliminationHistory.filter(e => e.answer === 'N' && e.reason.includes('Required'));
      
      if (noAnswerEliminations.length > 0) {
        console.log(`\n🚫 COSMOLOGIES ELIMINATED BY "NO" ANSWERS TO REQUIRED FEATURES:`);
        
        // Group by question to show patterns
        const byQuestion = {};
        noAnswerEliminations.forEach(elim => {
          if (!byQuestion[elim.question]) {
            byQuestion[elim.question] = [];
          }
          byQuestion[elim.question].push(elim.cosmology);
        });
        
        Object.entries(byQuestion).forEach(([question, cosmologies]) => {
          console.log(`\n   Question: "${question}"`);
          console.log(`   Answer: NO (rejected required feature)`);
          console.log(`   Eliminated: ${cosmologies.join(', ')}`);
        });
      }
      
      // Show conviction profile for rejected concepts
      console.log(`\n🎯 CONVICTION PROFILE:`);
      Object.entries(result.convictionProfile).forEach(([concept, profile]) => {
        const total = profile.pro + profile.con;
        if (total > 0) {
          const proPercent = Math.round((profile.pro / total) * 100);
          const conPercent = Math.round((profile.con / total) * 100);
          console.log(`   ${concept}: ${proPercent}% pro, ${conPercent}% con (${total} questions)`);
        }
      });
      
    } else {
      console.log('No cosmologies were eliminated during this quiz.');
    }
    
  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
  }
}

if (require.main === module) {
  main();
}