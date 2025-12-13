# MathLingo - Application PWA d'apprentissage des mathématiques# Mathlingo



[![Deploy to GitHub Pages](https://github.com/moktarace/ludi-crpe/actions/workflows/deploy.yml/badge.svg)](https://github.com/moktarace/ludi-crpe/actions/workflows/deploy.yml)This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.2.



🔗 **Démo en ligne** : [https://moktarace.github.io/ludi-crpe/](https://moktarace.github.io/ludi-crpe/)## Development server



## 📚 DescriptionRun `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.



MathLingo est une application Progressive Web App (PWA) développée avec Angular pour l'apprentissage des mathématiques niveau seconde. Inspirée de Duolingo, elle offre une expérience d'apprentissage gamifiée et adaptive.## Code scaffolding



## ✨ FonctionnalitésRun `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.



### Parcours d'apprentissage progressif## Build

- **Chapitres structurés** : 5 chapitres couvrant le programme de seconde

- **Déblocage progressif** : Les chapitres se débloquent au fur et à mesureRun `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

- **Suivi de progression** : Visualisation du pourcentage de complétion

## Running unit tests

### QCM adaptatifs

- **Questions à choix multiples** : Pour démarrer en douceurRun `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

- **Adaptation au niveau** : Les questions s'adaptent au score de l'utilisateur

- **Progression vers la saisie libre** : Plus le score augmente, plus les questions nécessitent une saisie libre## Running end-to-end tests



### Système de révision intelligentRun `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

- **Détection des erreurs** : Toutes les erreurs sont enregistrées

- **Rappels automatiques** : Les questions ratées reviennent régulièrement## Further help

- **Priorisation** : Les erreurs fréquentes sont prioritaires

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

### Gamification
- **Système d'XP** : Gagnez des points d'expérience à chaque bonne réponse
- **Streaks** : Maintenez votre série de jours consécutifs
- **Badges de complétion** : Célébrez vos réussites

### Mode hors-ligne (PWA)
- **Fonctionne sans connexion** : Service Worker intégré
- **Installation sur mobile/desktop** : Ajoutez l'app à votre écran d'accueil
- **Persistance locale** : Les données sont sauvegardées en LocalStorage

## 🎯 Chapitres disponibles

1. **🔢 Nombres et calculs** (5 questions)
   - Puissances et racines carrées
   - Propriétés des exposants

2. **📈 Fonctions** (5 questions)
   - Fonctions linéaires et affines
   - Images et équations

3. **📐 Géométrie** (5 questions)
   - Aires et périmètres
   - Théorème de Pythagore
   - Cercles

4. **🎲 Probabilités** (à venir)
5. **➡️ Vecteurs** (à venir)

## 🚀 Installation et lancement

### Prérequis
- Node.js (version 18 ou supérieure)
- npm

### Installation

```bash
git clone https://github.com/moktarace/ludi-crpe.git
cd ludi-crpe
npm install
```

### Lancement

```bash
npm start
# L'app sera sur http://localhost:4200
```

## 🔧 Technologies

- Angular 16 - TypeScript - Angular Material
- RxJS - Service Worker - GitHub Pages

## 🎮 Comment utiliser

1. Cliquez sur "Commencer l'apprentissage"
2. Sélectionnez un chapitre
3. Répondez aux questions (QCM ou saisie libre)
4. Utilisez les indices si besoin
5. Révisez vos erreurs régulièrement

## 🚀 Déploiement GitHub Pages

L'application se déploie automatiquement sur GitHub Pages via GitHub Actions.

**Configuration** :
1. Settings > Pages > Source : **GitHub Actions**
2. Push sur `main` déclenche le déploiement automatique

## 📄 Licence

MIT

---

Fait avec ❤️ pour les étudiants en mathématiques
