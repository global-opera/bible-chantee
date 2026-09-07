# Tests du lecteur — mode d'emploi

Ces scripts pilotent un **vrai Chrome** via le protocole CDP (aucune dépendance à
installer : `WebSocket` est natif dans Node ≥ 21). Ils servent de preuve pour la
ligne `Smoke tests: FR ✅ PT ✅ EN ✅` exigée par les hooks git du dépôt.

## Lancer

```sh
# 1. servir le dépôt
python -m http.server 8899 --bind 127.0.0.1

# 2. ouvrir un Chrome pilotable (profil jetable, audio muet)
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --remote-debugging-port=9333 \
  --user-data-dir=C:/tmp/bc-test/profile --no-first-run \
  --autoplay-policy=no-user-gesture-required --mute-audio about:blank

# 3. jouer les tests
node tests/suite.mjs                       # 36 contrôles de non-régression
node tests/extra.mjs                       # 8 cas limites
node tests/labels-check.mjs                # balises Suno sur les 7132 chapitres
node tests/sweep.mjs lecteur.html promesses.html prieres.html confessions.html
node tests/a11y.mjs                        # accessibilité + référencement
```

Pour tester **la production** au lieu du local, changer la constante en tête de
fichier : `const BASE = 'https://biblechantee.com/';`

## Arrêter le Chrome de test

⚠️ Jamais `taskkill /IM chrome.exe` : le Chrome personnel a des dizaines
d'onglets ouverts. Cibler le profil de test :

```powershell
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
  Where-Object { $_.CommandLine -like '*bc-test*' } | Stop-Process -Force
```

## Ce que couvre `suite.mjs`

| Bloc | Vérifie |
|---|---|
| T1 | lecture continue : audio **et** paroles avancent ensemble |
| T2 | changement de livre : l'audio suit le livre affiché |
| T3 | flèches ⏮ / ⏭ : sous-titre, paroles, cœur des favoris |
| T4 | onglet masqué rafraîchi au retour dessus |
| T5 | résultat de recherche : sélecteurs et audio synchronisés |
| T6 | changement de langue FR → EN → PT : chapitre conservé, audio et paroles traduits |
| T7 | mode radio : passage au titre suivant |
| T8 | 0 erreur JS, Bible JSON téléchargée une seule fois, poids de chargement |

## Astuces qui ont coûté du temps

- L'événement de fin de piste se simule sans jouer 3 minutes d'audio :
  `audioPlayer.dispatchEvent(new Event('ended'))`.
- `localStorage` est inaccessible sur `about:blank` → passer la langue par l'URL
  (`?lang=EN`), que `lecteur.html` sait lire.
- Sans `Network.setCacheDisabled`, Chrome ressert l'ancien `js/semantic-engine.js`
  et on croit que le correctif n'a pas pris.
- Bloquer `*google-analytics.com*` et `*googletagmanager.com*` pour ne pas
  polluer les statistiques GA4 du site avec les visites de test.
