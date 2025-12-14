"""Script de déploiement immédiat - One-shot"""
import os
import json
import re
import subprocess
from pathlib import Path
from datetime import datetime

# Configuration
SUNO_OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
GITHUB_REPO_DIR = Path("C:/ScriptBible/bible-chantee")
AUDIO_URLS_FILE = GITHUB_REPO_DIR / "audio-urls.js"

# Mapping des codes de livres
BOOK_CODES = {
    "01_GEN": "01", "02_EXO": "02", "03_LEV": "03", "04_NUM": "04",
    "05_DEU": "05", "06_JOS": "06", "07_JDG": "07", "08_RUT": "08",
    "09_1SAM": "09", "10_2SAM": "10", "11_1KI": "11", "12_2KI": "12",
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

def scan_mp3_files():
    """Scanne tous les MP3 générés et leurs URLs CDN"""
    print("[1/3] Scan des MP3 et URLs CDN...")
    mp3_data = {}
    total_mp3s = 0
    total_urls = 0

    for book_dir in SUNO_OUTPUT_DIR.iterdir():
        if not book_dir.is_dir():
            continue

        book_code = book_dir.name
        if book_code not in BOOK_CODES:
            continue

        book_id = BOOK_CODES[book_code]

        # Lire les URLs CDN depuis le fichier JSON
        json_file = book_dir / "cdn_urls.json"
        cdn_urls = {}
        if json_file.exists():
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    cdn_urls = json.load(f)
                    total_urls += len(cdn_urls)
            except Exception as e:
                print(f"   Erreur lecture {json_file}: {e}")

        mp3_files = list(book_dir.glob("*.mp3"))
        total_mp3s += len(mp3_files)

        if mp3_files:
            mp3_data[book_id] = {}
            for mp3_file in mp3_files:
                # Extraire le numéro de chapitre du nom de fichier
                match = re.search(r"_(\d+)\.mp3$", mp3_file.name)
                if match:
                    chapter_num = int(match.group(1))
                    # Utiliser l'URL CDN réelle si disponible
                    cdn_url = cdn_urls.get(str(chapter_num))
                    if cdn_url and cdn_url.startswith("https://cdn"):
                        mp3_data[book_id][chapter_num] = cdn_url

    print(f"   Trouve: {len(mp3_data)} livres, {total_mp3s} MP3s, {total_urls} URLs CDN")
    return mp3_data

def update_audio_urls_file(mp3_data):
    """Met à jour le fichier audio-urls.js"""
    print("[2/3] Mise a jour audio-urls.js...")

    # Générer le contenu
    js_content = "// audio-urls.js - URLs Suno CDN pour Bible Chantee\n"
    js_content += f"// Auto-generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    js_content += "const audioUrls = {\n"

    total_chapters = 0
    for book_id in sorted(mp3_data.keys(), key=lambda x: int(x)):
        chapters = mp3_data[book_id]
        if not chapters:
            continue

        js_content += f'    "{book_id}": {{\n'

        for chapter_num in sorted(chapters.keys()):
            url = chapters[chapter_num]
            js_content += f'        {chapter_num}: "{url}",\n'
            total_chapters += 1

        js_content += "    },\n"

    js_content += "};\n"

    # Écrire le fichier
    try:
        with open(AUDIO_URLS_FILE, "w", encoding="utf-8") as f:
            f.write(js_content)
        print(f"   OK - {total_chapters} chapitres dans audio-urls.js")
        return total_chapters > 0
    except Exception as e:
        print(f"   Erreur ecriture: {e}")
        return False

def git_commit_and_push(mp3_count):
    """Commit et push automatique sur GitHub"""
    print("[3/3] Deploiement sur GitHub...")
    try:
        os.chdir(GITHUB_REPO_DIR)

        # Vérifier s'il y a des changements
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True
        )

        if not result.stdout.strip():
            print("   Aucun changement a deployer")
            return False

        # Add
        subprocess.run(["git", "add", "audio-urls.js"], check=True)

        # Commit
        commit_msg = f"""Update audio-urls.js: {mp3_count} chapters available

Auto-deployed by Claude Code
{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
"""

        subprocess.run(
            ["git", "commit", "-m", commit_msg],
            check=True,
            capture_output=True
        )

        # Push
        subprocess.run(["git", "push"], check=True, capture_output=True)

        print(f"   OK - Deploye sur GitHub")
        print(f"   Site: https://global-opera.github.io/bible-chantee")
        return True

    except subprocess.CalledProcessError as e:
        print(f"   Erreur Git: {e}")
        return False
    except Exception as e:
        print(f"   Erreur: {e}")
        return False

def sync_lyrics():
    """Synchronise les paroles vers lyrics-data.js"""
    print("[BONUS] Synchronisation des paroles...")
    try:
        import sys
        sys.path.insert(0, str(Path("G:/Mon Drive/01 BibleChantee/Scripts")))
        import sync_lyrics_to_site
        result = sync_lyrics_to_site.main()
        return result
    except Exception as e:
        print(f"   Note: sync paroles skip ({e})")
        return False

def main():
    """Déploiement one-shot"""
    print("="*70)
    print("  DEPLOIEMENT BIBLE CHANTEE")
    print("="*70)

    # 1. Scanner
    mp3_data = scan_mp3_files()
    mp3_count = sum(len(chapters) for chapters in mp3_data.values())

    if mp3_count == 0:
        print("\nAucun MP3 avec URL CDN trouve!")
        return

    # 2. Mettre à jour audio
    audio_updated = update_audio_urls_file(mp3_data)

    # 3. Synchroniser les paroles
    lyrics_updated = sync_lyrics()

    # 4. Déployer si changements
    if audio_updated or lyrics_updated:
        if git_commit_and_push(mp3_count):
            print("\n" + "="*70)
            print("  DEPLOIEMENT TERMINE!")
            print("="*70)
            print(f"  Audio: {mp3_count} chapitres")
            print(f"  Paroles: {'OK' if lyrics_updated else 'Inchangées'}")
            print("  https://global-opera.github.io/bible-chantee")
            print("="*70)
    else:
        print("\nPas de changement a deployer")

if __name__ == "__main__":
    main()
