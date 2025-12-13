export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FREE_INPUT = 'free_input',
  TRUE_FALSE = 'true_false'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  chapterId: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  answers?: Answer[]; // Pour les QCM
  correctAnswer?: string | number; // Pour les réponses libres
  explanation?: string;
  realLifeExplanation?: string; // Explication avec exemples du quotidien
  hints?: string[];
  tags?: string[];
}

export interface UserAnswer {
  questionId: string;
  userResponse: string;
  isCorrect: boolean;
  timestamp: Date;
  attemptsCount: number;
}
