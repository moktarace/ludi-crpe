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
      const mistakes = this.progressService.getMistakesToReview();
      console.log('🔍 Mode révision - Total erreurs:', mistakes.length);
      console.log('📋 Liste des erreurs:', mistakes.map(m => ({ id: m.questionId, chapter: m.chapterId, count: m.errorCount })));
      
      // Si chapterId est "all", on prend toutes les erreurs
      // Sinon on filtre par chapitre
      const mistakeIds = this.chapterId === 'all' 
        ? mistakes.map(m => m.questionId)
        : mistakes.filter(m => m.chapterId === this.chapterId).map(m => m.questionId);
      
      console.log('📋 Questions à réviser pour ce contexte:', mistakeIds.length);
      console.log('🔑 IDs à charger:', mistakeIds);
      
      this.questions = mistakeIds
        .map(id => this.questionService.getQuestionById(id))
        .filter(q => q !== undefined) as Question[];
        
      if (this.questions.length === 0) {
        console.error('❌ Aucune question trouvée après filtrage');
        alert('Aucune erreur à réviser. Bravo ! 🎉');
        this.router.navigate(['/learning-path']);
        return;
      }
      
      console.log('✅ Questions chargées pour révision:', this.questions.length);
    } else {
      // Récupère 5 questions adaptatives (avec nouvelles valeurs aléatoires)
      this.questions = this.questionService.getAdaptiveQuestions(this.chapterId, 5);
      
      // Si pas assez de questions, on affiche quand même celles disponibles
      if (this.questions.length === 0) {
        alert('Aucune question disponible pour ce chapitre');
        this.router.navigate(['/learning-path']);
        return;
      }
    }

    this.currentQuestion = this.questions[0];
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
