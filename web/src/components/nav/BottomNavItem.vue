<template>
  <component
      :is="isLink ? 'router-link' : 'div'"
      :to="isLink ? href : undefined"
      :class="linkClasses"
      class="cursor-pointer"
  >
    <slot></slot>
    <span :class="labelClasses">{{ label }}</span>
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  href: { type: String, default: '#' },
  active: { type: Boolean, default: false },
  label: { type: String, required: true }
});

// If the href is '#', we treat it as a button (like Logout), otherwise a router-link
const isLink = computed(() => props.href !== '#' && props.href !== '');

const linkClasses = computed(() => [
  'flex', 'flex-col', 'items-center', 'justify-center', 'p-2', 'w-1/4',
  props.active ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
]);

const labelClasses = computed(() => [
  'text-xs',
  props.active ? 'font-bold' : 'font-medium'
]);
</script>