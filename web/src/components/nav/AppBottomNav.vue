<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10">
    <div class="max-w-lg mx-auto flex justify-around items-center p-2">

      <BottomNavItem href="#" label="Home">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4h.01M12 12h.01M15 12h.01M9 12h.01M9 15h.01M12 15h.01M15 15h.01M9 18h.01M12 18h.01M15 18h.01" /></svg>
      </BottomNavItem>

      <BottomNavItem href="#" label="Learn" :active="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </BottomNavItem>

      <BottomNavItem href="#" label="Practice">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
      </BottomNavItem>

      <BottomNavItem href="#" label="Profile">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      </BottomNavItem>

    </div>
  </nav>
</template>

<script setup>
  import BottomNavItem from '@/components/nav/BottomNavItem.vue';
</script>