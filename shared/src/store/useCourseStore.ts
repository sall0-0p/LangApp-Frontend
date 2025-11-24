import { defineStore } from 'pinia';
import { courseService } from '../api/courseService';
import type { CourseSummary, CourseDetails, LessonSummary } from '../types/Curriculum';
import type { User } from '../types';
import { ApplicationSettings } from '@nativescript/core';

const storage = {
    getItem(key: string): string | null {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            return ApplicationSettings.getString(key, null);
        } else {
            return localStorage.getItem(key);
        }
    },
    setItem(key: string, value: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            ApplicationSettings.setString(key, value);
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
        enrolledCourses: (state): CourseSummary[] => {
            return state.courses.filter(course => course.isEnrolled);
        },

        availableCourses: (state): CourseSummary[] => {
            return state.courses.filter(course => !course.isEnrolled);
        },

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
         * If the user has no history in this course, it returns the first lesson.
         */
        activeLesson: (state) => (user: User | null): LessonSummary | null => {
            if (!state.currentCourse) {
                return null;
            }

            const allLessons = getAllLessons(state.currentCourse);
            if (allLessons.length === 0) {
                return null;
            }

            // If user is null (not logged in logic), we defaults to start.
            // But usually, this is called with a valid user.
            const completedIds = user?.completedLessonIds || [];

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
                // We don't automatically set activeCourseIdentifier here to allow
                // peeking at course details without "selecting" it globally yet.
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

        setActiveCourseIdentifier(identifier: string) {
            this.activeCourseIdentifier = identifier;
            storage.setItem(ACTIVE_COURSE_KEY, identifier);
        },

        clearCurrentCourse() {
            this.currentCourse = null;
        }
    }
});