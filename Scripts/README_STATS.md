# 📊 Récupérer toutes les statistiques - Bible Chantée

## Objectif
Récupérer et analyser toutes les données :
- ✅ **Inscrits Netlify Forms** : Liste complète des emails inscrits
- ✅ **Statistiques Supabase** : Utilisateurs premium, crédits, early adopters
- ✅ **Rapports détaillés** : CSV, JSON pour analyse

---

## 🚀 MÉTHODE RAPIDE (Tout en un)

```powershell
cd "C:\ScriptBible\bible-chantee"
.\Scripts\get-all-stats.ps1
```

Ce script va :
1. Récupérer tous les inscrits Netlify Forms
2. Récupérer toutes les stats Supabase
3. Générer tous les rapports

---

## 📋 Méthode détaillée

### ÉTAPE 1 : Inscrits Netlify Forms

Le script utilise une **Netlify Function** qui a déjà accès aux credentials.

```powershell
cd "C:\ScriptBible\bible-chantee"
.\Scripts\download-subscribers.ps1
```

**Résultat** :
- `inscrits_biblechantee.csv` - Liste complète (CSV)
- `inscrits_biblechantee.json` - Données détaillées (JSON)

---

### ÉTAPE 2 : Statistiques Supabase

**Prérequis** : Configurer les variables Supabase

```powershell
# Définir les credentials Supabase
$env:SUPABASE_URL = "https://VOTRE_PROJET.supabase.co"
$env:SUPABASE_SERVICE_KEY = "VOTRE_SERVICE_KEY"

# Exécuter le script
cd "C:\ScriptBible\bible-chantee"
node Scripts/get-supabase-stats.js
```

**Résultat** :
- `liste_premium.json` - Utilisateurs premium
- `liste_100credits.json` - Utilisateurs avec 100+ crédits
- `liste_early_adopters.json` - Early adopters
- `stats_supabase.json` - Statistiques complètes
- `utilisateurs_supabase.csv` - Tous les utilisateurs (CSV)

---

## 📊 Données récupérées

### Netlify Forms
| Colonne | Description |
|---------|-------------|
| Email | Email de l'inscrit |
| Language | Langue choisie (fr, en, pt, es) |
| Date | Date d'inscription |
| ID | ID unique Netlify |

### Supabase
| Statistique | Description |
|-------------|-------------|
| Total utilisateurs | Nombre total d'inscrits |
| Utilisateurs premium | Nombre de premium actifs |
| Utilisateurs 100+ crédits | Avec au moins 100 crédits |
| Early adopters | Premiers inscrits |
| Total crédits | Somme de tous les crédits |
| Moyenne crédits | Moyenne par utilisateur |

---

## 🔧 Credentials nécessaires

### Pour Netlify (automatique)
Les credentials sont déjà configurés dans Netlify :
- ✅ `NETLIFY_ACCESS_TOKEN`
- ✅ `NETLIFY_SITE_ID`

La fonction `/api/export-subscribers` y a accès automatiquement.

### Pour Supabase (manuel)
Récupérer depuis https://supabase.com/dashboard :
1. Settings > API > **Project URL** → `SUPABASE_URL`
2. Settings > API > **Service Role Key** → `SUPABASE_SERVICE_KEY`

---

## 📁 Fichiers générés

```
C:\ScriptBible\bible-chantee\
├── inscrits_biblechantee.csv      (Netlify Forms - CSV)
├── inscrits_biblechantee.json     (Netlify Forms - JSON)
├── liste_premium.json             (Supabase Premium)
├── liste_100credits.json          (Supabase 100+ crédits)
├── liste_early_adopters.json      (Supabase Early adopters)
├── stats_supabase.json            (Statistiques complètes)
└── utilisateurs_supabase.csv      (Tous utilisateurs CSV)
```

---

## 🎯 Cas d'usage

### Analyser la croissance
```powershell
# Récupérer les stats
.\Scripts\get-all-stats.ps1

# Ouvrir le CSV dans Excel
Start-Process utilisateurs_supabase.csv
```

### Comparer Netlify vs Supabase
```powershell
# Nombre d'inscrits Netlify
(Import-Csv inscrits_biblechantee.csv).Count

# Nombre d'utilisateurs Supabase
(Import-Csv utilisateurs_supabase.csv).Count
```

### Filtrer les premium
```powershell
$stats = Get-Content liste_premium.json | ConvertFrom-Json
$stats | Format-Table email, credits, created_at
```

---

## 🔍 Vérifications

### Dashboard Netlify
https://app.netlify.com/sites/bible-chantee/forms

### Dashboard Supabase
https://supabase.com/dashboard

### Tester la fonction export
https://biblechantee.com/.netlify/functions/export-subscribers

---

## 🚨 Dépannage

### "Erreur 404" sur la fonction Netlify
→ Attendre 1-2 minutes après le déploiement
→ Vérifier : https://app.netlify.com/sites/bible-chantee/deploys

### "Variables Supabase manquantes"
→ Définir `$env:SUPABASE_URL` et `$env:SUPABASE_SERVICE_KEY`

### "Permission denied" Supabase
→ Utiliser `SUPABASE_SERVICE_KEY` (pas ANON_KEY)

---

## ✅ Checklist

- [ ] Netlify Function déployée
- [ ] Script `download-subscribers.ps1` exécuté
- [ ] CSV Netlify généré
- [ ] Credentials Supabase configurés
- [ ] Script `get-supabase-stats.js` exécuté
- [ ] Tous les fichiers générés
- [ ] Données vérifiées

---

**🔗 Liens utiles**
- Netlify Forms : https://app.netlify.com/sites/bible-chantee/forms
- Supabase Dashboard : https://supabase.com/dashboard
- Fonction Export : https://biblechantee.com/.netlify/functions/export-subscribers
