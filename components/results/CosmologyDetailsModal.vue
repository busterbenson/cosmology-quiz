<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" @click.self="close">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-3xl font-bold text-cosmic-gold">{{ categoryData?.title || cosmology?.category || 'Unknown Category' }}</h2>
            <p v-if="categoryData?.subtitle" class="text-lg text-gray-400 italic mt-1">{{ categoryData.subtitle }}</p>
          </div>
          <button @click="close" class="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div v-if="categoryData">
          <!-- Category Description -->
          <div class="mb-6">
            <p class="text-gray-300 leading-relaxed">{{ categoryData.description }}</p>
          </div>
          
          <!-- Cosmologies List -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-white mb-4">{{ categoryData.title }} cosmologies:</h3>
            <div class="space-y-4">
              <div 
                v-for="item in categoryData.cosmologies" 
                :key="item.title"
                class="p-4 rounded-lg transition-all duration-200"
                :class="{
                  'bg-cosmic-gold/20 border-2 border-cosmic-gold shadow-lg': item.title === cosmology?.cosmology,
                  'bg-gray-900/50 border border-gray-700 hover:bg-gray-900/70': item.title !== cosmology?.cosmology
                }"
              >
                <h4 class="font-semibold mb-2"
                    :class="{
                      'text-cosmic-gold': item.title === cosmology?.cosmology,
                      'text-cosmic-purple': item.title !== cosmology?.cosmology
                    }"
                >
                  {{ item.title }}
                  <span v-if="item.title === cosmology?.cosmology" class="ml-2 text-sm font-normal text-cosmic-gold/80">(Your result)</span>
                </h4>
                <p class="text-gray-300 leading-relaxed">{{ item.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- Further Reading -->
          <div v-if="categoryData.further_reading && categoryData.further_reading.length > 0" class="border-t border-gray-700 pt-6 mb-6">
            <h3 class="text-lg font-semibold text-white mb-3">Further Reading</h3>
            <ul class="space-y-1">
              <li v-for="book in categoryData.further_reading" :key="book" class="text-gray-400 text-sm">
                • {{ book }}
              </li>
            </ul>
          </div>
          
          <!-- Browse All Button -->
          <div class="border-t border-gray-700 pt-6 text-center">
            <a 
              href="/browse" 
              target="_blank" 
              rel="noopener noreferrer"
              class="cosmic-button inline-flex items-center gap-2"
            >
              Browse all cosmologies
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { QuizResult } from '~/types'

interface CategoryData {
  id: string
  title: string
  subtitle: string
  description: string
  cosmologies: Array<{
    title: string
    description: string
  }>
  further_reading: string[]
}

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  cosmology: {
    type: Object as PropType<QuizResult | null>,
    required: true
  },
  fullDescriptions: {
    type: Object as PropType<Record<string, string>>,
    required: true
  }
})

const emit = defineEmits(['close'])

const cosmologyDescriptions = ref<CategoryData[]>([])

// Find the category data that matches the cosmology's category
const categoryData = computed(() => {
  if (!props.cosmology || !cosmologyDescriptions.value.length) return null
  
  // Find by matching the cosmology name within the category's cosmologies list
  return cosmologyDescriptions.value.find(category => 
    category.cosmologies.some(item => item.title === props.cosmology!.cosmology)
  ) || null
})

const loadCategoryData = async () => {
  try {
    const response = await fetch('/data/cosmology_descriptions.json')
    if (response.ok) {
      cosmologyDescriptions.value = await response.json()
    } else {
      console.error('Failed to load cosmology descriptions')
    }
  } catch (error) {
    console.error('Error loading cosmology descriptions:', error)
  }
}

const close = () => {
  emit('close')
}

onMounted(() => {
  loadCategoryData()
})
</script>
