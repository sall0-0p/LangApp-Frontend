<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "CardComponent"
})
</script>

<template>
  <div class="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border-b-8 border-gray-200">
    <slot />
  </div>
</template>

<style scoped>

</style>