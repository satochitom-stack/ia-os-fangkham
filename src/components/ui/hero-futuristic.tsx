"use client";

import React, { useRef, useState, useEffect, Component } from "react";
import * as THREE from "three";

const TEXTUREMAP = {
  src: "https://cdn.21st.dev/assets/mirror/f5/f58ba468bf6d3a2c9627178a1837f0f899b37b5dd5e34a00a3e11671cc7a59dc.png",
};
const DEPTHMAP = {
  src: "https://cdn.21st.dev/assets/mirror/4d/4dc433ce306f213c0db63b6ead769e11eb0646612d488ed799053c63904b942d.webp",
};

// Preview-only CSS used to live only in the bundle. Keep it with the component.
const heroFuturisticStyles = `
.hero-futuristic {
  position: relative;
  overflow: hidden;
  background: #000;
  font-family: inherit;
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
  background: #000;
  border: 1.5px solid #fff;
  border-radius: 9999px;
  outline: none;
  align-items: center;
  gap: 12px;
  padding: 12px 32px;
  font-size: 1.05rem;
  font-weight: 700;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, opacity 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  animation: 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) 2.2s forwards fadeInBtn;
  display: flex;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translate(-50%);
  box-shadow: 0 4px 24px rgba(0, 255, 249, 0.25);
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
  to { transform: translateY(8px); }
}
`;

// Safe Error Boundary to prevent white/blank screen under all circumstances
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
    console.warn("HeroFuturistic fallback triggered:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950/40 to-black flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
        </div>
      );
    }
    return this.props.children;
  }
}

// 3D Canvas Scene with Depth Parallax and Laser Scan
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
      camera.position.z = 2.4;

      // Shaders for depth-displacement & scanline
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform sampler2D u_texture;
        uniform sampler2D u_depth;
        uniform vec2 u_pointer;
        uniform float u_time;
        uniform float u_progress;
        uniform float u_hasTexture;
        varying vec2 vUv;

        void main() {
          vec2 pUv = vUv;
          vec4 color = vec4(0.02, 0.04, 0.08, 1.0);

          if (u_hasTexture > 0.5) {
            vec4 depthMap = texture2D(u_depth, vUv);
            float depth = depthMap.r;
            vec2 offset = depth * u_pointer * 0.025;
            color = texture2D(u_texture, vUv + offset);
          } else {
            // Procedural cyber core if external texture is loading or blocked
            float d = length(vUv - 0.5);
            float ring = sin(d * 40.0 - u_time * 3.0) * 0.5 + 0.5;
            color = vec4(vec3(0.0, ring * 0.4, ring * 0.8), 1.0);
          }

          // Laser scan line
          float scanDist = abs(vUv.y - u_progress);
          float scanLine = smoothstep(0.04, 0.0, scanDist);
          vec3 redScan = vec3(1.0, 0.05, 0.25) * scanLine * 0.7;

          // Glowing grid overlay
          vec2 grid = abs(fract(vUv * 80.0 - 0.5) - 0.5) / fwidth(vUv * 80.0);
          float line = min(grid.x, grid.y);
          float gridPattern = 1.0 - min(line, 1.0);
          vec3 cyanGrid = vec3(0.0, 0.75, 1.0) * gridPattern * 0.06;

          // Scanline wave glow
          float wave = smoothstep(0.08, 0.0, scanDist);
          vec3 waveColor = vec3(0.0, 0.9, 0.8) * wave * 0.2;

          gl_FragColor = vec4(color.rgb + redScan + cyanGrid + waveColor, 1.0);
        }
      `;

      const uniforms = {
        u_texture: { value: new THREE.Texture() },
        u_depth: { value: new THREE.Texture() },
        u_pointer: { value: new THREE.Vector2(0, 0) },
        u_time: { value: 0 },
        u_progress: { value: 0 },
        u_hasTexture: { value: 0 },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
      });

      const geometry = new THREE.PlaneGeometry(1.7, 1.7);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Async Texture Loading
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");

      loader.load(
        TEXTUREMAP.src,
        (tex) => {
          if (isDisposed) return;
          tex.minFilter = THREE.LinearFilter;
          uniforms.u_texture.value = tex;
          uniforms.u_hasTexture.value = 1.0;
        },
        undefined,
        () => {
          // If remote image fails, procedural shader renders gracefully
          console.info("Using procedural visual aesthetic");
        }
      );

      loader.load(
        DEPTHMAP.src,
        (tex) => {
          if (isDisposed) return;
          tex.minFilter = THREE.LinearFilter;
          uniforms.u_depth.value = tex;
        },
        undefined,
        () => {}
      );

      // Pointer tracking
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

      // Render Loop
      const clock = new THREE.Clock();
      const animate = () => {
        if (isDisposed || !renderer) return;
        animId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        uniforms.u_time.value = elapsedTime;
        uniforms.u_progress.value =
          Math.sin(elapsedTime * 0.6) * 0.5 + 0.5;

        // Smooth cursor lerp
        uniforms.u_pointer.value.lerp(targetPointer, 0.08);

        camera.position.x = uniforms.u_pointer.value.x * 0.04;
        camera.position.y = uniforms.u_pointer.value.y * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        isDisposed = true;
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("resize", handleResize);
        geometry.dispose();
        material.dispose();
        renderer?.dispose();
      };
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to CSS", e);
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export interface HeroFuturisticProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onExplore?: () => void;
}

export const Html = ({
  title = "Build Your Dreams",
  subtitle = "AI-powered creativity for the next generation.",
  buttonText = "Scroll to explore",
  onExplore,
}: HeroFuturisticProps) => {
  const titleWords = title.split(" ");
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    // Client-side glitch delays
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 500);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 700);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <HeroErrorBoundary>
      <style>{heroFuturisticStyles}</style>
      <div className="hero-futuristic h-svh relative select-none w-full bg-black">
        {/* Animated 3D Depth Canvas */}
        <ThreeCanvasScene />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Typography Overlay */}
        <div className="h-svh uppercase items-center w-full absolute z-40 pointer-events-none px-6 md:px-10 flex justify-center flex-col text-center">
          <div className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tight">
            <div className="flex flex-wrap justify-center gap-x-2.5 sm:gap-x-4 overflow-hidden text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              {titleWords.map((word, index) => (
                <div
                  key={index}
                  className={index < visibleWords ? "fade-in" : ""}
                  style={{
                    animationDelay: `${index * 0.12 + (delays[index] || 0)}s`,
                    opacity: index < visibleWords ? undefined : 0,
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs sm:text-base md:text-xl xl:text-2xl mt-3 overflow-hidden text-cyan-300 font-bold tracking-wide drop-shadow-[0_2px_15px_rgba(0,255,249,0.6)] max-w-3xl">
            <div
              className={subtitleVisible ? "fade-in-subtitle" : ""}
              style={{
                animationDelay: `${titleWords.length * 0.12 + 0.2 + subtitleDelay}s`,
                opacity: subtitleVisible ? undefined : 0,
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onExplore}
          className="explore-btn hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          style={{ animationDelay: "1.8s" }}
        >
          <span>{buttonText}</span>
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
