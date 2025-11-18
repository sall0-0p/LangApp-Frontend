<script setup lang="ts">
defineProps<{
  totalTasks: number;
  correctCount: number;
}>();

const emit = defineEmits(['finish']);
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full py-8 animate-fade-in">
    <div class="text-8xl mb-6 animate-bounce-slow">
      🏆
    </div>

    <h2 class="text-3xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
    <p class="text-gray-500 mb-8">Great job practicing today.</p>

    <div class="grid grid-cols-2 gap-4 w-full mb-8">
      <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
        <div class="text-3xl font-bold text-yellow-600">{{ totalTasks }}</div>
        <div class="text-xs text-yellow-800 uppercase font-bold tracking-wider">Tasks</div>
      </div>
      <div class="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
        <div class="text-3xl font-bold text-green-600">{{ Math.round((correctCount / totalTasks) * 100) }}%</div>
        <div class="text-xs text-green-800 uppercase font-bold tracking-wider">Accuracy</div>
      </div>
    </div>

    <button
        @click="emit('finish')"
        class="w-full py-4 rounded-lg font-bold text-lg text-white bg-green-600 hover:bg-green-700 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
    >
      Continue
    </button>
  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(5%); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>