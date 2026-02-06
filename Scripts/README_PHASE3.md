# Scripts Phase 3 - Migration R2

Documentation des scripts créés pour la Phase 3 de migration complète vers Cloudflare R2.

## Vue d'ensemble

La Phase 3 consiste à:
1. Analyser toutes les URLs actuelles
2. Vérifier la disponibilité sur R2
3. Migrer les URLs restantes (confessions) vers R2
4. Tester toutes les URLs

## Scripts Créés

### 1. Analyse des URLs

**Fichier**: `phase3_analyse_urls.py`

**Description**: Scanner tous les fichiers `audio-urls-*.js` et analyser les URLs par domaine.

**Usage**:
```bash
cd C:\ScriptBible\bible-chantee
python Scripts/phase3_analyse_urls.py
```

**Génère**:
- `PHASE3_URLS_ANALYSE.json` - Rapport JSON détaillé
- `PHASE3_URLS_ANALYSE.md` - Rapport Markdown lisible

**Résultat**: Statistiques complètes par domaine et par fichier.

---

### 2. Vérification R2 Confessions

**Fichier**: `phase3_check_r2_confessions.py`

**Description**: Vérifier si les 30 fichiers confessions (FR, PT, TL) existent sur R2 via requêtes HEAD.

**Usage**:
```bash
cd C:\ScriptBible\bible-chantee
python Scripts/phase3_check_r2_confessions.py
```

**Génère**:
- `PHASE3_R2_COVERAGE.json` - Rapport de couverture R2

**Résultat**: Liste des fichiers existants/manquants sur R2.

---

### 3. Migration URLs vers R2

**Fichier**: `phase3_migrate_urls_to_r2.py`

**Description**: Migrer toutes les URLs Archive.org vers R2 dans les fichiers JS.

**IMPORTANT**: Crée automatiquement des backups avant modification.

**Usage**:
```bash
cd C:\ScriptBible\bible-chantee
python Scripts/phase3_migrate_urls_to_r2.py
```

**Modifie**:
- `audio-urls-confessions-fr.js`
- `audio-urls-confessions-pt.js`
- `audio-urls-confessions-tl.js`

**Backups créés dans**: `backups/urls_YYYYMMDD_HHMMSS/`

---

## Fichiers de Documentation Créés

### PHASE3_URLS_ANALYSE.md
Rapport d'analyse des URLs par domaine et fichier.

### PHASE3_R2_COVERAGE.json
Rapport de vérification de la disponibilité des fichiers sur R2.

### FICHIERS_A_UPLOADER_R2.md
Liste détaillée des 30 fichiers confessions à uploader vers R2 avec:
- Noms sources
- Chemins destination R2
- Commandes d'upload

### TEST_URLS.html
Page de test interactive pour vérifier les URLs:
- Test échantillon (10 URLs par fichier)
- Test confessions uniquement (30 URLs)
- Test complet (7214 URLs)

---

## Workflow Phase 3

### Étape 1: Analyse initiale
```bash
python Scripts/phase3_analyse_urls.py
```
Résultat attendu: ~99.6% URLs déjà sur R2, 30 URLs sur Archive.org

### Étape 2: Vérifier R2
```bash
python Scripts/phase3_check_r2_confessions.py
```
Résultat attendu: 30 fichiers manquants sur R2

### Étape 3: Upload vers R2
**MANUEL** - Voir `FICHIERS_A_UPLOADER_R2.md` pour les instructions

Uploader les 30 fichiers MP3 vers:
- `confessions/FR_01_Joie.mp3`
- `confessions/PT_01_Alegria.mp3`
- `confessions/TL_01_Kagalakan.mp3`
- etc.

### Étape 4: Re-vérifier après upload
```bash
python Scripts/phase3_check_r2_confessions.py
```
Résultat attendu: 30/30 fichiers existants sur R2

### Étape 5: Migrer les URLs
```bash
python Scripts/phase3_migrate_urls_to_r2.py
```
Résultat: 30 URLs migrées, backups créés

### Étape 6: Tester
Ouvrir `TEST_URLS.html` dans le navigateur et tester:
1. Confessions uniquement (30 URLs)
2. Échantillon complet (10 URLs par fichier)
3. Si tout OK: test complet (7214 URLs)

---

## Configuration R2

**Base URL**: `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/`

**Structure**:
```
bible-chantee-audio/
├── FR/ (1189 chapitres)
├── EN/ (1189 chapitres)
├── PT/ (1189 chapitres)
├── ES/ (1189 chapitres)
├── DE/ (1189 chapitres)
├── IT/ (1189 chapitres)
├── confessions/
│   ├── FR_*.mp3 (10 fichiers)
│   ├── PT_*.mp3 (10 fichiers)
│   └── TL_*.mp3 (10 fichiers)
└── prayers/
    ├── PT_*.mp3 (5 fichiers)
    └── TL_*.mp3 (6 fichiers)
```

---

## Sécurité et Backups

### Backups automatiques
Tous les scripts de migration créent des backups automatiquement:
- Dossier: `backups/urls_YYYYMMDD_HHMMSS/`
- Contenu: Copies des fichiers JS avant modification

### Restaurer un backup
```bash
# Copier depuis le dossier backup vers la racine
cp backups/urls_20260201_143022/audio-urls-confessions-fr.js ./
```

### Pas de suppressions
IMPORTANT: Les scripts ne suppriment JAMAIS de fichiers:
- Pas de suppression sur Archive.org
- Pas de suppression de fichiers locaux
- Uniquement des modifications d'URLs avec backups

---

## Validation Finale

Après avoir complété toutes les étapes:

- [ ] Analyse effectuée (`PHASE3_URLS_ANALYSE.md` créé)
- [ ] Vérification R2 effectuée (`PHASE3_R2_COVERAGE.json` créé)
- [ ] 30 fichiers uploadés vers R2
- [ ] Re-vérification: 30/30 fichiers sur R2
- [ ] URLs migrées dans les 3 fichiers JS
- [ ] Backups créés dans `backups/`
- [ ] Tests effectués avec `TEST_URLS.html`
- [ ] 100% URLs pointent vers R2

---

## Dépannage

### Erreur: "Fichier non trouvé"
Vérifier que vous êtes dans le bon répertoire:
```bash
cd C:\ScriptBible\bible-chantee
```

### Erreur: "UnicodeEncodeError"
Scripts corrigés pour Windows. Si l'erreur persiste, vérifier l'encodage UTF-8.

### URLs toujours sur Archive.org après migration
Vérifier:
1. Le script s'est bien exécuté sans erreur
2. Les backups ont été créés
3. Les fichiers JS ont été modifiés (date de modification)
4. Rafraîchir le cache du navigateur (Ctrl+F5)

### Tests échouent dans TEST_URLS.html
1. Vérifier que les fichiers existent sur R2
2. Vérifier les URLs dans les fichiers JS
3. Vérifier la connexion internet
4. Attendre quelques minutes (propagation CDN)

---

## Voir aussi

- `README.md` - Documentation générale Scripts
- `ARCHITECTURE.md` - Architecture du projet
- `PHASE3_FINAL.md` - Rapport final Phase 3
- `FICHIERS_A_UPLOADER_R2.md` - Instructions upload
