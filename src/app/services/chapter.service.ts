import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chapter, LearningPath } from '../models/chapter.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private learningPath: LearningPath;
  private chaptersLoaded = false;

  constructor(private http: HttpClient) {
    this.learningPath = this.initializeFallbackPath();
    this.loadChaptersFromJson();
  }

  /**
   * Charge les chapitres depuis le fichier JSON
   */
  private async loadChaptersFromJson(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<LearningPath>('assets/data/chapters.json')
      );
      this.learningPath = data;
      this.chaptersLoaded = true;
      console.log('✅ Chapitres chargés depuis chapters.json');
    } catch (error) {
      console.warn('⚠️ Erreur lors du chargement des chapitres, utilisation du fallback', error);
      this.chaptersLoaded = true;
    }
  }

  /**
   * Fallback: chapitres par défaut si le JSON ne charge pas
   */
  private initializeFallbackPath(): LearningPath {
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
        isLocked: false,
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
        isLocked: false,
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
        isLocked: false,
        completionPercentage: 0,
        totalQuestions: 1,
        completedQuestions: 0,
        skillIds: ['skill_4_1']
      },
      {
        id: 'chapter_5',
        title: 'Vecteurs',
        description: 'Introduction aux vecteurs et calculs vectoriels',
        icon: '➡️',
        order: 5,
        isLocked: false,
        completionPercentage: 0,
        totalQuestions: 1,
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

  async waitForChaptersLoaded(): Promise<void> {
    while (!this.chaptersLoaded) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
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

  /**
   * @deprecated Tous les chapitres sont maintenant débloqués par défaut
   */
  unlockNextChapter(currentChapterId: string): void {
    // Tous les chapitres sont débloqués, cette méthode n'est plus utilisée
    console.log('All chapters are unlocked by default');
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
