/* Bible Chantée V3 - config (standalone) */
window.BC3 = window.BC3 || {};
BC3.LANGUAGES = ['FR','EN','PT','ES','DE','IT','AR','RU','ZH','HI','TL','SW'];
BC3.LANGUAGES_WITH_AUDIO = ['FR','EN','PT','ES','DE','IT'];
BC3.DEFAULT_LANG = 'FR';
BC3.LS_KEY_LANG = 'bc3_lang';
BC3.R2_BASE = 'https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/V3';
BC3.paths = {
  audioBase: (lang) => `${BC3.R2_BASE}/${lang}`,
  lyricsBase: './data/lyrics',
  bibleBase: './data/bible'
};