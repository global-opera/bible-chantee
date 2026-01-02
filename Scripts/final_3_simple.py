"""Génération des 3 derniers chapitres TL en utilisant le générateur qui marche"""
import sys
import os
from pathlib import Path
from suno_api_generator import process_book

# Clé API
SUNO_API_KEY = os.environ.get('SUNO_API_KEY', 'baa2f6a4d4244bd9a4b5c0c755db5dab')

# 3 chapitres finaux
FINAL_CHAPTERS = [
    ("23_ISA", 21),
    ("24_JER", 45),
    ("43_JOH", 8)
]

print("="*80)
print("  GENERATION FINALE - 3 CHAPITRES TL")
print("="*80)
print(f"\nChapitres: {len(FINAL_CHAPTERS)}")
print("Note: Utilise le générateur standard (timeout 180s)\n")

project_root = Path(__file__).parent.parent

for i, (book_code, chapter_num) in enumerate(FINAL_CHAPTERS, 1):
    print(f"\n{'='*80}")
    print(f"[{i}/{len(FINAL_CHAPTERS)}] {book_code} chapitre {chapter_num}")
    print(f"{'='*80}")

    # Vérifier si existe
    output_dir = project_root.parent / f"Suno_Output/TL/{book_code}"
    output_file = output_dir / f"{book_code}_{chapter_num:02d}.mp3"

    if output_file.exists():
        print(f"✅ SKIP - Fichier existe déjà")
        continue

    print(f"🚀 GENERATION...")

    try:
        process_book(
            lang_code="TL",
            book_code=book_code,
            api_key=SUNO_API_KEY,
            output_dir=output_dir,
            start_chapter=chapter_num,
            end_chapter=chapter_num
        )

        if output_file.exists():
            print(f"✅ GENERE")
        else:
            print(f"⚠️ ECHEC")
    except Exception as e:
        print(f"❌ ERREUR: {e}")

print("\n" + "="*80)
print("TERMINE")
print("="*80)
