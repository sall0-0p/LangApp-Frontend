<template>
  <CoursePathHeader title="Learn" />

  <div class="p-4 md:pt-0 max-w-lg mx-auto pb-20">

    <div v-if="courseStore.isLoading || authStore.isLoading" class="text-center p-10">
      <p class="text-gray-500">Loading your course...</p>
    </div>

    <div v-else-if="courseStore.error" class="text-center p-10 bg-red-100 rounded-lg">
      <p class="font-bold text-red-700">Oops!</p>
      <p class="text-red-600">{{ courseStore.error }}</p>
    </div>

    <template v-else-if="course && user">

      <CourseProgressCard
          :title="course.title"
          :emoji="course.emoji"
          :level="course.level" :progressPercent="progressPercent"
      />

      <div class="space-y-8 mt-8">
        <div v-for="section in course.sections" :key="section.id">
          <h3 class="text-xl font-bold text-gray-500 mb-4 pb-2 border-b-2 border-gray-300">
            {{ section.title }}
          </h3>

          <div class="space-y-6">
            <LessonItem
                v-for="lesson in section.lessons"
                :key="lesson.orderIndex"
                :lesson="lesson"
                :status="getLessonStatus(lesson.identifier)"
            />
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center p-10">
      <p class="text-gray-500">No course selected.</p>
    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@myapp/shared/store/useAuthStore.js';
import { useCourseStore } from '@myapp/shared/store/useCourseStore';

import CoursePathHeader from '@/components/course/CoursePathHeader.vue';
import CourseProgressCard from '@/components/course/CourseProgressCard.vue';
import LessonItem from '@/components/lesson/LessonItem.vue';
import router from "@/router/index.js";

const authStore = useAuthStore();
const courseStore = useCourseStore();

// --- Computed Properties ---

// Get the full course object from the course store
const course = computed(() => courseStore.currentCourse);

// Get the user object from the auth store
const user = computed(() => authStore.user);

// Get the active lesson (the next one to be completed)
// We pass the user object to the getter
const activeLesson = computed(() => courseStore.activeLesson(user.value));

// Calculate progress based on user and course
// We pass the user object to the getter
const progressPercent = computed(() => {
  return courseStore.activeCourseProgress(user.value);
});

// --- Methods ---

/**
 * Determines the status of a lesson (completed, active, or locked)
 * based on the user's progress.
 *
 * NOTE: This assumes 'user.value' has a 'completedLessonIds' array.
 */
function getLessonStatus(lessonId) {
  // @ts-ignore - Assuming completedLessonIds
  if (user.value?.completedLessonIds?.includes(lessonId)) {
    return 'completed';
  }
  // @ts-ignore - Assuming lesson.id
  if (activeLesson.value?.identifier === lessonId) {
    return 'active';
  }
  return 'locked';
}

// --- Lifecycle Hooks ---

onMounted(() => {
  // When the component mounts, just tell the course store to
  // load whichever course is supposed to be active.
  // The store itself now handles all the logic.
  courseStore.loadActiveCourse().then((result) => {
    if (!result) {
      router.push("/courses");
    }
  });
});

</script>