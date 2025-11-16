import { defineStore } from 'pinia';
import { courseService } from '../api/courseService';
import type { CourseSummary, CourseDetails } from '../types/Curriculum';

interface CourseStoreState {
    courses: CourseSummary[];
    currentCourse: CourseDetails | null;
    isLoading: boolean;
    error: string | null;
}

export const useCourseStore = defineStore('course', {
    state: (): CourseStoreState => ({
        courses: [],
        currentCourse: null,
        isLoading: false,
        error: null,
    }),

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
            } finally {
                this.isLoading = false;
            }
        },

        clearCurrentCourse() {
            this.currentCourse = null;
        }
    }
});