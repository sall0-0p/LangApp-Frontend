<template>
  <nav class="bg-white shadow-md sticky top-0 z-10 md:hidden">
    <div class="max-w-lg mx-auto p-4 flex justify-between items-center">
      <a href="#" class="text-gray-600 hover:text-red-600 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>
      <h1 class="text-xl font-bold text-gray-800">{{ title }}</h1>
      <a href="#" class="text-gray-600 hover:text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </a>
    </div>
  </nav>

  <div class="hidden md:flex items-center mb-6 pt-8 px-4 max-w-lg mx-auto">
    <a href="#" class="text-gray-500 hover:text-red-600 mr-4 p-2 rounded-full hover:bg-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </a>
    <h1 class="text-3xl font-bold text-gray-800">{{ title }}</h1>
  </div>
</template>

<script setup>
  defineProps({
    title: { type: String, default: 'Your Path' }
  });
</script>