#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EXTRACTION V4 - ULTRA-ROBUSTE
Bible Chantée - Gestion des 3 formats + nettoyage agressif + rapport détaillé
"""

import json
import re
from pathlib import Path
from collections import defaultdict

# Configuration
LYRICS_DIR = Path("C:/ScriptBible/bible-chantee/lyrics")
OUTPUT_FILE = Path("C:/ScriptBible/bible-chantee/js/chapter-titles.js")
RAPPORT_FILE = Path("C:/ScriptBible/bible-chantee/Scripts/RAPPORT_EXTRACTION_V4.txt")

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

# Noms de livres pour détecter les titres invalides
BOOK_NAMES = {
    "Genesis", "Génesis", "Genèse", "Genesi", "1. Mose", "Genesis",
    "Exodus", "Éxodo", "Exode", "Esodo", "2. Mose", "Exodus",
    "Amos", "Obadiah", "Obadia", "Abdias", "Jonah", "Jonas", "Giona",
    # Ajouter d'autres si nécessaire
}

def nettoyer_titre_agressif(titre):
    """Nettoyage ultra-agressif des titres"""
    if not titre:
        return ''

    # Supprimer les guillemets doubles et simples
    titre = titre.replace('"', '').replace("'", '')

    # Supprimer les préfixes Title:/Título:/Titel:/etc.
    patterns = [
        r'^Título:\s*', r'^Titulo:\s*', r'^Titel:\s*', r'^Title:\s*', r'^TITLE:\s*',
        r'^\[TITLE\]\s*', r'^\[LYRICS\]\s*', r'^LYRICS:\s*', r'^TITRE:\s*',
        r'^###\s+TÍTULO:\s*', r'^###\s+', r'^##\s+', r'^#\s+',
        r'^\*\*\s*', r'^\*\s*', r'^\s*-\s*'
    ]
    for pattern in patterns:
        titre = re.sub(pattern, '', titre, flags=re.IGNORECASE)

    # Nettoyer espaces multiples
    titre = re.sub(r'\s+', ' ', titre).strip()

    # Rejeter si vide, juste un chiffre, ou juste un placeholder
    if not titre or titre.isdigit():
        return ''

    placeholders = ['[LYRICS]', 'LYRICS', '[TITLE]', 'TITLE', 'TITRE', 'TITULO', 'TITEL', '###']
    if titre.upper() in placeholders:
        return ''

    # Rejeter si c'est juste un nom de livre + numéro (ex: "Amos 6", "Genesis 1")
    for book_name in BOOK_NAMES:
        pattern = rf'^{re.escape(book_name)}\s+\d+$'
        if re.match(pattern, titre, re.IGNORECASE):
            return ''

    # Rejeter si trop court (moins de 3 caractères)
    if len(titre) < 3:
        return ''

    return titre

def extraire_titre_format_a(contenu):
    """Format A : [TITLE]\r\nTitre\r\n\r\n[LYRICS]"""
    match = re.search(r'\[TITLE\]\r\n(.+?)\r\n', contenu)
    if match:
        titre = match.group(1).strip()
        titre_nettoye = nettoyer_titre_agressif(titre)
        if titre_nettoye:
            return titre_nettoye, 'FORMAT_A'
    return None, None

def extraire_titre_format_b(contenu):
    """Format B : [TITLE]\r\nTITRE\r\n\r\n[LYRICS]\r\nVrai titre..."""
    # Chercher ce qui vient après [LYRICS]
    match = re.search(r'\[LYRICS\]\r\n(.+?)(?:\r\n|\n|$)', contenu)
    if match:
        titre = match.group(1).strip()
        # Vérifier que ce n'est pas juste une balise de section
        if not titre.startswith('[') and not titre.upper() in ['VERSE', 'CHORUS', 'BRIDGE']:
            titre_nettoye = nettoyer_titre_agressif(titre)
            if titre_nettoye:
                return titre_nettoye, 'FORMAT_B'
    return None, None

def extraire_titre_format_c(contenu):
    """Format C : Essayer d'extraire n'importe quel titre avec nettoyage agressif"""
    # Essayer de trouver un titre entre [TITLE] et [LYRICS]
    match = re.search(r'\[TITLE\](.*?)\[LYRICS\]', contenu, re.DOTALL)
    if match:
        bloc = match.group(1)
        # Prendre la première ligne non vide après nettoyage
        lignes = bloc.split('\r\n')
        for ligne in lignes:
            ligne = ligne.strip()
            if ligne:
                titre_nettoye = nettoyer_titre_agressif(ligne)
                if titre_nettoye:
                    return titre_nettoye, 'FORMAT_C'
    return None, None

def extraire_titre_robuste(contenu, livre_num, chap_num, lang):
    """Extraction ultra-robuste avec les 3 formats"""
    if not contenu:
        return None, 'VIDE'

    # Essayer Format A (standard)
    titre, format_type = extraire_titre_format_a(contenu)
    if titre:
        return titre, format_type

    # Essayer Format B (titre après [LYRICS])
    titre, format_type = extraire_titre_format_b(contenu)
    if titre:
        return titre, format_type

    # Essayer Format C (extraction forcée)
    titre, format_type = extraire_titre_format_c(contenu)
    if titre:
        return titre, format_type

    return None, 'PLACEHOLDER'

def extraire_titres_langue(langue):
    """Extrait tous les titres pour une langue avec rapport détaillé"""
    fichier = LYRICS_DIR / f"{langue}.json"

    if not fichier.exists():
        return {}, {}

    print(f"\n[{langue}] Extraction ultra-robuste...")

    with open(fichier, 'r', encoding='utf-8') as f:
        data = json.load(f)

    titres = {}
    rapport = {
        'total': 0,
        'extraits': 0,
        'vides': 0,
        'placeholders': 0,
        'format_a': 0,
        'format_b': 0,
        'format_c': 0,
        'details': []
    }

    for livre_num, chapitres in data.items():
        book_code = BOOK_CODES.get(livre_num)
        if not book_code:
            continue

        if book_code not in titres:
            titres[book_code] = {}

        for chapitre_num, contenu in chapitres.items():
            rapport['total'] += 1
            titre, status = extraire_titre_robuste(contenu, livre_num, chapitre_num, langue)

            if titre:
                titres[book_code][chapitre_num] = titre
                rapport['extraits'] += 1

                if status == 'FORMAT_A':
                    rapport['format_a'] += 1
                elif status == 'FORMAT_B':
                    rapport['format_b'] += 1
                elif status == 'FORMAT_C':
                    rapport['format_c'] += 1
            else:
                if status == 'VIDE':
                    rapport['vides'] += 1
                else:
                    rapport['placeholders'] += 1
                    # Enregistrer pour le rapport
                    rapport['details'].append({
                        'livre': book_code,
                        'chapitre': chapitre_num,
                        'status': status
                    })

    pct = (rapport['extraits'] / rapport['total'] * 100) if rapport['total'] > 0 else 0
    print(f"   {rapport['extraits']}/{rapport['total']} titres extraits ({pct:.1f}%)")
    print(f"   Format A: {rapport['format_a']}, Format B: {rapport['format_b']}, Format C: {rapport['format_c']}")
    print(f"   Vides: {rapport['vides']}, Placeholders: {rapport['placeholders']}")

    return titres, rapport

def generer_rapport(tous_rapports):
    """Génère un rapport détaillé"""
    print(f"\n[RAPPORT] Génération du rapport...")

    with open(RAPPORT_FILE, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("RAPPORT D'EXTRACTION V4 - ULTRA-ROBUSTE\n")
        f.write("Bible Chantee - Titres de chapitres\n")
        f.write("="*80 + "\n\n")

        for langue in LANGUES:
            if langue not in tous_rapports:
                continue

            rapport = tous_rapports[langue]
            f.write(f"\n[{langue}] STATISTIQUES\n")
            f.write("-" * 40 + "\n")
            f.write(f"Total chapitres:    {rapport['total']}\n")
            f.write(f"Titres extraits:    {rapport['extraits']} ({rapport['extraits']/rapport['total']*100:.1f}%)\n")
            f.write(f"Format A (standard): {rapport['format_a']}\n")
            f.write(f"Format B (apres LYRICS): {rapport['format_b']}\n")
            f.write(f"Format C (force): {rapport['format_c']}\n")
            f.write(f"Vides:              {rapport['vides']}\n")
            f.write(f"Placeholders:       {rapport['placeholders']}\n")

            if rapport['details']:
                f.write(f"\nChapitres avec placeholders ({len(rapport['details'])}):\n")
                for detail in rapport['details'][:20]:  # Limiter à 20
                    f.write(f"  - {detail['livre']} {detail['chapitre']} ({detail['status']})\n")
                if len(rapport['details']) > 20:
                    f.write(f"  ... et {len(rapport['details']) - 20} autres\n")

    print(f"   [OK] Rapport genere: {RAPPORT_FILE}")

def generer_fichier_js(all_titres):
    """Génère le fichier chapter-titles.js"""
    print("\n[GENERATION] Creation de chapter-titles.js...")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("// Bible Chantee - Titres des chapitres\n")
        f.write("// Genere automatiquement - Extraction V4 ULTRA-ROBUSTE\n")
        f.write("// Gere 3 formats + nettoyage agressif\n\n")
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

    print(f"   [OK] Fichier genere: {OUTPUT_FILE}")

def main():
    print("="*80)
    print("EXTRACTION V4 - ULTRA-ROBUSTE")
    print("Gestion des 3 formats + nettoyage agressif")
    print("="*80)

    all_titres = {}
    tous_rapports = {}

    for langue in LANGUES:
        titres, rapport = extraire_titres_langue(langue)
        if titres:
            all_titres[langue] = titres
            tous_rapports[langue] = rapport

    generer_rapport(tous_rapports)
    generer_fichier_js(all_titres)

    print("\n" + "="*80)
    print("RESUME FINAL:")
    print("="*80)
    for langue in LANGUES:
        if langue in tous_rapports:
            r = tous_rapports[langue]
            pct = r['extraits'] / r['total'] * 100
            print(f"  {langue}: {r['extraits']}/{r['total']} ({pct:.1f}%) - "
                  f"A:{r['format_a']} B:{r['format_b']} C:{r['format_c']}")
    print("="*80)
    print("\nSUCCES: Extraction V4 terminee !")
    print(f"Rapport detaille: {RAPPORT_FILE}")
    print("="*80)

    return 0

if __name__ == "__main__":
    exit(main())
