import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressService } from '../../services/progress.service';
import { ChapterService } from '../../services/chapter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mistakesToReview: number = 0;

  constructor(
    private progressService: ProgressService,
    private chapterService: ChapterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.progressService.progress$.subscribe(() => {
      this.mistakesToReview = this.progressService.getMistakesToReview().length;
    });
  }

  startLearning(): void {
    this.router.navigate(['/learning-path']);
  }

  reviewMistakes(): void {
    const progress = this.progressService.getProgress();
    const mistakes = this.progressService.getMistakesToReview();
    if (mistakes.length > 0) {
      const firstMistake = mistakes[0];
      this.router.navigate(['/quiz', firstMistake.chapterId], {
        queryParams: { review: true }
      });
    }
  }
}
