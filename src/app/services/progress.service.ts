import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProgress, ChapterProgress, MistakeRecord } from '../models/user-progress.model';
import { UserAnswer } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly STORAGE_KEY = 'mathlingo_user_progress';
  private progressSubject = new BehaviorSubject<UserProgress>(this.initializeProgress());

  public progress$: Observable<UserProgress> = this.progressSubject.asObservable();

  constructor() {
    this.loadProgress();
  }

  private initializeProgress(): UserProgress {
    return {
      userId: 'user_' + Date.now(),
      currentChapterId: 'chapter_1',
      completedChapters: [],
      totalXP: 0,
      streak: 0,
      lastActivityDate: new Date(),
      chapterProgress: [],
      mistakes: []
    };
  }

  private loadProgress(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      progress.lastActivityDate = new Date(progress.lastActivityDate);
      this.progressSubject.next(progress);
    }
  }

  private saveProgress(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progressSubject.value));
  }

  getProgress(): UserProgress {
    return this.progressSubject.value;
  }

  recordAnswer(chapterId: string, questionId: string, answer: UserAnswer): void {
    const progress = this.progressSubject.value;
    
    // Mettre à jour la progression du chapitre
    let chapterProgress = progress.chapterProgress.find(cp => cp.chapterId === chapterId);
    
    if (!chapterProgress) {
      chapterProgress = {
        chapterId,
        completedQuestions: [],
        currentQuestionIndex: 0,
        score: 0,
        isCompleted: false,
        lastAttemptDate: new Date()
      };
      progress.chapterProgress.push(chapterProgress);
    }

    // Ajouter la question aux questions complétées si ce n'est pas déjà fait
    if (!chapterProgress.completedQuestions.includes(questionId)) {
      chapterProgress.completedQuestions.push(questionId);
    }

    chapterProgress.lastAttemptDate = new Date();
    
    // Gérer les erreurs
    if (!answer.isCorrect) {
      this.recordMistake(chapterId, questionId, answer);
    } else {
      // Ajouter des XP pour les réponses correctes
      progress.totalXP += 10;
    }

    // Mettre à jour la dernière activité
    progress.lastActivityDate = new Date();
    this.updateStreak();

    this.progressSubject.next(progress);
    this.saveProgress();
  }

  private recordMistake(chapterId: string, questionId: string, answer: UserAnswer): void {
    const progress = this.progressSubject.value;
    let mistake = progress.mistakes.find(m => m.questionId === questionId);

    if (!mistake) {
      mistake = {
        questionId,
        chapterId,
        errorCount: 0,
        lastErrorDate: new Date(),
        reviewScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000), // Révision dans 24h
        isReviewed: false,
        answers: []
      };
      progress.mistakes.push(mistake);
      console.log('❌ Nouvelle erreur enregistrée:', questionId, 'Chapitre:', chapterId);
    }

    mistake.errorCount++;
    mistake.lastErrorDate = new Date();
    mistake.answers.push(answer);
    mistake.isReviewed = false;

    // Planifier la révision selon la fréquence des erreurs
    const daysToReview = Math.min(mistake.errorCount, 7);
    mistake.reviewScheduled = new Date(Date.now() + daysToReview * 24 * 60 * 60 * 1000);
    
    console.log('📝 Erreur #' + mistake.errorCount + ' pour', questionId, '- Total erreurs:', progress.mistakes.length);
  }

  getMistakesToReview(): MistakeRecord[] {
    const progress = this.progressSubject.value;
    
    // Retourner toutes les erreurs non révisées (sans filtre de date)
    return progress.mistakes.filter(m => !m.isReviewed)
      .sort((a, b) => b.errorCount - a.errorCount); // Prioriser les erreurs fréquentes
  }

  markMistakeAsReviewed(questionId: string): void {
    const progress = this.progressSubject.value;
    const mistake = progress.mistakes.find(m => m.questionId === questionId);
    
    if (mistake) {
      mistake.isReviewed = true;
      this.progressSubject.next(progress);
      this.saveProgress();
    }
  }

  completeChapter(chapterId: string): void {
    const progress = this.progressSubject.value;
    
    if (!progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId);
      progress.totalXP += 100; // Bonus pour complétion de chapitre
    }

    const chapterProgress = progress.chapterProgress.find(cp => cp.chapterId === chapterId);
    if (chapterProgress) {
      chapterProgress.isCompleted = true;
    }

    this.progressSubject.next(progress);
    this.saveProgress();
  }

  private updateStreak(): void {
    const progress = this.progressSubject.value;
    const today = new Date();
    const lastActivity = new Date(progress.lastActivityDate);
    
    // Réinitialiser les heures pour comparer uniquement les dates
    today.setHours(0, 0, 0, 0);
    lastActivity.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Même jour, pas de changement
      return;
    } else if (daysDiff === 1) {
      // Jour consécutif, augmenter le streak
      progress.streak++;
    } else {
      // Streak cassé
      progress.streak = 1;
    }
  }

  getChapterProgress(chapterId: string): ChapterProgress | undefined {
    return this.progressSubject.value.chapterProgress.find(cp => cp.chapterId === chapterId);
  }

  resetProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.progressSubject.next(this.initializeProgress());
  }
}
