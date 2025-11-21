<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@myapp/shared/store/useCourseStore';
import { useAuthStore } from '@myapp/shared/store/useAuthStore';
import CourseProgressCard from '../components/course/CourseProgressCard.vue';
import CourseSelectionCard from '../components/course/CourseSelectionCard.vue';

const router = useRouter();
const courseStore = useCourseStore();
const authStore = useAuthStore();

onMounted(() => {
  courseStore.fetchCourses();
});

const handleCourseSelect = async (identifier, isEnrolled = false) => {
  // 1. Set the course as active in the store (persists choice)
  await courseStore.fetchCourseById(identifier);

  if (isEnrolled) {
    // CASE A: Already enrolled. Go to Home to see the Learning Path.
    courseStore.setActiveCourseIdentifier(identifier);
    await router.push({ name: 'Home' });
  } else {
    // CASE B: First enrollment. Jump straight to the first lesson.
    const nextLesson = courseStore.activeLesson(authStore.user);
    if (nextLesson) {
      await router.push({ name: 'Learn', params: { id: nextLesson.identifier } });
    }
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-8">Courses</h1>

    <div v-if="courseStore.isLoading" class="text-center py-12">
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
              :progress-percent="50"
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