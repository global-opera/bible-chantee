# AUTOPLAY AJOUTÉ À LA PRODUCTION

## Modifications effectuées

### 1. js/player.js
✅ Ajout variable `isAutoplayEnabled` (ligne 725)
✅ Ajout fonction `playNextChapter()` (lignes 791-815)
   - Détecte le nombre total de chapitres via BOOKS
   - Avance au chapitre suivant si autoplay activé
   - Affiche log en fin de livre

✅ Ajout fonction `setupAutoplayListener()` (lignes 817-831)
   - Event listener 'ended' sur audio element
   - Appelle playNextChapter() automatiquement

✅ Appel de `setupAutoplayListener()` dans boot() (ligne 837)

✅ API publique BC_PLAYER étendue (lignes 857-864)
   - toggleAutoplay(): Active/désactive l'autoplay
   - getAutoplayStatus(): Retourne l'état actuel

### 2. lecteur.html
✅ Ajout bouton autoplay UI (lignes 76-78)
   - Icône 🔁
   - Style cohérent avec le thème (or/bleu)
   - Position: sous le lecteur audio

✅ Ajout script toggle autoplay (lignes 124-159)
   - Fonction toggleAutoplay() 
   - Changement visuel du bouton (actif = fond or)
   - Initialisation état au chargement

### 3. js/translations.js
✅ Traductions ajoutées pour 7 langues:
   - FR: "Lecture continue" / "Lecture continue ON"
   - EN: "Continuous play" / "Continuous play ON"
   - ES: "Reproducción continua" / "Reproducción continua ON"
   - PT: "Reprodução contínua" / "Reprodução contínua ON"
   - DE: "Fortlaufende Wiedergabe" / "Fortlaufende Wiedergabe ON"
   - IT: "Riproduzione continua" / "Riproduzione continua ON"
   - TL: "Tuloy-tuloy na pagtugtog" / "Tuloy-tuloy na pagtugtog ON"

## Fonctionnement

1. **Chargement page**: Bouton autoplay apparaît (inactif)
2. **Clic bouton**: Toggle autoplay ON/OFF
3. **État ON**: Bouton devient or avec texte "ON"
4. **Fin chapitre**: Si autoplay ON, passe au chapitre suivant automatiquement
5. **Fin livre**: Autoplay s'arrête, message console

## Tests recommandés

```bash
# 1. Lancer serveur local
cd C:\ScriptBible\bible-chantee
python -m http.server 8080

# 2. Ouvrir dans navigateur
http://localhost:8080/lecteur.html?lang=FR&book=1&chapter=1

# 3. Tester
- Cliquer play sur audio
- Activer autoplay (🔁)
- Attendre fin du chapitre 1
- Vérifier que chapitre 2 démarre automatiquement
```

## Prochaine étape

Déployer sur Netlify:
```bash
git add lecteur.html js/player.js js/translations.js
git commit -m "feat: Add continuous autoplay to production player"
git push origin prod
```

Déploiement automatique sur biblechantee.com dans 2-3 minutes.
