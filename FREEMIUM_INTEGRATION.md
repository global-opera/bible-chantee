# 🎵 Intégration du Système Freemium - Bible Chantée

## 📋 Vue d'ensemble

Système de monétisation : **100 chapitres gratuits** + **$0.99 pour tout débloquer** (1189 chapitres).

## 📦 Fichiers créés

1. **freemium-system.js** - Toute la logique JavaScript
2. **freemium-styles.css** - Tous les styles (modals, compteur, animations)
3. **FREEMIUM_INTEGRATION.md** - Ce guide

---

## 🚀 Intégration dans demo.html

### Étape 1 : Ajouter les fichiers dans le `<head>`

```html
<head>
    <!-- ... autres meta tags ... -->

    <!-- Freemium System -->
    <link rel="stylesheet" href="freemium-styles.css">
    <script src="freemium-system.js"></script>
</head>
```

### Étape 2 : Ajouter le compteur de crédits

Juste après la balise `<body>` :

```html
<body>
    <!-- Compteur de crédits (fixe en haut à droite) -->
    <div id="credits-counter"></div>

    <!-- ... reste du contenu ... -->
</body>
```

### Étape 3 : Modifier la fonction de lecture audio

Trouver la fonction qui lance la lecture MP3 et ajouter la vérification freemium :

```javascript
function playChapter(chapterId, chapterTitle) {
    // AJOUTER CETTE VÉRIFICATION AU DÉBUT
    const check = freemium.canPlayChapter(chapterId);

    if (!check.canPlay) {
        // Afficher paywall
        freemium.showPaywall();
        return;
    }

    if (check.reason === 'will_unlock') {
        // Débloquer le chapitre
        const result = freemium.unlockChapter(chapterId, chapterTitle);

        if (!result.success) {
            alert(result.message);
            return;
        }

        // Afficher notification
        showNotification(result.message);
    }

    // PUIS continuer avec la lecture normale
    // ... votre code de lecture MP3 existant ...
}
```

### Étape 4 : Fonction de notification (optionnel mais recommandé)

Ajouter après la fonction playChapter :

```javascript
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'unlock-notification';
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 5000);
}
```

---

## 🎨 Personnalisation

### Changer les couleurs

Dans `freemium-styles.css`, modifier les variables CSS :

```css
:root {
    --freemium-primary: #4a90d9;    /* Bleu principal */
    --freemium-gold: #d4af37;       /* Or */
    --freemium-dark: #0f2744;       /* Fond sombre */
}
```

### Changer le prix

Dans `freemium-system.js`, ligne 10 :

```javascript
this.PREMIUM_PRICE = '$0.99';  // Modifier ici
```

### Changer le nombre de crédits gratuits

Dans `freemium-system.js`, ligne 9 :

```javascript
this.TOTAL_FREE_CREDITS = 100;  // Modifier ici
```

---

## 💳 Configuration des paiements

### Option A : Stripe (Recommandé - Automatique)

1. **Créer compte Stripe** : https://stripe.com
2. **Obtenir clés API** (Dashboard → Developers → API keys)
3. **Modifier `initStripePayment()`** dans freemium-system.js :

```javascript
initStripePayment() {
    // Votre Publishable Key
    const stripe = Stripe('pk_test_VOTRE_CLE_PUBLIQUE');

    // Créer Checkout Session
    fetch('/create-checkout-session', {
        method: 'POST',
    })
    .then(res => res.json())
    .then(session => {
        return stripe.redirectToCheckout({ sessionId: session.id });
    });
}
```

4. **Créer endpoint backend** (voir doc Stripe Checkout)
5. **Webhook après paiement** :
```javascript
// Quand paiement réussi, activer premium
freemium.activatePremium();
```

### Option B : PayPal (Simple - Manuel)

1. **Créer bouton PayPal.me** : https://paypal.me/votrecompte
2. **Modifier `initPayPalPayment()`** :

```javascript
initPayPalPayment() {
    // Rediriger vers PayPal.me
    window.open('https://paypal.me/votrecompte/0.99', '_blank');

    // Message à l'utilisateur
    alert('Après paiement, vous recevrez un email avec votre code de déblocage.');
}
```

3. **Processus manuel** :
   - Utilisateur paie via PayPal
   - Vous recevez notification
   - Vous générez code : `freemium.generatePremiumCode()`
   - Vous envoyez code par email
   - Utilisateur entre code : "J'ai déjà payé"

---

## 🧪 Tests

### Tester le système

Ouvrir la console JavaScript (F12) :

```javascript
// Voir l'état actuel
freemium.getStats()

// Simuler déblocage de chapitre
freemium.unlockChapter('01_GEN_01_FR', 'Genèse 1')

// Simuler activation premium
freemium.activatePremium()

// Reset complet (pour retester)
freemium.resetAll()
```

### Scénarios de test

1. **Premier visiteur** :
   - Vérifier compteur : 100/100
   - Jouer 1 chapitre → 99/100
   - Vérifier localStorage

2. **Épuiser crédits** :
   - Jouer 100 chapitres
   - Vérifier paywall s'affiche

3. **Acheter premium** :
   - Cliquer "Débloquer TOUT"
   - Simuler paiement
   - Vérifier compteur → "👑 Accès illimité"

4. **Restaurer code** :
   - Reset localStorage
   - Cliquer "J'ai déjà payé"
   - Entrer code
   - Vérifier premium réactivé

---

## 📊 Suivi Analytics

Ajouter tracking dans Google Analytics :

```javascript
// Dans unlockChapter()
gtag('event', 'chapter_unlocked', {
    'chapter_id': chapterId,
    'credits_remaining': this.credits
});

// Dans activatePremium()
gtag('event', 'premium_activated', {
    'value': 0.99,
    'currency': 'USD'
});
```

---

## 🔒 Sécurité

### Validation des codes premium

**Option 1 : Liste en dur (simple)**

Dans `verifyPremiumCode()`, remplacer par :

```javascript
verifyPremiumCode(code) {
    const validCodes = [
        'BIBLE-A8F3-92E1',
        'BIBLE-B7C2-81D0',
        // ... codes générés après chaque vente
    ];

    return {
        valid: validCodes.includes(code),
        message: validCodes.includes(code) ? 'Code valide!' : 'Code invalide'
    };
}
```

**Option 2 : API backend (sécurisé)**

```javascript
verifyPremiumCode(code) {
    return fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
    .then(res => res.json());
}
```

---

## 🐛 Dépannage

### Le compteur n'apparaît pas
- Vérifier que `freemium-system.js` est chargé (F12 → Console)
- Vérifier que `<div id="credits-counter"></div>` existe dans le HTML

### localStorage effacé
- Normal si utilisateur efface cookies
- Solution : Système de codes de restauration

### Paywall ne s'affiche pas
- Vérifier console pour erreurs JavaScript
- Vérifier que modal n'est pas bloquée par CSS `display: none`

### Paiement ne fonctionne pas
- Vérifier clés API Stripe/PayPal
- Vérifier endpoint backend répond
- Tester en mode test d'abord

---

## ✅ Checklist avant lancement

- [ ] Fichiers CSS et JS ajoutés dans `<head>`
- [ ] Compteur ajouté dans `<body>`
- [ ] Fonction `playChapter()` modifiée avec vérification
- [ ] Prix configuré : `$0.99`
- [ ] Crédits gratuits : `100`
- [ ] Système de paiement configuré (Stripe ou PayPal)
- [ ] Webhook paiement → `activatePremium()`
- [ ] Email avec code de déblocage automatique
- [ ] Tests effectués (nouveau visiteur, épuiser crédits, acheter, restaurer)
- [ ] Google Analytics tracking ajouté
- [ ] Design testé sur mobile
- [ ] Validation codes premium configurée

---

## 📧 Email automatique après achat

Template email à envoyer :

```
Objet : Votre code de déblocage Bible Chantée 🎵

Bonjour,

Merci pour votre achat de la Bible Chantée !

Vous avez maintenant accès à tous les 1189 chapitres dans 4 langues.

VOTRE CODE DE DÉBLOCAGE :
┌─────────────────────┐
│   BIBLE-XXXX-XXXX   │
└─────────────────────┘

⚠️ Conservez ce code précieusement !

Si vous changez d'appareil ou effacez vos données :
1. Allez sur sungbible.world
2. Cliquez "J'ai déjà payé ?"
3. Entrez ce code

Bonne écoute ! 🎶

---
Bible Chantée / Sung Bible
support@sungbible.world
```

---

## 🚀 Prêt à lancer !

Une fois intégré et testé, le système est **100% autonome** :
- ✅ Nouveau visiteur → 100 crédits automatiques
- ✅ Déblocage → localStorage mis à jour
- ✅ Paiement → Premium activé
- ✅ Code → Restauration possible

**Questions ?** Contactez le développeur ! 😊
