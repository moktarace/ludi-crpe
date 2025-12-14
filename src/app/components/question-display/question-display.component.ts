import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-question-display',
  templateUrl: './question-display.component.html',
  styleUrls: ['./question-display.component.scss']
})
export class QuestionDisplayComponent {
  @Input() question: Question | null = null;
  @Input() currentAnswer: number | string | null = null;
  @Input() showFeedback: boolean = false;
  @Input() isCorrect: boolean = false;
  @Input() showExplanation: boolean = false;
  @Input() questionNumber: number = 1;
  @Input() totalQuestions: number = 1;
  @Input() showHints: boolean = true;
  @Input() currentHintIndex: number = 0;
  @Input() examMode: boolean = false;
  
  @Output() answerSelected = new EventEmitter<number>();
  @Output() answerChanged = new EventEmitter<string>();
  @Output() hintRequested = new EventEmitter<void>();
  
  String = String;

  selectAnswer(index: number) {
    this.answerSelected.emit(index);
  }

  onInputChange(value: string) {
    this.answerChanged.emit(value);
  }

  requestHint() {
    this.hintRequested.emit();
  }
}
