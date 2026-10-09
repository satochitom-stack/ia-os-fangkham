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
  Smile
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
  } catch (e) {
    // AudioContext blocked
  }
};

// 8 Distinct Pig Breeds
const PIG_BREEDS = {
  pink: {
    id: 'pink',
    name: 'หมูชมพูพันธุ์พื้นเมือง',
    tag: 'ธรรมดา',
    rarity: 'Common',
    color: '#f472b6',
    bellyColor: '#fbcfe8',
    earColor: '#ec4899',
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
    color: '#60a5fa',
    bellyColor: '#bfdbfe',
    earColor: '#3b82f6',
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
    color: '#fbbf24',
    bellyColor: '#fef08a',
    earColor: '#f59e0b',
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
    color: '#f9a8d4',
    bellyColor: '#fdf2f8',
    earColor: '#f472b6',
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
    color: '#fb923c',
    bellyColor: '#ffedd5',
    earColor: '#ea580c',
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
    color: '#eab308',
    bellyColor: '#fef08a',
    earColor: '#ca8a04',
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
    color: '#c084fc',
    bellyColor: '#f5d0fe',
    earColor: '#a855f7',
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
    color: '#38bdf8',
    bellyColor: '#e0f2fe',
    earColor: '#0284c7',
    maxWeight: 310,
    pricePerKg: 200,
    buyCost: 2500,
    description: 'สวมเกราะอัศวินสีทอง มีปีกเทวดาสีขาว ส่องแสงประกาย ป้องกันโจรขโมยหมู 100%',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-400',
    accessory: 'wings',
    unlockDesc: 'ล็อกอินสะสมครบ 7 วัน หรือมีเหรียญสะสมครบ 1,500 เหรียญ'
  }
};

// 6 Barn Themes
const BARN_THEMES = {
  cozy_wood: {
    id: 'cozy_wood',
    name: 'คอกไม้ชนบทแสนอบอุ่น',
    tag: 'คลาสสิก',
    icon: '🪵',
    bgClass: 'bg-gradient-to-b from-[#8b5a2b] via-[#75441e] to-[#552c0f]',
    floorPattern: 'bg-[radial-gradient(#451a03_1px,transparent_1px)] [background-size:20px_20px] opacity-40',
    fenceBorder: 'border-amber-950',
    fenceHeader: '🪵 รั้วไม้สักทอง อปท.',
    troughText: '🥣 รางอาหารไม้คลาสสิก',
    hayText: '🌾 กองฟางสีทองอุ่น',
    perk: 'ธีมมาตรฐาน อบอุ่น สบายตา',
    cost: 0,
    unlockedByDefault: true
  },
  pasture: {
    id: 'pasture',
    name: 'ทุ่งหญ้าธรรมชาติเขียวขจี',
    tag: 'ธรรมชาติ',
    icon: '🌿',
    bgClass: 'bg-gradient-to-b from-emerald-500 via-green-600 to-emerald-800',
    floorPattern: 'bg-[radial-gradient(#14532d_1px,transparent_1px)] [background-size:16px_16px] opacity-50',
    fenceBorder: 'border-emerald-950',
    fenceHeader: '🌿 รั้วพุ่มไม้ดอกธรรมชาติ',
    troughText: '🥣 รางหินศิลาแลง',
    hayText: '🌻 แปลงดอกทานตะวัน',
    perk: 'หมูอารมณ์ดี วิ่งเล่นร่าเริง',
    cost: 0,
    unlockedByDefault: true
  },
  onsen_mud: {
    id: 'onsen_mud',
    name: 'สปาออนเซ็นโคลนเพื่อสุขภาพ',
    tag: 'รีแลกซ์',
    icon: '♨️',
    bgClass: 'bg-gradient-to-b from-stone-700 via-stone-800 to-neutral-900',
    floorPattern: 'bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:24px_24px] opacity-60',
    fenceBorder: 'border-stone-900',
    fenceHeader: '♨️ รั้วหินออนเซ็นธรรมชาติ',
    troughText: '🥣 รางน้ำแร่สมุนไพร',
    hayText: '🎋 สวนไผ่ญี่ปุ่นอบอุ่น',
    perk: 'ความสะอาดลดช้าลง 50%',
    cost: 400,
    unlockDesc: 'อาบน้ำหมูสะสมครบ 8 ครั้ง หรือใช้ 400 เหรียญ'
  },
  lanna: {
    id: 'lanna',
    name: 'คอกไม้สักล้านนา อปท.',
    tag: 'วัฒนธรรม',
    icon: '🏮',
    bgClass: 'bg-gradient-to-b from-amber-700 via-amber-900 to-stone-900',
    floorPattern: 'bg-[radial-gradient(#451a03_1px,transparent_1px)] [background-size:18px_18px] opacity-50',
    fenceBorder: 'border-yellow-950',
    fenceHeader: '🏮 เฮือนไม้สักแป้นเกล็ดล้านนา',
    troughText: '🥣 ขันโตกอาหารมงคล',
    hayText: '🪷 ดอกสารภี & ตุงล้านนา',
    perk: 'หมูเติบโตไวกว่าปกติ 20%',
    cost: 600,
    unlockDesc: 'มีหมูน้ำหนัก 90 kg ขึ้นไป หรือใช้ 600 เหรียญ'
  },
  golden_palace: {
    id: 'golden_palace',
    name: 'คฤหาสน์หมูทองคำเศรษฐี',
    tag: 'ลักชัวรี่',
    icon: '👑',
    bgClass: 'bg-gradient-to-b from-amber-400 via-yellow-600 to-amber-900',
    floorPattern: 'bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:22px_22px] opacity-40',
    fenceBorder: 'border-amber-700',
    fenceHeader: '👑 คฤหาสน์รั้วทองคำ 24K',
    troughText: '🥣 รางอาหารชุบทองคำแท้',
    hayText: '💎 พรมกำมะหยี่สีแดง',
    perk: 'โบนัสราคาขายหมู +20%',
    cost: 1200,
    unlockDesc: 'ครอบครองหมูทองคำ หรือใช้ 1,200 เหรียญ'
  },
  cyber_space: {
    id: 'cyber_space',
    name: 'สถานีอวกาศหมูไซเบอร์',
    tag: 'ไซไฟ',
    icon: '🚀',
    bgClass: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950',
    floorPattern: 'bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-35',
    fenceBorder: 'border-cyan-800',
    fenceHeader: '🚀 สนามพลังบาเรียไฮเทค',
    troughText: '🥣 ตู้สังเคราะห์สารอาหารโฮโลแกรม',
    hayText: '🛸 แท่นชาร์จปฏิสสาร',
    perk: 'ป้องกันการถูกขโมยหมู 100% เสมอ',
    cost: 2000,
    unlockDesc: 'ผสมพันธุ์สำเร็จ 3 ครั้ง หรือใช้ 2,000 เหรียญ'
  }
};

const FOODS = [
  { id: 'bran', name: 'รำข้าวผสมผักบุ้ง', cost: 10, weightGain: 4, fullness: 20, icon: '🌾' },
  { id: 'corn', name: 'ข้าวโพดหวานคัดเกรด', cost: 25, weightGain: 10, fullness: 45, icon: '🌽' },
  { id: 'carrot', name: 'แครอททองคำบำรุงตับ', cost: 60, weightGain: 25, fullness: 80, icon: '🥕' },
  { id: 'pumpkin', name: 'ฟักทองยักษ์โภชนาการสูง', cost: 100, weightGain: 40, fullness: 95, icon: '🎃' }
];

// Seed crops for the Farm Patch
const CROPS_META = {
  bran: { id: 'bran', name: 'ต้นข้าว/รำข้าว', icon: '🌾', duration: 15, seedCost: 5, yieldCount: 2, foodId: 'bran' },
  corn: { id: 'corn', name: 'ข้าวโพดหวาน', icon: '🌽', duration: 25, seedCost: 15, yieldCount: 2, foodId: 'corn' },
  carrot: { id: 'carrot', name: 'แครอททองคำ', icon: '🥕', duration: 40, seedCost: 35, yieldCount: 2, foodId: 'carrot' },
  pumpkin: { id: 'pumpkin', name: 'ฟักทองยักษ์', icon: '🎃', duration: 60, seedCost: 55, yieldCount: 1, foodId: 'pumpkin' }
};

// 7-Day Login Rewards Schedule
const DAILY_REWARDS = [
  { day: 1, title: 'เงินทุนขวัญถุง', rewardDesc: '+100 เหรียญทอง', icon: '💰', coins: 100 },
  { day: 2, title: 'เมล็ดข้าวโพดหวาน', rewardDesc: 'ข้าวโพด 3 ถุง (+50 เหรียญ)', icon: '🌽', coins: 50 },
  { day: 3, title: 'หมูซากุระพิเศษ!', rewardDesc: 'ปลดล็อกหมูซากุระ + 150 เหรียญ', icon: '🌸', coins: 150, unlockBreed: 'sakura' },
  { day: 4, title: 'แครอททองคำ', rewardDesc: 'แครอท 3 ถุง (+100 เหรียญ)', icon: '🥕', coins: 100 },
  { day: 5, title: 'ฟักทองบำรุงตับ', rewardDesc: 'ฟักทอง 2 ลูก (+200 เหรียญ)', icon: '🎃', coins: 200 },
  { day: 6, title: 'ธีมคอกหมูฟรี', rewardDesc: 'ปลดล็อกธีมคอกฟรี 1 ธีม (+250 เหรียญ)', icon: '🪵', coins: 250, unlockTheme: 'onsen_mud' },
  { day: 7, title: 'หมูพัสดุทองคำแท้!', rewardDesc: 'รับลูกหมูทองคำ 1 ตัว + 500 เหรียญ', icon: '👑', coins: 500, grantPig: 'golden' }
];

// 4 Simulated Neighbor Farms in the Local Government
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

export default function HappyHogView() {
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
        weight: 32,
        hunger: 40,
        cleanliness: 70,
        health: 100,
        x: 32,
        y: 45,
        direction: 1
      },
      {
        id: 2,
        name: 'ผู้ช่วยตรวจเอก',
        breed: 'auditor',
        weight: 52,
        hunger: 80,
        cleanliness: 35,
        health: 100,
        x: 65,
        y: 55,
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
    return localStorage.getItem('happy_hog_active_theme') || 'cozy_wood';
  });

  // Unlocked Themes Set
  const [unlockedThemes, setUnlockedThemes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('happy_hog_unlocked_themes') || '["cozy_wood", "pasture"]');
    } catch {
      return ['cozy_wood', 'pasture'];
    }
  });

  // Unlocked Pig Breeds Set
  const [unlockedBreeds, setUnlockedBreeds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('happy_hog_unlocked_breeds') || '["pink"]');
    } catch {
      return ['pink'];
    }
  });

  // Farm Statistics for Unlocking
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

  // Crop Plots (4 plots)
  const [crops, setCrops] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('happy_hog_crops') || '[]');
    } catch {
      return [
        { id: 0, seed: 'corn', plantedAt: Date.now() - 15000, duration: 25 },
        { id: 1, seed: 'carrot', plantedAt: Date.now() - 25000, duration: 40 },
        { id: 2, seed: null, plantedAt: null, duration: 0 },
        { id: 3, seed: null, plantedAt: null, duration: 0 }
      ];
    }
  });

  // Crop Inventory (Harvested produce to feed pigs for free!)
  const [cropInventory, setCropInventory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('happy_hog_crop_inv') || '{"bran":3,"corn":2,"carrot":1,"pumpkin":0}');
    } catch {
      return { bran: 3, corn: 2, carrot: 1, pumpkin: 0 };
    }
  });

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

  // Timer loop for crop growth and energy regeneration
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
      setEnergy((e) => Math.min(100, e + 1));
    }, 1000);
    return () => clearInterval(timer);
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
  }, [coins, energy, pigs, isLocked, activeThemeId, unlockedThemes, unlockedBreeds, stats, crops, cropInventory, loginData, neighbors]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Evaluate & Unlock Breeds automatically based on conditions
  useEffect(() => {
    const toUnlock = [...unlockedBreeds];
    let changed = false;

    // 1. Auditor: Any pig >= 60kg
    if (!toUnlock.includes('auditor') && pigs.some((p) => p.weight >= 60)) {
      toUnlock.push('auditor');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ใหม่: "หมูผู้ตรวจสอบ ปค.5" แล้ว!');
    }
    // 2. Engineer: Coins >= 300
    if (!toUnlock.includes('engineer') && coins >= 300) {
      toUnlock.push('engineer');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ใหม่: "หมูช่างตรวจงาน Factor F" แล้ว!');
    }
    // 3. Shabu: Feed count >= 12
    if (!toUnlock.includes('shabu') && stats.feedCount >= 12) {
      toUnlock.push('shabu');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ใหม่: "หมูชาบูกระทะทอง" แล้ว!');
    }
    // 4. Golden: Sold count >= 3
    if (!toUnlock.includes('golden') && stats.soldCount >= 3) {
      toUnlock.push('golden');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ใหม่: "หมูพัสดุทองคำแท้" แล้ว!');
    }
    // 5. Rainbow: Breed count >= 3
    if (!toUnlock.includes('rainbow') && stats.breedCount >= 3) {
      toUnlock.push('rainbow');
      changed = true;
      showToast('🎉 ปลดล็อกสายพันธุ์ในตำนาน: "หมูสายรุ้ง สตง. ผ่านฉลุย" แล้ว!');
    }
    // 6. Knight: Login streak >= 7 or coins >= 1500
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

  // Ambient wandering loop for pigs inside the pen
  useEffect(() => {
    const interval = setInterval(() => {
      setPigs((prevPigs) =>
        prevPigs.map((p) => {
          if (Math.random() < 0.45) {
            const nextX = Math.max(18, Math.min(82, p.x + (Math.random() * 24 - 12)));
            const nextY = Math.max(25, Math.min(76, p.y + (Math.random() * 16 - 8)));
            return {
              ...p,
              x: nextX,
              y: nextY,
              direction: nextX >= p.x ? 1 : -1,
              hunger: Math.max(0, p.hunger - 0.25),
              cleanliness: Math.max(0, p.cleanliness - (activeThemeId === 'onsen_mud' ? 0.08 : 0.18))
            };
          }
          return p;
        })
      );
    }, 2400);

    return () => clearInterval(interval);
  }, [activeThemeId]);

  const selectedPig = pigs.find((p) => p.id === selectedPigId) || pigs[0];
  const activeTheme = BARN_THEMES[activeThemeId] || BARN_THEMES.cozy_wood;

  // Determine what Need bubble a pig should show
  const getPigNeed = (pig) => {
    if (pig.hunger < 45) return { type: 'feed', icon: '🥣', label: 'หิวข้าว', hint: 'แตะเพื่อให้อาหารทันที' };
    if (pig.cleanliness < 45) return { type: 'bath', icon: '🧼', label: 'ตัวเหม็น', hint: 'แตะเพื่ออาบน้ำขัดตัว' };
    if (pig.health < 60) return { type: 'heal', icon: '💉', label: 'ไม่สบาย', hint: 'แตะเพื่อฉีดยารักษา' };
    if (pig.weight >= 60 && pig.hunger >= 80 && pig.cleanliness >= 80) {
      return { type: 'love', icon: '💖', label: 'พร้อมผสมพันธุ์', hint: 'แตะเพื่อไปห้องแล็บวิจัย' };
    }
    return { type: 'happy', icon: '✨', label: 'อารมณ์ดี', hint: 'แตะเพื่อลูบหัว' };
  };

  // Quick Action triggered directly from tapping a Pig's Speech Bubble!
  const handleBubbleClick = (e, pig, need) => {
    e.stopPropagation();
    setSelectedPigId(pig.id);

    if (need.type === 'feed') {
      // Check if we have harvested crop feed first (free feed!)
      if (cropInventory.corn > 0) {
        setCropInventory((inv) => ({ ...inv, corn: inv.corn - 1 }));
        handleDirectFeed(pig, { name: 'ข้าวโพดสดจากแปลง', weightGain: 12, fullness: 50 });
        showToast(`🌽 ให้น้องกินข้าวโพดสดจากแปลงผักฟรี! (+12 kg)`);
      } else if (cropInventory.bran > 0) {
        setCropInventory((inv) => ({ ...inv, bran: inv.bran - 1 }));
        handleDirectFeed(pig, { name: 'รำข้าวจากแปลง', weightGain: 5, fullness: 25 });
        showToast(`🌾 ให้น้องกินรำข้าวจากแปลงผักฟรี! (+5 kg)`);
      } else {
        // Buy basic feed with coins
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
      // Pet pig
      playSound('oink', isMuted);
      setHearts((h) => [...h, { id: Date.now(), x: pig.x, y: pig.y - 12 }]);
      setTimeout(() => setHearts((h) => h.slice(1)), 1200);
      showToast(`💖 ลูบหัว ${pig.name} น้องส่งเสียงร้องอู๊ดๆ อย่างมีความสุข!`);
    }
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
    setHearts((h) => [...h, { id: Date.now(), x: targetPig.x, y: targetPig.y - 12 }]);
    setTimeout(() => setHearts((h) => h.slice(1)), 1200);
  };

  // Actions
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

    const newBubbles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: selectedPig.x + (Math.random() * 16 - 8),
      y: selectedPig.y - 10 + (Math.random() * 10 - 5)
    }));
    setBubbles(newBubbles);
    setTimeout(() => setBubbles([]), 1500);

    showToast('🧼 อาบน้ำขัดสีฉวีวรรณ ตัวหอมฟุ้ง 100%!');
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
    showToast('💉 ฉีดยาป้องกันโรคเรียบร้อย สุขภาพแข็งแรง 100%!');
  };

  const handleDrinkWater = () => {
    if (!selectedPig) return;
    playSound('bubble', isMuted);
    setPigs((prev) =>
      prev.map((p) => (p.id === selectedPig.id ? { ...p, health: Math.min(100, p.health + 20) } : p))
    );
    setHearts((h) => [...h, { id: Date.now(), x: selectedPig.x, y: selectedPig.y - 12 }]);
    setTimeout(() => setHearts((h) => h.slice(1)), 1200);
    showToast(`🚰 น้องดื่มน้ำจากก๊อกน้ำธรรมชาติ สดชื่นกระปรี้กระเปร่า!`);
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
    showToast(`💰 ขาย ${pig.name} (${pig.weight} kg) ได้รับ ${earnings.toLocaleString()} เหรียญ!`);
  };

  const handleBuyPiglet = (breedKey, cost) => {
    if (coins < cost) {
      showToast('❌ เหรียญไม่พอซื้อลูกหมูพันธุ์นี้!');
      return;
    }
    if (pigs.length >= 8) {
      showToast('⚠️ คอกหมูเต็มแล้ว! (รับได้สูงสุด 8 ตัว)');
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
    showToast(`🎉 ยินดีด้วย! ได้ต้อนรับลูกหมูใหม่: ${PIG_BREEDS[breedKey].name}`);
  };

  const handleBreed = () => {
    if (pigs.length < 2) {
      showToast('⚠️ ต้องมีหมูอย่างน้อย 2 ตัวในการผสมพันธุ์!');
      return;
    }
    if (pigs.length >= 8) {
      showToast('⚠️ คอกหมูเต็มแล้ว! (รับได้สูงสุด 8 ตัว)');
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

    setCoins((c) => c - 80);
    playSound('coin', isMuted);

    // Roll for rare breeds
    const roll = Math.random();
    let resultBreed = 'pink';
    if (roll > 0.92) resultBreed = 'knight';
    else if (roll > 0.8) resultBreed = 'rainbow';
    else if (roll > 0.65) resultBreed = 'golden';
    else if (roll > 0.5) resultBreed = 'shabu';
    else if (roll > 0.35) resultBreed = 'sakura';
    else if (roll > 0.2) resultBreed = 'engineer';
    else if (roll > 0.1) resultBreed = 'auditor';

    const baby = {
      id: Date.now(),
      name: `ลูกหมูพันธุกรรมเทพ (${PIG_BREEDS[resultBreed].tag})`,
      breed: resultBreed,
      weight: 15,
      hunger: 100,
      cleanliness: 100,
      health: 100,
      x: 50,
      y: 50,
      direction: 1
    };

    setPigs((prev) => [...prev, baby]);
    setSelectedPigId(baby.id);
    setStats((s) => ({ ...s, breedCount: s.breedCount + 1 }));

    if (!unlockedBreeds.includes(resultBreed)) {
      setUnlockedBreeds((prev) => [...prev, resultBreed]);
    }

    playSound('fanfare', isMuted);
    showToast(`✨ ลูกหมูเกิดแล้ว! พันธุ์: ${PIG_BREEDS[resultBreed].name}`);
  };

  // Crop Farming: Plant Seed
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

  // Crop Farming: Harvest
  const handleHarvestCrop = (plotId) => {
    const plot = crops.find((p) => p.id === plotId);
    if (!plot || !plot.seed) return;

    const meta = CROPS_META[plot.seed];
    playSound('coin', isMuted);

    // Add to inventory
    setCropInventory((inv) => ({
      ...inv,
      [meta.foodId]: (inv[meta.foodId] || 0) + meta.yieldCount
    }));

    // Reset plot
    setCrops((prev) =>
      prev.map((p) => (p.id === plotId ? { id: plotId, seed: null, plantedAt: null, duration: 0 } : p))
    );

    showToast(`🧺 เก็บเกี่ยว "${meta.name}" ได้ผลผลิต +${meta.yieldCount} ถุง เข้าคลังอาหารฟรี!`);
  };

  // Neighbor Stealing System
  const handleAttemptSteal = (neighbor) => {
    if (energy < 15) {
      showToast('⚡ พลังงานไม่พอสำหรับปฏิบัติการย่องเบา (ต้องการ 15 พลังงาน)');
      return;
    }
    if (pigs.length >= 8) {
      showToast('⚠️ คอกหมูของเราเต็มแล้ว (จุได้สูงสุด 8 ตัว) ต้องขายก่อนนะ!');
      return;
    }

    setEnergy((e) => Math.max(0, e - 15));

    // If neighbor locked fence
    if (neighbor.isLocked) {
      playSound('bark', isMuted);
      showToast(`🐶 สุนัขเฝ้าบ้านเห่ากรรโชก! รั้วล็อกแน่นหนา แอบเข้าไปไม่ได้ รีบหนีเร็วก่อนโดนจับ!`);
      return;
    }

    // Unlocked: 80% Success Chance!
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

  // Neighbor Helping (Friendship Food Help)
  const handleHelpNeighbor = (neighbor) => {
    if (energy < 10) {
      showToast('⚡ พลังงานไม่พอ (ต้องการ 10 พลังงาน)');
      return;
    }
    setEnergy((e) => Math.max(0, e - 10));
    setCoins((c) => c + 35);
    playSound('coin', isMuted);
    showToast(`🤝 ช่วยดูแลและให้อาหารหมูฟาร์ม ${neighbor.name} ได้รับเหรียญมิตรภาพ +35 🪙!`);
  };

  // Daily Login Claim
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
    showToast(`🎁 ยินดีด้วย! รับรางวัลวันที่ ${currentClaimDay}: ${reward.title} (${reward.rewardDesc}) สำเร็จ!`);
  };

  // Barn Theme Select
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
    <div className="p-2 sm:p-4 max-w-7xl mx-auto select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#2b180d]/95 text-amber-200 border-2 border-amber-500 shadow-2xl px-5 py-3 rounded-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Wood Plank Board Container - Piggy Town & Cardlings Aesthetic */}
      <div className="relative w-full rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden border-8 border-[#3b1d0a] bg-gradient-to-b from-[#8b5a2b] via-[#75441e] to-[#552c0f] flex flex-col justify-between space-y-4">
        {/* Subtle wood plank vertical grain texture lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:64px_100%] pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-black/50 pointer-events-none" />

        {/* TOP STATUS & HEADER BAR (Similar to Piggy Town Top Bar) */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-12 h-12 bg-gradient-to-b from-white via-slate-50 to-slate-200 hover:to-slate-300 rounded-2xl border-4 border-amber-500/80 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none flex items-center justify-center transition-all cursor-pointer group"
              title="เปิด-ปิดเสียง"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-slate-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-amber-600" />
              )}
            </button>

            <div>
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider text-amber-200 bg-amber-950/70 border border-amber-700/60 px-3 py-0.5 rounded-full w-fit">
                <span>🐷 PIGGY TOWN • แฮปปี้ฟาร์มหมูผู้ตรวจ</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-amber-100 font-mono mt-0.5 drop-shadow-md">
                คนเลี้ยงหมูรีเทิร์น อปท.
              </h1>
            </div>
          </div>

          {/* Stats Bar (Energy, Coins, Free Food Inventory) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Energy Bar (AP 100/100) */}
            <div className="bg-gradient-to-b from-white to-[#fef9c3] border-3 border-amber-700/80 shadow-[0_4px_0_#78350f] rounded-2xl px-3 py-1.5 flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="font-black text-slate-900 font-mono text-sm">{energy}/100</span>
            </div>

            {/* Coins Counter */}
            <div className="bg-gradient-to-b from-white to-[#fef9c3] border-3 border-amber-700/80 shadow-[0_4px_0_#78350f] rounded-2xl px-3 py-1.5 flex items-center space-x-1.5">
              <Coins className="w-4 h-4 text-amber-800" />
              <span className="font-black text-slate-900 font-mono text-sm">{coins.toLocaleString()}</span>
            </div>

            {/* Harvested Feed Counter */}
            <div
              onClick={() => setActiveTab('crops')}
              className="bg-amber-950/80 hover:bg-amber-900 border-2 border-amber-600 text-amber-200 rounded-2xl px-3 py-1.5 flex items-center space-x-2 text-xs font-bold cursor-pointer"
              title="คลังผลผลิตพืชผักจากแปลง"
            >
              <span>🌾 {cropInventory.bran || 0}</span>
              <span>🌽 {cropInventory.corn || 0}</span>
              <span>🥕 {cropInventory.carrot || 0}</span>
            </div>

            {/* Daily Login Button */}
            <button
              onClick={() => setShowDailyLoginModal(true)}
              className={`relative px-3 py-1.5 rounded-2xl font-black text-xs border-3 flex items-center space-x-1 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none cursor-pointer ${
                canClaimToday
                  ? 'bg-gradient-to-b from-amber-300 to-yellow-500 text-amber-950 border-amber-500 animate-pulse'
                  : 'bg-gradient-to-b from-white to-slate-200 text-slate-800 border-amber-500/80'
              }`}
            >
              {canClaimToday && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border border-white animate-ping" />
              )}
              <Gift className="w-3.5 h-3.5 text-amber-700" />
              <span>ของขวัญ</span>
            </button>

            {/* Visiting Neighbors Button */}
            <button
              onClick={() => setShowNeighborsModal(true)}
              className="px-3 py-1.5 bg-gradient-to-b from-teal-400 to-emerald-600 hover:from-teal-500 hover:to-emerald-700 text-white rounded-2xl font-black text-xs border-3 border-teal-300 shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none flex items-center space-x-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>เยี่ยมเพื่อน อบต.</span>
            </button>

            {/* Fence Lock Button */}
            <button
              onClick={() => {
                setIsLocked(!isLocked);
                playSound('feed', isMuted);
                showToast(isLocked ? '🔓 ปลดล็อกรั้วคอกแล้ว ระวังเพื่อนแอบย่องมาอุ้ม!' : '🔒 ล็อกรั้วคอกแน่นหนาแล้ว ป้องกันการขโมย 100%');
              }}
              className={`px-3 py-1.5 rounded-2xl font-black text-xs border-3 flex items-center space-x-1 shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none cursor-pointer transition-all ${
                isLocked || activeThemeId === 'cyber_space'
                  ? 'bg-gradient-to-b from-emerald-400 to-teal-600 text-white border-emerald-500'
                  : 'bg-gradient-to-b from-rose-400 to-red-600 text-white border-rose-500 shadow-[0_4px_0_#991b1b]'
              }`}
            >
              {isLocked || activeThemeId === 'cyber_space' ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
              <span>{isLocked || activeThemeId === 'cyber_space' ? 'ล็อกคอกแล้ว' : 'ยังไม่ล็อก'}</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="relative z-10 flex space-x-2 bg-amber-950/60 p-1.5 rounded-2xl border border-amber-800/80 w-fit">
          <button
            onClick={() => setActiveTab('farm')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'farm'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md scale-102'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <span>🐷 หน้าฟาร์มหมู ({pigs.length}/8)</span>
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

        {/* ================= TAB 1: MAIN FARM PEN (PIGGY TOWN + CLASSIC HAPPY PIG) ================= */}
        {activeTab === 'farm' && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Pig Pen Canvas */}
            <div className="lg:col-span-2 space-y-3">
              <div
                className={`relative w-full h-[470px] rounded-3xl overflow-hidden border-4 ${activeTheme.fenceBorder} shadow-2xl ${activeTheme.bgClass} select-none`}
              >
                {/* Floor Texture Overlay */}
                <div className={`absolute inset-0 ${activeTheme.floorPattern} pointer-events-none`} />

                {/* 1. Classic Water Tap Station on Left (เหมือนในรูปเกมเก่าที่มีก๊อกน้ำและรางรองน้ำ) */}
                <div
                  onClick={handleDrinkWater}
                  className="absolute bottom-16 left-4 z-20 flex flex-col items-center cursor-pointer group"
                  title="ก๊อกน้ำดื่มธรรมชาติ (คลิกเพื่อให้น้องหมูได้ดื่มน้ำสดชื่น)"
                >
                  <div className="bg-amber-800/90 text-amber-200 border-2 border-amber-950 p-2 rounded-2xl shadow-lg flex items-center space-x-1 text-xs group-hover:scale-105 transition-transform">
                    <span className="text-xl">🚰</span>
                    <div className="text-[10px] font-black leading-tight">
                      <div>ก๊อกน้ำธรรมชาติ</div>
                      <span className="text-cyan-300 font-mono">แตะดื่มน้ำ</span>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-cyan-600/40 border-2 border-cyan-400 rounded-full mt-1 blur-[0.5px] animate-pulse" />
                </div>

                {/* 2. Cozy Farm Barn House on Top-Left (เหมือนในรูปทั้ง 2 เกม) */}
                <div className="absolute top-12 left-4 z-10 bg-amber-950/70 border-2 border-amber-800 text-amber-100 p-2.5 rounded-2xl backdrop-blur-xs flex items-center space-x-2 text-xs shadow-md">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <div className="font-black text-amber-200 text-[11px]">โรงเรือนคอกฟาร์ม</div>
                    <span className="text-[9px] text-emerald-300">ความจุ: {pigs.length}/8 ตัว</span>
                  </div>
                </div>

                {/* 3. Cooking Cauldron / Feed Mixer Station (เหมือนใน Piggy Town) */}
                <div
                  onClick={() => setActiveTab('crops')}
                  className="absolute top-12 right-4 z-10 bg-amber-950/70 hover:bg-amber-900 border-2 border-amber-800 text-amber-100 p-2.5 rounded-2xl backdrop-blur-xs flex items-center space-x-2 text-xs shadow-md cursor-pointer transition-transform hover:scale-103"
                  title="หม้อต้มอาหารและผสมวัตถุดิบ (คลิกเพื่อดูแปลงผัก)"
                >
                  <span className="text-2xl">🍲</span>
                  <div>
                    <div className="font-black text-amber-200 text-[11px]">หม้อต้มผสมอาหาร</div>
                    <span className="text-[9px] text-amber-400">จากแปลงปลูกผัก 🌾</span>
                  </div>
                </div>

                {/* Wooden Fence Header */}
                <div className="absolute top-0 left-0 right-0 h-9 bg-black/40 backdrop-blur-xs border-b border-black/30 flex items-center justify-between px-4 z-20 text-xs">
                  <span className="text-amber-200 font-mono font-bold flex items-center space-x-1.5 text-[11px]">
                    <span>{activeTheme.icon}</span>
                    <span>{activeTheme.fenceHeader}</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowThemeModal(true)}
                      className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full font-bold cursor-pointer"
                    >
                      🎨 เปลี่ยนธีม
                    </button>
                    <button
                      onClick={() => setShowPigDexModal(true)}
                      className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full font-bold cursor-pointer"
                    >
                      📖 สมุดพันธุ์หมู
                    </button>
                  </div>
                </div>

                {/* Food Trough in bottom center */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-950/80 text-amber-100 rounded-2xl border-2 border-amber-800 shadow-md flex items-center space-x-2 text-xs">
                  <span>🥣 รางอาหารกลาง</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.2 rounded-full font-bold">พร้อมกิน</span>
                </div>

                {/* Floating Hearts */}
                {hearts.map((h) => (
                  <div
                    key={h.id}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    className="absolute pointer-events-none text-3xl animate-bounce z-40 drop-shadow-md"
                  >
                    💖
                  </div>
                ))}

                {/* Floating Bubbles */}
                {bubbles.map((b) => (
                  <div
                    key={b.id}
                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    className="absolute pointer-events-none text-2xl animate-ping z-40"
                  >
                    🫧
                  </div>
                ))}

                {/* ================= ROAMING PIGS WITH SPEECH BUBBLES ================= */}
                {pigs.map((pig) => {
                  const breed = PIG_BREEDS[pig.breed] || PIG_BREEDS.pink;
                  const isSelected = selectedPigId === pig.id;
                  const sizeScale = Math.min(1.4, 0.85 + (pig.weight / breed.maxWeight) * 0.55);
                  const need = getPigNeed(pig);

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
                        transform: `translate(-50%, -50%) scale(${sizeScale}) scaleX(${pig.direction})`,
                        transition: 'left 2.4s ease-out, top 2.4s ease-out, transform 0.2s ease'
                      }}
                      className={`absolute cursor-pointer select-none group z-30 ${
                        isSelected ? 'ring-4 ring-amber-300 ring-offset-2 ring-offset-black/40 rounded-full' : ''
                      }`}
                    >
                      {/* 1. FLOATING SPEECH / NEED BUBBLE ABOVE PIG'S HEAD (เหมือนใน Piggy Town) */}
                      <div
                        onClick={(e) => handleBubbleClick(e, pig, need)}
                        style={{ transform: `scaleX(${pig.direction})` }}
                        className={`absolute -top-13 left-1/2 -translate-x-1/2 px-2 py-1 rounded-2xl shadow-xl flex items-center space-x-1 border-2 cursor-pointer transition-transform hover:scale-115 active:scale-95 animate-bounce z-40 ${
                          need.type === 'feed'
                            ? 'bg-amber-100 border-amber-500 text-amber-950'
                            : need.type === 'bath'
                            ? 'bg-blue-100 border-blue-500 text-blue-950'
                            : need.type === 'heal'
                            ? 'bg-rose-100 border-rose-500 text-rose-950'
                            : need.type === 'love'
                            ? 'bg-pink-100 border-pink-500 text-pink-950 ring-2 ring-pink-400'
                            : 'bg-white border-slate-300 text-slate-800'
                        }`}
                        title={need.hint}
                      >
                        <span className="text-sm">{need.icon}</span>
                        <span className="text-[9px] font-black whitespace-nowrap">{need.label}</span>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-inherit border-r-2 border-b-2 border-inherit rotate-45" />
                      </div>

                      {/* Name Tag & Weight */}
                      <div
                        style={{ transform: `scaleX(${pig.direction})` }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c1109]/90 text-amber-200 text-[10px] font-bold px-2 py-0.2 rounded-md whitespace-nowrap shadow-md flex items-center space-x-1 pointer-events-none border border-amber-600/70"
                      >
                        <span>{pig.name}</span>
                        <span className="text-amber-400 font-mono">({pig.weight}kg)</span>
                      </div>

                      {/* SVG Chibi Pig Sprite */}
                      <svg width="68" height="54" viewBox="0 0 68 54" className="drop-shadow-lg">
                        {/* Tail */}
                        <path
                          d="M60 28 Q66 22 62 18 Q58 14 62 10"
                          stroke={breed.earColor}
                          strokeWidth="3.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                        {/* Feet */}
                        <rect x="16" y="42" width="8" height="10" rx="3" fill={breed.earColor} />
                        <rect x="28" y="42" width="8" height="10" rx="3" fill={breed.earColor} />
                        <rect x="42" y="42" width="8" height="10" rx="3" fill={breed.earColor} />
                        <rect x="52" y="42" width="8" height="10" rx="3" fill={breed.earColor} />

                        {/* Main Body */}
                        <ellipse cx="36" cy="30" rx="26" ry="18" fill={breed.color} />
                        {/* Belly */}
                        <ellipse cx="34" cy="33" rx="18" ry="12" fill={breed.bellyColor} />

                        {/* Ears */}
                        <polygon points="12,18 8,4 20,10" fill={breed.earColor} />
                        <polygon points="26,16 30,2 36,12" fill={breed.earColor} />

                        {/* Head */}
                        <circle cx="18" cy="26" r="14" fill={breed.color} />

                        {/* Snout */}
                        <ellipse cx="10" cy="29" rx="7" ry="5" fill={breed.bellyColor} stroke={breed.earColor} strokeWidth="1.5" />
                        <circle cx="8" cy="29" r="1.5" fill="#9d174d" />
                        <circle cx="12" cy="29" r="1.5" fill="#9d174d" />

                        {/* Eye */}
                        <circle cx="17" cy="21" r="2.5" fill="#0f172a" />
                        <circle cx="18" cy="20" r="0.8" fill="#ffffff" />

                        {/* Accessories */}
                        {breed.accessory === 'glasses' && (
                          <g>
                            <circle cx="17" cy="21" r="5" fill="none" stroke="#1e293b" strokeWidth="2" />
                            <circle cx="9" cy="21" r="5" fill="none" stroke="#1e293b" strokeWidth="2" />
                            <line x1="14" y1="21" x2="12" y2="21" stroke="#1e293b" strokeWidth="2" />
                          </g>
                        )}

                        {breed.accessory === 'helmet' && (
                          <g>
                            <path d="M6 16 Q18 4 28 16 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                            <rect x="4" y="15" width="26" height="3" rx="1.5" fill="#facc15" />
                          </g>
                        )}

                        {breed.accessory === 'crown' && (
                          <polygon points="8,14 11,6 15,11 19,4 23,11 27,6 30,14" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                        )}

                        {breed.accessory === 'aura' && (
                          <circle cx="18" cy="26" r="19" fill="none" stroke="#d8b4fe" strokeWidth="2.5" strokeDasharray="3 2" />
                        )}

                        {breed.accessory === 'sakura' && (
                          <g>
                            <circle cx="10" cy="18" r="3" fill="#fda4af" />
                            <circle cx="24" cy="15" r="2.5" fill="#fda4af" />
                          </g>
                        )}

                        {breed.accessory === 'pot' && (
                          <g>
                            <path d="M8 17 Q18 10 28 17 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                            <circle cx="18" cy="12" r="3" fill="#f97316" />
                          </g>
                        )}

                        {breed.accessory === 'wings' && (
                          <g>
                            <path d="M40 18 Q48 6 56 18 Q48 24 40 18 Z" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
                            <polygon points="10,14 14,8 18,14" fill="#facc15" />
                          </g>
                        )}
                      </svg>
                    </div>
                  );
                })}
              </div>

              {/* Status Footer */}
              <div className="bg-[#2b180d]/80 rounded-2xl p-3 border border-amber-700/60 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">📊 ข้อมูลคอก:</span>
                  <span>จำนวนหมู: <b>{pigs.length}/8 ตัว</b></span>
                  <span>•</span>
                  <span>น้ำหนักรวม: <b>{pigs.reduce((a, b) => a + b.weight, 0).toFixed(1)} kg</b></span>
                </div>
                <div className="text-amber-300 font-bold text-[11px] animate-pulse">
                  💡 คลิกที่บอลลูนบนหัวหมูเพื่อตอบสนองความต้องการได้ทันที!
                </div>
              </div>
            </div>

            {/* Selected Pig Care Control Panel */}
            <div className="space-y-3">
              {selectedPig ? (
                <div className="bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] border-4 border-amber-700/80 rounded-3xl p-5 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${PIG_BREEDS[selectedPig.breed]?.badgeColor}`}>
                        {PIG_BREEDS[selectedPig.breed]?.tag}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1 font-mono">
                        {selectedPig.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-pink-600 font-mono">
                        {selectedPig.weight} <span className="text-xs text-slate-500 font-sans">kg</span>
                      </span>
                      <p className="text-[10px] text-amber-900 font-bold">
                        สูงสุด {PIG_BREEDS[selectedPig.breed]?.maxWeight} kg
                      </p>
                    </div>
                  </div>

                  {/* Status Gauges */}
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-800 mb-0.5">
                        <span>🥣 ความอิ่ม (Hunger)</span>
                        <span>{Math.round(selectedPig.hunger)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                        <div
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: `${selectedPig.hunger}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-800 mb-0.5">
                        <span>🧼 ความสะอาด (Cleanliness)</span>
                        <span>{Math.round(selectedPig.cleanliness)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                        <div
                          className="bg-blue-500 h-full transition-all duration-300"
                          style={{ width: `${selectedPig.cleanliness}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-800 mb-0.5">
                        <span>❤️ สุขภาพ (Health)</span>
                        <span>{Math.round(selectedPig.health)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                        <div
                          className="bg-rose-500 h-full transition-all duration-300"
                          style={{ width: `${selectedPig.health}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feeding Action Grid */}
                  <div className="space-y-1.5 pt-2 border-t border-amber-300">
                    <span className="text-xs font-black text-amber-950 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        <span>เลือกอาหารให้น้องกิน:</span>
                      </span>
                      <span className="text-[10px] text-amber-800 font-bold">
                        (มีผลผลิตในคลัง {Object.values(cropInventory).reduce((a, b) => a + b, 0)} ถุง)
                      </span>
                    </span>
                    <div className="grid grid-cols-2 gap-2">
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
                            className="p-2 rounded-xl border-2 border-amber-400 bg-white hover:bg-amber-50 text-left transition-all cursor-pointer shadow-xs active:scale-98"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span className="text-lg">{food.icon}</span>
                              <div className="truncate">
                                <div className="text-[11px] font-black text-slate-900 truncate">{food.name}</div>
                                <div className="text-[10px] text-amber-700 font-bold">
                                  {inStock > 0 ? (
                                    <span className="text-emerald-700 font-black">มี {inStock} ถุง (ฟรี!)</span>
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
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleBath}
                      className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 shadow-[0_3px_0_#1d4ed8] active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      <Bath className="w-4 h-4" />
                      <span>อาบน้ำขัดตัว</span>
                    </button>

                    <button
                      onClick={handleVaccine}
                      className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 shadow-[0_3px_0_#b91c1c] active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      <Syringe className="w-4 h-4" />
                      <span>ฉีดยา (20฿)</span>
                    </button>
                  </div>

                  {/* Sell Pig Button */}
                  <div className="pt-2 border-t border-amber-300">
                    <button
                      onClick={() => handleSellPig(selectedPig)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-2 shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>
                        ขายส่งโรงงาน (+{Math.round(selectedPig.weight * (PIG_BREEDS[selectedPig.breed]?.pricePerKg || 15) * (activeThemeId === 'golden_palace' ? 1.2 : 1.0)).toLocaleString()} เหรียญ)
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

        {/* ================= TAB 2: CROP FARMING PATCH (NEW FEATURE) ================= */}
        {activeTab === 'crops' && (
          <div className="relative z-10 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] p-5 sm:p-7 rounded-3xl border-4 border-amber-700 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300 pb-3">
              <div>
                <h2 className="text-xl font-black text-amber-950 font-mono flex items-center space-x-2">
                  <Sprout className="w-6 h-6 text-emerald-600" />
                  <span>แปลงปลูกพืชและผลิตอาหารหมู (Farm Patch)</span>
                </h2>
                <p className="text-xs text-amber-900 mt-0.5 font-medium">
                  หว่านเมล็ดพืช รอเวลาเก็บเกี่ยวเพื่อนำมาทำเป็นอาหารหมูในคอกตัวเองฟรี โดยไม่ต้องซื้อ!
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-amber-200/80 px-3.5 py-1.5 rounded-2xl border border-amber-400 text-xs font-bold text-amber-950">
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
                    {/* Soil Texture overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#78350f_2px,transparent_2px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

                    <div className="relative z-10 w-full flex justify-between items-center text-amber-200 text-xs font-bold">
                      <span>แปลงที่ #{plot.id + 1}</span>
                      {meta && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isReady ? 'bg-emerald-500 text-white animate-pulse' : 'bg-amber-900 text-amber-200'}`}>
                          {isReady ? '✨ พร้อมเก็บเกี่ยว' : `⏳ เหลือ ${remainingSec}s`}
                        </span>
                      )}
                    </div>

                    {/* Crop Plant Visualization */}
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

                    {/* Plant / Harvest Action */}
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

                      <h3 className="font-black text-slate-900 mt-2 font-mono text-sm">{breed.name}</h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {breed.description}
                      </p>
                      <div className="text-[10px] text-slate-700 font-bold mt-2">
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
        {activeTab === 'breed' && (
          <div className="relative z-10 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] p-6 sm:p-8 rounded-3xl border-4 border-amber-700 max-w-2xl mx-auto space-y-5 text-center shadow-2xl">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto text-3xl border-2 border-purple-300 shadow-md">
              🧬
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 font-mono">
                ห้องปฏิบัติการผสมพันธุ์วิจัยลูกหมู
              </h2>
              <p className="text-xs text-amber-900 mt-1 max-w-md mx-auto font-medium">
                ผสมพันธุ์หมูที่โตเต็มวัย (หนักมากกว่า 60 kg) เพื่อลุ้นรับสายพันธุ์หายาก เช่น หมูทองคำ, หมูชาบู หรือหมูสายรุ้ง สตง. ในตำนาน!
              </p>
            </div>

            <div className="bg-amber-100/80 p-4 rounded-2xl border border-amber-300 text-xs space-y-2 text-left text-amber-950 font-medium">
              <div className="font-black text-amber-900 flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>อัตราการเกิดของสายพันธุ์เมื่อผสมพันธุ์:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>• หมูองค์รักษ์พิทักษ์ อปท. (Mythic): 8%</div>
                <div>• หมูสายรุ้ง สตง. (Legendary): 12%</div>
                <div>• หมูพัสดุทองคำแท้ (Epic): 15%</div>
                <div>• หมูชาบูกระทะทอง (Epic): 15%</div>
                <div>• หมูซากุระชมพูหวาน (Epic): 15%</div>
                <div>• หมูผู้ตรวจ & หมูช่าง: 20%</div>
              </div>
            </div>

            <button
              onClick={handleBreed}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-[0_5px_0_#4c1d95] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center space-x-2 mx-auto"
            >
              <Dna className="w-4 h-4" />
              <span>ผสมพันธุ์ลูกหมูทันที (ค่าบริการ 80 เหรียญ)</span>
            </button>
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

      {/* ================= MODAL 2: NEIGHBOR FARMS & STEALING (NEW FEATURE) ================= */}
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

            {/* If looking at specific neighbor */}
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
                      <div key={np.id} className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center space-x-2">
                        <span className="text-2xl">🐷</span>
                        <div>
                          <div className="text-xs font-black text-slate-900">{np.name}</div>
                          <div className="text-[10px] text-amber-800 font-bold">น้ำหนัก {np.weight} kg</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neighbor Action Buttons */}
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
              /* Neighbor List */
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
                      <div className="text-3xl">{theme.icon}</div>
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
                      style={{ backgroundColor: breed.color }}
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
    </div>
  );
}
