// shared/src/store/useCourseStore.ts
import { defineStore } from 'pinia';
import { courseService } from '../api/courseService';
import { authService } from '../api/authService';
import { useAuthStore } from './useAuthStore';
import type { CourseSummary, CourseDetails, LessonSummary } from '../types/Curriculum';
import type { User } from '../types';

const storage = {
    getItem(key: string): string | undefined | null {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // return ApplicationSettings.getString(key, null);
        } else {
            return localStorage.getItem(key);
        }
    },
    setItem(key: string, value: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // ApplicationSettings.setString(key, value);
        } else {
            localStorage.setItem(key, value);
        }
    },
    removeItem(key: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // ApplicationSettings.remove(key);
        } else {
            localStorage.removeItem(key);
        }
    }
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
        // [FIX] Sanitize storage to prevent "null" string causing 404s
        activeCourseIdentifier: (() => {
            const val = storage.getItem(ACTIVE_COURSE_KEY);
            if (val === 'null' || val === 'undefined') return null;
            return val || null;
        })(),
        isLoading: false,
        error: null,
    }),

    getters: {
        enrolledCourses: (state): CourseSummary[] => {
            return state.courses.filter(course => course.isEnrolled);
        },

        availableCourses: (state): CourseSummary[] => {
            return state.courses.filter(course => !course.isEnrolled);
        },

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

        activeLesson: (state) => (user: User | null): LessonSummary | null => {
            if (!state.currentCourse) {
                return null;
            }

            const allLessons = getAllLessons(state.currentCourse);
            if (allLessons.length === 0) {
                return null;
            }

            const completedIds = user?.completedLessonIds || [];

            const nextLesson = allLessons.find(lesson =>
                !completedIds.includes(lesson.identifier)
            );

            return nextLesson || allLessons[0] || null;
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
                return this.activeCourseIdentifier;
            }
            return null;
        },

        async setActiveCourseIdentifier(identifier: string, syncToServer = true) {
            this.activeCourseIdentifier = identifier;
            storage.setItem(ACTIVE_COURSE_KEY, identifier);

            if (syncToServer) {
                const authStore = useAuthStore();
                if (authStore.user) {
                    authStore.user.activeCourseIdentifier = identifier;
                }
                try {
                    await authService.updateMe({ activeCourseIdentifier: identifier });
                } catch (e) {
                    console.error("Failed to sync active course to server", e);
                }
            }
        },

        clearCurrentCourse() {
            this.currentCourse = null;
            this.activeCourseIdentifier = null;
            // [FIX] Explicitly remove from storage so it doesn't persist as "null" string
            storage.removeItem(ACTIVE_COURSE_KEY);
        }
    }
});