#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EXTRACTION DES TITRES DE CHAPITRES - TOUTES LES LANGUES
Bible Chantée - Script d'extraction automatique
"""

import json
import re
from pathlib import Path

# Configuration
LYRICS_DIR = Path("C:/ScriptBible/bible-chantee/lyrics")
OUTPUT_FILE = Path("C:/ScriptBible/bible-chantee/js/chapter-titles.js")

# Langues à extraire
LANGUES = ["FR", "EN", "PT", "ES", "DE", "IT", "TL"]

# Mapping des numéros de livres vers leurs codes
BOOK_CODES = {
    "1": "01_GEN", "2": "02_EXO", "3": "03_LEV", "4": "04_NUM", "5": "05_DEU",
    "6": "06_JOS", "7": "07_JDG", "8": "08_RUT", "9": "09_1SA", "10": "10_2SA",
    "11": "11_1KI", "12": "12_2KI", "13": "13_1CH", "14": "14_2CH", "15": "15_EZR",
    "16": "16_NEH", "17": "17_EST", "18": "18_JOB", "19": "19_PSA", "20": "20_PRO",
    "21": "21_ECC", "22": "22_SNG", "23": "23_ISA", "24": "24_JER", "25": "25_LAM",
    "26": "26_EZK", "27": "27_DAN", "28": "28_HOS", "29": "29_JOL", "30": "30_AMO",
    "31": "31_OBA", "32": "32_JON", "33": "33_MIC", "34": "34_NAM", "35": "35_HAB",
    "36": "36_ZEP", "37": "37_HAG", "38": "38_ZEC", "39": "39_MAL",
    "40": "40_MAT", "41": "41_MRK", "42": "42_LUK", "43": "43_JHN", "44": "44_ACT",
    "45": "45_ROM", "46": "46_1CO", "47": "47_2CO", "48": "48_GAL", "49": "49_EPH",
    "50": "50_PHP", "51": "51_COL", "52": "52_1TH", "53": "53_2TH", "54": "54_1TI",
    "55": "55_2TI", "56": "56_TIT", "57": "57_PHM", "58": "58_HEB", "59": "59_JAS",
    "60": "60_1PE", "61": "61_2PE", "62": "62_1JN", "63": "63_2JN", "64": "64_3JN",
    "65": "65_JUD", "66": "66_REV"
}

def extraire_titre(contenu):
    """Extrait le titre depuis le contenu d'un chapitre"""
    if not contenu:
        return None

    # Après json.load(), \r\n sont de VRAIS caractères (pas échappés)
    # Pattern: [TITLE]\r\nTitre du chapitre\r\n\r\n[LYRICS]
    match = re.search(r'\[TITLE\]\r\n(.+?)\r\n', contenu)
    if match:
        titre = match.group(1).strip()
        # Filtrer les placeholders
        if titre and titre != '[LYRICS]' and not titre.startswith('[LYRICS]'):
            return titre

    return None

def extraire_titres_langue(langue):
    """Extrait tous les titres pour une langue"""
    fichier = LYRICS_DIR / f"{langue}.json"

    if not fichier.exists():
        print(f"[SKIP] {langue}.json n'existe pas")
        return {}

    print(f"\n[{langue}] Extraction des titres...")

    with open(fichier, 'r', encoding='utf-8') as f:
        data = json.load(f)

    titres = {}
    total = 0
    extraits = 0

    for livre_num, chapitres in data.items():
        book_code = BOOK_CODES.get(livre_num)
        if not book_code:
            continue

        if book_code not in titres:
            titres[book_code] = {}

        for chapitre_num, contenu in chapitres.items():
            total += 1
            titre = extraire_titre(contenu)

            if titre:
                titres[book_code][chapitre_num] = titre
                extraits += 1

    print(f"   {extraits}/{total} titres extraits ({extraits/total*100:.1f}%)")
    return titres

def generer_fichier_js(all_titres):
    """Génère le fichier chapter-titles.js"""
    print("\n[GENERATION] Création de chapter-titles.js...")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("// Bible Chantée - Titres des chapitres\n")
        f.write("// Généré automatiquement depuis les fichiers lyrics\n\n")
        f.write("const CHAPTER_TITLES = {\n")

        for i, langue in enumerate(LANGUES):
            titres = all_titres.get(langue, {})
            f.write(f'  "{langue}": {{\n')

            # Trier les livres par code
            livres_tries = sorted(titres.keys())

            for j, book_code in enumerate(livres_tries):
                chapitres = titres[book_code]
                f.write(f'    "{book_code}": {{\n')

                # Trier les chapitres par numéro
                chapitres_tries = sorted(chapitres.items(), key=lambda x: int(x[0]))

                for k, (chap_num, titre) in enumerate(chapitres_tries):
                    # Échapper les guillemets et backslashes
                    titre_escape = titre.replace('\\', '\\\\').replace('"', '\\"')
                    virgule = ',' if k < len(chapitres_tries) - 1 else ''
                    f.write(f'      "{chap_num}": "{titre_escape}"{virgule}\n')

                virgule_livre = ',' if j < len(livres_tries) - 1 else ''
                f.write(f'    }}{virgule_livre}\n')

            virgule_langue = ',' if i < len(LANGUES) - 1 else ''
            f.write(f'  }}{virgule_langue}\n')

        f.write("};\n")

    print(f"   [OK] Fichier généré: {OUTPUT_FILE}")

def main():
    print("="*80)
    print("EXTRACTION DES TITRES DE CHAPITRES - TOUTES LES LANGUES")
    print("="*80)

    all_titres = {}

    for langue in LANGUES:
        titres = extraire_titres_langue(langue)
        if titres:
            all_titres[langue] = titres

    generer_fichier_js(all_titres)

    print("\n" + "="*80)
    print("RÉSUMÉ:")
    print("="*80)
    for langue in LANGUES:
        if langue in all_titres:
            total_chapitres = sum(len(chapitres) for chapitres in all_titres[langue].values())
            total_livres = len(all_titres[langue])
            print(f"  {langue}: {total_chapitres} chapitres dans {total_livres} livres")
    print("="*80)
    print("\nSUCCÈS: Fichier chapter-titles.js généré !")
    print("\nPROCHAINE ÉTAPE: Retirer la restriction FR dans getChapterTitle()")
    print("="*80)

    return 0

if __name__ == "__main__":
    exit(main())
