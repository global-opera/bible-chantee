-- ============================================
-- Bible Chantée - Schéma Supabase Complet
-- ============================================
-- Version: 2.0
-- Date: 2026-01-01
--
-- Tables:
-- - users: Utilisateurs avec système de crédits et premium
-- - transactions: Historique des paiements et actions
-- - bc_referrals: Système de parrainage

-- ============================================
-- 1. TABLE USERS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    -- Identifiants
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid TEXT UNIQUE NOT NULL,  -- UID généré côté frontend
    email TEXT UNIQUE NOT NULL,

    -- Système de crédits et premium
    credits INTEGER DEFAULT 100,
    is_premium BOOLEAN DEFAULT false,
    early_adopter BOOLEAN DEFAULT false,
    premium_expires_at TIMESTAMP WITH TIME ZONE,

    -- Stripe
    stripe_customer_id TEXT,

    -- Métadonnées
    preferred_language TEXT DEFAULT 'fr',
    total_plays INTEGER DEFAULT 0,
    unlocked_chapters TEXT[] DEFAULT '{}'::TEXT[],

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_premium ON users(is_premium);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

-- Commentaires
COMMENT ON TABLE users IS 'Utilisateurs de Bible Chantée avec système de crédits et premium';
COMMENT ON COLUMN users.uid IS 'UID unique généré côté frontend (ex: uid_1234567890_abc123)';
COMMENT ON COLUMN users.credits IS 'Nombre de crédits disponibles (1 crédit = 1 chapitre)';
COMMENT ON COLUMN users.is_premium IS 'Utilisateur premium avec accès illimité';
COMMENT ON COLUMN users.early_adopter IS 'Inscrit avant le lancement officiel';

-- ============================================
-- 2. TABLE TRANSACTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_uid TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,

    -- Type de transaction
    type TEXT NOT NULL CHECK (type IN ('purchase', 'play', 'bonus', 'referral', 'refund')),
    amount INTEGER NOT NULL, -- En cents pour purchase, en crédits pour les autres

    -- Détails
    description TEXT,
    chapter_id TEXT,

    -- Stripe
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,

    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_transactions_user_uid ON transactions(user_uid);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_session ON transactions(stripe_session_id);

-- Commentaires
COMMENT ON TABLE transactions IS 'Historique de toutes les transactions (paiements, écoutes, bonus)';
COMMENT ON COLUMN transactions.type IS 'purchase=achat premium, play=écoute chapitre, bonus=crédits offerts, referral=parrainage';
COMMENT ON COLUMN transactions.amount IS 'Montant en cents (purchase) ou nombre de crédits (autres types)';

-- ============================================
-- 3. TABLE BC_REFERRALS (Parrainage)
-- ============================================

CREATE TABLE IF NOT EXISTS bc_referrals (
    referred_uid TEXT PRIMARY KEY REFERENCES users(uid) ON DELETE CASCADE,
    referrer_uid TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    awarded_credits INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON bc_referrals(referrer_uid);

-- Commentaires
COMMENT ON TABLE bc_referrals IS 'Système de parrainage - 10 crédits par filleul';

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bc_referrals ENABLE ROW LEVEL SECURITY;

-- Policies pour users
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
    ON users FOR SELECT
    USING (true); -- Lecture publique pour bc_signup et bc_me

DROP POLICY IF EXISTS "Service role can insert users" ON users;
CREATE POLICY "Service role can insert users"
    ON users FOR INSERT
    WITH CHECK (true); -- Insert via Netlify Functions avec service_role key

DROP POLICY IF EXISTS "Service role can update users" ON users;
CREATE POLICY "Service role can update users"
    ON users FOR UPDATE
    USING (true); -- Update via Netlify Functions

-- Policies pour transactions
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
CREATE POLICY "Users can read own transactions"
    ON transactions FOR SELECT
    USING (true); -- Lecture publique

DROP POLICY IF EXISTS "Service role can insert transactions" ON transactions;
CREATE POLICY "Service role can insert transactions"
    ON transactions FOR INSERT
    WITH CHECK (true); -- Insert via Netlify Functions

-- Policies pour bc_referrals
DROP POLICY IF EXISTS "Users can read referrals" ON bc_referrals;
CREATE POLICY "Users can read referrals"
    ON bc_referrals FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Service role can insert referrals" ON bc_referrals;
CREATE POLICY "Service role can insert referrals"
    ON bc_referrals FOR INSERT
    WITH CHECK (true);

-- ============================================
-- 5. FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction RPC pour ajouter des crédits (utilisée par bc_signup pour referral)
CREATE OR REPLACE FUNCTION bc_add_credits(p_uid TEXT, p_amount INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE users
    SET credits = credits + p_amount,
        updated_at = NOW()
    WHERE uid = p_uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. VUE ADMIN STATS
-- ============================================

CREATE OR REPLACE VIEW admin_stats AS
SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE is_premium = true) as premium_users,
    COUNT(*) FILTER (WHERE credits >= 100) as users_100plus_credits,
    COUNT(*) FILTER (WHERE early_adopter = true) as early_adopters,
    SUM(credits) as total_credits,
    AVG(credits)::INTEGER as avg_credits,
    SUM(total_plays) as total_plays,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as signups_last_24h,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as signups_last_7d
FROM users;

COMMENT ON VIEW admin_stats IS 'Vue pour le dashboard admin avec statistiques en temps réel';

-- ============================================
-- 7. DONNÉES DE TEST (optionnel - décommenter si besoin)
-- ============================================

-- Créer un utilisateur de test
-- INSERT INTO users (uid, email, credits, is_premium, early_adopter)
-- VALUES ('uid_test_123', 'test@biblechantee.com', 50, false, false)
-- ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- FIN DU SCHÉMA
-- ============================================

-- Vérifications finales
SELECT 'Schema creation completed!' as status;
SELECT * FROM admin_stats;
