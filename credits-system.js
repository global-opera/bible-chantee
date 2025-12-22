/**
 * SYSTÈME DE CRÉDITS FREEMIUM - Bible Chantée
 * 100 crédits gratuits, puis achat à 0,99€
 */

class CreditsSystem {
    constructor() {
        this.INITIAL_CREDITS = 100;
        this.STORAGE_KEY = 'sungbible_credits';
        this.UNLIMITED_KEY = 'sungbible_unlimited';
        this.init();
    }

    init() {
        // Initialiser les crédits si nouveau visiteur
        if (!this.hasAccount()) {
            this.setCredits(this.INITIAL_CREDITS);
        }

        // Créer l'interface de notification
        this.createNotificationUI();

        // Intercepter toutes les lectures audio
        this.setupAudioInterception();
    }

    hasAccount() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }

    getCredits() {
        const credits = localStorage.getItem(this.STORAGE_KEY);
        return credits !== null ? parseInt(credits) : this.INITIAL_CREDITS;
    }

    setCredits(amount) {
        localStorage.setItem(this.STORAGE_KEY, amount.toString());
    }

    hasUnlimitedAccess() {
        return localStorage.getItem(this.UNLIMITED_KEY) === 'true';
    }

    setUnlimitedAccess() {
        localStorage.setItem(this.UNLIMITED_KEY, 'true');
    }

    canPlay() {
        return this.hasUnlimitedAccess() || this.getCredits() > 0;
    }

    deductCredit() {
        if (this.hasUnlimitedAccess()) {
            return true;
        }

        const credits = this.getCredits();
        if (credits > 0) {
            this.setCredits(credits - 1);
            this.showNotification();
            return true;
        }

        this.showPurchaseModal();
        return false;
    }

    createNotificationUI() {
        // Notification discrète en haut à droite
        const notification = document.createElement('div');
        notification.id = 'credits-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.4s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        notification.innerHTML = `
            <span style="font-size: 20px;">💳</span>
            <span id="credits-text"></span>
        `;
        document.body.appendChild(notification);

        // Modal d'achat
        const modal = document.createElement('div');
        modal.id = 'purchase-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">🎵</div>
                <h2 style="color: white; font-size: 28px; margin-bottom: 15px;">
                    Crédits épuisés
                </h2>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                    Vous avez utilisé vos 100 crédits gratuits.<br>
                    Débloquez l'accès illimité à toute la Bible chantée !
                </p>
                <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                    <div style="font-size: 48px; color: #fbbf24; font-weight: bold; margin-bottom: 5px;">
                        0,99 €
                    </div>
                    <div style="color: white; font-size: 14px;">
                        Accès illimité à vie • 1189 chapitres • 3 langues
                    </div>
                </div>
                <button id="purchase-btn" style="
                    background: #fbbf24;
                    color: #1a1a2e;
                    border: none;
                    padding: 15px 40px;
                    border-radius: 30px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-bottom: 15px;
                    width: 100%;
                    max-width: 300px;
                ">
                    🛒 Acheter maintenant
                </button>
                <button id="close-modal-btn" style="
                    background: transparent;
                    color: white;
                    border: 2px solid white;
                    padding: 12px 30px;
                    border-radius: 30px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s;
                    width: 100%;
                    max-width: 300px;
                ">
                    Fermer
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('purchase-btn').addEventListener('click', () => {
            this.handlePurchase();
        });

        document.getElementById('close-modal-btn').addEventListener('click', () => {
            this.hidePurchaseModal();
        });

        // Fermer en cliquant sur le fond
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hidePurchaseModal();
            }
        });
    }

    showNotification() {
        const notification = document.getElementById('credits-notification');
        const creditsText = document.getElementById('credits-text');

        const remaining = this.getCredits();

        if (this.hasUnlimitedAccess()) {
            creditsText.textContent = 'Accès illimité ♾️';
        } else {
            creditsText.textContent = `${remaining} crédit${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`;
        }

        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
        }, 3000);
    }

    showPurchaseModal() {
        // Anti-spam: show only once per session + 45s cooldown
        const shown = sessionStorage.getItem('bc_paywall_shown') === '1';
        if (shown) {
            console.log('⏭️ Purchase modal already shown this session');
            return;
        }

        const last = Number(sessionStorage.getItem('bc_paywall_last') || '0');
        if (Date.now() - last < 45000) {
            console.log('⏸️ Purchase modal cooldown active');
            return;
        }

        sessionStorage.setItem('bc_paywall_shown', '1');
        sessionStorage.setItem('bc_paywall_last', String(Date.now()));

        const modal = document.getElementById('purchase-modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';  // Prevent scroll
    }

    hidePurchaseModal() {
        const modal = document.getElementById('purchase-modal');
        modal.style.display = 'none';
        document.body.style.overflow = '';  // Restore scroll
        document.body.classList.remove('popup-open');

        // Mark as shown when user closes manually
        sessionStorage.setItem('bc_paywall_shown', '1');
        sessionStorage.setItem('bc_paywall_last', String(Date.now()));
    }

    handlePurchase() {
        // Rediriger vers la page de crowdfunding/paiement
        const lang = this.getCurrentLanguage();
        window.location.href = `/crowdfunding.html?lang=${lang}&source=credits`;
    }

    getCurrentLanguage() {
        // Détecter la langue depuis l'URL ou localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) return urlLang;

        const storedLang = localStorage.getItem('sungbible_lang');
        return storedLang || 'fr';
    }

    setupAudioInterception() {
        // Intercepter TOUTES les créations d'éléments audio
        const originalPlay = HTMLMediaElement.prototype.play;
        const self = this;

        HTMLMediaElement.prototype.play = function() {
            // Vérifier si c'est un élément audio (pas vidéo)
            if (this.tagName === 'AUDIO') {
                // Vérifier si on a déjà intercepté cette lecture
                if (!this._creditsChecked) {
                    this._creditsChecked = true;

                    if (!self.canPlay()) {
                        self.showPurchaseModal();
                        return Promise.reject(new DOMException('Credits exhausted', 'NotAllowedError'));
                    }

                    self.deductCredit();

                    // Réinitialiser après la lecture
                    this.addEventListener('ended', () => {
                        this._creditsChecked = false;
                    });

                    this.addEventListener('pause', () => {
                        setTimeout(() => {
                            this._creditsChecked = false;
                        }, 1000);
                    });
                }
            }

            return originalPlay.apply(this, arguments);
        };

        // Afficher le solde initial
        setTimeout(() => {
            this.showNotification();
        }, 1000);
    }

    // Méthode pour débloquer l'accès illimité (après paiement)
    unlockUnlimitedAccess() {
        this.setUnlimitedAccess();
        alert('🎉 Félicitations ! Vous avez maintenant un accès illimité à toute la Bible chantée !');
        this.showNotification();
    }

    // Méthode pour réinitialiser (dev/test uniquement)
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.UNLIMITED_KEY);
        console.log('Credits system reset');
    }
}

// Initialiser le système automatiquement
let creditsSystem;
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        creditsSystem = new CreditsSystem();

        // Exposer pour le debug en console
        window.creditsSystem = creditsSystem;

        console.log('🎵 Credits System initialized');
        console.log('Credits remaining:', creditsSystem.getCredits());
        console.log('Unlimited access:', creditsSystem.hasUnlimitedAccess());
    });
}
