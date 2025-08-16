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
                  <h2 class="text-xl font-bold text-white">{{ results[0].cosmology }}</h2>
                  <p class="text-cosmic-gold text-sm">{{ results[0].category }}</p>
                </div>
                <span class="text-cosmic-gold font-bold text-lg">{{ results[0].score }}</span>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                {{ quizEngine.summaries.value[results[0].cosmology] || `A ${results[0].category} worldview` }}
              </p>
            </div>
            
            <!-- Other Top Results -->
            <div>
              <h3 class="text-lg font-bold text-white mb-3">Other Top Matches</h3>
              <div class="space-y-2">
                <div v-for="(result, index) in results.slice(1, 5)" :key="result.cosmology" 
                     class="bg-white/5 rounded px-3 py-2.5">
                  <div class="flex justify-between items-start mb-1">
                    <span class="text-white font-medium text-sm">{{ index + 2 }}. {{ result.cosmology }}</span>
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
                  <h3 class="text-sm font-bold text-red-400">📍 Least Compatible</h3>
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
          </div>
          
          <div class="text-sm text-gray-400">
            Results based on {{ quizEngine.quizState.value.questionNumber }} questions
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

const leastCompatibleResult = computed(() => {
  if (results.value.length === 0) return null
  
  // Get all results from the quiz engine (not just top matches)
  const allResults = quizEngine.getResults()
  if (allResults.length === 0) return null
  
  // Find the one with the lowest score
  return allResults[allResults.length - 1] // Results are sorted by score desc, so last is lowest
})

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
  const url = window.location.origin
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Philosophical Worldview',
        text,
        url
      })
    } catch (err) {
      // Fallback to clipboard
      copyToClipboard(`${text} ${url}`)
    }
  } else {
    // Fallback to clipboard
    copyToClipboard(`${text} ${url}`)
  }
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
</script>