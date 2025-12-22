#!/usr/bin/env python3
"""
Generate audio-urls-es.js with Cloudflare R2 URLs
"""
from pathlib import Path
from collections import defaultdict

# Configuration
SOURCE_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/ES")
OUTPUT_FILE = Path("C:/ScriptBible/bible-chantee/audio-urls-es.js")
R2_BASE = "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/ES"

def scan_es_folder():
    """Scan ES folder and return {book_num: {chapter: url}}"""
    books = defaultdict(dict)
    total_files = 0

    if not SOURCE_DIR.exists():
        print(f"ERROR: {SOURCE_DIR} not found")
        return books, total_files

    # Scan all book directories
    for book_dir in sorted(SOURCE_DIR.iterdir()):
        if not book_dir.is_dir():
            continue

        book_code = book_dir.name  # e.g., "01_GEN"
        book_num = book_code.split('_')[0]  # e.g., "01"

        # Find all MP3 files
        for mp3_file in sorted(book_dir.glob("*.mp3")):
            filename = mp3_file.stem
            parts = filename.split('_')

            if len(parts) >= 3:
                chapter = parts[2]  # Chapter number (with leading zeros)
                chapter_key = str(int(chapter))  # Remove leading zeros for key

                # Construct R2 Cloudflare URL
                mp3_filename = f"{book_code}_{chapter}_ES.mp3"
                url = f"{R2_BASE}/{book_code}/{mp3_filename}"

                books[book_num][chapter_key] = url
                total_files += 1

    return books, total_files

def generate_js_file(books, total_files):
    """Generate audio-urls-es.js content"""
    js_content = f"""// Audio URLs - Bible Chantée ES - {total_files} chapters
// Keys: book number (01, 02, etc.)
// URL: {R2_BASE}/{{BOOK}}/{{FILE}}.mp3
window.audioUrlsES = {{
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

    return js_content

def main():
    print("=== GENERATE audio-urls-es.js ===\n")
    print(f"Source: {SOURCE_DIR}")
    print(f"Output: {OUTPUT_FILE}")
    print(f"R2 Base: {R2_BASE}")
    print()

    # Scan ES folder
    print("[1/2] Scanning ES MP3 files...")
    books, total_files = scan_es_folder()

    if total_files == 0:
        print("ERROR: No MP3 files found!")
        return False

    print(f"  -> {len(books)} books")
    print(f"  -> {total_files} chapters")
    print()

    # Generate JS file
    print("[2/2] Generating audio-urls-es.js...")
    js_content = generate_js_file(books, total_files)

    # Write to file
    OUTPUT_FILE.write_text(js_content, encoding='utf-8')

    print(f"  -> Saved: {OUTPUT_FILE}")
    print(f"  -> Size: {len(js_content) / 1024:.1f} KB")
    print()
    print("SUCCESS! audio-urls-es.js generated")
    return True

if __name__ == "__main__":
    main()
