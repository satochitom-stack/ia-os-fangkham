"use client";

import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useTexture } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { Mesh } from "three";

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add,
} from "three/tsl";

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
  font-family: Arial, Helvetica, sans-serif;
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
  font-size: 1.1rem;
  font-weight: 600;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, opacity 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  animation: 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) 2.2s forwards fadeInBtn;
  display: flex;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translate(-50%);
  box-shadow: 0 2px 16px #00000014;
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

extend(THREE as any);

// Post Processing component
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Create the scanning effect uniform
    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    // Create a red overlay that follows the scan line
    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    const redOverlay = vec3(1, 0, 0).mul(oneMinus(scanLine)).mul(0.4);

    // Mix the original scene with the red overlay
    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, redOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0,
    );

    // Add bloom effect after scan effect
    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current.value =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Показываем изображение после загрузки текстур
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

    const tDepthMap = texture(depthMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength)),
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const depth = tDepthMap;

    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));

    const mask = dot.mul(flow).mul(vec3(10, 0, 0));

    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    // Плавное появление
    if (
      meshRef.current &&
      "material" in meshRef.current &&
      meshRef.current.material
    ) {
      const mat = meshRef.current.material as any;
      if ("opacity" in mat) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 1 : 0, 0.07);
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.4;
  return (
    <mesh
      ref={meshRef}
      scale={[w * scaleFactor, h * scaleFactor, 1]}
      material={material}
    >
      <planeGeometry />
    </mesh>
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
  const [hasWebGPUError, setHasWebGPUError] = useState(false);

  useEffect(() => {
    // Generate random glitch delays
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <>
      <style>{heroFuturisticStyles}</style>
      <div className="hero-futuristic h-svh relative select-none">
        <div className="h-svh uppercase items-center w-full absolute z-60 pointer-events-none px-6 md:px-10 flex justify-center flex-col text-center">
          <div className="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight">
            <div className="flex flex-wrap justify-center gap-x-2 lg:gap-x-4 overflow-hidden text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
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
          <div className="text-xs md:text-xl xl:text-2xl 2xl:text-3xl mt-3 overflow-hidden text-cyan-300 font-bold tracking-wide drop-shadow-[0_2px_12px_rgba(0,255,249,0.5)]">
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
        </div>

        <button
          type="button"
          onClick={onExplore}
          className="explore-btn hover:bg-white hover:text-black transition-all cursor-pointer"
          style={{ animationDelay: "2.2s" }}
        >
          {buttonText}
          <span className="explore-arrow">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="arrow-svg"
            >
              <path
                d="M11 5V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 12L11 17L16 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>

        {!hasWebGPUError ? (
          <Canvas
            flat
            onError={() => setHasWebGPUError(true)}
            gl={async (props) => {
              try {
                const renderer = new THREE.WebGPURenderer(props as any);
                await renderer.init();
                return renderer;
              } catch (e) {
                console.warn("WebGPU initialization failed, falling back to visual background", e);
                setHasWebGPUError(true);
                throw e;
              }
            }}
          >
            <PostProcessing fullScreenEffect={true} />
            <Scene />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-950 via-indigo-950/40 to-black">
            <div className="w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
          </div>
        )}
      </div>
    </>
  );
};

export default Html;
