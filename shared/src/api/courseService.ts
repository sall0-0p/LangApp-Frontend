import apiClient from './apiClient';
import type { CourseSummary, CourseDetails } from '../types/Curriculum';

// This service wraps the API calls to your CourseController
export const courseService = {
    /**
     * Fetches all courses (summary view)
     * Corresponds to: GET /api/v1/courses
     */
    getAllCourses(): Promise<CourseSummary[]> {
        return apiClient.get('/courses')
            .then(res => res.data);
    },

    /**
     * Get a single course by its ID (detailed view)
     * Corresponds to: GET /api/v1/courses/{id}
     */
    getCourseById(identifier: string): Promise<CourseDetails> {
        return apiClient.get(`/courses/${identifier}`)
            .then(res => res.data);
    }
}