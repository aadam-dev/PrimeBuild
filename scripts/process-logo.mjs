/**
 * Makes the logo background transparent by treating near-white pixels as transparent.
 * Run: node scripts/process-logo.mjs
 * Reads public/logo.png, writes public/logo.png (with transparent background).
 * Keeps a backup as public/logo-original.png on first run.
 */

import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { copyFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const logoPath = join(root, "public", "logo.png");
const backupPath = join(root, "public", "logo-original.png");

async function main() {
  if (!existsSync(logoPath)) {
    console.error("public/logo.png not found.");
    process.exit(1);
  }
  if (!existsSync(backupPath)) {
    copyFileSync(logoPath, backupPath);
    console.log("Backed up logo to public/logo-original.png");
  }

  const buffer = readFileSync(logoPath);
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const threshold = 245; // pixels with R,G,B all >= this become transparent

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(logoPath);

  console.log("Logo processed: near-white background set to transparent.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
