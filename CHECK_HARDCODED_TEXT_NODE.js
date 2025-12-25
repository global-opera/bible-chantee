const fs = require("fs");
const vm = require("vm");

const htmlFiles = fs.readdirSync(".").filter(f => f.endsWith(".html"));
const keys = new Set();

for (const f of htmlFiles) {
  const c = fs.readFileSync(f, "utf8");
  const re = /data-i18n="([^"]+)"/g;
  let m;
  while ((m = re.exec(c))) keys.add(m[1]);
}

const tr = fs.readFileSync("translations.js", "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(tr, sandbox);

const translations =
  sandbox.window.TRANSLATIONS ||
  sandbox.window.translations ||
  sandbox.window.i18nTranslations ||
  sandbox.TRANSLATIONS ||
  sandbox.translations;

if (!translations) {
  console.error("❌ Impossible de trouver l'objet translations dans translations.js");
  process.exit(2);
}

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

console.log(`\nClés utilisées: ${keys.size}`);
if (!any) {
  console.log("✅ Toutes les clés existent dans toutes les langues");
}
process.exit(any ? 1 : 0);
