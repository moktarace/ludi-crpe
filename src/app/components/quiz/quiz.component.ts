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
  score: number = 0;
  chapterId: string = '';
  isReviewMode: boolean = false;
  showHints: boolean = false;
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

  loadQuestions(): void {
    if (this.isReviewMode) {
      const mistakes = this.progressService.getMistakesToReview();
      const mistakeIds = mistakes
        .filter(m => m.chapterId === this.chapterId)
        .map(m => m.questionId);
      
      this.questions = mistakeIds
        .map(id => this.questionService.getQuestionById(id))
        .filter(q => q !== undefined) as Question[];
    } else {
      this.questions = this.questionService.getAdaptiveQuestions(this.chapterId, 5);
    }

    if (this.questions.length > 0) {
      this.currentQuestion = this.questions[0];
    } else {
      // Pas de questions disponibles
      alert('Aucune question disponible pour ce chapitre');
      this.router.navigate(['/learning-path']);
    }
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

    if (this.isCorrect) {
      this.score += 10;
    }

    // Enregistrer la réponse
    const userAnswer: UserAnswer = {
      questionId: this.currentQuestion.id,
      userResponse: answerToCheck,
      isCorrect: this.isCorrect,
      timestamp: new Date(),
      attemptsCount: 1
    };

    this.progressService.recordAnswer(this.chapterId, this.currentQuestion.id, userAnswer);

    // Marquer comme révisé si en mode révision
    if (this.isReviewMode && this.isCorrect) {
      this.progressService.markMistakeAsReviewed(this.currentQuestion.id);
    }
  }

  nextQuestion(): void {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
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
    const totalQuestions = this.questions.length;
    const percentage = Math.round((this.score / (totalQuestions * 10)) * 100);
    
    // Vérifier si le chapitre est complété
    const progress = this.progressService.getChapterProgress(this.chapterId);
    const chapter = this.chapterService.getChapterById(this.chapterId);
    
    if (progress && chapter) {
      const completedQuestions = progress.completedQuestions.length;
      if (completedQuestions >= chapter.totalQuestions) {
        this.progressService.completeChapter(this.chapterId);
      }
    }

    this.router.navigate(['/chapter', this.chapterId], {
      queryParams: { 
        score: this.score, 
        total: totalQuestions * 10,
        percentage: percentage
      }
    });
  }

  toggleHints(): void {
    this.showHints = !this.showHints;
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
