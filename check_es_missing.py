#!/usr/bin/env python3
import os, re, sys, csv
from collections import defaultdict

LANG = os.environ.get("LANG_CODE", "ES").upper()
AUDIO_ROOT = os.environ.get("AUDIO_ROOT", "./Suno_Output")  # doit contenir ES/FR/...
TARGET = int(os.environ.get("TARGET", "1189"))
OUT_CSV = os.environ.get("OUT_CSV", "")  # ex: missing_es.csv

# 66 livres — codes "standard" (comme tes fichiers: 19_PSA_150_ES.mp3 etc.)
BOOKS = [
 ("01_GEN",50),("02_EXO",40),("03_LEV",27),("04_NUM",36),("05_DEU",34),("06_JOS",24),("07_JDG",21),("08_RUT",4),
 ("09_1SA",31),("10_2SA",24),("11_1KI",22),("12_2KI",25),("13_1CH",29),("14_2CH",36),("15_EZR",10),("16_NEH",13),
 ("17_EST",10),("18_JOB",42),("19_PSA",150),("20_PRO",31),("21_ECC",12),("22_SNG",8),("23_ISA",66),("24_JER",52),
 ("25_LAM",5),("26_EZK",48),("27_DAN",12),("28_HOS",14),("29_JOL",3),("30_AMO",9),("31_OBA",1),("32_JON",4),
 ("33_MIC",7),("34_NAH",3),("35_HAB",3),("36_ZEP",3),("37_HAG",2),("38_ZEC",14),("39_MAL",4),
 ("40_MAT",28),("41_MRK",16),("42_LUK",24),("43_JHN",21),("44_ACT",28),("45_ROM",16),("46_1CO",16),("47_2CO",13),
 ("48_GAL",6),("49_EPH",6),("50_PHP",4),("51_COL",4),("52_1TH",5),("53_2TH",3),("54_1TI",6),("55_2TI",4),
 ("56_TIT",3),("57_PHM",1),("58_HEB",13),("59_JAS",5),("60_1PE",5),("61_2PE",3),("62_1JN",5),("63_2JN",1),
 ("64_3JN",1),("65_JUD",1),("66_REV",22),
]

# Regex mp3: 19_PSA_150_ES.mp3 (chapitre 1..999)
rx = re.compile(rf'^(\d{{2}}_[A-Z0-9]{{3,4}})_(\d{{1,3}})_{re.escape(LANG)}\.mp3$', re.IGNORECASE)

def is_variantes(path: str) -> bool:
    return (os.sep + "variantes" + os.sep) in path

def scan_existing():
    base = os.path.join(AUDIO_ROOT, LANG)
    existing = defaultdict(set)  # book -> set(chapter ints)
    if not os.path.isdir(base):
        print(f"❌ Dossier introuvable: {base}", file=sys.stderr)
        print("➡️ Défini AUDIO_ROOT (doit contenir ES/) ex: export AUDIO_ROOT='/mnt/gdrive/Suno_Output'", file=sys.stderr)
        sys.exit(2)

    for root, _, files in os.walk(base):
        if is_variantes(root + os.sep):
            continue
        for fn in files:
            m = rx.match(fn)
            if not m:
                continue
            book = m.group(1).upper()
            ch = int(m.group(2))
            existing[book].add(ch)
    return existing

def summarize_missing(existing):
    rows = []
    missing_by_book = {}
    total_present = 0
    total_expected = sum(ch for _, ch in BOOKS)

    for book, maxch in BOOKS:
        present = existing.get(book, set())
        total_present += len(present)
        missing = [c for c in range(1, maxch + 1) if c not in present]
        missing_by_book[book] = missing
        if missing:
            rows.append({
                "Book": book,
                "Missing": len(missing),
                "First": missing[0],
                "Last": missing[-1],
            })

    # Tri: plus gros trous d'abord
    rows.sort(key=lambda r: (-r["Missing"], r["Book"]))
    pct = (total_present / total_expected) * 100 if total_expected else 0.0
    return rows, missing_by_book, total_present, total_expected, pct

def print_table(rows, total_present, total_expected, pct):
    print(f"=== LIVRES INCOMPLETS {LANG} ===")
    print(f"Progression {LANG} (chapitres présents uniques) : {total_present} / {total_expected} ({pct:.2f}%)")
    print()
    print(f"{'Book':<7} {'Missing':>7} {'First':>5} {'Last':>5}")
    print(f"{'-'*7} {'-'*7} {'-'*5} {'-'*5}")
    for r in rows:
        print(f"{r['Book']:<7} {r['Missing']:>7} {r['First']:>5} {r['Last']:>5}")
    print()

def print_missing_details(rows, missing_by_book, limit=20):
    # Affiche détails pour les N livres les plus incomplets
    print(f"=== DÉTAILS (8 premiers + 8 derniers manquants) — Top {min(limit, len(rows))} ===")
    for r in rows[:limit]:
        book = r["Book"]
        miss = missing_by_book[book]
        head = miss[:8]
        tail = miss[-8:] if len(miss) > 8 else []
        if tail and head and tail[0] == head[-1]:
            tail = miss[-8:]  # pas grave
        head_s = ",".join(map(str, head))
        tail_s = ",".join(map(str, tail))
        if tail:
            print(f"{book} ({len(miss)}) : {head_s} ... {tail_s}")
        else:
            print(f"{book} ({len(miss)}) : {head_s}")
    print()

def export_csv(rows, missing_by_book, out_path):
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["book", "missing_count", "missing_chapters"])
        for r in rows:
            book = r["Book"]
            miss = missing_by_book[book]
            w.writerow([book, len(miss), " ".join(map(str, miss))])
    print(f"✅ CSV écrit -> {out_path}")
    print()

def plan_10_windows(rows):
    # Greedy bin packing sur Missing (équilibre charge)
    bins = [{"i": i+1, "load": 0, "books": []} for i in range(10)]
    for r in rows:
        b = min(bins, key=lambda x: x["load"])
        b["books"].append((r["Book"], r["Missing"]))
        b["load"] += r["Missing"]

    bins.sort(key=lambda x: x["i"])
    print("=== PLAN 10 FENÊTRES (répartition par chapitres manquants) ===")
    for b in bins:
        print(f"Fenêtre {b['i']:>2} — missing total: {b['load']}")
        if not b["books"]:
            print("  (vide)")
            continue
        for book, miss in b["books"]:
            print(f"  - {book}: {miss}")
    print()

def main():
    existing = scan_existing()
    rows, missing_by_book, total_present, total_expected, pct = summarize_missing(existing)

    if not rows:
        print(f"✅ Aucun manque détecté — {LANG} complet.")
        print(f"Progression: {total_present}/{total_expected} ({pct:.2f}%)")
        return

    print_table(rows, total_present, total_expected, pct)
    print_missing_details(rows, missing_by_book, limit=20)
    plan_10_windows(rows)

    if OUT_CSV:
        export_csv(rows, missing_by_book, OUT_CSV)

if __name__ == "__main__":
    main()
