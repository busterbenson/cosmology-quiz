<template>
  <div class="p-4">
    <!-- Visible constellation for the UI -->
    <div ref="constellationContainer" class="grid grid-cols-16 gap-3">
      <div 
        v-for="cosmology in displayCosmologies" 
        :key="cosmology.name"
        class="w-5 h-5 mx-auto transition-all duration-[2500ms] flex items-center justify-center"
        :class="cosmology.statusClass">
        <!-- Heart for favorited cosmology -->
        <svg 
          v-if="cosmology.isFavorite" 
          class="w-4 h-4 transition-all duration-500 constellation-heart" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          :style="{ 
            color: '#ec4899', 
            filter: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.6))' 
          }">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <!-- Dot for regular cosmology -->
        <div 
          v-else
          class="w-3 h-3 rounded-full transition-all duration-[2500ms]"
          :style="cosmology.style">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import type { Cosmology } from '~/types'
import { CONFIG } from '~/types'

const constellationContainer = ref<HTMLElement | null>(null)

const props = defineProps({
  cosmologies: {
    type: Array as PropType<Cosmology[]>,
    required: true
  },
  scores: {
    type: Array as PropType<number[]>,
    required: true
  },
  newlyEliminated: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  favoriteCosmology: {
    type: String as PropType<string | null>,
    default: null
  }
})

const getFavoriteCategory = () => {
  if (!props.favoriteCosmology) return ''
  const favoriteCosmologyData = props.cosmologies.find(c => c.Cosmology === props.favoriteCosmology)
  return favoriteCosmologyData?.Category || ''
}

const downloadConstellation = async () => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set high resolution with compact dimensions
    const scale = 4
    canvas.width = 600 * scale
    canvas.height = 400 * scale
    ctx.scale(scale, scale)
    
    // Background
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, 600, 400)
    
    // Title
    ctx.fillStyle = '#fbbf24' // Gold color
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('My Cosmological Constellation', 300, 30)
    
    // Favorite cosmology info if exists
    let yOffset = 55
    if (props.favoriteCosmology) {
      // Cosmology name (no heart here)
      ctx.fillStyle = '#ec4899'
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif'
      ctx.fillText(props.favoriteCosmology, 300, yOffset)
      
      // Category
      const category = getFavoriteCategory()
      if (category) {
        ctx.fillStyle = '#9ca3af'
        ctx.font = '14px system-ui, -apple-system, sans-serif'
        ctx.fillText(category, 300, yOffset + 18)
      }
      yOffset += 35
    }
    
    // Constellation grid - expand to fill available space
    const padding = 10 // Small edge padding
    const startY = yOffset + 15
    const gridSize = 16
    const availableWidth = 600 - (padding * 2)
    const availableHeight = 400 - startY - padding
    const cellSize = Math.min(availableWidth / gridSize, availableHeight / (Math.ceil(displayCosmologies.value.length / gridSize)))
    const gridWidth = gridSize * cellSize
    const gridHeight = Math.ceil(displayCosmologies.value.length / gridSize) * cellSize
    const startX = padding
    const actualStartY = startY
    
    displayCosmologies.value.forEach((cosmology, index) => {
      const row = Math.floor(index / gridSize)
      const col = index % gridSize
      const x = startX + col * cellSize + cellSize / 2
      const y = actualStartY + row * cellSize + cellSize / 2
      
      if (cosmology.isFavorite) {
        // Draw heart
        ctx.fillStyle = '#ec4899'
        ctx.font = '16px system-ui, -apple-system, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('♥', x, y + 5)
      } else {
        // Draw dot
        ctx.beginPath()
        const radius = 6
        
        // Parse background color from style
        const bgColor = cosmology.style.backgroundColor
        ctx.fillStyle = bgColor
        
        // Adjust opacity for eliminated cosmologies
        if (cosmology.statusClass === 'is-eliminated') {
          ctx.globalAlpha = 0.15
        } else {
          ctx.globalAlpha = 1
        }
        
        ctx.arc(x, y, radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    })
    
    // Create download link
    const link = document.createElement('a')
    link.download = 'cosmology-constellation.png'
    link.href = canvas.toDataURL('image/png')
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading constellation:', error)
  }
}

// Expose the download function to parent components
defineExpose({
  downloadConstellation
})

const displayCosmologies = computed(() => {
  const maxScore = Math.max(...props.scores.filter(s => s > 0), 1)

  return props.cosmologies.map((cosmology, index) => {
    const score = props.scores[index]
    const isEliminated = score <= CONFIG.SCORE_ELIMINATE
    const isNewlyEliminated = props.newlyEliminated.includes(cosmology.Cosmology)

    let statusClass = ''
    if (isNewlyEliminated) {
      statusClass = 'is-eliminating'
    } else if (isEliminated) {
      statusClass = 'is-eliminated'
    }

    const style = {
      backgroundColor: 'hsl(210, 30%, 20%)',
      boxShadow: '0 0 2px hsl(210, 30%, 20%)',
      opacity: 1
    }

    if (!isEliminated) {
      if (score > 0) {
        const intensity = Math.min(score / maxScore, 1)
        const hue = 40 // Consistent gold hue
        const lightness = 60 + (intensity * 25) // Brighter
        const saturation = 80 + (intensity * 20)
        style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        style.boxShadow = `0 0 ${3 + intensity * 8}px ${style.backgroundColor}`
      } else if (score === 0) {
        // Bright orange "possibility" state for the start of the quiz
        style.backgroundColor = 'hsl(30, 90%, 55%)';
        style.boxShadow = '0 0 6px hsl(30, 90%, 55%)';
      } else {
        // Negative scores get a cooler, more subtle purple
        style.backgroundColor = 'hsl(260, 30%, 40%)'
        style.boxShadow = '0 0 3px hsl(260, 30%, 40%)'
      }
    }

    return {
      name: cosmology.Cosmology,
      score,
      statusClass,
      style,
      isFavorite: props.favoriteCosmology === cosmology.Cosmology
    }
  })
})
</script>

<style>
.is-eliminated .w-3 {
  background-color: hsl(210, 10%, 15%) !important;
  box-shadow: none !important;
  opacity: 0.15 !important;
}

.is-eliminated {
  opacity: 0.15 !important;
}

.is-eliminating .w-3 {
  animation: flash-red 0.5s ease-out;
}

@keyframes flash-red {
  0%, 100% {
    background-color: hsl(0, 80%, 50%) !important;
    box-shadow: 0 0 8px hsl(0, 80%, 50%) !important;
  }
  50% {
    background-color: hsl(0, 80%, 70%) !important;
    box-shadow: 0 0 16px hsl(0, 80%, 70%) !important;
  }
}

.constellation-heart {
  animation: gentleHeartPulse 2s ease-in-out infinite;
}

@keyframes gentleHeartPulse {
  0%, 100% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.1); 
  }
}
</style>