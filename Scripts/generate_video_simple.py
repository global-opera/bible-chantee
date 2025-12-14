"""
Génération simple de vidéos MP4 avec FFmpeg
Vidéo = Image statique + MP3 audio
"""
import subprocess
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont
import os

# Chemins
MP3_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
VIDEO_DIR = Path("G:/Mon Drive/01 BibleChantee/Videos/FR")
THUMBNAIL_DIR = Path("G:/Mon Drive/01 BibleChantee/Thumbnails/FR")

# Mapping des noms de livres
BOOK_NAMES = {
    "01_GEN": "Genèse", "02_EXO": "Exode", "03_LEV": "Lévitique", "04_NUM": "Nombres",
    "05_DEU": "Deutéronome", "06_JOS": "Josué", "07_JDG": "Juges", "08_RUT": "Ruth",
    "09_1SAM": "1 Samuel", "10_2SAM": "2 Samuel", "11_1KI": "1 Rois", "12_2KI": "2 Rois",
    "13_1CH": "1 Chroniques", "14_2CH": "2 Chroniques", "15_EZR": "Esdras",
    "16_NEH": "Néhémie", "17_EST": "Esther", "18_JOB": "Job", "19_PSA": "Psaumes",
    "20_PRO": "Proverbes", "21_ECC": "Ecclésiaste", "22_SON": "Cantique",
    "23_ISA": "Ésaïe", "24_JER": "Jérémie", "25_LAM": "Lamentations",
    "26_EZE": "Ézéchiel", "27_DAN": "Daniel", "28_HOS": "Osée", "29_JOE": "Joël",
    "30_AMO": "Amos", "31_OBA": "Abdias", "32_JON": "Jonas", "33_MIC": "Michée",
    "34_NAH": "Nahum", "35_HAB": "Habacuc", "36_ZEP": "Sophonie", "37_HAG": "Aggée",
    "38_ZEC": "Zacharie", "39_MAL": "Malachie", "40_MAT": "Matthieu", "41_MAR": "Marc",
    "42_LUK": "Luc", "43_JOH": "Jean", "44_ACT": "Actes", "45_ROM": "Romains",
    "46_1CO": "1 Corinthiens", "47_2CO": "2 Corinthiens", "48_GAL": "Galates",
    "49_EPH": "Éphésiens", "50_PHP": "Philippiens", "51_COL": "Colossiens",
    "52_1TH": "1 Thessaloniciens", "53_2TH": "2 Thessaloniciens",
    "54_1TI": "1 Timothée", "55_2TI": "2 Timothée", "56_TIT": "Tite",
    "57_PHM": "Philémon", "58_HEB": "Hébreux", "59_JAS": "Jacques",
    "60_1PE": "1 Pierre", "61_2PE": "2 Pierre", "62_1JO": "1 Jean",
    "63_2JO": "2 Jean", "64_3JO": "3 Jean", "65_JUD": "Jude", "66_REV": "Apocalypse"
}

# Couleurs par testament
COLORS = {
    "OLD": {"bg": "#1a4d7a", "text": "#ffffff", "accent": "#f4a261"},  # Bleu foncé
    "NEW": {"bg": "#8b2635", "text": "#ffffff", "accent": "#ffd700"}   # Rouge bordeaux
}

def get_testament(book_code):
    """Retourne OLD ou NEW selon le livre"""
    book_num = int(book_code.split("_")[0])
    return "OLD" if book_num <= 39 else "NEW"

def create_thumbnail(book_code, chapter_num, output_path):
    """Crée une miniature 1280x720px"""
    testament = get_testament(book_code)
    colors = COLORS[testament]

    # Créer l'image
    img = Image.new('RGB', (1280, 720), colors["bg"])
    draw = ImageDraw.Draw(img)

    # Fonts (utiliser Arial si disponible, sinon default)
    try:
        font_title = ImageFont.truetype("arial.ttf", 80)
        font_chapter = ImageFont.truetype("arialbd.ttf", 140)
        font_subtitle = ImageFont.truetype("arial.ttf", 50)
    except:
        font_title = ImageFont.load_default()
        font_chapter = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()

    # Titre du livre
    book_name = BOOK_NAMES.get(book_code, book_code)
    title_bbox = draw.textbbox((0, 0), book_name, font=font_title)
    title_width = title_bbox[2] - title_bbox[0]
    draw.text(((1280-title_width)/2, 150), book_name, fill=colors["text"], font=font_title)

    # Numéro du chapitre
    chapter_text = f"Chapitre {chapter_num}"
    chapter_bbox = draw.textbbox((0, 0), chapter_text, font=font_chapter)
    chapter_width = chapter_bbox[2] - chapter_bbox[0]
    draw.text(((1280-chapter_width)/2, 300), chapter_text, fill=colors["accent"], font=font_chapter)

    # Sous-titre
    subtitle = "La Bible Chantée"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    draw.text(((1280-subtitle_width)/2, 550), subtitle, fill=colors["text"], font=font_subtitle)

    # Sauvegarder
    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, quality=95)
    print(f"[THUMB] {output_path.name}")

    return output_path

def generate_video(book_code, chapter_num, test_mode=False):
    """
    Génère une vidéo MP4 à partir d'un MP3

    Args:
        book_code: Code du livre (ex: "19_PSA")
        chapter_num: Numéro du chapitre
        test_mode: Si True, génération rapide pour test
    """
    # Chemins
    mp3_file = MP3_DIR / book_code / f"{book_code}_{chapter_num}.mp3"
    if not mp3_file.exists():
        print(f"[SKIP] MP3 manquant: {mp3_file}")
        return False

    # Créer miniature
    thumbnail_path = THUMBNAIL_DIR / book_code / f"{book_code}_{chapter_num}.jpg"
    if not thumbnail_path.exists():
        create_thumbnail(book_code, chapter_num, thumbnail_path)

    # Chemin vidéo de sortie
    video_file = VIDEO_DIR / book_code / f"{book_code}_{chapter_num}.mp4"
    video_file.parent.mkdir(parents=True, exist_ok=True)

    # Si déjà existant, skip
    if video_file.exists() and not test_mode:
        print(f"[SKIP] Vidéo existe: {video_file.name}")
        return True

    print(f"[VIDEO] Génération: {BOOK_NAMES.get(book_code)} {chapter_num}")

    # Commande FFmpeg
    # -loop 1: répéter l'image
    # -i thumbnail: image d'entrée
    # -i mp3: audio d'entrée
    # -c:v libx264: codec vidéo H.264
    # -tune stillimage: optimisé pour image fixe
    # -c:a aac: codec audio AAC
    # -b:a 192k: bitrate audio
    # -pix_fmt yuv420p: format pixel compatible YouTube
    # -shortest: durée = durée de l'audio

    cmd = [
        'ffmpeg',
        '-y',  # Overwrite
        '-loop', '1',
        '-i', str(thumbnail_path),
        '-i', str(mp3_file),
        '-c:v', 'libx264',
        '-tune', 'stillimage',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-shortest',
        '-movflags', '+faststart',  # Optimisation web
        str(video_file)
    ]

    try:
        # Lancer FFmpeg
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes max
        )

        if result.returncode == 0:
            size_mb = video_file.stat().st_size / (1024*1024)
            print(f"[OK] {video_file.name} ({size_mb:.1f} MB)")
            return True
        else:
            print(f"[ERROR] FFmpeg failed: {result.stderr[:200]}")
            return False

    except subprocess.TimeoutExpired:
        print(f"[ERROR] Timeout après 5 minutes")
        return False
    except Exception as e:
        print(f"[ERROR] {e}")
        return False

def generate_test_sample():
    """Génère 10 vidéos test représentatives"""
    print("="*80)
    print("  GÉNÉRATION VIDÉOS TEST - 10 CHAPITRES")
    print("="*80)

    # Sélection représentative:
    # - Ancien Testament: 5 chapitres
    # - Nouveau Testament: 5 chapitres
    # - Différentes tailles

    test_chapters = [
        # Ancien Testament
        ("01_GEN", 1, "Genèse 1 - Création"),
        ("19_PSA", 23, "Psaume 23 - Le Bon Berger"),
        ("19_PSA", 91, "Psaume 91 - Protection"),
        ("20_PRO", 3, "Proverbes 3 - Sagesse"),
        ("23_ISA", 40, "Ésaïe 40 - Consolation"),
        # Nouveau Testament
        ("40_MAT", 5, "Matthieu 5 - Béatitudes"),
        ("43_JOH", 3, "Jean 3 - Nicodème"),
        ("45_ROM", 8, "Romains 8 - Rien ne sépare"),
        ("46_1CO", 13, "1 Corinthiens 13 - Amour"),
        ("50_PHP", 4, "Philippiens 4 - Joie"),
    ]

    success = 0
    failed = 0

    for book_code, chapter_num, description in test_chapters:
        print(f"\n[{success+failed+1}/10] {description}")

        if generate_video(book_code, chapter_num, test_mode=True):
            success += 1
        else:
            failed += 1

    # Résumé
    print("\n" + "="*80)
    print(f"  RÉSULTATS: {success} réussies, {failed} échouées")
    print("="*80)

    if success > 0:
        print(f"\nVidéos générées dans: {VIDEO_DIR}")
        print(f"Miniatures dans: {THUMBNAIL_DIR}")
        print("\nÀ tester:")
        print("1. Qualité vidéo/audio")
        print("2. Compatibilité YouTube")
        print("3. Taille des fichiers")

    return success, failed

def generate_all_videos():
    """Génère toutes les vidéos pour tous les MP3 existants"""
    print("="*80)
    print("  GÉNÉRATION COMPLÈTE - TOUTES LES VIDÉOS")
    print("="*80)

    all_mp3s = list(MP3_DIR.glob("*/*.mp3"))
    total = len(all_mp3s)

    print(f"\nMP3 trouvés: {total}")
    print(f"Estimation durée: ~{total*0.5/60:.1f} heures\n")

    success = 0
    failed = 0

    for i, mp3_file in enumerate(all_mp3s, 1):
        # Extraire book_code et chapter_num
        book_code = mp3_file.parent.name
        chapter_num = int(mp3_file.stem.split("_")[-1])

        print(f"\n[{i}/{total}] {BOOK_NAMES.get(book_code)} {chapter_num}")

        if generate_video(book_code, chapter_num):
            success += 1
        else:
            failed += 1

        # Rapport intermédiaire tous les 50
        if i % 50 == 0:
            print(f"\n[PROGRESS] {i}/{total} - {success} OK, {failed} KO")

    # Résumé final
    print("\n" + "="*80)
    print(f"  TERMINÉ: {success}/{total} vidéos générées")
    print("="*80)

    return success, failed

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--all":
        generate_all_videos()
    else:
        generate_test_sample()
