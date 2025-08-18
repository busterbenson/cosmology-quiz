<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <a href="/">
          <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cosmic-gold via-cosmic-purple to-cosmic-blue bg-clip-text text-transparent mb-6 pb-2">
            Cosmology Quiz
          </h1>
        </a>
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
      <div v-else-if="!quizStarted" class="text-center">
        <div class="flex justify-center items-center space-x-4">
          <button @click="startQuiz" class="cosmic-button text-2xl px-12 py-4">
            Start Quiz
          </button>
          <NuxtLink to="/browse" class="cosmic-button-secondary text-xl px-8 py-4">
            Browse Cosmologies
          </NuxtLink>
        </div>
      </div>

      <!-- Quiz Interface -->
      <div v-else>
        <QuizInterface />
      </div>
    </div>
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
onMounted(async () => {
  await initializeQuiz()
  const route = useRoute()
  if (route.query.start === 'true' && !error.value) {
    startQuiz()
  }
})
</script>