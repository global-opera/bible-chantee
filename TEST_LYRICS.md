# TEST DES PAROLES CORRIGÉES

## Lancer le serveur de test

```bash
cd C:\ScriptBible\bible-chantee
python -m http.server 8000
```

Puis ouvrir: http://localhost:8000/lecteur.html

## Chapitres à tester en priorité

### Psaumes (corrections ASR)
- **Psaume 1** : Vérifier "comme paille dans le vent" (pas "paillés")
- **Psaume 9** : Vérifier "je louerai" (pas "je l'aurai")
- **Psaume 23** : Vérifier le reformatage et absence de balises

### Autres livres
- **Genèse 1** : Vérifier absence de balises [TITLE] et [LYRICS]
- **Apocalypse 22** : Dernier chapitre, vérifier cohérence

## Points de contrôle

✅ Pas de balises [TITLE] ou [LYRICS] visibles
✅ Paroles reformatées (lignes ~80 caractères)
✅ Corrections ASR appliquées
✅ Strophes préservées (double saut de ligne)
✅ Synchronisation audio/texte correcte

## Si tout est OK

Déployer avec:

```bash
cd C:\ScriptBible\bible-chantee
git status
git add lyrics/FR.json lyrics-data.js
git commit -m "fix: Mise à jour paroles FR avec corrections ASR (PowerShell pipeline)"
git push origin prod
```

## Rollback en cas de problème

Les backups sont disponibles:
- lyrics/FR.json.backup_20260114_130014
- lyrics-data.js.backup_20260114_130014

Pour restaurer:

```bash
cd C:\ScriptBible\bible-chantee
cp lyrics/FR.json.backup_20260114_130014 lyrics/FR.json
cp lyrics-data.js.backup_20260114_130014 lyrics-data.js
```

## Fichiers suspects identifiés (5 sur 1189)

Si besoin de corrections supplémentaires, consulter:
- G:\Mon Drive\01 BibleChantee\audit_all_fixed.txt

Top 5 fichiers avec patterns résiduels:
1. 19_PSA_01_FR.txt - "Taper en moi" (score: 2)
2. 31_OBA_01_FR.txt - "paillé" (score: 1)
3. 17_EST_10_FR.txt - "l'aura" correct (score: 1)
4. 04_NUM_24_FR.txt - "paillé" (score: 1)
5. 55_2TI_03_FR.txt - "taper en moi" (score: 1)

99,58% des chapitres sont parfaitement corrigés !
