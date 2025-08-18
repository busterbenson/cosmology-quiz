<template>
  <div class="min-h-screen p-4 bg-gray-900 text-gray-200">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="cosmic-card text-center p-8">
        <div class="animate-spin w-8 h-8 border-4 border-cosmic-purple border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-300">Loading your results...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="cosmic-card text-center p-8">
        <p class="text-red-400 font-semibold mb-2">Unable to Generate Results</p>
        <p class="text-gray-400 text-sm mb-4">{{ error }}</p>
        <button @click="navigateTo('/')" class="cosmic-button">Start Over</button>
      </div>

      <!-- Results Display -->
      <div v-else-if="results.length > 0" class="space-y-8">
        <h1 class="text-4xl font-bold text-center bg-gradient-to-r from-cosmic-gold via-cosmic-purple to-cosmic-blue bg-clip-text text-transparent">
          Your Cosmology
        </h1>
        
        <!-- Top Section Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <!-- Left Column: Primary Result Card -->
          <div class="cosmic-card p-6 space-y-4">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                  {{ topResult.cosmology }}
                  <button @click="toggleFavorite(topResult.cosmology)" class="heart-button" :class="{'heart-active': favoriteCosmology === topResult.cosmology}">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </button>
                </h2>
              </div>
              <span class="text-2xl font-bold text-cosmic-gold">{{ topResult.score }}</span>
            </div>
            <div v-if="topResultDetails" class="text-gray-300 space-y-3">
              <p class="text-gray-300 text-base leading-relaxed">{{ topResultDetails.cosmologyDescription }}</p>
              <div class="p-3 bg-gray-900/50 rounded border border-gray-700">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-cosmic-gold">One of the <strong>{{ topResult.category }}</strong> cosmologies</h4>
                  <button @click="openModal(topResult)" class="cosmic-button-outline text-sm px-3 py-1">Details</button>
                </div>
                <p class="text-gray-400 text-sm italic mb-2">{{ topResultDetails.subtitle }}</p>
                <p class="text-gray-400 text-sm leading-relaxed">{{ topResultDetails.categoryDescription }}</p>
              </div>
            </div>
          </div>

          <!-- Right Column: Constellation -->
          <div class="cosmic-card p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-white">Your Cosmology Constellation</h3>
              <button 
                @click="downloadConstellation" 
                class="cosmic-button-outline text-sm px-3 py-1 flex items-center gap-2"
                title="Download constellation as image"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Download
              </button>
            </div>
            <CosmologyConstellation
              ref="constellationRef"
              v-if="quizEngine.isInitialized.value"
              :cosmologies="quizEngine.cosmologies.value"
              :scores="quizEngine.quizState.value.scores"
              :favorite-cosmology="favoriteCosmology"
            />
          </div>
        </div>

        <!-- Other Top Matches & Cosmological Profile -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="cosmic-card p-6">
              <h3 class="text-xl font-bold text-white mb-4">Other Top Matches</h3>
              <div class="space-y-3">
                <div v-for="result in otherResults" :key="result.cosmology" class="bg-white/5 rounded p-3 flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <span class="text-gray-400 font-bold w-6 text-center">{{ result.rank }}.</span>
                    <div>
                      <p class="text-white font-medium flex items-center gap-2">
                        {{ result.cosmology }}
                        <button @click="toggleFavorite(result.cosmology)" class="heart-button" :class="{'heart-active': favoriteCosmology === result.cosmology}">
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                      </p>
                      <p class="text-xs text-gray-400">{{ result.category }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-cosmic-gold font-bold">{{ result.score }}</span>
                    <button @click="openModal(result)" class="cosmic-button-outline text-sm px-3 py-1">Details</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Anti-Cosmology Section -->
            <div v-if="leastCompatibleResult" class="bg-pink-500/10 rounded-lg p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-red-400">🚫 Your Anti-Cosmology</h3>
                <span class="text-red-400 font-bold text-lg">{{ leastCompatibleResult.score }}</span>
              </div>
              <div class="text-sm text-red-200/70 mb-2">{{ leastCompatibleResult.category }}</div>
              <p class="text-red-300 font-medium text-lg mb-2">{{ leastCompatibleResult.cosmology }}</p>
              <p class="text-sm text-red-200/80 leading-relaxed">
                {{ quizEngine.summaries.value[leastCompatibleResult.cosmology] || `A ${leastCompatibleResult.category} worldview` }}
              </p>
            </div>
          </div>
          <div v-if="Object.keys(quizEngine.quizState.value.convictionProfile).length > 0" class="cosmic-card p-6 self-start">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-bold text-white">Your Cosmological Profile</h3>
                <div class="text-xs text-gray-400">
                  <span class="text-red-300">●</span> Against · <span class="text-green-300">●</span> For
                </div>
              </div>
              <div class="space-y-1.5">
                <div v-for="item in orderedConvictionProfile" :key="item.concept" class="bg-white/5 rounded px-3 py-2">
                  <div class="flex items-center justify-between">
                    <span class="capitalize text-sm font-medium flex-1 min-w-0 truncate"
                          :class="{
                            'text-green-400': item.netScore > 0,
                            'text-red-400': item.netScore < 0,
                            'text-gray-400': item.netScore === 0
                          }">
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
        <div class="text-center space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="retakeQuiz" class="cosmic-button">Retake Quiz</button>
            <button @click="shareResults" class="cosmic-button-secondary">Share Results</button>
            <button @click="copyPermalink" class="cosmic-button-outline">Copy Permalink</button>
          </div>
          <div class="text-sm text-gray-400">
            Results based on {{ quizEngine.quizState.value.questionNumber }} questions
          </div>
          <div v-if="showPermalink" class="mt-6 p-4 bg-white/5 rounded-lg border border-cosmic-gold/30 max-w-lg mx-auto">
            <div class="text-sm text-gray-300 mb-2">Permalink to your results:</div>
            <div class="flex items-center gap-2">
              <input 
                ref="permalinkInput"
                :value="generatePermalink()" 
                readonly 
                class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded text-sm text-white"
                @click="selectPermalinkText"
              />
              <button @click="copyPermalinkToClipboard" class="px-3 py-2 bg-cosmic-purple hover:bg-cosmic-purple/80 rounded text-sm text-white transition-colors">
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CosmologyDetailsModal 
      :show="isModalOpen"
      :cosmology="selectedCosmology"
      :full-descriptions="quizEngine.fullDescriptions.value"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import CosmologyConstellation from '~/components/quiz/CosmologyConstellation.vue'
import CosmologyDetailsModal from '~/components/results/CosmologyDetailsModal.vue'
import BiDirectionalDots from '~/components/common/BiDirectionalDots.vue'
import type { QuizResult } from '~/types'

useHead({ title: 'Your Cosmology Quiz Results' })

const quizEngine = useQuizEngine()
const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const error = ref<string | null>(null)
const results = ref<QuizResult[]>([])
const favoriteCosmology = ref<string | null>(null)
const showPermalink = ref(false)
const permalinkInput = ref<HTMLInputElement | null>(null)

const isModalOpen = ref(false)
const selectedCosmology = ref<QuizResult | null>(null)
const constellationRef = ref<InstanceType<typeof CosmologyConstellation> | null>(null)

const topResult = computed(() => {
  if (!favoriteCosmology.value) return results.value[0]
  const fav = results.value.find(r => r.cosmology === favoriteCosmology.value)
  return fav || results.value[0]
})

const otherResults = computed(() => {
  const top10 = results.value.slice(0, 10)
  if (!favoriteCosmology.value) return top10.slice(1).map((r, i) => ({ ...r, rank: i + 2 }))
  
  return top10
    .filter(r => r.cosmology !== favoriteCosmology.value)
    .map((r, i) => ({ ...r, rank: results.value.findIndex(res => res.cosmology === r.cosmology) + 1 }))
})

const parseDescription = (categoryName: string, cosmologyName: string) => {
  const fullText = quizEngine.fullDescriptions.value[categoryName.toUpperCase()]
  if (!fullText) return null

  const subtitleMatch = fullText.match(/_(.+?)_/) 
  const categoryDescriptionMatch = fullText.match(/_(.+?)_\n\n([\s\S]+?)\n\n_Which/)
  
  // Escape special characters in the cosmology name to safely use it in a RegExp
  const escapedCosmologyName = cosmologyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const cosmologyRegex = new RegExp(`\\*\\*${escapedCosmologyName}\\*\\* – ([^\\n]+)`)
  const cosmologyDescriptionMatch = fullText.match(cosmologyRegex)

  return {
    subtitle: subtitleMatch ? subtitleMatch[1].trim() : '',
    categoryDescription: categoryDescriptionMatch ? categoryDescriptionMatch[2].trim() : '',
    cosmologyDescription: cosmologyDescriptionMatch ? cosmologyDescriptionMatch[1].trim() : 'Details not found.'
  }
}

const topResultDetails = computed(() => {
  if (results.value.length > 0) {
    return parseDescription(topResult.value.category, topResult.value.cosmology)
  }
  return null
})

const orderedConvictionProfile = computed(() => {
  const profile = quizEngine.quizState.value.convictionProfile
  return Object.entries(profile).map(([concept, counts]) => ({
    concept,
    counts,
    netScore: counts.pro - counts.con
  })).sort((a, b) => b.netScore - a.netScore)
})

const maxConvictionStrength = computed(() => {
  const profile = quizEngine.quizState.value.convictionProfile
  let max = 0
  for (const counts of Object.values(profile)) {
    max = Math.max(max, counts.pro, counts.con)
  }
  return max
})

const leastCompatibleResult = computed(() => {
  if (!quizEngine.isInitialized.value) return null
  const allCosmologies = quizEngine.cosmologies.value
  const allScores = quizEngine.quizState.value.scores
  if (allCosmologies.length === 0 || allScores.length === 0) return null
  
  const lowestScore = Math.min(...allScores)
  const tiedCosmologies = allCosmologies
    .map((cosmology, i) => ({
      cosmology: cosmology.Cosmology,
      category: cosmology.Category,
      score: allScores[i]
    }))
    .filter(c => c.score === lowestScore)
  
  return tiedCosmologies[0] || null
})

const openModal = (cosmology: QuizResult) => {
  selectedCosmology.value = cosmology
  isModalOpen.value = true
}

const downloadConstellation = async () => {
  if (constellationRef.value?.downloadConstellation) {
    await constellationRef.value.downloadConstellation()
  }
}

const updateURL = () => {
  const query: { answers?: string; favorite?: string } = {}
  const sessionAnswers = quizEngine.quizState.value.sessionAnswers
  if (sessionAnswers.length > 0) {
    query.answers = sessionAnswers.map(sa => `${sa.questionId}${sa.answer}`).join('.')
  }
  if (favoriteCosmology.value) {
    query.favorite = favoriteCosmology.value
  }
  router.replace({ query: query as any })
}

const toggleFavorite = (cosmologyName: string) => {
  if (favoriteCosmology.value === cosmologyName) {
    favoriteCosmology.value = null
  } else {
    favoriteCosmology.value = cosmologyName
  }
  updateURL()
}

const retakeQuiz = () => {
  window.location.href = '/'
}

const generatePermalink = (): string => {
  const baseUrl = window.location.origin
  const query = { ...route.query }
  if (favoriteCosmology.value) {
    query.favorite = favoriteCosmology.value
  }
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  return `${baseUrl}/results?${queryString}`
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

const shareResults = async () => {
  if (results.value.length === 0) return
  const text = `I just discovered my philosophical worldview: ${topResult.value.cosmology} (${topResult.value.category}). Take the Cosmology Quiz to find yours!`
  const permalinkUrl = generatePermalink()
  
  if (navigator.share) {
    await navigator.share({ title: 'My Philosophical Worldview', text, url: permalinkUrl })
  } else {
    await copyToClipboard(`${text} ${permalinkUrl}`)
  }
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
  permalinkInput.value?.select()
}

const copyPermalinkToClipboard = async () => {
  const permalinkUrl = generatePermalink()
  await copyToClipboard(permalinkUrl)
}

const reconstructQuizFromPermalink = async (answersParam: string) => {
  // Clean the parameter to handle trailing spaces, backslashes, or other characters
  const cleanParam = answersParam.trim().replace(/[\\\/\s]+$/, '').replace(/\s+/g, '')
  
  console.log('Original answers param:', answersParam)
  console.log('Cleaned answers param:', cleanParam)
  
  const answerPairs = cleanParam.split('.').filter(pair => pair.length > 1).map(pair => {
    // Handle pairs like "70Y", "71Y", etc.
    const answerChar = pair.slice(-1).toUpperCase()
    const idStr = pair.slice(0, -1)
    const id = parseInt(idStr, 10)
    
    let answer: 'Y' | 'N' | '?' = 'N'
    if (answerChar === 'Y') answer = 'Y'
    if (answerChar === 'N') answer = 'N'
    if (answerChar === 'U') answer = '?'
    
    console.log(`Parsing pair "${pair}": id=${id}, answer=${answer}`)
    return { id, answer }
  }).filter(pair => !isNaN(pair.id) && pair.id > 0) // Filter out invalid IDs

  console.log('Final answer pairs:', answerPairs)
  await quizEngine.reconstructQuiz(answerPairs)
}

onMounted(async () => {
  isLoading.value = true
  try {
    if (!quizEngine.isInitialized.value) {
      await quizEngine.initialize()
    }

    if (route.query.answers) {
      await reconstructQuizFromPermalink(route.query.answers as string)
    }

    const quizResults = quizEngine.getResults()
    if (quizResults.length === 0) {
      error.value = 'No quiz results found. Please take the quiz first.'
    } else {
      results.value = quizResults
      if (route.query.favorite) {
        favoriteCosmology.value = route.query.favorite as string
      }
    }
  } catch (err: any) {
    error.value = `Error loading results: ${err.message}`
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.heart-button {
  @apply text-gray-400 hover:text-pink-400 cursor-pointer;
  transition: all 0.3s ease;
}
.heart-active {
  @apply text-pink-500;
  filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.6));
  animation: heartPulse 1.5s ease-in-out infinite;
}
@keyframes heartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>