<template>
  <div class="flex h-screen bg-gray-900 text-gray-200">
    <!-- Sidebar -->
    <aside class="w-1/4 h-full p-4 overflow-y-auto bg-gray-800 border-r border-gray-700">
      <h2 class="text-xl font-bold mb-4 text-white sticky top-0 bg-gray-800 py-2 z-20">Categories</h2>
      <ul class="space-y-2">
        <li v-for="category in cosmologyData" :key="category.id">
          <a :href="'#' + category.id" 
             @click.prevent="scrollTo(category.id)" 
             class="block px-2 py-1 rounded hover:bg-gray-700"
             :class="{'bg-cosmic-purple text-white': activeCategory === category.id}">
            {{ category.title }}
          </a>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="w-3/4 h-full overflow-y-auto" ref="mainContent" @scroll="handleScroll">
      <div class="px-8">
        <div class="flex justify-between items-center py-4 border-b border-gray-700 mb-4">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-cosmic-gold via-cosmic-purple to-cosmic-blue bg-clip-text text-transparent">Browse Cosmologies</h1>
          <NuxtLink to="/?start=true" class="cosmic-button-secondary">Start Quiz</NuxtLink>
        </div>

        <div v-for="(category, index) in cosmologyData" :key="category.id" :id="category.id" class="py-4 scroll-mt-0">
          <div :ref="el => { if (index === 0) stickyHeader = el }" class="sticky top-0 bg-gray-900 py-4 z-10 shadow-lg border-b border-gray-700/50">
              <h3 class="text-3xl font-bold text-cosmic-gold mb-2">✧ {{ category.title }} ✧</h3>
              <p class="text-lg italic text-gray-400 mb-4">{{ category.subtitle }}</p>
              <p class="text-gray-300 leading-relaxed">{{ category.description }}</p>
          </div>

          <div class="mt-6">
            <div v-if="category.cosmologies.length > 0" class="space-y-4">
              <div 
                v-for="cosmology in category.cosmologies" 
                :key="cosmology.title" 
                :id="slugify(category.id, cosmology.title)" 
                @click="copyLink(slugify(category.id, cosmology.title))"
                class="p-4 bg-gray-800/50 rounded-lg border border-gray-700 scroll-mt-dynamic hover:bg-gray-700/50 cursor-pointer transition-all duration-300"
                :class="{'highlight': highlightedCosmologyId === slugify(category.id, cosmology.title)}">
                <div class="flex justify-between items-center">
                  <h4 class="text-xl font-semibold text-cosmic-purple mb-1 transition-colors">
                    {{ cosmology.title }}
                  </h4>
                  <div class="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span v-if="copiedLink === slugify(category.id, cosmology.title)" class="absolute -top-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Copied!
                    </span>
                  </div>
                </div>
                <p class="text-gray-400 transition-colors">{{ cosmology.description }}</p>
              </div>
            </div>
            
            <div v-if="category.further_reading.length > 0" class="mt-6">
                <h5 class="text-lg font-semibold text-gray-400 mb-2">Further Reading:</h5>
                <ul class="list-disc list-inside text-gray-400">
                    <li v-for="item in category.further_reading" :key="item">{{ item }}</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Cosmology {
  title: string;
  description: string;
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cosmologies: Cosmology[];
  further_reading: string[];
}

const cosmologyData = ref<Category[]>([])
const mainContent = ref<HTMLElement | null>(null)
const activeCategory = ref<string>('')
const copiedLink = ref<string | null>(null)
const stickyHeader = ref<HTMLElement | null>(null)
const highlightedCosmologyId = ref<string | null>(null)
let resizeObserver: ResizeObserver | null = null

const slugify = (categorySlug: string, cosmologyTitle: string) => {
  const cosmoSlug = cosmologyTitle.toLowerCase().replace(/[^\w]+/g, '-')
  return `${categorySlug}--${cosmoSlug}`
}

const scrollTo = (id: string, smooth: boolean = true) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    window.history.pushState(null, '', `#${id}`)
    
    const categoryId = id.split('--')[0]
    activeCategory.value = categoryId
    
    if (id.includes('--')) {
      highlightedCosmologyId.value = id
    }
  }
}

const copyLink = (id: string) => {
  scrollTo(id)
  const url = `${window.location.origin}${window.location.pathname}#${id}`
  navigator.clipboard.writeText(url).then(() => {
    copiedLink.value = id
    setTimeout(() => {
      copiedLink.value = null
    }, 2000)
  })
}

const handleScroll = () => {
    if (!mainContent.value) return;
    const headerHeight = stickyHeader.value?.offsetHeight || 0;
    const scrollPosition = mainContent.value.scrollTop + headerHeight + 16;
    
    for (let i = cosmologyData.value.length - 1; i >= 0; i--) {
        const category = cosmologyData.value[i];
        const element = document.getElementById(category.id);
        if (element && element.offsetTop <= scrollPosition) {
            activeCategory.value = category.id;
            return;
        }
    }
};

const updateScrollMargin = () => {
  if (mainContent.value) {
    const headerHeight = stickyHeader.value?.offsetHeight || 0;
    const margin = headerHeight + 32;
    mainContent.value.style.setProperty('--scroll-padding', `${margin}px`);
  }
}

onMounted(async () => {
  try {
    const response = await fetch('/data/cosmology_descriptions.json')
    if (!response.ok) {
        throw new Error('Failed to fetch cosmology descriptions');
    }
    cosmologyData.value = await response.json()

    await nextTick()

    if (stickyHeader.value) {
      updateScrollMargin();
      resizeObserver = new ResizeObserver(updateScrollMargin);
      resizeObserver.observe(stickyHeader.value);
    }

    if (window.location.hash) {
      const hash = window.location.hash.substring(1)
      scrollTo(hash, false)
    } else if (cosmologyData.value.length > 0) {
        activeCategory.value = cosmologyData.value[0].id
    }
  } catch (error) {
    console.error("Error loading cosmology data:", error)
  }
})

onUnmounted(() => {
  if (resizeObserver && stickyHeader.value) {
    resizeObserver.unobserve(stickyHeader.value);
  }
})
</script>

<style>
.highlight {
  @apply bg-cosmic-purple/20 border-cosmic-purple/50;
}
.highlight h4 {
  @apply text-cosmic-gold;
}
.highlight p {
  @apply text-gray-200;
}
.scroll-mt-0 {
    scroll-margin-top: 0;
}
.scroll-mt-dynamic {
    scroll-margin-top: var(--scroll-padding, 16rem); /* Fallback value */
}
</style>