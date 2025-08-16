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
        <h2 class="text-xl font-bold text-white mb-4">Question {{ progress.questionNumber + 1 }}</h2>
        <h3 class="text-lg text-white mb-4">{{ currentQuestion.question.question }}</h3>
        <p class="text-gray-300 mb-6">{{ currentQuestion.question.clarification }}</p>
        
        <div class="flex gap-4">
          <button @click="handleAnswer('Y')" class="bg-green-600 text-white px-4 py-2 rounded">
            Yes
          </button>
          <button @click="handleAnswer('N')" class="bg-red-600 text-white px-4 py-2 rounded">
            No
          </button>
          <button @click="handleAnswer('?')" class="bg-gray-600 text-white px-4 py-2 rounded">
            Don't Know
          </button>
          <button @click="handleAnswer('B')" class="bg-blue-600 text-white px-4 py-2 rounded" :disabled="!canGoBack">
            Back
          </button>
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

    <!-- Conceptual Profile -->
    <ConceptualProfile 
      v-if="hasConvictions"
      :conviction-profile="quizEngine.quizState.value.convictionProfile"
      :updated-concepts="recentlyUpdatedConcepts"
      class="mt-8"
    />

    <!-- Uncertainty Guidance -->
    <div v-if="showUncertaintyGuidance" class="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 class="text-yellow-400 font-semibold mb-1">Uncertainty Guidance</h3>
          <p class="text-yellow-200 text-sm">
            You've answered "Don't know" {{ quizEngine.quizState.value.dontKnowCount }} times recently. 
            Consider what feels most authentic to your lived experience, even if you're not completely certain.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizAnswer } from '~/types'
import { CONFIG } from '~/types'

const quizEngine = useQuizEngine()

const recentlyUpdatedConcepts = ref<Set<string>>(new Set())

const currentQuestion = computed(() => {
  const question = quizEngine.currentQuestion.value
  console.log('UI currentQuestion computed:', question ? `"${question.key}"` : 'null')
  return question
})
const progress = computed(() => quizEngine.getProgress())
const canGoBack = computed(() => quizEngine.quizState.value.questionHistory.length > 0)
const hasConvictions = computed(() => Object.keys(quizEngine.quizState.value.convictionProfile).length > 0)
const showUncertaintyGuidance = computed(() => quizEngine.quizState.value.dontKnowCount >= CONFIG.MAX_DONT_KNOW_STREAK)

const isComplete = computed(() => {
  // Don't mark as complete if quiz engine isn't initialized yet
  if (!quizEngine.isInitialized.value) {
    console.log('Quiz not complete: not initialized')
    return false
  }
  
  // Don't mark as complete until we've asked at least one question
  if (quizEngine.quizState.value.questionNumber === 0 && !currentQuestion.value) {
    console.log('Quiz not complete: no questions asked yet, waiting for first question')
    return false
  }
  
  const shouldStop = quizEngine.shouldStopQuiz()
  const noQuestion = !currentQuestion.value
  const hasAskedQuestions = quizEngine.quizState.value.questionNumber > 0
  
  console.log('Quiz completion check:', {
    shouldStop,
    noQuestion,
    hasAskedQuestions,
    currentQuestionExists: !!currentQuestion.value,
    questionNumber: quizEngine.quizState.value.questionNumber
  })
  
  const isComplete = shouldStop || (noQuestion && hasAskedQuestions)
  console.log('Quiz is complete:', isComplete)
  return isComplete
})

const handleAnswer = async (answer: QuizAnswer) => {
  if (!currentQuestion.value) return

  // Track which concepts were updated for highlighting
  const beforeConcepts = new Set(Object.keys(quizEngine.quizState.value.convictionProfile))
  
  if (answer === 'B') {
    // Handle back
    const success = quizEngine.quizState.value.questionHistory.length > 0
    if (success) {
      await quizEngine.answerQuestion(answer)
    }
    recentlyUpdatedConcepts.value.clear()
  } else {
    // Handle regular answer
    const question = currentQuestion.value.question
    const newConcepts = new Set<string>()
    
    if (answer !== '?') {
      for (const concept of question.concepts) {
        newConcepts.add(concept.tag)
      }
    }

    await quizEngine.answerQuestion(answer)
    recentlyUpdatedConcepts.value = newConcepts
  }

  // Clear updated concepts after a delay
  setTimeout(() => {
    recentlyUpdatedConcepts.value.clear()
  }, 3000)
}

const showResults = () => {
  navigateTo('/results')
}
</script>