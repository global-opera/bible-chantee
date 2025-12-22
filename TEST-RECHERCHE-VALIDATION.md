# 🔍 TEST VALIDATION - Fonction Recherche Bible Chantée

**Objectif** : Valider que la recherche fonctionne pour toutes les langues (FR/EN/PT/ES)

---

## ✅ CRITÈRES PASS/FAIL (simples et objectifs)

### Test réussi SI :
1. ✅ Liste de résultats s'affiche (pas d'erreur)
2. ✅ Au moins **20 résultats** trouvés
3. ✅ Le mot recherché est **surligné** (highlight jaune)
4. ✅ Clic sur un résultat → chapitre se charge

### Test échoué SI :
1. ❌ Alert "Recherche Bible non disponible"
2. ❌ Aucun résultat / "0 versets trouvés"
3. ❌ Résultats affichés mais < 20 (dataset incomplet)
4. ❌ Clic sur résultat ne fait rien

---

## 🧪 PROTOCOLE DE TEST (2 minutes par langue)

### Français (FR)

**Accès** : https://biblechantee.com/lecteur.html?lang=FR

**Test 1 : Mot fréquent**
- Mot : `Dieu`
- **PASS** : > 100 résultats (plusieurs milliers normalement)

**Test 2 : Mot discriminant**
- Mot : `Moïse`
- **PASS** : 20-500 résultats

**Test 3 : Clic résultat**
- Cliquer sur un résultat (ex: "Exode 3:4")
- **PASS** : Chapitre Exode 3 se charge dans le player

---

### English (EN)

**Accès** : https://biblechantee.com/lecteur.html?lang=EN

**Test 1 : Mot fréquent**
- Mot : `God`
- **PASS** : > 100 résultats

**Test 2 : Mot discriminant**
- Mot : `Moses`
- **PASS** : 20-500 résultats

**Test 3 : Clic résultat**
- Cliquer sur un résultat
- **PASS** : Chapitre se charge

---

### Português (PT)

**Accès** : https://biblechantee.com/lecteur.html?lang=PT

**Test 1 : Mot fréquent**
- Mot : `Deus`
- **PASS** : > 100 résultats

**Test 2 : Mot discriminant**
- Mot : `Moisés`
- **PASS** : 20-500 résultats

**Test 3 : Clic résultat**
- Cliquer sur un résultat
- **PASS** : Chapitre se charge

---

### Español (ES)

**Accès** : https://biblechantee.com/lecteur.html?lang=ES

**Test 1 : Mot fréquent**
- Mot : `Dios`
- **PASS** : > 100 résultats

**Test 2 : Mot discriminant**
- Mot : `Moisés`
- **PASS** : 20-500 résultats

**Test 3 : Clic résultat**
- Cliquer sur un résultat
- **PASS** : Chapitre se charge

---

## 🔄 SI UN TEST ÉCHOUE

### Option 1 : Bouton "⟳ Rafraîchir" (recommandé mobile)
1. Scroll en bas de page
2. Cliquer "⟳ Rafraîchir" (coin inférieur droit)
3. Confirmer
4. Retester

### Option 2 : Hard Refresh (desktop)
- **PC** : Ctrl+Shift+R
- **Mac** : Cmd+Shift+R
- Retester

### Option 3 : Diagnostic console (debug avancé)
Ouvrir Console (F12), copier/coller :

```javascript
// Test rapide toutes langues
const testAll = () => {
  const tests = [
    { lang: 'FR', word: 'Dieu', rare: 'Moïse' },
    { lang: 'EN', word: 'God', rare: 'Moses' },
    { lang: 'PT', word: 'Deus', rare: 'Moisés' },
    { lang: 'ES', word: 'Dios', rare: 'Moisés' }
  ];

  tests.forEach(t => {
    const ds = getBibleDatasetForLang(t.lang);
    if (!ds) {
      console.log(`❌ ${t.lang}: Dataset NULL (scripts pas chargés)`);
      return;
    }

    let count1 = 0, count2 = 0;
    for (let book in ds) {
      for (let ch in ds[book]) {
        ds[book][ch].forEach(v => {
          const txt = (v.text || '').toLowerCase();
          if (txt.includes(t.word.toLowerCase())) count1++;
          if (txt.includes(t.rare.toLowerCase())) count2++;
        });
      }
    }

    console.log(`${count1 > 100 && count2 > 20 ? '✅' : '❌'} ${t.lang}: "${t.word}" = ${count1}, "${t.rare}" = ${count2}`);
  });
};

testAll();
```

**Résultat attendu** :
```
✅ FR: "Dieu" = 4852, "Moïse" = 847
✅ EN: "God" = 4473, "Moses" = 766
✅ PT: "Deus" = 4123, "Moisés" = 731
✅ ES: "Dios" = 3891, "Moisés" = 698
```

---

## 📋 RAPPORT DE TEST (template)

```
Date: __________
Testeur: __________
Device: __________
Browser: __________

□ FR - Test 1 (Dieu): [ ] PASS [ ] FAIL
□ FR - Test 2 (Moïse): [ ] PASS [ ] FAIL
□ FR - Test 3 (Clic): [ ] PASS [ ] FAIL

□ EN - Test 1 (God): [ ] PASS [ ] FAIL
□ EN - Test 2 (Moses): [ ] PASS [ ] FAIL
□ EN - Test 3 (Clic): [ ] PASS [ ] FAIL

□ PT - Test 1 (Deus): [ ] PASS [ ] FAIL
□ PT - Test 2 (Moisés): [ ] PASS [ ] FAIL
□ PT - Test 3 (Clic): [ ] PASS [ ] FAIL

□ ES - Test 1 (Dios): [ ] PASS [ ] FAIL
□ ES - Test 2 (Moisés): [ ] PASS [ ] FAIL
□ ES - Test 3 (Clic): [ ] PASS [ ] FAIL

Notes:
_______________________________________
_______________________________________

Verdict: [ ] 12/12 VALIDÉ [ ] < 12 PROBLÈME
```

---

## 🎯 INTERPRÉTATION DES RÉSULTATS

| Score | Verdict | Action |
|-------|---------|--------|
| **12/12** | ✅ PARFAIT | Recherche validée toutes langues |
| **9-11/12** | ⚠️ PARTIEL | 1 langue problème → vérifier dataset |
| **< 9/12** | ❌ ÉCHEC | Cache/SW encore actif → hard refresh |

---

## 🔬 DIAGNOSTIC AVANCÉ (si échec persiste)

```javascript
// Vérifier état complet
[
  'URL: ' + location.href,
  'Lang active: ' + (window.getActiveLang ? window.getActiveLang() : 'N/A'),
  'bibleData: ' + typeof window.bibleData,
  'bibleDataEN: ' + typeof window.bibleDataEN,
  'bibleDataPT: ' + typeof window.bibleDataPT,
  'bibleDataES: ' + typeof window.bibleDataES,
  'SW version: ' + (navigator.serviceWorker?.controller?.scriptURL || 'N/A'),
]
```

**Si un `typeof` = "undefined"** :
→ Scripts pas chargés ou SW sert ancienne version
→ Utiliser bouton "⟳ Rafraîchir"

---

## ✅ VALIDATION FINALE

**Recherche est VALIDÉE si** :
- ✅ Tous les tests PASS (12/12)
- ✅ Fonctionne sur 2+ devices (PC + mobile)
- ✅ Pas d'alerte "non disponible"
- ✅ Clics sur résultats chargent chapitres

**Alors et seulement alors** : 🎉 PRODUCTION READY

---

## 📝 POURQUOI CES MOTS TESTS ?

### Mots fréquents (Dieu/God/Deus/Dios)
- **But** : Vérifier que le dataset entier est chargé
- **Attendu** : > 100 résultats (milliers normalement)
- **Si < 100** : Dataset incomplet ou pas chargé

### Mots discriminants (Moïse/Moses/Moisés)
- **But** : Vérifier que la recherche est précise
- **Attendu** : 20-500 résultats (centaines normalement)
- **Si 0** : Problème d'encodage ou matching (accents, etc.)

### Pourquoi pas de nombres exacts ?
Les counts varient selon :
- Version Bible (Segond 1910 vs Louis Segond 21)
- Ponctuation et formatage
- Accents et casse (é vs e, Dieu vs dieu)
- Versets concaténés ou séparés

**Seuil "20 résultats"** = robuste, permet variations, mais détecte vrais bugs.
