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

if (!PROJECT_ID || !DATASET) {
  console.error("Missing Sanity project/dataset env vars.");
  process.exit(1);
}
if (!WRITE_TOKEN) {
  console.error("SANITY_API_WRITE_TOKEN is required.");
  process.exit(1);
}

const FILENAME = "TheSymbol.jpg";
const TARGET_TAB = "The Symbol";

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

  const doc = await client.fetch<{
    items?: { _key: string; tabLabel?: { en?: string } }[];
  }>(`*[_type=="history"][0]{ items[]{ _key, tabLabel } }`);

  const items = doc?.items ?? [];
  const index = items.findIndex((i) => i.tabLabel?.en === TARGET_TAB);
  if (index === -1) {
    console.error(`Could not find the "${TARGET_TAB}" item on the history doc.`);
    process.exit(1);
  }
  const key = items[index]._key;
  console.log(`Target: history.items[${index}] (_key=${key}) — "${TARGET_TAB}"`);

  console.log(`Uploading public/images/${FILENAME} ...`);
  const asset = await client.assets.upload("image", readFileSync(filePath), {
    filename: FILENAME,
  });
  console.log(`Uploaded asset: ${asset._id}`);

  await client
    .patch("history")
    .set({
      [`items[_key=="${key}"].image`]: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  const check = await client.fetch<{ ref?: string }>(
    `*[_type=="history"][0]{ "ref": items[_key=="${key}"][0].image.asset._ref }`,
  );
  console.log(`Now referenced: ${check?.ref}`);
  console.log("Done — only this field was changed.");
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
