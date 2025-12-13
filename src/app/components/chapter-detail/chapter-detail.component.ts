import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chapter } from '../../models/chapter.model';
import { ChapterService } from '../../services/chapter.service';
import { ProgressService } from '../../services/progress.service';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss']
})
export class ChapterDetailComponent implements OnInit {
  chapter: Chapter | null = null;
  completedQuestions: number = 0;
  totalQuestions: number = 0;
  completionPercentage: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chapterService: ChapterService,
    private progressService: ProgressService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const chapterId = params['id'];
      this.loadChapter(chapterId);
    });
  }

  loadChapter(chapterId: string): void {
    this.chapter = this.chapterService.getChapterById(chapterId) || null;
    
    if (this.chapter) {
      const progress = this.progressService.getChapterProgress(chapterId);
      const questions = this.questionService.getQuestionsByChapter(chapterId);
      
      this.totalQuestions = questions.length;
      this.completedQuestions = progress?.completedQuestions.length || 0;
      this.completionPercentage = this.totalQuestions > 0 
        ? Math.round((this.completedQuestions / this.totalQuestions) * 100)
        : 0;
      
      this.chapter.completedQuestions = this.completedQuestions;
      this.chapter.totalQuestions = this.totalQuestions;
      this.chapter.completionPercentage = this.completionPercentage;
    }
  }

  startQuiz(): void {
    if (this.chapter) {
      this.router.navigate(['/quiz', this.chapter.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/learning-path']);
  }
}
