<template>
  <div class="flex items-center space-x-2">
    <div class="w-24 bg-gray-700 rounded-full h-2 overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-cosmic-blue to-cosmic-gold transition-all duration-300"
        :style="{ width: `${progressPercent}%` }"
      ></div>
    </div>
    <span class="text-xs text-gray-400 w-8">{{ Math.round(progressPercent) }}%</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  score: number
  maxScore: number
}

const props = defineProps<Props>()

const progressPercent = computed(() => {
  if (props.maxScore === 0) return 0
  return Math.min(100, (props.score / props.maxScore) * 100)
})
</script>