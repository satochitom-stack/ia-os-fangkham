import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

// Helper to render SVG to PNG buffer
function renderSvgToPng(svgContent, size = 512) {
  const resvg = new Resvg(svgContent, {
    fitTo: { mode: 'width', value: size }
  });
  return resvg.render().asPng();
}

// 1. PHOENIX PIG (หมูวิหคเพลิงสุริยัน)
const phoenixSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Aura Glow -->
    <radialGradient id="phoenixAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff7a00" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#ff0055" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ff0055" stop-opacity="0"/>
    </radialGradient>

    <!-- Pig Body Sphere 3D -->
    <radialGradient id="phoenixBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffe4b5"/>
      <stop offset="35%" stop-color="#ffaa44"/>
      <stop offset="75%" stop-color="#e65100"/>
      <stop offset="100%" stop-color="#bf360c"/>
    </radialGradient>

    <!-- Belly Gradient -->
    <radialGradient id="phoenixBelly" cx="50%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#fff8e7"/>
      <stop offset="70%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#f97316"/>
    </radialGradient>

    <!-- Fire Wings Gradient -->
    <linearGradient id="fireWingLeft" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffb8f"/>
      <stop offset="25%" stop-color="#ff9800"/>
      <stop offset="60%" stop-color="#e91e63"/>
      <stop offset="100%" stop-color="#880e4f"/>
    </linearGradient>

    <linearGradient id="fireWingRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffb8f"/>
      <stop offset="25%" stop-color="#ff9800"/>
      <stop offset="60%" stop-color="#e91e63"/>
      <stop offset="100%" stop-color="#880e4f"/>
    </linearGradient>

    <!-- Crest Flames -->
    <linearGradient id="flameCrest" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#ffff55"/>
      <stop offset="40%" stop-color="#ff6d00"/>
      <stop offset="100%" stop-color="#d50000"/>
    </linearGradient>

    <!-- Snout Gradient -->
    <radialGradient id="snoutGrad" cx="35%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#ffebee"/>
      <stop offset="50%" stop-color="#ff8a80"/>
      <stop offset="100%" stop-color="#d32f2f"/>
    </radialGradient>

    <!-- Shadow -->
    <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(216, 67, 21, 0.5)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
  </defs>

  <!-- Ground Shadow -->
  <ellipse cx="256" cy="455" rx="150" ry="32" fill="url(#groundShadow)"/>

  <!-- Aura Glow -->
  <circle cx="256" cy="270" r="210" fill="url(#phoenixAura)"/>

  <!-- Back Tail Feathers (Curling Fire) -->
  <path d="M 170 380 Q 90 410 70 350 Q 110 330 160 360 Z" fill="url(#flameCrest)"/>
  <path d="M 150 395 Q 60 450 40 390 Q 90 370 140 380 Z" fill="url(#flameCrest)" opacity="0.9"/>
  <path d="M 180 405 Q 110 480 80 440 Q 120 400 170 395 Z" fill="url(#flameCrest)" opacity="0.8"/>

  <!-- Left Phoenix Wing (Sweeping Fire Plumage) -->
  <g>
    <path d="M 170 290 Q 70 210 20 160 Q 60 220 70 270 Q 110 320 170 320 Z" fill="url(#fireWingLeft)"/>
    <path d="M 160 300 Q 80 250 40 220 Q 80 270 90 310 Q 120 340 160 335 Z" fill="url(#flameCrest)"/>
    <path d="M 150 320 Q 90 300 65 290 Q 100 330 140 345 Z" fill="#ffff8d"/>
  </g>

  <!-- Right Phoenix Wing (Sweeping Fire Plumage) -->
  <g>
    <path d="M 342 290 Q 442 210 492 160 Q 452 220 442 270 Q 402 320 342 320 Z" fill="url(#fireWingRight)"/>
    <path d="M 352 300 Q 432 250 472 220 Q 432 270 422 310 Q 392 340 352 335 Z" fill="url(#flameCrest)"/>
    <path d="M 362 320 Q 422 300 447 290 Q 412 330 372 345 Z" fill="#ffff8d"/>
  </g>

  <!-- Main 3D Sphere Piglet Body -->
  <circle cx="256" cy="300" r="140" fill="url(#phoenixBody)"/>

  <!-- Soft Golden Belly -->
  <ellipse cx="256" cy="340" rx="95" ry="80" fill="url(#phoenixBelly)"/>

  <!-- Left Ear with Flame Tip -->
  <path d="M 160 210 Q 110 150 140 120 Q 185 140 190 200 Z" fill="url(#phoenixBody)"/>
  <path d="M 165 200 Q 130 160 148 138 Q 180 152 185 195 Z" fill="url(#flameCrest)"/>

  <!-- Right Ear with Flame Tip -->
  <path d="M 352 210 Q 402 150 372 120 Q 327 140 322 200 Z" fill="url(#phoenixBody)"/>
  <path d="M 347 200 Q 382 160 364 138 Q 332 152 327 195 Z" fill="url(#flameCrest)"/>

  <!-- Head Phoenix Fire Crest Crown (3 Blazing Plumes) -->
  <g>
    <!-- Center Main Plume -->
    <path d="M 235 170 Q 256 60 256 40 Q 277 80 277 170 Z" fill="url(#flameCrest)"/>
    <path d="M 245 160 Q 256 85 256 70 Q 267 95 267 160 Z" fill="#ffff8d"/>

    <!-- Left Plume -->
    <path d="M 220 180 Q 180 100 200 70 Q 235 110 240 175 Z" fill="url(#flameCrest)"/>
    <path d="M 226 170 Q 198 115 210 95 Q 235 125 238 165 Z" fill="#ffff8d"/>

    <!-- Right Plume -->
    <path d="M 292 180 Q 332 100 312 70 Q 277 110 272 175 Z" fill="url(#flameCrest)"/>
    <path d="M 286 170 Q 314 115 302 95 Q 277 125 274 165 Z" fill="#ffff8d"/>

    <!-- Glowing Sun Gem on Forehead -->
    <circle cx="256" cy="185" r="14" fill="#fff59d"/>
    <circle cx="256" cy="185" r="9" fill="#ff6f00"/>
    <circle cx="253" cy="182" r="3" fill="#ffffff"/>
  </g>

  <!-- Big Shiny Chibi Eyes -->
  <g>
    <!-- Left Eye -->
    <ellipse cx="205" cy="270" rx="20" ry="26" fill="#2e0854"/>
    <ellipse cx="205" cy="276" rx="16" ry="18" fill="#d81b60"/>
    <circle cx="198" cy="260" r="8" fill="#ffffff"/>
    <circle cx="212" cy="282" r="4" fill="#ffffff"/>
    <!-- Left Cheek Blush -->
    <ellipse cx="170" cy="308" rx="18" ry="10" fill="#ff1744" opacity="0.45"/>

    <!-- Right Eye -->
    <ellipse cx="307" cy="270" rx="20" ry="26" fill="#2e0854"/>
    <ellipse cx="307" cy="276" rx="16" ry="18" fill="#d81b60"/>
    <circle cx="300" cy="260" r="8" fill="#ffffff"/>
    <circle cx="314" cy="282" r="4" fill="#ffffff"/>
    <!-- Right Cheek Blush -->
    <ellipse cx="342" cy="308" rx="18" ry="10" fill="#ff1744" opacity="0.45"/>
  </g>

  <!-- 3D Snout -->
  <g>
    <ellipse cx="256" cy="310" rx="42" ry="30" fill="url(#snoutGrad)"/>
    <!-- Nostrils -->
    <ellipse cx="242" cy="312" rx="7" ry="10" fill="#880e4f"/>
    <ellipse cx="270" cy="312" rx="7" ry="10" fill="#880e4f"/>
    <!-- Specular Highlight -->
    <ellipse cx="246" cy="296" rx="14" ry="6" fill="#ffffff" opacity="0.75"/>
  </g>

  <!-- Golden Phoenix Sun Medallion on Chest -->
  <g>
    <circle cx="256" cy="375" r="16" fill="#ffb300"/>
    <circle cx="256" cy="375" r="12" fill="#ffd54f"/>
    <polygon points="256,367 259,374 266,375 261,379 262,386 256,382 250,386 251,379 246,375 253,374" fill="#e65100"/>
  </g>

  <!-- Cute Front Hooves / Paws -->
  <ellipse cx="210" cy="415" rx="22" ry="16" fill="url(#snoutGrad)"/>
  <ellipse cx="302" cy="415" rx="22" ry="16" fill="url(#snoutGrad)"/>
</svg>
`;

// 2. GALAXY PIG (หมูเทวาจักรวาลกาแล็กซี)
const galaxySvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep Cosmic Atmosphere -->
    <radialGradient id="cosmicAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#c084fc" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>

    <!-- Deep Space Body Gradient -->
    <radialGradient id="galaxyBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#c4b5fd"/>
      <stop offset="30%" stop-color="#6366f1"/>
      <stop offset="70%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>

    <!-- Stardust Belly -->
    <radialGradient id="galaxyBelly" cx="50%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="45%" stop-color="#f0abfc"/>
      <stop offset="85%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#581c87"/>
    </radialGradient>

    <!-- Planetary Rings Gradient -->
    <linearGradient id="saturnRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="35%" stop-color="#818cf8"/>
      <stop offset="70%" stop-color="#f472b6"/>
      <stop offset="100%" stop-color="#facc15"/>
    </linearGradient>

    <!-- Glowing Snout -->
    <radialGradient id="galaxySnout" cx="35%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#e879f9"/>
      <stop offset="100%" stop-color="#7e22ce"/>
    </radialGradient>
  </defs>

  <!-- Shadow with Stardust -->
  <ellipse cx="256" cy="455" rx="150" ry="32" fill="rgba(49, 46, 129, 0.45)"/>

  <!-- Cosmic Aura -->
  <circle cx="256" cy="270" r="220" fill="url(#cosmicAura)"/>

  <!-- Back Planetary Ring Layer (Behind Body) -->
  <g transform="rotate(-15 256 310)">
    <path d="M 20 310 A 240 60 0 0 1 492 310" stroke="url(#saturnRing)" stroke-width="26" fill="none" opacity="0.65" stroke-linecap="round"/>
    <path d="M 50 310 A 210 50 0 0 1 462 310" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.8" stroke-linecap="round"/>
  </g>

  <!-- Left Cosmic Ear -->
  <path d="M 160 210 Q 110 140 145 110 Q 190 140 190 200 Z" fill="url(#galaxyBody)"/>
  <path d="M 165 200 Q 135 155 152 132 Q 185 150 185 195 Z" fill="#e879f9" opacity="0.7"/>

  <!-- Right Cosmic Ear -->
  <path d="M 352 210 Q 402 140 367 110 Q 322 140 322 200 Z" fill="url(#galaxyBody)"/>
  <path d="M 347 200 Q 377 155 360 132 Q 327 150 327 195 Z" fill="#e879f9" opacity="0.7"/>

  <!-- Main 3D Galaxy Pig Body -->
  <circle cx="256" cy="300" r="140" fill="url(#galaxyBody)"/>

  <!-- Embedded Twinkling Constellations on Body -->
  <g fill="#ffffff">
    <circle cx="200" cy="220" r="3" opacity="0.9"/>
    <circle cx="220" cy="210" r="2" opacity="0.8"/>
    <circle cx="240" cy="225" r="3" opacity="0.95"/>
    <line x1="200" y1="220" x2="220" y2="210" stroke="#ffffff" stroke-width="1" opacity="0.4"/>
    <line x1="220" y1="210" x2="240" y2="225" stroke="#ffffff" stroke-width="1" opacity="0.4"/>

    <circle cx="310" cy="220" r="3" opacity="0.9"/>
    <circle cx="330" cy="235" r="2.5" opacity="0.8"/>
    <line x1="310" y1="220" x2="330" y2="235" stroke="#ffffff" stroke-width="1" opacity="0.4"/>

    <circle cx="160" cy="280" r="2" opacity="0.7"/>
    <circle cx="350" cy="275" r="2" opacity="0.7"/>
    <circle cx="180" cy="350" r="3" opacity="0.9"/>
    <circle cx="330" cy="350" r="3" opacity="0.9"/>
  </g>

  <!-- Glowing Stardust Nebula Belly -->
  <ellipse cx="256" cy="345" rx="95" ry="78" fill="url(#galaxyBelly)"/>

  <!-- Front Planetary Ring Layer (In Front of Body) -->
  <g transform="rotate(-15 256 310)">
    <path d="M 20 310 A 240 60 0 0 0 492 310" stroke="url(#saturnRing)" stroke-width="26" fill="none" opacity="0.95" stroke-linecap="round"/>
    <path d="M 50 310 A 210 50 0 0 0 462 310" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.95" stroke-linecap="round"/>

    <!-- Tiny Orbiting Moons / Crystals on Ring -->
    <circle cx="80" cy="335" r="9" fill="#38bdf8"/>
    <circle cx="78" cy="333" r="3" fill="#ffffff"/>

    <circle cx="420" cy="285" r="11" fill="#f43f5e"/>
    <circle cx="417" cy="282" r="4" fill="#ffffff"/>

    <circle cx="280" cy="370" r="7" fill="#facc15"/>
  </g>

  <!-- Floating Stardust Halo Above Head -->
  <g>
    <ellipse cx="256" cy="130" rx="60" ry="16" fill="none" stroke="#38bdf8" stroke-width="5" opacity="0.85"/>
    <ellipse cx="256" cy="130" rx="55" ry="13" fill="none" stroke="#f472b6" stroke-width="3" opacity="0.9"/>
    <polygon points="256,110 260,124 274,128 260,132 256,146 252,132 238,128 252,124" fill="#ffffff"/>
  </g>

  <!-- Big Shiny Galaxy Anime Eyes -->
  <g>
    <!-- Left Eye -->
    <ellipse cx="205" cy="270" rx="20" ry="26" fill="#090d16"/>
    <ellipse cx="205" cy="276" rx="16" ry="18" fill="#6366f1"/>
    <circle cx="198" cy="260" r="8" fill="#ffffff"/>
    <circle cx="212" cy="282" r="4" fill="#a5f3fc"/>
    <circle cx="206" cy="272" r="2" fill="#ffffff"/>
    <!-- Left Blush -->
    <ellipse cx="170" cy="308" rx="18" ry="10" fill="#f43f5e" opacity="0.4"/>

    <!-- Right Eye -->
    <ellipse cx="307" cy="270" rx="20" ry="26" fill="#090d16"/>
    <ellipse cx="307" cy="276" rx="16" ry="18" fill="#6366f1"/>
    <circle cx="300" cy="260" r="8" fill="#ffffff"/>
    <circle cx="314" cy="282" r="4" fill="#a5f3fc"/>
    <circle cx="308" cy="272" r="2" fill="#ffffff"/>
    <!-- Right Blush -->
    <ellipse cx="342" cy="308" rx="18" ry="10" fill="#f43f5e" opacity="0.4"/>
  </g>

  <!-- 3D Luminous Snout -->
  <g>
    <ellipse cx="256" cy="310" rx="42" ry="30" fill="url(#galaxySnout)"/>
    <ellipse cx="242" cy="312" rx="7" ry="10" fill="#3b0764"/>
    <ellipse cx="270" cy="312" rx="7" ry="10" fill="#3b0764"/>
    <ellipse cx="246" cy="296" rx="14" ry="6" fill="#ffffff" opacity="0.85"/>
  </g>

  <!-- Front Hooves with Glowing Cyan Pads -->
  <ellipse cx="210" cy="415" rx="22" ry="16" fill="url(#galaxySnout)"/>
  <ellipse cx="302" cy="415" rx="22" ry="16" fill="url(#galaxySnout)"/>
</svg>
`;

// 3. CYBER SATOSHI PIG (หมูจักรกลคริปโตไซเบอร์)
const cyberSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Cyberpunk Mech Body -->
    <radialGradient id="mechBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#e2e8f0"/>
      <stop offset="80%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </radialGradient>

    <!-- Metallic Titanium Belly -->
    <radialGradient id="mechBelly" cx="50%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="60%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#475569"/>
    </radialGradient>

    <!-- Holographic Neon Visor -->
    <linearGradient id="cyberVisor" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="30%" stop-color="#22d3ee"/>
      <stop offset="70%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>

    <!-- Gold Bitcoin Medallion -->
    <radialGradient id="goldCoin" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="45%" stop-color="#f59e0b"/>
      <stop offset="85%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </radialGradient>

    <!-- Cyan Circuit Glow -->
    <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Shadow -->
  <ellipse cx="256" cy="455" rx="150" ry="32" fill="rgba(15, 23, 42, 0.5)"/>

  <!-- Mech Body -->
  <circle cx="256" cy="300" r="140" fill="url(#mechBody)"/>

  <!-- Cybernetic Seams & Circuit Lines -->
  <g stroke="#06b6d4" stroke-width="3" fill="none" opacity="0.85">
    <path d="M 180 230 L 150 260 L 150 340"/>
    <path d="M 332 230 L 362 260 L 362 340"/>
    <circle cx="150" cy="340" r="4" fill="#06b6d4"/>
    <circle cx="362" cy="340" r="4" fill="#06b6d4"/>
  </g>

  <!-- Metallic Titanium Belly Plate -->
  <ellipse cx="256" cy="345" rx="95" ry="78" fill="url(#mechBelly)"/>
  <ellipse cx="256" cy="345" rx="90" ry="73" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="6,4" opacity="0.7"/>

  <!-- Left Mech Ear (Robotic Armor Plated) -->
  <path d="M 160 210 Q 105 140 140 110 Q 185 140 190 200 Z" fill="#475569"/>
  <path d="M 165 200 Q 130 155 148 132 Q 180 150 185 195 Z" fill="#06b6d4" opacity="0.6"/>
  <!-- Antenna on Left Ear -->
  <line x1="140" y1="110" x2="120" y2="70" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
  <circle cx="120" cy="70" r="7" fill="#22d3ee" filter="url(#cyanGlow)"/>

  <!-- Right Mech Ear -->
  <path d="M 352 210 Q 407 140 372 110 Q 327 140 322 200 Z" fill="#475569"/>
  <path d="M 347 200 Q 382 155 364 132 Q 332 150 327 195 Z" fill="#06b6d4" opacity="0.6"/>

  <!-- Cybernetic Holographic Headset / Visor Goggles -->
  <g>
    <!-- Headset Band across brow -->
    <path d="M 145 250 Q 256 220 367 250" stroke="#1e293b" stroke-width="12" fill="none"/>
    <!-- Glowing Neon Visor Shield -->
    <path d="M 160 250 Q 256 230 352 250 L 350 285 Q 256 300 162 285 Z" fill="url(#cyberVisor)" filter="url(#cyanGlow)"/>
    <!-- Digital Matrix Frequency Bars on Visor -->
    <line x1="190" y1="262" x2="220" y2="262" stroke="#ffffff" stroke-width="3"/>
    <line x1="292" y1="262" x2="322" y2="262" stroke="#ffffff" stroke-width="3"/>
    <rect x="240" y="255" width="32" height="15" rx="3" fill="#ffffff" opacity="0.9"/>
    <text x="245" y="267" font-family="monospace" font-size="10" font-weight="bold" fill="#06b6d4">BTC</text>
  </g>

  <!-- 3D Chrome Snout with LED Exhaust -->
  <g>
    <ellipse cx="256" cy="315" rx="42" ry="30" fill="url(#mechBody)"/>
    <ellipse cx="256" cy="315" rx="42" ry="30" fill="none" stroke="#06b6d4" stroke-width="3"/>
    <!-- Glowing Exhaust Nostrils -->
    <ellipse cx="242" cy="317" rx="7" ry="10" fill="#06b6d4" filter="url(#cyanGlow)"/>
    <ellipse cx="270" cy="317" rx="7" ry="10" fill="#06b6d4" filter="url(#cyanGlow)"/>
    <ellipse cx="246" cy="301" rx="14" ry="6" fill="#ffffff" opacity="0.8"/>
  </g>

  <!-- Heavy Gold Chain with Giant Bitcoin Medallion -->
  <g>
    <!-- Gold Chain links around neck -->
    <path d="M 185 340 Q 256 385 327 340" stroke="#f59e0b" stroke-width="10" fill="none" stroke-dasharray="10,4"/>
    <!-- Bitcoin Medallion Disc -->
    <circle cx="256" cy="385" r="32" fill="url(#goldCoin)"/>
    <circle cx="256" cy="385" r="28" fill="none" stroke="#fef08a" stroke-width="3"/>
    <!-- ₿ Symbol Embossed -->
    <text x="245" y="398" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))">₿</text>
  </g>

  <!-- Front Mech Hooves with Shock Absorbers -->
  <g>
    <ellipse cx="210" cy="420" rx="22" ry="16" fill="#475569"/>
    <ellipse cx="210" cy="420" rx="18" ry="12" fill="#06b6d4" opacity="0.6"/>
    <ellipse cx="302" cy="420" rx="22" ry="16" fill="#475569"/>
    <ellipse cx="302" cy="420" rx="18" ry="12" fill="#06b6d4" opacity="0.6"/>
  </g>
</svg>
`;

// 4. INFERNO TITAN PIG (หมูราชาอสูรแมกม่า)
const infernoSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Volcanic Basalt Stone Body -->
    <radialGradient id="basaltBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#44403c"/>
      <stop offset="45%" stop-color="#292524"/>
      <stop offset="85%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#0c0a09"/>
    </radialGradient>

    <!-- Molten Magma Veins -->
    <linearGradient id="magmaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="30%" stop-color="#f97316"/>
      <stop offset="70%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </linearGradient>

    <!-- Obsidian Horns -->
    <linearGradient id="obsidianHorns" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="70%" stop-color="#44403c"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>

    <!-- Magma Glow Filter -->
    <filter id="magmaFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Shadow -->
  <ellipse cx="256" cy="455" rx="155" ry="34" fill="rgba(69, 10, 10, 0.6)"/>

  <!-- Obsidian Horns Behind Ears (Curved Demonic Titan Horns) -->
  <g>
    <!-- Left Horn -->
    <path d="M 190 200 Q 110 140 100 70 Q 135 100 170 175 Z" fill="url(#obsidianHorns)"/>
    <path d="M 100 70 Q 115 80 120 100" stroke="#f97316" stroke-width="4" fill="none" filter="url(#magmaFilter)"/>

    <!-- Right Horn -->
    <path d="M 322 200 Q 402 140 412 70 Q 377 100 342 175 Z" fill="url(#obsidianHorns)"/>
    <path d="M 412 70 Q 397 80 392 100" stroke="#f97316" stroke-width="4" fill="none" filter="url(#magmaFilter)"/>
  </g>

  <!-- Left Rugged Ear -->
  <path d="M 160 210 Q 110 150 145 120 Q 185 145 190 200 Z" fill="url(#basaltBody)"/>
  <path d="M 165 200 Q 135 160 150 138 Q 180 155 185 195 Z" fill="#ea580c" opacity="0.8"/>

  <!-- Right Rugged Ear -->
  <path d="M 352 210 Q 402 150 367 120 Q 327 145 322 200 Z" fill="url(#basaltBody)"/>
  <path d="M 347 200 Q 377 160 362 138 Q 332 155 327 195 Z" fill="#ea580c" opacity="0.8"/>

  <!-- Main Giant 3D Basalt Titan Body -->
  <circle cx="256" cy="300" r="145" fill="url(#basaltBody)"/>

  <!-- Magma Fissures & Veins Radiating Across Body -->
  <g stroke="url(#magmaGlow)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#magmaFilter)">
    <path d="M 256 180 L 256 220 L 230 240 L 210 270"/>
    <path d="M 256 220 L 282 240 L 302 270"/>
    <path d="M 180 320 L 150 340 L 140 370"/>
    <path d="M 332 320 L 362 340 L 372 370"/>
    <path d="M 220 380 L 256 400 L 292 380"/>
  </g>

  <!-- Molten Core Belly -->
  <ellipse cx="256" cy="345" rx="95" ry="78" fill="#1c1917"/>
  <ellipse cx="256" cy="345" rx="85" ry="68" fill="url(#magmaGlow)" opacity="0.45" filter="url(#magmaFilter)"/>

  <!-- Burning Molten Eyes -->
  <g>
    <!-- Left Eye -->
    <ellipse cx="205" cy="270" rx="20" ry="24" fill="#000000"/>
    <ellipse cx="205" cy="272" rx="17" ry="20" fill="url(#magmaGlow)" filter="url(#magmaFilter)"/>
    <circle cx="198" cy="264" r="7" fill="#ffffff"/>

    <!-- Right Eye -->
    <ellipse cx="307" cy="270" rx="20" ry="24" fill="#000000"/>
    <ellipse cx="307" cy="272" rx="17" ry="20" fill="url(#magmaGlow)" filter="url(#magmaFilter)"/>
    <circle cx="300" cy="264" r="7" fill="#ffffff"/>
  </g>

  <!-- Heavy Stone Snout with Glowing Embers -->
  <g>
    <ellipse cx="256" cy="312" rx="42" ry="30" fill="url(#basaltBody)"/>
    <ellipse cx="256" cy="312" rx="42" ry="30" fill="none" stroke="#ea580c" stroke-width="3" filter="url(#magmaFilter)"/>
    <!-- Molten Fire Nostrils -->
    <ellipse cx="242" cy="314" rx="7" ry="10" fill="#f97316" filter="url(#magmaFilter)"/>
    <ellipse cx="270" cy="314" rx="7" ry="10" fill="#f97316" filter="url(#magmaFilter)"/>
  </g>

  <!-- Floating Lava Embers -->
  <g fill="#f97316" filter="url(#magmaFilter)">
    <circle cx="160" cy="180" r="5"/>
    <circle cx="350" cy="170" r="6"/>
    <circle cx="130" cy="260" r="4"/>
    <circle cx="380" cy="270" r="5"/>
    <circle cx="256" cy="120" r="6"/>
  </g>

  <!-- Heavy Stone Hooves -->
  <ellipse cx="205" cy="420" rx="24" ry="18" fill="#1c1917"/>
  <ellipse cx="307" cy="420" rx="24" ry="18" fill="#1c1917"/>
</svg>
`;

// 5. DIAMOND ANGEL PIG (หมูเทพธิดาจันทราเพชรแท้)
const diamondAngelSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Prismatic Diamond Crystal Aura -->
    <radialGradient id="crystalAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>

    <!-- Translucent Diamond Body -->
    <radialGradient id="diamondBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#e0f2fe"/>
      <stop offset="70%" stop-color="#c4b5fd"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </radialGradient>

    <!-- Crystalline Wings Gradient -->
    <linearGradient id="crystalWing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#bae6fd"/>
      <stop offset="70%" stop-color="#f5d0fe"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>

    <!-- Diamond Tiara Halo -->
    <linearGradient id="diamondHalo" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>

    <!-- Crystal Snout -->
    <radialGradient id="crystalSnout" cx="35%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#fbcfe8"/>
      <stop offset="100%" stop-color="#e879f9"/>
    </radialGradient>
  </defs>

  <!-- Ground Shadow -->
  <ellipse cx="256" cy="455" rx="140" ry="30" fill="rgba(192, 132, 252, 0.35)"/>

  <!-- Radiant Diamond Aura -->
  <circle cx="256" cy="270" r="220" fill="url(#crystalAura)"/>

  <!-- Four Crystalline Diamond Wings (Spreading Wide) -->
  <g>
    <!-- Left Top Large Wing -->
    <polygon points="170,260 40,160 30,220 90,260 160,285" fill="url(#crystalWing)" opacity="0.95"/>
    <polygon points="170,260 70,240 60,280 120,310 160,300" fill="url(#crystalWing)" opacity="0.85"/>

    <!-- Right Top Large Wing -->
    <polygon points="342,260 472,160 482,220 422,260 352,285" fill="url(#crystalWing)" opacity="0.95"/>
    <polygon points="342,260 442,240 452,280 392,310 352,300" fill="url(#crystalWing)" opacity="0.85"/>
  </g>

  <!-- Left Ear with Crystal Tip -->
  <path d="M 160 210 Q 110 145 145 115 Q 185 145 190 200 Z" fill="url(#diamondBody)"/>
  <polygon points="145,115 160,140 135,160" fill="#ffffff" opacity="0.9"/>

  <!-- Right Ear with Crystal Tip -->
  <path d="M 352 210 Q 402 145 367 115 Q 327 145 322 200 Z" fill="url(#diamondBody)"/>
  <polygon points="367,115 352,140 377,160" fill="#ffffff" opacity="0.9"/>

  <!-- Floating Multifaceted Diamond Halo -->
  <g>
    <ellipse cx="256" cy="110" rx="65" ry="18" fill="none" stroke="url(#diamondHalo)" stroke-width="7"/>
    <ellipse cx="256" cy="110" rx="60" ry="15" fill="none" stroke="#ffffff" stroke-width="3"/>
    <!-- Giant Sparkling Solitaire Diamond on Halo -->
    <polygon points="256,80 270,95 256,115 242,95" fill="#ffffff"/>
    <polygon points="256,80 270,95 256,98 242,95" fill="#bae6fd"/>
  </g>

  <!-- Main Crystalline Sphere Body -->
  <circle cx="256" cy="300" r="140" fill="url(#diamondBody)"/>

  <!-- Geometric Crystal Facet Reflections on Body -->
  <g fill="#ffffff" opacity="0.35">
    <polygon points="200,200 240,190 230,230 190,220"/>
    <polygon points="312,200 272,190 282,230 322,220"/>
    <polygon points="256,175 280,210 256,230 232,210"/>
  </g>

  <!-- Iridescent Pastel Belly -->
  <ellipse cx="256" cy="345" rx="95" ry="78" fill="#fdf4ff" opacity="0.85"/>

  <!-- Amethyst Jewel Chibi Eyes with Diamond Glints -->
  <g>
    <!-- Left Eye -->
    <ellipse cx="205" cy="270" rx="20" ry="26" fill="#3b0764"/>
    <ellipse cx="205" cy="276" rx="16" ry="18" fill="#a855f7"/>
    <circle cx="198" cy="260" r="8" fill="#ffffff"/>
    <circle cx="212" cy="282" r="4" fill="#38bdf8"/>
    <!-- Left Blush -->
    <ellipse cx="170" cy="308" rx="18" ry="10" fill="#f472b6" opacity="0.5"/>

    <!-- Right Eye -->
    <ellipse cx="307" cy="270" rx="20" ry="26" fill="#3b0764"/>
    <ellipse cx="307" cy="276" rx="16" ry="18" fill="#a855f7"/>
    <circle cx="300" cy="260" r="8" fill="#ffffff"/>
    <circle cx="314" cy="282" r="4" fill="#38bdf8"/>
    <!-- Right Blush -->
    <ellipse cx="342" cy="308" rx="18" ry="10" fill="#f472b6" opacity="0.5"/>
  </g>

  <!-- Crystalline Pink Snout -->
  <g>
    <ellipse cx="256" cy="310" rx="42" ry="30" fill="url(#crystalSnout)"/>
    <ellipse cx="242" cy="312" rx="7" ry="10" fill="#9333ea"/>
    <ellipse cx="270" cy="312" rx="7" ry="10" fill="#9333ea"/>
    <ellipse cx="246" cy="296" rx="14" ry="6" fill="#ffffff" opacity="0.95"/>
  </g>

  <!-- Sparkling Diamond Star Glints Around Angel -->
  <g fill="#ffffff">
    <!-- Top Left Sparkle -->
    <polygon points="120,180 124,192 136,196 124,200 120,212 116,200 104,196 116,192"/>
    <!-- Top Right Sparkle -->
    <polygon points="392,180 396,192 408,196 396,200 392,212 388,200 376,196 388,192"/>
    <!-- Bottom Center Sparkle -->
    <polygon points="256,410 259,418 267,421 259,424 256,432 253,424 245,421 253,418"/>
  </g>

  <!-- Pearlescent Hooves -->
  <ellipse cx="210" cy="415" rx="22" ry="16" fill="url(#crystalSnout)"/>
  <ellipse cx="302" cy="415" rx="22" ry="16" fill="url(#crystalSnout)"/>
</svg>
`;

const list = [
  { name: 'phoenix', svg: phoenixSvg },
  { name: 'galaxy', svg: galaxySvg },
  { name: 'cyber_satoshi', svg: cyberSvg },
  { name: 'inferno_titan', svg: infernoSvg },
  { name: 'diamond_angel', svg: diamondAngelSvg }
];

for (const item of list) {
  const pngBuf = renderSvgToPng(item.svg, 512);
  fs.writeFileSync(path.join('public', 'pigs', `${item.name}.png`), pngBuf);
  fs.writeFileSync(path.join('public', 'pigs', `${item.name}.svg`), item.svg.trim());
  console.log(`Generated public/pigs/${item.name}.png (${pngBuf.length} bytes)`);
}

console.log('All 5 custom diamond pig sprites generated successfully!');
