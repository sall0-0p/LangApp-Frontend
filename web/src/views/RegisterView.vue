<script>
  // Import our components
  import AppCard from '@/components/app/AppCard.vue';
  import AppButton from '@/components/app/AppButton.vue';
  import AppInput from '@/components/app/AppInput.vue';

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
        name: '',
        email: '',
        password: '',
        error: null,
        loggedIn: false,
      };
    },

    // 3. Define methods
    methods: {
      // 4. "Map" the 'register' action from useAuthStore
      // This gives us access to 'this.register(...)'
      ...mapActions(useAuthStore, ['register']),

      // This is our component's local method
      async handleRegister() {
        this.error = null; // Clear old errors
        try {
          // 5. Call the mapped action
          await this.register(this.name, this.email, this.password);
          this.loggedIn = true;

          console.log("Succesfully registered!");

          // // On success, navigate to the Home page
          // await this.$nextTick();
          // this.$router.push({ name: 'Home' });
        } catch (err) {
          console.error(err);
          this.error = 'Registration failed. Please check your details and try again.';
        }
      }
    }
  }
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-gray-100">
    <AppCard>
      <div v-if="loggedIn">
        <div class="text-6xl text-center mb-4">
          📨
        </div>

        <h1 class="text-3xl font-extrabold text-gray-800">
          Check your inbox
        </h1>

        <p class="text-gray-500 mt-2 text-lg">
          We've sent a verification link to your email.
        </p>
      </div>

      <div v-if="!loggedIn">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-gray-800">
            Start your adventure!
          </h1>
          <p class="text-gray-500 mt-2 text-lg">
            Create your account to begin learning.
          </p>
        </div>

        <form @submit.prevent="handleRegister">
          <AppInput
              v-model="name"
              label="Name 👤"
              type="text"
              placeholder="Your Name"
          />

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

          <div v-if="error" class="mb-4 text-center text-red-600 font-medium">
            {{ error }}
          </div>

          <div class="mb-6">
            <AppButton type="submit">
              Create Account 🌟
            </AppButton>
          </div>

          <div class="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
            Already have an account? <router-link :to="{ name: 'Login' }" class="font-medium text-red-600 hover:underline">Log in!</router-link>
          </div>
        </form>
      </div>
    </AppCard>
  </div>
</template>