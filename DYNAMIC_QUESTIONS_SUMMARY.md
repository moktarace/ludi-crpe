# 🎲 Système de Questions Dynamiques

## ✅ Implémentation terminée !

Le système de **questions avec valeurs aléatoires** est maintenant opérationnel !

## 🎯 Fonctionnalités

### Questions qui varient
- ✅ Chaque question génère de nouvelles valeurs à chaque affichage
- ✅ Permet de refaire une question indéfiniment avec différents nombres
- ✅ Idéal pour la révision des erreurs

### Architecture
- ✅ **Templates JSON** : Questions avec variables `{a}`, `{b}`, etc.
- ✅ **Générateur intelligent** : Calcule automatiquement les réponses
- ✅ **Formules mathématiques** : Support de +, -, *, /, puissances, racines, etc.
- ✅ **Backward compatible** : Fonctionne aussi avec questions statiques

## 📁 Structure des fichiers

```
src/assets/data/
├── chapter-1-templates.json  ← 5 templates dynamiques (Puissances)
├── chapter-2-templates.json  ← 5 templates dynamiques (Fonctions)
├── chapter-3-templates.json  ← 5 templates dynamiques (Géométrie)
├── chapter-1-questions.json  ← Questions statiques (fallback)
├── chapter-2-questions.json
└── chapter-3-questions.json
```

## 🔧 Comment ça marche

### 1. Template de question

```json
{
  "id": "q1_1",
  "variables": [
    { "name": "a", "min": 2, "max": 12 }
  ],
  "questionTemplate": "Calculez: {a}² = ?",
  "answersTemplate": [
    { "textFormula": "{a} * {a}", "isCorrectFormula": "1" }
  ]
}
```

### 2. Génération automatique

À chaque fois qu'on demande la question `q1_1` :
- Le système génère un `a` aléatoire entre 2 et 12
- Remplace `{a}` dans le texte → "Calculez: 7² = ?"
- Calcule la réponse → `7 * 7 = 49`

### 3. Résultat

L'utilisateur voit :
- **1ère fois** : "Calculez: 7² = ?" → Réponse: 49
- **2ème fois** : "Calculez: 5² = ?" → Réponse: 25
- **3ème fois** : "Calculez: 11² = ?" → Réponse: 121

## 📊 Chapitres implémentés

| Chapitre | Templates | Concepts |
|----------|-----------|----------|
| Chapitre 1 | 5 | Puissances, racines, exposants |
| Chapitre 2 | 5 | Fonctions linéaires/affines, équations |
| Chapitre 3 | 5 | Aires, périmètres, Pythagore |

## 🚀 Utilisation

### Pour l'élève
1. Fait une question et se trompe
2. La question apparaît dans "Réviser mes erreurs"
3. En la refaisant, les nombres sont différents
4. Pratique jusqu'à maîtriser le concept

### Pour ajouter des questions
Consultez les guides :
- 📘 **[ADDING_QUESTIONS.md](./ADDING_QUESTIONS.md)** - Questions statiques
- 📗 **[DYNAMIC_QUESTIONS.md](./DYNAMIC_QUESTIONS.md)** - Questions dynamiques (détails complets)

## 🎓 Exemples de templates

### Chapitre 1 : Puissances
```json
{ "name": "n", "min": 2, "max": 12 }
"Calculez: {n}² = ?"
```
Génère : 4², 7², 9², 11², etc.

### Chapitre 2 : Fonctions
```json
{ "name": "a", "min": -5, "max": 5 },
{ "name": "x", "min": 1, "max": 10 }
"Soit f(x) = {a}x + 3. Calculez f({x})"
```
Génère : f(5) avec a=2, f(7) avec a=-3, etc.

### Chapitre 3 : Géométrie
```json
{ "name": "L", "min": 3, "max": 15 },
{ "name": "l", "min": 2, "max": 10 }
"Aire d'un rectangle {L} × {l} cm ?"
```
Génère : 7×5, 12×4, 9×8, etc.

## 🧮 Formules supportées

| Opération | Syntaxe | Exemple |
|-----------|---------|---------|
| Addition | `{a} + {b}` | 5 + 3 = 8 |
| Multiplication | `{a} * {b}` | 4 * 6 = 24 |
| Puissance | `pow({a}, 2)` | 3² = 9 |
| Racine carrée | `sqrt({a})` | √16 = 4 |
| Arrondi | `round({a} / {b})` | round(7/2) = 4 |

## 📈 Bénéfices pédagogiques

✅ **Compréhension vs mémorisation**
- L'élève ne peut pas juste mémoriser "la réponse est 25"
- Il doit comprendre le concept

✅ **Pratique illimitée**
- Peut refaire la même question 10, 20, 100 fois
- Avec des valeurs différentes à chaque fois

✅ **Révision efficace**
- Les erreurs sont revisitées avec de nouveaux exemples
- Renforce la compréhension

✅ **Gamification naturelle**
- Pas de frustration de "retomber sur la même question"
- Sentiment de progression réelle

## 🔨 Fichiers modifiés

### Nouveaux fichiers
- ✅ `src/app/models/question-template.model.ts` - Modèle et générateur
- ✅ `src/assets/data/chapter-1-templates.json` - 5 templates
- ✅ `src/assets/data/chapter-2-templates.json` - 5 templates
- ✅ `src/assets/data/chapter-3-templates.json` - 5 templates
- ✅ `DYNAMIC_QUESTIONS.md` - Guide complet

### Fichiers modifiés
- ✅ `src/app/services/question.service.ts` - Charge templates + génère questions
- ✅ `ADDING_QUESTIONS.md` - Ajouté section sur questions dynamiques

## 🧪 Tests

### Pour tester
```bash
npm start
```

Puis :
1. Allez sur le chapitre 1
2. Faites une question (notez les valeurs)
3. Rafraîchissez ou refaites la même question
4. ✅ Les valeurs doivent avoir changé !

### Exemple de test
**Question ID : `q1_1`**
- Test 1 : "Calculez: 7² = ?" → Réponse: 49
- Test 2 : "Calculez: 5² = ?" → Réponse: 25
- Test 3 : "Calculez: 11² = ?" → Réponse: 121

## 📝 Prochaines étapes

- [ ] Ajouter plus de templates aux chapitres 4 et 5
- [ ] Créer des templates pour questions plus complexes
- [ ] Tester avec vrais élèves
- [ ] Ajuster les plages de valeurs selon feedback

## 🎉 Résultat

🎲 **Questions infiniment variées = Apprentissage optimal !**

Les élèves peuvent maintenant :
- ✅ Pratiquer sans limite
- ✅ Vraiment comprendre les concepts
- ✅ Réviser leurs erreurs efficacement
- ✅ Progresser à leur rythme

---

**Next**: Testez l'application et commencez à ajouter vos propres templates ! 🚀
