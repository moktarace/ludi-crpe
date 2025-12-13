import { UserAnswer } from './question.model';

export interface UserProgress {
  userId: string;
  currentChapterId: string;
  completedChapters: string[];
  totalXP: number;
  streak: number;
  lastActivityDate: Date;
  chapterProgress: ChapterProgress[];
  mistakes: MistakeRecord[];
}

export interface ChapterProgress {
  chapterId: string;
  completedQuestions: string[];
  currentQuestionIndex: number;
  score: number;
  isCompleted: boolean;
  lastAttemptDate: Date;
}

export interface MistakeRecord {
  questionId: string;
  chapterId: string;
  errorCount: number;
  lastErrorDate: Date;
  reviewScheduled: Date;
  isReviewed: boolean;
  answers: UserAnswer[];
}

export interface CompetencyTest {
  id: string;
  chapterId: string;
  questions: string[];
  score: number;
  passed: boolean;
  completedDate?: Date;
}
