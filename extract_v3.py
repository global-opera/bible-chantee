import json
import re

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
    match = re.search(r'###\s*\[?TITLE\]?\s*\r?\n([^\r\n\[#]+)', content)
    if match:
        title = clean_title(match.group(1))
        if title:
            return title
    return ""

all_titles = {}
for lang in LANGUAGES:
    try:
        with open(f'lyrics/{lang}.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except:
        continue
    all_titles[lang] = {}
    count = 0
    for book_num, chapters in data.items():
        bn = book_num.zfill(2)
        all_titles[lang][bn] = {}
        for ch, content in chapters.items():
            title = extract_title(content)
            if title:
                all_titles[lang][bn][ch] = title
                count += 1
    print(f"{lang}: {count}/1189")

lines = ['// Titres - Bible Chantee V3', 'window.CHAPTER_TITLES = {']
for lang in LANGUAGES:
    if lang not in all_titles:
        continue
    lines.append(f'  "{lang}": {{')
    for bn in sorted(all_titles[lang].keys(), key=int):
        chs = all_titles[lang][bn]
        if not chs:
            continue
        lines.append(f'    "{bn}": {{')
        for ch in sorted(chs.keys(), key=int):
            title = chs[ch].replace('\\', '\\\\').replace('"', '\\"')
            lines.append(f'      "{ch}": "{title}",')
        lines.append('    },')
    lines.append('  },')
lines.append('};')

with open('js/chapter-titles.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print("Fichier genere: js/chapter-titles.js")
