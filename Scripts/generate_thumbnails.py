"""
Générateur automatique de thumbnails pour YouTube - Bible Chantée
Crée des visuels 1280x720px avec titre, sous-titre et logo
"""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import json

# Configuration
THUMBNAIL_DIR = Path("G:/Mon Drive/01 BibleChantee/Thumbnails/FR")
BACKGROUNDS_DIR = Path("G:/Mon Drive/01 BibleChantee/Thumbnails/Backgrounds")
FONTS_DIR = Path("C:/Windows/Fonts")

# Résolution YouTube
WIDTH = 1280
HEIGHT = 720

# Mapping des livres
BOOK_NAMES = {
    "01_GEN": "Genèse", "02_EXO": "Exode", "03_LEV": "Lévitique", "04_NUM": "Nombres",
    "05_DEU": "Deutéronome", "06_JOS": "Josué", "07_JDG": "Juges", "08_RUT": "Ruth",
    "09_1SAM": "1 Samuel", "10_2SAM": "2 Samuel", "11_1KI": "1 Rois", "12_2KI": "2 Rois",
    "13_1CH": "1 Chroniques", "14_2CH": "2 Chroniques", "15_EZR": "Esdras",
    "16_NEH": "Néhémie", "17_EST": "Esther", "18_JOB": "Job", "19_PSA": "Psaumes",
    "20_PRO": "Proverbes", "21_ECC": "Ecclésiaste", "22_SON": "Cantique des Cantiques",
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

# Thèmes spécifiques (pour sous-titres)
CHAPTER_THEMES = {
    "01_GEN_01": "La Création",
    "19_PSA_23": "L'Éternel est mon Berger",
    "43_JOH_03": "Naître de nouveau",
    "43_JOH_01": "La Parole faite chair",
    "40_MAT_05": "Les Béatitudes",
    "46_1CO_13": "L'hymne à l'amour",
    "45_ROM_08": "Rien ne nous séparera",
    "19_PSA_91": "Sous sa protection",
    "66_REV_21": "Nouvelle Jérusalem",
    "02_EXO_20": "Les Dix Commandements"
}

# Couleurs par testament
OLD_TESTAMENT_COLOR = (139, 90, 43)  # Bronze/terracotta
NEW_TESTAMENT_COLOR = (41, 128, 185)  # Bleu ciel
TEXT_COLOR = (255, 255, 255)  # Blanc
SHADOW_COLOR = (0, 0, 0, 180)  # Noir semi-transparent


class ThumbnailGenerator:
    def __init__(self):
        self.backgrounds_dir = BACKGROUNDS_DIR
        self.backgrounds_dir.mkdir(parents=True, exist_ok=True)

        # Créer des backgrounds par défaut si inexistants
        self._create_default_backgrounds()

    def _create_default_backgrounds(self):
        """Crée des backgrounds par défaut si aucun n'existe"""
        at_bg = self.backgrounds_dir / "old_testament.jpg"
        nt_bg = self.backgrounds_dir / "new_testament.jpg"

        if not at_bg.exists():
            # Créer background Ancien Testament (tons chauds)
            img = Image.new('RGB', (WIDTH, HEIGHT), OLD_TESTAMENT_COLOR)
            # Ajouter un dégradé
            draw = ImageDraw.Draw(img, 'RGBA')
            for i in range(HEIGHT):
                alpha = int(100 * (1 - i / HEIGHT))
                draw.rectangle([(0, i), (WIDTH, i+1)], fill=(0, 0, 0, alpha))
            img.save(at_bg, quality=95)
            print(f"[INFO] Background Ancien Testament créé: {at_bg}")

        if not nt_bg.exists():
            # Créer background Nouveau Testament (tons frais)
            img = Image.new('RGB', (WIDTH, HEIGHT), NEW_TESTAMENT_COLOR)
            # Ajouter un dégradé
            draw = ImageDraw.Draw(img, 'RGBA')
            for i in range(HEIGHT):
                alpha = int(100 * (1 - i / HEIGHT))
                draw.rectangle([(0, i), (WIDTH, i+1)], fill=(0, 0, 0, alpha))
            img.save(nt_bg, quality=95)
            print(f"[INFO] Background Nouveau Testament créé: {nt_bg}")

    def get_background(self, book_code):
        """Sélectionne le bon background selon le testament"""
        book_num = int(book_code.split('_')[0])

        if book_num <= 39:  # Ancien Testament
            bg_path = self.backgrounds_dir / "old_testament.jpg"
        else:  # Nouveau Testament
            bg_path = self.backgrounds_dir / "new_testament.jpg"

        if bg_path.exists():
            return Image.open(bg_path).convert('RGB')
        else:
            # Fallback: créer une image unie
            color = OLD_TESTAMENT_COLOR if book_num <= 39 else NEW_TESTAMENT_COLOR
            return Image.new('RGB', (WIDTH, HEIGHT), color)

    def get_fonts(self):
        """Charge les polices (Roboto si disponible, sinon Arial)"""
        try:
            # Essayer Roboto (meilleure qualité)
            title_font = ImageFont.truetype(str(FONTS_DIR / "RobotoCondensed-Bold.ttf"), 140)
            subtitle_font = ImageFont.truetype(str(FONTS_DIR / "Roboto-Regular.ttf"), 60)
            logo_font = ImageFont.truetype(str(FONTS_DIR / "Roboto-Bold.ttf"), 36)
        except:
            try:
                # Fallback: Arial Bold
                title_font = ImageFont.truetype(str(FONTS_DIR / "arialbd.ttf"), 120)
                subtitle_font = ImageFont.truetype(str(FONTS_DIR / "arial.ttf"), 50)
                logo_font = ImageFont.truetype(str(FONTS_DIR / "arialbd.ttf"), 32)
            except:
                # Dernier recours: police par défaut
                print("[WARNING] Polices TrueType non trouvées, utilisation police par défaut")
                title_font = ImageFont.load_default()
                subtitle_font = ImageFont.load_default()
                logo_font = ImageFont.load_default()

        return title_font, subtitle_font, logo_font

    def draw_text_with_shadow(self, draw, position, text, font, text_color, shadow_color):
        """Dessine du texte avec ombre portée pour meilleure lisibilité"""
        x, y = position

        # Ombre (décalée)
        draw.text((x+4, y+4), text, font=font, fill=shadow_color)

        # Texte principal
        draw.text((x, y), text, font=font, fill=text_color)

    def generate_thumbnail(self, book_code, chapter_num, output_path=None):
        """
        Génère un thumbnail pour un chapitre

        Args:
            book_code: Code du livre (ex: "19_PSA")
            chapter_num: Numéro du chapitre
            output_path: Chemin de sortie (optionnel)
        """
        book_name = BOOK_NAMES.get(book_code, book_code)

        print(f"[THUMBNAIL] {book_name} - Chapitre {chapter_num}")

        # Charger le background
        img = self.get_background(book_code)

        # Ajouter un léger flou pour adoucir
        img = img.filter(ImageFilter.GaussianBlur(radius=2))

        # Assombrir légèrement pour meilleure lisibilité du texte
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(0.7)

        # Préparer le dessin
        draw = ImageDraw.Draw(img, 'RGBA')

        # Charger les polices
        title_font, subtitle_font, logo_font = self.get_fonts()

        # === TEXTE PRINCIPAL (LIVRE + CHAPITRE) ===
        main_text = f"{book_name.upper()}"
        chapter_text = f"Chapitre {chapter_num}"

        # Calculer position centrée pour le titre
        try:
            bbox = draw.textbbox((0, 0), main_text, font=title_font)
            title_width = bbox[2] - bbox[0]
            title_height = bbox[3] - bbox[1]
        except:
            # Fallback si textbbox n'est pas disponible
            title_width = len(main_text) * 70
            title_height = 140

        title_x = (WIDTH - title_width) // 2
        title_y = HEIGHT // 2 - 100

        # Dessiner le titre principal
        self.draw_text_with_shadow(
            draw, (title_x, title_y), main_text,
            title_font, TEXT_COLOR, SHADOW_COLOR
        )

        # === NUMÉRO DE CHAPITRE ===
        try:
            bbox = draw.textbbox((0, 0), chapter_text, font=subtitle_font)
            chapter_width = bbox[2] - bbox[0]
        except:
            chapter_width = len(chapter_text) * 30

        chapter_x = (WIDTH - chapter_width) // 2
        chapter_y = title_y + title_height + 30

        self.draw_text_with_shadow(
            draw, (chapter_x, chapter_y), chapter_text,
            subtitle_font, TEXT_COLOR, SHADOW_COLOR
        )

        # === THÈME SPÉCIFIQUE (si disponible) ===
        theme_key = f"{book_code}_{chapter_num:02d}"
        if theme_key in CHAPTER_THEMES:
            theme_text = CHAPTER_THEMES[theme_key]

            try:
                bbox = draw.textbbox((0, 0), theme_text, font=subtitle_font)
                theme_width = bbox[2] - bbox[0]
            except:
                theme_width = len(theme_text) * 30

            theme_x = (WIDTH - theme_width) // 2
            theme_y = chapter_y + 80

            # Fond semi-transparent pour le thème
            padding = 20
            draw.rectangle(
                [(theme_x - padding, theme_y - 10),
                 (theme_x + theme_width + padding, theme_y + 70)],
                fill=(0, 0, 0, 100)
            )

            self.draw_text_with_shadow(
                draw, (theme_x, theme_y), theme_text,
                subtitle_font, (255, 215, 0), SHADOW_COLOR  # Or pour le thème
            )

        # === LOGO "BIBLE CHANTÉE" ===
        logo_text = "BIBLE CHANTÉE"

        try:
            bbox = draw.textbbox((0, 0), logo_text, font=logo_font)
            logo_width = bbox[2] - bbox[0]
        except:
            logo_width = len(logo_text) * 20

        logo_x = WIDTH - logo_width - 40
        logo_y = HEIGHT - 70

        # Fond semi-transparent pour le logo
        draw.rectangle(
            [(logo_x - 15, logo_y - 5),
             (logo_x + logo_width + 15, logo_y + 45)],
            fill=(0, 0, 0, 120)
        )

        draw.text((logo_x, logo_y), logo_text, font=logo_font, fill=TEXT_COLOR)

        # === ICÔNE MUSIQUE ===
        note_x = 40
        note_y = HEIGHT - 70
        draw.text((note_x, note_y), "♪ ♫", font=logo_font, fill=TEXT_COLOR)

        # Sauvegarder
        if not output_path:
            output_dir = THUMBNAIL_DIR / book_code
            output_dir.mkdir(parents=True, exist_ok=True)
            output_path = output_dir / f"{book_code}_{chapter_num:02d}.jpg"

        img.save(output_path, format='JPEG', quality=95, optimize=True)
        print(f"[OK] Thumbnail sauvegardé: {output_path}")

        return output_path

    def generate_for_book(self, book_code):
        """Génère tous les thumbnails pour un livre"""
        book_name = BOOK_NAMES.get(book_code, book_code)

        print(f"\n{'='*70}")
        print(f"  GÉNÉRATION THUMBNAILS - {book_name}")
        print(f"{'='*70}\n")

        # Déterminer le nombre de chapitres (approximatif)
        # En production, lire depuis les fichiers lyrics
        lyrics_dir = Path(f"G:/Mon Drive/01 BibleChantee/Lyrics/FR/{book_code}")

        if lyrics_dir.exists():
            files = list(lyrics_dir.glob(f"{book_code}_*_FR.txt"))
            chapters = []

            for file in files:
                import re
                match = re.search(r'_(\d+)_FR\.txt$', file.name)
                if match:
                    chapters.append(int(match.group(1)))

            chapters = sorted(chapters)
        else:
            # Fallback: deviner selon le livre
            chapter_counts = {
                "19_PSA": 150, "01_GEN": 50, "40_MAT": 28, "43_JOH": 21
            }
            max_chapter = chapter_counts.get(book_code, 10)
            chapters = list(range(1, max_chapter + 1))

        print(f"Chapitres détectés: {len(chapters)}")

        for chapter_num in chapters:
            try:
                self.generate_thumbnail(book_code, chapter_num)
            except Exception as e:
                print(f"[ERROR] Chapitre {chapter_num}: {e}")

        print(f"\n{'='*70}")
        print(f"  TERMINÉ - {len(chapters)} thumbnails générés")
        print(f"{'='*70}\n")

    def generate_all(self):
        """Génère tous les thumbnails pour toute la Bible"""
        print("="*70)
        print("  GÉNÉRATION COMPLÈTE - 66 LIVRES")
        print("="*70)
        print()

        total = 0

        for book_code in BOOK_NAMES.keys():
            try:
                self.generate_for_book(book_code)

                # Compter les thumbnails créés
                book_dir = THUMBNAIL_DIR / book_code
                if book_dir.exists():
                    count = len(list(book_dir.glob("*.jpg")))
                    total += count
            except Exception as e:
                print(f"[ERROR] {book_code}: {e}")

        print()
        print("="*70)
        print(f"  TOTAL: {total} thumbnails générés")
        print("="*70)


def main():
    """Point d'entrée principal"""
    print("="*70)
    print("  GÉNÉRATEUR DE THUMBNAILS YOUTUBE - BIBLE CHANTÉE")
    print("="*70)
    print()
    print("IMPORTANT:")
    print("- Résolution: 1280x720px (16:9)")
    print("- Format: JPEG optimisé (< 2MB)")
    print("- Backgrounds: Backgrounds/old_testament.jpg et new_testament.jpg")
    print()

    generator = ThumbnailGenerator()

    print("OPTIONS:")
    print("  1. Générer pour un livre spécifique")
    print("  2. Générer pour TOUS les livres (1,189 thumbnails)")
    print("  3. Générer un thumbnail unique")
    print()

    choice = input("Votre choix (1-3): ").strip()

    if choice == "1":
        print("\nCodes de livres:")
        for code, name in list(BOOK_NAMES.items())[:10]:
            print(f"  {code} - {name}")
        print("  ...")

        book_code = input("\nCode livre (ex: 19_PSA): ").strip().upper()

        if book_code in BOOK_NAMES:
            generator.generate_for_book(book_code)
        else:
            print("[ERROR] Code livre invalide")

    elif choice == "2":
        confirm = input("\nGénérer ~1,189 thumbnails? (oui/non): ").strip().lower()

        if confirm == "oui":
            generator.generate_all()
        else:
            print("Annulé")

    elif choice == "3":
        book_code = input("Code livre (ex: 19_PSA): ").strip().upper()
        chapter = input("Numéro chapitre: ").strip()

        if book_code in BOOK_NAMES and chapter.isdigit():
            generator.generate_thumbnail(book_code, int(chapter))
        else:
            print("[ERROR] Paramètres invalides")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[STOP] Arrêt manuel")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
