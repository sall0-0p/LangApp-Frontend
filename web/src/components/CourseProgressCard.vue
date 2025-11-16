<template>
  <div class="bg-white p-6 rounded-2xl shadow-xl mb-8 border-b-8 border-gray-200">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-extrabold text-gray-800">{{ emoji }} {{ title }}</h2>
      <span class="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">COURSE</span>
    </div>

    <div class="mb-2">
      <p class="text-sm font-medium text-gray-600 mb-1">Your Progress (Level {{ level }})</p>
      <div class="w-full bg-gray-200 rounded-full h-4 shadow-inner">
        <div class="bg-green-500 h-4 rounded-full" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // import AppCard from '@/components/AppCard.vue'; // <-- You would import AppCard here

  defineProps({
    title: { type: String, required: true },
    emoji: { type: String, default: '🇯🇵' },
    level: { type: Number, default: 1 },
    progressPercent: { type: Number, default: 0 }
  });
</script>