# Plan de test du système de parrainage

## 🎯 Objectif

Vérifier que le système de parrainage fonctionne correctement et sans faille de sécurité.

## ⚙️ Prérequis

1. ✅ Tables Supabase créées (bc_users, bc_referrals, bc_add_credits function)
2. ✅ Variables Netlify configurées (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
3. ✅ Site déployé sur Netlify
4. ✅ `npm install` exécuté

## 📝 Tests à effectuer

### Test 1 : Vérifier que les functions sont accessibles

**Ouvrir dans le navigateur** :
```
https://votresite.com/.netlify/functions/bc_me?uid=test123
```

**Résultat attendu** :
```json
{
  "ok": true,
  "me": {
    "uid": "test123",
    "credits": 0
  }
}
```

Si erreur 404 → Les functions ne sont pas détectées par Netlify
Si erreur 500 → Vérifier les variables d'environnement Supabase

---

### Test 2 : Flux complet de parrainage (navigateurs séparés)

#### Étape 1 : Navigateur A (normal)
1. Ouvrir `https://votresite.com/lecteur.html?lang=FR`
2. Cliquer sur un livre (ex: Genèse)
3. Le lecteur s'ouvre
4. Cliquer sur **"Partager (+10 crédits)"**
5. Copier le lien généré (ex: `https://votresite.com/lecteur.html?book=01&chapter=1&lang=FR&ref=u_xyz123`)

**Vérifier** : Le lien contient bien `&ref=u_xyz123` (votre uid)

#### Étape 2 : Navigateur X (mode incognito / privé)
1. Coller le lien copié à l'étape 1
2. Le morceau doit s'ouvrir directement (Genèse chapitre 1)
3. Cliquer sur **"S'inscrire"**
4. Entrer un email : `test-x@example.com`
5. Cliquer "S'inscrire"

**Résultat attendu** :
```
✅ Inscription OK. Parrain crédité (+10).
```

Puis redirection automatique vers le lecteur.

#### Étape 3 : Vérification dans Supabase
1. Ouvrir Supabase → Table Editor → bc_users
2. Trouver l'utilisateur A (uid = `u_xyz123`)
3. **Vérifier** : `credits = 10` ✅

4. Ouvrir bc_referrals
5. **Vérifier** :
   - `referred_uid` = uid de X
   - `referrer_uid` = uid de A (`u_xyz123`)
   - `awarded_credits` = 10 ✅

---

### Test 3 : Anti-self-referral (pas de triche)

#### Navigateur A (même utilisateur)
1. Cliquer "Partager" → copier le lien (avec `ref=A`)
2. Ouvrir ce lien dans un nouvel onglet (même navigateur)
3. Cliquer "S'inscrire"
4. Entrer email : `self-ref@example.com`
5. S'inscrire

**Résultat attendu** :
```
✅ Inscription OK. (SANS "Parrain crédité")
```

**Vérification Supabase** :
- bc_users → Aucun crédit ajouté à A
- bc_referrals → Aucune entrée pour ce parrainage ✅

---

### Test 4 : Une seule fois (pas de double crédit)

#### Navigateur X (déjà inscrit au Test 2)
1. Recharger la page d'inscription avec le même lien de parrainage
2. Essayer de s'inscrire à nouveau avec le même email `test-x@example.com`

**Résultat attendu** :
- Erreur Supabase "duplicate key" (email unique)
OU
- Si réinscrit avec un autre email mais même uid → bc_referrals reject (referred_uid déjà présent)

**Vérification** : A ne reçoit PAS un 2e +10 crédits ✅

---

### Test 5 : Normalisation email (sécurité)

#### Navigateur Y (nouveau)
1. S'inscrire avec `User@Test.COM`
2. **Vérifier Supabase** : Email enregistré comme `user@test.com` (minuscules)

#### Navigateur Z (nouveau)
3. Essayer de s'inscrire avec `user@test.com`

**Résultat attendu** :
- Erreur "duplicate key" (email déjà utilisé) ✅

**Preuve** : La normalisation fonctionne, impossible de créer 2 comptes avec MAJ/minuscules différentes.

---

### Test 6 : Validation email

Essayer de s'inscrire avec :
- ❌ `notanemail` → **Erreur "Email invalide"**
- ❌ `test@` → **Erreur "Email invalide"**
- ❌ `@example.com` → **Erreur "Email invalide"**
- ✅ `valid@example.com` → **OK**

---

### Test 7 : Domaines jetables (si activé)

**Activer le blocage** :
1. Ouvrir `netlify/functions/bc_signup.js`
2. Décommenter les lignes 32-35 :
```javascript
const emailDomain = email.split('@')[1];
if (DISPOSABLE_DOMAINS.includes(emailDomain)) {
  return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Domaine email non autorisé" }) };
}
```
3. Redéployer : `git add . && git commit -m "Enable disposable email blocking" && git push`

**Tester** :
- ❌ `test@guerrillamail.com` → **Erreur "Domaine email non autorisé"**
- ❌ `abuse@10minutemail.com` → **Erreur "Domaine email non autorisé"**
- ✅ `valid@gmail.com` → **OK**

---

## 🐛 Debugging

### Fonction ne répond pas (404)
```bash
# Vérifier la structure
ls -la netlify/functions/bc_signup.js
ls -la netlify/functions/bc_me.js

# Vérifier netlify.toml
cat netlify.toml
# Doit contenir: functions = "netlify/functions"
```

### Erreur 500 sur bc_signup
**Ouvrir Netlify** → Functions → bc_signup → View logs

**Erreurs courantes** :
- `Missing Supabase env vars` → Configurer SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans Netlify
- `relation "bc_users" does not exist` → Créer les tables SQL dans Supabase
- `function bc_add_credits does not exist` → Créer la fonction RPC dans Supabase

### Crédits non ajoutés
**Vérifier dans Supabase** → SQL Editor :
```sql
-- Voir tous les parrainages
SELECT * FROM bc_referrals ORDER BY created_at DESC;

-- Voir les crédits des utilisateurs
SELECT uid, email, credits FROM bc_users ORDER BY created_at DESC;
```

---

## ✅ Checklist finale

- [ ] Test 1 : Functions accessibles (bc_me retourne JSON)
- [ ] Test 2 : Flux complet A → X → +10 crédits à A
- [ ] Test 3 : Anti-self-referral (A ne peut pas se parrainer)
- [ ] Test 4 : Une seule fois (X ne peut parrainer A qu'une fois)
- [ ] Test 5 : Normalisation email (USER@test.com = user@test.com)
- [ ] Test 6 : Validation email (rejet des formats invalides)
- [ ] Test 7 : Domaines jetables bloqués (si activé)

## 📊 Monitoring continu

**Requêtes SQL utiles** :

```sql
-- Top parrains
SELECT referrer_uid, COUNT(*) as nb_parrainages, SUM(awarded_credits) as total_credits
FROM bc_referrals
GROUP BY referrer_uid
ORDER BY nb_parrainages DESC
LIMIT 10;

-- Inscriptions récentes
SELECT uid, email, credits, created_at
FROM bc_users
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Détecter des abus (trop de parrainages en peu de temps)
SELECT referrer_uid, COUNT(*) as parrainages,
       MAX(created_at) - MIN(created_at) as time_span
FROM bc_referrals
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY referrer_uid
HAVING COUNT(*) > 5;
```

---

**Si tous les tests passent** ✅ → Le système est sécurisé et opérationnel !
