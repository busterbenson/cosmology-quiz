<template>
  <div class="dot-visualization text-center">
    <span class="text-red-300">{{ againstDots }}</span><span class="text-gray-500">|</span><span class="text-green-300">{{ forDots }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pro: number
  con: number
  maxStrength: number
}

const props = defineProps<Props>()

const { againstDots, forDots } = computed(() => {
  const maxDotsPerSide = 4
  
  let againstDotCount = 0
  let forDotCount = 0
  
  if (props.maxStrength > 0) {
    // Use direct scaling if max is 4 or less, proportional scaling for larger values
    if (props.maxStrength <= maxDotsPerSide) {
      // Direct representation
      againstDotCount = props.con
      forDotCount = props.pro
    } else {
      // Proportional scaling for larger values
      if (props.con > 0) {
        againstDotCount = Math.max(1, Math.round((props.con / props.maxStrength) * maxDotsPerSide))
        againstDotCount = Math.min(againstDotCount, maxDotsPerSide)
      }
      
      if (props.pro > 0) {
        forDotCount = Math.max(1, Math.round((props.pro / props.maxStrength) * maxDotsPerSide))
        forDotCount = Math.min(forDotCount, maxDotsPerSide)
      }
    }
  }
  
  // Build the visualization
  const againstFilled = '●'.repeat(againstDotCount)
  const againstEmpty = '○'.repeat(maxDotsPerSide - againstDotCount)
  const forFilled = '●'.repeat(forDotCount)
  const forEmpty = '○'.repeat(maxDotsPerSide - forDotCount)
  
  // Reverse against dots so stronger opposition appears closer to center
  const againstVisual = (againstFilled + againstEmpty).split('').reverse().join('')
  const forVisual = forFilled + forEmpty
  
  return {
    againstDots: againstVisual,
    forDots: forVisual
  }
}).value
</script>

<style scoped>
.dot-visualization {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  line-height: 1;
}
</style>