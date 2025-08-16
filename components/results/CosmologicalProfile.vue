<template>
  <div class="cosmic-card">
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
      🧭 Your Cosmological Profile
    </h2>
    
    <div v-if="profileItems.length === 0" class="text-center py-8">
      <p class="text-gray-300">
        You maintain nuanced positions across philosophical questions,
        avoiding strong commitments to any single doctrine.
      </p>
    </div>
    
    <div v-else>
      <div class="text-sm text-gray-400 mb-4 text-center font-mono">
        Against ←————————————————————————————————————————————————————————————————→ For
      </div>
      
      <div class="space-y-3">
        <div 
          v-for="item in profileItems.slice(0, 10)" 
          :key="item.concept"
          class="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0"
        >
          <div class="flex-1 text-left">
            <div class="text-white font-medium capitalize">{{ item.concept }}</div>
            <div class="text-sm" :class="getStanceColor(item.stance)">
              {{ item.stance }}
            </div>
          </div>
          
          <div class="flex-1 text-center">
            <BiDirectionalDots 
              :pro="item.pro"
              :con="item.con"
              :max-strength="maxStrength"
            />
            <div class="text-xs text-gray-400 mt-1">
              (+{{ item.pro }}/-{{ item.con }})
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 text-center text-sm text-gray-400">
        Showing your strongest {{ Math.min(10, profileItems.length) }} conviction{{ profileItems.length !== 1 ? 's' : '' }}
        {{ profileItems.length > 10 ? ` of ${profileItems.length} total` : '' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConvictionProfile, CosmologicalProfileItem } from '~/types'

interface Props {
  convictionProfile: ConvictionProfile
}

const props = defineProps<Props>()

const profileItems = computed((): CosmologicalProfileItem[] => {
  const items: CosmologicalProfileItem[] = []
  
  for (const [concept, counts] of Object.entries(props.convictionProfile)) {
    const pro = counts.pro
    const con = counts.con
    const total = pro + con
    
    if (total > 0) {
      const netScore = pro - con
      const strength = Math.max(pro, con)
      
      let stance: 'For' | 'Against' | 'Neutral'
      if (netScore > 0) {
        stance = 'For'
      } else if (netScore < 0) {
        stance = 'Against'
      } else {
        stance = 'Neutral'
      }
      
      items.push({
        concept,
        stance,
        netScore,
        pro,
        con,
        strength
      })
    }
  }
  
  // Sort by net score (most For to most Against)
  return items.sort((a, b) => b.netScore - a.netScore)
})

const maxStrength = computed(() => {
  return Math.max(...profileItems.value.map(item => item.strength), 1)
})

const getStanceColor = (stance: string): string => {
  switch (stance) {
    case 'For': return 'text-green-400'
    case 'Against': return 'text-red-400'
    case 'Neutral': return 'text-yellow-400'
    default: return 'text-gray-400'
  }
}
</script>