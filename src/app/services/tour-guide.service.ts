import { Injectable } from '@angular/core';
import introJs from 'intro.js';

@Injectable({
  providedIn: 'root'
})
export class TourGuideService {
  private intro = introJs();

  constructor() {
    this.configureIntro();
  }

  private configureIntro() {
    this.intro.setOptions({
      nextLabel: 'Suivant →',
      prevLabel: '← Précédent',
      doneLabel: '✓ Compris !',
      showStepNumbers: false,
      showProgress: true,
      showBullets: false,
      exitOnOverlayClick: false,
      disableInteraction: true,
      hidePrev: false,
      hideNext: false,
      dontShowAgain: false,
      dontShowAgainLabel: ''
    });
  }

  startHomeTour() {
    this.intro.setOptions({
      steps: [
        {
          title: '👋 Bienvenue !',
          intro: 'MathLingo t\'aide à apprendre les maths niveau Seconde de façon progressive et ludique. Découvrons ensemble toutes les fonctionnalités ! 🚀'
        },
        {
          element: document.querySelector('.btn-primary') as HTMLElement,
          title: '📚 Parcours d\'apprentissage',
          intro: 'Progresse chapitre par chapitre avec des sessions de 5 questions intelligemment sélectionnées.'
        },
        {
          element: document.querySelector('.btn-exam') as HTMLElement,
          title: '🎓 Mode examen',
          intro: 'Entraîne-toi en conditions réelles avec chronomètre et questions mélangées.'
        },
        {
          element: document.querySelector('.btn-secondary') as HTMLElement,
          title: '🔄 Révision intelligente',
          intro: 'L\'application se souvient de tes erreurs et te les propose au bon moment pour optimiser ta mémorisation.'
        },
        {
          element: document.querySelector('.info-section') as HTMLElement,
          title: '✨ Fonctionnalités',
          intro: '<div style="line-height: 1.8;"><strong>Sessions de 5 questions</strong><br>Mélange intelligent : 40% révision + 60% nouveau<br><br><strong>Explications détaillées</strong><br>Comprends tes erreurs avec des exemples concrets<br><br><strong>Progression adaptative</strong><br>QCM d\'abord, puis saisie libre</div>'
        },
        {
          element: document.querySelector('.spaced-repetition-info') as HTMLElement,
          title: '🧠 Répétition espacée',
          intro: 'Plus tu fais d\'erreurs sur une question, plus elle revient régulièrement. Méthode scientifiquement prouvée pour ancrer durablement tes connaissances.'
        },
        {
          title: '📱 Installation recommandée',
          intro: '<div style="line-height: 1.6; max-width: 400px;"><p style="margin-bottom: 16px;"><strong>Installe l\'app sur ton téléphone pour :</strong></p><p style="margin-bottom: 12px;">✓ Accès instantané depuis l\'écran d\'accueil<br>✓ Fonctionnement hors connexion<br>✓ Expérience fluide et rapide</p><hr style="margin: 16px 0; border: none; border-top: 1px solid #ddd;"><p style="font-size: 0.9em; color: #666;"><strong>📱 Android :</strong> Menu Chrome → Installer l\'application<br><br><strong>🍎 iOS :</strong> Bouton Partager → Sur l\'écran d\'accueil</p></div>'
        }
      ]
    });

    this.intro.start();
  }

  exitTour() {
    this.intro.exit();
  }
}
