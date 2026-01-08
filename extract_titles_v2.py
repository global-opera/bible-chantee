# -*- coding: utf-8 -*-
"""
EXTRACTION TITRES v2 - Bible Chantee
Script propre pour extraire et nettoyer les titres de chapitres.
"""

import json
import re
import os

# Langues à traiter
LANGUAGES = ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL']

# Noms des livres à supprimer des titres (toutes langues)
BOOK_NAMES = [
    # Français
    'Genèse', 'Exode', 'Lévitique', 'Nombres', 'Deutéronome',
    'Josué', 'Juges', 'Ruth', '1 Samuel', '2 Samuel', '1 Rois', '2 Rois',
    '1 Chroniques', '2 Chroniques', 'Esdras', 'Néhémie', 'Esther',
    'Job', 'Psaume', 'Psaumes', 'Proverbes', 'Ecclésiaste', 'Cantique',
    'Ésaïe', 'Jérémie', 'Lamentations', 'Ézéchiel', 'Daniel',
    'Osée', 'Joël', 'Amos', 'Abdias', 'Jonas', 'Michée', 'Nahum',
    'Habacuc', 'Sophonie', 'Aggée', 'Zacharie', 'Malachie',
    'Matthieu', 'Marc', 'Luc', 'Jean', 'Actes', 'Romains',
    '1 Corinthiens', '2 Corinthiens', 'Galates', 'Éphésiens',
    'Philippiens', 'Colossiens', '1 Thessaloniciens', '2 Thessaloniciens',
    '1 Timothée', '2 Timothée', 'Tite', 'Philémon', 'Hébreux',
    'Jacques', '1 Pierre', '2 Pierre', '1 Jean', '2 Jean', '3 Jean',
    'Jude', 'Apocalypse',
    # Anglais
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalm', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
    'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
    '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
    'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation',
    # Portugais
    'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
    'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel', '1 Reis', '2 Reis',
    '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester',
    'Jó', 'Salmo', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cânticos',
    'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel',
    'Oséias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miquéias', 'Naum',
    'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
    'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos',
    '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios',
    'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses',
    '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom', 'Hebreus',
    'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João',
    'Judas', 'Apocalipse',
    # Espagnol
    'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
    'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
    '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester',
    'Job', 'Salmo', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
    'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel',
    'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm',
    'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
    'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos',
    '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios',
    'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses',
    '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos',
    'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan',
    'Judas', 'Apocalipsis',
    # Allemand
    'Mose', '1 Mose', '2 Mose', '3 Mose', '4 Mose', '5 Mose',
    'Josua', 'Richter', 'Ruth', '1 Samuel', '2 Samuel', '1 Könige', '2 Könige',
    '1 Chronik', '2 Chronik', 'Esra', 'Nehemia', 'Esther',
    'Hiob', 'Psalm', 'Psalmen', 'Sprüche', 'Prediger', 'Hohelied',
    'Jesaja', 'Jeremia', 'Klagelieder', 'Hesekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadja', 'Jona', 'Micha', 'Nahum',
    'Habakuk', 'Zephanja', 'Haggai', 'Sacharja', 'Maleachi',
    'Matthäus', 'Markus', 'Lukas', 'Johannes', 'Apostelgeschichte', 'Römer',
    '1 Korinther', '2 Korinther', 'Galater', 'Epheser',
    'Philipper', 'Kolosser', '1 Thessalonicher', '2 Thessalonicher',
    '1 Timotheus', '2 Timotheus', 'Titus', 'Philemon', 'Hebräer',
    'Jakobus', '1 Petrus', '2 Petrus', '1 Johannes', '2 Johannes', '3 Johannes',
    'Judas', 'Offenbarung',
    # Italien
    'Genesi', 'Esodo', 'Levitico', 'Numeri', 'Deuteronomio',
    'Giosuè', 'Giudici', 'Rut', '1 Samuele', '2 Samuele', '1 Re', '2 Re',
    '1 Cronache', '2 Cronache', 'Esdra', 'Neemia', 'Ester',
    'Giobbe', 'Salmo', 'Salmi', 'Proverbi', 'Ecclesiaste', 'Cantico',
    'Isaia', 'Geremia', 'Lamentazioni', 'Ezechiele', 'Daniele',
    'Osea', 'Gioele', 'Amos', 'Abdia', 'Giona', 'Michea', 'Naum',
    'Abacuc', 'Sofonia', 'Aggeo', 'Zaccaria', 'Malachia',
    'Matteo', 'Marco', 'Luca', 'Giovanni', 'Atti', 'Romani',
    '1 Corinzi', '2 Corinzi', 'Galati', 'Efesini',
    'Filippesi', 'Colossesi', '1 Tessalonicesi', '2 Tessalonicesi',
    '1 Timoteo', '2 Timoteo', 'Tito', 'Filemone', 'Ebrei',
    'Giacomo', '1 Pietro', '2 Pietro', '1 Giovanni', '2 Giovanni', '3 Giovanni',
    'Giuda', 'Apocalisse',
]

def clean_title(title):
    """Nettoie un titre en supprimant tous les patterns indésirables."""
    if not title or not isinstance(title, str):
        return None
    
    t = title.strip()
    
    # 1. Supprimer [TITLE], [LYRICS] et tout ce qui suit
    t = re.sub(r'\[TITLE\]\s*', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\[LYRICS\].*', '', t, flags=re.IGNORECASE | re.DOTALL)
    
    # 2. Supprimer les préfixes Título:, Title:, Titel:
    t = re.sub(r'^(Título|Title|Titel|Titolo)\s*:\s*', '', t, flags=re.IGNORECASE)
    
    # 3. Supprimer les préfixes markdown ###, ##, #, *, **
    t = re.sub(r'^[#*]+\s*', '', t)
    t = re.sub(r'\*+$', '', t)
    
    # 4. Supprimer les noms de livres avec numéro de chapitre
    for book in BOOK_NAMES:
        # Pattern: "Livre X - " ou "Livre X:" ou juste "Livre X" au début
        pattern = rf'^{re.escape(book)}\s*\d+\s*[-:–—]?\s*'
        t = re.sub(pattern, '', t, flags=re.IGNORECASE)
    
    # 5. Supprimer les guillemets au début et à la fin
    t = re.sub(r'^["\'"„«»]+', '', t)
    t = re.sub(r'["\'"„«»]+$', '', t)
    
    # 6. Supprimer les retours chariot et sauts de ligne
    t = t.replace('\r', '').replace('\n', ' ')
    
    # 7. Nettoyer les espaces multiples
    t = re.sub(r'\s+', ' ', t).strip()
    
    # 8. Vérifier si le titre est valide
    invalid = ['TITLE', 'LYRICS', 'Título', 'Title', 'Titel', '', ' ', ',']
    if t in invalid or len(t) < 2:
        return None
    
    # 9. Si le titre ne contient que des caractères spéciaux ou chiffres
    if re.match(r'^[\d\s\-:,\.]+$', t):
        return None
    
    return t

def extract_title_from_content(content):
    """Extrait le titre depuis le contenu d'un chapitre."""
    if not content:
        return None
    
    # Pattern principal: [TITLE]\r\nTitre\r\n
    match = re.search(r'\[TITLE\]\s*\r?\n([^\r\n\[]+)', content)
    if match:
        raw_title = match.group(1).strip()
        return clean_title(raw_title)
    
    return None

def process_language(lang, filepath):
    """Traite un fichier JSON de langue et retourne les titres."""
    if not os.path.exists(filepath):
        print(f"  {lang}: Fichier non trouvé")
        return {}
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    titles = {}
    total = 0
    found = 0
    
    for book_num, chapters in data.items():
        book_num_padded = book_num.zfill(2)
        if book_num_padded not in titles:
            titles[book_num_padded] = {}
        
        for ch_num, content in chapters.items():
            total += 1
            title = extract_title_from_content(content)
            if title:
                titles[book_num_padded][ch_num] = title
                found += 1
    
    pct = (100 * found // total) if total > 0 else 0
    print(f"  {lang}: {found}/{total} titres ({pct}%)")
    return titles

def generate_js(all_titles, output_path):
    """Génère le fichier JavaScript chapter-titles.js."""
    
    lines = [
        '// Titres des chapitres - Bible Chantee',
        '// Genere automatiquement',
        '',
        'window.CHAPTER_TITLES = {'
    ]
    
    for lang in LANGUAGES:
        if lang not in all_titles:
            continue
        
        lines.append(f'  "{lang}": {{')
        
        books = all_titles[lang]
        sorted_books = sorted(books.keys(), key=lambda x: int(x))
        
        for book_num in sorted_books:
            chapters = books[book_num]
            if not chapters:
                continue
            
            lines.append(f'    "{book_num}": {{')
            
            sorted_chapters = sorted(chapters.keys(), key=lambda x: int(x))
            for ch_num in sorted_chapters:
                title = chapters[ch_num]
                # Echapper les guillemets et backslashes
                safe_title = title.replace('\\', '\\\\').replace('"', '\\"')
                lines.append(f'      "{ch_num}": "{safe_title}",')
            
            lines.append('    },')
        
        lines.append('  },')
    
    lines.append('};')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print(f"\nFichier genere: {output_path}")

def main():
    print("=== EXTRACTION TITRES v2 ===\n")
    
    all_titles = {}
    
    for lang in LANGUAGES:
        filepath = f'lyrics/{lang}.json'
        all_titles[lang] = process_language(lang, filepath)
    
    generate_js(all_titles, 'js/chapter-titles.js')
    
    print("\n=== VERIFICATION SYNTAXE ===")
    os.system('node -c js/chapter-titles.js')
    
    print("\n=== TERMINE ===")
    print("Executez maintenant:")
    print("  git add -A")
    print("  git commit -m 'fix: regeneration complete chapter-titles.js'")
    print("  git push origin prod")

if __name__ == '__main__':
    main()
