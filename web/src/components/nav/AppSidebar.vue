<template>
  <aside class="hidden md:block w-64 bg-white shadow-lg h-screen sticky top-0 flex-shrink-0">
    <div class="p-6">
      <a href="#" class="text-2xl font-extrabold text-red-600">LangApp</a>
    </div>

    <nav class="flex flex-col p-4 space-y-2">
      <SidebarNavItem href="#" :active="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <span class="ml-3">Learn</span>
      </SidebarNavItem>

      <SidebarNavItem href="#">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        <span class="ml-3">Courses</span>
      </SidebarNavItem>
    </nav>

    <div class="absolute bottom-0 left-0 w-full p-4">
      <nav class="flex flex-col space-y-2">
        <SidebarNavItem href="#">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span class="ml-3">Profile</span>
        </SidebarNavItem>

        <SidebarNavItem @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span class="ml-3">Log Out</span>
        </SidebarNavItem>
      </nav>
    </div>
  </aside>
</template>

<script>
  import {useAuthStore} from "@myapp/shared/store/index.ts";
  import SidebarNavItem from "./SidebarNavItem.vue";
  import { mapActions } from 'pinia';

  export default {
    components: {SidebarNavItem},
    methods: {
      ...mapActions(useAuthStore, ['logout']),

      async handleLogout() {
        try {
          await this.logout();
          // On success, push to the Login page
          this.$router.push({ name: 'Login' });
        } catch (err) {
          console.error('Failed to logout', err);
          this.$router.push({ name: 'Login' });
        }
      }
    }
  }
</script>