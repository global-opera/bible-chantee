#!/usr/bin/env python3
"""
Generate maskable PWA icons with proper safe zone (80%)
Maskable icons can be cropped to any shape on Android
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_maskable_icon(size, output_path):
    """
    Create a maskable icon with content in the safe zone (80% of canvas)
    The outer 10% on all sides may be cropped by the OS
    """

    # Create image with blue background (will bleed to edges)
    img = Image.new('RGB', (size, size), '#000080')
    draw = ImageDraw.Draw(img)

    # Calculate safe zone (80% of canvas, centered)
    safe_margin = int(size * 0.1)  # 10% margin on each side
    safe_size = size - (2 * safe_margin)

    # Draw content centered in safe zone
    center = size // 2

    # Music note in center (larger for maskable)
    note_radius = int(safe_size * 0.2)
    note_y_offset = int(size * 0.05)

    # Note head (filled circle)
    note_head_y = center - note_y_offset
    draw.ellipse([
        center - note_radius,
        note_head_y - note_radius,
        center + note_radius,
        note_head_y + note_radius
    ], fill='#FFD700')

    # Note stem
    stem_width = int(note_radius * 0.4)
    stem_height = int(note_radius * 2.5)
    draw.rectangle([
        center + note_radius - stem_width,
        note_head_y - stem_height,
        center + note_radius,
        note_head_y
    ], fill='#FFD700')

    # Text "Bible" below note (within safe zone)
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
    draw.text((text_x, text_y), text, fill='#FFD700', font=font)

    # Optional: Draw safe zone guide (comment out for production)
    # draw.rectangle([safe_margin, safe_margin, size-safe_margin, size-safe_margin],
    #                outline='#FF0000', width=2)

    # Save image
    img.save(output_path, 'PNG', optimize=True)
    print(f"[OK] Created: {output_path}")

def main():
    """Generate maskable icons"""

    icons_dir = 'icons'
    os.makedirs(icons_dir, exist_ok=True)

    print("Generating maskable PWA icons...")
    print("(Content in 80% safe zone for adaptive icons)")
    print()

    sizes = [192, 512]

    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon-maskable-{size}.png')
        create_maskable_icon(size, output_path)

    print()
    print("All maskable icons generated successfully!")
    print(f"Location: {os.path.abspath(icons_dir)}/")
    print()
    print("Maskable icons created:")
    print("  - icon-maskable-192.png (safe zone design)")
    print("  - icon-maskable-512.png (safe zone design)")
    print()
    print("These icons work with Android adaptive icons (any shape).")

if __name__ == '__main__':
    main()
