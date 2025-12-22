// Systeme de credits Bible Chantee
const CREDITS = {
    // Chapitres toujours gratuits (sans credit)
    FREE_CHAPTERS: [
        { book: "01_GEN", chapter: 1 },   // Creation
        { book: "19_PSA", chapter: 23 },  // Berger
        { book: "19_PSA", chapter: 91 },  // Protection
        { book: "19_PSA", chapter: 150 }, // Louange
        { book: "43_JHN", chapter: 3 },   // Jean 3:16
        { book: "66_REV", chapter: 21 }   // Nouveau ciel
    ],

    // Configuration
    DAILY_FREE_PLAYS: 3,
    SIGNUP_BONUS: 10,
    REFERRAL_BONUS: 10,
    STRIPE_LINK: 'https://buy.stripe.com/bJeaEQ8HJfoD3LybIg0Fi01',

    // Verifier si chapitre gratuit
    isFreeChapter(book, chapter) {
        const chap = parseInt(chapter);
        return this.FREE_CHAPTERS.some(c => c.book === book && c.chapter === chap);
    },

    // Verifier si premium
    isPremium() {
        const user = this.getUser();
        const isPremium = user && user.premium === true;
        console.log('🔐 Premium check:', {
            user: user,
            hasPremium: user ? user.premium : 'no user',
            result: isPremium
        });
        return isPremium;
    },

    // Obtenir utilisateur
    getUser() {
        return JSON.parse(localStorage.getItem('bc_user') || 'null');
    },

    // Sauvegarder utilisateur
    saveUser(user) {
        localStorage.setItem('bc_user', JSON.stringify(user));
    },

    // Obtenir credits restants
    getCredits() {
        const user = this.getUser();
        if (user && user.credits !== undefined) return user.credits;

        // Visiteur anonyme: verifier ecoutes du jour
        const data = JSON.parse(localStorage.getItem('bc_plays') || '{}');
        const today = new Date().toISOString().split('T')[0];
        if (data.date !== today) return this.DAILY_FREE_PLAYS;
        return Math.max(0, this.DAILY_FREE_PLAYS - (data.count || 0));
    },

    // Consommer 1 credit
    useCredit() {
        const user = this.getUser();
        if (user && user.credits > 0) {
            user.credits--;
            this.saveUser(user);
            return true;
        }

        // Visiteur anonyme
        const data = JSON.parse(localStorage.getItem('bc_plays') || '{}');
        const today = new Date().toISOString().split('T')[0];
        if (data.date !== today) {
            data.date = today;
            data.count = 0;
        }
        if (data.count < this.DAILY_FREE_PLAYS) {
            data.count++;
            localStorage.setItem('bc_plays', JSON.stringify(data));
            return true;
        }
        return false;
    },

    // Verifier si peut ecouter
    canPlay(book, chapter) {
        if (this.isPremium()) return { allowed: true, reason: 'premium' };
        if (this.isFreeChapter(book, chapter)) return { allowed: true, reason: 'free' };
        if (this.getCredits() > 0) return { allowed: true, reason: 'credit' };
        return { allowed: false, reason: 'no_credits' };
    },

    // Inscription
    signup(email, referrerUid = null) {
        const user = {
            email: email,
            credits: this.SIGNUP_BONUS,
            uid: 'user_' + Date.now(),
            createdAt: new Date().toISOString(),
            referrer: referrerUid,
            premium: false
        };
        this.saveUser(user);

        // Track GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', {
                method: 'email',
                referrer_uid: referrerUid || 'direct'
            });
        }

        return user;
    },

    // Afficher popup credits
    showCreditsPopup() {
        // Supprimer ancien popup si existe
        const old = document.getElementById('credits-popup');
        if (old) old.remove();

        const popup = document.createElement('div');
        popup.id = 'credits-popup';
        popup.innerHTML = `
            <div class="credits-overlay" id="creditsOverlay">
                <div class="credits-modal">
                    <button class="credits-close" onclick="CREDITS.hideCreditsPopup()">&times;</button>
                    <h2>Continuez a ecouter</h2>
                    <p>Vous avez utilise vos ${this.DAILY_FREE_PLAYS} ecoutes gratuites du jour.</p>

                    <div class="credits-options">
                        <a href="${this.STRIPE_LINK}" class="credits-btn premium">
                            <span class="btn-icon">&#9733;</span>
                            <span class="btn-text">Acces illimite - 0.99 CHF</span>
                        </a>

                        <button class="credits-btn signup" onclick="CREDITS.showSignupForm()">
                            <span class="btn-icon">&#128231;</span>
                            <span class="btn-text">S'inscrire (+10 credits gratuits)</span>
                        </button>

                        <button class="credits-btn referral" onclick="CREDITS.showReferralLink()">
                            <span class="btn-icon">&#128279;</span>
                            <span class="btn-text">Inviter un ami (+10 credits)</span>
                        </button>
                    </div>

                    <div class="free-chapters">
                        <h3>Chapitres toujours gratuits :</h3>
                        <div class="free-list">
                            <a href="/lecteur.html?book=01_GEN&chapter=1" class="free-item">Genese 1</a>
                            <a href="/lecteur.html?book=19_PSA&chapter=23" class="free-item">Psaume 23</a>
                            <a href="/lecteur.html?book=19_PSA&chapter=91" class="free-item">Psaume 91</a>
                            <a href="/lecteur.html?book=19_PSA&chapter=150" class="free-item">Psaume 150</a>
                            <a href="/lecteur.html?book=43_JHN&chapter=3" class="free-item">Jean 3</a>
                            <a href="/lecteur.html?book=66_REV&chapter=21" class="free-item">Apocalypse 21</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        // Remove is-hidden class to ensure overlay is visible
        setTimeout(() => {
            const overlay = document.getElementById('creditsOverlay');
            if (overlay) overlay.classList.remove('is-hidden');
        }, 10);
    },

    // Cacher popup
    hideCreditsPopup() {
        const overlay = document.getElementById('creditsOverlay');
        if (overlay) overlay.classList.add('is-hidden');

        const popup = document.getElementById('credits-popup');
        if (popup) {
            // Mark as shown when user manually closes
            sessionStorage.setItem('bc_credits_popup_shown', '1');
            sessionStorage.setItem('bc_credits_popup_last', String(Date.now()));

            setTimeout(() => popup.remove(), 300); // Delay for animation
        }
    },

    // Formulaire inscription
    showSignupForm() {
        const modal = document.querySelector('.credits-modal');
        if (!modal) return;

        modal.innerHTML = `
            <button class="credits-close" onclick="CREDITS.hideCreditsPopup()">&times;</button>
            <h2>Inscription gratuite</h2>
            <p>Recevez <strong>10 credits gratuits</strong> pour ecouter plus de chapitres.</p>

            <form onsubmit="CREDITS.handleSignup(event)" class="signup-form">
                <input type="email" id="signup-email" placeholder="Votre email" required>
                <button type="submit" class="credits-btn premium">S'inscrire</button>
            </form>

            <button class="back-btn" onclick="CREDITS.showCreditsPopup()">Retour</button>
        `;
    },

    // Traiter inscription
    handleSignup(event) {
        event.preventDefault();
        const email = document.getElementById('signup-email').value;
        const urlParams = new URLSearchParams(window.location.search);
        const referrer = urlParams.get('ref');

        const user = this.signup(email, referrer);

        const modal = document.querySelector('.credits-modal');
        if (modal) {
            modal.innerHTML = `
                <button class="credits-close" onclick="CREDITS.hideCreditsPopup()">&times;</button>
                <div class="success-icon">&#10003;</div>
                <h2>Bienvenue !</h2>
                <p>Vous avez recu <strong>10 credits</strong>.</p>
                <p>Votre lien de parrainage :</p>
                <input type="text" value="${window.location.origin}/lecteur.html?ref=${user.uid}" readonly onclick="this.select()">
                <p class="hint">Partagez ce lien pour gagner +10 credits par inscription !</p>
                <button class="credits-btn premium" onclick="CREDITS.hideCreditsPopup()">Commencer a ecouter</button>
            `;
        }
    },

    // Afficher lien parrainage
    showReferralLink() {
        const user = this.getUser();
        if (!user) {
            this.showSignupForm();
            return;
        }

        const modal = document.querySelector('.credits-modal');
        if (modal) {
            modal.innerHTML = `
                <button class="credits-close" onclick="CREDITS.hideCreditsPopup()">&times;</button>
                <h2>Invitez vos amis</h2>
                <p>Gagnez <strong>10 credits</strong> pour chaque ami qui s'inscrit !</p>
                <input type="text" value="${window.location.origin}/lecteur.html?ref=${user.uid}" readonly onclick="this.select()">
                <div class="share-buttons">
                    <a href="https://wa.me/?text=Decouvre%20la%20Bible%20Chantee%20${encodeURIComponent(window.location.origin + '/lecteur.html?ref=' + user.uid)}" target="_blank" class="share-btn whatsapp">WhatsApp</a>
                    <a href="https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/lecteur.html?ref=' + user.uid)}" target="_blank" class="share-btn telegram">Telegram</a>
                </div>
                <button class="back-btn" onclick="CREDITS.showCreditsPopup()">Retour</button>
            `;
        }
    }
};

// Exposer globalement
window.CREDITS = CREDITS;
