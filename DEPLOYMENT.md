# 🚀 Guide de déploiement GitHub Pages

## Configuration initiale

### 1. Créer le repository sur GitHub
1. Allez sur https://github.com/moktarace
2. Cliquez sur "New repository"
3. Nom : `ludi-crpe`
4. Rendez-le public
5. **Ne cochez pas** "Initialize with README" (nous avons déjà un README)

### 2. Pousser le code

```bash
cd c:\git_clones\ludi\ludi-crpe

# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎉 Initial commit - MathLingo PWA"

# Ajouter le remote
git remote add origin https://github.com/moktarace/ludi-crpe.git

# Renommer la branche en main
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

### 3. Configurer GitHub Pages

1. Allez sur https://github.com/moktarace/ludi-crpe/settings/pages
2. Dans **Source**, sélectionnez : `GitHub Actions`
3. Sauvegardez

C'est tout ! Le workflow GitHub Actions se déclenche automatiquement.

## Vérifier le déploiement

1. Allez dans l'onglet **Actions** de votre repository
2. Vous verrez le workflow "Deploy to GitHub Pages" en cours
3. Une fois terminé (🟢 vert), votre site sera accessible sur :
   **https://moktarace.github.io/ludi-crpe/**

## Mises à jour futures

Pour mettre à jour l'application :

```bash
# Faire vos modifications
# ...

# Commit et push
git add .
git commit -m "✨ Description de vos changements"
git push

# Le déploiement se fait automatiquement !
```

## Scripts disponibles

```bash
# Développement local
npm start                # Lance sur http://localhost:4200

# Build de production
npm run build:prod       # Build avec base-href configurée

# Build standard
npm run build            # Build sans base-href
```

## Troubleshooting

### Le site ne se charge pas
- Vérifiez que le workflow GitHub Actions s'est terminé avec succès
- Attendez 2-3 minutes après le déploiement
- Videz le cache du navigateur (Ctrl+F5)

### Les routes ne fonctionnent pas
- Le fichier `404.html` est configuré pour gérer les routes Angular
- Vérifiez qu'il est bien dans `dist/mathlingo/404.html` après le build

### Les styles ne s'appliquent pas
- Vérifiez le `baseHref` dans `angular.json` : `/ludi-crpe/`
- Vérifiez que le workflow utilise la même base-href

## Structure du projet

```
ludi-crpe/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # Workflow de déploiement
│   └── copilot-instructions.md # Instructions Copilot
├── src/                        # Code source Angular
├── angular.json                # Configuration Angular
├── package.json                # Dépendances npm
└── README.md                   # Documentation
```

## Notes importantes

- ✅ Le dossier `mathlingo/` est ignoré par git
- ✅ Le `node_modules/` n'est pas versionné
- ✅ Le `dist/` n'est pas versionné (build à chaque déploiement)
- ✅ Le Service Worker est activé en production
- ✅ PWA installable depuis le navigateur

---

**Votre app est prête à être déployée ! 🚀**
