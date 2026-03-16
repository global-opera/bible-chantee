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
  if (!m) { console.error('Impossible de parser'); process.exit(1); }
  const data = eval('(' + m[1] + ')');

  const raw = data['01'][1];

  console.log('=== RAW (premiers 300 chars) ===');
  console.log(JSON.stringify(raw.substring(0, 300)));

  console.log('\n=== RAW: occurrences de ¶ ===');
  const pilcrowCount = (raw.match(/¶/g) || []).length;
  console.log('Nb ¶:', pilcrowCount);

  console.log('\n=== RAW: occurrences de \\n\\n ===');
  const doubleNewlineCount = (raw.match(/\n\n/g) || []).length;
  console.log('Nb \\n\\n:', doubleNewlineCount);

  const cleaned = cleanLyrics(raw);
  const paragraphs = cleaned.split('\n\n');

  console.log('\n=== HTML généré par loadLyrics() ===');
  console.log('Nb couplets:', paragraphs.length);

  const html = paragraphs.map((p, i) => {
    const lines = p.split('\n').join('<br>');
    return `<!-- COUPLET ${i+1} --><p style="margin: 0 0 1em 0;">${lines}</p>`;
  }).join('\n');

  console.log(html.substring(0, 800));

  console.log('\n=== textContent simulé ===');
  const textContent = paragraphs.join('');
  console.log('Début:', JSON.stringify(textContent.substring(0, 100)));
  console.log('Fin couplet1/début couplet2:', JSON.stringify(textContent.substring(
    paragraphs[0].length - 20, paragraphs[0].length + 30
  )));
})();
