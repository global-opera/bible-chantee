# Archive du 2026-09-23

Fichiers retirés de la racine parce qu'ils n'étaient plus chargés par aucune page.
**Rien n'a été supprimé** : tout est ici, et l'historique git reste intact.

Ce dossier est bloqué en 404 par `netlify.toml` et exclu du miroir GitHub Pages
(`deploy-pages.yml` exclut `_archive_*`).

---

## `audio-urls-obsoletes/` — 16 fichiers, ~680 Ko

### Pourquoi ils sont morts

`lecteur.html` **ne consulte aucune table d'URL**. Il construit l'adresse à la volée :

```js
resolveR2Codes(book, lang)   // applique les alias de fichier et les dossiers OSIS
getAudioUrl(book, chapter, lang)
// → https://pub-….r2.dev/{LANG}/{DOSSIER}/{FICHIER}_{CC}_{LANG}.mp3
```

`promesse-detail.html` fait de même, et son propre commentaire le disait déjà :
« *js/audio-urls-\*.js: optional, getAudioUrl() falls back to R2 directly* ».

### Comment cela a été vérifié avant de déplacer

1. Aucune balise `<script src="…">` ne les charge — vérifié sur tout le dépôt.
2. Les seuls fichiers qui citent encore leurs noms sont leurs **propres générateurs**
   (`generate-audio-urls-es.py`, etc.), conservés à la racine.
3. **Capture réseau réelle** : `lecteur.html` chargé dans un Chrome headless piloté par
   CDP — 28 requêtes, **aucune** vers un `audio-urls-*.js`.

### Contenu

| Fichier | Taille | Ce que c'était |
|---|---|---|
| `audio-urls.js`, `audio-urls-v2.js` | 101 + 93 Ko | anciennes tables pointant sur **archive.org**, avant la bascule sur R2 |
| `audio-urls-fr/en/es/pt.js` | ~117 Ko chacun | tables R2 chapitre par chapitre, remplacées par `getAudioUrl()` |
| `audio-urls-ar/de/hi/it/ko/ru/tl/zh.js` | ~90 o chacun | placeholders « 0 chapters » |
| `audio-urls-promesses-fr.js`, `audio-urls-promessas-pt.js` | 2 Ko chacun | globales `audioUrlsPromessesFR` / `PromessasPT` que personne ne lisait |

> ⚠️ **Les placeholders étaient activement trompeurs.** Leur « 0 chapters » pour DE, IT
> et TL donnait à croire que ces langues n'avaient pas d'audio. C'est faux : elles sont
> complètes sur R2 et jouables. La couverture audio ne se déduit **jamais** de ces
> fichiers — seul `getAudioUrl()` fait foi.

### Ce qui reste vivant à la racine

Les 14 tables réellement chargées : `audio-urls-confessions-*.js` (par
`confessions.html`) et `audio-urls-prayers-*.js` (par `prieres.html`), 7 langues chacune.
Confirmé par la même capture réseau.

---

## `pages-hors-projet/` — 2 fichiers

`bus.html` et `sxc-bus-2025.html` : horaires de transport (Carto Riviera, CFF), sans
aucun rapport avec Bible Chantée. Comme la racine du dépôt **est** le site, ils étaient
publiés en ligne.
