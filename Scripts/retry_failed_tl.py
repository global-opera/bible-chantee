"""Retry 6 failed TL chapters (timeout issues)"""
import sys
import os
from pathlib import Path
from suno_api_generator import process_book

# Récupérer la clé API
SUNO_API_KEY = os.environ.get('SUNO_API_KEY', 'baa2f6a4d4244bd9a4b5c0c755db5dab')

# Liste des 6 chapitres qui ont timeout
FAILED_CHAPTERS = [
    ("23_ISA", 21),
    ("24_JER", 38),
    ("24_JER", 45),
    ("43_JOH", 8),
    ("44_ACT", 3),
    ("52_1TH", 3)
]

def main():
    print("="*80)
    print("  RETRY 6 CHAPITRES TL EN ECHEC")
    print("="*80)
    print(f"\nChapitres à régénérer: {len(FAILED_CHAPTERS)}")
    print(f"Estimation temps: ~{len(FAILED_CHAPTERS) * 2.5 / 60:.1f} heures")
    print(f"Coût estimé: ~{len(FAILED_CHAPTERS) * 12} crédits Suno\n")

    generated_count = 0
    failed_count = 0

    for i, (book_code, chapter_num) in enumerate(FAILED_CHAPTERS, 1):
        print(f"\n{'='*80}")
        print(f"[{i}/{len(FAILED_CHAPTERS)}] {book_code} chapitre {chapter_num}")
        print(f"{'='*80}")

        # Vérifier si le MP3 existe déjà
        project_root = Path(__file__).parent.parent
        output_dir = project_root.parent / f"Suno_Output/TL/{book_code}"
        output_file = output_dir / f"{book_code}_{chapter_num:02d}.mp3"

        if output_file.exists():
            print(f"✅ SKIP - {book_code}_{chapter_num:02d}.mp3 existe déjà")
            generated_count += 1
            continue

        print(f"🚀 RETRY - {book_code} chapitre {chapter_num}...")

        try:
            # Générer le chapitre spécifique
            process_book(
                lang_code="TL",
                book_code=book_code,
                api_key=SUNO_API_KEY,
                output_dir=output_dir,
                start_chapter=chapter_num,
                end_chapter=chapter_num
            )

            # Vérifier si le fichier a été créé
            if output_file.exists():
                generated_count += 1
                print(f"✅ {book_code}_{chapter_num:02d}.mp3 GENERE")
            else:
                failed_count += 1
                print(f"⚠️ {book_code}_{chapter_num:02d}.mp3 ECHEC")

        except KeyboardInterrupt:
            print(f"\n\n⏸️ INTERRUPTION - Chapitre {book_code}_{chapter_num}")
            print(f"Progression: {generated_count}/{len(FAILED_CHAPTERS)} générés")
            print(f"Échecs: {failed_count}")
            print("\n💡 Relancez ce script pour reprendre automatiquement!")
            sys.exit(0)
        except Exception as e:
            print(f"❌ ERREUR {book_code}_{chapter_num}: {e}")
            failed_count += 1
            continue

    # Statistiques finales
    print("\n" + "="*80)
    print("  🎉 RETRY TERMINE!")
    print("="*80)
    print(f"Chapitres générés: {generated_count}/{len(FAILED_CHAPTERS)}")
    print(f"Échecs: {failed_count}")
    print(f"Taux succès: {(generated_count/len(FAILED_CHAPTERS)*100):.1f}%")

    print(f"\n📂 Dossier sortie: {project_root.parent / 'Suno_Output/TL/'}")

    if generated_count == len(FAILED_CHAPTERS):
        print("\n✅ TL est maintenant à 100% (1189/1189 chapitres)!")
    else:
        remaining = len(FAILED_CHAPTERS) - generated_count
        print(f"\n⚠️ Il reste {remaining} chapitre(s) à générer")
        print(f"   Total TL: {1183 + generated_count}/1189 chapitres")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️ Arrêt manuel")
        sys.exit(0)
