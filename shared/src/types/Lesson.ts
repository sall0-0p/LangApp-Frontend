// shared/src/types/Lesson.ts

export enum TaskType {
    TRANSLATE_WORD_TO_MC = 'TRANSLATE_WORD_TO_MC',     // Select correct translation for a source word
    TRANSLATE_WORD_FROM_MC = 'TRANSLATE_WORD_FROM_MC', // Select correct source word for a target word
    SENTENCE_BUILDING = 'SENTENCE_BUILDING',           // Order shuffled words to form a sentence
    MATCHING_PAIRS = 'MATCHING_PAIRS',                 // Match items from column A to column B
}

// --- Shared Entities ---

export interface WordExpression {
    expression: string;
    origin: string;
    emoji?: string;
    audioUrl?: string;
}

// --- Specific Data Shapes ---

/**
 * Data for Multiple Choice tasks (Translate To/From)
 */
export interface MultipleChoiceData {
    question_word: WordExpression;
    distractors: WordExpression[];
}

/**
 * Data for ordering words into a sentence.
 * The backend might send just the shuffled list, or both.
 */
export interface SentenceBuildingData {
    prompt: string; // e.g., "Translate: 'The boy eats the apple'"
    words: string[]; // The shuffled words: ["Junge", "den", "Apfel", "Der", "isst"]
    // correctOrder is usually kept on backend for validation,
    // or sent here if validation happens on client.
}

/**
 * Data for matching pairs (e.g., dragging words to definitions).
 */
export interface MatchingPairsData {
    leftItems: WordExpression[];
    rightItems: WordExpression[];
}

// --- Discriminated Union for Task ---

export type Task =
    | {
    id: number;
    taskType: TaskType.TRANSLATE_WORD_TO_MC;
    taskData: MultipleChoiceData;
}
    | {
    id: number;
    taskType: TaskType.TRANSLATE_WORD_FROM_MC;
    taskData: MultipleChoiceData;
}
    | {
    id: number;
    taskType: TaskType.SENTENCE_BUILDING;
    taskData: SentenceBuildingData;
}
    | {
    id: number;
    taskType: TaskType.MATCHING_PAIRS;
    taskData: MatchingPairsData;
}
    // Fallback for unknown types (helps future-proof)
    | {
    id: number;
    taskType: string;
    taskData: any;
};


// --- Lesson Metadata (unchanged) ---

export interface Topic {
    title: string;
    level: string;
}

export interface LessonSectionSummary {
    title: string;
}

export interface LessonDetails {
    identifier: string;
    title: string;
    subtitle: string;
    orderIndex: number;
    completed: boolean;
    section: LessonSectionSummary;
    topics: Topic[];
}