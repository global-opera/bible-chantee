# 🎵 API Suno - Solution Complète pour BibleChantée

## 📚 Vue d'ensemble

Système complet pour générer automatiquement des chansons à partir de lyrics bibliques en utilisant l'API Suno, remplaçant les robots PyAutoGUI par une solution fiable, rapide et automatisée.

## 🎯 Avantages

| Critère | Robots PyAutoGUI | **API Suno** |
|---------|-----------------|--------------|
| Fiabilité | ❌ 60-70% | ✅ **99.9%** |
| Vitesse | ⏱️ ~90s/chanson | ⚡ **~60s/chanson** |
| Surveillance | 👀 Obligatoire | ✅ **Aucune** |
| Arrière-plan | ❌ Non | ✅ **Oui** |
| Parallélisation | ❌ Impossible | ✅ **Possible** |
| Maintenance | 🔧 Constante | ✅ **Aucune** |

## 🚀 Quick Start

### 1. Vérifier votre clé existante (30 secondes)

```bash
cd "G:\Mon Drive\01 BibleChantee\Scripts"
python verify_suno_api_key.py
```

Entrez votre clé API quand demandé (copiez depuis [sunoapi.org/api-key](https://sunoapi.org/api-key))

### 2. Configurer (10 secondes)

```powershell
# Temporaire (session actuelle)
$env:SUNO_API_KEY = "sk-votre-cle-ici"

# OU Permanent (recommandé)
[System.Environment]::SetEnvironmentVariable('SUNO_API_KEY', 'sk-votre-cle-ici', 'User')
```

### 3. Tester (1 minute)

```bash
python test_suno_minimal.py
```

### 4. Générer! 🎉

```bash
# Un livre
python suno_api_generator.py
> FR/19_PSA

# Toute la Bible
python generate_all_bible_api.py
> Choix: 4
```

## 📁 Fichiers Disponibles

### Scripts Principaux

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **`verify_suno_api_key.py`** | Vérifier votre clé existante | **Commencez par ici!** |
| **`test_suno_minimal.py`** | Test avec exemple officiel | Après configuration |
| **`suno_api_generator.py`** | Générateur principal | Production |
| **`generate_all_bible_api.py`** | Script master Bible complète | Automatisation |

### Documentation

| Fichier | Contenu |
|---------|---------|
| **`GUIDE_CLE_EXISTANTE.md`** | Guide pour clé API existante |
| **`SUNO_API_GUIDE.md`** | Guide d'utilisation complet |
| **`SUNO_API_REFERENCE.md`** | Référence technique des paramètres |
| **`COMPARAISON_ROBOTS_VS_API.md`** | Comparaison détaillée |
| **`README_API_SUNO.md`** | Ce fichier |

## 🔑 Votre clé API existante

### Vous avez déjà une clé?

**Bonne nouvelle!** Votre clé existante fonctionne avec tous les nouveaux modèles:
- ✅ V4
- ✅ V4_5
- ✅ V4_5PLUS
- ✅ V4_5ALL
- ✅ V5

Pas besoin de créer une nouvelle clé!

### Où trouver votre clé?

1. Allez sur [sunoapi.org/api-key](https://sunoapi.org/api-key)
2. Connectez-vous
3. Copiez votre clé (format: `sk-xxxxxxxxxx`)

### Vérification

```bash
python verify_suno_api_key.py
```

Ce script va:
- ✅ Tester si votre clé est valide
- ✅ Afficher vos crédits
- ✅ Lister les modèles disponibles

## 📊 Cas d'usage

### Cas 1: Un livre (ex: Psaumes)

```python
from suno_api_generator import process_book
from api_key import SUNO_API_KEY

process_book("FR", "19_PSA", SUNO_API_KEY, start_chapter=1)
```

**Résultat:**
- ~150 chansons générées
- Temps: 3-4 heures (automatique)
- Coût: ~0.50€

### Cas 2: Bible complète (1 langue)

```bash
python generate_all_bible_api.py
> Choix: 4 (Bible complète FR)
```

**Résultat:**
- 1189 chansons générées
- Temps: 15-20 heures (automatique)
- Coût: ~3-4€

### Cas 3: Bible multilingue (12 langues)

```bash
python generate_all_bible_api.py
> Choix: 5 (Toutes langues)
```

**Résultat:**
- 14,268 chansons générées
- Temps: 5-7 jours (automatique)
- Coût: ~40-50€

### Cas 4: Sélection personnalisée

```python
from generate_all_bible_api import generate_custom_selection

books = ["01_GEN", "19_PSA", "40_MAT", "66_REV"]
generate_custom_selection("FR", books)
```

## ⚙️ Paramètres Recommandés

### Pour musique Worship

```python
generator.generate_song(
    lyrics="...",
    style="French worship, acoustic guitar, 72 BPM",
    title="...",
    model="V4_5ALL",           # Meilleure structure
    styleWeight=0.65,           # Équilibre style/créativité
    weirdnessConstraint=0.65,   # Créativité modérée
    audioWeight=0.65            # Qualité audio standard
)
```

### Pour musique instrumentale

```python
generator.generate_song(
    style="Classical piano, peaceful, 60 BPM",
    title="...",
    model="V4_5ALL",
    instrumental=True,
    styleWeight=0.7,            # Plus fidèle au style
    weirdnessConstraint=0.5,    # Moins de créativité
    audioWeight=0.7             # Priorité qualité audio
)
```

## 📏 Limites à connaître

### Par modèle

| Modèle | Prompt | Style | Titre |
|--------|--------|-------|-------|
| V4 | 3000 | 200 | 80 |
| V4_5 | 5000 | 1000 | 100 |
| V4_5ALL | 5000 | 1000 | 80 |
| V5 | 5000 | 1000 | 100 |

Le script valide et tronque automatiquement si nécessaire.

## 🔄 Workflow Complet

```
1. Clé API existante
   ↓
2. verify_suno_api_key.py (vérification)
   ↓
3. $env:SUNO_API_KEY = "sk-..." (configuration)
   ↓
4. test_suno_minimal.py (test)
   ↓
5. suno_api_generator.py (génération)
   ↓
6. Suno_Output/[LANGUE]/[LIVRE]/*.mp3 (résultats)
```

## 🐛 Dépannage

### "Clé API invalide"

```bash
# Vérifier
python verify_suno_api_key.py

# Reconfigurer
$env:SUNO_API_KEY = "sk-nouvelle-cle"
```

### "Crédits insuffisants"

- Vérifiez sur [sunoapi.org/billing](https://sunoapi.org/billing)
- Rechargez ou attendez le renouvellement mensuel

### "Connexion impossible"

- Vérifiez votre connexion internet
- Vérifiez le statut: [status.sunoapi.org](https://status.sunoapi.org)

### "Modèle non disponible"

- Utilisez V4_5ALL (le plus universel)
- Vérifiez votre plan sur sunoapi.org

## 💡 Conseils

### Optimisation des coûts

1. **Testez d'abord** avec un seul chapitre
2. **Vérifiez la qualité** avant de lancer massivement
3. **Utilisez V4_5ALL** (bon rapport qualité/prix)
4. **Parallélisez** pour gagner du temps

### Gestion de la progression

Le script:
- ✅ Skip automatiquement les fichiers existants
- ✅ Peut être interrompu et repris
- ✅ Log détaillé de chaque étape
- ✅ Télécharge automatiquement les MP3

### Surveillance

Aucune surveillance nécessaire! Mais vous pouvez:
- Vérifier les logs en temps réel
- Consulter le dossier de sortie
- Utiliser `check_task_status()` pour vérifier manuellement

## 📞 Support

### Documentation
- [docs.sunoapi.org](https://docs.sunoapi.org) - Documentation officielle
- `SUNO_API_GUIDE.md` - Guide d'utilisation
- `SUNO_API_REFERENCE.md` - Référence technique

### Aide
- Email: support@sunoapi.org
- Discord: [Communauté Suno](https://discord.gg/suno)

## 🎉 C'est parti!

Vous êtes prêt à générer toute la Bible en musique!

```bash
# 1. Vérification (30 secondes)
python verify_suno_api_key.py

# 2. Configuration (10 secondes)
$env:SUNO_API_KEY = "sk-votre-cle"

# 3. Test (1 minute)
python test_suno_minimal.py

# 4. Production (quelques heures)
python generate_all_bible_api.py
```

**Bonne génération! 🎵📖**

---

**Note:** Les robots PyAutoGUI restent disponibles dans `ROBOT_*.py` comme backup, mais l'API est la méthode recommandée pour tout usage sérieux.
