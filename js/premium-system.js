/**
 * ============================================
 * Système Premium - Bible Chantée
 * ============================================
 *
 * Gère l'upgrade vers premium via Stripe
 * Inclure sur les pages: lecteur.html, promesse-detail.html, etc.
 *
 * Usage:
 * <script src="/js/premium-system.js"></script>
 * <button onclick="premiumSystem.showUpgradeModal()">Upgrade</button>
 */

const premiumSystem = {
    /**
     * Vérifier si l'utilisateur est premium
     */
    isPremium() {
        try {
            const userData = localStorage.getItem('bc_user');
            if (userData) {
                const user = JSON.parse(userData);
                return user.is_premium === true;
            }
        } catch (e) {
            console.error('Error checking premium status:', e);
        }
        return false;
    },

    /**
     * Obtenir l'UID de l'utilisateur
     */
    getUserUid() {
        try {
            // Priorité 1: bc_user (après signup backend)
            const userData = localStorage.getItem('bc_user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.uid) return user.uid;
            }

            // Priorité 2: bc_trial_email (popup email)
            const trialData = localStorage.getItem('bc_trial_email');
            if (trialData) {
                const trial = JSON.parse(trialData);
                if (trial.uid) return trial.uid;
            }
        } catch (e) {
            console.error('Error getting UID:', e);
        }

        return null;
    },

    /**
     * Obtenir l'email de l'utilisateur
     */
    getUserEmail() {
        try {
            // Priorité 1: bc_user
            const userData = localStorage.getItem('bc_user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.email) return user.email;
            }

            // Priorité 2: bc_trial_email
            const trialData = localStorage.getItem('bc_trial_email');
            if (trialData) {
                const trial = JSON.parse(trialData);
                if (trial.email) return trial.email;
            }
        } catch (e) {
            console.error('Error getting email:', e);
        }

        return null;
    },

    /**
     * Afficher le modal d'upgrade premium
     */
    showUpgradeModal() {
        if (this.isPremium()) {
            alert('Vous êtes déjà premium ! 🎉');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'upgradeModal';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, #1a237e 0%, #0a1628 100%);
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            text-align: center;
            color: white;
            box-shadow: 0 20px 60px rgba(245, 200, 66, 0.3);
        `;

        content.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 20px;">👑</div>
            <h1 style="color: #f5c842; margin-bottom: 20px; font-size: 2rem;">Passez Premium</h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px; line-height: 1.6;">
                Débloquez l'accès illimité à toute la Bible Chantée
            </p>

            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                <div style="margin-bottom: 10px;">✅ 1189 chapitres en 6 langues</div>
                <div style="margin-bottom: 10px;">✅ Accès illimité à vie</div>
                <div style="margin-bottom: 10px;">✅ Pas d'abonnement</div>
                <div style="margin-bottom: 10px;">✅ Soutien au projet</div>
            </div>

            <div style="font-size: 2.5rem; font-weight: bold; color: #f5c842; margin-bottom: 20px;">
                $0.99
            </div>

            <button id="checkoutBtn" style="
                width: 100%; padding: 15px; font-size: 1.1rem;
                background: #f5c842; color: #1a237e;
                border: none; border-radius: 10px;
                cursor: pointer; font-weight: bold;
                margin-bottom: 15px;
                transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                💳 Payer avec Stripe
            </button>

            <button id="cancelBtn" style="
                width: 100%; padding: 10px; font-size: 0.9rem;
                background: transparent; color: #b0b0b0;
                border: 1px solid #b0b0b0; border-radius: 10px;
                cursor: pointer;
            ">
                Peut-être plus tard
            </button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Gérer le paiement
        document.getElementById('checkoutBtn').onclick = () => {
            this.startCheckout();
        };

        // Fermer le modal
        document.getElementById('cancelBtn').onclick = () => {
            modal.remove();
        };

        // CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Démarrer le processus de paiement Stripe
     */
    async startCheckout() {
        const uid = this.getUserUid();
        const email = this.getUserEmail();

        if (!uid || !email) {
            alert('Erreur: Utilisateur non identifié. Veuillez rafraîchir la page.');
            return;
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = '⏳ Création de la session...';

        try {
            // Appeler la fonction Netlify pour créer la session Stripe
            const response = await fetch('/.netlify/functions/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, email })
            });

            const result = await response.json();

            if (result.url) {
                console.log('✅ Redirecting to Stripe Checkout...');
                // Rediriger vers Stripe Checkout
                window.location.href = result.url;
            } else {
                throw new Error(result.error || 'Failed to create checkout session');
            }

        } catch (error) {
            console.error('❌ Checkout error:', error);
            alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.');
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = '💳 Payer avec Stripe';
        }
    },

    /**
     * Vérifier le statut premium depuis le backend
     * (Appelé après retour de Stripe ou au chargement de page)
     */
    async checkPremiumStatus() {
        const uid = this.getUserUid();
        if (!uid) return false;

        try {
            const response = await fetch(`/.netlify/functions/bc_me?uid=${uid}`);
            const result = await response.json();

            if (result.ok && result.me) {
                // Mettre à jour localStorage
                localStorage.setItem('bc_user', JSON.stringify(result.me));
                return result.me.is_premium === true;
            }
        } catch (error) {
            console.error('Error checking premium status:', error);
        }

        return false;
    },

    /**
     * Initialiser le système au chargement de page
     */
    async init() {
        // Vérifier si on revient de Stripe success
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (sessionId) {
            console.log('✅ Retour de Stripe, vérification du statut...');
            await this.checkPremiumStatus();
        }

        // Afficher le statut dans la console
        const isPremium = this.isPremium();
        console.log('💎 Premium status:', isPremium ? 'PREMIUM' : 'FREE');
    }
};

// Auto-initialiser au chargement
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        premiumSystem.init();
    });
}
