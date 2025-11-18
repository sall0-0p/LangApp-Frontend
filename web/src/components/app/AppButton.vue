<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'outline'].includes(value)
  }
});

const baseClasses = "w-full p-3 rounded-xl font-bold text-lg shadow-md transition-all duration-200 transform hover:-translate-y-1 focus:outline-none active:translate-y-0 active:shadow-sm";

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'white':
      return "bg-white text-red-600 hover:bg-gray-50 border-b-4 border-gray-200 hover:border-gray-300";
    case 'secondary':
      return "bg-gray-200 text-gray-700 hover:bg-gray-300 border-b-4 border-gray-300 hover:border-gray-400";
    case 'outline':
      return "bg-transparent border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 shadow-none";
    case 'danger':
      return "bg-red-500 text-white hover:bg-red-600 border-b-4 border-red-700";
    case 'primary':
    default:
      return "bg-red-500 text-white hover:bg-red-600 border-b-4 border-red-700";
  }
});
</script>

<template>
  <button
      :type="type"
      :class="[baseClasses, variantClasses]"
  >
    <slot />
  </button>
</template>