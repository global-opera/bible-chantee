# Correctifs de sécurité appliqués

## 🔒 Failles corrigées

### 1. ✅ Normalisation de l'email (CRITIQUE)

**Problème initial** :
```javascript
const { uid, email, ref } = JSON.parse(event.body || "{}");
// email utilisé tel quel → faille
```

**Exploitation possible** :
- Créer plusieurs comptes : `User@test.com`, `user@test.com`, `USER@test.com`
- Contourner la contrainte `email unique` dans Supabase
- Obtenir plusieurs fois des crédits de parrainage

**Correctif appliqué** :
```javascript
email = email.trim().toLowerCase();
```

### 2. ✅ Validation email basique

**Problème initial** :
- Aucune validation du format email
- Possible d'insérer des données invalides

**Correctif appliqué** :
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Email invalide" }) };
}
```

### 3. ✅ Blocage emails jetables (OPTIONNEL)

**Ajouté mais commenté** :
```javascript
const DISPOSABLE_DOMAINS = [
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', ...
];

// À décommenter pour activer :
// const emailDomain = email.split('@')[1];
// if (DISPOSABLE_DOMAINS.includes(emailDomain)) {
//   return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Domaine email non autorisé" }) };
// }
```

## ⚠️ Race condition (non critique, mais à surveiller)

**Situation théorique** :
Si 2 utilisateurs X1 et X2 s'inscrivent **exactement en même temps** avec le même parrain A :

1. X1 → INSERT bc_referrals (réussit)
2. X2 → INSERT bc_referrals (réussit aussi si X1 pas encore committed)
3. A reçoit 2×10 crédits au lieu de 1×10

**Probabilité** : TRÈS FAIBLE en pratique (Supabase utilise PostgreSQL avec isolation de transactions)

**Solution si problème** :
- Utiliser une transaction PostgreSQL explicite
- Ou ajouter un LOCK sur la table bc_referrals

## ✅ Sécurités déjà présentes (bon code)

### Anti-self-referral
```javascript
if (ref && ref !== uid) {
  // OK: empêche de se parrainer soi-même
}
```

### Une seule fois par utilisateur
```javascript
// referred_uid est PRIMARY KEY dans bc_referrals
// → INSERT échoue si déjà présent (pas de double crédit)
const { error: insertRefErr } = await supabase
  .from("bc_referrals")
  .insert({ referred_uid: uid, referrer_uid: ref, awarded_credits: 10 });
```

### Pas d'exposition de la clé Supabase
```javascript
const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ Côté serveur uniquement
```

## 📋 Checklist finale de test

### Test 1 : Normalisation email
- [ ] Inscription avec `User@Test.COM`
- [ ] Tentative réinscription avec `user@test.com`
- [ ] Résultat attendu : **Erreur "email déjà utilisé"**

### Test 2 : Anti-self-referral
- [ ] Utilisateur A génère un lien avec `ref=A`
- [ ] A clique sur son propre lien et s'inscrit
- [ ] Résultat attendu : **Pas de +10 crédits à A**

### Test 3 : Une seule fois
- [ ] X s'inscrit via lien de A → A reçoit +10
- [ ] X réessaie (même uid) → INSERT bc_referrals échoue
- [ ] Résultat attendu : **A ne reçoit PAS un 2e +10**

### Test 4 : Email invalide
- [ ] Inscription avec `notanemail`
- [ ] Résultat attendu : **Erreur "Email invalide"**

### Test 5 : Domaine jetable (si activé)
- [ ] Décommenter les lignes 32-35 dans bc_signup.js
- [ ] Inscription avec `test@guerrillamail.com`
- [ ] Résultat attendu : **Erreur "Domaine email non autorisé"**

## 🚀 Déploiement

```bash
cd "C:\ScriptBible\bible-chantee"
git add netlify/functions/bc_signup.js SECURITY_FIXES.md
git commit -m "Security: email normalization, validation & disposable domain blocking"
git push
```

## 📊 Monitoring recommandé

Après déploiement, surveiller dans Supabase :

```sql
-- Vérifier les inscriptions récentes
SELECT uid, email, credits, created_at
FROM bc_users
ORDER BY created_at DESC
LIMIT 20;

-- Vérifier les parrainages
SELECT *
FROM bc_referrals
ORDER BY created_at DESC
LIMIT 20;

-- Détecter les abus potentiels (même email en majuscules/minuscules)
SELECT email, COUNT(*) as count
FROM bc_users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;
```

Si cette dernière requête retourne des résultats, c'est qu'il y avait des doublons avant le correctif. Nettoyer manuellement :

```sql
-- Supprimer les doublons (garder le plus ancien)
DELETE FROM bc_users
WHERE uid IN (
  SELECT uid FROM (
    SELECT uid, ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY created_at) as rn
    FROM bc_users
  ) t WHERE rn > 1
);
```
