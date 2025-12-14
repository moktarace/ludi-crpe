import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, QuestionType, UserAnswer } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { ProgressService } from '../../services/progress.service';
import { ChapterService } from '../../services/chapter.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: Question | null = null;
  userAnswer: string = '';
  selectedAnswer: string = '';
  showFeedback: boolean = false;
  isCorrect: boolean = false;
  chapterId: string = '';
  isReviewMode: boolean = false;
  showHints: boolean = false;
  currentHintIndex: number = 0;
  hintsUsed: number = 0;
  showRealLifeMode: boolean = false;
  QuestionType = QuestionType; // Exposer l'enum au template

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private progressService: ProgressService,
    private chapterService: ChapterService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.chapterId = params['id'];
      this.loadQuestions();
    });

    this.route.queryParams.subscribe(params => {
      this.isReviewMode = params['review'] === 'true';
    });
  }

  async loadQuestions(): Promise<void> {
    // Attendre que les templates soient chargés
    await this.questionService.waitForQuestionsLoaded();
    console.log('✅ Templates chargés, début du chargement des questions');
    
    if (this.isReviewMode) {
      // Mode révision pure (toutes les erreurs)
      const mistakes = this.progressService.getMistakesToReview();
      console.log('🔍 Mode révision - Total erreurs:', mistakes.length);
      
      const mistakeIds = this.chapterId === 'all' 
        ? mistakes.map(m => m.questionId)
        : mistakes.filter(m => m.chapterId === this.chapterId).map(m => m.questionId);
      
      this.questions = mistakeIds
        .map(id => this.questionService.getQuestionById(id))
        .filter(q => q !== undefined) as Question[];
        
      if (this.questions.length === 0) {
        alert('Aucune erreur à réviser. Bravo ! 🎉');
        this.router.navigate(['/learning-path']);
        return;
      }
      
      console.log('✅ Questions chargées pour révision:', this.questions.length);
    } else {
      // Mode normal : 5 questions max avec mélange intelligent (style Duolingo)
      this.questions = await this.selectSmartQuestions(this.chapterId, 5);
      
      if (this.questions.length === 0) {
        alert('Aucune question disponible pour ce chapitre');
        this.router.navigate(['/learning-path']);
        return;
      }
      
      console.log('✅ Questions sélectionnées:', this.questions.length);
    }

    this.currentQuestion = this.questions[0];
  }

  async selectSmartQuestions(chapterId: string, totalQuestions: number): Promise<Question[]> {
    // Récupérer toutes les questions disponibles du chapitre
    const allQuestions = await this.questionService.getQuestionsByChapter(chapterId);
    
    if (allQuestions.length === 0) {
      return [];
    }
    
    // Récupérer les erreurs de l'utilisateur pour ce chapitre
    const mistakes = this.progressService.getMistakesToReview()
      .filter(m => m.chapterId === chapterId);
    
    console.log(`📊 Chapitre ${chapterId}: ${allQuestions.length} questions disponibles, ${mistakes.length} erreurs`);
    
    // Stratégie Duolingo : 
    // - 40% questions avec erreurs (pour réviser)
    // - 60% nouvelles questions (pour progresser)
    const mistakeCount = Math.min(
      Math.ceil(totalQuestions * 0.4),
      mistakes.length
    );
    const newCount = totalQuestions - mistakeCount;
    
    console.log(`🎯 Sélection: ${mistakeCount} révisions + ${newCount} nouvelles`);
    
    const selectedQuestions: Question[] = [];
    
    // 1. Ajouter les questions avec erreurs (priorité aux plus récentes)
    if (mistakeCount > 0) {
      const mistakeQuestions = mistakes
        .sort((a, b) => b.lastErrorDate.getTime() - a.lastErrorDate.getTime()) // Plus récentes d'abord
        .slice(0, mistakeCount)
        .map(m => this.questionService.getQuestionById(m.questionId))
        .filter(q => q !== undefined) as Question[];
      
      selectedQuestions.push(...mistakeQuestions);
      console.log(`✅ ${mistakeQuestions.length} questions d'erreurs ajoutées`);
    }
    
    // 2. Ajouter des nouvelles questions (aléatoires)
    if (newCount > 0) {
      // Exclure les questions déjà sélectionnées
      const selectedIds = new Set(selectedQuestions.map(q => q.id));
      const availableNew = allQuestions.filter(q => !selectedIds.has(q.id));
      
      // Mélanger et prendre les premières
      const shuffled = this.shuffleArray(availableNew);
      const newQuestions = shuffled.slice(0, newCount);
      
      selectedQuestions.push(...newQuestions);
      console.log(`✅ ${newQuestions.length} nouvelles questions ajoutées`);
    }
    
    // 3. Mélanger l'ordre final (mix erreurs + nouvelles)
    return this.shuffleArray(selectedQuestions);
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  selectAnswer(answer: string): void {
    if (!this.showFeedback) {
      this.selectedAnswer = answer;
    }
  }

  submitAnswer(): void {
    if (!this.currentQuestion) return;

    let answerToCheck = '';
    
    if (this.currentQuestion.type === QuestionType.MULTIPLE_CHOICE) {
      answerToCheck = this.selectedAnswer;
    } else {
      answerToCheck = this.userAnswer.trim();
    }

    if (!answerToCheck) {
      alert('Veuillez sélectionner ou saisir une réponse');
      return;
    }

    this.isCorrect = this.questionService.checkAnswer(this.currentQuestion, answerToCheck);
    this.showFeedback = true;

    // Enregistrer la réponse
    const userAnswer: UserAnswer = {
      questionId: this.currentQuestion.id,
      userResponse: answerToCheck,
      isCorrect: this.isCorrect,
      timestamp: new Date(),
      attemptsCount: 1
    };

    // Utiliser le vrai chapterId de la question si on est en mode "all"
    const actualChapterId = this.chapterId === 'all' ? this.currentQuestion.chapterId : this.chapterId;
    this.progressService.recordAnswer(actualChapterId, this.currentQuestion.id, userAnswer);

    // Marquer comme révisé si en mode révision
    if (this.isReviewMode && this.isCorrect) {
      this.progressService.markMistakeAsReviewed(this.currentQuestion.id);
    }
  }

  nextQuestion(): void {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.currentHintIndex = 0; // Reset hints for next question
      this.resetQuestion();
    } else {
      this.finishQuiz();
    }
  }

  resetQuestion(): void {
    this.userAnswer = '';
    this.selectedAnswer = '';
    this.showFeedback = false;
    this.isCorrect = false;
    this.showHints = false;
  }

  finishQuiz(): void {
    // Si on est en mode révision global (all), retourner à l'accueil
    if (this.chapterId === 'all') {
      console.log('✅ Révision terminée - Retour à l\'accueil');
      this.router.navigate(['/']);
      return;
    }
    
    // Vérifier si le chapitre est complété
    const progress = this.progressService.getChapterProgress(this.chapterId);
    const chapter = this.chapterService.getChapterById(this.chapterId);
    
    if (progress && chapter) {
      const completedQuestions = progress.completedQuestions.length;
      if (completedQuestions >= chapter.totalQuestions) {
        this.progressService.completeChapter(this.chapterId);
      }
    }

    this.router.navigate(['/chapter', this.chapterId]);
  }

  toggleHints(): void {
    this.showHints = !this.showHints;
  }

  /**
   * Affiche le prochain indice disponible
   */
  showNextHint(): void {
    if (this.currentQuestion && this.currentQuestion.hints) {
      if (this.currentHintIndex < this.currentQuestion.hints.length) {
        this.currentHintIndex++;
        this.hintsUsed++;
        this.showHints = true;
      }
    }
  }

  /**
   * Retourne les indices à afficher jusqu'à l'index actuel
   */
  getVisibleHints(): string[] {
    if (!this.currentQuestion || !this.currentQuestion.hints) {
      return [];
    }
    return this.currentQuestion.hints.slice(0, this.currentHintIndex);
  }

  /**
   * Bascule entre mode explication mathématique et vie quotidienne
   */
  toggleExplanationMode(): void {
    this.showRealLifeMode = !this.showRealLifeMode;
  }

  /**
   * Vérifie s'il reste des indices à afficher
   */
  hasMoreHints(): boolean {
    if (!this.currentQuestion || !this.currentQuestion.hints) {
      return false;
    }
    return this.currentHintIndex < this.currentQuestion.hints.length;
  }

  getProgressPercentage(): number {
    return Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100);
  }

  exitQuiz(): void {
    if (confirm('Êtes-vous sûr de vouloir quitter le quiz ? Votre progression sera perdue.')) {
      this.router.navigate(['/chapter', this.chapterId]);
    }
  }
}
