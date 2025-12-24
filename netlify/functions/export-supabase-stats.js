/**
 * Netlify Function pour exporter les statistiques Supabase
 * Accès automatique aux variables d'environnement Netlify
 */

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    try {
        // Récupérer les credentials depuis les variables d'environnement Netlify
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Variables d\'environnement Supabase manquantes',
                    supabaseUrl: supabaseUrl ? 'OK' : 'MISSING',
                    supabaseKey: supabaseKey ? 'OK' : 'MISSING'
                })
            };
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Récupérer TOUS les utilisateurs
        const { data: allUsers, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }

        // Calculer les statistiques
        const stats = {
            total: allUsers.length,
            premium: allUsers.filter(u => u.is_premium).length,
            with100Credits: allUsers.filter(u => u.credits >= 100).length,
            earlyAdopters: allUsers.filter(u => u.early_adopter).length,
            totalCredits: allUsers.reduce((sum, u) => sum + (u.credits || 0), 0),
            averageCredits: 0
        };

        stats.averageCredits = stats.total > 0
            ? Math.round(stats.totalCredits / stats.total)
            : 0;

        // Distribution des crédits
        const creditRanges = {
            '0': 0,
            '1-50': 0,
            '51-100': 0,
            '101-500': 0,
            '500+': 0
        };

        allUsers.forEach(u => {
            const credits = u.credits || 0;
            if (credits === 0) creditRanges['0']++;
            else if (credits <= 50) creditRanges['1-50']++;
            else if (credits <= 100) creditRanges['51-100']++;
            else if (credits <= 500) creditRanges['101-500']++;
            else creditRanges['500+']++;
        });

        // Top utilisateurs
        const topUsers = [...allUsers]
            .sort((a, b) => (b.credits || 0) - (a.credits || 0))
            .slice(0, 10)
            .map(u => ({
                email: u.email,
                credits: u.credits || 0,
                isPremium: u.is_premium,
                earlyAdopter: u.early_adopter,
                createdAt: u.created_at
            }));

        // Listes séparées
        const premiumUsers = allUsers
            .filter(u => u.is_premium)
            .map(u => ({
                email: u.email,
                credits: u.credits,
                createdAt: u.created_at
            }));

        const users100Plus = allUsers
            .filter(u => u.credits >= 100)
            .map(u => ({
                email: u.email,
                credits: u.credits,
                isPremium: u.is_premium,
                createdAt: u.created_at
            }));

        const earlyAdoptersUsers = allUsers
            .filter(u => u.early_adopter)
            .map(u => ({
                email: u.email,
                credits: u.credits,
                isPremium: u.is_premium,
                createdAt: u.created_at
            }));

        // Retourner toutes les données
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                generatedAt: new Date().toISOString(),
                stats,
                creditRanges,
                topUsers,
                lists: {
                    premium: premiumUsers,
                    with100Credits: users100Plus,
                    earlyAdopters: earlyAdoptersUsers
                },
                allUsers: allUsers.map(u => ({
                    email: u.email,
                    credits: u.credits || 0,
                    isPremium: u.is_premium,
                    earlyAdopter: u.early_adopter,
                    createdAt: u.created_at
                }))
            }, null, 2)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: error.message,
                stack: error.stack
            })
        };
    }
};
