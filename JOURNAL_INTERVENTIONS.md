# Journal des interventions — biblechantee.com

Historique technique du site et de l'app (l'app Play Store est une TWA qui affiche
ce site : corriger le site corrige l'app, sans republier d'AAB).

Ordre : le plus récent en haut. Une entrée par intervention, avec ce qui a été
changé, **pourquoi**, comment ça a été vérifié, et ce qui reste ouvert.

Journaux antérieurs, hors périmètre de celui-ci :
- production des MP3 (nov. 2025 → janv. 2026) :
  `Documents\Archives Bureau\rapports claude\JOURNAL_BIBLE_CHANTEE_FR_CHRONOLOGIE.md`
- démarches administratives : `C:\PARTAGE ADMIN\Budget\JOURNAL_DE_BORD.md`

---

## 2026-09-07 — Audit global et correction de 9 défauts · commit `19700dd6` · EN LIGNE

**Déclencheur.** Signalement utilisateur : « en lecture automatique continue,
l'audio change mais les paroles non ». Puis, le constat qui a motivé l'audit :
« comme je découvre chaque fois un problème, fais un audit global ».

### Cause première : 9 chemins concurrents

`lecteur.html` n'avait pas de fonction « aller au chapitre X ». Chacun des
9 déclencheurs (menu livre, menu chapitre, ⏮, ⏭, lecture continue, mode radio,
résultat de recherche, changement de langue, démarrage) refaisait à la main sa
propre liste de mises à jour — et chacun en oubliait une ou deux. D'où
l'impression de taupes qui ressortent une à une.

Remplacés par une fonction unique :

```js
goToChapter(livre, chapitre, { play, audio })
// met à jour : sélecteurs, titre, sous-titre, audio, paroles, Bible, favori
```

🔴 **Règle pour la suite : ne jamais recâbler un bouton de navigation en direct.**
Tout nouveau déclencheur passe par `goToChapter`, sinon le défaut réapparaît.

### Les 9 défauts corrigés

| # | Défaut | Symptôme visible |
|---|---|---|
| 1 | lecture continue | l'audio avançait, les paroles restaient au chapitre précédent |
| 2 | changement de livre | **l'audio ne changeait pas du tout** : on écoutait la Genèse en lisant les Psaumes |
| 3 | bouton ⏮ | sous-titre resté sur le chapitre d'avant |
| 4 | ⏮ / ⏭ | le cœur des favoris restait allumé |
| 5 | résultat de recherche | l'onglet Bible n'était pas rechargé |
| 6 | onglet masqué | revenir sur « Paroles » affichait le chapitre précédent |
| 7 | changement de langue | lecture arrêtée en silence, bouton resté sur « pause » ; sous-titre dans l'ancienne langue |
| 8 | recherche | 50 résultats au lieu de 8, tous marqués « Score: 1% », classement non pertinent |
| 9 | bouton « + 📻 » | `TypeError` sur `#radioBadge` (absent du balisage) : jamais de confirmation ✓ |

### Poids de chargement : 5,6 Mo → 1,59 Mo transférés

Mesuré sur biblechantee.com, cache vidé, compression incluse.

- `lyrics-data.js` et `lyrics-data-v2.js` (3,7 Mo brut / 806 Ko compressés) étaient
  chargés à chaque visite et **lus par aucune ligne de code**. Balises retirées.
- Les 6 autres langues (~2,3 Mo compressés) ne se chargent plus qu'à la demande,
  via `ensureLyricsData(lang)`.
- La Bible française (6,6 Mo brut / 1,45 Mo compressés) était téléchargée **deux
  fois** au démarrage : `loadLyrics()` puis `updateTranslations()` la redemandaient
  avant que le cache mémoire ne soit rempli. Cache par promesse (`loadBibleJson`),
  et `updateTranslations()` ne recharge plus le texte.

🔴 **Piège à connaître : en FR, les paroles affichées SONT le texte biblique
Segond** (l'audio chante Segond). Donc l'onglet Paroles et l'onglet Bible lisent
le même JSON de 6,6 Mo — d'où le doublon. Ne pas « optimiser » l'un sans l'autre.

### Paroles : nettoyage des balises Suno

L'ancien nettoyage avait une liste blanche (`[TITLE]`, `[LYRICS]`, sections
anglaises). Tout le reste s'affichait en clair : `[TITRE]`, `[RITORNELLO]`,
`[KORO]`, `[CORAÇÃO]`, `[PRÉ-REFRÃO]`… une cinquantaine de variantes.

Règle générale à la place : **une balise en début de ligne est une balise de
structure ; une balise au milieu d'une phrase est du texte biblique** (ainsi
`[des pillards Amalécites]` en 1 Ch 12:21 est conservé). Idem pour les libellés
sans crochets entourés de markdown (`**Verso 1**`).

Vérifié sur **les 7132 chapitres des 6 langues : 0 balise et 0 libellé restants**.

### Hygiène de déploiement

Le site publiait la racine du dépôt. Étaient accessibles en ligne :
`Scripts/*.py`, `docs/*.md`, `BIBLE_DU_PROJET_Bible_Chantee.html` (métriques et
taux de conversion), les notes d'audit, les sauvegardes, les pages de test, et
`/fr/ /en/ /pt/` qui annonçaient encore « 100 gratuits + $0.99 pour tout
débloquer ». Vérifié : **aucun secret** dedans (les clés des docs sont des
exemples `sk-votre-cle-ici`, `api_key.py` est bien dans `.gitignore`).

- 60 règles `404` dans `netlify.toml`, sans déplacer un seul fichier (réversible).
- `/fr/`, `/en/`, `/pt/` → `301` vers `/lecteur.html`.

🔴 **Tout nouveau fichier interne à la racine (note, script, rapport) doit être
ajouté à ces règles**, sinon il est publié.
⚠️ Ne PAS bloquer `bibles/`, `lyrics/` ni `data/` : les pages les lisent à
l'exécution (`confessions.html`, `prieres.html`, `promesse-detail.html`, les
deux tableaux de bord).

### Serveur

- `/api/bc_signup` renvoyait **404** : la ligne de routage manquait dans
  `_redirects`, le formulaire d'inscription échouait en silence. Ajoutée.
- `bc_me` renvoyait email + crédits de n'importe quel `uid`, sans
  authentification, avec la clé `service_role` (RLS contournée). Désormais
  **fermé par défaut** : sans la variable d'environnement `BC_API_TOKEN` il
  répond 404 ; sinon en-tête `x-bc-token` obligatoire, et plus d'email renvoyé.
- `premium-claim` : deux cookies dans un seul en-tête `Set-Cookie` séparés par
  une virgule (le second pouvait être perdu) → `multiValueHeaders`.

### Service worker : réparé, volontairement laissé éteint

🔴 **Aucune page n'enregistre le service worker** (l'appel a été retiré le
2025-12-24). Le site n'a donc **aucun mode hors-ligne**, et `service-worker.js`
ne tourne que chez les visiteurs qui en ont gardé un enregistrement de
décembre 2025. Décision du 2026-09-07 : le réparer sans le rebrancher.

Corrigé : `/credits-system.js` inexistant faisait échouer `cache.addAll()` **en
bloc** (donc rien n'était mis en cache), HTML en réseau-d'abord, cache MP3
plafonné à 40 fichiers.

### Référencement et accessibilité

`canonical`, 8 `hreflang`, `robots.txt`, `sitemap.xml` (21 URL), un `<h1>`,
`<html lang>` qui suit la langue choisie, nom accessible sur **tous** les boutons
(9 n'en avaient aucun), menus déroulants reliés à leur intitulé.

⚠️ Cloudflare ne remplace pas notre `robots.txt` : il **préfixe** son bloc de
content-signals. Nos directives sont bien servies (lignes 71 à 87 du fichier
rendu).

### Vérifications (toutes rejouées contre le site en ligne)

| Test | Résultat |
|---|---|
| Non-régression du lecteur (`suite.mjs`) | 36 / 36 |
| Cas limites : fin de livre, partage, lien profond (`extra.mjs`) | 8 / 8 |
| Balises Suno sur 7132 chapitres (`labels-check.mjs`) | 0 résidu |
| 12 pages publiques (`sweep.mjs`) | 0 erreur JS, 0 requête en échec |
| Accessibilité / référencement (`a11y.mjs`) | tout au vert |
| Audio R2 : 154 chapitres × 7 langues + 153 URL prières/confessions/promesses | 307 / 307 |

Les scripts sont versionnés dans **`tests/`** (mode d'emploi : `tests/README.md`).
Ils pilotent un vrai Chrome via CDP, sans dépendance à installer, et tournent
aussi bien contre le local que contre la production. Une copie dort aussi dans
`_BACKUP_AUDIT_20260907_114852/`, mais ce dossier est ignoré par git
(`.gitignore:70`) donc un `git clean -fdx` l'effacerait : la référence, c'est
`tests/`.

### Reste ouvert — contenu, décision éditoriale

**5 chapitres ont un audio mais aucune parole affichée** : EN Jérémie 3,
EN 2 Corinthiens 2, TL Genèse 28, 30, 33. Ils affichent le message « paroles non
disponibles → onglet Bible », ce qui est le comportement voulu.

🔴 Ce ne sont **pas des fichiers manquants** : ils existent sur le Drive
(`G:\Mon Drive\01 BibleChantee\Lyrics\`) mais sont inutilisables, et le pipeline
d'import les a écartés à juste titre :

| Fichier | Problème |
|---|---|
| `TL/01_GEN/01_GEN_28_TL.txt` | **écrit en français**, BOM au milieu du texte, caractères cassés |
| `TL/01_GEN/01_GEN_30_TL.txt` | **écrit en français** |
| `TL/01_GEN/01_GEN_33_TL.txt` | **écrit en français** |
| `EN/24_JER/24_JER_03_EN.txt` | « I'm not a man » répété 4×, « played the Harley » pour *harlot* |
| `EN/47_2CO/47_2CO_02_EN.txt` | texte fragmenté (« You / In the heaviness of / You ») |

❓ **À écouter, question ouverte** : si les paroles tagalog de Genèse 28/30/33
étaient en français, l'audio généré par Suno chante peut-être en français dans le
catalogue tagalog. À vérifier à l'oreille :
`https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/TL/01_GEN/01_GEN_28_TL.mp3`
(idem `_30_` et `_33_`).

**8 titres de chapitres** mélangent français et langue cible — `My Berger, Ma
Light` pour le Psaume 23 en anglais. Liste dans
`_BACKUP_AUDIT_20260907_114852/titres-a-corriger.txt`. À corriger dans
`js/chapter-titles.js`, ce sont des titres chantés donc un choix éditorial.

### Reste ouvert — technique, non fait volontairement

- **Pas de Content-Security-Policy** : le site est truffé de scripts inline, une
  CSP demande une passe de test par page. Les autres en-têtes sont posés.
- **Les 1,45 Mo restants** au démarrage sont la Bible complète chargée pour un
  seul chapitre. La découper par livre la ferait tomber sous 100 Ko — chantier à
  part, il touche l'onglet Bible ET les paroles FR.
- **Service worker** : à rebrancher ou à supprimer, l'état actuel (déployé mais
  non enregistré) est un entre-deux.
- **`js/player.js`** (1068 lignes) n'est plus référencé depuis le 2026-03-08 et
  contient une logique concurrente de celle du lecteur. Non supprimé pour ne rien
  casser, mais c'est un piège : c'est le premier fichier qu'on ouvre en cherchant
  « autoplay ». `player_carre.html` a de même une version fausse de la résolution
  des codes R2.

---

## 2026-08-28 — Nom du titre dans le partage WhatsApp · commit `bf9c5d9f`

`getShareInfo()` construit le libellé partagé (« Genèse 50 - Lumière dans le
Deuil ») et l'URL `?lang=&book=&ch=`. Dédoublonne la référence quand le titre
stocké la répète déjà.

## 2026-08-22 — Journée « les 8323 chapitres sont jouables » · commits `44b1625d` → `70d1605e`

- `cbb9cb6c` : `resolveR2Codes(livre, langue)` — la règle de nommage R2 (dossier
  OSIS en EN/PT/ES/DE pour 7 livres, fichier au code `books.js`, alias
  `22_SNG→22_SON` et `59_JAM→59_JAS`). Ce décalage faisait croire à 379 chapitres
  manquants alors que **tout était en ligne**.
- `ed48b08e` : renvoi vers l'onglet Bible quand un chapitre n'a pas de paroles.
- `666269f3`, `70d1605e` : import de 383 textes chantés depuis le Drive,
  24 chapitres écartés au contrôle qualité.
- `cdb13aad`, `363668f5` : boutons Spotify et Apple Music dans la barre de nav.

🔴 Leçon retenue deux fois : **un 404 sur R2 ne prouve pas l'absence du fichier**.
Avant de conclure à un manque de contenu, chercher le MP3 sur le Drive et
comparer son chemin réel à l'URL construite.

---

## Automatisme quotidien

Un commit `Auto-update social stats <date>` arrive chaque jour sur `main` et ne
touche que `data/social-stats.json`. Il faut donc **toujours `git pull --rebase`
avant de pousser**, sinon le push est rejeté.

## Contraintes permanentes du dépôt

- Hooks locaux `.git/hooks/commit-msg` et `.git/hooks/pre-push` : tout commit ou
  push est bloqué si le message ne contient pas une ligne
  `Smoke tests: ... FR ... PT ... EN`. Exception : commits ne touchant que
  `.md`, `.txt` ou `.git-hooks/`.
- `/` redirige (302) vers `lecteur.html` : la vraie page d'accueil est
  `lecteur.html`, pas `index.html`.
- ⚠️ `privacy.html` est conservé sans être référencé : c'est vraisemblablement
  l'URL déclarée dans la Google Play Console. Ne pas le supprimer.
