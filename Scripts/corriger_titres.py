#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CORRECTION DES 9 TITRES MANQUANTS/SUSPECTS
Bible Chantée - Script de correction automatique
"""

import json
import re
from pathlib import Path

# Configuration
LYRICS_DIR = Path("C:/ScriptBible/bible-chantee/lyrics")

def corriger_titre_simple(contenu, nouveau_titre):
    """Remplace le titre dans le contenu"""
    # Pattern pour trouver [TITLE]...\r\n
    pattern = r'\[TITLE\][^\[]*'
    replacement = f'[TITLE]\\r\\n{nouveau_titre}\\r\\n'

    # Faire le remplacement
    nouveau_contenu = re.sub(pattern, replacement, contenu, count=1)
    return nouveau_contenu

def corriger_de_matthieu22(contenu):
    """Correction spéciale pour DE Matthieu 22 avec double [TITLE]"""
    # Nettoyer le double [TITLE] et mettre le bon format
    nouveau_titre = "Matthäus 22 - Kommt zur Hochzeit"
    # Remplacer tout jusqu'à [LYRICS]
    pattern = r'\[TITLE\].*?\[LYRICS\]'
    replacement = f'[TITLE]\\r\\n{nouveau_titre}\\r\\n\\r\\n[LYRICS]'
    nouveau_contenu = re.sub(pattern, replacement, contenu, count=1, flags=re.DOTALL)
    return nouveau_contenu

def main():
    print("="*80)
    print("CORRECTION DES 9 TITRES MANQUANTS/SUSPECTS")
    print("="*80)

    corrections = 0

    # 1. EN - Job 5
    print("\n[1/9] EN - Job 5...")
    fichier_en = LYRICS_DIR / "EN.json"
    with open(fichier_en, 'r', encoding='utf-8') as f:
        data_en = json.load(f)

    nouveau_titre = 'Job 5 - "In the Shelter of the Most High"'
    data_en['18']['5'] = corriger_titre_simple(data_en['18']['5'], nouveau_titre)

    with open(fichier_en, 'w', encoding='utf-8') as f:
        json.dump(data_en, f, ensure_ascii=False, indent=2)
    corrections += 1
    print("   [OK] Titre corrigé")

    # 2. DE - Matthieu 22
    print("\n[2/9] DE - Matthieu 22...")
    fichier_de = LYRICS_DIR / "DE.json"
    with open(fichier_de, 'r', encoding='utf-8') as f:
        data_de = json.load(f)

    data_de['40']['22'] = corriger_de_matthieu22(data_de['40']['22'])

    with open(fichier_de, 'w', encoding='utf-8') as f:
        json.dump(data_de, f, ensure_ascii=False, indent=2)
    corrections += 1
    print("   [OK] Titre corrigé")

    # 3-6. IT - 4 titres
    print("\n[3/9] IT - Psaume 132...")
    fichier_it = LYRICS_DIR / "IT.json"
    with open(fichier_it, 'r', encoding='utf-8') as f:
        data_it = json.load(f)

    nouveau_titre = "Salmo 132 - Vieni al Tuo Riposo, Eterno!"
    data_it['19']['132'] = corriger_titre_simple(data_it['19']['132'], nouveau_titre)
    corrections += 1
    print("   [OK] Titre ajouté")

    print("\n[4/9] IT - Psaume 133...")
    nouveau_titre = "Salmo 133 - Uniti nella Benedizione"
    data_it['19']['133'] = corriger_titre_simple(data_it['19']['133'], nouveau_titre)
    corrections += 1
    print("   [OK] Titre ajouté")

    print("\n[5/9] IT - Psaume 136...")
    nouveau_titre = "Salmo 136 - Lodate l'Eterno, la Sua Misericordia Dura in Eterno!"
    data_it['19']['136'] = corriger_titre_simple(data_it['19']['136'], nouveau_titre)
    corrections += 1
    print("   [OK] Titre ajouté")

    print("\n[6/9] IT - Ecclésiaste 8...")
    nouveau_titre = 'Ecclesiaste 8 - "Nella Tua Luce, Signore"'
    data_it['21']['8'] = corriger_titre_simple(data_it['21']['8'], nouveau_titre)
    corrections += 1
    print("   [OK] Titre ajouté")

    with open(fichier_it, 'w', encoding='utf-8') as f:
        json.dump(data_it, f, ensure_ascii=False, indent=2)

    # 7-9. TL - 3 titres
    print("\n[7/9] TL - Ézéchiel 1...")
    fichier_tl = LYRICS_DIR / "TL.json"
    with open(fichier_tl, 'r', encoding='utf-8') as f:
        data_tl = json.load(f)

    nouveau_titre = "Ezekiel 1 - Pangitain ng Kaluwalhatian, Panginoon!"
    data_tl['26']['1'] = corriger_titre_simple(data_tl['26']['1'], nouveau_titre)
    corrections += 1
    print("   [OK] Titre ajouté")

    print("\n[8/9] TL - Ézéchiel 45...")
    nouveau_titre = 'Ezekiel 45 - "Banal na Bahagi, Dalisay na Puso"'
    data_tl['26']['45'] = corriger_titre_simple(data_tl['26']['45'], nouveau_titre)
    corrections += 1
    print("   [OK] Titre ajouté")

    print("\n[9/9] TL - Daniel 1...")
    nouveau_titre = "Daniel 1 - Tapat sa Gitna ng Pagsubok"
    data_tl['27']['1'] = corriger_titre_simple(data_tl['27']['1'], nouveau_titre)
    corrections += 1
    print("   [OK] Titre ajouté")

    with open(fichier_tl, 'w', encoding='utf-8') as f:
        json.dump(data_tl, f, ensure_ascii=False, indent=2)

    print("\n" + "="*80)
    print(f"SUCCÈS: {corrections}/9 titres corrigés")
    print("="*80)
    return 0

if __name__ == "__main__":
    exit(main())
