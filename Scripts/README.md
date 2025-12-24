# 🎁 Offrir 100 crédits aux inscrits Netlify Forms

## Objectif
Récupérer tous les emails inscrits via Netlify Forms et leur offrir 100 crédits dans Supabase.

---

## ✅ Prérequis

### 1. Credentials Netlify
Vous avez besoin de :
- **NETLIFY_ACCESS_TOKEN** : Token d'API personnel
- **NETLIFY_SITE_ID** : ID du site Bible Chantée

#### Comment obtenir le token Netlify ?
1. Aller sur https://app.netlify.com/user/applications#personal-access-tokens
2. Cliquer sur "New access token"
3. Donner un nom (ex: "Bible Chantée Scripts")
4. Copier le token généré

#### Comment obtenir le Site ID ?
1. Aller sur https://app.netlify.com
2. Sélectionner le site **bible-chantee**
3. Site settings > General > Site information > **Site ID**
4. Copier l'ID

### 2. Credentials Supabase
Vous avez besoin de :
- **SUPABASE_URL** : URL de votre projet Supabase
- **SUPABASE_SERVICE_KEY** : Clé de service (ou clé anon)

#### Comment les obtenir ?
1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet **Bible Chantée**
3. Settings > API > Project URL et Service Role Key

---

## 📋 Étape par étape

### Étape 1 : Récupérer les emails inscrits

#### Méthode A : Variables d'environnement Windows (recommandé)
```powershell
# Définir les variables d'environnement (valables pour la session PowerShell)
$env:NETLIFY_ACCESS_TOKEN = "VOTRE_TOKEN_ICI"
$env:NETLIFY_SITE_ID = "VOTRE_SITE_ID_ICI"

# Exécuter le script
cd "C:\ScriptBible\bible-chantee"
.\scripts\get-subscribers.ps1
```

#### Méthode B : Le script demande les credentials
```powershell
# Si les variables ne sont pas définies, le script vous les demandera
cd "C:\ScriptBible\bible-chantee"
.\scripts\get-subscribers.ps1
```

**Résultat** : Le script va créer un fichier `inscrits_biblechantee.csv` avec tous les emails.

---

### Étape 2 : Vérifier le CSV généré

```powershell
# Afficher le contenu du CSV
Get-Content .\inscrits_biblechantee.csv | Select-Object -First 10

# Compter le nombre d'inscrits
(Import-Csv .\inscrits_biblechantee.csv).Count
```

---

### Étape 3 : Offrir 100 crédits dans Supabase

#### Méthode A : Variables d'environnement Node.js
```powershell
# Définir les variables Supabase
$env:SUPABASE_URL = "https://VOTRE_PROJET.supabase.co"
$env:SUPABASE_SERVICE_KEY = "VOTRE_SERVICE_KEY_ICI"

# Exécuter le script Node.js
cd "C:\ScriptBible\bible-chantee"
node scripts/grant-credits.js
```

#### Méthode B : Créer un fichier .env
```bash
# Créer le fichier .env à la racine
cd "C:\ScriptBible\bible-chantee"
echo "SUPABASE_URL=https://VOTRE_PROJET.supabase.co" > .env
echo "SUPABASE_SERVICE_KEY=VOTRE_SERVICE_KEY_ICI" >> .env
```

Puis installer dotenv et modifier le script :
```bash
npm install dotenv
```

**Résultat** : Le script va :
1. Lire le CSV
2. Pour chaque email :
   - Si l'utilisateur existe : ajouter 100 crédits
   - Si l'utilisateur n'existe pas : créer avec 100 crédits + flag `early_adopter: true`
3. Générer un rapport dans `rapport_credits.json`

---

## 📊 Vérification

### Vérifier dans Supabase
```sql
-- Nombre total d'utilisateurs avec crédits
SELECT COUNT(*) FROM users WHERE credits >= 100;

-- Liste des early adopters
SELECT email, credits, created_at
FROM users
WHERE early_adopter = true
ORDER BY created_at DESC;

-- Total des crédits distribués
SELECT SUM(credits) as total_credits FROM users;
```

---

## 🔧 Dépannage

### Erreur "NETLIFY_ACCESS_TOKEN non trouvé"
→ Définir la variable d'environnement ou laisser le script vous la demander

### Erreur "Formulaire 'subscribe' non trouvé"
→ Vérifier que le formulaire existe dans Netlify Forms
→ Aller sur https://app.netlify.com > Bible Chantée > Forms

### Erreur "Variables Supabase manquantes"
→ Définir SUPABASE_URL et SUPABASE_SERVICE_KEY

### Erreur "Permission denied" dans Supabase
→ Utiliser SUPABASE_SERVICE_KEY (pas ANON_KEY) pour avoir les droits d'écriture

---

## 📁 Fichiers générés

| Fichier | Description |
|---------|-------------|
| `inscrits_biblechantee.csv` | Liste de tous les emails inscrits |
| `rapport_credits.json` | Rapport détaillé de l'attribution des crédits |

---

## 🚀 Commande rapide (tout en un)

```powershell
# Configurer les credentials
$env:NETLIFY_ACCESS_TOKEN = "VOTRE_TOKEN"
$env:NETLIFY_SITE_ID = "VOTRE_SITE_ID"
$env:SUPABASE_URL = "https://VOTRE_PROJET.supabase.co"
$env:SUPABASE_SERVICE_KEY = "VOTRE_KEY"

# Exécuter les deux scripts
cd "C:\ScriptBible\bible-chantee"
.\scripts\get-subscribers.ps1
node scripts/grant-credits.js
```

---

## ✅ Checklist finale

- [ ] Credentials Netlify récupérés
- [ ] Script PowerShell exécuté avec succès
- [ ] Fichier CSV généré avec tous les emails
- [ ] Credentials Supabase configurés
- [ ] Script Node.js exécuté sans erreur
- [ ] Rapport généré dans `rapport_credits.json`
- [ ] Vérification dans Supabase Dashboard

---

## 📧 Bonus : Envoyer un email aux inscrits

Pour informer les inscrits de leurs 100 crédits offerts, vous pouvez :
1. Utiliser Mailchimp / SendGrid / Brevo
2. Importer le CSV `inscrits_biblechantee.csv`
3. Créer une campagne email avec le message :

> **Sujet :** 🎁 100 crédits offerts sur Bible Chantée !
>
> Bonjour,
>
> Merci de votre inscription ! Pour vous remercier, nous vous offrons **100 crédits gratuits** pour écouter la Bible en audio.
>
> Connectez-vous sur biblechantee.com avec votre email pour en profiter.
>
> Bonne écoute ! 🎵

---

**🔗 Liens utiles**
- Dashboard Netlify : https://app.netlify.com
- Dashboard Supabase : https://supabase.com/dashboard
- Site Bible Chantée : https://biblechantee.com
