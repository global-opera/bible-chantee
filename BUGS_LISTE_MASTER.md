# 🐛 LISTE MASTER - BUGS À CORRIGER

Date création: 2026-02-01
Mise à jour: 2026-02-01

---

## 📊 RÉSUMÉ

| Status | Nombre |
|--------|--------|
| 🔴 À corriger | 3 |
| 🟢 Corrigé | 0 |
| **Total** | **3** |

---

## 🐛 BUGS ACTIFS

### 6. Bouton partage: "undefined" au lieu du nom du livre

**Status**: 🔴 À corriger
**Priorité**: Moyenne
**Difficulté**: Facile
**Impact**: Moyen

**Description**:
Le bouton de partage affiche "undefined 1" au lieu du nom du livre (ex: "Genèse 1")

**Détails**:
- Sujet: "Bible Chantée - undefined 1" ❌
- Message: "Écoute undefined 1 sur Bible Chantée !" ❌
- URL: ✅ Correcte
- Page: index.html (lecture Bible)

**Fix Requis**:
- Corriger récupération du nom du livre dans fonction de partage
- Variable bookName non définie ou mal passée

**Rapport**: BUG_PARTAGE_UNDEFINED.md

**Temps estimé**: 5-10 minutes

---

### 7a. EN Ephésiens 1-4: Lyrics vides

**Status**: 🔴 À corriger
**Priorité**: HAUTE
**Difficulté**: Moyenne
**Impact**: Élevé

**Description**:
Les chapitres 1, 2, 3, 4 d'Ephésiens (livre 49) en ANGLAIS sont vides (seulement header `[LYRICS]` sans contenu)

**Détails**:
- Fichier: `lyrics/EN.json`
- Chapitres affectés: 1, 2, 3, 4
- Chapitres OK: 5, 6 (complets)
- Statut: 33% complet (2/6 chapitres)

**Fix Requis**:
- Ajouter les lyrics pour Ephésiens chapitres 1-4 dans EN.json
- Générer ou traduire le contenu manquant

**Rapport**: AUDIT_LYRICS_EPHESIENS_COMPLET.md

**Temps estimé**: 2-4 heures (génération via Suno + ajout JSON)

---

### 7b. FR Ephésiens: Livre complètement absent

**Status**: 🔴 À corriger
**Priorité**: HAUTE
**Difficulté**: Moyenne
**Impact**: Élevé

**Description**:
Le livre 49 (Ephésiens) est complètement ABSENT du dossier `lyrics/FR/`

**Détails**:
- Dossier manquant: `lyrics/FR/49_EPH/`
- Fichiers manquants: 6 fichiers (49_EPH_01_FR.txt à 49_EPH_06_FR.txt)
- Statut: 0% complet (0/6 chapitres)

**Fix Requis**:
- Créer dossier `lyrics/FR/49_EPH/`
- Créer 6 fichiers de lyrics pour tous les chapitres
- Générer ou traduire le contenu

**Rapport**: AUDIT_LYRICS_EPHESIENS_COMPLET.md

**Temps estimé**: 2-4 heures (génération via Suno + création fichiers)

---

## 📋 BUGS PAR PRIORITÉ

### 🔴 HAUTE
- [#7a] EN Ephésiens 1-4: Lyrics vides (4 chapitres)
- [#7b] FR Ephésiens: Livre complètement absent (6 chapitres)

### 🟡 MOYENNE
- [#6] Bouton partage: "undefined" au lieu du nom du livre

### 🟢 BASSE
*(Aucun bug basse priorité pour l'instant)*

---

## 📋 BUGS PAR PAGE

### index.html (Bible principale)
- [#6] Bouton partage: "undefined" au lieu du nom du livre

### Lyrics/Data
- [#7a] EN Ephésiens 1-4: Lyrics vides (EN.json)
- [#7b] FR Ephésiens: Livre absent (FR/)

### confessions.html
*(Aucun bug connu)*

### promesses.html
*(Aucun bug connu)*

### prieres.html
*(Aucun bug connu)*

### about.html
*(Aucun bug connu)*

### aide.html
*(Aucun bug connu)*

---

## 🟢 BUGS CORRIGÉS

*(Aucun pour l'instant - cette section sera remplie après corrections)*

---

## 📝 NOTES

### Comment Ajouter un Bug

Format à suivre:
```markdown
### N. Titre Court du Bug

**Status**: 🔴 À corriger / 🟡 En cours / 🟢 Corrigé
**Priorité**: Haute / Moyenne / Basse
**Difficulté**: Facile / Moyenne / Difficile
**Impact**: Faible / Moyen / Élevé

**Description**: Description claire du problème

**Détails**: Détails techniques

**Fix Requis**: Solution proposée

**Rapport**: Lien vers rapport détaillé (optionnel)

**Temps estimé**: X minutes/heures
```

### Priorités

- **HAUTE**: Bug bloquant, fonctionnalité cassée, expérience utilisateur dégradée
- **MOYENNE**: Bug gênant mais fonctionnalité utilisable, texte/affichage incorrect
- **BASSE**: Bug mineur, cosmétique, edge case rare

### Difficulté

- **FACILE**: 1 variable, 1 ligne, correction évidente (< 15 min)
- **MOYENNE**: Plusieurs fichiers, logique simple (15-60 min)
- **DIFFICILE**: Architecture complexe, plusieurs systèmes (> 1h)

---

## 🔗 RÉFÉRENCES

- **Rapports Bugs**: Fichiers `BUG_*.md`
- **Corrections**: À effectuer dans conversation Claude dédiée
- **Tests**: Voir section tests dans chaque rapport

---

**FIN DE LA LISTE**

Prochaine mise à jour: Après corrections ou nouveaux bugs détectés
