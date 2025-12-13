#!/usr/bin/env python3
"""
UNIVERSAL AUDIO URL GENERATOR FOR BIBLE CHANTÉE
Automatically generates audio-urls-{LANG}.js for ALL languages found in Suno_Output_V2
Creates unified architecture for 11+ languages
"""
import os
from pathlib import Path
from collections import defaultdict

# ========== CONFIGURATION ==========
SCRIPT_DIR = Path(__file__).parent
SOURCE_DIR = SCRIPT_DIR / "Suno_Output_V2"
OUTPUT_DIR = SCRIPT_DIR
ARCHIVE_BASE = "https://archive.org/download/bible-chantee-{lang}-v2"

# 11 target languages + codes
LANGUAGES = {
    'FR': 'Français',
    'EN': 'English',
    'ES': 'Español',
    'PT': 'Português',
    'DE': 'Deutsch',
    'IT': 'Italiano',
    'RU': 'Русский',
    'AR': 'العربية',
    'ZH': '中文',
    'HI': 'हिन्दी',
    'TL': 'Tagalog',
    'KO': '한국어'
}

def scan_language_folder(lang_path):
    """Scan a language folder and return {book_num: {chapter: url}}"""
    books = defaultdict(dict)
    total_files = 0

    if not lang_path.exists():
        return books, total_files

    lang_code = lang_path.name.upper()

    # Scan all book directories
    for book_dir in sorted(lang_path.iterdir()):
        if not book_dir.is_dir():
            continue

        book_code = book_dir.name  # e.g., "01_GEN"
        book_num = book_code.split('_')[0]  # e.g., "01"

        # Find all MP3 files
        for mp3_file in sorted(book_dir.glob("*.mp3")):
            filename = mp3_file.stem
            parts = filename.split('_')

            if len(parts) >= 3:
                chapter = parts[2]  # Chapter number
                chapter_key = str(int(chapter))  # Remove leading zeros

                # Construct Archive.org URL
                archive_filename = f"{book_code}_{chapter}_{lang_code}.mp3"
                url = f"{ARCHIVE_BASE.format(lang=lang_code.lower())}/{archive_filename}"

                books[book_num][chapter_key] = url
                total_files += 1

    return books, total_files

def generate_js_file(lang_code, books, total_files):
    """Generate audio-urls-{LANG}.js file"""
    lang_name = LANGUAGES.get(lang_code, lang_code)

    js_content = f"""// Audio URLs - Bible Chantée {lang_code} V2 - {total_files} chapters
// Generated automatically from Suno_Output_V2/{lang_code} directory
// Language: {lang_name}
// Upload files to Archive.org collection: bible-chantee-{lang_code.lower()}-v2

window.audioUrls{lang_code} = {{
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
    """Main function - scan all languages and generate audio URLs"""

    print("=" * 80)
    print("  BIBLE CHANTÉE - UNIVERSAL AUDIO URL GENERATOR")
    print("=" * 80)
    print()

    if not SOURCE_DIR.exists():
        print(f"ERROR: Source directory not found: {SOURCE_DIR}")
        return

    # Scan for all language folders
    found_languages = {}
    total_chapters = 0

    print("Scanning for languages in:", SOURCE_DIR)
    print()

    for item in SOURCE_DIR.iterdir():
        if item.is_dir() and len(item.name) == 2:
            lang_code = item.name.upper()
            if lang_code in LANGUAGES:
                books, file_count = scan_language_folder(item)
                if file_count > 0:
                    found_languages[lang_code] = (books, file_count)
                    total_chapters += file_count
                    print(f"[{lang_code}] {LANGUAGES[lang_code]}: {file_count} chapters found")

    print()
    print(f"Total languages found: {len(found_languages)}")
    print(f"Total chapters across all languages: {total_chapters}")
    print()

    if not found_languages:
        print("No language folders found!")
        return

    # Generate JS files for each language
    print("Generating audio-urls JS files...")
    print()

    for lang_code, (books, file_count) in found_languages.items():
        # Generate JS content
        js_content = generate_js_file(lang_code, books, file_count)

        # Write to file
        output_file = OUTPUT_DIR / f"audio-urls-{lang_code.lower()}.js"
        output_file.write_text(js_content, encoding='utf-8')

        print(f"[OK] {output_file.name} - {file_count} chapters, {len(books)} books")

    print()
    print("=" * 80)
    print("  GENERATION COMPLETE")
    print("=" * 80)
    print()
    print("Next steps:")
    print(f"1. Upload MP3 files to Archive.org (one collection per language)")
    for lang_code in sorted(found_languages.keys()):
        print(f"   - bible-chantee-{lang_code.lower()}-v2")
    print(f"2. Update lecteur.html to load all audio-urls-*.js files")
    print(f"3. Test language switching on website")
    print()

    # Generate summary for lecteur.html update
    print("LANGUAGES object for lecteur.html:")
    print()
    for lang_code in LANGUAGES.keys():
        if lang_code in found_languages:
            file_count = found_languages[lang_code][1]
            print(f"    {lang_code}: {{ flag: '...', name: '{LANGUAGES[lang_code]}', chapters: {file_count}, total: 1189 }},")
        else:
            print(f"    {lang_code}: {{ flag: '...', name: '{LANGUAGES[lang_code]}', chapters: 0, total: 1189 }},")

if __name__ == "__main__":
    main()
