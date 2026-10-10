import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';

// Helper to remove background circles and re-render
function cleanSvgAndRender(svgPath, pngPath, auraPattern) {
  let svg = fs.readFileSync(svgPath, 'utf8');
  if (auraPattern) {
    svg = svg.replace(auraPattern, '<!-- Giant circular disc removed -->');
    fs.writeFileSync(svgPath, svg);
  }
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 512 } });
  fs.writeFileSync(pngPath, resvg.render().asPng());
  console.log(`Rendered clean ${pngPath}`);
}

cleanSvgAndRender(
  'public/pigs/phoenix.svg',
  'public/pigs/phoenix.png',
  /<circle cx="256" cy="270" r="210" fill="url\(#phoenixAura\)"\/>/
);

cleanSvgAndRender(
  'public/pigs/galaxy.svg',
  'public/pigs/galaxy.png',
  /<circle cx="256" cy="270" r="220" fill="url\(#cosmicAura\)"\/>/
);

cleanSvgAndRender(
  'public/pigs/diamond_angel.svg',
  'public/pigs/diamond_angel.png',
  /<circle cx="256" cy="270" r="220" fill="url\(#crystalAura\)"\/>/
);
