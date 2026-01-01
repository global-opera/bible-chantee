# 🎯 INTÉGRATION STRIPE + SUPABASE - GUIDE COMPLET

**Date:** 2026-01-01
**Version:** 1.0
**Objectif:** Système freemium avec essai 7 jours + upgrade premium $0.99

---

## 📦 FICHIERS CRÉÉS/MODIFIÉS

### ✅ Nouveaux fichiers

1. **`netlify/functions/create-checkout-session.js`**
   Crée une session Stripe Checkout

2. **`netlify/functions/stripe-webhook.js`**
   Reçoit les webhooks Stripe et active le premium dans Supabase

3. **`js/premium-system.js`**
   Système frontend pour gérer l'upgrade premium

4. **`success.html`**
   Page de confirmation après paiement

5. **`supabase-schema-complete.sql`**
   Schéma SQL complet avec tables users, transactions, bc_referrals

### ✏️ Fichiers modifiés

1. **`promesse-detail.html`** (lignes 780-832)
   Popup email maintenant connecté au backend via `bc_signup`

---

## 🔐 VARIABLES D'ENVIRONNEMENT NETLIFY

### Configuration dans Netlify Dashboard

**Aller dans:** Site Settings → Environment Variables → Add variable

```bash
# ============================================
# SUPABASE
# ============================================

SUPABASE_URL=https://ozkztvstozwdkpsyhgsr.supabase.co

# Clé Service Role (BACKEND UNIQUEMENT - Netlify Functions)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a3p0dnN0b3p3ZGtwc3loZ3NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2MTQ2NiwiZXhwIjoyMDgxNzM3NDY2fQ.5S7Kc6cWr-17oU_MPs3ASg9dI72sU6ixOGJYnC5Ku7Q

# Clé Anon (peut être exposée publiquement)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a3p0dnN0b3p3ZGtwc3loZ3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjE0NjYsImV4cCI6MjA4MTczNzQ2Nn0.qhNSgqIhR1fOkbnAnyBcMFyuzHIHtn1cvSvE8wdSbMA

# ============================================
# STRIPE
# ============================================

# Clé publique (peut être exposée frontend)
STRIPE_PUBLISHABLE_KEY=pk_live_51SgqwB2Mkne8EGh4hVJOyOhjNspBLAEsLdXoVF4aPLw8o7X3g4b8HdPUczy1BGQ6zwkGF3ALhULURjvtUZaFqmGv00aQ5ppVRC

# Clé secrète (BACKEND UNIQUEMENT)
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_ICI

# Webhook signing secret (à obtenir après création du webhook)
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_ICI
```

**⚠️ ATTENTION:** Remplacez `STRIPE_SECRET_KEY` par votre vraie clé secrète Stripe (commence par `sk_live_` ou `sk_test_`).

---

## 🗄️ SQL SUPABASE

### Étape 1: Exécuter le schéma complet

1. Ouvrir Supabase Dashboard: https://supabase.com/dashboard
2. Sélectionner le projet `sungbible-credits`
3. Aller dans **SQL Editor**
4. Copier-coller le contenu de `supabase-schema-complete.sql`
5. Cliquer sur **Run**

### Étape 2: Vérifier les tables

```sql
-- Vérifier que les tables sont créées
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Doit afficher:
-- - users
-- - transactions
-- - bc_referrals
```

### Étape 3: Vérifier les policies RLS

```sql
-- Lister les policies
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

---

## 🔗 CONFIGURATION STRIPE WEBHOOK

### Étape 1: Créer le webhook dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer sur **Add endpoint**
3. **Endpoint URL:** `https://biblechantee.com/.netlify/functions/stripe-webhook`
4. **Events to send:**
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Cliquer sur **Add endpoint**

### Étape 2: Copier le signing secret

1. Cliquer sur le webhook créé
2. Dans la section **Signing secret**, cliquer sur **Reveal**
3. Copier la valeur (commence par `whsec_...`)
4. Ajouter dans Netlify: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 🧪 PLAN DE TEST COMPLET

### TEST 1: Inscription email (popup)

**Objectif:** Vérifier que l'email est sauvegardé dans Supabase

#### Actions:
1. Ouvrir https://biblechantee.com/promesse-detail.html?theme=0&lang=FR
2. Entrer un email de test: `test-stripe@example.com`
3. Cliquer sur "Accéder gratuitement"

#### Vérifications:
- ✅ Modal se ferme
- ✅ Contenu s'affiche
- ✅ Console: `✅ Utilisateur inscrit: {...}`
- ✅ localStorage: `bc_trial_email` et `bc_user` contiennent les données

#### Vérification Supabase:
```sql
SELECT * FROM users WHERE email = 'test-stripe@example.com';
```
**Attendu:**
- ✅ Ligne existe
- ✅ `uid` commence par `uid_`
- ✅ `email` = 'test-stripe@example.com'
- ✅ `credits` = 100
- ✅ `is_premium` = false

---

### TEST 2: Modal Premium

**Objectif:** Afficher le modal d'upgrade

#### Actions:
1. Ouvrir la console navigateur
2. Taper: `premiumSystem.showUpgradeModal()`
3. Appuyer sur Entrée

#### Vérifications:
- ✅ Modal s'affiche avec:
  - Titre "Passez Premium"
  - Prix "$0.99"
  - Bouton "💳 Payer avec Stripe"
  - Liste des bénéfices

---

### TEST 3: Créer une session Stripe (Mode Test)

**Objectif:** Vérifier que la fonction Netlify fonctionne

#### Prérequis:
- Utiliser les clés TEST de Stripe (`pk_test_...` et `sk_test_...`)

#### Actions:
1. Dans le modal premium, cliquer sur "Payer avec Stripe"
2. Observer la redirection vers Stripe Checkout

#### Vérifications:
- ✅ Console: `✅ Redirecting to Stripe Checkout...`
- ✅ Page Stripe s'ouvre
- ✅ Email pré-rempli avec votre email
- ✅ Montant = $0.99
- ✅ Description = "Bible Chantée - Accès Premium"

#### Vérification technique:
Ouvrir Network tab → chercher requête vers `create-checkout-session`:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

### TEST 4: Paiement test Stripe

**Objectif:** Simuler un paiement réussi

#### Actions:
1. Sur la page Stripe Checkout
2. Utiliser la carte test: `4242 4242 4242 4242`
3. Date: n'importe quelle date future (ex: 12/34)
4. CVC: n'importe quel 3 chiffres (ex: 123)
5. Cliquer sur "Payer"

#### Vérifications:
- ✅ Redirection vers `https://biblechantee.com/success.html?session_id=cs_test_...`
- ✅ Page success affiche "Paiement Réussi !"
- ✅ Message "Activation de votre compte premium..."

---

### TEST 5: Webhook Stripe → Supabase

**Objectif:** Vérifier que le webhook active le premium

#### Vérifications automatiques:

**1. Logs Netlify Functions:**
- Aller sur Netlify Dashboard → Functions → stripe-webhook
- Vérifier les logs:
  ```
  📥 Stripe event received: checkout.session.completed
  🎉 Checkout completed for session: cs_test_...
  📝 Updating existing user: uid_...
  ✅ User upgraded to premium
  ✅ Premium activation completed for uid: uid_...
  ```

**2. Supabase:**
```sql
-- Vérifier que le user est premium
SELECT uid, email, is_premium, stripe_customer_id
FROM users
WHERE email = 'test-stripe@example.com';
```
**Attendu:**
- ✅ `is_premium` = true
- ✅ `stripe_customer_id` = 'cus_...' (ID Stripe)

**3. Transactions loggées:**
```sql
SELECT * FROM transactions
WHERE user_uid = (SELECT uid FROM users WHERE email = 'test-stripe@example.com');
```
**Attendu:**
- ✅ Ligne existe
- ✅ `type` = 'purchase'
- ✅ `amount` = 99 (cents)
- ✅ `stripe_session_id` commence par 'cs_'

---

### TEST 6: Vérification frontend du statut premium

**Objectif:** Vérifier que le frontend détecte le premium

#### Actions:
1. Sur la page success.html, attendre 3 secondes
2. Observer le message de statut
3. Ouvrir la console navigateur

#### Vérifications:
- ✅ Console: `💎 Premium status: PREMIUM`
- ✅ Message: "✅ Votre compte premium est activé !"
- ✅ localStorage: `bc_user.is_premium` = true
- ✅ Redirection automatique vers /lecteur.html après 2 secondes

---

### TEST 7: Accès premium persistant

**Objectif:** Vérifier que le premium persiste entre les sessions

#### Actions:
1. Fermer le navigateur complètement
2. Rouvrir https://biblechantee.com/lecteur.html
3. Ouvrir la console

#### Vérifications:
- ✅ Console: `💎 Premium status: PREMIUM`
- ✅ Pas de paywall
- ✅ Accès à tout le contenu

---

### TEST 8: Bloquer un double paiement

**Objectif:** Vérifier qu'on ne peut pas payer 2x

#### Actions:
1. Étant connecté en premium
2. Taper dans console: `premiumSystem.showUpgradeModal()`

#### Vérifications:
- ✅ Alert: "Vous êtes déjà premium ! 🎉"
- ✅ Pas de modal affiché

---

## 🐛 DÉPANNAGE

### Problème 1: "Webhook signature verification failed"

**Cause:** `STRIPE_WEBHOOK_SECRET` incorrect ou manquant

**Solution:**
1. Vérifier dans Netlify que la variable existe
2. Dans Stripe Dashboard → Webhooks → cliquer sur l'endpoint
3. Re-copier le signing secret
4. Redéployer sur Netlify

---

### Problème 2: "Missing Supabase env vars"

**Cause:** Variables Supabase non configurées dans Netlify

**Solution:**
1. Netlify Dashboard → Site Settings → Environment Variables
2. Vérifier que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` existent
3. Redéployer

---

### Problème 3: Webhook ne s'exécute pas

**Cause:** Endpoint URL incorrect dans Stripe

**Solution:**
1. Stripe Dashboard → Webhooks
2. Vérifier que l'URL = `https://biblechantee.com/.netlify/functions/stripe-webhook`
3. Tester avec "Send test webhook"

---

### Problème 4: Premium pas activé après paiement

**Diagnostic:**
1. Vérifier les logs Netlify Functions (stripe-webhook)
2. Vérifier Supabase: table `users`, colonne `is_premium`
3. Vérifier localStorage: `bc_user.is_premium`

**Solutions possibles:**
- Attendre 5-10 secondes (délai webhook)
- Actualiser la page
- Vérifier que le webhook a bien reçu l'événement dans Stripe Dashboard

---

## 📊 MONITORING EN PRODUCTION

### Stripe Dashboard
- **Paiements:** https://dashboard.stripe.com/payments
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Logs:** Voir les tentatives de delivery des webhooks

### Netlify Functions Logs
- Dashboard → Functions → Sélectionner la fonction
- Voir les logs en temps réel

### Supabase Logs
- Dashboard → Logs
- Filtrer par table: `users`, `transactions`

---

## ✅ CHECKLIST DÉPLOIEMENT

### Avant de passer en LIVE

- [ ] ✅ Schéma SQL exécuté dans Supabase
- [ ] ✅ Tables créées: `users`, `transactions`, `bc_referrals`
- [ ] ✅ RLS policies activées
- [ ] ✅ Variables Netlify configurées (SUPABASE + STRIPE)
- [ ] ✅ Webhook Stripe créé et testé
- [ ] ✅ Tests complets en mode TEST Stripe
- [ ] ✅ Remplacer clés TEST par clés LIVE Stripe
- [ ] ✅ Tester 1 paiement réel avec vraie carte
- [ ] ✅ Vérifier activation premium fonctionne
- [ ] ✅ Monitoring Stripe + Netlify opérationnel

---

## 🎉 FÉLICITATIONS !

Si tous les tests passent, votre système freemium est opérationnel !

**Flux complet:**
1. User entre email → Sauvegardé Supabase ✅
2. User essaie 7 jours gratuitement ✅
3. Après 7 jours → Paywall $0.99 ✅
4. User paie → Stripe Checkout ✅
5. Webhook → Active premium Supabase ✅
6. Frontend → Détecte premium ✅
7. User → Accès illimité à vie ✅

---

**Support:** Questions? Voir les logs Netlify + Stripe Dashboard
