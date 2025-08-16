<template>
  <div class="cosmic-card">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-white">Progress</h3>
        <p class="text-sm text-gray-400">
          Question {{ current }} of ~{{ Math.ceil(estimatedTotal) }}
        </p>
      </div>
      <div class="text-right">
        <div class="text-lg font-semibold text-cosmic-gold">{{ remaining }}</div>
        <div class="text-sm text-gray-400">remaining cosmologies</div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="relative">
      <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-cosmic-blue via-cosmic-purple to-cosmic-gold transition-all duration-500 ease-out"
          :style="{ width: `${Math.min(progressPercent, 100)}%` }"
        ></div>
      </div>
      
      <!-- Progress percentage -->
      <div class="absolute -top-6 right-0 text-xs text-gray-400">
        {{ Math.round(progressPercent) }}%
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
      <div>
        <div class="text-cosmic-blue font-semibold">{{ current }}</div>
        <div class="text-gray-400">Questions</div>
      </div>
      <div>
        <div class="text-cosmic-purple font-semibold">{{ total - remaining }}</div>
        <div class="text-gray-400">Eliminated</div>
      </div>
      <div>
        <div class="text-cosmic-gold font-semibold">{{ remaining }}</div>
        <div class="text-gray-400">Active</div>
      </div>
    </div>

    <!-- Elimination visualization -->
    <div class="mt-4">
      <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
        <span>Cosmologies</span>
        <span>{{ remaining }} / {{ total }}</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-gray-500 to-cosmic-gold transition-all duration-500"
          :style="{ width: `${(remaining / total) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  current: number
  estimatedTotal: number
  remaining: number
  total: number
  progressPercent: number
}

defineProps<Props>()
</script>