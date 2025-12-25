const fs = require("fs");
const vm = require("vm");

const htmlFiles = fs.readdirSync(".").filter(f => f.endsWith(".html"));
const keys = new Set();
const attrRe = /data-i18n(?:-placeholder|-title|-aria-label)?="([^"]+)"/g;

for (const f of htmlFiles) {
  const c = fs.readFileSync(f, "utf8");
  let m;
  attrRe.lastIndex = 0;
  while ((m = attrRe.exec(c))) keys.add(m[1]);
}

const sandbox = { module: { exports: {} }, exports: {}, window: {} };
vm.createContext(sandbox);

// 1) Load base translations
const baseCode = fs.readFileSync("translations.js", "utf8");
vm.runInContext(baseCode, sandbox);

// 2) Ensure window.translations exists
let translations =
  (sandbox.module.exports && Object.keys(sandbox.module.exports).length)
    ? sandbox.module.exports
    : (sandbox.window.translations || sandbox.translations || sandbox.exports || null);

if (!translations) {
  console.error("❌ Impossible de récupérer translations depuis translations.js");
  process.exit(2);
}

// If module.exports was used, mirror to window for extra patching
sandbox.window.translations = sandbox.window.translations || translations;

// 3) Load translations-extra.js if present (it patches window.translations)
if (fs.existsSync("translations-extra.js")) {
  const extraCode = fs.readFileSync("translations-extra.js", "utf8");
  vm.runInContext(extraCode, sandbox);
}

// Re-read merged translations
translations = sandbox.window.translations;

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
