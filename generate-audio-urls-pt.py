#!/usr/bin/env python3
"""Generate audio-urls-pt.js from local PT MP3 files"""
import os
from pathlib import Path
from collections import defaultdict

# Base paths
PT_DIR = Path(r"G:\Mon Drive\01 BibleChantee\Suno_Output_V2\PT")
OUTPUT_FILE = Path(r"C:\Users\Stéphane CASSANI\bible-chantee\audio-urls-pt.js")

# Archive.org base URL (assuming same pattern as FR)
ARCHIVE_BASE = "https://archive.org/download/bible-chantee-pt-v2"

def main():
    """Scan PT directory and generate audio-urls-pt.js"""

    if not PT_DIR.exists():
        print(f"ERROR: {PT_DIR} does not exist!")
        return

    # Collect all MP3 files organized by book
    books = defaultdict(dict)
    total_files = 0

    # Scan all book directories
    for book_dir in sorted(PT_DIR.iterdir()):
        if not book_dir.is_dir():
            continue

        book_code = book_dir.name  # e.g., "01_GEN"
        book_num = book_code.split('_')[0]  # e.g., "01"

        # Find all MP3 files in this book
        for mp3_file in sorted(book_dir.glob("*.mp3")):
            # Parse filename: 01_GEN_01_PT.mp3 or 01_GEN_01.mp3
            filename = mp3_file.stem  # Without .mp3
            parts = filename.split('_')

            # Extract chapter number
            if len(parts) >= 3:
                chapter = parts[2]  # The chapter number

                # Remove leading zeros for chapter key
                chapter_key = str(int(chapter))

                # Construct Archive.org URL
                archive_filename = f"{book_code}_{chapter}_PT.mp3"
                url = f"{ARCHIVE_BASE}/{archive_filename}"

                books[book_num][chapter_key] = url
                total_files += 1

    # Generate JavaScript file
    js_content = f"""// Audio URLs - Bible Chantee PT V2 - {total_files} chapters
// Generated automatically from Suno_Output_V2/PT directory
// Upload these files to Archive.org collection: bible-chantee-pt-v2

window.audioUrlsPT = {{
"""

    # Write each book
    for book_num in sorted(books.keys()):
        chapters = books[book_num]
        js_content += f'    "{book_num}": {{\n'

        # Write each chapter
        for chapter_key in sorted(chapters.keys(), key=int):
            url = chapters[chapter_key]
            js_content += f'        "{chapter_key}": "{url}",\n'

        js_content += "    },\n"

    js_content += "};\n"

    # Write to file
    OUTPUT_FILE.write_text(js_content, encoding='utf-8')

    print(f"[OK] Generated {OUTPUT_FILE}")
    print(f"   Total books: {len(books)}")
    print(f"   Total chapters: {total_files}")
    print()
    print("[INFO] Books found:")
    for book_num in sorted(books.keys()):
        chapter_count = len(books[book_num])
        print(f"   {book_num}: {chapter_count} chapters")
    print()
    print("[NEXT] Next steps:")
    print("   1. Upload PT MP3 files to Archive.org as 'bible-chantee-pt-v2'")
    print("   2. Update lecteur.html to load audio-urls-pt.js")
    print("   3. Implement language switching in playChapter()")

if __name__ == "__main__":
    main()
