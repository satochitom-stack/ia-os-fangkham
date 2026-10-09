import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Sun,
  Moon,
  Camera,
  Palette,
  Volume2,
  VolumeX,
  Coffee,
  Sparkles,
  Layers,
  Heart,
  Eye,
  Info
} from 'lucide-react';

const WALL_COLORS = [
  { id: 'cream', name: 'ครีมอุ่น (Cozy Cream)', color: 0xfdfbf7, wallHex: '#fdfbf7' },
  { id: 'mint', name: 'เขียวมิ้นต์ (Sage Mint)', color: 0xe6f4ea, wallHex: '#e6f4ea' },
  { id: 'peach', name: 'ส้มพีชพาสเทล (Soft Peach)', color: 0xffedea, wallHex: '#ffedea' },
  { id: 'lavender', name: 'ม่วงลาเวนเดอร์ (Cozy Lilac)', color: 0xf3e8ff, wallHex: '#f3e8ff' },
  { id: 'modern', name: 'มิดไนท์บลู (Slate Modern)', color: 0x334155, wallHex: '#334155' }
];

const FLOOR_TYPES = [
  { id: 'wood', name: 'ไม้โอ๊คธรรมชาติ', color: 0xd4a373 },
  { id: 'darkwood', name: 'ไม้วอลนัทเข้ม', color: 0x8d5b4c },
  { id: 'tile', name: 'กระเบื้องมินิมอล', color: 0xf1f5f9 }
];

const CHAIR_COLORS = [
  { id: 'sage', name: 'เขียวเซจ', color: 0x10b981 },
  { id: 'rose', name: 'ชมพูพาสเทล', color: 0xf43f5e },
  { id: 'blue', name: 'ฟ้าน้ำทะเล', color: 0x0ea5e9 },
  { id: 'amber', name: 'ส้มอบอุ่น', color: 0xf59e0b }
];

export default function CozyOffice3DView() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const lampLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const dirLightRef = useRef(null);
  const wallGroupRef = useRef(null);
  const floorMeshRef = useRef(null);
  const chairMeshRef = useRef(null);
  const decorGroupsRef = useRef({});

  // Audio ambience using Web Audio Synth (Lo-Fi Pink Noise Rain simulation)
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);

  const [isNight, setIsNight] = useState(false);
  const [wallColorIndex, setWallColorIndex] = useState(0);
  const [floorTypeIndex, setFloorTypeIndex] = useState(0);
  const [chairColorIndex, setChairColorIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [itemsToggle, setItemsToggle] = useState({
    coffee: true,
    plants: true,
    cat: true,
    shelf: true,
    cert: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Toggle audio ambience
  useEffect(() => {
    if (!isMuted) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Generate gentle rain/cafe noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02; // Brown/pink noise filter
          lastOut = data[i];
          data[i] *= 0.15; // Soft volume
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 450; // Mellow warm sound

        const gain = ctx.createGain();
        gain.gain.value = 0.25;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(0);
        noiseNodeRef.current = noise;
      } catch (e) {
        console.warn('Audio not supported or blocked');
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.stop();
        } catch (e) {}
        noiseNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isMuted]);

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf1f5f9);

    // 2. Camera (Isometric Orthographic style using Perspective with narrow FOV)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(12, 10, 14);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; // Don't flip below ground
    controls.minDistance = 6;
    controls.maxDistance = 24;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    dirLight.position.set(8, 14, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Warm Desk Lamp Light
    const lampLight = new THREE.PointLight(0xffaa44, 2.0, 6);
    lampLight.position.set(1.4, 2.8, -0.6);
    lampLight.castShadow = true;
    scene.add(lampLight);
    lampLightRef.current = lampLight;

    // ==========================================
    // 3D MODELS BUILDER (Cute Low-Poly Chibi Style)
    // ==========================================

    // Floor Base (Platform)
    const roomSize = 7.5;
    const floorGeo = new THREE.BoxGeometry(roomSize, 0.4, roomSize);
    const floorMat = new THREE.MeshStandardMaterial({
      color: FLOOR_TYPES[0].color,
      roughness: 0.6
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);
    floorMeshRef.current = floorMesh;

    // Walls (Back Wall and Left Wall)
    const wallGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({
      color: WALL_COLORS[0].color,
      roughness: 0.8
    });

    // Back wall (-Z)
    const backWallGeo = new THREE.BoxGeometry(roomSize, 4.2, 0.3);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2.1, -roomSize / 2 - 0.15);
    backWall.receiveShadow = true;
    wallGroup.add(backWall);

    // Left wall (-X)
    const leftWallGeo = new THREE.BoxGeometry(0.3, 4.2, roomSize);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-roomSize / 2 - 0.15, 2.1, 0);
    leftWall.receiveShadow = true;
    wallGroup.add(leftWall);

    // Wall skirting (Baseboard)
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(roomSize, 0.25, 0.05), baseboardMat);
    b1.position.set(0, 0.125, -roomSize / 2 + 0.025);
    wallGroup.add(b1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, roomSize), baseboardMat);
    b2.position.set(-roomSize / 2 + 0.025, 0.125, 0);
    wallGroup.add(b2);

    scene.add(wallGroup);
    wallGroupRef.current = wallGroup;

    // Cozy Rug on Floor
    const rugMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.9 });
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.04, 32), rugMat);
    rug.position.set(0.5, 0.02, 1.2);
    rug.receiveShadow = true;
    scene.add(rug);

    // ==========================================
    // FURNITURE: AUDITOR DESK
    // ==========================================
    const deskGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xc89d7c, roughness: 0.5 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });

    // Tabletop
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.16, 2.0), woodMat);
    top.position.set(0, 1.7, 0);
    top.castShadow = true;
    top.receiveShadow = true;
    deskGroup.add(top);

    // Table legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.7, 16);
    [[-1.65, -0.85], [1.65, -0.85], [-1.65, 0.85], [1.65, 0.85]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(x, 0.85, z);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Drawer unit on right side
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0xb5825d });
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 1.7), drawerMat);
    drawer.position.set(1.2, 0.95, 0);
    drawer.castShadow = true;
    deskGroup.add(drawer);

    // Dual Monitors
    const monStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.6, 16), metalMat);
    monStand.position.set(-0.3, 2.05, -0.6);
    deskGroup.add(monStand);

    const monScreenGeo = new THREE.BoxGeometry(1.4, 0.85, 0.06);
    const monScreenMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4
    });
    const mon1 = new THREE.Mesh(monScreenGeo, monScreenMat);
    mon1.position.set(-0.85, 2.45, -0.55);
    mon1.rotation.y = 0.2;
    mon1.castShadow = true;
    deskGroup.add(mon1);

    const mon2 = new THREE.Mesh(monScreenGeo, monScreenMat);
    mon2.position.set(0.45, 2.45, -0.55);
    mon2.rotation.y = -0.2;
    mon2.castShadow = true;
    deskGroup.add(mon2);

    // Keyboard & Mouse
    const kb = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.35), metalMat);
    kb.position.set(-0.2, 1.8, 0.1);
    deskGroup.add(kb);

    const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.18), metalMat);
    mouse.position.set(0.5, 1.8, 0.1);
    deskGroup.add(mouse);

    // Desk Lamp
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16), metalMat);
    lampBase.position.set(1.4, 1.8, -0.6);
    deskGroup.add(lampBase);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    lampShade.position.set(1.4, 2.4, -0.6);
    lampShade.rotation.x = Math.PI / 4;
    lampShade.castShadow = true;
    deskGroup.add(lampShade);

    scene.add(deskGroup);

    // ==========================================
    // ERGONOMIC CHAIR
    // ==========================================
    const chairGroup = new THREE.Group();
    const chairMat = new THREE.MeshStandardMaterial({ color: CHAIR_COLORS[0].color, roughness: 0.5 });
    chairMeshRef.current = chairMat;

    // Seat cushion
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 0.85), chairMat);
    seat.position.set(0, 1.1, 1.1);
    seat.castShadow = true;
    chairGroup.add(seat);

    // Backrest
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.12), chairMat);
    backrest.position.set(0, 1.7, 1.48);
    backrest.rotation.x = -0.08;
    backrest.castShadow = true;
    chairGroup.add(backrest);

    // Chair base / Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 16), metalMat);
    stem.position.set(0, 0.65, 1.1);
    chairGroup.add(stem);

    scene.add(chairGroup);

    // ==========================================
    // COFFEE STATION
    // ==========================================
    const coffeeGroup = new THREE.Group();
    const coffeeMaker = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.4), new THREE.MeshStandardMaterial({ color: 0xbe123c }));
    coffeeMaker.position.set(-1.4, 2.08, -0.6);
    coffeeMaker.castShadow = true;
    coffeeGroup.add(coffeeMaker);

    // Coffee mug
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.18, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    mug.position.set(-1.0, 1.88, 0.2);
    coffeeGroup.add(mug);
    scene.add(coffeeGroup);
    decorGroupsRef.current.coffee = coffeeGroup;

    // ==========================================
    // AUDIT DOCUMENT SHELF & BINDERS
    // ==========================================
    const shelfGroup = new THREE.Group();
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.6 });
    // Shelf uprights
    const sh1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.4, 1.2), shelfMat);
    sh1.position.set(-3.2, 1.7, -1.8);
    shelfGroup.add(sh1);
    const sh2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.4, 1.2), shelfMat);
    sh2.position.set(-3.2, 1.7, -3.2);
    shelfGroup.add(sh2);

    // Shelves tiers
    [0.6, 1.6, 2.6, 3.3].forEach((y) => {
      const pl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 1.4), shelfMat);
      pl.position.set(-3.2, y, -2.5);
      shelfGroup.add(pl);
    });

    // Colorful Binder Folders (ปค.4 / ปค.5 / สตง.)
    const binderColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6];
    binderColors.forEach((col, i) => {
      const binder = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.2), new THREE.MeshStandardMaterial({ color: col }));
      binder.position.set(-3.2, 1.86, -2.9 + i * 0.18);
      shelfGroup.add(binder);
    });

    scene.add(shelfGroup);
    decorGroupsRef.current.shelf = shelfGroup;

    // ==========================================
    // PLANTS (Monstera in Pot)
    // ==========================================
    const plantGroup = new THREE.Group();
    const potMat = new THREE.MeshStandardMaterial({ color: 0xe06d53 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.25, 0.6, 16), potMat);
    pot.position.set(-2.8, 0.3, 2.4);
    pot.castShadow = true;
    plantGroup.add(pot);

    // Leaves
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), leafMat);
      leaf.scale.set(1.4, 0.1, 0.7);
      leaf.rotation.set(0.3, (i * Math.PI * 2) / 5, 0.5);
      leaf.position.set(-2.8 + Math.cos(i) * 0.25, 0.75, 2.4 + Math.sin(i) * 0.25);
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }
    scene.add(plantGroup);
    decorGroupsRef.current.plants = plantGroup;

    // ==========================================
    // CUTE SLEEPING CAT ON FLOOR
    // ==========================================
    const catGroup = new THREE.Group();
    const catMat = new THREE.MeshStandardMaterial({ color: 0xf97316 }); // Ginger cat
    const catBody = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), catMat);
    catBody.scale.set(1.2, 0.8, 0.9);
    catBody.position.set(0.4, 0.2, 1.2);
    catBody.castShadow = true;
    catGroup.add(catBody);

    const catHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), catMat);
    catHead.position.set(0.65, 0.24, 1.2);
    catGroup.add(catHead);

    scene.add(catGroup);
    decorGroupsRef.current.cat = catGroup;

    // ==========================================
    // WALL CERTIFICATE & CLOCK
    // ==========================================
    const certGroup = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.05), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    frame.position.set(-0.5, 3.2, -roomSize / 2 + 0.03);
    certGroup.add(frame);

    const certPaper = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.06), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    certPaper.position.set(-0.5, 3.2, -roomSize / 2 + 0.03);
    certGroup.add(certPaper);

    // Wall Clock
    const clockMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const clockMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 32), clockMat);
    clockMesh.position.set(-roomSize / 2 + 0.04, 3.2, 0.5);
    clockMesh.rotation.z = Math.PI / 2;
    certGroup.add(clockMesh);

    scene.add(certGroup);
    decorGroupsRef.current.cert = certGroup;

    // ==========================================
    // ANIMATION RENDER LOOP
    // ==========================================
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle cat breathing animation
      if (catBody) {
        catBody.scale.y = 0.8 + Math.sin(elapsed * 2.5) * 0.03;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Night / Day Lighting
  useEffect(() => {
    if (!ambientLightRef.current || !dirLightRef.current || !lampLightRef.current || !sceneRef.current) return;

    if (isNight) {
      sceneRef.current.background = new THREE.Color(0x0f172a);
      ambientLightRef.current.intensity = 0.25;
      ambientLightRef.current.color = new THREE.Color(0x1e293b);
      dirLightRef.current.intensity = 0.3;
      lampLightRef.current.intensity = 3.5;
    } else {
      sceneRef.current.background = new THREE.Color(0xf1f5f9);
      ambientLightRef.current.intensity = 0.9;
      ambientLightRef.current.color = new THREE.Color(0xffffff);
      dirLightRef.current.intensity = 1.4;
      lampLightRef.current.intensity = 1.2;
    }
  }, [isNight]);

  // Update Wall Color
  useEffect(() => {
    if (!wallGroupRef.current) return;
    const chosen = WALL_COLORS[wallColorIndex];
    wallGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material && child.geometry.type === 'BoxGeometry') {
        // Exclude baseboards (which are thin)
        if (child.geometry.parameters.height > 1) {
          child.material.color.setHex(chosen.color);
        }
      }
    });
  }, [wallColorIndex]);

  // Update Floor Type
  useEffect(() => {
    if (!floorMeshRef.current) return;
    floorMeshRef.current.material.color.setHex(FLOOR_TYPES[floorTypeIndex].color);
  }, [floorTypeIndex]);

  // Update Chair Color
  useEffect(() => {
    if (!chairMeshRef.current) return;
    chairMeshRef.current.color.setHex(CHAIR_COLORS[chairColorIndex].color);
  }, [chairColorIndex]);

  // Update Items Visibility
  useEffect(() => {
    Object.keys(itemsToggle).forEach((key) => {
      const group = decorGroupsRef.current[key];
      if (group) {
        group.visible = itemsToggle[key];
      }
    });
  }, [itemsToggle]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(12, 10, 14);
      controlsRef.current.target.set(0, 1.2, 0);
      controlsRef.current.update();
      showToast('🔄 รีเซ็ตมุมมองกล้องแล้ว');
    }
  };

  // Snapshot photo download
  const handleTakePhoto = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `cozy-audit-office-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    showToast('📸 บันทึกรูปถ่ายห้องทำงานสำเร็จแล้ว!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900/95 text-white border border-teal-500/50 shadow-2xl px-5 py-3 rounded-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-15 text-9xl select-none">🏢</div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest font-black bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-xs mb-2">
              <span>🎮 Cozy Breakroom Mini-Game</span>
              <span>•</span>
              <span>สไตล์ที่ 4 3D Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center space-x-3">
              <span>จัดห้องทำงานผู้ตรวจ 3D (Cozy Office Studio)</span>
              <span className="text-xl">☕</span>
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1">
              คลิกลากหมุนมุมกล้อง 360° เลือกสีห้อง สีกระเบื้อง เก้าอี้ และเปิด-ปิดของตกแต่งห้องทำงานในฝัน!
            </p>
          </div>

          <div className="flex items-center space-x-2.5 bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <button
              onClick={() => setIsNight(!isNight)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isNight
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'bg-amber-400 text-slate-900 shadow-xs'
              }`}
              title="สลับโหมด กลางวัน / กลางคืน"
            >
              {isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{isNight ? 'โหมดค่ำคืน' : 'โหมดกลางวัน'}</span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                !isMuted ? 'bg-teal-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isMuted ? 'เปิดเสียงฝนตก Lo-Fi คลายเครียด' : 'ปิดเสียง'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleTakePhoto}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              title="ถ่ายรูปภาพห้อง 3D เก็บไว้"
            >
              <Camera className="w-4 h-4" />
              <span>ถ่ายรูป</span>
            </button>

            <button
              onClick={handleResetCamera}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors cursor-pointer"
              title="รีเซ็ตมุมกล้อง"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Customizer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Canvas Screen */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700/60 shadow-xl relative h-136 sm:h-148">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Overlay Helper Guide */}
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white/90 text-[11px] px-3.5 py-2 rounded-xl border border-slate-700/60 flex items-center space-x-2 pointer-events-none select-none">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>คลิกซ้ายลาก = หมุนมุมมอง 360° | เลื่อนลูกกลิ้ง = ซูมเข้า-ออก | คลิกขวาลาก = ขยับมุมมอง</span>
          </div>

          {!isMuted && (
            <div className="absolute top-4 left-4 bg-teal-900/80 backdrop-blur-md text-teal-200 text-xs px-3 py-1.5 rounded-full border border-teal-500/40 flex items-center space-x-1.5 animate-pulse">
              <span>🌧️ กำลังเล่นเสียงฝนตก Lo-Fi คลายเครียด</span>
            </div>
          )}
        </div>

        {/* Customization Control Panel */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
            <h2 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center space-x-2 text-base">
              <Palette className="w-4 h-4 text-teal-500" />
              <span>ปรับแต่งห้องทำงาน</span>
            </h2>

            {/* 1. Wall Colors */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                1. สีผนังห้อง (Wall Palette)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {WALL_COLORS.map((w, idx) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setWallColorIndex(idx);
                      showToast(`เปลี่ยนสีผนัง: ${w.name}`);
                    }}
                    style={{ backgroundColor: w.wallHex }}
                    className={`h-9 rounded-xl border-2 transition-all cursor-pointer ${
                      wallColorIndex === idx
                        ? 'border-teal-500 scale-105 shadow-md'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    title={w.name}
                  />
                ))}
              </div>
            </div>

            {/* 2. Floor Materials */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                2. พื้นห้อง (Floor Material)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FLOOR_TYPES.map((f, idx) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFloorTypeIndex(idx);
                      showToast(`เปลี่ยนพื้นห้อง: ${f.name}`);
                    }}
                    className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      floorTypeIndex === idx
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Chair Colors */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                3. สีเก้าอี้เพื่อสุขภาพ (Ergo Chair)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CHAIR_COLORS.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setChairColorIndex(idx);
                      showToast(`เปลี่ยนสีเก้าอี้: ${c.name}`);
                    }}
                    className={`py-1.5 text-center rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      chairColorIndex === idx
                        ? 'bg-teal-500 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Furniture & Decor Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>เปิด / ปิด ของตกแต่งในห้อง</span>
              </label>
              <div className="space-y-2 text-xs">
                {[
                  { key: 'coffee', label: 'เครื่องชงกาแฟ & ถ้วยกาแฟ', icon: Coffee },
                  { key: 'plants', label: 'ต้นไม้มอนสเตอร่า & กระถาง', icon: Sparkles },
                  { key: 'cat', label: 'น้องแมวส้มหลับปุ๋ยบนพรม', icon: Heart },
                  { key: 'shelf', label: 'ชั้นวางแฟ้มตรวจ ปค.4/5', icon: Layers },
                  { key: 'cert', label: 'ใบประกาศเกียรติคุณ & นาฬิกา', icon: Eye }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setItemsToggle((prev) => ({ ...prev, [key]: !prev[key] }));
                    }}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
                      itemsToggle[key]
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-400 line-through'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </div>
                    <span className="text-[10px] font-bold">
                      {itemsToggle[key] ? 'แสดง' : 'ซ่อน'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
