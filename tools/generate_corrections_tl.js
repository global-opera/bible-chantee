const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const { OpenAI } = require("openai");

const ROOT = path.resolve(__dirname, "..");
const CSV_PATH = path.join(ROOT, "errors_TL_completes.csv");
const OUT_JSON = path.join(ROOT, "corrections_TL.json");

function readBytes(p) {
  if (!fs.existsSync(p)) {
    console.error("Introuvable:", p);
    process.exit(1);
  }
  return fs.readFileSync(p);
}

function looksMojibake(s) {
  return /Ã.|Â.|â€™|â€œ|â€/.test(s);
}

function decodeSmart(buf) {
  const utf8 = buf.toString("utf8");
  if (!looksMojibake(utf8)) return utf8;
  const latin1 = iconv.decode(buf, "latin1");
  const fixed = Buffer.from(latin1, "binary").toString("utf8");
  return looksMojibake(fixed) ? utf8 : fixed;
}

function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  const header = lines.shift().split(",").map(s => s.trim());
  const rows = [];

  for (const line of lines) {
    const cells = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur);

    const obj = {};
    header.forEach((h, idx) => (obj[h] = (cells[idx] ?? "").trim()));
    rows.push(obj);
  }

  return rows;
}

function key(book, chap) {
  return `${String(book).padStart(2, "0")}:${String(chap)}`;
}

function normalizeTagalog(s) {
  return String(s || "")
    .replace(/[']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function buildPrompt(batch) {
  const items = batch.map(it =>
    `- ${it.book}:${it.chap}\n  FR: ${it.fr}\n  TL_CURRENT: ${it.tlCurrent}`
  ).join("\n");

  return `
Return STRICT JSON only: { "01:6": "Pamagat", ... } using exactly the keys provided.

Translate French Bible chapter song titles into natural Tagalog.
- Natural, idiomatic Tagalog (not word-for-word).
- Biblical tone where appropriate (e.g., "O Panginoon", "Tipan", "Narito").
- Title Case for proper nouns and key words.
- No French accents (é, è, ê, etc.), no French words ("Éternel", "Majesté", etc.).
- Fix mixed fragments like "ating réconfort" -> "Ating Kaaliwan".
- Keep proper nouns (Bethel, El-Bethel, Abraham, etc.).
- Tagalog does not use accented characters.

Batch:
${items}
`.trim();
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY manquant");
    process.exit(1);
  }

  const csvBuf = readBytes(CSV_PATH);
  const csvText = decodeSmart(csvBuf);
  const rows = parseCSV(csvText);

  const items = rows.map(r => ({
    book: String(r.Livre).padStart(2, "0"),
    chap: String(r.Chapitre),
    tlCurrent: r.Titre_TL_Actuel || "",
    fr: r.Titre_FR_Source || ""
  }));

  const client = new OpenAI({ apiKey });

  const correctionsFlat = {};
  const BATCH_SIZE = 40;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const prompt = buildPrompt(batch);

    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(items.length/BATCH_SIZE)}...`);

    const resp = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      temperature: 0.2,
      messages: [
        { role: "system", content: "Return strict JSON only." },
        { role: "user", content: prompt }
      ]
    });

    let txt = (resp.choices?.[0]?.message?.content || "").trim();

    // Extract JSON from markdown code blocks if present
    const jsonBlockMatch = txt.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonBlockMatch) {
      txt = jsonBlockMatch[1].trim();
    }

    let obj;
    try {
      obj = JSON.parse(txt);
    } catch {
      console.error("JSON invalide. Contenu brut:\n", txt);
      process.exit(2);
    }

    for (const [k, v] of Object.entries(obj)) {
      correctionsFlat[k] = normalizeTagalog(v);
    }
  }

  const out = {};
  for (const it of items) {
    const k = key(it.book, it.chap);
    const val = correctionsFlat[k];
    if (!val) continue;
    if (!out[it.book]) out[it.book] = {};
    out[it.book][it.chap] = val;
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), "utf8");
  console.log("OK ->", OUT_JSON);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
