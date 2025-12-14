"""Compte combien de fichiers textes source manquent"""
from pathlib import Path

BIBLE_BOOKS = [
    ("01_GEN", 50), ("02_EXO", 40), ("03_LEV", 27), ("04_NUM", 36),
    ("05_DEU", 34), ("06_JOS", 24), ("07_JDG", 21), ("08_RUT", 4),
    ("09_1SAM", 31), ("10_2SAM", 24), ("11_1KI", 22), ("12_2KI", 25),
    ("13_1CH", 29), ("14_2CH", 36), ("15_EZR", 10), ("16_NEH", 13),
    ("17_EST", 10), ("18_JOB", 42), ("19_PSA", 150), ("20_PRO", 31),
    ("21_ECC", 12), ("22_SON", 8), ("23_ISA", 66), ("24_JER", 52),
    ("25_LAM", 5), ("26_EZE", 48), ("27_DAN", 12), ("28_HOS", 14),
    ("29_JOE", 3), ("30_AMO", 9), ("31_OBA", 1), ("32_JON", 4),
    ("33_MIC", 7), ("34_NAH", 3), ("35_HAB", 3), ("36_ZEP", 3),
    ("37_HAG", 2), ("38_ZEC", 14), ("39_MAL", 4), ("40_MAT", 28),
    ("41_MAR", 16), ("42_LUK", 24), ("43_JOH", 21), ("44_ACT", 28),
    ("45_ROM", 16), ("46_1CO", 16), ("47_2CO", 13), ("48_GAL", 6),
    ("49_EPH", 6), ("50_PHP", 4), ("51_COL", 4), ("52_1TH", 5),
    ("53_2TH", 3), ("54_1TI", 6), ("55_2TI", 4), ("56_TIT", 3),
    ("57_PHM", 1), ("58_HEB", 13), ("59_JAS", 5), ("60_1PE", 5),
    ("61_2PE", 3), ("62_1JO", 5), ("63_2JO", 1), ("64_3JO", 1),
    ("65_JUD", 1), ("66_REV", 22)
]

base_dir = Path("G:/Mon Drive/01 BibleChantee/Textes_Complets/FR")
missing = []
total = 0

for book_code, chapters in BIBLE_BOOKS:
    for ch in range(1, chapters + 1):
        total += 1
        txt_file = base_dir / book_code / f"{book_code}_{ch}_FR.txt"
        if not txt_file.exists():
            missing.append((book_code, ch))

print(f"FICHIERS TEXTES MANQUANTS: {len(missing)}/{total}")
if missing:
    print("\nPremiers 20 manquants:")
    for book, ch in missing[:20]:
        print(f"  - {book} chapitre {ch}")
