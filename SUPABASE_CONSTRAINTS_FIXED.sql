-- ========================================
-- CONTRAINTES DE SÉCURITÉ SUPABASE - VERSION CORRIGÉE
-- À exécuter dans Supabase → SQL Editor
-- ORDRE CORRECT : Vérifier → Nettoyer → Contraindre
-- ========================================

-- ========================================
-- ÉTAPE 1 : VÉRIFICATION (à faire en PREMIER)
-- ========================================

-- 1.1) Vérifier les doublons email existants (majuscules/minuscules)
SELECT LOWER(email) as email_normalized, COUNT(*) as count, STRING_AGG(uid, ', ') as uids
FROM public.bc_users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;

-- Si cette requête retourne des lignes → STOP et exécute l'étape 1.2 d'abord

-- 1.2) Nettoyer les doublons (décommentez SEULEMENT si étape 1.1 retourne des lignes)
/*
DELETE FROM public.bc_users
WHERE uid IN (
  SELECT uid FROM (
    SELECT uid, ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY created_at ASC) as rn
    FROM public.bc_users
  ) t WHERE rn > 1
);
*/

-- 1.3) Vérifier qu'il n'y a plus de doublons
SELECT LOWER(email) as email_normalized, COUNT(*) as count
FROM public.bc_users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;
-- Doit retourner 0 lignes ✅

-- ========================================
-- ÉTAPE 2 : CONTRAINTES (après nettoyage)
-- ========================================

-- 2.1) Contrainte UNIQUE sur email (gestion safe si existe déjà)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bc_users_email_unique'
  ) THEN
    ALTER TABLE public.bc_users ADD CONSTRAINT bc_users_email_unique UNIQUE (email);
    RAISE NOTICE 'Contrainte bc_users_email_unique ajoutée';
  ELSE
    RAISE NOTICE 'Contrainte bc_users_email_unique existe déjà';
  END IF;
END $$;

-- 2.2) Index UNIQUE case-insensitive sur email (empêche User@Test.COM et user@test.com)
DROP INDEX IF EXISTS bc_users_email_lower_idx;
CREATE UNIQUE INDEX bc_users_email_lower_idx ON public.bc_users (LOWER(email));

-- 2.3) Contrainte NOT NULL sur bc_users.email (safe)
DO $$
BEGIN
  ALTER TABLE public.bc_users ALTER COLUMN email SET NOT NULL;
  RAISE NOTICE 'bc_users.email NOT NULL ajouté';
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'bc_users.email déjà NOT NULL ou erreur: %', SQLERRM;
END $$;

-- 2.4) Contrainte CHECK: crédits >= 0 (empêche crédits négatifs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bc_users_credits_positive'
  ) THEN
    ALTER TABLE public.bc_users ADD CONSTRAINT bc_users_credits_positive CHECK (credits >= 0);
    RAISE NOTICE 'Contrainte bc_users_credits_positive ajoutée';
  ELSE
    RAISE NOTICE 'Contrainte bc_users_credits_positive existe déjà';
  END IF;
END $$;

-- 2.5) PRIMARY KEY sur bc_referrals.referred_uid (une seule fois)
ALTER TABLE public.bc_referrals DROP CONSTRAINT IF EXISTS bc_referrals_pkey;
ALTER TABLE public.bc_referrals ADD CONSTRAINT bc_referrals_pkey PRIMARY KEY (referred_uid);

-- 2.6) Contrainte CHECK: anti-self-referral au niveau DB (double protection)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bc_referrals_no_self_ref'
  ) THEN
    ALTER TABLE public.bc_referrals ADD CONSTRAINT bc_referrals_no_self_ref CHECK (referred_uid != referrer_uid);
    RAISE NOTICE 'Contrainte bc_referrals_no_self_ref ajoutée';
  ELSE
    RAISE NOTICE 'Contrainte bc_referrals_no_self_ref existe déjà';
  END IF;
END $$;

-- 2.7) Contrainte CHECK: awarded_credits > 0
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bc_referrals_credits_positive'
  ) THEN
    ALTER TABLE public.bc_referrals ADD CONSTRAINT bc_referrals_credits_positive CHECK (awarded_credits > 0);
    RAISE NOTICE 'Contrainte bc_referrals_credits_positive ajoutée';
  ELSE
    RAISE NOTICE 'Contrainte bc_referrals_credits_positive existe déjà';
  END IF;
END $$;

-- 2.8) Contrainte NOT NULL sur bc_referrals.referrer_uid
DO $$
BEGIN
  ALTER TABLE public.bc_referrals ALTER COLUMN referrer_uid SET NOT NULL;
  RAISE NOTICE 'bc_referrals.referrer_uid NOT NULL ajouté';
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'bc_referrals.referrer_uid déjà NOT NULL ou erreur: %', SQLERRM;
END $$;

-- ========================================
-- ÉTAPE 3 : VALIDATION (tests automatiques)
-- ========================================

-- 3.1) Test: Duplicate email (doit échouer)
DO $$
BEGIN
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_dup1', 'test@example.com', 0);
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_dup2', 'test@example.com', 0);
  RAISE EXCEPTION 'ERREUR: Duplicate email non détecté!';
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Test 3.1 PASS: Duplicate email bloqué ✅';
    DELETE FROM public.bc_users WHERE uid = 'test_dup1';
END $$;

-- 3.2) Test: Email case-insensitive (doit échouer)
DO $$
BEGIN
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_case1', 'case@example.com', 0);
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_case2', 'CASE@EXAMPLE.COM', 0);
  RAISE EXCEPTION 'ERREUR: Case-insensitive non détecté!';
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Test 3.2 PASS: Case-insensitive bloqué ✅';
    DELETE FROM public.bc_users WHERE uid = 'test_case1';
END $$;

-- 3.3) Test: Crédits négatifs (doit échouer)
DO $$
BEGIN
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_neg', 'neg@example.com', -10);
  RAISE EXCEPTION 'ERREUR: Crédits négatifs acceptés!';
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE 'Test 3.3 PASS: Crédits négatifs bloqués ✅';
END $$;

-- 3.4) Test: Self-referral (doit échouer)
DO $$
BEGIN
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_self', 'self@example.com', 0);
  INSERT INTO public.bc_referrals (referred_uid, referrer_uid, awarded_credits) VALUES ('test_self', 'test_self', 10);
  RAISE EXCEPTION 'ERREUR: Self-referral accepté!';
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE 'Test 3.4 PASS: Self-referral bloqué ✅';
    DELETE FROM public.bc_users WHERE uid = 'test_self';
END $$;

-- 3.5) Test: Double parrainage (doit échouer)
DO $$
BEGIN
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_ref1', 'ref1@example.com', 0);
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_ref2', 'ref2@example.com', 0);
  INSERT INTO public.bc_users (uid, email, credits) VALUES ('test_referred', 'referred@example.com', 0);

  INSERT INTO public.bc_referrals (referred_uid, referrer_uid, awarded_credits) VALUES ('test_referred', 'test_ref1', 10);
  INSERT INTO public.bc_referrals (referred_uid, referrer_uid, awarded_credits) VALUES ('test_referred', 'test_ref2', 10);
  RAISE EXCEPTION 'ERREUR: Double parrainage accepté!';
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Test 3.5 PASS: Double parrainage bloqué ✅';
    DELETE FROM public.bc_referrals WHERE referred_uid = 'test_referred';
    DELETE FROM public.bc_users WHERE uid IN ('test_ref1', 'test_ref2', 'test_referred');
END $$;

-- ========================================
-- ÉTAPE 4 : MONITORING
-- ========================================

-- Voir toutes les contraintes actives
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid IN ('public.bc_users'::regclass, 'public.bc_referrals'::regclass)
ORDER BY conrelid, conname;

-- Voir les utilisateurs récents
SELECT uid, email, credits, created_at
FROM public.bc_users
ORDER BY created_at DESC
LIMIT 10;

-- Voir les parrainages récents
SELECT referred_uid, referrer_uid, awarded_credits, created_at
FROM public.bc_referrals
ORDER BY created_at DESC
LIMIT 10;

-- Top parrains
SELECT referrer_uid, COUNT(*) as nb_parrainages, SUM(awarded_credits) as total_credits
FROM public.bc_referrals
GROUP BY referrer_uid
ORDER BY nb_parrainages DESC
LIMIT 10;

-- ========================================
-- RÉSUMÉ DES PROTECTIONS
-- ========================================
-- ✅ Email UNIQUE (bc_users_email_unique)
-- ✅ Email case-insensitive UNIQUE (bc_users_email_lower_idx)
-- ✅ Email NOT NULL
-- ✅ Crédits >= 0 (bc_users_credits_positive)
-- ✅ referred_uid PRIMARY KEY (une seule fois)
-- ✅ Anti-self-referral (bc_referrals_no_self_ref)
-- ✅ awarded_credits > 0 (bc_referrals_credits_positive)
-- ✅ referrer_uid NOT NULL
-- ========================================
