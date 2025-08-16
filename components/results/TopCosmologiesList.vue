<template>
  <div class="cosmic-card">
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
      📋 Top 10 Cosmologies
    </h2>
    
    <div class="space-y-4">
      <div 
        v-for="(result, index) in results" 
        :key="result.cosmology"
        class="bg-white/5 rounded-lg p-4 border border-white/10"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white mb-1">
              {{ index + 1 }}. {{ result.cosmology }}
            </h3>
            <p class="text-cosmic-gold text-sm mb-2">({{ result.category }})</p>
          </div>
          <div class="flex-shrink-0 ml-4">
            <ScoreIndicator :score="result.score" :max-score="maxScore" />
          </div>
        </div>
        
        <p class="text-gray-300 text-sm leading-relaxed">
          {{ getDescription(result.cosmology, result.category) }}
        </p>
        
        <div class="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
          <div class="text-xs text-gray-400">
            Score: {{ result.score }}
          </div>
          <div class="text-xs text-gray-400">
            Rank: #{{ index + 1 }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
      <p class="text-gray-300 text-sm text-center">
        These represent your compatibility with different philosophical worldviews based on your quiz responses.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizResult } from '~/types'

interface Props {
  results: QuizResult[]
  summaries: Record<string, string>
}

const props = defineProps<Props>()

const maxScore = computed(() => {
  return Math.max(...props.results.map(r => r.score), 1)
})

const getDescription = (cosmology: string, category: string): string => {
  // First try to get from summaries
  const summary = props.summaries[cosmology]
  if (summary) {
    return summary
  }
  
  // Fallback to category-based description
  return `A worldview within ${category}`
}
</script>