# 📊 Configuration Google Analytics - Bible Chantée

## 🎯 Objectif

Ce guide vous explique comment obtenir votre **Measurement ID** (code G-XXXXXXXXXX) pour activer Google Analytics sur votre site.

---

## ✅ Tout est déjà préparé !

**Bonne nouvelle :** Le code Google Analytics est **déjà installé** dans demo.html !

Il vous reste juste à :
1. Créer un compte Google Analytics (gratuit, 5 minutes)
2. Copier votre code G-XXXXXXXXXX
3. Le coller au bon endroit dans demo.html

---

## 🚀 ÉTAPE 1 : Créer votre compte Google Analytics

### 1. Allez sur Google Analytics
👉 **https://analytics.google.com**

### 2. Cliquez sur "Commencer" ou "Start measuring"

### 3. Créez un compte
- **Nom du compte** : Bible Chantée
- Cochez les cases (partage de données recommandé)
- Cliquez "Suivant"

### 4. Créez une propriété
- **Nom de la propriété** : Site Web Bible Chantée
- **Fuseau horaire** : (GMT+01:00) Europe/Zurich
- **Devise** : Franc suisse (CHF)
- Cliquez "Suivant"

### 5. Informations sur l'entreprise
- **Secteur d'activité** : Arts et loisirs
- **Taille de l'entreprise** : Petite (1-10 employés)
- **Comment comptez-vous utiliser Google Analytics** : Cochez "Mesurer l'engagement des clients"
- Cliquez "Créer"

### 6. Acceptez les conditions
- Cochez les cases
- Cliquez "J'accepte"

### 7. Configuration de la collecte de données
- **Plateforme** : Choisissez "Web"
- **URL du site web** : **sungbible.world**
- **Nom du flux** : Site Web Bible Chantée
- Cliquez "Créer un flux"

---

## 🎁 ÉTAPE 2 : Récupérer votre Measurement ID

Après avoir créé le flux, vous verrez une page avec :

```
ID de mesure : G-ABC1234XYZ
```

**C'est ce code qu'il vous faut !**

### Copiez ce code
Il ressemble à : `G-` suivi de lettres et chiffres

**Exemples :**
- G-ABC1234XYZ
- G-XXXXXXXXXX
- G-1A2B3C4D5E

---

## 🔧 ÉTAPE 3 : Mettre le code dans demo.html

### Option A : Vous le faites (très simple)

1. Ouvrez le fichier **demo.html**
2. Cherchez à la **ligne 11** :
   ```javascript
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```
3. Remplacez les **2 occurrences** de `G-XXXXXXXXXX` par votre vrai code :
   - Ligne 11 : dans l'URL
   - Ligne 18 : dans gtag('config', ...)

**Avant :**
```javascript
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-XXXXXXXXXX', {
        'send_page_view': true,
        'anonymize_ip': false
    });
</script>
```

**Après (avec votre code) :**
```javascript
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC1234XYZ"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-ABC1234XYZ', {
        'send_page_view': true,
        'anonymize_ip': false
    });
</script>
```

4. **Sauvegardez** le fichier
5. **Déployez** sur Netlify (git add, commit, push)

---

### Option B : Envoyez-moi le code et je le fais (30 secondes)

Envoyez-moi juste votre code :
```
Mon code Google Analytics : G-ABC1234XYZ
```

Je le mets au bon endroit et je pousse sur GitHub. **Fini !** ✅

---

## 📊 ÉTAPE 4 : Vérifier que ça fonctionne

### Test immédiat (dans 1 minute)

1. Allez sur votre site : **sungbible.world**
2. Ouvrez Google Analytics : **https://analytics.google.com**
3. Allez dans **Rapports > Temps réel**
4. Vous devriez voir **"1 utilisateur actif"** (vous !)

✅ **Si vous vous voyez → Ça marche !**

---

## 🌍 ÉTAPE 5 : Voir les villes (dès le lendemain)

Les statistiques géographiques détaillées apparaissent après **24 heures**.

### Où voir les villes ?

Dans Google Analytics :
1. **Rapports** (menu gauche)
2. **Acquisition** → **Acquisition de trafic**
3. Cliquez sur **"Ajouter une comparaison"** → **"Ville"**

Ou :
1. **Rapports**
2. **Données démographiques** → **Détails des données démographiques**
3. Sélectionnez **"Ville"** dans le menu déroulant

Vous verrez :
```
🇧🇷 São Paulo : 45 visiteurs
🇧🇷 Rio de Janeiro : 23 visiteurs
🇧🇷 Belo Horizonte : 18 visiteurs
🇫🇷 Paris : 34 visiteurs
🇨🇭 Lausanne : 12 visiteurs
...
```

---

## 🎯 Ce qui est déjà configuré pour vous

### ✅ Tracking géographique
- Pays
- Régions
- Villes (précis)

### ✅ Événements personnalisés trackés

1. **Changement de langue**
   - Quand quelqu'un clique FR/PT/EN/ES
   - Vous saurez quelle langue est la plus populaire

2. **Lecture audio**
   - Quel chapitre est écouté
   - Dans quelle langue
   - Combien de fois

3. **Affichage des paroles**
   - Quels chapitres les gens veulent voir les paroles
   - Dans quelle langue

4. **Bouton Partager**
   - Combien de personnes partagent
   - Dans quelle langue

5. **Bouton Avis Google**
   - Combien cliquent pour laisser un avis

6. **Bouton Soutenir**
   - Combien vont vers la page de don

7. **Bouton Pix (PT)**
   - Combien de Brésiliens cliquent sur Pix

8. **Formulaire précommande**
   - Combien soumettent leur email
   - Dans quelle langue

---

## 📈 Rapports que vous pourrez créer

### Rapport "Villes du Brésil"
Voir top 20 villes brésiliennes qui visitent le site

### Rapport "Chapitres populaires"
Quel chapitre est le plus écouté par pays

### Rapport "Conversions par langue"
Quelle langue convertit le mieux (formulaires, dons)

### Rapport "Parcours utilisateur"
Que font les gens sur le site ? Dans quel ordre ?

---

## 🆘 Problèmes fréquents

### "Je ne vois pas de données"
- Attendez 24-48h pour les premières données
- Vérifiez que vous avez remplacé les 2 occurrences de G-XXXXXXXXXX
- Testez en mode Temps réel

### "Je ne vois pas les villes"
- Les données géographiques prennent 24h minimum
- Allez dans Rapports > Données démographiques > Détails

### "Ça ne marche pas"
- Envoyez-moi votre code G-XXXXXXX
- Je vérifie et corrige si besoin

---

## 💡 Astuce : Rapport hebdomadaire par email

Google Analytics peut vous envoyer un **email automatique chaque semaine** avec :
- Nombre de visiteurs
- Top 5 pays
- Top 5 pages
- Conversions (formulaires)

**Pour l'activer :**
1. Google Analytics > Rapports
2. Cliquez sur "Partager ce rapport" (icône ⋮)
3. "Planifier un envoi par e-mail"
4. Fréquence : Hebdomadaire (lundi matin)

Comme ça, vous suivez sans avoir à vous connecter ! 📧

---

## ✅ Checklist finale

- [ ] Compte Google Analytics créé
- [ ] Measurement ID copié (G-XXXXXXXXXX)
- [ ] Code mis dans demo.html (2 occurrences)
- [ ] Fichier sauvegardé
- [ ] Déployé sur Netlify
- [ ] Test en Temps réel OK
- [ ] Email hebdomadaire configuré (optionnel)

---

## 🎊 Vous êtes prêt !

Une fois configuré, vous saurez :
- **D'où** viennent vos visiteurs (São Paulo, Rio, Paris...)
- **Quoi** ils écoutent (Genèse, Psaumes...)
- **Comment** ils interagissent (partage, dons, avis...)
- **Quand** ils visitent (jours, heures)

**Toutes ces données vous aident à :**
- Savoir où concentrer vos efforts de communication
- Comprendre quel contenu plaît le plus
- Optimiser votre stratégie de croissance

---

**Besoin d'aide ?**
Envoyez-moi simplement votre code G-XXXXXXXXXX et je configure tout ! 😊
