import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';

// Base 3D Pixar Pig assets as base64
const pinkBase64 = fs.readFileSync('public/pigs/pink.png').toString('base64');
const goldenBase64 = fs.readFileSync('public/pigs/golden.png').toString('base64');
const rainbowBase64 = fs.readFileSync('public/pigs/rainbow.png').toString('base64');
const shabuBase64 = fs.readFileSync('public/pigs/shabu.png').toString('base64');
const knightBase64 = fs.readFileSync('public/pigs/knight.png').toString('base64');

// 1. PHOENIX PIG (หมูวิหคเพลิงสุริยัน)
const phoenixSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="phoenixFlameTint">
      <feColorMatrix type="matrix" values="
        1.35 0.25 0.0  0  0.10
        0.45 0.75 0.0  0  0.02
        0.0  0.05 0.4  0 -0.08
        0    0    0    1  0" />
    </filter>

    <linearGradient id="fireWingL" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffb8f"/>
      <stop offset="30%" stop-color="#ff9800"/>
      <stop offset="70%" stop-color="#e91e63"/>
      <stop offset="100%" stop-color="#880e4f"/>
    </linearGradient>

    <linearGradient id="fireWingR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffb8f"/>
      <stop offset="30%" stop-color="#ff9800"/>
      <stop offset="70%" stop-color="#e91e63"/>
      <stop offset="100%" stop-color="#880e4f"/>
    </linearGradient>

    <linearGradient id="plumeGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#ffff55"/>
      <stop offset="45%" stop-color="#ff6d00"/>
      <stop offset="100%" stop-color="#d50000"/>
    </linearGradient>
  </defs>

  <!-- Sweeping Fire Wings on Back -->
  <g>
    <!-- Left Wing -->
    <path d="M 180 260 Q 50 170 15 90 Q 60 170 70 230 Q 110 290 180 300 Z" fill="url(#fireWingL)" filter="drop-shadow(0 0 10px rgba(249,115,22,0.75))"/>
    <path d="M 170 270 Q 70 200 35 140 Q 70 200 85 245 Q 120 290 170 295 Z" fill="url(#plumeGrad)"/>
    <path d="M 160 285 Q 90 235 60 195 Q 90 250 130 295 Z" fill="#ffff8d"/>

    <!-- Right Wing -->
    <path d="M 332 240 Q 462 150 502 70 Q 452 150 442 210 Q 402 270 332 280 Z" fill="url(#fireWingR)" filter="drop-shadow(0 0 10px rgba(249,115,22,0.75))"/>
    <path d="M 342 250 Q 442 180 482 120 Q 442 180 427 225 Q 392 270 342 275 Z" fill="url(#plumeGrad)"/>
    <path d="M 352 265 Q 422 215 457 175 Q 422 230 382 275 Z" fill="#ffff8d"/>
  </g>

  <!-- 3D Base Pig with Fiery Golden-Amber Glow -->
  <image href="data:image/png;base64,${pinkBase64}" x="76" y="70" width="360" height="360" filter="url(#phoenixFlameTint)"/>

  <!-- Phoenix Flame Crest on Head -->
  <g transform="translate(0, -25)">
    <!-- Center Plume -->
    <path d="M 235 140 Q 256 30 256 15 Q 276 50 276 140 Z" fill="url(#plumeGrad)" filter="drop-shadow(0 0 8px #ff6d00)"/>
    <path d="M 245 135 Q 256 55 256 40 Q 267 65 267 135 Z" fill="#ffff8d"/>

    <!-- Left Plume -->
    <path d="M 220 150 Q 175 70 195 45 Q 230 85 238 145 Z" fill="url(#plumeGrad)"/>
    <path d="M 226 145 Q 192 85 204 68 Q 230 95 235 140 Z" fill="#ffff8d"/>

    <!-- Right Plume -->
    <path d="M 292 150 Q 337 70 317 45 Q 282 85 274 145 Z" fill="url(#plumeGrad)"/>
    <path d="M 286 145 Q 320 85 308 68 Q 282 95 277 140 Z" fill="#ffff8d"/>

    <!-- Solar Forehead Gem -->
    <circle cx="256" cy="155" r="16" fill="#fff59d" filter="drop-shadow(0 0 8px #ff9800)"/>
    <circle cx="256" cy="155" r="10" fill="#ff6f00"/>
    <circle cx="253" cy="152" r="3.5" fill="#ffffff"/>
  </g>

  <!-- Flame Embers -->
  <circle cx="55" cy="150" r="4.5" fill="#ffff55" filter="drop-shadow(0 0 5px #ff5722)"/>
  <circle cx="455" cy="150" r="4" fill="#ffff55" filter="drop-shadow(0 0 5px #ff5722)"/>
  <circle cx="95" cy="90" r="3" fill="#ff9800"/>
  <circle cx="420" cy="90" r="3.5" fill="#ff9800"/>
</svg>
`;

// 2. GALAXY PIG (หมูเทวาจักรวาลกาแล็กซี)
const galaxySvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="galaxyTint">
      <feColorMatrix type="matrix" values="
        0.75 0.05 0.45 0  0.06
        0.10 0.65 0.45 0  0.02
        0.35 0.15 1.45 0  0.15
        0    0    0    1  0" />
    </filter>

    <linearGradient id="cosmicRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="35%" stop-color="#a855f7"/>
      <stop offset="70%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#facc15"/>
    </linearGradient>

    <linearGradient id="starHaloGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f5d4"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#7b2cbf"/>
    </linearGradient>
  </defs>

  <!-- Back Orbiting Planetary Ring -->
  <g transform="rotate(-15 256 260)">
    <path d="M 30 260 Q 256 165 482 260" stroke="url(#cosmicRing)" stroke-width="15" fill="none" opacity="0.6" stroke-linecap="round"/>
  </g>

  <!-- 3D Base Pig with Cosmic Indigo/Violet Tint -->
  <image href="data:image/png;base64,${rainbowBase64}" x="76" y="65" width="360" height="360" filter="url(#galaxyTint)"/>

  <!-- Front Orbiting Planetary Ring (Sweeping across body) -->
  <g transform="rotate(-15 256 260)">
    <path d="M 30 260 Q 256 355 482 260" stroke="url(#cosmicRing)" stroke-width="16" fill="none" opacity="0.95" stroke-linecap="round" filter="drop-shadow(0 0 12px rgba(168,85,247,0.85))"/>
    <path d="M 45 260 Q 256 345 467 260" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.85"/>
    
    <!-- Orbiting Moons -->
    <circle cx="120" cy="305" r="9.5" fill="#38bdf8" filter="drop-shadow(0 0 7px #38bdf8)"/>
    <circle cx="390" cy="305" r="11" fill="#f43f5e" filter="drop-shadow(0 0 7px #f43f5e)"/>
    <circle cx="280" cy="345" r="7.5" fill="#facc15" filter="drop-shadow(0 0 5px #facc15)"/>
  </g>

  <!-- Floating Star Halo Above Head -->
  <g transform="translate(0, -25)">
    <ellipse cx="256" cy="80" rx="65" ry="18" fill="none" stroke="url(#starHaloGrad)" stroke-width="6.5" filter="drop-shadow(0 0 12px #38bdf8)"/>
    <ellipse cx="256" cy="80" rx="63" ry="16" fill="none" stroke="#ffffff" stroke-width="2.5"/>

    <!-- 4-Pointed Celestial Star in Center -->
    <path d="M 256 55 Q 256 80 276 80 Q 256 80 256 105 Q 256 80 236 80 Q 256 80 256 55 Z" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)"/>
  </g>

  <!-- Floating Diamond Sparkles & Constellation -->
  <text x="65" y="190" font-size="22" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)">✨</text>
  <text x="435" y="180" font-size="26" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)">⭐</text>
  <text x="405" y="340" font-size="20" fill="#facc15">✨</text>
</svg>
`;

// 3. CYBER SATOSHI PIG (หมูจักรกลคริปโตไซเบอร์)
const cyberSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cyberTint">
      <feColorMatrix type="matrix" values="
        0.55 0.20 0.10 0 -0.05
        0.20 0.95 0.35 0  0.10
        0.20 0.50 1.25 0  0.22
        0    0    0    1  0" />
    </filter>

    <linearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
  </defs>

  <!-- 3D Base Pig with High-Tech Titanium Cyan Shading -->
  <image href="data:image/png;base64,${pinkBase64}" x="76" y="70" width="360" height="360" filter="url(#cyberTint)"/>

  <!-- High-Tech Curved Neon Visor over Eyes (x: 185..335, y: 205..255) -->
  <g transform="translate(0, 0)">
    <!-- Visor Black Glass Housing -->
    <path d="M 185 205 Q 260 190 335 205 Q 342 245 330 260 Q 260 250 190 260 Q 178 245 185 205 Z" fill="#090d16" stroke="#06b6d4" stroke-width="4" filter="drop-shadow(0 0 12px rgba(6,182,212,0.9))"/>
    
    <!-- Gloss Reflection -->
    <path d="M 195 212 Q 260 200 325 212" stroke="rgba(255,255,255,0.75)" stroke-width="3" fill="none" stroke-linecap="round"/>
    
    <!-- Digital Neon LED Smile ^‿^ Display -->
    <!-- Left Eye LED (^) -->
    <path d="M 210 238 L 225 220 L 240 238" stroke="#00f5d4" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 0 6px #00f5d4)"/>
    <!-- Right Eye LED (^) -->
    <path d="M 280 238 L 295 220 L 310 238" stroke="#00f5d4" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 0 6px #00f5d4)"/>
    <!-- Cute LED Heart Dot -->
    <circle cx="260" cy="235" r="3.5" fill="#f43f5e" filter="drop-shadow(0 0 4px #f43f5e)"/>
  </g>

  <!-- Cyber Antenna on Head with Floating Gold Bitcoin (₿) -->
  <g transform="translate(0, -25)">
    <rect x="253" y="65" width="6" height="50" rx="3" fill="#94a3b8" stroke="#334155" stroke-width="1.5"/>
    <circle cx="256" cy="65" r="7.5" fill="#06b6d4" filter="drop-shadow(0 0 9px #06b6d4)"/>
    
    <!-- Floating Gold Bitcoin Coin -->
    <g transform="translate(0, -20)">
      <circle cx="256" cy="45" r="28" fill="url(#goldCoinGrad)" stroke="#fef08a" stroke-width="3.5" filter="drop-shadow(0 0 14px rgba(234,179,8,0.95))"/>
      <circle cx="256" cy="45" r="23" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3 2"/>
      <text x="256" y="56" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="#ffffff" text-anchor="middle" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.5))">₿</text>
    </g>
  </g>

  <!-- Cyan Circuit Details -->
  <path d="M 140 140 L 115 110 L 95 115" stroke="#06b6d4" stroke-width="3" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 6px #06b6d4)"/>
  <circle cx="95" cy="115" r="3.5" fill="#38bdf8"/>
  <path d="M 370 140 L 395 110 L 415 115" stroke="#06b6d4" stroke-width="3" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 6px #06b6d4)"/>
  <circle cx="415" cy="115" r="3.5" fill="#38bdf8"/>
  
  <text x="430" y="240" font-size="22" fill="#06b6d4">⚡</text>
  <text x="60" y="240" font-size="22" fill="#06b6d4">💎</text>
</svg>
`;

// 4. INFERNO TITAN PIG (หมูราชาอสูรแมกม่า)
const infernoSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="magmaBasaltTint">
      <feColorMatrix type="matrix" values="
        0.85 0.05 0.0  0  0.10
        0.0  0.30 0.0  0 -0.05
        0.0  0.0  0.2  0 -0.12
        0    0    0    1  0" />
    </filter>

    <linearGradient id="lavaHornL" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="35%" stop-color="#b91c1c"/>
      <stop offset="75%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>

    <linearGradient id="lavaHornR" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="35%" stop-color="#b91c1c"/>
      <stop offset="75%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>

    <linearGradient id="moltenWingL" x1="100%" y1="50%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#450a0a"/>
      <stop offset="50%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#facc15"/>
    </linearGradient>

    <linearGradient id="moltenWingR" x1="0%" y1="50%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#450a0a"/>
      <stop offset="50%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#facc15"/>
    </linearGradient>
  </defs>

  <!-- Back Molten Demon Wings -->
  <g>
    <!-- Left Wing -->
    <path d="M 180 270 Q 70 170 20 110 Q 50 190 40 250 Q 90 290 180 305 Z" fill="url(#moltenWingL)" filter="drop-shadow(0 0 10px rgba(239,68,68,0.8))"/>
    <path d="M 170 280 Q 80 210 45 160 Q 75 220 90 260 Q 125 300 170 305 Z" fill="#ff7a00" opacity="0.85"/>
    
    <!-- Right Wing -->
    <path d="M 332 250 Q 442 150 492 90 Q 462 170 472 230 Q 422 270 332 285 Z" fill="url(#moltenWingR)" filter="drop-shadow(0 0 10px rgba(239,68,68,0.8))"/>
    <path d="M 342 260 Q 432 190 467 140 Q 437 200 422 240 Q 387 280 342 285 Z" fill="#ff7a00" opacity="0.85"/>
  </g>

  <!-- 3D Base Pig with Dark Obsidian Basalt Tint -->
  <image href="data:image/png;base64,${pinkBase64}" x="76" y="70" width="360" height="360" filter="url(#magmaBasaltTint)"/>

  <!-- Pair of Curved Magma Horns on Head -->
  <g transform="translate(0, -35)">
    <!-- Left Horn -->
    <path d="M 195 165 Q 135 95 125 30 Q 165 65 220 135 Z" fill="url(#lavaHornL)" filter="drop-shadow(0 0 10px #ea580c)"/>
    <path d="M 180 145 Q 142 90 133 45 Q 160 75 200 130 Z" fill="#fef08a" opacity="0.85"/>

    <!-- Right Horn -->
    <path d="M 320 165 Q 380 95 390 30 Q 350 65 295 135 Z" fill="url(#lavaHornR)" filter="drop-shadow(0 0 10px #ea580c)"/>
    <path d="M 335 145 Q 373 90 382 45 Q 355 75 315 130 Z" fill="#fef08a" opacity="0.85"/>
  </g>

  <!-- Magma Vein Cracks Across Face -->
  <g stroke="#ff6d00" stroke-width="3" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 6px #ff6d00)">
    <path d="M 256 160 L 250 185 L 265 205 L 256 225"/>
    <path d="M 250 185 L 230 190"/>
    <path d="M 265 205 L 280 200"/>
    <path d="M 175 290 L 195 305 L 188 325"/>
    <path d="M 335 290 L 315 305 L 322 325"/>
  </g>

  <!-- Floating Lava Sparks -->
  <circle cx="256" cy="30" r="3.5" fill="#ffeb3b" filter="drop-shadow(0 0 5px #ff5722)"/>
  <circle cx="50" cy="150" r="4" fill="#ff7a00" filter="drop-shadow(0 0 6px #f44336)"/>
  <circle cx="465" cy="150" r="4" fill="#ff7a00" filter="drop-shadow(0 0 6px #f44336)"/>
  <text x="440" y="280" font-size="22">🔥</text>
  <text x="50" y="280" font-size="22">🔥</text>
</svg>
`;

// 5. DIAMOND ANGEL PIG (หมูเทพธิดาจันทราเพชรแท้)
const angelSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="angelPearlTint">
      <feColorMatrix type="matrix" values="
        1.05 0.10 0.20 0  0.08
        0.10 0.95 0.25 0  0.06
        0.20 0.20 1.35 0  0.18
        0    0    0    1  0" />
    </filter>

    <linearGradient id="angelWingL" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#e0e7ff"/>
      <stop offset="75%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>

    <linearGradient id="angelWingR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#e0e7ff"/>
      <stop offset="75%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>

    <linearGradient id="crystalHalo" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
  </defs>

  <!-- Feathery Divine Angel Wings on Back -->
  <g>
    <!-- Left Wing -->
    <path d="M 180 270 Q 55 160 10 80 Q 55 170 65 220 Q 110 290 180 305 Z" fill="url(#angelWingL)" filter="drop-shadow(0 0 12px rgba(192,132,252,0.85))"/>
    <path d="M 170 285 Q 65 210 30 150 Q 70 220 80 255 Q 120 300 170 310 Z" fill="url(#angelWingL)"/>
    <path d="M 160 300 Q 85 255 55 220 Q 90 270 125 305 Z" fill="#ffffff"/>

    <!-- Right Wing -->
    <path d="M 332 250 Q 457 140 502 60 Q 457 150 447 200 Q 402 270 332 285 Z" fill="url(#angelWingR)" filter="drop-shadow(0 0 12px rgba(192,132,252,0.85))"/>
    <path d="M 342 265 Q 447 190 482 130 Q 442 200 432 235 Q 392 280 342 290 Z" fill="url(#angelWingR)"/>
    <path d="M 352 280 Q 427 235 457 200 Q 422 250 387 285 Z" fill="#ffffff"/>
  </g>

  <!-- 3D Base Pig with Celestial Iridescent Shimmer -->
  <image href="data:image/png;base64,${pinkBase64}" x="76" y="70" width="360" height="360" filter="url(#angelPearlTint)"/>

  <!-- Floating Prismatic Diamond Crystal Halo above Head -->
  <g transform="translate(0, -30)">
    <ellipse cx="256" cy="75" rx="68" ry="19" fill="none" stroke="url(#crystalHalo)" stroke-width="7" filter="drop-shadow(0 0 15px rgba(192,132,252,0.95))"/>
    <ellipse cx="256" cy="75" rx="66" ry="17" fill="none" stroke="#ffffff" stroke-width="2.5"/>

    <!-- Faceted Diamond Gem in Center of Halo -->
    <g transform="translate(256, 52) scale(1.1)">
      <polygon points="0,-16 16,-6 10,16 -10,16 -16,-6" fill="#ffffff" filter="drop-shadow(0 0 10px #38bdf8)"/>
      <polygon points="0,-16 16,-6 0,4" fill="#bae6fd"/>
      <polygon points="0,-16 -16,-6 0,4" fill="#e0e7ff"/>
      <polygon points="16,-6 10,16 0,4" fill="#a855f7"/>
      <polygon points="-16,-6 -10,16 0,4" fill="#c084fc"/>
    </g>
  </g>

  <!-- Diamond Gem Brooch on Belly -->
  <g transform="translate(256, 320) scale(0.95)">
    <polygon points="0,-14 14,-4 8,14 -8,14 -14,-4" fill="#ffffff" filter="drop-shadow(0 0 9px #f472b6)"/>
    <polygon points="0,-14 14,-4 0,3" fill="#fbcfe8"/>
    <polygon points="0,-14 -14,-4 0,3" fill="#f472b6"/>
    <polygon points="14,-4 8,14 0,3" fill="#ec4899"/>
    <polygon points="-14,-4 -8,14 0,3" fill="#db2777"/>
  </g>

  <!-- Sparkles -->
  <text x="50" y="180" font-size="24" fill="#c084fc" filter="drop-shadow(0 0 8px #c084fc)">💎</text>
  <text x="440" y="170" font-size="24" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)">💎</text>
  <text x="415" y="320" font-size="22">✨</text>
  <text x="75" y="320" font-size="22">✨</text>
</svg>
`;

function renderAndSave(svgStr, name) {
  fs.writeFileSync(`public/pigs/${name}.svg`, svgStr);
  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: 512 } });
  fs.writeFileSync(`public/pigs/${name}.png`, resvg.render().asPng());
  console.log(`Successfully generated refined 3D Mythic ${name}.png!`);
}

renderAndSave(phoenixSvg, 'phoenix');
renderAndSave(galaxySvg, 'galaxy');
renderAndSave(cyberSvg, 'cyber_satoshi');
renderAndSave(infernoSvg, 'inferno_titan');
renderAndSave(angelSvg, 'diamond_angel');
