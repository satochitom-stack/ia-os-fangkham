import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';

const basePng = fs.readFileSync('public/pigs/golden.png').toString('base64');
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${basePng}" x="56" y="56" width="400" height="400"/>
  <circle cx="256" cy="100" r="20" fill="cyan"/>
</svg>
`;

const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 512 } });
fs.writeFileSync('public/pigs/test_composite.png', resvg.render().asPng());
console.log('Composite test successful! File written.');
