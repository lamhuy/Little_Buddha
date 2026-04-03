export interface UserProfile {
  uid: string;
  name: string;
  birth_year: number;
}

export interface EducationalModule {
  id?: string;
  title: string;
  textContent: string;
  targetAgeTier: '0-7' | '8-12' | '13-18';
  audioRef: string;
  summaryPoints: string[];
  discussionQuestions: string[];
}
