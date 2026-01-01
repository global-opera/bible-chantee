# 🚀 Guide Configuration Supabase - Bible Chantée

## 📋 Vue d'ensemble

Vous avez 3 scripts Node.js pour gérer votre backend Supabase :

| Script | Description | Usage |
|--------|-------------|-------|
| `get-supabase-stats.js` | Récupère les statistiques (users, crédits, premium) | Monitoring |
| `grant-credits.js` | Offre 100 crédits aux inscrits du CSV | Migration |
| `import-to-supabase.js` | Importe les 13 premiers inscrits Netlify | Import initial |

---

## ⚙️ ÉTAPE 1 : Créer le fichier `.env`

### 1.1 Créer le fichier

Dans le dossier **racine du projet** (`C:\ScriptBible\bible-chantee\`), créez un fichier nommé **`.env`** (avec le point au début).

### 1.2 Copier ce contenu

```env
# Supabase - Backend administratif UNIQUEMENT
SUPABASE_URL=https://ozkztvstozwdkpsyhgsr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_ici
```

### 1.3 Remplir les valeurs

1. **Connectez-vous à Supabase** : https://supabase.com/dashboard
2. **Sélectionnez** le projet `sungbible-credits`
3. **Allez dans** : `Settings` → `API`
4. **Copiez** :
   - **Project URL** → Remplacez dans `SUPABASE_URL`
   - **service_role key** (section "Project API keys") → Remplacez dans `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **ATTENTION** : Ne JAMAIS committer ce fichier (il est déjà dans `.gitignore`)

---

## 🔐 Types de clés Supabase (pour comprendre)

| Clé | Utilisation | Exposition |
|-----|-------------|------------|
| `anon` (publique) | Frontend / Site web | ✅ Peut être exposée |
| `service_role` (secrète) | Scripts backend / Admin | ❌ JAMAIS exposer |

Vos 3 scripts utilisent la **service_role** car ils font des opérations administratives (créer/modifier des users).

---

## ✅ ÉTAPE 2 : Tester la connexion

### 2.1 Vérifier que tout fonctionne

Ouvrez PowerShell dans le dossier du projet et lancez :

```powershell
cd "C:\ScriptBible\bible-chantee"
node Scripts/get-supabase-stats.js
```

### 2.2 Résultat attendu

Si tout va bien, vous verrez :

```
========================================
  Statistiques Supabase - Bible Chantée
========================================

✅ Connexion Supabase OK

[1/5] Récupération des utilisateurs...
✅ X utilisateur(s) trouvé(s)

📊 STATISTIQUES GÉNÉRALES
...
```

### 2.3 En cas d'erreur

Si vous voyez :
```
❌ Variables d'environnement Supabase manquantes:
   SUPABASE_URL: ❌
   SUPABASE_SERVICE_ROLE_KEY: ❌
```

**Solutions** :
1. Vérifiez que le fichier `.env` est bien dans `C:\ScriptBible\bible-chantee\` (pas dans `Scripts\`)
2. Vérifiez que les valeurs sont correctes (pas de guillemets, pas d'espaces)
3. Relancez le script

---

## 📚 ÉTAPE 3 : Utiliser les scripts

### Script 1 : Statistiques (`get-supabase-stats.js`)

**Ce qu'il fait** :
- Affiche le nombre total d'utilisateurs
- Montre la distribution des crédits
- Génère des fichiers CSV/JSON pour Excel

**Comment l'utiliser** :
```powershell
node Scripts/get-supabase-stats.js
```

**Fichiers générés** (dans le dossier racine) :
- `liste_premium.json` - Liste des utilisateurs premium
- `liste_100credits.json` - Users avec 100+ crédits
- `liste_early_adopters.json` - Early adopters
- `stats_supabase.json` - Statistiques complètes
- `utilisateurs_supabase.csv` - Export Excel

---

### Script 2 : Offrir des crédits (`grant-credits.js`)

**Ce qu'il fait** :
- Lit le fichier `inscrits_biblechantee.csv`
- Offre 100 crédits à chaque inscrit
- Si l'user existe déjà, ajoute 100 crédits
- Si l'user n'existe pas, le crée avec 100 crédits

**Comment l'utiliser** :
```powershell
# 1. Assurez-vous que inscrits_biblechantee.csv existe
node Scripts/grant-credits.js
```

**Résultat** :
- Génère `rapport_credits.json` avec le détail

---

### Script 3 : Import initial (`import-to-supabase.js`)

**Ce qu'il fait** :
- Importe les 13 premiers inscrits de `inscrits_biblechantee.json`
- Les marque comme "early adopters"
- Leur donne 100 crédits de base

**Comment l'utiliser** :
```powershell
# 1. Assurez-vous que inscrits_biblechantee.json existe
node Scripts/import-to-supabase.js
```

---

## 🎯 Quelle clé utiliser ?

**TOUS les 3 scripts utilisent** : `SUPABASE_SERVICE_ROLE_KEY`

✅ **Unifié** : Une seule variable à configurer
✅ **Simple** : Pas de confusion entre `SERVICE_KEY`, `ANON_KEY`, etc.
✅ **Sécurisé** : Cette clé ne quitte jamais votre ordinateur

---

## 🛡️ Sécurité - Points importants

### ✅ Ce qui est OK
- Utiliser `SUPABASE_SERVICE_ROLE_KEY` dans les scripts Node.js locaux
- Stocker cette clé dans `.env` (qui est dans `.gitignore`)
- Lancer ces scripts depuis votre ordinateur

### ❌ Ne JAMAIS faire
- Exposer `SUPABASE_SERVICE_ROLE_KEY` dans le code frontend
- Committer le fichier `.env` sur GitHub
- Utiliser `SUPABASE_SERVICE_ROLE_KEY` dans le code JavaScript du site
- Mettre cette clé dans les variables d'environnement Netlify

### 📦 Pour le site web (frontend)
Si vous avez besoin d'accéder à Supabase depuis le site, utilisez :
- La clé **anon** (publique)
- Row Level Security (RLS) activée
- Des politiques strictes sur les tables

---

## 🐛 Dépannage

### Problème : "Cannot find module 'dotenv'"

**Solution** :
```powershell
cd "C:\ScriptBible\bible-chantee"
npm install
```

### Problème : "PGRST301: JWTIssuedAtFuture"

**Solution** : Votre horloge système est désynchronisée. Synchronisez l'heure Windows.

### Problème : "relation 'users' does not exist"

**Solution** : La table `users` n'existe pas dans Supabase. Créez-la avec ce schéma :

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  early_adopter BOOLEAN DEFAULT false,
  preferred_language TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez que votre projet Supabase `sungbible-credits` est bien actif (pas en pause)
2. Vérifiez les clés dans l'interface Supabase
3. Assurez-vous que le fichier `.env` est au bon endroit

---

## ✅ Checklist finale

- [ ] Fichier `.env` créé dans `C:\ScriptBible\bible-chantee\`
- [ ] `SUPABASE_URL` remplie
- [ ] `SUPABASE_SERVICE_ROLE_KEY` remplie
- [ ] `npm install` exécuté
- [ ] Test avec `node Scripts/get-supabase-stats.js` réussi
- [ ] Projet Supabase actif (pas en pause)

---

**🎉 C'est tout ! Vos scripts sont maintenant configurés et prêts à l'emploi.**
