#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
from pathlib import Path

ROOT_LYRICS = Path(r"G:\Mon Drive\01 BibleChantee\Lyrics")
RE_FILE = re.compile(r"^(?P<booknum>\d{2})_(?P<bookcode>[^_]+)_(?P<chap>\d{2})_(?P<lang>[A-Z]{2})\.txt$")

def extract_title(txt):
    if "[TITLE]" in txt:
        after = txt.split("[TITLE]", 1)[1]
        if "[LYRICS]" in after:
            block = after.split("[LYRICS]", 1)[0]
        else:
            block = after
        for ln in block.splitlines():
            ln = ln.strip()
            if ln:
                return ln
    return ""

def js_escape(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

def build_map(lang):
    base = ROOT_LYRICS / lang
    if not base.exists():
        print(f"[ERREUR] Dossier introuvable: {base}")
        return {}
    
    out = {}
    for p in base.rglob("*.txt"):
        m = RE_FILE.match(p.name)
        if not m or m.group("lang") != lang:
            continue
        
        booknum = m.group("booknum")
        chap = int(m.group("chap"))
        try:
            txt = p.read_text(encoding="utf-8")
        except:
            txt = p.read_text(encoding="utf-8", errors="replace")
        
        title = extract_title(txt).strip()
        if title:
            out.setdefault(booknum, {})[chap] = title
    
    return {b: {c: out[b][c] for c in sorted(out[b].keys())} for b in sorted(out.keys())}

def write_js(lang, mapping, out_path):
    varname = f"chapterTitles{lang}"
    lines = [f"// Auto-generated from Lyrics/{lang}/*.txt", "// DO NOT EDIT MANUALLY", f"window.{varname} = {{"]
    
    for bi, booknum in enumerate(sorted(mapping.keys())):
        chmap = mapping[booknum]
        lines.append(f'  "{booknum}": {{')
        items = list(chmap.items())
        for i, (chap, title) in enumerate(items):
            comma = "," if i < len(items) - 1 else ""
            lines.append(f'    {chap}: "{js_escape(title)}"{comma}')
        lines.append(f"  }}{',' if bi < len(mapping) - 1 else ''}")
    
    lines.append("};")
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"[OK] {out_path} ({len(mapping)} livres)")

if __name__ == "__main__":
    repo = Path(r"C:\ScriptBible\bible-chantee")
    
    en_map = build_map("EN")
    if en_map:
        write_js("EN", en_map, repo / "chapter-titles-en.js")
    
    pt_map = build_map("PT")
    if pt_map:
        write_js("PT", pt_map, repo / "chapter-titles-pt.js")
