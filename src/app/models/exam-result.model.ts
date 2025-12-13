import { Question } from './question.model';

export interface ExamAnswer {
  question: Question;
  userAnswer: number | string | null;
  isCorrect: boolean;
  timeTaken: number; // en secondes
}

export interface ExamResult {
  duration: number; // durée configurée en minutes
  answers: ExamAnswer[];
  totalQuestions: number;
  correctAnswers: number;
  score: number; // pourcentage
  timeElapsed: number; // temps total écoulé en secondes
  completedAt: Date;
}
