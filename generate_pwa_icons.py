#!/usr/bin/env python3
"""
Generate PWA icons for Bible Chantee with flags
"""

from PIL import Image, ImageDraw, ImageFont
import os

icons_dir = "icons"
os.makedirs(icons_dir, exist_ok=True)

# Couleurs
BG_COLOR = (0, 0, 128)  # #000080
GOLD = (255, 215, 0)    # #FFD700
WHITE = (255, 255, 255)

# Drapeaux (couleurs simplifiées)
FLAGS = {
    'fr': [(0, 0, 85), WHITE, (239, 65, 53)],      # Bleu Blanc Rouge
    'pt': [(0, 151, 57), (255, 223, 0), (0, 56, 168)],  # Vert Jaune Bleu
    'en': [(1, 33, 105), WHITE, (200, 16, 46)],    # Union Jack simplifie
    'es': [(170, 21, 27), (241, 191, 0), (170, 21, 27)]  # Rouge Jaune Rouge
}

LABELS = {
    'fr': 'Bible',
    'pt': 'Biblia',
    'en': 'Bible',
    'es': 'Biblia'
}

def create_icon(lang, size):
    # Create image with rounded corners (maskable safe zone)
    img = Image.new('RGB', (size, size), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Cercle central dore (note de musique stylisee)
    center = size // 2
    radius = size // 4
    note_y_offset = size // 8
    draw.ellipse([center-radius, center-radius-note_y_offset, center+radius, center+radius-note_y_offset], fill=GOLD)

    # Tige de la note
    stem_width = size // 20
    stem_height = size // 3
    draw.rectangle([center+radius-stem_width, center-radius-note_y_offset, center+radius, center-stem_height], fill=GOLD)

    # Drapeau en haut a droite (20% de la taille)
    flag_size = size // 5
    flag_x = size - flag_size - size//20
    flag_y = size // 20
    colors = FLAGS[lang]
    stripe_width = flag_size // 3

    if lang == 'es':
        # Horizontal: rouge-jaune-rouge
        stripe_height = flag_size // 4
        draw.rectangle([flag_x, flag_y, flag_x+flag_size, flag_y+stripe_height], fill=colors[0])
        draw.rectangle([flag_x, flag_y+stripe_height, flag_x+flag_size, flag_y+flag_size-stripe_height], fill=colors[1])
        draw.rectangle([flag_x, flag_y+flag_size-stripe_height, flag_x+flag_size, flag_y+flag_size], fill=colors[2])
    elif lang == 'pt':
        # Drapeau bresilien simplifie: vert avec losange jaune
        draw.rectangle([flag_x, flag_y, flag_x+flag_size, flag_y+flag_size], fill=colors[0])
        # Losange jaune
        mid_x = flag_x + flag_size // 2
        mid_y = flag_y + flag_size // 2
        diamond_w = flag_size // 3
        diamond_h = flag_size // 4
        draw.polygon([
            (mid_x, mid_y - diamond_h),
            (mid_x + diamond_w, mid_y),
            (mid_x, mid_y + diamond_h),
            (mid_x - diamond_w, mid_y)
        ], fill=colors[1])
    else:
        # Vertical: 3 bandes (FR ou EN)
        for i, color in enumerate(colors):
            draw.rectangle([flag_x+i*stripe_width, flag_y, flag_x+(i+1)*stripe_width, flag_y+flag_size], fill=color)

    # Texte en bas
    try:
        font_size = size // 8
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("Arial.ttf", font_size)
        except:
            font = ImageFont.load_default()

    text = LABELS[lang]
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_x = (size - text_width) // 2
    text_y = size - size//5
    draw.text((text_x, text_y), text, fill=GOLD, font=font)

    return img

# Generer toutes les icones
print("Generation des icones PWA...")
for lang in ['fr', 'pt', 'en', 'es']:
    for size in [192, 512]:
        icon = create_icon(lang, size)
        filename = f"{icons_dir}/icon-{lang}-{size}.png"
        icon.save(filename)
        print(f"Cree: {filename}")

print("\n8 icones generees avec succes!")
print(f"Localisation: {os.path.abspath(icons_dir)}/")
