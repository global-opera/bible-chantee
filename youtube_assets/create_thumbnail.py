"""
Creer miniature YouTube 1280x720 pour Genese 1
"""
from PIL import Image, ImageDraw, ImageFont
import random

# Dimensions
WIDTH = 1280
HEIGHT = 720

# Couleurs
COLOR_TOP = (26, 26, 46)
COLOR_BOTTOM = (22, 33, 62)
COLOR_GOLD = (255, 215, 0)
COLOR_WHITE = (255, 255, 255)

def create_gradient(width, height, color_top, color_bottom):
    """Creer un degrade vertical"""
    img = Image.new('RGB', (width, height), color_top)
    draw = ImageDraw.Draw(img)
    
    for y in range(height):
        ratio = y / height
        r = int(color_top[0] + (color_bottom[0] - color_top[0]) * ratio)
        g = int(color_top[1] + (color_bottom[1] - color_top[1]) * ratio)
        b = int(color_top[2] + (color_bottom[2] - color_top[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def add_stars(img, count=100):
    """Ajouter des etoiles aleatoires"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    for _ in range(count):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.choice([1, 1, 1, 2, 2, 3])
        brightness = random.randint(150, 255)
        color = (brightness, brightness, brightness)
        
        if size == 1:
            draw.point((x, y), fill=color)
        else:
            draw.ellipse([x-size, y-size, x+size, y+size], fill=color)
    
    return img

def add_text(img):
    """Ajouter les textes pour thumbnail"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    try:
        font_huge = ImageFont.truetype("arial.ttf", 140)
        font_subtitle = ImageFont.truetype("arial.ttf", 60)
        font_small = ImageFont.truetype("arial.ttf", 35)
    except:
        font_huge = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Titre principal GENESE 1 (centré, tres grand)
    title = "GENESE 1"
    bbox = draw.textbbox((0, 0), title, font=font_huge)
    text_width = bbox[2] - bbox[0]
    x = (width - text_width) // 2
    y = height // 2 - 80
    
    draw.text((x+4, y+4), title, fill=(0, 0, 0), font=font_huge)
    draw.text((x, y), title, fill=COLOR_GOLD, font=font_huge)
    
    # Sous-titre (blanc)
    subtitle = "Au Commencement"
    bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    text_width = bbox[2] - bbox[0]
    x = (width - text_width) // 2
    y = height // 2 + 90
    
    draw.text((x+2, y+2), subtitle, fill=(0, 0, 0), font=font_subtitle)
    draw.text((x, y), subtitle, fill=COLOR_WHITE, font=font_subtitle)
    
    # En haut: Bible Chantee
    header = "BIBLE CHANTEE"
    bbox = draw.textbbox((0, 0), header, font=font_small)
    text_width = bbox[2] - bbox[0]
    x = (width - text_width) // 2
    y = 40
    
    draw.text((x+2, y+2), header, fill=(0, 0, 0), font=font_small)
    draw.text((x, y), header, fill=COLOR_WHITE, font=font_small)
    
    return img

def main():
    print("Creation thumbnail 1280x720...")
    
    img = create_gradient(WIDTH, HEIGHT, COLOR_TOP, COLOR_BOTTOM)
    print("  OK Degrade")
    
    img = add_stars(img, count=100)
    print("  OK Etoiles")
    
    img = add_text(img)
    print("  OK Textes")
    
    output_path = "thumbnail_genesis1.png"
    img.save(output_path, quality=95)
    print(f"  OK Sauvegarde: {output_path}")
    
    print("\nOK! Thumbnail creee!")

if __name__ == "__main__":
    main()
