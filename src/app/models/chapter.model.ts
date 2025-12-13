export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isLocked: boolean;
  completionPercentage: number;
  totalQuestions: number;
  completedQuestions: number;
  skillIds: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  chapterId: string;
}
