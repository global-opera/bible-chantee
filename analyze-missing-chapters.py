#!/usr/bin/env python3
"""
ANALYZE MISSING CHAPTERS - Bible Chantée PT
Identifies missing MP3 files and generates a report + batch generation script
"""
import os
from pathlib import Path
from collections import defaultdict

# Configuration
SCRIPT_DIR = Path(__file__).parent
PT_DIR = SCRIPT_DIR / "Suno_Output_V2" / "PT"

# Complete Bible structure (66 books)
BIBLE_STRUCTURE = [
    ("01_GEN", "Genèse", 50), ("02_EXO", "Exode", 40), ("03_LEV", "Lévitique", 27),
    ("04_NUM", "Nombres", 36), ("05_DEU", "Deutéronome", 34), ("06_JOS", "Josué", 24),
    ("07_JDG", "Juges", 21), ("08_RUT", "Ruth", 4), ("09_1SAM", "1 Samuel", 31),
    ("10_2SAM", "2 Samuel", 24), ("11_1KI", "1 Rois", 22), ("12_2KI", "2 Rois", 25),
    ("13_1CH", "1 Chroniques", 29), ("14_2CH", "2 Chroniques", 36), ("15_EZR", "Esdras", 10),
    ("16_NEH", "Néhémie", 13), ("17_EST", "Esther", 10), ("18_JOB", "Job", 42),
    ("19_PSA", "Psaumes", 150), ("20_PRO", "Proverbes", 31), ("21_ECC", "Ecclésiaste", 12),
    ("22_SNG", "Cantique", 8), ("23_ISA", "Ésaïe", 66), ("24_JER", "Jérémie", 52),
    ("25_LAM", "Lamentations", 5), ("26_EZE", "Ézéchiel", 48), ("27_DAN", "Daniel", 12),
    ("28_HOS", "Osée", 14), ("29_JOL", "Joël", 3), ("30_AMO", "Amos", 9),
    ("31_OBA", "Abdias", 1), ("32_JON", "Jonas", 4), ("33_MIC", "Michée", 7),
    ("34_NAH", "Nahum", 3), ("35_HAB", "Habacuc", 3), ("36_ZEP", "Sophonie", 3),
    ("37_HAG", "Aggée", 2), ("38_ZEC", "Zacharie", 14), ("39_MAL", "Malachie", 4),
    ("40_MAT", "Matthieu", 28), ("41_MAR", "Marc", 16), ("42_LUK", "Luc", 24),
    ("43_JOH", "Jean", 21), ("44_ACT", "Actes", 28), ("45_ROM", "Romains", 16),
    ("46_1CO", "1 Corinthiens", 16), ("47_2CO", "2 Corinthiens", 13), ("48_GAL", "Galates", 6),
    ("49_EPH", "Éphésiens", 6), ("50_PHP", "Philippiens", 4), ("51_COL", "Colossiens", 4),
    ("52_1TH", "1 Thessaloniciens", 5), ("53_2TH", "2 Thessaloniciens", 3), ("54_1TI", "1 Timothée", 6),
    ("55_2TI", "2 Timothée", 4), ("56_TIT", "Tite", 3), ("57_PHM", "Philémon", 1),
    ("58_HEB", "Hébreux", 13), ("59_JAS", "Jacques", 5), ("60_1PE", "1 Pierre", 5),
    ("61_2PE", "2 Pierre", 3), ("62_1JO", "1 Jean", 5), ("63_2JO", "2 Jean", 1),
    ("64_3JO", "3 Jean", 1), ("65_JUD", "Jude", 1), ("66_REV", "Apocalypse", 22)
]

def scan_existing_chapters(pt_dir):
    """Scan PT directory and return existing chapters"""
    existing = defaultdict(set)

    if not pt_dir.exists():
        return existing

    for book_dir in pt_dir.iterdir():
        if not book_dir.is_dir():
            continue

        book_code = book_dir.name

        for mp3_file in book_dir.glob("*.mp3"):
            filename = mp3_file.stem
            parts = filename.split('_')

            if len(parts) >= 3:
                chapter = int(parts[2])
                existing[book_code].add(chapter)

    return existing

def main():
    print("=" * 80)
    print("  ANALYSE DES CHAPITRES MANQUANTS - PORTUGAIS")
    print("=" * 80)
    print()

    existing = scan_existing_chapters(PT_DIR)

    complete_books = 0
    incomplete_books = []
    missing_total = 0
    missing_by_book = defaultdict(list)

    for book_code, book_name, total_chapters in BIBLE_STRUCTURE:
        existing_chapters = existing.get(book_code, set())
        missing_chapters = []

        for ch in range(1, total_chapters + 1):
            if ch not in existing_chapters:
                missing_chapters.append(ch)

        if not missing_chapters:
            complete_books += 1
        else:
            incomplete_books.append((book_code, book_name, missing_chapters, total_chapters))
            missing_by_book[book_code] = missing_chapters
            missing_total += len(missing_chapters)

    # Summary
    print(f"Livres complets: {complete_books} / 66")
    print(f"Chapitres manquants: {missing_total} / 1189")
    print(f"Pourcentage complété: {((1189 - missing_total) / 1189 * 100):.1f}%")
    print()

    # Detailed report
    if incomplete_books:
        print("CHAPITRES MANQUANTS PAR LIVRE:")
        print()

        for book_code, book_name, missing_chs, total in incomplete_books:
            print(f"  {book_code} - {book_name}:")
            print(f"    Manquants: {len(missing_chs)}/{total}")

            # Group consecutive chapters
            ranges = []
            start = missing_chs[0]
            end = start

            for i in range(1, len(missing_chs)):
                if missing_chs[i] == end + 1:
                    end = missing_chs[i]
                else:
                    ranges.append(f"{start}-{end}" if start != end else str(start))
                    start = missing_chs[i]
                    end = start

            ranges.append(f"{start}-{end}" if start != end else str(start))
            print(f"    Chapitres: {', '.join(ranges)}")
            print()

    # Generate batch generation script
    if missing_total > 0:
        print()
        print("=" * 80)
        print("  SCRIPT DE GÉNÉRATION")
        print("=" * 80)
        print()
        print("Pour générer les chapitres manquants, utilisez:")
        print()
        print("python suno_api_generator.py --lang PT --book {BOOK_CODE} --chapters {CHAPTERS}")
        print()
        print("Exemple:")
        if incomplete_books:
            first_book = incomplete_books[0]
            book_code = first_book[0]
            missing = first_book[2][:3]  # First 3 missing
            print(f"python suno_api_generator.py --lang PT --book {book_code} --chapters {','.join(map(str, missing))}")

    # Generate priority list
    print()
    print("=" * 80)
    print("  PRIORITÉS (Livres les plus proches de la complétion)")
    print("=" * 80)
    print()

    # Sort by fewest missing chapters
    priority = sorted(incomplete_books, key=lambda x: len(x[2]))[:10]

    for i, (book_code, book_name, missing_chs, total) in enumerate(priority, 1):
        pct = ((total - len(missing_chs)) / total * 100)
        print(f"{i}. {book_name} ({book_code}): {pct:.1f}% - Manquants: {len(missing_chs)}")

if __name__ == "__main__":
    main()
