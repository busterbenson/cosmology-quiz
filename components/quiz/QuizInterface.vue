<template>
  <div class="max-w-4xl mx-auto">
    <!-- Progress Bar -->
    <ProgressBar 
      :current="progress.questionNumber"
      :estimated-total="progress.estimatedTotal"
      :remaining="progress.remaining"
      :total="progress.total"
      :progress-percent="progress.progressPercent"
      class="mb-8"
    />

    <!-- Quiz Complete -->
    <div v-if="isComplete" class="cosmic-card text-center">
      <div class="mb-6">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
        <p class="text-gray-300">
          Based on your {{ quizEngine.quizState.value.questionNumber }} answers, we've identified your philosophical worldview.
        </p>
      </div>
      
      <button @click="showResults" class="cosmic-button text-lg px-8 py-3">
        View Results
      </button>
    </div>

    <!-- Current Question -->
    <div v-else-if="currentQuestion" class="cosmic-card">
      <div class="p-6">
        <h2 class="text-sm font-bold text-gray-400 mb-2">Question {{ progress.questionNumber + 1 }}</h2>
        <h3 class="text-2xl text-white mb-4">{{ currentQuestion.question.question }}</h3>
        <p class="text-gray-300 mb-8 text-base">{{ currentQuestion.question.clarification }}</p>
        
        <div class="flex flex-col">
          <div class="flex gap-4">
            <button @click="handleAnswer('Y')" class="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Yes
            </button>
            <button @click="handleAnswer('N')" class="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              No
            </button>
            <button @click="handleAnswer('?')" class="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Don't Know
            </button>
          </div>
          <div v-if="canGoBack" class="text-center mt-4">
            <button @click="handleAnswer('B')" class="text-gray-400 hover:underline text-sm" :disabled="!canGoBack">
              Back to previous question
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No More Questions (shouldn't happen) -->
    <div v-else class="cosmic-card text-center">
      <p class="text-gray-300 mb-4">No more questions available.</p>
      <button @click="showResults" class="cosmic-button">
        View Results
      </button>
    </div>

    <!-- Cosmology Constellation -->
    <div v-if="quizEngine.isInitialized.value && !isComplete" class="mt-8">
      <CosmologyConstellation
        :cosmologies="quizEngine.cosmologies.value"
        :scores="quizEngine.quizState.value.scores"
        :newly-eliminated="newlyEliminated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizAnswer } from '~/types'
import CosmologyConstellation from './CosmologyConstellation.vue'

const quizEngine = useQuizEngine()

const newlyEliminated = ref<string[]>([])

const currentQuestion = computed(() => quizEngine.currentQuestion.value)
const progress = computed(() => quizEngine.getProgress())
const canGoBack = computed(() => quizEngine.quizState.value.questionHistory.length > 0)

const isComplete = computed(() => {
  if (!quizEngine.isInitialized.value) return false
  if (quizEngine.quizState.value.questionNumber === 0 && !currentQuestion.value) return false
  
  const shouldStop = quizEngine.shouldStopQuiz()
  const noQuestion = !currentQuestion.value
  const hasAskedQuestions = quizEngine.quizState.value.questionNumber > 0
  
  return shouldStop || (noQuestion && hasAskedQuestions)
})

const handleAnswer = async (answer: QuizAnswer) => {
  if (!currentQuestion.value) return
  const result = await quizEngine.answerQuestion(answer)
  
  if (result && result.eliminatedCosmologies) {
    newlyEliminated.value = result.eliminatedCosmologies
  } else {
    newlyEliminated.value = []
  }
}

const showResults = () => {
  navigateTo('/results')
}
</script>