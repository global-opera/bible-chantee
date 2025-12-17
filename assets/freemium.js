/**
 * SYSTÈME FREEMIUM - Bible Chantée
 * Version: Multi-langues (credits séparés par langue)
 *
 * 100 chapitres gratuits PAR langue
 * $0.99 pour débloquer tout dans UNE langue
 */

class FreemiumSystem {
    constructor(lang) {
        this.lang = lang; // 'fr', 'en', 'pt'
        this.TOTAL_FREE_CREDITS = 100;
        this.TOTAL_CHAPTERS = 1189;
        this.PREMIUM_PRICE = '$0.99';
        this.PAYPAL_LINK = 'https://paypal.me/stephanecassani1/0.99';
        this.init();
    }

    /**
     * Initialisation
     */
    init() {
        const key = `bibleFree_${this.lang}`;

        if (!localStorage.getItem(key)) {
            this.resetToDefault();
        }

        this.loadData();
        this.updateCreditsDisplay();
    }

    /**
     * Reset aux valeurs par défaut
     */
    resetToDefault() {
        const key = `bibleFree_${this.lang}`;
        const data = {
            credits: this.TOTAL_FREE_CREDITS,
            unlocked: [],
            premium: false,
            code: null,
            firstVisit: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Charger les données
     */
    loadData() {
        const key = `bibleFree_${this.lang}`;
        const data = JSON.parse(localStorage.getItem(key));
        this.credits = data.credits;
        this.unlocked = data.unlocked;
        this.premium = data.premium;
        this.code = data.code;
    }

    /**
     * Sauvegarder
     */
    saveData() {
        const key = `bibleFree_${this.lang}`;
        const data = {
            credits: this.credits,
            unlocked: this.unlocked,
            premium: this.premium,
            code: this.code,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Vérifier si peut jouer
     */
    canPlayChapter(chapterId) {
        if (this.premium) {
            return { canPlay: true, reason: 'premium' };
        }

        if (this.unlocked.includes(chapterId)) {
            return { canPlay: true, reason: 'unlocked' };
        }

        if (this.credits > 0) {
            return { canPlay: true, reason: 'will_unlock' };
        }

        return { canPlay: false, reason: 'paywall' };
    }

    /**
     * Débloquer un chapitre
     */
    unlockChapter(chapterId, chapterTitle) {
        if (this.premium) {
            return { success: true, message: `✅ Accès illimité activé` };
        }

        if (this.unlocked.includes(chapterId)) {
            return { success: true, message: `✅ Déjà débloqué (réécoute gratuite)` };
        }

        if (this.credits <= 0) {
            return { success: false, message: 'Plus de crédits!' };
        }

        // Débloquer
        this.credits--;
        this.unlocked.push(chapterId);
        this.saveData();
        this.updateCreditsDisplay();

        // Message selon crédits restants
        let message = `🎵 "${chapterTitle}" débloqué! `;
        if (this.credits > 10) {
            message += `Il vous reste ${this.credits} chapitres gratuits.`;
        } else if (this.credits > 0) {
            message += `⚠️ Plus que ${this.credits} chapitres gratuits!`;
        } else {
            message += `🎉 Vous avez utilisé vos 100 chapitres gratuits!`;
            setTimeout(() => this.showPaywall(), 500);
        }

        return { success: true, message };
    }

    /**
     * Activer premium
     */
    activatePremium(code = null) {
        this.premium = true;
        this.code = code || this.generateCode();
        this.saveData();
        this.updateCreditsDisplay();
        this.showSuccessModal();
        return { success: true, code: this.code };
    }

    /**
     * Générer code unique
     */
    generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = `BIBLE-${this.lang.toUpperCase()}-`;
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
     * Vérifier un code
     */
    verifyCode(code) {
        const regex = /^BIBLE-(FR|EN|PT)-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
        if (!regex.test(code)) {
            return { valid: false, message: 'Format invalide' };
        }

        // Vérifier que le code correspond à la bonne langue
        const codeLang = code.split('-')[1].toLowerCase();
        if (codeLang !== this.lang) {
            return { valid: false, message: `Ce code est pour la version ${codeLang.toUpperCase()}` };
        }

        // TODO: Vérifier contre liste/API
        return { valid: true, message: 'Code valide!' };
    }

    /**
     * Mettre à jour l'affichage du compteur
     */
    updateCreditsDisplay() {
        const counterEl = document.getElementById('credits-counter');
        if (!counterEl) return;

        if (this.premium) {
            counterEl.innerHTML = `
                <div class="credits-premium">
                    <span class="premium-icon">👑</span>
                    <span>Accès illimité (${this.lang.toUpperCase()})</span>
                </div>
            `;
            counterEl.classList.add('premium');
        } else {
            const percentage = (this.credits / this.TOTAL_FREE_CREDITS) * 100;
            let statusClass = '';
            if (this.credits <= 0) statusClass = 'empty';
            else if (this.credits <= 10) statusClass = 'low';

            counterEl.innerHTML = `
                <div class="credits-bar">
                    <div class="credits-progress" style="width: ${percentage}%"></div>
                </div>
                <div class="credits-text ${statusClass}">
                    <span>${this.credits}/${this.TOTAL_FREE_CREDITS} gratuits (${this.lang.toUpperCase()})</span>
                    <button class="btn-unlock-all" onclick="freemium.showPaywall()">
                        Tout débloquer ${this.PREMIUM_PRICE}
                    </button>
                </div>
            `;
        }
    }

    /**
     * Afficher paywall
     */
    showPaywall() {
        if (document.getElementById('paywall-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'paywall-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content paywall-content">
                <button class="modal-close" onclick="freemium.closeModal('paywall-modal')">&times;</button>

                <div class="paywall-icon">🎵</div>
                <h2>Vous avez écouté vos 100 chapitres gratuits!</h2>

                <p class="paywall-message">
                    Débloquez <strong>les 1089 autres chapitres en ${this.lang.toUpperCase()}</strong><br>
                    pour seulement <strong class="price">${this.PREMIUM_PRICE}</strong>
                </p>

                <div class="paywall-benefits">
                    <div class="benefit">✅ Toute la Bible (1189 chapitres)</div>
                    <div class="benefit">✅ Écoute illimitée à vie</div>
                    <div class="benefit">✅ Réécoute gratuite</div>
                    <div class="benefit">✅ Moins qu'un café!</div>
                </div>

                <div class="paywall-buttons">
                    <button class="btn-primary btn-large" onclick="freemium.initPayment()">
                        💰 Payer ${this.PREMIUM_PRICE} via PayPal
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
        setTimeout(() => modal.classList.add('show'), 10);
    }

    /**
     * Initialiser le paiement PayPal
     */
    initPayment() {
        // Ouvrir PayPal dans nouvel onglet
        window.open(this.PAYPAL_LINK, '_blank');

        // Afficher message
        alert(`Après paiement, vous recevrez un email avec votre code de déblocage.\n\nVérifiez vos spams si vous ne le voyez pas.`);

        this.closeModal('paywall-modal');
    }

    /**
     * Afficher modal restauration
     */
    showRestoreModal() {
        this.closeModal('paywall-modal');

        const modal = document.createElement('div');
        modal.id = 'restore-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content restore-content">
                <button class="modal-close" onclick="freemium.closeModal('restore-modal')">&times;</button>

                <h2>Restaurer votre accès premium (${this.lang.toUpperCase()})</h2>
                <p>Entrez le code que vous avez reçu par email</p>

                <input type="text"
                       id="restore-code-input"
                       placeholder="BIBLE-${this.lang.toUpperCase()}-XXXX-XXXX"
                       maxlength="20"
                       style="text-transform: uppercase;">

                <button class="btn-primary" onclick="freemium.restoreFromCode()">
                    Restaurer
                </button>

                <div id="restore-message"></div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        setTimeout(() => document.getElementById('restore-code-input').focus(), 100);
    }

    /**
     * Restaurer depuis code
     */
    restoreFromCode() {
        const input = document.getElementById('restore-code-input');
        const messageEl = document.getElementById('restore-message');
        const code = input.value.trim().toUpperCase();

        if (!code) {
            messageEl.innerHTML = '<div class="error">Veuillez entrer un code</div>';
            return;
        }

        const verification = this.verifyCode(code);

        if (verification.valid) {
            this.activatePremium(code);
            this.closeModal('restore-modal');
        } else {
            messageEl.innerHTML = `<div class="error">❌ ${verification.message}</div>`;
        }
    }

    /**
     * Modal succès
     */
    showSuccessModal() {
        const modal = document.createElement('div');
        modal.id = 'success-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content success-content">
                <div class="success-animation">🎉</div>
                <h2>Merci pour votre achat!</h2>
                <p>Vous avez maintenant accès à <strong>toute la Bible en ${this.lang.toUpperCase()}</strong>!</p>

                <div class="premium-code-box">
                    <p>Votre code de déblocage:</p>
                    <div class="code">${this.code}</div>
                    <button class="btn-copy" onclick="freemium.copyCode('${this.code}')">
                        📋 Copier
                    </button>
                    <p class="code-info">
                        (Conservez ce code, il a été envoyé par email)
                    </p>
                </div>

                <button class="btn-primary" onclick="freemium.closeModal('success-modal')">
                    Commencer à écouter!
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    /**
     * Copier code
     */
    copyCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            alert('✅ Code copié!');
        });
    }

    /**
     * Fermer modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    /**
     * Stats
     */
    getStats() {
        return {
            lang: this.lang,
            credits: this.credits,
            unlocked: this.unlocked.length,
            premium: this.premium,
            code: this.code
        };
    }

    /**
     * Reset (debug)
     */
    resetAll() {
        if (confirm('⚠️ Supprimer toutes les données? (Debug)')) {
            localStorage.removeItem(`bibleFree_${this.lang}`);
            location.reload();
        }
    }
}

// Instance globale (sera initialisée par chaque page de langue)
let freemium;
