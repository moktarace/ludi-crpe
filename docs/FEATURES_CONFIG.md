# Configuration des Features

Ce fichier permet d'activer/désactiver certaines fonctionnalités de l'application.

## Variables disponibles

### `enableFreeInputMode` (boolean)
- **Par défaut**: `false`
- **Description**: Active le mode saisie libre pour les questions
- Lorsque désactivé, toutes les questions sont affichées en mode QCM uniquement
- Le code de la saisie libre est conservé mais n'est pas utilisé

### `showQuestionType` (boolean)
- **Par défaut**: `false`
- **Description**: Affiche le type de question dans l'interface (QCM, Saisie libre, etc.)
- Lorsque désactivé, l'indicateur de type n'est pas affiché

## Comment modifier

Modifier le fichier `src/app/config/features.config.ts`:

```typescript
export const FeaturesConfig = {
  enableFreeInputMode: false,  // true pour activer
  showQuestionType: false,     // true pour afficher
};
```

## Impact

### Mode saisie libre désactivé (`enableFreeInputMode: false`)
- Toutes les questions utilisent `answersTemplate` pour afficher 4 options en QCM
- L'algorithme de progression adaptative (QCM → Saisie libre) est court-circuité
- Les questions marquées `type: 'free_input'` dans les templates sont automatiquement converties en QCM

### Type de question masqué (`showQuestionType: false`)
- Le badge "📝 QCM" / "✍️ Réponse libre" n'apparaît plus dans les composants:
  - `quiz.component.html`
  - `question-display.component.html`
- L'information reste visible dans `exam-results.component.html` pour l'analyse des résultats
