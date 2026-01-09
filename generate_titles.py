import json
import re
import os

LANGUAGES = ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL']

def clean_title(t):
    if not t:
        return ""
    t = t.strip()
    t = re.sub(r'^["\*\x27]+', '', t)
    t = re.sub(r'["\*\x27]+$', '', t)
    t = re.sub(r'^#+\s*', '', t)
    t = re.sub(r'^(TITRE|TITLE|TITULO|TITULo|TITEL|TITOLO)\s*:?\s*', '', t, flags=re.IGNORECASE)
    t = re.sub(r'^[A-Za-z\u00C0-\u00FF]+\s+\d+\s*[-:]\s*', '', t)
    t = t.strip()
    if t.upper() in ['TITRE', 'TITLE', 'TITULO', 'TITEL', 'TITOLO', '']:
        return ""
    if len(t) < 3:
        return ""
    return t

def extract_title(content):
    if not content:
        return ""
    match = re.search(r'\[TITLE\]\s*\r?\n([^\r\n\[]+)', content)
    if match:
        title = clean_title(match.group(1))
        if title:
            return title
    match = re.search(r'\[LYRICS\]\s*\r?\n(?:TITRE|TITLE|###[^\r\n]*)\s*\r?\n["\*]*([^"\r\n\[*]+)["\*]*', content)
    if match:
        title = clean_title(match.group(1))
        if title:
            return title
    return ""

os.makedirs('titles', exist_ok=True)

for lang in LANGUAGES:
    try:
        with open(f'lyrics/{lang}.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except:
        print(f"{lang}: fichier non trouve")
        continue
    
    titles = {}
    count = 0
    
    for book_num, chapters in data.items():
        bn = book_num.zfill(2)
        titles[bn] = {}
        for ch, content in chapters.items():
            title = extract_title(content)
            if title:
                titles[bn][ch] = title
                count += 1
    
    with open(f'titles/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(titles, f, ensure_ascii=False, indent=2)
    
    print(f"{lang}: {count} titres -> titles/{lang}.json")

print("\n7 fichiers generes dans titles/")
