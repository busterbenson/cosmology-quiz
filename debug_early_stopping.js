#!/usr/bin/env node

// Debug script to understand why early stopping isn't working

const fs = require('fs');

// Load the data
const cosmologiesData = JSON.parse(fs.readFileSync('public/data/cosmology_features.json', 'utf8'));

// Biblical Literalism test sequence (first 16 questions that should eliminate everything possible)
const biblicalQuestions = [
  "Practical results over theory",
  "One supreme being", 
  "Genesis historically accurate",
  "Direct experience over doctrine",
  "Evolution as primary mechanism",
  "Natural laws sufficient without intervention", // Question 6 where Biblical Literalism was getting eliminated before the fix
  "Primordial awareness as ground of being",
  "Reality divided between spirit and matter",
  "Universe as extrinsic appearance of consciousness",
  "Self and world not separate",
  "Ancestors actively present in current affairs",
  // Let's simulate a few more to see what happens after 16
  "All things possess consciousness",
  "Physical matter/energy as fundamental", 
  "External world as mental manifestation",
  "Individual minds aspects of cosmic mind",
  "True self is ultimate reality"
];

const biblicalAnswers = ['N', 'Y', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', '?', 'N', 'N', 'N', 'Y', 'Y'];

console.log('🔍 Debugging Early Stopping for Biblical Literalism');
console.log('==================================================');

// Find Biblical Literalism cosmology
const biblicalLiteralism = cosmologiesData.find(c => c.Cosmology === 'Biblical Literalism');
if (!biblicalLiteralism) {
  console.log('❌ Biblical Literalism not found in data');
  process.exit(1);
}

console.log('\n📋 Biblical Literalism Data Preview:');
console.log('Category:', biblicalLiteralism.Category);

// Test the elimination logic for each question
let activeCosmologies = [...cosmologiesData];
const CONFIG = { SCORE_ELIMINATE: -1000 };

console.log('\n🎯 Simulating Eliminations:');
console.log(`Starting with ${activeCosmologies.length} cosmologies`);

for (let i = 0; i < biblicalQuestions.length && i < biblicalAnswers.length; i++) {
  const questionKey = biblicalQuestions[i];
  const answer = biblicalAnswers[i];
  
  // Count potential eliminations for this question
  const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length;
  const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length;
  
  console.log(`\nQ${i + 1}: "${questionKey}" → ${answer}`);
  console.log(`  Potential eliminations: YES=${yesEliminated}, NO=${noEliminated}`);
  
  if (answer === 'Y') {
    // Eliminate cosmologies where this is a Deal Breaker
    activeCosmologies = activeCosmologies.filter(c => c[questionKey] !== 'DB');
  } else if (answer === 'N') {
    // Eliminate cosmologies where this is Required
    activeCosmologies = activeCosmologies.filter(c => c[questionKey] !== 'R');
  }
  // '?' doesn't eliminate anything directly
  
  console.log(`  Active cosmologies after elimination: ${activeCosmologies.length}`);
  
  // Check if Biblical Literalism is still active
  const biblicalStillActive = activeCosmologies.some(c => c.Cosmology === 'Biblical Literalism');
  console.log(`  Biblical Literalism still active: ${biblicalStillActive ? '✅' : '❌'}`);
}

// Now check what questions could still eliminate cosmologies
console.log('\n🔍 Checking Remaining Elimination Potential:');

// Get all question columns
const allQuestionKeys = Object.keys(cosmologiesData[0]).filter(k => 
  !['Order', 'Category', 'Cosmology'].includes(k)
);

const remainingQuestions = allQuestionKeys.filter(q => !biblicalQuestions.includes(q));
console.log(`Remaining unasked questions: ${remainingQuestions.length}`);

let questionsWithEliminationPotential = 0;
const detailsToShow = [];

for (const questionKey of remainingQuestions) {
  const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length;
  const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length;
  
  if (yesEliminated > 0 || noEliminated > 0) {
    questionsWithEliminationPotential++;
    if (detailsToShow.length < 5) {
      detailsToShow.push(`"${questionKey}": Y=${yesEliminated}, N=${noEliminated}`);
    }
  }
}

console.log(`Questions that can still eliminate: ${questionsWithEliminationPotential}`);
if (detailsToShow.length > 0) {
  console.log('Sample questions with elimination potential:');
  detailsToShow.forEach(detail => console.log(`  ${detail}`));
}

console.log('\n✅ Analysis Complete');
console.log(`If questionsWithEliminationPotential = 0, early stopping should trigger`);
console.log(`If questionsWithEliminationPotential > 0, quiz should continue`);