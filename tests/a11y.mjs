const BASE = 'http://127.0.0.1:8899/';
const l = await (await fetch('http://127.0.0.1:9333/json/list')).json();
const ws = new WebSocket(l.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (me, p = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method: me, params: p })); return new Promise(r => pending.set(i, r)); };
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error((r.result.exceptionDetails.exception?.description||'').split('\n')[0]); return r.result?.result?.value; };
await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Page.navigate', { url: BASE + 'lecteur.html?lang=FR&a=' + Date.now() });
await new Promise(r => setTimeout(r, 7000));

const rep = await ev(`(() => {
  const emoji = /^[\\p{Extended_Pictographic}\\p{Emoji_Component}\\s\\u2190-\\u21FF\\u25A0-\\u27BF]+$/u;
  const nom = el => (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim();
  const cands = [...document.querySelectorAll('button, [role=button], a')];
  const mauvais = cands.filter(b => {
    const n = nom(b);
    return b.offsetParent !== null && (!n || (emoji.test(n) && !b.getAttribute('aria-label')));
  }).map(b => (b.id ? '#' + b.id : b.tagName.toLowerCase() + '.' + String(b.className||'').split(' ')[0]));
  const champs = [...document.querySelectorAll('input, select')].filter(i =>
    !i.labels?.length && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby') && !i.getAttribute('placeholder')
  ).map(i => i.id || i.name || i.tagName);
  return {
    htmlLang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length,
    canonical: !!document.querySelector('link[rel=canonical]'),
    hreflang: document.querySelectorAll('link[rel=alternate][hreflang]').length,
    boutonsSansNom: mauvais.length, listeBoutons: mauvais.slice(0, 8),
    champsSansLabel: champs,
    imgsSansAlt: [...document.querySelectorAll('img')].filter(i => i.alt === null).length
  };
})()`);
console.log('AVANT correction : lang=fr fige, 0 h1, 0 canonical, 0 hreflang, 9 boutons sans nom, 2 champs sans label');
console.log('APRES correction :', JSON.stringify(rep, null, 1));

// lang suit-il la langue choisie ?
await ev(`(()=>{[...document.querySelectorAll('.flag-btn')].find(x=>x.dataset.lang==='PT').click();return 1})()`);
await new Promise(r => setTimeout(r, 3500));
console.log('\napres passage en PT -> <html lang="' + (await ev(`document.documentElement.lang`)) + '">');
ws.close(); process.exit(0);
