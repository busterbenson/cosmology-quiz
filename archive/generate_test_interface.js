#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load cosmology data
const cosmologyData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/cosmology_features.json'), 'utf8')
);

function generateTestButtons() {
  // Group cosmologies by category for better organization
  const categories = {};
  cosmologyData.forEach(cosmology => {
    const category = cosmology.Category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(cosmology.Cosmology);
  });

  let buttonsHtml = '';
  let functionsJs = '';

  // Generate buttons grouped by category
  Object.entries(categories).forEach(([category, cosmologies]) => {
    buttonsHtml += `
      <div class="mb-6">
        <h3 class="text-lg font-bold text-white mb-3">${category}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">`;
    
    cosmologies.forEach(cosmologyName => {
      const safeName = cosmologyName.replace(/[^a-zA-Z0-9]/g, '');
      const buttonClass = getButtonClass(category);
      
      buttonsHtml += `
          <button 
            @click="test${safeName}" 
            :disabled="testing"
            class="${buttonClass} text-sm px-3 py-2"
          >
            {{ testing && targetCosmology === '${cosmologyName}' ? 'Testing...' : '${cosmologyName}' }}
          </button>`;
      
      // Generate corresponding function
      functionsJs += `
const test${safeName} = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = '${cosmologyName}'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing ${cosmologyName} with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('${cosmologyName}')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}
`;
    });
    
    buttonsHtml += `
        </div>
      </div>`;
  });

  return { buttonsHtml, functionsJs };
}

function getButtonClass(category) {
  // Assign different button styles based on category
  const styleMap = {
    'Consciousness-First': 'cosmic-button',
    'Scientific': 'cosmic-button-secondary', 
    'Agnostic Spiritual Seeker': 'cosmic-button-tertiary',
    'Unconventional Skeptic': 'cosmic-button-quaternary',
    'Christian': 'bg-blue-600 hover:bg-blue-700 text-white rounded',
    'Islamic': 'bg-green-600 hover:bg-green-700 text-white rounded',
    'Hindu': 'bg-orange-600 hover:bg-orange-700 text-white rounded',
    'Buddhist': 'bg-yellow-600 hover:bg-yellow-700 text-white rounded'
  };
  
  return styleMap[category] || 'bg-gray-600 hover:bg-gray-700 text-white rounded';
}

function generateHeuristics() {
  let heuristicsJs = '';
  
  cosmologyData.forEach(cosmology => {
    const cosmologyName = cosmology.Cosmology;
    const category = cosmology.Category;
    
    // Generate basic heuristics based on the cosmology's profile
    const beliefs = Object.entries(cosmology).filter(([key, value]) => 
      !['Order', 'Category', 'Cosmology'].includes(key)
    );
    
    const required = beliefs.filter(([key, value]) => value === 'R');
    const opposed = beliefs.filter(([key, value]) => value === 'DB');
    
    if (required.length > 0 || opposed.length > 0) {
      heuristicsJs += `
  // ${cosmologyName} heuristics
  if (cosmologyName === '${cosmologyName}') {`;
      
      // Add category-based logic
      if (category.includes('Skeptic') || category.includes('Agnostic')) {
        heuristicsJs += `
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }`;
      }
      
      if (category.includes('Scientific') || category.includes('Materialist')) {
        heuristicsJs += `
    // Scientific/materialist approach  
    if (questionKey.includes('supernatural') || questionKey.includes('miracle')) {
      return 'N'
    }
    if (questionKey.includes('natural') || questionKey.includes('evidence')) {
      return 'Y'
    }`;
      }
      
      if (category.includes('Consciousness') || category.includes('Idealism')) {
        heuristicsJs += `
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }`;
      }
      
      // Add specific required belief patterns
      required.slice(0, 3).forEach(([key, value]) => {
        const keyWords = key.toLowerCase().split(' ').slice(0, 3);
        if (keyWords.length >= 2) {
          heuristicsJs += `
    if (questionKey.includes('${keyWords[0]}') && questionKey.includes('${keyWords[1]}')) {
      return 'Y'
    }`;
        }
      });
      
      // Add specific opposed belief patterns  
      opposed.slice(0, 3).forEach(([key, value]) => {
        const keyWords = key.toLowerCase().split(' ').slice(0, 3);
        if (keyWords.length >= 2) {
          heuristicsJs += `
    if (questionKey.includes('${keyWords[0]}') && questionKey.includes('${keyWords[1]}')) {
      return 'N'
    }`;
        }
      });
      
      heuristicsJs += `
  }
`;
    }
  });
  
  return heuristicsJs;
}

function updateTestQuizEngine() {
  const { buttonsHtml, functionsJs } = generateTestButtons();
  const heuristicsJs = generateHeuristics();
  
  console.log('Generated test interface components:');
  console.log(`- ${cosmologyData.length} test buttons`);
  console.log(`- ${cosmologyData.length} test functions`);
  console.log('- Comprehensive heuristics for all cosmologies');
  
  // Write components to separate files for manual integration
  fs.writeFileSync(
    path.join(__dirname, 'generated_test_buttons.html'), 
    buttonsHtml
  );
  
  fs.writeFileSync(
    path.join(__dirname, 'generated_test_functions.js'), 
    functionsJs
  );
  
  fs.writeFileSync(
    path.join(__dirname, 'generated_heuristics.js'), 
    heuristicsJs
  );
  
  console.log('\\nFiles generated:');
  console.log('- generated_test_buttons.html (for template integration)');
  console.log('- generated_test_functions.js (for script integration)'); 
  console.log('- generated_heuristics.js (for heuristics integration)');
  console.log('\\nManual integration required in test-quiz-engine.vue');
}

if (require.main === module) {
  updateTestQuizEngine();
}