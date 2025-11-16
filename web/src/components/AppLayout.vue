<template>
  <div class="flex">
    <AppSidebar />

    <main class="flex-1 bg-gray-100 h-screen overflow-y-auto">
      <router-view />
    </main>
  </div>

  <AppBottomNav />
</template>

<script setup>
  import AppSidebar from '@/components/AppSidebar.vue';
  import AppBottomNav from '@/components/AppBottomNav.vue';
</script>