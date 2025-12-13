# 🎲 Questions Dynamiques - Guide Complet

## Concept

Le système de **questions dynamiques** permet de générer des questions avec des valeurs aléatoires différentes à chaque fois. Ainsi, un élève peut refaire la même question plusieurs fois avec de nouveaux nombres !

## Pourquoi des questions dynamiques ?

✅ **Avantages** :
- 🔄 Pratique illimitée sur le même concept
- 🎯 Meilleure mémorisation (pas de "copier-coller" de réponse)
- 🧠 Vraie compréhension (pas juste mémorisation)
- ♻️ Révision efficace des erreurs avec de nouveaux exemples

## Structure d'un template

### Fichier JSON de template

Les templates sont stockés dans `src/assets/data/chapter-X-templates.json` :

```json
{
  "id": "q1_1",
  "chapterId": "chapter_1",
  "type": "multiple_choice",
  "difficulty": "easy",
  
  "variables": [
    { "name": "a", "min": 2, "max": 12, "exclude": [0, 1] }
  ],
  
  "questionTemplate": "Calculez: {a}² = ?",
  
  "answersTemplate": [
    { "textFormula": "{a} * {a}", "isCorrectFormula": "1" },
    { "textFormula": "{a} * 2", "isCorrectFormula": "0" },
    { "textFormula": "{a} + {a}", "isCorrectFormula": "0" }
  ],
  
  "explanationTemplate": "{a}² = {a} × {a} = {a} * {a}",
  "tags": ["puissances", "calcul"]
}
```

## Définition des variables

### Propriétés d'une variable

```json
{
  "name": "a",        // Nom de la variable (utilisé dans {a})
  "min": 2,           // Valeur minimale
  "max": 12,          // Valeur maximale
  "step": 1,          // Pas (optionnel, défaut: 1)
  "exclude": [0, 1]   // Valeurs à exclure (optionnel)
}
```

### Exemples de configurations

#### Variable simple (entiers de 1 à 10)
```json
{ "name": "x", "min": 1, "max": 10 }
```
Génère : 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

#### Variable avec pas (multiples de 5)
```json
{ "name": "y", "min": 5, "max": 50, "step": 5 }
```
Génère : 5, 10, 15, 20, 25, 30, 35, 40, 45, 50

#### Variable avec exclusions
```json
{ "name": "z", "min": -5, "max": 5, "exclude": [0] }
```
Génère : -5, -4, -3, -2, -1, 1, 2, 3, 4, 5 (pas de 0)

#### Carrés parfaits
```json
{ "name": "n", "min": 4, "max": 144, "step": 4 }
```
Génère : 4, 8, 12, 16, 20, ..., 144 (pour racines carrées faciles)

## Templates de texte

### Placeholders

Utilisez `{nomVariable}` pour insérer les valeurs :

```json
"questionTemplate": "Calculez: {a} + {b} = ?"
```

Si `a = 5` et `b = 3`, cela devient : "Calculez: 5 + 3 = ?"

### Exemples de questions

#### Addition simple
```json
"variables": [
  { "name": "a", "min": 1, "max": 20 },
  { "name": "b", "min": 1, "max": 20 }
],
"questionTemplate": "Calculez: {a} + {b} = ?"
```

#### Fonction linéaire
```json
"variables": [
  { "name": "m", "min": -5, "max": 5, "exclude": [0] },
  { "name": "x", "min": 1, "max": 10 }
],
"questionTemplate": "Soit f(x) = {m}x. Calculez f({x})"
```

#### Géométrie
```json
"variables": [
  { "name": "L", "min": 5, "max": 15 },
  { "name": "l", "min": 3, "max": 10 }
],
"questionTemplate": "Aire d'un rectangle de longueur {L} cm et largeur {l} cm ?"
```

## Formules de calcul

### Syntaxe des formules

Les formules utilisent JavaScript pour calculer les réponses :

| Opération | Syntaxe | Exemple |
|-----------|---------|---------|
| Addition | `+` | `{a} + {b}` |
| Soustraction | `-` | `{a} - {b}` |
| Multiplication | `*` | `{a} * {b}` |
| Division | `/` | `{a} / {b}` |
| Puissance | `pow(base, exp)` | `pow({a}, 2)` ou `{a}^2` |
| Racine carrée | `sqrt(n)` | `sqrt({a})` |
| Valeur absolue | `abs(n)` | `abs({a})` |
| Arrondi | `round(n)` | `round({a} / {b})` |
| Arrondi inférieur | `floor(n)` | `floor({a} / 2)` |
| Arrondi supérieur | `ceil(n)` | `ceil({a} / 3)` |

### Exemples de formules

#### QCM - Réponses calculées
```json
"answersTemplate": [
  { "textFormula": "{a} * {a}", "isCorrectFormula": "1" },
  { "textFormula": "{a} * 2", "isCorrectFormula": "0" },
  { "textFormula": "{a} + {a}", "isCorrectFormula": "0" }
]
```

#### Saisie libre - Réponse exacte
```json
"correctAnswerFormula": "{a} * {a} + {b} * {b}"
```

#### Formules complexes
```json
// Pythagore avec arrondi
"correctAnswerFormula": "round(sqrt({a}*{a} + {b}*{b}) * 10) / 10"

// Aire de cercle
"correctAnswerFormula": "round(3.14 * {r} * {r} * 10) / 10"

// Résolution d'équation
"correctAnswerFormula": "({result} - {b}) / {a}"
```

## Types de questions

### 1. QCM (Multiple Choice)

```json
{
  "type": "multiple_choice",
  "answersTemplate": [
    { "textFormula": "FORMULE_CORRECTE", "isCorrectFormula": "1" },
    { "textFormula": "FORMULE_FAUSSE_1", "isCorrectFormula": "0" },
    { "textFormula": "FORMULE_FAUSSE_2", "isCorrectFormula": "0" },
    { "textFormula": "FORMULE_FAUSSE_3", "isCorrectFormula": "0" }
  ]
}
```

**Astuce** : Pour `isCorrectFormula`, utilisez :
- `"1"` pour la bonne réponse
- `"0"` pour les mauvaises réponses

### 2. Saisie libre (Free Input)

```json
{
  "type": "free_input",
  "correctAnswerFormula": "{a} + {b}"
}
```

L'utilisateur doit taper la réponse exacte.

## Erreurs courantes avec QCM dynamiques

### ❌ Réponses identiques

Si deux réponses ont la même valeur, l'utilisateur pourrait deviner !

**Mauvais exemple** :
```json
"variables": [{ "name": "a", "min": 2, "max": 5 }],
"answersTemplate": [
  { "textFormula": "{a} * 2", "isCorrectFormula": "1" },
  { "textFormula": "{a} + {a}", "isCorrectFormula": "0" }  // ← IDENTIQUE !
]
```

Si `a = 3`, les deux donnent `6` !

**✅ Solution** : Assurez-vous que les formules donnent des résultats différents.

### ❌ Réponses trop évidentes

**Mauvais exemple** :
```json
"answersTemplate": [
  { "textFormula": "{a} * {b}", "isCorrectFormula": "1" },
  { "textFormula": "9999", "isCorrectFormula": "0" }  // ← Trop évident
]
```

**✅ Solution** : Créez des distracteurs crédibles basés sur des erreurs courantes.

## Exemples complets

### Exemple 1 : Puissances (facile)

```json
{
  "id": "q1_powers",
  "chapterId": "chapter_1",
  "type": "multiple_choice",
  "difficulty": "easy",
  "variables": [
    { "name": "n", "min": 2, "max": 12, "exclude": [0, 1] }
  ],
  "questionTemplate": "Calculez: {n}² = ?",
  "answersTemplate": [
    { "textFormula": "{n} * {n}", "isCorrectFormula": "1" },
    { "textFormula": "{n} * 2", "isCorrectFormula": "0" },
    { "textFormula": "{n} + {n}", "isCorrectFormula": "0" },
    { "textFormula": "{n} * 3", "isCorrectFormula": "0" }
  ],
  "explanationTemplate": "{n}² = {n} × {n} = {n} * {n}",
  "tags": ["puissances", "calcul"]
}
```

### Exemple 2 : Fonction affine (moyen)

```json
{
  "id": "q2_affine",
  "chapterId": "chapter_2",
  "type": "free_input",
  "difficulty": "medium",
  "variables": [
    { "name": "a", "min": -5, "max": 5, "exclude": [0] },
    { "name": "b", "min": -10, "max": 10 },
    { "name": "x", "min": 1, "max": 10 }
  ],
  "questionTemplate": "Soit f(x) = {a}x + {b}. Calculez f({x})",
  "correctAnswerFormula": "{a} * {x} + {b}",
  "explanationTemplate": "f({x}) = {a} × {x} + {b} = {a} * {x} + {b}",
  "hintsTemplates": [
    "Commencez par calculer {a} × {x}",
    "Puis ajoutez {b}"
  ],
  "tags": ["fonctions", "fonction affine"]
}
```

### Exemple 3 : Théorème de Pythagore (difficile)

```json
{
  "id": "q3_pythagore",
  "chapterId": "chapter_3",
  "type": "free_input",
  "difficulty": "hard",
  "variables": [
    { "name": "a", "min": 3, "max": 12 },
    { "name": "b", "min": 4, "max": 12 }
  ],
  "questionTemplate": "Triangle rectangle: a={a} cm, b={b} cm. Hypoténuse c=? (arrondi à 0.1)",
  "correctAnswerFormula": "round(sqrt({a}*{a} + {b}*{b}) * 10) / 10",
  "explanationTemplate": "c² = a² + b² = {a}² + {b}² = {a}*{a} + {b}*{b}, donc c ≈ round(sqrt({a}*{a} + {b}*{b}) * 10) / 10",
  "hintsTemplates": [
    "Utilisez le théorème de Pythagore: c² = a² + b²",
    "Calculez {a}² + {b}²",
    "Prenez la racine carrée"
  ],
  "tags": ["géométrie", "pythagore", "triangle"]
}
```

## Tester vos templates

### 1. Vérifier les variables

Assurez-vous que :
- Les plages de valeurs sont appropriées
- Les exclusions sont nécessaires
- Le `step` génère des nombres intéressants

### 2. Vérifier les formules

Testez mentalement avec quelques valeurs :
- Les formules donnent-elles des résultats cohérents ?
- Les réponses QCM sont-elles toutes différentes ?
- La réponse correcte est-elle évidente ?

### 3. Tester dans l'application

```bash
npm start
```

Faites la question plusieurs fois pour vérifier que :
- ✅ Les valeurs changent à chaque fois
- ✅ Les réponses sont correctes
- ✅ L'explication est claire
- ✅ Pas d'erreurs de calcul

## Migration de questions statiques vers templates

### Avant (statique)

```json
{
  "id": "q1_1",
  "question": "Calculez: 5² = ?",
  "answers": [
    { "text": "25", "isCorrect": true },
    { "text": "10", "isCorrect": false }
  ]
}
```

### Après (dynamique)

```json
{
  "id": "q1_1",
  "variables": [
    { "name": "n", "min": 2, "max": 12 }
  ],
  "questionTemplate": "Calculez: {n}² = ?",
  "answersTemplate": [
    { "textFormula": "{n} * {n}", "isCorrectFormula": "1" },
    { "textFormula": "{n} * 2", "isCorrectFormula": "0" }
  ]
}
```

## Bonnes pratiques

### ✅ À faire

1. **Plages réalistes** : Choisissez des valeurs adaptées au niveau
2. **Distracteurs crédibles** : Basez les mauvaises réponses sur des erreurs courantes
3. **Formules simples** : Évitez les calculs trop complexes
4. **Testez beaucoup** : Générez 10-20 fois pour vérifier la cohérence
5. **Documentation** : Commentez les choix de variables complexes

### ❌ À éviter

1. ❌ Variables qui peuvent donner `0` ou `1` (sauf si voulu)
2. ❌ Divisions par zéro
3. ❌ Racines de nombres négatifs
4. ❌ Résultats avec trop de décimales
5. ❌ Réponses QCM identiques

## Architecture

```
question.service.ts
  ↓ Charge les templates
  ↓ Génère les questions dynamiquement
  ↓ À chaque appel de getQuestionById()
  
QuestionGenerator.generateQuestion()
  ↓ Génère valeurs aléatoires
  ↓ Remplace placeholders {var}
  ↓ Évalue formules mathématiques
  ↓ Retourne Question complète
```

## Fichiers importants

- 📄 `src/app/models/question-template.model.ts` - Modèle et générateur
- 📄 `src/assets/data/chapter-X-templates.json` - Templates par chapitre
- 📄 `src/app/services/question.service.ts` - Service qui charge et génère

---

**🎯 Résultat** : Des questions infiniment variées pour un apprentissage optimal ! 🚀
