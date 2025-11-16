<template>
  <CoursePathHeader title="Learn" />

  <div class="p-4 md:pt-0 max-w-lg mx-auto pb-20">

    <CourseProgressCard
        :title="course.title"
        :emoji="course.emoji"
        :level="course.level"
        :progressPercent="course.progressPercent"
    />

    <div class="space-y-8">

      <div v-for="section in sections" :key="section.id">

        <h3 class="text-xl font-bold text-gray-500 mb-4 pb-2 border-b-2 border-gray-300">
          {{ section.title }}
        </h3>

        <div class="space-y-6">
          <LessonItem
              v-for="lesson in section.lessons"
              :key="lesson.id"
              :lesson="lesson"
              :status="lesson.status"
          />
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CoursePathHeader from '@/components/CoursePathHeader.vue';
import CourseProgressCard from '@/components/CourseProgressCard.vue';
import LessonItem from '@/components/LessonItem.vue';

// --- This data would come from your store/API ---
const course = ref({
  title: 'Japanese Foundations',
  emoji: '🇯🇵',
  level: 5,
  progressPercent: 40
});

const sections = ref([
  {
    id: 1,
    title: 'Section 1: The Basics',
    lessons: [
      { id: 1, title: 'Lesson 1: Hiragana Vowels', status: 'completed', href: '#' },
      { id: 2, title: 'Lesson 2: K-Line', status: 'completed', href: '#' },
      { id: 3, title: 'Lesson 3: S-Line', subtitle: "Learn 'sa, shi, su, se, so'", status: 'active', href: '#' }
    ]
  },
  {
    id: 2,
    title: 'Section 2: First Words',
    lessons: [
      { id: 4, title: 'Lesson 4: Common Greetings', status: 'locked', href: '#' },
      { id: 5, title: 'Lesson 5: Numbers 1-10', status: 'locked', href: '#' }
    ]
  }
]);
</script>