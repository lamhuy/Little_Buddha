export interface UserProfile {
    uid: string;
    name: string;
    birth_year: number;
}

export interface LessonPage {
    text: string;
    audioRef: string;
    imageRef?: string;
}

export interface EducationalModule {
    id?: string; 
    title: string;
    pages: LessonPage[];
    targetAgeTier: '0-7' | '8-12' | '13-18';
    summaryPoints: string[];
    discussionQuestions: string[];
}
