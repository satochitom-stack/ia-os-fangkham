/**
 * White-background removal script using Jimp
 * Run from project root: node scripts/remove_bg.mjs
 */

import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const BRAIN = 'C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562';
const PUBLIC = './public/pigs';

const FILES = [
  // 14 Pig Breeds
  { src: `${BRAIN}/iso_chibi_pink_pig_sprite_1791640967033.jpg`, dst: `${PUBLIC}/pink.png` },
  { src: `${BRAIN}/pig_auditor_1791641417106.jpg`,               dst: `${PUBLIC}/auditor.png` },
  { src: `${BRAIN}/pig_engineer_1791641429055.jpg`,              dst: `${PUBLIC}/engineer.png` },
  { src: `${BRAIN}/pig_sakura_1791641442012.jpg`,               dst: `${PUBLIC}/sakura.png` },
  { src: `${BRAIN}/pig_shabu_1791641455306.jpg`,                dst: `${PUBLIC}/shabu.png` },
  { src: `${BRAIN}/pig_golden_1791641467589.jpg`,               dst: `${PUBLIC}/golden.png` },
  { src: `${BRAIN}/pig_rainbow_1791641478526.jpg`,              dst: `${PUBLIC}/rainbow.png` },
  { src: `${BRAIN}/pig_knight_1791641504002.jpg`,               dst: `${PUBLIC}/knight.png` },
  { src: `${BRAIN}/pig_jade_dragon_1791641519874.jpg`,          dst: `${PUBLIC}/jade_dragon.png` },
  { src: `${BRAIN}/pig_phoenix_1791641532305.jpg`,              dst: `${PUBLIC}/phoenix.png` },
  { src: `${BRAIN}/pig_galaxy_1791641545251.jpg`,               dst: `${PUBLIC}/galaxy.png` },
  { src: `${BRAIN}/pig_cyber_satoshi_1791808951375.jpg`,        dst: `${PUBLIC}/cyber_satoshi.png` },
  { src: `${BRAIN}/pig_inferno_titan_1791808974086.jpg`,        dst: `${PUBLIC}/inferno_titan.png` },
  { src: `${BRAIN}/pig_diamond_angel_1791808986759.jpg`,        dst: `${PUBLIC}/diamond_angel.png` },

  // Decor Items
  { src: `${BRAIN}/iso_stone_well_sprite_1791640889000.jpg`,   dst: `${PUBLIC}/decor_stone_well.png` },
  { src: `${BRAIN}/decor_golden_palace_1791809010915.jpg`,      dst: `${PUBLIC}/decor_golden_palace_building.png` },
  { src: `${BRAIN}/decor_golden_fountain_1791809025810.jpg`,    dst: `${PUBLIC}/decor_golden_fountain.png` },
  { src: `${BRAIN}/decor_rose_hedge_1791809037370.jpg`,         dst: `${PUBLIC}/decor_rose_hedge.png` },
  { src: `${BRAIN}/decor_veggie_patch_1791809049937.jpg`,       dst: `${PUBLIC}/decor_veggie_patch.png` },
  { src: `${BRAIN}/decor_pine_tree_1791809074771.jpg`,          dst: `${PUBLIC}/decor_pine_tree.png` },
  { src: `${BRAIN}/decor_ancient_oak_1791809089939.jpg`,        dst: `${PUBLIC}/decor_ancient_oak.png` },
  { src: `${BRAIN}/decor_sakura_tree_1791809101463.jpg`,        dst: `${PUBLIC}/decor_sakura_tree.png` },
  { src: `${BRAIN}/decor_cyber_pylon_1791809113053.jpg`,        dst: `${PUBLIC}/decor_cyber_pylon.png` },
  { src: `${BRAIN}/decor_cozy_cottage_1791813900558.jpg`,       dst: `${PUBLIC}/decor_pasture_cottage.png` },
];

const WHITE_THRESHOLD = 230;

async function removeWhiteBackground(srcPath, dstPath) {
  const image = await Jimp.read(srcPath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  // Step 1: Mark all near-white pixels
  const nearWhite = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const color = image.getPixelColor(x, y);
      const r = (color >>> 24) & 0xff;
      const g = (color >>> 16) & 0xff;
      const b = (color >>> 8)  & 0xff;
      if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
        nearWhite[idx] = 1;
      }
    }
  }

  // Step 2: Flood fill from edges to find background pixels
  const isBg = new Uint8Array(width * height);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (nearWhite[idx] && !isBg[idx]) {
      isBg[idx] = 1;
      queue.push(x, y);
    }
  };

  for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
  for (let y = 0; y < height; y++) { enqueue(0, y); enqueue(width - 1, y); }

  let qi = 0;
  while (qi < queue.length) {
    const cx = queue[qi++];
    const cy = queue[qi++];
    enqueue(cx + 1, cy);
    enqueue(cx - 1, cy);
    enqueue(cx, cy + 1);
    enqueue(cx, cy - 1);
  }

  // Step 3: Set background to transparent
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isBg[y * width + x]) {
        image.setPixelColor(0x00000000, x, y);
      }
    }
  }

  fs.mkdirSync(path.dirname(dstPath), { recursive: true });
  await image.write(dstPath);
  console.log(`✅ ${path.basename(srcPath)} → ${path.basename(dstPath)}`);
}

async function main() {
  console.log('🐷 Processing background removal for all sprites...\n');
  for (const { src, dst } of FILES) {
    if (!fs.existsSync(src)) {
      console.log(`⚠️  Not found: ${path.basename(src)}`);
      continue;
    }
    try {
      await removeWhiteBackground(src, dst);
    } catch (err) {
      console.error(`❌ ${path.basename(src)}: ${err.message}`);
    }
  }
  console.log('\n🎉 Done removing white backgrounds!');
}

main().catch(console.error);
