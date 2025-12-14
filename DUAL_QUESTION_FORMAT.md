# Fonctionnalité : Double Format de Question

## 📖 Description

Cette fonctionnalité permet d'afficher chaque question sous **deux versions différentes** :

1. **Version Contextuelle (Énoncé)** 📖 : Question formulée comme un problème de la vie réelle
2. **Version Mathématique** 🔢 : Question formulée de manière abstraite et mathématique

## 🎯 Objectif Pédagogique

Aider les élèves à développer leur capacité à **traduire des problèmes concrets en formulations mathématiques**, une compétence essentielle en mathématiques.

### Exemple

**Version Contextuelle** 📖 :
> 🥐 Tu es à la boulangerie et tu remarques que 3 croissants coûtent 4€. Ta famille veut 6 croissants pour le petit-déjeuner. Combien vas-tu payer ?

**Version Mathématique** 🔢 :
> 3 croissants coûtent 4€. Combien coûtent 6 croissants ?

➡️ **Même réponse**, **même concept**, mais **formulations différentes**.

## 🛠️ Implémentation Technique

### 1. Modèle de Données

#### `QuestionTemplate` (question-template.model.ts)
```typescript
export interface QuestionTemplate {
  // ... autres champs
  questionTemplate: string; // Version mathématique
  realLifeQuestionTemplate?: string; // Version contextuelle (optionnel)
}
```

#### `Question` (question.model.ts)
```typescript
export interface Question {
  // ... autres champs
  question: string; // Version mathématique abstraite
  realLifeQuestion?: string; // Version énoncé contextuel (vie réelle)
}
```

### 2. Génération de Questions

Dans `QuestionTemplate.generateQuestion()` :
```typescript
// Génère les deux versions si disponibles
const question = this.replacePlaceholders(template.questionTemplate, variables);
const realLifeQuestion = template.realLifeQuestionTemplate 
  ? this.replacePlaceholders(template.realLifeQuestionTemplate, variables)
  : undefined;

// Ajout au résultat
result.question = question;
result.realLifeQuestion = realLifeQuestion;
```

### 3. Interface Utilisateur

#### Composant Quiz (quiz.component.ts)
```typescript
showContextualVersion: boolean = true; // Par défaut, version contextuelle

toggleQuestionVersion(): void {
  this.showContextualVersion = !this.showContextualVersion;
}

hasContextualVersion(): boolean {
  return this.currentQuestion?.realLifeQuestion != null;
}

getDisplayedQuestion(): string {
  if (this.showContextualVersion && this.hasContextualVersion()) {
    return this.currentQuestion.realLifeQuestion!;
  }
  return this.currentQuestion.question;
}
```

#### Template (quiz.component.html)
```html
<!-- Bouton de bascule (uniquement si version contextuelle existe) -->
<button 
  *ngIf="hasContextualVersion()" 
  class="toggle-version-button"
  (click)="toggleQuestionVersion()">
  <span class="toggle-icon">{{ showContextualVersion ? '🔢' : '📖' }}</span>
  <span class="toggle-label">{{ showContextualVersion ? 'Version math' : 'Version énoncé' }}</span>
</button>

<!-- Affichage de la question selon la version sélectionnée -->
<h2 class="question-text">{{ getDisplayedQuestion() | mathNotation | markdownFormat }}</h2>
```

## 📝 Ajouter une Version Contextuelle à une Question

### Dans les fichiers JSON de templates

Ajouter le champ `realLifeQuestionTemplate` à côté de `questionTemplate` :

```json
{
  "id": "prop1",
  "chapterId": "chap_proportionnalite",
  "questionTemplate": "{quantite1} croissants coûtent {prix1}€. Combien coûtent {quantite2} croissants ?",
  "realLifeQuestionTemplate": "🥐 Tu es à la boulangerie et tu remarques que {quantite1} croissants coûtent {prix1}€. Ta famille veut {quantite2} croissants pour le petit-déjeuner. Combien vas-tu payer ?",
  "correctAnswerFormula": "{prix1} * {quantite2} / {quantite1}",
  ...
}
```

### Bonnes Pratiques pour les Énoncés Contextuels

✅ **À FAIRE** :
- Utiliser des situations concrètes et familières (boulangerie, courses, vacances...)
- Ajouter des emojis pour rendre l'énoncé visuel et attrayant
- Garder le même niveau de difficulté que la version mathématique
- Utiliser un ton personnel ("Tu", "Ta famille", "Tes parents"...)
- Utiliser le markdown pour la mise en forme (**gras**, *italique*)

❌ **À ÉVITER** :
- Énoncés trop longs ou complexes
- Contextes non pertinents pour l'âge des élèves
- Ajout d'informations superflues qui compliquent le problème
- Utiliser des contextes qui nécessitent des connaissances spécifiques

## 🎨 Comportement UX

1. **Par défaut** : Affiche la version **contextuelle** (plus difficile, plus réaliste)
2. **Bouton visible** uniquement si une version contextuelle existe
3. **Position** :
   - Desktop : En haut à droite de la carte question
   - Mobile : En haut, centré, sur toute la largeur
4. **Toggle** : Bascule instantanément entre les deux versions
5. **Icônes** : 
   - 📖 = Version énoncé (contextuelle)
   - 🔢 = Version mathématique

## 📊 État d'Avancement

### ✅ Implémenté
- Modèle de données (QuestionTemplate, Question)
- Génération dynamique des deux versions
- Interface utilisateur avec bouton toggle
- CSS responsive
- 3 exemples dans le chapitre "Proportionnalité"

### ⏳ À Faire
- [ ] Ajouter des versions contextuelles pour tous les chapitres
- [ ] Créer au moins 2-3 questions contextuelles par chapitre
- [ ] Tester avec des utilisateurs réels
- [ ] Éventuellement tracker quelle version l'élève utilise (analytics)
- [ ] Ajouter des badges/récompenses pour les élèves qui réussissent la version contextuelle du premier coup

## 🧪 Tests

Pour tester la fonctionnalité :

1. Lancer l'application : `npm start`
2. Sélectionner le chapitre "Proportionnalité"
3. Démarrer un quiz
4. Observer le bouton toggle en haut à droite
5. Cliquer pour basculer entre les versions
6. Vérifier que la réponse fonctionne pour les deux versions

## 📚 Références

- Chapitre implémenté : `src/assets/data/chap_proportionnalite-templates.json`
- Composant Quiz : `src/app/components/quiz/`
- Modèles : `src/app/models/question-template.model.ts`, `question.model.ts`
