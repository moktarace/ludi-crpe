import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressService } from '../../services/progress.service';
import { ChapterService } from '../../services/chapter.service';
import { TourGuideService } from '../../services/tour-guide.service';
import { PwaInstallService } from '../../services/pwa-install.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mistakesToReview: number = 0;
  private readonly TOUR_COMPLETED_KEY = 'mathlingo_tour_completed';

  constructor(
    private progressService: ProgressService,
    private chapterService: ChapterService,
    private router: Router,
    private tourGuideService: TourGuideService,
    public pwaInstallService: PwaInstallService
  ) {}

  ngOnInit(): void {
    this.progressService.progress$.subscribe(() => {
      this.mistakesToReview = this.progressService.getMistakesToReview().length;
      console.log('📊 Questions à réviser:', this.mistakesToReview);
    });

    // Lancer automatiquement le tour à la première visite
    this.checkAndStartTour();
  }

  private checkAndStartTour(): void {
    const tourCompleted = localStorage.getItem(this.TOUR_COMPLETED_KEY);
    if (!tourCompleted) {
      // Attendre un peu que la page soit bien chargée
      setTimeout(() => {
        this.startTour();
        localStorage.setItem(this.TOUR_COMPLETED_KEY, 'true');
      }, 500);
    }
  }

  startLearning(): void {
    this.router.navigate(['/learning-path']);
  }

  startExam(): void {
    this.router.navigate(['/exam']);
  }

  reviewMistakes(): void {
    const mistakes = this.progressService.getMistakesToReview();
    console.log('📝 Mode révision - Erreurs à revoir:', mistakes);
    
    if (mistakes.length > 0) {
      console.log('➡️ Redirection vers mode révision global (toutes les erreurs)');
      // Utiliser 'all' comme chapterId pour réviser toutes les erreurs
      this.router.navigate(['/quiz', 'all'], {
        queryParams: { review: true }
      });
    } else {
      alert('Aucune erreur à réviser pour le moment. Continue à t\'entraîner !');
    }
  }

  startTour(): void {
    this.tourGuideService.startHomeTour();
  }

  async installPwa(): Promise<void> {
    if (this.pwaInstallService.installable) {
      const installed = await this.pwaInstallService.promptInstall();
      if (installed) {
        alert('✅ Application installée avec succès !');
      }
    } else {
      const instructions = this.pwaInstallService.getInstallInstructions();
      alert(instructions);
    }
  }
}
