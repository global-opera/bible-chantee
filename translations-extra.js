// translations-extra.js - Extended translations for dashboard
// Supplements translations.js with dashboard-specific i18n strings

if (typeof translations !== 'undefined') {
    // Merge extra dashboard translations into existing translations object
  const dashboardExtras = {
        FR: {
                'dashboard-title': 'Tableau de bord',
                'visitors-today': 'Visiteurs aujourd\'hui',
                'active-countries': 'Pays actifs',
                'audio-plays': 'Lectures audio',
                'prayers-available': 'Prières disponibles',
                'shares': 'Partages',
                'signups': 'Inscriptions',
                'top-countries': 'Top pays',
                'top-pages': 'Pages populaires',
                'lang-fr': 'Français',
                'lang-en': 'Anglais',
                'lang-pt': 'Portugais',
                'lang-es': 'Espagnol',
                'lang-de': 'Allemand',
                'lang-it': 'Italien',
                'lang-tl': 'Filipino'
        },
        EN: {
                'dashboard-title': 'Dashboard',
                'visitors-today': 'Visitors today',
                'active-countries': 'Active countries',
                'audio-plays': 'Audio plays',
                'prayers-available': 'Prayers available',
                'shares': 'Shares',
                'signups': 'Signups',
                'top-countries': 'Top countries',
                'top-pages': 'Top pages',
                'lang-fr': 'French',
                'lang-en': 'English',
                'lang-pt': 'Portuguese',
                'lang-es': 'Spanish',
                'lang-de': 'German',
                'lang-it': 'Italian',
                'lang-tl': 'Filipino'
        },
        PT: {
                'dashboard-title': 'Painel',
                'visitors-today': 'Visitantes hoje',
                'active-countries': 'Paises ativos',
                'audio-plays': 'Reproducoes de audio',
                'prayers-available': 'Oracoes disponiveis',
                'shares': 'Compartilhamentos',
                'signups': 'Inscricoes',
                'top-countries': 'Principais paises',
                'top-pages': 'Paginas populares',
                'lang-fr': 'Frances',
                'lang-en': 'Ingles',
                'lang-pt': 'Portugues',
                'lang-es': 'Espanhol',
                'lang-de': 'Alemao',
                'lang-it': 'Italiano',
                'lang-tl': 'Filipino'
        },
        ES: {
                'dashboard-title': 'Panel',
                'visitors-today': 'Visitantes hoy',
                'active-countries': 'Paises activos',
                'audio-plays': 'Reproducciones de audio',
                'prayers-available': 'Oraciones disponibles',
                'shares': 'Compartidos',
                'signups': 'Registros',
                'top-countries': 'Principales paises',
                'top-pages': 'Paginas populares',
                'lang-fr': 'Frances',
                'lang-en': 'Ingles',
                'lang-pt': 'Portugues',
                'lang-es': 'Espanol',
                'lang-de': 'Aleman',
                'lang-it': 'Italiano',
                'lang-tl': 'Filipino'
        },
        DE: {
                'dashboard-title': 'Dashboard',
                'visitors-today': 'Besucher heute',
                'active-countries': 'Aktive Lander',
                'audio-plays': 'Audio-Wiedergaben',
                'prayers-available': 'Gebete verfugbar',
                'shares': 'Weitergaben',
                'signups': 'Anmeldungen',
                'lang-fr': 'Franzosisch',
                'lang-en': 'Englisch',
                'lang-pt': 'Portugiesisch',
                'lang-es': 'Spanisch',
                'lang-de': 'Deutsch',
                'lang-it': 'Italienisch',
                'lang-tl': 'Filipino'
        },
        IT: {
                'dashboard-title': 'Dashboard',
                'visitors-today': 'Visitatori oggi',
                'active-countries': 'Paesi attivi',
                'audio-plays': 'Riproduzioni audio',
                'prayers-available': 'Preghiere disponibili',
                'shares': 'Condivisioni',
                'signups': 'Iscrizioni',
                'lang-fr': 'Francese',
                'lang-en': 'Inglese',
                'lang-pt': 'Portoghese',
                'lang-es': 'Spagnolo',
                'lang-de': 'Tedesco',
                'lang-it': 'Italiano',
                'lang-tl': 'Filipino'
        },
        TL: {
                'dashboard-title': 'Dashboard',
                'visitors-today': 'Mga bisita ngayon',
                'active-countries': 'Mga aktibong bansa',
                'audio-plays': 'Mga pag-play ng audio',
                'prayers-available': 'Mga panalangin',
                'shares': 'Mga pagbabahagi',
                'signups': 'Mga nagrehistro',
                'lang-fr': 'Pranses',
                'lang-en': 'Ingles',
                'lang-pt': 'Portuges',
                'lang-es': 'Espanyol',
                'lang-de': 'Aleman',
                'lang-it': 'Italyano',
                'lang-tl': 'Filipino'
        }
  };

  Object.keys(dashboardExtras).forEach(lang => {
        if (translations[lang]) {
                Object.assign(translations[lang], dashboardExtras[lang]);
        }
  });
}
