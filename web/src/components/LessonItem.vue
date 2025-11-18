<template>
  <a v-if="status === 'active'" :href="lesson.href"
     class="block bg-red-600 p-6 rounded-2xl shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl">

    <div class="flex justify-between items-center mb-3">
      <div>
        <p class="text-2xl font-bold text-white">{{ lesson.title }}</p>
        <p class="text-white opacity-90">{{ lesson.subtitle }}</p>
      </div>
      <span class="text-5xl opacity-50">#{{ lesson.orderIndex }}</span>
    </div>

    <div class="mt-4 bg-white text-red-600 font-bold text-center w-full py-3 rounded-lg shadow-md hover:bg-gray-50">
      Start Lesson 🚀
    </div>
  </a>

  <a v-else-if="status === 'completed'" :href="lesson.href"
     class="flex items-center bg-white p-4 rounded-2xl shadow-md transition hover:shadow-lg hover:scale-105">

    <div class="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-inner">
      <span class="text-2xl">✅</span>
    </div>
    <div class="ml-4">
      <p class="font-bold text-lg text-gray-700">{{ lesson.title }}</p>
      <p class="text-sm text-gray-500">Completed!</p>
    </div>
  </a>

  <div v-else
       class="flex items-center bg-white p-4 rounded-2xl shadow-md opacity-60">

    <div class="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-inner">
      <span class="text-2xl">🔒</span>
    </div>
    <div class="ml-4">
      <p class="font-bold text-lg text-gray-400">{{ lesson.title }}</p>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    lesson: {
      type: Object,
      required: true,
      // e.g., { id: 1, title: 'Lesson 1', subtitle: 'Learn...', href: '#' }
    },
    status: {
      type: String, // 'active', 'completed', 'locked'
      required: true,
    }
  });
</script>