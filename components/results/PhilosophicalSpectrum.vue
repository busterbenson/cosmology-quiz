<template>
  <div class="cosmic-card">
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
      🌈 Your Philosophical Spectrum
    </h2>
    
    <div class="space-y-6">
      <div 
        v-for="(tradition, index) in traditionGroups.slice(0, 6)" 
        :key="tradition.name"
        v-show="totalShown < 10"
        class="bg-white/5 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <span class="text-2xl mr-2">{{ tradition.emoji }}</span>
            {{ tradition.name.toUpperCase() }}
          </h3>
          <span class="text-sm text-cosmic-gold font-medium">
            ({{ tradition.strength }})
          </span>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="(result, resultIndex) in tradition.cosmologies.slice(0, Math.min(4, 10 - totalShown))"
            :key="result.cosmology"
            class="flex items-center justify-between"
          >
            <div class="flex-1">
              <span class="text-gray-300">#{{ getRank(result) }}</span>
              <span class="text-white ml-2">{{ result.cosmology }}</span>
            </div>
            <div class="flex-shrink-0">
              <ProgressBar :score="result.score" :max-score="maxScore" />
            </div>
          </div>
          
          <div v-if="tradition.cosmologies.length > 4" class="text-xs text-gray-400 ml-6">
            ... plus {{ tradition.cosmologies.length - 4 }} more related perspectives
          </div>
        </div>
      </div>
    </div>
    
    <!-- Synthesis insight -->
    <div class="mt-6 p-4 bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg">
      <h4 class="text-white font-semibold mb-2 flex items-center">
        💫 Philosophical Breadth: {{ breadth }} traditions
      </h4>
      <p class="text-gray-300 text-sm">
        {{ getBreadthInsight(breadth) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizResult } from '~/types'

interface Props {
  results: QuizResult[]
}

const props = defineProps<Props>()

interface TraditionGroup {
  name: string
  emoji: string
  strength: string
  cosmologies: QuizResult[]
}

const traditionGroups = computed((): TraditionGroup[] => {
  const groups: Record<string, QuizResult[]> = {}
  
  // Group by enhanced traditions
  for (const result of props.results) {
    const tradition = mapToPhilosophicalTradition(result.category)
    if (!groups[tradition]) {
      groups[tradition] = []
    }
    groups[tradition].push(result)
  }
  
  // Convert to array and sort by best score in each tradition
  const traditionsArray: TraditionGroup[] = []
  
  for (const [traditionName, cosmologies] of Object.entries(groups)) {
    cosmologies.sort((a, b) => b.score - a.score)
    
    const strength = calculateTraditionStrength(cosmologies)
    const emoji = getTraditionEmoji(traditionName)
    
    traditionsArray.push({
      name: traditionName,
      emoji,
      strength,
      cosmologies
    })
  }
  
  // Sort by best score in tradition
  return traditionsArray.sort((a, b) => b.cosmologies[0].score - a.cosmologies[0].score)
})

const maxScore = computed(() => {
  return Math.max(...props.results.map(r => r.score), 1)
})

const breadth = computed(() => {
  return traditionGroups.value.filter(t => t.cosmologies.length > 0).length
})

const totalShown = computed(() => {
  let count = 0
  for (let i = 0; i < Math.min(6, traditionGroups.value.length); i++) {
    const tradition = traditionGroups.value[i]
    count += Math.min(4, tradition.cosmologies.length, 10 - count)
    if (count >= 10) break
  }
  return count
})

const mapToPhilosophicalTradition = (category: string): string => {
  const traditionMap: Record<string, string> = {
    'Pantheism': 'Nature-Based Spirituality',
    'Scientific Pantheism': 'Nature-Based Spirituality',
    'Spiritual Naturalism': 'Nature-Based Spirituality',
    'Traditional Daoist Cosmology': 'Eastern Wisdom Traditions',
    'Non-Dual Traditions': 'Eastern Wisdom Traditions',
    'Non-Dual & Beyond-Concept': 'Eastern Wisdom Traditions',
    'Consciousness-First': 'Mind-Centered Philosophy',
    'Information-Theoretic Cosmology': 'Mind-Centered Philosophy',
    'Scientific Materialism': 'Naturalistic Worldviews',
    'Multiverse Theory': 'Naturalistic Worldviews',
    'Indigenous Relational Worldview': 'Indigenous & Traditional Ways',
    'Traditional African Cosmologies': 'Indigenous & Traditional Ways',
    'Animism': 'Indigenous & Traditional Ways',
    'Gnosticism/Esoteric Dualism': 'Mystical & Esoteric Traditions',
    'Ancient Astronaut Theory': 'Alternative Perspectives',
    'Simulation Hypothesis': 'Alternative Perspectives',
    'Flat Earth Conspiracy': 'Alternative Perspectives'
  }
  
  return traditionMap[category] || category
}

const calculateTraditionStrength = (cosmologies: QuizResult[]): string => {
  if (cosmologies.length === 0) return 'weak'
  
  const avgScore = cosmologies.reduce((sum, c) => sum + c.score, 0) / cosmologies.length
  const count = cosmologies.length
  
  if (avgScore >= 120 && count >= 3) {
    return 'very strong'
  } else if (avgScore >= 100 || count >= 2) {
    return 'strong'
  } else {
    return 'moderate'
  }
}

const getTraditionEmoji = (tradition: string): string => {
  const emojiMap: Record<string, string> = {
    'Nature-Based Spirituality': '🌍',
    'Eastern Wisdom Traditions': '☯️',
    'Mind-Centered Philosophy': '🧠',
    'Naturalistic Worldviews': '🔬',
    'Indigenous & Traditional Ways': '🌿',
    'Mystical & Esoteric Traditions': '🔮',
    'Alternative Perspectives': '🌌'
  }
  return emojiMap[tradition] || '📚'
}

const getRank = (result: QuizResult): number => {
  return props.results.findIndex(r => r.cosmology === result.cosmology) + 1
}

const getBreadthInsight = (breadth: number): string => {
  if (breadth >= 4) {
    return 'You demonstrate remarkable philosophical integration, drawing wisdom from diverse traditions.'
  } else if (breadth >= 3) {
    return 'Your worldview bridges multiple philosophical approaches to understanding reality.'
  } else if (breadth >= 2) {
    return 'You find truth in more than one philosophical tradition.'
  } else {
    return 'You have a focused philosophical perspective within a specific tradition.'
  }
}
</script>