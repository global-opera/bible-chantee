const fs = require("fs");
const vm = require("vm");

const langs = ["FR","EN","PT","ES","DE"];
const htmlFiles = fs.readdirSync(".").filter(f => f.endsWith(".html"));

const keys = new Set();
const attrRe = /data-i18n(?:-placeholder|-title|-aria-label)?="([^"]+)"/g;

// map key -> first fallback text found in HTML (fast regex)
const fallback = new Map();

// Build fallback map from HTML quickly (NO JSDOM)
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  let m;
  attrRe.lastIndex = 0;
  while ((m = attrRe.exec(html))) {
    const k = m[1];
    keys.add(k);
    if (fallback.has(k)) continue;

    // Try to find surrounding default text for data-i18n="k"
    // 1) <tag ... data-i18n="k" ...>TEXT</tag>
    const reText = new RegExp(`data-i18n="${k.replace(/[.*+?^${}()|[\]\\]/g,'\\\\$&')}"[^>]*>([^<]{1,160})<`, "i");
    const mt = reText.exec(html);
    if (mt && mt[1] && mt[1].trim()) { fallback.set(k, mt[1].trim()); continue; }

    // 2) placeholder/title/aria-label
    const rePH = new RegExp(`data-i18n-placeholder="${k.replace(/[.*+?^${}()|[\]\\]/g,'\\\\$&')}"[^>]*placeholder="([^"]{1,160})"`, "i");
    const mph = rePH.exec(html);
    if (mph && mph[1] && mph[1].trim()) { fallback.set(k, mph[1].trim()); continue; }

    const reTitle = new RegExp(`data-i18n-title="${k.replace(/[.*+?^${}()|[\]\\]/g,'\\\\$&')}"[^>]*title="([^"]{1,160})"`, "i");
    const mti = reTitle.exec(html);
    if (mti && mti[1] && mti[1].trim()) { fallback.set(k, mti[1].trim()); continue; }

    const reAria = new RegExp(`data-i18n-aria-label="${k.replace(/[.*+?^${}()|[\]\\]/g,'\\\\$&')}"[^>]*aria-label="([^"]{1,160})"`, "i");
    const mar = reAria.exec(html);
    if (mar && mar[1] && mar[1].trim()) { fallback.set(k, mar[1].trim()); continue; }
  }
}

// Load translations.js in sandbox
const code = fs.readFileSync("translations.js", "utf8");
const sandbox = { module: { exports: {} }, exports: {}, window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

let translations =
  (sandbox.module.exports && Object.keys(sandbox.module.exports).length)
    ? sandbox.module.exports
    : (sandbox.window.translations || sandbox.translations || sandbox.exports || null);

if (!translations) {
  console.error("❌ Impossible de récupérer translations depuis translations.js");
  process.exit(2);
}

// Build extra object
const extra = {};
for (const L of langs) extra[L] = {};

const missingLines = [];

for (const k of [...keys].sort()) {
  for (const L of langs) {
    if (!translations[L] || translations[L][k] === undefined) {
      const fb = (fallback.get(k) || k);
      extra[L][k] = fb; // TEMP fallback in all langs
      missingLines.push(`${k}\t${L}\t${fb}`);
    }
  }
}

// Write report
fs.writeFileSync("translations-missing-report.txt", missingLines.join("\n"), "utf8");

// Write translations-extra.js
const out = [];
out.push("// AUTO-GENERATED: translations-extra.js");
out.push("// Temporary fallbacks for missing i18n keys (copied from HTML or key itself).");
out.push("(function(){");
out.push("  if (typeof window === 'undefined') return;");
out.push("  if (!window.translations) return;");
for (const L of langs) {
  out.push(`  window.translations["${L}"] = window.translations["${L}"] || {};`);
  for (const [k, v] of Object.entries(extra[L])) {
    const esc = String(v).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\r?\n/g,"\\n");
    out.push(`  if (window.translations["${L}"]["${k}"] === undefined) window.translations["${L}"]["${k}"] = "${esc}";`);
  }
}
out.push("})();");

fs.writeFileSync("translations-extra.js", out.join("\n"), "utf8");

console.log("✅ Généré: translations-extra.js");
console.log("✅ Généré: translations-missing-report.txt");
console.log("✅ Clés scannées:", keys.size);
console.log("✅ Missing entries:", missingLines.length);