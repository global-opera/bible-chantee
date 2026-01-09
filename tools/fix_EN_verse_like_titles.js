const fs = require("fs");
const vm = require("vm");

function loadChapterTitles() {
  const ctFile = "js/chapter-titles.js";
  const ctCode = fs.readFileSync(ctFile, "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(ctCode, ctx);
  return { ctFile, T: ctx.window.CHAPTER_TITLES };
}

function cleanLine(s) {
  if (!s) return null;
  s = String(s).replace(/\r/g, "").trim();

  s = s.replace(/^#+\s*/, "");
  s = s.replace(/\[(TITLE|LYRICS|STYLE)\]/gi, "").trim();
  s = s.replace(/^(TITRE|TITLE|T[IÍ]TULO|TITEL|TITOLO)\s*:\s*/i, "").trim();

  s = s.replace(/^\*+/, "").replace(/\*+$/, "").trim();

  // retire tags type [Verse 1] / [Chorus] etc.
  s = s.replace(/^\[(verse|chorus|bridge|pre-chorus|refrain)\s*\d*\]\s*/i, "").trim();

  if (!s) return null;
  if (/^\[?lyrics\]?$/i.test(s)) return null;
  if (/^\[?title\]?$/i.test(s)) return null;
  if (/^\[?titre\]?$/i.test(s)) return null;
  if (/^#+$/.test(s)) return null;

  return s;
}

function isVerseLikeTitle(s) {
  if (!s) return true;
  const t = String(s).trim();

  // "Verse 1", "Verse 1:", "(verse 1)", "[Verse 1]", " ( Verse 12: ) " etc.
  const rx = /^\s*[\(\[]?\s*verse\s*\d+\s*:?\s*[\)\]]?\s*$/i;
  return rx.test(t);
}

function stripVerseSuffix(s) {
  if (!s) return s;
  let t = String(s).trim();

  // "Some title - Verse 1:" / "Some title - (verse 1)" / "Some title (verse 1)" / "Some title [Verse 1]"
  t = t.replace(/\s*-\s*[\(\[]?\s*verse\s*\d+\s*:?\s*[\)\]]?\s*$/i, "").trim();
  t = t.replace(/\s*[\(\[]\s*verse\s*\d+\s*:?\s*[\)\]]\s*$/i, "").trim();

  return t;
}

function extractBestTitleFromLyricsBlock(txt) {
  if (!txt) return null;
  const lines = String(txt).replace(/\r/g, "").split("\n").map(l => l.trim());

  // 1) après [TITLE]
  for (let i = 0; i < lines.length; i++) {
    if (/^\[title\]$/i.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
        const cand = cleanLine(lines[j]);
        if (cand && !isVerseLikeTitle(cand)) return cand;
      }
    }
  }

  // 2) "Title: xxx"
  for (const ln of lines) {
    const m = ln.match(/^#+\s*(TITRE|TITLE)\s*:?\s*(.+)$/i);
    if (m) {
      const cand = cleanLine(m[2]);
      if (cand && !isVerseLikeTitle(cand)) return cand;
    }
  }

  // 3) après [LYRICS], ignorer "Verse 1:" et tags
  for (let i = 0; i < lines.length; i++) {
    if (/^\[lyrics\]$/i.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 80, lines.length); j++) {
        const cand = cleanLine(lines[j]);
        if (!cand) continue;
        if (/^(verse|chorus|bridge|pre-chorus|refrain)\s*\d*:?$/i.test(cand)) continue;
        if (isVerseLikeTitle(cand)) continue;
        return cand;
      }
    }
  }

  // 4) fallback ultime: première ligne utile du bloc
  for (const ln of lines) {
    const cand = cleanLine(ln);
    if (cand && !isVerseLikeTitle(cand)) return cand;
  }

  return null;
}

function main() {
  const { ctFile, T } = loadChapterTitles();

  if (!T.EN) {
    console.error("FAIL — CHAPTER_TITLES.EN manquant");
    process.exit(2);
  }

  const lf = "lyrics/EN.json";
  if (!fs.existsSync(lf)) {
    console.error("FAIL — lyrics/EN.json introuvable");
    process.exit(2);
  }
  const data = JSON.parse(fs.readFileSync(lf, "utf8"));

  // map "01" -> "01_GEN", etc.
  const bookKeyByNum = {};
  for (const k of Object.keys(data)) {
    const bn = k.split("_")[0];
    if (bn) bookKeyByNum[bn] = k;
  }

  let cleanedSuffix = 0;
  let replacedVerseLike = 0;
  let blanked = 0;
  const badBefore = [];

  // Fix EN uniquement
  for (const b in T.EN) {
    for (const ch in T.EN[b]) {
      const before = String(T.EN[b][ch] ?? "").trim();

      // A) enlever suffixes verse-like
      const noSuffix = stripVerseSuffix(before);
      if (noSuffix !== before) {
        T.EN[b][ch] = noSuffix;
        cleanedSuffix++;
      }

      const cur = String(T.EN[b][ch] ?? "").trim();

      // B) si le titre est encore "Verse-like" (ex: "(verse 1)" ou "Verse 1:")
      if (isVerseLikeTitle(cur)) {
        badBefore.push(["EN", b, ch, cur]);

        const key = bookKeyByNum[b];
        const block = key && data[key] ? data[key][ch] : null;
        const best = extractBestTitleFromLyricsBlock(block);

        if (best) {
          T.EN[b][ch] = best;
          replacedVerseLike++;
        } else {
          // si impossible, on vide => UI affichera "Chapter XX" (fallback du lecteur)
          T.EN[b][ch] = "";
          blanked++;
        }
      }
    }
  }

  fs.writeFileSync(ctFile, "window.CHAPTER_TITLES = " + JSON.stringify(T, null, 2) + ";", "utf8");

  // Audit EN final: aucune occurrence verse-like ni suffixe
  const remaining = [];
  for (const b in T.EN) for (const ch in T.EN[b]) {
    const v = String(T.EN[b][ch] ?? "").trim();
    if (!v) continue;
    if (isVerseLikeTitle(v)) remaining.push(["EN", b, ch, v]);
    if (/\s*-\s*[\(\[]?\s*verse\s*\d+\s*:?\s*[\)\]]?\s*$/i.test(v)) remaining.push(["EN", b, ch, v]);
    if (/\s*[\(\[]\s*verse\s*\d+\s*:?\s*[\)\]]\s*$/i.test(v)) remaining.push(["EN", b, ch, v]);
  }

  console.log("OK — EN cleanedSuffix =", cleanedSuffix, "replacedVerseLike =", replacedVerseLike, "blanked =", blanked);
  console.log("AUDIT — EN verse-like remaining =", remaining.length);

  if (badBefore.length) {
    console.log("WAS BAD (sample up to 20):");
    for (const it of badBefore.slice(0, 20)) console.log("BAD_BEFORE", ...it);
  }

  if (remaining.length) {
    console.log("STILL BAD (sample up to 20):");
    for (const it of remaining.slice(0, 20)) console.log("BAD_REMAIN", ...it);
    process.exit(3);
  }

  // quelques samples utiles
  console.log("SAMPLE — EN Gen 05:", T.EN["01"]["5"]);
  console.log("SAMPLE — EN Gen 18:", T.EN["01"]["18"]);
  console.log("SAMPLE — EN Gen 19:", T.EN["01"]["19"]);
  console.log("PASS — EN titles cleaned (no Verse-like).");
}

main();
