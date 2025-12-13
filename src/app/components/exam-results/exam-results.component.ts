import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamResult } from '../../models/exam-result.model';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent implements OnInit {
  result: ExamResult | null = null;
  showExplanations = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.result = navigation.extras.state['result'];
    }
  }

  ngOnInit() {
    if (!this.result) {
      // Pas de résultat, rediriger vers l'accueil
      this.router.navigate(['/']);
    }
  }

  get formattedTime(): string {
    if (!this.result) return '0:00';
    const minutes = Math.floor(this.result.timeElapsed / 60);
    const seconds = this.result.timeElapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get scoreColor(): string {
    if (!this.result) return '#666';
    if (this.result.score >= 80) return '#38ef7d';
    if (this.result.score >= 60) return '#ffa502';
    return '#ff4757';
  }

  get scoreEmoji(): string {
    if (!this.result) return '📊';
    if (this.result.score >= 90) return '🏆';
    if (this.result.score >= 80) return '🎉';
    if (this.result.score >= 60) return '👍';
    if (this.result.score >= 40) return '📚';
    return '💪';
  }

  getAnswerLabel(answerIndex: number | string | null): string {
    if (answerIndex === null) return 'Non répondu';
    if (typeof answerIndex === 'number' && answerIndex >= 0) {
      return String.fromCharCode(65 + answerIndex);
    }
    return answerIndex.toString();
  }

  getUserAnswerText(userAnswer: number | string | null, answers: any[] | undefined): string {
    if (userAnswer === null || !answers) return 'Non répondu';
    if (typeof userAnswer === 'number') {
      return answers[userAnswer]?.text || '';
    }
    return userAnswer.toString();
  }

  getCorrectAnswerIndex(answers: any[] | undefined): number {
    if (!answers) return -1;
    return answers.findIndex(a => a.isCorrect);
  }

  getCorrectAnswerText(answers: any[] | undefined): string {
    if (!answers) return '';
    const correct = answers.find(a => a.isCorrect);
    return correct?.text || '';
  }

  retryExam() {
    this.router.navigate(['/exam']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  toggleExplanations() {
    this.showExplanations = !this.showExplanations;
  }
}
