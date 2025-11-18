<script>
  export default {
    // 1. Define the props, including `modelValue` for v-model
    props: {
      label: String,
      type: String,
      placeholder: String,
      modelValue: String // This prop is bound by v-model
    },

    // 2. Define the event v-model will listen for
    emits: ['update:modelValue'],

    computed: {
      // 3. Create an internal computed property to read/write the value
      // This connects the prop/event to the <input> element's v-model
      value: {
        get() {
          return this.modelValue;
        },
        set(newValue) {
          this.$emit('update:modelValue', newValue);
        }
      }
    }
  }
</script>

<template>
  <div class="mb-4">
    <label
        :for="label"
        class="block mb-2 text-sm font-bold text-gray-700"
    >
      {{ label }}
    </label>
    <input
        :id="label"
        v-model="value"
    :type="type"
    :placeholder="placeholder"
    class="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
    />
  </div>
</template>