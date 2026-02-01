# Checklist Maintenance - Bible Chantée

## Procédures de Maintenance Standard

### Ajouter une Nouvelle Langue

#### Étape 1: Préparation Audio
```bash
# 1. Créer dossier local
G:\Mon Drive\01 BibleChantee\Suno_Output\{LANG}\

# 2. Organiser par livres (66 dossiers)
{LANG}/
  ├── 01_GEN/
  ├── 02_EXO/
  ├── ...
  └── 66_REV/

# 3. Générer 1,189 fichiers MP3
# Format: {CODE}_{CHAPTER}_{LANG}.mp3
# Exemple: 01_GEN_001_AR.mp3
```

#### Étape 2: Upload vers R2
```bash
# Utiliser AWS CLI ou script Python
# Destination: bible-chantee-audio/{LANG}/
# Structure plate (pas de sous-dossiers)

# Exemple avec script:
python upload-to-r2.py --lang {LANG} --source "G:\Mon Drive\01 BibleChantee\Suno_Output\{LANG}\"
```

#### Étape 3: Créer Fichiers de Configuration

**A. Créer audio-urls-{lang}.js**
```javascript
// Fichier: audio-urls-{lang}.js (racine du projet)

const audioUrls = {
  "01_GEN_001": "https://audio.biblechantee.com/{LANG}/01_GEN_001_{LANG}.mp3",
  "01_GEN_002": "https://audio.biblechantee.com/{LANG}/01_GEN_002_{LANG}.mp3",
  // ... 1,189 chapitres
};
```

**B. Créer lyrics-data-{lang}.js**
```javascript
// Fichier: lyrics-data-{lang}.js (racine du projet)

const lyricsData = {
  "01_GEN": {
    "001": "[Verse 1]\nTexte du chapitre...",
    "002": "[Verse 1]\nTexte du chapitre...",
    // ... tous les chapitres du livre
  },
  "02_EXO": {
    // ... chapitres d'Exode
  },
  // ... 66 livres
};
```

#### Étape 4: Intégrer au Site

**Modifier lecteur.html:**
```html
<!-- Ajouter option dans le sélecteur de langue -->
<select id="language-selector">
  <option value="fr">Français</option>
  <option value="en">English</option>
  <!-- AJOUTER ICI -->
  <option value="{lang}">{Nom de la langue}</option>
</select>

<!-- Charger les fichiers JS -->
<script src="audio-urls-{lang}.js"></script>
<script src="lyrics-data-{lang}.js"></script>
```

#### Étape 5: Tests
- [ ] Vérifier chargement de la langue dans le sélecteur
- [ ] Tester lecture audio (5 chapitres aléatoires)
- [ ] Vérifier affichage des paroles
- [ ] Tester navigation entre chapitres
- [ ] Valider sur mobile et desktop

---

### Corriger un Chapitre

#### Cas 1: Audio Uniquement (paroles inchangées)

```bash
# 1. Modifier le MP3
# Éditer: G:\Mon Drive\01 BibleChantee\Suno_Output\{LANG}\{CODE}\{CODE}_{CHAPTER}_{LANG}.mp3

# 2. Upload vers R2 (écrase l'ancien)
python upload-to-r2.py --file "{CODE}_{CHAPTER}_{LANG}.mp3" --lang {LANG}

# 3. Vérifier sur le site (peut nécessiter vidage cache)
# Ouvrir: https://biblechantee.com/lecteur.html
# Charger le chapitre modifié
# Vérifier lecture audio
```

#### Cas 2: Paroles Uniquement (audio inchangé)

```javascript
// 1. Modifier lyrics-data-{lang}.js
const lyricsData = {
  "{CODE}": {
    "{CHAPTER}": "[Verse 1]\nNouveau texte corrigé...",
    // ...
  }
};

// 2. Commit et push
git add lyrics-data-{lang}.js
git commit -m "Fix lyrics: {BOOK} {CHAPTER} ({LANG})"
git push

// 3. Déploiement automatique via Netlify
// 4. Vérifier sur le site (2-3 minutes après push)
```

#### Cas 3: Audio ET Paroles

Combiner les deux procédures ci-dessus:
1. Modifier et uploader MP3 vers R2
2. Modifier lyrics-data-{lang}.js
3. Commit et push
4. Tester sur site

---

### Ajouter un Nouveau Chapitre

```bash
# 1. Générer audio
# Créer: {CODE}_{CHAPTER}_{LANG}.mp3
# Placer: G:\Mon Drive\01 BibleChantee\Suno_Output\{LANG}\{CODE}\

# 2. Upload vers R2
python upload-to-r2.py --file "{CODE}_{CHAPTER}_{LANG}.mp3" --lang {LANG}

# 3. Ajouter URL audio
# Éditer: audio-urls-{lang}.js
const audioUrls = {
  // ... chapitres existants
  "{CODE}_{CHAPTER}": "https://audio.biblechantee.com/{LANG}/{CODE}_{CHAPTER}_{LANG}.mp3",
};

# 4. Ajouter paroles
# Éditer: lyrics-data-{lang}.js
const lyricsData = {
  "{CODE}": {
    // ... chapitres existants
    "{CHAPTER}": "[Verse 1]\nParoles du nouveau chapitre...",
  }
};

# 5. Vérifier chapter-titles.js (déjà à jour normalement)
# Si nouveau livre: ajouter dans js/chapter-titles.js

# 6. Commit et test
git add audio-urls-{lang}.js lyrics-data-{lang}.js
git commit -m "Add chapter: {BOOK} {CHAPTER} ({LANG})"
git push
```

---

### Ajouter un Nouveau Livre

```bash
# 1. Vérifier le code livre
# Consulter: js/chapter-titles.js pour la liste complète
# Nouveaux codes: 67_XXX, 68_YYY, etc.

# 2. Générer tous les chapitres audio
# Créer: G:\Mon Drive\01 BibleChantee\Suno_Output\{LANG}\{CODE}\
# Générer: {CODE}_001_{LANG}.mp3 à {CODE}_{N}_{LANG}.mp3

# 3. Upload vers R2
python upload-to-r2.py --book {CODE} --lang {LANG}

# 4. Mettre à jour js/chapter-titles.js
const chapterTitles = {
  // ... livres existants
  "{CODE}": {
    name: "{Nom du livre}",
    chapters: {N}  // nombre de chapitres
  }
};

# 5. Ajouter URLs audio (audio-urls-{lang}.js)
# Ajouter N entrées pour tous les chapitres

# 6. Ajouter paroles (lyrics-data-{lang}.js)
const lyricsData = {
  // ... livres existants
  "{CODE}": {
    "001": "[Verse 1]...",
    "002": "[Verse 1]...",
    // ... N chapitres
  }
};

# 7. Test complet du nouveau livre
```

---

### Migrer Fichiers Archive.org vers R2

```bash
# 1. Identifier les fichiers encore sur Archive.org
# Chercher dans audio-urls-{lang}.js les URLs contenant "archive.org"

# 2. Télécharger depuis Archive.org
wget "https://archive.org/download/bible-chantee/{LANG}/{FILE}.mp3"

# 3. Upload vers R2
python upload-to-r2.py --file "{FILE}.mp3" --lang {LANG}

# 4. Mettre à jour audio-urls-{lang}.js
# Remplacer:
"01_GEN_001": "https://archive.org/download/bible-chantee/FR/01_GEN_001_FR.mp3",
# Par:
"01_GEN_001": "https://audio.biblechantee.com/FR/01_GEN_001_FR.mp3",

# 5. Commit et test
git add audio-urls-{lang}.js
git commit -m "Migrate {FILE} from Archive.org to R2"
git push
```

---

### Créer Backup des Paroles

```bash
# Backup manuel des paroles FR (exemple)
# Les paroles sont déjà dans lyrics-data-fr.js (source de vérité)

# Backup supplémentaire recommandé:
# 1. Copier lyrics-data-{lang}.js
cp lyrics-data-fr.js "backups/lyrics-data-fr_$(date +%Y%m%d).js.backup"

# 2. Ou utiliser Git (backup automatique)
git log --oneline lyrics-data-fr.js  # voir historique

# 3. Pour restaurer une version antérieure:
git checkout {COMMIT_HASH} -- lyrics-data-fr.js
```

---

## Avant Tout Déploiement

### Checklist Pré-Déploiement

#### Vérifications Obligatoires
- [ ] **js/chapter-titles.js** chargé correctement
- [ ] Aucune erreur dans la console navigateur (F12)
- [ ] Sélecteur de langue fonctionne
- [ ] Sélecteur de livre fonctionne
- [ ] Sélecteur de chapitre fonctionne

#### Tests Audio (5 chapitres aléatoires)
- [ ] Genèse 1 (FR) - Audio + Paroles
- [ ] Psaumes 23 (EN) - Audio + Paroles
- [ ] Jean 3 (PT) - Audio + Paroles
- [ ] Romains 8 (ES) - Audio + Paroles
- [ ] Apocalypse 21 (DE) - Audio + Paroles

#### Tests Navigation
- [ ] Bouton "Chapitre précédent" fonctionne
- [ ] Bouton "Chapitre suivant" fonctionne
- [ ] Changement de livre met à jour chapitres
- [ ] Changement de langue charge bonnes données

#### Tests Multi-Plateformes
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Chrome Mobile)
- [ ] Tablette

#### Validation Finale
- [ ] URLs R2 accessibles (pas de 404)
- [ ] Temps de chargement < 3 secondes
- [ ] Pas de latence audio
- [ ] Paroles synchronisées avec audio

---

## Outils et Scripts

### Scripts Disponibles

#### upload-to-r2.py
```bash
# Upload fichier unique
python upload-to-r2.py --file "01_GEN_001_FR.mp3" --lang FR

# Upload livre complet
python upload-to-r2.py --book 01_GEN --lang FR

# Upload langue complète
python upload-to-r2.py --lang FR

# Vérifier progression
python upload-to-r2.py --check --lang FR
```

#### generate-audio-urls.py
```bash
# Générer audio-urls-{lang}.js automatiquement
python generate-audio-urls.py --lang FR --output audio-urls-fr.js

# Avec URLs R2
python generate-audio-urls.py --lang FR --source r2

# Avec URLs Archive.org (legacy)
python generate-audio-urls.py --lang FR --source archive
```

#### validate-data.py
```bash
# Valider structure lyrics-data
python validate-data.py --file lyrics-data-fr.js

# Valider tous les fichiers d'une langue
python validate-data.py --lang FR

# Vérifier cohérence audio-urls vs lyrics-data
python validate-data.py --cross-check FR
```

---

## Résolution de Problèmes

### Audio ne joue pas

**Symptômes:** Clic sur play, rien ne se passe

**Solutions:**
1. Vérifier console navigateur (F12) pour erreurs
2. Vérifier URL audio dans audio-urls-{lang}.js
3. Tester URL directement dans navigateur
4. Vérifier CORS headers (R2)
5. Vider cache navigateur

### Paroles ne s'affichent pas

**Symptômes:** Audio joue mais pas de texte

**Solutions:**
1. Vérifier lyrics-data-{lang}.js chargé
2. Vérifier structure JSON/JS valide
3. Vérifier clé chapitre correspond à format "{CODE}_{CHAPTER}"
4. Console navigateur pour erreurs JavaScript

### Changement de langue ne fonctionne pas

**Symptômes:** Sélection langue ne change rien

**Solutions:**
1. Vérifier audio-urls-{lang}.js existe
2. Vérifier lyrics-data-{lang}.js existe
3. Vérifier chargement dans HTML
4. Vérifier fonction JavaScript `changeLanguage()`

### Chapitre manquant

**Symptômes:** Liste de chapitres incomplète

**Solutions:**
1. Vérifier js/chapter-titles.js pour nombre de chapitres
2. Vérifier audio-urls-{lang}.js pour ce chapitre
3. Vérifier lyrics-data-{lang}.js pour ce chapitre
4. Ajouter chapitre manquant (voir procédure ci-dessus)

---

## Calendrier de Maintenance

### Quotidien
- Vérifier site accessible
- Vérifier temps de chargement

### Hebdomadaire
- Tester 5 chapitres aléatoires
- Vérifier analytics pour erreurs utilisateurs

### Mensuel
- Backup complet lyrics-data-{lang}.js
- Vérifier progression migration R2
- Mise à jour documentation si changements

### Trimestriel
- Audit complet toutes langues
- Nettoyage fichiers obsolètes
- Optimisation performance

---

## Contacts et Ressources

### Documentation
- **ARCHITECTURE.md** - Vue d'ensemble structure projet
- **MAINTENANCE.md** - Ce fichier (procédures maintenance)
- **README.md** - Information générale projet

### Outils Externes
- **Cloudflare R2** - Stockage audio
- **Netlify** - Hébergement site
- **Archive.org** - Stockage audio legacy (en cours migration)

### Support Technique
- Console Cloudflare: https://dash.cloudflare.com
- Console Netlify: https://app.netlify.com
- Repository Git: (ajouter URL si applicable)

---

**Dernière mise à jour:** 2026-02-01
**Version:** 2.0
**Maintenu par:** Équipe Bible Chantée
