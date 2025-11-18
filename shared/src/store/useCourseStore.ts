import { defineStore } from 'pinia';
import { courseService } from '../api/courseService';
import type { CourseSummary, CourseDetails, LessonSummary } from '../types/Curriculum';
import type { User } from '../types';

const storage = {
    getItem(key: string): string | null {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            return null;
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
    activeCourseIdentifier: string | null;
    isLoading: boolean;
    error: string | null;
}

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
         */
        activeCourseProgress: (state) => (user: User | null): number => {
            if (!state.currentCourse || !user) return 0;

            const completedIds = user.completedLessonIds || [];
            const allLessons = getAllLessons(state.currentCourse);

            if (allLessons.length === 0) return 0;

            const completedLessons = allLessons.filter(lesson =>
                completedIds.includes(lesson.identifier)
            );

            return Math.round((completedLessons.length / allLessons.length) * 100);
        },

        /**
         * Finds the very next lesson the user should take.
         */
        activeLesson: (state) => (user: User | null): LessonSummary | null => {
            if (!state.currentCourse || !user) {
                return null;
            }

            const allLessons = getAllLessons(state.currentCourse);
            if (allLessons.length === 0) {
                return null;
            }

            const completedIds = user.completedLessonIds || [];

            const nextLesson = allLessons.find(lesson =>
                !completedIds.includes(lesson.identifier)
            );

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
                this.setActiveCourseIdentifier(identifier);
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch course details';
                this.currentCourse = null;
            } finally {
                this.isLoading = false;
            }
        },

        async loadActiveCourse() {
            if (this.activeCourseIdentifier) {
                await this.fetchCourseById(this.activeCourseIdentifier);
                return;
            }

            await this.fetchCourses();
            if (this.courses.length > 0) {
                const firstCourseIdentifier = this.courses[0].identifier;
                await this.fetchCourseById(firstCourseIdentifier);
            } else {
                this.error = "No courses are available.";
                this.currentCourse = null;
            }
        },

        setActiveCourseIdentifier(identifier: string) {
            this.activeCourseIdentifier = identifier;
            storage.setItem(ACTIVE_COURSE_KEY, identifier);
        },

        clearCurrentCourse() {
            this.currentCourse = null;
        }
    }
});