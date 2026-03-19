export type Subject = 'Math' | 'ELA' | 'Science';
export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Hard';

export interface Lesson {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  explanation: string;
  example: {
    question: string;
    answer: string;
    explanation: string;
  };
  practiceQuestions: Question[];
  standard?: string; // e.g., MGSE4.NBT.1
}

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  passage?: string; // For ELA
  difficulty: Difficulty;
  standard?: string; // e.g., MGSE4.NBT.1
}

export interface StudentProfile {
  studentName: string;
  grade: number;
  currentSubject?: Subject;
  currentDifficulty: { [key in Subject]: Difficulty };
  topicDifficulty: { [topic: string]: Difficulty }; // Granular tracking
  totalQuestionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  wrongStreak: number;
  weakTopics: string[];
  strongTopics: string[];
  topicAccuracy: { [topic: string]: { correct: number; total: number } };
  confidenceScore: number;
  lastAnswers: boolean[]; // Rolling accuracy (last 5)
  masteryStars: { [topic: string]: number }; // 0-3 stars per topic
  isSupportMode: boolean;
  lastUpdated: string; // ISO string for promotion recommendation
  answeredQuestionIds: string[]; // Track to avoid repeats
}

export interface Flashcard {
  id: string;
  subject: Subject;
  front: string;
  back: string;
}

export interface UserProgress {
  stars: number;
  streak: number;
  dailyGoal: number;
  completedLessons: string[];
  weakAreas: { [topic: string]: number }; // topic -> count of wrong answers
  subjectProgress: {
    [key in Subject]: number; // 0 to 100
  };
  badges: Badge[];
  profile?: StudentProfile;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}
