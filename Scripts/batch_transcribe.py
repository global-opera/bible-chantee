"""
Script pour transcrire plusieurs chapitres en batch
"""
import sys
import io
from transcribe_mp3_whisper import batch_transcribe

# Configurer l'encodage UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def main():
    """
    Exemples d'utilisation:

    # Transcrire toute la Genèse (50 chapitres) en français
    batch_transcribe('01_GEN', range(1, 51), 'FR', overwrite=False)

    # Transcrire l'Exode (40 chapitres) en français
    batch_transcribe('02_EXO', range(1, 41), 'FR', overwrite=False)

    # Transcrire Genèse chapitres 1-10 seulement
    batch_transcribe('01_GEN', range(1, 11), 'FR', overwrite=False)
    """

    print()
    print("="*70)
    print("  TRANSCRIPTION EN BATCH - Bible Chantée")
    print("="*70)
    print()

    # Configuration : modifier selon vos besoins
    BOOK_CODE = '01_GEN'
    CHAPTERS = range(1, 11)  # Chapitres 1 à 10
    LANG = 'FR'
    OVERWRITE = False  # True pour écraser les fichiers existants

    print(f"Livre: {BOOK_CODE}")
    print(f"Chapitres: {min(CHAPTERS)} à {max(CHAPTERS)}")
    print(f"Langue: {LANG}")
    print(f"Écraser: {OVERWRITE}")
    print()

    response = input("Continuer? (o/n): ")
    if response.lower() not in ['o', 'oui', 'y', 'yes']:
        print("Annulé.")
        return

    print()
    batch_transcribe(BOOK_CODE, CHAPTERS, LANG, OVERWRITE)


if __name__ == '__main__':
    main()
