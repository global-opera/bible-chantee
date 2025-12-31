# Transcription MP3 avec Whisper AI

Script pour transcrire automatiquement les MP3 de la Bible Chantée en utilisant faster-whisper (modèle large-v3).

## Installation

```bash
cd Scripts
pip install -r requirements_whisper.txt
```

**Note**: Le téléchargement du modèle `large-v3` (~3 GB) se fait automatiquement au premier lancement.

## Configuration

Dans `transcribe_mp3_whisper.py`, modifiez ces variables selon vos besoins :

```python
MODEL_SIZE = "large-v3"  # large-v3 (meilleur qualité) ou medium, small
DEVICE = "auto"           # "cuda" pour GPU, "cpu" pour CPU
USE_LOCAL_FILES = True    # True = fichiers locaux, False = télécharger depuis R2
```

## Utilisation

### 1. Transcrire un seul chapitre

```bash
python transcribe_mp3_whisper.py
```

Par défaut, transcrit **Genèse 2 FR**. Pour changer, modifiez le `__main__` :

```python
if __name__ == '__main__':
    transcribe_chapter('01_GEN', 2, 'FR', overwrite=True)
```

### 2. Transcrire plusieurs chapitres en batch

```bash
python batch_transcribe.py
```

Éditez `batch_transcribe.py` pour configurer :

```python
BOOK_CODE = '01_GEN'
CHAPTERS = range(1, 51)  # Chapitres 1 à 50
LANG = 'FR'
OVERWRITE = False
```

### 3. Usage programmatique

```python
from transcribe_mp3_whisper import transcribe_chapter, batch_transcribe

# Un seul chapitre
result = transcribe_chapter('01_GEN', 2, 'FR', overwrite=True)
print(result)

# Plusieurs chapitres
batch_transcribe('01_GEN', range(1, 11), 'FR', overwrite=False)
```

## Format de sortie

Les paroles transcrites sont sauvegardées dans :
```
V3/lyrics/{LANG}/{BOOK_CODE}/{BOOK_CODE}_{CHAPTER}_{LANG}.txt
```

Exemple : `V3/lyrics/FR/01_GEN/01_GEN_02_FR.txt`

Format du fichier :
```
[TITLE]
Genèse 2

[LYRICS]
[Verse 1]
Dans le silence d'un matin
Les cieux et la terre par ta main
...
```

## Performance

- **large-v3** : ~2-5 minutes par chapitre (~3 min d'audio) - Meilleure qualité
- **medium** : ~1-2 minutes par chapitre - Bonne qualité
- **small** : ~30-60 secondes par chapitre - Qualité acceptable

Avec GPU (CUDA) : 3-10x plus rapide

## Codes de livres

```
01_GEN = Genèse (50 chapitres)
02_EXO = Exode (40 chapitres)
03_LEV = Lévitique (27 chapitres)
04_NUM = Nombres (36 chapitres)
05_DEU = Deutéronome (34 chapitres)
06_JOS = Josué (24 chapitres)
...
```

## Langues supportées

- FR (Français)
- EN (Anglais)
- PT (Portugais)
- ES (Espagnol)
- DE (Allemand)
- IT (Italien)

## Dépannage

### Erreur "Fichier local introuvable"

Vérifiez que le MP3 existe dans :
```
C:\ScriptBible\bible-chantee\V3\audio\FR\01_GEN\01_GEN_02_FR.mp3
```

### Erreur "OutOfMemoryError"

Réduisez le modèle :
```python
MODEL_SIZE = "medium"  # ou "small"
```

### Lenteur

Utilisez un GPU si disponible :
```python
DEVICE = "cuda"
```

Ou réduisez le modèle pour plus de rapidité.

## Notes

- Le script détecte automatiquement la structure (Verse, Chorus, Bridge)
- La première transcription télécharge le modèle (~3 GB)
- Les transcriptions suivantes sont plus rapides (modèle en cache)
- Le paramètre `overwrite=True` écrase les fichiers existants
