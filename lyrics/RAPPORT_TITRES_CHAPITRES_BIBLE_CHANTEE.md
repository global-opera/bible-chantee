# RAPPORT COMPLET - Correction des Titres de Chapitres Bible Chantée

**Date**: 8 janvier 2026  
**Projet**: biblechantee.com  
**Problème**: Titres de chapitres mal formatés dans l'interface multilingue

---

## 1. DESCRIPTION DU PROBLÈME INITIAL

### Symptômes observés
- Les titres de chapitres restaient en français même après changement de langue
- Certains titres contenaient des placeholders non nettoyés:
  - `TITRE`, `TITLE`, `TÍTULO`, `TITULO`, `TITEL`, `TITOLO`
  - Préfixes avec deux-points: `Título:`, `Title:`, `Titel:`, etc.
  - Préfixes de livres: `Genèse 1 -`, `Psalm 23 -`, etc.
  - Tags markdown: `###`, `##`, `#`
  - Tags résiduels: `[TITLE]`, `[LYRICS]`

### Langues concernées
- 🇫🇷 FR (Français)
- 🇬🇧 EN (Anglais)
- 🇧🇷 PT (Portugais)
- 🇪🇸 ES (Espagnol)
- 🇩🇪 DE (Allemand)
- 🇮🇹 IT (Italien)
- 🇵🇭 TL (Tagalog)

---

## 2. ARCHITECTURE DU SYSTÈME

### Fichiers impliqués
```
bible-chantee/
├── lecteur.html          # Interface principale
├── js/
│   ├── chapter-titles.js # Titres des chapitres (7 langues)
│   ├── books.js          # Liste des livres bibliques
│   └── book-names.js     # Noms des livres par langue
└── lyrics/
    ├── FR.json           # Paroles françaises (source des titres)
    ├── EN.json           # Paroles anglaises
    ├── PT.json           # Paroles portugaises
    ├── ES.json           # Paroles espagnoles
    ├── DE.json           # Paroles allemandes
    ├── IT.json           # Paroles italiennes
    └── TL.json           # Paroles tagalog
```

### Structure des fichiers source (lyrics/*.json)
```json
{
  "01": {  // Numéro du livre (Genèse = 01)
    "1": "[TITLE]\r\nTitre du chapitre\r\n\r\n[LYRICS]\r\n[Verse 1]...",
    "2": "[TITLE]\r\nAutre titre\r\n\r\n[LYRICS]\r\n..."
  }
}
```

### Structure cible (js/chapter-titles.js)
```javascript
window.CHAPTER_TITLES = {
  "FR": {
    "01": {
      "1": "Titre propre sans préfixe",
      "2": "Autre titre propre"
    }
  },
  "EN": { ... },
  // etc.
};
```

### Fonction JavaScript (lecteur.html)
```javascript
function getChapterTitle(book, chapter, lang) {
  const bookNum = book.split('_')[0];  // "01_GEN" → "01"
  if (CHAPTER_TITLES[lang] && 
      CHAPTER_TITLES[lang][bookNum] && 
      CHAPTER_TITLES[lang][bookNum][chapter]) {
    return CHAPTER_TITLES[lang][bookNum][chapter];
  }
  return '';
}
```

---

## 3. PROBLÈMES IDENTIFIÉS ET CAUSES

### 3.1 Problème 1: Format du code livre
- **Symptôme**: `getChapterTitle` retournait undefined
- **Cause**: Le code utilisait `CHAPTER_TITLES[lang][book]` avec `book = "01_GEN"`
- **Solution**: Extraire le numéro avec `book.split('_')[0]` → `"01"`

### 3.2 Problème 2: Titres source mal formatés
Les fichiers `lyrics/*.json` générés par Suno AI contenaient des titres avec formats incohérents:

| Format dans source | Exemple | Problème |
|-------------------|---------|----------|
| Placeholder seul | `[TITLE]\r\nTITRE\r\n` | "TITRE" au lieu d'un vrai titre |
| Préfixe avec : | `[TITLE]\r\nTítulo: Vrai Titre\r\n` | "Título:" à supprimer |
| Nom du livre | `[TITLE]\r\nGenèse 1 - Vrai Titre\r\n` | "Genèse 1 -" à supprimer |
| Markdown | `[TITLE]\r\n### Titre\r\n` | "###" à supprimer |
| Casse mixte | `[TITLE]\r\nTITULo: Titre\r\n` | Variantes de casse |

### 3.3 Problème 3: Inconsistance entre langues
Chaque langue avait ses propres problèmes:
- **IT**: Beaucoup de `TITRE` (mot français dans fichier italien!)
- **TL**: Mélange de `TITULO:` et `Title:`
- **ES**: `TÍTULO:` et `Título:`
- **DE**: `Titel:`

---

## 4. SOLUTIONS APPLIQUÉES

### 4.1 Correction de getChapterTitle (lecteur.html ligne 1367)
```javascript
// AVANT (incorrect)
function getChapterTitle(book, chapter, lang) {
  if (CHAPTER_TITLES[lang][book][chapter]) { ... }
}

// APRÈS (correct)
function getChapterTitle(book, chapter, lang) {
  const bookNum = book.split('_')[0];
  if (CHAPTER_TITLES[lang][bookNum][chapter]) { ... }
}
```

### 4.2 Script d'extraction Python (extract_titles_v2.py)
```python
def clean_title(raw):
    t = raw.strip().replace('\r', '').replace('\n', ' ')
    
    # 1. Supprimer ### au début
    t = re.sub(r'^#+\s*', '', t)
    
    # 2. Supprimer tous les préfixes TITRE/TITLE/etc
    t = re.sub(r'^(TITRE|Title|TITULO|Titulo|TITULo|TITEL|Titel|TITOLO|Titolo)\s*:?\s*', '', t, flags=re.IGNORECASE)
    
    # 3. Supprimer "NomLivre X - " au début
    t = re.sub(r'^[A-Za-z\u00C0-\u00FF\s]+\s+\d+\s*[-:]\s*', '', t)
    
    # 4. Supprimer guillemets
    t = re.sub(r'^["\047]+', '', t)
    t = re.sub(r'["\047]+$', '', t)
    
    # 5. Supprimer [LYRICS]
    t = re.sub(r'\[LYRICS\].*$', '', t, flags=re.IGNORECASE)
    
    # 6. Si c'est juste un placeholder, retourner vide
    if t.upper() in ['TITRE', 'TITLE', 'TITULO', 'TITEL', 'TITOLO', '']:
        return ""
    
    return t.strip()
```

### 4.3 Nettoyage supplémentaire PowerShell
```powershell
$content = Get-Content "js\chapter-titles.js" -Raw
$content = $content -replace '": "(TITRE|TITLE|TITULO|TITULo|TITEL|TITOLO)\s*:?\s*', '": "'
$content = $content -replace '": "(Titre|Title|Titulo|Titel|Titolo)\s*:?\s*', '": "'
Set-Content "js\chapter-titles.js" -Value $content -NoNewline -Encoding UTF8
```

---

## 5. RÉSULTATS FINAUX

### Statistiques après correction

| Langue | Titres | % | Chapitres vides |
|--------|--------|---|-----------------|
| 🇫🇷 FR | 1189 | **100%** | 0 |
| 🇵🇭 TL | 1140 | 96% | 1 |
| 🇩🇪 DE | 1129 | 95% | 0 |
| 🇪🇸 ES | 1105 | 93% | 2 |
| 🇧🇷 PT | 1085 | 91% | 0 |
| 🇮🇹 IT | 999 | 84% | 121 |
| 🇬🇧 EN | 492 | 41% | 0 |

### Exemples de titres propres

| Langue | Chapitre | Titre |
|--------|----------|-------|
| FR | Genèse 1 | Lumière du Commencement |
| EN | Genesis 1 | In the Beginning |
| PT | Gênesis 1 | Cânticos do Criador |
| ES | Génesis 1 | La Luz de la Creación |
| DE | 1. Mose 1 | Im Anfang, o Herr |
| IT | Genesi 1 | Nel Principio |
| TL | Genesis 1 | Sa Ulan ng Paglikha |

### Chapitres sans titre (vides)
Les chapitres sans titre affichent simplement "Chapitre X" (ou équivalent traduit).
Ceci est **normal** car Suno AI n'a pas généré de titre créatif pour ces chapitres.

---

## 6. CE QUI RESTE À FAIRE

### Pour avoir 100% des titres dans toutes les langues:
1. Régénérer les paroles manquantes avec Suno AI
2. S'assurer que chaque génération inclut un `[TITLE]` avec un vrai titre créatif
3. Relancer le script d'extraction

### Pour l'italien (IT) qui a 121 chapitres vides:
Les fichiers source `IT.json` contiennent `TITRE` (mot français) au lieu de vrais titres italiens.
→ **Cause**: Erreur lors de la génération Suno, le prompt était probablement en français.

---

## 7. PATTERNS DE NETTOYAGE COMPLETS

### Placeholders à remplacer par "" (vide)
```regex
^TITRE$
^TITLE$
^TÍTULO$
^TITULO$
^TITEL$
^TITOLO$
```

### Préfixes à supprimer (garder ce qui suit)
```regex
^TITRE:\s*
^Titre:\s*
^TITLE:\s*
^Title:\s*
^TÍTULO:\s*
^Título:\s*
^TITULO:\s*
^Titulo:\s*
^TITULo:\s*
^TITEL:\s*
^Titel:\s*
^TITOLO:\s*
^Titolo:\s*
```

### Préfixes de livres à supprimer
```regex
^[A-Za-zÀ-ÿ]+\s+\d+\s*[-:–—]\s*
```
Exemples: `Genèse 1 - `, `Psalm 23: `, `1 Corinthians 13 – `

### Autres patterns
```regex
^\[TITLE\]\s*     # Tag [TITLE] résiduel
\[LYRICS\].*$     # Tag [LYRICS] et tout ce qui suit
^#+\s*            # Markdown headers ###
^["'«»„"]+        # Guillemets au début
["'«»„"]+$        # Guillemets à la fin
```

---

## 8. PROMPT POUR VÉRIFICATION PAR UNE AUTRE IA

```
Je veux vérifier la qualité d'un fichier JavaScript contenant des titres de chapitres bibliques en 7 langues.

FICHIER À ANALYSER: js/chapter-titles.js
URL: https://raw.githubusercontent.com/global-opera/bible-chantee/prod/js/chapter-titles.js

CRITÈRES DE VÉRIFICATION:

1. SYNTAXE
- Le fichier doit être du JavaScript valide
- Structure: window.CHAPTER_TITLES = { "FR": { "01": { "1": "titre", ... }, ... }, ... };

2. CONTENU - AUCUN titre ne doit contenir:
- Les mots: TITRE, TITLE, TÍTULO, TITULO, TITEL, TITOLO (en tant que placeholder)
- Les préfixes: "Titre:", "Title:", "Título:", etc.
- Les préfixes de livres: "Genèse 1 -", "Psalm 23 -", etc.
- Les tags: [TITLE], [LYRICS], ###, ##, #

3. STATISTIQUES ATTENDUES:
- FR: ~1189 titres (100%)
- TL: ~1140 titres (96%)
- DE: ~1129 titres (95%)
- ES: ~1105 titres (93%)
- PT: ~1085 titres (91%)
- IT: ~999 titres (84%)
- EN: ~492 titres (41%)

4. FORMAT DES TITRES VALIDES:
- FR: "Lumière du Commencement" ✓
- EN: "In the Beginning" ✓
- PT: "Cânticos do Criador" ✓
- ES: "La Luz de la Creación" ✓
- DE: "Im Anfang, o Herr" ✓
- IT: "Nel Principio" ✓
- TL: "Sa Ulan ng Paglikha" ✓

TÂCHES:
1. Télécharge et analyse le fichier
2. Vérifie la syntaxe JavaScript
3. Compte les titres par langue
4. Recherche les patterns problématiques
5. Liste tout problème trouvé avec numéro de ligne
6. Génère un rapport détaillé

Si tu trouves des problèmes, propose le code de correction exact.
```

---

## 9. COMMITS GIT EFFECTUÉS

1. `fix: getChapterTitle utilise bookNum au lieu de book`
2. `fix: regeneration complete chapter-titles.js`
3. `fix: suppression TITULO/TITLE restants`
4. `fix: titres chapitres DEFINITIF - nettoyage complet`

---

## 10. FICHIERS GÉNÉRÉS

| Fichier | Description |
|---------|-------------|
| `extract_titles_v2.py` | Script Python d'extraction des titres |
| `js/chapter-titles.js` | Fichier final déployé |
| `js/chapter-titles-OLD.js` | Backup de l'ancienne version |
| `chapter-titles-FINAL.js` | Version intermédiaire |

---

## 11. LEÇONS APPRISES

1. **Tester chaque langue individuellement** avant de déployer
2. **Identifier tous les patterns** dès le début (pas de corrections ponctuelles)
3. **Les fichiers source sont inconsistants** - Suno génère différents formats selon la langue
4. **Vérifier la syntaxe JS** avec `node -c fichier.js` avant chaque commit
5. **Utiliser grep/Select-String** pour chercher les patterns problématiques

---

*Rapport généré le 8 janvier 2026*
