# Icons for Bible Chantée PWA

## Required Icons

Each language needs 2 icon sizes:
- 192x192 pixels
- 512x512 pixels

## Icon Specifications

### French (FR)
- **Files:** `icon-fr-192.png`, `icon-fr-512.png`
- **Design:** 🇫🇷 French flag on blue background (#000080)
- **Theme color:** #000080

### Portuguese (PT)
- **Files:** `icon-pt-192.png`, `icon-pt-512.png`
- **Design:** 🇧🇷 Brazilian flag on blue background (#000080)
- **Theme color:** #009739

### English (EN)
- **Files:** `icon-en-192.png`, `icon-en-512.png`
- **Design:** 🇬🇧 UK flag on blue background (#000080)
- **Theme color:** #012169

### Spanish (ES)
- **Files:** `icon-es-192.png`, `icon-es-512.png`
- **Design:** 🇪🇸 Spanish flag on blue background (#000080)
- **Theme color:** #AA151B

### Generic (for main lecteur.html)
- **Files:** `icon-192.png`, `icon-512.png`
- **Design:** Music note 🎵 or Bible 📖 on blue background (#000080)

## Design Guidelines

1. **Background:** Blue (#000080)
2. **Flag:** Centered, approximately 60% of icon size
3. **Overlay:** Optional music note or Bible symbol
4. **Border:** Optional gold border (#ffce00) for emphasis
5. **Format:** PNG with transparency
6. **Purpose:** "any maskable" (safe zone design)

## Icon Generation Tools

You can use:
1. **Canva:** https://canva.com
2. **PWA Builder:** https://www.pwabuilder.com/imageGenerator
3. **Favicon.io:** https://favicon.io/
4. **Figma:** https://figma.com
5. **Python Pillow:** See script below

## Python Script to Generate Icons

```python
from PIL import Image, ImageDraw, ImageFont

def create_pwa_icon(size, flag_emoji, output_path):
    # Create image with blue background
    img = Image.new('RGB', (size, size), '#000080')
    draw = ImageDraw.Draw(img)

    # Add flag emoji (requires emoji font)
    try:
        font = ImageFont.truetype("seguiemj.ttf", int(size * 0.5))
        draw.text((size//2, size//2), flag_emoji, font=font, anchor="mm", fill='white')
    except:
        # Fallback if emoji font not available
        draw.ellipse([size//4, size//4, 3*size//4, 3*size//4], fill='#ffce00')

    img.save(output_path)
    print(f"Created: {output_path}")

# Generate all icons
for lang, emoji in [('fr', '🇫🇷'), ('pt', '🇧🇷'), ('en', '🇬🇧'), ('es', '🇪🇸')]:
    create_pwa_icon(192, emoji, f'icon-{lang}-192.png')
    create_pwa_icon(512, emoji, f'icon-{lang}-512.png')

# Generic icon
create_pwa_icon(192, '🎵', 'icon-192.png')
create_pwa_icon(512, '🎵', 'icon-512.png')
```

## Temporary Placeholder

Until proper icons are created, you can use:
- A solid blue square with text
- The emoji itself as a simple icon
- A screenshot of the app interface
