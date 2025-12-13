# Système de Progression Automatique des Types de Questions

## Principe

Au lieu d'avoir le type de question (QCM vs Saisie libre) hardcodé dans chaque template, le système détermine automatiquement le type en fonction de la position de la question dans la séquence d'apprentissage.

## Logique de Progression

### Questions 1-3 (index 0-2)
**Type: QCM uniquement**
- Permet à l'élève de s'habituer aux concepts
- Moins intimidant pour débuter
- Feedback immédiat sur les erreurs courantes

### Questions 4-6 (index 3-5)
**Type: Alternance QCM/Saisie libre**
- Index pair (4, 6, ...) → QCM
- Index impair (5, 7, ...) → Saisie libre
- Transition progressive vers la saisie libre

### Questions 7+ (index 6+)
**Type: Principalement Saisie libre (80%)**
- 80% de chances d'avoir une question à saisie libre
- 20% de chances d'avoir un QCM (pour varier)
- Encourage l'autonomie et la maîtrise

## Implémentation

### Méthode `determineQuestionType(questionIndex: number)`
Située dans `QuestionGenerator`, cette méthode retourne:
- `'multiple_choice'` pour les QCM
- `'free_input'` pour les saisies libres

### Génération Intelligente
- Si le template a un `answersTemplate`, il peut être utilisé en QCM
- Si le template a un `correctAnswerFormula`, il peut être utilisé en saisie libre
- Si seul `correctAnswerFormula` existe mais qu'un QCM est demandé, des distracteurs sont générés automatiquement
- Si seul `answersTemplate` existe mais qu'une saisie libre est demandée, la bonne réponse est extraite

## Avantages

1. **Un seul template pour deux types**: Plus besoin de dupliquer les questions
2. **Progression pédagogique**: Adapte naturellement la difficulté
3. **Flexibilité**: Facile d'ajuster la logique de progression
4. **Moins de maintenance**: Pas besoin de spécifier le type manuellement

## Cas Particuliers

- **Régénération de question par ID**: Utilise le type du template (pas d'index disponible)
- **Questions d'erreur à revoir**: Utilise le type du template
- **Tests de compétence**: Utilise le type du template

Seule la progression normale dans un chapitre utilise le type automatique basé sur l'index.
