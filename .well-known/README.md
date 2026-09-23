# Google Play TWA — Digital Asset Links

L'application Play est une **TWA** : elle n'embarque pas le site, elle l'ouvre.
`assetlinks.json` est ce qui autorise `com.biblechantee.twa` à afficher
`biblechantee.com` **sans la barre d'adresse du navigateur**.

- **Paquet :** `com.biblechantee.twa`
- **Point d'entrée :** `/lecteur.html` (`start_url` du manifeste)
- **Vérification en ligne :** <https://biblechantee.com/.well-known/assetlinks.json>
  — répond 200, `_headers` force le `Content-Type: application/json`.

## 🔴 Quelle empreinte doit figurer dans ce fichier

Avec la **signature d'application Play**, on téléverse avec sa clé d'upload, puis
**Google re-signe l'AAB avec sa propre clé**. C'est cette dernière — et non la clé
d'upload — qui doit être déclarée ici.

Source de vérité : **Play Console → Configuration → Intégrité de l'application →
Signature d'application**. Ne jamais recopier une empreinte trouvée dans un ancien
document.

### Empreintes actuellement déclarées (elles font foi : l'app fonctionne)

```
16:D1:03:09:A8:57:C8:38:D6:5D:3F:D5:6A:29:B0:6A:2C:9E:6A:5D:D8:29:D9:A6:77:C6:43:20:25:2A:F5:AB
27:B9:38:63:66:BD:C5:A0:A8:A4:97:1E:34:17:63:B7:2E:D2:4B:15:EC:DF:A5:3E:46:B3:76:CF:27:74:11:4E
```

### ⚠️ Deux empreintes périmées qui circulent encore

Elles ont induit en erreur lors de l'audit du 23.09.2026. **Ne pas les remettre ici.**

| Empreinte | Ce que c'est réellement |
|---|---|
| `7E:A5:E7:44:55:4E:8D:D7:…:3D:51:27:1B` | keystore PWA Builder d'origine, d'avant la reprise en main par la signature Play. Cette version du présent fichier l'annonçait à tort comme l'empreinte de production. |
| `53:5F:…:A9:F9` | clé de **téléversement**, pas la clé de signature. Sert à envoyer l'AAB, jamais à valider le lien. |

## Fichiers sensibles — jamais dans git

Conservés hors dépôt, dans
`Desktop\LOGO Bible chantee\Bible Chantée - Google Play package\` :

- `signing.keystore` — certificat de téléversement (alias `my-key-alias`)
- `signing-key-info.txt` — mots de passe

Sans eux, plus aucune mise à jour de l'app n'est possible.

## Rappel utile

La TWA n'affiche que le site : **corriger le site corrige l'app**, sans republier
d'AAB. Republier n'est nécessaire que si le paquet, les icônes ou le `start_url`
changent.

*Mis à jour le 23.09.2026.*
