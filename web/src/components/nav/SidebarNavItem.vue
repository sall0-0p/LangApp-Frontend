<template>
  <a :href="href" :class="navClasses">
    <slot></slot>
  </a>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    href: { type: String, default: '#' },
    active: { type: Boolean, default: false }
  });

  const navClasses = computed(() => [
    'flex', 'items-center', 'p-3', 'rounded-lg',
    props.active
        ? 'bg-red-100 text-red-700 font-bold'
        : 'text-gray-600 hover:bg-gray-100 font-medium'
  ]);
</script>