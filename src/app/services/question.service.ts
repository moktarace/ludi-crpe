import { Injectable } from '@angular/core';
import { Question, QuestionType, DifficultyLevel } from '../models/question.model';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Question[] = [];

  constructor(private progressService: ProgressService) {
    this.initializeQuestions();
  }

  private initializeQuestions(): void {
    // Questions niveau seconde - mathématiques
    this.questions = [
      // Chapitre 1: Nombres et calculs
      {
        id: 'q1_1',
        chapterId: 'chapter_1',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.EASY,
        question: 'Calculez: 3² + 4² = ?',
        answers: [
          { text: '25', isCorrect: true },
          { text: '49', isCorrect: false },
          { text: '14', isCorrect: false },
          { text: '21', isCorrect: false }
        ],
        explanation: '3² = 9 et 4² = 16, donc 9 + 16 = 25',
        tags: ['calcul', 'puissances']
      },
      {
        id: 'q1_2',
        chapterId: 'chapter_1',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.EASY,
        question: 'Quelle est la valeur de √144 ?',
        answers: [
          { text: '12', isCorrect: true },
          { text: '72', isCorrect: false },
          { text: '14', isCorrect: false },
          { text: '10', isCorrect: false }
        ],
        explanation: '12 × 12 = 144',
        tags: ['racines', 'calcul']
      },
      {
        id: 'q1_3',
        chapterId: 'chapter_1',
        type: QuestionType.FREE_INPUT,
        difficulty: DifficultyLevel.MEDIUM,
        question: 'Calculez: 5³ = ?',
        correctAnswer: '125',
        explanation: '5³ = 5 × 5 × 5 = 125',
        hints: ['5 × 5 = 25', 'Puis 25 × 5 = ?'],
        tags: ['puissances', 'calcul']
      },
      {
        id: 'q1_4',
        chapterId: 'chapter_1',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.MEDIUM,
        question: 'Simplifiez: 2⁴ × 2³ = ?',
        answers: [
          { text: '2⁷', isCorrect: true },
          { text: '2¹²', isCorrect: false },
          { text: '4⁷', isCorrect: false },
          { text: '2⁶', isCorrect: false }
        ],
        explanation: 'Quand on multiplie des puissances de même base, on additionne les exposants: 4 + 3 = 7',
        tags: ['puissances', 'propriétés']
      },
      {
        id: 'q1_5',
        chapterId: 'chapter_1',
        type: QuestionType.FREE_INPUT,
        difficulty: DifficultyLevel.HARD,
        question: 'Calculez: (2³)² = ?',
        correctAnswer: '64',
        explanation: '(2³)² = 2⁶ = 64',
        hints: ['Utilisez la règle (aⁿ)ᵐ = aⁿˣᵐ', '3 × 2 = 6, donc 2⁶'],
        tags: ['puissances', 'propriétés']
      },

      // Chapitre 2: Fonctions
      {
        id: 'q2_1',
        chapterId: 'chapter_2',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.EASY,
        question: 'Si f(x) = 2x + 3, que vaut f(5) ?',
        answers: [
          { text: '13', isCorrect: true },
          { text: '11', isCorrect: false },
          { text: '10', isCorrect: false },
          { text: '8', isCorrect: false }
        ],
        explanation: 'f(5) = 2×5 + 3 = 10 + 3 = 13',
        tags: ['fonctions', 'substitution']
      },
      {
        id: 'q2_2',
        chapterId: 'chapter_2',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.EASY,
        question: 'Quelle est l\'image de 3 par la fonction f(x) = x² ?',
        answers: [
          { text: '9', isCorrect: true },
          { text: '6', isCorrect: false },
          { text: '3', isCorrect: false },
          { text: '12', isCorrect: false }
        ],
        explanation: 'f(3) = 3² = 9',
        tags: ['fonctions', 'image']
      },
      {
        id: 'q2_3',
        chapterId: 'chapter_2',
        type: QuestionType.FREE_INPUT,
        difficulty: DifficultyLevel.MEDIUM,
        question: 'Si f(x) = 3x - 7, quelle valeur de x donne f(x) = 8 ?',
        correctAnswer: '5',
        explanation: '3x - 7 = 8, donc 3x = 15, donc x = 5',
        hints: ['Résolvez l\'équation 3x - 7 = 8', 'Ajoutez 7 de chaque côté'],
        tags: ['fonctions', 'équations']
      },
      {
        id: 'q2_4',
        chapterId: 'chapter_2',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.MEDIUM,
        question: 'Une fonction linéaire a pour coefficient 4. Quelle est son expression ?',
        answers: [
          { text: 'f(x) = 4x', isCorrect: true },
          { text: 'f(x) = x + 4', isCorrect: false },
          { text: 'f(x) = 4', isCorrect: false },
          { text: 'f(x) = x/4', isCorrect: false }
        ],
        explanation: 'Une fonction linéaire s\'écrit f(x) = ax où a est le coefficient',
        tags: ['fonctions', 'linéaire']
      },
      {
        id: 'q2_5',
        chapterId: 'chapter_2',
        type: QuestionType.FREE_INPUT,
        difficulty: DifficultyLevel.HARD,
        question: 'Si f(x) = x² - 4x + 3, que vaut f(-2) ?',
        correctAnswer: '15',
        explanation: 'f(-2) = (-2)² - 4×(-2) + 3 = 4 + 8 + 3 = 15',
        hints: ['Attention aux signes avec -2', '(-2)² = 4', '-4×(-2) = +8'],
        tags: ['fonctions', 'polynômes']
      },

      // Chapitre 3: Géométrie
      {
        id: 'q3_1',
        chapterId: 'chapter_3',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.EASY,
        question: 'Quelle est l\'aire d\'un rectangle de longueur 6 cm et largeur 4 cm ?',
        answers: [
          { text: '24 cm²', isCorrect: true },
          { text: '20 cm²', isCorrect: false },
          { text: '10 cm²', isCorrect: false },
          { text: '12 cm²', isCorrect: false }
        ],
        explanation: 'Aire = longueur × largeur = 6 × 4 = 24 cm²',
        tags: ['géométrie', 'aire']
      },
      {
        id: 'q3_2',
        chapterId: 'chapter_3',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.EASY,
        question: 'Un triangle rectangle a des côtés de 3 cm et 4 cm. Quelle est la longueur de l\'hypoténuse ?',
        answers: [
          { text: '5 cm', isCorrect: true },
          { text: '7 cm', isCorrect: false },
          { text: '6 cm', isCorrect: false },
          { text: '4,5 cm', isCorrect: false }
        ],
        explanation: 'Théorème de Pythagore: 3² + 4² = 9 + 16 = 25 = 5²',
        tags: ['géométrie', 'pythagore']
      },
      {
        id: 'q3_3',
        chapterId: 'chapter_3',
        type: QuestionType.FREE_INPUT,
        difficulty: DifficultyLevel.MEDIUM,
        question: 'Quel est le périmètre d\'un cercle de rayon 5 cm ? (Arrondi à l\'unité, π ≈ 3,14)',
        correctAnswer: '31',
        explanation: 'Périmètre = 2πr = 2 × 3,14 × 5 = 31,4 ≈ 31 cm',
        hints: ['Formule: P = 2πr', 'π ≈ 3,14'],
        tags: ['géométrie', 'cercle', 'périmètre']
      },
      {
        id: 'q3_4',
        chapterId: 'chapter_3',
        type: QuestionType.FREE_INPUT,
        difficulty: DifficultyLevel.MEDIUM,
        question: 'Quelle est l\'aire d\'un disque de diamètre 10 cm ? (Arrondi à l\'unité, π ≈ 3,14)',
        correctAnswer: '79',
        explanation: 'Rayon = 5 cm, Aire = πr² = 3,14 × 5² = 3,14 × 25 = 78,5 ≈ 79 cm²',
        hints: ['Le rayon est la moitié du diamètre', 'Aire = πr²'],
        tags: ['géométrie', 'cercle', 'aire']
      },
      {
        id: 'q3_5',
        chapterId: 'chapter_3',
        type: QuestionType.FREE_INPUT,
        difficulty: DifficultyLevel.HARD,
        question: 'Un triangle a une base de 8 cm et une hauteur de 5 cm. Quelle est son aire en cm² ?',
        correctAnswer: '20',
        explanation: 'Aire = (base × hauteur) / 2 = (8 × 5) / 2 = 40 / 2 = 20 cm²',
        hints: ['Formule: A = (b × h) / 2', 'Calculez d\'abord 8 × 5'],
        tags: ['géométrie', 'triangle', 'aire']
      }
    ];
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
