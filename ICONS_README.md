# 🎨 Icônes MathLingo

## Design

L'icône MathLingo est une mascotte mignonne inspirée de Duolingo avec :
- 🎨 Gradient violet/rose (palette de l'app)
- 😊 Visage jaune souriant avec yeux brillants
- 👑 Couronne avec le symbole π (pi)
- ➕ Symboles mathématiques flottants (+, =, √, ÷)
- 🌊 Vague décorative

## Fichiers

### Source
- `src/assets/icon-design.svg` - Fichier source SVG (peut être édité dans Inkscape, Figma, etc.)

### Icônes générées
- `src/assets/icons/icon-72x72.png`
- `src/assets/icons/icon-96x96.png`
- `src/assets/icons/icon-128x128.png`
- `src/assets/icons/icon-144x144.png`
- `src/assets/icons/icon-152x152.png`
- `src/assets/icons/icon-192x192.png`
- `src/assets/icons/icon-384x384.png`
- `src/assets/icons/icon-512x512.png`

### Favicon
- `src/favicon.png` - Favicon 32x32 (renommer en .ico si nécessaire)

## Scripts disponibles

### Générer toutes les icônes PNG
```bash
npm run icons
```

### Générer uniquement le favicon
```bash
npm run favicon
```

### Générer tous les assets (icônes + favicon)
```bash
npm run generate-assets
```

## Modifier l'icône

1. Éditer `src/assets/icon-design.svg` avec votre éditeur préféré
2. Lancer `npm run generate-assets`
3. Les icônes et le favicon seront automatiquement régénérés

## Outils utilisés

- **sharp** - Bibliothèque Node.js pour convertir SVG → PNG
- Installé automatiquement lors de la première génération

## Convertir favicon.png en favicon.ico

Si tu veux un vrai fichier `.ico` multi-résolutions :

1. **En ligne** : https://convertico.com/
2. **Localement avec ImageMagick** :
   ```bash
   magick convert src/favicon.png src/favicon.ico
   ```

## Notes PWA

Les icônes sont automatiquement référencées dans :
- `src/manifest.webmanifest` - Manifest PWA
- `src/index.html` - Favicon

Pour une installation PWA optimale, les icônes recommandées sont :
- 192x192 (icône standard Android)
- 512x512 (icône haute résolution)
- 144x144, 152x152 (iOS)
