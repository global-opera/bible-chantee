# -*- coding: utf-8 -*-
"""
SCRIPT EXTRACTION TITRES - Bible Chantée
Extrait les titres de chapitres depuis les fichiers lyrics JSON
et génère un fichier chapter-titles.js complet pour toutes les langues.

Usage: python extract_chapter_titles.py
Doit être exécuté depuis C:\ScriptBible\bible-chantee
"""

import json
import os
import re
from pathlib import Path

# Configuration
LANGUAGES = ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL']
LYRICS_DIR = Path('lyrics')
OUTPUT_FILE = Path('js/chapter-titles-NEW.js')

# Patterns à nettoyer dans les titres
CLEANUP_PATTERNS = [
    r'^\[TITLE\]\s*',           # [TITLE] au début
    r'\[LYRICS\].*$',           # [LYRICS] et tout ce qui suit
    r'^Título:\s*',             # Título: au début
    r'^Title:\s*',              # Title: au début
    r'^Titel:\s*',              # Titel: au début
    r'^###\s*',                 # ### au début
    r'^##\s*',                  # ## au début
    r'^#\s*',                   # # au début
    r'^\*+',                    # * au début
    r'\*+$',                    # * à la fin
    r'^"',                      # " au début
    r'"$',                      # " à la fin
    r"^'",                      # ' au début
    r"'$",                      # ' à la fin
    r'^\s+',                    # espaces au début
    r'\s+$',                    # espaces à la fin
    r'\r',                      # retours chariot
]

# Titres invalides à ignorer
INVALID_TITLES = [
    'TITLE', '[TITLE]', 'LYRICS', '[LYRICS]', 
    'Título', 'Title', 'Titel',
    '###', '##', '#', '1.', '2.', '3.',
    '', ' '
]

def clean_title(title):
    """Nettoie un titre en supprimant les patterns indésirables"""
    if not title:
        return None
    
    # Appliquer tous les patterns de nettoyage
    cleaned = title
    for pattern in CLEANUP_PATTERNS:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    
    # Nettoyer les espaces multiples
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    # Vérifier si le titre est valide
    if cleaned in INVALID_TITLES or len(cleaned) < 2:
        return None
    
    # Vérifier si c'est juste un numéro de livre/chapitre (ex: "Psalm 23", "Genesis 1")
    if re.match(r'^(Genesis|Exodus|Psalm|Psaume|Salmo|Matthew|Marc|John|Amos|Joel|Daniel|Ezekiel)\s*\d+$', cleaned, re.IGNORECASE):
        return None
    
    return cleaned

def extract_title_from_content(content):
    """Extrait le titre depuis le contenu d'un chapitre"""
    if not content:
        return None
    
    # Pattern 1: [TITLE]\r\nTitre\r\n\r\n[LYRICS]
    match = re.search(r'\[TITLE\]\s*\r?\n([^\r\n]+)', content)
    if match:
        title = match.group(1).strip()
        return clean_title(title)
    
    # Pattern 2: Titre au tout début avant [LYRICS]
    match = re.search(r'^([^\[\r\n]+)', content)
    if match:
        title = match.group(1).strip()
        cleaned = clean_title(title)
        if cleaned and len(cleaned) > 3:
            return cleaned
    
    return None

def load_lyrics_json(lang):
    """Charge le fichier lyrics JSON pour une langue"""
    filepath = LYRICS_DIR / f'{lang}.json'
    if not filepath.exists():
        print(f"  ATTENTION: {filepath} n'existe pas")
        return {}
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"  ERREUR lecture {filepath}: {e}")
        return {}

def extract_titles_for_language(lang):
    """Extrait tous les titres pour une langue"""
    data = load_lyrics_json(lang)
    if not data:
        return {}
    
    titles = {}
    total = 0
    found = 0
    
    for book_num, chapters in data.items():
        if book_num not in titles:
            titles[book_num] = {}
        
        for chapter_num, content in chapters.items():
            total += 1
            title = extract_title_from_content(content)
            if title:
                titles[book_num][chapter_num] = title
                found += 1
    
    print(f"  {lang}: {found}/{total} titres trouvés ({100*found//total if total else 0}%)")
    return titles

def generate_chapter_titles_js(all_titles):
    """Génère le fichier JavaScript chapter-titles.js"""
    
    js_content = """// Titres des chapitres - Bible Chantée
// Généré automatiquement - NE PAS MODIFIER MANUELLEMENT
// Format: CHAPTER_TITLES[LANG][BOOK_NUM][CHAPTER_NUM] = "Titre"

window.CHAPTER_TITLES = {
"""
    
    for lang in LANGUAGES:
        if lang not in all_titles:
            continue
        
        js_content += f'  "{lang}": {{\n'
        
        # Trier les livres par numéro
        books = all_titles[lang]
        for book_num in sorted(books.keys(), key=lambda x: int(x) if x.isdigit() else 99):
            chapters = books[book_num]
            if not chapters:
                continue
            
            js_content += f'    "{book_num}": {{\n'
            
            # Trier les chapitres par numéro
            for ch_num in sorted(chapters.keys(), key=lambda x: int(x) if x.isdigit() else 999):
                title = chapters[ch_num]
                # Échapper les guillemets dans le titre
                title_escaped = title.replace('\\', '\\\\').replace('"', '\\"')
                js_content += f'      "{ch_num}": "{title_escaped}",\n'
            
            js_content += '    },\n'
        
        js_content += '  },\n'
    
    js_content += '};\n'
    
    return js_content

def main():
    print("=== EXTRACTION TITRES CHAPITRES ===\n")
    
    # Vérifier qu'on est dans le bon répertoire
    if not LYRICS_DIR.exists():
        print(f"ERREUR: Répertoire {LYRICS_DIR} non trouvé")
        print("Exécutez ce script depuis C:\\ScriptBible\\bible-chantee")
        return
    
    # Extraire les titres pour chaque langue
    all_titles = {}
    for lang in LANGUAGES:
        print(f"Traitement {lang}...")
        all_titles[lang] = extract_titles_for_language(lang)
    
    print("\n=== GÉNÉRATION FICHIER JS ===")
    
    # Générer le fichier JS
    js_content = generate_chapter_titles_js(all_titles)
    
    # Sauvegarder
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Fichier généré: {OUTPUT_FILE}")
    
    # Statistiques
    print("\n=== STATISTIQUES ===")
    for lang in LANGUAGES:
        if lang in all_titles:
            total_titles = sum(len(chapters) for chapters in all_titles[lang].values())
            print(f"  {lang}: {total_titles} titres")
    
    print("\n=== PROCHAINES ÉTAPES ===")
    print("1. Vérifier le fichier js/chapter-titles-NEW.js")
    print("2. Si OK, remplacer js/chapter-titles.js par js/chapter-titles-NEW.js")
    print("3. Mettre à jour lecteur.html pour utiliser CHAPTER_TITLES au lieu de chapterTitles")
    print("4. Tester et déployer")

if __name__ == '__main__':
    main()
