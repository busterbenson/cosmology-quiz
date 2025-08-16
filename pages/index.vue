<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cosmic-gold via-cosmic-purple to-cosmic-blue bg-clip-text text-transparent mb-6">
          Cosmology Quiz
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Discover your philosophical worldview through intelligent questioning about reality, consciousness, and existence.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="cosmic-card text-center">
        <div class="animate-spin w-8 h-8 border-4 border-cosmic-purple border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-300">Loading quiz data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="cosmic-card text-center">
        <div class="text-red-400 mb-4">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p class="text-red-400 font-semibold mb-2">Failed to Load Quiz Data</p>
        <p class="text-gray-400 text-sm mb-4">{{ error }}</p>
        <button @click="initializeQuiz" class="cosmic-button">
          Try Again
        </button>
      </div>

      <!-- Quiz Ready -->
      <div v-else-if="!quizStarted" class="cosmic-card text-center">
        <div class="mb-8">
          <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.071 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-4">Ready to Begin</h2>
          <p class="text-gray-300 mb-6 leading-relaxed">
            This quiz uses advanced information theory to intelligently select questions that best reveal your philosophical worldview. 
            Each question builds on your previous answers to narrow down your match from {{ cosmologyCount }} different cosmologies.
          </p>
          
          <div class="grid md:grid-cols-3 gap-4 mb-8 text-sm">
            <div class="bg-white/5 rounded-lg p-4">
              <div class="text-cosmic-gold font-semibold mb-1">Intelligent</div>
              <div class="text-gray-400">Questions adapt to your responses</div>
            </div>
            <div class="bg-white/5 rounded-lg p-4">
              <div class="text-cosmic-purple font-semibold mb-1">Comprehensive</div>
              <div class="text-gray-400">{{ cosmologyCount }} philosophical worldviews</div>
            </div>
            <div class="bg-white/5 rounded-lg p-4">
              <div class="text-cosmic-blue font-semibold mb-1">Efficient</div>
              <div class="text-gray-400">10-20 targeted questions</div>
            </div>
          </div>
        </div>

        <button @click="startQuiz" class="cosmic-button text-lg px-8 py-3">
          Start Quiz
        </button>
        
        <p class="text-sm text-gray-400 mt-4">
          Answer with (Y)es, (N)o, (?)Don't know, or (B)ack to previous question
        </p>
      </div>

      <!-- Quiz Interface -->
      <div v-else>
        <QuizInterface />
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-16 text-center text-gray-500 text-sm">
      <p>Enhanced with information theory optimization and bidirectional conviction tracking</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Discover Your Philosophical Worldview'
})

const quizEngine = useQuizEngine()

const isLoading = ref(true)
const error = ref<string | null>(null)
const quizStarted = ref(false)

const cosmologyCount = computed(() => quizEngine.cosmologies.value.length)

const initializeQuiz = async () => {
  isLoading.value = true
  error.value = null

  try {
    const success = await quizEngine.initialize()
    if (!success) {
      error.value = 'Failed to initialize quiz engine'
    }
  } catch (err) {
    error.value = `Initialization error: ${err}`
  } finally {
    isLoading.value = false
  }
}

const startQuiz = () => {
  quizStarted.value = true
}

// Initialize on mount
onMounted(() => {
  initializeQuiz()
})
</script>