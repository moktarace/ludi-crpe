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
      console.log('📊 Questions à réviser:', this.mistakesToReview);
    });
  }

  startLearning(): void {
    this.router.navigate(['/learning-path']);
  }

  reviewMistakes(): void {
    const mistakes = this.progressService.getMistakesToReview();
    console.log('📝 Mode révision - Erreurs à revoir:', mistakes);
    
    if (mistakes.length > 0) {
      const firstMistake = mistakes[0];
      console.log('➡️ Redirection vers chapitre:', firstMistake.chapterId);
      this.router.navigate(['/quiz', firstMistake.chapterId], {
        queryParams: { review: true }
      });
    } else {
      alert('Aucune erreur à réviser pour le moment. Continue à t\'entraîner !');
    }
  }
}
