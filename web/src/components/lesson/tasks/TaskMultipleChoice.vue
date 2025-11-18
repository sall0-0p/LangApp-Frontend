<script setup lang="ts">
import { computed } from 'vue';
import type { MultipleChoiceData, WordExpression } from '../../../../shared/src/types/Lesson'; // Adjust import path

const props = defineProps<{
  data: MultipleChoiceData;
  selectedOption: WordExpression | null;
  // If provided, the component highlights the correct/wrong answers
  correctOption: WordExpression | null;
  status: 'idle' | 'correct' | 'wrong';
}>();

const emit = defineEmits<{
  (e: 'select', option: WordExpression): void
}>();

// Combine correct word and distractors, then shuffle.
// Note: In a real app, shuffle in the parent (View) to prevent reshuffling on re-renders!
// For now, we assume `props.data.distractors` + `question` come in a pre-shuffled array
// OR we compute it once. Let's assume the parent passes a `choices` array prop ideally,
// but to keep this standalone, let's compute it.
// WARNING: This computed will re-evaluate if props change.
// Ideally, the View should pass the "choices" array to ensure stability.
const choices = computed(() => {
  // Simple shuffle for demo.
  // In production, pass 'choices' as a prop from the View to ensure they stay in place.
  const all = [props.data.question_word, ...props.data.distractors];
  return all.sort((a, b) => a.expression.localeCompare(b.expression));
});

const getButtonClass = (option: WordExpression) => {
  const isSelected = props.selectedOption?.expression === option.expression;
  const isCorrectAnswer = props.correctOption?.expression === option.expression;

  // Base styles
  let classes = "border-2 rounded-2xl p-4 text-center transition-all duration-200 cursor-pointer select-none relative overflow-hidden ";

  if (props.status === 'idle') {
    // Interactive state
    if (isSelected) {
      classes += "border-red-500 bg-red-50 ring-2 ring-red-200 transform scale-[1.02]";
    } else {
      classes += "border-gray-200 bg-white hover:border-red-300 hover:shadow-md hover:scale-[1.02]";
    }
  } else {
    // Result state (disabled interaction)
    if (isCorrectAnswer) {
      classes += "border-green-500 bg-green-50 ring-2 ring-green-200";
    } else if (isSelected && !isCorrectAnswer) {
      classes += "border-red-500 bg-red-100 opacity-75";
    } else {
      classes += "border-gray-100 bg-gray-50 opacity-50"; // Dim unselected/irrelevant
    }
  }

  return classes;
};
</script>

<template>
  <div>
    <div class="mb-8 text-center animate-fade-in">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Select the correct meaning</h2>
      <div class="inline-block bg-gray-100 px-4 py-2 rounded-lg">
        <span class="text-lg font-medium text-gray-600">"{{ data.question_word.origin }}"</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <button
          v-for="option in choices"
          :key="option.expression"
          @click="status === 'idle' ? emit('select', option) : null"
          :class="getButtonClass(option)"
          :disabled="status !== 'idle'"
      >
        <span class="text-5xl block mb-3 transition-transform duration-300" :class="selectedOption === option ? 'scale-110' : ''">
          {{ option.emoji || '📄' }}
        </span>
        <span class="text-lg font-bold text-gray-700">{{ option.expression }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>