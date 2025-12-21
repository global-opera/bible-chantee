#!/usr/bin/env python3
"""
Generate PWA icons for Bible Chantée
Creates flag-themed icons for FR, PT, EN, ES
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, lang, output_path):
    """Create a PWA icon with flag and music theme"""

    # Create image with blue background
    img = Image.new('RGB', (size, size), '#000080')
    draw = ImageDraw.Draw(img)

    # Calculate dimensions
    flag_height = int(size * 0.35)
    flag_y = int(size * 0.15)

    # Draw flags using geometric shapes
    if lang == 'fr':
        # French flag: vertical blue, white, red stripes
        stripe_width = size // 3
        draw.rectangle([0, flag_y, stripe_width, flag_y + flag_height], fill='#002395')
        draw.rectangle([stripe_width, flag_y, 2*stripe_width, flag_y + flag_height], fill='#FFFFFF')
        draw.rectangle([2*stripe_width, flag_y, size, flag_y + flag_height], fill='#ED2939')

    elif lang == 'pt':
        # Brazilian flag: green background with yellow diamond
        draw.rectangle([0, flag_y, size, flag_y + flag_height], fill='#009739')
        diamond_cx = size // 2
        diamond_cy = flag_y + flag_height // 2
        diamond_w = int(size * 0.4)
        diamond_h = int(flag_height * 0.6)
        draw.polygon([
            (diamond_cx, diamond_cy - diamond_h//2),  # top
            (diamond_cx + diamond_w//2, diamond_cy),   # right
            (diamond_cx, diamond_cy + diamond_h//2),   # bottom
            (diamond_cx - diamond_w//2, diamond_cy)    # left
        ], fill='#FFDF00')

    elif lang == 'en':
        # UK flag: simplified Union Jack
        draw.rectangle([0, flag_y, size, flag_y + flag_height], fill='#012169')
        # White X
        draw.line([(0, flag_y), (size, flag_y + flag_height)], fill='#FFFFFF', width=int(size*0.08))
        draw.line([(0, flag_y + flag_height), (size, flag_y)], fill='#FFFFFF', width=int(size*0.08))
        # Red cross
        draw.line([(size//2, flag_y), (size//2, flag_y + flag_height)], fill='#C8102E', width=int(size*0.05))
        draw.line([(0, flag_y + flag_height//2), (size, flag_y + flag_height//2)], fill='#C8102E', width=int(size*0.05))

    elif lang == 'es':
        # Spanish flag: horizontal red-yellow-red stripes
        stripe_h = flag_height // 4
        draw.rectangle([0, flag_y, size, flag_y + stripe_h], fill='#AA151B')
        draw.rectangle([0, flag_y + stripe_h, size, flag_y + 3*stripe_h], fill='#F1BF00')
        draw.rectangle([0, flag_y + 3*stripe_h, size, flag_y + flag_height], fill='#AA151B')

    # Draw music note (simple eighth note)
    note_y = int(size * 0.6)
    note_size = int(size * 0.15)

    # Note head (filled circle)
    note_head_y = note_y + note_size
    draw.ellipse([
        size//2 - note_size//3,
        note_head_y - note_size//3,
        size//2 + note_size//3,
        note_head_y + note_size//3
    ], fill='#FFCE00')

    # Note stem
    draw.rectangle([
        size//2 + note_size//4,
        note_y,
        size//2 + note_size//4 + note_size//8,
        note_head_y
    ], fill='#FFCE00')

    # Draw text
    text_y = int(size * 0.82)
    text = {
        'fr': 'Bible',
        'pt': 'Bíblia',
        'en': 'Bible',
        'es': 'Biblia'
    }[lang]

    try:
        # Try to use a nice font
        font_size = int(size * 0.12)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_x = (size - text_width) // 2

    draw.text((text_x, text_y), text, fill='#FFCE00', font=font)

    # Add golden border
    border_width = int(size * 0.02)
    draw.rectangle([0, 0, size, size], outline='#FFCE00', width=border_width)

    # Save image
    img.save(output_path, 'PNG')
    print(f"[OK] Created: {output_path}")

def main():
    """Generate all icons"""

    # Create icons directory if it doesn't exist
    icons_dir = 'icons'
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)

    print("Generating PWA icons...")
    print()

    languages = ['fr', 'pt', 'en', 'es']
    sizes = [192, 512]

    for lang in languages:
        for size in sizes:
            output_path = os.path.join(icons_dir, f'icon-{lang}-{size}.png')
            create_icon(size, lang, output_path)

    # Create generic icon (same as FR but with "Bible Chantee")
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon-{size}.png')
        create_icon(size, 'fr', output_path)

    print()
    print("All icons generated successfully!")
    print(f"Location: {os.path.abspath(icons_dir)}/")
    print()
    print("Icons created:")
    for lang in languages:
        print(f"  - {lang.upper()}: icon-{lang}-192.png, icon-{lang}-512.png")
    print(f"  - Generic: icon-192.png, icon-512.png")

if __name__ == '__main__':
    main()
