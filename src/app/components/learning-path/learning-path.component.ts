import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chapter } from '../../models/chapter.model';
import { ChapterService } from '../../services/chapter.service';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-learning-path',
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.scss']
})
export class LearningPathComponent implements OnInit {
  chapters: Chapter[] = [];

  constructor(
    private chapterService: ChapterService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChapters();
    
    // Mettre à jour la progression des chapitres
    this.progressService.progress$.subscribe(progress => {
      this.updateChaptersProgress(progress.chapterProgress);
    });
  }

  loadChapters(): void {
    this.chapters = this.chapterService.getAllChapters();
  }

  updateChaptersProgress(chapterProgress: any[]): void {
    this.chapters.forEach(chapter => {
      const progress = chapterProgress.find(cp => cp.chapterId === chapter.id);
      if (progress) {
        chapter.completedQuestions = progress.completedQuestions.length;
        const totalQuestions = chapter.totalQuestions || 5;
        chapter.completionPercentage = Math.round((chapter.completedQuestions / totalQuestions) * 100);
        
        // Débloquer le chapitre suivant si celui-ci est complété à 100%
        if (chapter.completionPercentage === 100 && progress.isCompleted) {
          this.chapterService.unlockNextChapter(chapter.id);
          this.loadChapters(); // Recharger pour voir les changements
        }
      }
    });
  }

  selectChapter(chapter: Chapter): void {
    if (!chapter.isLocked) {
      this.router.navigate(['/chapter', chapter.id]);
    }
  }

  getChapterStatusClass(chapter: Chapter): string {
    if (chapter.isLocked) return 'locked';
    if (chapter.completionPercentage === 100) return 'completed';
    if (chapter.completionPercentage > 0) return 'in-progress';
    return 'available';
  }
}
