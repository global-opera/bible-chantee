// BIBLE CHANTÉE - Adaptateur dictionnaire sémantique V2
// Convertit window.SemanticDictionary (ancien format) → window.SEMANTIC_DICTIONARY (V2)
// Doit être chargé APRÈS semantic-dictionary.js et AVANT semantic-engine.js

(function() {
  'use strict';

  var OLD_LANGS = ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL'];

  function convert(oldDict) {
    var newDict = {};
    for (var theme in oldDict) {
      if (!oldDict.hasOwnProperty(theme)) continue;
      var entry = oldDict[theme];
      var keywords = {};
      for (var i = 0; i < OLD_LANGS.length; i++) {
        var lang = OLD_LANGS[i];
        if (Array.isArray(entry[lang])) {
          keywords[lang] = entry[lang];
        }
      }
      newDict[theme] = {
        keywords: keywords,
        chapters: Array.isArray(entry.chapters) ? entry.chapters : []
      };
    }
    return newDict;
  }

  if (window.SemanticDictionary) {
    window.SEMANTIC_DICTIONARY = convert(window.SemanticDictionary);
    var total = Object.keys(window.SEMANTIC_DICTIONARY).length;
    console.log('[SemanticAdapter] Converti: ' + total + ' themes → window.SEMANTIC_DICTIONARY');
  } else {
    console.error('[SemanticAdapter] window.SemanticDictionary introuvable');
  }

})();
