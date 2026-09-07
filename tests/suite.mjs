// Suite de non-regression Bible Chantee - pilote un vrai Chrome via CDP.
// Usage : node suite.mjs
const BASE = 'http://127.0.0.1:8899/';
const PORT = 9333;

async function target() {
  for (let i = 0; i < 40; i++) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = l.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (p) return p.webSocketDebuggerUrl;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('pas de cible CDP');
}

const ws = new WebSocket(await target());
await new Promise(r => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
let jsErrors = [];
let netReqs = [];
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method === 'Runtime.exceptionThrown') {
    jsErrors.push((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || '').split('\n')[0]);
  }
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
    const t = m.params.entry.text || '';
    if (!/favicon/.test(t)) jsErrors.push('console: ' + t.slice(0, 120));
  }
  if (m.method === 'Network.requestWillBeSent') netReqs.push(m.params.request.url);
});
const send = (method, params = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise(r => pending.set(i, r)); };
async function ev(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error('JS: ' + (r.result.exceptionDetails.exception?.description || '').split('\n')[0]);
  return r.result?.result?.value;
}
const wait = ms => new Promise(r => setTimeout(r, ms));

await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable'); await send('Page.enable');
await send('Network.setBlockedURLs', { urls: ['*google-analytics.com*', '*googletagmanager.com*'] });

async function load(lang = 'FR', query = '') {
  jsErrors = []; netReqs = [];
  await send('Page.navigate', { url: BASE + 'lecteur.html?lang=' + lang + '&t=' + Date.now() + query });
  await wait(1500);
  const ready = await ev(`(async()=>{for(let i=0;i<60;i++){const e=document.querySelector('#lyricsContent');if(window.BOOKS&&typeof goToChapter==='function'&&e&&e.textContent.trim().length>25)return 1;await new Promise(r=>setTimeout(r,400));}return 0})()`);
  if (!ready) throw new Error('page non prete (' + lang + ')');
}
const snap = () => ev(`({
  livre: currentBook, ch: currentChapter, lang: currentLang,
  titre: document.querySelector('#headerTitle').textContent.trim(),
  sous: document.querySelector('#headerSubtitle').textContent.trim(),
  paroles: document.querySelector('#lyricsContent').textContent.trim().slice(0,45),
  bible: document.querySelector('#bibleContent').textContent.trim().slice(0,45),
  audio: (document.querySelector('#audioPlayer').src||'').split('/').pop(),
  selLivre: document.querySelector('#bookSelect').value,
  selCh: document.querySelector('#chapterSelect').value,
  coeur: document.querySelector('#likeBtn').className,
  btn: document.getElementById('playBtn').textContent.trim()
})`);

let pass = 0, fail = 0;
function check(nom, ok, detail) {
  if (ok) { pass++; console.log('  PASS  ' + nom); }
  else { fail++; console.log('  FAIL  ' + nom + (detail ? '\n        ' + detail : '')); }
}

// ---------------------------------------------------------------- T1 autoplay
console.log('\n[T1] Lecture continue : audio ET paroles avancent');
await load('FR');
await ev(`document.getElementById('playBtn').click(),1`); await wait(1200);
const a1 = await snap();
await ev(`(()=>{document.querySelector('#autoplayBtn').click();document.querySelector('#audioPlayer').dispatchEvent(new Event('ended'));return 1})()`);
await wait(3000);
const a2 = await snap();
check('chapitre incremente', a2.ch === a1.ch + 1, `${a1.ch} -> ${a2.ch}`);
check('audio du nouveau chapitre', a2.audio.includes('_02_FR'), a2.audio);
check('paroles changees', a1.paroles !== a2.paroles, a2.paroles);
check('sous-titre suit', a2.sous.includes('2'), a2.sous);

// ------------------------------------------------------------ T2 changer livre
console.log('\n[T2] Changement de livre : l audio suit le livre affiche');
const b1 = await snap();
await ev(`(()=>{const s=document.querySelector('#bookSelect');s.value='19_PSA';s.dispatchEvent(new Event('change'));return 1})()`);
await wait(3000);
const b2 = await snap();
check('audio bascule sur le nouveau livre', b2.audio.includes('19_PSA'), b2.audio);
check('titre = Psaumes', /Psaume/i.test(b2.titre), b2.titre);
check('paroles du nouveau livre', b2.paroles !== b1.paroles, b2.paroles);
check('selecteur chapitre remis a 1', String(b2.selCh) === '1', String(b2.selCh));

// ------------------------------------------------------- T3 fleches chapitre
console.log('\n[T3] Fleches chapitre : entete, paroles, favori');
await ev(`(()=>{const s=document.querySelector('#chapterSelect');s.value='3';s.dispatchEvent(new Event('change'));return 1})()`);
await wait(2500);
await ev(`toggleLike(),1`); await wait(300);
const c1 = await snap();
check('favori pose sur ch.3', /liked/.test(c1.coeur), c1.coeur);
await ev(`document.getElementById('restartBtn').click(),1`); await wait(2500);
const c2 = await snap();
check('chapitre precedent = 2', c2.ch === 2, String(c2.ch));
check('sous-titre suit le chapitre', c2.sous.includes('2'), c2.sous);
check('coeur remis a zero', !/liked/.test(c2.coeur), c2.coeur);
check('audio suit', c2.audio.includes('_02_'), c2.audio);
await ev(`document.getElementById('nextChapterBtn').click(),1`); await wait(2500);
const c3 = await snap();
check('chapitre suivant = 3', c3.ch === 3, String(c3.ch));
check('coeur retrouve son etat (ch.3 est en favori)', /liked/.test(c3.coeur), c3.coeur);
await ev(`toggleLike(),1`);

// ------------------------------------------------------------- T4 onglet Bible
console.log('\n[T4] Onglet masque rafraichi au retour');
await ev(`document.querySelector('#toggleBible').click(),1`); await wait(2500);
const d1 = await snap();
check('Bible chargee', d1.bible.length > 20, d1.bible);
await ev(`(()=>{const s=document.querySelector('#chapterSelect');s.value='8';s.dispatchEvent(new Event('change'));return 1})()`);
await wait(2500);
const d2 = await snap();
check('Bible suit le changement de chapitre', d2.bible !== d1.bible, d2.bible);
await ev(`document.querySelector('#toggleLyrics').click(),1`); await wait(2000);
const d3 = await snap();
check('paroles rechargees en revenant sur l onglet', d3.paroles !== d1.paroles, d3.paroles);

// ---------------------------------------------------------------- T5 recherche
console.log('\n[T5] Resultat de recherche : tout suit');
await ev(`(()=>{const i=document.querySelector('#searchInput');i.value='berger';document.querySelector('#searchBtn').click();return 1})()`);
await wait(2500);
const nbRes = await ev(`document.querySelectorAll('#searchResults .result-card').length`);
console.log('        (' + nbRes + ' resultats affiches)');
await ev(`(()=>{const c=document.querySelector('#searchResults .result-card');if(!c)return 0;c.click();return 1})()`);
await wait(3500);
const e1 = await snap();
check('audio coherent avec le livre affiche', e1.audio.startsWith(e1.livre.replace(/^(\d+)_/, '$1_')), e1.livre + ' / ' + e1.audio);
check('selecteurs synchronises', e1.selLivre === e1.livre && String(e1.selCh) === String(e1.ch), e1.selLivre + ' / ' + e1.selCh);

// ------------------------------------------------------------------ T6 langues
console.log('\n[T6] Changement de langue (FR -> EN -> PT)');
for (const L of ['EN', 'PT']) {
  const before = await snap();
  await ev(`(()=>{const b=[...document.querySelectorAll('.flag-btn')].find(x=>x.dataset.lang==='${L}');b.click();return 1})()`);
  await wait(4000);
  const after = await snap();
  check(L + ' : langue appliquee', after.lang === L, after.lang);
  check(L + ' : audio dans la bonne langue', after.audio.includes('_' + L + '.mp3'), after.audio);
  check(L + ' : chapitre conserve', after.ch === before.ch, before.ch + ' -> ' + after.ch);
  check(L + ' : paroles changees', after.paroles !== before.paroles, after.paroles);
  check(L + ' : sous-titre traduit', after.sous.length > 3, after.sous);
}

// -------------------------------------------------------------------- T7 radio
console.log('\n[T7] Mode radio');
await load('FR');
await ev(`(()=>{isRadioMode=true;radioPlaylist=[{book:'01_GEN',chapter:3},{book:'19_PSA',chapter:23}];radioIndex=0;radioShuffle=false;radioRepeat=true;playRadioItem(0);return 1})()`);
await wait(3000);
const f1 = await snap();
await ev(`document.querySelector('#audioPlayer').dispatchEvent(new Event('ended')),1`);
await wait(3500);
const f2 = await snap();
check('radio : livre suivant charge', f2.livre === '19_PSA' && f2.ch === 23, f2.livre + ' ' + f2.ch);
check('radio : audio correspondant', f2.audio.includes('19_PSA_23'), f2.audio);
check('radio : paroles suivent', f1.paroles !== f2.paroles, f2.paroles);
check('radio : titre suit', /Psaume/i.test(f2.titre), f2.titre);

// ------------------------------------------------------- T8 erreurs / requetes
console.log('\n[T8] Sante generale');
await load('FR');
await wait(2000);
const bibles = netReqs.filter(u => u.includes('/bibles/'));
const lyricsJs = netReqs.filter(u => /lyrics-data/.test(u)).map(u => u.split('/').pop().split('?')[0]);
const octets = await ev(`performance.getEntriesByType('resource').filter(r=>r.name.startsWith('${BASE}')).reduce((a,r)=>a+(r.decodedBodySize||0),0)`);
console.log('        Bible JSON telechargee ' + bibles.length + ' fois');
console.log('        fichiers de paroles charges : ' + (lyricsJs.length ? lyricsJs.join(', ') : 'aucun'));
console.log('        poids total decode : ' + (octets / 1048576).toFixed(1) + ' Mo');
check('aucune erreur JS au chargement', jsErrors.length === 0, jsErrors.slice(0, 4).join(' | '));
check('Bible JSON telechargee une seule fois', bibles.length <= 1, bibles.length + ' fois');

console.log('\n================  ' + pass + ' PASS / ' + fail + ' FAIL  ================');
ws.close();
process.exit(fail ? 1 : 0);
