// Charge chaque page dans Chrome et collecte erreurs JS + requetes en echec.
const PORT = 9333;
const BASE = 'http://127.0.0.1:8899/';
const PAGES = process.argv.slice(2);
const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const ws = new WebSocket(l.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); let events = [];
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method) events.push(m);
});
const send = (me, p = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method: me, params: p })); return new Promise(r => pending.set(i, r)); };
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.result?.value; };
await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable'); await send('Page.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Network.setBlockedURLs', { urls: ['*google-analytics.com*', '*googletagmanager.com*', '*analytics.google.com*', '*facebook.net*', '*doubleclick*'] });

let totalKo = 0;
for (const page of PAGES) {
  events = [];
  await send('Page.navigate', { url: BASE + page });
  await new Promise(r => setTimeout(r, 7000));
  const titre = await ev(`document.title`);
  const texte = await ev(`(document.body&&document.body.innerText||'').trim().length`);
  const pb = [];
  const vus = new Set();
  for (const e of events) {
    if (e.method === 'Runtime.exceptionThrown') {
      const t = 'EXC  ' + (e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text || '').split('\n')[0];
      if (!vus.has(t)) { vus.add(t); pb.push(t); }
    }
    if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') {
      const txt = e.params.entry.text || '';
      if (/favicon/.test(txt)) continue;
      const t = 'ERR  ' + txt.slice(0, 130);
      if (!vus.has(t)) { vus.add(t); pb.push(t); }
    }
    if (e.method === 'Network.responseReceived' && e.params.response.status >= 400 && !/favicon/.test(e.params.response.url)) {
      const t = 'NET  ' + e.params.response.status + ' ' + e.params.response.url.replace(BASE, '');
      if (!vus.has(t)) { vus.add(t); pb.push(t); }
    }
  }
  totalKo += pb.length;
  console.log((pb.length ? 'KO  ' : 'ok  ') + page.padEnd(26) + ' titre="' + titre + '" texte=' + texte);
  pb.slice(0, 8).forEach(x => console.log('      ' + x));
}
console.log('\ntotal anomalies : ' + totalKo);
ws.close(); process.exit(0);
