<template>
  <div
      class="fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-all duration-300"
      :class="show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'"
  >
    <div class="max-w-lg mx-auto p-3">
      <div class="flex items-center space-x-3">
        <span class="text-2xl">{{ course.emoji }}</span>

        <div class="flex-1 min-w-0">
          <h2 class="text-base font-bold text-gray-800 truncate">
            {{ course.title }}
          </h2>
        </div>

        <div class="w-1/3">
          <div class="bg-gray-200 rounded-full h-2">
            <div
                class="bg-blue-500 h-2 rounded-full"
                :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>

        <span class="text-sm font-medium text-gray-600">
          {{ progressPercent }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineProps({
  course: { type: Object, required: true },
  progressPercent: { type: Number, required: true },
});

// This state controls the slide-down animation
const show = ref(false);
onMounted(() => {
  // Use a tiny delay to ensure the element is in the DOM
  // before the transition starts. This triggers the animation.
  setTimeout(() => {
    show.value = true;
  }, 10);
});
</script>