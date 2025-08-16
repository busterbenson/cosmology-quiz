<template>
  <div class="cosmic-card">
    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.071 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      Your Conceptual Profile
    </h3>
    
    <div v-if="profileItems.length === 0" class="text-gray-400 text-center py-4">
      Your convictions will appear here as you answer questions.
    </div>
    
    <div v-else class="space-y-3">
      <div class="text-xs text-gray-400 mb-4 font-mono">
        Against ←→ For
      </div>
      
      <div 
        v-for="item in profileItems" 
        :key="item.concept"
        class="flex items-center justify-between p-3 rounded-lg transition-all duration-300"
        :class="[
          updatedConcepts.has(item.concept) 
            ? 'bg-cosmic-gold/20 border border-cosmic-gold/50' 
            : 'bg-white/5'
        ]"
      >
        <div class="flex-1">
          <div class="font-medium text-white capitalize">{{ item.concept }}</div>
          <div class="text-sm" :class="getStanceColor(item.stance)">{{ item.stance }}</div>
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
    
    <div v-if="profileItems.length > 0" class="mt-4 pt-4 border-t border-white/10">
      <div class="text-xs text-gray-400 text-center">
        Showing {{ profileItems.length }} conviction{{ profileItems.length !== 1 ? 's' : '' }}
        {{ updatedConcepts.size > 0 ? '• Recently updated concepts highlighted' : '' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConvictionProfile, CosmologicalProfileItem } from '~/types'

interface Props {
  convictionProfile: ConvictionProfile
  updatedConcepts: Set<string>
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