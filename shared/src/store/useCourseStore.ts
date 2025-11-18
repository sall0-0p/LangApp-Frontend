import { defineStore } from 'pinia';
import { courseService } from '../api/courseService';
// We must import these types. I am assuming their shapes below.
import type { CourseSummary, CourseDetails, LessonSummary } from '../types/Curriculum';
import type { User } from '../types';

// --- ASSUMPTIONS ABOUT MISSING TYPES ---
// Based on your files, I have to make these assumptions.
// If they are wrong, you will need to update the getters below.
//
// interface User {
//   completedLessonIds: string[]; // Assumed for calculating progress
// }
//
// interface Lesson {
//   id: string;
// }
//
// interface CourseDetails {
//   level: number; // Based on your static HomeView.vue
//   emoji: string; // Based on your static HomeView.vue
//   title: string; // Based on your static HomeView.vue
//   sections: {
//     id: number | string;
//     title: string;
//     lessons: Lesson[];
//   }[];
// }
// --- END OF ASSUMPTIONS ---


// Use the same storage logic from useAuthStore
const storage = {
    getItem(key: string): string | null {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // ... (native logic)
            return null; // Let's assume web for this example
        } else {
            return localStorage.getItem(key);
        }
    },
    setItem(key: string, value: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // ... (native logic)
        } else {
            localStorage.setItem(key, value);
        }
    },
};

const ACTIVE_COURSE_KEY = 'active_course_identifier';

interface CourseStoreState {
    courses: CourseSummary[];
    currentCourse: CourseDetails | null;
    activeCourseIdentifier: string | null; // This is the new state
    isLoading: boolean;
    error: string | null;
}

// Helper to get all lessons from a course
const getAllLessons = (course: CourseDetails | null): LessonSummary[] => {
    if (!course) return [];
    return course.sections.flatMap(section => section.lessons);
};

export const useCourseStore = defineStore('course', {
    state: (): CourseStoreState => ({
        courses: [],
        currentCourse: null,
        activeCourseIdentifier: storage.getItem(ACTIVE_COURSE_KEY) || null,
        isLoading: false,
        error: null,
    }),

    getters: {
        /**
         * Calculates the progress for the current course.
         * NOTE: This assumes 'user' has a 'completedLessonIds' array.
         */
        activeCourseProgress: (state) => (user: User | null): number => {
            if (!state.currentCourse || !user) return 0;

            // @ts-ignore
            const completedIds = user.completedLessonIds || [];
            const allLessons = getAllLessons(state.currentCourse);

            if (allLessons.length === 0) return 0;

            const completedLessons = allLessons.filter(lesson =>
                // @ts-ignore
                completedIds.includes(lesson.id)
            );

            return Math.round((completedLessons.length / allLessons.length) * 100);
        },

        /**
         * Finds the very next lesson the user should take.
         * NOTE: This assumes 'user' has 'completedLessonIds' and 'lesson' has 'id'.
         */
        activeLesson: (state) => (user: User | null): LessonSummary | null => {
            if (!state.currentCourse || !user) {
                return null; // No course or user
            }

            const allLessons = getAllLessons(state.currentCourse);
            if (allLessons.length === 0) {
                return null; // Course has no lessons
            }

            // @ts-ignore
            const completedIds = user.completedLessonIds || [];
            // @ts-ignore
            const nextLesson = allLessons.find(lesson =>
                !completedIds.includes(lesson.identifier)
            );

            console.log(nextLesson, allLessons);
            return nextLesson || allLessons[0];
        }
    },

    actions: {
        async fetchCourses() {
            this.isLoading = true;
            this.error = null;
            try {
                this.courses = await courseService.getAllCourses();
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch courses';
            } finally {
                this.isLoading = false;
            }
        },

        async fetchCourseById(identifier: string) {
            this.isLoading = true;
            this.error = null;
            try {
                this.currentCourse = await courseService.getCourseById(identifier);
                this.setActiveCourseIdentifier(identifier); // Save this as active
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch course details';
                this.currentCourse = null; // Clear on error
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * This is the main action for the HomeView to call.
         * It loads the active course from memory, or fetches
         * the first course from the API if none is set.
         */
        async loadActiveCourse() {
            if (this.activeCourseIdentifier) {
                await this.fetchCourseById(this.activeCourseIdentifier);
                return;
            }

            // 2. No active course. Fetch all courses to find one.
            await this.fetchCourses(); // This populates this.courses
            if (this.courses.length > 0) {
                // 3. Pick the first course from the list and load it
                const firstCourseIdentifier = this.courses[0].identifier;
                await this.fetchCourseById(firstCourseIdentifier);
            } else {
                // 4. No courses available at all
                this.error = "No courses are available.";
                this.currentCourse = null;
            }
        },

        /**
         * Persists the active course identifier to state and storage.
         */
        setActiveCourseIdentifier(identifier: string) {
            this.activeCourseIdentifier = identifier;
            storage.setItem(ACTIVE_COURSE_KEY, identifier);
        },

        clearCurrentCourse() {
            this.currentCourse = null;
        }
    }
});