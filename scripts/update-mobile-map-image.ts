/**
 * One-off: upload public/images/map-mobile.jpeg and point the vineyards
 * document's `mobileMapImage` at it. Patches ONLY that field — modelled on
 * scripts/update-symbol-image.ts, not the full seed (which rewrites every doc).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "next-sanity";

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

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-06-18";
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

const FILENAME = "map-mobile.jpeg";

if (!PROJECT_ID || !DATASET) {
  console.error("Missing Sanity project/dataset env vars.");
  process.exit(1);
}
if (!WRITE_TOKEN) {
  console.error(
    "SANITY_API_WRITE_TOKEN is not set — cannot write to the CMS from here.",
  );
  process.exit(2);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  const filePath = resolve(process.cwd(), "public/images", FILENAME);
  if (!existsSync(filePath)) {
    console.error(`Not found: public/images/${FILENAME}`);
    process.exit(1);
  }

  const before = await client.fetch<{ ref?: string }>(
    `*[_type=="vineyards"][0]{ "ref": mobileMapImage.asset._ref }`,
  );
  console.log(`Before: ${before?.ref ?? "(none)"}`);

  console.log(`Uploading public/images/${FILENAME} ...`);
  const asset = await client.assets.upload("image", readFileSync(filePath), {
    filename: FILENAME,
  });
  console.log(`Uploaded asset: ${asset._id}`);

  await client
    .patch("vineyards")
    .set({
      mobileMapImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  const after = await client.fetch<{ ref?: string; desktop?: string }>(
    `*[_type=="vineyards"][0]{ "ref": mobileMapImage.asset._ref, "desktop": desktopMapImage.asset._ref }`,
  );
  console.log(`After:  ${after?.ref}`);
  console.log(`Desktop map untouched: ${after?.desktop}`);
}

main().catch((error) => {
  console.error("Failed:", error?.message ?? error);
  process.exit(1);
});
