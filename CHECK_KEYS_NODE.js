const fs = require("fs");
const vm = require("vm");
const path = require("path");

const htmlFiles = fs.readdirSync(".").filter(f => f.endsWith(".html"));
const keys = new Set();
const attrRe = /data-i18n(?:-placeholder|-title|-aria-label)?="([^"]+)"/g;

for (const f of htmlFiles) {
  const c = fs.readFileSync(f, "utf8");
  let m;
  attrRe.lastIndex = 0;
  while ((m = attrRe.exec(c))) keys.add(m[1]);
}

// Load translations explicitly from root with absolute path
const sandbox = { module: { exports: {} }, exports: {}, window: {} };
vm.createContext(sandbox);

const ROOT = path.resolve(__dirname);
const translationsPath = path.join(ROOT, 'translations.js');

console.log('[CHECK_KEYS] loading translations from:', translationsPath);

if (!fs.existsSync(translationsPath)) {
  console.error('❌ translations.js not found at root');
  process.exit(1);
}

const baseCode = fs.readFileSync(translationsPath, "utf8");
vm.runInContext(baseCode, sandbox);

let translations =
  (sandbox.module.exports && Object.keys(sandbox.module.exports).length)
    ? sandbox.module.exports
    : (sandbox.window.translations || sandbox.translations || sandbox.exports || null);

if (!translations) {
  console.error('❌ Impossible de récupérer translations depuis translations.js');
  process.exit(2);
}

console.log(
  'Total keys loaded (FR):',
  Object.keys(translations.FR || {}).length
);

const langs = ["FR","EN","PT","ES","DE"];
let any = false;

for (const k of [...keys].sort()) {
  const missing = [];
  for (const L of langs) {
    if (!translations[L] || translations[L][k] === undefined) missing.push(L);
  }
  if (missing.length) {
    any = true;
    console.log(`❌ Clé '${k}' manquante: ${missing.join(", ")}`);
  }
}

console.log(`\nClés i18n utilisées (data-i18n*): ${keys.size}`);
if (!any) console.log("✅ Toutes les clés existent dans toutes les langues (base + extra)");
process.exit(any ? 1 : 0);
