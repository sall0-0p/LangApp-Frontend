<script lang="js">
  export default {
    // 1. Define the props
    props: {
      type: {
        type: String,
        default: 'button'
      }
    }
  }
</script>

<template>
  <button
      :type="type"
      class="w-full bg-red-600 text-white p-3 rounded-lg font-bold text-lg shadow-md hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
  >
    <slot />
  </button>
</template>

<style scoped>

</style>