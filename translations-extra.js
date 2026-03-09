// translations-extra.js - Extended translations for the dashboard
// Supplements translations.js with dashboard-specific i18n strings
if(typeof translations!=='undefined'){
    var extra={FR:{'lang-fr':'Francais','lang-en':'Anglais','lang-pt':'Portugais','lang-es':'Espagnol','lang-de':'Allemand','lang-it':'Italien','lang-tl':'Filipino'},EN:{'lang-fr':'French','lang-en':'English','lang-pt':'Portuguese','lang-es':'Spanish','lang-de':'German','lang-it':'Italian','lang-tl':'Filipino'},PT:{'lang-fr':'Frances','lang-en':'Ingles','lang-pt':'Portugues','lang-es':'Espanhol','lang-de':'Alemao','lang-it':'Italiano','lang-tl':'Filipino'},ES:{'lang-fr':'Frances','lang-en':'Ingles','lang-pt':'Portugues','lang-es':'Espanol','lang-de':'Aleman','lang-it':'Italiano','lang-tl':'Filipino'}};
    Object.keys(extra).forEach(function(l){if(translations[l])Object.assign(translations[l],extra[l]);});
}
