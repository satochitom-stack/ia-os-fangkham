"use client";

import React, { useRef, useState, useEffect, Component } from "react";
import * as THREE from "three";

// Safe local texture paths with fallback
const getAssetUrl = (name: string) => {
  try {
    return new URL(`/assets/${name}`, window.location.origin).href;
  } catch {
    return `./assets/${name}`;
  }
};

const TEXTURE_LOCAL = getAssetUrl("hero-texture.png");
const DEPTH_LOCAL = getAssetUrl("hero-depth.webp");

const heroFuturisticStyles = `
.hero-futuristic {
  position: relative;
  overflow: hidden;
  background: #000;
  font-family: inherit;
  width: 100%;
  height: 100vh;
}
.hero-futuristic .fade-in {
  opacity: 0;
  will-change: transform, opacity, filter, text-shadow;
  animation: 0.85s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards fadeInUpBounce,
    1.2s linear 0.7s glitch;
  transform: translateY(60px) scale(0.85) rotate(-8deg);
}
.hero-futuristic .fade-in-subtitle {
  opacity: 0;
  will-change: transform, opacity, filter, text-shadow;
  animation: 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards fadeInUpBounce,
    1.3s linear 1s glitch;
  transform: translateY(40px) scale(0.92);
}
@keyframes fadeInUpBounce {
  0% { opacity: 0; transform: translateY(60px) scale(0.85) rotate(-8deg); }
  40% { opacity: 0.7; transform: translateY(-10px) scale(1.05) rotate(2deg); }
  70% { opacity: 1; transform: translateY(4px) scale(0.98) rotate(-1deg); }
  to { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
}
@keyframes glitch {
  0% { text-shadow: 2px 0 #ff00c8, -2px 0 #00fff9; filter: blur(0.5px); transform: translate(0); }
  10% { text-shadow: -2px 0 #ff00c8, 2px 0 #00fff9; filter: blur(1px); transform: translate(-2px); }
  20% { text-shadow: 2px 2px #ff00c8, -2px -2px #00fff9; filter: blur(0.5px); transform: translate(2px); }
  30% { text-shadow: -1px 1px #ff00c8, 1px -1px #00fff9; filter: blur(1px); transform: translate(-1px); }
  40% { text-shadow: 1px -1px #ff00c8, -1px 1px #00fff9; filter: blur(0.5px); transform: translate(1px); }
  50% { text-shadow: 0 0 #ff00c8, 0 0 #00fff9; filter: blur(0); transform: translate(0); }
  to { text-shadow: none; filter: none; transform: none; }
}
.hero-futuristic .explore-btn {
  z-index: 100;
  color: #fff;
  letter-spacing: 0.05em;
  cursor: pointer;
  pointer-events: auto;
  opacity: 0;
  background: rgba(10, 15, 30, 0.85);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(6, 182, 212, 0.4);
  border-radius: 9999px;
  outline: none;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
  transition: all 0.25s ease;
  animation: 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) 2.2s forwards fadeInBtn;
  display: inline-flex;
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translate(-50%);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.8), 0 0 20px rgba(6, 182, 212, 0.2);
}
.hero-futuristic .explore-btn:hover {
  background: #06b6d4;
  color: #020617;
  border-color: #06b6d4;
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.6);
}
@keyframes fadeInBtn {
  0% { opacity: 0; transform: translate(-50%) translateY(30px) scale(0.98); }
  60% { opacity: 0.7; transform: translate(-50%) translateY(-6px) scale(1.03); }
  to { opacity: 1; transform: translate(-50%) translateY(0) scale(1); }
}
.hero-futuristic .explore-arrow {
  align-items: center;
  display: flex;
}
.hero-futuristic .arrow-svg {
  animation: 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite alternate arrowBounce;
  display: block;
}
@keyframes arrowBounce {
  0% { transform: translateY(0); }
  to { transform: translateY(6px); }
}
`;

class HeroErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.warn("Hero canvas caught by safety boundary:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
          <div className="w-80 h-80 rounded-full bg-red-600/20 blur-3xl animate-pulse" />
        </div>
      );
    }
    return this.props.children;
  }
}

// 3D Scene: Topographic Metallic Silver Geometric Polyhedra with Red Laser Scan
const ThreeCanvasScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;
    let isDisposed = false;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      // Sized properly to center behind typography without filling entire viewport
      camera.position.z = 4.3;

      // GLSL Vertex Shader: Geometric Polyhedron Morphing + 3D Topographic Ridges
      const vertexShader = `
        uniform float u_time;
        uniform int u_shapeA;
        uniform int u_shapeB;
        uniform float u_blend;

        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        varying vec3 vUnitNormal;
        varying vec2 vUv;

        // 1. Octahedron distance
        float getOctaDist(vec3 v) {
          return (abs(v.x) + abs(v.y) + abs(v.z)) * 0.72;
        }

        // 2. Cube / Hexahedron distance
        float getCubeDist(vec3 v) {
          return max(abs(v.x), max(abs(v.y), abs(v.z))) * 1.12;
        }

        // 3. Dodecahedron distance (12 pentagonal faces)
        float getDodecaDist(vec3 v) {
          const float phi = 1.61803398875;
          const float invNorm = 0.52573111211;
          vec3 a = abs(v);
          return max(a.y + phi * a.z, max(a.x + phi * a.y, a.z + phi * a.x)) * invNorm * 0.95;
        }

        // 4. Icosahedron distance (20 triangular faces)
        float getIcoDist(vec3 v) {
          const float phi = 1.61803398875;
          const float invPhi = 0.61803398875;
          const float invSqrt3 = 0.57735026919;
          vec3 a = abs(v);
          float d1 = a.x + a.y + a.z;
          float d2 = phi * a.x + invPhi * a.y;
          float d3 = phi * a.y + invPhi * a.z;
          float d4 = phi * a.z + invPhi * a.x;
          return max(max(d1, d2), max(d3, d4)) * invSqrt3 * 0.92;
        }

        // 5. Stellated Star Polyhedron
        float getStarDist(vec3 v) {
          vec3 a = abs(v);
          float d = pow(a.x, 0.65) + pow(a.y, 0.65) + pow(a.z, 0.65);
          return pow(d, 1.538) * 0.52;
        }

        float getDist(vec3 v, int idx) {
          if (idx == 0) return getIcoDist(v);
          if (idx == 1) return getOctaDist(v);
          if (idx == 2) return getCubeDist(v);
          if (idx == 3) return getDodecaDist(v);
          if (idx == 4) return getStarDist(v);
          return 0.95; // Geodesic Sphere
        }

        vec3 morphVertex(vec3 v) {
          vec3 unitV = normalize(v);
          float dA = getDist(unitV, u_shapeA);
          float dB = getDist(unitV, u_shapeB);
          vec3 posA = unitV / max(dA, 0.001);
          vec3 posB = unitV / max(dB, 0.001);

          float s = smoothstep(0.0, 1.0, u_blend);
          vec3 morphed = mix(posA, posB, s) * 0.78; // Compact elegant scale

          // Real 3D physical topographic contour ridges (ร่องรอยเส้นชั้นความสูงแบบ 3 มิติ)
          float ridgeFreq = 36.0;
          float ridgeDisplacement = sin(morphed.y * ridgeFreq + morphed.x * 3.0) * 0.025;
          return morphed + unitV * ridgeDisplacement;
        }

        void main() {
          vUv = uv;
          vec3 morphed = morphVertex(position);
          vLocalPosition = morphed;
          vUnitNormal = normalize(position);

          vec4 worldPos = modelMatrix * vec4(morphed, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `;

      // GLSL Fragment Shader: Metallic Silver / Platinum Chrome with Topographic Contour Grooves & Red Laser
      const fragmentShader = `
        uniform float u_time;
        uniform vec2 u_pointer;

        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        varying vec3 vUnitNormal;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          // Sharp polygonal facet normal via derivatives
          vec3 fdx = dFdx(vWorldPosition);
          vec3 fdy = dFdy(vWorldPosition);
          vec3 facetNormal = normalize(cross(fdx, fdy));

          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          if (dot(facetNormal, viewDir) < 0.0) {
            facetNormal = -facetNormal;
          }

          // Topographic zebra contour grooves (เส้นร่องลายชั้นความสูงสีเงิน/ดำเงา)
          float ridgeFreq = 36.0;
          float ridgeWave = sin(vLocalPosition.y * ridgeFreq + vLocalPosition.x * 3.0);
          float ridge = smoothstep(-0.25, 0.65, ridgeWave);

          // Metallic Silver / Chrome Monochrome Palette (สีเงินเงางาม ตัดกับร่องเงาดำ)
          vec3 grooveColor = vec3(0.07, 0.08, 0.10);       // ร่องลึกเงามืด
          vec3 silverBase = vec3(0.72, 0.75, 0.80);        // ผิวเนื้อเงินแท้
          vec3 silverHighlight = vec3(0.98, 0.99, 1.0);    // ไฮไลท์สะท้อนแสงสีเงินสว่าง

          vec3 surfaceAlbedo = mix(grooveColor, silverBase, ridge);

          // Key Light: Pure White/Silver Top-Right Studio Light
          vec3 light1Dir = normalize(vec3(1.2, 2.0, 2.0));
          float diff1 = max(dot(facetNormal, light1Dir), 0.0);
          vec3 half1 = normalize(light1Dir + viewDir);
          float spec1 = pow(max(dot(facetNormal, half1), 0.0), 38.0);

          // Secondary Fill Light: Cool Silver-Blue Bottom-Left Light
          vec3 light2Dir = normalize(vec3(-1.8, -1.2, 1.6));
          float diff2 = max(dot(facetNormal, light2Dir), 0.0);
          vec3 half2 = normalize(light2Dir + viewDir);
          float spec2 = pow(max(dot(facetNormal, half2), 0.0), 24.0);

          // Chrome Fresnel Edge Glow
          float fresnel = pow(1.0 - max(dot(facetNormal, viewDir), 0.0), 2.4);

          // Combine lit metallic silver surface
          vec3 litSilver = surfaceAlbedo * (0.35 + 0.65 * diff1)
            + silverHighlight * (spec1 * 1.25 * (0.6 + 0.4 * ridge))
            + vec3(0.7, 0.75, 0.82) * (diff2 * 0.35 + spec2 * 0.4)
            + silverHighlight * fresnel * 0.65;

          // Red Laser Scan Slice Wave (เส้นสแกนสีแดงสด ส่องสว่างชัดเจนบนผิวสีเงิน)
          float sliceHeight = sin(u_time * 0.75) * 0.65;
          float sliceDist = abs(vWorldPosition.y - sliceHeight);
          float laserGlow = smoothstep(0.07, 0.0, sliceDist);

          // Tech Dot Matrix raster along the laser slice (จุดเมทริกซ์สแกนสีแดง)
          vec2 dotGrid = fract(vWorldPosition.xz * 18.0) * 2.0 - 1.0;
          float dotDist = length(dotGrid);
          float dotMask = smoothstep(0.48, 0.42, dotDist);
          float brightness = hash(floor(vWorldPosition.xz * 9.0));
          float dots = dotMask * (0.6 + 0.4 * brightness);

          // Intense red laser beam
          vec3 redSlice = vec3(5.0, 0.08, 0.22) * laserGlow * (0.4 + 1.8 * dots);

          // Ambient horizontal laser scan aura
          float scanAura = smoothstep(0.14, 0.0, sliceDist) * 0.4;
          vec3 redScanAura = vec3(1.8, 0.05, 0.12) * scanAura;

          vec3 finalColor = litSilver + redSlice + redScanAura;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

      // Geometry: Subdivided Icosahedron
      const coreGeometry = new THREE.IcosahedronGeometry(1.0, 26);

      const uniforms = {
        u_time: { value: 0 },
        u_shapeA: { value: 0 },
        u_shapeB: { value: 1 },
        u_blend: { value: 0 },
        u_pointer: { value: new THREE.Vector2(0, 0) },
      };

      // Solid Metallic Silver Topographic Core
      const coreMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: false,
        side: THREE.DoubleSide,
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);

      // Group holding the 3D core
      const coreGroup = new THREE.Group();
      coreGroup.add(coreMesh);
      scene.add(coreGroup);

      // Subtle ambient data dust (minimal, monochrome silver/white)
      const particleCount = 60;
      const particleGeom = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        const r = 1.3 + Math.random() * 1.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        particlePositions[i + 2] = r * Math.cos(phi);
      }
      particleGeom.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePositions, 3)
      );
      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.018,
        transparent: true,
        opacity: 0.4,
      });
      const particles = new THREE.Points(particleGeom, particleMat);
      scene.add(particles);

      // Mouse Parallax Pointer Tracking
      const targetPointer = new THREE.Vector2(0, 0);
      const handlePointerMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        targetPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetPointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      };
      window.addEventListener("mousemove", handlePointerMove);

      const handleResize = () => {
        if (!container || !renderer || isDisposed) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // Shape Morphing Sequencer
      // Cycle: 0:Icosahedron -> 1:Octahedron -> 2:Cube -> 3:Dodecahedron -> 4:Star -> 5:Sphere
      const TOTAL_SHAPES = 6;
      const HOLD_TIME = 2.5; // seconds to hold each geometric shape
      const MORPH_TIME = 1.6; // seconds to smoothly morph between shapes
      const CYCLE_TIME = HOLD_TIME + MORPH_TIME;

      const clock = new THREE.Clock();

      const animate = () => {
        if (isDisposed || !renderer) return;
        animId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        uniforms.u_time.value = elapsedTime;

        // Calculate current morph progress & shape indices
        const cycleProgress = (elapsedTime % (TOTAL_SHAPES * CYCLE_TIME)) / CYCLE_TIME;
        const currentShapeIndex = Math.floor(cycleProgress);
        const nextShapeIndex = (currentShapeIndex + 1) % TOTAL_SHAPES;
        const timeInCycle = elapsedTime % CYCLE_TIME;

        let blend = 0;
        if (timeInCycle > HOLD_TIME) {
          blend = (timeInCycle - HOLD_TIME) / MORPH_TIME;
        }

        uniforms.u_shapeA.value = currentShapeIndex;
        uniforms.u_shapeB.value = nextShapeIndex;
        uniforms.u_blend.value = blend;

        // Smooth cursor lerp
        uniforms.u_pointer.value.lerp(targetPointer, 0.06);

        // Core 3D Rotation + Mouse Parallax
        coreGroup.rotation.y = elapsedTime * 0.20 + uniforms.u_pointer.value.x * 0.40;
        coreGroup.rotation.x = Math.sin(elapsedTime * 0.12) * 0.15 - uniforms.u_pointer.value.y * 0.40;
        coreGroup.rotation.z = elapsedTime * 0.06;

        // Subtle ambient particles rotation
        particles.rotation.y = elapsedTime * 0.03;

        // Subtle camera breathing with cursor
        camera.position.x = uniforms.u_pointer.value.x * 0.06;
        camera.position.y = uniforms.u_pointer.value.y * 0.06;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        isDisposed = true;
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("resize", handleResize);
        coreGeometry.dispose();
        particleGeom.dispose();
        coreMaterial.dispose();
        particleMat.dispose();
        renderer?.dispose();
      };
    } catch (e) {
      console.warn("WebGL initialization failed, using safe fallback", e);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export interface HeroFuturisticProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  subtext?: string;
  buttonText?: string;
  buttonSubtext?: string;
  onExplore?: () => void;
}

export const Html = ({
  badge = "INTERNAL AUDIT OPERATING SYSTEM • อบต.ฝางคำ",
  title = "IA-OS FANG KHAM",
  subtitle = "ระบบปฏิบัติการตรวจสอบภายในยุคดิจิทัล องค์การบริหารส่วนตำบลฝางคำ",
  subtext = "วิเคราะห์ความเสี่ยง SOFCK • แผนตรวจสอบ ว 614 • การควบคุมภายใน ปอ.1-ปค.5",
  buttonText = "สำรวจระบบงาน",
  buttonSubtext = "SCROLL TO EXPLORE",
  onExplore,
}: HeroFuturisticProps) => {
  const titleWords = title.split(" ");
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 500);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 600);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <HeroErrorBoundary>
      <style>{heroFuturisticStyles}</style>
      <div className="hero-futuristic h-svh relative select-none w-full bg-black">
        {/* Exact 3D Canvas Scene */}
        <ThreeCanvasScene />

        {/* Subtle background red glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Typography Overlay */}
        <div className="h-svh items-center w-full absolute z-40 pointer-events-none px-4 sm:px-6 md:px-10 flex justify-center flex-col text-center">
          {/* Futuristic Kicker Badge */}
          {badge && (
            <div
              className={`mb-3 sm:mb-4 inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono tracking-widest uppercase border border-cyan-500/30 bg-slate-950/80 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md transition-all duration-700 ${
                subtitleVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span>{badge}</span>
            </div>
          )}

          {/* Glitch Animated Main Title */}
          <div className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight uppercase">
            <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-4 overflow-hidden text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              {titleWords.map((word, index) => (
                <div
                  key={index}
                  className={index < visibleWords ? "fade-in" : ""}
                  style={{
                    animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                    opacity: index < visibleWords ? undefined : 0,
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          {/* Subtitle with glow */}
          {subtitle && (
            <div className="text-sm sm:text-lg md:text-xl xl:text-2xl mt-3 sm:mt-4 text-cyan-100 font-bold tracking-wide drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] max-w-3xl px-2">
              <div
                className={subtitleVisible ? "fade-in-subtitle" : ""}
                style={{
                  animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`,
                  opacity: subtitleVisible ? undefined : 0,
                }}
              >
                {subtitle}
              </div>
            </div>
          )}

          {/* Subtext description */}
          {subtext && (
            <div className="text-xs sm:text-sm md:text-base mt-2 text-slate-300 font-normal tracking-normal max-w-2xl px-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              <div
                className={subtitleVisible ? "fade-in-subtitle" : ""}
                style={{
                  animationDelay: `${titleWords.length * 0.13 + 0.35 + subtitleDelay}s`,
                  opacity: subtitleVisible ? undefined : 0,
                }}
              >
                {subtext}
              </div>
            </div>
          )}
        </div>

        {/* Explore Pill Button */}
        <button
          type="button"
          onClick={onExplore}
          className="explore-btn hover:bg-cyan-400 hover:text-slate-950 hover:border-cyan-400 transition-all cursor-pointer group"
          style={{ animationDelay: "2.2s" }}
        >
          <div className="flex flex-col leading-tight items-center text-xs sm:text-sm">
            <span>{buttonText}</span>
            <span className="text-[9px] sm:text-[10px] opacity-75 font-mono tracking-wider group-hover:text-slate-900">
              {buttonSubtext}
            </span>
          </div>
          <span className="explore-arrow">
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="arrow-svg"
            >
              <path
                d="M11 5V17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M6 12L11 17L16 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </HeroErrorBoundary>
  );
};

export default Html;
