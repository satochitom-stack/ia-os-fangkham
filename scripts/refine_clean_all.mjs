import { Jimp } from 'jimp';

async function cleanGalaxy() {
  const img = await Jimp.read('public/pigs/galaxy.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  // Clean right-side floor artifact: x > 760, y >= 800
  for (let y = 800; y < h; y++) {
    for (let x = 760; x < w; x++) {
      const idx = (y * w + x) * 4;
      data[idx + 3] = 0;
    }
  }
  await img.write('public/pigs/galaxy.png');
  console.log('Cleaned galaxy.png');
}

async function cleanCyber() {
  const img = await Jimp.read('public/pigs/cyber_satoshi.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  // Clean bottom floor: in cyber_satoshi, the feet end around y=900.
  // Any stray floor shadow pixels below or between feet that are grayish white
  for (let y = 840; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const a = data[idx + 3];
      if (a === 0) continue;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Hooves are dark bluish-gray (r < 80, g < 120, b < 140) or glowing cyan (b > 200, g > 180, r < 100).
      // Floor line/shadow is light gray (r > 160, g > 160, b > 160)
      if (r > 150 && g > 150 && b > 150) {
        data[idx + 3] = 0;
      }
    }
  }
  await img.write('public/pigs/cyber_satoshi.png');
  console.log('Cleaned cyber_satoshi.png');
}

async function cleanJadeDragon() {
  const img = await Jimp.read('public/pigs/jade_dragon.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  // Ensure bottom floor around hooves has no sharp box cut
  for (let y = 840; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const a = data[idx + 3];
      if (a === 0) continue;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Hooves are warm pinkish-brown (r > 180, g < 140)
      // Any gray/white shadow remaining on ground (diff < 15, r > 160)
      if (Math.abs(r - g) < 18 && Math.abs(g - b) < 18 && r > 140) {
        data[idx + 3] = 0;
      }
    }
  }
  await img.write('public/pigs/jade_dragon.png');
  console.log('Cleaned jade_dragon.png');
}

async function run() {
  await cleanGalaxy();
  await cleanCyber();
  await cleanJadeDragon();
}

run().catch(console.error);
