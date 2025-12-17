/**
 * SYSTÈME FREEMIUM - Bible Chantée
 *
 * Modèle: 100 chapitres gratuits + $0.99 pour débloquer tout (1189 chapitres)
 * Storage: localStorage (credits, unlockedChapters, premium, premiumCode)
 */

class FreemiumSystem {
    constructor() {
        this.TOTAL_FREE_CREDITS = 100;
        this.TOTAL_CHAPTERS = 1189;
        this.PREMIUM_PRICE = '$0.99';
        this.init();
    }

    /**
     * Initialisation du système
     */
    init() {
        // Vérifier si localStorage existe
        if (!localStorage.getItem('bibleChanteeFree')) {
            // Premier visiteur - initialiser
            this.resetToDefault();
        }

        // Charger les données
        this.loadData();

        // Afficher le compteur
        this.updateCreditsDisplay();
    }

    /**
     * Réinitialiser aux valeurs par défaut (nouveau visiteur)
     */
    resetToDefault() {
        const data = {
            credits: this.TOTAL_FREE_CREDITS,
            unlockedChapters: [],
            premium: false,
            premiumCode: null,
            firstVisit: new Date().toISOString()
        };
        localStorage.setItem('bibleChanteeFree', JSON.stringify(data));
    }

    /**
     * Charger les données depuis localStorage
     */
    loadData() {
        const data = JSON.parse(localStorage.getItem('bibleChanteeFree'));
        this.credits = data.credits;
        this.unlockedChapters = data.unlockedChapters;
        this.premium = data.premium;
        this.premiumCode = data.premiumCode;
    }

    /**
     * Sauvegarder les données dans localStorage
     */
    saveData() {
        const data = {
            credits: this.credits,
            unlockedChapters: this.unlockedChapters,
            premium: this.premium,
            premiumCode: this.premiumCode,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('bibleChanteeFree', JSON.stringify(data));
    }

    /**
     * Vérifier si un chapitre peut être joué
     * @param {string} chapterId - ID du chapitre (ex: "01_GEN_01_FR")
     * @returns {object} {canPlay: boolean, reason: string}
     */
    canPlayChapter(chapterId) {
        // Si premium, peut tout jouer
        if (this.premium) {
            return { canPlay: true, reason: 'premium' };
        }

        // Si déjà débloqué, peut jouer
        if (this.unlockedChapters.includes(chapterId)) {
            return { canPlay: true, reason: 'unlocked' };
        }

        // Si crédits disponibles, peut débloquer et jouer
        if (this.credits > 0) {
            return { canPlay: true, reason: 'will_unlock' };
        }

        // Pas de crédits, pas débloqué, pas premium
        return { canPlay: false, reason: 'paywall' };
    }

    /**
     * Débloquer un chapitre (utilise 1 crédit)
     * @param {string} chapterId
     * @param {string} chapterTitle
     */
    unlockChapter(chapterId, chapterTitle) {
        if (this.premium) {
            // Déjà premium, pas besoin de débloquer
            return { success: true, message: 'Vous avez déjà accès à tous les chapitres!' };
        }

        if (this.unlockedChapters.includes(chapterId)) {
            // Déjà débloqué
            return { success: true, message: 'Ce chapitre est déjà débloqué!' };
        }

        if (this.credits <= 0) {
            // Plus de crédits
            return { success: false, message: 'Plus de crédits! Débloquez tout pour $0.99' };
        }

        // Débloquer le chapitre
        this.credits--;
        this.unlockedChapters.push(chapterId);
        this.saveData();
        this.updateCreditsDisplay();

        // Message selon crédits restants
        let message = `"${chapterTitle}" débloqué! `;
        if (this.credits > 10) {
            message += `Il vous reste ${this.credits} chapitres gratuits.`;
        } else if (this.credits > 0) {
            message += `⚠️ Plus que ${this.credits} chapitres gratuits!`;
        } else {
            message += `🎉 Vous avez utilisé vos 100 chapitres gratuits!`;
            // Afficher paywall
            this.showPaywall();
        }

        return { success: true, message };
    }

    /**
     * Activer le mode premium
     * @param {string} code - Code de déblocage (optionnel)
     */
    activatePremium(code = null) {
        this.premium = true;

        if (code) {
            this.premiumCode = code;
        } else {
            // Générer un code si pas fourni
            this.premiumCode = this.generatePremiumCode();
        }

        this.saveData();
        this.updateCreditsDisplay();
        this.showPremiumSuccess();

        return { success: true, code: this.premiumCode };
    }

    /**
     * Générer un code premium unique
     * Format: BIBLE-XXXX-XXXX
     */
    generatePremiumCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans O,0,I,1
        let code = 'BIBLE-';

        for (let i = 0; i < 4; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        code += '-';
        for (let i = 0; i < 4; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }

        return code;
    }

    /**
     * Vérifier un code premium
     * @param {string} code
     */
    verifyPremiumCode(code) {
        // TODO: Vérifier contre une liste ou API
        // Pour l'instant, format simple
        const regex = /^BIBLE-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

        if (!regex.test(code)) {
            return { valid: false, message: 'Format de code invalide' };
        }

        // TODO: Vérifier si le code existe vraiment (API ou liste)
        // Pour l'instant, on accepte tous les codes au bon format

        return { valid: true, message: 'Code valide!' };
    }

    /**
     * Mettre à jour l'affichage du compteur de crédits
     */
    updateCreditsDisplay() {
        const counterEl = document.getElementById('credits-counter');
        if (!counterEl) return;

        if (this.premium) {
            counterEl.innerHTML = `
                <div class="credits-premium">
                    <span class="premium-icon">👑</span>
                    <span>Accès illimité</span>
                </div>
            `;
            counterEl.classList.add('premium');
        } else {
            const percentage = (this.credits / this.TOTAL_FREE_CREDITS) * 100;
            const used = this.TOTAL_FREE_CREDITS - this.credits;

            let statusClass = '';
            if (this.credits <= 0) statusClass = 'empty';
            else if (this.credits <= 10) statusClass = 'low';

            counterEl.innerHTML = `
                <div class="credits-bar">
                    <div class="credits-progress" style="width: ${percentage}%"></div>
                </div>
                <div class="credits-text ${statusClass}">
                    <span>${this.credits}/${this.TOTAL_FREE_CREDITS} chapitres gratuits</span>
                    <button class="btn-unlock-all" onclick="freemium.showPaywall()">
                        Débloquer TOUT (${this.PREMIUM_PRICE})
                    </button>
                </div>
            `;
        }
    }

    /**
     * Afficher le paywall modal
     */
    showPaywall() {
        const modal = document.createElement('div');
        modal.id = 'paywall-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content paywall-content">
                <button class="modal-close" onclick="freemium.closeModal('paywall-modal')">&times;</button>

                <div class="paywall-icon">🎵</div>
                <h2>Vous avez écouté vos 100 chapitres gratuits!</h2>

                <p class="paywall-message">
                    Débloquez <strong>les 1089 autres chapitres</strong> pour seulement <strong class="price">${this.PREMIUM_PRICE}</strong>
                </p>

                <div class="paywall-benefits">
                    <div class="benefit">✅ Toute la Bible (1189 chapitres)</div>
                    <div class="benefit">✅ 4 langues (FR, PT, EN, ES)</div>
                    <div class="benefit">✅ Écoute illimitée à vie</div>
                    <div class="benefit">✅ Moins qu'un café!</div>
                </div>

                <div class="paywall-buttons">
                    <button class="btn-primary btn-large" onclick="freemium.initPayment('stripe')">
                        💳 Payer avec Stripe
                    </button>
                    <button class="btn-secondary btn-large" onclick="freemium.initPayment('paypal')">
                        💰 Payer avec PayPal
                    </button>
                </div>

                <div class="paywall-footer">
                    <a href="#" onclick="freemium.showRestoreModal(); return false;">
                        J'ai déjà payé - Restaurer mon accès
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animer l'entrée
        setTimeout(() => modal.classList.add('show'), 10);
    }

    /**
     * Afficher modal de restauration (entrer code)
     */
    showRestoreModal() {
        this.closeModal('paywall-modal');

        const modal = document.createElement('div');
        modal.id = 'restore-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content restore-content">
                <button class="modal-close" onclick="freemium.closeModal('restore-modal')">&times;</button>

                <h2>Restaurer votre accès premium</h2>
                <p>Entrez le code de déblocage que vous avez reçu par email</p>

                <input type="text"
                       id="restore-code-input"
                       placeholder="BIBLE-XXXX-XXXX"
                       maxlength="15"
                       style="text-transform: uppercase;">

                <button class="btn-primary" onclick="freemium.restoreFromCode()">
                    Restaurer
                </button>

                <div id="restore-message"></div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        // Focus sur input
        setTimeout(() => document.getElementById('restore-code-input').focus(), 100);
    }

    /**
     * Restaurer à partir d'un code
     */
    restoreFromCode() {
        const input = document.getElementById('restore-code-input');
        const messageEl = document.getElementById('restore-message');
        const code = input.value.trim().toUpperCase();

        if (!code) {
            messageEl.innerHTML = '<div class="error">Veuillez entrer un code</div>';
            return;
        }

        // Vérifier le code
        const verification = this.verifyPremiumCode(code);

        if (verification.valid) {
            // Activer premium
            this.activatePremium(code);

            // Fermer modal
            this.closeModal('restore-modal');

            messageEl.innerHTML = '<div class="success">✅ Accès premium restauré!</div>';
        } else {
            messageEl.innerHTML = `<div class="error">❌ ${verification.message}</div>`;
        }
    }

    /**
     * Afficher succès premium
     */
    showPremiumSuccess() {
        const modal = document.createElement('div');
        modal.id = 'premium-success-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content success-content">
                <div class="success-animation">🎉</div>
                <h2>Merci pour votre achat!</h2>
                <p>Vous avez maintenant accès à <strong>toute la Bible Chantée</strong>!</p>

                <div class="premium-code-box">
                    <p>Votre code de déblocage:</p>
                    <div class="code">${this.premiumCode}</div>
                    <button class="btn-copy" onclick="freemium.copyCode('${this.premiumCode}')">
                        📋 Copier
                    </button>
                    <p class="code-info">
                        (Conservez ce code, il vous a été envoyé par email)
                    </p>
                </div>

                <button class="btn-primary" onclick="freemium.closeModal('premium-success-modal')">
                    Commencer à écouter!
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    /**
     * Copier le code dans le presse-papier
     */
    copyCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            alert('Code copié dans le presse-papier!');
        });
    }

    /**
     * Fermer un modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    /**
     * Initialiser le paiement
     * @param {string} method - 'stripe' ou 'paypal'
     */
    initPayment(method) {
        if (method === 'stripe') {
            this.initStripePayment();
        } else if (method === 'paypal') {
            this.initPayPalPayment();
        }
    }

    /**
     * Paiement Stripe
     */
    initStripePayment() {
        // TODO: Implémenter Stripe Checkout
        console.log('Initializing Stripe payment...');

        // Pour l'instant, simulation
        alert('Paiement Stripe en cours de configuration...');

        // Après paiement réussi:
        // this.activatePremium();
    }

    /**
     * Paiement PayPal
     */
    initPayPalPayment() {
        // TODO: Implémenter PayPal Button
        console.log('Initializing PayPal payment...');

        // Pour l'instant, simulation
        alert('Paiement PayPal en cours de configuration...');

        // Après paiement réussi:
        // this.activatePremium();
    }

    /**
     * Obtenir les statistiques
     */
    getStats() {
        return {
            credits: this.credits,
            unlocked: this.unlockedChapters.length,
            premium: this.premium,
            totalUsed: this.TOTAL_FREE_CREDITS - this.credits + this.unlockedChapters.length,
            percentageUsed: ((this.TOTAL_FREE_CREDITS - this.credits) / this.TOTAL_FREE_CREDITS * 100).toFixed(1)
        };
    }

    /**
     * Reset complet (pour debug seulement)
     */
    resetAll() {
        if (confirm('⚠️ Supprimer toutes les données? (Debug seulement)')) {
            localStorage.removeItem('bibleChanteeFree');
            location.reload();
        }
    }
}

// Initialiser le système au chargement
let freemium;
document.addEventListener('DOMContentLoaded', () => {
    freemium = new FreemiumSystem();
    console.log('✅ Freemium system loaded:', freemium.getStats());
});
