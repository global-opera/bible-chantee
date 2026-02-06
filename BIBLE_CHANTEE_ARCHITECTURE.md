# BIBLE CHANTÉE — ARCHITECTURE COMPLÈTE
## Index de tous les éléments (6 février 2026)

---

# 1. VUE D'ENSEMBLE

| Élément | Valeur |
|---------|--------|
| Site | https://biblechantee.com |
| Site démo | https://sungbible.world |
| GitHub | https://github.com/global-opera/bible-chantee |
| Branche | `prod` |
| Hébergement site | Netlify (auto-deploy depuis GitHub) |
| Hébergement audio | Cloudflare R2 (bucket `bible-chantee-audio`) |
| Repo local | `C:\ScriptBible\bible-chantee` |
| Base projet | `G:\Mon Drive\01 BibleChantee\` |

---

# 2. PAGES DU SITE

## 2.1 Pages principales

| Page | Fichier | Fonction | Statut |
|------|---------|----------|--------|
| Accueil | `index.html` | Sélection langue (12 langues), navigation | ✅ OK |
| Lecteur principal | `lecteur.html` | Lecteur audio + paroles + Bible | ✅ OK |
| Bible texte | `bible.html` | Texte Bible Segond 1910 | ✅ OK |

## 2.2 Pages thématiques

| Page | Fichier | Fonction | Audio | Paroles | Statut |
|------|---------|----------|-------|---------|--------|
| Promesses | `promesses.html` | Liste thèmes promesses | — | — | ✅ OK |
| Promesses détail | `promesse-detail.html` | Lecteur promesses | ✅ | ⚠️ FIX 06/02 | Corrigé |
| Confessions | `confessions.html` | Liste confessions | — | — | ✅ OK |
| Confessions détail | `confession-detail.html` | Lecteur confessions | ✅ | ✅ | ✅ OK |
| Prières | `prieres.html` | Liste prières chantées | — | — | ✅ OK |
| Prières détail | `priere-detail.html` | Lecteur prières | ❌ PAS D'AUDIO | ✅ | 🔴 CASSÉ |

## 2.3 Dépendance audio par page

| Page | Source audio JS | Source R2 |
|------|----------------|-----------|
| `lecteur.html` | `js/audio-urls-{lang}.js` | `/{LANG}/{BOOK}/{BOOK}_{CH}.mp3` |
| `promesse-detail.html` | `js/audio-urls-{lang}.js` | même que lecteur |
| `confession-detail.html` | `js/audio-urls-confessions.js` | `/confessions/{LANG}/` |
| `priere-detail.html` | `js/audio-urls-prayers.js` ❓ | `/prayers/{LANG}/` |

## 2.4 Dépendance paroles par page

| Page | Source paroles JS | Format | Statut |
|------|-------------------|--------|--------|
| `lecteur.html` | `js/lyrics-data-prompts.js` + `js/lyrics-formatter.js` | Prompts Suno → HTML formaté (Couplet/Refrain) | ✅ |
| `promesse-detail.html` | `js/lyrics-data-prompts.js` + `js/lyrics-formatter.js` | Même (FIX 06/02) | ✅ |
| `confession-detail.html` | `lyrics/{LANG}.json` ou JS dédié | À vérifier | ✅ |
| `priere-detail.html` | Paroles inline ou JSON | À vérifier | ✅ (paroles OK, audio KO) |

---

# 3. FICHIERS JS DU SITE

## 3.1 Système i18n (internationalization)

| Fichier | Fonction | Chargé par |
|---------|----------|------------|
| `lang-shared.js` | Config partagée, BOOK_NAMES 66 livres x 12 langues, `window.currentLanguage` | Toutes pages |
| `i18n.js` | Système traduction UI | Toutes pages |
| `translations.js` | Clés traduction interface | Toutes pages |
| `translations-extra.js` | Clés supplémentaires | Toutes pages |

## 3.2 Audio

| Fichier | Fonction | URL pattern R2 |
|---------|----------|----------------|
| `js/audio-urls-fr.js` | URLs MP3 FR (1189) | `/{LANG}/{BOOK}/{BOOK}_{CH}.mp3` |
| `js/audio-urls-en.js` | URLs MP3 EN (1189) | idem |
| `js/audio-urls-pt.js` | URLs MP3 PT (1189) | idem |
| `js/audio-urls-es.js` | URLs MP3 ES (1189) | idem |
| `js/audio-urls-de.js` | URLs MP3 DE (1189) | idem |
| `js/audio-urls-it.js` | URLs MP3 IT | idem |
| `js/audio-urls-confessions.js` | URLs MP3 confessions (7 langues) | `/confessions/{LANG}/` |
| `js/audio-urls-prayers.js` ❓ | URLs MP3 prières (7 langues) | `/prayers/{LANG}/` — **À VÉRIFIER/CRÉER** |

## 3.3 Paroles

| Fichier | Contenu | Utilisé par |
|---------|---------|-------------|
| `js/lyrics-data-prompts.js` | Prompts Suno FR structurés ([Verse], [Chorus]) — **SOURCE VÉRITÉ FR** | lecteur.html, promesse-detail.html |
| `js/lyrics-formatter.js` | Convertit tags anglais → français (Verse→Couplet, Chorus→Refrain) | lecteur.html, promesse-detail.html |
| `lyrics-data.js` | Paroles FR (ancienne version, prompts Suno bruts) — **NE PLUS UTILISER SEUL** | legacy |
| `lyrics-data-v2.js` | Paroles FR V2 (ancien) | legacy |
| `lyrics-data-pt.js` | Paroles PT | lecteur.html lang=PT |
| `lyrics/{LANG}.json` | Paroles par langue (JSON) — **ATTENTION: FR.json = Whisper corrompu** | confession-detail, priere-detail |

## 3.4 Lecteur / Player

| Fichier | Fonction |
|---------|----------|
| `js/player.js` | Lecteur principal, toggle Paroles/Bible, audio |
| `js/books.js` | Liste 66 livres avec codes et nb chapitres |
| `js/book-names.js` | Noms traduits + BOOK_CODE_ALIASES |

---

# 4. CLOUDFLARE R2 — STRUCTURE COMPLÈTE

## 4.1 Configuration

| Paramètre | Valeur |
|-----------|--------|
| Bucket | `bible-chantee-audio` |
| Taille | 66.57 GB |
| Accès public | Activé |
| URL publique | `https://pub-4a0547758c7a4780a94fe50ab1e2f0b4.r2.dev` |
| Endpoint S3 | `https://639b9becb7f3884bc3aa3d27b80e671d.r2.cloudflarestorage.com` |

**ATTENTION** : Le skill V2 mentionne une autre URL publique (`pub-2dc4dfed0c5e45338913878f35d4d56a`). Vérifier laquelle est active.

## 4.2 Structure R2

```
bible-chantee-audio/
├── FR/                          ← 1189 MP3 Bible chantée
│   ├── 01_GEN/
│   │   ├── 01_GEN_01.mp3
│   │   ├── 01_GEN_02.mp3
│   │   └── ... (50 fichiers)
│   ├── 02_EXO/ ... 
│   └── 66_REV/
├── EN/                          ← 1189 MP3
├── PT/                          ← 1189 MP3
├── ES/                          ← 1189 MP3
├── DE/                          ← 1189 MP3
├── IT/                          ← ~1182 MP3
├── confessions/                 ← MP3 confessions de foi
│   ├── DE/
│   ├── EN/
│   ├── ES/
│   ├── FR/
│   ├── IT/
│   ├── PT/
│   └── TL/
└── prayers/                     ← MP3 prières chantées
    ├── DE/
    ├── EN/
    ├── ES/
    ├── FR/
    ├── IT/
    ├── PT/
    └── TL/
```

## 4.3 Format URL

```
Bible:       https://{R2_PUBLIC}/{LANG}/{BOOK}/{BOOK}_{CH}.mp3
Confessions: https://{R2_PUBLIC}/confessions/{LANG}/{fichier}.mp3
Prières:     https://{R2_PUBLIC}/prayers/{LANG}/{fichier}.mp3
```

---

# 5. SOURCES LOCALES (Google Drive)

## 5.1 Structure

```
G:\Mon Drive\01 BibleChantee\
├── Suno_Output\{LANG}\{BOOK}\    ← MP3 originaux Suno
│   └── {BOOK}_{CH}.mp3
│   └── {BOOK}_{CH}_meta.json     ← SOURCE VÉRITÉ PAROLES (champ "prompt")
│   └── {BOOK}_{CH}.lyrics.txt
├── Lyrics\{LANG}\{BOOK}\         ← Paroles texte
│   └── {BOOK}_{CH}_{LANG}.txt
├── Archives_Lyrics\              ← Anciennes versions (NE PAS UTILISER)
├── Scripts\                      ← Scripts Python/PowerShell
├── JSON\                         ← Textes bibliques par langue
├── Locks\                        ← Système parallélisme Suno
└── DistroKid\{LANG}\            ← HTML pour upload DistroKid
```

## 5.2 Sources de vérité paroles

| Priorité | Source | Contenu | Qualité |
|----------|--------|---------|---------|
| 1 | `Suno_Output\FR\{BOOK}\{BOOK}_{CH}_meta.json` → champ `prompt` | Prompts Suno envoyés (avec [Verse], [Chorus]) | ✅ MEILLEURE |
| 2 | `Lyrics\FR_V1\` | 1189 fichiers paroles | Variable (6 livres haute qualité, reste Whisper) |
| 3 | `lyrics/{LANG}.json` sur le site | JSON par langue | ⚠️ FR = Whisper corrompu |

**RÈGLE** : Ne jamais utiliser `lyrics/FR.json` comme source. Toujours utiliser `lyrics-data-prompts.js`.

---

# 6. LANGUES

## 6.1 Audio (6 langues complètes + 1 en cours)

| Code | Langue | MP3 R2 | JSON Bible | Style musical |
|------|--------|--------|------------|---------------|
| FR | Français | 1189/1189 ✅ | Segond 1910 | Chanson française, variété |
| EN | Anglais | 1189/1189 ✅ | KJV | Contemporary worship, gospel |
| PT | Portugais | 1189/1189 ✅ | ACF | MPB, bossa nova, louvor brasileiro |
| ES | Espagnol | 1189/1189 ✅ | RV1909 | Flamenco, latin pop, alabanza |
| DE | Allemand | 1189/1189 ✅ | Schlachter | Klassik, choral, pop deutsch |
| IT | Italien | ~1182/1189 🔄 | CEI | Opera, cantautore ⭐ MEILLEUR |

## 6.2 Paroles uniquement (6 langues supplémentaires)

| Code | Langue | JSON Bible |
|------|--------|------------|
| AR | Arabe | SVD |
| RU | Russe | Synodal |
| ZH | Chinois | CUV |
| HI | Hindi | IRV |
| TL | Tagalog | MBBTAG |
| SW | Swahili | SUV |

---

# 7. CODES 66 LIVRES (DÉFINITIFS)

```
01_GEN 02_EXO 03_LEV 04_NUM 05_DEU 06_JOS 07_JDG 08_RUT 09_1SAM 10_2SAM
11_1KI 12_2KI 13_1CH 14_2CH 15_EZR 16_NEH 17_EST 18_JOB 19_PSA 20_PRO
21_ECC 22_SON 23_ISA 24_JER 25_LAM 26_EZE 27_DAN 28_HOS 29_JOE 30_AMO
31_OBA 32_JON 33_MIC 34_NAH 35_HAB 36_ZEP 37_HAG 38_ZEC 39_MAL 40_MAT
41_MAR 42_LUK 43_JOH 44_ACT 45_ROM 46_1CO 47_2CO 48_GAL 49_EPH 50_PHP
51_COL 52_1TH 53_2TH 54_1TI 55_2TI 56_TIT 57_PHM 58_HEB 59_JAS 60_1PE
61_2PE 62_1JO 63_2JO 64_3JO 65_JUD 66_REV
```

### Codes interdits (anciens)
`09_1SA` → `09_1SAM` | `10_2SA` → `10_2SAM` | `22_SNG` → `22_SON` | `26_EZK` → `26_EZE` | `29_JOL` → `29_JOE` | `41_MRK` → `41_MAR` | `43_JHN` → `43_JOH`

---

# 8. PROBLÈMES CONNUS (6 février 2026)

| # | Page | Problème | Cause | Priorité |
|---|------|----------|-------|----------|
| 1 | `priere-detail.html` | Pas d'audio (0:00/0:00) | `audio-urls-prayers.js` absent ou mal configuré. MP3 présents sur R2 `/prayers/` | 🔴 HAUTE |
| 2 | `promesse-detail.html` | Paroles Suno brutes au lieu de couplets structurés | Chargeait `lyrics/FR.json` (Whisper) au lieu de `lyrics-data-prompts.js` | ✅ CORRIGÉ 06/02 |
| 3 | `lyrics/FR.json` | Contient transcriptions Whisper corrompues | Jamais régénéré depuis prompts Suno | ⚠️ À RÉGÉNÉRER ou SUPPRIMER |
| 4 | IT | 7 chapitres MP3 manquants sur R2 | Génération Suno incomplète | 🟡 BASSE |
| 5 | URL R2 | Deux URLs publiques dans les skills | `pub-4a05...` vs `pub-2dc4...` — laquelle est la bonne ? | 🟡 À CLARIFIER |

---

# 9. ERREURS HISTORIQUES (NE JAMAIS RÉPÉTER)

| Date | Erreur | Temps perdu |
|------|--------|-------------|
| Jan 2026 | Écrasement lyrics-data.js | 3 jours |
| Jan 2026 | Utilisation Whisper corrompues comme source | 1 jour |
| Jan 2026 | Confusion titres vs paroles | 2 jours |
| Fév 2026 | promesse-detail.html chargeait mauvaise source | 2 heures |
| Fév 2026 | innerHTML vs textContent pour HTML formaté | 30 min |
| Récurrent | Claude Code ne connaît pas la structure → casse des choses | Chaque session |

---

# 10. WORKFLOW DÉPLOIEMENT

```
1. Modifier fichiers dans C:\ScriptBible\bible-chantee\
2. powershell -File RUN_AUDIT.ps1        ← OBLIGATOIRE
3. git add . && git commit -m "message"
4. git push origin prod
5. Netlify auto-deploy (2-3 min)
6. Vérifier https://biblechantee.com
```

---

# 11. COMMANDES R2

```powershell
$endpoint = "https://639b9becb7f3884bc3aa3d27b80e671d.r2.cloudflarestorage.com"

# Lister contenu prayers
& aws s3 ls "s3://bible-chantee-audio/prayers/" --endpoint-url $endpoint

# Lister contenu prayers/FR
& aws s3 ls "s3://bible-chantee-audio/prayers/FR/" --endpoint-url $endpoint

# Upload
& aws s3 sync "source" "s3://bible-chantee-audio/prayers/FR/" --endpoint-url $endpoint

# Compter fichiers par langue
$langs = @("FR","EN","PT","ES","DE","IT")
foreach ($l in $langs) {
    $c = (& aws s3 ls "s3://bible-chantee-audio/$l/" --endpoint-url $endpoint --recursive | Measure-Object).Count
    Write-Host "$l : $c fichiers"
}
```

---

# 12. CHECKLIST AUDIT COMPLET

Avant chaque déploiement ou après correction, vérifier :

- [ ] **Lecteur FR** : `lecteur.html?book=19&chapter=23&lang=FR` → audio joue + paroles structurées
- [ ] **Lecteur EN** : `lecteur.html?book=19&chapter=23&lang=EN` → audio joue
- [ ] **Promesses** : `promesse-detail.html?theme=0` → audio + paroles couplets
- [ ] **Confessions** : `confession-detail.html` → audio joue
- [ ] **Prières** : `priere-detail.html` → audio joue (actuellement ❌)
- [ ] **i18n** : `RUN_AUDIT.ps1` → vert
- [ ] **0 console errors** : F12 → Console → aucune erreur rouge
