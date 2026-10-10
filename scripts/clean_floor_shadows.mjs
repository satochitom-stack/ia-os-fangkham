import { Jimp } from 'jimp';

async function cleanFloorShadow(file, options = {}) {
  const img = await Jimp.read(file);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  // Scan bottom region (y >= 840)
  for (let y = Math.round(h * 0.82); y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const a = data[idx + 3];
      if (a === 0) continue;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const diff = Math.max(r, g, b) - Math.min(r, g, b);

      // Floor shadow criteria:
      // 1. In cyber_satoshi, the horizontal floor line on the left (x < 300, y > 840)
      if (options.cyber && x < 210 && y > 820) {
        data[idx + 3] = 0;
      }
      if (options.cyber && x > 720 && y > 820) {
        data[idx + 3] = 0;
      }
      // 2. In galaxy, the purple floor smudge on right (x > 600, y > 820)
      if (options.galaxy && x > 560 && y > 820 && (r > 190 && g > 180 && b > 200)) {
        data[idx + 3] = 0;
      }
      // 3. In phoenix, soft shadow under feet (y > 870 and neutral)
      if (options.phoenix && y > 870 && diff < 35 && (r > 160 && g > 160)) {
        data[idx + 3] = 0;
      }
      // 4. In inferno, soft shadow under feet
      if (options.titan && y > 880 && diff < 20 && (r > 180 && g > 180)) {
        data[idx + 3] = 0;
      }
    }
  }

  await img.write(file);
  console.log(`Cleaned floor shadows for ${file}`);
}

async function run() {
  await cleanFloorShadow('public/pigs/cyber_satoshi.png', { cyber: true });
  await cleanFloorShadow('public/pigs/galaxy.png', { galaxy: true });
  await cleanFloorShadow('public/pigs/phoenix.png', { phoenix: true });
  await cleanFloorShadow('public/pigs/inferno_titan.png', { titan: true });
}

run().catch(console.error);
