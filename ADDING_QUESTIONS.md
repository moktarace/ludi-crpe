# 📝 Guide d'ajout de questions

## Structure des fichiers

Les questions sont stockées dans des fichiers JSON séparés par chapitre :

```
src/assets/data/
├── chapter-1-questions.json  ← Nombres et calculs
├── chapter-2-questions.json  ← Fonctions
├── chapter-3-questions.json  ← Géométrie
├── chapter-4-questions.json  ← Probabilités
└── chapter-5-questions.json  ← Vecteurs
```

## Format d'une question

### Question à choix multiples (QCM)

```json
{
  "id": "q1_6",
  "chapterId": "chapter_1",
  "type": "multiple_choice",
  "difficulty": "easy",
  "question": "Calculez: 10² = ?",
  "answers": [
    { "text": "100", "isCorrect": true },
    { "text": "20", "isCorrect": false },
    { "text": "50", "isCorrect": false },
    { "text": "1000", "isCorrect": false }
  ],
  "explanation": "10² = 10 × 10 = 100",
  "tags": ["puissances", "calcul"]
}
```

### Question à saisie libre

```json
{
  "id": "q1_7",
  "chapterId": "chapter_1",
  "type": "free_input",
  "difficulty": "medium",
  "question": "Calculez: 7² = ?",
  "correctAnswer": "49",
  "explanation": "7² = 7 × 7 = 49",
  "hints": ["7 × 7 = ?"],
  "tags": ["puissances", "calcul"]
}
```

## Propriétés

| Propriété | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string | ✅ | Identifiant unique (format: `qX_Y` où X = chapitre, Y = numéro) |
| `chapterId` | string | ✅ | ID du chapitre (`chapter_1` à `chapter_5`) |
| `type` | string | ✅ | Type de question: `multiple_choice`, `free_input`, ou `true_false` |
| `difficulty` | string | ✅ | Difficulté: `easy`, `medium`, ou `hard` |
| `question` | string | ✅ | Le texte de la question |
| `answers` | array | Pour QCM | Liste des réponses possibles avec `text` et `isCorrect` |
| `correctAnswer` | string | Pour saisie libre | La réponse attendue |
| `explanation` | string | ❌ | Explication de la réponse |
| `hints` | array | ❌ | Liste d'indices (affichés si l'utilisateur clique sur "💡 Indices") |
| `tags` | array | ❌ | Tags pour catégoriser la question |

## Types de questions

### 1. `multiple_choice` (QCM)
- Affiche 2 à 4 boutons de réponse
- Une seule réponse correcte
- Bon pour les débutants

### 2. `free_input` (Saisie libre)
- L'utilisateur tape sa réponse
- Comparaison exacte avec `correctAnswer`
- Plus difficile, réservé aux utilisateurs avancés

### 3. `true_false` (Vrai/Faux)
- Deux choix : Vrai ou Faux
- Rapide à répondre

## Niveaux de difficulté

- **`easy`** 🟢 : Questions simples, calculs directs
- **`medium`** 🟡 : Questions intermédiaires, nécessitent réflexion
- **`hard`** 🔴 : Questions complexes, plusieurs étapes

## Système adaptatif

Le système ajuste automatiquement les questions selon le score :

| Score | Type de questions présenté |
|-------|----------------------------|
| < 50% | Plus de QCM faciles |
| 50-80% | Mélange équilibré |
| > 80% | Plus de saisie libre et questions difficiles |

## Comment ajouter des questions

### Étape 1 : Choisir le fichier
Ouvrez le fichier JSON du chapitre concerné.

### Étape 2 : Ajouter la question
Ajoutez votre question à la fin du tableau (avant le `]`).

**⚠️ Important** : N'oubliez pas la virgule entre les questions !

### Étape 3 : Tester
```bash
npm start
# Naviguez vers le chapitre et testez votre question
```

## Exemple complet

```json
[
  {
    "id": "q1_1",
    "chapterId": "chapter_1",
    "type": "multiple_choice",
    "difficulty": "easy",
    "question": "Calculez: 3² + 4² = ?",
    "answers": [
      { "text": "25", "isCorrect": true },
      { "text": "49", "isCorrect": false }
    ],
    "explanation": "3² = 9 et 4² = 16, donc 9 + 16 = 25",
    "tags": ["calcul", "puissances"]
  },
  {
    "id": "q1_2",
    "chapterId": "chapter_1",
    "type": "free_input",
    "difficulty": "medium",
    "question": "Calculez: 5³ = ?",
    "correctAnswer": "125",
    "explanation": "5³ = 5 × 5 × 5 = 125",
    "hints": ["5 × 5 = 25", "Puis 25 × 5 = ?"],
    "tags": ["puissances", "calcul"]
  }
]
```

## Bonnes pratiques

✅ **À faire** :
- Utiliser des IDs uniques et séquentiels
- Écrire des explications claires
- Ajouter des indices pour les questions difficiles
- Varier les niveaux de difficulté
- Tester chaque question après l'ajout

❌ **À éviter** :
- Réutiliser des IDs existants
- Questions trop longues ou ambiguës
- Réponses incorrectes trop évidentes
- Oublier la virgule entre questions

## Mettre à jour le nombre de questions

Après avoir ajouté des questions, mettez à jour le nombre total dans `chapter.service.ts` :

```typescript
{
  id: 'chapter_1',
  title: 'Nombres et calculs',
  // ...
  totalQuestions: 10,  // ← Mettez à jour ce nombre
  // ...
}
```

## Déploiement

Une fois les questions ajoutées :

```bash
git add src/assets/data/
git commit -m "✨ Add new questions for chapter X"
git push
```

Le déploiement sur GitHub Pages se fera automatiquement ! 🚀

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub !
