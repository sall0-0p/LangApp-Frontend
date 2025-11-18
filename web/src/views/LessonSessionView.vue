<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Components
import LessonLayout from '../components/lesson/LessonLayout.vue';
import LessonFooter from '../components/lesson/LessonFooter.vue';
import LessonSummary from '../components/lesson/LessonSummary.vue';
import TaskMultipleChoice from '../components/lesson/tasks/TaskMultipleChoice.vue';

import { useLessonStore } from "@myapp/shared/store";
import { TaskType } from "@myapp/shared/types";
import AppModal from "@/components/app/AppModal.vue";

const route = useRoute();
const router = useRouter();
const store = useLessonStore();

// Local interaction state
const selectedOption = ref<any>(null);
const status = ref<'idle' | 'correct' | 'wrong'>('idle');
const feedbackTitle = ref('');
const feedbackMessage = ref('');

// Modal state
const showExitModal = ref(false);

// Reset local state when moving to next task
watch(() => store.currentTaskIndex, () => {
  selectedOption.value = null;
  status.value = 'idle';
});

onMounted(() => {
  const lessonId = route.params.id as string;
  if (lessonId) {
    store.loadLessonSession(lessonId);
  }
});

const activeTask = computed(() => store.activeTask);
const progress = computed(() => store.sessionProgress);

// --- Actions ---

const handleSelect = (option: any) => {
  selectedOption.value = option;
};

const handleCheck = () => {
  if (!selectedOption.value || !activeTask.value) return;

  const task = activeTask.value;
  let isCorrect = false;

  // Logic for Multiple Choice
  if (
      task.taskType === TaskType.TRANSLATE_WORD_TO_MC ||
      task.taskType === TaskType.TRANSLATE_WORD_FROM_MC
  ) {
    const correctAnswer = task.taskData.question_word;
    isCorrect = selectedOption.value.expression === correctAnswer.expression;

    if (isCorrect) {
      status.value = 'correct';
      feedbackTitle.value = 'Excellent!';
      feedbackMessage.value = `Correct! '${correctAnswer.expression}' means '${correctAnswer.origin}'.`;
      // Audio?
    } else {
      status.value = 'wrong';
      feedbackTitle.value = 'Not quite...';
      feedbackMessage.value = `The correct answer was '${correctAnswer.expression}'.`;
    }
  }

  // 1. Tell store result immediately
  store.registerResult(isCorrect);
};

const handleContinue = () => {
  // 2. Tell store to move on
  store.proceed();
};

const handleStartCorrection = () => {
  store.startCorrection();
};

const handleFinishExit = () => {
  router.push('/');
};

// Updated Exit Handler
const handleExit = () => {
  if (store.isFinished) {
    router.push('/');
    return;
  }
  // Instead of confirm(), show the custom modal
  showExitModal.value = true;
};

// Action for the "Quit Lesson" button in the modal
const confirmExit = () => {
  showExitModal.value = false;
  router.push('/');
};
</script>

<template>
  <LessonLayout
      :title="store.currentLesson?.title || 'Loading...'"
      :progress="progress"
      @exit="handleExit"
  >

    <div v-if="store.isLoading" class="flex flex-col items-center justify-center h-64 space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      <p class="text-gray-500">Loading your lesson...</p>
    </div>

    <div v-else-if="store.error" class="text-center p-8">
      <div class="text-5xl mb-4">😕</div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
      <p class="text-gray-600 mb-6">{{ store.error }}</p>
      <button @click="router.push('/courses')" class="text-red-600 font-bold hover:underline">Go back home</button>
    </div>

    <div v-else-if="store.isFinished">
      <LessonSummary
          :total-tasks="store.initialTaskCount"
          :correct-count="store.correctCount"
          @finish="handleFinishExit"
      />
    </div>

    <div v-else-if="store.showCorrectionIntro" class="flex flex-col items-center justify-center h-full py-12 text-center animate-fade-in">
      <div class="text-6xl mb-6">🙃</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Let's correct your mistakes</h2>
      <p class="text-gray-500 mb-8">Reviewing tricky concepts helps you learn faster.</p>
      <button
          @click="handleStartCorrection"
          class="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg"
      >
        Let's go
      </button>
    </div>

    <div v-else-if="activeTask" class="w-full">

      <TaskMultipleChoice
          v-if="activeTask.taskType === TaskType.TRANSLATE_WORD_TO_MC || activeTask.taskType === TaskType.TRANSLATE_WORD_FROM_MC"
          :data="activeTask.taskData"
          :selected-option="selectedOption"
          :correct-option="activeTask.taskData.question_word"
          :status="status"
          @select="handleSelect"
      />

      <div v-else class="text-center p-4 border-2 border-dashed border-gray-300 rounded-xl">
        <p class="text-gray-500">Unknown task type: {{ activeTask.taskType }}</p>
      </div>

    </div>

    <template #footer>
      <LessonFooter
          v-if="activeTask && !store.isLoading && !store.isFinished && !store.showCorrectionIntro"
          :status="status"
          :is-check-disabled="!selectedOption"
          :feedback-title="feedbackTitle"
          :feedback-message="feedbackMessage"
          @check="handleCheck"
          @continue="handleContinue"
      />
    </template>

    <AppModal
        :isOpen="showExitModal"
        title="Quit Lesson?"
        description="You are making great progress! If you quit now, your progress in this session will be lost."
        confirmText="Quit Lesson"
        cancelText="Stay & Learn"
        isDanger
        @close="showExitModal = false"
        @confirm="confirmExit"
    />

  </LessonLayout>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>