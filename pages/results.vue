<template>
  <div class="min-h-screen p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="cosmic-card text-center">
        <div class="animate-spin w-8 h-8 border-4 border-cosmic-purple border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-300">Calculating your results...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="cosmic-card text-center">
        <div class="text-red-400 mb-4">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p class="text-red-400 font-semibold mb-2">Unable to Generate Results</p>
        <p class="text-gray-400 text-sm mb-4">{{ error }}</p>
        <button @click="navigateTo('/')" class="cosmic-button">
          Start Over
        </button>
      </div>

      <!-- Results Display -->
      <div v-else-if="results.length > 0" class="cosmic-card">
        <!-- Header -->
        <h1 class="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cosmic-gold via-cosmic-purple to-cosmic-blue bg-clip-text text-transparent">
          Your Philosophical Worldview
        </h1>
        
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          <!-- Left Column: Top Results -->
          <div class="space-y-4">
            <!-- Primary Result -->
            <div class="bg-gradient-to-r from-cosmic-blue/20 to-cosmic-purple/20 rounded-lg p-4 border border-cosmic-gold/30">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h2 class="text-xl font-bold text-white">{{ displayResults[0].cosmology }}</h2>
                    <button 
                      @click="toggleFavorite(displayResults[0].cosmology)"
                      class="heart-button transition-all duration-300 hover:scale-110"
                      :class="{
                        'heart-active': favoriteCosmology === displayResults[0].cosmology,
                        'heart-pulse': favoriteCosmology === displayResults[0].cosmology
                      }"
                      title="Mark as favorite"
                    >
                      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                  <p class="text-cosmic-gold text-sm">{{ displayResults[0].category }}</p>
                </div>
                <span class="text-cosmic-gold font-bold text-lg">{{ displayResults[0].score }}</span>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                {{ quizEngine.summaries.value[displayResults[0].cosmology] || `A ${displayResults[0].category} worldview` }}
              </p>
            </div>
            
            <!-- Other Top Results -->
            <div>
              <h3 class="text-lg font-bold text-white mb-3">Other Top Matches</h3>
              <div class="space-y-2">
                <div v-for="(result, index) in displayResults.slice(1)" :key="result.cosmology" 
                     class="bg-white/5 rounded px-3 py-2.5">
                  <div class="flex justify-between items-start mb-1">
                    <div class="flex items-center gap-2 flex-1">
                      <span class="text-white font-medium text-sm">{{ getDisplayRank(result, index) }}. {{ result.cosmology }}</span>
                      <button 
                        @click="toggleFavorite(result.cosmology)"
                        class="heart-button heart-small transition-all duration-300 hover:scale-110"
                        :class="{
                          'heart-active': favoriteCosmology === result.cosmology,
                          'heart-pulse': favoriteCosmology === result.cosmology
                        }"
                        title="Mark as favorite"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                    <span class="text-cosmic-gold font-bold text-sm ml-3">{{ result.score }}</span>
                  </div>
                  <div class="text-xs text-gray-400 mb-1">{{ result.category }}</div>
                  <p class="text-xs text-gray-300 leading-tight">
                    {{ quizEngine.summaries.value[result.cosmology] || `A ${result.category} worldview` }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Least Compatible -->
            <div v-if="leastCompatibleResult">
              <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="text-sm font-bold text-red-400">🚫 Your Anti-Cosmology</h3>
                  <span class="text-red-400 font-bold text-sm">{{ leastCompatibleResult.score }}</span>
                </div>
                <div class="text-xs text-red-200/70 mb-1">{{ leastCompatibleResult.category }}</div>
                <p class="text-red-300 font-medium text-sm mb-1">{{ leastCompatibleResult.cosmology }}</p>
                <p class="text-xs text-red-200/80 leading-tight">
                  {{ quizEngine.summaries.value[leastCompatibleResult.cosmology] || `A ${leastCompatibleResult.category} worldview` }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Cosmological Profile -->
          <div v-if="Object.keys(quizEngine.quizState.value.convictionProfile).length > 0">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-bold text-white">Your Cosmological Profile</h3>
              <div class="text-xs text-gray-400">
                <span class="text-red-300">●</span> Against · <span class="text-green-300">●</span> For
              </div>
            </div>
            <div class="space-y-1.5">
              <div v-for="item in orderedConvictionProfile" :key="item.concept"
                   class="bg-white/5 rounded px-3 py-2">
                <div class="flex items-center justify-between">
                  <span class="text-white capitalize text-sm font-medium flex-1 min-w-0 truncate">
                    {{ item.concept }}
                  </span>
                  <div class="flex items-center space-x-2 ml-3">
                    <BiDirectionalDots 
                      :pro="item.counts.pro" 
                      :con="item.counts.con" 
                      :max-strength="maxConvictionStrength" 
                    />
                    <span 
                      class="text-xs font-mono w-6 text-right font-bold"
                      :class="{
                        'text-green-400': item.netScore > 0,
                        'text-red-400': item.netScore < 0,
                        'text-gray-400': item.netScore === 0
                      }"
                    >
                      {{ item.netScore > 0 ? '+' : '' }}{{ item.netScore }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-12 text-center space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="retakeQuiz" class="cosmic-button">
              Retake Quiz
            </button>
            <button @click="shareResults" class="cosmic-button-secondary">
              Share Results
            </button>
            <button @click="copyPermalink" class="cosmic-button-outline">
              Copy Permalink
            </button>
          </div>
          
          <div class="text-sm text-gray-400">
            Results based on {{ quizEngine.quizState.value.questionNumber }} questions
          </div>
          
          <!-- Permalink Display -->
          <div v-if="showPermalink" class="mt-6 p-4 bg-white/5 rounded-lg border border-cosmic-gold/30">
            <div class="text-sm text-gray-300 mb-2">Permalink to your results:</div>
            <div class="flex items-center gap-2">
              <input 
                ref="permalinkInput"
                :value="generatePermalink()" 
                readonly 
                class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded text-sm text-white"
                @click="selectPermalinkText"
              />
              <button 
                @click="copyPermalinkToClipboard" 
                class="px-3 py-2 bg-cosmic-purple hover:bg-cosmic-purple/80 rounded text-sm text-white transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="cosmic-card text-center">
        <p class="text-gray-300 mb-4">No quiz results available.</p>
        <button @click="navigateTo('/')" class="cosmic-button">
          Take Quiz
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BiDirectionalDots from '~/components/common/BiDirectionalDots.vue'

useHead({
  title: 'Your Philosophical Worldview Results'
})

const quizEngine = useQuizEngine()

const isLoading = ref(true)
const error = ref<string | null>(null)
const results = ref<any[]>([])
const favoriteCosmology = ref<string | null>(null)
const showPermalink = ref(false)
const permalinkInput = ref<HTMLInputElement | null>(null)

// Computed properties for conviction profile ordering and visualization
const maxConvictionStrength = computed(() => {
  const profile = quizEngine.quizState.value.convictionProfile
  let max = 0
  for (const counts of Object.values(profile)) {
    max = Math.max(max, counts.pro, counts.con)
  }
  return max
})

const orderedConvictionProfile = computed(() => {
  const profile = quizEngine.quizState.value.convictionProfile
  const items = Object.entries(profile).map(([concept, counts]) => ({
    concept,
    counts,
    netScore: counts.pro - counts.con // For sorting: most pro first, then most con
  }))
  
  return items.sort((a, b) => b.netScore - a.netScore)
})

// Reorder results to put favorite first if selected
const displayResults = computed(() => {
  if (!favoriteCosmology.value || results.value.length === 0) {
    return results.value.slice(0, 5)
  }
  
  const top5 = results.value.slice(0, 5)
  const favoriteIndex = top5.findIndex(r => r.cosmology === favoriteCosmology.value)
  
  if (favoriteIndex === -1 || favoriteIndex === 0) {
    return top5 // Favorite not in top 5 or already first
  }
  
  // Move favorite to first position
  const reordered = [...top5]
  const favorite = reordered.splice(favoriteIndex, 1)[0]
  reordered.unshift(favorite)
  
  return reordered
})

const leastCompatibleResult = computed(() => {
  if (!quizEngine.isInitialized.value) return null
  
  // Get ALL cosmologies and their scores (including eliminated ones)
  const allCosmologies = quizEngine.cosmologies.value
  const allScores = quizEngine.quizState.value.scores
  
  if (allCosmologies.length === 0 || allScores.length === 0) return null
  
  // Find all cosmologies with the absolute lowest score
  const lowestScore = Math.min(...allScores)
  const tiedCosmologies = []
  
  for (let i = 0; i < allCosmologies.length; i++) {
    if (allScores[i] === lowestScore) {
      tiedCosmologies.push({
        cosmology: allCosmologies[i].Cosmology,
        category: allCosmologies[i].Category,
        score: allScores[i],
        index: i
      })
    }
  }
  
  if (tiedCosmologies.length === 0) return null
  if (tiedCosmologies.length === 1) return tiedCosmologies[0]
  
  // Clever tie-breaking for eliminated cosmologies (-1000 score)
  // Strategy: Find the one that was eliminated EARLIEST (most fundamentally incompatible)
  const sessionAnswers = quizEngine.quizState.value.sessionAnswers
  
  for (const answer of sessionAnswers) {
    const eliminated = answer.eliminated || []
    for (const elim of eliminated) {
      const tieCandidate = tiedCosmologies.find(t => t.cosmology === elim.name)
      if (tieCandidate) {
        // Found the earliest eliminated - this is the most fundamentally anti-compatible
        return tieCandidate
      }
    }
  }
  
  // Fallback: if no elimination history found, use other tie-breakers
  // 1. Prefer cosmologies from more "extreme" categories (Religious vs Secular, etc.)
  // 2. Alphabetical as final resort
  const categoryPriority = {
    'Religious': 3,
    'Secular': 3, 
    'Scientific': 2,
    'Philosophical': 1,
    'Cultural': 1
  }
  
  tiedCosmologies.sort((a, b) => {
    const aPriority = categoryPriority[a.category] || 0
    const bPriority = categoryPriority[b.category] || 0
    if (aPriority !== bPriority) return bPriority - aPriority
    return a.cosmology.localeCompare(b.cosmology)
  })
  
  return tiedCosmologies[0]
})

const reconstructQuizFromPermalink = async (answersParam: string) => {
  try {
    // Decode answer string: Y=Y, N=N, U=? (uncertain)
    const answers = answersParam.split('').map(char => {
      switch (char.toUpperCase()) {
        case 'Y': return 'Y'
        case 'N': return 'N'
        case 'U': return '?'
        // Legacy support for old format
        case '1': return 'Y'
        case '0': return 'N'
        case '2': return '?'
        default: return 'N'
      }
    })
    
    // Clear any existing quiz state
    quizEngine.quizState.value.scores = new Array(quizEngine.cosmologies.value.length).fill(0)
    quizEngine.quizState.value.askedQuestions = ['Order', 'Category', 'Cosmology']
    quizEngine.quizState.value.sessionAnswers = []
    quizEngine.quizState.value.convictionProfile = {}
    quizEngine.quizState.value.askedConcepts = new Set()
    quizEngine.quizState.value.dontKnowCount = 0
    quizEngine.quizState.value.questionNumber = 0
    quizEngine.quizState.value.questionHistory = []
    
    // Simulate the quiz by answering each question in sequence
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i]
      
      // Find the next question using the quiz engine logic
      const nextQuestionFound = await quizEngine.findNextQuestion()
      if (!nextQuestionFound || !quizEngine.currentQuestion.value) {
        console.warn(`Could not find question ${i + 1} during permalink reconstruction`)
        break
      }
      
      // Answer the current question
      await quizEngine.answerQuestion(answer)
    }
    
    console.log(`Reconstructed quiz state from permalink with ${answers.length} answers`)
  } catch (err) {
    console.error('Error reconstructing quiz from permalink:', err)
    throw err
  }
}

onMounted(async () => {
  try {
    // Ensure quiz engine is initialized
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        error.value = 'Failed to initialize quiz engine'
        return
      }
    }

    // Check for permalink answers in URL
    const route = useRoute()
    const answersParam = route.query.answers as string
    
    if (answersParam) {
      // Reconstruct quiz state from permalink
      await reconstructQuizFromPermalink(answersParam)
    }

    // Get results
    const quizResults = quizEngine.getResults()
    
    if (quizResults.length === 0) {
      error.value = 'No quiz results found. Please take the quiz first.'
    } else {
      results.value = quizResults
    }
  } catch (err) {
    error.value = `Error loading results: ${err}`
  } finally {
    isLoading.value = false
  }
})

const retakeQuiz = () => {
  // Reset quiz state and go to home
  window.location.href = '/'
}

const shareResults = async () => {
  if (results.value.length === 0) return
  
  const topResult = results.value[0]
  const text = `I just discovered my philosophical worldview: ${topResult.cosmology} (${topResult.category}). Take the Cosmology Quiz to find yours!`
  const permalinkUrl = generatePermalink()
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Philosophical Worldview',
        text,
        url: permalinkUrl
      })
    } catch (err) {
      // Fallback to clipboard
      copyToClipboard(`${text} ${permalinkUrl}`)
    }
  } else {
    // Fallback to clipboard
    copyToClipboard(`${text} ${permalinkUrl}`)
  }
}

const generatePermalink = (): string => {
  const sessionAnswers = quizEngine.quizState.value.sessionAnswers
  
  if (sessionAnswers.length === 0) {
    return window.location.origin
  }
  
  // Encode answers as readable string: Y=Y, N=N, ?=U (uncertain)
  const answerString = sessionAnswers.map(sa => {
    switch (sa.answer) {
      case 'Y': return 'Y'
      case 'N': return 'N' 
      case '?': return 'U'
      default: return 'N'
    }
  }).join('')
  
  // Create permalink URL
  const baseUrl = window.location.origin
  return `${baseUrl}/results?answers=${answerString}`
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could show a toast notification here
    console.log('Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

const toggleFavorite = (cosmologyName: string) => {
  if (favoriteCosmology.value === cosmologyName) {
    favoriteCosmology.value = null // Remove favorite
  } else {
    favoriteCosmology.value = cosmologyName // Set new favorite
  }
}

const getDisplayRank = (result: any, index: number) => {
  if (!favoriteCosmology.value) {
    return index + 2 // Normal ranking (2, 3, 4, 5)
  }
  
  // If we have a favorite, we need to show the original rank
  const originalIndex = results.value.findIndex(r => r.cosmology === result.cosmology)
  return originalIndex + 1
}

const copyPermalink = () => {
  showPermalink.value = !showPermalink.value
  if (showPermalink.value) {
    nextTick(() => {
      selectPermalinkText()
    })
  }
}

const selectPermalinkText = () => {
  if (permalinkInput.value) {
    permalinkInput.value.select()
  }
}

const copyPermalinkToClipboard = async () => {
  const permalinkUrl = generatePermalink()
  await copyToClipboard(permalinkUrl)
  // Could show a toast notification here
}
</script>

<style scoped>
.heart-button {
  @apply text-gray-400 hover:text-pink-400 cursor-pointer;
  transition: all 0.3s ease;
}

.heart-button:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.3));
}

.heart-active {
  @apply text-pink-500;
  filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.6));
}

.heart-pulse {
  animation: heartPulse 1.5s ease-in-out infinite;
}

.heart-small {
  @apply opacity-60 hover:opacity-100;
}

@keyframes heartPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

/* Add a subtle glow effect when heart is active */
.heart-active svg {
  filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.8));
}
</style>