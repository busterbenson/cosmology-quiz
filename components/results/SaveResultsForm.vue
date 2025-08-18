<template>
  <div class="save-results-form mt-6">
    <div class="cosmic-card p-6">
      <h3 class="text-lg font-bold text-white mb-3">Save Your Results</h3>
      <p v-if="!submitted" class="text-sm text-gray-400 mb-4">Enter your email to receive a permanent link to your results.</p>
      
      <form v-if="!submitted" @submit.prevent="submitForm">
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            v-model="email"
            type="email"
            placeholder="your.email@example.com"
            required
            :disabled="submitting"
            class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded text-sm text-white focus:ring-2 focus:ring-cosmic-purple focus:border-cosmic-purple"
          />
          <button type="submit" :disabled="submitting" class="cosmic-button">
            {{ submitting ? 'Saving...' : 'Save Results' }}
          </button>
        </div>
      </form>

      <div v-if="submitted" class="text-center py-2">
        <p class="text-green-400 font-semibold">✅ Success! Your results link has been sent.</p>
      </div>
      <div v-if="error" class="mt-3 text-center">
        <p class="text-red-400 text-sm">❌ {{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  resultsUrl: {
    type: String,
    required: true
  }
});

const email = ref('');
const submitting = ref(false);
const submitted = ref(false);
const error = ref(null);

const submitForm = async () => {
  submitting.value = true;
  error.value = null;

  try {
    await $fetch('/api/save-results', {
      method: 'POST',
      body: {
        email: email.value,
        resultsUrl: props.resultsUrl,
      },
    });
    submitted.value = true;
  } catch (e) {
    error.value = 'An error occurred. Please try again.';
    console.error(e);
  } finally {
    submitting.value = false;
  }
};
</script>
