<template>
  <div class="cosmic-card text-center p-6">
    <div class="space-y-3">
      <div class="flex items-center justify-center">
        <span class="text-2xl mr-2">💥</span>
        <span class="text-lg"><span class="font-bold">{{ eliminatedCount }}</span> Cosmologies Eliminated</span>
      </div>
      <div class="flex items-center justify-center">
        <span class="text-2xl mr-2">🌌</span>
        <span class="text-lg"><span class="font-bold">{{ remainingCount }}</span> Cosmologies Remaining</span>
      </div>
      <div v-if="keyInsight" class="flex items-center justify-center">
        <span class="text-2xl mr-2">💡</span>
        <span class="text-lg">
          Key Insight: 
          <span class="font-bold capitalize" :class="keyInsight.polarity === 'pro' ? 'text-green-400' : 'text-red-400'">
            {{ keyInsight.polarity === 'pro' ? 'Supported' : 'Opposed' }} "{{ keyInsight.concept }}"
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eliminatedCount: number
  remainingCount: number
  keyInsight: { concept: string; polarity: 'pro' | 'con' } | null
}>()
</script>