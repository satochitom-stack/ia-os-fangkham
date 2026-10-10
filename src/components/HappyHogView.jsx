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
  },
  // === 6 DIAMOND EXCLUSIVE BREEDS (สัตว์เทพ & พันธุ์มายาใช้เพชรซื้อ) ===
  jade_dragon: {
    id: 'jade_dragon',
    name: 'หมูเทพมังกรหยก',
    tag: 'สัตว์เทพมังกร',
    rarity: 'Mythic 💎',
    primaryColor: '#10b981',
    secondaryColor: '#d1fae5',
    earColor: '#059669',
    bellyColor: '#ecfdf5',
    maxWeight: 350,
    pricePerKg: 350,
    diamondCost: 50,
    isDiamondBreed: true,
    description: 'มังกรหยกในร่างหมูน้อย พ่นประกายหยกประทานพร โตไวกว่าปกติ +100% สุขภาพไม่มีวันลดต่ำกว่า 50%',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-400',
    unlockDesc: 'ซื้อด้วย 50 เพชร 💎 หรือผสมพันธุ์สำเร็จ (โอกาส 1.5%)',
    specialPerk: 'โตไว +100%, สุขภาพไม่ต่ำกว่า 50%'
  },
  phoenix: {
    id: 'phoenix',
    name: 'หมูวิหคเพลิงสุริยัน',
    tag: 'วิหคเพลิงอมตะ',
    rarity: 'Mythic 💎',
    primaryColor: '#f97316',
    secondaryColor: '#ffedd5',
    earColor: '#ea580c',
    bellyColor: '#fff7ed',
    maxWeight: 400,
    pricePerKg: 450,
    diamondCost: 80,
    isDiamondBreed: true,
    description: 'ปีกเพลิงสุริยันนำโชค ปลอดโรค 100% และผลิตเหรียญขวัญถุง +150 ฿ เข้าคลังฟาร์มทุกๆ 60 วินาที',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-400',
    unlockDesc: 'ซื้อด้วย 80 เพชร 💎 หรือผสมพันธุ์สำเร็จ (โอกาส 1.5%)',
    specialPerk: 'ปลอดโรค 100%, มอบ +150฿ ทุก 60s'
  },
  galaxy: {
    id: 'galaxy',
    name: 'หมูเทวาจักรวาลกาแล็กซี',
    tag: 'เทวะกาแล็กซี',
    rarity: 'Celestial 💎',
    primaryColor: '#6366f1',
    secondaryColor: '#e0e7ff',
    earColor: '#4f46e5',
    bellyColor: '#eef2ff',
    maxWeight: 450,
    pricePerKg: 600,
    diamondCost: 120,
    isDiamondBreed: true,
    description: 'ละอองจักรวาลเรืองแสง พลังงานฟาร์มไม่มีวันหมด (เต็ม 100 เสมอ) และรับ EXP ฟาร์ม x3 เท่าจากทุกกิจกรรม',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-400',
    unlockDesc: 'ซื้อด้วย 120 เพชร 💎 หรือผสมพันธุ์สำเร็จ (โอกาส 1.5%)',
    specialPerk: 'พลังงานเต็มตลอดเวลา, EXP ฟาร์ม x3'
  },
  cyber_satoshi: {
    id: 'cyber_satoshi',
    name: 'หมูจักรกลคริปโตไซเบอร์',
    tag: 'จักรกลขุดเพชร',
    rarity: 'Celestial 💎',
    primaryColor: '#06b6d4',
    secondaryColor: '#cffafe',
    earColor: '#0891b2',
    bellyColor: '#ecfeff',
    maxWeight: 480,
    pricePerKg: 750,
    diamondCost: 150,
    isDiamondBreed: true,
    description: 'ติดตั้งชิปขุดเพชรอัจฉริยะ ช่วยขุดเพชรแท้ +1 💎 เข้าคลังทุก 3 นาที และขายส่งโรงงานได้ราคาสูงถึง 15,000+ ฿',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-400',
    unlockDesc: 'ซื้อด้วย 150 เพชร 💎 หรือผสมพันธุ์สำเร็จ (โอกาส 1.5%)',
    specialPerk: 'ขุดเพชรแท้ +1 💎 ทุก 3 นาที'
  },
  inferno_titan: {
    id: 'inferno_titan',
    name: 'หมูราชาอสูรแมกม่า',
    tag: 'อสูรไททัน',
    rarity: 'Godly 💎',
    primaryColor: '#ef4444',
    secondaryColor: '#fee2e2',
    earColor: '#dc2626',
    bellyColor: '#fef2f2',
    maxWeight: 500,
    pricePerKg: 900,
    diamondCost: 200,
    isDiamondBreed: true,
    description: 'ร่างยักษ์ 500kg แมกม่าหลอมเหลว ป้องกันโจรขโมยหมู 100% (แผดเผาคนมาแอบอุ้มหมูทันที)',
    badgeColor: 'bg-red-100 text-red-800 border-red-400',
    unlockDesc: 'ซื้อด้วย 200 เพชร 💎 หรือผสมพันธุ์สำเร็จ (โอกาส 1.5%)',
    specialPerk: 'หนัก 500kg, ป้องกันขโมย 100%'
  },
  diamond_angel: {
    id: 'diamond_angel',
    name: 'หมูเทพธิดาจันทราเพชรแท้',
    tag: 'มหาเทพจุติ',
    rarity: 'Divine 💎',
    primaryColor: '#a855f7',
    secondaryColor: '#f3e8ff',
    earColor: '#9333ea',
    bellyColor: '#faf5ff',
    maxWeight: 600,
    pricePerKg: 1200,
    diamondCost: 280,
    isDiamondBreed: true,
    description: 'มหาเทพธิดาหมูเพชรบริสุทธิ์ อิ่มทิพย์ตลอดกาล (ความหิวไม่ลด) และเพิ่มอัตราผสมพันธุ์ได้หมูหายากพิเศษ +50%',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-400',
    unlockDesc: 'ซื้อด้วย 280 เพชร 💎 หรือผสมพันธุ์สำเร็จ (โอกาส 1.5%)',
    specialPerk: 'อิ่มทิพย์ตลอดกาล, ผสมพันธุ์ติดหายาก +50%'
  }
};

// Pig Periodic Harvest Drop Configuration per Breed (Balanced Economy)
const PIG_DROP_CONFIG = {
  pink: {
    cycleSeconds: 120, // 2 นาที
    icon: '🌾',
    title: 'ผลผลิตฟาร์มพื้นฐาน',
    isMythic: false,
    roll: () => ({
      coins: Math.floor(20 + Math.random() * 15),
      diamonds: 0,
      exp: 5,
      energy: 0,
      text: 'รำข้าวหมัก & เหรียญขวัญถุง'
    })
  },
  auditor: {
    cycleSeconds: 140,
    icon: '📜',
    title: 'เอกสารผ่านการตรวจ ปค.5',
    isMythic: false,
    roll: () => ({
      coins: Math.floor(35 + Math.random() * 25),
      diamonds: 0,
      exp: 10,
      energy: 0,
      text: 'รายงานตรวจสอบผ่านฉลุย'
    })
  },
  engineer: {
    cycleSeconds: 150,
    icon: '🔧',
    title: 'อุปกรณ์ตรวจงานช่าง',
    isMythic: false,
    roll: () => ({
      coins: Math.floor(50 + Math.random() * 30),
      diamonds: 0,
      exp: 12,
      energy: 0,
      text: 'น็อตทองคำ Factor F'
    })
  },
  sakura: {
    cycleSeconds: 160,
    icon: '🌸',
    title: 'ดอกซากุระนำโชค',
    isMythic: false,
    roll: () => ({
      coins: Math.floor(65 + Math.random() * 30),
      diamonds: 0,
      exp: 15,
      energy: 1,
      text: 'กลีบซากุระสดชื่น (+1 ⚡)'
    })
  },
  shabu: {
    cycleSeconds: 160,
    icon: '🍲',
    title: 'ซุปกระทะทองคำ',
    isMythic: false,
    roll: () => ({
      coins: Math.floor(80 + Math.random() * 35),
      diamonds: 0,
      exp: 18,
      energy: 1,
      text: 'น้ำซุปชาบูเข้มข้น (+1 ⚡)'
    })
  },
  golden: {
    cycleSeconds: 180,
    icon: '💰',
    title: 'ถุงทองคำการคลัง',
    isMythic: false,
    roll: () => ({
      coins: Math.floor(130 + Math.random() * 50),
      diamonds: 0,
      exp: 25,
      energy: 0,
      text: 'ถุงทองคำเบิกจ่ายหลวง'
    })
  },
  rainbow: {
    cycleSeconds: 200,
    icon: '🌈',
    title: 'ผลึกแก้วรุ้ง 7 สี',
    isMythic: false,
    roll: () => ({
      coins: Math.floor(180 + Math.random() * 60),
      diamonds: 0,
      exp: 35,
      energy: 1,
      text: 'ผลึกสายรุ้ง สตง. (+1 ⚡)'
    })
  },
  knight: {
    cycleSeconds: 220,
    icon: '🛡️',
    title: 'ตราเกียรติยศอัศวิน',
    isMythic: false,
    roll: () => ({
      coins: Math.floor(220 + Math.random() * 80),
      diamonds: 0,
      exp: 40,
      energy: 2,
      text: 'ตราพิทักษ์ อปท. (+2 ⚡)'
    })
  },
  // 6 Diamond Mythic Breeds (โอกาสดรอปเพชรต่ำเพื่อรักษาเสถียรภาพระบบเงิน)
  jade_dragon: {
    cycleSeconds: 180, // 3 นาที
    icon: '🟢',
    title: 'พรสมบัติมังกรหยก',
    isMythic: true,
    roll: () => {
      const isDiamond = Math.random() < 0.12;
      if (isDiamond) {
        return {
          coins: 100,
          diamonds: 1,
          exp: 30,
          energy: 1,
          text: '💎 ผลึกเพชรหยกมังกร (+1 💎, +100 ฿)'
        };
      }
      return {
        coins: Math.floor(280 + Math.random() * 80),
        diamonds: 0,
        exp: 25,
        energy: 1,
        text: '🟢 หยกมังกรเรืองแสง (+1 ⚡)'
      };
    }
  },
  phoenix: {
    cycleSeconds: 180, // 3 นาที
    icon: '🔥',
    title: 'ขนนกเพลิงสุริยัน',
    isMythic: true,
    roll: () => {
      const isDiamond = Math.random() < 0.12;
      if (isDiamond) {
        return {
          coins: 120,
          diamonds: 1,
          exp: 35,
          energy: 2,
          text: '💎 เพชรเปลวเพลิงสุริยัน (+1 💎, +120 ฿)'
        };
      }
      return {
        coins: Math.floor(320 + Math.random() * 90),
        diamonds: 0,
        exp: 30,
        energy: 2,
        text: '🔥 สะเก็ดไฟฟีนิกซ์อมตะ (+2 ⚡)'
      };
    }
  },
  galaxy: {
    cycleSeconds: 210, // 3.5 นาที
    icon: '🌌',
    title: 'เศษละอองดาวคอสมิก',
    isMythic: true,
    roll: () => {
      const roll = Math.random();
      if (roll < 0.15) {
        const diaCount = roll < 0.03 ? 2 : 1;
        return {
          coins: 150,
          diamonds: diaCount,
          exp: 60,
          energy: 2,
          text: `💎 เพชรดวงดาวเนบิวลา (+${diaCount} 💎, +150 ฿)`
        };
      }
      return {
        coins: Math.floor(380 + Math.random() * 100),
        diamonds: 0,
        exp: 50,
        energy: 1,
        text: '🌌 เศษผลึกดาวฤกษ์กาแล็กซี'
      };
    }
  },
  cyber_satoshi: {
    cycleSeconds: 180, // 3 นาที
    icon: '⚡',
    title: 'บล็อกเชนขุดเพชร',
    isMythic: true,
    roll: () => {
      const isDiamond = Math.random() < 0.15;
      if (isDiamond) {
        return {
          coins: 140,
          diamonds: 1,
          exp: 40,
          energy: 1,
          text: '💎 บล็อกขุดสำเร็จ (+1 💎, +140 ฿)'
        };
      }
      return {
        coins: Math.floor(360 + Math.random() * 90),
        diamonds: 0,
        exp: 35,
        energy: 1,
        text: '⚡ ชิปข้อมูลไฮเทคระดับตำนาน'
      };
    }
  },
  inferno_titan: {
    cycleSeconds: 210, // 3.5 นาที
    icon: '🌋',
    title: 'ผลึกแมกมาโบราณ',
    isMythic: true,
    roll: () => {
      const isDiamond = Math.random() < 0.12;
      if (isDiamond) {
        return {
          coins: 160,
          diamonds: 1,
          exp: 45,
          energy: 2,
          text: '💎 ผลึกเพชรภูเขาไฟ (+1 💎, +160 ฿)'
        };
      }
      return {
        coins: Math.floor(400 + Math.random() * 110),
        diamonds: 0,
        exp: 40,
        energy: 2,
        text: '🌋 ผลึกหินลาวาไททัน (+2 ⚡)'
      };
    }
  },
  diamond_angel: {
    cycleSeconds: 240, // 4 นาที
    icon: '🪽',
    title: 'ขนนกเทพธิดาจันทรา',
    isMythic: true,
    roll: () => {
      const roll = Math.random();
      if (roll < 0.18) {
        const diaCount = roll < 0.04 ? 2 : 1;
        return {
          coins: 200,
          diamonds: diaCount,
          exp: 80,
          energy: 3,
          text: `💎 เพชรจันทราสวรรค์ (+${diaCount} 💎, +200 ฿, +3 ⚡)`
        };
      }
      return {
        coins: Math.floor(450 + Math.random() * 150),
        diamonds: 0,
        exp: 60,
        energy: 3,
        text: '🪽 ขนนกแสงทิพย์บริสุทธิ์ (+3 ⚡)'
      };
    }
  }
};

// 6 Beautiful Coin-Based Barn Themes (Zero pre-baked animals in background)
const BARN_THEMES = {
  pasture: {
    id: 'pasture',
    name: 'ทุ่งหญ้าธรรมชาติพาสเทล',
    tag: 'Piggy Town',
    icon: '🌿',
    
    bgClass: 'from-[#7dd3fc] via-[#bbf7d0] to-[#86efac]',
    penGround: '#f7e7c4',
    fenceBorder: '#8c593b',
    perk: 'หมูอารมณ์ดี วิ่งเล่นร่าเริง สบายตา',
    cost: 0,
    unlockedByDefault: true,
    atmosphere: 'butterflies',
    bounds: { minX: 18, maxX: 82, minY: 32, maxY: 76 }
  },
  cozy_wood: {
    id: 'cozy_wood',
    name: 'คอกไม้ชนบทฤดูใบไม้ร่วง',
    tag: 'อบอุ่น',
    icon: '🪵',
    
    bgClass: 'from-[#fed7aa] via-[#fde68a] to-[#d97706]',
    penGround: '#eedbb3',
    fenceBorder: '#78350f',
    perk: 'คอกไม้ฟางทอง อัตราเกิดวัชพืชลดลง 30%',
    cost: 0,
    unlockedByDefault: true,
    atmosphere: 'leaves',
    bounds: { minX: 18, maxX: 82, minY: 32, maxY: 76 }
  },
  onsen_mud: {
    id: 'onsen_mud',
    name: 'สปาออนเซ็นเพื่อสุขภาพ',
    tag: 'รีแลกซ์',
    icon: '♨️',
    
    bgClass: 'from-[#cbd5e1] via-[#94a3b8] to-[#64748b]',
    penGround: '#d6cbba',
    fenceBorder: '#475569',
    perk: 'ความสะอาดลดช้าลง 50% หมูผิวพรรณสดใส',
    cost: 400,
    unlockDesc: 'อาบน้ำหมูสะสมครบ 8 ครั้ง หรือใช้ 400 เหรียญ',
    atmosphere: 'steam',
    bounds: { minX: 18, maxX: 82, minY: 32, maxY: 76 }
  },
  lanna: {
    id: 'lanna',
    name: 'คุ้มเรือนไม้สักล้านนา อปท.',
    tag: 'วัฒนธรรม',
    icon: '🏮',
    
    bgClass: 'from-[#fef08a] via-[#fde047] to-[#ca8a04]',
    penGround: '#fae3b4',
    fenceBorder: '#854d0e',
    perk: 'หมูเติบโตไวกว่าปกติ +20% วัฒนธรรมทรงคุณค่า',
    cost: 800,
    unlockDesc: 'มีหมูน้ำหนัก 90 kg ขึ้นไป หรือใช้ 800 เหรียญ',
    atmosphere: 'lanterns',
    bounds: { minX: 18, maxX: 82, minY: 32, maxY: 76 }
  },
  golden_palace: {
    id: 'golden_palace',
    name: 'คฤหาสน์หมูทองคำเศรษฐี',
    tag: 'ลักชัวรี่',
    icon: '👑',
    bgClass: 'from-[#fef08a] via-[#fbbf24] to-[#d97706]',
    penGround: '#fff3c4',
    fenceBorder: '#b45309',
    perk: 'โบนัสราคาขายหมู +25% หรูหราระดับมหาเศรษฐี',
    cost: 1500,
    unlockDesc: 'ครอบครองหมูทองคำ หรือใช้ 1,500 เหรียญ',
    atmosphere: 'sparkles',
    bounds: { minX: 18, maxX: 82, minY: 32, maxY: 76 }
  },
  cyber_space: {
    id: 'cyber_space',
    name: 'ฟาร์มไฮเทคสมาร์ทอีโค่',
    tag: 'สมาร์ทฟาร์ม',
    icon: '⚡',
    
    bgClass: 'from-[#0f172a] via-[#1e1b4b] to-[#312e81]',
    penGround: '#e2e8f0',
    fenceBorder: '#06b6d4',
    perk: 'ระบบรางอาหารอัตโนมัติ ความหิวลดช้าลง 40% และป้องกันขโมย 100%',
    cost: 2200,
    unlockDesc: 'ผสมพันธุ์สำเร็จ 3 ครั้ง หรือใช้ 2,200 เหรียญ',
    atmosphere: 'cyber',
    bounds: { minX: 18, maxX: 82, minY: 32, maxY: 76 }
  }
};

// Helper function to generate clean coordinates strictly inside the active barn theme's pen boundaries
const getRandomCoordInBarn = (themeId) => {
  const bounds = BARN_THEMES[themeId]?.bounds || { minX: 25, maxX: 72, minY: 40, maxY: 72 };
  const minX = bounds.minX + 2;
  const maxX = bounds.maxX - 2;
  const minY = bounds.minY + 2;
  const maxY = bounds.maxY - 2;
  return {
    x: Math.round(minX + Math.random() * (maxX - minX)),
    y: Math.round(minY + Math.random() * (maxY - minY))
  };
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

// 8. Custom Elemental Visual Effects for Mythic and Legendary Breeds
const PigElementalEffect = ({ breed }) => {
  if (breed === 'jade_dragon') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        {/* Dragon Jade Orb & Ethereal Wind particles */}
        <div className="absolute -top-3 left-1 text-[11px] animate-elemental-float text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]">
          🟢
        </div>
        <div className="absolute -bottom-1 -right-2 text-[9px] animate-elemental-float [animation-delay:1.1s] text-emerald-200 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]">
          ✨
        </div>
        <div className="absolute top-2 -left-3 text-[9px] animate-elemental-float [animation-delay:0.6s] text-teal-300 drop-shadow-[0_0_5px_rgba(20,184,166,0.9)]">
          🍃
        </div>
      </div>
    );
  }
  if (breed === 'phoenix') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        {/* Phoenix Solar Flame Rising Embers */}
        <div className="absolute -top-3.5 right-1 text-[11px] animate-elemental-float text-amber-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]">
          🔥
        </div>
        <div className="absolute -top-1 -left-2 text-[9px] animate-elemental-float [animation-delay:0.8s] text-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.9)]">
          ✨
        </div>
        <div className="absolute bottom-1 right-3 text-[8px] animate-elemental-float [animation-delay:1.4s] text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]">
          ⚡
        </div>
      </div>
    );
  }
  if (breed === 'galaxy') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        {/* Cosmic Orbiting Planetary Ring */}
        <svg className="absolute w-20 h-12 -top-1 animate-elemental-spin-slow opacity-85" viewBox="0 0 80 48">
          <ellipse cx="40" cy="24" rx="36" ry="9" fill="none" stroke="url(#galaxyGrad)" strokeWidth="1.8" strokeDasharray="4 2" />
          <defs>
            <linearGradient id="galaxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e879f9" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute -top-3 left-0 text-[10px] animate-elemental-float text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.9)]">
          🌌
        </div>
        <div className="absolute top-1 -right-3 text-[9px] animate-elemental-float [animation-delay:1s] text-indigo-200 drop-shadow-[0_0_6px_rgba(129,140,248,0.9)]">
          ✦
        </div>
      </div>
    );
  }
  if (breed === 'cyber_satoshi') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        {/* Cyber Neon Lightning & Matrix Bits */}
        <div className="absolute -top-3 right-0 text-[11px] animate-elemental-electric text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.95)]">
          ⚡
        </div>
        <div className="absolute top-2 -left-2 text-[8px] font-mono font-black text-cyan-400 animate-pulse drop-shadow-[0_0_4px_rgba(6,182,212,0.9)]">
          01
        </div>
        <div className="absolute -bottom-1 right-2 text-[9px] animate-elemental-float [animation-delay:0.5s] text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]">
          💠
        </div>
      </div>
    );
  }
  if (breed === 'inferno_titan') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        {/* Volcanic Magma & Crimson Embers */}
        <div className="absolute -top-3 left-0 text-[11px] animate-elemental-float text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.95)]">
          🌋
        </div>
        <div className="absolute top-0 -right-2 text-[10px] animate-elemental-float [animation-delay:0.9s] text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.9)]">
          🔥
        </div>
        <div className="absolute -bottom-1 -left-2 text-[8px] animate-elemental-float [animation-delay:1.3s] text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.9)]">
          💥
        </div>
      </div>
    );
  }
  if (breed === 'diamond_angel') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        {/* Golden Angelic Halo Ring Floating Gracefully Above Head */}
        <div className="absolute -top-4 flex items-center justify-center animate-elemental-halo">
          <svg width="34" height="14" viewBox="0 0 34 14" className="drop-shadow-[0_0_8px_rgba(234,179,8,0.95)]">
            <ellipse cx="17" cy="7" rx="14" ry="4.5" fill="none" stroke="#fde047" strokeWidth="2.2" />
            <ellipse cx="17" cy="7" rx="14" ry="4.5" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>
        <div className="absolute top-1 -right-2 text-[9px] animate-elemental-float text-purple-200 drop-shadow-[0_0_6px_rgba(233,213,255,0.9)]">
          🪽
        </div>
        <div className="absolute bottom-0 -left-2 text-[9px] animate-elemental-float [animation-delay:0.8s] text-amber-200 drop-shadow-[0_0_6px_rgba(254,240,138,0.9)]">
          ✨
        </div>
      </div>
    );
  }
  if (breed === 'rainbow') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        <div className="absolute -top-2.5 right-0 text-[10px] animate-elemental-float text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.9)]">
          🌈
        </div>
      </div>
    );
  }
  if (breed === 'golden') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        <div className="absolute -top-2.5 right-0 text-[9px] animate-elemental-float text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]">
          ✨
        </div>
      </div>
    );
  }
  if (breed === 'knight') {
    return (
      <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center">
        <div className="absolute -top-2.5 left-0 text-[10px] animate-elemental-float text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]">
          🛡️
        </div>
      </div>
    );
  }
  return null;
};

// 9. High-Fidelity 3D Chibi Pig Sprite Component (Piggy Town & Happy Hog Style)

// ==============================================================
// MODULAR BARN DECORATIONS (Tilemap.exe EP.3 Modular Asset Kit)
// ==============================================================
export const BARN_DECORS = {
  golden_palace_building: {
    id: 'golden_palace_building',
    name: 'ปราสาทคฤหาสน์ทองคำหลวง',
    category: 'building',
    icon: '🏛️',
    cost: 500,
    perk: 'คฤหาสน์ทองคำหลวง เพิ่มราคาขายหมูในฟาร์ม +25%',
    defaultPos: { x: 50, y: 28 },
    layer: 'back',
    scale: 1.35,
    tag: 'ปราสาท'
  },
  golden_fountain: {
    id: 'golden_fountain',
    name: 'น้ำพุทองคำเศรษฐี',
    category: 'water',
    icon: '⛲',
    cost: 350,
    perk: 'น้ำพุพุ่งสวยงาม เสริมโชคลาภในการหมุนวงล้อหมู',
    defaultPos: { x: 80, y: 50 },
    layer: 'mid',
    scale: 1.15,
    tag: 'น้ำพุ'
  },
  stone_well: {
    id: 'stone_well',
    name: 'บ่อน้ำศิลาโบราณ',
    category: 'building',
    icon: '🪣',
    cost: 180,
    perk: 'บ่อน้ำดื่มสะอาด หมูสดชื่น คลายกระหายน้ำ',
    defaultPos: { x: 20, y: 68 },
    layer: 'mid',
    scale: 1.05,
    tag: 'บ่อน้ำ'
  },
  rose_hedge: {
    id: 'rose_hedge',
    name: 'แนวพุ่มกุหลาบพระราชวัง',
    category: 'flora',
    icon: '🌹',
    cost: 150,
    perk: 'กลิ่นกุหลาบหอมฟุ้ง หมูมีความสุขสดชื่น +15%',
    defaultPos: { x: 78, y: 70 },
    layer: 'mid',
    scale: 1.0,
    tag: 'ดอกไม้'
  },
  veggie_patch: {
    id: 'veggie_patch',
    name: 'แปลงผักสวนครัวจำลอง',
    category: 'flora',
    icon: '🥕',
    cost: 160,
    perk: 'ผักสวนครัวสดใหม่ เพิ่มความอิ่มหมู +10%',
    defaultPos: { x: 22, y: 50 },
    layer: 'mid',
    scale: 1.05,
    tag: 'แปลงผัก'
  },
  pine_tree: {
    id: 'pine_tree',
    name: 'ต้นสนการ์ตูนป่าเห็ด',
    category: 'tree',
    icon: '🌲',
    cost: 150,
    perk: 'เพิ่มร่มเงา หมูลดความเครียด +10%',
    defaultPos: { x: 18, y: 38 },
    layer: 'back',
    scale: 1.1,
    tag: 'ต้นไม้'
  },
  ancient_oak: {
    id: 'ancient_oak',
    name: 'ต้นโอ๊คยักษ์โบราณ',
    category: 'tree',
    icon: '🌳',
    cost: 280,
    perk: 'ใบไม้พริ้วไหว หมูหลับสบาย ฟื้นฟูไวขึ้น +15%',
    defaultPos: { x: 82, y: 36 },
    layer: 'back',
    scale: 1.25,
    tag: 'ต้นไม้'
  },
  sakura_tree: {
    id: 'sakura_tree',
    name: 'ต้นซากุระสปาพาสเทล',
    category: 'tree',
    icon: '🌸',
    cost: 350,
    perk: 'กลีบซากุระร่วง เพิ่มบรรยากาศผ่อนคลายและความสะอาด +15%',
    defaultPos: { x: 16, y: 44 },
    layer: 'back',
    scale: 1.15,
    tag: 'ต้นไม้'
  },
  golden_teak: {
    id: 'golden_teak',
    name: 'ไม้สักทองล้านนา',
    category: 'tree',
    icon: '🎋',
    cost: 480,
    perk: 'ไม้สักทองมงคล เพิ่มมูลค่าราคาขายหมูในฟาร์ม +5%',
    defaultPos: { x: 84, y: 40 },
    layer: 'back',
    scale: 1.2,
    tag: 'ต้นไม้'
  },
  cyber_pylon: {
    id: 'cyber_pylon',
    name: 'เสาไฮเทคปล่อยพลังงาน',
    category: 'tree',
    icon: '📡',
    cost: 600,
    perk: 'คลื่นพลังงาน ช่วยเร่งการฟื้นฟูพลังงานผู้เล่น +10%',
    defaultPos: { x: 20, y: 38 },
    layer: 'back',
    scale: 1.05,
    tag: 'ไฮเทค'
  },
  mushroom_cottage: {
    id: 'mushroom_cottage',
    name: 'บ้านเห็ดแฟนตาซีอบอุ่น',
    category: 'building',
    icon: '🍄',
    cost: 320,
    perk: 'มีไฟหน้าต่างตอนค่ำ เพิ่มความสุขหมู +12%',
    defaultPos: { x: 26, y: 32 },
    layer: 'back',
    scale: 1.25,
    tag: 'บ้านเห็ด'
  },
  straw_hut: {
    id: 'straw_hut',
    name: 'ซุ้มเพิงฟางบังแดด',
    category: 'building',
    icon: '🛖',
    cost: 200,
    perk: 'เพิงฟางกันแดด อุณหภูมิคอกสมดุล ป้องกันหมูป่วย',
    defaultPos: { x: 74, y: 32 },
    layer: 'back',
    scale: 1.1,
    tag: 'เพิงพัก'
  },
  lanna_pavilion: {
    id: 'lanna_pavilion',
    name: 'ศาลาทรงไทยล้านนา',
    category: 'building',
    icon: '🏛️',
    cost: 520,
    perk: 'ศาลาพักใจ หมูมีความสุขและโตไวขึ้น +10%',
    defaultPos: { x: 72, y: 32 },
    layer: 'back',
    scale: 1.15,
    tag: 'ศาลา'
  },
  vintage_lamp: {
    id: 'vintage_lamp',
    name: 'โคมไฟเสาไม้ข้างทาง',
    category: 'light',
    icon: '🏮',
    cost: 140,
    perk: 'ส่องแสงสว่างในเวลากลางคืน คอยส่องทางเดิน',
    defaultPos: { x: 38, y: 74 },
    layer: 'front',
    scale: 1.0,
    tag: 'โคมไฟ'
  },
  crystal_lantern: {
    id: 'crystal_lantern',
    name: 'โคมคริสตัลเรืองแสง',
    category: 'light',
    icon: '🔮',
    cost: 300,
    perk: 'ส่องแสงคริสตัล ดึงดูดของขวัญตกกระทบฟาร์ม',
    defaultPos: { x: 62, y: 74 },
    layer: 'front',
    scale: 1.0,
    tag: 'โคมไฟ'
  },
  glow_mushrooms: {
    id: 'glow_mushrooms',
    name: 'เห็ดเรืองแสงสามสี',
    category: 'flora',
    icon: '🪻',
    cost: 120,
    perk: 'เห็ดเรืองแสงสีนีออน สวยงามยามค่ำคืน',
    defaultPos: { x: 22, y: 64 },
    layer: 'mid',
    scale: 0.9,
    tag: 'ของเตี้ย'
  },
  flower_meadow: {
    id: 'flower_meadow',
    name: 'แปลงดอกไม้พาสเทล',
    category: 'flora',
    icon: '💐',
    cost: 160,
    perk: 'ผีเสื้อบินวนรอบแปลงดอกไม้ หมูอารมณ์ดี +15%',
    defaultPos: { x: 74, y: 66 },
    layer: 'mid',
    scale: 0.95,
    tag: 'ของเตี้ย'
  },
  ancient_stump: {
    id: 'ancient_stump',
    name: 'ตอไม้ขอนโบราณ',
    category: 'flora',
    icon: '🪵',
    cost: 110,
    perk: 'ที่เกาหลังของน้องหมู ช่วยลดความเครียด',
    defaultPos: { x: 32, y: 68 },
    layer: 'mid',
    scale: 0.9,
    tag: 'ตอไม้'
  },
  onsen_bath: {
    id: 'onsen_bath',
    name: 'บ่อน้ำแร่ออนเซ็นหินภูเขาไฟ',
    category: 'water',
    icon: '♨️',
    cost: 420,
    perk: 'มีไอควันอุ่นๆ หมูอาบน้ำแล้วผิวเนียนสวย',
    defaultPos: { x: 76, y: 52 },
    layer: 'mid',
    scale: 1.15,
    tag: 'บ่อน้ำแร่'
  }
};

// Component to render modular decor items with isometric 3/4 styling & shadows
const DecorItemSprite = ({ decor, isNight }) => {
  const { id } = decor;

  if (id === 'golden_palace_building') {
    return (
      <svg width="140" height="110" viewBox="0 0 140 110" className="drop-shadow-2xl select-none pointer-events-none">
        <ellipse cx="70" cy="100" rx="65" ry="9" fill="rgba(0,0,0,0.25)" />
        {/* Main Palace Body */}
        <path d="M25 50 L70 20 L115 50 L115 98 L25 98 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
        {/* Side Wings */}
        <rect x="15" y="60" width="20" height="38" rx="2" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" />
        <rect x="105" y="60" width="20" height="38" rx="2" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" />
        {/* Golden Central Dome */}
        <path d="M48 42 Q70 8 92 42 Z" fill="#eab308" stroke="#a16207" strokeWidth="2.5" />
        <circle cx="70" cy="8" r="4.5" fill="#fde047" stroke="#854d0e" strokeWidth="1.5" />
        <polygon points="70,1 68,6 72,6" fill="#facc15" />
        {/* Grand Portico Columns */}
        <rect x="42" y="64" width="6" height="34" fill="#ffffff" stroke="#ca8a04" strokeWidth="1.5" />
        <rect x="58" y="64" width="6" height="34" fill="#ffffff" stroke="#ca8a04" strokeWidth="1.5" />
        <rect x="76" y="64" width="6" height="34" fill="#ffffff" stroke="#ca8a04" strokeWidth="1.5" />
        <rect x="92" y="64" width="6" height="34" fill="#ffffff" stroke="#ca8a04" strokeWidth="1.5" />
        {/* Golden Arch Entrance */}
        <path d="M64 74 Q70 66 76 74 L76 98 L64 98 Z" fill="#713f12" stroke="#451a03" strokeWidth="1.8" />
        {/* Royal Crest Banner */}
        <polygon points="62,50 78,50 70,62" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        <circle cx="70" cy="55" r="2.5" fill="#fde047" />
      </svg>
    );
  }

  if (id === 'stone_well') {
    return (
      <svg width="65" height="75" viewBox="0 0 65 75" className="drop-shadow-lg select-none pointer-events-none">
        <ellipse cx="32" cy="68" rx="28" ry="6" fill="rgba(0,0,0,0.22)" />
        {/* Stone Basin Base */}
        <ellipse cx="32" cy="56" rx="24" ry="10" fill="#78716c" stroke="#44403c" strokeWidth="2" />
        <ellipse cx="32" cy="54" rx="18" ry="7" fill="#0284c7" />
        {/* Wooden Support Beams */}
        <rect x="14" y="28" width="4" height="28" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        <rect x="46" y="28" width="4" height="28" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        {/* Shingle Roof */}
        <polygon points="8,32 32,10 56,32" fill="#b45309" stroke="#78350f" strokeWidth="2" />
        <polygon points="12,30 32,14 52,30" fill="#d97706" />
        {/* Hanging Bucket */}
        <line x1="32" y1="20" x2="32" y2="42" stroke="#451a03" strokeWidth="1.5" />
        <rect x="29" y="42" width="6" height="7" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="1" />
      </svg>
    );
  }

  if (id === 'rose_hedge') {
    return (
      <svg width="80" height="48" viewBox="0 0 80 48" className="drop-shadow-md select-none pointer-events-none">
        <ellipse cx="40" cy="42" rx="36" ry="5.5" fill="rgba(0,0,0,0.18)" />
        {/* Green Hedge Bush */}
        <ellipse cx="40" cy="30" rx="34" ry="14" fill="#15803d" stroke="#14532d" strokeWidth="2" />
        <circle cx="22" cy="24" r="14" fill="#16a34a" />
        <circle cx="58" cy="24" r="14" fill="#16a34a" />
        <circle cx="40" cy="20" r="15" fill="#22c55e" />
        {/* Blooming Roses */}
        <circle cx="20" cy="20" r="5.5" fill="#e11d48" stroke="#9f1239" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="2.5" fill="#fda4af" />
        <circle cx="40" cy="15" r="6" fill="#f43f5e" stroke="#9f1239" strokeWidth="1.2" />
        <circle cx="40" cy="15" r="2.5" fill="#ffe4e6" />
        <circle cx="60" cy="20" r="5.5" fill="#e11d48" stroke="#9f1239" strokeWidth="1.2" />
        <circle cx="60" cy="20" r="2.5" fill="#fda4af" />
        <circle cx="30" cy="28" r="4.5" fill="#fb7185" />
        <circle cx="50" cy="28" r="4.5" fill="#fb7185" />
      </svg>
    );
  }

  if (id === 'veggie_patch') {
    return (
      <svg width="75" height="46" viewBox="0 0 75 46" className="drop-shadow-md select-none pointer-events-none">
        <ellipse cx="37" cy="40" rx="34" ry="5.5" fill="rgba(0,0,0,0.18)" />
        {/* Soil Raised Bed */}
        <ellipse cx="37" cy="32" rx="32" ry="11" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        <ellipse cx="37" cy="30" rx="28" ry="8" fill="#92400e" />
        {/* Crops (Carrots and Lettuce) */}
        <circle cx="20" cy="26" r="6.5" fill="#16a34a" />
        <circle cx="20" cy="26" r="3.5" fill="#86efac" />
        <polygon points="34,22 40,22 37,32" fill="#ea580c" />
        <circle cx="37" cy="20" r="3" fill="#22c55e" />
        <circle cx="54" cy="26" r="6.5" fill="#16a34a" />
        <circle cx="54" cy="26" r="3.5" fill="#86efac" />
      </svg>
    );
  }

  if (id === 'golden_fountain') {
    return (
      <svg width="76" height="84" viewBox="0 0 76 84" className="drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] select-none pointer-events-none">
        <ellipse cx="38" cy="74" rx="32" ry="7" fill="rgba(0,0,0,0.25)" />
        <ellipse cx="38" cy="66" rx="30" ry="9" fill="#ca8a04" stroke="#713f12" strokeWidth="2.5" />
        <ellipse cx="38" cy="64" rx="26" ry="7" fill="#38bdf8" />
        <rect x="34" y="38" width="8" height="26" fill="#eab308" stroke="#713f12" strokeWidth="2" />
        <ellipse cx="38" cy="38" rx="17" ry="5.5" fill="#fde047" stroke="#713f12" strokeWidth="2" />
        <circle cx="38" cy="22" r="8" fill="#facc15" stroke="#713f12" strokeWidth="2" />
        <line x1="38" y1="14" x2="38" y2="4" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
      </svg>
    );
  }

  if (id === 'pine_tree') {
    return (
      <svg width="76" height="92" viewBox="0 0 76 92" className="drop-shadow-lg select-none pointer-events-none">
        <ellipse cx="38" cy="84" rx="30" ry="7" fill="rgba(0,0,0,0.24)" />
        <path d="M34 56 L32 82 L44 82 L42 56 Z" fill="#78350f" stroke="#3d1b06" strokeWidth="2.5" />
        <polygon points="12,62 38,36 64,62" fill="#1e3a2f" stroke="#0f1d17" strokeWidth="2.5" />
        <polygon points="16,60 38,38 60,60" fill="#2d5a46" />
        <polygon points="18,44 38,20 58,44" fill="#366b53" stroke="#0f1d17" strokeWidth="2.5" />
        <polygon points="22,42 38,22 54,42" fill="#428164" />
        <polygon points="26,26 38,8 50,26" fill="#4ea07c" stroke="#0f1d17" strokeWidth="2.5" />
        <circle cx="38" cy="8" r="2.5" fill="#a7f3d0" />
      </svg>
    );
  }

  if (id === 'ancient_oak') {
    return (
      <svg width="88" height="102" viewBox="0 0 88 102" className="drop-shadow-xl select-none pointer-events-none">
        <ellipse cx="44" cy="94" rx="36" ry="7.5" fill="rgba(0,0,0,0.22)" />
        <path d="M38 50 Q42 74 34 90 L54 90 Q46 74 50 50 Z" fill="#6d3914" stroke="#361a07" strokeWidth="2.8" />
        <ellipse cx="44" cy="44" rx="38" ry="30" fill="#166534" stroke="#052e16" strokeWidth="2.5" />
        <circle cx="30" cy="38" r="22" fill="#15803d" />
        <circle cx="58" cy="38" r="22" fill="#16a34a" />
        <circle cx="44" cy="24" r="23" fill="#22c55e" />
        <circle cx="40" cy="18" r="9" fill="#86efac" opacity="0.6" />
      </svg>
    );
  }

  if (id === 'sakura_tree') {
    return (
      <svg width="84" height="98" viewBox="0 0 84 98" className="drop-shadow-lg select-none pointer-events-none">
        <ellipse cx="42" cy="90" rx="32" ry="7" fill="rgba(0,0,0,0.2)" />
        <path d="M37 50 Q40 72 33 86 L51 86 Q44 72 47 50 Z" fill="#582e17" stroke="#2d1509" strokeWidth="2.5" />
        <ellipse cx="42" cy="42" rx="36" ry="28" fill="#be185d" stroke="#500724" strokeWidth="2.5" />
        <circle cx="28" cy="36" r="20" fill="#db2777" />
        <circle cx="56" cy="36" r="20" fill="#ec4899" />
        <circle cx="42" cy="22" r="22" fill="#f472b6" />
        <circle cx="38" cy="16" r="8" fill="#fbcfe8" opacity="0.75" />
      </svg>
    );
  }

  if (id === 'golden_teak') {
    return (
      <svg width="84" height="100" viewBox="0 0 84 100" className="drop-shadow-lg select-none pointer-events-none">
        <ellipse cx="42" cy="92" rx="32" ry="7" fill="rgba(0,0,0,0.22)" />
        <path d="M38 50 Q41 74 34 88 L50 88 Q43 74 46 50 Z" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
        <ellipse cx="42" cy="44" rx="34" ry="28" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
        <circle cx="28" cy="38" r="20" fill="#b45309" />
        <circle cx="56" cy="38" r="20" fill="#d97706" />
        <circle cx="42" cy="24" r="22" fill="#f59e0b" />
        <circle cx="38" cy="18" r="8" fill="#fde68a" opacity="0.7" />
      </svg>
    );
  }

  if (id === 'cyber_pylon') {
    return (
      <svg width="64" height="92" viewBox="0 0 64 92" className="drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] select-none pointer-events-none">
        <ellipse cx="32" cy="84" rx="24" ry="6" fill="rgba(6,182,212,0.3)" />
        <path d="M24 28 L20 82 L44 82 L40 28 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
        <circle cx="32" cy="22" r="13" fill="#0891b2" stroke="#22d3ee" strokeWidth="2.5" />
        <circle cx="32" cy="22" r="6" fill="#67e8f9" className="animate-pulse" />
      </svg>
    );
  }

  if (id === 'mushroom_cottage') {
    return (
      <svg width="86" height="84" viewBox="0 0 86 84" className="drop-shadow-xl select-none pointer-events-none">
        <ellipse cx="43" cy="76" rx="36" ry="7.5" fill="rgba(0,0,0,0.22)" />
        <path d="M24 44 Q23 72 27 76 L59 76 Q63 72 62 44 Z" fill="#fef08a" stroke="#713f12" strokeWidth="2.8" />
        <path d="M36 56 Q43 50 50 56 L50 76 L36 76 Z" fill="#78350f" stroke="#3d1b06" strokeWidth="2" />
        <circle cx="32" cy="52" r="4.5" fill="#fef08a" stroke="#713f12" strokeWidth="1.8" className={isNight ? 'animate-pulse' : ''} />
        <path d="M8 44 Q43 8 78 44 Q43 40 8 44 Z" fill="#dc2626" stroke="#450a0a" strokeWidth="3" />
        <ellipse cx="26" cy="28" rx="5" ry="4" fill="#ffffff" />
        <ellipse cx="48" cy="20" rx="6.5" ry="4.5" fill="#ffffff" />
        <ellipse cx="66" cy="32" rx="4" ry="3" fill="#ffffff" />
      </svg>
    );
  }

  if (id === 'straw_hut') {
    return (
      <svg width="82" height="76" viewBox="0 0 82 76" className="drop-shadow-lg select-none pointer-events-none">
        <ellipse cx="41" cy="70" rx="34" ry="6.5" fill="rgba(0,0,0,0.2)" />
        <rect x="20" y="42" width="42" height="28" rx="2" fill="#78350f" stroke="#3d1b06" strokeWidth="2.5" />
        <polygon points="6,46 41,12 76,46" fill="#eab308" stroke="#713f12" strokeWidth="2.5" />
        <polygon points="12,44 41,16 70,44" fill="#fde047" />
      </svg>
    );
  }

  if (id === 'lanna_pavilion') {
    return (
      <svg width="82" height="84" viewBox="0 0 82 84" className="drop-shadow-xl select-none pointer-events-none">
        <ellipse cx="41" cy="76" rx="34" ry="6.5" fill="rgba(0,0,0,0.22)" />
        <rect x="20" y="42" width="6" height="34" fill="#78350f" stroke="#3d1b06" strokeWidth="1.5" />
        <rect x="56" y="42" width="6" height="34" fill="#78350f" stroke="#3d1b06" strokeWidth="1.5" />
        <polygon points="6,44 41,18 76,44" fill="#b45309" stroke="#3d1b06" strokeWidth="2.5" />
        <polygon points="16,32 41,10 66,32" fill="#d97706" stroke="#3d1b06" strokeWidth="2" />
      </svg>
    );
  }

  if (id === 'vintage_lamp' || id === 'crystal_lantern') {
    return (
      <svg width="42" height="72" viewBox="0 0 42 72" className="drop-shadow-lg select-none pointer-events-none">
        <ellipse cx="21" cy="66" rx="15" ry="4" fill="rgba(0,0,0,0.2)" />
        <rect x="19" y="22" width="4" height="44" rx="1.5" fill="#451a03" stroke="#1c0b02" strokeWidth="1.5" />
        <rect x="13" y="10" width="16" height="16" rx="3" fill="#1c1917" stroke="#000000" strokeWidth="1.8" />
        <rect x="15" y="12" width="12" height="12" rx="2" fill={id === 'crystal_lantern' ? '#c084fc' : '#fbbf24'} className="animate-pulse" />
        <circle cx="21" cy="18" r="14" fill={id === 'crystal_lantern' ? 'rgba(192,132,252,0.3)' : 'rgba(251,191,36,0.3)'} className="animate-pulse pointer-events-none" />
      </svg>
    );
  }

  if (id === 'glow_mushrooms') {
    return (
      <svg width="54" height="46" viewBox="0 0 54 46" className="drop-shadow-lg select-none pointer-events-none">
        <ellipse cx="27" cy="40" rx="20" ry="4.5" fill="rgba(0,0,0,0.18)" />
        <path d="M12 26 Q11 38 14 40 L20 40 Q19 38 18 26 Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5" />
        <path d="M6 26 Q15 12 24 26 Z" fill="#06b6d4" stroke="#083344" strokeWidth="2" className="animate-pulse" />
        <path d="M28 18 Q27 36 31 40 L37 40 Q36 36 34 18 Z" fill="#f3e8ff" stroke="#6b21a8" strokeWidth="1.5" />
        <path d="M22 18 Q33 2 44 18 Z" fill="#a855f7" stroke="#3b0764" strokeWidth="2" className="animate-pulse" />
      </svg>
    );
  }

  if (id === 'flower_meadow') {
    return (
      <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-md select-none pointer-events-none">
        <ellipse cx="30" cy="34" rx="26" ry="5" fill="rgba(0,0,0,0.16)" />
        <circle cx="16" cy="20" r="5" fill="#f43f5e" stroke="#881337" strokeWidth="1.5" />
        <circle cx="16" cy="20" r="2" fill="#fef08a" />
        <circle cx="30" cy="16" r="6" fill="#a855f7" stroke="#581c87" strokeWidth="1.5" />
        <circle cx="30" cy="16" r="2.5" fill="#fef08a" />
        <circle cx="44" cy="20" r="5" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
        <circle cx="44" cy="20" r="2" fill="#fef08a" />
        <text x="34" y="10" fontSize="11" className="animate-bounce">🦋</text>
      </svg>
    );
  }

  if (id === 'ancient_stump') {
    return (
      <svg width="58" height="42" viewBox="0 0 58 42" className="drop-shadow-md select-none pointer-events-none">
        <ellipse cx="29" cy="36" rx="24" ry="4.5" fill="rgba(0,0,0,0.2)" />
        <path d="M10 22 L8 36 L48 36 L46 22 Z" fill="#78350f" stroke="#3d1b06" strokeWidth="2" />
        <ellipse cx="29" cy="22" rx="19" ry="6.5" fill="#b45309" stroke="#3d1b06" strokeWidth="2" />
        <path d="M14 26 Q20 22 26 28" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === 'onsen_bath') {
    return (
      <svg width="80" height="62" viewBox="0 0 80 62" className="drop-shadow-xl select-none pointer-events-none">
        <ellipse cx="40" cy="52" rx="34" ry="7.5" fill="rgba(0,0,0,0.22)" />
        <ellipse cx="40" cy="42" rx="36" ry="13" fill="#44403c" stroke="#1c1917" strokeWidth="2.5" />
        <ellipse cx="40" cy="41" rx="28" ry="9" fill="#06b6d4" />
        <ellipse cx="40" cy="41" rx="22" ry="6.5" fill="#22d3ee" opacity="0.8" />
        <text x="34" y="26" fontSize="15" className="animate-pulse">♨️</text>
      </svg>
    );
  }

  return (
    <div className="text-3xl select-none">{decor.icon || '🪴'}</div>
  );
};



// ==============================================================
// 2.5D ISOMETRIC OPEN PEN GROUND (Tilemap.exe Night Camp EP.3)
// Clean, open, unobstructed pen floors with outer perimeter fences
// ==============================================================
const CleanIsometricPenGround = ({ themeId }) => {
  if (themeId === 'golden_palace') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Sunny Royal Azure Sky with Gentle Clouds */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#38bdf8] via-[#bae6fd] to-[#fef08a]" />
        <div className="absolute top-4 left-1/4 w-36 h-12 bg-white/40 rounded-full blur-md" />
        <div className="absolute top-10 right-1/4 w-48 h-14 bg-white/50 rounded-full blur-md" />
        {/* Distant Rolling Royal Estate Greenery on Horizon */}
        <div className="absolute top-[20%] left-0 right-0 h-20 bg-gradient-to-b from-[#15803d]/40 to-[#22c55e]/70 rounded-[100%_100%_0_0] blur-[2px]" />

        {/* 2.5D Isometric Grand Courtyard (Polished Golden-Cream Marble Tiles) */}
        <div className="absolute inset-x-[6%] top-[24%] bottom-[5%] rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-4 border-[#ca8a04]">
          {/* Base Polished Marble Floor */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fffbeb] via-[#fef9c3] to-[#fef08a]" />
          
          {/* Subtle Isometric Tile Grid Pattern */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `linear-gradient(rgba(202,138,4,0.35) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(202,138,4,0.35) 1.5px, transparent 1.5px)`,
              backgroundSize: '42px 42px'
            }}
          />

          {/* Royal Decorative Inner Border Trim */}
          <div className="absolute inset-4 rounded-[36px] border-2 border-dashed border-[#ca8a04]/50 pointer-events-none" />

          {/* Wrought Gold Perimeter Fence Posts (Outer Boundary Only) */}
          <div className="absolute top-2 left-6 right-6 flex justify-between">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 border border-amber-600 shadow-sm" />
                <div className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-amber-700" />
              </div>
            ))}
          </div>

          <div className="absolute bottom-2 left-6 right-6 flex justify-between">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 border border-amber-600 shadow-sm" />
                <div className="w-1.5 h-5 bg-gradient-to-b from-amber-500 to-amber-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (themeId === 'cozy_wood') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fed7aa] via-[#fde68a] to-[#d97706]" />
        <div className="absolute top-[20%] left-0 right-0 h-20 bg-gradient-to-b from-[#92400e]/30 to-[#b45309]/50 rounded-[100%_100%_0_0] blur-[2px]" />
        <div className="absolute inset-x-[6%] top-[24%] bottom-[5%] rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-4 border-[#78350f]">
          <div className="absolute inset-0 bg-[#eedbb3]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(120,53,15,0.4) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(120,53,15,0.4) 1.5px, transparent 1.5px)`,
              backgroundSize: '48px 48px'
            }}
          />
          <div className="absolute inset-4 rounded-[36px] border-2 border-dashed border-[#78350f]/40" />
        </div>
      </div>
    );
  }

  if (themeId === 'onsen_mud') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#64748b]" />
        <div className="absolute inset-x-[6%] top-[24%] bottom-[5%] rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-4 border-[#475569]">
          <div className="absolute inset-0 bg-[#d6cbba]" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(#475569 2px, transparent 2px)`,
              backgroundSize: '24px 24px'
            }}
          />
        </div>
      </div>
    );
  }

  if (themeId === 'lanna') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#ca8a04]" />
        <div className="absolute inset-x-[6%] top-[24%] bottom-[5%] rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-4 border-[#854d0e]">
          <div className="absolute inset-0 bg-[#fae3b4]" />
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage: `linear-gradient(rgba(133,77,14,0.3) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(133,77,14,0.3) 1.5px, transparent 1.5px)`,
              backgroundSize: '44px 44px'
            }}
          />
        </div>
      </div>
    );
  }

  if (themeId === 'cyber_space') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />
        <div className="absolute inset-x-[6%] top-[24%] bottom-[5%] rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(6,182,212,0.35)] border-4 border-[#06b6d4]">
          <div className="absolute inset-0 bg-[#0f172a]" />
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage: `linear-gradient(rgba(6,182,212,0.45) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(6,182,212,0.45) 1.5px, transparent 1.5px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>
    );
  }

  // Default: Pasture (Clean Open Meadow Green)
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#7dd3fc] via-[#bbf7d0] to-[#86efac]" />
      <div className="absolute top-6 left-1/4 w-36 h-10 bg-white/40 rounded-full blur-md" />
      <div className="absolute top-12 right-1/4 w-44 h-12 bg-white/50 rounded-full blur-md" />
      <div className="absolute top-[20%] left-0 right-0 h-20 bg-gradient-to-b from-[#166534]/40 to-[#15803d]/60 rounded-[100%_100%_0_0] blur-[2px]" />
      <div className="absolute inset-x-[6%] top-[24%] bottom-[5%] rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-4 border-[#8c593b]">
        <div className="absolute inset-0 bg-[#bbf7d0]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(#15803d 2px, transparent 2px)`,
            backgroundSize: '24px 24px'
          }}
        />
        <div className="absolute inset-4 rounded-[36px] border-2 border-dashed border-[#8c593b]/40" />
      </div>
    </div>
  );
};


const PigSprite = ({ breed, isSelected, direction, weight, isMoving, isResting, isTapped }) => {
  const b = PIG_BREEDS[breed] || PIG_BREEDS.pink;
  // Compact, cute chibi scale matching the reference game (ranges from 0.72 for baby to 1.04 for full grown)
  const weightRatio = Math.min(1, Math.max(0, weight / b.maxWeight));
  const sizeScale = 0.58 + weightRatio * 0.28;
  const spriteSrc = `/pigs/${breed}.png`;
  const dirScale = direction === -1 || direction === 'left' ? -1 : 1;

  // Custom glowing celestial aura styling for diamond mythic breeds
  let filterCss = '';
  if (breed === 'jade_dragon') {
    filterCss = 'drop-shadow(0 3px 8px rgba(16,185,129,0.5)) drop-shadow(0 0 12px rgba(52,211,153,0.7))';
  } else if (breed === 'phoenix') {
    filterCss = 'drop-shadow(0 3px 9px rgba(249,115,22,0.6)) drop-shadow(0 0 14px rgba(251,146,60,0.75))';
  } else if (breed === 'galaxy') {
    filterCss = 'drop-shadow(0 3px 9px rgba(124,58,237,0.6)) drop-shadow(0 0 14px rgba(167,139,250,0.75))';
  } else if (breed === 'cyber_satoshi') {
    filterCss = 'drop-shadow(0 3px 8px rgba(6,182,212,0.6)) drop-shadow(0 0 12px rgba(34,211,238,0.75))';
  } else if (breed === 'inferno_titan') {
    filterCss = 'drop-shadow(0 3px 9px rgba(239,68,68,0.6)) drop-shadow(0 0 14px rgba(248,113,113,0.75))';
  } else if (breed === 'diamond_angel') {
    filterCss = 'drop-shadow(0 3px 10px rgba(192,132,252,0.7)) drop-shadow(0 0 15px rgba(233,213,255,0.85))';
  }

  return (
    <div
      style={{
        transform: `scale(${sizeScale})`,
        transition: 'transform 0.25s ease'
      }}
      className={`relative select-none flex flex-col items-center justify-center pointer-events-auto cursor-pointer ${
        isSelected ? 'filter drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]' : ''
      }`}
    >
      {/* Luminous Mythic Ground Aura for Diamond & Legendary Breeds */}
      {(b.isDiamondBreed || breed === 'rainbow' || breed === 'golden' || breed === 'knight') && (
        <div
          className="absolute -bottom-1.5 w-16 h-4.5 rounded-full blur-[6px] pointer-events-none animate-pulse"
          style={{
            background: breed === 'jade_dragon'
              ? 'radial-gradient(ellipse at center, rgba(16,185,129,0.75) 0%, rgba(5,150,105,0.2) 60%, transparent 100%)'
              : breed === 'phoenix'
              ? 'radial-gradient(ellipse at center, rgba(249,115,22,0.75) 0%, rgba(234,88,12,0.2) 60%, transparent 100%)'
              : breed === 'galaxy'
              ? 'radial-gradient(ellipse at center, rgba(139,92,246,0.75) 0%, rgba(99,102,241,0.2) 60%, transparent 100%)'
              : breed === 'cyber_satoshi'
              ? 'radial-gradient(ellipse at center, rgba(6,182,212,0.75) 0%, rgba(14,165,233,0.2) 60%, transparent 100%)'
              : breed === 'inferno_titan'
              ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.75) 0%, rgba(185,28,28,0.2) 60%, transparent 100%)'
              : breed === 'diamond_angel'
              ? 'radial-gradient(ellipse at center, rgba(216,180,254,0.75) 0%, rgba(168,85,247,0.2) 60%, transparent 100%)'
              : breed === 'rainbow'
              ? 'radial-gradient(ellipse at center, rgba(192,132,252,0.65) 0%, rgba(244,114,182,0.2) 60%, transparent 100%)'
              : breed === 'golden'
              ? 'radial-gradient(ellipse at center, rgba(251,191,36,0.7) 0%, rgba(217,119,6,0.2) 60%, transparent 100%)'
              : 'radial-gradient(ellipse at center, rgba(56,189,248,0.65) 0%, rgba(2,132,199,0.2) 60%, transparent 100%)',
            animationDuration: '3s'
          }}
        />
      )}

      {/* Spectacular Elemental Particles & Auras according to the pig's element */}
      <PigElementalEffect breed={breed} />

      {/* Soft Ground Contact Shadow */}
      <div
        className={`w-11 h-2.5 rounded-full blur-[2px] absolute -bottom-0.5 pointer-events-none ${
          b.isDiamondBreed ? 'bg-purple-900/40 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-black/30'
        }`}
      />

      {/* Animated Body Container (Joy Jump, Sleeping Snooze, Moving Waddle, or Idle Breathing) */}
      <div
        className={`transition-transform duration-200 ${
          isTapped
            ? 'animate-pig-joy'
            : isResting
            ? 'animate-pig-sleep'
            : isMoving
            ? 'animate-pig-waddle'
            : 'animate-pig-breathe'
        }`}
      >
        <img
          src={spriteSrc}
          alt={b.name}
          style={{
            transform: `scaleX(${dirScale})`,
            filter: filterCss || undefined,
            transition: 'transform 0.18s ease'
          }}
          className="w-13 h-13 sm:w-14 sm:h-14 object-contain drop-shadow-md pointer-events-none select-none hover:scale-110 active:scale-95 transition-transform"
          draggable={false}
        />
      </div>
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

  // Energy Capacity scales with Farm Level (+10 max energy per farm level)
  const maxEnergy = 100 + (farmLevel - 1) * 10;
  const [energyCountdown, setEnergyCountdown] = useState(60);

  // Screen Size Mode (Theater / Full-window mode)
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Barn Upgrade Modal
  const [showBarnUpgradeModal, setShowBarnUpgradeModal] = useState(false);

  // Modular Barn Decor Kit (Tilemap.exe EP.3)
  const [unlockedDecors, setUnlockedDecors] = useState(() => {
    try {
      const saved = localStorage.getItem('happy_hog_unlocked_decors');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['golden_palace_building', 'golden_fountain', 'stone_well', 'rose_hedge', 'pine_tree', 'mushroom_cottage', 'vintage_lamp', 'flower_meadow', 'straw_hut', 'ancient_stump'];
  });
  const [equippedDecors, setEquippedDecors] = useState(() => {
    try {
      const saved = localStorage.getItem('happy_hog_equipped_decors');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [inGameModal, setInGameModal] = useState(null); // null | 'shop' | 'crops' | 'quests' | 'breed' | 'decor'
  const [shopCategoryTab, setShopCategoryTab] = useState('pigs'); // 'pigs' | 'food' | 'decors'
  const [decorCategoryFilter, setDecorCategoryFilter] = useState('all');


  // Breeding Parents Selection
  const [breedParent1Id, setBreedParent1Id] = useState(null);
  const [breedParent2Id, setBreedParent2Id] = useState(null);

  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('happy_hog_coins');
    return saved !== null ? parseInt(saved, 10) : 250;
  });

  const [diamonds, setDiamonds] = useState(() => {
    const compensated = localStorage.getItem('happy_hog_wheel_500_compensated');
    const saved = localStorage.getItem('happy_hog_diamonds');
    let currentVal = saved !== null ? parseInt(saved, 10) : 50;
    if (compensated !== 'true') {
      currentVal = (currentVal || 0) + 500;
      localStorage.setItem('happy_hog_diamonds', currentVal.toString());
      localStorage.setItem('happy_hog_wheel_500_compensated', 'true');
    }
    return currentVal;
  });

  const [showAuditModal, setShowAuditModal] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState(() => {
    const saved = localStorage.getItem('happy_hog_last_audit_time');
    return saved !== null ? parseInt(saved, 10) : 0;
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
        x: 44,
        y: 50,
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
        x: 54,
        y: 54,
        direction: -1
      }
    ];
  });

  const [selectedPigId, setSelectedPigId] = useState(1);
  const [tappedPigId, setTappedPigId] = useState(null);
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
  const [showDiamondShopModal, setShowDiamondShopModal] = useState(false);
  const [diamondShopTab, setDiamondShopTab] = useState('topup'); // 'topup' | 'exchange'
  const [shopFilter, setShopFilter] = useState('all'); // 'all' | 'coin' | 'diamond'
  const [themeFilter, setThemeFilter] = useState('all'); // 'all' | 'coin' | 'diamond'
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

  // Timer loop for crop growth, energy regeneration (1 min / 1 energy), and Yard Litter spawning + Diamond / Breed passive bonuses
  useEffect(() => {
    let secondTick = 0;
    const timer = setInterval(() => {
      secondTick += 1;
      setCurrentTime(Date.now());

      // Energy regen: +1 every 60 seconds (1 minute / 1 energy) naturally, or fast +1 every 15s if farm has galaxy pig
      const hasGalaxy = pigs.some((p) => p.breed === 'galaxy');
      const regenFreq = hasGalaxy ? 15 : 60;

      setEnergyCountdown((prev) => {
        if (prev <= 1) {
          setEnergy((e) => Math.min(maxEnergy, e + 1));
          return regenFreq;
        }
        return prev - 1;
      });

      // Phoenix pig passive: grants +150 ฿ every 60 seconds
      if (secondTick % 60 === 0) {
        const phoenixCount = pigs.filter((p) => p.breed === 'phoenix').length;
        if (phoenixCount > 0) {
          const bonusCoins = phoenixCount * 150;
          setCoins((c) => c + bonusCoins);
          showToast(`🔥 หมูวิหคเพลิงสุริยัน มอบเปลวเพลิงนำโชค +${bonusCoins} ฿!`);
        }
      }

      // Cyber Satoshi pig passive: mines +1 💎 every 180 seconds (3 min)
      if (secondTick % 180 === 0) {
        const satoshiCount = pigs.filter((p) => p.breed === 'cyber_satoshi').length;
        if (satoshiCount > 0) {
          const bonusDiamonds = satoshiCount * 1;
          setDiamonds((d) => d + bonusDiamonds);
          showToast(`💎 หมูจักรกลคริปโตไซเบอร์ ขุดเพชรแท้สำเร็จ +${bonusDiamonds} 💎!`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [pigs, maxEnergy]);

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
        const coord = getRandomCoordInBarn(activeThemeId);
        const newDrop = {
          id: Date.now(),
          ...selected,
          x: coord.x,
          y: coord.y
        };
        return [...prev, newDrop];
      });
    }, 75000);
    return () => clearInterval(dropTimer);
  }, [activeThemeId]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const canClaimToday = loginData.lastClaimDate !== todayStr;
  const currentClaimDay = Math.min(7, loginData.claimedDays.length + 1);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('happy_hog_coins', coins.toString());
    localStorage.setItem('happy_hog_diamonds', diamonds.toString());
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
    localStorage.setItem('happy_hog_last_audit_time', lastAuditTime.toString());
  }, [coins, diamonds, energy, pigs, isLocked, activeThemeId, unlockedThemes, unlockedBreeds, stats, crops, cropInventory, loginData, neighbors, quests, wheelSpinsToday, farmLevel, farmExp, barnCapacityTier, lastAuditTime]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Helper to trigger joyful bounce animation when interacted with
  const triggerPigJoy = (pigId) => {
    setTappedPigId(pigId);
    setTimeout(() => {
      setTappedPigId((curr) => (curr === pigId ? null : curr));
    }, 750);
  };

  // Mount notification for 500 diamond compensation
  useEffect(() => {
    const compensatedNotified = sessionStorage.getItem('happy_hog_500_comp_notified');
    if (!compensatedNotified) {
      sessionStorage.setItem('happy_hog_500_comp_notified', 'true');
      showToast('💎 ชดเชยเพชรวงล้อนำโชค 500 💎 เข้ากระเป๋าเรียบร้อยแล้ว!');
    }
  }, []);

  // Farm Experience & Level Up System
  const addExp = (amount) => {
    // If farm has galaxy pig, EXP is tripled (x3)!
    const hasGalaxy = pigs.some((p) => p.breed === 'galaxy');
    const finalAmount = hasGalaxy ? amount * 3 : amount;

    setFarmExp((prevExp) => {
      let currentExp = prevExp + finalAmount;
      let currentLv = farmLevel;
      const needed = currentLv * 120;
      if (currentExp >= needed) {
        currentExp -= needed;
        const nextLv = currentLv + 1;
        setFarmLevel(nextLv);
        playSound('fanfare', isMuted);
        const rewardBonus = nextLv * 250;
        const nextMaxEnergy = 100 + (nextLv - 1) * 10;
        setCoins((c) => c + rewardBonus);
        setEnergy(nextMaxEnergy);
        setCelebrationReward({
          title: `🎉 เลเวลอัป! ฟาร์มเลเวล ${nextLv}`,
          badge: 'FARM LEVEL UP!',
          subtitle: 'ฟาร์มของคุณเติบโตขึ้นไปอีกขั้น ขีดจำกัดพลังงานเพิ่มขึ้น!',
          rewardText: `+${rewardBonus.toLocaleString()} ฿ & พลังงานเต็ม ⚡${nextMaxEnergy}`,
          icon: '⭐',
          color: 'from-amber-400 to-yellow-500'
        });
        showToast(`⭐ เลเวลอัปเป็น Lv.${nextLv}! ได้รับ +${rewardBonus} ฿ & ขีดจำกัดพลังงาน ⚡${nextMaxEnergy}`);
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
        prevPigs.map((p, idx) => {
          // Individual metabolism modifier based on pig id so they don't decay in lockstep
          const rateModifier = 0.85 + ((p.id % 5) * 0.07);

          const currentBounds = BARN_THEMES[activeThemeId]?.bounds || { minX: 25, maxX: 75, minY: 35, maxY: 75 };
          const isOutside = p.x < currentBounds.minX || p.x > currentBounds.maxX || p.y < currentBounds.minY || p.y > currentBounds.maxY;

          if (Math.random() < 0.65 || isOutside) {
            // Crowd repulsion: steer away gently if another pig is close to disperse across the wide pen
            let repelX = 0;
            let repelY = 0;
            prevPigs.forEach((other, oIdx) => {
              if (idx !== oIdx) {
                const dx = p.x - other.x;
                const dy = p.y - other.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 100 && distSq > 0.01) {
                  const dist = Math.sqrt(distSq);
                  repelX += (dx / dist) * 5;
                  repelY += (dy / dist) * 3.5;
                }
              }
            });

            // Moderate stroll step size so pigs don't jump wildly across scenery
            const targetCenterX = (currentBounds.minX + currentBounds.maxX) / 2;
            const targetCenterY = (currentBounds.minY + currentBounds.maxY) / 2;
            const stepX = isOutside ? (targetCenterX - p.x) * 0.45 : (Math.random() * 10 - 5) + repelX;
            const stepY = isOutside ? (targetCenterY - p.y) * 0.45 : (Math.random() * 8 - 4) + repelY;

            const nextX = Math.max(currentBounds.minX, Math.min(currentBounds.maxX, p.x + stepX));
            const nextY = Math.max(currentBounds.minY, Math.min(currentBounds.maxY, p.y + stepY));
            const hasMoved = Math.abs(nextX - p.x) > 0.3 || Math.abs(nextY - p.y) > 0.3;

            // 1. Hunger decreases gently (~0.05% per wander step for relaxed casual pacing)
            // If diamond_angel, hunger never drops (always full)!
            // If theme is cyber_space, smart auto-feeder slows hunger by 40%!
            let hungerLoss = 0.05 * rateModifier;
            if (activeThemeId === 'cyber_space') hungerLoss *= 0.6;
            if (p.breed === 'diamond_angel') hungerLoss = 0;
            const nextHunger = Math.max(0, p.hunger - hungerLoss);

            // 2. Cleanliness decreases gently (~0.035% per wander step)
            // onsen_mud theme cuts cleanliness loss in half!
            const wastePenalty = yardDrops.length > 0 ? 0.015 : 0;
            let cleanlinessLoss = (activeThemeId === 'onsen_mud' ? 0.018 : 0.035) * rateModifier + wastePenalty;
            const nextCleanliness = Math.max(0, p.cleanliness - cleanlinessLoss);

            // 3. Health: Only decreases if severely starving (0%) or filthy (0%), and naturally recovers when cared for!
            let healthDelta = 0;
            if (nextHunger <= 0) healthDelta -= 0.04; // Severe starvation only
            if (nextCleanliness <= 0) healthDelta -= 0.03; // Severe filth only
            if (nextHunger >= 60 && nextCleanliness >= 60) {
              // Natural health recovery when well-fed and clean!
              healthDelta += 0.08;
            }
            if (p.breed === 'phoenix') healthDelta = 100; // Phoenix is immune
            let nextHealth = p.breed === 'phoenix' ? 100 : Math.max(0, Math.min(100, p.health + healthDelta));
            if (p.breed === 'jade_dragon' && nextHealth < 50) nextHealth = 50;

            // 4. Gradual weight growth when well-fed & clean
            // jade_dragon grows +100% faster (x2), lanna theme grows +20% faster (x1.2)
            let weightDelta = 0;
            if (nextHunger >= 50 && nextCleanliness >= 50 && nextHealth >= 60) {
              const breedMax = PIG_BREEDS[p.breed]?.maxWeight || 100;
              if (p.weight < breedMax) {
                weightDelta = 0.05; // base 50 grams
                if (p.breed === 'jade_dragon') weightDelta *= 2.0;
                if (activeThemeId === 'lanna') weightDelta *= 1.2;
                if (activeThemeId === 'golden_palace') weightDelta *= 1.15;
              }
            }

            return {
              ...p,
              x: nextX,
              y: nextY,
              direction: nextX !== p.x ? (nextX >= p.x ? 1 : -1) : p.direction,
              isMoving: hasMoved,
              hunger: Math.round(nextHunger * 10) / 10,
              cleanliness: Math.round(nextCleanliness * 10) / 10,
              health: Math.round(nextHealth * 10) / 10,
              weight: Math.round((p.weight + weightDelta) * 10) / 10
            };
          }
          return {
            ...p,
            isMoving: false
          };
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
    // 2. Hungry (Baby bottle for piglets < 35 kg, food bowl for adult pigs)
    if (pig.hunger < 50) {
      const isPiglet = pig.weight < 35;
      return {
        type: 'feed',
        icon: isPiglet ? '🍼' : '🥣',
        label: isPiglet ? 'หิวนม' : 'หิวข้าว',
        hint: isPiglet ? 'แตะเพื่อป้อนนมลูกหมู' : 'แตะเพื่อให้อาหารทันที'
      };
    }
    // 3. Dirty
    if (pig.cleanliness < 50) return { type: 'bath', icon: '🧼', label: 'ตัวมอมแมม', hint: 'แตะเพื่ออาบน้ำขัดตัว' };
    // Content & happy pigs: peaceful and clean (no cluttering bouncing bubbles!)
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
    if (energy < 1) {
      showToast('⚡ พลังงานไม่เพียงพอ! (ต้องการ 1 ⚡) รอฟื้นฟูหรือตรวจการฟาร์ม');
      return;
    }
    setEnergy((e) => Math.max(0, e - 1));
    playSound('feed', isMuted);
    triggerPigJoy(targetPig.id);
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

  
  // Collect all available pig drops at once
  const handleCollectAllPigDrops = () => {
    let totalCoinsEarned = 0;
    let totalExpEarned = 0;
    let totalDiamondsEarned = 0;
    let collectedCount = 0;

    const updatedPigs = pigs.map((p) => {
      const dropCfg = PIG_DROP_CONFIG[p.breed] || PIG_DROP_CONFIG.pink;
      const cycleMs = dropCfg.cycleSeconds * 1000;
      const isReady = (currentTime - (p.lastDropTime || 0)) >= cycleMs;
      if (isReady) {
        collectedCount++;
        totalCoinsEarned += dropCfg.coinReward || 50;
        totalExpEarned += dropCfg.expReward || 15;
        if (dropCfg.isMythic && Math.random() < (dropCfg.diamondChance || 0.3)) {
          totalDiamondsEarned += dropCfg.diamondCount || 1;
        }
        return { ...p, lastDropTime: currentTime };
      }
      return p;
    });

    if (collectedCount > 0) {
      setPigs(updatedPigs);
      setCoins((c) => c + totalCoinsEarned);
      setDiamonds((d) => d + totalDiamondsEarned);
      setFarmExp((exp) => exp + totalExpEarned);
      playSound('fanfare', isMuted);
      showToast(`🎉 เก็บของขวัญจากหมู ${collectedCount} ตัวสำเร็จ! (+${totalCoinsEarned} 🪙${totalDiamondsEarned > 0 ? `, +${totalDiamondsEarned} 💎` : ''}, +${totalExpEarned} EXP)`);
    } else {
      showToast('⏳ ยังไม่มีของขวัญที่พร้อมเก็บในขณะนี้');
    }
  };

  const handleCollectPigDrop = (pig) => {
    const dropCfg = PIG_DROP_CONFIG[pig.breed] || PIG_DROP_CONFIG.pink;
    const now = Date.now();
    const cycleMs = dropCfg.cycleSeconds * 1000;
    const lastDrop = pig.lastDropTime || 0;

    if (now - lastDrop < cycleMs) {
      const waitSec = Math.ceil((cycleMs - (now - lastDrop)) / 1000);
      showToast(`⏳ ${pig.name} ยังไม่พร้อมมอบของขวัญ (เหลืออีก ${waitSec} วินาที)`);
      return;
    }

    const reward = dropCfg.roll();

    if (reward.diamonds > 0) {
      setDiamonds((d) => d + reward.diamonds);
    }
    if (reward.coins > 0) {
      setCoins((c) => c + reward.coins);
    }
    if (reward.exp > 0) {
      addExp(reward.exp);
    }
    if (reward.energy > 0) {
      setEnergy((e) => Math.min(maxEnergy, e + reward.energy));
    }

    setPigs((prev) =>
      prev.map((p) => (p.id === pig.id ? { ...p, lastDropTime: now } : p))
    );

    triggerPigJoy(pig.id);
    playSound(reward.diamonds > 0 ? 'fanfare' : 'coin', isMuted);

    setHearts((h) => [...h, { id: Date.now(), x: pig.x, y: pig.y - 12 }]);
    setTimeout(() => setHearts((h) => h.slice(1)), 1200);

    if (reward.diamonds > 0) {
      showToast(`✨ [${pig.name}] มอบรางวัลใหญ่: ${reward.text} ⭐ +${reward.exp} EXP!`);
    } else {
      showToast(`🎁 [${pig.name}] มอบของขวัญ: +${reward.coins} 🪙 (${reward.text}) ⭐ +${reward.exp} EXP!`);
    }
  };

  // Modular Barn Decor Kit Handlers (Tilemap.exe EP.3)
  const handleToggleEquipDecor = (decorId) => {
    setEquippedDecors((prev) => {
      let next;
      if (prev.includes(decorId)) {
        next = prev.filter((id) => id !== decorId);
        showToast('📦 ถอดของตกแต่งออกจากคอกแล้ว');
      } else {
        next = [...prev, decorId];
        const decor = BARN_DECORS[decorId];
        showToast(`✨ ติดตั้ง ${decor?.name || 'ของตกแต่ง'} ในคอกแล้ว!`);
      }
      try {
        localStorage.setItem('happy_hog_equipped_decors', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleUnequipAllDecors = () => {
    setEquippedDecors([]);
    try {
      localStorage.setItem('happy_hog_equipped_decors', JSON.stringify([]));
    } catch (e) {}
    showToast('🧹 ถอดของตกแต่งทุกชิ้นออกแล้ว คอกโล่งสะอาด 100%!');
  };

  const handleAutoLayoutDecors = () => {
    const recommended = ['golden_palace_building', 'golden_fountain', 'stone_well', 'rose_hedge', 'pine_tree'].filter((id) =>
      unlockedDecors.includes(id)
    );
    setEquippedDecors(recommended);
    try {
      localStorage.setItem('happy_hog_equipped_decors', JSON.stringify(recommended));
    } catch (e) {}
    showToast('📐 จัดวางของตกแต่งรอบนอกตามหลักสถาปัตยกรรม (เว้นพื้นที่ตรงกลาง 40% ให้ลูกหมูวิ่งเล่น)!');
  };

  const handleBuyDecor = (decorId) => {
    const decor = BARN_DECORS[decorId];
    if (!decor) return;
    if (unlockedDecors.includes(decorId)) {
      showToast('ℹ️ คุณมีของตกแต่งชิ้นนี้อยู่แล้ว');
      return;
    }
    if (coins < decor.cost) {
      showToast(`❌ เหรียญไม่พอซื้อ ${decor.name}! (ต้องการ ${decor.cost.toLocaleString()} 🪙)`);
      return;
    }
    setCoins((c) => {
      const nextCoins = c - decor.cost;
      try {
        localStorage.setItem('happy_hog_coins', nextCoins.toString());
      } catch (e) {}
      return nextCoins;
    });
    setUnlockedDecors((prev) => {
      const next = [...prev, decorId];
      try {
        localStorage.setItem('happy_hog_unlocked_decors', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setEquippedDecors((prev) => {
      const next = [...prev, decorId];
      try {
        localStorage.setItem('happy_hog_equipped_decors', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    playSound('fanfare', isMuted);
    showToast(`🎉 ซื้อและติดตั้ง ${decor.name} สำเร็จ! (-${decor.cost} 🪙)`);
  };

  const handleFeed = (food) => {
    if (!selectedPig) return;
    if (coins < food.cost) {
      showToast('❌ เหรียญไม่พอซื้ออาหาร!');
      return;
    }
    if (energy < 1) {
      showToast('⚡ พลังงานไม่เพียงพอ! (ต้องการ 1 ⚡) รอฟื้นฟูหรือตรวจการฟาร์ม');
      return;
    }

    setCoins((c) => c - food.cost);
    handleDirectFeed(selectedPig, food);
    showToast(`🍽️ ซื้อ ${food.name} ให้น้องกิน (+${food.weightGain} kg, -1 ⚡)`);
  };

  const handleBath = () => {
    if (!selectedPig) return;
    if (energy < 1) {
      showToast('⚡ พลังงานไม่เพียงพอ! (ต้องการ 1 ⚡) รอฟื้นฟูหรือตรวจการฟาร์ม');
      return;
    }
    setEnergy((e) => Math.max(0, e - 1));
    playSound('bubble', isMuted);
    triggerPigJoy(selectedPig.id);
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

    showToast('🧼 อาบน้ำในอ่างไม้หอมฉุย ตัวสะอาด 100%! (+10 EXP, -1 ⚡)');
  };

  const handleVaccine = () => {
    if (!selectedPig) return;
    if (coins < 20) {
      showToast('❌ เหรียญไม่พอค่ายา (ต้องการ 20 เหรียญ)');
      return;
    }
    if (energy < 2) {
      showToast('⚡ พลังงานไม่เพียงพอ! (ต้องการ 2 ⚡) รอฟื้นฟูหรือตรวจการฟาร์ม');
      return;
    }
    setEnergy((e) => Math.max(0, e - 2));
    setCoins((c) => c - 20);
    playSound('heal', isMuted);
    triggerPigJoy(selectedPig.id);
    setPigs((prev) =>
      prev.map((p) => (p.id === selectedPig.id ? { ...p, health: 100 } : p))
    );
    addExp(15);
    showToast('💉 ฉีดยาป้องกันโรคเรียบร้อย สุขภาพแข็งแรง 100%! (+15 EXP, -2 ⚡)');
  };

  const handleDrinkWater = () => {
    if (!selectedPig) return;
    if (energy < 1) {
      showToast('⚡ พลังงานไม่เพียงพอ! (ต้องการ 1 ⚡)');
      return;
    }
    setEnergy((e) => Math.max(0, e - 1));
    playSound('bubble', isMuted);
    triggerPigJoy(selectedPig.id);
    setPigs((prev) =>
      prev.map((p) => (p.id === selectedPig.id ? { ...p, health: Math.min(100, p.health + 20) } : p))
    );
    addExp(5);
    setHearts((h) => [...h, { id: Date.now(), x: selectedPig.x, y: selectedPig.y - 12 }]);
    setTimeout(() => setHearts((h) => h.slice(1)), 1200);
    showToast(`🚰 น้องดื่มน้ำจากก๊อกน้ำธรรมชาติ สดชื่นกระปรี้กระเปร่า! (+5 EXP, -1 ⚡)`);
  };

  const handleSellPig = (pig) => {
    if (pigs.length <= 1) {
      showToast('⚠️ ไม่ควรขายหมูตัวสุดท้าย เดี๋ยวฟาร์มจะร้างนะ!');
      return;
    }

    const breed = PIG_BREEDS[pig.breed] || PIG_BREEDS.pink;
    let priceMultiplier = 1.0;
    if (activeThemeId === 'golden_palace') priceMultiplier = 1.25;

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
    const coord = getRandomCoordInBarn(activeThemeId);

    const newPig = {
      id: Date.now(),
      name: `${randomName} #${pigs.length + 1}`,
      breed: breedKey,
      weight: 18,
      hunger: 90,
      cleanliness: 100,
      health: 100,
      x: coord.x,
      y: coord.y,
      direction: 1
    };

    setPigs((prev) => [...prev, newPig]);
    setSelectedPigId(newPig.id);
    addExp(20);
    showToast(`🎉 ยินดีด้วย! ได้ต้อนรับลูกหมูใหม่: ${PIG_BREEDS[breedKey].name}`);
  };

  const handleBuyPigletDiamond = (breedKey, diamondCost) => {
    if (diamonds < diamondCost) {
      showToast(`❌ เพชรไม่พอซื้อลูกหมูพันธุ์พิเศษนี้! (ต้องการ ${diamondCost} 💎)`);
      setShowDiamondShopModal(true);
      return;
    }
    if (pigs.length >= maxPigs) {
      showToast(`⚠️ คอกหมูเต็มแล้ว! (รับได้สูงสุด ${maxPigs} ตัว) ขยายขนาดคอกหมูก่อนนะ!`);
      setShowBarnUpgradeModal(true);
      return;
    }

    setDiamonds((d) => d - diamondCost);
    playSound('fanfare', isMuted);

    const names = ['มังกรหยกประทานพร', 'วิหคเพลิงนำโชค', 'เทวาจักรวาลเรืองแสง', 'ซาโตชิตัวตึง', 'ราชาอสูรไททัน', 'เทพธิดาจันทราเพชร'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const coord = getRandomCoordInBarn(activeThemeId);

    const newPig = {
      id: Date.now(),
      name: `${randomName} #${pigs.length + 1}`,
      breed: breedKey,
      weight: 25,
      hunger: 100,
      cleanliness: 100,
      health: 100,
      x: coord.x,
      y: coord.y,
      direction: 1
    };

    setPigs((prev) => [...prev, newPig]);
    setSelectedPigId(newPig.id);
    if (!unlockedBreeds.includes(breedKey)) {
      setUnlockedBreeds((prev) => [...prev, breedKey]);
    }
    addExp(100);
    setCelebrationReward({
      title: '💎 อัญเชิญหมูเทพสำเร็จ!',
      badge: 'DIAMOND EXCLUSIVE BREED',
      subtitle: `ยินดีต้อนรับ ${PIG_BREEDS[breedKey].name} สู่ฟาร์ม`,
      rewardText: `ได้รับ: ${PIG_BREEDS[breedKey].name} & +100 EXP ⭐`,
      icon: '💎',
      color: '#8b5cf6'
    });
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

    if (energy < 5) {
      showToast('⚡ พลังงานไม่เพียงพอ! เข้าห้องแล็บผสมพันธุ์ต้องการ 5 ⚡');
      return;
    }
    setEnergy((e) => Math.max(0, e - 5));
    setCoins((c) => c - 80);
    playSound('coin', isMuted);

    // Ultra-rare drop chance for diamond breeds: 1.5% as requested by user
    const diamondBreedKeys = ['jade_dragon', 'phoenix', 'galaxy', 'cyber_satoshi', 'inferno_titan', 'diamond_angel'];
    const hasAngel = (p1.breed === 'diamond_angel' || p2.breed === 'diamond_angel');
    const mythicThreshold = hasAngel ? 0.03 : 0.015; // 1.5% base, 3% with diamond_angel

    const mythicRoll = Math.random();
    let resultBreed = 'pink';
    let isMythicJackpot = false;

    if (mythicRoll < mythicThreshold) {
      isMythicJackpot = true;
      resultBreed = diamondBreedKeys[Math.floor(Math.random() * diamondBreedKeys.length)];
    } else {
      const roll = Math.random();
      if (roll > 0.92) resultBreed = 'knight';
      else if (roll > 0.8) resultBreed = 'rainbow';
      else if (roll > 0.65) resultBreed = 'golden';
      else if (roll > 0.5) resultBreed = 'shabu';
      else if (roll > 0.35) resultBreed = 'sakura';
      else if (roll > 0.2) resultBreed = 'engineer';
      else if (roll > 0.1) resultBreed = 'auditor';
    }

    const coord = getRandomCoordInBarn(activeThemeId);
    const babyId = Date.now();
    const baby = {
      id: babyId,
      name: isMythicJackpot ? `ลูกหมูเทพ (${PIG_BREEDS[resultBreed].tag})` : `ลูกหมูพันธุกรรม (${PIG_BREEDS[resultBreed].tag})`,
      breed: resultBreed,
      weight: 15,
      hunger: 100,
      cleanliness: 100,
      health: 100,
      x: coord.x,
      y: coord.y,
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
    addExp(isMythicJackpot ? 200 : 50);

    if (!unlockedBreeds.includes(resultBreed)) {
      setUnlockedBreeds((prev) => [...prev, resultBreed]);
    }

    playSound('fanfare', isMuted);
    if (isMythicJackpot) {
      setCelebrationReward({
        title: '💎 มหาแจ็กพอตหมูเทพในตำนานกำเนิด! (1.5%)',
        badge: 'ULTRA RARE MYTHIC JACKPOT!',
        subtitle: `ปาฏิหาริย์พันธุกรรมขั้นสูงสุดจาก ${p1.name} & ${p2.name}`,
        rewardText: `ได้รับ: ${PIG_BREEDS[resultBreed].name} (มูลค่า ${PIG_BREEDS[resultBreed].diamondCost} 💎) & +200 EXP!`,
        icon: '💎',
        color: '#8b5cf6'
      });
    } else {
      setCelebrationReward({
        title: '🧬 ผสมพันธุ์ลูกหมูสำเร็จ!',
        badge: 'NEW PIGLET BORN!',
        subtitle: `สายเลือดจาก ${p1.name} & ${p2.name}`,
        rewardText: `ได้รับ: ${PIG_BREEDS[resultBreed].name} & +50 EXP`,
        icon: '🐷',
        color: 'from-purple-500 to-indigo-600'
      });
    }
  };

  const handlePlantCrop = (plotId, seedKey) => {
    const meta = CROPS_META[seedKey];
    if (coins < meta.seedCost) {
      showToast(`❌ เหรียญไม่พอซื้อเมล็ดพันธุ์ (ต้องการ ${meta.seedCost} เหรียญ)`);
      return;
    }
    if (energy < 1) {
      showToast('⚡ พลังงานไม่พอปลูกพืช! (ต้องการ 1 ⚡) รอฟื้นฟูหรือตรวจการฟาร์ม');
      return;
    }

    setEnergy((e) => Math.max(0, e - 1));
    setCoins((c) => c - meta.seedCost);
    playSound('plant', isMuted);

    setCrops((prev) =>
      prev.map((plot) =>
        plot.id === plotId
          ? { id: plotId, seed: seedKey, plantedAt: Date.now(), duration: meta.duration }
          : plot
      )
    );
    showToast(`🌱 หว่านเมล็ด "${meta.name}" แล้ว! (รอ ${meta.duration} วินาที, -1 ⚡)`);
  };

  const handleHarvestCrop = (plotId) => {
    const plot = crops.find((p) => p.id === plotId);
    if (!plot || !plot.seed) return;
    if (energy < 1) {
      showToast('⚡ พลังงานไม่พอเก็บเกี่ยว! (ต้องการ 1 ⚡) รอฟื้นฟูหรือตรวจการฟาร์ม');
      return;
    }

    setEnergy((e) => Math.max(0, e - 1));
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
    showToast(`🧺 เก็บเกี่ยว "${meta.name}" ได้ผลผลิต +${meta.yieldCount} ถุง & +15 EXP! (-1 ⚡)`);
  };

  const handleCollectYardDrop = (e, drop) => {
    e.stopPropagation();
    if (energy < 1) {
      showToast('⚡ พลังงานไม่พอเก็บกวาด! (ต้องการ 1 ⚡) รอฟื้นฟูหรือตรวจการฟาร์ม');
      return;
    }

    setEnergy((e) => Math.max(0, e - 1));
    setYardDrops((prev) => prev.filter((d) => d.id !== drop.id));
    setCoins((c) => c + drop.reward);
    advanceQuest('clean', 1);
    addExp(8);
    playSound('coin', isMuted);
    showToast(`✨ เก็บ ${drop.label} สะอาดเอี่ยม! ได้รับ +${drop.reward} 🪙 & +8 EXP (-1 ⚡)`);
  };

  const handleClaimQuest = (quest) => {
    if (quest.current < quest.target || quest.claimed) return;
    if (quest.rewardCoins) setCoins((c) => c + quest.rewardCoins);
    if (quest.rewardEnergy) setEnergy((e) => Math.min(maxEnergy, e + quest.rewardEnergy));
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
      name: 'มหาแจ็กพอตเพชรแท้ อปท.',
      shortLabel: '+50 💎',
      icon: '💎',
      rewardDesc: '🎉 มหาแจ็กพอต 50 เพชรแท้ 💎!',
      color: '#8b5cf6',
      sliceGrad: ['#8b5cf6', '#7c3aed'],
      textColor: '#ffffff',
      diamonds: 50
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
      if (won.diamonds) setDiamonds((d) => d + won.diamonds);
      if (won.energy) setEnergy((e) => Math.min(maxEnergy, e + won.energy));
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
    if (energy < 5) {
      showToast('⚡ พลังงานไม่พอสำหรับปฏิบัติการย่องเบา (ต้องการ 5 พลังงาน)');
      return;
    }
    if (pigs.length >= maxPigs) {
      showToast(`⚠️ คอกหมูของเราเต็มแล้ว (จุได้สูงสุด ${maxPigs} ตัว) ขยายขนาดคอกหมูก่อนนะ!`);
      return;
    }

    setEnergy((e) => Math.max(0, e - 5));

    if (neighbor.isLocked) {
      playSound('bark', isMuted);
      showToast(`🐶 สุนัขเฝ้าบ้านเห่ากรรโชก! รั้วล็อกแน่นหนา แอบเข้าไปไม่ได้ รีบหนีเร็วก่อนโดนจับ!`);
      return;
    }

    const roll = Math.random();
    if (roll < 0.8) {
      playSound('steal', isMuted);
      const targetPig = neighbor.pigs[Math.floor(Math.random() * neighbor.pigs.length)];
      const coord = getRandomCoordInBarn(activeThemeId);
      const stolenBaby = {
        id: Date.now(),
        name: `หมูอุ้มจาก${neighbor.name}`,
        breed: targetPig.breed,
        weight: Math.round(targetPig.weight * 0.6),
        hunger: 80,
        cleanliness: 90,
        health: 100,
        x: coord.x,
        y: coord.y,
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
    if (energy < 3) {
      showToast('⚡ พลังงานไม่พอ (ต้องการ 3 พลังงาน)');
      return;
    }
    setEnergy((e) => Math.max(0, e - 3));
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
      const coord = getRandomCoordInBarn(activeThemeId);
      const bonusPig = {
        id: Date.now(),
        name: `หมูทองคำรางวัลล็อกอิน`,
        breed: reward.grantPig,
        weight: 25,
        hunger: 100,
        cleanliness: 100,
        health: 100,
        x: coord.x,
        y: coord.y,
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
    const targetBounds = theme?.bounds || { minX: 25, maxX: 72, minY: 40, maxY: 72 };

    const clampPigsToTheme = () => {
      setPigs((prev) =>
        prev.map((p) => {
          const clampedX = Math.max(targetBounds.minX + 2, Math.min(targetBounds.maxX - 2, p.x));
          const clampedY = Math.max(targetBounds.minY + 2, Math.min(targetBounds.maxY - 2, p.y));
          return { ...p, x: Math.round(clampedX), y: Math.round(clampedY) };
        })
      );
    };

    if (unlockedThemes.includes(themeKey)) {
      setActiveThemeId(themeKey);
      clampPigsToTheme();
      playSound('feed', isMuted);
      showToast(`🎨 เปลี่ยนธีมคอกเป็น: "${theme.name}" เรียบร้อยแล้ว!`);
      setShowThemeModal(false);
      return;
    }

    if (theme.isDiamondTheme) {
      if (diamonds < theme.diamondCost) {
        showToast(`❌ เพชรไม่พอปลดล็อกธีมนี้ (ต้องการ ${theme.diamondCost} 💎)`);
        setShowDiamondShopModal(true);
        return;
      }
      setDiamonds((d) => d - theme.diamondCost);
    } else {
      if (coins < theme.cost) {
        showToast(`❌ เหรียญไม่พอปลดล็อกธีมนี้ (ต้องการ ${theme.cost} ฿)`);
        return;
      }
      setCoins((c) => c - theme.cost);
    }

    setUnlockedThemes((prev) => [...prev, themeKey]);
    setActiveThemeId(themeKey);
    clampPigsToTheme();
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
          {/* Avatar and Level Title with EXP Progress (Inspired by Reference Game) */}
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-2 border-amber-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
                🐷
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-amber-200 shadow-md flex items-center space-x-0.5">
                <span>Lv.{farmLevel}</span>
                <span className="text-[8px]">⭐</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-amber-100 text-sm font-mono tracking-tight drop-shadow-sm">PIGGY TOWN</span>
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5" title={`EXP ฟาร์ม: ${farmExp}/${expForNextLevel}`}>
                <div className="w-20 sm:w-24 h-2 bg-slate-950/80 rounded-full overflow-hidden border border-amber-500/50 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, (farmExp / expForNextLevel) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] text-amber-300 font-mono font-bold">{Math.round((farmExp / expForNextLevel) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Counters (Energy ⚡, Coins 🪙, Diamonds 💎, Free Crops 🌾) */}
          <div className="flex items-center gap-2">
            {/* Energy Pill ⚡ (1 min / 1 energy with countdown) */}
            <div
              onClick={() => setShowAuditModal(true)}
              className="bg-gradient-to-b from-[#fefce8] to-[#fef08a] border-2 border-[#b45309] rounded-2xl px-2.5 py-1 flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title={`พลังงานฟาร์ม: ${energy}/${maxEnergy} (ฟื้นฟู +1 ทุก 1 นาที ${energy < maxEnergy ? `เหลือ ${energyCountdown}s` : 'เต็ม'}) แตะเพื่อตรวจการ อปท.`}
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-900 font-mono text-xs leading-none">
                  {energy}/{maxEnergy}
                </span>
                <span className="text-[8px] text-amber-800 font-mono font-bold leading-none mt-0.5">
                  {energy >= maxEnergy ? '⚡ เต็ม' : `⏳ +1 ใน ${energyCountdown}s`}
                </span>
              </div>
              <span className="bg-amber-500 group-hover:bg-amber-400 text-amber-950 font-black rounded-lg w-4 h-4 flex items-center justify-center text-[10px] shadow-xs ml-0.5 shrink-0">
                +
              </span>
            </div>

            {/* Coins Pill 🪙 */}
            <div
              onClick={() => setActiveTab('shop')}
              className="bg-gradient-to-b from-[#fefce8] to-[#fef08a] border-2 border-[#b45309] rounded-2xl px-2.5 py-1 flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title="เหรียญทองฟาร์ม (แตะเพื่อเปิดร้านค้า)"
            >
              <span className="text-base filter drop-shadow">🪙</span>
              <span className="font-black text-slate-900 font-mono text-xs">{coins.toLocaleString()}</span>
              <span className="bg-amber-500 group-hover:bg-amber-400 text-amber-950 font-black rounded-lg w-4 h-4 flex items-center justify-center text-[10px] shadow-xs ml-0.5 shrink-0">
                +
              </span>
            </div>

            {/* Diamonds 💎 - Styled identically to Pig Price Button */}
            <div
              onClick={() => setShowDiamondShopModal(true)}
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white border-2 border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.6)] rounded-2xl px-2.5 py-1 flex items-center space-x-1.5 shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95 group"
              title="คลังเพชรแท้ (คลิกเพื่อเปิดร้านค้าเพชร / เติมเงิน / แลกเหรียญ)"
            >
              <span className="text-sm filter drop-shadow-[0_0_4px_rgba(168,85,247,0.9)] group-hover:scale-110 transition-transform">💎</span>
              <span className="font-black text-white font-mono text-xs">{diamonds.toLocaleString()}</span>
              <span className="bg-amber-400 text-purple-950 font-black rounded-lg w-4 h-4 flex items-center justify-center text-[10px] shadow-xs group-hover:bg-yellow-300 ml-0.5 shrink-0">
                +
              </span>
            </div>

            {/* Free Crops Inventory Indicator */}
            <div
              onClick={() => { setInGameModal('crops'); playSound('bubble', isMuted); }}
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
              <span className="hidden sm:inline">เยี่ยมเพื่อน</span>
            </button>

            {/* Daily Farm Audit Inspection Button */}
            <button
              onClick={() => setShowAuditModal(true)}
              className="px-2.5 py-1 bg-gradient-to-b from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-black text-xs border-2 border-blue-400 shadow-xs flex items-center space-x-1 cursor-pointer transition-transform hover:scale-105"
              title="ระบบตรวจการฟาร์ม อปท. (รับรางวัลฟื้นฟูพลังงาน + เงินสนับสนุน + เพชร)"
            >
              <span>📋</span>
              <span className="hidden sm:inline">ตรวจการ อปท.</span>
              {Date.now() - lastAuditTime >= 1000 * 60 * 60 * 2 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
              )}
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
                className={`relative w-full ${isTheaterMode ? 'h-[calc(100vh-210px)] min-h-[580px]' : 'h-[540px]'} rounded-3xl overflow-hidden border-4 border-amber-900/80 shadow-2xl select-none transition-all`}
              >
                {/* 2.5D Isometric Open Pen Ground (Tilemap.exe EP.3) */}
                <CleanIsometricPenGround themeId={activeThemeId} />
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
                    {['✨', '⭐', '🌟', '✨', '⭐'].map((sp, i) => (
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

                {/* Pasture Meadow Fluttering Butterflies */}
                {activeTheme.atmosphere === 'butterflies' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {['🦋', '✨', '🌸', '🦋', '✨'].map((bf, i) => (
                      <span
                        key={i}
                        className="absolute text-xl animate-bounce opacity-85 drop-shadow-xs"
                        style={{
                          left: `${14 + i * 18}%`,
                          top: `${16 + (i % 2) * 16}%`,
                          animationDuration: `${2.2 + i * 0.4}s`
                        }}
                      >
                        {bf}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hotspot 1: Barn Cottage (Top-Left) */}
                <div
                  onClick={() => { setInGameModal('decor'); playSound('bubble', isMuted); }}
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

                
                {/* ================= EQUIPPED MODULAR BARN DECORS (Tilemap.exe EP.3 Kit) ================= */}
                {equippedDecors.map((decId) => {
                  const decor = BARN_DECORS[decId];
                  if (!decor) return null;
                  const pos = decor.defaultPos || { x: 50, y: 50 };
                  const zVal = decor.layer === 'back' ? 12 : decor.layer === 'front' ? 40 : Math.floor(pos.y * 10);
                  return (
                    <div
                      key={decor.id}
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: `translate(-50%, -100%) scale(${decor.scale || 1})`,
                        zIndex: zVal
                      }}
                      className="absolute pointer-events-auto cursor-pointer group transition-transform hover:scale-110 active:scale-95"
                      onClick={() => showToast(`🪴 ${decor.name}: ${decor.perk}`)}
                      title={`${decor.name} (${decor.perk}) - แตะเพื่อดูคุณสมบัติ`}
                    >
                      <DecorItemSprite decor={decor} isNight={activeThemeId === 'cyber_space'} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2b180d]/95 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap border border-amber-500/60 pointer-events-none shadow-lg z-50">
                        {decor.name}
                      </div>
                    </div>
                  );
                })}

                {/* ================= ROAMING CHIBI PIGS WITH SPEECH BUBBLES ================= */}
                {/* ================= ROAMING CHIBI PIGS WITH SPEECH BUBBLES ================= */}
                {pigs.map((pig) => {
                  const isSelected = selectedPigId === pig.id;
                  const need = getPigNeed(pig);
                  const isResting = pig.breedCooldownUntil && pig.breedCooldownUntil > currentTime;
                  const zIndexVal = Math.floor(pig.y * 10) + (isSelected ? 500 : 0);

                  const dropCfg = PIG_DROP_CONFIG[pig.breed] || PIG_DROP_CONFIG.pink;
                  const cycleMs = dropCfg.cycleSeconds * 1000;
                  const pigLastDrop = pig.lastDropTime || 0;
                  const isDropReady = (currentTime - pigLastDrop) >= cycleMs;

                  return (
                    <div
                      key={pig.id}
                      onClick={() => {
                        setSelectedPigId(pig.id);
                        if (isDropReady) {
                          handleCollectPigDrop(pig);
                        } else {
                          triggerPigJoy(pig.id);
                          playSound('oink', isMuted);
                        }
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
                      {/* 1. Floating Need Bubble - Scaled to Cute Chibi Size */}
                      {need && (
                        <div
                          onClick={(e) => handleBubbleClick(e, pig, need)}
                          className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-40 transition-transform hover:scale-125 active:scale-95 animate-bounce pointer-events-auto group/bubble select-none"
                          title={need.hint}
                        >
                          <div className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-md border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center text-lg transition-all ${
                            need.type === 'heal'
                              ? 'ring-2 sm:ring-3 ring-rose-400 shadow-[0_4px_14px_rgba(244,63,94,0.4)]'
                              : need.type === 'love'
                              ? 'ring-2 sm:ring-3 ring-pink-400 shadow-[0_4px_14px_rgba(236,72,153,0.4)]'
                              : 'ring-2 sm:ring-3 ring-emerald-400 shadow-[0_4px_14px_rgba(16,185,129,0.4)]'
                          }`}>
                            <span className="filter drop-shadow-xs">{need.icon}</span>
                          </div>
                          <div className={`w-2 h-2 bg-white border-r-2 border-b-2 rotate-45 -mt-1 shadow-xs ${
                            need.type === 'heal' ? 'border-rose-300' : need.type === 'love' ? 'border-pink-300' : 'border-emerald-300'
                          }`} />
                        </div>
                      )}

                      {/* 2. Sleek Compact Gift Indicator (No Cluttering Balloons) */}
                      {isDropReady && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCollectPigDrop(pig);
                          }}
                          className="absolute -top-6 -right-1.5 w-6 h-6 rounded-full bg-white/95 backdrop-blur-sm border-2 border-amber-400 shadow-md flex items-center justify-center text-xs animate-bounce cursor-pointer z-45 hover:scale-125 active:scale-90 transition-transform select-none"
                          title={`แตะเพื่อเก็บของขวัญจาก ${pig.name} (${dropCfg.title})`}
                        >
                          <span className="filter drop-shadow-xs">{dropCfg.isMythic ? '🔮' : '🎁'}</span>
                        </div>
                      )}

                      {/* 3. High-Fidelity 3D Chibi Illustrated Pig Sprite with Living Animations & Elemental Aura */}
                      <PigSprite
                        breed={pig.breed}
                        isSelected={isSelected}
                        direction={pig.direction}
                        weight={pig.weight}
                        isMoving={pig.isMoving}
                        isResting={isResting}
                        isTapped={tappedPigId === pig.id}
                      />

                      {/* 4. Clean Selection Marker & Subtle Resting Indicator */}
                      {isSelected && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-full border-2 border-amber-400/90 bg-amber-400/25 shadow-[0_0_12px_rgba(251,191,36,0.7)] animate-pulse pointer-events-none -z-10" />
                      )}
                      {isResting && (
                        <div
                          className="absolute -top-5 right-0 text-xs sm:text-sm animate-pulse pointer-events-none drop-shadow-md select-none"
                          title="กำลังพักฟื้นหลังคลอด"
                        >
                          💤
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Top Corner Controls (Pen Capacity Signpost + Fence Lock + Theme Pill) */}
                <div className="absolute top-2.5 left-4 z-25 flex items-center space-x-2">
                  {/* Wooden Pen Capacity Signpost (Inspired by Reference Game Image 4) */}
                  <div
                    onClick={() => setShowBarnUpgradeModal(true)}
                    className="relative bg-gradient-to-b from-[#854d0e] via-[#713f12] to-[#542d0c] border-2 border-amber-300 px-3 py-1 rounded-xl shadow-xl flex items-center space-x-2 text-white cursor-pointer hover:scale-105 active:scale-95 transition-all group select-none"
                    title={`ความจุคอกหมู: ${pigs.length}/${maxPigs} ตัว (แตะเพื่ออัปเกรดขยายคอก)`}
                  >
                    <span className="text-base filter drop-shadow">🐷</span>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-amber-300 font-bold leading-none">ความจุคอก</span>
                      <span className="font-mono font-black text-xs text-yellow-200 tracking-wide leading-tight">
                        {pigs.length}/{maxPigs}
                      </span>
                    </div>
                    <span className="bg-amber-400 group-hover:bg-yellow-300 text-amber-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-md ml-0.5">
                      +
                    </span>
                  </div>

                  {/* Fence Lock Status */}
                  <button
                    onClick={() => {
                      setIsLocked(!isLocked);
                      playSound('feed', isMuted);
                      showToast(isLocked ? '🔓 ปลดล็อกรั้วแล้ว ระวังเพื่อนแอบย่องมาอุ้ม!' : '🔒 ล็อกรั้วคอกแน่นหนาแล้ว ป้องกันการขโมย 100%');
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center space-x-1 border-2 shadow-md cursor-pointer transition-all ${
                      isLocked || activeThemeId === 'cyber_space'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-rose-600 text-white border-rose-400 animate-pulse'
                    }`}
                  >
                    {isLocked || activeThemeId === 'cyber_space' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span className="hidden sm:inline">{isLocked || activeThemeId === 'cyber_space' ? 'รั้วล็อกแล้ว' : 'รั้วยังไม่ล็อก'}</span>
                  </button>

                  {/* Barn Theme Switcher */}
                  <button
                    onClick={() => setShowThemeModal(true)}
                    className="px-2.5 py-1 bg-white/90 hover:bg-white text-slate-800 rounded-xl text-[10px] font-black border border-slate-300 shadow-sm flex items-center space-x-1 cursor-pointer"
                  >
                    <Palette className="w-3 h-3 text-emerald-600" />
                    <span>ธีม: {activeTheme.name}</span>
                  </button>
                </div>
              </div>

              {/* ================= IN-GAME MAIN MENU ACTION DOCK (HUD QUICK ACCESS) ================= */}
              <div className="bg-[#fffbeb] p-2 sm:p-2.5 rounded-2xl border-2 border-amber-700 shadow-md flex items-center justify-between gap-1.5 overflow-x-auto select-none">
                <div className="flex items-center space-x-1.5 text-xs font-black text-amber-950 px-1 shrink-0">
                  <span className="text-base animate-pulse">🎮</span>
                  <span className="hidden sm:inline font-mono">เมนูฟาร์ม:</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1 justify-end overflow-x-auto py-0.5">
                  {pigs.some((p) => (currentTime - (p.lastDropTime || 0)) >= ((PIG_DROP_CONFIG[p.breed] || PIG_DROP_CONFIG.pink).cycleSeconds * 1000)) && (
                    <button
                      onClick={handleCollectAllPigDrops}
                      className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-md border border-yellow-300 active:scale-95 transition-all cursor-pointer shrink-0 animate-pulse"
                      title="กดเก็บของขวัญจากหมูทุกตัวที่พร้อมในคลิกเดียว!"
                    >
                      <span>🎁</span>
                      <span>เก็บของขวัญทั้งหมด</span>
                    </button>
                  )}
                  <button
                    onClick={() => { setInGameModal('shop'); playSound('bubble', isMuted); }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black text-xs rounded-xl shadow-xs border border-amber-600 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="เปิดร้านค้าหมู อาหาร และของตกแต่ง"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-950" />
                    <span>ร้านค้า</span>
                  </button>

                  <button
                    onClick={() => { setInGameModal('crops'); playSound('bubble', isMuted); }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs rounded-xl shadow-xs border border-emerald-700 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="เปิดแปลงปลูกผักและเก็บเกี่ยวอาหารฟรี"
                  >
                    <Sprout className="w-3.5 h-3.5 text-emerald-100" />
                    <span>แปลงผัก</span>
                  </button>

                  <button
                    onClick={() => { setInGameModal('quests'); playSound('bubble', isMuted); }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-xs border border-indigo-700 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="เปิดรายการภารกิจประจำวัน"
                  >
                    <Award className="w-3.5 h-3.5 text-indigo-100" />
                    <span>ภารกิจ</span>
                  </button>

                  <button
                    onClick={() => { setInGameModal('breed'); playSound('bubble', isMuted); }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs rounded-xl shadow-xs border border-purple-700 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="เปิดห้องแล็บผสมพันธุ์หมู"
                  >
                    <Dna className="w-3.5 h-3.5 text-purple-100" />
                    <span>ผสมพันธุ์</span>
                  </button>

                  <button
                    onClick={() => { setInGameModal('decor'); playSound('bubble', isMuted); }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-xs border border-teal-700 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="จัดการของตกแต่งคอกหมูและสถาปัตยกรรม"
                  >
                    <Palette className="w-3.5 h-3.5 text-teal-100" />
                    <span>ตกแต่งคอก</span>
                  </button>

                  <button
                    onClick={() => { setShowWheelModal(true); playSound('bubble', isMuted); }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-black text-xs rounded-xl shadow-xs border border-rose-700 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="หมุนวงล้อหมูนำโชค ลุ้นรับเพชรและของรางวัล"
                  >
                    <span>🎡</span>
                    <span>วงล้อหมู</span>
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

                  {/* Periodic Gift Drop Card & Claim Button */}
                  {(() => {
                    const dropCfg = PIG_DROP_CONFIG[selectedPig.breed] || PIG_DROP_CONFIG.pink;
                    const cycleMs = dropCfg.cycleSeconds * 1000;
                    const lastDrop = selectedPig.lastDropTime || 0;
                    const elapsed = currentTime - lastDrop;
                    const isReady = elapsed >= cycleMs;
                    const remainingSec = Math.max(0, Math.ceil((cycleMs - elapsed) / 1000));
                    const progressPct = Math.min(100, Math.round((elapsed / cycleMs) * 100));

                    return (
                      <div className={`p-2.5 rounded-2xl border-2 transition-all ${
                        isReady
                          ? dropCfg.isMythic
                            ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                            : 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-400 shadow-md'
                          : 'bg-white/80 border-amber-200 shadow-xs'
                      }`}>
                        <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
                          <span className="flex items-center space-x-1.5">
                            <span className="text-base">{dropCfg.icon}</span>
                            <span className="text-slate-900 font-black">{dropCfg.title}</span>
                          </span>
                          {isReady ? (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                              dropCfg.isMythic ? 'bg-purple-600 text-white border-purple-400 animate-pulse' : 'bg-emerald-600 text-white border-emerald-400 animate-bounce'
                            }`}>
                              พร้อมเก็บรับ!
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono text-[10px] bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                              อีก {Math.floor(remainingSec / 60)}:{(remainingSec % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        {isReady ? (
                          <button
                            onClick={() => handleCollectPigDrop(selectedPig)}
                            className={`w-full py-1.5 px-3 rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all text-white cursor-pointer ${
                              dropCfg.isMythic
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-300'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 shadow-amber-300'
                            }`}
                          >
                            <span>🎁</span>
                            <span>แตะเก็บรับรางวัล ({dropCfg.isMythic ? 'มีโอกาสได้เพชร 💎' : 'เหรียญ/EXP'})</span>
                          </button>
                        ) : (
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300">
                            <div
                              className={`h-full transition-all duration-300 ${
                                dropCfg.isMythic ? 'bg-purple-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}

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
            <div className="flex flex-wrap items-center justify-between gap-3 text-amber-200">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-amber-100 font-mono flex items-center space-x-2">
                  <span>🏪</span>
                  <span>ตลาดซื้อขายลูกหมู อปท. & คลังสัตว์เทพ</span>
                </h2>
                <p className="text-xs text-amber-300">
                  เลือกซื้อลูกหมูสายพันธุ์ทั่วไป (เหรียญทอง) หรืออัญเชิญสัตว์เทพในตำนาน (เพชรแท้ 💎)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-amber-950/80 border border-amber-600 text-amber-300 rounded-xl text-xs font-mono font-bold">
                  🪙 {coins.toLocaleString()} ฿
                </div>
                <div
                  onClick={() => setShowDiamondShopModal(true)}
                  className="px-3 py-1 bg-purple-950/90 hover:bg-purple-900 border border-purple-500 text-purple-200 rounded-xl text-xs font-mono font-bold cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center space-x-1"
                  title="คลิกเพื่อเติมเพชรหรือแลกเหรียญ"
                >
                  <span>💎 {diamonds.toLocaleString()}</span>
                  <span className="bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold ml-1">+</span>
                </div>
              </div>
            </div>

            {/* Main Shop Mode Tabs */}
            <div className="flex items-center space-x-2 bg-amber-900/80 p-1.5 rounded-2xl border border-amber-700">
              <button
                onClick={() => setShopCategoryTab('pigs')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  shopCategoryTab === 'pigs'
                    ? 'bg-amber-400 text-amber-950 shadow-md font-black'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <span>🐷 ตลาดลูกหมู</span>
              </button>
              <button
                onClick={() => setShopCategoryTab('decors')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  shopCategoryTab === 'decors'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-black'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <span>🪴 ของตกแต่งคอกหมู (ใช้เหรียญ)</span>
              </button>
            </div>

            {shopCategoryTab === 'decors' ? (
              <div className="space-y-4">
                {/* Decor Category Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-[#2b180d]/80 p-2.5 rounded-2xl border border-amber-700">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'ทั้งหมด (15 ชิ้น)' },
                      { id: 'tree', label: '🌲 ต้นไม้' },
                      { id: 'building', label: '🍄 สิ่งปลูกสร้าง' },
                      { id: 'light', label: '🏮 โคมไฟ' },
                      { id: 'flora', label: '🪻 พืชพรรณ' },
                      { id: 'water', label: '♨️ บ่อน้ำ/น้ำพุ' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setDecorCategoryFilter(f.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          decorCategoryFilter === f.id
                            ? 'bg-amber-500 text-amber-950 font-black shadow-xs'
                            : 'bg-black/30 text-amber-200 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleAutoLayoutDecors}
                      className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5 active:scale-95"
                      title="จัดวางของตกแต่งรอบคอกตามหลัก Tilemap.exe Night Camp EP.3 เพื่อเปิดพื้นที่กลางให้หมู"
                    >
                      <span>📐</span>
                      <span>จัดวางอัตโนมัติ (Tilemap)</span>
                    </button>
                    <button
                      onClick={handleUnequipAllDecors}
                      className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-500 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5 active:scale-95"
                      title="ถอดของตกแต่งทุกชิ้นออกเพื่อให้คอกหมูโล่ง 100%"
                    >
                      <span>🧹</span>
                      <span>ถอดออกทั้งหมด (คอกโล่ง 100%)</span>
                    </button>
                  </div>
                </div>

                {/* Decors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  {Object.values(BARN_DECORS)
                    .filter((d) => decorCategoryFilter === 'all' || d.category === decorCategoryFilter)
                    .map((item) => {
                      const isUnlocked = unlockedDecors.includes(item.id);
                      const isEquipped = equippedDecors.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          className="bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] rounded-2xl border-2 border-amber-600 p-3 flex flex-col justify-between items-center text-center shadow-md space-y-2 hover:border-amber-500 transition-all"
                        >
                          <div className="w-full flex justify-between items-center text-[10px] text-amber-800 font-bold">
                            <span className="bg-amber-200/90 px-2 py-0.5 rounded-full">{item.tag}</span>
                            {isEquipped ? (
                              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                                ติดตั้งอยู่
                              </span>
                            ) : isUnlocked ? (
                              <span className="bg-slate-300 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                                ในคลัง
                              </span>
                            ) : null}
                          </div>

                          <div className="h-24 flex items-center justify-center my-1">
                            <DecorItemSprite decor={item} isNight={false} />
                          </div>

                          <div className="space-y-0.5 w-full">
                            <div className="font-black text-slate-900 text-xs truncate" title={item.name}>
                              {item.name}
                            </div>
                            <div className="text-[10px] text-amber-900 line-clamp-2 h-7 font-medium" title={item.perk}>
                              {item.perk}
                            </div>
                          </div>

                          <div className="w-full pt-1.5 border-t border-amber-300/80">
                            {isUnlocked ? (
                              <button
                                onClick={() => handleToggleEquipDecor(item.id)}
                                className={`w-full py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                                  isEquipped
                                    ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                                }`}
                              >
                                {isEquipped ? '📦 ถอดเก็บเข้าคลัง' : '✨ ติดตั้งในคอก'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBuyDecor(item.id)}
                                className="w-full py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 border border-amber-600 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1"
                              >
                                <span>ซื้อ {item.cost.toLocaleString()} 🪙</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <>
            {/* Shop Category Tabs */}
            <div className="flex items-center space-x-2 bg-amber-950/70 p-1.5 rounded-2xl border border-amber-800/80">
              <button
                onClick={() => setShopFilter('all')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  shopFilter === 'all'
                    ? 'bg-amber-500 text-amber-950 shadow-sm'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                🌟 ทั้งหมด (14 สายพันธุ์)
              </button>
              <button
                onClick={() => setShopFilter('coin')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  shopFilter === 'coin'
                    ? 'bg-amber-500 text-amber-950 shadow-sm'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                🪙 สายพันธุ์ทั่วไป (8 พันธุ์)
              </button>
              <button
                onClick={() => setShopFilter('diamond')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  shopFilter === 'diamond'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                💎 สัตว์เทพเพชรแท้ (6 พันธุ์)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(PIG_BREEDS)
                .filter((breed) => {
                  if (shopFilter === 'coin') return !breed.isDiamondBreed;
                  if (shopFilter === 'diamond') return breed.isDiamondBreed;
                  return true;
                })
                .map((breed) => {
                  const isUnlocked = unlockedBreeds.includes(breed.id) || breed.isDiamondBreed;

                  return (
                    <div
                      key={breed.id}
                      className={`rounded-2xl p-4 border-3 flex flex-col justify-between space-y-3 transition-all ${
                        breed.isDiamondBreed
                          ? 'bg-gradient-to-b from-[#faf5ff] to-[#f3e8ff] border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-102'
                          : isUnlocked
                          ? 'bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] border-amber-500 shadow-md'
                          : 'bg-slate-200/90 border-slate-400 opacity-80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${breed.badgeColor}`}>
                            {breed.tag}
                          </span>
                          <span className={`text-xs font-mono font-black ${breed.isDiamondBreed ? 'text-purple-700' : 'text-amber-800'}`}>
                            {breed.pricePerKg} ฿/kg
                          </span>
                        </div>

                        {/* 3D Chibi Sprite Illustration */}
                        <div className="py-2 flex items-center justify-center">
                          <PigSprite breed={breed.id} isSelected={false} direction={1} weight={breed.maxWeight * 0.4} />
                        </div>

                        <h3 className="font-black text-slate-900 mt-1 font-mono text-sm text-center flex items-center justify-center space-x-1">
                          {breed.isDiamondBreed && <span>💎</span>}
                          <span>{breed.name}</span>
                        </h3>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed text-center">
                          {breed.description}
                        </p>

                        {breed.specialPerk && (
                          <div className="mt-1.5 p-1.5 bg-purple-100/80 rounded-xl border border-purple-300 text-[10px] font-bold text-purple-900 text-center">
                            ⚡ พลังพิเศษ: {breed.specialPerk}
                          </div>
                        )}

                        <div className="text-[10px] text-slate-700 font-bold mt-2 text-center">
                          น้ำหนักสูงสุด: <b>{breed.maxWeight} kg</b>
                        </div>
                      </div>

                      {breed.isDiamondBreed ? (
                        <button
                          onClick={() => handleBuyPigletDiamond(breed.id, breed.diamondCost)}
                          className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 shadow-[0_3px_0_#4c1d95] active:translate-y-0.5 active:shadow-none cursor-pointer transition-transform hover:scale-101"
                        >
                          <Gem className="w-3.5 h-3.5 text-purple-200 fill-purple-300" />
                          <span>อัญเชิญด้วยเพชร ({breed.diamondCost} 💎)</span>
                        </button>
                      ) : isUnlocked ? (
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
              </>
            )}
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
                    <div className="font-black text-amber-900 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>โอกาสได้รับสายพันธุ์พิเศษจากการผสมพันธุ์:</span>
                      </div>
                      <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">
                        💎 มีโอกาสดรอปหมูเพชร!
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="text-purple-700 font-black">• 💎 สัตว์เทพเพชรแท้ (Mythic): <b>1.5% JACKPOT!</b></div>
                      <div>• หมูองค์รักษ์พิทักษ์ อปท. (Mythic): <b>8%</b></div>
                      <div>• หมูสายรุ้ง สตง. (Legendary): <b>12%</b></div>
                      <div>• หมูพัสดุทองคำแท้ (Epic): <b>15%</b></div>
                      <div>• หมูชาบูกระทะทอง (Epic): <b>15%</b></div>
                      <div>• หมูซากุระ & ช่าง & ผู้ตรวจ: <b>48.5%</b></div>
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

            {/* ================= IN-GAME ACTION MODAL OVERLAY (HUD FULL SYSTEM INTEGRATION) ================= */}
      {inGameModal && (
        <div
          onClick={() => setInGameModal(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in-50 duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] border-4 border-amber-800 rounded-3xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto select-none"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-300 pb-3 gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-600 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  {inGameModal === 'shop' && '🏪'}
                  {inGameModal === 'crops' && '🌱'}
                  {inGameModal === 'quests' && '📜'}
                  {inGameModal === 'breed' && '🧬'}
                  {inGameModal === 'decor' && '🪴'}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-950 font-mono leading-tight">
                    {inGameModal === 'shop' && 'ร้านค้าฟาร์มหมู & ของตกแต่งคอก'}
                    {inGameModal === 'crops' && 'แปลงปลูกพืชผักและคลังผลผลิต (Farm Patch)'}
                    {inGameModal === 'quests' && 'ภารกิจประจำวัน (Daily Quests)'}
                    {inGameModal === 'breed' && 'ห้องแล็บผสมพันธุ์หมู (Breeding Lab)'}
                    {inGameModal === 'decor' && 'สถาปัตยกรรม & จัดการของตกแต่งคอกหมู'}
                  </h3>
                  <p className="text-[11px] text-amber-800 font-bold leading-none mt-0.5">
                    {inGameModal === 'shop' && 'เลือกซื้อลูกหมู อาหาร ยาปฏิชีวนะ และของตกแต่งแยกชิ้นด้วยเหรียญ'}
                    {inGameModal === 'crops' && 'ปลูกผัก เก็บเกี่ยวมาทำอาหารเลี้ยงหมูได้ฟรีโดยไม่ต้องเสียเหรียญ!'}
                    {inGameModal === 'quests' && 'ทำภารกิจรายวันเพื่อรับเหรียญทองและค่าประสบการณ์ EXP ฟาร์ม'}
                    {inGameModal === 'breed' && 'จับคู่พ่อพันธุ์แม่พันธุ์เพื่อค้นพบสายพันธุ์ใหม่และลุ้นรับสัตว์เทพ 1.5%!'}
                    {inGameModal === 'decor' && 'จัดวางของประดับตามแนวทาง Tilemap.exe Night Camp EP.3 เพื่อเปิดพื้นที่กลาง'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-amber-950/80 border border-amber-600 text-amber-300 rounded-xl text-xs font-mono font-bold">
                  <span>🪙 {(coins || 0).toLocaleString()}</span>
                </div>
                <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-purple-950/90 border border-purple-500 text-purple-200 rounded-xl text-xs font-mono font-bold">
                  <span>💎 {(diamonds || 0).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setInGameModal(null)}
                  className="p-1.5 rounded-xl hover:bg-amber-200 text-amber-900 border border-amber-400 bg-amber-100 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  title="ปิดหน้าต่าง"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODAL CONTENT: 1. SHOP */}
            {inGameModal === 'shop' && (
              <div className="space-y-3">
                {/* Mode Selector Tabs */}
                <div className="flex items-center space-x-2 bg-amber-950/80 p-1.5 rounded-2xl border border-amber-800">
                  <button
                    onClick={() => setShopCategoryTab('pigs')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      shopCategoryTab === 'pigs'
                        ? 'bg-amber-400 text-amber-950 shadow-sm'
                        : 'text-amber-200 hover:text-white'
                    }`}
                  >
                    🐷 ตลาดลูกหมู (14 พันธุ์)
                  </button>
                  <button
                    onClick={() => setShopCategoryTab('food')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      shopCategoryTab === 'food'
                        ? 'bg-amber-400 text-amber-950 shadow-sm'
                        : 'text-amber-200 hover:text-white'
                    }`}
                  >
                    🌾 อาหาร & ยาปฏิชีวนะ
                  </button>
                  <button
                    onClick={() => setShopCategoryTab('decors')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      shopCategoryTab === 'decors'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    🪴 ของตกแต่งคอก (เหรียญ)
                  </button>
                </div>

                {shopCategoryTab === 'pigs' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 bg-amber-200/80 p-1 rounded-xl text-xs font-bold text-amber-950">
                      <button
                        onClick={() => setShopFilter('all')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${shopFilter === 'all' ? 'bg-amber-600 text-white font-black' : 'text-amber-900'}`}
                      >
                        ทั้งหมด (14)
                      </button>
                      <button
                        onClick={() => setShopFilter('coin')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${shopFilter === 'coin' ? 'bg-amber-600 text-white font-black' : 'text-amber-900'}`}
                      >
                        🪙 ทั่วไป (8 พันธุ์)
                      </button>
                      <button
                        onClick={() => setShopFilter('diamond')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${shopFilter === 'diamond' ? 'bg-purple-600 text-white font-black' : 'text-purple-900'}`}
                      >
                        💎 สัตว์เทพ (6 พันธุ์)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                      {Object.values(PIG_BREEDS)
                        .filter((b) => {
                          if (shopFilter === 'coin') return !b.isDiamondBreed;
                          if (shopFilter === 'diamond') return b.isDiamondBreed;
                          return true;
                        })
                        .map((breed) => {
                          const isUnlocked = unlockedBreeds.includes(breed.id) || breed.isDiamondBreed;
                          return (
                            <div
                              key={breed.id}
                              className={`rounded-2xl p-3 border-2 flex flex-col justify-between space-y-2 shadow-sm ${
                                breed.isDiamondBreed
                                  ? 'bg-gradient-to-b from-[#faf5ff] to-[#f3e8ff] border-purple-400'
                                  : isUnlocked
                                  ? 'bg-white border-amber-400'
                                  : 'bg-slate-100 border-slate-300 opacity-80'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="font-mono text-amber-800">{breed.rarity}</span>
                                <span className="text-[10px] text-slate-500">โตสุด {breed.maxWeight} kg</span>
                              </div>

                              <div className="flex items-center space-x-2.5 my-1">
                                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                                  <img
                                    src={`/pigs/${breed.id}.png`}
                                    alt={breed.name}
                                    className="w-11 h-11 object-contain drop-shadow-sm"
                                  />
                                </div>
                                <div className="truncate">
                                  <div className="font-black text-slate-900 text-xs truncate">{breed.name}</div>
                                  <div className="text-[10px] text-slate-600 line-clamp-2">{breed.description}</div>
                                </div>
                              </div>

                              <div className="pt-1.5 border-t border-amber-200">
                                {breed.isDiamondBreed ? (
                                  <button
                                    onClick={() => handleBuyPigletDiamond(breed.id, breed.diamondCost)}
                                    className="w-full py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xs cursor-pointer active:scale-95 transition-all flex items-center justify-center space-x-1"
                                  >
                                    <span>อัญเชิญ ({breed.diamondCost} 💎)</span>
                                  </button>
                                ) : isUnlocked ? (
                                  <button
                                    onClick={() => handleBuyPiglet(breed.id, breed.buyCost || 100)}
                                    className="w-full py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 shadow-xs cursor-pointer active:scale-95 transition-all flex items-center justify-center space-x-1"
                                  >
                                    <span>ซื้อ {((breed.buyCost || 100)).toLocaleString()} 🪙</span>
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="w-full py-1.5 rounded-xl font-black text-xs bg-slate-200 text-slate-500 cursor-not-allowed text-center text-[10px]"
                                  >
                                    {breed.unlockDesc || 'ยังไม่ปลดล็อก'}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {shopCategoryTab === 'food' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {FOODS.map((food) => (
                      <div
                        key={food.id}
                        className="bg-white border-2 border-amber-400 rounded-2xl p-3 flex flex-col justify-between items-center text-center shadow-sm space-y-2"
                      >
                        <span className="text-4xl">{food.icon}</span>
                        <div>
                          <div className="font-black text-slate-900 text-xs">{food.name}</div>
                          <div className="text-[10px] text-amber-800 font-bold mt-0.5">
                            +{food.weightGain} kg | อิ่ม +{food.fullness}%
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (coins < food.cost) {
                              showToast('❌ เหรียญไม่พอซื้ออาหาร!');
                              return;
                            }
                            setCoins((c) => c - food.cost);
                            setCropInventory((inv) => ({ ...inv, [food.id]: (inv[food.id] || 0) + 1 }));
                            playSound('coin', isMuted);
                            showToast(`🌾 ซื้อ "${food.name}" เพิ่มเข้าคลังอาหารสำเร็จ!`);
                          }}
                          className="w-full py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-amber-950 border border-amber-600 shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          ซื้อ {food.cost} 🪙 เข้าคลัง
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {shopCategoryTab === 'decors' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#2b180d]/80 p-2 rounded-xl border border-amber-700 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {[
                          { id: 'all', label: 'ทั้งหมด' },
                          { id: 'tree', label: '🌲 ต้นไม้' },
                          { id: 'building', label: '🍄 อาคาร' },
                          { id: 'light', label: '🏮 โคมไฟ' },
                          { id: 'flora', label: '🪻 พืชพรรณ' },
                          { id: 'water', label: '♨️ บ่อน้ำ' }
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setDecorCategoryFilter(f.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              decorCategoryFilter === f.id
                                ? 'bg-amber-500 text-amber-950 font-black'
                                : 'bg-black/30 text-amber-200 hover:text-white'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={handleAutoLayoutDecors}
                          className="px-2.5 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 text-white font-black text-xs rounded-lg cursor-pointer flex items-center space-x-1"
                        >
                          <span>📐</span>
                          <span>จัดวางอัตโนมัติ (Tilemap)</span>
                        </button>
                        <button
                          onClick={handleUnequipAllDecors}
                          className="px-2.5 py-1 bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-500 text-white font-black text-xs rounded-lg cursor-pointer flex items-center space-x-1"
                        >
                          <span>🧹</span>
                          <span>ถอดออกทั้งหมด (คอกโล่ง)</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                      {Object.values(BARN_DECORS)
                        .filter((d) => decorCategoryFilter === 'all' || d.category === decorCategoryFilter)
                        .map((item) => {
                          const isUnlocked = unlockedDecors.includes(item.id);
                          const isEquipped = equippedDecors.includes(item.id);

                          return (
                            <div
                              key={item.id}
                              className="bg-white rounded-2xl border-2 border-amber-400 p-2.5 flex flex-col justify-between items-center text-center shadow-sm space-y-1.5"
                            >
                              <div className="w-full flex justify-between items-center text-[9px] text-amber-800 font-bold">
                                <span className="bg-amber-100 px-1.5 py-0.5 rounded-full">{item.tag}</span>
                                {isEquipped ? (
                                  <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-black">
                                    ติดตั้ง
                                  </span>
                                ) : isUnlocked ? (
                                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full">
                                    มีแล้ว
                                  </span>
                                ) : null}
                              </div>

                              <div className="h-20 flex items-center justify-center my-0.5">
                                <DecorItemSprite decor={item} isNight={false} />
                              </div>

                              <div className="w-full space-y-0.5">
                                <div className="font-black text-slate-900 text-xs truncate">{item.name}</div>
                                <div className="text-[9px] text-amber-900 line-clamp-2 h-6">{item.perk}</div>
                              </div>

                              <div className="w-full pt-1 border-t border-amber-200">
                                {isUnlocked ? (
                                  <button
                                    onClick={() => handleToggleEquipDecor(item.id)}
                                    className={`w-full py-1 rounded-lg font-black text-[11px] cursor-pointer ${
                                      isEquipped
                                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                                    }`}
                                  >
                                    {isEquipped ? '📦 ถอดออก' : '✨ ติดตั้ง'}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleBuyDecor(item.id)}
                                    className="w-full py-1 rounded-lg font-black text-[11px] bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-amber-950 border border-amber-600 cursor-pointer active:scale-95"
                                  >
                                    {item.cost} 🪙
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODAL CONTENT: 2. CROPS */}
            {inGameModal === 'crops' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-200/80 p-2.5 rounded-2xl border border-amber-400 text-xs font-bold text-amber-950">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">🧺</span>
                    <span>คลังผลผลิตที่เก็บเกี่ยวได้:</span>
                  </div>
                  <div className="flex items-center space-x-3 font-mono">
                    <span className="bg-white/80 px-2 py-0.5 rounded-lg border border-amber-300">🌾 {cropInventory.bran || 0}</span>
                    <span className="bg-white/80 px-2 py-0.5 rounded-lg border border-amber-300">🌽 {cropInventory.corn || 0}</span>
                    <span className="bg-white/80 px-2 py-0.5 rounded-lg border border-amber-300">🥕 {cropInventory.carrot || 0}</span>
                    <span className="bg-white/80 px-2 py-0.5 rounded-lg border border-amber-300">🎃 {cropInventory.pumpkin || 0}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {crops.map((plot) => {
                    const meta = plot.seed ? CROPS_META[plot.seed] : null;
                    const elapsedSec = plot.plantedAt ? Math.floor((currentTime - plot.plantedAt) / 1000) : 0;
                    const remainingSec = meta ? Math.max(0, meta.duration - elapsedSec) : 0;
                    const isReady = meta && remainingSec === 0;

                    return (
                      <div
                        key={plot.id}
                        className="bg-[#451a03] border-4 border-[#270e02] rounded-3xl p-3.5 shadow-xl flex flex-col justify-between items-center text-center min-h-[230px] relative overflow-hidden"
                      >
                        <div className="w-full flex justify-between items-center text-amber-200 text-xs font-bold">
                          <span>แปลงที่ #{plot.id + 1}</span>
                          {meta && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                              isReady ? 'bg-emerald-500 text-white animate-pulse' : 'bg-amber-900 text-amber-200'
                            }`}>
                              {isReady ? '✨ พร้อมเก็บ!' : `⏳ เหลือ ${remainingSec}s`}
                            </span>
                          )}
                        </div>

                        <div className="my-2 flex flex-col items-center">
                          {plot.seed ? (
                            <>
                              <span className={`text-5xl transition-transform ${isReady ? 'scale-115 animate-bounce' : 'scale-90'}`}>
                                {isReady ? meta.icon : '🌱'}
                              </span>
                              <span className="font-black text-amber-100 text-sm mt-1.5">{meta.name}</span>
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

                        <div className="w-full">
                          {plot.seed ? (
                            <button
                              onClick={() => handleHarvestCrop(plot.id)}
                              disabled={!isReady}
                              className={`w-full py-2 rounded-xl font-black text-xs flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                                isReady
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:brightness-105 active:scale-95'
                                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                              }`}
                            >
                              <span>✨</span>
                              <span>{isReady ? `เก็บเกี่ยว (${meta.yieldCount} ถุง)` : 'กำลังเจริญเติบโต...'}</span>
                            </button>
                          ) : (
                            <div className="grid grid-cols-2 gap-1 w-full">
                              {Object.values(CROPS_META).map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => handlePlantSeed(plot.id, c.id)}
                                  className="p-1 rounded-xl bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-700 text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                                  title={`${c.name} (ใช้เวลา ${c.duration}s, ค่าเมล็ด ${c.seedCost} ฿)`}
                                >
                                  <span>{c.icon}</span>
                                  <span className="truncate">{c.name.split('/')[0]} ({c.seedCost}฿)</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODAL CONTENT: 3. QUESTS */}
            {inGameModal === 'quests' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                  {quests.map((q) => {
                    const progressPct = Math.min(100, Math.round((q.progress / q.target) * 100));
                    return (
                      <div
                        key={q.id}
                        className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between space-y-2.5 transition-all ${
                          q.claimed
                            ? 'bg-slate-100 border-slate-300 opacity-60'
                            : q.progress >= q.target
                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-500 shadow-md'
                            : 'bg-white border-amber-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{q.icon}</span>
                            <div>
                              <div className="font-black text-slate-900 text-xs">{q.title}</div>
                              <div className="text-[11px] text-slate-600">{q.description}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[11px] font-black text-amber-900 font-mono">+{q.rewardCoins} 🪙</div>
                            <div className="text-[10px] font-bold text-emerald-700 font-mono">+{q.rewardExp} EXP</div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span>ความคืบหน้า</span>
                            <span>{q.progress}/{q.target}</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          {q.claimed ? (
                            <div className="text-center text-xs font-bold text-slate-400 py-1">
                              ✓ รับรางวัลแล้ว
                            </div>
                          ) : (
                            <button
                              onClick={() => handleClaimQuest(q.id)}
                              disabled={q.progress < q.target}
                              className={`w-full py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                                q.progress >= q.target
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white shadow-sm active:scale-95 animate-pulse'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <span>🎁</span>
                              <span>{q.progress >= q.target ? 'กดรับรางวัล!' : 'ยังทำไม่สำเร็จ'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODAL CONTENT: 4. BREEDING */}
            {inGameModal === 'breed' && (() => {
              const adultPigs = pigs.filter((p) => p.weight >= 50);
              const parent1 = pigs.find((p) => p.id === breedParent1Id);
              const parent2 = pigs.find((p) => p.id === breedParent2Id);

              return (
                <div className="space-y-4">
                  <div className="bg-purple-950/80 p-3 rounded-2xl border border-purple-600 text-xs text-purple-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">⚡</span>
                      <span>ต้องการพลังงานฟาร์ม <b>30 ⚡</b> ต่อการผสม 1 ครั้ง (หมูต้องหนัก &gt;= 50 kg)</span>
                    </div>
                    <div className="font-mono font-bold text-yellow-300">
                      พลังงานคงเหลือ: {energy}/{maxEnergy} ⚡
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Parent 1 */}
                    <div className="bg-white border-2 border-purple-300 rounded-2xl p-3 space-y-2">
                      <div className="font-black text-purple-950 text-xs flex items-center space-x-1.5">
                        <span>♂️ พ่อพันธุ์ (Parent 1)</span>
                      </div>
                      <select
                        value={breedParent1Id || ''}
                        onChange={(e) => setBreedParent1Id(e.target.value)}
                        className="w-full p-2 rounded-xl border border-purple-300 text-xs font-bold text-slate-800 bg-purple-50"
                      >
                        <option value="">-- เลือกพ่อพันธุ์ (หมูหนัก 50kg+) --</option>
                        {adultPigs.map((p) => (
                          <option key={p.id} value={p.id} disabled={p.id === breedParent2Id}>
                            {p.name} ({PIG_BREEDS[p.breed]?.name} - {p.weight} kg)
                          </option>
                        ))}
                      </select>
                      {parent1 && (
                        <div className="flex items-center space-x-2.5 p-2 bg-purple-100/60 rounded-xl">
                          <img src={`/pigs/${parent1.breed}.png`} alt={parent1.name} className="w-10 h-10 object-contain" />
                          <div className="text-xs">
                            <div className="font-black text-purple-950">{parent1.name}</div>
                            <div className="text-[10px] text-purple-800">สายพันธุ์: {PIG_BREEDS[parent1.breed]?.name}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Parent 2 */}
                    <div className="bg-white border-2 border-pink-300 rounded-2xl p-3 space-y-2">
                      <div className="font-black text-pink-950 text-xs flex items-center space-x-1.5">
                        <span>♀️ แม่พันธุ์ (Parent 2)</span>
                      </div>
                      <select
                        value={breedParent2Id || ''}
                        onChange={(e) => setBreedParent2Id(e.target.value)}
                        className="w-full p-2 rounded-xl border border-pink-300 text-xs font-bold text-slate-800 bg-pink-50"
                      >
                        <option value="">-- เลือกแม่พันธุ์ (หมูหนัก 50kg+) --</option>
                        {adultPigs.map((p) => (
                          <option key={p.id} value={p.id} disabled={p.id === breedParent1Id}>
                            {p.name} ({PIG_BREEDS[p.breed]?.name} - {p.weight} kg)
                          </option>
                        ))}
                      </select>
                      {parent2 && (
                        <div className="flex items-center space-x-2.5 p-2 bg-pink-100/60 rounded-xl">
                          <img src={`/pigs/${parent2.breed}.png`} alt={parent2.name} className="w-10 h-10 object-contain" />
                          <div className="text-xs">
                            <div className="font-black text-pink-950">{parent2.name}</div>
                            <div className="text-[10px] text-pink-800">สายพันธุ์: {PIG_BREEDS[parent2.breed]?.name}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Breed Trigger Button */}
                  <button
                    onClick={() => {
                      handleBreedPigs();
                      if (parent1 && parent2 && energy >= 30) {
                        setInGameModal(null);
                      }
                    }}
                    disabled={!parent1 || !parent2 || energy < 30 || pigs.length >= maxPigs}
                    className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                      parent1 && parent2 && energy >= 30 && pigs.length < maxPigs
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:brightness-105 text-white active:scale-98 animate-pulse'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Dna className="w-5 h-5" />
                    <span>
                      {pigs.length >= maxPigs
                        ? '❌ คอกเต็มแล้ว! กรุณาขยายคอกหรือขายหมูก่อน'
                        : !parent1 || !parent2
                        ? 'กรุณาเลือกพ่อพันธุ์และแม่พันธุ์'
                        : energy < 30
                        ? 'พลังงานไม่พอ (ต้องการ 30 ⚡)'
                        : '🧬 เริ่มผสมพันธุ์เลย! (ใช้ 30 ⚡)'}
                    </span>
                  </button>
                </div>
              );
            })()}

            {/* MODAL CONTENT: 5. DECOR & ARCHITECTURE */}
            {inGameModal === 'decor' && (
              <div className="space-y-3.5">
                {/* Tilemap.exe Design Principles Banner */}
                <div className="bg-[#2b180d] p-3 rounded-2xl border-2 border-amber-600 text-amber-200 text-xs space-y-1">
                  <div className="flex items-center space-x-2 font-black text-amber-300 text-sm">
                    <span>📐</span>
                    <span>สถาปัตยกรรมคอกหมู Tilemap.exe (Night Camp EP.3)</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed font-medium">
                    ระบบแยกของตกแต่ง 15 ชิ้นแบบโมดูลาร์: ต้นไม้ทรงสูงและบ้านเห็ดจัดวางที่ขอบหลังคอก (Back Layer), โคมไฟส่องสว่างจัดตามทางเดิน (Front Layer), และเว้นพื้นที่สี่เหลี่ยมตรงกลาง 40% ให้ลูกหมูทุกตัวได้เดินเล่นอย่างโล่งสบาย ไม่ติดขัด!
                  </p>
                </div>

                {/* Architecture Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleAutoLayoutDecors}
                      className="px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer active:scale-95 flex items-center space-x-1.5"
                    >
                      <span>📐</span>
                      <span>จัดวางอัตโนมัติตามหลักสถาปัตยกรรม</span>
                    </button>
                    <button
                      onClick={handleUnequipAllDecors}
                      className="px-3 py-2 bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-500 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer active:scale-95 flex items-center space-x-1.5"
                    >
                      <span>🧹</span>
                      <span>ถอดออกทั้งหมด (คอกโล่ง 100%)</span>
                    </button>
                    <button
                      onClick={() => setShowThemeModal(true)}
                      className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-amber-950 font-black text-xs rounded-xl shadow-xs cursor-pointer active:scale-95 flex items-center space-x-1.5"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>เปลี่ยนธีมฉากหลัง ({activeTheme.name})</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShopCategoryTab('decors');
                      setInGameModal('shop');
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer active:scale-95 flex items-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ซื้อของตกแต่งเพิ่ม (ใช้เหรียญ)</span>
                  </button>
                </div>

                {/* Owned Decors List with Equip/Unequip Toggle */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                    <span>ของตกแต่งที่ครอบครอง ({unlockedDecors.length} ชิ้น):</span>
                    <span className="text-emerald-700 font-bold">ติดตั้งในคอกอยู่: {equippedDecors.length} ชิ้น</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[45vh] overflow-y-auto pr-1">
                    {unlockedDecors.map((decId) => {
                      const item = BARN_DECORS[decId];
                      if (!item) return null;
                      const isEquipped = equippedDecors.includes(decId);

                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-2xl border-2 flex items-center justify-between gap-2.5 shadow-xs transition-all ${
                            isEquipped ? 'bg-emerald-50/90 border-emerald-400' : 'bg-white border-amber-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300">
                              <span className="text-2xl">{item.icon}</span>
                            </div>
                            <div className="truncate">
                              <div className="font-black text-slate-900 text-xs truncate">{item.name}</div>
                              <div className="text-[10px] text-amber-800 line-clamp-1">{item.perk}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleEquipDecor(item.id)}
                            className={`px-2.5 py-1.5 rounded-xl font-black text-xs shrink-0 cursor-pointer transition-all active:scale-95 ${
                              isEquipped
                                ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                            }`}
                          >
                            {isEquipped ? 'ถอดออก' : 'ติดตั้ง'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
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

            {/* Header Status & Coin Balance */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-950/20 p-2.5 rounded-xl border border-amber-300/50">
              <span className="text-xs font-black text-amber-950 flex items-center space-x-1.5">
                <span>🏞️</span>
                <span>ธีมคอกฟาร์มธรรมชาติ & สปา (6 สไตล์ภาพวาด ไร้สัตว์ในพื้นหลัง)</span>
              </span>
              <div className="flex items-center space-x-2 text-xs font-mono font-bold">
                <span className="text-amber-900 bg-white/90 px-2.5 py-1 rounded-xl border border-amber-300 shadow-xs flex items-center space-x-1">
                  <span>🪙</span>
                  <span>{coins.toLocaleString()} ฿</span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
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
                        : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {theme.bgImage ? (
                        <img
                          src={theme.bgImage}
                          alt={theme.name}
                          className="w-18 h-13 rounded-xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-18 h-13 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0 border-2 bg-slate-900 border-cyan-400">
                          {theme.icon}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-sm">{theme.name}</span>
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                            {theme.tag}
                          </span>
                          {isActive && (
                            <span className="bg-white text-amber-900 text-[10px] font-black px-2 py-0.2 rounded-full shadow-xs">
                              กำลังใช้งาน
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${isActive ? 'text-amber-100' : 'text-slate-600'}`}>
                          พลังพิเศษ: {theme.perk}
                        </p>
                        {!isUnlocked && theme.unlockDesc && (
                          <p className="text-[10px] text-amber-700 font-bold mt-1">
                            🔒 {theme.unlockDesc}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      {isActive ? (
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                      ) : isUnlocked ? (
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl shadow-xs">
                          เลือกใช้
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-800 bg-amber-200 border border-amber-400 px-3 py-1 rounded-xl flex items-center space-x-1 shadow-xs hover:bg-amber-300">
                          <Coins className="w-3.5 h-3.5 text-amber-900" />
                          <span>{theme.cost.toLocaleString()} ฿</span>
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
                  สะสมสายพันธุ์หมูครบ 14 สายพันธุ์ (8 สายพันธุ์ทั่วไป + 6 สัตว์เทพเพชรแท้ 💎)
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
                const isUnlocked = unlockedBreeds.includes(breed.id) || breed.isDiamondBreed;

                return (
                  <div
                    key={breed.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center space-x-3 ${
                      breed.isDiamondBreed
                        ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-400 shadow-sm'
                        : isUnlocked
                        ? 'bg-white border-amber-300 shadow-sm'
                        : 'bg-slate-100/90 border-slate-300 opacity-75'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: breed.primaryColor }}
                      className="w-12 h-12 rounded-2xl border-2 border-black/20 flex items-center justify-center text-2xl shadow-inner shrink-0"
                    >
                      {breed.isDiamondBreed ? '💎' : isUnlocked ? '🐷' : '🔒'}
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
                        {breed.isDiamondBreed ? (
                          <span className="text-purple-700">💎 สัตว์เทพ (ราคา {breed.diamondCost} เพชร | ขาย {breed.pricePerKg} ฿/kg)</span>
                        ) : isUnlocked ? (
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

      {/* ================= MODAL: DIAMOND VAULT & TOP-UP SHOP ================= */}
      {showDiamondShopModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative bg-gradient-to-b from-[#2e1065] via-[#3b0764] to-[#1e1b4b] border-4 border-purple-400 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-[0_0_50px_rgba(168,85,247,0.5)] space-y-4 text-white">
            <button
              onClick={() => setShowDiamondShopModal(false)}
              className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-purple-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-fuchsia-400 text-white rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-lg border-2 border-purple-200">
                💎
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-mono text-purple-100 flex items-center justify-center space-x-1.5">
                <span>คลังเพชรแท้ & ระบบเติมเงิน</span>
              </h3>
              <p className="text-xs text-purple-300">
                เพชรใช้สำหรับอัญเชิญหมูเทพในตำนาน และปลดล็อกวิมานคอกหมูสุดหรู
              </p>
            </div>

            {/* Current Balance Display */}
            <div className="bg-black/40 border border-purple-500/50 rounded-2xl p-3 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-purple-300 font-bold block">💎 เพชรคงเหลือ</span>
                <span className="text-lg font-black font-mono text-yellow-300">{diamonds.toLocaleString()} 💎</span>
              </div>
              <div className="w-px h-8 bg-purple-700/60" />
              <div>
                <span className="text-[10px] text-purple-300 font-bold block">🪙 เหรียญทองฟาร์ม</span>
                <span className="text-lg font-black font-mono text-amber-300">{coins.toLocaleString()} ฿</span>
              </div>
            </div>

            {/* Tabs: [Top-Up IAP Packages] vs [Coin Exchange] */}
            <div className="flex items-center space-x-1.5 bg-black/30 p-1.5 rounded-2xl border border-purple-500/40">
              <button
                onClick={() => setDiamondShopTab('topup')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  diamondShopTab === 'topup'
                    ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                💳 เติมเงินแพ็กเกจเพชร (จำลอง Demo)
              </button>
              <button
                onClick={() => setDiamondShopTab('exchange')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  diamondShopTab === 'exchange'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                🪙 ตู้แลกเหรียญเป็นเพชร
              </button>
            </div>

            {/* Tab 1: Simulated Top-Up Packages */}
            {diamondShopTab === 'topup' && (
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {[
                  { id: 'pack_starter', name: 'ถุงเพชรเริ่มต้น', diamonds: 100, bonus: 0, price: '฿35', tag: 'STARTER', color: 'border-purple-400' },
                  { id: 'pack_popular', name: 'หีบสมบัติเพชรยอดนิยม', diamonds: 350, bonus: 50, price: '฿99', tag: 'POPULAR 🔥', isHot: true, color: 'border-fuchsia-400' },
                  { id: 'pack_vault', name: 'คลังเพชรราชันย์', diamonds: 1000, bonus: 200, price: '฿249', tag: '+20% BONUS', color: 'border-indigo-400' },
                  { id: 'pack_emperor', name: 'กองเพชรจักรพรรดิ', diamonds: 2500, bonus: 600, price: '฿599', tag: 'BEST VALUE 👑', isHot: true, color: 'border-yellow-400' }
                ].map((pack) => {
                  const totalDiamonds = pack.diamonds + pack.bonus;
                  return (
                    <div
                      key={pack.id}
                      className={`p-3 rounded-2xl bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border-2 ${pack.color} flex items-center justify-between shadow-md transition-all hover:scale-101`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-900/80 border border-purple-400 flex items-center justify-center text-2xl shadow-inner shrink-0">
                          💎
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-black text-xs text-white">{pack.name}</span>
                            <span className="bg-yellow-400 text-yellow-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                              {pack.tag}
                            </span>
                          </div>
                          <div className="text-xs font-mono font-black text-yellow-300 mt-0.5">
                            +{pack.diamonds} 💎 {pack.bonus > 0 && <span className="text-emerald-400 font-bold">(แถม {pack.bonus} 💎)</span>}
                          </div>
                          <span className="text-[10px] text-purple-300 font-medium">รวมรับ {totalDiamonds.toLocaleString()} เพชรแท้</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setDiamonds((d) => d + totalDiamonds);
                          playSound('fanfare', isMuted);
                          setShowDiamondShopModal(false);
                          setCelebrationReward({
                            title: '💎 เติมเพชรสำเร็จ!',
                            badge: 'SIMULATED TOP-UP COMPLETE',
                            subtitle: `ซื้อแพ็กเกจ "${pack.name}" เรียบร้อยแล้ว`,
                            rewardText: `+${totalDiamonds.toLocaleString()} เพชรแท้ 💎`,
                            icon: '💎',
                            color: '#8b5cf6'
                          });
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-black text-xs shadow-[0_3px_0_#065f46] active:translate-y-0.5 active:shadow-none cursor-pointer flex flex-col items-center shrink-0"
                      >
                        <span>{pack.price}</span>
                        <span className="text-[8px] opacity-80">(แตะเติมทันที)</span>
                      </button>
                    </div>
                  );
                })}

                <div className="p-2.5 bg-purple-950/40 rounded-xl border border-purple-600/40 text-[10px] text-purple-300 text-center leading-relaxed">
                  💡 <b>โหมดจำลองระบบเติมเงิน (Simulation Mode):</b> กดเติมได้ทันทีโดยไม่ต้องจ่ายเงินจริง เพื่อทดลองใช้อัญเชิญหมูเทพและธีมวิมานเพชรได้อย่างอิสระ!
                </div>
              </div>
            )}

            {/* Tab 2: Farm Coin to Diamond Exchange */}
            {diamondShopTab === 'exchange' && (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {[
                  { costCoins: 5000, getDiamonds: 20, label: 'แลกแพ็กเล็ก' },
                  { costCoins: 15000, getDiamonds: 70, label: 'แลกแพ็กกลาง (+10 💎 โบนัส)' },
                  { costCoins: 30000, getDiamonds: 150, label: 'แลกแพ็กใหญ่ (+30 💎 คุ้มสุด)' }
                ].map((item, idx) => {
                  const canAfford = coins >= item.costCoins;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-black/40 border-2 border-amber-500/50 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🪙 ➔ 💎</div>
                        <div>
                          <div className="text-xs font-black text-white">{item.label}</div>
                          <div className="text-xs font-mono font-bold text-amber-300">
                            ใช้ {item.costCoins.toLocaleString()} 🪙 ➔ รับ {item.getDiamonds} 💎
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (coins < item.costCoins) {
                            showToast(`❌ เหรียญไม่พอแลกเปลี่ยน (ต้องการ ${item.costCoins.toLocaleString()} ฿)`);
                            return;
                          }
                          setCoins((c) => c - item.costCoins);
                          setDiamonds((d) => d + item.getDiamonds);
                          playSound('coin', isMuted);
                          showToast(`✨ แลกเปลี่ยนสำเร็จ! ได้รับ +${item.getDiamonds} 💎`);
                        }}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-amber-950 shadow-md active:translate-y-0.5'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'แลกเปลี่ยนทันที' : 'เหรียญไม่พอ'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FARM AUDIT INSPECTION MODAL (ระบบตรวจการฟาร์ม อปท.) ================= */}
      {showAuditModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] border-4 border-blue-400 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-[0_0_50px_rgba(59,130,246,0.5)] space-y-4 text-white">
            <button
              onClick={() => setShowAuditModal(false)}
              className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-blue-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400 text-blue-300 text-xs font-black">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>หน่วยตรวจสอบภายใน อปท.</span>
              </div>
              <h3 className="text-xl font-black text-blue-100 font-mono tracking-tight pt-1">
                ระบบตรวจการฟาร์มปศุสัตว์
              </h3>
              <p className="text-xs text-slate-300">
                ประเมินมาตรฐานฟาร์ม ปค.5 & เบิกงบประมาณสนับสนุนพลังงาน
              </p>
            </div>

            {/* Inspection Checklist */}
            <div className="space-y-2 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">ระบบควบคุมสุขอนามัยหมู</div>
                    <div className="text-[10px] text-slate-400">
                      หมูปกติสุข {pigs.filter((p) => p.health >= 60).length}/{pigs.length} ตัว
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  ผ่านเกณฑ์
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">สต็อกพืชอาหารสัตว์สำรอง</div>
                    <div className="text-[10px] text-slate-400">
                      มีผลผลิตในคลัง {cropInventory.bran + cropInventory.corn + cropInventory.carrot + cropInventory.pumpkin} ถุง
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  ผ่านเกณฑ์
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">สภาพแวดล้อมและธีมคอก</div>
                    <div className="text-[10px] text-slate-400">ธีม: {activeTheme.name}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  ผ่านเกณฑ์
                </span>
              </div>
            </div>

            {/* Inspection Cooldown & Reward Action */}
            {(() => {
              const cooldownMs = 1000 * 60 * 60 * 2; // 2 hours
              const timePassed = Date.now() - lastAuditTime;
              const isReady = timePassed >= cooldownMs;
              const remainingSec = Math.max(0, Math.ceil((cooldownMs - timePassed) / 1000));
              const remMin = Math.floor(remainingSec / 60);
              const remSec = remainingSec % 60;

              return (
                <div className="space-y-3 pt-1">
                  <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/40 rounded-2xl p-3 text-center space-y-1">
                    <span className="text-[10px] text-blue-300 uppercase font-black tracking-wider">
                      เงินอุดหนุน & พลังงานเมื่อตรวจผ่าน
                    </span>
                    <div className="flex items-center justify-center space-x-3 text-sm font-black font-mono">
                      <span className="text-amber-400">⚡ ฟื้นฟูเต็ม {maxEnergy}</span>
                      <span className="text-yellow-400">+350 🪙</span>
                      <span className="text-purple-300">+15 💎</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!isReady) {
                        showToast(`⏳ รอบตรวจการถัดไปในอีก ${remMin} นาที ${remSec} วินาที`);
                        return;
                      }
                      setLastAuditTime(Date.now());
                      setEnergy(maxEnergy);
                      setCoins((c) => c + 350);
                      setDiamonds((d) => d + 15);
                      addExp(60);
                      playSound('fanfare', isMuted);
                      setShowAuditModal(false);
                      setCelebrationReward({
                        title: '📋 ตรวจรับรองฟาร์ม อปท. ผ่านฉลุย!',
                        subtitle: 'ผลการตรวจสอบมาตรฐานสุขาภิบาลฟาร์มเป็นไปตามระเบียบ',
                        badge: 'AUDIT PASSED',
                        rewardText: `⚡ พลังงานเต็ม ${maxEnergy} | +350 🪙 | +15 💎`,
                        icon: '📋',
                        color: '#2563eb'
                      });
                    }}
                    disabled={!isReady}
                    className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      isReady
                        ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                    }`}
                  >
                    <span>{isReady ? '✍️ ลงนามตรวจรับรอง & เบิกงบรางวัลฟาร์ม' : `⏳ ตรวจสอบครั้งถัดไปใน ${remMin}:${remSec < 10 ? '0' : ''}${remSec} น.`}</span>
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

          {/* Celebration Card (Inspired by Reference Game Image 3) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] to-[#fed7aa] border-4 border-[#854d0e] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-[0_0_50px_rgba(245,158,11,0.6)] text-center space-y-4 animate-in zoom-in-90 duration-300 select-none"
          >
            {/* Top Wooden Plaque Header Banner */}
            <div className="relative -mt-10 mx-auto inline-block">
              <div className="bg-gradient-to-b from-[#854d0e] via-[#713f12] to-[#542d0c] border-2 border-yellow-300 px-6 py-1.5 rounded-2xl shadow-xl">
                <span className="text-amber-100 font-black text-sm tracking-widest drop-shadow-sm font-mono">
                  — ของรางวัล —
                </span>
              </div>
            </div>

            {/* Glowing Icon in Pulsing Ring */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
              <div className="w-22 h-22 rounded-full bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 border-4 border-amber-400 shadow-2xl flex items-center justify-center text-5xl">
                {celebrationReward.icon}
              </div>
            </div>

            {/* Titles */}
            <div className="space-y-1">
              <span className="inline-block bg-amber-200/80 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400 uppercase tracking-wider">
                {celebrationReward.badge || 'REWARD UNLOCKED'}
              </span>
              <h3 className="text-xl font-black text-amber-950 font-mono tracking-tight drop-shadow-xs">
                {celebrationReward.title}
              </h3>
              <p className="text-xs text-amber-900/80 font-medium">
                {celebrationReward.subtitle}
              </p>
            </div>

            {/* Cream Item Cards & Reward Box */}
            <div className="bg-white/90 border-2 border-amber-300 rounded-2xl p-4 shadow-inner space-y-1">
              <div className="text-lg font-black text-amber-950 font-mono flex items-center justify-center space-x-2">
                <span>{celebrationReward.rewardText}</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold">
                ✓ บันทึกเข้าคลังและบัญชีฟาร์มเรียบร้อยแล้ว
              </p>
            </div>

            {/* Tap to Continue Button */}
            <div className="pt-2">
              <button
                onClick={() => setCelebrationReward(null)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-amber-950 rounded-2xl font-black text-base border-2 border-yellow-200 shadow-[0_5px_0_#92400e] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center space-x-2 transition-all animate-pulse"
              >
                <Sparkles className="w-5 h-5 text-amber-950" />
                <span>แตะเพื่อไปต่อ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
