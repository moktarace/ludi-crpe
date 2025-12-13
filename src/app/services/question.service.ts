import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question, QuestionType, DifficultyLevel } from '../models/question.model';
import { ProgressService } from './progress.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Question[] = [];
  private questionsLoaded = false;

  constructor(
    private progressService: ProgressService,
    private http: HttpClient
  ) {
    this.loadAllQuestions();
  }

  private async loadAllQuestions(): Promise<void> {
    try {
      // Charger toutes les questions des chapitres
      const chapters = ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5'];
      const allQuestions: Question[] = [];

      for (const chapter of chapters) {
        try {
          const questions = await firstValueFrom(
            this.http.get<Question[]>(`assets/data/${chapter}-questions.json`)
          );
          allQuestions.push(...questions);
        } catch (error) {
          console.warn(`Could not load ${chapter}-questions.json`, error);
        }
      }

      this.questions = allQuestions;
      this.questionsLoaded = true;
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback: charger quelques questions par défaut
      this.initializeFallbackQuestions();
    }
  }

  private initializeFallbackQuestions(): void {
    // Questions de secours minimalistes au cas où les fichiers JSON ne se chargent pas
    this.questions = [
      {
        id: 'q1_1',
        chapterId: 'chapter_1',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.EASY,
        question: 'Calculez: 3² + 4² = ?',
        answers: [
          { text: '25', isCorrect: true },
          { text: '49', isCorrect: false }
        ],
        explanation: '3² = 9 et 4² = 16, donc 9 + 16 = 25',
        tags: ['calcul', 'puissances']
      }
    ];
    this.questionsLoaded = true;
  }

  async waitForQuestionsLoaded(): Promise<void> {
    while (!this.questionsLoaded) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  getQuestionsByChapter(chapterId: string): Question[] {
    return this.questions.filter(q => q.chapterId === chapterId);
  }

  getQuestionById(questionId: string): Question | undefined {
    return this.questions.find(q => q.id === questionId);
  }

  getAdaptiveQuestions(chapterId: string, count: number = 5): Question[] {
    const mistakes = this.progressService.getMistakesToReview();
    const mistakeQuestionIds = mistakes.map(m => m.questionId);
    
    // Prioriser les questions avec erreurs
    const mistakeQuestions = this.questions.filter(q => 
      mistakeQuestionIds.includes(q.id) && q.chapterId === chapterId
    );

    // Ajouter des questions du chapitre
    const chapterQuestions = this.getQuestionsByChapter(chapterId);
    const progress = this.progressService.getChapterProgress(chapterId);
    const completedIds = progress?.completedQuestions || [];

    // Questions non complétées
    const newQuestions = chapterQuestions.filter(q => 
      !completedIds.includes(q.id) && !mistakeQuestionIds.includes(q.id)
    );

    // Mélanger et limiter
    const selected = [
      ...mistakeQuestions,
      ...this.shuffleArray(newQuestions)
    ].slice(0, count);

    return this.adaptQuestionDifficulty(selected, progress?.score || 0);
  }

  private adaptQuestionDifficulty(questions: Question[], currentScore: number): Question[] {
    // Adapter la difficulté selon le score
    if (currentScore < 50) {
      // Score faible: plus de QCM faciles
      return questions.sort((a, b) => {
        if (a.type === QuestionType.MULTIPLE_CHOICE && b.type !== QuestionType.MULTIPLE_CHOICE) return -1;
        if (a.type !== QuestionType.MULTIPLE_CHOICE && b.type === QuestionType.MULTIPLE_CHOICE) return 1;
        return 0;
      });
    } else if (currentScore < 80) {
      // Score moyen: mélange équilibré
      return this.shuffleArray(questions);
    } else {
      // Score élevé: plus de questions à saisie libre et difficiles
      return questions.sort((a, b) => {
        if (a.type === QuestionType.FREE_INPUT && b.type !== QuestionType.FREE_INPUT) return -1;
        if (a.type !== QuestionType.FREE_INPUT && b.type === QuestionType.FREE_INPUT) return 1;
        if (a.difficulty === DifficultyLevel.HARD && b.difficulty !== DifficultyLevel.HARD) return -1;
        if (a.difficulty !== DifficultyLevel.HARD && b.difficulty === DifficultyLevel.HARD) return 1;
        return 0;
      });
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  checkAnswer(question: Question, userAnswer: string): boolean {
    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      const correctAnswer = question.answers?.find(a => a.isCorrect);
      return correctAnswer?.text.toLowerCase() === userAnswer.toLowerCase();
    } else {
      // Pour les réponses libres, normaliser la comparaison
      const correct = String(question.correctAnswer).toLowerCase().trim();
      const user = userAnswer.toLowerCase().trim();
      return correct === user;
    }
  }

  getAllQuestions(): Question[] {
    return this.questions;
  }
}
