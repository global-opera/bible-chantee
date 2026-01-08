#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NETTOYAGE ET COMPLÉTION DES TITRES DE CHAPITRES
Bible Chantée - Nettoyage des placeholders et complétion
"""

import json
import re
from pathlib import Path
from collections import defaultdict

# Configuration
LYRICS_DIR = Path("C:/ScriptBible/bible-chantee/lyrics")
CHAPTER_TITLES_JS = Path("C:/ScriptBible/bible-chantee/js/chapter-titles.js")

LANGUES = ["FR", "EN", "PT", "ES", "DE", "IT", "TL"]

# Patterns à nettoyer
PATTERNS_TO_CLEAN = [
    r'^Título:\s*',
    r'^Titulo:\s*',
    r'^Titel:\s*',
    r'^Title:\s*',
    r'^TITLE:\s*',
    r'^\[TITLE\]\s*',
    r'^\[LYRICS\]\s*',
    r'^LYRICS:\s*',
    r'^###\s+TÍTULO:\s*',
    r'^###\s+',
    r'^##\s+',
    r'^#\s+',
    r'^\*\*\s*',
    r'^\*\s*',
]

def charger_chapter_titles():
    """Charge le fichier chapter-titles.js existant"""
    print("[1/4] Chargement de chapter-titles.js...")

    with open(CHAPTER_TITLES_JS, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extraire l'objet JavaScript
    match = re.search(r'const CHAPTER_TITLES = ({.*});', content, re.DOTALL)
    if not match:
        print("   [ERREUR] Impossible de parser chapter-titles.js")
        return {}

    # Convertir en JSON valide (remplacer les ' par ")
    js_content = match.group(1)

    # Parser manuellement car c'est du JavaScript, pas du JSON strict
    # On va utiliser eval de manière sécurisée avec ast
    import ast
    try:
        data = ast.literal_eval(js_content)
    except:
        print("   [ERREUR] Impossible de parser le contenu")
        return {}

    print(f"   [OK] {len(data)} langues chargées")
    return data

def nettoyer_titre(titre):
    """Nettoie un titre de tous les préfixes/balises"""
    if not titre:
        return titre

    titre_original = titre

    # Appliquer tous les patterns
    for pattern in PATTERNS_TO_CLEAN:
        titre = re.sub(pattern, '', titre, flags=re.IGNORECASE)

    # Nettoyer les espaces
    titre = titre.strip()

    # Si le titre est devenu vide ou juste un nombre, retourner vide
    if not titre or titre.isdigit():
        return ''

    # Si le titre est juste [LYRICS] ou similaire, retourner vide
    if titre.upper() in ['[LYRICS]', 'LYRICS', '[TITLE]', 'TITLE']:
        return ''

    return titre

def analyser_et_nettoyer_titres(data):
    """Analyse et nettoie tous les titres"""
    print("\n[2/4] Analyse et nettoyage des titres...")

    stats = {lang: {'avant': 0, 'après': 0, 'nettoyés': 0, 'supprimés': 0}
             for lang in LANGUES}

    for lang in LANGUES:
        if lang not in data:
            continue

        for book, chapitres in data[lang].items():
            for chap_num, titre in list(chapitres.items()):
                stats[lang]['avant'] += 1

                titre_nettoye = nettoyer_titre(titre)

                if titre_nettoye != titre:
                    stats[lang]['nettoyés'] += 1

                if titre_nettoye:
                    data[lang][book][chap_num] = titre_nettoye
                    stats[lang]['après'] += 1
                else:
                    # Supprimer les titres vides
                    del data[lang][book][chap_num]
                    stats[lang]['supprimés'] += 1

    # Afficher les statistiques
    print("\n   Résultats par langue:")
    for lang in LANGUES:
        if stats[lang]['avant'] > 0:
            avant = stats[lang]['avant']
            après = stats[lang]['après']
            nettoyés = stats[lang]['nettoyés']
            supprimés = stats[lang]['supprimés']
            print(f"   {lang}: {avant} -> {après} titres "
                  f"({nettoyés} nettoyes, {supprimés} supprimes)")

    return data

def extraire_titre_depuis_lyrics(book_num, chap_num, lang):
    """Extrait le titre depuis le fichier lyrics si disponible"""
    fichier = LYRICS_DIR / f"{lang}.json"

    if not fichier.exists():
        return None

    try:
        with open(fichier, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if book_num in data and chap_num in data[book_num]:
            contenu = data[book_num][chap_num]
            match = re.search(r'\[TITLE\]\r\n(.+?)\r\n', contenu)
            if match:
                titre = match.group(1).strip()
                titre_nettoye = nettoyer_titre(titre)
                if titre_nettoye:
                    return titre_nettoye
    except:
        pass

    return None

def completer_titres_manquants(data):
    """Tente de compléter les titres manquants depuis lyrics"""
    print("\n[3/4] Complétion des titres manquants...")

    stats = {lang: {'ajoutés': 0} for lang in LANGUES}

    # Mapping book codes vers numéros
    BOOK_CODES_REVERSE = {}
    for num in range(1, 67):
        for lang_data in data.values():
            for book_code in lang_data.keys():
                if book_code.startswith(f"{num:02d}_"):
                    BOOK_CODES_REVERSE[book_code] = str(num)
                    break

    # Pour chaque langue, vérifier les chapitres manquants
    for lang in LANGUES:
        if lang not in data:
            continue

        for book_code, chapitres in data[lang].items():
            book_num = BOOK_CODES_REVERSE.get(book_code, '')
            if not book_num:
                continue

            # Vérifier les chapitres qui existent dans le fichier lyrics
            fichier_lyrics = LYRICS_DIR / f"{lang}.json"
            if not fichier_lyrics.exists():
                continue

            try:
                with open(fichier_lyrics, 'r', encoding='utf-8') as f:
                    lyrics_data = json.load(f)

                if book_num in lyrics_data:
                    for chap_num in lyrics_data[book_num].keys():
                        # Si le chapitre n'a pas de titre, essayer de l'extraire
                        if chap_num not in chapitres:
                            titre = extraire_titre_depuis_lyrics(book_num, chap_num, lang)
                            if titre:
                                data[lang][book_code][chap_num] = titre
                                stats[lang]['ajoutés'] += 1
            except:
                pass

    # Afficher les statistiques
    print("\n   Titres ajoutés par langue:")
    for lang in LANGUES:
        if stats[lang]['ajoutés'] > 0:
            print(f"   {lang}: +{stats[lang]['ajoutés']} titres")

    return data

def generer_fichier_js(data):
    """Génère le fichier chapter-titles.js nettoyé"""
    print("\n[4/4] Génération du fichier chapter-titles.js...")

    with open(CHAPTER_TITLES_JS, 'w', encoding='utf-8') as f:
        f.write("// Bible Chantée - Titres des chapitres\n")
        f.write("// Généré automatiquement depuis les fichiers lyrics\n")
        f.write("// Nettoyé de tous les placeholders et préfixes\n\n")
        f.write("const CHAPTER_TITLES = {\n")

        for i, lang in enumerate(LANGUES):
            if lang not in data:
                continue

            f.write(f'  "{lang}": {{\n')

            # Trier les livres par code
            livres_tries = sorted(data[lang].keys())

            for j, book_code in enumerate(livres_tries):
                chapitres = data[lang][book_code]
                if not chapitres:
                    continue

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

    print(f"   [OK] Fichier généré: {CHAPTER_TITLES_JS}")

def main():
    print("="*80)
    print("NETTOYAGE ET COMPLÉTION DES TITRES DE CHAPITRES")
    print("="*80)

    # Charger les titres existants
    data = charger_chapter_titles()
    if not data:
        return 1

    # Analyser et nettoyer
    data = analyser_et_nettoyer_titres(data)

    # Compléter les manquants
    data = completer_titres_manquants(data)

    # Générer le fichier nettoyé
    generer_fichier_js(data)

    print("\n" + "="*80)
    print("RÉSUMÉ FINAL:")
    print("="*80)
    for lang in LANGUES:
        if lang in data:
            total_chapitres = sum(len(chapitres) for chapitres in data[lang].values())
            total_livres = len([b for b in data[lang].values() if b])
            print(f"  {lang}: {total_chapitres} chapitres dans {total_livres} livres")
    print("="*80)
    print("\nSUCCÈS: chapter-titles.js nettoyé et complété !")
    print("="*80)

    return 0

if __name__ == "__main__":
    exit(main())
