# Comment trouver votre Google Place ID

Le bouton "Laisser un avis" dans demo.html nécessite votre **Google Place ID** pour fonctionner correctement.

## 🔍 Méthode 1 : Via Google Business Profile (Recommandé)

1. Allez sur https://business.google.com/dashboard
2. Sélectionnez votre établissement "Bible Chantée"
3. Dans l'URL, vous verrez quelque chose comme :
   ```
   https://business.google.com/dashboard/l/12345678901234567890
   ```
   Le nombre à la fin (20 chiffres) est votre Place ID

## 🔍 Méthode 2 : Via Google Maps

1. Recherchez "Bible Chantée La Tour de Peilz" sur Google Maps
2. Cliquez sur votre établissement
3. Dans l'URL, cherchez le paramètre après `/place/` :
   ```
   https://www.google.com/maps/place/Bible+Chant%C3%A9e/@...
   ```
4. Ou utilisez "Partager" → "Intégrer une carte" et cherchez le `data-cid` dans le code iframe

## 🔍 Méthode 3 : Place ID Finder (Le plus simple)

1. Allez sur https://developers.google.com/maps/documentation/places/web-service/place-id
2. Cliquez sur "Place ID Finder"
3. Recherchez "Bible Chantée, Avenue de Bel-Air 115, 1814 La Tour-de-Peilz"
4. Votre Place ID s'affichera (format : `ChIJ...`)

## ⚙️ Configuration dans demo.html

Une fois que vous avez votre Place ID :

1. Ouvrez `demo.html`
2. Trouvez la ligne 699 :
   ```javascript
   const GOOGLE_PLACE_ID = "VOTRE_PLACE_ID_ICI";
   ```
3. Remplacez par votre vrai Place ID :
   ```javascript
   const GOOGLE_PLACE_ID = "ChIJVxYzK5BZjEcRXxYzK5BZjEc";
   ```
4. Sauvegardez et déployez

## 🎯 Résultat

Après configuration, le bouton "⭐ Laisser un avis" ouvrira directement :
- Le formulaire d'avis Google pour votre établissement
- Sans que l'utilisateur ait besoin de chercher votre établissement

## 📱 Lien de secours

En attendant d'avoir le Place ID, le bouton utilise un lien de recherche :
```
https://www.google.com/maps/search/?api=1&query=Bible+Chantée+La+Tour+de+Peilz
```

Cela fonctionne mais l'utilisateur doit cliquer une fois de plus pour arriver au formulaire d'avis.

## ✅ Vérification

Pour tester si votre Place ID fonctionne :
```
https://search.google.com/local/writereview?placeid=VOTRE_PLACE_ID
```

Si ça ouvre directement le formulaire d'avis, c'est bon ! ✅

---

**Contact :** Si vous avez besoin d'aide pour trouver votre Place ID, envoyez-moi l'URL de votre page Google Business ou Google Maps.
