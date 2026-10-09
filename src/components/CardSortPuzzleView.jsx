import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Lightbulb,
  Undo2,
  Magnet,
  Star,
  Coins,
  Sparkles,
  Trophy,
  CheckCircle2,
  RefreshCw,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  HelpCircle,
  Plus,
  Flame,
  Lock,
  Unlock,
  Layers,
  Award,
  Move
} from 'lucide-react';

// Web Audio sound synthesizer for responsive tactile game effects
const playSound = (type, isMuted) => {
  if (isMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'select') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'place') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'flip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'match') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.07);
        g.gain.setValueAtTime(0.22, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.22);
        o.start(now + i * 0.07);
        o.stop(now + i * 0.07 + 0.22);
      });
    } else if (type === 'win') {
      [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.09);
        g.gain.setValueAtTime(0.3, now + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.35);
        o.start(now + i * 0.09);
        o.stop(now + i * 0.09 + 0.35);
      });
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(170, now + 0.12);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (e) {
    // AudioContext blocked
  }
};

// Comprehensive Category & Card Database (15 distinct categories for infinite level variety)
const MASTER_CATEGORIES = {
  pets: {
    id: 'pets',
    name: 'Pets',
    icon: '🐶',
    thai: 'สัตว์เลี้ยงแสนรัก',
    cards: [
      { id: 'dog', name: 'Puppy', icon: '🐶', category: 'pets', thai: 'น้องหมา' },
      { id: 'cat', name: 'Kitty', icon: '🐱', category: 'pets', thai: 'น้องแมว' },
      { id: 'bunny', name: 'Bunny', icon: '🐰', category: 'pets', thai: 'กระต่าย' },
      { id: 'hamster', name: 'Hamster', icon: '🐹', category: 'pets', thai: 'แฮมสเตอร์' },
      { id: 'parrot', name: 'Parrot', icon: '🦜', category: 'pets', thai: 'นกแก้ว' },
      { id: 'turtle', name: 'Turtle', icon: '🐢', category: 'pets', thai: 'เต่าน้อย' }
    ]
  },
  fruits: {
    id: 'fruits',
    name: 'Fruits',
    icon: '🍎',
    thai: 'ผลไม้สดชื่น',
    cards: [
      { id: 'apple', name: 'Apple', icon: '🍎', category: 'fruits', thai: 'แอปเปิ้ล' },
      { id: 'banana', name: 'Banana', icon: '🍌', category: 'fruits', thai: 'กล้วยหอม' },
      { id: 'strawberry', name: 'Strawberry', icon: '🍓', category: 'fruits', thai: 'สตรอว์เบอร์รี' },
      { id: 'grape', name: 'Grape', icon: '🍇', category: 'fruits', thai: 'องุ่น' },
      { id: 'watermelon', name: 'Watermelon', icon: '🍉', category: 'fruits', thai: 'แตงโม' },
      { id: 'orange', name: 'Orange', icon: '🍊', category: 'fruits', thai: 'ส้มสายน้ำผึ้ง' }
    ]
  },
  vehicles: {
    id: 'vehicles',
    name: 'Vehicles',
    icon: '🚗',
    thai: 'ยานพาหนะ',
    cards: [
      { id: 'car', name: 'Car', icon: '🚗', category: 'vehicles', thai: 'รถเก๋ง' },
      { id: 'bus', name: 'Bus', icon: '🚌', category: 'vehicles', thai: 'รถบัส' },
      { id: 'airplane', name: 'Airplane', icon: '✈️', category: 'vehicles', thai: 'เครื่องบิน' },
      { id: 'train', name: 'Train', icon: '🚆', category: 'vehicles', thai: 'รถไฟ' },
      { id: 'helicopter', name: 'Helicopter', icon: '🚁', category: 'vehicles', thai: 'เฮลิคอปเตอร์' },
      { id: 'sub', name: 'Submarine', icon: '🚢', category: 'vehicles', thai: 'เรือเดินสมุทร' }
    ]
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    thai: 'สัตว์ใต้ทะเล',
    cards: [
      { id: 'dolphin', name: 'Dolphin', icon: '🐬', category: 'ocean', thai: 'โลมา' },
      { id: 'octopus', name: 'Octopus', icon: '🐙', category: 'ocean', thai: 'หมึกยักษ์' },
      { id: 'whale', name: 'Whale', icon: '🐳', category: 'ocean', thai: 'วาฬสีน้ำเงิน' },
      { id: 'clownfish', name: 'Clownfish', icon: '🐠', category: 'ocean', thai: 'ปลาการ์ตูน' },
      { id: 'jellyfish', name: 'Jellyfish', icon: '🪼', category: 'ocean', thai: 'แมงกะพรุน' },
      { id: 'shark', name: 'Shark', icon: '🦈', category: 'ocean', thai: 'ฉลาม' }
    ]
  },
  jobs: {
    id: 'jobs',
    name: 'Jobs',
    icon: '💼',
    thai: 'อาชีพต่างๆ',
    cards: [
      { id: 'chef', name: 'Chef', icon: '👨‍🍳', category: 'jobs', thai: 'เชฟ' },
      { id: 'firefighter', name: 'Firefighter', icon: '👩‍🚒', category: 'jobs', thai: 'นักดับเพลิง' },
      { id: 'scientist', name: 'Scientist', icon: '👩‍🔬', category: 'jobs', thai: 'นักวิทยาศาสตร์' },
      { id: 'farmer', name: 'Farmer', icon: '👨‍🌾', category: 'jobs', thai: 'ชาวสวน' },
      { id: 'princess', name: 'Princess', icon: '👸', category: 'jobs', thai: 'เจ้าหญิง' },
      { id: 'doctor', name: 'Doctor', icon: '👩‍⚕️', category: 'jobs', thai: 'คุณหมอ' }
    ]
  },
  can_fly: {
    id: 'can_fly',
    name: 'Can fly',
    icon: '🪽',
    thai: 'สิ่งที่บินได้',
    cards: [
      { id: 'phoenix', name: 'Phoenix', icon: '🦅', category: 'can_fly', thai: 'ฟีนิกซ์' },
      { id: 'griffin', name: 'Griffin', icon: '🦁', category: 'can_fly', thai: 'กริฟฟอน' },
      { id: 'eagle', name: 'Eagle', icon: '🦅', category: 'can_fly', thai: 'นกอินทรี' },
      { id: 'flamingo', name: 'Flamingo', icon: '🦩', category: 'can_fly', thai: 'ฟลามิงโก' },
      { id: 'hummingbird', name: 'Hummingbird', icon: '🐦', category: 'can_fly', thai: 'ฮัมมิงเบิร์ด' },
      { id: 'glider', name: 'Glider', icon: '🛩️', category: 'can_fly', thai: 'เครื่องร่อน' }
    ]
  },
  bakery: {
    id: 'bakery',
    name: 'Bakery',
    icon: '🧁',
    thai: 'เบเกอรี่แสนหวาน',
    cards: [
      { id: 'cupcake', name: 'Cupcake', icon: '🧁', category: 'bakery', thai: 'คัพเค้ก' },
      { id: 'croissant', name: 'Croissant', icon: '🥐', category: 'bakery', thai: 'ครัวซองต์' },
      { id: 'donut', name: 'Donut', icon: '🍩', category: 'bakery', thai: 'โดนัท' },
      { id: 'cookie', name: 'Cookie', icon: '🍪', category: 'bakery', thai: 'คุกกี้' },
      { id: 'pancake', name: 'Pancake', icon: '🥞', category: 'bakery', thai: 'แพนเค้ก' },
      { id: 'cake', name: 'Cake', icon: '🍰', category: 'bakery', thai: 'เค้กช็อกโกแลต' }
    ]
  },
  fastfood: {
    id: 'fastfood',
    name: 'Fast Food',
    icon: '🍕',
    thai: 'อาหารจานด่วน',
    cards: [
      { id: 'pizza', name: 'Pizza', icon: '🍕', category: 'fastfood', thai: 'พิซซ่า' },
      { id: 'burger', name: 'Burger', icon: '🍔', category: 'fastfood', thai: 'เบอร์เกอร์' },
      { id: 'fries', name: 'Fries', icon: '🍟', category: 'fastfood', thai: 'เฟรนช์ฟรายส์' },
      { id: 'hotdog', name: 'Hotdog', icon: '🌭', category: 'fastfood', thai: 'ฮอทดอก' },
      { id: 'taco', name: 'Taco', icon: '🌮', category: 'fastfood', thai: 'ทาโก้' },
      { id: 'popcorn', name: 'Popcorn', icon: '🍿', category: 'fastfood', thai: 'ป๊อปคอร์น' }
    ]
  },
  drinks: {
    id: 'drinks',
    name: 'Drinks',
    icon: '🧋',
    thai: 'เครื่องดื่มดับร้อน',
    cards: [
      { id: 'boba', name: 'Boba Tea', icon: '🧋', category: 'drinks', thai: 'ชานมไข่มุก' },
      { id: 'coffee', name: 'Coffee', icon: '☕', category: 'drinks', thai: 'กาแฟสด' },
      { id: 'juice', name: 'Juice', icon: '🧃', category: 'drinks', thai: 'น้ำผลไม้' },
      { id: 'soda', name: 'Soda', icon: '🥤', category: 'drinks', thai: 'น้ำอัดลม' },
      { id: 'milk', name: 'Milk', icon: '🥛', category: 'drinks', thai: 'นมสด' },
      { id: 'tea', name: 'Hot Tea', icon: '🍵', category: 'drinks', thai: 'ชาเขียว' }
    ]
  },
  space: {
    id: 'space',
    name: 'Space',
    icon: '🚀',
    thai: 'อวกาศและดวงดาว',
    cards: [
      { id: 'astronaut', name: 'Astronaut', icon: '👨‍🚀', category: 'space', thai: 'นักบินอวกาศ' },
      { id: 'rocket', name: 'Rocket', icon: '🚀', category: 'space', thai: 'จรวด' },
      { id: 'ufo', name: 'UFO', icon: '🛸', category: 'space', thai: 'จานบิน' },
      { id: 'alien', name: 'Alien', icon: '👽', category: 'space', thai: 'เอเลี่ยน' },
      { id: 'planet', name: 'Planet', icon: '🪐', category: 'space', thai: 'ดาวเสาร์' },
      { id: 'telescope', name: 'Telescope', icon: '🔭', category: 'space', thai: 'กล้องดูดาว' }
    ]
  },
  magic: {
    id: 'magic',
    name: 'Magic',
    icon: '🪄',
    thai: 'มนตร์วิเศษ',
    cards: [
      { id: 'wizard', name: 'Wizard', icon: '🧙', category: 'magic', thai: 'พ่อมด' },
      { id: 'crystal', name: 'Crystal', icon: '🔮', category: 'magic', thai: 'ลูกแก้วพยากรณ์' },
      { id: 'wand', name: 'Magic Wand', icon: '🪄', category: 'magic', thai: 'ไม้กายสิทธิ์' },
      { id: 'potion', name: 'Potion', icon: '🧪', category: 'magic', thai: 'น้ำยาเวทมนตร์' },
      { id: 'cauldron', name: 'Cauldron', icon: '🫕', category: 'magic', thai: 'หม้อต้มยา' },
      { id: 'scroll', name: 'Spell Scroll', icon: '📜', category: 'magic', thai: 'คัมภีร์เวท' }
    ]
  },
  dino: {
    id: 'dino',
    name: 'Dino',
    icon: '🦖',
    thai: 'โลกล้านปี',
    cards: [
      { id: 'dino_trex', name: 'T-Rex', icon: '🦖', category: 'dino', thai: 'ทีเร็กซ์' },
      { id: 'dino_bronto', name: 'Bronto', icon: '🦕', category: 'dino', thai: 'คอยาว' },
      { id: 'dino_ptero', name: 'Pterodactyl', icon: '🦅', category: 'dino', thai: 'เทอโรซอร์' },
      { id: 'dino_egg', name: 'Dino Egg', icon: '🥚', category: 'dino', thai: 'ไข่ไดโนเสาร์' },
      { id: 'volcano', name: 'Volcano', icon: '🌋', category: 'dino', thai: 'ภูเขาไฟ' },
      { id: 'meteor', name: 'Meteor', icon: '☄️', category: 'dino', thai: 'อุกกาบาต' }
    ]
  },
  audit_life: {
    id: 'audit_life',
    name: 'Audit Docs',
    icon: '📂',
    thai: 'เอกสารรายงานตรวจ',
    cards: [
      { id: 'doc_pk4', name: 'แบบ ปค.4', icon: '📁', category: 'audit_life', thai: 'แบบ ปค.4' },
      { id: 'doc_pk5', name: 'แบบ ปค.5', icon: '📂', category: 'audit_life', thai: 'แบบ ปค.5' },
      { id: 'audit_plan', name: 'แผนตรวจ', icon: '📋', category: 'audit_life', thai: 'แผนประจำปี' },
      { id: 'disbursement', name: 'ฎีกาเบิก', icon: '📜', category: 'audit_life', thai: 'ฎีกา' },
      { id: 'audit_stamp', name: 'ตรายาง สตง.', icon: '🔏', category: 'audit_life', thai: 'ตรวจผ่าน' },
      { id: 'receipt', name: 'ใบเสร็จ', icon: '🧾', category: 'audit_life', thai: 'ใบเสร็จ' }
    ]
  },
  office_fuel: {
    id: 'office_fuel',
    name: 'Office Fuel',
    icon: '☕',
    thai: 'ของยังชีพห้องตรวจ',
    cards: [
      { id: 'coffee_black', name: 'อเมริกาโน่', icon: '☕', category: 'office_fuel', thai: 'กาแฟเข้ม' },
      { id: 'boba_milk', name: 'ชานม 100%', icon: '🧋', category: 'office_fuel', thai: 'ชานมหวาน' },
      { id: 'yadom', name: 'ยาดมโป๊ยเซียน', icon: '🌿', category: 'office_fuel', thai: 'ยาดม' },
      { id: 'glasses', name: 'แว่นกรองแสง', icon: '👓', category: 'office_fuel', thai: 'แว่นตา' },
      { id: 'mama_cup', name: 'มาม่าคัพ', icon: '🍜', category: 'office_fuel', thai: 'บะหมี่ดึก' },
      { id: 'toast', name: 'ขนมปังปิ้ง', icon: '🍞', category: 'office_fuel', thai: 'ขนมปัง' }
    ]
  },
  engineering: {
    id: 'engineering',
    name: 'Engineering',
    icon: '⛑️',
    thai: 'งานช่าง & พัสดุ',
    cards: [
      { id: 'hard_hat', name: 'หมวกช่าง', icon: '⛑️', category: 'engineering', thai: 'หมวกนิรภัย' },
      { id: 'tape_measure', name: 'ตลับเมตร', icon: '📏', category: 'engineering', thai: 'ตลับเมตร' },
      { id: 'inspect_car', name: 'รถตรวจงาน', icon: '🚙', category: 'engineering', thai: 'รถราชการ' },
      { id: 'factor_f', name: 'Factor F', icon: '🗂️', category: 'engineering', thai: 'ราคากลาง' },
      { id: 'calc', name: 'เครื่องคิดเลข', icon: '🔢', category: 'engineering', thai: 'เครื่องคิดเลข' },
      { id: 'pc', name: 'ระบบ e-LAAS', icon: '💻', category: 'engineering', thai: 'คอมตรวจ' }
    ]
  }
};

// Flatten map of all cards for O(1) lookup
const ALL_CARDS_MAP = {};
Object.values(MASTER_CATEGORIES).forEach((cat) => {
  cat.cards.forEach((c) => {
    ALL_CARDS_MAP[c.id] = c;
  });
});

// Category combinations for 20+ Progressive Levels
const LEVEL_PRESETS = [
  { level: 1, cats: ['pets', 'fruits', 'vehicles'], moves: 40, cardsPerCat: 4, name: 'เริ่มต้น: สัตว์เลี้ยง, ผลไม้, ยานพาหนะ' },
  { level: 2, cats: ['ocean', 'jobs', 'can_fly'], moves: 50, cardsPerCat: 6, name: 'Cardlings: Ocean, Jobs, Can fly' },
  { level: 3, cats: ['bakery', 'fastfood', 'drinks'], moves: 55, cardsPerCat: 6, name: 'ของหวาน: เบเกอรี่, อาหารจานด่วน, เครื่องดื่ม' },
  { level: 4, cats: ['space', 'magic', 'dino'], moves: 55, cardsPerCat: 6, name: 'แฟนตาซี: อวกาศ, มนตร์วิเศษ, ไดโนเสาร์' },
  { level: 5, cats: ['audit_life', 'office_fuel', 'engineering'], moves: 60, cardsPerCat: 6, name: 'ชีวิตผู้ตรวจ อปท.: เอกสารตรวจ, ของยังชีพ, งานช่าง' },
  { level: 6, cats: ['pets', 'ocean', 'can_fly'], moves: 50, cardsPerCat: 6, name: 'อาณาจักรสัตว์โลก 3 มิติ' },
  { level: 7, cats: ['fruits', 'bakery', 'drinks'], moves: 50, cardsPerCat: 6, name: 'คาเฟ่ของหวานและผลไม้สด' },
  { level: 8, cats: ['vehicles', 'space', 'engineering'], moves: 55, cardsPerCat: 6, name: 'ยานยนต์ วิศวกรรม และอวกาศ' },
  { level: 9, cats: ['jobs', 'audit_life', 'office_fuel'], moves: 55, cardsPerCat: 6, name: 'รวมพลคนทำงานออฟฟิศ อปท.' },
  { level: 10, cats: ['magic', 'dino', 'ocean'], moves: 50, cardsPerCat: 6, name: 'สิ่งมีชีวิตลึกลับและมนตร์วิเศษ' }
];

// Helper to get configuration for ANY level (1 to 100+)
const getLevelData = (lvl) => {
  const preset = LEVEL_PRESETS[(lvl - 1) % LEVEL_PRESETS.length];
  const catKeys = preset.cats;
  const cardsPerCat = preset.cardsPerCat;

  // Selected 3 categories
  const categories = catKeys.map((k) => ({
    ...MASTER_CATEGORIES[k],
    max: cardsPerCat
  }));

  // Collect all cards for these 3 categories
  const pool = [];
  categories.forEach((cat) => {
    const catCards = MASTER_CATEGORIES[cat.id].cards.slice(0, cardsPerCat);
    catCards.forEach((c) => pool.push(c.id));
  });

  // Deterministic shuffle based on level number
  const shuffled = [...pool].sort((a, b) => {
    const hashA = (a.charCodeAt(0) * 31 + lvl * 17) % 100;
    const hashB = (b.charCodeAt(0) * 31 + lvl * 17) % 100;
    return hashA - hashB;
  });

  // Distribute into 4 columns (4 slots per column, with hidden cards if level > 1)
  const stacks = [[], [], [], []];
  const totalSlots = 16;
  const cardsPerSlot = Math.ceil(shuffled.length / totalSlots);

  let cardIndex = 0;
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      if (cardIndex < shuffled.length) {
        const top = shuffled[cardIndex++];
        const hidden = [];
        // Add hidden card depth in later levels
        if (lvl >= 2 && cardIndex < shuffled.length && Math.random() < 0.35) {
          hidden.push(shuffled[cardIndex++]);
        }
        stacks[c].push({ top, hidden });
      } else {
        stacks[c].push({ top: null, hidden: [] });
      }
    }
  }

  return {
    levelNumber: lvl,
    name: `LEVEL ${lvl}: ${preset.name}`,
    moves: preset.moves,
    rewardCoins: 100 + lvl * 25,
    categories,
    stacks
  };
};

export default function CardSortPuzzleView() {
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('card_sort_level');
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  const [currentConfig, setCurrentConfig] = useState(() => getLevelData(level));
  const [movesLeft, setMovesLeft] = useState(() => currentConfig.moves);
  const [coins, setCoins] = useState(() => {
    return parseInt(localStorage.getItem('card_sort_coins') || '250', 10);
  });

  const [hintCount, setHintCount] = useState(3);
  const [undoCount, setUndoCount] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [draggedCardInfo, setDraggedCardInfo] = useState(null); // { cardId, from }
  const [dragHoverTarget, setDragHoverTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);

  // Bench slots on the right (6 slots)
  const [benchSlots, setBenchSlots] = useState([
    { id: 0, card: null, locked: false },
    { id: 1, card: null, locked: false },
    { id: 2, card: null, locked: false },
    { id: 3, card: null, locked: false },
    { id: 4, card: null, locked: true, unlockCost: 250 },
    { id: 5, card: null, locked: true, unlockCost: 250 }
  ]);

  // Completed categories in current level
  const [completedCategories, setCompletedCategories] = useState(() => {
    const initial = {};
    currentConfig.categories.forEach((cat) => {
      initial[cat.id] = [];
    });
    return initial;
  });

  // Stacks in the grid
  const [gridStacks, setGridStacks] = useState(() => JSON.parse(JSON.stringify(currentConfig.stacks)));

  // Load a level
  const loadLevel = (lvlNum) => {
    const conf = getLevelData(lvlNum);
    setLevel(lvlNum);
    setCurrentConfig(conf);
    setMovesLeft(conf.moves);
    setGridStacks(JSON.parse(JSON.stringify(conf.stacks)));

    const freshCats = {};
    conf.categories.forEach((cat) => {
      freshCats[cat.id] = [];
    });
    setCompletedCategories(freshCats);

    setBenchSlots([
      { id: 0, card: null, locked: false },
      { id: 1, card: null, locked: false },
      { id: 2, card: null, locked: false },
      { id: 3, card: null, locked: false },
      { id: 4, card: null, locked: true, unlockCost: 250 },
      { id: 5, card: null, locked: true, unlockCost: 250 }
    ]);
    setSelectedCardId(null);
    setSelectedFrom(null);
    setDraggedCardInfo(null);
    setHistory([]);
    setIsWon(false);
  };

  // Save progress
  useEffect(() => {
    localStorage.setItem('card_sort_level', level.toString());
    localStorage.setItem('card_sort_coins', coins.toString());
  }, [level, coins]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Check victory condition
  useEffect(() => {
    const totalRequired = currentConfig.categories.reduce((sum, c) => sum + c.max, 0);
    const totalPlaced = Object.values(completedCategories).reduce((sum, arr) => sum + arr.length, 0);

    if (totalPlaced >= totalRequired && !isWon) {
      setIsWon(true);
      playSound('win', isMuted);
      setCoins((c) => c + currentConfig.rewardCoins);
      showToast(`🎉 ชัยชนะ! คุณลากจัดหมวดหมู่สำเร็จครบทุกใบ (+${currentConfig.rewardCoins} เหรียญ)`);
    }
  }, [completedCategories, isWon, currentConfig, level, isMuted]);

  // ==========================================
  // CARD INTERACTION (DRAG & DROP + CLICK-TO-PICK)
  // ==========================================

  // 1. Click on card: Select/pick up (Does NOT auto-fly!)
  const handleCardClick = (cardId, fromLocation) => {
    if (!cardId) return;

    if (selectedCardId === cardId) {
      // Deselect
      setSelectedCardId(null);
      setSelectedFrom(null);
      playSound('place', isMuted);
    } else {
      // Pick up card
      setSelectedCardId(cardId);
      setSelectedFrom(fromLocation);
      playSound('select', isMuted);
      showToast(`หยิบ "${ALL_CARDS_MAP[cardId]?.name}" แล้ว! 👉 ลากหรือแตะไปวางที่หมวดหมู่หรือม้านั่ง`);
    }
  };

  // 2. Drag Start
  const handleDragStart = (e, cardId, fromLocation) => {
    setDraggedCardInfo({ cardId, from: fromLocation });
    setSelectedCardId(cardId);
    setSelectedFrom(fromLocation);
    playSound('select', isMuted);
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragEnd = () => {
    setDraggedCardInfo(null);
    setDragHoverTarget(null);
  };

  // 3. Drop / Place onto Category Target
  const handleDropOrPlaceOnCategory = (targetCatId) => {
    const activeCardId = draggedCardInfo?.cardId || selectedCardId;
    const activeFrom = draggedCardInfo?.from || selectedFrom;

    if (!activeCardId || !activeFrom) {
      showToast('👉 กรุณาลากการ์ด หรือคลิกหยิบการ์ดก่อนนำมาใส่ที่หมวดหมู่นี้ครับ');
      return;
    }

    const cardData = ALL_CARDS_MAP[activeCardId];
    if (!cardData) return;

    if (movesLeft <= 0) {
      showToast('⚠️ จำนวน Moves หมดแล้ว!');
      playSound('error', isMuted);
      return;
    }

    // CHECK VALID CATEGORY
    if (cardData.category !== targetCatId) {
      // Penalty move deduction on wrong placement
      setMovesLeft((m) => Math.max(0, m - 1));
      playSound('error', isMuted);
      showToast(`❌ ผิดหมวดหมู่! "${cardData.name}" (${cardData.thai}) ไม่ใช่หมวดนี้ (เสีย 1 Move)`);
      return;
    }

    const targetCat = currentConfig.categories.find((c) => c.id === targetCatId);
    if ((completedCategories[targetCatId]?.length || 0) >= (targetCat?.max || 6)) {
      showToast('⚠️ หมวดหมู่นี้จัดเก็บครบจำนวนแล้ว!');
      playSound('error', isMuted);
      return;
    }

    // SUCCESSFUL TRANSFER
    saveUndoState();
    setMovesLeft((m) => m - 1);

    // Remove from source and reveal next card if any
    if (activeFrom.type === 'grid') {
      setGridStacks((prev) =>
        prev.map((col, cIdx) =>
          col.map((slot, rIdx) => {
            if (cIdx === activeFrom.colIdx && rIdx === activeFrom.rowIdx) {
              if (slot.hidden.length > 0) {
                playSound('flip', isMuted);
                return { top: slot.hidden[0], hidden: slot.hidden.slice(1) };
              }
              return { top: null, hidden: [] };
            }
            return slot;
          })
        )
      );
    } else if (activeFrom.type === 'bench') {
      setBenchSlots((prev) =>
        prev.map((s, idx) => (idx === activeFrom.benchIdx ? { ...s, card: null } : s))
      );
    }

    // Add to category
    setCompletedCategories((prev) => ({
      ...prev,
      [targetCatId]: [...(prev[targetCatId] || []), activeCardId]
    }));

    setSelectedCardId(null);
    setSelectedFrom(null);
    setDraggedCardInfo(null);
    setDragHoverTarget(null);
    playSound('match', isMuted);
    showToast(`✨ ยอดเยี่ยม! จัดเก็บ "${cardData.name}" เข้าหมวด ${targetCat.name} สำเร็จ!`);
  };

  // 4. Drop / Place onto Bench Target
  const handleDropOrPlaceOnBench = (targetBenchIdx) => {
    const slot = benchSlots[targetBenchIdx];

    // If locked, attempt unlock
    if (slot.locked) {
      if (coins >= slot.unlockCost) {
        setCoins((c) => c - slot.unlockCost);
        setBenchSlots((prev) =>
          prev.map((s, i) => (i === targetBenchIdx ? { ...s, locked: false } : s))
        );
        playSound('match', isMuted);
        showToast('🔓 ปลดล็อกม้านั่งสำรองเรียบร้อยแล้ว!');
      } else {
        showToast(`❌ เหรียญไม่พอปลดล็อกม้านั่ง (ต้องการ ${slot.unlockCost} เหรียญ)`);
        playSound('error', isMuted);
      }
      return;
    }

    const activeCardId = draggedCardInfo?.cardId || selectedCardId;
    const activeFrom = draggedCardInfo?.from || selectedFrom;

    if (!activeCardId || !activeFrom) {
      // If clicking existing card on bench without dragging: pick it up!
      if (slot.card) {
        handleCardClick(slot.card, { type: 'bench', benchIdx: targetBenchIdx });
      }
      return;
    }

    // If slot already occupied
    if (slot.card && slot.card !== activeCardId) {
      showToast('⚠️ ช่องม้านั่งนี้มีไพ่อื่นวางอยู่แล้ว!');
      return;
    }

    if (movesLeft <= 0) {
      showToast('⚠️ จำนวน Moves หมดแล้ว!');
      playSound('error', isMuted);
      return;
    }

    saveUndoState();
    setMovesLeft((m) => m - 1);

    // Remove from source
    if (activeFrom.type === 'grid') {
      setGridStacks((prev) =>
        prev.map((col, cIdx) =>
          col.map((s, rIdx) => {
            if (cIdx === activeFrom.colIdx && rIdx === activeFrom.rowIdx) {
              if (s.hidden.length > 0) {
                playSound('flip', isMuted);
                return { top: s.hidden[0], hidden: s.hidden.slice(1) };
              }
              return { top: null, hidden: [] };
            }
            return s;
          })
        )
      );
    } else if (activeFrom.type === 'bench') {
      setBenchSlots((prev) =>
        prev.map((s, idx) => (idx === activeFrom.benchIdx ? { ...s, card: null } : s))
      );
    }

    // Place into bench
    setBenchSlots((prev) =>
      prev.map((s, idx) => (idx === targetBenchIdx ? { ...s, card: activeCardId } : s))
    );

    setSelectedCardId(null);
    setSelectedFrom(null);
    setDraggedCardInfo(null);
    playSound('place', isMuted);
    showToast(`🛋️ นำการ์ด "${ALL_CARDS_MAP[activeCardId]?.name}" มาพักไว้บนม้านั่ง`);
  };

  // Save Undo State
  const saveUndoState = () => {
    setHistory((prev) => [
      ...prev,
      {
        gridStacks: JSON.parse(JSON.stringify(gridStacks)),
        benchSlots: JSON.parse(JSON.stringify(benchSlots)),
        completedCategories: JSON.parse(JSON.stringify(completedCategories)),
        movesLeft
      }
    ]);
  };

  // Undo Move
  const handleUndo = () => {
    if (undoCount <= 0) {
      showToast('❌ สิทธิ์เลิกทำ (Undo) หมดแล้ว!');
      return;
    }
    if (history.length === 0) {
      showToast('ยังไม่มีการกระทำที่สามารถย้อนกลับได้');
      return;
    }

    const last = history[history.length - 1];
    setGridStacks(last.gridStacks);
    setBenchSlots(last.benchSlots);
    setCompletedCategories(last.completedCategories);
    setMovesLeft(last.movesLeft);
    setHistory((h) => h.slice(0, -1));
    setUndoCount((u) => u - 1);
    setSelectedCardId(null);
    setSelectedFrom(null);
    playSound('place', isMuted);
    showToast('↩️ ย้อนกลับการเดิน 1 ก้าวแล้ว');
  };

  // Hint Booster
  const handleHint = () => {
    if (hintCount <= 0) {
      showToast('❌ สิทธิ์คำใบ้ (Hint) หมดแล้ว!');
      return;
    }

    let foundCard = null;
    let foundLocation = null;

    gridStacks.forEach((col, cIdx) => {
      col.forEach((slot, rIdx) => {
        if (slot.top && !foundCard) {
          const catId = ALL_CARDS_MAP[slot.top]?.category;
          const targetCat = currentConfig.categories.find((c) => c.id === catId);
          if (targetCat && (completedCategories[catId]?.length || 0) < targetCat.max) {
            foundCard = slot.top;
            foundLocation = { type: 'grid', colIdx: cIdx, rowIdx: rIdx };
          }
        }
      });
    });

    if (!foundCard) {
      benchSlots.forEach((slot, bIdx) => {
        if (slot.card && !foundCard) {
          const catId = ALL_CARDS_MAP[slot.card]?.category;
          const targetCat = currentConfig.categories.find((c) => c.id === catId);
          if (targetCat && (completedCategories[catId]?.length || 0) < targetCat.max) {
            foundCard = slot.card;
            foundLocation = { type: 'bench', benchIdx: bIdx };
          }
        }
      });
    }

    if (foundCard) {
      setSelectedCardId(foundCard);
      setSelectedFrom(foundLocation);
      setHintCount((h) => h - 1);
      playSound('match', isMuted);
      showToast(`💡 คำใบ้: ลาก "${ALL_CARDS_MAP[foundCard]?.name}" ไปใส่ที่หมวด "${ALL_CARDS_MAP[foundCard]?.category}"!`);
    } else {
      showToast('💡 ตอนนี้ยังไม่มีการ์ดที่เข้าหมวดหมู่ได้ ลองลากการ์ดไปพักบนม้านั่งเพื่อเปิดการ์ดด้านล่าง!');
    }
  };

  // Magnet Booster
  const handleMagnet = () => {
    let target = null;
    gridStacks.forEach((col, cIdx) => {
      col.forEach((slot, rIdx) => {
        if (slot.top && !target) {
          const catId = ALL_CARDS_MAP[slot.top]?.category;
          const targetCat = currentConfig.categories.find((c) => c.id === catId);
          if (targetCat && (completedCategories[catId]?.length || 0) < targetCat.max) {
            target = { cardId: slot.top, from: { type: 'grid', colIdx: cIdx, rowIdx: rIdx }, catId };
          }
        }
      });
    });

    if (target) {
      setDraggedCardInfo(target);
      setTimeout(() => {
        handleDropOrPlaceOnCategory(target.catId);
      }, 100);
      playSound('match', isMuted);
      showToast('🧲 พลังแม่เหล็กดูดการ์ดเข้าหมวดหมู่อัตโนมัติ!');
    } else {
      showToast('ไม่พบการ์ดที่สามารถดูดได้ในขณะนี้');
    }
  };

  // Restart Current Level
  const handleRestart = () => {
    loadLevel(level);
    playSound('place', isMuted);
    showToast(`🔄 รีเซ็ต LEVEL ${level} เรียบร้อยแล้ว`);
  };

  // Advance to Next Level
  const handleNextLevel = () => {
    loadLevel(level + 1);
    showToast(`🚀 เข้าสู่ LEVEL ${level + 1}!`);
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

      {/* Main Wood Plank Board Container - Cardlings Board */}
      <div className="relative w-full min-h-[670px] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden border-8 border-[#3b1d0a] bg-gradient-to-b from-[#8b5a2b] via-[#75441e] to-[#552c0f] flex flex-col justify-between">
        {/* Subtle wood plank vertical grain texture lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:64px_100%] pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-black/50 pointer-events-none" />

        {/* TOP / MAIN GAMEPLAY AREA */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* ================= LEFT SIDE PANEL ================= */}
          <div className="flex md:flex-col items-center gap-3 shrink-0">
            {/* Settings & Sound Toggle Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-14 h-14 bg-gradient-to-b from-white via-slate-50 to-slate-200 hover:to-slate-300 rounded-2xl border-4 border-amber-500/80 shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_2px_0_#b45309] flex items-center justify-center transition-all cursor-pointer group"
              title="ตั้งค่า / เปิด-ปิดเสียง"
            >
              {isMuted ? (
                <VolumeX className="w-7 h-7 text-slate-500 group-hover:scale-110 transition-transform" />
              ) : (
                <Settings className="w-7 h-7 text-cyan-600 group-hover:rotate-45 transition-transform" />
              )}
            </button>

            {/* Level & Moves Counter Pill (Clickable to Select Level) */}
            <div
              onClick={() => setShowLevelSelect(true)}
              className="relative flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              title="คลิกเพื่อเลือกด่าน (Level Select)"
            >
              <div className="bg-[#115e59] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full border border-teal-300/40 shadow-xs z-10 -mb-2 flex items-center space-x-1">
                <span>LEVEL {level}</span>
                <span className="text-[9px] text-teal-200">▾</span>
              </div>
              <div className="bg-gradient-to-b from-white to-[#fef9c3] border-4 border-amber-700/80 shadow-[0_6px_0_#78350f] rounded-2xl px-4 pt-3 pb-2 text-center min-w-[108px]">
                <div className="text-2xl font-black text-slate-900 font-mono leading-none">
                  {movesLeft}
                </div>
                <div className="text-[10px] font-extrabold text-amber-900 tracking-wider uppercase mt-0.5">
                  Moves
                </div>
              </div>
            </div>

            {/* Coins Counter Pill */}
            <div className="bg-gradient-to-b from-white to-[#fef9c3] border-4 border-amber-700/80 shadow-[0_6px_0_#78350f] rounded-2xl px-3 py-2 flex items-center space-x-2 min-w-[108px] justify-center">
              <div className="w-6 h-6 bg-amber-400 rounded-full border border-amber-600 flex items-center justify-center shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-800" />
              </div>
              <span className="font-black text-slate-900 font-mono text-base">{coins}</span>
            </div>

            {/* How to Play Help button */}
            <button
              onClick={() => setShowHowToPlay(true)}
              className="w-10 h-10 bg-amber-950/60 hover:bg-amber-900/80 rounded-xl border-2 border-amber-700/70 text-amber-200 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
              title="วิธีการเล่น (Rules)"
            >
              <HelpCircle className="w-5 h-5 text-amber-300" />
            </button>
          </div>

          {/* ================= CENTER BOARD (GRID & CATEGORIES) ================= */}
          <div className="flex-1 flex flex-col items-center max-w-2xl w-full">
            {/* Top Indicator Bars (3 blue bars above card stacks, 3 gold bars above category) */}
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 w-full max-w-xl mb-2 px-1">
              {[0, 1, 2, 3, 4].map((colIdx) => (
                <div key={colIdx} className="space-y-0.5">
                  <div className={`h-1.5 rounded-full ${colIdx === 2 ? 'bg-amber-400' : 'bg-blue-500'} shadow-xs`} />
                  <div className={`h-1.5 rounded-full ${colIdx === 2 ? 'bg-amber-400' : 'bg-blue-500'} shadow-xs`} />
                  <div className={`h-1.5 rounded-full ${colIdx === 2 ? 'bg-amber-400' : 'bg-blue-500'} shadow-xs`} />
                </div>
              ))}
            </div>

            {/* Main 5-Column Grid */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-xl">
              {/* Column 0: Cards */}
              <div className="flex flex-col gap-2.5">
                {[0, 1, 2, 3].map((rowIdx) => {
                  const slot = gridStacks[0]?.[rowIdx];
                  const card = slot?.top ? ALL_CARDS_MAP[slot.top] : null;
                  const isSelected = selectedCardId === slot?.top && slot?.top !== null;

                  if (!card) {
                    return (
                      <div
                        key={rowIdx}
                        className="h-24 sm:h-28 rounded-2xl border-2 border-dashed border-amber-900/40 bg-amber-950/20"
                      />
                    );
                  }

                  return (
                    <div
                      key={rowIdx}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, slot.top, { type: 'grid', colIdx: 0, rowIdx })}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx: 0, rowIdx })}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      {slot.hidden.length > 0 && (
                        <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {slot.hidden.length}
                        </div>
                      )}
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none pointer-events-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full pointer-events-none">
                        {card.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Column 1: Cards */}
              <div className="flex flex-col gap-2.5">
                {[0, 1, 2, 3].map((rowIdx) => {
                  const slot = gridStacks[1]?.[rowIdx];
                  const card = slot?.top ? ALL_CARDS_MAP[slot.top] : null;
                  const isSelected = selectedCardId === slot?.top && slot?.top !== null;

                  if (!card) {
                    return (
                      <div
                        key={rowIdx}
                        className="h-24 sm:h-28 rounded-2xl border-2 border-dashed border-amber-900/40 bg-amber-950/20"
                      />
                    );
                  }

                  return (
                    <div
                      key={rowIdx}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, slot.top, { type: 'grid', colIdx: 1, rowIdx })}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx: 1, rowIdx })}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      {slot.hidden.length > 0 && (
                        <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {slot.hidden.length}
                        </div>
                      )}
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none pointer-events-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full pointer-events-none">
                        {card.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Column 2: THE 3 ACTIVE CATEGORIES & PLUS EXPANDER (DROP ZONES) */}
              <div className="flex flex-col gap-2.5">
                {currentConfig.categories.map((cat) => {
                  const placedList = completedCategories[cat.id] || [];
                  const isHovered = dragHoverTarget === cat.id;
                  const isTargetMatch = selectedCardId && ALL_CARDS_MAP[selectedCardId]?.category === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragHoverTarget(cat.id);
                      }}
                      onDragLeave={() => setDragHoverTarget(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDropOrPlaceOnCategory(cat.id);
                      }}
                      onClick={() => handleDropOrPlaceOnCategory(cat.id)}
                      className={`h-24 sm:h-28 rounded-2xl border-3 border-amber-400/90 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_5px_0_#b45309] hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 text-center ${
                        isHovered || isTargetMatch
                          ? 'ring-4 ring-amber-400 scale-102 bg-amber-100 shadow-xl'
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-1 text-[11px] font-black text-amber-900 pointer-events-none">
                        <span>
                          {placedList.length}/{cat.max}
                        </span>
                        <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 truncate max-w-full pointer-events-none">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-amber-800 font-bold mt-0.5 truncate max-w-full pointer-events-none">
                        {placedList.length > 0
                          ? placedList.map((c) => ALL_CARDS_MAP[c]?.icon).join('')
                          : 'ลากมาวางที่นี่'}
                      </div>
                    </div>
                  );
                })}

                {/* Slot 4: Extra Golden Category Expander */}
                <div
                  onClick={() => showToast('✨ ปลดล็อกหมวดหมู่เพิ่มเติมในด่านถัดไป')}
                  className="h-24 sm:h-28 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-950/40 flex flex-col items-center justify-center text-amber-400 cursor-pointer hover:bg-amber-900/40 transition-colors shadow-inner"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-amber-300 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Column 3: Cards */}
              <div className="flex flex-col gap-2.5">
                {[0, 1, 2, 3].map((rowIdx) => {
                  const slot = gridStacks[2]?.[rowIdx];
                  const card = slot?.top ? ALL_CARDS_MAP[slot.top] : null;
                  const isSelected = selectedCardId === slot?.top && slot?.top !== null;

                  if (!card) {
                    return (
                      <div
                        key={rowIdx}
                        className="h-24 sm:h-28 rounded-2xl border-2 border-dashed border-amber-900/40 bg-amber-950/20"
                      />
                    );
                  }

                  return (
                    <div
                      key={rowIdx}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, slot.top, { type: 'grid', colIdx: 2, rowIdx })}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx: 2, rowIdx })}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      {slot.hidden.length > 0 && (
                        <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {slot.hidden.length}
                        </div>
                      )}
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none pointer-events-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full pointer-events-none">
                        {card.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Column 4: Cards */}
              <div className="flex flex-col gap-2.5">
                {[0, 1, 2, 3].map((rowIdx) => {
                  const slot = gridStacks[3]?.[rowIdx];
                  const card = slot?.top ? ALL_CARDS_MAP[slot.top] : null;
                  const isSelected = selectedCardId === slot?.top && slot?.top !== null;

                  if (!card) {
                    return (
                      <div
                        key={rowIdx}
                        className="h-24 sm:h-28 rounded-2xl border-2 border-dashed border-amber-900/40 bg-amber-950/20"
                      />
                    );
                  }

                  return (
                    <div
                      key={rowIdx}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, slot.top, { type: 'grid', colIdx: 3, rowIdx })}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx: 3, rowIdx })}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      {slot.hidden.length > 0 && (
                        <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {slot.hidden.length}
                        </div>
                      )}
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none pointer-events-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full pointer-events-none">
                        {card.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= BENCH SLOTS (ม้านั่งพักการ์ด - DROP ZONES) ================= */}
          <div className="flex md:flex-col gap-2.5 shrink-0">
            {benchSlots.map((slot, idx) => {
              const card = slot.card ? ALL_CARDS_MAP[slot.card] : null;
              const isSelected = selectedCardId === slot.card && slot.card !== null;

              if (slot.locked) {
                return (
                  <div
                    key={slot.id}
                    onClick={() => handleDropOrPlaceOnBench(idx)}
                    className="w-16 h-18 sm:w-18 sm:h-20 rounded-2xl bg-amber-950/70 border-2 border-amber-900/80 shadow-inner flex flex-col items-center justify-center cursor-pointer hover:bg-amber-900/70 transition-colors"
                    title="คลิกเพื่อปลดล็อกม้านั่งสำรองด้วย 250 เหรียญ"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center shadow-xs">
                      <Star className="w-3 h-3 fill-amber-700 text-amber-800" />
                    </div>
                    <span className="text-[10px] font-black text-amber-300 font-mono mt-1">250</span>
                  </div>
                );
              }

              if (card) {
                return (
                  <div
                    key={slot.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, slot.card, { type: 'bench', benchIdx: idx })}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleCardClick(slot.card, { type: 'bench', benchIdx: idx })}
                    className={`w-16 h-18 sm:w-18 sm:h-20 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] flex flex-col items-center justify-center p-1 text-center cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all ${
                      isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl' : ''
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl leading-none pointer-events-none">{card.icon}</span>
                    <span className="text-[9px] font-black text-slate-800 mt-1 truncate max-w-full pointer-events-none">
                      {card.name}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={slot.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropOrPlaceOnBench(idx);
                  }}
                  onClick={() => handleDropOrPlaceOnBench(idx)}
                  className={`w-16 h-18 sm:w-18 sm:h-20 rounded-2xl bg-amber-950/60 border-2 border-amber-900/80 shadow-inner flex items-center justify-center cursor-pointer transition-colors ${
                    selectedCardId ? 'hover:bg-amber-800/50 ring-2 ring-amber-400/60' : ''
                  }`}
                  title="ม้านั่งพักการ์ด (ลากการ์ดมาวางที่นี่ หรือแตะเพื่อวาง)"
                />
              );
            })}
          </div>

          {/* ================= RIGHT SIDE ACTION BOOSTERS ================= */}
          <div className="flex md:flex-col items-center gap-3 shrink-0">
            {/* 1. Hint Button */}
            <button
              onClick={handleHint}
              className="relative w-14 h-14 bg-gradient-to-b from-white via-slate-50 to-slate-200 hover:to-slate-300 rounded-2xl border-4 border-amber-500/80 shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_2px_0_#b45309] flex items-center justify-center transition-all cursor-pointer group"
              title="คำใบ้ (Hint)"
            >
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white font-bold text-xs rounded-full flex items-center justify-center border border-white shadow-xs">
                {hintCount}
              </span>
              <Lightbulb className="w-7 h-7 text-amber-500 fill-amber-400 group-hover:scale-110 transition-transform" />
            </button>

            {/* 2. Magnet Booster */}
            <button
              onClick={handleMagnet}
              className="relative w-14 h-14 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 rounded-2xl border-4 border-slate-400 shadow-[0_6px_0_#64748b] flex flex-col items-center justify-center cursor-pointer hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#64748b]"
              title="แม่เหล็กดูดการ์ด (Magnet)"
            >
              <Magnet className="w-6 h-6 text-slate-600" />
              <div className="bg-teal-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full mt-0.5">
                Lv 7
              </div>
            </button>

            {/* 3. Undo Button */}
            <button
              onClick={handleUndo}
              className="relative w-14 h-14 bg-gradient-to-b from-white via-slate-50 to-slate-200 hover:to-slate-300 rounded-2xl border-4 border-amber-500/80 shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_2px_0_#b45309] flex items-center justify-center transition-all cursor-pointer group"
              title="เลิกทำ (Undo)"
            >
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white font-bold text-xs rounded-full flex items-center justify-center border border-white shadow-xs">
                {undoCount}
              </span>
              <Undo2 className="w-7 h-7 text-teal-600 stroke-[3] group-hover:-rotate-45 transition-transform" />
            </button>

            {/* 4. Magic Star Booster */}
            <button
              onClick={handleRestart}
              className="relative w-14 h-14 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 rounded-2xl border-4 border-slate-400 shadow-[0_6px_0_#64748b] flex flex-col items-center justify-center cursor-pointer hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#64748b]"
              title="เริ่มด่านใหม่ (Restart)"
            >
              <RefreshCw className="w-6 h-6 text-slate-600" />
              <div className="bg-slate-700 text-white text-[8px] font-black px-1 rounded-full mt-0.5">
                Reset
              </div>
            </button>
          </div>
        </div>

        {/* BOTTOM HELPER BAR */}
        <div className="relative z-10 mt-4 bg-amber-950/70 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-amber-700/60 flex flex-wrap items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-amber-400" />
            <span className="font-bold">🎯 {currentConfig.name}</span>
            <span className="text-amber-300/80">• (ลากการ์ดด้วยเมาส์ หรือแตะเพื่อหยิบไปวางในช่อง)</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowLevelSelect(true)}
              className="text-amber-300 hover:text-white underline font-bold cursor-pointer"
            >
              เลือกระดับด่าน (Level 1-20+)
            </button>
            <span>•</span>
            <button
              onClick={() => setShowHowToPlay(true)}
              className="text-amber-300 hover:text-white underline font-bold cursor-pointer"
            >
              กติกาการเล่น
            </button>
          </div>
        </div>
      </div>

      {/* LEVEL SELECT MODAL (Supports Level 1 to 20+) */}
      {showLevelSelect && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-300/80 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-950 font-mono">
                  เลือกระดับด่าน (Level Select)
                </h3>
                <p className="text-[11px] text-amber-800 font-bold">
                  เลือกด่านที่ต้องการเล่น มีความท้าทายกว่า 20+ ด่าน
                </p>
              </div>
              <button
                onClick={() => setShowLevelSelect(false)}
                className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((lvlNum) => {
                const conf = getLevelData(lvlNum);
                const isCurrent = level === lvlNum;

                return (
                  <div
                    key={lvlNum}
                    onClick={() => {
                      loadLevel(lvlNum);
                      setShowLevelSelect(false);
                      showToast(`เข้าสู่ ${conf.name}`);
                    }}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                        : 'bg-white hover:bg-amber-100/70 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-sm">LEVEL {lvlNum}</span>
                        {isCurrent && (
                          <span className="bg-white text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                            กำลังเล่น
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isCurrent ? 'text-amber-100' : 'text-slate-600'}`}>
                        {conf.name.split(': ')[1] || conf.name}
                      </p>
                      <div className={`text-[10px] mt-1 flex space-x-3 ${isCurrent ? 'text-amber-200' : 'text-slate-500'}`}>
                        <span>Moves: {conf.moves}</span>
                        <span>รางวัล: +{conf.rewardCoins} เหรียญ</span>
                      </div>
                    </div>

                    <div className="text-2xl">
                      {conf.categories[0]?.icon || '⭐'}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowLevelSelect(false)}
              className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* HOW TO PLAY MODAL */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-300/80 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-950 font-mono">
                  Cardlings - Category Sort Puzzle
                </h3>
                <p className="text-[11px] text-amber-800 font-bold">
                  ผู้พัฒนา: blu studios | เอ็นจิ้น: HTML5
                </p>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-amber-950 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <p className="font-bold text-slate-800">
                สนุกไปกับเกมเรียงการ์ดแสนสนุกนี้ การ์ดแต่ละใบมีรูปภาพน่ารัก และอยู่ในหมวดหมู่ที่กำหนด ลากการ์ดจับคู่เข้าหมวดหมู่ เติมให้ครบ และเคลียร์โต๊ะ!
              </p>
              <div className="space-y-2 bg-white/70 p-4 rounded-2xl border border-amber-200">
                <div className="font-extrabold text-amber-900 text-sm">💡 วิธีการเล่น (ฉบับ Drag & Drop):</div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
                  <li><b>ลากการ์ดด้วยเมาส์</b> หรือคลิกหยิบการ์ดแล้วนำไปวางในช่องหมวดหมู่ที่ถูกต้อง</li>
                  <li><b>วางการ์ดไว้บนม้านั่ง</b> (ช่องพักทางขวา) เพื่อรอให้หมวดหมู่ว่าง หรือเปิดไพ่ใบที่อยู่ด้านล่าง</li>
                  <li><b>ระวังการเคลื่อนไหว:</b> หากนำไปวางผิดหมวดหมู่ จะเสีย 1 Move!</li>
                  <li><b>ไพ่ด้านล่างจะพลิกหงาย</b> เมื่อคุณย้ายไพ่ใบบนออก</li>
                  <li>ติดขัดใช่ไหม? ใช้คำใบ้ 💡 หรือแม่เหล็ก 🧲 ได้เลย</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm rounded-2xl shadow-[0_4px_0_#92400e] active:translate-y-1 active:shadow-none cursor-pointer"
            >
              เข้าใจแล้ว เริ่มลุยเลย!
            </button>
          </div>
        </div>
      )}

      {/* WIN POPUP MODAL */}
      {isWon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-600 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-amber-400 rounded-full border-4 border-amber-600 flex items-center justify-center mx-auto shadow-lg animate-bounce text-4xl">
              🏆
            </div>
            <div>
              <h2 className="text-2xl font-black text-amber-950 font-mono">VICTORY!</h2>
              <p className="text-xs text-amber-800 mt-1 font-bold">
                ยินดีด้วย! คุณเคลียร์ LEVEL {level} สำเร็จครบทุกหมวด (+{currentConfig.rewardCoins} เหรียญทอง)
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 bg-amber-200/60 py-2 rounded-xl text-amber-900 font-black">
              <Star className="w-5 h-5 fill-amber-500 text-amber-600" />
              <span>เหรียญรวม: {coins} เหรียญ</span>
            </div>

            <button
              onClick={handleNextLevel}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-[0_5px_0_#065f46] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>ไปต่อด่านถัดไป (LEVEL {level + 1})</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
