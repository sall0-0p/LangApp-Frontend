<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@myapp/shared/store/useCourseStore';
import { useAuthStore } from '@myapp/shared/store/useAuthStore';
import CourseProgressCard from '../components/course/CourseProgressCard.vue';
import CourseSelectionCard from '../components/course/CourseSelectionCard.vue';

const router = useRouter();
const courseStore = useCourseStore();
const authStore = useAuthStore();

// Local state to store full details for enrolled courses (for progress bars)
const enrolledDetails = ref({});

onMounted(async () => {
  await courseStore.fetchCourses();

  // Fetch details for all enrolled courses to calculate progress
  for (const course of courseStore.enrolledCourses) {
    // We use the store's service directly or action to get data without setting 'currentCourse'
    // A trick is to use the service directly if exposed, or just rely on a new action.
    // For simplicity, let's assume we can't easily get details without setting current.
    // Ideally, the backend 'getAllCourses' should return progress %.
    // WORKAROUND: We will skip fetching detail for now to avoid flickering currentCourse
    // and just default to 0 if we can't calculate, OR assume backend adds it later.

    // Better approach: If you really want progress here, the API should return it in the summary.
    // Calculating it client side requires N+1 requests.
  }
});

const handleCourseSelect = async (identifier, isEnrolled = false) => {
  // 1. Fetch the course to ensure we have its data (lessons, etc)
  await courseStore.fetchCourseById(identifier);

  // 2. Set as active AND sync to server. Await this to ensure persistence.
  await courseStore.setActiveCourseIdentifier(identifier, true);

  if (isEnrolled) {
    // CASE A: Already enrolled. Go to Home.
    await router.push({ name: 'Home' });
  } else {
    // CASE B: First enrollment.
    // The activeLesson getter relies on 'currentCourse' being set (which fetchCourseById did)
    const nextLesson = courseStore.activeLesson(authStore.user);
    if (nextLesson) {
      await router.push({ name: 'Learn', params: { id: nextLesson.identifier } });
    } else {
      // Fallback if no lessons found
      await router.push({ name: 'Home' });
    }
  }
};

// Helper to get progress.
// Note: Since 'getAllCourses' returns summaries without sections,
// we can't calculate progress locally without fetching each course.
// For this fix, I will return 0 or a placeholder unless you update the backend.
// HOWEVER, if 'HomeView' cached the details, we might have them.
const getProgress = (identifier) => {
  // If the currently loaded course matches, use its calculated progress
  if (courseStore.currentCourse && courseStore.currentCourse.identifier === identifier) {
    return courseStore.activeCourseProgress(authStore.user);
  }
  return 0; // Backend update recommended to send progress in summary
};
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-8">Courses</h1>

    <div v-if="courseStore.isLoading && courseStore.courses.length === 0" class="text-center py-12">
      <p class="text-gray-500">Loading courses...</p>
    </div>

    <div v-else-if="courseStore.error" class="text-center py-12">
      <p class="text-red-500">{{ courseStore.error }}</p>
    </div>

    <div v-else>
      <section v-if="courseStore.enrolledCourses.length > 0" class="mb-12">
        <h2 class="text-xl font-bold text-gray-700 mb-6 border-b pb-2">My Learning</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CourseProgressCard
              v-for="course in courseStore.enrolledCourses"
              :key="course.identifier"
              :title="course.title"
              :emoji="course.emoji"
              :progress-percent="getProgress(course.identifier)"
              class="cursor-pointer hover:bg-gray-50 transition-colors !mb-0 h-full"
              @click="handleCourseSelect(course.identifier, true)"
          />
        </div>
      </section>

      <section>
        <h2 class="text-xl font-bold text-gray-700 mb-6 border-b pb-2">Explore Courses</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseSelectionCard
              v-for="course in courseStore.availableCourses"
              :key="course.identifier"
              :title="course.title"
              :emoji="course.emoji"
              :origin-language="course.originLanguage"
              :target-language="course.targetLanguage"
              @start="handleCourseSelect(course.identifier, false)"
          />
        </div>

        <div v-if="courseStore.availableCourses.length === 0 && courseStore.enrolledCourses.length === 0" class="text-center py-8 text-gray-500">
          No courses found.
        </div>
      </section>
    </div>
  </div>
</template>