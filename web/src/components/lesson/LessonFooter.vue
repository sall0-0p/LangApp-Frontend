<script setup lang="ts">
import { computed } from 'vue';

// Status state controls the visual appearance
type Status = 'idle' | 'correct' | 'wrong';

const props = defineProps<{
  status: Status;
  feedbackTitle?: string;
  feedbackMessage?: string;
  isCheckDisabled?: boolean;
}>();

const emit = defineEmits(['check', 'continue']);

const isIdle = computed(() => props.status === 'idle');
const isCorrect = computed(() => props.status === 'correct');
</script>

<template>
  <footer class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-20">
    <div class="max-w-md mx-auto p-4">

      <div v-if="isIdle">
        <button
            @click="emit('check')"
            :disabled="isCheckDisabled"
            class="w-full py-4 rounded-lg font-bold text-lg text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          Check
        </button>
      </div>

      <div v-else class="animate-fade-in-up">
        <div
            class="p-4 rounded-lg mb-4 flex items-start space-x-3"
            :class="isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          <div class="text-2xl">
            <span v-if="isCorrect">🎉</span>
            <span v-else>🤔</span>
          </div>

          <div>
            <h2 class="text-xl font-bold">{{ feedbackTitle }}</h2>
            <p class="text-sm mt-1">{{ feedbackMessage }}</p>
          </div>
        </div>

        <button
            @click="emit('continue')"
            class="w-full py-4 rounded-lg font-bold text-lg text-white transition-all active:scale-[0.98]"
            :class="isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
        >
          Continue
        </button>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>