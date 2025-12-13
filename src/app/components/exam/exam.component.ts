import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { ExamAnswer, ExamResult } from '../../models/exam-result.model';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, OnDestroy {
  // Configuration
  selectedDuration: number = 5; // minutes par défaut
  durations = [2, 5, 10];
  
  // État de l'examen
  examStarted = false;
  examFinished = false;
  
  // Questions
  questions: Question[] = [];
  currentQuestionIndex = 0;
  
  // Réponses
  examAnswers: ExamAnswer[] = [];
  currentAnswer: number | string | null = null;
  
  // Chronomètre
  timeRemaining: number = 0; // en secondes
  timerInterval: any;
  questionStartTime: number = 0;
  
  // Helper pour le template
  String = String;
  
  constructor(
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Attendre que les questions soient chargées
    this.questionService.waitForQuestionsLoaded().then(() => {
      // Questions déjà chargées, prêt à démarrer
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  async startExam() {
    // Charger toutes les questions de tous les chapitres
    await this.loadAllQuestions();
    
    if (this.questions.length === 0) {
      console.error('Aucune question disponible pour l\'examen');
      return;
    }
    
    // Initialiser le chronomètre
    this.timeRemaining = this.selectedDuration * 60;
    this.examStarted = true;
    this.currentQuestionIndex = 0;
    this.questionStartTime = Date.now();
    
    // Démarrer le timer
    this.startTimer();
  }

  async loadAllQuestions() {
    const allQuestions: Question[] = [];
    
    // Récupérer les questions de tous les chapitres
    for (let i = 1; i <= 3; i++) {
      const chapterQuestions = await this.questionService.getQuestionsByChapter(`chapter_${i}`);
      allQuestions.push(...chapterQuestions);
    }
    
    // Mélanger les questions
    this.questions = this.shuffleArray(allQuestions);
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      
      if (this.timeRemaining <= 0) {
        this.finishExam();
      }
    }, 1000);
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  selectAnswer(answerIndex: number) {
    if (this.currentQuestion?.type === 'multiple_choice') {
      this.currentAnswer = answerIndex;
    }
  }

  onFreeInputChange(value: string) {
    this.currentAnswer = value;
  }

  nextQuestion() {
    if (!this.currentQuestion) return;
    
    // Enregistrer la réponse
    const timeTaken = Math.floor((Date.now() - this.questionStartTime) / 1000);
    const isCorrect = this.checkAnswer();
    
    this.examAnswers.push({
      question: this.currentQuestion,
      userAnswer: this.currentAnswer,
      isCorrect: isCorrect,
      timeTaken: timeTaken
    });
    
    // Passer à la question suivante
    this.currentQuestionIndex++;
    this.currentAnswer = null;
    this.questionStartTime = Date.now();
    
    // Vérifier si c'était la dernière question
    if (this.currentQuestionIndex >= this.questions.length) {
      this.finishExam();
    }
  }

  checkAnswer(): boolean {
    if (!this.currentQuestion || this.currentAnswer === null) {
      return false;
    }
    
    if (this.currentQuestion.type === 'multiple_choice') {
      // Trouver l'index de la réponse correcte
      const correctIndex = this.currentQuestion.answers?.findIndex(a => a.isCorrect);
      return this.currentAnswer === correctIndex;
    } else {
      // Pour les questions à saisie libre
      const userAnswer = parseFloat(this.currentAnswer.toString());
      const correctAnswer = typeof this.currentQuestion.correctAnswer === 'number' 
        ? this.currentQuestion.correctAnswer 
        : parseFloat(this.currentQuestion.correctAnswer || '0');
      return Math.abs(userAnswer - correctAnswer) < 0.01;
    }
  }

  finishExam() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.examFinished = true;
    
    // Calculer le temps écoulé
    const timeElapsed = (this.selectedDuration * 60) - this.timeRemaining;
    
    // Créer le résultat
    const result: ExamResult = {
      duration: this.selectedDuration,
      answers: this.examAnswers,
      totalQuestions: this.questions.length,
      correctAnswers: this.examAnswers.filter(a => a.isCorrect).length,
      score: Math.round((this.examAnswers.filter(a => a.isCorrect).length / this.questions.length) * 100),
      timeElapsed: timeElapsed,
      completedAt: new Date()
    };
    
    // Naviguer vers la page de résultats
    this.router.navigate(['/exam-results'], { state: { result } });
  }

  get canGoNext(): boolean {
    return this.currentAnswer !== null && this.currentAnswer !== '';
  }
}
