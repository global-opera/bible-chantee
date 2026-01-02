"""Génération des 15 chapitres TL manquants"""
import sys
import os
from pathlib import Path
from suno_api_generator import process_book

# Récupérer la clé API depuis l'environnement ou argument
SUNO_API_KEY = os.environ.get('SUNO_API_KEY')
if not SUNO_API_KEY and len(sys.argv) > 1:
    SUNO_API_KEY = sys.argv[1]

if not SUNO_API_KEY:
    print("ERREUR: SUNO_API_KEY non definie")
    print("\nUtilisation:")
    print("  Option 1: $env:SUNO_API_KEY='votre_cle' ; python generate_missing_tl.py")
    print("  Option 2: python generate_missing_tl.py VOTRE_CLE_API")
    sys.exit(1)

# Liste des 15 chapitres manquants
MISSING_CHAPTERS = [
    ("09_1SAM", 18),
    ("23_ISA", 21), ("23_ISA", 30), ("23_ISA", 58), ("23_ISA", 59),
    ("24_JER", 3), ("24_JER", 38), ("24_JER", 45),
    ("28_HOS", 8),
    ("33_MIC", 7),
    ("43_JOH", 8),
    ("44_ACT", 3),
    ("52_1TH", 3),
    ("55_2TI", 3),
    ("66_REV", 11)
]

def main():
    print("="*80)
    print("  GENERATION 15 CHAPITRES TL MANQUANTS")
    print("="*80)
    print(f"\nChapitres à générer: {len(MISSING_CHAPTERS)}")
    print(f"Estimation temps: ~{len(MISSING_CHAPTERS) * 2.5 / 60:.1f} heures")
    print(f"Coût estimé: ~{len(MISSING_CHAPTERS) * 12} crédits Suno\n")

    generated_count = 0
    failed_count = 0

    for i, (book_code, chapter_num) in enumerate(MISSING_CHAPTERS, 1):
        print(f"\n{'='*80}")
        print(f"[{i}/{len(MISSING_CHAPTERS)}] {book_code} chapitre {chapter_num}")
        print(f"{'='*80}")

        # Vérifier si le MP3 existe déjà
        project_root = Path(__file__).parent.parent
        output_dir = project_root.parent / f"Suno_Output/TL/{book_code}"
        output_file = output_dir / f"{book_code}_{chapter_num:02d}.mp3"

        if output_file.exists():
            print(f"✅ SKIP - {book_code}_{chapter_num:02d}.mp3 existe déjà")
            generated_count += 1
            continue

        print(f"🚀 GENERATION - {book_code} chapitre {chapter_num}...")

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
            print(f"Progression: {generated_count}/{len(MISSING_CHAPTERS)} générés")
            print(f"Échecs: {failed_count}")
            print("\n💡 Relancez ce script pour reprendre automatiquement!")
            sys.exit(0)
        except Exception as e:
            print(f"❌ ERREUR {book_code}_{chapter_num}: {e}")
            failed_count += 1
            continue

    # Statistiques finales
    print("\n" + "="*80)
    print("  🎉 GENERATION TERMINEE!")
    print("="*80)
    print(f"Chapitres générés: {generated_count}/{len(MISSING_CHAPTERS)}")
    print(f"Échecs: {failed_count}")
    print(f"Taux succès: {(generated_count/len(MISSING_CHAPTERS)*100):.1f}%")

    print(f"\n📂 Dossier sortie: {project_root.parent / 'Suno_Output/TL/'}")

    if generated_count == len(MISSING_CHAPTERS):
        print("\n✅ TL est maintenant à 100% (1189/1189 chapitres)!")
    else:
        remaining = len(MISSING_CHAPTERS) - generated_count
        print(f"\n⚠️ Il reste {remaining} chapitre(s) à générer")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️ Arrêt manuel")
        sys.exit(0)
