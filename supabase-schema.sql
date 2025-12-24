-- ============================================
-- Bible Chantée - Schéma Supabase
-- ============================================

-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    credits INTEGER DEFAULT 100,
    is_premium BOOLEAN DEFAULT false,
    early_adopter BOOLEAN DEFAULT false,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,

    -- Métadonnées
    preferred_language TEXT DEFAULT 'fr',
    total_plays INTEGER DEFAULT 0,
    unlocked_chapters TEXT[] DEFAULT '{}'::TEXT[]
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_premium ON users(is_premium);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Activer Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent lire leurs propres données
CREATE POLICY "Users can read own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Policy: Les utilisateurs peuvent mettre à jour leurs propres données
CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Permettre l'insertion via Service Role Key (backend)
CREATE POLICY "Service role can insert"
    ON users FOR INSERT
    WITH CHECK (true);

-- Function pour mettre à jour updated_at automatiquement
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

-- ============================================
-- Table pour l'historique des transactions
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'play', 'purchase', 'refund', 'bonus'
    amount INTEGER NOT NULL, -- Négatif pour débit, positif pour crédit
    chapter_id TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- ============================================
-- Vue pour les statistiques admin
-- ============================================

CREATE OR REPLACE VIEW admin_stats AS
SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE is_premium = true) as premium_users,
    COUNT(*) FILTER (WHERE credits >= 100) as users_100plus_credits,
    COUNT(*) FILTER (WHERE early_adopter = true) as early_adopters,
    SUM(credits) as total_credits,
    AVG(credits)::INTEGER as avg_credits,
    SUM(total_plays) as total_plays
FROM users;

-- ============================================
-- Commentaires pour documentation
-- ============================================

COMMENT ON TABLE users IS 'Utilisateurs de Bible Chantée avec système de crédits';
COMMENT ON COLUMN users.credits IS 'Nombre de crédits disponibles (1 crédit = 1 chapitre)';
COMMENT ON COLUMN users.is_premium IS 'Utilisateur premium avec accès illimité';
COMMENT ON COLUMN users.early_adopter IS 'Inscrit avant le lancement officiel';
COMMENT ON TABLE transactions IS 'Historique des transactions de crédits';
