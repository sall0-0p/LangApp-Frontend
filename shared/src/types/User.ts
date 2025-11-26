import type { CourseSummary, LessonSummary } from "./Curriculum";

export interface User {
    id: number,
    username: string,
    email: string,
    enrolledCourses: CourseSummary[],
    lastLesson: LessonSummary,
    activeCourseIdentifier: string,
    completedLessonIds: string[],
}