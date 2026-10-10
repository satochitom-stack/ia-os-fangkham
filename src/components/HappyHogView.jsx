import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Heart,
  Coins,
  ShieldCheck,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  RefreshCw,
  ShoppingBag,
  Award,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Dna,
  Bath,
  Utensils,
  Syringe,
  DollarSign,
  Gift,
  Calendar,
  Palette,
  BookOpen,
  Crown,
  Check,
  X,
  ChevronRight,
  Star,
  Flame,
  Trophy,
  Zap,
  Users,
  Sprout,
  Footprints,
  Clock,
  Eye,
  Wheat,
  Smile,
  Plus,
  Home,
  Gem,
  Maximize2,
  Minimize2,
  ArrowUpCircle
} from 'lucide-react';

// Web Audio sound synthesizer for retro tactile sound effects
const playSound = (type, isMuted) => {
  if (isMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'oink') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'feed') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.setValueAtTime(520, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'bubble') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'coin') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'heal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'plant') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'steal') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.1);
      osc.frequency.setValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'bark') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(240, now + 0.06);
      osc.frequency.setValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'fanfare') {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.25, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.25);
        o.start(now + i * 0.08);
        o.stop(now + i * 0.08 + 0.25);
      });
    }
  } catch (e) {}
};

// 8 Pig Breeds with Rich Colors and Accessories
const PIG_BREEDS = {
  pink: {
    id: 'pink',
    name: 'หมูชมพูพันธุ์พื้นเมือง',
    tag: 'ธรรมดา',
    rarity: 'Common',
    primaryColor: '#f472b6',
    secondaryColor: '#fbcfe8',
    earColor: '#ec4899',
    bellyColor: '#fce7f3',
    maxWeight: 120,
    pricePerKg: 15,
    buyCost: 100,
    description: 'เลี้ยงง่าย อารมณ์ดี ชอบกินรำข้าวเป็นชีวิตจิตใจ',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-300',
    unlockDesc: 'สายพันธุ์เริ่มต้น (ปลดล็อกแล้ว)',
    isDefaultUnlocked: true
  },
  auditor: {
    id: 'auditor',
    name: 'หมูผู้ตรวจสอบ ปค.5',
    tag: 'นักตรวจมือฉมัง',
    rarity: 'Rare',
    primaryColor: '#60a5fa',
    secondaryColor: '#bfdbfe',
    earColor: '#3b82f6',
    bellyColor: '#dbeafe',
    maxWeight: 150,
    pricePerKg: 28,
    buyCost: 250,
    description: 'ใส่แว่นตา ชอบเดินตรวจคอก คอยดูว่าใครเบิกอาหารเกินงบ',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
    accessory: 'glasses',
    unlockDesc: 'เลี้ยงหมูตัวใดก็ได้จนหนักครบ 60 kg'
  },
  engineer: {
    id: 'engineer',
    name: 'หมูช่างตรวจงาน Factor F',
    tag: 'สายลุยหน้างาน',
    rarity: 'Rare',
    primaryColor: '#fbbf24',
    secondaryColor: '#fef08a',
    earColor: '#f59e0b',
    bellyColor: '#fef9c3',
    maxWeight: 160,
    pricePerKg: 32,
    buyCost: 320,
    description: 'สวมหมวกนิรภัยสีเหลือง ตัวแน่นบึ้ก ชอบตรวจงานก่อสร้าง',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    accessory: 'helmet',
    unlockDesc: 'มีเหรียญสะสมในฟาร์มครบ 300 เหรียญ'
  },
  sakura: {
    id: 'sakura',
    name: 'หมูซากุระชมพูหวาน',
    tag: 'ลิมิเต็ด',
    rarity: 'Epic',
    primaryColor: '#f9a8d4',
    secondaryColor: '#fdf2f8',
    earColor: '#f472b6',
    bellyColor: '#fff1f2',
    maxWeight: 180,
    pricePerKg: 48,
    buyCost: 500,
    description: 'ตัวสีชมพูพาสเทล ละอองกลีบซากุระปลิวไสว นำพาความสุขใจมาสู่คอก',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-300',
    accessory: 'sakura',
    unlockDesc: 'ล็อกอินรายวันติดต่อกันครบ 3 วัน'
  },
  shabu: {
    id: 'shabu',
    name: 'หมูชาบูกระทะทอง',
    tag: 'สายกินจุ',
    rarity: 'Epic',
    primaryColor: '#fb923c',
    secondaryColor: '#ffedd5',
    earColor: '#ea580c',
    bellyColor: '#fff7ed',
    maxWeight: 195,
    pricePerKg: 55,
    buyCost: 580,
    description: 'สวมหมวกหม้อไฟกระทะทอง ตัวอ้วนกลม เจริญอาหารที่สุดในโลก',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    accessory: 'pot',
    unlockDesc: 'ให้อาหารหมูสะสมครบ 12 ครั้ง'
  },
  golden: {
    id: 'golden',
    name: 'หมูพัสดุทองคำแท้',
    tag: 'พรีเมียม',
    rarity: 'Epic',
    primaryColor: '#eab308',
    secondaryColor: '#fef08a',
    earColor: '#ca8a04',
    bellyColor: '#fef9c3',
    maxWeight: 215,
    pricePerKg: 68,
    buyCost: 750,
    description: 'ตัวสีทองอร่าม สวมมงกุฎ นำโชคด้านการจัดซื้อจัดจ้างไร้ข้อทักท้วง',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    accessory: 'crown',
    unlockDesc: 'ขายหมูส่งโรงงานสำเร็จสะสมครบ 3 ตัว'
  },
  rainbow: {
    id: 'rainbow',
    name: 'หมูสายรุ้ง สตง. ผ่านฉลุย',
    tag: 'ในตำนาน',
    rarity: 'Legendary',
    primaryColor: '#c084fc',
    secondaryColor: '#f5d0fe',
    earColor: '#a855f7',
    bellyColor: '#fae8ff',
    maxWeight: 260,
    pricePerKg: 120,
    buyCost: 1500,
    description: 'ส่องประกายออร่าสีรุ้ง 7 สี ใครเลี้ยงไว้จะตรวจผ่าน 100% ทุกโครงการ',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300',
    accessory: 'aura',
    unlockDesc: 'ผสมพันธุ์หมูสำเร็จสะสมครบ 3 ครั้ง'
  },
  knight: {
    id: 'knight',
    name: 'หมูองค์รักษ์พิทักษ์ อปท.',
    tag: 'ขั้นมหาเทพ',
    rarity: 'Mythic',
    primaryColor: '#38bdf8',
    secondaryColor: '#e0f2fe',
    earColor: '#0284c7',
    bellyColor: '#f0f9ff',
    maxWeight: 310,
    pricePerKg: 200,
    buyCost: 2500,
    description: 'สวมเกราะอัศวินสีทอง มีปีกเทวดาสีขาว ส่องแสงประกาย ป้องกันโจรขโมยหมู 100%',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-400',
    accessory: 'wings',
    unlockDesc: 'ล็อกอินสะสมครบ 7 วัน หรือมีเหรียญสะสมครบ 1,500 เหรียญ'
  }
};

// 6 Barn Themes with 3D Isometric Scenery
const BARN_THEMES = {
  pasture: {
    id: 'pasture',
    name: 'ทุ่งหญ้าธรรมชาติพาสเทล',
    tag: 'Piggy Town',
    icon: '🌿',
    bgImage: '/pigs/farm_bg.jpg',
    bgClass: 'from-[#7dd3fc] via-[#bbf7d0] to-[#86efac]',
    penGround: '#f7e7c4',
    fenceBorder: '#8c593b',
    perk: 'หมูอารมณ์ดี วิ่งเล่นร่าเริง',
    cost: 0,
    unlockedByDefault: true,
    atmosphere: 'butterflies',
    bounds: { minX: 32, maxX: 66, minY: 36, maxY: 66 }
  },
  cozy_wood: {
    id: 'cozy_wood',
    name: 'คอกไม้ชนบทคลาสสิก',
    tag: 'คลาสสิก',
    icon: '🪵',
    bgImage: '/pigs/theme_cozy_wood.jpg',
    bgClass: 'from-[#fed7aa] via-[#fde68a] to-[#d97706]',
    penGround: '#eedbb3',
    fenceBorder: '#78350f',
    perk: 'ธีมมาตรฐาน อบอุ่น สบายตา',
    cost: 0,
    unlockedByDefault: true,
    atmosphere: 'leaves',
    bounds: { minX: 30, maxX: 68, minY: 38, maxY: 68 }
  },
  onsen_mud: {
    id: 'onsen_mud',
    name: 'สปาออนเซ็นเพื่อสุขภาพ',
    tag: 'รีแลกซ์',
    icon: '♨️',
    bgImage: '/pigs/theme_onsen_mud.jpg',
    bgClass: 'from-[#cbd5e1] via-[#94a3b8] to-[#64748b]',
    penGround: '#d6cbba',
    fenceBorder: '#475569',
    perk: 'ความสะอาดลดช้าลง 50%',
    cost: 400,
    unlockDesc: 'อาบน้ำหมูสะสมครบ 8 ครั้ง หรือใช้ 400 เหรียญ',
    atmosphere: 'steam',
    bounds: { minX: 32, maxX: 70, minY: 38, maxY: 70 }
  },
  lanna: {
    id: 'lanna',
    name: 'คอกไม้สักล้านนา อปท.',
    tag: 'วัฒนธรรม',
    icon: '🏮',
    bgImage: '/pigs/theme_lanna.jpg',
    bgClass: 'from-[#fef08a] via-[#fde047] to-[#ca8a04]',
    penGround: '#fae3b4',
    fenceBorder: '#854d0e',
    perk: 'หมูเติบโตไวกว่าปกติ 20%',
    cost: 600,
    unlockDesc: 'มีหมูน้ำหนัก 90 kg ขึ้นไป หรือใช้ 600 เหรียญ',
    atmosphere: 'lanterns',
    bounds: { minX: 28, maxX: 68, minY: 36, maxY: 66 }
  },
  golden_palace: {
    id: 'golden_palace',
    name: 'คฤหาสน์หมูทองคำเศรษฐี',
    tag: 'ลักชัวรี่',
    icon: '👑',
    bgImage: '/pigs/theme_golden_palace.jpg',
    bgClass: 'from-[#fef08a] via-[#fbbf24] to-[#d97706]',
    penGround: '#fff3c4',
    fenceBorder: '#b45309',
    perk: 'โบนัสราคาขายหมู +20%',
    cost: 1200,
    unlockDesc: 'ครอบครองหมูทองคำ หรือใช้ 1,200 เหรียญ',
    atmosphere: 'sparkles',
    bounds: { minX: 26, maxX: 70, minY: 36, maxY: 66 }
  },
  cyber_space: {
    id: 'cyber_space',
    name: 'สถานีอวกาศหมูไซเบอร์',
    tag: 'ไซไฟ',
    icon: '🚀',
    bgImage: null,
    bgClass: 'from-[#0f172a] via-[#1e1b4b] to-[#312e81]',
    penGround: '#1e293b',
    fenceBorder: '#06b6d4',
    perk: 'ป้องกันการถูกขโมยหมู 100% เสมอ',
    cost: 2000,
    unlockDesc: 'ผสมพันธุ์สำเร็จ 3 ครั้ง หรือใช้ 2,000 เหรียญ',
    atmosphere: 'cyber',
    bounds: { minX: 26, maxX: 74, minY: 34, maxY: 68 }
  }
};

const FOODS = [
  { id: 'bran', name: 'รำข้าวผสมผักบุ้ง', cost: 10, weightGain: 4, fullness: 20, icon: '🌾' },
  { id: 'corn', name: 'ข้าวโพดหวานคัดเกรด', cost: 25, weightGain: 10, fullness: 45, icon: '🌽' },
  { id: 'carrot', name: 'แครอททองคำบำรุงตับ', cost: 60, weightGain: 25, fullness: 80, icon: '🥕' },
  { id: 'pumpkin', name: 'ฟักทองยักษ์โภชนาการสูง', cost: 100, weightGain: 40, fullness: 95, icon: '🎃' }
];

const CROPS_META = {
  bran: { id: 'bran', name: 'ต้นข้าว/รำข้าว', icon: '🌾', duration: 15, seedCost: 5, yieldCount: 2, foodId: 'bran' },
  corn: { id: 'corn', name: 'ข้าวโพดหวาน', icon: '🌽', duration: 25, seedCost: 15, yieldCount: 2, foodId: 'corn' },
  carrot: { id: 'carrot', name: 'แครอททองคำ', icon: '🥕', duration: 40, seedCost: 35, yieldCount: 2, foodId: 'carrot' },
  pumpkin: { id: 'pumpkin', name: 'ฟักทองยักษ์', icon: '🎃', duration: 60, seedCost: 55, yieldCount: 1, foodId: 'pumpkin' }
};

const DAILY_REWARDS = [
  { day: 1, title: 'เงินทุนขวัญถุง', rewardDesc: '+100 เหรียญทอง', icon: '💰', coins: 100 },
  { day: 2, title: 'เมล็ดข้าวโพดหวาน', rewardDesc: 'ข้าวโพด 3 ถุง (+50 เหรียญ)', icon: '🌽', coins: 50 },
  { day: 3, title: 'หมูซากุระพิเศษ!', rewardDesc: 'ปลดล็อกหมูซากุระ + 150 เหรียญ', icon: '🌸', coins: 150, unlockBreed: 'sakura' },
  { day: 4, title: 'แครอททองคำ', rewardDesc: 'แครอท 3 ถุง (+100 เหรียญ)', icon: '🥕', coins: 100 },
  { day: 5, title: 'ฟักทองบำรุงตับ', rewardDesc: 'ฟักทอง 2 ลูก (+200 เหรียญ)', icon: '🎃', coins: 200 },
  { day: 6, title: 'ธีมคอกหมูฟรี', rewardDesc: 'ปลดล็อกธีมคอกฟรี 1 ธีม (+250 เหรียญ)', icon: '🪵', coins: 250, unlockTheme: 'onsen_mud' },
  { day: 7, title: 'หมูพัสดุทองคำแท้!', rewardDesc: 'รับลูกหมูทองคำ 1 ตัว + 500 เหรียญ', icon: '👑', coins: 500, grantPig: 'golden' }
];

const INITIAL_NEIGHBORS = [
  {
    id: 'eng',
    name: 'ฟาร์มนายช่างสมหมาย',
    role: 'กองช่าง อบต.',
    avatar: '👷',
    isLocked: false,
    statusText: '🔓 ประตูคอกเปิดอ้าซ่า ลืมล็อกกุญแจ!',
    pigs: [
      { id: 'np1', name: 'หมูช่าง Factor F', breed: 'engineer', weight: 88, icon: '🐷' },
      { id: 'np2', name: 'หมูชมพูลูกนายช่าง', breed: 'pink', weight: 35, icon: '🐷' }
    ]
  },
  {
    id: 'finance',
    name: 'ฟาร์ม ผอ. กองคลัง',
    role: 'ฝ่ายการเงินและพัสดุ',
    avatar: '👩‍💼',
    isLocked: true,
    statusText: '🔒 ติดแม่กุญแจรหัส 4 ชั้น กันการทุจริต 100%',
    pigs: [
      { id: 'np3', name: 'หมูพัสดุทองคำ', breed: 'golden', weight: 115, icon: '🐷' },
      { id: 'np4', name: 'หมูผู้ตรวจ ปค.5', breed: 'auditor', weight: 75, icon: '🐷' }
    ]
  },
  {
    id: 'palad',
    name: 'ฟาร์มท่านปลัดวิชัย',
    role: 'สำนักปลัด อบต.',
    avatar: '👨‍💼',
    isLocked: true,
    statusText: '🔒 ติดกล้องวงจรปิด CCTV 4 ตัวรอบรั้ว',
    pigs: [
      { id: 'np5', name: 'หมูสายรุ้ง สตง.', breed: 'rainbow', weight: 140, icon: '🐷' },
      { id: 'np6', name: 'หมูซากุระมงคล', breed: 'sakura', weight: 65, icon: '🐷' }
    ]
  },
  {
    id: 'neighbor_somsee',
    name: 'ฟาร์มป้าสมศรี หน้า อบต.',
    role: 'ชาวบ้านชุมชนสัมพันธ์',
    avatar: '👵',
    isLocked: false,
    statusText: '🔓 รั้วไม้ผุพัง เอาเชือกฟางมัดไว้เฉยๆ',
    pigs: [
      { id: 'np7', name: 'หมูชาบูป้าสมศรี', breed: 'shabu', weight: 92, icon: '🐷' },
      { id: 'np8', name: 'น้องชมพูอ้วนกลม', breed: 'pink', weight: 48, icon: '🐷' }
    ]
  }
];

// ==========================================
// DETAILED 2.5D SVG ILLUSTRATIONS
// ==========================================

// 1. Cozy Barn Cottage with Chimney and Hay
const BarnCottageSvg = () => (
  <svg width="110" height="95" viewBox="0 0 110 95" className="drop-shadow-xl select-none pointer-events-none">
    {/* Shadow */}
    <ellipse cx="55" cy="85" rx="46" ry="10" fill="rgba(0,0,0,0.22)" />
    {/* Chimney */}
    <rect x="75" y="10" width="14" height="24" rx="2" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
    <ellipse cx="82" cy="10" rx="7" ry="2.5" fill="#450a0a" />
    {/* Smoke Puffs */}
    <circle cx="84" cy="4" r="3.5" fill="rgba(255,255,255,0.7)" />
    <circle cx="88" cy="-2" r="5" fill="rgba(255,255,255,0.5)" />
    {/* Main Wall */}
    <path d="M15 45 L55 20 L95 45 L95 82 L15 82 Z" fill="#b45309" stroke="#78350f" strokeWidth="3" />
    {/* Wood Plank Lines */}
    <line x1="28" y1="45" x2="28" y2="80" stroke="#92400e" strokeWidth="2" />
    <line x1="42" y1="40" x2="42" y2="80" stroke="#92400e" strokeWidth="2" />
    <line x1="68" y1="40" x2="68" y2="80" stroke="#92400e" strokeWidth="2" />
    <line x1="82" y1="45" x2="82" y2="80" stroke="#92400e" strokeWidth="2" />
    {/* Roof Overhang */}
    <path d="M10 47 L55 16 L100 47 L95 53 L55 24 L15 53 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
    {/* Open Barn Door */}
    <path d="M42 55 Q55 50 68 55 L68 82 L42 82 Z" fill="#451a03" stroke="#270e02" strokeWidth="2" />
    {/* Spilling Hay Straw */}
    <path d="M44 80 Q55 75 66 80 Q68 85 55 84 Q42 86 44 80 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
    {/* Round Window */}
    <circle cx="55" cy="36" r="7" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
    <line x1="55" y1="29" x2="55" y2="43" stroke="#78350f" strokeWidth="1.5" />
    <line x1="48" y1="36" x2="62" y2="36" stroke="#78350f" strokeWidth="1.5" />
  </svg>
);

// 2. Cooking Hearth & Stew Cauldron
const CookingHearthSvg = () => (
  <svg width="85" height="75" viewBox="0 0 85 75" className="drop-shadow-lg select-none pointer-events-none">
    {/* Stone Platform Base */}
    <ellipse cx="42" cy="62" rx="36" ry="12" fill="#78716c" stroke="#57534e" strokeWidth="2" />
    <ellipse cx="42" cy="58" rx="30" ry="9" fill="#a8a29e" />
    {/* Fire logs & embers */}
    <rect x="30" y="50" width="24" height="6" rx="2" fill="#451a03" />
    <polygon points="34,53 42,42 50,53" fill="#ea580c" />
    <polygon points="38,53 42,46 46,53" fill="#facc15" />
    {/* Cast Iron Pot */}
    <path d="M26 36 Q42 34 58 36 L54 50 Q42 54 30 50 Z" fill="#1c1917" stroke="#0c0a09" strokeWidth="2" />
    {/* Pot Rim */}
    <ellipse cx="42" cy="36" rx="17" ry="5" fill="#292524" stroke="#0c0a09" strokeWidth="2" />
    {/* Bubbling Stew */}
    <ellipse cx="42" cy="36" rx="14" ry="4" fill="#f97316" />
    <circle cx="38" cy="36" r="1.5" fill="#fef08a" />
    <circle cx="45" cy="35" r="2" fill="#fef08a" />
    {/* Steam Cloud */}
    <circle cx="42" cy="24" r="3.5" fill="rgba(255,255,255,0.6)" />
    <circle cx="45" cy="18" r="4.5" fill="rgba(255,255,255,0.4)" />
  </svg>
);

// 3. Wooden Bath Tub / Onsen Spa
const BathTubSvg = () => (
  <svg width="85" height="70" viewBox="0 0 85 70" className="drop-shadow-lg select-none pointer-events-none">
    {/* Shadow */}
    <ellipse cx="42" cy="58" rx="34" ry="10" fill="rgba(0,0,0,0.2)" />
    {/* Wooden Barrel Body */}
    <path d="M16 28 Q42 24 68 28 L64 54 Q42 60 20 54 Z" fill="#92400e" stroke="#78350f" strokeWidth="2.5" />
    {/* Metal Bands */}
    <path d="M17 38 Q42 34 67 38" stroke="#451a03" strokeWidth="2" fill="none" />
    <path d="M19 48 Q42 44 65 48" stroke="#451a03" strokeWidth="2" fill="none" />
    {/* Top Rim */}
    <ellipse cx="42" cy="27" rx="27" ry="9" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
    {/* Water */}
    <ellipse cx="42" cy="28" rx="23" ry="7" fill="#38bdf8" />
    {/* Bubbles */}
    <circle cx="34" cy="27" r="2" fill="white" />
    <circle cx="48" cy="26" r="2.5" fill="white" />
    {/* Rubber Duck */}
    <circle cx="42" cy="25" r="3" fill="#facc15" />
    <polygon points="44,25 47,26 44,27" fill="#ea580c" />
  </svg>
);

// 4. Classic Water Tap & Log Dispenser
const WaterTapSvg = () => (
  <svg width="70" height="75" viewBox="0 0 70 75" className="drop-shadow-lg select-none pointer-events-none">
    {/* Shadow */}
    <ellipse cx="35" cy="66" rx="26" ry="7" fill="rgba(0,0,0,0.18)" />
    {/* Hollow Log Trough */}
    <ellipse cx="35" cy="62" rx="24" ry="9" fill="#78350f" stroke="#451a03" strokeWidth="2" />
    <ellipse cx="35" cy="61" rx="20" ry="7" fill="#0284c7" />
    <ellipse cx="35" cy="60" rx="16" ry="5" fill="#38bdf8" />
    {/* Wooden Upright Post */}
    <rect x="30" y="18" width="10" height="42" rx="3" fill="#92400e" stroke="#78350f" strokeWidth="2" />
    {/* Brass Faucet */}
    <path d="M30 26 L18 26 L18 34" stroke="#ca8a04" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <circle cx="30" cy="22" r="3" fill="#eab308" />
    {/* Water Stream & Splash */}
    <line x1="18" y1="34" x2="18" y2="56" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
    <circle cx="18" cy="58" r="3" fill="#bae6fd" opacity="0.8" />
  </svg>
);

// 5. Feeding Trough with Golden Feed
const FeedTroughSvg = () => (
  <svg width="90" height="45" viewBox="0 0 90 45" className="drop-shadow-lg select-none pointer-events-none">
    {/* Shadow */}
    <ellipse cx="45" cy="38" rx="38" ry="7" fill="rgba(0,0,0,0.2)" />
    {/* Wooden Trough Box */}
    <polygon points="12,18 78,18 84,34 6,34" fill="#92400e" stroke="#78350f" strokeWidth="2" />
    <polygon points="12,18 78,18 74,10 16,10" fill="#b45309" stroke="#78350f" strokeWidth="2" />
    {/* Feed contents */}
    <ellipse cx="45" cy="17" rx="28" ry="5" fill="#facc15" />
    <circle cx="32" cy="16" r="2" fill="#ea580c" />
    <circle cx="56" cy="17" r="2.5" fill="#ea580c" />
    <circle cx="45" cy="15" r="2" fill="#16a34a" />
  </svg>
);

// 6. Lush 2.5D Country Fruit Tree (Piggy Town Vibe)
const LushFruitTreeSvg = () => (
  <svg width="86" height="106" viewBox="0 0 86 106" className="drop-shadow-xl select-none pointer-events-none">
    {/* Soft Shadow */}
    <ellipse cx="43" cy="98" rx="34" ry="7.5" fill="rgba(0,0,0,0.22)" />
    {/* Trunk with bark details */}
    <path d="M38 52 Q40 76 34 94 L52 94 Q46 76 48 52 Z" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
    <path d="M41 66 Q43 80 39 90" stroke="#92400e" strokeWidth="2" fill="none" />
    {/* Layer 1 back foliage */}
    <ellipse cx="43" cy="46" rx="36" ry="30" fill="#15803d" />
    {/* Layer 2 main foliage */}
    <circle cx="30" cy="40" r="22" fill="#22c55e" />
    <circle cx="56" cy="40" r="22" fill="#22c55e" />
    <circle cx="43" cy="26" r="23" fill="#4ade80" />
    {/* Highlights */}
    <circle cx="39" cy="20" r="9" fill="#86efac" opacity="0.6" />
    {/* Ripe Red Apples */}
    <circle cx="28" cy="36" r="4.2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
    <circle cx="29" cy="34" r="1.2" fill="#fca5a5" />
    <circle cx="56" cy="34" r="4.2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
    <circle cx="57" cy="32" r="1.2" fill="#fca5a5" />
    <circle cx="43" cy="45" r="4.2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
    <circle cx="44" cy="43" r="1.2" fill="#fca5a5" />
    <circle cx="44" cy="19" r="3.8" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
  </svg>
);

// 7. Golden Hay Bale Stack
const HayBaleSvg = () => (
  <svg width="60" height="46" viewBox="0 0 60 46" className="drop-shadow-md select-none pointer-events-none">
    <ellipse cx="30" cy="40" rx="26" ry="5.5" fill="rgba(0,0,0,0.18)" />
    {/* Round Hay Bale */}
    <rect x="6" y="14" width="46" height="24" rx="9" fill="#eab308" stroke="#a16207" strokeWidth="2" />
    <ellipse cx="12" cy="26" rx="5.5" ry="11" fill="#fde047" stroke="#a16207" strokeWidth="1.5" />
    {/* Hay strands */}
    <line x1="24" y1="18" x2="46" y2="18" stroke="#ca8a04" strokeWidth="1.8" />
    <line x1="20" y1="26" x2="48" y2="26" stroke="#ca8a04" strokeWidth="1.8" />
    <line x1="22" y1="33" x2="46" y2="33" stroke="#ca8a04" strokeWidth="1.8" />
  </svg>
);

// 8. High-Fidelity 3D Chibi Pig Sprite Component (Piggy Town & Happy Hog Style)
const PigSprite = ({ breed, isSelected, direction, weight }) => {
  const b = PIG_BREEDS[breed] || PIG_BREEDS.pink;
  const sizeScale = Math.min(1.4, 0.95 + (weight / b.maxWeight) * 0.4);
  const spriteSrc = `/pigs/${breed}.png`;
  const dirScale = direction === -1 || direction === 'left' ? -1 : 1;

  return (
    <div
      style={{
        transform: `scale(${sizeScale})`,
        transition: 'transform 0.25s ease'
      }}
      className={`relative select-none flex flex-col items-center justify-center pointer-events-auto cursor-pointer ${
        isSelected ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]' : ''
      }`}
    >
      {/* Soft Ground Contact Shadow */}
      <div className="w-16 h-3.5 bg-black/30 rounded-full blur-[2px] absolute -bottom-1 pointer-events-none" />

      {/* 3D Chibi Illustrated Pig Sprite (Only sprite flips horizontally) */}
      <img
        src={spriteSrc}
        alt={b.name}
        style={{
          transform: `scaleX(${dirScale})`,
          transition: 'transform 0.2s ease'
        }}
        className="w-20 h-20 sm:w-22 sm:h-22 object-contain drop-shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );
};

// Barn Capacity Upgrade Tiers with Level & Coin Requirements
const BARN_CAPACITY_TIERS = [
  { tier: 1, capacity: 6, reqLevel: 1, cost: 0, title: 'คอกไม้ฟาร์มเบื้องต้น' },
  { tier: 2, capacity: 8, reqLevel: 2, cost: 1200, title: 'คอกไม้ขยายพื้นที่ ระดับ 2' },
  { tier: 3, capacity: 10, reqLevel: 4, cost: 3000, title: 'โรงนาชุมชนกว้างขวาง ระดับ 3' },
  { tier: 4, capacity: 12, reqLevel: 6, cost: 6500, title: 'คอกฟาร์มมาตรฐานสากล ระดับ 4' },
  { tier: 5, capacity: 15, reqLevel: 8, cost: 14000, title: 'อาณาจักรปศุสัตว์ขนาดใหญ่ ระดับ 5' },
  { tier: 6, capacity: 20, reqLevel: 10, cost: 28000, title: 'มหาฟาร์มหมูพันล้านในตำนาน ระดับ 6' }
];

export default function HappyHogView() {
  // Farm Level & EXP
  const [farmLevel, setFarmLevel] = useState(() => {
    const saved = localStorage.getItem('happy_hog_farm_level');
    return saved !== null ? parseInt(saved, 10) : 1;
  });
  const [farmExp, setFarmExp] = useState(() => {
    const saved = localStorage.getItem('happy_hog_farm_exp');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // Barn Capacity Tier
  const [barnCapacityTier, setBarnCapacityTier] = useState(() => {
    const saved = localStorage.getItem('happy_hog_barn_tier');
    return saved !== null ? parseInt(saved, 10) : 2; // Default to Tier 2 (capacity 8)
  });
  const maxPigs = BARN_CAPACITY_TIERS.find((t) => t.tier === barnCapacityTier)?.capacity || 8;
  const expForNextLevel = farmLevel * 120;

  // Screen Size Mode (Theater / Full-window mode)
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Barn Upgrade Modal
  const [showBarnUpgradeModal, setShowBarnUpgradeModal] = useState(false);

  // Breeding Parents Selection
  const [breedParent1Id, setBreedParent1Id] = useState(null);
  const [breedParent2Id, setBreedParent2Id] = useState(null);

  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('happy_hog_coins');
    return saved !== null ? parseInt(saved, 10) : 250;
  });

  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('happy_hog_energy');
    return saved !== null ? parseInt(saved, 10) : 100;
  });

  const [pigs, setPigs] = useState(() => {
    const saved = localStorage.getItem('happy_hog_pigs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 1,
        name: 'น้องสมพร',
        breed: 'pink',
        weight: 35,
        hunger: 40,
        cleanliness: 70,
        health: 100,
        x: 36,
        y: 48,
        direction: 1
      },
      {
        id: 2,
        name: 'ผู้ช่วยตรวจเอก',
        breed: 'auditor',
        weight: 56,
        hunger: 80,
        cleanliness: 35,
        health: 100,
        x: 62,
        y: 58,
        direction: -1
      }
    ];
  });

  const [selectedPigId, setSelectedPigId] = useState(1);
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem('happy_hog_fence_locked') === 'true';
  });
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('farm'); // 'farm' | 'crops' | 'shop' | 'breed'

  // Modals
  const [showDailyLoginModal, setShowDailyLoginModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPigDexModal, setShowPigDexModal] = useState(false);
  const [showNeighborsModal, setShowNeighborsModal] = useState(false);
  const [visitingNeighbor, setVisitingNeighbor] = useState(null);

  // Active Barn Theme
  const [activeThemeId, setActiveThemeId] = useState(() => {
    return localStorage.getItem('happy_hog_active_theme') || 'pasture';
  });

  const [unlockedThemes, setUnlockedThemes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('happy_hog_unlocked_themes') || '["pasture", "cozy_wood"]');
    } catch {
      return ['pasture', 'cozy_wood'];
    }
  });

  const [unlockedBreeds, setUnlockedBreeds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('happy_hog_unlocked_breeds') || '["pink"]');
    } catch {
      return ['pink'];
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('happy_hog_stats') ||
          '{"feedCount":0,"bathCount":0,"soldCount":0,"breedCount":0,"stolenCount":0}'
      );
    } catch {
      return { feedCount: 0, bathCount: 0, soldCount: 0, breedCount: 0, stolenCount: 0 };
    }
  });

  // Default 4 Crop Plots
  const DEFAULT_CROPS = [
    { id: 0, seed: 'corn', plantedAt: Date.now() - 15000, duration: 25 },
    { id: 1, seed: 'carrot', plantedAt: Date.now() - 25000, duration: 40 },
    { id: 2, seed: null, plantedAt: null, duration: 0 },
    { id: 3, seed: null, plantedAt: null, duration: 0 }
  ];

  // Crop Plots (4 plots) - Guaranteed to have 4 plots
  const [crops, setCrops] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('happy_hog_crops') || '[]');
      if (Array.isArray(saved) && saved.length >= 4) {
        return saved;
      }
      return DEFAULT_CROPS;
    } catch {
      return DEFAULT_CROPS;
    }
  });

  // Crop Inventory
  const [cropInventory, setCropInventory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('happy_hog_crop_inv') || '{"bran":3,"corn":2,"carrot":1,"pumpkin":0}');
    } catch {
      return { bran: 3, corn: 2, carrot: 1, pumpkin: 0 };
    }
  });

  // Daily Quests State
  const INITIAL_QUESTS = [
    { id: 'feed', title: 'ให้อาหารหมูในคอก', desc: 'ให้อาหารน้องหมูตัวใดก็ได้ 3 ครั้ง', target: 3, current: 0, rewardCoins: 120, rewardEnergy: 20, icon: '🥣', claimed: false },
    { id: 'bath', title: 'อาบน้ำขัดตัวหมู', desc: 'พาหมูไปแช่น้ำขัดผิว 2 ครั้ง', target: 2, current: 0, rewardCoins: 100, rewardEnergy: 15, icon: '🧼', claimed: false },
    { id: 'crop', title: 'เก็บเกี่ยวผลผลิตการเกษตร', desc: 'เก็บเกี่ยวพืชผักจากแปลงปลูก 2 แปลง', target: 2, current: 0, rewardCoins: 150, rewardCrops: { bran: 2 }, icon: '🧺', claimed: false },
    { id: 'clean', title: 'เก็บกวาดลานฟาร์ม', desc: 'เก็บมูลหมูหรือวัชพืชในลานฟาร์ม 3 ชิ้น', target: 3, current: 0, rewardCoins: 120, icon: '🧹', claimed: false },
    { id: 'visit', title: 'ออกไปเยี่ยมเพื่อน อบต.', desc: 'เยี่ยมคอกเพื่อนร่วมงานและช่วยให้อาหาร', target: 1, current: 0, rewardCoins: 100, icon: '🚜', claimed: false },
    { id: 'sell', title: 'ขายหมูส่งโรงงานพัสดุ', desc: 'เลี้ยงหมูจนโตแล้วขายทำกำไร 1 ตัว', target: 1, current: 0, rewardCoins: 300, icon: '💰', claimed: false }
  ];

  const [quests, setQuests] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('happy_hog_quests') || '[]');
      if (Array.isArray(saved) && saved.length > 0) return saved;
      return INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  });

  // Yard Drops: Interactive litter / gold drops in the farm pen
  const [yardDrops, setYardDrops] = useState([
    { id: 1, type: 'poop', icon: '💩', label: 'มูลหมูชีวภาพ', reward: 25, x: 44, y: 56 },
    { id: 2, type: 'weed', icon: '🌿', label: 'วัชพืชฟาร์ม', reward: 20, x: 60, y: 44 },
    { id: 3, type: 'coin', icon: '⭐', label: 'เหรียญทองนำโชค', reward: 50, x: 50, y: 62 }
  ]);

  // Lucky Piggy Wheel
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [celebrationReward, setCelebrationReward] = useState(null);
  const [wheelSpinsToday, setWheelSpinsToday] = useState(() => {
    const saved = localStorage.getItem('happy_hog_wheel_spins');
    return saved !== null ? parseInt(saved, 10) : 3;
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  // Urgent Bounties from Local Government Departments
  const [bounties, setBounties] = useState([
    {
      id: 'b1',
      dept: 'กองช่าง อบต.',
      avatar: '👷',
      title: 'จัดซื้อหมูสายลุยตรวจงาน',
      desc: 'ต้องการหมูช่าง Factor F หรือหมูน้ำหนัก 45kg ขึ้นไป',
      rewardCoins: 800,
      reqBreed: 'engineer',
      minWeight: 45
    },
    {
      id: 'b2',
      dept: 'กองคลัง อปท.',
      avatar: '👩‍💼',
      title: 'โครงการตรวจนับพัสดุสิ้นปี',
      desc: 'ต้องการหมูผู้ตรวจ ปค.5 หรือหมูทองคำ 1 ตัว',
      rewardCoins: 1200,
      reqBreed: 'auditor',
      minWeight: 50
    },
    {
      id: 'b3',
      dept: 'สำนักปลัด อบต.',
      avatar: '👨‍💼',
      title: 'มหกรรมสัตว์เลี้ยงชุมชนสัมพันธ์',
      desc: 'ต้องการหมูซากุระหรือหมูสายรุ้ง สตง.',
      rewardCoins: 1500,
      reqBreed: 'sakura',
      minWeight: 45
    }
  ]);

  // Daily Login Progress
  const [loginData, setLoginData] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('happy_hog_login_data') ||
          '{"streak":1,"claimedDays":[],"lastClaimDate":""}'
      );
    } catch {
      return { streak: 1, claimedDays: [], lastClaimDate: '' };
    }
  });

  // Neighbor Farms
  const [neighbors, setNeighbors] = useState(() => {
    try {
      const saved = localStorage.getItem('happy_hog_neighbors');
      return saved ? JSON.parse(saved) : INITIAL_NEIGHBORS;
    } catch {
      return INITIAL_NEIGHBORS;
    }
  });

  const [bubbles, setBubbles] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Timer loop for crop growth, energy regeneration, and yard litter spawning
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
      setEnergy((e) => Math.min(100, e + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Periodic Litter & Gold Drops Spawner in Farm Yard (Relaxed 75s timer, max 3 items)
  useEffect(() => {
    const dropTimer = setInterval(() => {
      setYardDrops((prev) => {
        if (prev.length >= 3) return prev;
        const types = [
          { type: 'poop', icon: '💩', label: 'มูลหมูชีวภาพ', reward: 35 },
          { type: 'weed', icon: '🌿', label: 'วัชพืชฟาร์ม', reward: 30 },
          { type: 'bug', icon: '🐛', label: 'หนอนกินใบไม้', reward: 40 },
          { type: 'coin', icon: '⭐', label: 'เหรียญทองนำโชค', reward: 60 }
        ];
        const selected = types[Math.floor(Math.random() * types.length)];
        const newDrop = {
          id: Date.now(),
          ...selected,
          x: Math.round(34 + Math.random() * 32),
          y: Math.round(38 + Math.random() * 26)
        };
        return [...prev, newDrop];
      });
    }, 75000);
    return () => clearInterval(dropTimer);
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const canClaimToday = loginData.lastClaimDate !== todayStr;
  const currentClaimDay = Math.min(7, loginData.claimedDays.length + 1);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('happy_hog_coins', coins.toString());
    localStorage.setItem('happy_hog_energy', energy.toString());
    localStorage.setItem('happy_hog_pigs', JSON.stringify(pigs));
    localStorage.setItem('happy_hog_fence_locked', isLocked ? 'true' : 'false');
    localStorage.setItem('happy_hog_active_theme', activeThemeId);
    localStorage.setItem('happy_hog_unlocked_themes', JSON.stringify(unlockedThemes));
    localStorage.setItem('happy_hog_unlocked_breeds', JSON.stringify(unlockedBreeds));
    localStorage.setItem('happy_hog_stats', JSON.stringify(stats));
    localStorage.setItem('happy_hog_crops', JSON.stringify(crops));
    localStorage.setItem('happy_hog_crop_inv', JSON.stringify(cropInventory));
    localStorage.setItem('happy_hog_login_data', JSON.stringify(loginData));
    localStorage.setItem('happy_hog_neighbors', JSON.stringify(neighbors));
    localStorage.setItem('happy_hog_quests', JSON.stringify(quests));
    localStorage.setItem('happy_hog_wheel_spins', wheelSpinsToday.toString());
    localStorage.setItem('happy_hog_farm_level', farmLevel.toString());
    localStorage.setItem('happy_hog_farm_exp', farmExp.toString());
    localStorage.setItem('happy_hog_barn_tier', barnCapacityTier.toString());
  }, [coins, energy, pigs, isLocked, activeThemeId, unlockedThemes, unlockedBreeds, stats, crops, cropInventory, loginData, neighbors, quests, wheelSpinsToday, farmLevel, farmExp, barnCapacityTier]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Farm Experience & Level Up System
  const addExp = (amount) => {
    setFarmExp((prevExp) => {
      let currentExp = prevExp + amount;
      let currentLv = farmLevel;
      const needed = currentLv * 120;
      if (currentExp >= needed) {
        currentExp -= needed;
        const nextLv = currentLv + 1;
        setFarmLevel(nextLv);
        playSound('fanfare', isMuted);
        const rewardBonus = nextLv * 250;
        setCoins((c) => c + rewardBonus);
        setEnergy(100);
        setCelebrationReward({
          title: `🎉 เลเวลอัป! ฟาร์มเลเวล ${nextLv}`,
          badge: 'FARM LEVEL UP!',
          subtitle: 'ฟาร์มของคุณเติบโตขึ้นไปอีกขั้น',
          rewardText: `+${rewardBonus.toLocaleString()} ฿ & พลังงานเต็ม ⚡100`,
          icon: '⭐',
          color: 'from-amber-400 to-yellow-500'
        });
        showToast(`⭐ เลเวลอัปเป็น Lv.${nextLv}! ได้รับ +${rewardBonus} ฿`);
      }
      return currentExp;
    });
  };

  // Keyboard shortcut for Theater Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheaterMode]);

  // Screen Size Toggle (Theater / Full Window)
  const toggleScreenMode = () => {
    if (!isTheaterMode) {
      setIsTheaterMode(true);
      try {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
    } else {
      setIsTheaterMode(false);
      try {
        if (document.exitFullscreen && document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } catch (e) {}
    }
  };

  // Evaluate & Unlock Breeds automatically based on conditions
  useEffect(() => {
    const toUnlock = [...unlockedBreeds];
    let changed = false;

    if (!toUnlock.includes('auditor') && pigs.some((p) => p.weight >= 60)) {
      toUnlock.push('auditor');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ใหม่: "หมูผู้ตรวจสอบ ปค.5" แล้ว!');
    }
    if (!toUnlock.includes('engineer') && coins >= 300) {
      toUnlock.push('engineer');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ใหม่: "หมูช่างตรวจงาน Factor F" แล้ว!');
    }
    if (!toUnlock.includes('shabu') && stats.feedCount >= 12) {
      toUnlock.push('shabu');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ใหม่: "หมูชาบูกระทะทอง" แล้ว!');
    }
    if (!toUnlock.includes('golden') && stats.soldCount >= 3) {
      toUnlock.push('golden');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ใหม่: "หมูพัสดุทองคำแท้" แล้ว!');
    }
    if (!toUnlock.includes('rainbow') && stats.breedCount >= 3) {
      toUnlock.push('rainbow');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ในตำนาน: "หมูสายรุ้ง สตง. ผ่านฉลุย" แล้ว!');
    }
    if (!toUnlock.includes('knight') && (loginData.streak >= 7 || coins >= 1500)) {
      toUnlock.push('knight');
      changed = true;
      showToast('👑 ปลดล็อกสายพันธุ์ระดับมหาเทพ: "หมูองค์รักษ์พิทักษ์ อปท." แล้ว!');
    }

    if (changed) {
      setUnlockedBreeds(toUnlock);
      playSound('fanfare', isMuted);
    }
  }, [pigs, coins, stats, loginData, unlockedBreeds, isMuted]);

  // Ambient wandering loop for pigs inside the pen with differentiated hunger, bath, health decays
  useEffect(() => {
    const interval = setInterval(() => {
      setPigs((prevPigs) =>
        prevPigs.map((p) => {
          // Individual metabolism modifier based on pig id so they don't decay in lockstep
          const rateModifier = 0.85 + ((p.id % 5) * 0.07);

          if (Math.random() < 0.45) {
            const currentBounds = BARN_THEMES[activeThemeId]?.bounds || { minX: 30, maxX: 68, minY: 36, maxY: 66 };
            const nextX = Math.max(currentBounds.minX, Math.min(currentBounds.maxX, p.x + (Math.random() * 16 - 8)));
            const nextY = Math.max(currentBounds.minY, Math.min(currentBounds.maxY, p.y + (Math.random() * 14 - 7)));

            // 1. Hunger decreases steadily (~0.32% per wander step)
            const hungerLoss = 0.32 * rateModifier;
            const nextHunger = Math.max(0, p.hunger - hungerLoss);

            // 2. Cleanliness decreases much slower (~0.08% per step, even slower in onsen)
            // If pen has uncollected waste, cleanliness drops an extra 0.04%
            const wastePenalty = yardDrops.length > 0 ? 0.04 : 0;
            const cleanlinessLoss = (activeThemeId === 'onsen_mud' ? 0.04 : 0.08) * rateModifier + wastePenalty;
            const nextCleanliness = Math.max(0, p.cleanliness - cleanlinessLoss);

            // 3. Health only drops if the pig is starving or very dirty!
            let healthLoss = 0;
            if (nextHunger < 15) healthLoss += 0.25; // Starving
            if (nextCleanliness < 15) healthLoss += 0.2; // Filthy
            const nextHealth = Math.max(0, p.health - healthLoss);

            // 4. Gradual weight growth when well-fed & clean
            let weightDelta = 0;
            if (nextHunger >= 60 && nextCleanliness >= 60 && p.health >= 80) {
              const breedMax = PIG_BREEDS[p.breed]?.maxWeight || 100;
              if (p.weight < breedMax) {
                weightDelta = 0.05; // grows 50 grams
              }
            }

            return {
              ...p,
              x: nextX,
              y: nextY,
              direction: nextX >= p.x ? 1 : -1,
              hunger: Math.round(nextHunger * 10) / 10,
              cleanliness: Math.round(nextCleanliness * 10) / 10,
              health: Math.round(nextHealth * 10) / 10,
              weight: Math.round((p.weight + weightDelta) * 10) / 10
            };
          }
          return p;
        })
      );
    }, 2400);

    return () => clearInterval(interval);
  }, [activeThemeId, yardDrops.length]);

  const selectedPig = pigs.find((p) => p.id === selectedPigId) || pigs[0];
  const activeTheme = BARN_THEMES[activeThemeId] || BARN_THEMES.pasture;

  // Determine what Need bubble a pig should show (ONLY when an urgent need exists!)
  const getPigNeed = (pig) => {
    // 1. Sick (Urgent!)
    if (pig.health < 60) return { type: 'heal', icon: '💉', label: 'ไม่สบาย', hint: 'แตะเพื่อฉีดยารักษา' };
    // 2. Hungry
    if (pig.hunger < 45) return { type: 'feed', icon: '🥣', label: 'หิวข้าว', hint: 'แตะเพื่อให้อาหารทันที' };
    // 3. Dirty
    if (pig.cleanliness < 45) return { type: 'bath', icon: '🧼', label: 'ตัวมอมแมม', hint: 'แตะเพื่ออาบน้ำขัดตัว' };
    // 4. Ready to breed (Mature, well-fed, clean, not in cooldown)
    const isResting = pig.breedCooldownUntil && pig.breedCooldownUntil > currentTime;
    if (pig.weight >= 60 && pig.hunger >= 80 && pig.cleanliness >= 80 && !isResting) {
      return { type: 'love', icon: '💖', label: 'พร้อมผสมพันธุ์', hint: 'แตะเพื่อไปห้องแล็บวิจัย' };
    }
    // Content & happy pigs: NO permanent bouncing bubble!
    return null;
  };

  // Quick Action triggered directly from tapping a Pig's Speech Bubble!
  const handleBubbleClick = (e, pig, need) => {
    e.stopPropagation();
    setSelectedPigId(pig.id);

    if (need.type === 'feed') {
      if (cropInventory.corn > 0) {
        setCropInventory((inv) => ({ ...inv, corn: inv.corn - 1 }));
        handleDirectFeed(pig, { name: 'ข้าวโพดสดจากแปลง', weightGain: 12, fullness: 50 });
        showToast(`🌽 ให้น้องกินข้าวโพดสดจากแปลงผักฟรี! (+12 kg)`);
      } else if (cropInventory.bran > 0) {
        setCropInventory((inv) => ({ ...inv, bran: inv.bran - 1 }));
        handleDirectFeed(pig, { name: 'รำข้าวจากแปลง', weightGain: 5, fullness: 25 });
        showToast(`🌾 ให้น้องกินรำข้าวจากแปลงผักฟรี! (+5 kg)`);
      } else {
        handleFeed(FOODS[0]);
      }
    } else if (need.type === 'bath') {
      handleBath();
    } else if (need.type === 'heal') {
      handleVaccine();
    } else if (need.type === 'love') {
      setActiveTab('breed');
      showToast('💖 น้องอารมณ์ดี พร้อมเข้าห้องแล็บผสมพันธุ์แล้ว!');
    } else {
      playSound('oink', isMuted);
      setHearts((h) => [...h, { id: Date.now(), x: pig.x, y: pig.y - 12 }]);
      setTimeout(() => setHearts((h) => h.slice(1)), 1200);
      showToast(`💖 ลูบหัว ${pig.name} น้องร้องอู๊ดๆ อย่างมีความสุข!`);
    }
  };

  const advanceQuest = (questId, amount = 1) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.claimed) {
          const nextVal = Math.min(q.target, q.current + amount);
          return { ...q, current: nextVal };
        }
        return q;
      })
    );
  };

  const handleDirectFeed = (targetPig, food) => {
    playSound('feed', isMuted);
    setPigs((prev) =>
      prev.map((p) => {
        if (p.id === targetPig.id) {
          const breed = PIG_BREEDS[p.breed] || PIG_BREEDS.pink;
          const gain = food.weightGain;
          const newWeight = Math.min(breed.maxWeight, Math.round((p.weight + gain) * 10) / 10);
          return {
            ...p,
            weight: newWeight,
            hunger: Math.min(100, p.hunger + food.fullness)
          };
        }
        return p;
      })
    );
    setStats((s) => ({ ...s, feedCount: s.feedCount + 1 }));
    advanceQuest('feed', 1);
    addExp(10);
    setHearts((h) => [...h, { id: Date.now(), x: targetPig.x, y: targetPig.y - 12 }]);
    setTimeout(() => setHearts((h) => h.slice(1)), 1200);
  };

  const handleFeed = (food) => {
    if (!selectedPig) return;
    if (coins < food.cost) {
      showToast('❌ เหรียญไม่พอซื้ออาหาร!');
      return;
    }

    setCoins((c) => c - food.cost);
    handleDirectFeed(selectedPig, food);
    showToast(`🍽️ ซื้อ ${food.name} ให้น้องกิน (+${food.weightGain} kg)`);
  };

  const handleBath = () => {
    if (!selectedPig) return;
    playSound('bubble', isMuted);
    setPigs((prev) =>
      prev.map((p) => (p.id === selectedPig.id ? { ...p, cleanliness: 100 } : p))
    );
    setStats((s) => ({ ...s, bathCount: s.bathCount + 1 }));
    advanceQuest('bath', 1);
    addExp(10);

    const newBubbles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: selectedPig.x + (Math.random() * 16 - 8),
      y: selectedPig.y - 10 + (Math.random() * 10 - 5)
    }));
    setBubbles(newBubbles);
    setTimeout(() => setBubbles([]), 1500);

    showToast('🧼 อาบน้ำในอ่างไม้หอมฉุย ตัวสะอาด 100%! (+10 EXP)');
  };

  const handleVaccine = () => {
    if (!selectedPig) return;
    if (coins < 20) {
      showToast('❌ เหรียญไม่พอค่ายา (ต้องการ 20 เหรียญ)');
      return;
    }
    setCoins((c) => c - 20);
    playSound('heal', isMuted);
    setPigs((prev) =>
      prev.map((p) => (p.id === selectedPig.id ? { ...p, health: 100 } : p))
    );
    addExp(15);
    showToast('💉 ฉีดยาป้องกันโรคเรียบร้อย สุขภาพแข็งแรง 100%! (+15 EXP)');
  };

  const handleDrinkWater = () => {
    if (!selectedPig) return;
    playSound('bubble', isMuted);
    setPigs((prev) =>
      prev.map((p) => (p.id === selectedPig.id ? { ...p, health: Math.min(100, p.health + 20) } : p))
    );
    addExp(5);
    setHearts((h) => [...h, { id: Date.now(), x: selectedPig.x, y: selectedPig.y - 12 }]);
    setTimeout(() => setHearts((h) => h.slice(1)), 1200);
    showToast(`🚰 น้องดื่มน้ำจากก๊อกน้ำธรรมชาติ สดชื่นกระปรี้กระเปร่า! (+5 EXP)`);
  };

  const handleSellPig = (pig) => {
    if (pigs.length <= 1) {
      showToast('⚠️ ไม่ควรขายหมูตัวสุดท้าย เดี๋ยวฟาร์มจะร้างนะ!');
      return;
    }

    const breed = PIG_BREEDS[pig.breed] || PIG_BREEDS.pink;
    let priceMultiplier = 1.0;
    if (activeThemeId === 'golden_palace') priceMultiplier = 1.2;

    const earnings = Math.round(pig.weight * breed.pricePerKg * priceMultiplier);

    setCoins((c) => c + earnings);
    playSound('coin', isMuted);

    setPigs((prev) => prev.filter((p) => p.id !== pig.id));
    if (selectedPigId === pig.id) {
      const remaining = pigs.filter((p) => p.id !== pig.id);
      setSelectedPigId(remaining[0]?.id || null);
    }

    setStats((s) => ({ ...s, soldCount: s.soldCount + 1 }));
    advanceQuest('sell', 1);
    addExp(30);
    showToast(`💰 ขาย ${pig.name} (${pig.weight} kg) ได้รับ ${earnings.toLocaleString()} เหรียญ & +30 EXP!`);
  };

  const handleBuyPiglet = (breedKey, cost) => {
    if (coins < cost) {
      showToast('❌ เหรียญไม่พอซื้อลูกหมูพันธุ์นี้!');
      return;
    }
    if (pigs.length >= maxPigs) {
      showToast(`⚠️ คอกหมูเต็มแล้ว! (รับได้สูงสุด ${maxPigs} ตัว) ขยายขนาดคอกหมูก่อนนะ!`);
      setShowBarnUpgradeModal(true);
      return;
    }
    if (!unlockedBreeds.includes(breedKey)) {
      showToast(`🔒 สายพันธุ์นี้ยังถูกล็อกอยู่! (${PIG_BREEDS[breedKey].unlockDesc})`);
      return;
    }

    setCoins((c) => c - cost);
    playSound('coin', isMuted);

    const names = ['น้องนำโชค', 'น้องมั่งมี', 'น้องเงินล้าน', 'น้องเบิกจ่าย', 'น้องไร้ใบเตือน', 'น้องทองแท้'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const newPig = {
      id: Date.now(),
      name: `${randomName} #${pigs.length + 1}`,
      breed: breedKey,
      weight: 18,
      hunger: 90,
      cleanliness: 100,
      health: 100,
      x: 35 + Math.random() * 30,
      y: 40 + Math.random() * 25,
      direction: 1
    };

    setPigs((prev) => [...prev, newPig]);
    setSelectedPigId(newPig.id);
    addExp(20);
    showToast(`🎉 ยินดีด้วย! ได้ต้อนรับลูกหมูใหม่: ${PIG_BREEDS[breedKey].name}`);
  };

  const handleBreed = () => {
    if (pigs.length < 2) {
      showToast('⚠️ ต้องมีหมูอย่างน้อย 2 ตัวในการผสมพันธุ์!');
      return;
    }
    if (pigs.length >= maxPigs) {
      showToast(`⚠️ คอกหมูเต็มแล้ว! (รับได้สูงสุด ${maxPigs} ตัว) ขยายขนาดคอกหมูก่อนนะ!`);
      setShowBarnUpgradeModal(true);
      return;
    }
    if (coins < 80) {
      showToast('❌ เหรียญไม่พอค่าผสมพันธุ์ (ต้องการ 80 เหรียญ)');
      return;
    }

    const maturePigs = pigs.filter((p) => p.weight >= 60);
    if (maturePigs.length < 2) {
      showToast('⚠️ หมูต้องหนักอย่างน้อย 60 kg ขึ้นไป ถึงจะพร้อมผสมพันธุ์!');
      return;
    }

    // Determine parent pigs
    let p1 = maturePigs.find((p) => p.id === breedParent1Id) || maturePigs[0];
    let p2 = maturePigs.find((p) => p.id === breedParent2Id && p.id !== p1.id) || maturePigs.find((p) => p.id !== p1.id) || maturePigs[1];

    if (!p1 || !p2 || p1.id === p2.id) {
      showToast('⚠️ กรุณาเลือกหมูพ่อพันธุ์และแม่พันธุ์ 2 ตัวที่ต่างกัน');
      return;
    }

    const now = Date.now();
    if (p1.breedCooldownUntil && p1.breedCooldownUntil > now) {
      const waitSec = Math.ceil((p1.breedCooldownUntil - now) / 1000);
      showToast(`⏳ พ่อพันธุ์ "${p1.name}" กำลังพักฟื้น: เหลืออีก ${waitSec} วินาที`);
      return;
    }
    if (p2.breedCooldownUntil && p2.breedCooldownUntil > now) {
      const waitSec = Math.ceil((p2.breedCooldownUntil - now) / 1000);
      showToast(`⏳ แม่พันธุ์ "${p2.name}" กำลังพักฟื้น: เหลืออีก ${waitSec} วินาที`);
      return;
    }

    setCoins((c) => c - 80);
    playSound('coin', isMuted);

    const roll = Math.random();
    let resultBreed = 'pink';
    if (roll > 0.92) resultBreed = 'knight';
    else if (roll > 0.8) resultBreed = 'rainbow';
    else if (roll > 0.65) resultBreed = 'golden';
    else if (roll > 0.5) resultBreed = 'shabu';
    else if (roll > 0.35) resultBreed = 'sakura';
    else if (roll > 0.2) resultBreed = 'engineer';
    else if (roll > 0.1) resultBreed = 'auditor';

    const babyId = Date.now();
    const baby = {
      id: babyId,
      name: `ลูกหมูพันธุกรรม (${PIG_BREEDS[resultBreed].tag})`,
      breed: resultBreed,
      weight: 15,
      hunger: 100,
      cleanliness: 100,
      health: 100,
      x: 50,
      y: 50,
      direction: 1,
      breedCooldownUntil: now + 180000 // baby rests 3 min
    };

    // Parents rest for 2 minutes (120,000 ms)
    const cooldownDuration = 120000;
    setPigs((prev) =>
      prev
        .map((p) => {
          if (p.id === p1.id || p.id === p2.id) {
            return { ...p, breedCooldownUntil: now + cooldownDuration };
          }
          return p;
        })
        .concat(baby)
    );

    setSelectedPigId(baby.id);
    setStats((s) => ({ ...s, breedCount: s.breedCount + 1 }));
    addExp(50);

    if (!unlockedBreeds.includes(resultBreed)) {
      setUnlockedBreeds((prev) => [...prev, resultBreed]);
    }

    playSound('fanfare', isMuted);
    setCelebrationReward({
      title: '🧬 ผสมพันธุ์ลูกหมูสำเร็จ!',
      badge: 'NEW PIGLET BORN!',
      subtitle: `สายเลือดจาก ${p1.name} & ${p2.name}`,
      rewardText: `ได้รับ: ${PIG_BREEDS[resultBreed].name} & +50 EXP`,
      icon: '🐷',
      color: 'from-purple-500 to-indigo-600'
    });
  };

  const handlePlantCrop = (plotId, seedKey) => {
    const meta = CROPS_META[seedKey];
    if (coins < meta.seedCost) {
      showToast(`❌ เหรียญไม่พอซื้อเมล็ดพันธุ์ (ต้องการ ${meta.seedCost} เหรียญ)`);
      return;
    }

    setCoins((c) => c - meta.seedCost);
    playSound('plant', isMuted);

    setCrops((prev) =>
      prev.map((plot) =>
        plot.id === plotId
          ? { id: plotId, seed: seedKey, plantedAt: Date.now(), duration: meta.duration }
          : plot
      )
    );
    showToast(`🌱 หว่านเมล็ด "${meta.name}" แล้ว! (รอ ${meta.duration} วินาที)`);
  };

  const handleHarvestCrop = (plotId) => {
    const plot = crops.find((p) => p.id === plotId);
    if (!plot || !plot.seed) return;

    const meta = CROPS_META[plot.seed];
    playSound('coin', isMuted);

    setCropInventory((inv) => ({
      ...inv,
      [meta.foodId]: (inv[meta.foodId] || 0) + meta.yieldCount
    }));

    setCrops((prev) =>
      prev.map((p) => (p.id === plotId ? { id: plotId, seed: null, plantedAt: null, duration: 0 } : p))
    );

    advanceQuest('crop', 1);
    addExp(15);
    showToast(`🧺 เก็บเกี่ยว "${meta.name}" ได้ผลผลิต +${meta.yieldCount} ถุง & +15 EXP!`);
  };

  const handleCollectYardDrop = (e, drop) => {
    e.stopPropagation();
    setYardDrops((prev) => prev.filter((d) => d.id !== drop.id));
    setCoins((c) => c + drop.reward);
    advanceQuest('clean', 1);
    addExp(8);
    playSound('coin', isMuted);
    showToast(`✨ เก็บ ${drop.label} ในลานฟาร์ม! ได้รับ +${drop.reward} 🪙 & +8 EXP`);
  };

  const handleClaimQuest = (quest) => {
    if (quest.current < quest.target || quest.claimed) return;
    if (quest.rewardCoins) setCoins((c) => c + quest.rewardCoins);
    if (quest.rewardEnergy) setEnergy((e) => Math.min(100, e + quest.rewardEnergy));
    if (quest.rewardCrops) {
      setCropInventory((inv) => {
        const next = { ...inv };
        Object.entries(quest.rewardCrops).forEach(([k, v]) => {
          next[k] = (next[k] || 0) + v;
        });
        return next;
      });
    }
    setQuests((prev) => prev.map((q) => (q.id === quest.id ? { ...q, claimed: true } : q)));
    addExp(40);
    playSound('fanfare', isMuted);
    setCelebrationReward({
      title: '📋 ภารกิจประจำวันสำเร็จ!',
      subtitle: quest.title,
      icon: quest.icon,
      badge: 'DAILY QUEST COMPLETED',
      rewardText: [
        quest.rewardCoins ? `+${quest.rewardCoins} 🪙` : null,
        quest.rewardEnergy ? `+${quest.rewardEnergy} ⚡` : null,
        quest.rewardCrops ? `+2 🌾` : null,
        '+40 EXP ⭐'
      ].filter(Boolean).join('  '),
      color: '#f59e0b'
    });
  };

  const handleFulfillBounty = (bounty) => {
    const eligibleIndex = pigs.findIndex((p) =>
      bounty.reqBreed ? p.breed === bounty.reqBreed : p.weight >= (bounty.minWeight || 45)
    );
    if (eligibleIndex === -1) {
      showToast(`❌ ไม่มีหมูที่ตรงตามความต้องการของ ${bounty.dept}!`);
      return;
    }
    if (pigs.length <= 1) {
      showToast('⚠️ ไม่ควรส่งหมูตัวสุดท้าย เดี๋ยวฟาร์มจะร้างนะ!');
      return;
    }
    const chosenPig = pigs[eligibleIndex];
    setPigs((prev) => prev.filter((_, idx) => idx !== eligibleIndex));
    if (selectedPigId === chosenPig.id) {
      const remaining = pigs.filter((_, idx) => idx !== eligibleIndex);
      setSelectedPigId(remaining[0]?.id || null);
    }
    setCoins((c) => c + bounty.rewardCoins);
    setBounties((prev) => prev.filter((b) => b.id !== bounty.id));
    advanceQuest('sell', 1);
    addExp(50);
    playSound('fanfare', isMuted);
    setCelebrationReward({
      title: '📜 ส่งมอบหมูโครงการ อปท. สำเร็จ!',
      subtitle: `ส่งมอบ ${chosenPig.name} ให้ ${bounty.dept} (${bounty.title})`,
      icon: '🚚',
      badge: bounty.dept,
      rewardText: `+${bounty.rewardCoins.toLocaleString()} เหรียญ 🪙 & +50 EXP`,
      color: '#10b981'
    });
  };

  const WHEEL_PRIZES = [
    {
      id: 0,
      name: 'เหรียญทองขวัญถุง',
      shortLabel: '+150 ฿',
      icon: '💰',
      rewardDesc: '+150 เหรียญทอง',
      color: '#f59e0b',
      sliceGrad: ['#f59e0b', '#d97706'],
      textColor: '#ffffff',
      coins: 150
    },
    {
      id: 1,
      name: 'ข้าวโพดหวานสด',
      shortLabel: 'ข้าวโพด x3',
      icon: '🌽',
      rewardDesc: 'ข้าวโพดสด 3 ถุง',
      color: '#10b981',
      sliceGrad: ['#10b981', '#059669'],
      textColor: '#ffffff',
      crops: { corn: 3 }
    },
    {
      id: 2,
      name: 'น้ำยาพลังงานสดชื่น',
      shortLabel: '+30 ⚡',
      icon: '⚡',
      rewardDesc: '+30 พลังงาน',
      color: '#0284c7',
      sliceGrad: ['#0284c7', '#0369a1'],
      textColor: '#ffffff',
      energy: 30
    },
    {
      id: 3,
      name: 'ถุงทองคำเพิ่มพูน',
      shortLabel: '+300 ฿',
      icon: '🪙',
      rewardDesc: '+300 เหรียญทอง',
      color: '#ec4899',
      sliceGrad: ['#ec4899', '#db2777'],
      textColor: '#ffffff',
      coins: 300
    },
    {
      id: 4,
      name: 'แครอททองคำชั้นดี',
      shortLabel: 'แครอท x2',
      icon: '🥕',
      rewardDesc: 'แครอททองคำ 2 ถุง',
      color: '#ea580c',
      sliceGrad: ['#ea580c', '#c2410c'],
      textColor: '#ffffff',
      crops: { carrot: 2 }
    },
    {
      id: 5,
      name: 'เพชรคลังหลวง อปท.',
      shortLabel: '+500 ฿',
      icon: '💎',
      rewardDesc: '+500 เหรียญทอง',
      color: '#8b5cf6',
      sliceGrad: ['#8b5cf6', '#7c3aed'],
      textColor: '#ffffff',
      coins: 500
    },
    {
      id: 6,
      name: 'ฟักทองยักษ์โภชนาการ',
      shortLabel: 'ฟักทอง x1',
      icon: '🎃',
      rewardDesc: 'ฟักทองยักษ์ 1 ลูก',
      color: '#14b8a6',
      sliceGrad: ['#14b8a6', '#0d9488'],
      textColor: '#ffffff',
      crops: { pumpkin: 1 }
    },
    {
      id: 7,
      name: 'แจ็กพอตเศรษฐีพันล้าน',
      shortLabel: '1,000฿ 👑',
      icon: '👑',
      rewardDesc: 'แจ็กพอต 1,000 เหรียญทองคำ!',
      color: '#e11d48',
      sliceGrad: ['#e11d48', '#be123c'],
      textColor: '#fef08a',
      coins: 1000,
      isJackpot: true
    }
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;
    if (wheelSpinsToday <= 0 && coins < 50) {
      showToast('❌ สิทธิ์หมุนฟรีหมดแล้ว และเหรียญไม่พอ (รอบละ 50 เหรียญ)');
      return;
    }

    if (wheelSpinsToday > 0) {
      setWheelSpinsToday((s) => s - 1);
    } else {
      setCoins((c) => c - 50);
    }

    setIsSpinning(true);
    playSound('feed', isMuted);
    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const sliceAngle = 45; // 360 / 8
    const extraTurns = 6 * 360;
    // Align center of prizeIndex slice with 12 o'clock pointer (-90 deg)
    const targetAngle = 360 - (prizeIndex * sliceAngle + 22.5);
    const finalRot = wheelRotation + extraTurns + (targetAngle - (wheelRotation % 360));
    setWheelRotation(finalRot);

    setTimeout(() => {
      setIsSpinning(false);
      const won = WHEEL_PRIZES[prizeIndex];
      if (won.coins) setCoins((c) => c + won.coins);
      if (won.energy) setEnergy((e) => Math.min(100, e + won.energy));
      if (won.crops) {
        setCropInventory((inv) => {
          const next = { ...inv };
          Object.entries(won.crops).forEach(([k, v]) => {
            next[k] = (next[k] || 0) + v;
          });
          return next;
        });
      }
      playSound('fanfare', isMuted);
      // Trigger Big Reward Celebration Modal!
      setCelebrationReward({
        title: won.isJackpot ? '👑 มหาแจ็กพอต 1,000฿ แตก!' : '🎉 ยินดีด้วย! คุณได้รับรางวัล',
        subtitle: `วงล้อหมูพารวยหยุดที่ช่อง "${won.name}"`,
        icon: won.icon,
        badge: won.isJackpot ? 'MEGA JACKPOT' : 'LUCKY PIGGY WHEEL',
        rewardText: won.rewardDesc,
        color: won.color
      });
    }, 3600);
  };

  const handleAttemptSteal = (neighbor) => {
    if (energy < 15) {
      showToast('⚡ พลังงานไม่พอสำหรับปฏิบัติการย่องเบา (ต้องการ 15 พลังงาน)');
      return;
    }
    if (pigs.length >= maxPigs) {
      showToast(`⚠️ คอกหมูของเราเต็มแล้ว (จุได้สูงสุด ${maxPigs} ตัว) ขยายขนาดคอกหมูก่อนนะ!`);
      return;
    }

    setEnergy((e) => Math.max(0, e - 15));

    if (neighbor.isLocked) {
      playSound('bark', isMuted);
      showToast(`🐶 สุนัขเฝ้าบ้านเห่ากรรโชก! รั้วล็อกแน่นหนา แอบเข้าไปไม่ได้ รีบหนีเร็วก่อนโดนจับ!`);
      return;
    }

    const roll = Math.random();
    if (roll < 0.8) {
      playSound('steal', isMuted);
      const targetPig = neighbor.pigs[Math.floor(Math.random() * neighbor.pigs.length)];
      const stolenBaby = {
        id: Date.now(),
        name: `หมูอุ้มจาก${neighbor.name}`,
        breed: targetPig.breed,
        weight: Math.round(targetPig.weight * 0.6),
        hunger: 80,
        cleanliness: 90,
        health: 100,
        x: 45,
        y: 50,
        direction: 1
      };

      setPigs((prev) => [...prev, stolenBaby]);
      setSelectedPigId(stolenBaby.id);
      setStats((s) => ({ ...s, stolenCount: s.stolenCount + 1 }));

      playSound('fanfare', isMuted);
      showToast(`🥷 ย่องอุ้มหมูสำเร็จ! ได้รับ "${stolenBaby.name}" (${PIG_BREEDS[stolenBaby.breed]?.name}) กลับคอกเราแล้ว!`);
      setVisitingNeighbor(null);
    } else {
      playSound('bark', isMuted);
      showToast(`⚠️ เจ้าของฟาร์มเปิดไฟฉายออกมาดูพอดี! วิ่งหนีรอดมาได้หวุดหวิด!`);
    }
  };

  const handleHelpNeighbor = (neighbor) => {
    if (energy < 10) {
      showToast('⚡ พลังงานไม่พอ (ต้องการ 10 พลังงาน)');
      return;
    }
    setEnergy((e) => Math.max(0, e - 10));
    setCoins((c) => c + 35);
    advanceQuest('visit', 1);
    playSound('coin', isMuted);
    showToast(`🤝 ช่วยดูแลและให้อาหารหมูฟาร์ม ${neighbor.name} ได้รับเหรียญมิตรภาพ +35 🪙!`);
  };

  const handleClaimDailyReward = () => {
    if (!canClaimToday) {
      showToast('✅ คุณได้รับของขวัญวันนี้ไปแล้ว พรุ่งนี้มารับใหม่นะครับ!');
      return;
    }

    const reward = DAILY_REWARDS[currentClaimDay - 1];
    setCoins((c) => c + reward.coins);

    if (reward.unlockBreed && !unlockedBreeds.includes(reward.unlockBreed)) {
      setUnlockedBreeds((b) => [...b, reward.unlockBreed]);
    }
    if (reward.unlockTheme && !unlockedThemes.includes(reward.unlockTheme)) {
      setUnlockedThemes((t) => [...t, reward.unlockTheme]);
    }
    if (reward.grantPig && pigs.length < 8) {
      const bonusPig = {
        id: Date.now(),
        name: `หมูทองคำรางวัลล็อกอิน`,
        breed: reward.grantPig,
        weight: 25,
        hunger: 100,
        cleanliness: 100,
        health: 100,
        x: 50,
        y: 50,
        direction: 1
      };
      setPigs((p) => [...p, bonusPig]);
    }

    const nextClaimed = [...loginData.claimedDays, currentClaimDay];
    const nextStreak = currentClaimDay >= 7 ? 1 : loginData.streak + 1;
    setLoginData({
      streak: nextStreak,
      claimedDays: currentClaimDay >= 7 ? [] : nextClaimed,
      lastClaimDate: todayStr
    });

    playSound('fanfare', isMuted);
    setCelebrationReward({
      title: '🎁 รางวัลล็อกอิน 7 วัน!',
      subtitle: `ล็อกอินต่อเนื่องวันที่ ${currentClaimDay}: ${reward.title}`,
      icon: reward.icon,
      badge: `DAY ${currentClaimDay} REWARD`,
      rewardText: reward.rewardDesc,
      color: '#ec4899'
    });
    showToast(`🎁 ยินดีด้วย! รับรางวัลวันที่ ${currentClaimDay}: ${reward.title} (${reward.rewardDesc}) สำเร็จ!`);
  };

  const handleSelectTheme = (themeKey) => {
    const theme = BARN_THEMES[themeKey];
    if (unlockedThemes.includes(themeKey)) {
      setActiveThemeId(themeKey);
      playSound('feed', isMuted);
      showToast(`🎨 เปลี่ยนธีมคอกเป็น: "${theme.name}" เรียบร้อยแล้ว!`);
      setShowThemeModal(false);
      return;
    }

    if (coins < theme.cost) {
      showToast(`❌ เหรียญไม่พอปลดล็อกธีมนี้ (ต้องการ ${theme.cost} เหรียญ)`);
      return;
    }

    setCoins((c) => c - theme.cost);
    setUnlockedThemes((prev) => [...prev, themeKey]);
    setActiveThemeId(themeKey);
    playSound('fanfare', isMuted);
    showToast(`🎉 ปลดล็อกและเปิดใช้งานธีม: "${theme.name}" สำเร็จ!`);
    setShowThemeModal(false);
  };

  return (
    <div className={`p-1 sm:p-3 max-w-7xl mx-auto select-none font-sans transition-all ${
      isTheaterMode ? 'fixed inset-0 z-50 bg-[#1e0e06] p-2 sm:p-4 overflow-y-auto w-screen h-screen m-0 max-w-none' : ''
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#2b180d]/95 text-amber-200 border-2 border-amber-500 shadow-2xl px-5 py-3 rounded-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Wood Plank Board Container */}
      <div className="relative w-full rounded-3xl p-3 sm:p-5 shadow-2xl overflow-hidden border-8 border-[#3b1d0a] bg-gradient-to-b from-[#8b5a2b] via-[#75441e] to-[#552c0f] flex flex-col justify-between space-y-3">
        {/* Subtle wood plank lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:64px_100%] pointer-events-none" />

        {/* ================= TOP HUD: PIGGY TOWN SIGNATURE STATUS BAR ================= */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 bg-[#2b180d]/85 p-2.5 rounded-2xl border-2 border-amber-700/80 shadow-md">
          {/* Avatar and Level Title with EXP Progress */}
          <div className="flex items-center space-x-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🐷
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-amber-100 text-sm font-mono tracking-tight">PIGGY TOWN</span>
                <span className="bg-amber-500 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                  Lv.{farmLevel}
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-0.5" title={`EXP ฟาร์ม: ${farmExp}/${expForNextLevel}`}>
                <div className="w-20 sm:w-24 h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-amber-500/40">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
                    style={{ width: `${Math.min(100, (farmExp / expForNextLevel) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] text-amber-300 font-mono font-bold">{Math.round((farmExp / expForNextLevel) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Counters (Energy ⚡, Coins 🪙, Free Harvested Feeds 🌾) */}
          <div className="flex items-center gap-2">
            {/* Energy */}
            <div className="bg-gradient-to-b from-white to-[#fef9c3] border-2 border-amber-700 rounded-xl px-2.5 py-1 flex items-center space-x-1 shadow-xs">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="font-black text-slate-900 font-mono text-xs">{energy}/100</span>
            </div>

            {/* Coins */}
            <div className="bg-gradient-to-b from-white to-[#fef9c3] border-2 border-amber-700 rounded-xl px-2.5 py-1 flex items-center space-x-1 shadow-xs">
              <Coins className="w-4 h-4 text-amber-800" />
              <span className="font-black text-slate-900 font-mono text-xs">{coins.toLocaleString()}</span>
            </div>

            {/* Free Crops Inventory Indicator */}
            <div
              onClick={() => setActiveTab('crops')}
              className="bg-amber-900/90 hover:bg-amber-800 border-2 border-amber-600 text-amber-200 rounded-xl px-2.5 py-1 flex items-center space-x-2 text-xs font-bold cursor-pointer transition-colors"
              title="คลังผลผลิตพืชผักจากแปลง (คลิกเพื่อไปที่แปลงปลูก)"
            >
              <span>🌾 {cropInventory.bran || 0}</span>
              <span>🌽 {cropInventory.corn || 0}</span>
              <span>🥕 {cropInventory.carrot || 0}</span>
            </div>

            {/* Daily Gift Button */}
            <button
              onClick={() => setShowDailyLoginModal(true)}
              className={`relative px-2.5 py-1 rounded-xl font-black text-xs border-2 flex items-center space-x-1 shadow-xs cursor-pointer ${
                canClaimToday
                  ? 'bg-gradient-to-b from-amber-300 to-yellow-500 text-amber-950 border-amber-500 animate-pulse'
                  : 'bg-white text-slate-800 border-amber-500'
              }`}
            >
              {canClaimToday && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border border-white animate-ping" />
              )}
              <Gift className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">ของขวัญ</span>
            </button>

            {/* Lucky Piggy Wheel Button */}
            <button
              onClick={() => setShowWheelModal(true)}
              className="px-2.5 py-1 bg-gradient-to-b from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-black text-xs border-2 border-purple-300 shadow-xs flex items-center space-x-1 cursor-pointer"
            >
              <span>🎡</span>
              <span className="hidden sm:inline">หมุนวงล้อ</span>
              {wheelSpinsToday > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {wheelSpinsToday}
                </span>
              )}
            </button>

            {/* Visiting Neighbors Button */}
            <button
              onClick={() => setShowNeighborsModal(true)}
              className="px-2.5 py-1 bg-gradient-to-b from-teal-400 to-emerald-600 hover:from-teal-500 hover:to-emerald-700 text-white rounded-xl font-black text-xs border-2 border-teal-300 shadow-xs flex items-center space-x-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>เยี่ยมเพื่อน</span>
            </button>

            {/* Screen Size Mode Toggle (Theater / Full Window) */}
            <button
              onClick={toggleScreenMode}
              className="p-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-600 rounded-xl text-amber-200 cursor-pointer flex items-center space-x-1"
              title={isTheaterMode ? 'ย่อหน้าต่างกลับสู่ขนาดปกติ (Esc)' : 'ขยายหน้าต่างเต็มหน้าจอ (Theater Fullscreen)'}
            >
              {isTheaterMode ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-amber-400" />}
              <span className="text-[10px] font-bold hidden sm:inline">{isTheaterMode ? 'ย่อจอ' : 'เต็มจอ'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-600 rounded-xl text-amber-200 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="relative z-10 flex flex-wrap gap-1.5 bg-amber-950/60 p-1.5 rounded-2xl border border-amber-800/80 w-fit">
          <button
            onClick={() => setActiveTab('farm')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'farm'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md scale-102'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <span>🐷 ฟาร์มหมูในตำนาน ({pigs.length}/{maxPigs})</span>
          </button>

          <button
            onClick={() => setActiveTab('crops')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'crops'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md scale-102'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>แปลงปลูกพืชผัก (4 แปลง)</span>
          </button>

          <button
            onClick={() => setActiveTab('quests')}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'quests'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md scale-102'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>ภารกิจ & จัดซื้อ อปท.</span>
            {quests.some((q) => q.current >= q.target && !q.claimed) && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md scale-102'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ตลาดซื้อลูกหมู</span>
          </button>

          <button
            onClick={() => setActiveTab('breed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'breed'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md scale-102'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>แล็บผสมพันธุ์</span>
          </button>
        </div>

        {/* ================= TAB 1: IMMERSIVE 2.5D ISOMETRIC FARM (PIGGY TOWN VIBES) ================= */}
        {activeTab === 'farm' && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Interactive Farm Canvas (3 Columns) */}
            <div className="lg:col-span-3 space-y-2">
              <div
                className={`relative w-full ${isTheaterMode ? 'h-[calc(100vh-210px)] min-h-[580px]' : 'h-[540px]'} rounded-3xl overflow-hidden border-4 border-amber-900/80 shadow-2xl select-none transition-all ${
                  activeTheme.bgImage ? '' : `bg-gradient-to-b ${activeTheme.bgClass}`
                }`}
                style={
                  activeTheme.bgImage
                    ? {
                        backgroundImage: `url(${activeTheme.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 40%'
                      }
                    : {}
                }
              >
                {/* Cyber Space High-Tech Holographic Grid (When activeTheme is cyber_space) */}
                {activeThemeId === 'cyber_space' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(99,102,241,0.3),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.25),transparent_50%)]" />
                    {/* Stars */}
                    {['⭐', '✨', '🌟', '💫', '⭐', '✨'].map((star, i) => (
                      <span
                        key={i}
                        className="absolute text-cyan-300 animate-pulse"
                        style={{
                          left: `${15 + i * 14}%`,
                          top: `${10 + (i % 3) * 12}%`,
                          animationDuration: `${1.5 + i * 0.3}s`
                        }}
                      >
                        {star}
                      </span>
                    ))}
                    {/* 3D Perspective Holographic Cyber Grid */}
                    <div
                      style={{ perspective: '420px', perspectiveOrigin: '50% 30%' }}
                      className="absolute inset-0 flex items-end"
                    >
                      <div
                        style={{
                          transform: 'rotateX(55deg)',
                          backgroundImage:
                            'linear-gradient(rgba(6,182,212,0.45) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(6,182,212,0.45) 1.5px, transparent 1.5px)',
                          backgroundSize: '44px 44px'
                        }}
                        className="w-full h-[70%] border-t-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.6)]"
                      />
                    </div>
                  </div>
                )}

                {/* Atmospheric Ambient Particles */}
                {activeTheme.atmosphere === 'leaves' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {['🍂', '🍁', '🍂', '🍁'].map((leaf, i) => (
                      <span
                        key={i}
                        className="absolute text-xl animate-bounce opacity-80"
                        style={{
                          left: `${20 + i * 22}%`,
                          top: `${18 + (i % 2) * 20}%`,
                          animationDuration: `${2.2 + i * 0.5}s`
                        }}
                      >
                        {leaf}
                      </span>
                    ))}
                  </div>
                )}

                {activeTheme.atmosphere === 'steam' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {['♨️', '🌸', '♨️', '🌸'].map((st, i) => (
                      <span
                        key={i}
                        className="absolute text-xl animate-pulse opacity-85"
                        style={{
                          left: `${18 + i * 24}%`,
                          top: `${20 + (i % 2) * 15}%`,
                          animationDuration: `${1.8 + i * 0.4}s`
                        }}
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                )}

                {activeTheme.atmosphere === 'lanterns' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {['🏮', '✨', '🏮', '✨'].map((lt, i) => (
                      <span
                        key={i}
                        className="absolute text-lg animate-pulse opacity-90"
                        style={{
                          left: `${15 + i * 25}%`,
                          top: `${14 + (i % 2) * 12}%`,
                          animationDuration: `${2.0 + i * 0.5}s`
                        }}
                      >
                        {lt}
                      </span>
                    ))}
                  </div>
                )}

                {activeTheme.atmosphere === 'sparkles' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {['✨', '⭐', '💎', '✨', '⭐'].map((sp, i) => (
                      <span
                        key={i}
                        className="absolute text-lg animate-pulse opacity-90 drop-shadow-md"
                        style={{
                          left: `${12 + i * 20}%`,
                          top: `${16 + (i % 3) * 16}%`,
                          animationDuration: `${1.4 + i * 0.3}s`
                        }}
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hotspot 1: Barn Cottage (Top-Left) */}
                <div
                  onClick={() => showToast(`🏠 ${activeTheme.name}: คอกฟาร์มอบอุ่น จุหมูได้ ${pigs.length}/8 ตัว`)}
                  className="absolute top-10 left-8 w-44 h-36 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors z-15"
                  title="โรงเรือนคอกหมู (แตะเพื่อดูข้อมูล)"
                />

                {/* Hotspot 2: Water Well / Stream (Top-Right) */}
                <div
                  onClick={handleDrinkWater}
                  className="absolute top-10 right-24 w-32 h-32 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors z-15"
                  title="บ่อน้ำ / สปาธรรมชาติ (แตะเพื่อให้น้องดื่มน้ำสดชื่น)"
                />

                {/* Hotspot 3: Fruit Orchard & Garden (Bottom-Right) */}
                <div
                  onClick={() => setActiveTab('crops')}
                  className="absolute bottom-4 right-6 w-44 h-36 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors z-15"
                  title="สวนผลไม้ & แปลงเกษตร (แตะเพื่อไปที่แปลงปลูกผัก)"
                />

                {/* Interactive Bath Station Button Widget */}
                <div
                  onClick={handleBath}
                  className="absolute top-36 right-12 z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                  title="อ่างอาบน้ำขัดตัว (แตะเพื่ออาบน้ำขัดผิว)"
                >
                  <div className="px-3 py-1.5 bg-[#2b180d]/90 hover:bg-[#2b180d] text-amber-200 border-2 border-amber-400 rounded-2xl shadow-xl flex items-center space-x-1.5 backdrop-blur-xs">
                    <span className="text-lg">🧼</span>
                    <span className="text-xs font-black">อาบน้ำ</span>
                  </div>
                </div>

                {/* Interactive Feed Station Button Widget */}
                <div
                  onClick={() => handleFeed(FOODS[0])}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                  title="รางอาหารกลาง (แตะเพื่อให้อาหาร)"
                >
                  <div className="px-4 py-2 bg-[#2b180d]/90 hover:bg-[#2b180d] text-amber-200 border-2 border-amber-400 rounded-2xl shadow-xl flex items-center space-x-2 backdrop-blur-xs">
                    <span className="text-xl">🥣</span>
                    <span className="text-xs font-black">รางอาหารกลาง</span>
                  </div>
                </div>

                {/* Floating Hearts & Bubbles */}
                {hearts.map((h) => (
                  <div
                    key={h.id}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    className="absolute pointer-events-none text-3xl animate-bounce z-40 drop-shadow-md"
                  >
                    💖
                  </div>
                ))}

                {bubbles.map((b) => (
                  <div
                    key={b.id}
                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    className="absolute pointer-events-none text-2xl animate-ping z-40"
                  >
                    🫧
                  </div>
                ))}

                {/* ================= INTERACTIVE FARM YARD DROPS (TAP-TO-EARN & CLEANUP) ================= */}
                {yardDrops.map((drop) => (
                  <div
                    key={drop.id}
                    onClick={(e) => handleCollectYardDrop(e, drop)}
                    style={{ left: `${drop.x}%`, top: `${drop.y}%` }}
                    className="absolute z-25 -translate-x-1/2 -translate-y-1/2 cursor-pointer group hover:scale-125 active:scale-95 transition-all select-none"
                    title={`${drop.label} (แตะเพื่อเก็บรับ +${drop.reward} 🪙)`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border-2 border-amber-400 shadow-xl flex items-center justify-center text-lg animate-bounce ring-2 ring-amber-300/60">
                      {drop.icon}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#2b180d] text-amber-200 text-[9px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap border border-amber-600 pointer-events-none shadow-md">
                      +{drop.reward} 🪙
                    </div>
                  </div>
                ))}

                {/* ================= ROAMING CHIBI PIGS WITH SPEECH BUBBLES ================= */}
                {/* ================= ROAMING CHIBI PIGS WITH SPEECH BUBBLES ================= */}
                {pigs.map((pig) => {
                  const isSelected = selectedPigId === pig.id;
                  const need = getPigNeed(pig);
                  const isResting = pig.breedCooldownUntil && pig.breedCooldownUntil > currentTime;
                  const zIndexVal = Math.floor(pig.y * 10) + (isSelected ? 500 : 0);

                  return (
                    <div
                      key={pig.id}
                      onClick={() => {
                        setSelectedPigId(pig.id);
                        playSound('oink', isMuted);
                      }}
                      style={{
                        left: `${pig.x}%`,
                        top: `${pig.y}%`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'left 2.4s ease-out, top 2.4s ease-out',
                        zIndex: zIndexVal
                      }}
                      className="absolute cursor-pointer group"
                    >
                      {/* 1. Floating Need Bubble - ONLY WHEN AN URGENT NEED EXISTS! */}
                      {need && (
                        <div
                          onClick={(e) => handleBubbleClick(e, pig, need)}
                          className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-40 transition-transform hover:scale-120 active:scale-95 animate-bounce pointer-events-auto"
                          title={need.hint}
                        >
                          <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center text-xl ring-2 ring-amber-400">
                            <span>{need.icon}</span>
                          </div>
                          <div className="w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-amber-300 rotate-45 -mt-1.5 shadow-xs" />
                        </div>
                      )}

                      {/* 2. High-Fidelity 3D Chibi Illustrated Pig Sprite */}
                      <PigSprite
                        breed={pig.breed}
                        isSelected={isSelected}
                        direction={pig.direction}
                        weight={pig.weight}
                      />

                      {/* 3. Name, Weight, and Health Status Bar Underneath (Upright Text, Never Mirrored!) */}
                      <div
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none whitespace-nowrap z-35"
                      >
                        <div className={`px-2 py-0.5 rounded-full border shadow-md flex items-center space-x-1 transition-all ${
                          isSelected
                            ? 'bg-[#2b180d] text-amber-200 text-[10px] font-black border-amber-400 ring-2 ring-amber-400/80 scale-105'
                            : 'bg-[#2b180d]/85 text-amber-100/90 text-[9px] font-bold border-amber-700/70'
                        }`}>
                          <span>{pig.name.length > 12 && !isSelected ? `${pig.name.slice(0, 11)}…` : pig.name}</span>
                          <span className="text-amber-400 font-mono text-[9px]">({pig.weight}kg)</span>
                          {isResting && (
                            <span className="text-amber-300 text-[8px]" title="กำลังพักฟื้นหลังคลอด">💤</span>
                          )}
                        </div>
                        <div className="w-12 h-1.5 bg-slate-900/80 rounded-full overflow-hidden mt-0.5 border border-white/40 flex shadow-xs">
                          <div
                            className={`h-full ${pig.hunger < 40 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                            style={{ width: `${pig.hunger}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Top Corner Controls (Fence lock status and theme pill) */}
                <div className="absolute top-2 left-6 z-20 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsLocked(!isLocked);
                      playSound('feed', isMuted);
                      showToast(isLocked ? '🔓 ปลดล็อกรั้วแล้ว ระวังเพื่อนแอบย่องมาอุ้ม!' : '🔒 ล็อกรั้วคอกแน่นหนาแล้ว ป้องกันการขโมย 100%');
                    }}
                    className={`px-3 py-1 rounded-xl text-[10px] font-black flex items-center space-x-1 border-2 shadow-md cursor-pointer transition-all ${
                      isLocked || activeThemeId === 'cyber_space'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-rose-600 text-white border-rose-400 animate-pulse'
                    }`}
                  >
                    {isLocked || activeThemeId === 'cyber_space' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{isLocked || activeThemeId === 'cyber_space' ? 'รั้วล็อกแล้ว' : 'รั้วยังไม่ล็อก'}</span>
                  </button>

                  <button
                    onClick={() => setShowThemeModal(true)}
                    className="px-2.5 py-1 bg-white/80 hover:bg-white text-slate-800 rounded-xl text-[10px] font-black border border-slate-300 shadow-sm flex items-center space-x-1 cursor-pointer"
                  >
                    <Palette className="w-3 h-3 text-emerald-600" />
                    <span>ธีม: {activeTheme.name}</span>
                  </button>
                </div>
              </div>

              {/* Status Hint & Barn Upgrade Trigger */}
              <div className="bg-[#2b180d]/85 rounded-2xl p-2.5 border border-amber-700/80 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-200 shadow-md">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold">🐷 คอกฟาร์ม:</span>
                  <span className="font-mono bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-600 text-amber-100 font-bold">
                    หมู {pigs.length}/{maxPigs} ตัว
                  </span>
                  {barnCapacityTier < BARN_CAPACITY_TIERS.length && (
                    <button
                      onClick={() => setShowBarnUpgradeModal(true)}
                      className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-[11px] font-black border border-amber-300 shadow-xs flex items-center space-x-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-pulse"
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      <span>ขยายคอกหมู (Tier {barnCapacityTier + 1})</span>
                    </button>
                  )}
                  <span>•</span>
                  <span>น้ำหนักรวม {pigs.reduce((a, b) => a + b.weight, 0).toFixed(1)} kg</span>
                </div>
                <div className="text-amber-300 font-bold text-[11px]">
                  💡 คลิกบอลลูนบนหัวหมู หรือแตะก๊อกน้ำ / อ่างอาบน้ำ / รางอาหาร ได้โดยตรง!
                </div>
              </div>
            </div>

            {/* Selected Pig Care Control Panel (1 Column) */}
            <div className="space-y-3">
              {selectedPig ? (
                <div className="bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] border-4 border-amber-700/80 rounded-3xl p-4 shadow-2xl space-y-3">
                  {/* Selected Pig Avatar Card */}
                  <div className="flex flex-col items-center justify-center p-2.5 bg-gradient-to-b from-amber-100/90 to-orange-100/90 rounded-2xl border-2 border-amber-300 shadow-inner">
                    <img
                      src={`/pigs/${selectedPig.breed}.png`}
                      alt={selectedPig.name}
                      className="w-24 h-24 object-contain drop-shadow-xl animate-bounce"
                      style={{ animationDuration: '3.2s' }}
                    />
                    <div className="text-center mt-1 w-full">
                      <div className="flex items-center justify-between px-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${PIG_BREEDS[selectedPig.breed]?.badgeColor}`}>
                          {PIG_BREEDS[selectedPig.breed]?.tag}
                        </span>
                        <span className="text-xs font-mono font-black text-pink-600">
                          {selectedPig.weight} kg <span className="text-[9px] text-amber-900 font-normal">/ {PIG_BREEDS[selectedPig.breed]?.maxWeight}kg</span>
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-0.5 font-mono truncate">
                        {selectedPig.name}
                      </h3>
                    </div>
                  </div>

                  {/* Status Gauges */}
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-800 text-[11px] mb-0.5">
                        <span>🥣 ความอิ่ม</span>
                        <span>{Math.round(selectedPig.hunger)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                        <div
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: `${selectedPig.hunger}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-800 text-[11px] mb-0.5">
                        <span>🧼 ความสะอาด</span>
                        <span>{Math.round(selectedPig.cleanliness)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                        <div
                          className="bg-blue-500 h-full transition-all duration-300"
                          style={{ width: `${selectedPig.cleanliness}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-800 text-[11px] mb-0.5">
                        <span>❤️ สุขภาพ</span>
                        <span>{Math.round(selectedPig.health)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                        <div
                          className="bg-rose-500 h-full transition-all duration-300"
                          style={{ width: `${selectedPig.health}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feeding Action Grid */}
                  <div className="space-y-1 pt-2 border-t border-amber-300">
                    <span className="text-xs font-black text-amber-950 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        <span>เลือกอาหารให้น้อง:</span>
                      </span>
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {FOODS.map((food) => {
                        const inStock = cropInventory[food.id] || 0;
                        return (
                          <button
                            key={food.id}
                            onClick={() => {
                              if (inStock > 0) {
                                setCropInventory((inv) => ({ ...inv, [food.id]: inv[food.id] - 1 }));
                                handleDirectFeed(selectedPig, food);
                                showToast(`🌾 ให้อาหาร "${food.name}" จากคลังผลผลิตฟรี!`);
                              } else {
                                handleFeed(food);
                              }
                            }}
                            className="p-1.5 rounded-xl border-2 border-amber-400 bg-white hover:bg-amber-50 text-left transition-all cursor-pointer shadow-xs active:scale-98"
                          >
                            <div className="flex items-center space-x-1">
                              <span className="text-base">{food.icon}</span>
                              <div className="truncate">
                                <div className="text-[10px] font-black text-slate-900 truncate">{food.name}</div>
                                <div className="text-[9px] text-amber-700 font-bold">
                                  {inStock > 0 ? (
                                    <span className="text-emerald-700 font-black">มี {inStock} (ฟรี!)</span>
                                  ) : (
                                    <span>{food.cost} ฿</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Care Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={handleBath}
                      className="py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1 shadow-[0_3px_0_#1d4ed8] active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      <Bath className="w-3.5 h-3.5" />
                      <span>อาบน้ำ</span>
                    </button>

                    <button
                      onClick={handleVaccine}
                      className="py-2 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1 shadow-[0_3px_0_#b91c1c] active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      <Syringe className="w-3.5 h-3.5" />
                      <span>ฉีดยา (20฿)</span>
                    </button>
                  </div>

                  {/* Sell Pig Button */}
                  <div className="pt-2 border-t border-amber-300">
                    <button
                      onClick={() => handleSellPig(selectedPig)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1 shadow-[0_3px_0_#065f46] active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>
                        ขายหมู (+{Math.round(selectedPig.weight * (PIG_BREEDS[selectedPig.breed]?.pricePerKg || 15) * (activeThemeId === 'golden_palace' ? 1.2 : 1.0)).toLocaleString()} ฿)
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#fffbeb] p-8 rounded-3xl text-center text-amber-900 border-4 border-amber-700 font-bold">
                  ไม่มีหมูที่ถูกเลือก
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: CROP FARMING PATCH ================= */}
        {activeTab === 'crops' && (
          <div className="relative z-10 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] p-5 sm:p-7 rounded-3xl border-4 border-amber-700 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300 pb-3">
              <div>
                <h2 className="text-lg font-black text-amber-950 font-mono flex items-center space-x-2">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span>แปลงปลูกพืชผักและผลิตอาหารหมู (Farm Patch)</span>
                </h2>
                <p className="text-xs text-amber-900 mt-0.5 font-medium">
                  ปลูกพืชผัก เก็บเกี่ยวมาทำอาหารเลี้ยงหมูได้ฟรีโดยไม่ต้องเสียเหรียญ!
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-amber-200/80 px-3 py-1.5 rounded-2xl border border-amber-400 text-xs font-bold text-amber-950">
                <span>คลังอาหารปัจจุบัน:</span>
                <span>🌾 {cropInventory.bran || 0}</span>
                <span>🌽 {cropInventory.corn || 0}</span>
                <span>🥕 {cropInventory.carrot || 0}</span>
                <span>🎃 {cropInventory.pumpkin || 0}</span>
              </div>
            </div>

            {/* 4 Soil Plots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {crops.map((plot) => {
                const meta = plot.seed ? CROPS_META[plot.seed] : null;
                const elapsedSec = plot.plantedAt ? Math.floor((currentTime - plot.plantedAt) / 1000) : 0;
                const remainingSec = meta ? Math.max(0, meta.duration - elapsedSec) : 0;
                const isReady = meta && remainingSec === 0;

                return (
                  <div
                    key={plot.id}
                    className="bg-[#451a03] border-4 border-[#270e02] rounded-3xl p-4 shadow-xl flex flex-col justify-between items-center text-center min-h-[220px] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#78350f_2px,transparent_2px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

                    <div className="relative z-10 w-full flex justify-between items-center text-amber-200 text-xs font-bold">
                      <span>แปลงที่ #{plot.id + 1}</span>
                      {meta && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isReady ? 'bg-emerald-500 text-white animate-pulse' : 'bg-amber-900 text-amber-200'}`}>
                          {isReady ? '✨ พร้อมเก็บเกี่ยว' : `⏳ เหลือ ${remainingSec}s`}
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 my-3 flex flex-col items-center">
                      {plot.seed ? (
                        <>
                          <span className={`text-5xl transition-transform ${isReady ? 'scale-115 animate-bounce' : 'scale-90 opacity-90'}`}>
                            {isReady ? meta.icon : '🌱'}
                          </span>
                          <span className="font-black text-amber-100 text-sm mt-2">{meta.name}</span>
                          {!isReady && (
                            <div className="w-24 bg-amber-950 h-2 rounded-full overflow-hidden mt-1.5 border border-amber-800">
                              <div
                                className="bg-emerald-500 h-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (elapsedSec / meta.duration) * 100)}%` }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-4xl opacity-40 text-amber-700">🕳️</span>
                          <span className="text-xs text-amber-400 font-bold mt-2">แปลงดินว่างเปล่า</span>
                        </>
                      )}
                    </div>

                    <div className="relative z-10 w-full">
                      {plot.seed ? (
                        <button
                          onClick={() => handleHarvestCrop(plot.id)}
                          disabled={!isReady}
                          className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                            isReady
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_3px_0_#065f46] hover:brightness-105 active:translate-y-0.5'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <span>{isReady ? '🧺 เก็บเกี่ยวผลผลิต' : `กำลังเจริญเติบโต...`}</span>
                        </button>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[10px] text-amber-300 font-bold block mb-1">เลือกเมล็ดพันธุ์เพื่อปลูก:</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {Object.values(CROPS_META).map((seed) => (
                              <button
                                key={seed.id}
                                onClick={() => handlePlantCrop(plot.id, seed.id)}
                                className="p-1.5 bg-amber-900/90 hover:bg-amber-800 text-amber-100 rounded-xl border border-amber-700 text-[10px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                              >
                                <span>{seed.icon}</span>
                                <span>{seed.seedCost}฿</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: SHOP VIEW ================= */}
        {activeTab === 'shop' && (
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between text-amber-200">
              <div>
                <h2 className="text-lg font-black text-amber-100 font-mono">
                  🏪 ตลาดซื้อขายลูกหมู อปท.
                </h2>
                <p className="text-xs text-amber-300">
                  เลือกซื้อลูกหมูสายพันธุ์พิเศษเพื่อนำไปขุน (สายพันธุ์หายากต้องปลดล็อกก่อน)
                </p>
              </div>
              <div className="px-3.5 py-1.5 bg-amber-950/80 border border-amber-700 text-amber-300 rounded-xl text-xs font-mono font-bold">
                เหรียญ: {coins.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(PIG_BREEDS).map((breed) => {
                const isUnlocked = unlockedBreeds.includes(breed.id);

                return (
                  <div
                    key={breed.id}
                    className={`rounded-2xl p-4 border-3 flex flex-col justify-between space-y-3 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] border-amber-500 shadow-md'
                        : 'bg-slate-200/90 border-slate-400 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${breed.badgeColor}`}>
                          {breed.tag}
                        </span>
                        <span className="text-xs font-mono font-black text-amber-800">
                          {breed.pricePerKg} ฿/kg
                        </span>
                      </div>

                      {/* 3D Chibi Sprite Illustration */}
                      <div className="py-2 flex items-center justify-center">
                        <img
                          src={`/pigs/${breed.id}.png`}
                          alt={breed.name}
                          className="w-20 h-20 object-contain drop-shadow-md hover:scale-110 transition-transform select-none"
                        />
                      </div>

                      <h3 className="font-black text-slate-900 mt-1 font-mono text-sm text-center">{breed.name}</h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed text-center">
                        {breed.description}
                      </p>
                      <div className="text-[10px] text-slate-700 font-bold mt-2 text-center">
                        น้ำหนักสูงสุด: <b>{breed.maxWeight} kg</b>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleBuyPiglet(breed.id, breed.buyCost)}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1 shadow-[0_3px_0_#b45309] active:translate-y-0.5 active:shadow-none cursor-pointer"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>ซื้อลูกหมู ({breed.buyCost.toLocaleString()} ฿)</span>
                      </button>
                    ) : (
                      <div className="p-2 bg-slate-300 rounded-xl text-center text-[10px] font-bold text-slate-700 flex items-center justify-center space-x-1">
                        <Lock className="w-3 h-3 text-slate-600" />
                        <span>เงื่อนไข: {breed.unlockDesc}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: BREEDING LAB ================= */}
        {activeTab === 'breed' && (() => {
          const maturePigs = pigs.filter((p) => p.weight >= 60);
          const p1 = maturePigs.find((p) => p.id === breedParent1Id) || maturePigs[0];
          const p2 = maturePigs.find((p) => p.id === breedParent2Id && p.id !== p1?.id) || maturePigs.find((p) => p.id !== p1?.id) || maturePigs[1];

          const now = currentTime;
          const p1Cooldown = p1?.breedCooldownUntil && p1.breedCooldownUntil > now ? Math.ceil((p1.breedCooldownUntil - now) / 1000) : 0;
          const p2Cooldown = p2?.breedCooldownUntil && p2.breedCooldownUntil > now ? Math.ceil((p2.breedCooldownUntil - now) / 1000) : 0;
          const isParentOnCooldown = p1Cooldown > 0 || p2Cooldown > 0;
          const isCapacityFull = pigs.length >= maxPigs;
          const hasEnoughCoins = coins >= 80;
          const canBreed = maturePigs.length >= 2 && !isParentOnCooldown && !isCapacityFull && hasEnoughCoins;

          return (
            <div className="relative z-10 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] p-6 sm:p-8 rounded-3xl border-4 border-amber-700 max-w-3xl mx-auto space-y-6 shadow-2xl">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto text-3xl border-2 border-purple-300 shadow-md">
                  🧬
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  ห้องปฏิบัติการผสมพันธุ์วิจัยลูกหมู
                </h2>
                <p className="text-xs text-amber-900 max-w-md mx-auto font-medium">
                  เลือกพ่อพันธุ์และแม่พันธุ์ที่โตเต็มวัย (หนัก 60 kg ขึ้นไป) เพื่อวิจัยลูกหมูสายพันธุ์พิเศษ! หลังคลอดพ่อแม่พันธุ์จะต้องพักฟื้น 2 นาที
                </p>
                <div className="inline-flex items-center space-x-2 bg-amber-950/80 text-amber-200 px-3 py-1 rounded-full text-xs font-mono border border-amber-600">
                  <span>🏠 ความจุคอก:</span>
                  <span className="font-bold text-amber-400">{pigs.length}/{maxPigs} ตัว</span>
                  {isCapacityFull && <span className="text-rose-400 font-bold ml-1">(เต็มแล้ว!)</span>}
                </div>
              </div>

              {maturePigs.length < 2 ? (
                <div className="bg-amber-100/90 border-2 border-amber-400 p-6 rounded-2xl text-center space-y-3">
                  <div className="text-3xl">⚠️</div>
                  <h3 className="font-black text-amber-950 text-sm">ยังไม่มีหมูที่พร้อมผสมพันธุ์เพียงพอ</h3>
                  <p className="text-xs text-amber-800 font-medium max-w-sm mx-auto">
                    ต้องมีหมูที่โตเต็มวัย (น้ำหนัก 60 kg ขึ้นไป) อย่างน้อย 2 ตัวในฟาร์ม (ปัจจุบันมี {maturePigs.length} ตัว) กรุณากลับไปให้อาหารและดูแลน้องๆ ให้โตเต็มที่ก่อนนะครับ!
                  </p>
                  <button
                    onClick={() => setActiveTab('farm')}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    🐷 กลับไปดูแลน้องหมูในฟาร์ม
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Select Parents Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sire (พ่อพันธุ์) */}
                    <div className="bg-white/95 p-4 rounded-2xl border-2 border-blue-300 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-900 uppercase flex items-center space-x-1">
                          <span>♂️ หมูพ่อพันธุ์ (Sire)</span>
                        </span>
                        {p1Cooldown > 0 ? (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-300 animate-pulse">
                            ⏳ พักฟื้นอีก {p1Cooldown}s
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300">
                            ✓ พร้อมผสม
                          </span>
                        )}
                      </div>

                      {p1 && (
                        <div className="flex items-center space-x-3 p-2 bg-blue-50/60 rounded-xl border border-blue-200">
                          <img src={`/pigs/${p1.breed}.png`} alt={p1.name} className="w-12 h-12 object-contain" />
                          <div>
                            <div className="font-black text-slate-800 text-xs">{p1.name}</div>
                            <div className="text-[10px] text-slate-500 font-bold">{PIG_BREEDS[p1.breed]?.name} • {p1.weight} kg</div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">เลือกตัวอื่น:</label>
                        <select
                          value={p1?.id || ''}
                          onChange={(e) => setBreedParent1Id(Number(e.target.value))}
                          className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-800 cursor-pointer"
                        >
                          {maturePigs.map((p) => (
                            <option key={p.id} value={p.id} disabled={p.id === p2?.id}>
                              {p.name} ({p.weight} kg) - {PIG_BREEDS[p.breed]?.name} {p.id === p2?.id ? '(เลือกเป็นแม่พันธุ์แล้ว)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Dam (แม่พันธุ์) */}
                    <div className="bg-white/95 p-4 rounded-2xl border-2 border-pink-300 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-pink-900 uppercase flex items-center space-x-1">
                          <span>♀️ หมูแม่พันธุ์ (Dam)</span>
                        </span>
                        {p2Cooldown > 0 ? (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-300 animate-pulse">
                            ⏳ พักฟื้นอีก {p2Cooldown}s
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300">
                            ✓ พร้อมผสม
                          </span>
                        )}
                      </div>

                      {p2 && (
                        <div className="flex items-center space-x-3 p-2 bg-pink-50/60 rounded-xl border border-pink-200">
                          <img src={`/pigs/${p2.breed}.png`} alt={p2.name} className="w-12 h-12 object-contain" />
                          <div>
                            <div className="font-black text-slate-800 text-xs">{p2.name}</div>
                            <div className="text-[10px] text-slate-500 font-bold">{PIG_BREEDS[p2.breed]?.name} • {p2.weight} kg</div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">เลือกตัวอื่น:</label>
                        <select
                          value={p2?.id || ''}
                          onChange={(e) => setBreedParent2Id(Number(e.target.value))}
                          className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-800 cursor-pointer"
                        >
                          {maturePigs.map((p) => (
                            <option key={p.id} value={p.id} disabled={p.id === p1?.id}>
                              {p.name} ({p.weight} kg) - {PIG_BREEDS[p.breed]?.name} {p.id === p1?.id ? '(เลือกเป็นพ่อพันธุ์แล้ว)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Rarity Chances Info */}
                  <div className="bg-amber-100/80 p-3.5 rounded-2xl border border-amber-300 text-xs space-y-2 text-left text-amber-950 font-medium">
                    <div className="font-black text-amber-900 flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>โอกาสได้รับสายพันธุ์พิเศษจากการผสมพันธุ์:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div>• หมูองค์รักษ์พิทักษ์ อปท. (Mythic): <b>8%</b></div>
                      <div>• หมูสายรุ้ง สตง. (Legendary): <b>12%</b></div>
                      <div>• หมูพัสดุทองคำแท้ (Epic): <b>15%</b></div>
                      <div>• หมูชาบูกระทะทอง (Epic): <b>15%</b></div>
                      <div>• หมูซากุระชมพูหวาน (Epic): <b>15%</b></div>
                      <div>• หมูผู้ตรวจ & หมูช่าง: <b>20%</b></div>
                    </div>
                  </div>

                  {/* Breed Button */}
                  <div className="text-center pt-2">
                    <button
                      onClick={handleBreed}
                      disabled={!canBreed}
                      className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 mx-auto shadow-md transition-all ${
                        canBreed
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-[0_5px_0_#4c1d95] active:translate-y-1 active:shadow-none cursor-pointer'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Dna className="w-4 h-4" />
                      <span>
                        {isCapacityFull
                          ? `⚠️ คอกหมูเต็มแล้ว (${maxPigs}/${maxPigs} ตัว) ต้องขยายคอกก่อน`
                          : isParentOnCooldown
                          ? `⏳ มีหมูที่อยู่ระหว่างพักฟื้น (รออีก ${Math.max(p1Cooldown, p2Cooldown)} วินาที)`
                          : !hasEnoughCoins
                          ? `❌ เหรียญไม่พอ (ต้องการ 80 ฿ - ปัจจุบันมี ${coins} ฿)`
                          : '🧬 ผสมพันธุ์ลูกหมูทันที (ค่าบริการ 80 ฿)'}
                      </span>
                    </button>
                    {isCapacityFull && (
                      <button
                        onClick={() => setShowBarnUpgradeModal(true)}
                        className="mt-2 text-xs text-amber-700 hover:text-amber-900 font-black underline cursor-pointer"
                      >
                        ⬆️ คลิกที่นี่เพื่อขยายขนาดคอกหมู
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ================= TAB 5: QUESTS & DEPARTMENT BOUNTIES (EARN COINS & PRIZES) ================= */}
        {activeTab === 'quests' && (
          <div className="relative z-10 space-y-5">
            {/* 1. Lucky Wheel Teaser Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-800 via-indigo-900 to-amber-900 border-4 border-amber-500 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative z-10 flex items-center space-x-4 text-center md:text-left">
                <div
                  className="w-16 h-16 rounded-2xl bg-amber-400 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-lg shrink-0 animate-spin"
                  style={{ animationDuration: '8s' }}
                >
                  🎡
                </div>
                <div>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span className="font-black text-amber-300 font-mono text-lg">วงล้อหมูพารวย (Lucky Piggy Wheel)</span>
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      ฟรีวันละ 3 รอบ
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/90 mt-1">
                    หมุนรับเหรียญทอง อาหารชั้นยอด พลังงาน หรือลุ้นแจ็กพอต 1,000 เหรียญทองคำ!
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-center space-x-3">
                <button
                  onClick={() => setShowWheelModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-amber-950 rounded-2xl font-black text-sm border-2 border-amber-200 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none cursor-pointer flex items-center space-x-2 animate-bounce"
                >
                  <span>🎡</span>
                  <span>
                    {wheelSpinsToday > 0 ? `หมุนวงล้อทันที (ฟรี ${wheelSpinsToday} รอบ)` : 'หมุนวงล้อ (50 🪙)'}
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Daily Quests Grid */}
            <div className="bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] p-5 sm:p-6 rounded-3xl border-4 border-amber-700 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-amber-300 pb-3">
                <div>
                  <h3 className="text-lg font-black text-amber-950 font-mono flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span>ภารกิจเกษตรกร อปท. ประจำวัน (Daily Quests)</span>
                  </h3>
                  <p className="text-xs text-amber-900 mt-0.5 font-medium">
                    ทำกิจกรรมดูแลฟาร์มประจำวันเพื่อรับเหรียญทองและอาหารสะสมฟรี
                  </p>
                </div>

                <div className="bg-amber-200/90 border border-amber-400 px-3 py-1 rounded-xl text-xs font-black text-amber-950">
                  สำเร็จแล้ว: {quests.filter((q) => q.claimed).length}/{quests.length}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {quests.map((q) => {
                  const isCompleted = q.current >= q.target;
                  const progressPct = Math.min(100, Math.round((q.current / q.target) * 100));

                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between space-y-2.5 transition-all ${
                        q.claimed
                          ? 'bg-emerald-50/80 border-emerald-300 opacity-80'
                          : isCompleted
                          ? 'bg-amber-100/90 border-amber-500 shadow-md ring-2 ring-amber-400/50'
                          : 'bg-white border-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl p-2 bg-amber-100 rounded-xl border border-amber-300">
                            {q.icon}
                          </span>
                          <div>
                            <h4 className="font-black text-xs text-slate-900">{q.title}</h4>
                            <p className="text-[11px] text-slate-600 font-medium">{q.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          {q.rewardCoins && (
                            <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                              +{q.rewardCoins} 🪙
                            </span>
                          )}
                          {q.rewardEnergy && (
                            <span className="text-[10px] font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-300">
                              +{q.rewardEnergy} ⚡
                            </span>
                          )}
                          {q.rewardCrops && (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                              +2 🌾
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar & Claim Button */}
                      <div className="flex items-center space-x-3 pt-1">
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                            <span>ความคืบหน้า</span>
                            <span className="font-mono">{q.current}/{q.target}</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleClaimQuest(q)}
                          disabled={!isCompleted || q.claimed}
                          className={`px-3.5 py-1.5 rounded-xl font-black text-xs shrink-0 transition-all cursor-pointer ${
                            q.claimed
                              ? 'bg-emerald-600 text-white cursor-default'
                              : isCompleted
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md animate-pulse active:scale-95'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {q.claimed ? 'รับแล้ว ✅' : isCompleted ? 'รับรางวัล! 🎁' : `${progressPct}%`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Department Urgent Purchasing Bounties */}
            <div className="bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] p-5 sm:p-6 rounded-3xl border-4 border-amber-700 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300 pb-3">
                <div>
                  <h3 className="text-lg font-black text-amber-950 font-mono flex items-center space-x-2">
                    <span>📜</span>
                    <span>ใบสั่งจัดซื้อเร่งด่วนของหน่วยงาน อปท. (Department Bounties)</span>
                  </h3>
                  <p className="text-xs text-amber-900 mt-0.5 font-medium">
                    หน่วยงานท้องถิ่นต้องการหมูตามเกณฑ์เพื่อใช้ในโครงการ ส่งมอบหมูรับเงินรางวัลก้อนโตทันที!
                  </p>
                </div>
                <span className="text-xs bg-amber-200 px-2.5 py-1 rounded-xl text-amber-900 font-bold w-fit">
                  โครงการรับซื้อ {bounties.length} รายการ
                </span>
              </div>

              {bounties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {bounties.map((bounty) => {
                    const eligiblePig = pigs.find((p) =>
                      bounty.reqBreed ? p.breed === bounty.reqBreed : p.weight >= (bounty.minWeight || 45)
                    );

                    return (
                      <div
                        key={bounty.id}
                        className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center space-x-2.5 mb-2">
                            <span className="text-3xl p-1.5 bg-amber-100 rounded-2xl border border-amber-200">
                              {bounty.avatar}
                            </span>
                            <div>
                              <div className="text-[10px] font-black text-amber-800 uppercase">
                                {bounty.dept}
                              </div>
                              <div className="text-xs font-black text-slate-900">
                                {bounty.title}
                              </div>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                            {bounty.desc}
                          </p>

                          <div className="mt-3 p-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
                            <span className="text-[10px] text-slate-500 font-bold block">
                              ค่าตอบแทนโครงการ
                            </span>
                            <span className="text-base font-black text-emerald-700 font-mono">
                              +{bounty.rewardCoins.toLocaleString()} 🪙
                            </span>
                          </div>
                        </div>

                        <div>
                          {eligiblePig ? (
                            <button
                              onClick={() => handleFulfillBounty(bounty)}
                              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-black text-xs shadow-md active:scale-95 cursor-pointer flex items-center justify-center space-x-1"
                            >
                              <span>🚚</span>
                              <span>ส่งมอบ {eligiblePig.name}</span>
                            </button>
                          ) : (
                            <div className="p-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-bold text-center border border-slate-200">
                              🔒 ยังไม่มีหมูตรงเกณฑ์ในคอก
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-amber-900 font-bold text-xs">
                  ✅ ดำเนินการส่งมอบหมูให้ทุกหน่วยงาน อปท. ครบถ้วนแล้ว!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: 7-DAY DAILY LOGIN REWARDS ================= */}
      {showDailyLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-300 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-950 font-mono flex items-center space-x-2">
                  <span>🎁</span>
                  <span>ปฏิทินรับรางวัลล็อกอิน 7 วัน (Daily Login)</span>
                </h3>
                <p className="text-[11px] text-amber-800 font-bold">
                  ล็อกอินต่อเนื่องเพื่อรับเหรียญทอง อาหารพิเศษ และลูกหมูหายากในตำนาน!
                </p>
              </div>
              <button
                onClick={() => setShowDailyLoginModal(false)}
                className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 7 Days Reward Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DAILY_REWARDS.map((r) => {
                const isClaimed = loginData.claimedDays.includes(r.day);
                const isCurrent = currentClaimDay === r.day;

                return (
                  <div
                    key={r.day}
                    className={`rounded-2xl p-3 border-2 flex flex-col items-center text-center relative transition-all ${
                      isClaimed
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 opacity-90'
                        : isCurrent && canClaimToday
                        ? 'bg-amber-300 border-amber-600 shadow-lg scale-103 ring-2 ring-amber-400'
                        : 'bg-white border-amber-200 text-amber-950'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.2 rounded-full mb-1">
                      วันที่ {r.day}
                    </span>
                    <span className="text-3xl my-1">{r.icon}</span>
                    <span className="text-[11px] font-black">{r.title}</span>
                    <span className="text-[9px] text-amber-800 font-bold mt-0.5">{r.rewardDesc}</span>

                    {isClaimed && (
                      <div className="absolute inset-0 bg-emerald-600/20 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center">
                        <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={handleClaimDailyReward}
                disabled={!canClaimToday}
                className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  canClaimToday
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-[0_5px_0_#065f46] active:translate-y-1 active:shadow-none'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span>
                  {canClaimToday
                    ? `กดรับรางวัลวันที่ ${currentClaimDay} ทันที!`
                    : 'วันนี้รับของขวัญไปแล้ว พรุ่งนี้มารับใหม่นะ'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: NEIGHBOR FARMS & STEALING ================= */}
      {showNeighborsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-300 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-950 font-mono flex items-center space-x-2">
                  <span>🚜</span>
                  <span>เยี่ยมฟาร์มเพื่อน อบต. (Neighbor Farms & Stealing)</span>
                </h3>
                <p className="text-[11px] text-amber-800 font-bold">
                  ช่วยเพื่อนดูแลหมูรับเหรียญมิตรภาพ หรือแอบย่องไปอุ้มหมูหากเพื่อนลืมล็อกคอก!
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNeighborsModal(false);
                  setVisitingNeighbor(null);
                }}
                className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {visitingNeighbor ? (
              <div className="space-y-4 bg-white/80 p-5 rounded-2xl border-2 border-amber-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{visitingNeighbor.avatar}</span>
                    <div>
                      <h4 className="font-black text-slate-900">{visitingNeighbor.name}</h4>
                      <p className="text-xs text-slate-500 font-bold">{visitingNeighbor.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${visitingNeighbor.isLocked ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-rose-100 text-rose-800 border-rose-400 animate-pulse'}`}>
                      {visitingNeighbor.statusText}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-950/10 p-3 rounded-2xl border border-amber-300/80">
                  <div className="text-xs font-bold text-amber-950 mb-2">🐷 หมูในคอกของเพื่อน:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {visitingNeighbor.pigs.map((np) => (
                      <div key={np.id} className="bg-white p-2 rounded-xl border border-amber-200 flex items-center space-x-2.5 shadow-xs">
                        <img
                          src={`/pigs/${np.breed || 'pink'}.png`}
                          alt={np.name}
                          className="w-12 h-12 object-contain drop-shadow-sm shrink-0"
                        />
                        <div>
                          <div className="text-xs font-black text-slate-900">{np.name}</div>
                          <div className="text-[10px] text-amber-800 font-bold">น้ำหนัก {np.weight} kg</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleHelpNeighbor(visitingNeighbor)}
                    className="py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 shadow-[0_3px_0_#065f46] active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    <span>🤝 ช่วยให้อาหาร (+35 🪙)</span>
                  </button>

                  <button
                    onClick={() => handleAttemptSteal(visitingNeighbor)}
                    className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      visitingNeighbor.isLocked
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-[0_3px_0_#991b1b] active:translate-y-0.5 active:shadow-none animate-pulse'
                    }`}
                  >
                    <span>🥷 แอบย่องไปอุ้มหมู!</span>
                  </button>
                </div>

                <button
                  onClick={() => setVisitingNeighbor(null)}
                  className="w-full py-1.5 text-xs text-amber-800 hover:underline font-bold cursor-pointer text-center"
                >
                  ← กลับไปดูรายชื่อเพื่อนทั้งหมด
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {neighbors.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setVisitingNeighbor(n)}
                    className="bg-white hover:bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 hover:border-amber-400 shadow-sm flex items-center justify-between cursor-pointer transition-all hover:scale-101"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{n.avatar}</span>
                      <div>
                        <div className="font-black text-sm text-slate-900">{n.name}</div>
                        <div className="text-xs text-slate-500 font-bold">{n.role}</div>
                        <div className="text-[10px] text-amber-800 font-mono mt-0.5">
                          หมูในคอก: {n.pigs.length} ตัว
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end space-y-1">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${n.isLocked ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-rose-100 text-rose-800 border-rose-400 animate-pulse'}`}>
                        {n.isLocked ? '🔒 ล็อกคอก' : '🔓 ลืมล็อก!'}
                      </span>
                      <span className="text-xs font-bold text-amber-600 flex items-center space-x-0.5">
                        <span>เข้าชม</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 3: BARN THEMES SELECTOR ================= */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-300 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-950 font-mono flex items-center space-x-2">
                  <span>🎨</span>
                  <span>เปลี่ยนบรรยากาศธีมคอกหมู (Barn Themes)</span>
                </h3>
                <p className="text-[11px] text-amber-800 font-bold">
                  เลือกธีมคอกหมูที่ชื่นชอบ พร้อมรับพลังพิเศษประจำธีม
                </p>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {Object.values(BARN_THEMES).map((theme) => {
                const isUnlocked = unlockedThemes.includes(theme.id);
                const isActive = activeThemeId === theme.id;

                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-101'
                        : isUnlocked
                        ? 'bg-white hover:bg-amber-100/70 border-amber-200 text-amber-950'
                        : 'bg-slate-100 border-slate-300 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {theme.bgImage ? (
                        <img
                          src={theme.bgImage}
                          alt={theme.name}
                          className="w-16 h-12 rounded-xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-sm shrink-0">
                          {theme.icon}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-sm">{theme.name}</span>
                          {isActive && (
                            <span className="bg-white text-amber-900 text-[10px] font-black px-2 py-0.2 rounded-full">
                              กำลังใช้งาน
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${isActive ? 'text-amber-100' : 'text-slate-600'}`}>
                          พลังพิเศษ: {theme.perk}
                        </p>
                        {!isUnlocked && (
                          <p className="text-[10px] text-rose-600 font-bold mt-1">
                            🔒 {theme.unlockDesc}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      {isActive ? (
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                      ) : isUnlocked ? (
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl">
                          เลือกใช้
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-xl flex items-center space-x-1">
                          <Coins className="w-3 h-3" />
                          <span>{theme.cost} ฿</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: PIG DEX / BREEDS COLLECTION ================= */}
      {showPigDexModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-300 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-950 font-mono flex items-center space-x-2">
                  <span>📖</span>
                  <span>สมุดรวบรวมสายพันธุ์หมู (Pig Dex)</span>
                </h3>
                <p className="text-[11px] text-amber-800 font-bold">
                  สะสมสายพันธุ์หมูครบ 8 สายพันธุ์ เพื่อเป็นสุดยอดเกษตรกร อปท.
                </p>
              </div>
              <button
                onClick={() => setShowPigDexModal(false)}
                className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {Object.values(PIG_BREEDS).map((breed) => {
                const isUnlocked = unlockedBreeds.includes(breed.id);

                return (
                  <div
                    key={breed.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center space-x-3 ${
                      isUnlocked
                        ? 'bg-white border-amber-300 shadow-sm'
                        : 'bg-slate-100/90 border-slate-300 opacity-75'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: breed.primaryColor }}
                      className="w-12 h-12 rounded-2xl border-2 border-black/20 flex items-center justify-center text-2xl shadow-inner shrink-0"
                    >
                      {isUnlocked ? '🐷' : '🔒'}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900">{breed.name}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${breed.badgeColor}`}>
                          {breed.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-2">
                        {breed.description}
                      </p>
                      <div className="text-[9px] font-bold mt-1 text-amber-800">
                        {isUnlocked ? (
                          <span className="text-emerald-700">✅ ปลดล็อกแล้ว (ราคาขาย {breed.pricePerKg} ฿/kg)</span>
                        ) : (
                          <span className="text-rose-700">🔒 ปลดล็อก: {breed.unlockDesc}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: LUXURY CARNIVAL LUCKY WHEEL (วงล้อหมูพารวย) ================= */}
      {showWheelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-gradient-to-b from-[#2b180d] via-[#451a03] to-[#200e05] border-4 border-amber-400 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-3.5 text-center animate-in zoom-in-95 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-700/80 pb-2.5">
              <div className="text-left">
                <h3 className="text-lg font-black text-amber-300 font-mono flex items-center space-x-1.5">
                  <span className="text-xl">🎡</span>
                  <span>วงล้อหมูพารวย</span>
                  <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ml-1">
                    LUCKY WHEEL
                  </span>
                </h3>
                <p className="text-[11px] text-amber-200/90">
                  สิทธิ์หมุนฟรี: <b className="text-yellow-400 font-mono text-xs">{wheelSpinsToday}</b> รอบ (รอบต่อไป 50 🪙)
                </p>
              </div>
              <button
                onClick={() => !isSpinning && setShowWheelModal(false)}
                disabled={isSpinning}
                className="p-1.5 rounded-full hover:bg-amber-900/80 text-amber-300 cursor-pointer disabled:opacity-30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rotating Wheel Viewport with Golden Frame and 16 LED Bulbs */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-1 flex items-center justify-center select-none">
              {/* Outer Golden Glow */}
              <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />

              {/* 3D Ticker Arrow Pointer at Top (12 o'clock) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] pointer-events-none">
                <div
                  className={`w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-rose-600 transition-transform ${
                    isSpinning ? 'animate-bounce' : ''
                  }`}
                  style={{ filter: 'drop-shadow(0 2px 2px rgba(251,191,36,0.8))' }}
                />
              </div>

              {/* Wheel Outer Rim with 16 Golden LED Bulb Studs */}
              <div className="absolute inset-0 rounded-full border-8 border-gradient-to-b from-yellow-300 via-amber-500 to-amber-700 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.6)] pointer-events-none z-20 flex items-center justify-center">
                {Array.from({ length: 16 }).map((_, i) => {
                  const ang = (i * 360) / 16 * (Math.PI / 180);
                  const cx = 50 + 46 * Math.cos(ang);
                  const cy = 50 + 46 * Math.sin(ang);
                  return (
                    <div
                      key={i}
                      style={{ left: `${cx}%`, top: `${cy}%` }}
                      className="absolute w-2.5 h-2.5 rounded-full bg-yellow-200 border border-amber-800 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_6px_rgba(254,240,138,0.9)] animate-pulse"
                    />
                  );
                })}
              </div>

              {/* Rotating Wheel Canvas */}
              <div
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning ? 'transform 3.6s cubic-bezier(0.12, 0.8, 0.2, 1)' : 'none'
                }}
                className="w-68 h-68 sm:w-76 sm:h-76 rounded-full overflow-hidden relative shadow-inner"
              >
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  <defs>
                    <radialGradient id="hubGrad" cx="40%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="45%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#78350f" />
                    </radialGradient>
                  </defs>

                  {/* 8 Slices */}
                  {WHEEL_PRIZES.map((prize, idx) => {
                    const count = WHEEL_PRIZES.length;
                    const angle = 360 / count;
                    const startAngle = idx * angle - 90;
                    const endAngle = (idx + 1) * angle - 90;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const r = 148;
                    const x1 = 150 + r * Math.cos(startRad);
                    const y1 = 150 + r * Math.sin(startRad);
                    const x2 = 150 + r * Math.cos(endRad);
                    const y2 = 150 + r * Math.sin(endRad);
                    const midAngle = (startAngle + endAngle) / 2;

                    return (
                      <g key={prize.id}>
                        {/* Slice background */}
                        <path
                          d={`M150,150 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                          fill={prize.color}
                          stroke="#2b180d"
                          strokeWidth="2"
                        />
                        {/* Golden spoke line */}
                        <line x1="150" y1="150" x2={x1} y2={y1} stroke="#fde047" strokeWidth="2.2" opacity="0.8" />
                        {/* Golden rim peg */}
                        <circle cx={x1} cy={y1} r="3.5" fill="#fef08a" stroke="#78350f" strokeWidth="1" />

                        {/* Slice Content (Oriented radially towards center) */}
                        <g transform={`rotate(${midAngle + 90}, 150, 150)`}>
                          {/* Large Icon */}
                          <text
                            x="150"
                            y="44"
                            fontSize="24"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="select-none"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
                          >
                            {prize.icon}
                          </text>

                          {/* Bold, Clear, Crisp Prize Label */}
                          <text
                            x="150"
                            y="75"
                            fontSize="11.5"
                            fontWeight="900"
                            fill={prize.textColor}
                            textAnchor="middle"
                            dominantBaseline="central"
                            stroke="#1a0802"
                            strokeWidth="2.5"
                            paintOrder="stroke fill"
                            className="font-mono tracking-tight select-none"
                          >
                            {prize.shortLabel}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* 3D Center Hub Spin Button */}
              <div
                onClick={handleSpinWheel}
                className="absolute w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center z-25 cursor-pointer active:scale-95 hover:scale-105 transition-transform"
                title="กดเพื่อหมุนวงล้อ!"
              >
                <span className="text-xl leading-none">🐷</span>
                <span className="text-[10px] font-black text-amber-950 font-mono tracking-tight uppercase mt-0.5">
                  SPIN!
                </span>
              </div>
            </div>

            {/* Prize Summary Legend Grid */}
            <div className="bg-amber-950/70 p-2.5 rounded-2xl border border-amber-700/80">
              <span className="text-[10px] text-amber-300 font-bold block mb-1.5 text-left">
                🎁 รางวัลทั้งหมดในวงล้อ:
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold">
                {WHEEL_PRIZES.map((p) => (
                  <div
                    key={p.id}
                    className="bg-black/30 border border-amber-600/50 rounded-xl p-1 flex items-center justify-center space-x-1 text-amber-100"
                  >
                    <span>{p.icon}</span>
                    <span className="text-[9px] font-mono">{p.shortLabel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spin CTA Button */}
            <div className="pt-1">
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning || (wheelSpinsToday <= 0 && coins < 50)}
                className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  isSpinning
                    ? 'bg-amber-800 text-amber-200 cursor-wait'
                    : wheelSpinsToday > 0
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-amber-950 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none animate-pulse'
                    : coins >= 50
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-[0_4px_0_#4338ca] active:translate-y-1 active:shadow-none'
                    : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>🎡</span>
                <span>
                  {isSpinning
                    ? 'กำลังหมุนลุ้นรางวัล...'
                    : wheelSpinsToday > 0
                    ? `หมุนวงล้อทันที (ฟรี ${wheelSpinsToday} รอบ)`
                    : coins >= 50
                    ? 'หมุนเพิ่ม (ใช้ 50 🪙)'
                    : 'เหรียญไม่พอหมุน (ต้องการ 50 🪙)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: BARN CAPACITY UPGRADE ================= */}
      {showBarnUpgradeModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] border-4 border-amber-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <button
              onClick={() => setShowBarnUpgradeModal(false)}
              className="absolute top-4 right-4 p-1.5 bg-amber-900/10 hover:bg-amber-900/20 rounded-full text-amber-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md border-2 border-amber-300">
                🏠
              </div>
              <h3 className="text-xl font-black text-amber-950 font-mono">ขยายขนาดคอกฟาร์มหมู</h3>
              <p className="text-xs text-amber-800">
                อัปเกรดเพื่อเพิ่มความจุคอก เลี้ยงหมูได้มากขึ้น และก้าวสู่สุดยอดฟาร์มพันล้าน
              </p>
            </div>

            {/* Current vs Next Tier */}
            {(() => {
              const currentTier = BARN_CAPACITY_TIERS.find((t) => t.tier === barnCapacityTier) || BARN_CAPACITY_TIERS[0];
              const nextTier = BARN_CAPACITY_TIERS.find((t) => t.tier === barnCapacityTier + 1);

              if (!nextTier) {
                return (
                  <div className="bg-amber-100 border border-amber-400 p-4 rounded-2xl text-center space-y-2">
                    <span className="text-3xl">👑</span>
                    <h4 className="font-black text-amber-950 text-sm">คอกหมูระดับสูงสุดในตำนาน!</h4>
                    <p className="text-xs text-amber-800 font-medium">
                      คอกของคุณได้รับการอัปเกรดถึงระดับสูงสุดแล้ว รองรับหมูได้มากถึง {currentTier.capacity} ตัว
                    </p>
                  </div>
                );
              }

              const isLevelMet = farmLevel >= nextTier.reqLevel;
              const isCostMet = coins >= nextTier.cost;
              const canUpgrade = isLevelMet && isCostMet;

              return (
                <div className="space-y-3">
                  <div className="bg-white/90 p-4 rounded-2xl border-2 border-amber-300 shadow-inner flex items-center justify-between">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">ระดับปัจจุบัน</span>
                      <div className="text-lg font-black text-slate-800 font-mono">จุได้ {currentTier.capacity} ตัว</div>
                      <span className="text-[10px] text-amber-700 font-bold">{currentTier.title}</span>
                    </div>
                    <div className="text-amber-500 font-black text-2xl">➔</div>
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">ระดับถัดไป</span>
                      <div className="text-lg font-black text-emerald-600 font-mono">จุได้ {nextTier.capacity} ตัว</div>
                      <span className="text-[10px] text-emerald-700 font-bold">+{nextTier.capacity - currentTier.capacity} ตัว</span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-2 text-xs">
                    <span className="font-black text-amber-900 block text-[11px]">เงื่อนไขในการอัปเกรด:</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">⭐ ฟาร์มเลเวลที่ต้องการ:</span>
                      <span className={`font-black font-mono ${isLevelMet ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isLevelMet ? '✓' : '✗'} Lv.{nextTier.reqLevel} (ปัจจุบัน Lv.{farmLevel})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">🪙 ค่าก่อสร้างขยายคอก:</span>
                      <span className={`font-black font-mono ${isCostMet ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isCostMet ? '✓' : '✗'} {nextTier.cost.toLocaleString()} ฿ (มี {coins.toLocaleString()} ฿)
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => {
                      if (!canUpgrade) return;
                      setCoins((c) => c - nextTier.cost);
                      setBarnCapacityTier((t) => t + 1);
                      addExp(80);
                      playSound('fanfare', isMuted);
                      setShowBarnUpgradeModal(false);
                      setCelebrationReward({
                        title: '🏠 ขยายคอกหมูสำเร็จ!',
                        badge: 'BARN UPGRADED!',
                        subtitle: `อัปเกรดเป็น ${nextTier.title}`,
                        rewardText: `ความจุใหม่: ${nextTier.capacity} ตัว & +80 EXP`,
                        icon: '🔨',
                        color: 'from-amber-500 to-orange-600'
                      });
                    }}
                    disabled={!canUpgrade}
                    className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-all ${
                      canUpgrade
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-[0_4px_0_#065f46] active:translate-y-0.5 active:shadow-none'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>
                      {canUpgrade
                        ? `ยืนยันอัปเกรดขยายคอก (${nextTier.cost.toLocaleString()} ฿)`
                        : !isLevelMet
                        ? `ต้องการฟาร์มเลเวล Lv.${nextTier.reqLevel}`
                        : `เหรียญทองไม่เพียงพอ (${nextTier.cost.toLocaleString()} ฿)`}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= REWARD CELEBRATION MODAL (HIGH-IMPACT VISUAL POPUP) ================= */}
      {celebrationReward && (
        <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Animated Sunburst Golden Rays in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30">
            <div
              className="w-[900px] h-[900px] rounded-full bg-[repeating-conic-gradient(from_0deg,#f59e0b_0deg_15deg,transparent_15deg_30deg)] animate-spin"
              style={{ animationDuration: '20s' }}
            />
          </div>

          {/* Floating Confetti / Sparkle Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {['✨', '⭐', '🎉', '🪙', '🌟', '🎊', '✨', '⭐'].map((emoji, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-bounce"
                style={{
                  left: `${10 + i * 11}%`,
                  top: `${14 + (i % 3) * 18}%`,
                  animationDuration: `${1.4 + (i % 3) * 0.4}s`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Celebration Card */}
          <div className="relative z-10 bg-gradient-to-b from-[#2b180d] via-[#451a03] to-[#200e05] border-4 border-yellow-400 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-[0_0_50px_rgba(251,191,36,0.65)] text-center space-y-4 animate-in zoom-in-90 duration-300">
            {/* Top Badge */}
            <div className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {celebrationReward.badge || 'REWARD UNLOCKED'}
            </div>

            {/* Glowing Icon in Pulsing Golden Ring */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-yellow-400/25 animate-ping" />
              <div className="w-22 h-22 rounded-full bg-gradient-to-b from-yellow-300 to-amber-600 border-4 border-yellow-200 shadow-2xl flex items-center justify-center text-5xl">
                {celebrationReward.icon}
              </div>
            </div>

            {/* Titles */}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-amber-300 font-mono tracking-tight drop-shadow-md">
                {celebrationReward.title}
              </h3>
              <p className="text-xs text-amber-100/90 font-medium">
                {celebrationReward.subtitle}
              </p>
            </div>

            {/* Reward Highlight Box */}
            <div className="bg-amber-950/80 border-2 border-yellow-500/80 rounded-2xl p-4 shadow-inner">
              <span className="text-[10px] text-amber-300/80 uppercase tracking-wider font-bold block mb-1">
                ของรางวัลที่ได้รับ
              </span>
              <div className="text-xl font-black text-yellow-300 font-mono flex items-center justify-center space-x-2">
                <span>{celebrationReward.rewardText}</span>
              </div>
              <p className="text-[10px] text-emerald-300 font-bold mt-1">
                ✓ บันทึกเข้าคลังและบัญชีฟาร์มเรียบร้อยแล้ว
              </p>
            </div>

            {/* Claim / Dismiss Button */}
            <div className="pt-2">
              <button
                onClick={() => setCelebrationReward(null)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl font-black text-sm border-2 border-emerald-300 shadow-[0_5px_0_#065f46] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center space-x-2 animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>รับรางวัลเข้าคลัง 🎁</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
