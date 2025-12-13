# 🚫 Éviter les doublons dans les réponses QCM

## Problème

Avec les questions dynamiques, certaines formules peuvent donner la même valeur et créer des doublons :

### ❌ Exemple de problème

```json
{
  "variables": [{ "name": "a", "min": 2, "max": 12 }],
  "answersTemplate": [
    { "textFormula": "{a} * {a}", "isCorrectFormula": "1" },
    { "textFormula": "{a} * 2", "isCorrectFormula": "0" },
    { "textFormula": "{a} + {a}", "isCorrectFormula": "0" }  // ← PROBLÈME !
  ]
}
```

**Pourquoi ?** Si `a = 5` :
- `{a} * 2` = `5 * 2` = `10`
- `{a} + {a}` = `5 + 5` = `10` ← **Doublon !**

## Solutions

### 1. Protection automatique (déjà implémentée) ✅

Le générateur détecte et supprime automatiquement les doublons :

```typescript
// Le système supprime les réponses en double
// Si trop de doublons, régénère avec des valeurs différentes
```

### 2. Créer des formules distinctes

#### ✅ Bonnes pratiques

**Utilisez des opérations différentes :**
```json
"answersTemplate": [
  { "textFormula": "{a} * {a}", "isCorrectFormula": "1" },       // Correct: a²
  { "textFormula": "{a} * 2", "isCorrectFormula": "0" },         // 2a
  { "textFormula": "{a} * {a} + {a}", "isCorrectFormula": "0" }, // a² + a
  { "textFormula": "{a} * {a} - {a}", "isCorrectFormula": "0" }  // a² - a
]
```

**Exemples de valeurs distinctes pour a=5 :**
- `5 * 5` = `25` ✓
- `5 * 2` = `10` ✓
- `25 + 5` = `30` ✓
- `25 - 5` = `20` ✓

### 3. Vérifier mathématiquement

Testez mentalement avec quelques valeurs :

| Formule | a=2 | a=5 | a=10 | Toujours distinct ? |
|---------|-----|-----|------|---------------------|
| `{a} * {a}` | 4 | 25 | 100 | - |
| `{a} * 2` | 4 | 10 | 20 | ❌ (doublon si a=2) |
| `{a} + {a}` | 4 | 10 | 20 | ❌ (doublon si a=2) |

**Solution** : Exclure 2 ou changer les formules !

```json
{
  "variables": [
    { "name": "a", "min": 2, "max": 12, "exclude": [2] }  // ← Exclure la valeur problématique
  ]
}
```

OU

```json
{
  "answersTemplate": [
    { "textFormula": "{a} * {a}", "isCorrectFormula": "1" },
    { "textFormula": "{a} * 3", "isCorrectFormula": "0" },  // ← Différent de 2a
    { "textFormula": "{a} * {a} + 1", "isCorrectFormula": "0" }
  ]
}
```

## Exemples de formules qui marchent bien

### Puissances
```json
"answersTemplate": [
  { "textFormula": "{a} * {a}", "isCorrectFormula": "1" },           // a²
  { "textFormula": "{a} * {a} + {a}", "isCorrectFormula": "0" },     // a² + a
  { "textFormula": "{a} * ({a} - 1)", "isCorrectFormula": "0" },     // a(a-1)
  { "textFormula": "({a} + 1) * ({a} + 1)", "isCorrectFormula": "0" } // (a+1)²
]
```

### Fonctions
```json
"answersTemplate": [
  { "textFormula": "{a} * {x} + {b}", "isCorrectFormula": "1" },  // Correct: ax + b
  { "textFormula": "{a} + {x} + {b}", "isCorrectFormula": "0" },  // a + x + b
  { "textFormula": "{a} * {x} - {b}", "isCorrectFormula": "0" },  // ax - b
  { "textFormula": "{a} * {x}", "isCorrectFormula": "0" }         // ax
]
```

### Géométrie
```json
"answersTemplate": [
  { "textFormula": "3.14 * {r} * {r}", "isCorrectFormula": "1" },      // πr²
  { "textFormula": "2 * 3.14 * {r}", "isCorrectFormula": "0" },        // 2πr
  { "textFormula": "{r} * {r}", "isCorrectFormula": "0" },             // r²
  { "textFormula": "3.14 * {r}", "isCorrectFormula": "0" }             // πr
]
```

## Checklist avant d'ajouter une question

- [ ] Tester avec au moins 3 valeurs différentes
- [ ] Vérifier qu'aucune formule ne donne le même résultat
- [ ] Ajouter des `exclude` si nécessaire
- [ ] Utiliser des opérations mathématiques variées
- [ ] Les mauvaises réponses doivent être crédibles mais distinctes

## Patterns à éviter

❌ **Multiplication/Addition équivalentes**
```json
{ "textFormula": "{a} * 2" }  // et
{ "textFormula": "{a} + {a}" } // ← Identiques !
```

❌ **Formules algébriquement identiques**
```json
{ "textFormula": "{a} * ({b} + 1)" }  // et
{ "textFormula": "{a} * {b} + {a}" }  // ← Identiques !
```

❌ **Différence trop subtile**
```json
{ "textFormula": "round({a} / 2)" }  // et
{ "textFormula": "floor({a} / 2)" }  // ← Parfois identiques (nombres pairs)
```

## Debugging

Si vous voyez des doublons dans l'application :

1. **Ouvrez la console du navigateur (F12)**
2. Cherchez `⚠️ Duplicate answer detected`
3. Identifiez la question (ID affiché dans le log)
4. Modifiez le template correspondant
5. Rechargez la page

## Système de protection

Le générateur inclut une protection automatique :

```typescript
// 1. Détecte les doublons
const seenTexts = new Set<string>();

// 2. Supprime les réponses en double

// 3. Si trop peu de réponses uniques, régénère avec des valeurs modifiées
if (uniqueAnswers.length < 2) {
  console.warn('⚠️ Too many duplicate answers, regenerating...');
  // Modifie légèrement les variables
}
```

Cette protection est un **filet de sécurité**, mais il vaut mieux **concevoir des templates sans doublons** ! 🎯

---

**Astuce** : Utilisez des écarts significatifs entre les réponses pour rendre le choix plus pédagogique ! 📚
