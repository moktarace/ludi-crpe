import { Injectable } from '@angular/core';
import { Chapter, LearningPath } from '../models/chapter.model';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private learningPath: LearningPath;

  constructor() {
    this.learningPath = this.initializeLearningPath();
  }

  private initializeLearningPath(): LearningPath {
    const chapters: Chapter[] = [
      {
        id: 'chapter_1',
        title: 'Nombres et calculs',
        description: 'Puissances, racines carrées et calculs numériques',
        icon: '🔢',
        order: 1,
        isLocked: false,
        completionPercentage: 0,
        totalQuestions: 5,
        completedQuestions: 0,
        skillIds: ['skill_1_1', 'skill_1_2']
      },
      {
        id: 'chapter_2',
        title: 'Fonctions',
        description: 'Fonctions linéaires, affines et polynômes',
        icon: '📈',
        order: 2,
        isLocked: true,
        completionPercentage: 0,
        totalQuestions: 5,
        completedQuestions: 0,
        skillIds: ['skill_2_1', 'skill_2_2']
      },
      {
        id: 'chapter_3',
        title: 'Géométrie',
        description: 'Aires, périmètres et théorème de Pythagore',
        icon: '📐',
        order: 3,
        isLocked: true,
        completionPercentage: 0,
        totalQuestions: 5,
        completedQuestions: 0,
        skillIds: ['skill_3_1', 'skill_3_2']
      },
      {
        id: 'chapter_4',
        title: 'Probabilités',
        description: 'Événements, probabilités et statistiques',
        icon: '🎲',
        order: 4,
        isLocked: true,
        completionPercentage: 0,
        totalQuestions: 0,
        completedQuestions: 0,
        skillIds: ['skill_4_1']
      },
      {
        id: 'chapter_5',
        title: 'Vecteurs',
        description: 'Introduction aux vecteurs et calculs vectoriels',
        icon: '➡️',
        order: 5,
        isLocked: true,
        completionPercentage: 0,
        totalQuestions: 0,
        completedQuestions: 0,
        skillIds: ['skill_5_1']
      }
    ];

    return {
      id: 'path_seconde',
      title: 'Mathématiques Seconde',
      description: 'Programme complet de mathématiques niveau seconde',
      chapters
    };
  }

  getLearningPath(): LearningPath {
    return this.learningPath;
  }

  getChapterById(chapterId: string): Chapter | undefined {
    return this.learningPath.chapters.find(c => c.id === chapterId);
  }

  getAllChapters(): Chapter[] {
    return this.learningPath.chapters;
  }

  unlockNextChapter(currentChapterId: string): void {
    const currentIndex = this.learningPath.chapters.findIndex(c => c.id === currentChapterId);
    if (currentIndex >= 0 && currentIndex < this.learningPath.chapters.length - 1) {
      this.learningPath.chapters[currentIndex + 1].isLocked = false;
    }
  }

  updateChapterProgress(chapterId: string, completed: number, total: number): void {
    const chapter = this.getChapterById(chapterId);
    if (chapter) {
      chapter.completedQuestions = completed;
      chapter.totalQuestions = total;
      chapter.completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    }
  }
}
