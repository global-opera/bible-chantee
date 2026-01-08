#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""DEBUG - Voir la structure exacte d'un titre"""

import json
from pathlib import Path

fichier = Path("C:/ScriptBible/bible-chantee/lyrics/FR.json")

with open(fichier, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Prendre le premier chapitre disponible
for livre_num, chapitres in data.items():
    for chapitre_num, contenu in chapitres.items():
        print(f"Livre: {livre_num}, Chapitre: {chapitre_num}")
        print(f"Longueur du contenu: {len(contenu)}")
        print(f"\nPremiers 500 caractères:")
        print(repr(contenu[:500]))
        print(f"\nRecherche de '[TITLE]':")
        if '[TITLE]' in contenu:
            idx = contenu.index('[TITLE]')
            print(f"  Trouvé à l'index {idx}")
            print(f"  Extrait autour:")
            print(repr(contenu[idx:idx+100]))
        else:
            print("  PAS TROUVÉ!")
        exit(0)
