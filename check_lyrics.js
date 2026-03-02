const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

function cleanLyrics(text) {
  if (!text) return '';
  const styleIndex = text.indexOf('[STYLE]');
  if (styleIndex !== -1) text = text.substring(0, styleIndex);
  text = text.replace(/\[TITLE\]/gi, '');
  text = text.replace(/\[LYRICS\]/gi, '');
  text = text.replace(/\*\*\[((Vers[oe]|Chorus|Refrão|Refrain|Coro|Ponte|Puente|Bridge|Final|Fim|Outro|Intro|Introduction|Couplet|Verset|Strophe|Spoken Word)[^\]]*)\]\*\*/gi, '[$1]');
  text = text.replace(/\s*\[((Vers[oe]|Chorus|Refrão|Refrain|Coro|Ponte|Puente|Bridge|Final|Fim|Outro|Intro|Introduction|Couplet|Verset|Strophe|Spoken Word)[^\]]*)\]\s*/gi, '###PARAGRAPH_BREAK###');
  text = text.replace(/^\s*(Vers[oe]|Chorus|Refrão|Refrain|Coro|Ponte|Puente|Bridge|Final|Fim|Outro|Intro|Introduction|Couplet|Verset|Strophe)\s*\d*\s*:?\s*$/gmi, '');
  text = text.replace(/^\s*(Letras|Lyrics|LYRICS)\s*$/gmi, '');
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/[ \t]+$/gm, '');
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/^\uFEFF/, '');
  text = text.replace(/\uFEFF/g, '');
  text = text.replace(/\n*¶\s*/g, '###PARAGRAPH_BREAK###');
  text = text.replace(/\n\n+/g, '###PARAGRAPH_BREAK###');
  text = text.replace(/\n\n+/g, '\n');
  text = text.replace(/###PARAGRAPH_BREAK###/g, '\n\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/^\n+/, '');
  text = text.replace(/\n+$/, '');
  return text;
}

(async () => {
  const src = await get('https://biblechantee.com/lyrics-data-fr.js');
  const m = src.match(/window\.chapterLyricsFR\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!m) { console.error('Impossible de parser chapterLyricsFR'); process.exit(1); }
  const data = eval('(' + m[1] + ')');

  const raw = data['01'][1];
  const cleaned = cleanLyrics(raw);

  console.log('=== PAROLES Genèse 1 après cleanLyrics ===');
  console.log(cleaned.substring(0, 600));
  console.log('\n=== CHECKS ===');
  console.log('¶ présent      :', cleaned.includes('¶') ? '❌ OUI' : '✅ NON');
  console.log('1er char OK    :', /^[A-ZÀ-Ü]/.test(cleaned) ? '✅ OUI' : '❌ NON — commence par: ' + JSON.stringify(cleaned.substring(0,20)));
  const paras = cleaned.split('\n\n');
  console.log('Nb couplets    :', paras.length);
  console.log('1er couplet    :', JSON.stringify(paras[0].substring(0, 80)));
  console.log('2e couplet     :', paras[1] ? JSON.stringify(paras[1].substring(0, 80)) : 'N/A');
})();
