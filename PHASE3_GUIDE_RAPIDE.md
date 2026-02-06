# PHASE 3 - GUIDE RAPIDE

Migration finale vers R2 en 4 étapes simples.

---

## ÉTAPE 1: Archiver FR_V1 et FR_V2 (Google Drive)

**Temps**: 5 minutes

1. Ouvrir Google Drive: `G:\Mon Drive\01 BibleChantee\Suno_Output\`

2. Renommer les dossiers:
   ```
   FR_V1  →  _ARCHIVE_FR_V1
   FR_V2  →  _ARCHIVE_FR_V2
   ```

3. Copier les README:
   - Copier `C:\ScriptBible\bible-chantee\README_ARCHIVE_FR_V1.txt`
   - Vers `G:\Mon Drive\01 BibleChantee\Suno_Output\_ARCHIVE_FR_V1\README_ARCHIVE.txt`
   - Idem pour FR_V2

**Validation**: ✓ FR_V1 et FR_V2 renommés avec préfixe `_ARCHIVE_`

---

## ÉTAPE 2: Upload Confessions vers R2 (30 fichiers)

**Temps**: 15-20 minutes

### Option A: Wrangler CLI (Recommandé)

```bash
# Installer Wrangler
npm install -g wrangler

# Login
wrangler login

# Upload (exemple pour FR)
cd "G:\Mon Drive\01 BibleChantee\Suno_Output\confessions"
wrangler r2 object put bible-chantee-audio/confessions/FR_01_Joie.mp3 --file "FR\01_Joie.mp3"
# Répéter pour les 30 fichiers...
```

### Option B: Interface Web Cloudflare

1. Aller sur https://dash.cloudflare.com
2. R2 → bible-chantee-audio → Create folder "confessions"
3. Upload manuellement les 30 fichiers

### Vérifier l'upload

```bash
cd C:\ScriptBible\bible-chantee
python Scripts/phase3_check_r2_confessions.py
```

**Résultat attendu**: `30/30 fichiers existants sur R2`

**Validation**: ✓ 30/30 fichiers sur R2

---

## ÉTAPE 3: Migrer les URLs

**Temps**: 2 minutes

```bash
cd C:\ScriptBible\bible-chantee
python Scripts/phase3_migrate_urls_to_r2.py
```

**Actions automatiques**:
- ✓ Crée backups
- ✓ Modifie 3 fichiers JS
- ✓ Remplace 30 URLs

**Résultat attendu**: `Total URLs migrées: 30`

**Validation**: ✓ 30 URLs migrées, backups créés

---

## ÉTAPE 4: Tester

**Temps**: 5 minutes

1. Ouvrir `TEST_URLS.html` dans navigateur:
   ```
   file:///C:/ScriptBible/bible-chantee/TEST_URLS.html
   ```

2. Sélectionner "Test Confessions uniquement"

3. Cliquer "Démarrer les Tests"

4. Attendre résultats

**Résultat attendu**: `30 succès, 0 échec`

**Validation**: ✓ 30/30 URLs fonctionnent

---

## VALIDATION FINALE

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

**✓ MIGRATION TERMINÉE**: 100% URLs sur R2

---

## En cas de problème

### Restaurer les URLs

```bash
# Aller dans le dossier backup le plus récent
cd backups
dir

# Restaurer les fichiers
cd urls_YYYYMMDD_HHMMSS
copy audio-urls-confessions-fr.js ..\..\
copy audio-urls-confessions-pt.js ..\..\
copy audio-urls-confessions-tl.js ..\..\
```

### Support

- Voir `PHASE3_CHECKLIST.md` pour détails complets
- Voir `PHASE3_FINAL.md` pour documentation
- Voir `Scripts/README_PHASE3.md` pour scripts

---

**Total**: ~30 minutes
**Risque**: Minimal (backups auto)
**Impact**: Migration 100% R2
