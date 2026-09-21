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

      // GLSL Vertex Shader: Geometric Polyhedron Morphing with UV mapping
      const vertexShader = `
        uniform float u_time;
        uniform int u_shapeA;
        uniform int u_shapeB;
        uniform float u_blend;

        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        varying vec3 vNormal;
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
          return mix(posA, posB, s) * 0.82; // Compact elegant scale
        }

        void main() {
          vec3 morphed = morphVertex(position);
          vLocalPosition = morphed;
          vNormal = normalize(position);

          // Project UV coordinates for 21st.dev texture mapping
          vUv = clamp(morphed.xy / 1.5 + 0.5, 0.0, 1.0);

          vec4 worldPos = modelMatrix * vec4(morphed, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `;

      // GLSL Fragment Shader: Exact 21st.dev Texture + Depth Laser Flow + Dot Matrix + Red Scanline Overlay
      const fragmentShader = `
        uniform sampler2D u_texture;
        uniform sampler2D u_depth;
        uniform vec2 u_pointer;
        uniform float u_time;
        uniform float u_progress;

        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        // Cell noise hash matching 21st.dev mx_cell_noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          // 1. Sample Depth Map with pointer parallax (from 21st.dev)
          vec4 depthTex = texture2D(u_depth, vUv);
          float depth = depthTex.r;

          float strength = 0.015;
          vec2 displacedUv = clamp(vUv + depth * u_pointer * strength, 0.0, 1.0);
          vec4 tMap = texture2D(u_texture, displacedUv);

          // 2. Tiling = 120.0 Dot Matrix (exact formula from 21st.dev)
          vec2 tiling = vec2(120.0);
          vec2 tiledUv = mod(vUv * tiling, 2.0) - 1.0;
          float dist = length(tiledUv);
          float dotMask = smoothstep(0.5, 0.48, dist);
          float brightness = hash(floor(vUv * 60.0));
          float dot = dotMask * brightness;

          // 3. Topographic Laser Flow slice: flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))))
          float flow = 1.0 - smoothstep(0.0, 0.022, abs(depth - u_progress));

          // 4. Red Laser Mask: mask = dot.mul(flow).mul(vec3(10, 0, 0))
          vec3 redMask = dot * flow * vec3(10.0, 0.0, 0.0);

          // 5. Screen Blend: final = blendScreen(tMap, mask)
          vec3 blended = 1.0 - (1.0 - tMap.rgb) * (1.0 - redMask);

          // 6. Full-screen/Mesh Red Laser Scan Line overlay (from 21st.dev PostProcessing)
          float scanWidth = 0.05;
          float scanDist = abs(vUv.y - u_progress);
          float scanLine = smoothstep(0.0, scanWidth, scanDist);
          vec3 redOverlay = vec3(1.0, 0.0, 0.0) * (1.0 - scanLine) * 0.40;

          // 7. Chrome Facet Specular Highlight (enhances 3D polyhedral reflection)
          vec3 facetNormal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          if (dot(facetNormal, viewDir) < 0.0) facetNormal = -facetNormal;

          vec3 lightDir = normalize(vec3(1.2, 1.8, 2.0));
          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(facetNormal, halfDir), 0.0), 32.0);
          vec3 specGleam = vec3(0.95, 0.98, 1.0) * spec * 0.35 * tMap.r;

          vec3 finalColor = blended + specGleam + redOverlay;

          // Clean alpha transparency around silhouette
          float alpha = max(tMap.a, max(finalColor.r, max(finalColor.g, finalColor.b)));
          if (alpha < 0.02 && redOverlay.r < 0.01) {
            discard;
          }

          gl_FragColor = vec4(finalColor, max(alpha, 0.95));
        }
      `;

      // Procedural fallback textures while image loads
      const makeFallbackTexture = () => {
        const size = 128;
        const data = new Uint8Array(size * size * 4);
        for (let i = 0; i < size * size * 4; i += 4) {
          data[i] = 200;
          data[i + 1] = 200;
          data[i + 2] = 200;
          data[i + 3] = 255;
        }
        const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        tex.needsUpdate = true;
        return tex;
      };

      const uniforms = {
        u_texture: { value: makeFallbackTexture() },
        u_depth: { value: makeFallbackTexture() },
        u_time: { value: 0 },
        u_progress: { value: 0 },
        u_shapeA: { value: 0 },
        u_shapeB: { value: 1 },
        u_blend: { value: 0 },
        u_pointer: { value: new THREE.Vector2(0, 0) },
      };

      // Load 21st.dev exact textures (local first, CDN fallback)
      const texLoader = new THREE.TextureLoader();
      texLoader.setCrossOrigin("anonymous");

      texLoader.load(
        TEXTURE_LOCAL,
        (tex) => {
          if (isDisposed) return;
          tex.minFilter = THREE.LinearFilter;
          uniforms.u_texture.value = tex;
        },
        undefined,
        () => {
          texLoader.load(
            "https://cdn.21st.dev/assets/mirror/f5/f58ba468bf6d3a2c9627178a1837f0f899b37b5dd5e34a00a3e11671cc7a59dc.png",
            (t) => {
              if (!isDisposed) uniforms.u_texture.value = t;
            }
          );
        }
      );

      texLoader.load(
        DEPTH_LOCAL,
        (tex) => {
          if (isDisposed) return;
          tex.minFilter = THREE.LinearFilter;
          uniforms.u_depth.value = tex;
        },
        undefined,
        () => {
          texLoader.load(
            "https://cdn.21st.dev/assets/mirror/4d/4dc433ce306f213c0db63b6ead769e11eb0646612d488ed799053c63904b942d.webp",
            (t) => {
              if (!isDisposed) uniforms.u_depth.value = t;
            }
          );
        }
      );

      // Geometry: Subdivided Icosahedron
      const coreGeometry = new THREE.IcosahedronGeometry(1.0, 28);

      // Material: 21st.dev Topographic Shader Material
      const coreMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
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
        // 21st.dev exact scan line frequency
        uniforms.u_progress.value = Math.sin(elapsedTime * 0.5) * 0.5 + 0.5;

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
