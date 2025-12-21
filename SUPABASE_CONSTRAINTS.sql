-- ========================================
-- CONTRAINTES DE SÉCURITÉ SUPABASE
-- À exécuter dans Supabase → SQL Editor
-- ========================================

-- 1) S'assurer que la table bc_users a bien la contrainte UNIQUE sur email
-- (devrait déjà exister si vous avez suivi REFERRAL_SETUP.md)
ALTER TABLE public.bc_users
  ADD CONSTRAINT bc_users_email_unique UNIQUE (email);

-- 2) BONUS: Index UNIQUE case-insensitive sur email (sans extension citext)
-- Cela empêche User@Test.COM et user@test.com d'exister simultanément côté DB
DROP INDEX IF EXISTS bc_users_email_lower_idx;
CREATE UNIQUE INDEX bc_users_email_lower_idx ON public.bc_users (LOWER(email));

-- 3) Vérifier les doublons existants (à exécuter AVANT d'ajouter les contraintes)
-- Cette requête détecte les emails en doublon (majuscules/minuscules)
SELECT LOWER(email) as email_normalized, COUNT(*) as count
FROM public.bc_users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;

-- 4) Si des doublons existent, les nettoyer d'abord :
-- ATTENTION : Cela supprime les comptes en doublon (garde le plus ancien)
-- Décommentez seulement si la requête #3 retourne des résultats
/*
DELETE FROM public.bc_users
WHERE uid IN (
  SELECT uid FROM (
    SELECT uid, ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY created_at ASC) as rn
    FROM public.bc_users
  ) t WHERE rn > 1
);
*/

-- 5) Vérifier que referred_uid est bien PRIMARY KEY dans bc_referrals
-- (devrait déjà être le cas)
-- Cela empêche qu'un utilisateur soit parrainé plusieurs fois
ALTER TABLE public.bc_referrals
  DROP CONSTRAINT IF EXISTS bc_referrals_pkey;

ALTER TABLE public.bc_referrals
  ADD CONSTRAINT bc_referrals_pkey PRIMARY KEY (referred_uid);

-- ========================================
-- TESTS DE VALIDATION
-- ========================================

-- Test 1: Essayer d'insérer 2 emails identiques (devrait échouer)
-- INSERT INTO public.bc_users (uid, email, credits)
-- VALUES ('test1', 'test@example.com', 0);
-- INSERT INTO public.bc_users (uid, email, credits)
-- VALUES ('test2', 'test@example.com', 0);
-- → Attendu: ERROR: duplicate key value violates unique constraint "bc_users_email_unique"

-- Test 2: Essayer d'insérer email avec casse différente (devrait échouer)
-- INSERT INTO public.bc_users (uid, email, credits)
-- VALUES ('test3', 'Test@Example.COM', 0);
-- → Attendu: ERROR: duplicate key value violates unique constraint "bc_users_email_lower_idx"

-- Test 3: Vérifier qu'un utilisateur ne peut être parrainé qu'une fois
-- INSERT INTO public.bc_referrals (referred_uid, referrer_uid, awarded_credits)
-- VALUES ('userX', 'userA', 10);
-- INSERT INTO public.bc_referrals (referred_uid, referrer_uid, awarded_credits)
-- VALUES ('userX', 'userB', 10);
-- → Attendu: ERROR: duplicate key value violates unique constraint "bc_referrals_pkey"

-- ========================================
-- MONITORING & AUDIT
-- ========================================

-- Voir les utilisateurs créés récemment
SELECT uid, email, credits, created_at
FROM public.bc_users
ORDER BY created_at DESC
LIMIT 20;

-- Voir les parrainages récents
SELECT referred_uid, referrer_uid, awarded_credits, created_at
FROM public.bc_referrals
ORDER BY created_at DESC
LIMIT 20;

-- Top 10 parrains
SELECT referrer_uid,
       COUNT(*) as nb_parrainages,
       SUM(awarded_credits) as total_credits_awarded
FROM public.bc_referrals
GROUP BY referrer_uid
ORDER BY nb_parrainages DESC
LIMIT 10;

-- Détecter des abus potentiels (trop de parrainages en peu de temps)
SELECT referrer_uid,
       COUNT(*) as parrainages_1h,
       MAX(created_at) - MIN(created_at) as time_span
FROM public.bc_referrals
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY referrer_uid
HAVING COUNT(*) > 5
ORDER BY parrainages_1h DESC;
