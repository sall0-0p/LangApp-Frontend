<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10">
    <div class="max-w-lg mx-auto flex justify-around items-center p-2">

      <BottomNavItem href="/" label="Learn" :active="$route.path === '/'">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </BottomNavItem>

      <BottomNavItem href="/courses" label="Courses" :active="$route.path.startsWith('/courses')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
      </BottomNavItem>

      <BottomNavItem href="#" label="Profile">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      </BottomNavItem>

      <BottomNavItem @click.prevent="handleLogout" href="#" label="Log Out">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      </BottomNavItem>

    </div>
  </nav>
</template>

<script>
import BottomNavItem from '@/components/nav/BottomNavItem.vue';
import { useAuthStore } from "@myapp/shared/store/useAuthStore";
import { mapActions } from 'pinia';

export default {
  components: { BottomNavItem },
  methods: {
    ...mapActions(useAuthStore, ['logout']),

    async handleLogout() {
      try {
        await this.logout();
        this.$router.push({ name: 'Login' });
      } catch (err) {
        console.error('Failed to logout', err);
        this.$router.push({ name: 'Login' });
      }
    }
  }
}
</script>