<template>
  <div class="cosmic-card">
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
      🎯 Your Primary Worldview
    </h2>
    
    <div class="bg-gradient-to-r from-cosmic-blue/20 to-cosmic-purple/20 rounded-lg p-6 border border-cosmic-gold/30">
      <h3 class="text-3xl font-bold text-white mb-3">{{ topResult.cosmology }}</h3>
      
      <p class="text-cosmic-gold text-lg mb-4 italic">
        {{ getCategoryDescription(topResult.category) }}
      </p>
      
      <div v-if="uniqueAspects.length > 0" class="mb-4">
        <h4 class="text-white font-semibold mb-2">What distinguishes your perspective:</h4>
        <ul class="space-y-1">
          <li 
            v-for="aspect in uniqueAspects.slice(0, 2)" 
            :key="aspect"
            class="text-gray-300 text-sm flex items-start"
          >
            <span class="text-cosmic-gold mr-2">•</span>
            {{ aspect }}
          </li>
        </ul>
      </div>
      
      <div class="flex items-center justify-between pt-4 border-t border-white/20">
        <div>
          <div class="text-sm text-gray-400">Match Confidence</div>
          <div class="text-xl font-bold text-cosmic-gold">{{ Math.round(confidence * 100) }}%</div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-400">Based on</div>
          <div class="text-xl font-bold text-white">{{ questionCount }} questions</div>
        </div>
      </div>
      
      <p class="text-sm text-gray-300 mt-4">
        {{ getConfidenceContext(confidence, questionCount) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizResult } from '~/types'

interface Props {
  topResult: QuizResult
  fullDescriptions: Record<string, string>
  questionCount: number
}

const props = defineProps<Props>()

const confidence = computed(() => {
  // Calculate confidence based on question count and score
  const baseConfidence = Math.min(0.9, props.questionCount * 0.1)
  
  // Adjust based on relative score dominance
  // This is simplified - in full implementation would use actual score ratios
  return Math.min(0.95, baseConfidence * 0.8 + 0.15)
})

const uniqueAspects = computed(() => {
  // Simplified unique aspects mapping
  const aspects: Record<string, string[]> = {
    'Emanationist Panentheism': [
      'Reality flows out from divine source while remaining connected',
      'Creation occurs in levels or emanations of divine being'
    ],
    'Participatory Panentheism': [
      'Universe participates in divine reality through consciousness',
      'Direct experience of existing within divine presence'
    ],
    'Classical Pantheism': [
      'God and Nature are identical - one substance, two perspectives',
      'Everything that exists is divine substance expressing itself'
    ],
    'Scientific Pantheism': [
      'Universe revealed by science is itself worthy of reverence',
      'Spiritual meaning found in natural processes and cosmic evolution'
    ],
    'Universal Mind': [
      'Individual consciousness participates in cosmic consciousness',
      'Mental reality is more fundamental than physical processes'
    ]
  }
  
  return aspects[props.topResult.cosmology] || []
})

const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    'Panentheism': 'The divine both permeates and transcends the universe',
    'Pantheism': 'The universe itself is sacred and divine',
    'Traditional African Cosmologies': 'Reality operates through visible and invisible forces understood through traditional wisdom',
    'Consciousness-First': 'Consciousness is the fundamental aspect of reality, not an emergent property',
    'Information-Theoretic Cosmology': 'Reality emerges from information, computation, or mathematical structures',
    'Traditional Daoist Cosmology': 'The universe flows through natural patterns of balance and complementarity',
    'Scientific Materialism': 'Physical processes and natural laws fully explain reality',
    'Gnosticism/Esoteric Dualism': 'Hidden spiritual knowledge reveals reality beyond material appearances'
  }
  
  return descriptions[category] || category
}

const getConfidenceContext = (confidence: number, questionCount: number): string => {
  if (confidence >= 0.85) {
    return '🎯 Strong alignment - This perspective clearly matches your responses'
  } else if (confidence >= 0.7) {
    return '✓ Good fit - This perspective aligns well with your worldview'
  } else if (questionCount <= 10) {
    return '🤔 Close match - Consider exploring related perspectives as well'
  } else {
    return '📍 Tentative match - Your worldview may span multiple traditions'
  }
}
</script>