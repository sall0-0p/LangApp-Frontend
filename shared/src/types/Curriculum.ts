export enum Language {
    ENGLISH = 'ENGLISH',
    GERMAN = 'GERMAN',
    UKRAINIAN = 'UKRAINIAN'
}

export interface LessonSummary {
    identifier: string;
    title: string;
    orderIndex: number;
    completed: boolean;
}

export interface SectionSummary {
    identifier: string;
    title: string;
    orderIndex: number;
    lessons: LessonSummary[];
}

export interface CourseSummary {
    identifier: string;
    title: string;
    originLanguage: Language;
    targetLanguage: Language;
    isEnrolled: boolean;
}

export interface CourseDetails {
    identifier: string;
    title: string;
    originLanguage: Language;
    targetLanguage: Language;
    enrolled: boolean;

    sections: SectionSummary[];
}