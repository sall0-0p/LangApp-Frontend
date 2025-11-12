<script>
  // Import our components
  import AppCard from '@/components/AppCard.vue';
  import AppButton from '@/components/AppButton.vue';
  import AppInput from '@/components/AppInput.vue';

  // Import Pinia helpers and the store
  import { mapActions } from 'pinia';
  import { useAuthStore } from '@myapp/shared/store';

  export default {
    // 1. Register the components
    components: {
      AppCard,
      AppButton,
      AppInput
    },

    // 2. Define local component state
    data() {
      return {
        email: '',
        password: '',
        error: null,
      };
    },

    // 3. Define methods
    methods: {
      // 4. "Map" the 'login' action from useAuthStore
      // This gives us access to 'this.login(...)'
      ...mapActions(useAuthStore, ['login']),

      // This is our component's local method
      async handleLogin() {
        this.error = null; // Clear old errors
        try {
          // 5. Call the mapped action
          await this.login(this.email, this.password);

          console.log("Succesfully logged in!");

          await this.$nextTick();
          this.$router.push({ name: 'Home' });
        } catch (err) {
          console.error(err);
          this.error = 'Invalid email or password. Please try again.';
        }
      }
    }
  }
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-gray-100">
    <AppCard>
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-800">
          Ready for your next lesson? 👋
        </h1>
        <p class="text-gray-500 mt-2 text-lg">
          Let's pick up where you left off! 🗺️
        </p>
      </div>

      <!-- Login Form -->
      <!-- We use @submit.prevent to call our handleLogin method -->
      <form @submit.prevent="handleLogin">

        <AppInput
            v-model="email"
            label="Email 📧"
            type="email"
            placeholder="you@example.com"
        />

        <AppInput
            v-model="password"
            label="Password 🔒"
            type="password"
            placeholder="••••••••"
        />

        <!-- Display login error -->
        <div v-if="error" class="mb-4 text-center text-red-600 font-medium">
          {{ error }}
        </div>

        <div class="mb-6">
          <AppButton type="submit">
            Let's Go! 🚀
          </AppButton>
        </div>

        <!-- Links -->
        <div class="text-center mt-6">
          <a href="#" class="text-sm text-red-600 hover:underline font-medium">
            Forgot your password?
          </a>
        </div>
        <div class="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
          New learner? <a href="#" class="font-medium text-red-600 hover:underline">Start your adventure!</a>
        </div>
      </form>
    </AppCard>
  </div>
</template>