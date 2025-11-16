<script>
  import AppCard from '@/components/AppCard.vue';
  import AppButton from '@/components/AppButton.vue';

  // Import Pinia helpers and the store
  import { mapState, mapActions } from 'pinia';
  import { useAuthStore } from '@myapp/shared/store';

  export default {
    components: {
      AppCard,
      AppButton
    },

    // 1. "Map" the 'user' object from the store's state
    // This gives us access to 'this.user'
    computed: {
      ...mapState(useAuthStore, ['user']),

      // A local computed property to safely get the name
      userName() {
        // 'this.user' might be null briefly, so we check
        return this.user ? this.user.username : 'Learner';
      }
    },

    // 2. "Map" the 'logout' action from the store
    // This gives us access to 'this.logout()'
    methods: {
      ...mapActions(useAuthStore, ['logout']),

      async handleLogout() {
        try {
          await this.logout();
          // On success, push to the Login page
          this.$router.push({ name: 'Login' });
        } catch (err) {
          console.error('Failed to logout', err);
          // Even if API fails, force-redirect
          this.$router.push({ name: 'Login' });
        }
      }
    }
  }
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-gray-100">
    <AppCard>
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-gray-800">
          <!-- 3. Use the computed property -->
          Welcome, {{ userName }}!
        </h1>
        <p class="text-gray-500 mt-2 text-lg">
          This is your home page placeholder.
        </p>

        <div class="mt-8">
          <!-- 4. Call the logout method on click -->
          <AppButton @click="handleLogout">
            Log Out
          </AppButton>
        </div>
      </div>
    </AppCard>
  </div>
</template>