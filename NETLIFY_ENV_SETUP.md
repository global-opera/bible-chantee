# ⚙️ CONFIGURATION NETLIFY - Variables d'environnement

**Date:** 2026-01-01
**Urgence:** Configurer AVANT le prochain build Netlify

---

## 🎯 PROBLÈME RÉSOLU

✅ **Package `stripe` ajouté** dans package.json (v20.1.0)
✅ **Package `@supabase/supabase-js` présent** (v2.45.4)
✅ **Code pushé sur GitHub** (3 commits)

**Prochaine étape:** Configurer les variables Netlify pour que les Functions fonctionnent.

---

## 🔐 VARIABLES À CONFIGURER DANS NETLIFY

### Aller sur Netlify Dashboard

1. **URL:** https://app.netlify.com
2. **Site:** Bible Chantée
3. **Settings → Environment variables**
4. **Add a variable** (répéter pour chaque variable ci-dessous)

---

### ✅ SUPABASE (3 variables)

#### Variable 1: SUPABASE_URL
```
Nom: SUPABASE_URL
Valeur: https://ozkztvstozwdkpsyhgsr.supabase.co
Scopes: All deploys
```

#### Variable 2: SUPABASE_SERVICE_ROLE_KEY
```
Nom: SUPABASE_SERVICE_ROLE_KEY
Valeur: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a3p0dnN0b3p3ZGtwc3loZ3NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2MTQ2NiwiZXhwIjoyMDgxNzM3NDY2fQ.5S7Kc6cWr-17oU_MPs3ASg9dI72sU6ixOGJYnC5Ku7Q
Scopes: All deploys
Note: ⚠️ Secret - pour Netlify Functions uniquement
```

#### Variable 3: SUPABASE_ANON_KEY (optionnel mais recommandé)
```
Nom: SUPABASE_ANON_KEY
Valeur: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a3p0dnN0b3p3ZGtwc3loZ3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjE0NjYsImV4cCI6MjA4MTczNzQ2Nn0.qhNSgqIhR1fOkbnAnyBcMFyuzHIHtn1cvSvE8wdSbMA
Scopes: All deploys
Note: Clé publique, peut être exposée
```

---

### 💳 STRIPE (3 variables)

#### MODE TEST (pour commencer)

#### Variable 4: STRIPE_PUBLISHABLE_KEY
```
Nom: STRIPE_PUBLISHABLE_KEY
Valeur: pk_test_VOTRE_CLE_TEST_ICI
Scopes: All deploys
Note: Obtenir sur https://dashboard.stripe.com/test/apikeys
```

#### Variable 5: STRIPE_SECRET_KEY
```
Nom: STRIPE_SECRET_KEY
Valeur: sk_test_VOTRE_CLE_TEST_ICI
Scopes: All deploys
Note: ⚠️ Secret - NE PAS exposer
```

#### Variable 6: STRIPE_WEBHOOK_SECRET
```
Nom: STRIPE_WEBHOOK_SECRET
Valeur: whsec_SERA_CONFIGURE_APRES_WEBHOOK
Scopes: All deploys
Note: À obtenir après création du webhook Stripe
```

---

## 📋 FONCTIONS NETLIFY UTILISANT CES VARIABLES

| Function | Variables requises |
|----------|-------------------|
| `bc_signup.js` | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| `bc_me.js` | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| `create-checkout-session.js` | STRIPE_SECRET_KEY |
| `stripe-webhook.js` | STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| `recover-premium.js` | STRIPE_SECRET_KEY |
| `premium-claim.js` | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| `premium-status.js` | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |

---

## 🚀 ORDRE DE CONFIGURATION

### Étape 1: Configurer Supabase (MAINTENANT)
```
✅ SUPABASE_URL
✅ SUPABASE_SERVICE_ROLE_KEY
✅ SUPABASE_ANON_KEY
```

### Étape 2: Configurer Stripe TEST
```
✅ STRIPE_PUBLISHABLE_KEY=pk_test_...
✅ STRIPE_SECRET_KEY=sk_test_...
⏳ STRIPE_WEBHOOK_SECRET (après création webhook)
```

### Étape 3: Créer webhook Stripe
1. https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://biblechantee.com/.netlify/functions/stripe-webhook`
3. Events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copier signing secret → `STRIPE_WEBHOOK_SECRET`

### Étape 4: Redéployer Netlify
Après ajout des variables:
- Netlify redéploie automatiquement OU
- Deploys → Trigger deploy

---

## ✅ VÉRIFICATION

### Variables Supabase configurées ?
```bash
# Tester depuis votre machine locale
node -e "require('dotenv').config(); console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅' : '❌')"
```

### Build Netlify réussi ?
**Aller sur:** Netlify Dashboard → Deploys → Latest deploy

**Vérifier:**
- ✅ Status: Published
- ✅ Pas d'erreur "stripe package not found"
- ✅ Functions déployées (11 functions)

### Tester une function
```bash
# Test bc_signup
curl -X POST https://biblechantee.com/.netlify/functions/bc_signup \
  -H "Content-Type: application/json" \
  -d '{"uid":"test_123","email":"test@example.com"}'
```

**Attendu:** `{"ok":true,"awarded":false,"me":{...}}`

---

## 🔄 SI LE BUILD ÉCHOUE ENCORE

### Erreur: "stripe package not found"
**Cause:** Variables pas encore prises en compte

**Solution:**
1. Vérifier que les 6 variables sont bien configurées
2. Trigger un nouveau deploy:
   - Netlify Dashboard → Deploys → Trigger deploy → Deploy site
3. Attendre 2-3 minutes

### Erreur: "Missing Supabase env vars"
**Cause:** Variables mal nommées

**Solution:**
- Vérifier EXACTEMENT les noms:
  - `SUPABASE_URL` (pas SUPABASE_URI)
  - `SUPABASE_SERVICE_ROLE_KEY` (pas SUPABASE_KEY)

### Erreur dans les Functions logs
**Aller sur:** Netlify Dashboard → Functions → Sélectionner function → Logs

**Vérifier:**
- Variables accessibles: `console.log(process.env.SUPABASE_URL)`
- Connexion Supabase réussie

---

## 📊 APRÈS CONFIGURATION

### Fonctionnalités activées

✅ **Popup email** → Sauvegarde dans Supabase
✅ **Système de crédits** → 100 crédits gratuits
✅ **Upgrade premium** → Stripe Checkout $0.99
✅ **Webhook Stripe** → Activation auto premium
✅ **Récupération premium** → Via email

### Tester le flow complet

1. **Inscription:** https://biblechantee.com/promesse-detail.html?theme=0
   - Entrer email → ✅ Sauvegardé Supabase

2. **Vérifier Supabase:**
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
   ```

3. **Upgrade premium:**
   - Console: `premiumSystem.showUpgradeModal()`
   - Payer avec carte test: `4242 4242 4242 4242`

4. **Vérifier activation:**
   ```sql
   SELECT * FROM users WHERE is_premium = true;
   ```

---

## 🎯 CHECKLIST FINALE

- [ ] ✅ 3 variables Supabase configurées
- [ ] ✅ 3 variables Stripe configurées (TEST d'abord)
- [ ] ✅ Build Netlify réussi
- [ ] ✅ 11 Functions déployées
- [ ] ✅ Test bc_signup fonctionne
- [ ] ✅ Popup email sauvegarde dans Supabase
- [ ] ⏳ Webhook Stripe à créer
- [ ] ⏳ Tests complets (voir DEPLOY_CHECKLIST.md)

---

## 📞 SUPPORT

**Documentation complète:** `STRIPE_INTEGRATION_COMPLETE.md`
**Guide déploiement:** `DEPLOY_CHECKLIST.md`
**Variables:** `NETLIFY_VARIABLES.txt`

**Logs Netlify:** https://app.netlify.com → Votre site → Deploys/Functions
**Stripe Dashboard:** https://dashboard.stripe.com
**Supabase Dashboard:** https://supabase.com/dashboard

---

**Temps estimé:** 10 minutes
**Prochaine étape:** Configurer les 6 variables dans Netlify Dashboard
