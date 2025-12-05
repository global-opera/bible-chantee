# Guide d'utilisation de l'API Suno

## 🎯 Pourquoi l'API au lieu des robots?

| Avantage | Robots PyAutoGUI | **API Suno** |
|----------|-----------------|--------------|
| **Fiabilité** | ❌ Fragile (calibration, bugs visuels) | ✅ **Stable et robuste** |
| **Vitesse** | ⏱️ ~90s entre chaque + attente manuelle | ⚡ **Parallélisable** |
| **Maintenance** | 🔧 Recalibration fréquente | ✅ **Aucune maintenance** |
| **Arrière-plan** | ❌ Doit rester devant l'écran | ✅ **Tourne en background** |
| **Reprise** | ❌ Difficile après interruption | ✅ **Facile avec task IDs** |
| **Surveillance** | 👀 Doit surveiller | ✅ **Autonome** |

## 📋 Prérequis

### 1. Obtenir une clé API Suno

1. Créez un compte sur [sunoapi.org](https://sunoapi.org)
2. Allez sur la [page de gestion des clés API](https://sunoapi.org/api-key)
3. Générez une nouvelle clé API
4. Copiez la clé (format: `sk-xxxxxxxxxxxxx`)

### 2. Configurer la clé API

La clé SUNO_API_KEY est déjà configurée dans le système de variables d'environnement.

**Méthode 1: Via PowerShell (recommandé)**
```powershell
$env:SUNO_API_KEY = "sk-votre-cle-ici"
```

**Méthode 2: Permanente (Windows)**
```powershell
[System.Environment]::SetEnvironmentVariable('SUNO_API_KEY', 'sk-votre-cle-ici', 'User')
```

**Vérification:**
```powershell
python test_suno_api.py
```

## 🚀 Utilisation

### Mode interactif

```bash
cd "G:\Mon Drive\01 BibleChantee\Scripts"
python suno_api_generator.py
```

Le script vous demandera:
- Quel livre générer (ex: `FR/01_GEN`)
- À partir de quel chapitre (défaut: 1)

### Mode programmé

```python
from suno_api_generator import process_book
from api_key import SUNO_API_KEY

# Générer Genèse en français, chapitres 1 à 50
process_book("FR", "01_GEN", SUNO_API_KEY, start_chapter=1)

# Générer Psaumes en anglais, à partir du chapitre 100
process_book("EN", "19_PSA", SUNO_API_KEY, start_chapter=100)
```

### Traitement en masse

```python
from suno_api_generator import process_book, SunoAPIGenerator
from api_key import SUNO_API_KEY

# Liste des livres à traiter
books = ["01_GEN", "02_EXO", "19_PSA", "40_MAT"]

generator = SunoAPIGenerator(SUNO_API_KEY)
credits = generator.check_credits()
print(f"Crédits disponibles: {credits}")

for book in books:
    print(f"\n{'='*70}")
    print(f"  Traitement: {book}")
    print(f"{'='*70}")

    process_book("FR", book, SUNO_API_KEY, start_chapter=1)
```

## 📁 Structure des fichiers générés

```
G:\Mon Drive\01 BibleChantee\
  Suno_Output/
    FR/
      01_GEN/
        01_GEN_01.mp3
        01_GEN_02.mp3
        ...
    EN/
      40_MAT/
        40_MAT_01.mp3
        ...
```

## 🔧 Paramètres disponibles

### Modèles Suno

- **V4**: Qualité vocale améliorée, jusqu'à 4 minutes
- **V4_5**: Meilleure compréhension du prompt, jusqu'à 8 minutes (défaut)
- **V4_5PLUS**: Variation tonale avancée, jusqu'à 8 minutes
- **V5**: Modèle de pointe le plus récent

### Styles musicaux

Les styles sont extraits automatiquement de la section `[STYLE]` de vos fichiers lyrics:

```
[STYLE]
French worship, acoustic guitar, 72 BPM, contemplative
```

## 💰 Estimation des coûts

L'API Suno utilise un système de crédits. Consultez [docs.sunoapi.org](https://docs.sunoapi.org) pour les tarifs actuels.

**Estimation pour la Bible complète (66 livres):**
- 1189 chapitres à générer
- Durée moyenne: 3-4 minutes par chanson
- Vérifiez vos crédits avant de lancer des générations massives

## 🔄 Comparaison des workflows

### Ancien workflow (Robots PyAutoGUI)

1. ❌ Calibrer les positions de clic
2. ❌ Lancer le robot
3. ❌ Ne pas toucher la souris pendant des heures
4. ❌ Surveiller pour éviter les erreurs
5. ❌ Recalibrer si l'écran change
6. ❌ Difficile de reprendre après interruption

### Nouveau workflow (API Suno) ✅

1. ✅ Configurer la clé API une seule fois
2. ✅ Lancer le script
3. ✅ Laisser tourner en arrière-plan
4. ✅ Reprendre automatiquement après interruption
5. ✅ Téléchargement automatique des MP3
6. ✅ Aucune maintenance

## 📊 Monitoring

Le script affiche en temps réel:
- Crédits disponibles
- Progression (chapitre X/Y)
- Statut de génération
- URL de téléchargement
- Erreurs éventuelles

## ⚠️ Gestion des erreurs

Le script gère automatiquement:
- ✅ Timeout de génération (max 3 minutes par défaut)
- ✅ Échec de génération (passe au suivant)
- ✅ Fichiers déjà existants (skip automatique)
- ✅ Perte de connexion (retry)

## 🆘 Dépannage

### "SUNO_API_KEY n'est pas définie"

```powershell
# Vérifier
echo $env:SUNO_API_KEY

# Reconfigurer
$env:SUNO_API_KEY = "sk-votre-cle"
```

### "Impossible de se connecter à l'API"

1. Vérifiez votre connexion internet
2. Vérifiez que la clé API est valide
3. Consultez le statut de l'API: [status.sunoapi.org](https://status.sunoapi.org)

### "Crédits insuffisants"

Rechargez vos crédits sur [sunoapi.org/billing](https://sunoapi.org/billing)

## 📚 Ressources

- [Documentation API Suno](https://docs.sunoapi.org/)
- [Guide de démarrage rapide](https://docs.sunoapi.org/suno-api/quickstart)
- [Support technique](mailto:support@sunoapi.org)
- [Exemples GitHub](https://github.com/gcui-art/suno-api)

## 🎵 Prochaines étapes

1. ✅ Configurer votre clé API
2. ✅ Tester avec un seul chapitre
3. ✅ Générer un livre complet
4. ✅ Automatiser la Bible complète en 12 langues!

---

**Note:** Les robots PyAutoGUI restent disponibles dans le dossier `Scripts/ROBOT_*.py` comme backup, mais l'API est la méthode recommandée.
