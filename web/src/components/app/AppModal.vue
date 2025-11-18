<script setup>
import { defineProps, defineEmits } from 'vue';
import AppButton from './AppButton.vue';

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Attention'
  },
  description: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  // If true, the confirm button will be red/danger style
  isDanger: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);

function close() {
  emit('close');
}

function confirm() {
  emit('confirm');
}
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="close"
      >
        <div
            class="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border-b-8 border-gray-200 transform transition-all"
            role="dialog"
            aria-modal="true"
        >
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
              <span class="text-3xl">🤔</span>
            </div>
          </div>

          <div class="text-center mb-8">
            <h3 class="text-2xl font-black text-gray-800 mb-2">{{ title }}</h3>
            <p class="text-gray-500 font-medium leading-relaxed">
              <slot>{{ description }}</slot>
            </p>
          </div>

          <div class="space-y-3">
            <AppButton
                :variant="isDanger ? 'danger' : 'primary'"
                @click="confirm"
            >
              {{ confirmText }}
            </AppButton>

            <AppButton
                variant="secondary"
                @click="close"
            >
              {{ cancelText }}
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>