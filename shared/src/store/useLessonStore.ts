import { defineStore } from 'pinia';
import { lessonService } from '../api/lessonService';
// [FIX] Import the auth store to update user progress locally
import { useAuthStore } from './useAuthStore';
import type { LessonDetails, Task } from '../types/Lesson';

interface LessonStoreState {
    currentLesson: LessonDetails | null;

    // Queue management
    tasks: Task[];
    mistakeBuffer: Task[];

    // State flags
    currentTaskIndex: number;
    isCorrectionPhase: boolean;
    showCorrectionIntro: boolean;
    isFinished: boolean;

    // Stats
    initialTaskCount: number;
    correctCount: number;

    isLoading: boolean;
    error: string | null;
    isCompleting: boolean;
}

export const useLessonStore = defineStore('lesson', {
    state: (): LessonStoreState => ({
        currentLesson: null,
        tasks: [],
        mistakeBuffer: [],
        currentTaskIndex: 0,
        isCorrectionPhase: false,
        showCorrectionIntro: false,
        isFinished: false,
        initialTaskCount: 0,
        correctCount: 0,
        isLoading: false,
        error: null,
        isCompleting: false,
    }),

    getters: {
        activeTask: (state): Task | null => {
            if (!state.tasks.length || state.currentTaskIndex >= state.tasks.length) {
                return null;
            }
            return state.tasks[state.currentTaskIndex];
        },

        sessionProgress: (state): number => {
            if (state.initialTaskCount === 0) return 0;
            if (state.isCorrectionPhase || state.isFinished) return 100;
            return Math.round((state.currentTaskIndex / state.initialTaskCount) * 100);
        },

        isSessionFinished: (state): boolean => {
            // This ensures we don't count finished until corrections are done too
            return state.isFinished;
        }
    },

    actions: {
        async loadLessonSession(identifier: string) {
            this.isLoading = true;
            this.error = null;
            this.resetSession();

            try {
                const [details, tasks] = await Promise.all([
                    lessonService.getLessonDetails(identifier),
                    lessonService.getLessonTasks(identifier)
                ]);

                this.currentLesson = details;
                this.tasks = tasks;
                this.initialTaskCount = tasks.length;
            } catch (err: any) {
                console.error('Failed to load lesson:', err);
                this.error = err.message || 'Failed to load lesson.';
            } finally {
                this.isLoading = false;
            }
        },

        registerResult(isCorrect: boolean) {
            const task = this.activeTask;
            if (!task) return;

            if (isCorrect) {
                if (!this.isCorrectionPhase) {
                    this.correctCount++;
                }
            } else {
                this.mistakeBuffer.push({ ...task });
            }
        },

        proceed() {
            // 1. Advance Index
            if (this.currentTaskIndex < this.tasks.length - 1) {
                this.currentTaskIndex++;
                return;
            }

            // 2. Check for mistakes
            if (this.mistakeBuffer.length > 0) {
                this.showCorrectionIntro = true;
                this.isCorrectionPhase = true;

                this.tasks = [...this.mistakeBuffer];
                this.mistakeBuffer = [];
                this.currentTaskIndex = 0;
            } else {
                // 3. Finish
                this.finishLesson();
            }
        },

        startCorrection() {
            this.showCorrectionIntro = false;
        },

        async finishLesson() {
            this.isFinished = true; // Immediate UI update (show trophy)

            if (!this.currentLesson) return;

            this.isCompleting = true;
            try {
                await lessonService.completeLesson(this.currentLesson.identifier);

                const authStore = useAuthStore();
                if (authStore.user) {
                    const lessonId = this.currentLesson.identifier;
                    if (!authStore.user.completedLessonIds.includes(lessonId)) {
                        authStore.user.completedLessonIds.push(lessonId);
                    }
                }

            } catch (err: any) {
                console.error('Failed to save progress:', err);
            } finally {
                this.isCompleting = false;
            }
        },

        resetSession() {
            this.currentLesson = null;
            this.tasks = [];
            this.mistakeBuffer = [];
            this.currentTaskIndex = 0;
            this.isCorrectionPhase = false;
            this.showCorrectionIntro = false;
            this.isFinished = false;
            this.initialTaskCount = 0;
            this.correctCount = 0;
            this.error = null;
        }
    }
});