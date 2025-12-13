import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question, QuestionType, DifficultyLevel } from '../models/question.model';
import { QuestionTemplate, QuestionGenerator } from '../models/question-template.model';
import { ProgressService } from './progress.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Question[] = [];
  private questionTemplates: QuestionTemplate[] = [];
  private questionsLoaded = false;

  constructor(
    private progressService: ProgressService,
    private http: HttpClient
  ) {
    this.loadAllTemplates();
  }

  /**
   * Charge tous les templates de questions depuis les fichiers JSON
   */
  private async loadAllTemplates(): Promise<void> {
    try {
      const chapters = ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5'];
      const allTemplates: QuestionTemplate[] = [];

      for (const chapter of chapters) {
        try {
          // Essayer de charger les templates dynamiques
          const templates = await firstValueFrom(
            this.http.get<QuestionTemplate[]>(`assets/data/${chapter}-templates.json`)
          );
          allTemplates.push(...templates);
        } catch (error) {
          console.warn(`Could not load ${chapter}-templates.json, trying static questions`, error);
          // Fallback: charger les questions statiques si les templates n'existent pas
          try {
            const staticQuestions = await firstValueFrom(
              this.http.get<Question[]>(`assets/data/${chapter}-questions.json`)
            );
            this.questions.push(...staticQuestions);
          } catch (staticError) {
            console.warn(`Could not load ${chapter}-questions.json either`, staticError);
          }
        }
      }

      this.questionTemplates = allTemplates;
      this.questionsLoaded = true;
      
      console.log(`Loaded ${this.questionTemplates.length} question templates and ${this.questions.length} static questions`);
    } catch (error) {
      console.error('Error loading questions:', error);
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

  /**
   * Génère une nouvelle question à partir d'un template
   */
  private generateQuestionFromTemplate(template: QuestionTemplate): Question {
    return QuestionGenerator.generateQuestion(template);
  }

  /**
   * Récupère toutes les questions d'un chapitre (génère les dynamiques)
   */
  getQuestionsByChapter(chapterId: string): Question[] {
    // Questions statiques
    const staticQuestions = this.questions.filter(q => q.chapterId === chapterId);
    
    // Questions dynamiques générées à partir de templates
    const dynamicQuestions = this.questionTemplates
      .filter(t => t.chapterId === chapterId)
      .map(t => this.generateQuestionFromTemplate(t));
    
    return [...staticQuestions, ...dynamicQuestions];
  }

  /**
   * Génère une nouvelle instance d'une question (avec nouvelles valeurs)
   */
  getQuestionById(questionId: string): Question | undefined {
    // Chercher dans les questions statiques
    const staticQuestion = this.questions.find(q => q.id === questionId);
    if (staticQuestion) {
      return staticQuestion;
    }
    
    // Chercher dans les templates et générer une nouvelle instance
    const template = this.questionTemplates.find(t => t.id === questionId);
    if (template) {
      return this.generateQuestionFromTemplate(template);
    }
    
    return undefined;
  }

  getAdaptiveQuestions(chapterId: string, count: number = 5): Question[] {
    const mistakes = this.progressService.getMistakesToReview();
    const mistakeQuestionIds = mistakes.map(m => m.questionId);
    
    // Régénérer les questions avec erreurs (nouvelles valeurs aléatoires)
    const mistakeQuestions: Question[] = [];
    for (const mistakeId of mistakeQuestionIds) {
      const template = this.questionTemplates.find(t => t.id === mistakeId);
      if (template && template.chapterId === chapterId) {
        mistakeQuestions.push(this.generateQuestionFromTemplate(template));
      }
    }

    // Récupérer TOUTES les questions du chapitre (avec nouvelles valeurs aléatoires)
    const allChapterQuestions = this.getQuestionsByChapter(chapterId);
    
    console.log(`📊 Chapter ${chapterId} - Total questions available: ${allChapterQuestions.length}`);
    console.log(`📊 Templates loaded: ${this.questionTemplates.length}`);
    console.log(`📊 Static questions loaded: ${this.questions.length}`);
    
    const progress = this.progressService.getChapterProgress(chapterId);
    const completedIds = progress?.completedQuestions || [];

    // Prioriser les questions avec erreurs, puis les non complétées, puis toutes les autres
    const questionsWithMistakes = mistakeQuestions;
    const newQuestions = allChapterQuestions.filter(q => 
      !completedIds.includes(q.id) && !mistakeQuestionIds.includes(q.id)
    );
    const reviewQuestions = allChapterQuestions.filter(q => 
      completedIds.includes(q.id) && !mistakeQuestionIds.includes(q.id)
    );

    console.log(`📊 Questions breakdown - Mistakes: ${questionsWithMistakes.length}, New: ${newQuestions.length}, Review: ${reviewQuestions.length}`);

    // Construire la sélection: erreurs d'abord, puis nouvelles, puis révision
    const selected = [
      ...questionsWithMistakes,
      ...this.shuffleArray(newQuestions),
      ...this.shuffleArray(reviewQuestions)  // ← Permet de refaire les questions avec nouvelles valeurs
    ].slice(0, count);

    console.log(`✅ Selected ${selected.length} questions for quiz`);

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
