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
            // Use the general calculation logic
            return calculateCourseProgress(state.currentCourse, user);
        },

        activeLesson: (state) => (user: User | null): LessonSummary | null => {
            if (!state.currentCourse) return null;
            const allLessons = getAllLessons(state.currentCourse);
            if (allLessons.length === 0) return null;

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

        // Helper to calculate progress for ANY course (not just active one)
        // Note: For CourseSummary, we might not have 'sections'.
        // This assumes we might need to fetch details or backend provides 'totalLessons' count.
        // For now, if we only have CourseSummary, we can't calc exact progress unless we fetch details
        // OR if the summary object has a 'progress' field from backend.
        // Assuming we rely on fetching details or passing a CourseDetails object:
        getCourseProgress(course: CourseDetails | CourseSummary, user: User | null): number {
            // @ts-ignore - Assuming course might be full details or we need logic
            if (!course || !user) return 0;
            // If it's just a summary without sections, we return 0 (or backend should provide %)
            // @ts-ignore
            if (!course.sections) return 0;

            // @ts-ignore
            return calculateCourseProgress(course, user);
        },

        clearCurrentCourse() {
            this.currentCourse = null;
            this.activeCourseIdentifier = null;
            storage.removeItem(ACTIVE_COURSE_KEY);
        }
    }
});

// Helper function
function calculateCourseProgress(course: any, user: User | null): number {
    if (!course || !user || !course.sections) return 0;

    const completedIds = user.completedLessonIds || [];
    const allLessons = course.sections.flatMap((s: any) => s.lessons);

    if (allLessons.length === 0) return 0;

    const completedCount = allLessons.filter((l: any) =>
        completedIds.includes(l.identifier)
    ).length;

    return Math.round((completedCount / allLessons.length) * 100);
}