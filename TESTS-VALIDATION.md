# 🧪 PROTOCOLE DE VALIDATION - Popup Anti-Spam

**Objectif** : Valider que le fix est effectif en production sur tous les devices

---

## ✅ Tests côté utilisateur (4 tests critiques)

### Test 1 : Anti-spam (CRITIQUE)

**Scénario** : Épuiser crédits et cliquer 20x

```bash
1. Ouvrir https://biblechantee.com/app/fr/
2. Épuiser les 3 écoutes gratuites (ou cliquer 10 livres si déjà épuisé)
3. Cliquer sur 5 livres différents rapidement
4. Observer combien de fois le popup apparaît

✅ SUCCÈS : Popup apparaît 1 SEULE fois
❌ ÉCHEC  : Popup apparaît 2x ou plus = SPAM

5. Fermer le popup (X ou Escape ou clic extérieur)
6. Cliquer sur 10 autres livres

✅ SUCCÈS : Aucun popup ne réapparaît
❌ ÉCHEC  : Popup revient = SPAM
```

**Critère objectif** : 1 popup max, même en cliquant 20 fois

---

### Test 2 : Badge volontaire (IMPORTANT)

**Scénario** : Badge doit toujours ouvrir le popup

```bash
1. Après avoir fermé le popup (test 1)
2. Cliquer sur le badge "🎵 X credits" (coin supérieur droit)

✅ SUCCÈS : Popup s'ouvre immédiatement
❌ ÉCHEC  : Rien ne se passe

3. Fermer le popup
4. Recliquer sur le badge

✅ SUCCÈS : Popup s'ouvre à nouveau (volontaire = pas de cooldown)
❌ ÉCHEC  : Badge ne répond plus
```

**Critère objectif** : Badge = point d'entrée permanent

---

### Test 3 : UI débloquée (CRITIQUE mobile)

**Scénario** : Vérifier que l'overlay ne bloque plus l'UI

```bash
1. Ouvrir un chapitre (Genèse 1 = gratuit)
2. Player s'affiche en bas de page
3. Déclencher le popup (cliquer livre payant)
4. Fermer le popup

5. Tester le menu "..." du player
✅ SUCCÈS : Menu s'ouvre normalement
❌ ÉCHEC  : Menu ne s'ouvre pas = overlay bloque encore

6. Scroll la page vers le haut et le bas
✅ SUCCÈS : Scroll fonctionne
❌ ÉCHEC  : Scroll bloqué = body overflow non restauré

7. Cliquer play/pause sur le player
✅ SUCCÈS : Boutons répondent
❌ ÉCHEC  : Boutons morts = UI bloquée
```

**Critère objectif** : Tous les contrôles fonctionnels après fermeture

---

### Test 4 : Persistance session

**Scénario** : Popup ne revient pas après refresh

```bash
1. Fermer le popup (test 1)
2. Recharger la page (F5 / swipe down refresh)
3. Cliquer sur 5 livres

✅ SUCCÈS : Popup ne revient pas (session preserved)
❌ ÉCHEC  : Popup revient = sessionStorage perdu

Note: Si sessionStorage.clear() → popup peut revenir (normal)
```

**Critère objectif** : Session persiste au refresh

---

## 🔒 Tests cache/déploiement (2 tests validation)

### Test 5 : Navigation privée

**Objectif** : Éliminer les faux positifs (cache local)

```bash
1. Ouvrir en navigation privée :
   - Chrome: Ctrl+Shift+N
   - Safari: Cmd+Shift+N
   - Firefox: Ctrl+Shift+P

2. Aller sur https://biblechantee.com/app/fr/

3. Refaire tests 1-3 (anti-spam + badge + UI)

✅ SUCCÈS : Comportement identique à navigation normale
❌ ÉCHEC  : Comportement différent = cache/service worker problème
```

**Critère objectif** : Privé = Normal (prouve que c'est déployé)

---

### Test 6 : Multi-devices

**Objectif** : Valider que le fix fonctionne partout

```bash
Tester sur 2-3 devices minimum :
□ iPhone (Safari)
□ Android (Chrome)
□ PC Desktop (Chrome/Firefox)

Sur chaque device :
1. Navigation privée
2. Test 1 (anti-spam)
3. Test 3 (UI débloquée)

✅ SUCCÈS : Comportement identique sur tous
❌ ÉCHEC  : Différences = problème spécifique device
```

**Critère objectif** : Cohérence cross-device

---

## 🔬 Test technique (preuve objective console)

### Test 7 : Vérifier sessionStorage

**Objectif** : Prouver que les flags sont bien posés

```bash
1. Ouvrir DevTools Console (F12)
2. Déclencher le popup (cliquer livre payant)
3. Dans console, taper :

sessionStorage.getItem('bc_paywall_shown')

✅ SUCCÈS : Retourne "1"
❌ ÉCHEC  : Retourne null = flag non posé

4. Taper aussi :

sessionStorage.getItem('bc_paywall_last')

✅ SUCCÈS : Retourne un timestamp (ex: "1735000000000")
❌ ÉCHEC  : Retourne null = cooldown non actif

5. Fermer le popup
6. Recliquer un livre
7. Re-vérifier dans console :

✅ SUCCÈS : Les valeurs restent (popup ne réapparaît pas)
❌ ÉCHEC  : Popup revient = guard non respecté
```

**Preuve technique** : sessionStorage prouve que le code tourne

---

## 🎯 Critères de validation finale

**Le fix est validé SI et SEULEMENT SI :**

| Test | Critère | Status |
|------|---------|--------|
| 1. Anti-spam | 1 popup max/session | [ ] |
| 2. Badge | Toujours ouvre | [ ] |
| 3. UI | "..." + scroll OK | [ ] |
| 4. Session | Persiste au refresh | [ ] |
| 5. Privé | Identique à normal | [ ] |
| 6. Multi-device | Cohérent partout | [ ] |
| 7. Console | sessionStorage OK | [ ] |

**Verdict** :
- ✅ **7/7** = Production validée
- ⚠️ **5-6/7** = Quasi OK, ajustements mineurs
- ❌ **<5/7** = Problème majeur, investigation requise

---

## 📝 Rapport de test (template)

```
Date: _________
Testeur: _________
Device: _________
Browser: _________

Test 1 (anti-spam): [ ] PASS [ ] FAIL
Test 2 (badge): [ ] PASS [ ] FAIL
Test 3 (UI): [ ] PASS [ ] FAIL
Test 4 (session): [ ] PASS [ ] FAIL
Test 5 (privé): [ ] PASS [ ] FAIL
Test 6 (multi-device): [ ] PASS [ ] FAIL
Test 7 (console): [ ] PASS [ ] FAIL

Notes:
___________________________________
___________________________________
___________________________________

Verdict final: [ ] VALIDÉ [ ] REJETÉ
```

---

## 🚨 Si un test échoue

**Test 1 échoue (spam persiste)** :
→ Vérifier que credits-system.js est bien déployé
→ `curl https://biblechantee.com/credits-system.js | grep bc_paywall_shown`
→ Si absent = déploiement incomplet

**Test 3 échoue (UI bloquée)** :
→ Vérifier dans console : `document.body.style.overflow`
→ Si = "hidden" = hidePurchaseModal() pas appelé correctement

**Test 5 échoue (privé ≠ normal)** :
→ Cache browser ou service worker
→ Clear cache : Ctrl+Shift+Delete
→ Unregister SW : DevTools > Application > Service Workers > Unregister

**Test 7 échoue (sessionStorage null)** :
→ Code pas exécuté OU ancien code encore actif
→ Hard refresh : Ctrl+Shift+R (PC) / Cmd+Shift+R (Mac)

---

## ✅ Validation finale

**Ce document sert de preuve objective.**

Une fois tous les tests passés, prendre des screenshots :
1. Console avec sessionStorage non-null
2. Popup fermé + menu "..." ouvert
3. Multi-device screenshots

**Alors et seulement alors : VALIDÉ EN PRODUCTION** ✅
