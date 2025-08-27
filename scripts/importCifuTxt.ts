import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

type Row = Record<string, string>;

function stripTones(s: string) {
  return s.replace(/([a-z]+)[1-6]\b/gi, "$1");
}
function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
function findCol(row: Row, candidates: string[]) {
  const keys = Object.keys(row);
  for (const want of candidates) {
    const hit = keys.find(k => k.trim().toLowerCase() === want.trim().toLowerCase());
    if (hit) return hit;
  }
  return null;
}

/**
 * Usage:
 *   LIMIT=1000 npm run import-cifu-txt -- ./Cifu-v1.txt
 * Env:
 *   LIMIT   -> how many to keep (default 1000)
 *   FREQCOL -> pick a frequency column by exact name (optional)
 *              otherwise we try common candidates.
 */
async function run() {
  const argPath = process.argv[2] || "Cifu-v1.txt";
  const tsvPath = path.resolve(process.cwd(), argPath);
  if (!fs.existsSync(tsvPath)) {
    console.error(`❌ File not found: ${tsvPath}`);
    process.exit(1);
  }

  console.log("📥 Reading:", tsvPath);
  const raw = fs.readFileSync(tsvPath, "utf8");
  const recs: Row[] = parse(raw, {
    columns: true,
    delimiter: "\t",
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true
  });

  if (!recs.length) {
    console.error("❌ No rows parsed from TSV.");
    process.exit(1);
  }

  // Figure out the columns we need (robust to header name variants)
  const sample = recs[0];
  const wordCol =
    findCol(sample, ["Word", "word", "Hanzi", "hanzi", "Traditional", "Traditional Chinese"]) || "";
  const jyutCol = findCol(sample, ["JyutPing", "Jyutping", "jyutping", "Pronunciation"]);
  const glossCol = findCol(sample, ["Definition", "definition", "Gloss", "English", "Meaning"]);
  const freqEnv = process.env.FREQCOL;
  const freqCol =
    (freqEnv && findCol(sample, [freqEnv])) ||
    findCol(sample, [
      "SpokenAdult (per million tokens)",
      "SpokenAdult",
      "Spoken (per million tokens)",
      "Spoken",
      "AdultSpoken",
      "Written (per million tokens)",
      "Written",
      "Overall",
      "Frequency",
    ]);

  if (!wordCol || !jyutCol) {
    console.error("❌ Could not find required columns. Detected headers:\n", Object.keys(sample));
    process.exit(1);
  }
  if (!freqCol) {
    console.warn("⚠️ No frequency column confidently detected; proceeding unsorted.");
  }

  // Sort by frequency desc (if available)
  const rows = [...recs];
  if (freqCol) {
    rows.sort((a, b) => (Number(b[freqCol] || 0) - Number(a[freqCol] || 0)));
  }

  const N = Number(process.env.LIMIT || 1000);
  const top = rows.slice(0, N);
  console.log(`🔎 Parsed ${rows.length} rows; taking top ${top.length}${freqCol ? ` by ${freqCol}` : ""}.`);

  // Map -> app schema
  const mapped = top
    .map((r) => {
      const hanzi = (r[wordCol] || "").trim();
      const rawJ = (r[jyutCol] || "").toLowerCase().trim();
      if (!hanzi || !rawJ) return null;

      // Many Cifu rows are space-separated jyutping syllables with tones (e.g., "nei5 hou2")
      // We add both the toned and no-tone variants; also allow a no-space variant.
      const withTone = rawJ.replace(/\s+/g, " ").trim();
      const noTone = stripTones(withTone);
      const compactTone = withTone.replace(/\s+/g, "");
      const compactNoTone = noTone.replace(/\s+/g, "");

      const jyut = uniq([withTone, noTone, compactTone, compactNoTone]).filter(Boolean);
      const gloss = (glossCol ? r[glossCol] : "")?.toString() || "";

      return { hanzi, jyut, gloss };
    })
    .filter(Boolean) as { hanzi: string; jyut: string[]; gloss: string }[];

  // Overwrite words.json with exactly N entries
  const outPath = path.join(process.cwd(), "src", "data", "words.json");
  const final = mapped.slice(0, N);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(final, null, 2), "utf8");
  console.log(`✅ Wrote ${final.length} entries → ${outPath}`);
  console.log(`   Source: ${tsvPath}`);
  if (freqCol) console.log(`   Sorted by: ${freqCol}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
