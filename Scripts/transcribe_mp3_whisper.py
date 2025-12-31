"""
Script de transcription MP3 avec Whisper AI
Utilise faster-whisper (modèle large-v3) pour transcrire les MP3 depuis R2
et sauvegarder les paroles dans V3/lyrics/
"""
import sys
import io
import requests
import tempfile
from pathlib import Path
from faster_whisper import WhisperModel
import re

# Configurer l'encodage UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configuration
R2_BASE = 'https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/V3'
LOCAL_AUDIO_DIR = Path(r"C:\ScriptBible\bible-chantee\V3\audio")
OUTPUT_DIR = Path(r"C:\ScriptBible\bible-chantee\V3\lyrics")
MODEL_SIZE = "large-v3"
DEVICE = "cpu"  # "cuda" pour GPU, "cpu" pour CPU, "auto" pour auto-détection
USE_LOCAL_FILES = True  # True pour utiliser les fichiers locaux, False pour R2

# Mapping des codes de livres
BOOK_NAMES = {
    '01_GEN': 'Genèse',
    '02_EXO': 'Exode',
    '03_LEV': 'Lévitique',
    '04_NUM': 'Nombres',
    '05_DEU': 'Deutéronome',
    '06_JOS': 'Josué',
    '07_JDG': 'Juges',
    '08_RUT': 'Ruth',
    '09_1SA': '1 Samuel',
    '10_2SA': '2 Samuel',
    '11_1KI': '1 Rois',
    '12_2KI': '2 Rois',
    '13_1CH': '1 Chroniques',
    '14_2CH': '2 Chroniques',
    '15_EZR': 'Esdras',
    '16_NEH': 'Néhémie',
    '17_EST': 'Esther',
    '18_JOB': 'Job',
    '19_PSA': 'Psaumes',
    # ... ajoutez les autres livres si nécessaire
}


def get_mp3_data(book_code, chapter, lang='FR'):
    """Récupère les données MP3 (local ou R2)"""
    filename = f"{book_code}_{chapter:02d}_{lang}.mp3"

    # Utiliser les fichiers locaux si configuré
    if USE_LOCAL_FILES:
        local_path = LOCAL_AUDIO_DIR / lang / book_code / filename
        print(f"[LOCAL] Lecture de {local_path}...")

        if local_path.exists():
            with open(local_path, 'rb') as f:
                data = f.read()
            print(f"  [OK] Fichier local lu ({len(data) / 1024 / 1024:.1f} MB)")
            return data
        else:
            raise FileNotFoundError(f"Fichier local introuvable: {local_path}")

    # Sinon, télécharger depuis R2
    print(f"[DOWNLOAD] Téléchargement de {filename} depuis R2...")

    possible_urls = [
        f"{R2_BASE}/audio/{lang}/{book_code}/{filename}",
        f"{R2_BASE}/{lang}/{book_code}/{filename}",
    ]

    for url in possible_urls:
        try:
            print(f"  Essai: {url}")
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                print(f"  [OK] Téléchargé ({len(response.content) / 1024 / 1024:.1f} MB)")
                return response.content
        except Exception as e:
            print(f"  [ERREUR] {e}")
            continue

    raise Exception(f"Impossible de télécharger {filename} depuis R2")


def transcribe_audio(audio_data, language='fr'):
    """Transcrit l'audio avec faster-whisper"""
    print(f"[WHISPER] Chargement du modèle {MODEL_SIZE}...")

    # Charger le modèle
    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type="int8")

    # Sauvegarder temporairement l'audio
    with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp_file:
        tmp_file.write(audio_data)
        tmp_path = tmp_file.name

    try:
        print(f"[WHISPER] Transcription en cours...")
        segments, info = model.transcribe(
            tmp_path,
            language=language,
            beam_size=5,
            word_timestamps=True,
            vad_filter=True,  # Voice Activity Detection pour meilleure qualité
            vad_parameters=dict(min_silence_duration_ms=500)
        )

        print(f"[WHISPER] Langue détectée: {info.language} (probabilité: {info.language_probability:.2f})")

        # Récupérer tous les segments
        full_text = []
        for segment in segments:
            text = segment.text.strip()
            if text:
                full_text.append(text)
                print(f"  [{segment.start:.1f}s -> {segment.end:.1f}s] {text}")

        return '\n'.join(full_text)

    finally:
        # Nettoyer le fichier temporaire
        Path(tmp_path).unlink(missing_ok=True)


def format_lyrics(raw_text, book_code, chapter, lang='FR'):
    """Formate le texte brut en format paroles structuré"""

    # Obtenir le nom du livre
    book_name = BOOK_NAMES.get(book_code, book_code)

    # Créer le titre
    title = f"{book_name} {chapter}"

    # Essayer de détecter la structure (Verse, Chorus, Bridge, etc.)
    # Si le texte contient déjà des marqueurs [Verse], [Chorus], les garder
    if '[Verse' in raw_text or '[Chorus' in raw_text:
        # Le texte est déjà structuré
        lyrics = raw_text
    else:
        # Structurer le texte en strophes basiques
        lines = raw_text.split('\n')
        structured_lines = ['[Verse 1]']

        verse_num = 1
        line_count = 0

        for line in lines:
            line = line.strip()
            if not line:
                continue

            structured_lines.append(line)
            line_count += 1

            # Créer une nouvelle strophe tous les 4-6 vers
            if line_count >= 4 and verse_num < 10:
                structured_lines.append('')
                verse_num += 1
                structured_lines.append(f'[Verse {verse_num}]')
                line_count = 0

        lyrics = '\n'.join(structured_lines)

    # Formater au format final
    formatted = f"""[TITLE]
{title}

[LYRICS]
{lyrics}
"""

    return formatted


def save_lyrics(text, book_code, chapter, lang='FR'):
    """Sauvegarde les paroles dans le bon répertoire"""

    # Créer le chemin de sortie
    output_path = OUTPUT_DIR / lang / book_code
    output_path.mkdir(parents=True, exist_ok=True)

    filename = f"{book_code}_{chapter:02d}_{lang}.txt"
    file_path = output_path / filename

    # Sauvegarder
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)

    print(f"[SAVE] Paroles sauvegardées: {file_path}")
    return file_path


def transcribe_chapter(book_code, chapter, lang='FR', overwrite=False):
    """Transcrit un chapitre complet"""

    # Vérifier si le fichier existe déjà
    output_path = OUTPUT_DIR / lang / book_code / f"{book_code}_{chapter:02d}_{lang}.txt"
    if output_path.exists() and not overwrite:
        print(f"[SKIP] Le fichier existe déjà: {output_path}")
        print(f"       Utilisez overwrite=True pour écraser")
        return

    print("="*70)
    print(f"  TRANSCRIPTION: {book_code} Chapitre {chapter} ({lang})")
    print("="*70)

    try:
        # 1. Récupérer le MP3 (local ou R2)
        audio_data = get_mp3_data(book_code, chapter, lang)

        # 2. Transcrire avec Whisper
        raw_text = transcribe_audio(audio_data, language=lang.lower())

        # 3. Formater les paroles
        formatted_lyrics = format_lyrics(raw_text, book_code, chapter, lang)

        # 4. Sauvegarder
        save_lyrics(formatted_lyrics, book_code, chapter, lang)

        print()
        print("[SUCCESS] Transcription terminée avec succès!")
        print()

        return formatted_lyrics

    except Exception as e:
        print()
        print(f"[ERREUR] Échec de la transcription: {e}")
        print()
        raise


def batch_transcribe(book_code, chapters, lang='FR', overwrite=False):
    """Transcrit plusieurs chapitres d'un livre"""

    print("="*70)
    print(f"  TRANSCRIPTION EN BATCH: {book_code} ({len(chapters)} chapitres)")
    print("="*70)
    print()

    success_count = 0
    error_count = 0

    for chapter in chapters:
        try:
            transcribe_chapter(book_code, chapter, lang, overwrite)
            success_count += 1
        except Exception as e:
            print(f"[ERREUR] Chapitre {chapter}: {e}")
            error_count += 1
        print()

    print("="*70)
    print(f"  RÉSUMÉ: {success_count} réussis, {error_count} échecs")
    print("="*70)


if __name__ == '__main__':
    # Test sur Genèse 2 FR
    print()
    print("="*70)
    print("  TRANSCRIPTION WHISPER - Test Genèse 2 FR")
    print("="*70)
    print()

    try:
        result = transcribe_chapter('01_GEN', 2, 'FR', overwrite=True)

        print()
        print("="*70)
        print("  RÉSULTAT:")
        print("="*70)
        print(result[:500] + "..." if len(result) > 500 else result)

    except Exception as e:
        print(f"[ERREUR FATALE] {e}")
        sys.exit(1)
