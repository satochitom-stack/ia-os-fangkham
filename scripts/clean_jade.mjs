import { Jimp } from 'jimp';

async function main() {
  const img = await Jimp.read('public/pigs/jade_dragon.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;

  // The rectangular artifact is at x: 280..325, y: 780..815 where there is a sharp cut
  // Let's inspect that region and clear the stray shadow pixels outside the natural curve of the leg/foot
  for (let y = 780; y <= 850; y++) {
    for (let x = 270; x <= 340; x++) {
      // If it's in the sharp step area (x < 312 and y < 815)
      if (x < 312 && y <= 812) {
        const idx = (y * w + x) * 4;
        img.bitmap.data[idx + 3] = 0; // make transparent
      }
    }
  }

  // Smooth the boundary edge
  await img.write('public/pigs/jade_dragon.png');
  console.log('Cleaned jade_dragon.png successfully!');
}

main().catch(console.error);
