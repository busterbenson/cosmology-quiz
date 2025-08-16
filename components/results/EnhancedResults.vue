<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cosmic-gold via-cosmic-purple to-cosmic-blue bg-clip-text text-transparent mb-4">
        Your Philosophical Worldview
      </h1>
      <div class="w-24 h-1 bg-gradient-to-r from-cosmic-blue to-cosmic-gold mx-auto"></div>
    </div>

    <!-- 1. Core Identity -->
    <CoreIdentity 
      :top-result="results[0]"
      :full-descriptions="fullDescriptions"
      :question-count="questionCount"
    />

    <!-- 2. Philosophical Spectrum -->
    <PhilosophicalSpectrum 
      :results="results.slice(0, 15)"
    />

    <!-- 3. Cosmological Profile -->
    <CosmologicalProfile 
      :conviction-profile="convictionProfile"
    />

    <!-- 4. Understanding Your Match -->
    <div v-if="hasNoClearTie" class="cosmic-card">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
        📖 Understanding Your Match
      </h2>
      <div class="bg-white/5 rounded-lg p-6">
        <p class="text-gray-300 leading-relaxed" v-html="formatDescription(matchDescription)"></p>
      </div>
    </div>

    <!-- 4. Alternative: Tie Resolution -->
    <div v-else class="cosmic-card">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
        🤝 Resonant Perspectives
      </h2>
      <p class="text-gray-300 mb-6">
        Your responses align equally with {{ tiedResults.length }} perspectives:
      </p>
      
      <div class="space-y-4">
        <div 
          v-for="(result, index) in tiedResults" 
          :key="result.cosmology"
          class="bg-white/5 rounded-lg p-4"
        >
          <h3 class="text-xl font-semibold text-white mb-2">
            {{ String.fromCharCode(65 + index) }}) {{ result.cosmology }}
          </h3>
          <p class="text-cosmic-gold text-sm mb-2">{{ result.category }}</p>
          <p class="text-gray-300 text-sm">
            {{ getCosmologyEssence(result.cosmology, result.category) }}
          </p>
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg">
        <p class="text-white text-sm">
          <strong>Reflection:</strong> All of these perspectives reflect valid aspects of your worldview. 
          Consider exploring each to see which resonates most deeply with your lived experience.
        </p>
      </div>
    </div>

    <!-- 5. Top 10 Cosmologies -->
    <TopCosmologiesList 
      :results="results.slice(0, 10)"
      :summaries="summaries"
    />
  </div>
</template>

<script setup lang="ts">
import type { ConvictionProfile, QuizResult } from '~/types'

interface Props {
  results: QuizResult[]
  convictionProfile: ConvictionProfile
  summaries: Record<string, string>
  fullDescriptions: Record<string, string>
  questionCount: number
}

const props = defineProps<Props>()

const tiedResults = computed(() => {
  if (props.results.length < 2) return []
  
  const topScore = props.results[0].score
  return props.results.filter(r => r.score === topScore)
})

const hasNoClearTie = computed(() => {
  return tiedResults.value.length <= 1 || tiedResults.value.length > 4
})

const matchDescription = computed(() => {
  if (props.results.length === 0) return ''
  
  const topResult = props.results[0]
  return props.fullDescriptions[topResult.category.toUpperCase()] || 
         `A ${topResult.category} perspective on reality and existence.`
})

const formatDescription = (text: string): string => {
  // Basic formatting: make bold text and add line breaks
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\n\n/g, '</p><p class="mt-4">')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
}

const getCosmologyEssence = (cosmology: string, category: string): string => {
  // Simplified essence mapping - in full implementation this would be more comprehensive
  const essences: Record<string, string> = {
    'Emanationist Panentheism': 'Reality flows from divine source while remaining within it',
    'Participatory Panentheism': 'Universe participates in divine reality through consciousness',
    'Process Panentheism': 'God and world co-create reality through dynamic relationship',
    'Classical Pantheism': 'God and Nature are one substance viewed from different perspectives',
    'Scientific Pantheism': 'The universe revealed by science is itself sacred and worthy of reverence',
    'Universal Mind': 'Individual consciousness participates in cosmic consciousness',
    'Mind-Shaped Reality': 'Consciousness structures and creates physical reality'
  }
  
  return essences[cosmology] || `A perspective within ${category}`
}
</script>