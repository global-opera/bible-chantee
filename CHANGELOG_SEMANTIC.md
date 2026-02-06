# Changelog - Semantic Dictionary

## Version 2.0 - 1er février 2026

### Correction critique: Réduction à 7 langues actives

**Problème**: Le dictionnaire contenait 12 langues mais seulement 7 sont utilisées sur le site.

**Solution**: Suppression de 5 langues non utilisées (AR, RU, ZH, SW, HI).

#### Fichiers modifiés

1. **js/semantic-dictionary.js**
   - Suppression des sections AR, RU, ZH, SW, HI
   - Taille réduite: 157 KB → 96 KB (-39%)
   - Langues conservées: FR, EN, PT, ES, DE, IT, TL
   - Vérifications: 0 occurrence des langues supprimées, 26 occurrences de TL

2. **js/semantic-engine.js**
   - Lignes 400 et 420: mise à jour des boucles forEach
   - Avant: `['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'AR', 'RU', 'ZH', 'TL', 'SW', 'HI']`
   - Après: `['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL']`

3. **Documentation (3 fichiers)**
   - INTEGRATION_SEMANTIC.md: "12 langues" → "7 langues"
   - SEMANTIC_SUMMARY.txt: "12 langues" → "7 langues"
   - VALIDATION_CHECKLIST.md: "12 langues" → "7 langues"

4. **test-semantic.html**
   - Tests en HI, AR, ZH remplacés par tests en TL et DE
   - Nouveaux tests: diyos (TL), pag-asa (TL), gott (DE)

#### Nouveaux fichiers

- **CORRECTION_7_LANGUES.md**: Documentation détaillée de la correction
- **CORRECTION_SUMMARY.txt**: Résumé texte de la correction
- **CHANGELOG_SEMANTIC.md**: Ce fichier (historique des versions)

#### Impact

**Performance**
- Réduction taille fichier: 39%
- Temps de chargement: Amélioré
- Mémoire utilisée: Réduite
- Vitesse de recherche: Améliorée

**Maintenance**
- Code simplifié
- Alignement avec les langues du site
- Documentation cohérente
- Moins de langues à maintenir

**Fonctionnalité**
- Aucune perte de fonctionnalité
- Toutes les langues actives du site supportées
- ~2100 mots-clés conservés (vs ~3500 avant)

#### Tests effectués

- ✓ Absence des langues supprimées (0 occurrence)
- ✓ Présence de TL (26 occurrences)
- ✓ Mise à jour semantic-engine.js (2 lignes)
- ✓ Documentation mise à jour (3 fichiers)
- ✓ Tests automatiques mis à jour

---

## Version 1.0 - 1er février 2026

### Création initiale du dictionnaire sémantique enrichi

#### Fichiers créés

1. **js/semantic-dictionary.js** (157 KB)
   - 12 familles thématiques
   - 12 langues: FR, EN, PT, ES, DE, IT, AR, RU, ZH, TL, SW, HI
   - 14 thèmes modernes
   - ~3500 mots-clés

2. **test-semantic.html**
   - Page de test interactive
   - Tests automatiques multilingues

3. **INTEGRATION_SEMANTIC.md**
   - Documentation complète
   - Guide d'utilisation

4. **SEMANTIC_SUMMARY.txt**
   - Résumé de l'intégration

5. **VALIDATION_CHECKLIST.md**
   - Checklist de validation

#### Fichiers modifiés

1. **js/semantic-engine.js**
   - Nouvelle méthode `enrichSemanticMap()`
   - Auto-chargement au démarrage

2. **lecteur.html**
   - Ajout du script semantic-dictionary.js

#### Structure

**12 Familles thématiques**
1. dieu_nature - Dieu & Sa Nature
2. foi_confiance - Foi & Confiance
3. amour_relations - Amour & Relations
4. souffrance_epreuves - Souffrance & Épreuves
5. esperance_avenir - Espérance & Avenir
6. sagesse_direction - Sagesse & Direction
7. louange_adoration - Louange & Adoration
8. repentance_pardon - Repentance & Pardon
9. combat_victoire - Combat & Victoire
10. paix_repos - Paix & Repos
11. justice_jugement - Justice & Jugement
12. creation_nature - Création & Nature

**14 Thèmes modernes**
1. burnout
2. depression
3. anxiete
4. solitude
5. divorce
6. chomage
7. maladie_grave
8. deuil
9. conflit
10. decision
11. nouveau_depart
12. reussite
13. mariage
14. naissance

#### Caractéristiques

- Format UTF-8 sans BOM
- Mots-clés normalisés en minuscules
- Recherche insensible aux accents
- Intégration automatique au chargement
- Conservation des mots-clés existants

---

## Roadmap future

### Version 2.1 (À venir)
- [ ] Ajout de plus de chapitres bibliques par famille
- [ ] Enrichissement des thèmes modernes
- [ ] Optimisation de la taille du fichier

### Version 3.0 (À venir)
- [ ] Interface admin pour gérer le dictionnaire
- [ ] Connexion à une base de données
- [ ] Système de feedback utilisateur
- [ ] Statistiques d'utilisation
- [ ] Suggestions de recherche
- [ ] Recherche floue (typos)

---

**Maintenu par**: Claude Sonnet 4.5
**Projet**: Bible Chantée
**Dernière mise à jour**: 1er février 2026
