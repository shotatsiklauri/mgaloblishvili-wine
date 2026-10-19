import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "next-sanity";

import { enContent } from "../src/data/content/en";
import { getLocalWineBottle } from "../src/data/wineBanners";

function loadEnvFile(filename: string) {
  const filePath = resolve(process.cwd(), filename);
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted) value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const EXECUTE = process.argv.includes("--execute");

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-06-18";
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!PROJECT_ID || !DATASET) {
  console.error("Missing Sanity project/dataset env vars.");
  process.exit(1);
}
if (EXECUTE && !WRITE_TOKEN) {
  console.error("SANITY_API_WRITE_TOKEN is required with --execute.");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  ...(WRITE_TOKEN ? { token: WRITE_TOKEN } : {}),
  useCdn: false,
});

// Only `bottleImage` is changed on each wine; every other field — including
// anything edited in Studio since the seed — is left as it is.
async function main() {
  console.log(
    EXECUTE
      ? "=== Wine bottles (EXECUTE) ==="
      : "=== Wine bottles (dry run) ===",
  );
  console.log(`project: ${PROJECT_ID}  dataset: ${DATASET}\n`);

  let updated = 0;
  for (const wine of enContent.wines.items) {
    const url = getLocalWineBottle(wine.id);
    if (!url) {
      console.log(`- ${wine.id}: no local bottle photo, skipped`);
      continue;
    }

    const docId = `wineItem-${wine.id}`;
    const exists = await client.fetch<boolean>(
      `defined(*[_id == $id][0]._id)`,
      {
        id: docId,
      },
    );
    if (!exists) {
      console.warn(`⚠ ${docId} not found in Sanity, skipped`);
      continue;
    }

    const filePath = resolve(process.cwd(), "public", url.slice(1));
    if (!existsSync(filePath)) {
      console.warn(`⚠ ${wine.id}: file missing, skipped: public${url}`);
      continue;
    }

    if (!EXECUTE) {
      console.log(`→ ${wine.id}: would set bottle to public${url}`);
      updated += 1;
      continue;
    }

    const asset = await client.assets.upload("image", readFileSync(filePath), {
      filename: url.split("/").pop(),
    });
    await client
      .patch(docId)
      .set({
        bottleImage: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
      })
      .commit();
    console.log(`✓ ${wine.id}: bottle set to public${url}`);
    updated += 1;
  }

  console.log(
    EXECUTE
      ? `\nDone. ${updated} wines updated.`
      : `\nDry run complete. ${updated} wines would be updated. Re-run with --execute to write.`,
  );
}

main().catch((error) => {
  console.error("Failed:", error?.message ?? error);
  process.exit(1);
});
