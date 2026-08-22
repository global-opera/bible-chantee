# 🎵 BibleChantée - La Bible en Musique Worship

> **Projet de mise en musique complète de la Bible en français et 6 autres langues**

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Suno API](https://img.shields.io/badge/Suno-API-orange.svg)](https://sunoapi.org)

## 📖 Vue d'ensemble

**BibleChantée** transforme chaque chapitre de la Bible en une chanson worship francophone unique, générée par intelligence artificielle via l'API Suno. Le projet vise à créer **1189 chansons en français** et **8,323 chansons au total** dans 7 langues.

### 🎯 Objectifs

- ✅ **1189 chapitres** de la Bible en français
- ✅ **7 langues** supportées (FR, EN, ES, PT, IT, DE, TL)
- ✅ **Génération automatisée** via API Suno
- ✅ **Qualité professionnelle** - Modèle V4_5ALL
- ✅ **Distribution publique** via Archive.org & GitHub Pages

### 🌐 Démo en ligne

**🔗 [bible-chantee.github.io](https://bible-chantee.github.io)** *(À configurer)*

Écoutez gratuitement toutes les chansons générées, parcourez par livre/chapitre, et consultez les paroles.

---

## 🚀 Fonctionnalités

### ✨ Génération Automatique
- **Script Python complet** pour génération en masse
- **Gestion des crédits API** automatique
- **Reprise après interruption** - Skip des fichiers existants
- **Logs détaillés** de progression

### 🎼 Qualité Musicale
- **Style Worship français** adapté à chaque passage
- **Structures professionnelles** (Verse, Chorus, Bridge, Outro)
- **Durée optimale** (~3-5 minutes par chapitre)
- **Voix claire** et instrumentation équilibrée

### 📚 Multilingue
- **7 langues** avec traductions automatiques (GPT-4)
- **Adaptation culturelle** des styles musicaux
- **Lyrics optimisés** pour chaque langue

### 🎧 Interface Web
- **Lecteur audio intégré** avec navigation
- **Affichage des paroles** synchronisé
- **Recherche par livre/chapitre**
- **Design responsive** (mobile-friendly)

---

## 📂 Structure du Projet

```
01 BibleChantee/
├── Lyrics/                    # Paroles par langue et livre
│   ├── FR/
│   │   ├── 01_GEN/           # Genèse (50 chapitres)
│   │   ├── 02_EXO/           # Exode (40 chapitres)
│   │   └── ...               # 66 livres au total
│   ├── EN/, ES/, PT/...      # 6 autres langues
│
├── Suno_Output/              # MP3 générés par Suno API
│   ├── FR/
│   │   ├── 01_GEN/
│   │   │   ├── 01_GEN_01.mp3
│   │   │   └── ...
│   │   └── ...
│   └── EN/, ES/, PT/...
│
├── Scripts/                  # Scripts Python de génération
│   ├── suno_api_generator.py         # Générateur principal
│   ├── generate_lyrics_fr.py         # Génération lyrics FR
│   ├── translate_from_fr_to_all.py   # Traduction multilingue
│   ├── test_suno_minimal.py          # Tests API
│   ├── launch_complete_bible_fr.py   # Lanceur Bible complète
│   └── ROBOT_*.py                    # Robots PyAutoGUI (legacy)
│
├── docs/                     # Documentation
│   ├── SUNO_API_GUIDE.md
│   ├── SUNO_API_REFERENCE.md
│   ├── COMPARAISON_ROBOTS_VS_API.md
│   └── GUIDE_CLE_EXISTANTE.md
│
├── web/                      # Site web GitHub Pages
│   ├── index.html           # Page principale
│   ├── lyrics-data.js       # Données des paroles
│   └── audio-urls.js        # URLs Archive.org
│
└── README.md                 # Ce fichier
```

---

## 🛠️ Installation

### Prérequis

```bash
# Python 3.8+
python --version

# Dépendances
pip install requests openai pathlib
```

### Configuration API

```powershell
# 1. Clé API Suno (requise)
$env:SUNO_API_KEY = "votre-cle-ici"

# 2. Clé API OpenAI (optionnelle, pour traductions)
$env:OPENAI_API_KEY = "votre-cle-ici"

# 3. Permanent (recommandé)
[System.Environment]::SetEnvironmentVariable('SUNO_API_KEY', 'votre-cle', 'User')
```

### Vérification

```bash
cd "G:\Mon Drive\01 BibleChantee\Scripts"
python verify_suno_api_key.py
```

---

## 📖 Utilisation

### 1️⃣ Générer un Livre

```python
from suno_api_generator import process_book
from api_key import SUNO_API_KEY

# Genèse (50 chapitres)
process_book("FR", "01_GEN", SUNO_API_KEY, start_chapter=1)
```

### 2️⃣ Générer la Bible Complète

```bash
python launch_complete_bible_fr.py
```

**Temps estimé:** 40-60 heures
**Coût:** ~14,268 crédits Suno (~3-4€)

### 3️⃣ Tester avec un Chapitre

```bash
python test_single_chapter.py
```

### 4️⃣ Traduire dans Toutes les Langues

```python
from translate_from_fr_to_all import translate_all_languages

translate_all_languages()  # FR → 6 autres langues
```

---

## 🎨 API Suno - Paramètres

```python
generator.generate_song(
    lyrics="[Verse]\nDans le commencement...",
    style="French worship, acoustic guitar, 72 BPM",
    title="La Création",
    model="V4_5ALL",           # Meilleur modèle structure
    styleWeight=0.65,          # Fidélité au style
    weirdnessConstraint=0.65,  # Créativité modérée
    audioWeight=0.65           # Qualité audio
)
```

### Modèles Disponibles

| Modèle | Prompt | Style | Titre | Recommandation |
|--------|--------|-------|-------|----------------|
| V4 | 3000 | 200 | 80 | Basique |
| V4_5 | 5000 | 1000 | 100 | Standard |
| **V4_5ALL** | 5000 | 1000 | 80 | **✅ Recommandé** |
| V5 | 5000 | 1000 | 100 | Premium |

---

## 📊 Statistiques du Projet

### Progression Actuelle

| Catégorie | FR | Total (7 langues) |
|-----------|----|--------------------|
| **Chapitres totaux** | 1,189 | 8,323 |
| **Générés** | *En cours* | *En cours* |
| **Durée estimée** | ~60h | ~420h |
| **Coût Suno** | ~14,268 crédits | ~99,876 crédits |

### Livres de la Bible

- **Ancien Testament:** 39 livres, 929 chapitres
- **Nouveau Testament:** 27 livres, 260 chapitres
- **Total:** 66 livres, 1,189 chapitres

---

## 🌍 Langues Supportées

| Code | Langue | Statut | Chapitres |
|------|--------|--------|-----------|
| **FR** | Français | ✅ En cours | 1,189 |
| EN | Anglais | 📝 Traduction | 1,189 |
| ES | Espagnol | 📝 Traduction | 1,189 |
| PT | Portugais | 📝 Traduction | 1,189 |
| IT | Italien | 📝 Traduction | 1,189 |
| DE | Allemand | 📝 Traduction | 1,189 |
| NL | Néerlandais | 📝 Traduction | 1,189 |
| PL | Polonais | 📝 Traduction | 1,189 |
| RO | Roumain | 📝 Traduction | 1,189 |
| HI | Hindi | 📝 Traduction | 1,189 |
| AR | Arabe | 📝 Traduction | 1,189 |
| ZH | Chinois | 📝 Traduction | 1,189 |

---

## 🤝 Contribution

Ce projet est personnel mais ouvert aux suggestions!

### Comment Aider

1. **Signaler des bugs** via GitHub Issues
2. **Proposer des améliorations** de styles musicaux
3. **Vérifier les traductions** (locuteurs natifs)
4. **Partager le projet** 🎵

---

## 📜 Licence

### Musique & Paroles
**CC BY-NC 4.0** - Creative Commons Attribution-NonCommercial 4.0
✅ Utilisation personnelle
✅ Partage libre
❌ Usage commercial

### Code Source
**MIT License** - Libre utilisation et modification

---

## 🙏 Remerciements

- **[Suno AI](https://suno.ai)** - Génération musicale
- **[SunoAPI.org](https://sunoapi.org)** - API non-officielle
- **[OpenAI](https://openai.com)** - Traductions GPT-4
- **[Archive.org](https://archive.org)** - Hébergement audio gratuit
- **La Communauté Open Source** 💙

---

## 📞 Contact

**Projet:** BibleChantée
**GitHub:** [bible-chantee](https://github.com/votre-username/bible-chantee)
**Email:** contact@biblechantee.org *(À configurer)*

---

## 🔗 Liens Utiles

- 📖 **Documentation:** [docs/](./docs/)
- 🎵 **Écouter en ligne:** [bible-chantee.github.io](https://bible-chantee.github.io)
- 📦 **Archive.org:** [archive.org/details/bible-chantee](https://archive.org/details/bible-chantee)
- 🐛 **Issues:** [GitHub Issues](https://github.com/votre-username/bible-chantee/issues)

---

<div align="center">

**🎵 Que toute la Bible chante la gloire de Dieu! 🎵**

Made with ❤️ and AI
© 2024 BibleChantée Project

</div>
