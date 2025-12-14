# Guide de Visite et Installation PWA - MathLingo

## 📝 Fonctionnalités Ajoutées

### 1. Visite Guidée avec intro.js

Le système de visite guidée utilise la bibliothèque **intro.js** pour offrir une expérience d'onboarding interactive.

#### Services Créés
- **tour-guide.service.ts**: Service principal qui gère toutes les visites guidées
  - `startHomeTour()`: Visite complète de la page d'accueil (7 étapes)
  - Configuration en français avec labels personnalisés
  - Progression visuelle activée

#### Étapes de la Visite Principale
1. **👋 Bienvenue**: Introduction à MathLingo
2. **📚 Apprentissage Progressif**: Présentation du parcours chapitre par chapitre
3. **🎓 Mode Examen**: Explication du mode examen avec chronomètre
4. **🔄 Révision Intelligente**: Système de répétition espacée
5. **✨ Fonctionnalités Clés**: 
   - Sessions de 5 questions (40% révision + 60% nouveau)
   - Explications détaillées
   - Indices progressifs
   - Progression adaptative (QCM → saisie libre)
6. **🧠 Répétition Espacée**: Explication scientifique du système
7. **📱 Installation PWA**: Instructions pour Android et iOS

### 2. Service d'Installation PWA

Le service **pwa-install.service.ts** gère l'installation de l'application en mode PWA.

#### Fonctionnalités
- Détection automatique de l'événement `beforeinstallprompt`
- Détection de la plateforme (iOS, Android, Desktop)
- Prompt d'installation natif pour Android/Desktop
- Instructions personnalisées selon la plateforme

#### Méthodes Principales
```typescript
promptInstall(): Promise<boolean>  // Affiche le prompt d'installation
isIos(): boolean                   // Détecte iOS
isAndroid(): boolean               // Détecte Android
getInstallInstructions(): string   // Retourne les instructions selon la plateforme
```

### 3. Page d'Accueil Améliorée

#### Nouveau Bouton de Visite Guidée
- Bouton **"🎯 Visite guidée"** en haut de la page
- Style distinct avec gradient pastel pour attirer l'attention
- Lance automatiquement la visite complète de l'application

#### Section PWA Détaillée
- **Avantages de l'installation**:
  - ⚡ Accès rapide depuis l'écran d'accueil
  - 📶 Fonctionne hors-ligne
  - 🎯 Expérience native

- **Bouton d'installation intelligent**:
  - S'adapte selon la plateforme
  - Prompt natif sur Android/Desktop si disponible
  - Instructions manuelles sur iOS

- **Guides d'installation visuels**:
  - Instructions étape par étape pour Android
  - Instructions étape par étape pour iOS
  - Affichage conditionnel selon la plateforme détectée

#### Descriptions de Fonctionnalités Enrichies
Chaque carte de fonctionnalité a été enrichie avec plus de détails:
- **Parcours progressif**: Sessions de 5 questions intelligentes
- **Mode Examen**: Chronomètre configurable (2/5/10 min)
- **Questions adaptatives**: Progression QCM → saisie libre
- **Explications détaillées**: Avec exemples concrets
- **Révision intelligente**: Système de répétition espacée
- **Application PWA**: Installation et mode hors-ligne

## 🎨 Styles Ajoutés

### home.component.scss
```scss
.btn-tour {
  background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
  color: #333;
  font-weight: bold;
  border: 2px solid #fff;
  box-shadow: 0 4px 15px rgba(166, 193, 238, 0.4);
}

.pwa-install-section {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  // ... styles complets pour la section PWA
}
```

## 📦 Dépendances Installées

```json
{
  "intro.js": "^7.2.0",
  "@types/intro.js": "^5.1.5",
  "@angular/cdk": "^16.x" // Pour Platform detection
}
```

### Configuration Angular.json
```json
"styles": [
  "src/styles.scss",
  "node_modules/katex/dist/katex.min.css",
  "node_modules/intro.js/minified/introjs.min.css"  // ✅ Ajouté
]
```

## 🚀 Utilisation

### Lancer la Visite Guidée
```typescript
// Dans un component
constructor(private tourGuideService: TourGuideService) {}

startTour() {
  this.tourGuideService.startHomeTour();
}
```

### Installer l'Application PWA
```typescript
// Dans un component
constructor(public pwaInstallService: PwaInstallService) {}

async installPwa() {
  if (this.pwaInstallService.installable) {
    await this.pwaInstallService.promptInstall();
  } else {
    const instructions = this.pwaInstallService.getInstallInstructions();
    alert(instructions);
  }
}
```

## 🎯 Workflow Utilisateur Idéal

1. **Première visite**: L'utilisateur clique sur "🎯 Visite guidée"
2. **Découverte**: Il découvre toutes les fonctionnalités en 7 étapes
3. **Compréhension**: Il comprend le système de révision espacée
4. **Installation**: La visite se termine en expliquant comment installer l'app
5. **Engagement**: L'utilisateur installe l'app et commence à apprendre

## 📱 Instructions d'Installation PWA

### Android (Chrome)
1. Cliquer sur le menu ⋮ en haut à droite
2. Sélectionner "Installer l'application"
3. Confirmer l'installation
4. L'icône apparaît sur l'écran d'accueil 🎉

### iOS (Safari)
1. Cliquer sur le bouton Partager en bas
2. Sélectionner "Sur l'écran d'accueil"
3. Donner un nom (ou garder "MathLingo")
4. Cliquer sur "Ajouter" en haut à droite
5. L'icône apparaît sur l'écran d'accueil 🎉

## ✅ Tests Recommandés

- [ ] Visite guidée fonctionne correctement sur desktop
- [ ] Visite guidée fonctionne correctement sur mobile
- [ ] Prompt d'installation PWA apparaît sur Android/Chrome
- [ ] Instructions iOS s'affichent correctement sur Safari
- [ ] Toutes les étapes de la visite sont traduites en français
- [ ] Les sélecteurs CSS des étapes de la visite pointent vers les bons éléments
- [ ] L'installation PWA fonctionne sur Android
- [ ] L'installation PWA fonctionne sur iOS (instructions manuelles)

## 🔄 Prochaines Améliorations Possibles

1. Ajouter une visite guidée pour le mode quiz
2. Ajouter une visite guidée pour le mode examen
3. Détecter si c'est la première visite et lancer automatiquement le tour
4. Ajouter un badge "Nouveau" sur le bouton de visite guidée
5. Permettre de relancer la visite depuis les paramètres
6. Ajouter des animations plus poussées avec intro.js
7. Créer des captures d'écran pour les instructions iOS/Android

## 📚 Documentation

- [intro.js Documentation](https://introjs.com/docs)
- [Angular PWA Guide](https://angular.io/guide/service-worker-intro)
- [Add to Home Screen (iOS)](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
