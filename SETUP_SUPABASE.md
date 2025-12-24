# 🚀 Configuration Supabase - Bible Chantée

Guide complet pour migrer de localStorage vers Supabase.

---

## ✅ Prérequis

Vous avez déjà :
- ✅ Projet Supabase : `ozkztvstozwdkpsyhgsr`
- ✅ URL : `https://ozkztvstozwdkpsyhgsr.supabase.co`
- ✅ Anon Key : `sb_publishable_88qslGH8ClDBemGY3zyU3w_x2J4WkjN`
- ⚠️ Service Role Key : À récupérer

---

## 📋 ÉTAPE 1 : Récupérer la Service Role Key

1. Allez sur : https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr/settings/api
2. Cherchez **"Service Role Key"** (section "Project API keys")
3. Cliquez sur **"Reveal"** pour afficher la clé
4. **Copiez la clé** (commence par `eyJ...`)

---

## 📋 ÉTAPE 2 : Ajouter les credentials dans Netlify

### Via le Dashboard Web (Recommandé)

1. Allez sur : https://app.netlify.com/sites/bible-chantee/configuration/env
2. Cliquez sur **"Add a variable"**
3. Ajoutez **3 variables** :

| Key | Value | Scopes |
|-----|-------|--------|
| `SUPABASE_URL` | `https://ozkztvstozwdkpsyhgsr.supabase.co` | All |
| `SUPABASE_ANON_KEY` | `sb_publishable_88qslGH8ClDBemGY3zyU3w_x2J4WkjN` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (votre clé) | Builds, Functions, Runtime |

4. Cliquez sur **"Save"**

### OU via PowerShell

```powershell
$env:SUPABASE_SERVICE_ROLE_KEY = "VOTRE_SERVICE_ROLE_KEY_ICI"

netlify env:set SUPABASE_URL "https://ozkztvstozwdkpsyhgsr.supabase.co"
netlify env:set SUPABASE_ANON_KEY "sb_publishable_88qslGH8ClDBemGY3zyU3w_x2J4WkjN"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "$env:SUPABASE_SERVICE_ROLE_KEY"
```

---

## 📋 ÉTAPE 3 : Créer la structure de la base de données

1. Allez sur : https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr/editor
2. Cliquez sur **"SQL Editor"** (ou **"New query"**)
3. **Copiez tout le contenu** du fichier `supabase-schema.sql`
4. **Collez dans l'éditeur SQL**
5. Cliquez sur **"Run"** (ou F5)

✅ Vous devriez voir : **"Success. No rows returned"**

Cela crée :
- ✅ Table `users` avec colonnes (email, credits, is_premium, etc.)
- ✅ Table `transactions` pour l'historique
- ✅ Index pour les performances
- ✅ Policies de sécurité (RLS)
- ✅ Vue `admin_stats` pour le dashboard

---

## 📋 ÉTAPE 4 : Importer les 13 inscrits dans Supabase

```powershell
cd "C:\ScriptBible\bible-chantee"

# Définir la Service Role Key
$env:SUPABASE_SERVICE_ROLE_KEY = "VOTRE_SERVICE_ROLE_KEY_ICI"

# Exécuter l'import
node Scripts/import-to-supabase.js
```

**Résultat attendu** :
```
✅ Créés: 13
⏭️  Existants: 0
❌ Erreurs: 0

📊 Total utilisateurs dans Supabase: 13
👑 Premium: 0
🌟 Early adopters: 13
💎 100+ crédits: 13
```

---

## 📋 ÉTAPE 5 : Vérifier les données dans Supabase

1. Allez sur : https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr/editor
2. Cliquez sur **"Table Editor"**
3. Sélectionnez la table **"users"**

Vous devriez voir les **13 utilisateurs** avec :
- Email
- 100 crédits
- `early_adopter = true`
- `is_premium = false`

---

## 📋 ÉTAPE 6 : Tester l'API export-supabase-stats

```powershell
# Attendre que Netlify redéploie avec les nouvelles variables (2-3 min)
# Puis tester l'API :

curl https://biblechantee.com/.netlify/functions/export-supabase-stats
```

**Résultat attendu** :
```json
{
  "success": true,
  "stats": {
    "total": 13,
    "premium": 0,
    "with100Credits": 13,
    "earlyAdopters": 13
  }
}
```

---

## 📋 ÉTAPE 7 : Actualiser le Dashboard Admin

1. Allez sur : https://biblechantee.com/admin-dashboard.html
2. Cliquez sur **"🔄 Actualiser"**
3. Les statistiques devraient s'afficher :
   - ✅ 13 inscrits
   - ✅ 0 premium
   - ✅ 13 avec 100+ crédits

---

## 🎯 RÉCAPITULATIF - Checklist

- [ ] Service Role Key récupérée
- [ ] Variables ajoutées dans Netlify
- [ ] SQL exécuté dans Supabase (table `users` créée)
- [ ] Script d'import exécuté (13 utilisateurs importés)
- [ ] Données vérifiées dans Supabase Table Editor
- [ ] API `export-supabase-stats` testée
- [ ] Dashboard admin affiche les bonnes stats

---

## 🔧 Dépannage

### "Service Role Key" manquant
→ Vérifier : https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr/settings/api

### "Table already exists"
→ C'est OK ! La table existe déjà. Passez à l'étape suivante.

### API retourne "MISSING"
→ Les variables Netlify ne sont pas encore propagées. Attendre 2-3 minutes et réessayer.

### Script d'import échoue
→ Vérifier que `inscrits_biblechantee.json` existe dans le dossier racine.

---

## 📞 Support

Si problème, vérifiez :
1. Logs Netlify : https://app.netlify.com/sites/bible-chantee/deploys
2. Logs Supabase : https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr/logs/explorer

---

## 🚀 Prochaines étapes (après configuration)

Une fois Supabase configuré, on pourra :
1. Migrer le code frontend (remplacer localStorage)
2. Ajouter l'authentification par email
3. Synchroniser les crédits entre appareils
4. Historique des transactions
5. Gestion des paiements Stripe

---

**🔗 Liens utiles**
- Dashboard Supabase : https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr
- Table Editor : https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr/editor
- SQL Editor : https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr/sql
- Admin Dashboard : https://biblechantee.com/admin-dashboard.html
