"""
Generate lyrics-data-tl.js from TL lyrics files
Format: window.chapterLyrics = { "01": { 1: `lyrics...` } }
"""
from pathlib import Path
from datetime import datetime
import re

SOURCE_DIR = Path(r"C:\ScriptBible\bible-chantee\lyrics\TL")
OUTPUT_FILE = Path(r"C:\ScriptBible\bible-chantee\lyrics-data-tl.js")

def extract_book_chapter(filename):
    """Extract book code and chapter from filename
    Examples: 01_GEN_01_TL.txt -> ('01_GEN', 1)
              40_MAT_05_TL.txt -> ('40_MAT', 5)
    """
    match = re.match(r'(\d+_[A-Z]+)_(\d+)(_TL)?\.txt', filename)
    if match:
        book_code = match.group(1)
        chapter = int(match.group(2))
        # Normalize book code to 2 digits
        book_num = book_code.split('_')[0]
        return (book_num, chapter)
    return None

def read_lyrics(file_path):
    """Read and clean lyrics content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove [TITLE] and [STYLE] sections, keep only [LYRICS] content
        # Extract everything between [LYRICS] and [STYLE] (or end of file)
        lyrics_match = re.search(r'\[LYRICS\](.*?)(\[STYLE\]|$)', content, re.DOTALL)
        if lyrics_match:
            lyrics = lyrics_match.group(1).strip()
        else:
            lyrics = content.strip()

        # Escape backticks and backslashes for JS template literals
        lyrics = lyrics.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

        return lyrics
    except Exception as e:
        print(f"  [ERROR] {file_path.name}: {e}")
        return None

def main():
    print("="*70)
    print("  GÉNÉRATION lyrics-data-tl.js")
    print("="*70)
    print()

    # Collect all lyrics
    lyrics_data = {}

    for txt_file in sorted(SOURCE_DIR.rglob("*.txt")):
        result = extract_book_chapter(txt_file.name)
        if not result:
            continue

        book_num, chapter = result
        lyrics = read_lyrics(txt_file)

        if lyrics:
            if book_num not in lyrics_data:
                lyrics_data[book_num] = {}

            # Only keep first occurrence (in case of duplicates)
            if chapter not in lyrics_data[book_num]:
                lyrics_data[book_num][chapter] = lyrics
                print(f"  OK {book_num} ch.{chapter}")

    # Generate JS file
    print(f"\nGénération {OUTPUT_FILE}...")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("// Paroles des chapitres TL - Bible Chantee\n")
        f.write(f"// Auto-genere: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("window.chapterLyrics = {\n")

        for book_num in sorted(lyrics_data.keys()):
            f.write(f'    "{book_num}": {{\n')

            for chapter in sorted(lyrics_data[book_num].keys()):
                lyrics = lyrics_data[book_num][chapter]
                f.write(f'        {chapter}: `{lyrics}`,\n')

            f.write("    },\n")

        f.write("};\n")

    total_chapters = sum(len(chapters) for chapters in lyrics_data.values())
    file_size_mb = OUTPUT_FILE.stat().st_size / (1024 * 1024)

    print("="*70)
    print(f"  OK! {total_chapters} chapitres")
    print(f"  Fichier: {OUTPUT_FILE.name} ({file_size_mb:.2f} MB)")
    print("="*70)

if __name__ == "__main__":
    main()
