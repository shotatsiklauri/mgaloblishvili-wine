import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "next-sanity";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-06-18";
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

const FILENAME = "map-mobile.jpg";

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
