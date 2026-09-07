const BASE = 'http://127.0.0.1:8899/';
const l = await (await fetch('http://127.0.0.1:9333/json/list')).json();
const ws = new WebSocket(l.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (me, p = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method: me, params: p })); return new Promise(r => pending.set(i, r)); };
const ev = async x => {
  const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error('JS: ' + (r.result.exceptionDetails.exception?.description || '').split('\n')[0]);
  return r.result?.result?.value;
};
await send('Runtime.enable'); await send('Page.enable');
await send('Page.navigate', { url: BASE + 'lecteur.html?lang=FR&lb=' + Date.now() });
await new Promise(r => setTimeout(r, 7000));
await ev(`(async()=>{for(let i=0;i<50;i++){if(window.BOOKS&&typeof cleanLyrics==='function')return 1;await new Promise(r=>setTimeout(r,400));}return 0})()`);
await ev(`Promise.all(['EN','PT','ES','DE','IT','TL'].map(ensureLyricsData)).then(()=>1)`);

const out = await ev(`(() => {
  const LABEL = /^[ \\t]*\\*{0,2}[ \\t]*(Verso|Verse|Coro|Chorus|Refrao|Refrão|Ritornello|Koro|Bridge|Outro|Intro|Strophe|Estribillo|Puente|Ponte|Letras?|Lyrics|Titulo|Título|Title|Titre)[ \\t]*\\d*[ \\t]*:?[ \\t]*\\*{0,2}[ \\t]*$/im;
  const TAG = /\\[[^\\]\\n]{1,40}\\]/;
  const r = {};
  for (const L of ['EN','PT','ES','DE','IT','TL']) {
    const d = window['chapterLyrics'+L] || {};
    let total = 0, koLabel = 0, koTag = 0, vides = 0;
    const ex = [];
    for (const b of Object.keys(d)) for (const c of Object.keys(d[b])) {
      const brut = String(d[b][c] || '');
      if (!brut.trim()) continue;
      total++;
      const p = cleanLyrics(brut);
      if (!p.trim()) { vides++; continue; }
      if (LABEL.test(p)) { koLabel++; if (ex.length < 2) ex.push(L+' '+b+':'+c+' label='+JSON.stringify(p.match(LABEL)[0])); }
      if (TAG.test(p)) { koTag++; if (ex.length < 4) ex.push(L+' '+b+':'+c+' balise='+p.match(TAG)[0]); }
    }
    r[L] = { total, koLabel, koTag, vides, ex };
  }
  return r;
})()`);
console.log('=== TOUS les chapitres (pas un echantillon) ===');
let ko = 0;
for (const [L, v] of Object.entries(out)) {
  ko += v.koLabel + v.koTag + v.vides;
  console.log('  ' + L + ' : ' + v.total + ' chapitres | libelle de section restant: ' + v.koLabel +
    ' | balise restante: ' + v.koTag + ' | devenus vides: ' + v.vides);
  v.ex.forEach(e => console.log('        ' + e));
}
console.log(ko === 0 ? '\nRESULTAT : aucun residu sur les 7132 chapitres' : '\nRESULTAT : ' + ko + ' cas a revoir');
ws.close(); process.exit(0);
