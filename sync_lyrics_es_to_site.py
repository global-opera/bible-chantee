"""
Synchronise les paroles ES depuis Lyrics/ES vers lyrics-data-es.js
Adapté pour l'espagnol - Reina Valera 1909
"""
import re
from pathlib import Path
from datetime import datetime

# Configuration
LYRICS_BASE_DIR = Path("G:/Mon Drive/01 BibleChantee/Lyrics/ES")
GITHUB_REPO_DIR = Path("C:/ScriptBible/bible-chantee")
LYRICS_DATA_FILE = GITHUB_REPO_DIR / "lyrics-data-es.js"

# Mapping des codes de livres vers numéros
BOOK_CODES = {
    "01_GEN": "01", "02_EXO": "02", "03_LEV": "03", "04_NUM": "04",
    "05_DEU": "05", "06_JOS": "06", "07_JDG": "07", "08_RUT": "08",
    "09_1SAM": "09", "10_2SAM": "10", "11_1KI": "11", "12_2KI": "12",
    "13_1CH": "13", "14_2CH": "14", "15_EZR": "15", "16_NEH": "16",
    "17_EST": "17", "18_JOB": "18", "19_PSA": "19", "20_PRO": "20",
    "21_ECC": "21", "22_SON": "22", "23_ISA": "23", "24_JER": "24",
    "25_LAM": "25", "26_EZK": "26", "27_DAN": "27", "28_HOS": "28",
    "29_JOL": "29", "30_AMO": "30", "31_OBA": "31", "32_JON": "32",
    "33_MIC": "33", "34_NAH": "34", "35_HAB": "35", "36_ZEP": "36",
    "37_HAG": "37", "38_ZEC": "38", "39_MAL": "39", "40_MAT": "40",
    "41_MRK": "41", "42_LUK": "42", "43_JHN": "43", "44_ACT": "44",
    "45_ROM": "45", "46_1CO": "46", "47_2CO": "47", "48_GAL": "48",
    "49_EPH": "49", "50_PHP": "50", "51_COL": "51", "52_1TH": "52",
    "53_2TH": "53", "54_1TI": "54", "55_2TI": "55", "56_TIT": "56",
    "57_PHM": "57", "58_HEB": "58", "59_JAS": "59", "60_1PE": "60",
    "61_2PE": "61", "62_1JN": "62", "63_2JN": "63", "64_3JN": "64",
    "65_JUD": "65", "66_REV": "66"
}

def parse_lyrics_file(file_path):
    """Parse un fichier de paroles au format standard"""
    try:
        content = file_path.read_text(encoding='utf-8')

        # Extraire [LYRICS]
        lyrics_match = re.search(r'\[LYRICS\]\s*\n(.+?)(?=\[STYLE\]|\[TITRE\]|$)', content, re.DOTALL)
        lyrics = lyrics_match.group(1).strip() if lyrics_match else ""

        return lyrics if lyrics else None
    except Exception as e:
        print(f"Error reading {file_path.name}: {e}")
        return None

def collect_all_lyrics():
    """Collecte toutes les paroles de tous les livres"""
    all_lyrics = {}

    for book_code, book_id in BOOK_CODES.items():
        book_dir = LYRICS_BASE_DIR / book_code

        if not book_dir.exists():
            continue

        # Trouver tous les fichiers de paroles ES
        files = sorted(book_dir.glob(f"{book_code}_*_ES.txt"))

        if not files:
            continue

        print(f"Reading {book_code}: {len(files)} chapters")
        book_lyrics = {}

        for file_path in files:
            # Extraire le numéro de chapitre
            match = re.search(r'_(\d+)_ES\.txt$', file_path.name)
            if not match:
                continue

            chapter_num = int(match.group(1))
            lyrics = parse_lyrics_file(file_path)

            if lyrics:
                book_lyrics[chapter_num] = lyrics

        if book_lyrics:
            all_lyrics[book_id] = book_lyrics
            print(f"  -> {len(book_lyrics)} chapters with lyrics")

    return all_lyrics

def generate_lyrics_js(lyrics_data):
    """Génère le contenu du fichier lyrics-data-es.js"""
    js_content = "// Lyrics ES - Bible Cantada (Reina Valera 1909)\n"
    js_content += f"// Auto-generado: {datetime.now().strftime('%Y-%m-%d')}\n"
    js_content += "window.chapterLyricsES = {\n"

    for book_id in sorted(lyrics_data.keys(), key=lambda x: int(x)):
        chapters = lyrics_data[book_id]
        js_content += f'\n    "{book_id}": {{\n'

        for chapter_num in sorted(chapters.keys()):
            lyrics = chapters[chapter_num]
            # Échapper les backticks et backslashes
            lyrics_escaped = lyrics.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
            js_content += f'        {chapter_num}: `{lyrics_escaped}`,\n'

        js_content += "    },"

    js_content += "\n\n};\n"
    return js_content

def main():
    print("=== SINCRONIZACION DE LETRAS ES ===\n")

    # 1. Collecter toutes les paroles
    print("[1/3] Collecting lyrics from ES folders...")
    lyrics_data = collect_all_lyrics()

    total_books = len(lyrics_data)
    total_chapters = sum(len(chapters) for chapters in lyrics_data.values())
    print(f"\n  Total: {total_books} libros, {total_chapters} capitulos\n")

    if total_chapters == 0:
        print("ERROR: No se encontraron letras!")
        return False

    # 2. Générer le fichier JS
    print("[2/3] Generating lyrics-data-es.js...")
    js_content = generate_lyrics_js(lyrics_data)

    # 3. Écrire le fichier
    print("[3/3] Writing file...")
    try:
        with open(LYRICS_DATA_FILE, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"  OK: {LYRICS_DATA_FILE}")
        print(f"  Size: {len(js_content) / 1024 / 1024:.1f} MB")
        print(f"\n✓ Sincronizacion completa!")
        print(f"  {total_books} libros × {total_chapters} capitulos")
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

if __name__ == "__main__":
    main()
