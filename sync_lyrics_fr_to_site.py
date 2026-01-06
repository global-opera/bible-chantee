"""
Synchronise les paroles FR depuis lyrics/FR vers lyrics-data.js
Génère window.chapterLyrics depuis les transcriptions Whisper FR
"""
import re
from pathlib import Path
from datetime import datetime

# Configuration
# IMPORTANT: Using V2 lyrics (VRAIES paroles chantées - Archive.org)
LYRICS_DIR = Path("G:/Mon Drive/01 BibleChantee/Lyrics/FR/FR_V2")
OUTPUT_FILE = Path("C:/ScriptBible/bible-chantee/lyrics-data.js")

# Mapping des codes de livres vers numéros
BOOK_CODES = {
    "01_GEN": "01", "02_EXO": "02", "03_LEV": "03", "04_NUM": "04",
    "05_DEU": "05", "06_JOS": "06", "07_JDG": "07", "08_RUT": "08",
    "09_1SA": "09", "10_2SA": "10", "11_1KI": "11", "12_2KI": "12",
    "13_1CH": "13", "14_2CH": "14", "15_EZR": "15", "16_NEH": "16",
    "17_EST": "17", "18_JOB": "18", "19_PSA": "19", "20_PRO": "20",
    "21_ECC": "21", "22_SON": "22", "23_ISA": "23", "24_JER": "24",
    "25_LAM": "25", "26_EZE": "26", "27_DAN": "27", "28_HOS": "28",
    "29_JOE": "29", "30_AMO": "30", "31_OBA": "31", "32_JON": "32",
    "33_MIC": "33", "34_NAH": "34", "35_HAB": "35", "36_ZEP": "36",
    "37_HAG": "37", "38_ZEC": "38", "39_MAL": "39", "40_MAT": "40",
    "41_MAR": "41", "42_LUK": "42", "43_JOH": "43", "44_ACT": "44",
    "45_ROM": "45", "46_1CO": "46", "47_2CO": "47", "48_GAL": "48",
    "49_EPH": "49", "50_PHP": "50", "51_COL": "51", "52_1TH": "52",
    "53_2TH": "53", "54_1TI": "54", "55_2TI": "55", "56_TIT": "56",
    "57_PHM": "57", "58_HEB": "58", "59_JAS": "59", "60_1PE": "60",
    "61_2PE": "61", "62_1JO": "62", "63_2JO": "63", "64_3JO": "64",
    "65_JUD": "65", "66_REV": "66"
}

def extract_book_chapter(filename):
    """Extract book code and chapter from filename
    Examples: 01_GEN_01_FR.txt -> ('01', 1)
              40_MAT_05_FR.txt -> ('40', 5)
              60_1PE_01_FR.txt -> ('60', 1)
    """
    # Flexible pattern: NN_BOOKCODE_NN_FR.txt where BOOKCODE is 2-4 letters
    match = re.match(r'(\d+)_([A-Z0-9]{2,4})_(\d+)_FR\.txt', filename)
    if match:
        book_num = match.group(1)
        chapter = int(match.group(3))
        return (book_num, chapter)
    return None

def read_lyrics(file_path):
    """Read and clean lyrics content from Whisper transcription"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove [TITLE] section if present
        content = re.sub(r'\[TITLE\].*?\n', '', content, flags=re.DOTALL)

        # Extract everything after [LYRICS]
        lyrics_match = re.search(r'\[LYRICS\](.*?)(\[STYLE\]|$)', content, re.DOTALL)
        if lyrics_match:
            lyrics = lyrics_match.group(1).strip()
        else:
            # If no [LYRICS] tag, use entire content
            lyrics = content.strip()

        # Escape backticks, backslashes, and dollar signs for JS template literals
        lyrics = lyrics.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

        return lyrics
    except Exception as e:
        print(f"  [ERROR] {file_path.name}: {e}")
        return None

def collect_all_lyrics():
    """Collecte toutes les paroles de tous les livres"""
    lyrics_data = {}

    print("="*70)
    print("  SYNCHRONISATION LYRICS FR -> lyrics-data.js")
    print("="*70)
    print(f"\nSource: {LYRICS_DIR}")
    print()

    for txt_file in sorted(LYRICS_DIR.rglob("*.txt")):
        result = extract_book_chapter(txt_file.name)
        if not result:
            print(f"  [SKIP] {txt_file.name} (format non reconnu)")
            continue

        book_num, chapter = result
        lyrics = read_lyrics(txt_file)

        if lyrics:
            if book_num not in lyrics_data:
                lyrics_data[book_num] = {}

            # Only keep first occurrence (in case of duplicates)
            if chapter not in lyrics_data[book_num]:
                lyrics_data[book_num][chapter] = lyrics
                print(f"  OK Livre {book_num} ch.{chapter}")

    return lyrics_data

def generate_js_file(lyrics_data):
    """Génère le fichier lyrics-data.js"""
    print(f"\nGénération {OUTPUT_FILE.name}...")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("// Paroles des chapitres - Bible Chantee\n")
        f.write("// Source: Lyrics FR V2 (Archive.org)\n")
        f.write(f"// Auto-genere: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("window.chapterLyrics = {\n")

        for book_num in sorted(lyrics_data.keys()):
            f.write(f'    "{book_num}": {{\n')

            for chapter in sorted(lyrics_data[book_num].keys()):
                lyrics = lyrics_data[book_num][chapter]
                f.write(f'        {chapter}: `{lyrics}`,\n')

            f.write("    },\n")

        f.write("};\n")

    # Stats
    total_chapters = sum(len(chapters) for chapters in lyrics_data.values())
    file_size_mb = OUTPUT_FILE.stat().st_size / (1024 * 1024)

    print("="*70)
    print(f"  SUCCES!")
    print(f"  Chapitres traites: {total_chapters}")
    print(f"  Livres traites: {len(lyrics_data)}")
    print(f"  Fichier: {OUTPUT_FILE.name} ({file_size_mb:.2f} MB)")
    print("="*70)

def main():
    lyrics_data = collect_all_lyrics()
    if lyrics_data:
        generate_js_file(lyrics_data)
    else:
        print("\nERREUR: Aucune parole trouvee!")

if __name__ == "__main__":
    main()
