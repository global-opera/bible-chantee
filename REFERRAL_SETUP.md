# Configuration du système de parrainage

## 1. Configuration Supabase

### Créer les tables SQL

Dans Supabase → SQL editor → Exécuter ce script :

```sql
-- Table des utilisateurs
create table if not exists public.bc_users (
  uid text primary key,
  email text unique,
  credits integer not null default 0,
  created_at timestamptz not null default now()
);

-- Table des parrainages
create table if not exists public.bc_referrals (
  referred_uid text primary key,
  referrer_uid text not null,
  awarded_credits integer not null default 10,
  created_at timestamptz not null default now()
);

-- Index pour optimiser les recherches
create index if not exists bc_referrals_referrer_idx
on public.bc_referrals (referrer_uid);

-- Fonction pour ajouter des crédits de manière atomique
create or replace function public.bc_add_credits(p_uid text, p_amount integer)
returns void
language plpgsql
as $$
begin
  insert into public.bc_users(uid, credits)
  values (p_uid, p_amount)
  on conflict (uid) do update set credits = public.bc_users.credits + p_amount;
end;
$$;
```

## 2. Configuration Netlify

### Variables d'environnement

Dans Netlify → Site settings → Environment variables, ajouter :

- **SUPABASE_URL** : Votre URL Supabase (ex: https://xxxxx.supabase.co)
- **SUPABASE_SERVICE_ROLE_KEY** : Votre clé Service Role (⚠️ Attention : ne jamais l'exposer côté client !)

### Installation des dépendances

```bash
cd C:\ScriptBible\bible-chantee
npm install
```

## 3. Déploiement

```bash
git add .
git commit -m "Add referral system: share links + signup awards 10 credits"
git push
```

## 4. Comment ça fonctionne

### Flux utilisateur

1. **A partage un lien** :
   - A clique sur "Partager (+10 crédits)"
   - Le lien contient `?ref=A&book=...&chapter=...`
   - A envoie ce lien à X

2. **X ouvre le lien** :
   - Le lecteur s'ouvre sur le morceau partagé
   - `bc_ref=A` est enregistré dans le localStorage de X

3. **X s'inscrit** :
   - X clique sur "S'inscrire"
   - X entre son email
   - Le système crée X et crédite A de +10 crédits (une seule fois)

4. **Protections** :
   - Chaque referred_uid est unique (clé primaire)
   - Si X essaie de s'inscrire plusieurs fois, le système ignore les doublons
   - Si X est déjà inscrit, aucun crédit supplémentaire n'est ajouté

### API Endpoints

- **POST /api/bc_signup** : Inscription et attribution des crédits
  - Body: `{ uid, email, ref }`
  - Retourne : `{ ok: true, awarded: boolean, me: { uid, email, credits } }`

- **GET /api/bc_me?uid=xxx** : Récupérer les crédits d'un utilisateur
  - Retourne : `{ ok: true, me: { uid, email, credits } }`

## 5. Fichiers créés

- ✅ `package.json` - Dépendances npm
- ✅ `netlify.toml` - Configuration Netlify (mise à jour)
- ✅ `netlify/functions/bc_signup.js` - Fonction d'inscription
- ✅ `netlify/functions/bc_me.js` - Fonction de récupération des crédits
- ✅ `signup.html` - Page d'inscription
- ✅ `lecteur.html` - Lecteur avec boutons partage et inscription (modifié)

## 6. Test local (optionnel)

Pour tester en local avec Netlify CLI :

```bash
npm install -g netlify-cli
netlify dev
```

## 7. Prochaines étapes

- [ ] Créer les tables Supabase (voir section 1)
- [ ] Configurer les variables d'environnement Netlify (voir section 2)
- [ ] Installer les dépendances : `npm install`
- [ ] Déployer sur Netlify : `git push`
- [ ] Tester le flux complet :
  1. Ouvrir un chapitre
  2. Cliquer "Partager"
  3. Ouvrir le lien dans un autre navigateur (mode privé)
  4. Cliquer "S'inscrire"
  5. Vérifier dans Supabase que les crédits ont été ajoutés
