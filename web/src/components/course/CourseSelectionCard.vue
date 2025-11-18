<script setup>
import AppCard from '../app/AppCard.vue';
import AppButton from '../app/AppButton.vue';

defineProps({
  title: { type: String, required: true },
  emoji: { type: String, required: true },
  originLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true }
});

defineEmits(['start']);
</script>

<template>
  <AppCard class="flex flex-col h-full justify-between !max-w-none">
    <div class="mb-6 text-center">
      <div class="text-6xl mb-4">{{ emoji }}</div>
      <h3 class="text-2xl font-extrabold text-gray-800 mb-2">{{ title }}</h3>
      <div class="inline-block bg-gray-100 rounded-full px-4 py-1">
        <p class="text-gray-500 text-sm font-medium uppercase tracking-wide">
          {{ originLanguage }} &rarr; {{ targetLanguage }}
        </p>
      </div>
    </div>
    <AppButton @click="$emit('start')" variant="primary">
      Start Learning
    </AppButton>
  </AppCard>
</template>