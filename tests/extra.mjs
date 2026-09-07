const BASE = 'http://127.0.0.1:8899/';
const l = await (await fetch('http://127.0.0.1:9333/json/list')).json();
const ws = new WebSocket(l.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method === 'Runtime.exceptionThrown') errs.push((m.params.exceptionDetails.exception?.description || '').split('\n')[0]);
});
const send = (me, p = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method: me, params: p })); return new Promise(r => pending.set(i, r)); };
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error((r.result.exceptionDetails.exception?.description||'').split('\n')[0]); return r.result?.result?.value; };
const wait = ms => new Promise(r => setTimeout(r, ms));
await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? (pass++, console.log('  PASS  ' + n)) : (fail++, console.log('  FAIL  ' + n + (d ? ' -> ' + d : ''))); };

await send('Page.navigate', { url: BASE + 'lecteur.html?lang=FR&book=01_GEN&chapter=50&x=' + Date.now() });
await wait(7000);
await ev(`(async()=>{for(let i=0;i<50;i++){if(window.BOOKS&&typeof goToChapter==='function')return 1;await new Promise(r=>setTimeout(r,400));}return 0})()`);

console.log('[E1] Fin de livre : la lecture continue ne deborde pas');
const av = await ev(`({ch: currentChapter, livre: currentBook})`);
await ev(`(()=>{document.querySelector('#autoplayBtn').click();isPlaying=true;document.querySelector('#audioPlayer').dispatchEvent(new Event('ended'));return 1})()`);
await wait(2500);
const ap = await ev(`({ch: currentChapter, btn: document.getElementById('playBtn').textContent.trim(), joue: isPlaying})`);
check('chapitre 50 = dernier de la Genese', av.ch === 50, JSON.stringify(av));
check('ne passe pas a un chapitre 51 inexistant', ap.ch === 50, JSON.stringify(ap));
check('bouton revenu sur lecture', ap.btn === '▶' && ap.joue === false, JSON.stringify(ap));

console.log('\n[E2] Bouton "ajouter a la radio" et partage');
const radio = await ev(`(()=>{const n0=radioPlaylist.length;document.querySelector('#favoriteBtn').click();return {avant:n0, apres:radioPlaylist.length, dernier:JSON.stringify(radioPlaylist[radioPlaylist.length-1])}})()`);
check('chapitre courant ajoute a la playlist radio', radio.apres === radio.avant + 1, JSON.stringify(radio));
const partage = await ev(`(()=>{const i=getShareInfo();return {label:i.label,url:i.url}})()`);
check('partage coherent avec le chapitre affiche', /Gen/i.test(partage.url) && /50/.test(partage.url), JSON.stringify(partage));
console.log('        ' + partage.label + '  ' + partage.url);

console.log('\n[E3] Lien profond ?book=&chapter= (partage recu)');
await send('Page.navigate', { url: BASE + 'lecteur.html?lang=PT&book=19_PSA&chapter=23&y=' + Date.now() });
await wait(7000);
await ev(`(async()=>{for(let i=0;i<50;i++){if(window.BOOKS&&document.querySelector('#lyricsContent').textContent.trim().length>25)return 1;await new Promise(r=>setTimeout(r,400));}return 0})()`);
const deep = await ev(`({livre:currentBook, ch:currentChapter, lang:currentLang, audio:(document.querySelector('#audioPlayer').src||'').split('/').pop(), sous:document.querySelector('#headerSubtitle').textContent.trim(), paroles:document.querySelector('#lyricsContent').textContent.trim().slice(0,40)})`);
check('livre et chapitre de l URL respectes', deep.livre === '19_PSA' && deep.ch === 23, JSON.stringify(deep));
check('audio precharge correspondant', deep.audio.includes('19_PSA_23_PT'), deep.audio);
check('paroles PT chargees a la demande', deep.paroles.length > 10, deep.paroles);
console.log('        ' + deep.sous + '  |  ' + deep.paroles);

console.log('\nerreurs JS : ' + (errs.length ? errs.slice(0, 3).join(' | ') : 'aucune'));
console.log('\n=========  ' + pass + ' PASS / ' + fail + ' FAIL  =========');
ws.close(); process.exit(fail ? 1 : 0);
