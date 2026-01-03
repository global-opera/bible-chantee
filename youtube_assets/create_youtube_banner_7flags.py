"""
YOUTUBE BANNER - BIBLE CHANTÉE - 7 LANGUES
2048x1152px avec drapeaux FR, EN, PT, ES, DE, IT, TL
"""
from PIL import Image, ImageDraw, ImageFont
import random

# Dimensions YouTube banner
WIDTH = 2048
HEIGHT = 1152

# Safe zone YouTube (visible sur tous écrans): 1546x423 centré
SAFE_WIDTH = 1546
SAFE_HEIGHT = 423
SAFE_X = (WIDTH - SAFE_WIDTH) // 2
SAFE_Y = (HEIGHT - SAFE_HEIGHT) // 2

# Couleurs Bible Chantée
BLEU_NUIT = (30, 58, 95)      # #1E3A5F
BLEU_SOMBRE = (22, 43, 70)    # #162B46
OR_MOYEN = (245, 203, 66)     # #F5CB42
BLANC = (255, 255, 255)

def create_gradient(width, height, color_top, color_bottom):
    """Créer un dégradé vertical"""
    img = Image.new('RGB', (width, height), color_top)
    draw = ImageDraw.Draw(img)

    for y in range(height):
        ratio = y / height
        r = int(color_top[0] + (color_bottom[0] - color_top[0]) * ratio)
        g = int(color_top[1] + (color_bottom[1] - color_top[1]) * ratio)
        b = int(color_top[2] + (color_bottom[2] - color_top[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return img

def add_stars(img, count=200):
    """Ajouter des étoiles aléatoires"""
    draw = ImageDraw.Draw(img)
    width, height = img.size

    for _ in range(count):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.choice([1, 2, 3])
        brightness = random.randint(150, 255)
        color = (brightness, brightness, brightness)

        if size == 1:
            draw.point((x, y), fill=color)
        elif size == 2:
            draw.ellipse([x-1, y-1, x+1, y+1], fill=color)
        else:
            # Étoile à 4 branches
            draw.line([(x-2, y), (x+2, y)], fill=color, width=1)
            draw.line([(x, y-2), (x, y+2)], fill=color, width=1)

def add_text(img):
    """Ajouter les textes dans la safe zone"""
    draw = ImageDraw.Draw(img)

    # Charger la police
    try:
        font_title = ImageFont.truetype("arial.ttf", 110)
        font_subtitle = ImageFont.truetype("arial.ttf", 60)
        font_flags = ImageFont.truetype("arial.ttf", 80)
    except:
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_flags = ImageFont.load_default()

    # Titre: "BIBLE CHANTÉE"
    title = "BIBLE CHANTÉE"
    bbox = draw.textbbox((0, 0), title, font=font_title)
    title_width = bbox[2] - bbox[0]
    title_x = (WIDTH - title_width) // 2
    title_y = SAFE_Y + 50

    # Ombre
    draw.text((title_x + 3, title_y + 3), title, font=font_title, fill=(0, 0, 0))
    # Texte principal
    draw.text((title_x, title_y), title, font=font_title, fill=OR_MOYEN)

    # Sous-titre: "La Parole de Dieu en musique"
    subtitle = "La Parole de Dieu en musique"
    bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    subtitle_width = bbox[2] - bbox[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    subtitle_y = title_y + 130

    draw.text((subtitle_x, subtitle_y), subtitle, font=font_subtitle, fill=BLANC)

    # Drapeaux: 🇫🇷 🇬🇧 🇧🇷 🇪🇸 🇩🇪 🇮🇹 🇵🇭
    flags = "🇫🇷  🇬🇧  🇧🇷  🇪🇸  🇩🇪  🇮🇹  🇵🇭"
    bbox = draw.textbbox((0, 0), flags, font=font_flags)
    flags_width = bbox[2] - bbox[0]
    flags_x = (WIDTH - flags_width) // 2
    flags_y = subtitle_y + 90

    draw.text((flags_x, flags_y), flags, font=font_flags, fill=BLANC)

# Créer le fond avec dégradé
print("Création du dégradé...")
img = create_gradient(WIDTH, HEIGHT, BLEU_SOMBRE, BLEU_NUIT)

# Ajouter les étoiles
print("Ajout des étoiles...")
add_stars(img, count=200)

# Ajouter les textes
print("Ajout des textes...")
add_text(img)

# Sauvegarder
output_file = "youtube_banner_7langues.png"
img.save(output_file, quality=95)
print(f"\nBannière sauvegardée : {output_file}")
print(f"Taille : {WIDTH}x{HEIGHT}px")
print(f"Safe zone : {SAFE_WIDTH}x{SAFE_HEIGHT}px (centré)")
