import { Jimp } from 'jimp';

async function extractCleanCyber() {
  const img = await Jimp.read('C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562/mythic_cyber_pig_1791602597526.jpg');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  const visited = new Uint8Array(w * h);
  const queue = [];

  for (let x = 0; x < w; x++) {
    queue.push(x, 0); visited[0 * w + x] = 1;
    queue.push(x, h - 1); visited[(h - 1) * w + x] = 1;
  }
  for (let y = 0; y < h; y++) {
    queue.push(0, y); visited[y * w + 0] = 1;
    queue.push(w - 1, y); visited[y * w + w - 1] = 1;
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
        const nIdx = ny * w + nx;
        if (!visited[nIdx]) {
          const pIdx = nIdx * 4;
          const r = data[pIdx];
          const g = data[pIdx + 1];
          const b = data[pIdx + 2];
          const brightness = (r + g + b) / 3;
          const diff = Math.max(r, g, b) - Math.min(r, g, b);

          const isBg = (brightness > 222 && diff < 25) || (ny > 840 && brightness > 205 && diff < 20);

          if (isBg) {
            visited[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const nIdx = y * w + x;
      if (visited[nIdx]) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        if (brightness >= 244) {
          data[idx + 3] = 0;
        } else {
          const factor = Math.max(0, Math.min(1, (244 - brightness) / 30));
          data[idx + 3] = Math.round(factor * 160);
        }
      }
    }
  }

  // Clear ground below lowest hoof point
  for (let y = 896; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      data[idx + 3] = 0;
    }
  }

  await img.write('public/pigs/cyber_satoshi.png');
  console.log('Saved clean cyber_satoshi.png');
}

extractCleanCyber().catch(console.error);
