# PHASE 3 - CHECKLIST COMPLÈTE

Date: 2026-02-01
Objectif: Migration finale vers R2 (100% URLs)

---

## Vue d'ensemble

- ✅ Fichiers créés: 13 fichiers
- ✅ Scripts Python: 3 scripts
- ✅ Documentation: 10 documents
- ⏳ Actions manuelles: 2 actions
- ⏳ Validation finale: 1 test

---

## ÉTAPE 1: Fichiers Créés ✅

### Scripts Python (Scripts/)

1. ✅ **phase3_analyse_urls.py**
   - Analyse toutes les URLs par domaine
   - Génère rapports JSON et Markdown
   - Résultat: 7,214 URLs scannées (99.6% R2, 0.4% Archive)

2. ✅ **phase3_check_r2_confessions.py**
   - Vérifie disponibilité confessions sur R2
   - Test avec requêtes HEAD (sans télécharger)
   - Résultat: 0/30 fichiers trouvés sur R2

3. ✅ **phase3_migrate_urls_to_r2.py**
   - Migre URLs Archive.org → R2
   - Crée backups automatiques
   - Modifie 3 fichiers JS (30 URLs)

### Documentation (Racine)

4. ✅ **PHASE3_URLS_ANALYSE.json**
   - Rapport JSON détaillé (7,214 URLs analysées)
   - Structure par fichier et domaine

5. ✅ **PHASE3_URLS_ANALYSE.md**
   - Rapport Markdown lisible
   - Tableaux statistiques par fichier

6. ✅ **PHASE3_R2_COVERAGE.json**
   - Rapport vérification R2
   - Liste 30 fichiers manquants

7. ✅ **FICHIERS_A_UPLOADER_R2.md**
   - Liste détaillée 30 fichiers
   - Instructions upload
   - Commandes Wrangler/Rclone

8. ✅ **TEST_URLS.html**
   - Page test interactive
   - 3 modes: échantillon, confessions, tout
   - Interface visuelle avec stats

9. ✅ **PHASE3_FINAL.md**
   - Rapport complet Phase 3
   - Statistiques avant/après
   - Procédure complète

10. ✅ **PHASE3_CHECKLIST.md** (ce fichier)
    - Checklist de validation
    - Actions à effectuer

### Documentation Scripts

11. ✅ **Scripts/README_PHASE3.md**
    - Documentation scripts Phase 3
    - Workflow complet
    - Dépannage

### Fichiers Archive Google Drive

12. ✅ **README_ARCHIVE_FR_V1.txt**
    - À placer dans _ARCHIVE_FR_V1/ sur Google Drive
    - Instructions archivage

13. ✅ **README_ARCHIVE_FR_V2.txt**
    - À placer dans _ARCHIVE_FR_V2/ sur Google Drive
    - Instructions archivage

### Modifications

14. ✅ **ARCHITECTURE.md** (mis à jour)
    - Section Migration R2 actualisée
    - Statut: 99.6% complété
    - Documentation Phase 3 ajoutée

---

## ÉTAPE 2: Actions Google Drive ⏳

### Action 1: Renommer FR_V1 et FR_V2

**Localisation**: `G:\Mon Drive\01 BibleChantee\Suno_Output\`

**Actions**:

1. Renommer dossiers:
   ```
   FR_V1/ → _ARCHIVE_FR_V1/
   FR_V2/ → _ARCHIVE_FR_V2/
   ```

2. Copier les fichiers README dans chaque dossier:
   ```
   Copier: C:\ScriptBible\bible-chantee\README_ARCHIVE_FR_V1.txt
   Vers: G:\Mon Drive\01 BibleChantee\Suno_Output\_ARCHIVE_FR_V1\README_ARCHIVE.txt

   Copier: C:\ScriptBible\bible-chantee\README_ARCHIVE_FR_V2.txt
   Vers: G:\Mon Drive\01 BibleChantee\Suno_Output\_ARCHIVE_FR_V2\README_ARCHIVE.txt
   ```

**Résultat attendu**:
- FR_V1 n'est plus visible
- FR_V2 n'est plus visible
- _ARCHIVE_FR_V1/ existe avec README
- _ARCHIVE_FR_V2/ existe avec README

**Validation**:
- [ ] _ARCHIVE_FR_V1/ créé
- [ ] _ARCHIVE_FR_V2/ créé
- [ ] README présents dans chaque dossier
- [ ] FR/ reste inchangé (production active)

---

## ÉTAPE 3: Upload Confessions vers R2 ⏳

### Prérequis

**Localisation fichiers sources**:

Option A - Google Drive:
```
G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\
├── FR\
│   ├── 01_Joie.mp3
│   ├── 02_Gueri.mp3
│   └── ... (10 fichiers)
├── PT\
│   ├── 01_Alegria.mp3
│   └── ... (10 fichiers)
└── TL\
    ├── 01_Kagalakan.mp3
    └── ... (10 fichiers)
```

Option B - Archive.org (télécharger d'abord):
```
https://archive.org/download/bible-chantee-confessions-fr/
https://archive.org/download/bible-chantee-confessions-pt/
https://archive.org/download/bible-chantee-confessions-tl/
```

### Action 2: Upload vers R2

**Méthode recommandée: Wrangler CLI**

```bash
# Installer Wrangler si nécessaire
npm install -g wrangler

# Login
wrangler login

# Upload FR (10 fichiers)
wrangler r2 object put bible-chantee-audio/confessions/FR_01_Joie.mp3 --file "path/to/01_Joie.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_02_Gueri.mp3 --file "path/to/02_Gueri.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_03_Sante.mp3 --file "path/to/03_Sante.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_04_Vainqueur.mp3 --file "path/to/04_Vainqueur.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_05_Prospere.mp3 --file "path/to/05_Prospere.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_06_Reconnaissant.mp3 --file "path/to/06_Reconnaissant.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_07_Heureux.mp3 --file "path/to/07_Heureux.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_08_Beni.mp3 --file "path/to/08_Beni.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_09_Amen.mp3 --file "path/to/09_Amen.mp3"
wrangler r2 object put bible-chantee-audio/confessions/FR_10_Shalom.mp3 --file "path/to/10_Shalom.mp3"

# Upload PT (10 fichiers)
wrangler r2 object put bible-chantee-audio/confessions/PT_01_Alegria.mp3 --file "path/to/01_Alegria.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_02_Curado.mp3 --file "path/to/02_Curado.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_03_Saude.mp3 --file "path/to/03_Saude.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_04_Vencedor.mp3 --file "path/to/04_Vencedor.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_05_Prospero.mp3 --file "path/to/05_Prospero.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_06_Grato.mp3 --file "path/to/06_Grato.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_07_Feliz.mp3 --file "path/to/07_Feliz.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_08_Abencoado.mp3 --file "path/to/08_Abencoado.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_09_Amem.mp3 --file "path/to/09_Amem.mp3"
wrangler r2 object put bible-chantee-audio/confessions/PT_10_Shalom.mp3 --file "path/to/10_Shalom.mp3"

# Upload TL (10 fichiers)
wrangler r2 object put bible-chantee-audio/confessions/TL_01_Kagalakan.mp3 --file "path/to/01_Kagalakan.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_02_Kagalingan.mp3 --file "path/to/02_Kagalingan.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_03_Kalusugan.mp3 --file "path/to/03_Kalusugan.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_04_Tagumpay.mp3 --file "path/to/04_Tagumpay.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_05_Kasaganaan.mp3 --file "path/to/05_Kasaganaan.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_06_Pasasalamat.mp3 --file "path/to/06_Pasasalamat.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_07_Kaligayahan.mp3 --file "path/to/07_Kaligayahan.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_08_Pagpapala.mp3 --file "path/to/08_Pagpapala.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_09_Amen.mp3 --file "path/to/09_Amen.mp3"
wrangler r2 object put bible-chantee-audio/confessions/TL_10_Shalom.mp3 --file "path/to/10_Shalom.mp3"
```

**Validation upload**:
```bash
cd C:\ScriptBible\bible-chantee
python Scripts/phase3_check_r2_confessions.py
```

Résultat attendu: 30/30 fichiers [OK]

**Checklist**:
- [ ] 10 fichiers FR uploadés
- [ ] 10 fichiers PT uploadés
- [ ] 10 fichiers TL uploadés
- [ ] Vérification script: 30/30 OK

---

## ÉTAPE 4: Migration URLs ⏳

**Après upload R2 réussi**, exécuter:

```bash
cd C:\ScriptBible\bible-chantee
python Scripts/phase3_migrate_urls_to_r2.py
```

**Actions du script**:
1. Crée backup dans `backups/urls_YYYYMMDD_HHMMSS/`
2. Modifie `audio-urls-confessions-fr.js` (10 URLs)
3. Modifie `audio-urls-confessions-pt.js` (10 URLs)
4. Modifie `audio-urls-confessions-tl.js` (10 URLs)
5. Total: 30 URLs migrées Archive.org → R2

**Résultat attendu**:
```
[PROCESSING] audio-urls-confessions-fr.js
  [BACKUP] backups/urls_20260201_XXXXXX/audio-urls-confessions-fr.js
  [REPLACED] 01_Joie.mp3
  [REPLACED] 02_Gueri.mp3
  ...
  [SAVED] 10 URLs migrées vers R2

[PROCESSING] audio-urls-confessions-pt.js
  [BACKUP] ...
  [SAVED] 10 URLs migrées vers R2

[PROCESSING] audio-urls-confessions-tl.js
  [BACKUP] ...
  [SAVED] 10 URLs migrées vers R2

Total URLs migrées: 30
```

**Validation**:
- [ ] Script exécuté sans erreur
- [ ] 3 backups créés
- [ ] 3 fichiers JS modifiés
- [ ] 30 URLs migrées

**En cas d'erreur**:
```bash
# Restaurer depuis backup
cp backups/urls_YYYYMMDD_HHMMSS/audio-urls-confessions-fr.js ./
cp backups/urls_YYYYMMDD_HHMMSS/audio-urls-confessions-pt.js ./
cp backups/urls_YYYYMMDD_HHMMSS/audio-urls-confessions-tl.js ./
```

---

## ÉTAPE 5: Tests ⏳

### Test 1: Vérifier les URLs

Ouvrir dans navigateur:
```
file:///C:/ScriptBible/bible-chantee/TEST_URLS.html
```

**Tests à effectuer**:

1. **Test Confessions uniquement** (30 URLs)
   - Sélectionner "Test Confessions uniquement"
   - Cliquer "Démarrer les Tests"
   - Attendre fin des tests
   - Vérifier: 30 succès, 0 échec

2. **Test Échantillon** (100+ URLs)
   - Sélectionner "Test échantillon"
   - Cliquer "Démarrer les Tests"
   - Vérifier: >95% succès

3. **Test Complet** (7,214 URLs) - OPTIONNEL
   - Sélectionner "Test TOUTES les URLs"
   - Cliquer "Démarrer les Tests"
   - Attendre ~15-20 minutes
   - Vérifier: >99% succès

**Résultats attendus**:

| Test | URLs | Succès attendu | Échecs max |
|------|------|----------------|------------|
| Confessions | 30 | 30 (100%) | 0 |
| Échantillon | ~100 | >95 (>95%) | <5 |
| Complet | 7,214 | >7,140 (>99%) | <74 |

**Checklist**:
- [ ] Test confessions: 30/30 OK
- [ ] Test échantillon: >95% OK
- [ ] Test complet: >99% OK (optionnel)

### Test 2: Site en Production

1. Ouvrir: https://biblechantee.com/confessions/
2. Tester lecture:
   - Confession FR "Joie"
   - Confession PT "Alegria"
   - Confession TL "Kagalakan"
3. Vérifier: Audio charge et joue correctement

**Checklist**:
- [ ] Confessions FR jouent
- [ ] Confessions PT jouent
- [ ] Confessions TL jouent
- [ ] Pas d'erreur console navigateur

---

## ÉTAPE 6: Validation Finale ⏳

### Re-analyser les URLs

```bash
cd C:\ScriptBible\bible-chantee
python Scripts/phase3_analyse_urls.py
```

**Résultat attendu**:
```
Par domaine:
  r2          :  7214 (100.0%)
  archive     :     0 (  0.0%)
```

**Validation**:
- [ ] 7,214 URLs sur R2
- [ ] 0 URLs sur Archive.org
- [ ] 100% migration complète

### Documenter

Ajouter dans `PHASE3_FINAL.md`:
```markdown
## Tests Effectués - RÉSULTATS

### Upload R2
✅ 30/30 fichiers uploadés avec succès

### Migration URLs
✅ 30 URLs migrées (3 fichiers JS)
✅ Backups créés dans backups/urls_YYYYMMDD_HHMMSS/

### Tests
✅ Test confessions: 30/30 URLs OK (100%)
✅ Test échantillon: XX/XX URLs OK (XX%)
✅ Test site production: Lecture audio OK

### Analyse Finale
✅ 7,214 URLs sur R2 (100%)
✅ 0 URLs sur Archive.org (0%)
✅ Migration Phase 3 TERMINÉE
```

---

## RÉCAPITULATIF FINAL

### Fichiers Créés (13)

| # | Fichier | Type | Statut |
|---|---------|------|--------|
| 1 | Scripts/phase3_analyse_urls.py | Script | ✅ |
| 2 | Scripts/phase3_check_r2_confessions.py | Script | ✅ |
| 3 | Scripts/phase3_migrate_urls_to_r2.py | Script | ✅ |
| 4 | PHASE3_URLS_ANALYSE.json | Rapport | ✅ |
| 5 | PHASE3_URLS_ANALYSE.md | Rapport | ✅ |
| 6 | PHASE3_R2_COVERAGE.json | Rapport | ✅ |
| 7 | FICHIERS_A_UPLOADER_R2.md | Doc | ✅ |
| 8 | TEST_URLS.html | Test | ✅ |
| 9 | PHASE3_FINAL.md | Rapport | ✅ |
| 10 | PHASE3_CHECKLIST.md | Checklist | ✅ |
| 11 | Scripts/README_PHASE3.md | Doc | ✅ |
| 12 | README_ARCHIVE_FR_V1.txt | Archive | ✅ |
| 13 | README_ARCHIVE_FR_V2.txt | Archive | ✅ |

### Actions à Effectuer (4)

| # | Action | Type | Statut |
|---|--------|------|--------|
| 1 | Renommer FR_V1 → _ARCHIVE_FR_V1 | Manuel | ⏳ |
| 2 | Renommer FR_V2 → _ARCHIVE_FR_V2 | Manuel | ⏳ |
| 3 | Upload 30 fichiers vers R2 | Manuel | ⏳ |
| 4 | Migrer URLs (script) | Auto | ⏳ |

### Tests à Effectuer (3)

| # | Test | Statut |
|---|------|--------|
| 1 | Vérification R2 (30 fichiers) | ⏳ |
| 2 | Test URLs (TEST_URLS.html) | ⏳ |
| 3 | Test site production | ⏳ |

### Validation Finale (1)

| # | Validation | Statut |
|---|------------|--------|
| 1 | 100% URLs sur R2 | ⏳ |

---

## PROCHAINES ÉTAPES

1. **MAINTENANT**: Archiver FR_V1 et FR_V2 sur Google Drive
2. **ENSUITE**: Uploader 30 fichiers confessions vers R2
3. **PUIS**: Exécuter script migration URLs
4. **ENFIN**: Tester avec TEST_URLS.html

**Temps estimé total**: 45-60 minutes

**Risque**: Minimal (backups automatiques, aucune suppression)

**Impact**: Migration 100% vers R2, performances améliorées

---

**Date**: 2026-02-01
**Version**: 1.0
**Statut**: Prêt pour exécution
