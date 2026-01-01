# ✅ CHECKLIST DÉPLOIEMENT - Bible Chantée Premium

**Commit:** `b74c3f2a` - feat: Intégration complète Stripe + Supabase freemium
**Date:** 2026-01-01
**Fichiers modifiés:** 7 fichiers, +1274 lignes, -105 lignes

---

## 📦 CE QUI A ÉTÉ FAIT

### ✅ Code créé/modifié
- ✅ 2 Netlify Functions (create-checkout-session, stripe-webhook)
- ✅ 1 système premium frontend (premium-system.js)
- ✅ 1 schéma SQL complet (supabase-schema-complete.sql)
- ✅ Popup email connecté backend (promesse-detail.html)
- ✅ Page success après paiement (success.html)
- ✅ Guide complet (STRIPE_INTEGRATION_COMPLETE.md)

---

## 🚀 DÉPLOIEMENT (30 min)

### ÉTAPE 1: Variables Netlify (5 min)

**Aller sur:** https://app.netlify.com → Votre site → Site settings → Environment variables

**Ajouter ces 6 variables:**

```bash
SUPABASE_URL=https://ozkztvstozwdkpsyhgsr.supabase.co

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a3p0dnN0b3p3ZGtwc3loZ3NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2MTQ2NiwiZXhwIjoyMDgxNzM3NDY2fQ.5S7Kc6cWr-17oU_MPs3ASg9dI72sU6ixOGJYnC5Ku7Q

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a3p0dnN0b3p3ZGtwc3loZ3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjE0NjYsImV4cCI6MjA4MTczNzQ2Nn0.qhNSgqIhR1fOkbnAnyBcMFyuzHIHtn1cvSvE8wdSbMA

STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_TEST_ICI

STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_TEST_ICI

STRIPE_WEBHOOK_SECRET=whsec_SERA_AJOUTE_ETAPE_3
```

**⚠️ POUR TESTER:** Utilisez les clés **TEST** de Stripe d'abord (pk_test_ et sk_test_)

---

### ÉTAPE 2: SQL Supabase (5 min)

1. **Ouvrir:** https://supabase.com/dashboard
2. **Projet:** sungbible-credits
3. **Aller dans:** SQL Editor (menu gauche)
4. **New query**
5. **Copier-coller** le contenu de `supabase-schema-complete.sql`
6. **Cliquer:** Run
7. **Vérifier:** Message "Schema creation completed!" + stats

---

### ÉTAPE 3: Webhook Stripe (10 min)

1. **Ouvrir:** https://dashboard.stripe.com/test/webhooks
2. **Cliquer:** Add endpoint
3. **Endpoint URL:** `https://biblechantee.com/.netlify/functions/stripe-webhook`
4. **Select events:**
   - ✅ checkout.session.completed
   - ✅ payment_intent.succeeded
   - ✅ payment_intent.payment_failed
5. **Add endpoint**
6. **Cliquer** sur le webhook créé
7. **Copier** le Signing secret (commence par `whsec_...`)
8. **Ajouter** dans Netlify: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

### ÉTAPE 4: Déployer sur Netlify (2 min)

```bash
git push origin prod
```

**Attendre le déploiement** (1-2 minutes)

---

### ÉTAPE 5: Tests (8 min)

#### Test 1: Popup email (2 min)
1. Ouvrir https://biblechantee.com/promesse-detail.html?theme=0
2. Entrer email: `test@example.com`
3. ✅ Modal se ferme
4. ✅ Console: "✅ Utilisateur inscrit"

#### Test 2: Vérifier Supabase (1 min)
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```
✅ Ligne existe avec `is_premium = false`

#### Test 3: Modal premium (1 min)
1. Console: `premiumSystem.showUpgradeModal()`
2. ✅ Modal s'affiche
3. Cliquer "Payer avec Stripe"

#### Test 4: Paiement test (2 min)
1. ✅ Page Stripe s'ouvre
2. Carte test: `4242 4242 4242 4242`
3. Date: `12/34`, CVC: `123`
4. ✅ Redirection vers success.html

#### Test 5: Vérifier premium activé (2 min)
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```
✅ `is_premium = true`

**Netlify Functions logs:**
✅ Voir "Premium activation completed"

---

## 🎯 PASSER EN PRODUCTION

Une fois les tests OK en mode TEST:

### 1. Remplacer les clés Stripe TEST → LIVE

**Netlify variables:**
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_51SgqwB2Mkne8EGh4hVJOyOhjNspBLAEsLdXoVF4aPLw8o7X3g4b8HdPUczy1BGQ6zwkGF3ALhULURjvtUZaFqmGv00aQ5ppVRC

STRIPE_SECRET_KEY=sk_live_VOTRE_VRAIE_CLE_ICI
```

### 2. Créer le webhook LIVE

1. https://dashboard.stripe.com/webhooks (pas /test)
2. Même config que TEST
3. Copier nouveau `STRIPE_WEBHOOK_SECRET`
4. Remplacer dans Netlify

### 3. Faire 1 test réel

1. Utiliser vraie carte
2. Payer $0.99
3. Vérifier activation premium
4. **Important:** Remboursement immédiat dans Stripe si c'est juste un test

---

## 📊 MONITORING

### Logs Netlify Functions
https://app.netlify.com → Functions → stripe-webhook
✅ Voir les webhooks en temps réel

### Stripe Dashboard
https://dashboard.stripe.com/payments
✅ Voir tous les paiements

### Supabase
```sql
-- Stats temps réel
SELECT * FROM admin_stats;

-- Derniers paiements
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;

-- Nouveaux premium
SELECT email, created_at FROM users WHERE is_premium = true ORDER BY created_at DESC;
```

---

## 🐛 SI PROBLÈME

### Webhook ne marche pas
1. Vérifier URL: `https://biblechantee.com/.netlify/functions/stripe-webhook`
2. Tester dans Stripe: "Send test webhook"
3. Vérifier logs Netlify Functions

### Premium pas activé
1. Attendre 10 secondes
2. Actualiser page
3. Console: `premiumSystem.checkPremiumStatus()`
4. Vérifier Supabase manuellement

### Email pas sauvegardé
1. Console: voir erreurs
2. Vérifier variables Netlify (SUPABASE_*)
3. Tester: `fetch('/.netlify/functions/bc_signup', {method:'POST', body:JSON.stringify({uid:'test',email:'test@test.com'})})`

---

## 📁 FICHIERS IMPORTANTS

| Fichier | Description |
|---------|-------------|
| `STRIPE_INTEGRATION_COMPLETE.md` | Guide complet avec 8 tests détaillés |
| `supabase-schema-complete.sql` | Schéma à exécuter dans Supabase |
| `netlify/functions/create-checkout-session.js` | Crée session Stripe |
| `netlify/functions/stripe-webhook.js` | Active premium après paiement |
| `js/premium-system.js` | Système frontend |

---

## ✅ VALIDATION FINALE

- [ ] Variables Netlify configurées (6 variables)
- [ ] SQL Supabase exécuté
- [ ] Webhook Stripe créé (TEST)
- [ ] Tests passés (5 tests)
- [ ] Logs Netlify OK
- [ ] Supabase users table OK
- [ ] **Prêt pour LIVE**

---

**Temps total:** ~30 minutes
**Difficulté:** Facile (suivre étape par étape)
**Support:** Voir `STRIPE_INTEGRATION_COMPLETE.md` pour dépannage détaillé
