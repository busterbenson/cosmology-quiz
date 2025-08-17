<template>
  <div class="min-h-screen p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-6 text-white">
        Test Real Quiz Engine
      </h1>
            
      <div class="cosmic-card mb-6">
        <h2 class="text-xl font-bold mb-4 text-white">
          Test Any Cosmology
        </h2>
        
        <div class="mb-4">
          <label class="block text-white text-sm font-bold mb-2">
            Select Cosmology to Test:
          </label>
          <select 
            v-model="selectedCosmology" 
            class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            :disabled="testing || !quizEngine.isInitialized.value"
          >
            <option value="" v-if="!quizEngine.isInitialized.value">-- Loading cosmologies... --</option>
            <option value="" v-else-if="Object.keys(cosmologiesByCategory).length === 0">-- No cosmologies loaded --</option>
            <option value="" v-else>-- Choose a cosmology --</option>
            <optgroup 
              v-for="(cosmologies, category) in cosmologiesByCategory" 
              :key="category" 
              :label="category"
            >
              <option 
                v-for="cosmology in cosmologies" 
                :key="cosmology" 
                :value="cosmology"
              >
                {{ cosmology }}
              </option>
            </optgroup>
          </select>
        </div>
        
        <button 
          @click="testSelectedCosmology" 
          :disabled="testing || !selectedCosmology"
          class="cosmic-button mb-4"
        >
          {{ testing ? 'Testing...' : `Test ${selectedCosmology || 'Selected Cosmology'}` }}
        </button>
        
        <div v-if="results" class="mt-6">
          <h3 class="text-lg font-bold mb-2 text-white">Results:</h3>
          <div class="bg-white/5 rounded p-4">
            <p class="text-sm text-gray-300 mb-2">
              <strong>Questions Asked:</strong> {{ results.totalQuestions }}
            </p>
            <p class="text-sm text-gray-300 mb-2">
              <strong>Answer String:</strong> {{ results.answerString }}
            </p>
            <p class="text-sm text-gray-300 mb-4">
              <strong>Permalink:</strong> 
              <a :href="results.permalink" target="_blank" class="text-cosmic-gold underline">
                {{ results.permalink }}
              </a>
            </p>
            
            <!-- Show Generated Profile Summary -->
            <div v-if="generatedProfile" class="mb-4 p-3 bg-blue-500/20 rounded">
              <h4 class="text-sm font-bold text-white mb-2">Generated Profile Summary:</h4>
              <p class="text-xs text-gray-300">
                Total answers: {{ Object.keys(generatedProfile).length }} | 
                Yes: {{ Object.values(generatedProfile).filter(a => a === 'Y').length }} | 
                No: {{ Object.values(generatedProfile).filter(a => a === 'N').length }} | 
                Don't Know: {{ Object.values(generatedProfile).filter(a => a === '?').length }}
              </p>
              <details class="mt-2">
                <summary class="text-xs text-cosmic-gold cursor-pointer">View all answers</summary>
                <div class="mt-2 max-h-40 overflow-y-auto text-xs text-gray-300">
                  <div v-for="[question, answer] in Object.entries(generatedProfile)" :key="question" class="py-1">
                    <span :class="answer === 'Y' ? 'text-green-400' : answer === 'N' ? 'text-red-400' : 'text-yellow-400'">{{ answer }}</span> - {{ question }}
                  </div>
                </div>
              </details>
            </div>
            
            <!-- Show Questions Actually Asked -->
            <div v-if="results.questionsAsked" class="mb-4 p-3 bg-purple-500/20 rounded">
              <h4 class="text-sm font-bold text-white mb-2">Questions Actually Asked:</h4>
              <div class="max-h-40 overflow-y-auto text-xs text-gray-300">
                <div v-for="(question, index) in results.questionsAsked" :key="index" class="py-1">
                  <span :class="results.answersGiven[index] === 'Y' ? 'text-green-400' : results.answersGiven[index] === 'N' ? 'text-red-400' : 'text-yellow-400'">
                    {{ results.answersGiven[index] }}
                  </span> - {{ question }}
                </div>
              </div>
            </div>
            
            <!-- Show Elimination History -->
            <div v-if="results.eliminationHistory" class="mb-4 p-3 bg-red-500/20 rounded">
              <h4 class="text-sm font-bold text-white mb-2">Elimination History:</h4>
              <div class="max-h-60 overflow-y-auto text-xs text-gray-300">
                <div v-for="(elimination, index) in results.eliminationHistory" :key="index" class="py-2 border-b border-gray-600 last:border-b-0">
                  <div class="font-bold" :class="elimination.cosmology === targetCosmology ? 'text-yellow-400' : 'text-red-400'">
                    Q{{ elimination.questionIndex + 1 }}: {{ elimination.cosmology }}
                    <span v-if="elimination.cosmology === targetCosmology">⭐ (TARGET)</span>
                  </div>
                  <div class="text-xs text-gray-400">
                    Question: "{{ elimination.question }}"
                  </div>
                  <div class="text-xs">
                    Answer: <span :class="elimination.answer === 'Y' ? 'text-green-400' : elimination.answer === 'N' ? 'text-red-400' : 'text-yellow-400'">{{ elimination.answer }}</span> 
                    | Relation: {{ elimination.relation }} 
                    | Reason: {{ elimination.reason }}
                  </div>
                </div>
              </div>
            </div>
            
            <h4 class="text-md font-bold mb-2 text-white">Top 10 Results:</h4>
            <div class="space-y-1">
              <div 
                v-for="(result, index) in results.finalResults.slice(0, 10)" 
                :key="result.cosmology"
                class="flex justify-between items-center p-2 bg-white/5 rounded"
                :class="{ 'bg-cosmic-gold/20': result.cosmology === targetCosmology }"
              >
                <span class="text-white">
                  {{ index + 1 }}. {{ result.cosmology }}
                  <span v-if="result.cosmology === targetCosmology" class="text-cosmic-gold">⭐</span>
                </span>
                <span class="text-cosmic-gold font-bold">{{ result.score }}</span>
              </div>
            </div>
            
            <div v-if="targetCosmology" class="mt-4 p-3 bg-cosmic-purple/20 rounded">
              <p class="text-white font-bold">
                {{ targetCosmology }}: 
                <span v-if="targetRank">
                  Rank #{{ targetRank }}, Score {{ targetScore }}
                </span>
                <span v-else class="text-red-400">
                  Not found in results
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div v-if="error" class="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded">
          <p class="text-red-400 font-bold">Error:</p>
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const quizEngine = useQuizEngine()

const testing = ref(false)
const results = ref<any>(null)
const error = ref<string | null>(null)
const targetCosmology = ref<string | null>(null)
const generatedProfile = ref<Record<string, string> | null>(null)
const selectedCosmology = ref<string>('')

// Initialize quiz engine on component mount
onMounted(async () => {
  if (!quizEngine.isInitialized.value) {
    console.log('Initializing quiz engine for dropdown...')
    await quizEngine.initialize()
  }
})

// Group cosmologies by category for the dropdown
const cosmologiesByCategory = computed(() => {
  const groups: Record<string, string[]> = {}
  
  // Only process if cosmologies are loaded
  if (quizEngine.cosmologies.value.length === 0) {
    return groups
  }
  
  quizEngine.cosmologies.value.forEach(cosmology => {
    const category = cosmology.Category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(cosmology.Cosmology)
  })
  
  // Sort categories and cosmologies within each category
  Object.keys(groups).forEach(category => {
    groups[category].sort()
  })
  
  return groups
})

const targetRank = computed(() => {
  if (!results.value || !targetCosmology.value) return null
  const index = results.value.finalResults.findIndex((r: any) => r.cosmology === targetCosmology.value)
  return index >= 0 ? index + 1 : null
})

const targetScore = computed(() => {
  if (!results.value || !targetCosmology.value) return null
  const result = results.value.finalResults.find((r: any) => r.cosmology === targetCosmology.value)
  return result?.score || null
})

const generateCosmologyProfile = (cosmologyName: string): Record<string, 'Y' | 'N' | '?'> => {
  // Load cosmology data and convert directly to answers
  const cosmology = quizEngine.cosmologies.value.find(c => c.Cosmology === cosmologyName)
  if (!cosmology) {
    throw new Error(`${cosmologyName} not found`)
  }

  const answerProfile: Record<string, 'Y' | 'N' | '?'> = {}
  
  for (const [questionKey, relation] of Object.entries(cosmology)) {
    if (['Order', 'Category', 'Cosmology'].includes(questionKey)) continue
    
    // Convert cosmology data directly to answers
    if (relation === 'R') answerProfile[questionKey] = 'Y'        // Required = YES
    else if (relation === 'DB') answerProfile[questionKey] = 'N'  // Deal Breaker = NO  
    else if (relation === 'NR') answerProfile[questionKey] = '?'  // Not Required = Don't Know
    else answerProfile[questionKey] = '?'                         // Empty/Unknown = Don't Know
  }

  return answerProfile
}

// Removed heuristic function - using cosmology data directly

const generateProblematicProfile = (): Record<string, 'Y' | 'N' | '?'> => {
  // Create a profile that should produce the problematic answer string
  return {
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
  }
}

const testAnalyticalIdealism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Analytical Idealism'
  
  try {
    // Ensure quiz engine is initialized
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🧠 Testing Analytical Idealism with REAL quiz engine')
    
    // Generate authentic answer profile
    const answerProfile = generateCosmologyProfile('Analytical Idealism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    // Run the REAL auto-quiz
    console.log('🚀 Running real runAutoQuiz...')
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

const testClassicalPolytheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Classical Polytheism'
  
  try {
    // Ensure quiz engine is initialized
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🏛️ Testing Classical Polytheism with REAL quiz engine')
    
    // Generate authentic answer profile
    const answerProfile = generateCosmologyProfile('Classical Polytheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    // Run the REAL auto-quiz
    console.log('🚀 Running real runAutoQuiz...')
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

const testOpenSkeptic = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Open Skeptic'
  
  try {
    // Ensure quiz engine is initialized
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Open Skeptic with REAL quiz engine')
    
    // Generate authentic answer profile
    const answerProfile = generateCosmologyProfile('Open Skeptic')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    // Run the REAL auto-quiz
    console.log('🚀 Running real runAutoQuiz...')
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

const testSelectedCosmology = async () => {
  if (!selectedCosmology.value) return
  
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = selectedCosmology.value
  
  try {
    // Ensure quiz engine is initialized
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log(`🔍 Testing ${selectedCosmology.value} with REAL quiz engine`)
    
    // Generate authentic answer profile
    const answerProfile = generateCosmologyProfile(selectedCosmology.value)
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    // Run the REAL auto-quiz
    console.log('🚀 Running real runAutoQuiz...')
    const result = await quizEngine.runAutoQuiz(answerProfile, selectedCosmology.value)
    
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testBiblicalLiteralism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Biblical Literalism'
  
  try {
    // Ensure quiz engine is initialized
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('📖 Testing Biblical Literalism with REAL quiz engine')
    
    // Generate authentic answer profile for Biblical Literalism
    const answerProfile = generateCosmologyProfile('Biblical Literalism')
    
    generatedProfile.value = answerProfile
    console.log('Generated Biblical Literalism answer profile:', answerProfile)
    console.log('Key Biblical questions in profile:')
    console.log('- Earth < 10000 years:', answerProfile['Earth < 10000 years'] || 'NOT FOUND')
    console.log('- Genesis historically accurate:', answerProfile['Genesis historically accurate'] || 'NOT FOUND')
    console.log('- No macroevolution:', answerProfile['No macroevolution'] || 'NOT FOUND')
    console.log('- Evolution as primary mechanism:', answerProfile['Evolution as primary mechanism'] || 'NOT FOUND')
    
    // Run the REAL auto-quiz
    console.log('🚀 Running real runAutoQuiz...')
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

const testProblematicString = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Classical Polytheism'
  
  try {
    // Ensure quiz engine is initialized
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing problematic answer string NNNNNNNNNYNN')
    
    // Generate profile that should produce NNNNNNNNNYNN
    const answerProfile = generateProblematicProfile()
    console.log('Generated answer profile:', answerProfile)
    
    // Run the REAL auto-quiz
    console.log('🚀 Running real runAutoQuiz...')
    const result = await quizEngine.runAutoQuiz(answerProfile)
    
    console.log('✅ Real quiz engine results:', result)
    console.log('Expected answer string: NNNNNNNNNYNN')
    console.log('Actual answer string:', result.answerString)
    console.log('Match:', result.answerString === 'NNNNNNNNNYNN' ? '✅' : '❌')
    
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

useHead({
  title: 'Test Real Quiz Engine'
})
</script>