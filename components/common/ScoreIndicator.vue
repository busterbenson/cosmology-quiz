<template>
  <div class="flex items-center space-x-2">
    <div class="dot-visualization text-cosmic-gold">
      {{ dots }}
    </div>
    <span class="text-xs text-gray-400">({{ score }})</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  score: number
  maxScore: number
}

const props = defineProps<Props>()

const dots = computed(() => {
  if (props.maxScore === 0) return '○○○○○'
  
  const scoreRatio = props.score / props.maxScore
  const filledDots = Math.round(scoreRatio * 5) // 0-5 dots
  const emptyDots = 5 - filledDots
  
  return '●'.repeat(filledDots) + '○'.repeat(emptyDots)
})
</script>

<style scoped>
.dot-visualization {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}
</style>