import { Jimp } from 'jimp';

const imagesToProcess = [
  {
    src: 'C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562/mythic_phoenix_pig_1791602543378.jpg',
    dest: 'public/pigs/phoenix.png',
    name: 'phoenix'
  },
  {
    src: 'C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562/mythic_galaxy_pig_1791602572500.jpg',
    dest: 'public/pigs/galaxy.png',
    name: 'galaxy'
  },
  {
    src: 'C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562/mythic_cyber_pig_1791602597526.jpg',
    dest: 'public/pigs/cyber_satoshi.png',
    name: 'cyber_satoshi'
  },
  {
    src: 'C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562/mythic_titan_pig_1791602620624.jpg',
    dest: 'public/pigs/inferno_titan.png',
    name: 'inferno_titan'
  },
  {
    src: 'C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562/mythic_angel_pig_1791602649628.jpg',
    dest: 'public/pigs/diamond_angel.png',
    name: 'diamond_angel'
  }
];

// Flood fill from all 4 corners to remove background, plus soft thresholding
async function processImage({ src, dest, name }) {
  console.log(`Processing ${name}...`);
  const img = await Jimp.read(src);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  // Step 1: Flood fill mask from the edges
  // Any pixel reachable from borders that is close to white (R>220, G>220, B>220 and maxDiff < 30)
  const visited = new Uint8Array(w * h);
  const isBgCandidate = (x, y) => {
    const idx = (y * w + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    // Almost white or light neutral background
    return minVal > 218 && (maxVal - minVal) < 28;
  };

  const queue = [];
  // Push top, bottom, left, right borders
  for (let x = 0; x < w; x++) {
    if (isBgCandidate(x, 0)) { queue.push(x, 0); visited[0 * w + x] = 1; }
    if (isBgCandidate(x, h - 1)) { queue.push(x, h - 1); visited[(h - 1) * w + x] = 1; }
  }
  for (let y = 0; y < h; y++) {
    if (isBgCandidate(0, y) && !visited[y * w + 0]) { queue.push(0, y); visited[y * w + 0] = 1; }
    if (isBgCandidate(w - 1, y) && !visited[y * w + w - 1]) { queue.push(w - 1, y); visited[y * w + w - 1] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy],
      [cx, cy + 1], [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nIndex = ny * w + nx;
        if (!visited[nIndex] && isBgCandidate(nx, ny)) {
          visited[nIndex] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Step 2: Apply alpha to visited pixels with anti-aliased edge feathering
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const nIndex = y * w + x;
      if (visited[nIndex]) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        if (brightness >= 248) {
          data[idx + 3] = 0; // Pure transparent
        } else {
          // Smooth feather edge (218 -> 248)
          const factor = Math.max(0, Math.min(1, (248 - brightness) / 30));
          data[idx + 3] = Math.round(factor * 180);
        }
      }
    }
  }

  // Step 3: Also clean ground shadows at bottom that are faint gray
  for (let y = Math.round(h * 0.85); y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      // Check if it's a dim gray shadow on the floor (not colored feet)
      const diff = Math.max(r, g, b) - Math.min(r, g, b);
      if (a > 0 && r > 180 && g > 180 && b > 180 && diff < 15) {
        data[idx + 3] = 0;
      }
    }
  }

  await img.write(dest);
  console.log(`Saved transparent sprite to ${dest}`);
}

async function run() {
  for (const item of imagesToProcess) {
    await processImage(item);
  }
  console.log('All 5 mythic diamond pigs converted to transparent PNG!');
}

run().catch(console.error);
