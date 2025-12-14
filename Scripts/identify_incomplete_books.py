"""Identifie tous les livres incomplets et génère la liste des ROBOT à lancer"""
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

mp3_base = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
robot_scripts_base = Path("G:/Mon Drive/01 BibleChantee/Scripts")

incomplete_books = []
total_missing = 0

print("="*80)
print("  ANALYSE - LIVRES INCOMPLETS")
print("="*80)

for book_code, total_chapters in BIBLE_BOOKS:
    book_dir = mp3_base / book_code

    if not book_dir.exists():
        existing = 0
    else:
        existing = len(list(book_dir.glob("*.mp3")))

    if existing < total_chapters:
        missing = total_chapters - existing
        total_missing += missing
        incomplete_books.append((book_code, existing, total_chapters, missing))
        print(f"{book_code}: {existing}/{total_chapters} ({missing} manquants)")

print("\n" + "="*80)
print(f"  TOTAL: {len(incomplete_books)} livres incomplets, {total_missing} chapitres manquants")
print("="*80)

# Générer la liste des scripts ROBOT
print("\nSCRIPTS ROBOT À LANCER:")
print("="*80)

robot_commands = []
for book_code, existing, total, missing in incomplete_books:
    robot_script = robot_scripts_base / f"ROBOT_{book_code}.py"

    if robot_script.exists():
        print(f"[OK] ROBOT_{book_code}.py ({missing} chapitres)")
        robot_commands.append(f"python \"G:/Mon Drive/01 BibleChantee/Scripts/ROBOT_{book_code}.py\"")
    else:
        print(f"[MANQUANT] ROBOT_{book_code}.py")

# Sauvegarder la liste de commandes
commands_file = Path("C:/ScriptBible/bible-chantee/Scripts/launch_incomplete_robots.bat")
with open(commands_file, 'w', encoding='utf-8') as f:
    f.write("@echo off\n")
    f.write("echo ========================================================================\n")
    f.write(f"echo   LANCEMENT {len(incomplete_books)} ROBOTS - {total_missing} CHAPITRES\n")
    f.write("echo ========================================================================\n")
    f.write("echo.\n")
    f.write("echo IMPORTANT: Ouvre suno.com/create dans ton navigateur AVANT de continuer!\n")
    f.write("pause\n")
    f.write("echo.\n")

    for i, cmd in enumerate(robot_commands, 1):
        f.write(f"echo [{i}/{len(robot_commands)}] Lancement...\n")
        f.write(f"{cmd}\n")
        f.write("echo.\n")

    f.write("echo ========================================================================\n")
    f.write("echo   TERMINE!\n")
    f.write("echo ========================================================================\n")
    f.write("pause\n")

print(f"\n✅ Fichier BAT créé: {commands_file}")
print("\nPROCHAINES ÉTAPES:")
print("1. Ouvre suno.com/create dans Chrome/Firefox")
print("2. Lance: launch_incomplete_robots.bat")
print("3. Laisse tourner (ne touche pas la souris/clavier)")
