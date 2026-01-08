#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AUDIT DES TRADUCTIONS DES TITRES DE CHAPITRES
Bible Chantée - Vérification complète des 1189 chapitres en 7 langues
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
import re

# Configuration
LYRICS_DIR = Path("C:/ScriptBible/bible-chantee/lyrics")
LANGUES = ["FR", "EN", "PT", "ES", "DE", "IT", "TL"]
TOTAL_CHAPITRES = 1189

# Structure de la Bible (66 livres avec leur nombre de chapitres)
STRUCTURE_BIBLE = {
    1: ("Genèse", 50), 2: ("Exode", 40), 3: ("Lévitique", 27), 4: ("Nombres", 36),
    5: ("Deutéronome", 34), 6: ("Josué", 24), 7: ("Juges", 21), 8: ("Ruth", 4),
    9: ("1 Samuel", 31), 10: ("2 Samuel", 24), 11: ("1 Rois", 22), 12: ("2 Rois", 25),
    13: ("1 Chroniques", 29), 14: ("2 Chroniques", 36), 15: ("Esdras", 10), 16: ("Néhémie", 13),
    17: ("Esther", 10), 18: ("Job", 42), 19: ("Psaumes", 150), 20: ("Proverbes", 31),
    21: ("Ecclésiaste", 12), 22: ("Cantique", 8), 23: ("Ésaïe", 66), 24: ("Jérémie", 52),
    25: ("Lamentations", 5), 26: ("Ézéchiel", 48), 27: ("Daniel", 12), 28: ("Osée", 14),
    29: ("Joël", 3), 30: ("Amos", 9), 31: ("Abdias", 1), 32: ("Jonas", 4),
    33: ("Michée", 7), 34: ("Nahum", 3), 35: ("Habakuk", 3), 36: ("Sophonie", 3),
    37: ("Aggée", 2), 38: ("Zacharie", 14), 39: ("Malachie", 4),
    40: ("Matthieu", 28), 41: ("Marc", 16), 42: ("Luc", 24), 43: ("Jean", 21),
    44: ("Actes", 28), 45: ("Romains", 16), 46: ("1 Corinthiens", 16), 47: ("2 Corinthiens", 13),
    48: ("Galates", 6), 49: ("Éphésiens", 6), 50: ("Philippiens", 4), 51: ("Colossiens", 4),
    52: ("1 Thessaloniciens", 5), 53: ("2 Thessaloniciens", 3), 54: ("1 Timothée", 6),
    55: ("2 Timothée", 4), 56: ("Tite", 3), 57: ("Philémon", 1), 58: ("Hébreux", 13),
    59: ("Jacques", 5), 60: ("1 Pierre", 5), 61: ("2 Pierre", 3), 62: ("1 Jean", 5),
    63: ("2 Jean", 1), 64: ("3 Jean", 1), 65: ("Jude", 1), 66: ("Apocalypse", 22)
}

def extraire_titre(contenu):
    """Extrait le titre d'un chapitre depuis le contenu"""
    if not contenu:
        return None

    # Chercher le pattern [TITLE]\r\nTitre du chapitre
    match = re.search(r'\[TITLE\]\\r\\n(.+?)\\r\\n', contenu)
    if match:
        return match.group(1).strip()

    # Fallback: chercher juste après [TITLE]
    if '[TITLE]' in contenu:
        parts = contenu.split('[TITLE]', 1)
        if len(parts) > 1:
            # Prendre la première ligne après [TITLE]
            lines = parts[1].replace('\\r\\n', '\n').split('\n')
            for line in lines:
                line = line.strip()
                if line and not line.startswith('['):
                    return line

    return None

def verifier_langue(langue):
    """Vérifie une langue complète"""
    fichier = LYRICS_DIR / f"{langue}.json"

    if not fichier.exists():
        return {
            "langue": langue,
            "statut": "ERREUR",
            "erreur": f"Fichier {fichier} introuvable",
            "chapitres_manquants": [],
            "titres_manquants": [],
            "total_chapitres": 0
        }

    print(f"\n{'='*70}")
    print(f"Vérification: {langue}")
    print(f"{'='*70}")

    try:
        with open(fichier, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        return {
            "langue": langue,
            "statut": "ERREUR",
            "erreur": f"Erreur de lecture: {str(e)}",
            "chapitres_manquants": [],
            "titres_manquants": [],
            "total_chapitres": 0
        }

    chapitres_manquants = []
    titres_manquants = []
    titres_suspects = []
    total_trouve = 0

    # Vérifier chaque livre et chapitre
    for livre_num, (nom_livre, nb_chapitres) in STRUCTURE_BIBLE.items():
        livre_str = str(livre_num)

        if livre_str not in data:
            # Livre entier manquant
            for chap in range(1, nb_chapitres + 1):
                chapitres_manquants.append(f"{nom_livre} {chap}")
            continue

        livre_data = data[livre_str]

        for chap in range(1, nb_chapitres + 1):
            chap_str = str(chap)

            if chap_str not in livre_data:
                chapitres_manquants.append(f"{nom_livre} {chap}")
                continue

            total_trouve += 1
            contenu = livre_data[chap_str]
            titre = extraire_titre(contenu)

            if not titre:
                titres_manquants.append(f"{nom_livre} {chap}")
            elif len(titre) < 5:
                # Titre suspect (trop court)
                titres_suspects.append({
                    "ref": f"{nom_livre} {chap}",
                    "titre": titre,
                    "raison": "Titre trop court"
                })

    # Résumé
    nb_manquants = len(chapitres_manquants)
    nb_titres_manquants = len(titres_manquants)
    nb_suspects = len(titres_suspects)

    print(f"\n[OK] Chapitres trouves: {total_trouve}/{TOTAL_CHAPITRES}")

    if nb_manquants > 0:
        print(f"[X] Chapitres manquants: {nb_manquants}")
        if nb_manquants <= 20:
            for ref in chapitres_manquants[:10]:
                print(f"  - {ref}")
            if nb_manquants > 10:
                print(f"  ... et {nb_manquants - 10} autres")

    if nb_titres_manquants > 0:
        print(f"[!] Titres manquants: {nb_titres_manquants}")
        if nb_titres_manquants <= 20:
            for ref in titres_manquants[:10]:
                print(f"  - {ref}")
            if nb_titres_manquants > 10:
                print(f"  ... et {nb_titres_manquants - 10} autres")

    if nb_suspects > 0:
        print(f"[!] Titres suspects: {nb_suspects}")
        for item in titres_suspects[:5]:
            print(f"  - {item['ref']}: '{item['titre']}' ({item['raison']})")

    statut = "OK" if (nb_manquants == 0 and nb_titres_manquants == 0) else "ANOMALIES"

    return {
        "langue": langue,
        "statut": statut,
        "total_chapitres": total_trouve,
        "chapitres_manquants": chapitres_manquants,
        "titres_manquants": titres_manquants,
        "titres_suspects": titres_suspects
    }

def generer_rapport(resultats):
    """Génère le rapport final"""
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    rapport_file = Path("C:/ScriptBible/bible-chantee/Scripts") / f"RAPPORT_AUDIT_TRADUCTIONS_{timestamp}.txt"

    with open(rapport_file, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("RAPPORT D'AUDIT - TRADUCTIONS DES TITRES DE CHAPITRES\n")
        f.write(f"Bible Chantée - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*80 + "\n\n")

        f.write(f"LANGUES VÉRIFIÉES: {len(LANGUES)}\n")
        f.write(f"TOTAL ATTENDU: {TOTAL_CHAPITRES} chapitres par langue\n\n")

        # Résumé par langue
        f.write("="*80 + "\n")
        f.write("RÉSUMÉ PAR LANGUE\n")
        f.write("="*80 + "\n\n")

        for res in resultats:
            langue = res["langue"]
            statut = res["statut"]
            icon = "[OK]" if statut == "OK" else "[X]"

            f.write(f"{icon} {langue}: {statut}\n")

            if statut != "ERREUR":
                f.write(f"   Chapitres: {res['total_chapitres']}/{TOTAL_CHAPITRES}\n")

                if res['chapitres_manquants']:
                    f.write(f"   Manquants: {len(res['chapitres_manquants'])} chapitres\n")

                if res['titres_manquants']:
                    f.write(f"   Titres manquants: {len(res['titres_manquants'])}\n")

                if res['titres_suspects']:
                    f.write(f"   Titres suspects: {len(res['titres_suspects'])}\n")
            else:
                f.write(f"   ERREUR: {res.get('erreur', 'Inconnue')}\n")

            f.write("\n")

        # Détails des anomalies
        f.write("\n" + "="*80 + "\n")
        f.write("DÉTAILS DES ANOMALIES\n")
        f.write("="*80 + "\n\n")

        for res in resultats:
            if res["statut"] == "OK":
                continue

            langue = res["langue"]
            f.write(f"\n--- {langue} ---\n\n")

            if res.get("erreur"):
                f.write(f"ERREUR: {res['erreur']}\n\n")
                continue

            if res['chapitres_manquants']:
                f.write(f"CHAPITRES MANQUANTS ({len(res['chapitres_manquants'])}):\n")
                for ref in res['chapitres_manquants']:
                    f.write(f"  - {ref}\n")
                f.write("\n")

            if res['titres_manquants']:
                f.write(f"TITRES MANQUANTS ({len(res['titres_manquants'])}):\n")
                for ref in res['titres_manquants']:
                    f.write(f"  - {ref}\n")
                f.write("\n")

            if res['titres_suspects']:
                f.write(f"TITRES SUSPECTS ({len(res['titres_suspects'])}):\n")
                for item in res['titres_suspects']:
                    f.write(f"  - {item['ref']}: '{item['titre']}' ({item['raison']})\n")
                f.write("\n")

        f.write("\n" + "="*80 + "\n")
        f.write("FIN DU RAPPORT\n")
        f.write("="*80 + "\n")

    return rapport_file

def main():
    print("="*80)
    print("AUDIT DES TRADUCTIONS DES TITRES DE CHAPITRES")
    print("Bible Chantée - Vérification des 1189 chapitres")
    print("="*80)

    resultats = []

    for langue in LANGUES:
        res = verifier_langue(langue)
        resultats.append(res)

    # Génération du rapport
    print("\n" + "="*80)
    print("GÉNÉRATION DU RAPPORT")
    print("="*80)

    rapport_file = generer_rapport(resultats)

    print(f"\n[OK] Rapport genere: {rapport_file}")
    print("\n" + "="*80)
    print("RÉSUMÉ FINAL")
    print("="*80 + "\n")

    ok_count = sum(1 for r in resultats if r["statut"] == "OK")
    anomalies_count = sum(1 for r in resultats if r["statut"] == "ANOMALIES")
    erreurs_count = sum(1 for r in resultats if r["statut"] == "ERREUR")

    print(f"[OK] Langues OK: {ok_count}/{len(LANGUES)}")
    print(f"[!] Langues avec anomalies: {anomalies_count}/{len(LANGUES)}")
    print(f"[X] Langues en erreur: {erreurs_count}/{len(LANGUES)}")

    if anomalies_count > 0 or erreurs_count > 0:
        print("\n[!] ATTENTION: Des anomalies ont ete detectees!")
        print(f"   Consultez le rapport: {rapport_file.name}")
        return 1
    else:
        print("\n[OK] SUCCES: Toutes les traductions sont completes!")
        return 0

if __name__ == "__main__":
    sys.exit(main())
