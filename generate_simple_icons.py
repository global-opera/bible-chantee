#!/usr/bin/env python3
"""
Generate simple PWA icons for Bible Chantee
- icon-192.png (192x192)
- icon-512.png (512x512)
- icon-maskable-512.png (512x512 with safe zone)
"""

from PIL import Image, ImageDraw, ImageFont
import os

BG_COLOR = '#000080'  # Navy blue
GOLD = '#FFD700'      # Gold

def create_standard_icon(size, output_path):
    """Create standard icon with music note and text"""
    img = Image.new('RGB', (size, size), BG_COLOR)
    draw = ImageDraw.Draw(img)

    center = size // 2

    # Music note
    note_radius = int(size * 0.15)
    note_y_offset = int(size * 0.05)

    # Note head
    note_head_y = center - note_y_offset
    draw.ellipse([
        center - note_radius,
        note_head_y - note_radius,
        center + note_radius,
        note_head_y + note_radius
    ], fill=GOLD)

    # Note stem
    stem_width = int(note_radius * 0.4)
    stem_height = int(note_radius * 2.5)
    draw.rectangle([
        center + note_radius - stem_width,
        note_head_y - stem_height,
        center + note_radius,
        note_head_y
    ], fill=GOLD)

    # Text "Bible"
    try:
        font_size = int(size * 0.12)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("Arial.ttf", font_size)
        except:
            font = ImageFont.load_default()

    text = "Bible"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_x = (size - text_width) // 2
    text_y = center + int(size * 0.2)
    draw.text((text_x, text_y), text, fill=GOLD, font=font)

    img.save(output_path, 'PNG', optimize=True)
    print(f"[OK] Created: {output_path}")

def create_maskable_icon(size, output_path):
    """Create maskable icon with 80% safe zone"""
    img = Image.new('RGB', (size, size), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Safe zone (80% of canvas)
    safe_margin = int(size * 0.1)
    safe_size = size - (2 * safe_margin)
    center = size // 2

    # Music note (scaled for safe zone)
    note_radius = int(safe_size * 0.2)
    note_y_offset = int(size * 0.05)

    # Note head
    note_head_y = center - note_y_offset
    draw.ellipse([
        center - note_radius,
        note_head_y - note_radius,
        center + note_radius,
        note_head_y + note_radius
    ], fill=GOLD)

    # Note stem
    stem_width = int(note_radius * 0.4)
    stem_height = int(note_radius * 2.5)
    draw.rectangle([
        center + note_radius - stem_width,
        note_head_y - stem_height,
        center + note_radius,
        note_head_y
    ], fill=GOLD)

    # Text "Bible"
    try:
        font_size = int(safe_size * 0.15)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("Arial.ttf", font_size)
        except:
            font = ImageFont.load_default()

    text = "Bible"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_x = (size - text_width) // 2
    text_y = center + int(safe_size * 0.25)
    draw.text((text_x, text_y), text, fill=GOLD, font=font)

    img.save(output_path, 'PNG', optimize=True)
    print(f"[OK] Created: {output_path}")

def main():
    icons_dir = 'icons'
    os.makedirs(icons_dir, exist_ok=True)

    print("Generating PWA icons for Bible Chantee...")
    print()

    # Standard icons
    create_standard_icon(192, os.path.join(icons_dir, 'icon-192.png'))
    create_standard_icon(512, os.path.join(icons_dir, 'icon-512.png'))

    # Maskable icon
    create_maskable_icon(512, os.path.join(icons_dir, 'icon-maskable-512.png'))

    print()
    print("All icons generated successfully!")
    print(f"Location: {os.path.abspath(icons_dir)}/")

if __name__ == '__main__':
    main()
