<script setup lang="ts">
defineProps<{
  title: string;
  progress: number; // 0 to 100
}>();

const emit = defineEmits(['exit']);
</script>

<template>
  <div class="bg-gray-100 min-h-screen flex flex-col font-sans">
    <header class="bg-white shadow-md sticky top-0 z-10 w-full flex-shrink-0">
      <div class="max-w-md mx-auto p-4">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-xl font-bold text-gray-800">{{ title }}</h1>
          <button
              @click="emit('exit')"
              class="text-gray-400 hover:text-red-600 transition-colors"
              title="Exit Lesson"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          <div class="flex justify-between text-xs font-medium text-green-600 mb-1">
            <span>Progress</span>
            <span>{{ progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
            <div
                class="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4 relative">
      <div class="max-w-md mx-auto pt-6 pb-32">
        <slot />
      </div>
    </main>

    <slot name="footer" />
  </div>
</template>