/**
 * Regenerate designs/11_fulfillment/apliiq-reconciliation.json from
 * src/lib/fulfillment.ts.
 *
 * The reconciliation file used to be maintained by hand and drifted
 * badly: by 2026-09-22 it still listed 6098963, 6099060 and 6112032 as
 * VERIFIED when all three had been superseded and then deleted from
 * Apliiq entirely, and it was missing two live colourways. Nothing
 * executes that file, so nothing caught it. A stale supplier record
 * that a human trusts is how the wrong SKU gets resurrected.
 *
 * So it is generated now, from the module that actually gets executed.
 * fulfillment.ts is the single source of truth for what the site can
 * order; this file is a human-readable projection of it.
 *
 *   node scripts/gen-apliiq-reconciliation.mjs [--check]
 *
 * --check exits non-zero if the committed JSON differs from what the
 * mapping would produce, so drift fails loudly instead of rotting.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "designs/11_fulfillment/apliiq-reconciliation.json");
const CHECK = process.argv.includes("--check");

// Blank per saved-design id. Read from Apliiq's own product pages; kept
// here because fulfillment.ts records identifiers, not garment specs.
const BLANKS = {
  6098962: "Sport-Tek ST720 (Sustainable Athletic Tee)",
  6099046: "Sport-Tek ST720",
  6099129: "Sport-Tek ST720",
  6098974: "Independent IND4000",
  6099064: "Independent IND4000",
  6113934: "Bella+Canvas 4810GD (Heavyweight Garment Dyed Tee)",
  6113938: "Bella+Canvas 4810GD",
  6098980: "OTTO 31-069",
  6112018: "Bella+Canvas 3010 Heavyweight Tee",
  6112026: "Bella+Canvas 3010 Heavyweight Tee",
  6114178: "Bella+Canvas 4810GD",
  6114196: "Bella+Canvas 4810GD",
  6112033: "Comfort Colors C1717",
  6112046: "AS Colour 5150 Made Crew",
  6112037: "Sport-Tek ST720",
  6113361: "Sport-Tek ST720",
};

// Designs that existed and are now GONE from the Apliiq account.
// Recorded so nobody reintroduces a dead SKU from an old document.
const RETIRED = [
  { id: 6098963, was: "GOOOL Casual Wordmark Tee - Washed Black", replaced_by: 6113934, reason: "6.75in front print; rebuilt at 10in", deleted: "2026-09-22" },
  { id: 6099060, was: "GOOOL Casual Wordmark Tee - Washed Grey", replaced_by: 6113938, reason: "6.75in front print; rebuilt at 10in", deleted: "2026-09-22" },
  { id: 6112032, was: "GOOOL Athletics Varsity Tee - Washed Black", replaced_by: 6114178, reason: "carried a back print that could not be placed inside Back Box 1; back print dropped, front rescaled to 12.5in", deleted: "before 2026-09-22" },
  { id: 6113912, was: "GOOOL Athletics Varsity Tee (11in)", replaced_by: 6114178, reason: "11in front print, superseded by 12.5in", deleted: "before 2026-09-22" },
  { id: 6113914, was: "GOOOL Athletics Varsity Tee (11in)", replaced_by: 6114196, reason: "11in front print, superseded by 12.5in", deleted: "before 2026-09-22" },
  { id: 6113937, was: "GOOOL Casual Wordmark Tee - Washed Black (wrong ink)", replaced_by: 6113934, reason: "created in error by multiselectColor while switching colourways", deleted: "before 2026-09-22" },
  { id: 6114195, was: "GOOOL Athletics Varsity Tee - Washed Navy", replaced_by: 6114196, reason: "duplicate navy varsity, never wired to the site", deleted: "2026-09-22" },
  { id: 6113886, was: "GOOOL Athletics Varsity Tee - Washed Navy", replaced_by: 6114196, reason: "duplicate navy varsity, never wired to the site", deleted: "2026-09-22" },
  { id: 6113885, was: "GOOOL Athletics Varsity Tee - Washed Navy", replaced_by: 6114196, reason: "duplicate navy varsity, never wired to the site", deleted: "2026-09-22" },
];

const fulfillment = fs.readFileSync(path.join(ROOT, "src/lib/fulfillment.ts"), "utf8");
const productsSrc = fs.readFileSync(path.join(ROOT, "src/lib/products.ts"), "utf8");

function catalogInfo(uuid) {
  const i = productsSrc.indexOf(`"${uuid}"`);
  if (i < 0) return { name: null, slug: null };
  const blk = productsSrc.slice(i, i + 4000);
  const name = (blk.match(/name:\s*"([^"]+)"/) || [])[1] ?? null;
  const slug = (blk.match(/slug:\s*"([^"]+)"/) || [])[1] ?? null;
  const active = (blk.match(/isActive:\s*(true|false)/) || [])[1] === "true";
  const forSale = (blk.match(/availableForSale:\s*(true|false)/) || [])[1] === "true";
  return { name, slug, active, forSale };
}

// Parse MAPPING: productId -> colour -> { apliiqProductId, skus }
const rows = [];
const prodRe = /^  "([0-9a-f-]{36})":\s*\{$/gm;
let pm;
while ((pm = prodRe.exec(fulfillment))) {
  const uuid = pm[1];
  // slice to the closing brace of this product block
  const rest = fulfillment.slice(pm.index);
  const end = rest.indexOf("\n  },");
  const block = rest.slice(0, end < 0 ? rest.length : end);
  const info = catalogInfo(uuid);
  // Exactly four spaces, then a letter. `skus: {` is indented six, so it
  // can no longer be mistaken for a colour key (the old class allowed a
  // leading space and captured "  skus", producing phantom rows).
  const colourRe = /^ {4}"?([A-Za-z][A-Za-z0-9 /+-]*?)"?:\s*\{\s*$/gm;
  let cm;
  while ((cm = colourRe.exec(block))) {
    const colour = cm[1].trim();
    if (colour === "skus") continue;
    const tail = block.slice(cm.index);
    const idM = tail.match(/apliiqProductId:\s*(\d+)/);
    if (!idM) continue;
    const id = Number(idM[1]);
    const skuBlock = tail.slice(0, tail.indexOf("},", tail.indexOf("skus:")) + 2);
    const skus = {};
    for (const s of skuBlock.matchAll(/\b(XS|S|M|L|XL|XXL|XXXL|OS):\s*"([^"]+)"/g)) skus[s[1]] = s[2];
    rows.push({
      product: info.name,
      color: colour,
      slug: info.slug,
      catalog_product_id: uuid,
      blank: BLANKS[id] ?? null,
      saved_design_id: id,
      per_size_skus: skus,
      catalog_is_active: info.active,
      catalog_available_for_sale: info.forSale,
    });
  }
}

rows.sort((a, b) => a.saved_design_id - b.saved_design_id);

const doc = {
  generated_by: "scripts/gen-apliiq-reconciliation.mjs",
  source_of_truth: "src/lib/fulfillment.ts",
  note:
    "GENERATED FILE. Do not hand-edit: it is a projection of the fulfillment mapping, which is what the site actually executes. " +
    "Regenerate after any mapping change and commit the result. `--check` fails if the two disagree. " +
    "Previously maintained by hand, which let it keep listing three saved designs that had been deleted from Apliiq.",
  verification:
    "Every saved_design_id below was confirmed present in the live Apliiq account on 2026-09-22, and the account contained " +
    "no saved design outside this list. Per-size SKUs were read from Apliiq's own records; the scheme is APQ-{designId}S{sizeCode}A1.",
  totals: {
    colorways: rows.length,
    distinct_products: new Set(rows.map((r) => r.catalog_product_id)).size,
    available_for_sale: rows.filter((r) => r.catalog_available_for_sale).length,
    note:
      "available_for_sale 0 is correct and deliberate: the storefront is pre-launch. " +
      "Mapping a colourway here records a verified supplier identifier; it does not open purchasing.",
  },
  rows,
  retired_designs: RETIRED,
};

const json = JSON.stringify(doc, null, 2) + "\n";

if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== json) {
    console.error("apliiq-reconciliation.json is STALE relative to fulfillment.ts.");
    console.error("Run: node scripts/gen-apliiq-reconciliation.mjs");
    process.exit(1);
  }
  console.log(`apliiq-reconciliation.json matches fulfillment.ts (${rows.length} colourways).`);
} else {
  fs.writeFileSync(OUT, json);
  console.log(`wrote ${path.relative(ROOT, OUT)}: ${rows.length} colourways, ${RETIRED.length} retired.`);
  for (const r of rows) console.log(`  ${r.saved_design_id}  ${r.product} · ${r.color}`);
}
