#!/usr/bin/env python3
"""
BATCH GENERATION - Complete missing PT chapters in priority order
Generates missing chapters systematically, starting with books closest to completion
"""
import subprocess
import sys
from pathlib import Path

# Priority order: Books closest to completion first
GENERATION_PRIORITY = [
    # Almost complete (1 chapter)
    ("13_1CH", "1 Chroniques", [29]),
    ("15_EZR", "Esdras", [6]),
    ("17_EST", "Esther", [6]),

    # Very close (2 chapters)
    ("16_NEH", "Néhémie", [5, 10]),

    # Close (5 chapters)
    ("14_2CH", "2 Chroniques", [5, 16, 21, 27, 33]),

    # Partial completion (32 chapters)
    ("18_JOB", "Job", list(range(11, 43))),  # Chapters 11-42

    # Complete books (all chapters)
    ("19_PSA", "Psaumes", list(range(1, 151))),  # 150 chapters
    ("20_PRO", "Proverbes", list(range(1, 32))),  # 31 chapters
    ("21_ECC", "Ecclésiaste", list(range(1, 13))),
    ("22_SNG", "Cantique", list(range(1, 9))),
    ("23_ISA", "Ésaïe", list(range(1, 67))),
    ("24_JER", "Jérémie", list(range(1, 53))),
    ("25_LAM", "Lamentations", list(range(1, 6))),
    ("26_EZE", "Ézéchiel", list(range(1, 49))),
    ("27_DAN", "Daniel", list(range(1, 13))),

    # Minor prophets
    ("28_HOS", "Osée", list(range(1, 15))),
    ("29_JOL", "Joël", list(range(1, 4))),
    ("30_AMO", "Amos", list(range(1, 10))),
    ("31_OBA", "Abdias", [1]),
    ("32_JON", "Jonas", list(range(1, 5))),
    ("33_MIC", "Michée", list(range(1, 8))),
    ("34_NAH", "Nahum", list(range(1, 4))),
    ("35_HAB", "Habacuc", list(range(1, 4))),
    ("36_ZEP", "Sophonie", list(range(1, 4))),
    ("37_HAG", "Aggée", list(range(1, 3))),
    ("38_ZEC", "Zacharie", list(range(1, 15))),
    ("39_MAL", "Malachie", list(range(1, 5))),

    # New Testament
    ("40_MAT", "Matthieu", list(range(1, 29))),
    ("41_MAR", "Marc", list(range(1, 17))),
    ("42_LUK", "Luc", list(range(1, 25))),
    ("43_JOH", "Jean", list(range(1, 22))),
    ("44_ACT", "Actes", list(range(1, 29))),
    ("45_ROM", "Romains", list(range(1, 17))),
    ("46_1CO", "1 Corinthiens", list(range(1, 17))),
    ("47_2CO", "2 Corinthiens", list(range(1, 14))),
    ("48_GAL", "Galates", list(range(1, 7))),
    ("49_EPH", "Éphésiens", list(range(1, 7))),
    ("50_PHP", "Philippiens", list(range(1, 5))),
    ("51_COL", "Colossiens", list(range(1, 5))),
    ("52_1TH", "1 Thessaloniciens", list(range(1, 6))),
    ("53_2TH", "2 Thessaloniciens", list(range(1, 4))),
    ("54_1TI", "1 Timothée", list(range(1, 7))),
    ("55_2TI", "2 Timothée", list(range(1, 5))),
    ("56_TIT", "Tite", list(range(1, 4))),
    ("57_PHM", "Philémon", [1]),
    ("58_HEB", "Hébreux", list(range(1, 14))),
    ("59_JAS", "Jacques", list(range(1, 6))),
    ("60_1PE", "1 Pierre", list(range(1, 6))),
    ("61_2PE", "2 Pierre", list(range(1, 4))),
    ("62_1JO", "1 Jean", list(range(1, 6))),
    ("63_2JO", "2 Jean", [1]),
    ("64_3JO", "3 Jean", [1]),
    ("65_JUD", "Jude", [1]),
    ("66_REV", "Apocalypse", list(range(1, 23))),
]

def generate_book(book_code, book_name, chapters, dry_run=False):
    """Generate missing chapters for a book"""
    print(f"\n{'='*80}")
    print(f"📖 {book_name} ({book_code}) - {len(chapters)} chapters")
    print(f"{'='*80}")

    if dry_run:
        print(f"[DRY RUN] Would generate chapters: {chapters[:10]}..." if len(chapters) > 10 else f"[DRY RUN] Would generate chapters: {chapters}")
        return True

    # Build command
    chapters_str = ','.join(map(str, chapters))
    cmd = [
        "python",
        "Scripts/suno_api_generator.py",
        "--lang", "PT",
        "--book", book_code,
        "--chapters", chapters_str
    ]

    print(f"Command: {' '.join(cmd)}")
    print()

    try:
        result = subprocess.run(cmd, check=True, capture_output=False, text=True)
        print(f"✅ {book_name} completed!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error generating {book_name}: {e}")
        return False
    except KeyboardInterrupt:
        print(f"\n⚠️ Interrupted by user")
        return False

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Batch generate missing PT chapters')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be generated without actually generating')
    parser.add_argument('--start-from', type=int, default=0, help='Start from book index (0-based)')
    parser.add_argument('--limit', type=int, help='Limit number of books to process')

    args = parser.parse_args()

    print("="*80)
    print("  BATCH GENERATION - Missing PT Chapters")
    print("="*80)
    print()

    if args.dry_run:
        print("🔍 DRY RUN MODE - No files will be generated")
        print()

    total_books = len(GENERATION_PRIORITY)
    total_chapters = sum(len(chapters) for _, _, chapters in GENERATION_PRIORITY)

    print(f"Total: {total_books} books, {total_chapters} chapters to generate")
    print()

    # Apply filters
    books_to_process = GENERATION_PRIORITY[args.start_from:]
    if args.limit:
        books_to_process = books_to_process[:args.limit]

    print(f"Processing: {len(books_to_process)} books")
    print()

    if not args.dry_run:
        response = input("Start generation? (yes/no): ")
        if response.lower() not in ['yes', 'y', 'oui', 'o']:
            print("Cancelled.")
            return

    # Generate
    completed = 0
    failed = 0

    for i, (book_code, book_name, chapters) in enumerate(books_to_process, args.start_from + 1):
        print(f"\n[{i}/{total_books}]")

        success = generate_book(book_code, book_name, chapters, dry_run=args.dry_run)

        if success:
            completed += 1
        else:
            failed += 1
            print(f"\n⚠️ Failed to generate {book_name}. Continue? (yes/no)")
            if input().lower() not in ['yes', 'y', 'oui', 'o']:
                break

    # Summary
    print()
    print("="*80)
    print("  SUMMARY")
    print("="*80)
    print(f"Completed: {completed} books")
    print(f"Failed: {failed} books")
    print()

if __name__ == "__main__":
    main()
