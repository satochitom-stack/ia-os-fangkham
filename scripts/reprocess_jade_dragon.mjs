import { Jimp } from 'jimp';

async function extractCleanJadeDragon() {
  const img = await Jimp.read('C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562/chibi_dragon_pig_1791594521151.jpg');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  const visited = new Uint8Array(w * h);
  const queue = [];

  // Start BFS from 4 borders
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

          // Background in chibi dragon pig is pure white / very light gray studio backdrop
          // Floor shadow: brightness > 215, diff < 20
          // Normal background: brightness > 230, diff < 25
          const isBg = (brightness > 230 && diff < 25) || (ny > 840 && brightness > 210 && diff < 20);

          if (isBg) {
            visited[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Apply alpha with soft feathering
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const nIdx = y * w + x;
      if (visited[nIdx]) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        if (brightness >= 246) {
          data[idx + 3] = 0;
        } else {
          const factor = Math.max(0, Math.min(1, (246 - brightness) / 30));
          data[idx + 3] = Math.round(factor * 160);
        }
      }
    }
  }

  // Clear flat floor shadow below lowest hoof point (y > 885)
  for (let y = 885; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      data[idx + 3] = 0;
    }
  }

  await img.write('public/pigs/jade_dragon.png');
  console.log('Saved clean transparent jade_dragon.png without any box artifact!');
}

extractCleanJadeDragon().catch(console.error);
