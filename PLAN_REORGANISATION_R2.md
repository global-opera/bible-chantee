# 📋 PLAN COMPLET - Réorganisation R2

Date: 2026-02-01
Basé sur: AUDIT_PROMESSES_COMPLET.md

---

## 🎯 OBJECTIF

Organiser l'architecture Cloudflare R2 bucket `bible-chantee-audio` selon la structure suivante:

```
bible-chantee-audio/
├── promesses/
│   ├── FR/
│   │   └── 19_Psaumes_XXX.mp3 (22 fichiers)
│   └── PT/
│       └── 19_Psaumes_XXX.mp3 (22 fichiers)
├── confessions/
│   ├── FR/
│   │   └── 01_Joie.mp3 ... 10_Shalom.mp3
│   ├── PT/
│   │   └── 01_Alegria.mp3 ... 10_Paz.mp3
│   └── TL/
│       └── 01_Kagalakan.mp3 ... 10_Shalom.mp3
├── prayers/
│   ├── DE_*.mp3 (6 fichiers)
│   ├── EN_*.mp3 (6 fichiers)
│   ├── ES_*.mp3 (6 fichiers)
│   ├── FR_*.mp3 (6 fichiers)
│   ├── IT_*.mp3 (6 fichiers)
│   ├── PT_*.mp3 (5 fichiers)
│   └── TL_*.mp3 (6 fichiers)
└── FR/
    ├── 01_GEN/
    └── ... (Bible 66 livres)
```

---

## ❌ PROBLÈMES ACTUELS

### 1. Prayers uploadés au mauvais endroit
**Localisation actuelle**: `bible-chantee-audio/bible-chantee-audio/bible-chantee-audio/bible-chantee-audio/...`
**Fichiers**: 11 fichiers PT/TL (5 PT + 6 TL)
**Problème**: Chemin récursif incorrect

### 2. Promesses/ créé "ailleurs"
**Statut**: Dossier créé par user mais pas au bon endroit
**Besoin**: Déplacer vers `bible-chantee-audio/promesses/`

### 3. Confessions désorganisées
**Statut**: Fichiers probablement en vrac (selon user)
**Besoin**: Organiser en `confessions/FR/`, `confessions/PT/`, `confessions/TL/`

---

## ✅ ÉTAPE 1: CRÉER DOSSIERS R2

Via Cloudflare Dashboard: https://dash.cloudflare.com

### Actions:
1. Ouvrir R2 → Buckets → `bible-chantee-audio`
2. Créer les dossiers suivants (via bouton "Create folder"):
   ```
   promesses/
   promesses/FR/
   promesses/PT/
   confessions/
   confessions/FR/
   confessions/PT/
   confessions/TL/
   prayers/
   ```

**Note**: Si certains dossiers existent déjà, ignorer et passer au suivant.

---

## ✅ ÉTAPE 2: DÉPLACER PRAYERS (URGENT)

### Problème: Fichiers dans chemin récursif
Les 11 fichiers PT/TL sont dans:
```
bible-chantee-audio/bible-chantee-audio/bible-chantee-audio/bible-chantee-audio/...
```

### Solution A: Via Dashboard (RECOMMANDÉ - Plus simple)
1. Naviguer dans R2 jusqu'au dossier contenant les fichiers
2. Sélectionner chaque fichier PT_*.mp3 et TL_*.mp3
3. Click "Move"
4. Destination: `prayers/`
5. Confirmer

### Solution B: Via rclone
```powershell
# Lister d'abord pour confirmer l'emplacement exact
rclone ls r2-bible-chantee:bible-chantee-audio | grep -E "(PT_|TL_).*\.mp3"

# Déplacer vers prayers/
rclone move r2-bible-chantee:bible-chantee-audio/[chemin-incorrect]/ `
  r2-bible-chantee:bible-chantee-audio/prayers/ `
  --include "PT_*.mp3" `
  --include "TL_*.mp3" `
  --progress
```

### Fichiers à déplacer (11 total):
**PT (5 fichiers):**
- PT_Pai Nosso.mp3
- PT_Gratidão.mp3
- PT_Oração de Libertação.mp3
- PT_Primeiro Eu Te Busco.mp3
- PT_Tu És a Minha Proteção.mp3

**TL (6 fichiers):**
- TL_Ama Namin.mp3
- TL_Pasasalamat.mp3
- TL_Panalangin ng Paglaya.mp3
- TL_Una Kitang Hinahanap.mp3
- TL_Binubuksan Mo Ang Pinto.mp3
- TL_Ikaw ang Aking Proteksiyon.mp3

---

## ✅ ÉTAPE 3: ORGANISER PROMESSES

### Localiser le dossier promesses/ créé "ailleurs"
Le user a créé un dossier `promesses/` quelque part dans R2.

### Actions:
1. Naviguer dans R2 pour trouver où se trouve `promesses/`
2. Vérifier le contenu:
   - Devrait contenir les 22 psaumes FR
   - Devrait contenir les 22 psaumes PT
   - Format: `19_Psaumes_XXX.mp3`

### Option 1: Déplacer le dossier entier
Si promesses/ est déjà organisé avec FR/ et PT/:
```powershell
rclone move r2-bible-chantee:[chemin-actuel]/promesses/ `
  r2-bible-chantee:bible-chantee-audio/promesses/ `
  --progress
```

### Option 2: Créer structure et copier
Si promesses/ n'est pas structuré:
1. Créer `bible-chantee-audio/promesses/FR/` et `promesses/PT/`
2. Déplacer les fichiers FR vers `promesses/FR/`
3. Déplacer les fichiers PT vers `promesses/PT/`

### Fichiers attendus (44 total):
**FR (22 fichiers):**
```
19_Psaumes_004.mp3
19_Psaumes_018.mp3
19_Psaumes_023.mp3
19_Psaumes_027.mp3
19_Psaumes_030.mp3
19_Psaumes_034.mp3
19_Psaumes_037.mp3
19_Psaumes_042.mp3
19_Psaumes_046.mp3
19_Psaumes_062.mp3
19_Psaumes_091.mp3
19_Psaumes_100.mp3
19_Psaumes_103.mp3
19_Psaumes_121.mp3
19_Psaumes_125.mp3
19_Psaumes_130.mp3
19_Psaumes_131.mp3
19_Psaumes_144.mp3
19_Psaumes_145.mp3
19_Psaumes_147.mp3
19_Psaumes_148.mp3
19_Psaumes_150.mp3
```

**PT**: Même liste avec `19_Psaumes_XXX.mp3` (format identique)

**Source**: Ces fichiers sont actuellement sur Archive.org, donc il faudra les télécharger puis uploader vers R2.

---

## ✅ ÉTAPE 4: ORGANISER CONFESSIONS

### Fichiers locaux disponibles:
- **FR**: `C:\ScriptBible\bible-chantee\confessions\FR\` (10 fichiers, 28 MB)
- **PT**: `C:\ScriptBible\bible-chantee\confessions\PT\` (10 fichiers, 31 MB)
- **TL**: `G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL\` (10 fichiers, 26 MB)

### Actions:
Si confessions FR/PT/TL ne sont PAS encore sur R2:

```powershell
# Upload FR
rclone copy "C:\ScriptBible\bible-chantee\confessions\FR\" `
  r2-bible-chantee:bible-chantee-audio/confessions/FR/ `
  --progress

# Upload PT
rclone copy "C:\ScriptBible\bible-chantee\confessions\PT\" `
  r2-bible-chantee:bible-chantee-audio/confessions/PT/ `
  --progress

# Upload TL
rclone copy "G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL\" `
  r2-bible-chantee:bible-chantee-audio/confessions/TL/ `
  --progress
```

Si confessions sont déjà sur R2 mais désorganisées:
1. Utiliser Dashboard pour déplacer vers `confessions/FR/`, `confessions/PT/`, `confessions/TL/`

---

## ✅ ÉTAPE 5: VÉRIFICATIONS POST-RÉORGANISATION

### Test 1: Prayers PT/TL
```bash
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/PT_Pai Nosso.mp3"
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/TL_Ama Namin.mp3"
# Devrait retourner: HTTP/1.1 200 OK
```

### Test 2: Confessions FR/PT/TL
```bash
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/confessions/FR/01_Joie.mp3"
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/confessions/PT/01_Alegria.mp3"
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/confessions/TL/01_Kagalakan.mp3"
# Devrait retourner: HTTP/1.1 200 OK
```

### Test 3: Promesses FR/PT
```bash
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/promesses/FR/19_Psaumes_023.mp3"
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/promesses/PT/19_Psaumes_023.mp3"
# Devrait retourner: HTTP/1.1 200 OK
```

---

## ✅ ÉTAPE 6: METTRE À JOUR LE CODE (SI NÉCESSAIRE)

### Fichiers à vérifier/modifier:

#### 1. audio-urls-promesses-fr.js
**Vérifier si**: Les URLs pointent vers Archive.org ou R2
**Si Archive.org**: Garder tel quel (permanent)
**Si besoin R2**: Modifier pour pointer vers `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/promesses/FR/...`

#### 2. audio-urls-promessas-pt.js
**Vérifier si**: Les URLs pointent vers Archive.org ou R2
**Si Archive.org**: Garder tel quel (permanent)
**Si besoin R2**: Modifier pour pointer vers `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/promesses/PT/...`

#### 3. audio-urls-confessions-fr.js
**Si besoin**: Modifier pour pointer vers R2
```javascript
window.audioUrlsConfessionsFR = {
    "01": "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/confessions/FR/01_Joie.mp3",
    // ... etc
};
```

#### 4. audio-urls-confessions-pt.js
**Si besoin**: Modifier pour pointer vers R2
```javascript
window.audioUrlsConfessionsPT = {
    "01": "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/confessions/PT/01_Alegria.mp3",
    // ... etc
};
```

#### 5. audio-urls-confessions-tl.js
**✅ DÉJÀ FAIT**: Pointe vers Archive.org (permanent)

---

## 📋 CHECKLIST COMPLÈTE

### Phase 1: Préparation
- [ ] Vérifier accès Cloudflare Dashboard
- [ ] Vérifier rclone installé (si utilisation CLI)
- [ ] Vérifier rclone configuré pour R2 (remote: `r2-bible-chantee`)

### Phase 2: Création Structure
- [ ] Créer `bible-chantee-audio/promesses/`
- [ ] Créer `bible-chantee-audio/promesses/FR/`
- [ ] Créer `bible-chantee-audio/promesses/PT/`
- [ ] Créer `bible-chantee-audio/confessions/`
- [ ] Créer `bible-chantee-audio/confessions/FR/`
- [ ] Créer `bible-chantee-audio/confessions/PT/`
- [ ] Créer `bible-chantee-audio/confessions/TL/`
- [ ] Créer `bible-chantee-audio/prayers/` (si n'existe pas)

### Phase 3: Déplacements
- [ ] Déplacer 11 fichiers PT/TL vers `prayers/`
- [ ] Localiser dossier promesses/ existant
- [ ] Déplacer promesses/ vers `bible-chantee-audio/promesses/`
- [ ] Organiser promesses FR dans `promesses/FR/`
- [ ] Organiser promesses PT dans `promesses/PT/`
- [ ] Organiser confessions FR dans `confessions/FR/`
- [ ] Organiser confessions PT dans `confessions/PT/`
- [ ] Organiser confessions TL dans `confessions/TL/`

### Phase 4: Vérifications
- [ ] Test prayers PT - HTTP 200
- [ ] Test prayers TL - HTTP 200
- [ ] Test confessions FR - HTTP 200
- [ ] Test confessions PT - HTTP 200
- [ ] Test confessions TL - HTTP 200
- [ ] Test promesses FR - HTTP 200 (si sur R2)
- [ ] Test promesses PT - HTTP 200 (si sur R2)

### Phase 5: Code (si nécessaire)
- [ ] Vérifier audio-urls-promesses-fr.js
- [ ] Vérifier audio-urls-promessas-pt.js
- [ ] Vérifier audio-urls-confessions-fr.js
- [ ] Vérifier audio-urls-confessions-pt.js
- [ ] Commit et push modifications

### Phase 6: Tests Finaux
- [ ] Test site: https://biblechantee.com/prieres.html?lang=PT
- [ ] Test site: https://biblechantee.com/prieres.html?lang=TL
- [ ] Test site: https://biblechantee.com/confessions.html?lang=FR
- [ ] Test site: https://biblechantee.com/confessions.html?lang=PT
- [ ] Test site: https://biblechantee.com/confessions.html?lang=TL
- [ ] Test site: https://biblechantee.com/promesses.html

---

## 🚨 PRIORITÉS

### 1. IMMÉDIAT (aujourd'hui)
- Déplacer prayers PT/TL du chemin incorrect vers `prayers/`
- Tester prayers sur le site

### 2. URGENT (cette semaine)
- Organiser dossier promesses/
- Uploader promesses FR/PT vers R2 (si nécessaire)
- Organiser confessions FR/PT/TL

### 3. MOYEN TERME (ce mois)
- Générer confessions multilingues (9 langues × 10 = 90 fichiers)
- Uploader vers Archive.org ou R2

---

## 📊 INVENTAIRE FICHIERS

### Prayers (40 fichiers attendus)
- [x] DE: 6 fichiers
- [x] EN: 6 fichiers
- [x] ES: 6 fichiers
- [x] FR: 6 fichiers
- [x] IT: 6 fichiers
- [x] PT: 5 fichiers (générés récemment, à déplacer)
- [x] TL: 6 fichiers (générés récemment, à déplacer)

**Note**: PT a 5 au lieu de 6 car "Abres la Puerta" n'existe pas en PT.

### Confessions (30 fichiers actuels, 120 attendus)
- [x] FR: 10 fichiers
- [x] PT: 10 fichiers
- [x] TL: 10 fichiers
- [ ] EN: 10 fichiers (à générer)
- [ ] ES: 10 fichiers (à générer)
- [ ] DE: 10 fichiers (à générer)
- [ ] IT: 10 fichiers (à générer)
- [ ] AR: 10 fichiers (à générer)
- [ ] HI: 10 fichiers (à générer)
- [ ] RU: 10 fichiers (à générer)
- [ ] SW: 10 fichiers (à générer)
- [ ] ZH: 10 fichiers (à générer)

### Promesses (44 fichiers attendus sur R2)
- [ ] FR: 22 psaumes (actuellement sur Archive.org)
- [ ] PT: 22 psaumes (actuellement sur Archive.org)

---

## 🔗 RÉFÉRENCES

- **Audit**: AUDIT_PROMESSES_COMPLET.md
- **Upload Prayers**: UPLOAD_TL_PRAYERS_URGENT.md
- **Upload Confessions TL**: UPLOAD_TL_CONFESSIONS_ARCHIVEORG.md
- **Génération Audio**: GUIDE_GENERATION_AUDIO.md
- **Script Upload R2**: upload_prayers_to_r2.ps1

---

**FIN DU PLAN**

Prochaine action: Choisir Phase 1, 2 ou 3 selon priorité.
