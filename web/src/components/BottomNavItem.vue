<template>
  <a :href="href" :class="linkClasses">
    <slot></slot>
    <span :class="labelClasses">{{ label }}</span>
  </a>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    href: { type: String, default: '#' },
    active: { type: Boolean, default: false },
    label: { type: String, required: true }
  });

  const linkClasses = computed(() => [
    'flex', 'flex-col', 'items-center', 'justify-center', 'p-2', 'w-1/4',
    props.active ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
  ]);

  const labelClasses = computed(() => [
    'text-xs',
    props.active ? 'font-bold' : 'font-medium'
  ]);
</script>