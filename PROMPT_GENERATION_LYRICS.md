# 🎵 PROMPT DE GÉNÉRATION DES LYRICS - BIBLE CHANTÉE

## Modèle utilisé
**GPT-4o-mini** (OpenAI API)

## Script source
`G:\Mon Drive\01 BibleChantee\Scripts\generate_multilingual_correct.py`

---

## PROMPT PRINCIPAL (Génération Lyrics)

```
You are creating worship song lyrics in {lang_name} ({lang_code}) for {country}.

FORGET about French content. START FROM ZERO with this {lang_name} Bible text.

BIBLICAL TEXT (source: {lang_name} Bible - your ONLY source):
{biblical_text}

FORMAT STANDARD (length\structure only - NOT content):
- Structure: {structure_description}
- Music style: {adapted_style}

CRITICAL INSTRUCTIONS:
1. READ the {lang_name} biblical text above
2. CREATE new poetic worship lyrics based ONLY on this {lang_name} text
3. IGNORE any French wording - you don't need it
4. USE theological terms and phrases from the {lang_name} Bible tradition
5. FOLLOW the format standard (number of sections and approximate length)
6. WRITE as if this {lang_name} Bible was your ONLY source from the beginning
7. ADAPT to the cultural worship style of {country}

Think: "I'm starting fresh with the {lang_name} Bible, following a format template"
NOT: "I'm translating French lyrics"

Output format:
[Couplet 1]
...{lang_name} lyrics from {lang_name} Bible...

[Refrain]
...{lang_name} lyrics from {lang_name} Bible...

[Couplet 2]
...{lang_name} lyrics from {lang_name} Bible...

[Refrain]
...{lang_name} lyrics from {lang_name} Bible...

[Pont]
...{lang_name} lyrics from {lang_name} Bible...

[Refrain]
...{lang_name} lyrics from {lang_name} Bible...
```

**Paramètres API:**
- Model: `gpt-4o-mini`
- Temperature: `0.7`

---

## PROMPT TITRE (Génération Titre)

```
Create a short, poetic worship song title in {lang_name} ({lang_code}) for:
Bible book: {book_name}, Chapter {chapter_num}

Keep it short (2-4 words), poetic, and appropriate for Christian worship.
Output ONLY the title, nothing else.
```

**Paramètres API:**
- Model: `gpt-4o-mini`
- Temperature: `0.7`

---

## VARIABLES UTILISÉES

### {lang_name}
Nom de la langue (ex: "French", "English", "Portuguese")

### {lang_code}
Code ISO de la langue (ex: "FR", "EN", "PT")

### {country}
Pays associé (ex: "France", "United States", "Brazil")

### {biblical_text}
Texte biblique complet du chapitre dans la langue cible, extrait de:
- FR: `fr_bible_segond1910.json`
- EN: `en_bible_kjv_1611.json`
- PT: `pt_bible_acf.json`
- ES: `es_bible_rv1909.json`
- DE: `de_bible_luther1912.json`
- IT: `it_bible_riveduta.json`

### {structure_description}
Description de la structure (ex: "3 verses, chorus between each, final bridge")

### {adapted_style}
Style musical adapté selon le type de texte:
- Narratif → Epic storytelling, cinematic
- Louange → Joyful praise, uplifting
- Sagesse → Contemplative, gentle
- Prophétique → Powerful, dramatic
- Prière → Intimate, worshipful

---

## STYLES MUSICAUX PAR DÉFAUT

### Français (FR)
```
worship français moderne, 80 BPM, piano acoustique, cordes légères,
voix masculine chaleureuse, style variété française,
ton contemplatif et respectueux
```

### Anglais (EN)
```
contemporary worship, 80 BPM, acoustic piano, soft strings,
warm male vocals, modern Christian style,
contemplative and reverent tone
```

### Portugais (PT)
```
louvor contemporâneo brasileiro, 80 BPM, violão, piano suave,
voz masculina calorosa, estilo MPB gospel,
tom contemplativo e reverente
```

---

## ANALYSE ÉMOTIONNELLE (FR V2)

Pour FR V2, le script utilise `emotional_tone_analyzer.py` qui enrichit le style:

```python
tone = analyze_tone(lyrics, lang)
tone_style = get_tone_style(tone)
enhanced_style = f"{base_style}, {tone_style}"
```

Tons détectés:
- **Joie/Célébration** → "joyful, celebratory, uplifting"
- **Lamentations** → "sorrowful, mournful, introspective"
- **Prière** → "intimate, prayerful, gentle"
- **Prophétique** → "powerful, dramatic, intense"

---

## EXEMPLE COMPLET (Genèse 1 - FR)

**Input:**
- Book: 01_GEN
- Chapter: 1
- Lang: FR
- Biblical text: "Au commencement, Dieu créa les cieux et la terre..."

**Output généré:**
```
[Verse 1]
Au commencement, Dieu créa les cieux et la terre.
La terre était informe et vide:
il y avait des ténèbres à la surface de l'abîme,
et l'esprit de Dieu se mouvait au-dessus des eaux.
Dieu dit:

[Verse 2]
Que la lumière soit!
Et la lumière fut.
Dieu vit que la lumière était bonne;
et Dieu sépara la lumière d'avec les ténèbres.

[Pre-Chorus]
il y avait des ténèbres à la surface de l'abîme,
et l'esprit de Dieu se mouvait au-dessus des eaux.
Au commencement, Dieu créa les cieux et la terre.

[Chorus]
Au commencement, Dieu créa les cieux et la terre.
Au commencement, Dieu créa les cieux et la terre.

[Verse 3]
Dieu appela la lumière jour, et il appela les ténèbres nuit.
Ainsi, il y eut un soir, et il y eut un matin:
ce fut le premier jour.
Dieu dit:

[Bridge]
Qu'il y ait une étendue entre les eaux,
et qu'elle sépare les eaux d'avec les eaux.
Et Dieu fit l'étendue, et il sépara les eaux...
Dieu appela l'étendue ciel.

[Final Chorus]
Au commencement, Dieu créa les cieux et la terre.
Au commencement, Dieu créa les cieux et la terre.

[STYLE]
epic orchestral worship, 90 BPM, orchestral strings, piano,
French horn, timpani, French modern chanson, variété française,
male vocal warm tenor, clear diction,
cinematic film score atmosphere, reverent tone

[TITLE]
Au commencement
```

---

## FICHIERS DE SORTIE

Format final: `{BOOK}_{CHAPTER:03d}_{LANG}.txt`

Exemple: `01_GEN_001_FR.txt`

Sections dans le fichier:
1. `[LYRICS]` - Paroles avec tags [Verse], [Chorus], etc.
2. `[STYLE]` - Style musical pour Suno API
3. `[TITLE]` - Titre du chant

---

## NOTES IMPORTANTES

1. **Pas de traduction** - Le prompt insiste sur la création originale depuis le texte biblique dans la langue cible
2. **Théologie locale** - Utilise les termes théologiques de la tradition biblique de chaque langue
3. **Adaptation culturelle** - Le style musical s'adapte au pays (ex: MPB pour le Brésil)
4. **Structure flexible** - Nombre de couplets variable selon la longueur du chapitre biblique
5. **Tags de structure** - [Verse], [Chorus], [Bridge], [Pre-Chorus], [Outro], [Intro]

---

## EVOLUTION V1 → V2 (FR)

**V1:**
- Style musical fixe
- Pas d'analyse émotionnelle
- Structure standard

**V2:**
- **Style musical à 3 couches:**
  1. Base style (worship français moderne)
  2. Type de texte (narratif, louange, sagesse, prophétie)
  3. Analyse émotionnelle (joie, lamentation, prière, etc.)
- **Analyse du contenu biblique** pour adapter le style
- **Ton plus précis** selon l'émotion du passage

---

Généré le: 2026-01-17
Script source: `generate_multilingual_correct.py`
