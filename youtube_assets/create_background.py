"""
Créer image de fond pour vidéo YouTube Bible Chantée
1920x1080 avec dégradé, étoiles et texte
"""
from PIL import Image, ImageDraw, ImageFont
import random

# Dimensions
WIDTH = 1920
HEIGHT = 1080

# Couleurs
COLOR_TOP = (26, 26, 46)      # #1a1a2e
COLOR_BOTTOM = (22, 33, 62)    # #16213e
COLOR_GOLD = (255, 215, 0)     # Or pour titre
COLOR_WHITE = (255, 255, 255)  # Blanc pour texte

def create_gradient(width, height, color_top, color_bottom):
    """Créer un dégradé vertical"""
    img = Image.new('RGB', (width, height), color_top)
    draw = ImageDraw.Draw(img)
    
    for y in range(height):
        # Interpolation linéaire
        ratio = y / height
        r = int(color_top[0] + (color_bottom[0] - color_top[0]) * ratio)
        g = int(color_top[1] + (color_bottom[1] - color_top[1]) * ratio)
        b = int(color_top[2] + (color_bottom[2] - color_top[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def add_stars(img, count=150):
    """Ajouter des étoiles aléatoires"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    for _ in range(count):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.choice([1, 1, 1, 2, 2, 3])  # Plus de petites étoiles
        brightness = random.randint(150, 255)
        color = (brightness, brightness, brightness)
        
        if size == 1:
            draw.point((x, y), fill=color)
        else:
            draw.ellipse([x-size, y-size, x+size, y+size], fill=color)
    
    return img

def add_text(img, title, subtitle, footer):
    """Ajouter les textes"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    try:
        # Polices (tailles ajustées)
        font_title = ImageFont.truetype("arial.ttf", 90)
        font_subtitle = ImageFont.truetype("arial.ttf", 60)
        font_footer = ImageFont.truetype("arial.ttf", 40)
    except:
        # Fallback si arial.ttf non trouvé
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_footer = ImageFont.load_default()
    
    # Titre principal (doré, centré en haut)
    bbox = draw.textbbox((0, 0), title, font=font_title)
    text_width = bbox[2] - bbox[0]
    x = (width - text_width) // 2
    y = 80
    
    # Ombre pour le titre
    draw.text((x+3, y+3), title, fill=(0, 0, 0), font=font_title)
    draw.text((x, y), title, fill=COLOR_GOLD, font=font_title)
    
    # Sous-titre (blanc, centré)
    bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    text_width = bbox[2] - bbox[0]
    x = (width - text_width) // 2
    y = 200
    
    draw.text((x+2, y+2), subtitle, fill=(0, 0, 0), font=font_subtitle)
    draw.text((x, y), subtitle, fill=COLOR_WHITE, font=font_subtitle)
    
    # Footer (blanc, centré en bas)
    bbox = draw.textbbox((0, 0), footer, font=font_footer)
    text_width = bbox[2] - bbox[0]
    x = (width - text_width) // 2
    y = height - 100
    
    draw.text((x+2, y+2), footer, fill=(0, 0, 0), font=font_footer)
    draw.text((x, y), footer, fill=COLOR_WHITE, font=font_footer)
    
    return img

def main():
    print("Creation de l'image de fond 1920x1080...")

    # 1. Creer le degrade
    img = create_gradient(WIDTH, HEIGHT, COLOR_TOP, COLOR_BOTTOM)
    print("  OK Degrade cree")

    # 2. Ajouter les etoiles
    img = add_stars(img, count=150)
    print("  OK Etoiles ajoutees")

    # 3. Ajouter les textes
    img = add_text(
        img,
        title="BIBLE CHANTEE",
        subtitle="Genese 1",
        footer="biblechantee.com"
    )
    print("  OK Textes ajoutes")

    # 4. Sauvegarder
    output_path = "background_genesis1.png"
    img.save(output_path, quality=95)
    print(f"  OK Sauvegarde: {output_path}")

    print("\nOK! Image creee avec succes!")

if __name__ == "__main__":
    main()
