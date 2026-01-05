// Bible Chantée - Google Analytics 4 Tracking Helper
// Ce fichier contient toutes les fonctions de tracking pour GA4

// Configuration
const GA4_MEASUREMENT_ID = 'G-TX3ETCKJQZ';

// Initialiser GA4
(function() {
  // Charger gtag.js si pas déjà chargé
  if (!window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      dataLayer.push(arguments);
    };
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure'
    });
  }
})();

// === ÉVÉNEMENTS TRACKING ===

/**
 * Tracker une écoute audio
 * @param {string} book - Code du livre (ex: "19_PSA")
 * @param {number} chapter - Numéro du chapitre
 * @param {string} language - Code langue (FR, EN, PT, ES)
 * @param {number} duration - Durée écoutée en secondes
 */
function trackAudioPlay(book, chapter, language, duration) {
  if (window.gtag) {
    gtag('event', 'audio_play', {
      book: book,
      chapter: chapter,
      language: language,
      duration_seconds: duration,
      event_category: 'Audio',
      event_label: `${book}_${chapter}_${language}`
    });
    console.log('✅ GA4: audio_play tracked', { book, chapter, language, duration });
  }
}

/**
 * Tracker un partage
 * @param {string} method - Méthode de partage (whatsapp, telegram, copy_link, email)
 * @param {string} contentType - Type de contenu (chapter, book, playlist)
 * @param {string} itemId - ID de l'item partagé
 */
function trackShare(method, contentType, itemId) {
  if (window.gtag) {
    gtag('event', 'share', {
      method: method,
      content_type: contentType,
      item_id: itemId,
      event_category: 'Social',
      event_label: `${method}_${itemId}`
    });
    console.log('✅ GA4: share tracked', { method, contentType, itemId });
  }
}

/**
 * Tracker une inscription
 * @param {string} method - Méthode d'inscription (email, google, facebook)
 * @param {string} referrerUid - UID du référent (optionnel)
 */
function trackSignUp(method, referrerUid = null) {
  if (window.gtag) {
    const params = {
      method: method,
      event_category: 'User',
      event_label: `signup_${method}`
    };
    if (referrerUid) {
      params.referrer_uid = referrerUid;
    }
    gtag('event', 'sign_up', params);
    console.log('✅ GA4: sign_up tracked', { method, referrerUid });
  }
}

/**
 * Tracker l'affichage des paroles
 * @param {string} book - Code du livre
 * @param {number} chapter - Numéro du chapitre
 * @param {string} language - Code langue
 */
function trackLyricsView(book, chapter, language) {
  if (window.gtag) {
    gtag('event', 'lyrics_view', {
      book: book,
      chapter: chapter,
      language: language,
      event_category: 'Content',
      event_label: `${book}_${chapter}_${language}`
    });
    console.log('✅ GA4: lyrics_view tracked', { book, chapter, language });
  }
}

/**
 * Tracker un changement de langue
 * @param {string} fromLang - Langue d'origine
 * @param {string} toLang - Nouvelle langue
 */
function trackLanguageChange(fromLang, toLang) {
  if (window.gtag) {
    gtag('event', 'language_change', {
      from_language: fromLang,
      to_language: toLang,
      event_category: 'Settings',
      event_label: `${fromLang}_to_${toLang}`
    });
    console.log('✅ GA4: language_change tracked', { fromLang, toLang });
  }
}

/**
 * Tracker l'affichage du texte biblique
 * @param {string} book - Code du livre
 * @param {number} chapter - Numéro du chapitre
 * @param {string} language - Code langue
 */
function trackBibleView(book, chapter, language) {
  if (window.gtag) {
    gtag('event', 'bible_view', {
      book: book,
      chapter: chapter,
      language: language,
      event_category: 'Content',
      event_label: `bible_${book}_${chapter}_${language}`
    });
    console.log('✅ GA4: bible_view tracked', { book, chapter, language });
  }
}

/**
 * Tracker le début de lecture d'un livre
 * @param {string} book - Code du livre
 * @param {string} language - Code langue
 */
function trackBookStart(book, language) {
  if (window.gtag) {
    gtag('event', 'book_start', {
      book: book,
      language: language,
      event_category: 'Audio',
      event_label: `book_${book}_${language}`
    });
    console.log('✅ GA4: book_start tracked', { book, language });
  }
}

/**
 * Tracker la fin de lecture d'un livre
 * @param {string} book - Code du livre
 * @param {string} language - Code langue
 * @param {number} chaptersCompleted - Nombre de chapitres écoutés
 */
function trackBookComplete(book, language, chaptersCompleted) {
  if (window.gtag) {
    gtag('event', 'book_complete', {
      book: book,
      language: language,
      chapters_completed: chaptersCompleted,
      event_category: 'Audio',
      event_label: `book_complete_${book}_${language}`
    });
    console.log('✅ GA4: book_complete tracked', { book, language, chaptersCompleted });
  }
}

/**
 * Tracker une recherche
 * @param {string} query - Terme recherché
 * @param {number} resultsCount - Nombre de résultats
 */
function trackSearch(query, resultsCount) {
  if (window.gtag) {
    gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount,
      event_category: 'Search',
      event_label: query
    });
    console.log('✅ GA4: search tracked', { query, resultsCount });
  }
}

// Exposer les fonctions globalement
window.BibleAnalytics = {
  trackAudioPlay,
  trackShare,
  trackSignUp,
  trackLyricsView,
  trackLanguageChange,
  trackBibleView,
  trackBookStart,
  trackBookComplete,
  trackSearch
};

console.log('📊 Bible Chantée Analytics loaded');
