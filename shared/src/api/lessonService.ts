// shared/src/api/lessonService.ts
import apiClient from './apiClient';
import type { LessonDetails, Task } from '../types/Lesson';

export const lessonService = {
    /**
     * Fetch metadata for a specific lesson (title, status, topics)
     * Corresponds to: GET /api/lessons/{identifier}
     */
    getLessonDetails(identifier: string): Promise<LessonDetails> {
        return apiClient.get(`/lessons/${identifier}`)
            .then(res => res.data);
    },

    /**
     * Fetch the list of interactive exercises (tasks) for the session.
     * Corresponds to: GET /api/lessons/{identifier}/tasks
     */
    getLessonTasks(identifier: string): Promise<Task[]> {
        return apiClient.get(`/lessons/${identifier}/tasks`)
            .then(res => res.data);
    },

    /**
     * Mark the lesson as finished.
     * Corresponds to: POST /api/lessons/{identifier}/complete
     */
    completeLesson(identifier: string): Promise<string> {
        return apiClient.post(`/lessons/${identifier}/complete`)
            .then(res => res.data);
    }
};