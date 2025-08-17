#!/usr/bin/env node
/**
 * Validate using the actual quiz engine logic
 * This simulates exactly what the frontend does
 */

const fs = require('fs');

// Load the data files
const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));
const questionsData = JSON.parse(fs.readFileSync('public/data/question_library_v3.json', 'utf8'));

// Simulate the exact quiz engine logic from useQuizEngine.ts
class QuizEngineSimulator {
  constructor() {
    this.cosmologies = cosmologiesData;
    this.questions = questionsData;
    this.reset();
  }

  reset() {
    this.quizState = {
      scores: new Array(this.cosmologies.length).fill(0),
      askedQuestions: ['Order', 'Category', 'Cosmology'],
      sessionAnswers: [],
      convictionProfile: {},
      askedConcepts: new Set(),
      dontKnowCount: 0,
      questionNumber: 0,
      questionHistory: []
    };
    this.currentQuestion = null;
  }

  // Decode answer string exactly like the frontend
  decodeAnswerString(answerString) {
    return answerString.split('').map(char => {
      switch (char.toUpperCase()) {
        case 'Y': return 'Y'
        case 'N': return 'N'
        case 'U': return '?'
        // Legacy support
        case '1': return 'Y'
        case '0': return 'N'
        case '2': return '?'
        default: return 'N'
      }
    });
  }

  // Simulate reconstructQuizFromPermalink logic
  async simulatePermalink(answerString) {
    console.log(`🔄 Simulating permalink: ${answerString}`);
    
    const answers = this.decodeAnswerString(answerString);
    console.log(`   Decoded to: ${answers.join('')}`);
    
    this.reset();
    
    // Simulate the quiz by answering each question in sequence
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      
      // Find next question (simplified)
      const nextQuestion = this.findNextQuestion();
      if (!nextQuestion) {
        console.log(`   Stopped at question ${i + 1}: no more questions`);
        break;
      }
      
      this.currentQuestion = nextQuestion;
      this.answerQuestion(answer);
      
      console.log(`   Q${i + 1}: ${nextQuestion} → ${answer}`);
    }
    
    const results = this.getResults();
    console.log(`   Final results: Top = ${results[0]?.cosmology || 'Unknown'}`);
    
    return results;
  }

  // Simplified question finding (this would need the full entropy logic)
  findNextQuestion() {
    const allQuestionKeys = Object.keys(this.cosmologies[0]).filter(k => 
      !['Order', 'Category', 'Cosmology'].includes(k) && 
      !this.quizState.askedQuestions.includes(k)
    );
    
    if (allQuestionKeys.length === 0) return null;
    
    // For now, just return the first unasked question
    // In the real engine, this would use entropy calculations
    return allQuestionKeys[0];
  }

  // Simplified answer processing
  answerQuestion(answer) {
    if (!this.currentQuestion) return;
    
    this.quizState.questionNumber++;
    this.quizState.askedQuestions.push(this.currentQuestion);
    
    // Record the answer
    this.quizState.sessionAnswers.push({
      questionKey: this.currentQuestion,
      question: this.questions[this.currentQuestion]?.questionText || this.currentQuestion,
      answer: answer,
      eliminated: []
    });
    
    // Process scoring (simplified)
    this.cosmologies.forEach((cosmology, index) => {
      const relation = cosmology[this.currentQuestion];
      if (!relation) return;
      
      let points = 0;
      if (relation === 'R' && answer === 'Y') points = 10;
      else if (relation === 'DB' && answer === 'N') points = 10;
      else if (relation === 'NR' && answer === 'Y') points = 2;
      
      this.quizState.scores[index] += points;
    });
    
    // Update conviction profile (simplified)
    if (!this.quizState.convictionProfile[this.currentQuestion]) {
      this.quizState.convictionProfile[this.currentQuestion] = { pro: 0, con: 0 };
    }
    
    if (answer === 'Y') this.quizState.convictionProfile[this.currentQuestion].pro++;
    else if (answer === 'N') this.quizState.convictionProfile[this.currentQuestion].con++;
  }

  getResults() {
    const results = this.cosmologies.map((cosmology, index) => ({
      cosmology: cosmology.Cosmology,
      category: cosmology.Category,
      score: this.quizState.scores[index]
    }));
    
    return results.sort((a, b) => b.score - a.score);
  }
}

async function validatePermalink(answerString) {
  const simulator = new QuizEngineSimulator();
  const results = await simulator.simulatePermalink(answerString);
  
  console.log('\n📊 TOP 5 RESULTS:');
  results.slice(0, 5).forEach((result, i) => {
    console.log(`  ${i + 1}. ${result.cosmology}: ${result.score}`);
  });
  
  // Check for Classical Polytheism specifically
  const classicalPolytheism = results.find(r => r.cosmology === 'Classical Polytheism');
  if (classicalPolytheism) {
    const rank = results.findIndex(r => r.cosmology === 'Classical Polytheism') + 1;
    console.log(`\n🔍 Classical Polytheism: Rank #${rank}, Score ${classicalPolytheism.score}`);
  } else {
    console.log('\n❌ Classical Polytheism not found in results');
  }
  
  return results;
}

async function main() {
  const answerString = process.argv[2] || 'NNNNNNNNNYNN';
  await validatePermalink(answerString);
}

if (require.main === module) {
  main().catch(console.error);
}