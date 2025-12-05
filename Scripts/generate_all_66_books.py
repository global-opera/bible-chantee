"""Génération automatique des 66 livres de la Bible FR"""
import sys
from pathlib import Path
from api_key import SUNO_API_KEY
from suno_api_generator import process_book

# Liste complète des 66 livres
BIBLE_BOOKS = [
    ("01_GEN", "Genèse", 50),
    ("02_EXO", "Exode", 40),
    ("03_LEV", "Lévitique", 27),
    ("04_NUM", "Nombres", 36),
    ("05_DEU", "Deutéronome", 34),
    ("06_JOS", "Josué", 24),
    ("07_JDG", "Juges", 21),
    ("08_RUT", "Ruth", 4),
    ("09_1SAM", "1 Samuel", 31),
    ("10_2SAM", "2 Samuel", 24),
    ("11_1KI", "1 Rois", 22),
    ("12_2KI", "2 Rois", 25),
    ("13_1CH", "1 Chroniques", 29),
    ("14_2CH", "2 Chroniques", 36),
    ("15_EZR", "Esdras", 10),
    ("16_NEH", "Néhémie", 13),
    ("17_EST", "Esther", 10),
    ("18_JOB", "Job", 42),
    ("19_PSA", "Psaumes", 150),
    ("20_PRO", "Proverbes", 31),
    ("21_ECC", "Ecclésiaste", 12),
    ("22_SON", "Cantique", 8),
    ("23_ISA", "Ésaïe", 66),
    ("24_JER", "Jérémie", 52),
    ("25_LAM", "Lamentations", 5),
    ("26_EZE", "Ézéchiel", 48),
    ("27_DAN", "Daniel", 12),
    ("28_HOS", "Osée", 14),
    ("29_JOE", "Joël", 3),
    ("30_AMO", "Amos", 9),
    ("31_OBA", "Abdias", 1),
    ("32_JON", "Jonas", 4),
    ("33_MIC", "Michée", 7),
    ("34_NAH", "Nahum", 3),
    ("35_HAB", "Habacuc", 3),
    ("36_ZEP", "Sophonie", 3),
    ("37_HAG", "Aggée", 2),
    ("38_ZEC", "Zacharie", 14),
    ("39_MAL", "Malachie", 4),
    ("40_MAT", "Matthieu", 28),
    ("41_MAR", "Marc", 16),
    ("42_LUK", "Luc", 24),
    ("43_JOH", "Jean", 21),
    ("44_ACT", "Actes", 28),
    ("45_ROM", "Romains", 16),
    ("46_1CO", "1 Corinthiens", 16),
    ("47_2CO", "2 Corinthiens", 13),
    ("48_GAL", "Galates", 6),
    ("49_EPH", "Éphésiens", 6),
    ("50_PHP", "Philippiens", 4),
    ("51_COL", "Colossiens", 4),
    ("52_1TH", "1 Thessaloniciens", 5),
    ("53_2TH", "2 Thessaloniciens", 3),
    ("54_1TI", "1 Timothée", 6),
    ("55_2TI", "2 Timothée", 4),
    ("56_TIT", "Tite", 3),
    ("57_PHM", "Philémon", 1),
    ("58_HEB", "Hébreux", 13),
    ("59_JAS", "Jacques", 5),
    ("60_1PE", "1 Pierre", 5),
    ("61_2PE", "2 Pierre", 3),
    ("62_1JO", "1 Jean", 5),
    ("63_2JO", "2 Jean", 1),
    ("64_3JO", "3 Jean", 1),
    ("65_JUD", "Jude", 1),
    ("66_REV", "Apocalypse", 22)
]

def count_existing_mp3s(book_code):
    """Compte les MP3 déjà générés pour un livre"""
    output_dir = Path(f"G:/Mon Drive/01 BibleChantee/Suno_Output/FR/{book_code}")
    if not output_dir.exists():
        return 0
    return len(list(output_dir.glob("*.mp3")))

def main():
    print("="*80)
    print("  GENERATION COMPLETE BIBLE FR - 66 LIVRES")
    print("="*80)

    total_chapters = sum(chapters for _, _, chapters in BIBLE_BOOKS)
    total_generated = 0
    books_completed = 0

    print(f"\nTotal chapitres à générer: {total_chapters}")
    print(f"Estimation temps: ~{total_chapters * 2.5 / 60:.1f} heures")
    print(f"Coût estimé: ~{total_chapters * 12} crédits Suno\n")

    # Parcourir tous les livres
    for i, (book_code, book_name, chapters) in enumerate(BIBLE_BOOKS, 1):
        # Compter existants
        existing = count_existing_mp3s(book_code)

        print(f"\n{'='*80}")
        print(f"[{i}/66] {book_name} ({book_code}) - {chapters} chapitres")
        print(f"{'='*80}")

        if existing == chapters:
            print(f"✅ SKIP - {book_name} déjà complet ({existing}/{chapters})")
            books_completed += 1
            total_generated += existing
            continue

        if existing > 0:
            print(f"📝 RESUME - {existing}/{chapters} déjà générés")
            total_generated += existing

        print(f"🚀 GENERATION - {book_name}...")

        try:
            # Lancer la génération
            process_book("FR", book_code, SUNO_API_KEY, start_chapter=1)

            # Recompter après génération
            generated = count_existing_mp3s(book_code)
            total_generated += (generated - existing)

            if generated == chapters:
                books_completed += 1
                print(f"✅ {book_name} TERMINÉ ({generated}/{chapters})")
            else:
                print(f"⚠️ {book_name} PARTIEL ({generated}/{chapters})")

        except KeyboardInterrupt:
            print(f"\n\n⏸️ INTERRUPTION - Livre {book_name}")
            print(f"Progression: {books_completed}/66 livres complets")
            print(f"Chapitres générés: {total_generated}/{total_chapters}")
            print("\n💡 Relancez ce script pour reprendre automatiquement!")
            sys.exit(0)
        except Exception as e:
            print(f"❌ ERREUR {book_name}: {e}")
            continue

    # Statistiques finales
    print("\n" + "="*80)
    print("  🎉 GENERATION TERMINEE!")
    print("="*80)
    print(f"Livres complets: {books_completed}/66")
    print(f"Chapitres générés: {total_generated}/{total_chapters}")
    print(f"Taux complétion: {(total_generated/total_chapters*100):.1f}%")
    print("\n📂 Dossier sortie: G:/Mon Drive/01 BibleChantee/Suno_Output/FR/")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️ Arrêt manuel")
        sys.exit(0)
