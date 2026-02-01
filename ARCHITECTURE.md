# Architecture Bible Chantée

## Structure Production

### Dossiers Actifs

#### Bibles par Langue
- **FR/** = Bible française production (1 fichier HTML seulement)
- **EN/** = Bible anglaise
- **PT/** = Bible portugaise
- **ES/** = Bible espagnole
- **DE/** = Bible allemande
- **IT/** = Bible italienne
- **TL/** = Bible tagalog

#### Contenus Spéciaux
- **prayers/** = Prières
  - PT/ = Prières en portugais
  - TL/ = Prières en tagalog
- **confessions/** = Confessions de foi (13 langues)
  - AR, DE, EN, ES, FR, HI, IT, KO, PT, RU, TL, ZH

#### Données et Scripts
- **js/** = Scripts JavaScript production
  - chapter-titles.js = Titres des chapitres (SEUL FICHIER ACTIF)
  - chapter-titles-loader.js = Chargeur de titres
  - player.js = Lecteur audio
  - audio-utils.js = Utilitaires audio
- **lyrics/** = Données de paroles par langue
  - FR/ = Structure par livre/chapitre (1,189 fichiers .txt)
  - FR.json.backup = Sauvegarde JSON des paroles FR
- **data/** = Données structurées
  - lyrics/FR/ = Paroles françaises
- **karaoke/** = Fonctionnalité karaoké
  - FR/ = Karaoké français

### Dossiers Archives (NE PAS UTILISER)

#### Anciennes Versions
- **FR_V1/** = Ancienne version FR (obsolète)
- **FR_V2/** = Version intermédiaire FR (obsolète)
- **_archive/** = Versions archivées (créé Phase 2)
  - old-versions/chapter-titles/ = 4 fichiers obsolètes
  - old-versions/audio-urls/ = 1 fichier backup
  - old-versions/lyrics-data/ = 2 fichiers backup
  - old-versions/titles/ = 6 fichiers .bak
  - old-versions/lyrics-archive/ = 2 fichiers .bak
  - backup-originals/lyrics-txt/ = 164 fichiers .txt FR (backup)
  - deprecated/FR_V1/ = (prévu pour migration future)
  - deprecated/FR_V2/ = (prévu pour migration future)

### Fichiers JS Production (Racine)

#### URLs Audio par Langue
- audio-urls-fr.js = URLs audio français
- audio-urls-en.js = URLs audio anglais
- audio-urls-pt.js = URLs audio portugais
- audio-urls-es.js = URLs audio espagnol
- audio-urls-de.js = URLs audio allemand
- audio-urls-it.js = URLs audio italien
- audio-urls-tl.js = URLs audio tagalog (VIDE - prévu)

#### URLs Audio Contenus Spéciaux
- audio-urls-confessions-fr.js = Confessions français
- audio-urls-confessions-pt.js = Confessions portugais
- audio-urls-confessions-tl.js = Confessions tagalog
- audio-urls-promesses-fr.js = Promesses français
- audio-urls-promessas-pt.js = Promesses portugais

#### Langues Préparées (JS vides)
- audio-urls-ar.js = Arabe (vide - futur)
- audio-urls-hi.js = Hindi (vide - futur)
- audio-urls-ko.js = Coréen (vide - futur)
- audio-urls-ru.js = Russe (vide - futur)
- audio-urls-zh.js = Chinois (vide - futur)

#### Données de Paroles par Langue
- lyrics-data-fr.js = Paroles français
- lyrics-data-en.js = Paroles anglais
- lyrics-data-pt.js = Paroles portugais
- lyrics-data-es.js = Paroles espagnol
- lyrics-data-de.js = Paroles allemand
- lyrics-data-it.js = Paroles italien
- lyrics-data-tl.js = Paroles tagalog

## Sources de Vérité

### Audio

#### Local (Drive Google)
```
G:\Mon Drive\01 BibleChantee\Suno_Output\{LANG}\
  ├── 01_GEN/
  │   ├── 01_GEN_001_{LANG}.mp3
  │   ├── 01_GEN_002_{LANG}.mp3
  │   └── ...
  ├── 02_EXO/
  └── ... (66 livres)
```

#### Cloud (Cloudflare R2)
```
R2: bible-chantee-audio/{LANG}/
  ├── 01_GEN_001_{LANG}.mp3
  ├── 01_GEN_002_{LANG}.mp3
  └── ... (1,189 fichiers par langue)
```

**Migration R2:**
- Statut: 99.6% complété (7,184 URLs sur R2)
- Restant: 30 fichiers (0.4%) sur Archive.org (confessions uniquement)
- Priorité: Migration finale Phase 3 en cours
- Voir: PHASE3_FINAL.md pour détails complets

### Paroles

#### Source de Vérité Site Web
- **Production:** lyrics-data-{lang}.js (fichiers JS chargés par le site)
- **Format:** Objet JavaScript avec structure hiérarchique
- **Utilisation:** Site web uniquement

#### Backup Local
- **Fichiers:** lyrics/FR/*.txt (164 fichiers organisés par livre/chapitre)
- **Format:** Texte brut, un fichier par chapitre
- **Backup:** Copie dans _archive/backup-originals/lyrics-txt/
- **Usage:** NE PAS utiliser directement sur le site (backup seulement)

## Nommage Standards

### Codes de Livres
- Format: {CODE}_{ABBREV}
- Exemples:
  - 01_GEN = Genèse
  - 09_1SAM = 1 Samuel
  - 10_2SAM = 2 Samuel
  - 22_SON = Cantique des Cantiques
  - 40_MAT = Matthieu
  - 66_REV = Apocalypse

### Fichiers MP3
- Format: {CODE}_{CHAPTER}_{LANG}.mp3
- Exemples:
  - 01_GEN_001_FR.mp3 = Genèse 1 en français
  - 40_MAT_001_EN.mp3 = Matthieu 1 en anglais
  - 22_SON_008_PT.mp3 = Cantique 8 en portugais

### Fichiers Lyrics
- **Production:** Intégrés dans lyrics-data-{lang}.js
- **Backup:** {CODE}_{BOOK}_{CHAPTER}_{LANG}.txt
- Exemple: 01_GEN_001_FR.txt

## Structure Données

### Chapter Titles (js/chapter-titles.js)
```javascript
const chapterTitles = {
  "01_GEN": {
    name: "Genèse",
    chapters: 50
  },
  "02_EXO": {
    name: "Exode",
    chapters: 40
  },
  // ... 66 livres
};
```

### Audio URLs (audio-urls-{lang}.js)
```javascript
const audioUrls = {
  "01_GEN_001": "https://audio.biblechantee.com/FR/01_GEN_001_FR.mp3",
  "01_GEN_002": "https://audio.biblechantee.com/FR/01_GEN_002_FR.mp3",
  // ... 1,189 chapitres
};
```

### Lyrics Data (lyrics-data-{lang}.js)
```javascript
const lyricsData = {
  "01_GEN": {
    "001": "[Verse 1]\nAu commencement...\n[Verse 2]\n...",
    "002": "[Verse 1]\nEt Dieu vit...",
    // ... tous les chapitres du livre
  },
  // ... 66 livres
};
```

## Migration R2 - Phase 3 (99.6% Complété)

### Objectif
Migrer tous les fichiers audio depuis Archive.org vers Cloudflare R2 pour:
- Meilleure performance (latence réduite ~50ms vs ~200ms)
- CDN unifié (une seule source)
- Réduction des coûts (~$0.33/mois pour 22GB)
- Fiabilité accrue (SLA 99.9% Cloudflare)

### Progression
- **Complété:** 7,184 URLs (99.6%)
- **Restant:** 30 fichiers (0.4%) - Confessions FR/PT/TL uniquement
- **Langues complètes sur R2:** FR, EN, PT, ES, DE, IT
- **À finaliser:** Confessions (30 fichiers MP3)
- **Langues futures:** TL, AR, HI, KO, RU, ZH (prêtes, fichiers vides)

### Structure R2 Finale
```
bible-chantee-audio/
├── FR/ (1,189 chapitres) ✅
├── EN/ (1,189 chapitres) ✅
├── PT/ (1,189 chapitres) ✅
├── ES/ (1,189 chapitres) ✅
├── DE/ (1,189 chapitres) ✅
├── IT/ (1,189 chapitres) ✅
├── confessions/
│   ├── FR_*.mp3 (10 fichiers) ⏳
│   ├── PT_*.mp3 (10 fichiers) ⏳
│   └── TL_*.mp3 (10 fichiers) ⏳
└── prayers/
    ├── PT_*.mp3 (5 fichiers) ✅
    └── TL_*.mp3 (6 fichiers) ✅
```

**Base URL R2:** `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/`

### Processus de Migration Phase 3
1. **Analyse:** `python Scripts/phase3_analyse_urls.py` (✅ fait)
2. **Vérification:** `python Scripts/phase3_check_r2_confessions.py` (✅ fait)
3. **Upload manuel:** 30 fichiers confessions vers R2 (⏳ à faire)
4. **Migration URLs:** `python Scripts/phase3_migrate_urls_to_r2.py` (⏳ après upload)
5. **Tests:** Ouvrir `TEST_URLS.html` dans navigateur (⏳ après migration)

### Fichiers à Migrer (30 total)
- **Confessions FR:** 10 fichiers (01_Joie.mp3 → FR_01_Joie.mp3, etc.)
- **Confessions PT:** 10 fichiers (01_Alegria.mp3 → PT_01_Alegria.mp3, etc.)
- **Confessions TL:** 10 fichiers (01_Kagalakan.mp3 → TL_01_Kagalakan.mp3, etc.)

Voir `FICHIERS_A_UPLOADER_R2.md` pour liste détaillée et commandes.

### Documentation Phase 3
- **PHASE3_FINAL.md** - Rapport complet Phase 3
- **PHASE3_URLS_ANALYSE.md** - Analyse détaillée des URLs
- **PHASE3_R2_COVERAGE.json** - Couverture R2 (vérification)
- **FICHIERS_A_UPLOADER_R2.md** - Liste uploads à faire
- **TEST_URLS.html** - Page de test interactive
- **Scripts/README_PHASE3.md** - Documentation scripts

### Scripts Phase 3
- **phase3_analyse_urls.py** - Analyser URLs par domaine
- **phase3_check_r2_confessions.py** - Vérifier disponibilité R2
- **phase3_migrate_urls_to_r2.py** - Migrer URLs (avec backups)

## Déploiement

### Site Principal
- **URL:** https://biblechantee.com
- **Hosting:** Netlify
- **CDN:** Cloudflare
- **Audio:** Cloudflare R2 (99.6%) + Archive.org (0.4% - confessions)

### Fichiers Essentiels au Déploiement
1. index.html (lecteur principal)
2. js/chapter-titles.js (titres - CRITIQUE)
3. audio-urls-{lang}.js (URLs audio par langue)
4. lyrics-data-{lang}.js (paroles par langue)
5. js/player.js (lecteur audio)

### Checklist Pré-Déploiement
- [ ] js/chapter-titles.js chargé et valide
- [ ] Tester 5 chapitres aléatoires (lecture audio + paroles)
- [ ] Vérifier console navigateur (0 erreurs)
- [ ] Valider toutes les langues actives
- [ ] Tester sur mobile et desktop

## Bonnes Pratiques

### Modification de Code
1. Ne JAMAIS modifier directement en production
2. Toujours créer un backup avant modification (.backup)
3. Tester localement avant déploiement
4. Utiliser git pour version control

### Ajout de Contenu
1. Nouvel audio: Upload vers R2 d'abord
2. Nouvelles paroles: Ajouter dans lyrics-data-{lang}.js
3. Nouveau livre: Mettre à jour chapter-titles.js
4. Nouvelle langue: Suivre MAINTENANCE.md

### Archivage
1. Fichiers obsolètes → _archive/old-versions/
2. Backups importants → _archive/backup-originals/
3. Versions dépréciées → _archive/deprecated/
4. Ne JAMAIS supprimer, toujours archiver

## Technologies Utilisées

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla, pas de framework)
- Web Audio API

### Backend / Infrastructure
- Cloudflare R2 (stockage audio)
- Netlify (hébergement site)
- Archive.org (stockage audio legacy - en cours de migration)

### Développement
- Git (version control)
- Python (scripts maintenance)
- Node.js (outils build)

## Contact & Support

### Maintenance
Voir MAINTENANCE.md pour procédures détaillées

### Documentation
- ARCHITECTURE.md (ce fichier) = Vue d'ensemble structure
- MAINTENANCE.md = Procédures maintenance
- PHASE2_RAPPORT_NETTOYAGE.md = Rapport nettoyage Phase 2
- PHASE3_FINAL.md = Rapport migration R2 Phase 3
- PHASE3_URLS_ANALYSE.md = Analyse URLs Phase 3
- FICHIERS_A_UPLOADER_R2.md = Liste uploads R2 restants

---

**Dernière mise à jour:** 2026-02-01 (Phase 3 - Migration R2 Finale)
**Version:** 3.0
**Statut:** Production active (99.6% migré vers R2, 30 fichiers restants)
