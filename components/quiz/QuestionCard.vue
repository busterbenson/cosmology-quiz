<template>
  <div>
    <!-- Question Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center text-white font-bold">
          {{ questionNumber }}
        </div>
        <h2 class="text-xl font-semibold text-white">Question {{ questionNumber }}</h2>
      </div>
      
      <!-- Impact preview (debug mode) -->
      <div v-if="showImpact" class="text-xs text-gray-400 text-right">
        <div>Yes eliminates: {{ questionData.impact.yesEliminated }}</div>
        <div>No eliminates: {{ questionData.impact.noEliminated }}</div>
        <div>Predicted: {{ Math.round(questionData.impact.pYes * 100) }}% Yes</div>
      </div>
    </div>

    <!-- Question Text -->
    <div class="mb-6">
      <h3 class="text-2xl font-semibold text-white mb-4 leading-relaxed">
        {{ questionData.question.question }}
      </h3>
      
      <div class="bg-white/5 rounded-lg p-4 border-l-4 border-cosmic-gold">
        <h4 class="text-cosmic-gold font-semibold mb-2">Clarification:</h4>
        <p class="text-gray-300 leading-relaxed">
          {{ questionData.question.clarification }}
        </p>
      </div>
    </div>

    <!-- Concepts Preview -->
    <div v-if="questionData.question.concepts.length > 0" class="mb-6">
      <div class="text-sm text-gray-400 mb-2">This question relates to:</div>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="concept in questionData.question.concepts" 
          :key="concept.tag"
          class="px-3 py-1 bg-white/10 rounded-full text-xs"
          :class="concept.polarity === 'pro' ? 'text-green-300' : 'text-red-300'"
        >
          {{ concept.tag }} ({{ concept.polarity }})
        </span>
      </div>
    </div>

    <!-- Answer Buttons -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button 
        @click="$emit('answer', 'Y')"
        class="cosmic-button bg-green-600 hover:bg-green-500 border-0 py-4 text-center"
      >
        <div class="font-bold text-lg">Yes</div>
        <div class="text-xs opacity-80">Y</div>
      </button>
      
      <button 
        @click="$emit('answer', 'N')"
        class="cosmic-button bg-red-600 hover:bg-red-500 border-0 py-4 text-center"
      >
        <div class="font-bold text-lg">No</div>
        <div class="text-xs opacity-80">N</div>
      </button>
      
      <button 
        @click="$emit('answer', '?')"
        class="cosmic-button-secondary py-4 text-center"
      >
        <div class="font-bold text-lg">Don't Know</div>
        <div class="text-xs opacity-80">?</div>
      </button>
      
      <button 
        @click="$emit('answer', 'B')"
        :disabled="!canGoBack"
        class="cosmic-button-secondary py-4 text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div class="font-bold text-lg">Back</div>
        <div class="text-xs opacity-80">B</div>
      </button>
    </div>

    <!-- Keyboard shortcuts hint -->
    <div class="mt-4 text-center text-xs text-gray-500">
      You can also use keyboard shortcuts: Y, N, ?, B
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizAnswer } from '~/types'

interface Props {
  questionData: {
    key: string
    question: any
    impact: any
  }
  questionNumber: number
  canGoBack: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  answer: [answer: QuizAnswer]
}>()

// Show impact in development mode
const showImpact = process.dev

// Handle keyboard shortcuts
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    
    if (key === 'y') {
      emit('answer', 'Y')
    } else if (key === 'n') {
      emit('answer', 'N')
    } else if (key === '?' || key === '/') {
      emit('answer', '?')
    } else if (key === 'b') {
      emit('answer', 'B')
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>