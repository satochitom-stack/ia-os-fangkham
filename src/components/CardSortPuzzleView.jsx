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
  Award
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

// Complete Card Database across all 5 Levels
const ALL_CARDS = {
  // Level 1: Pets, Fruits, Vehicles
  dog: { id: 'dog', name: 'Puppy', icon: '🐶', category: 'pets', thai: 'น้องหมา' },
  cat: { id: 'cat', name: 'Kitty', icon: '🐱', category: 'pets', thai: 'น้องแมว' },
  bunny: { id: 'bunny', name: 'Bunny', icon: '🐰', category: 'pets', thai: 'กระต่าย' },
  hamster: { id: 'hamster', name: 'Hamster', icon: '🐹', category: 'pets', thai: 'แฮมสเตอร์' },

  apple: { id: 'apple', name: 'Apple', icon: '🍎', category: 'fruits', thai: 'แอปเปิ้ล' },
  banana: { id: 'banana', name: 'Banana', icon: '🍌', category: 'fruits', thai: 'กล้วยหอม' },
  strawberry: { id: 'strawberry', name: 'Strawberry', icon: '🍓', category: 'fruits', thai: 'สตรอว์เบอร์รี' },
  grape: { id: 'grape', name: 'Grape', icon: '🍇', category: 'fruits', thai: 'องุ่น' },

  car: { id: 'car', name: 'Car', icon: '🚗', category: 'vehicles', thai: 'รถเก๋ง' },
  bus: { id: 'bus', name: 'Bus', icon: '🚌', category: 'vehicles', thai: 'รถบัส' },
  airplane: { id: 'airplane', name: 'Airplane', icon: '✈️', category: 'vehicles', thai: 'เครื่องบิน' },
  train: { id: 'train', name: 'Train', icon: '🚆', category: 'vehicles', thai: 'รถไฟ' },

  // Level 2: Ocean, Jobs, Can Fly (Cardlings Official Screenshot)
  dolphin: { id: 'dolphin', name: 'Dolphin', icon: '🐬', category: 'ocean', thai: 'โลมา' },
  octopus: { id: 'octopus', name: 'Octopus', icon: '🐙', category: 'ocean', thai: 'หมึกยักษ์' },
  whale: { id: 'whale', name: 'Whale', icon: '🐳', category: 'ocean', thai: 'วาฬสีน้ำเงิน' },
  clownfish: { id: 'clownfish', name: 'Clownfish', icon: '🐠', category: 'ocean', thai: 'ปลาการ์ตูน' },
  jellyfish: { id: 'jellyfish', name: 'Jellyfish', icon: '🪼', category: 'ocean', thai: 'แมงกะพรุน' },
  shark: { id: 'shark', name: 'Shark', icon: '🦈', category: 'ocean', thai: 'ฉลาม' },

  chef: { id: 'chef', name: 'Chef', icon: '👨‍🍳', category: 'jobs', thai: 'เชฟ' },
  firefighter: { id: 'firefighter', name: 'Firefighter', icon: '👩‍🚒', category: 'jobs', thai: 'นักดับเพลิง' },
  scientist: { id: 'scientist', name: 'Scientist', icon: '👩‍🔬', category: 'jobs', thai: 'นักวิทยาศาสตร์' },
  farmer: { id: 'farmer', name: 'Farmer', icon: '👨‍🌾', category: 'jobs', thai: 'ชาวสวน' },
  princess: { id: 'princess', name: 'Princess', icon: '👸', category: 'jobs', thai: 'เจ้าหญิง' },
  doctor: { id: 'doctor', name: 'Doctor', icon: '👩‍⚕️', category: 'jobs', thai: 'คุณหมอ' },

  phoenix: { id: 'phoenix', name: 'Phoenix', icon: '🦅', category: 'can_fly', thai: 'ฟีนิกซ์' },
  griffin: { id: 'griffin', name: 'Griffin', icon: '🦁', category: 'can_fly', thai: 'กริฟฟอน' },
  eagle: { id: 'eagle', name: 'Eagle', icon: '🦅', category: 'can_fly', thai: 'นกอินทรี' },
  flamingo: { id: 'flamingo', name: 'Flamingo', icon: '🦩', category: 'can_fly', thai: 'ฟลามิงโก' },
  hummingbird: { id: 'hummingbird', name: 'Hummingbird', icon: '🐦', category: 'can_fly', thai: 'ฮัมมิงเบิร์ด' },
  glider: { id: 'glider', name: 'Glider', icon: '🛩️', category: 'can_fly', thai: 'เครื่องร่อน' },

  // Level 3: Bakery, Fast Food, Drinks
  cupcake: { id: 'cupcake', name: 'Cupcake', icon: '🧁', category: 'bakery', thai: 'คัพเค้ก' },
  croissant: { id: 'croissant', name: 'Croissant', icon: '🥐', category: 'bakery', thai: 'ครัวซองต์' },
  donut: { id: 'donut', name: 'Donut', icon: '🍩', category: 'bakery', thai: 'โดนัท' },
  cookie: { id: 'cookie', name: 'Cookie', icon: '🍪', category: 'bakery', thai: 'คุกกี้' },
  pancake: { id: 'pancake', name: 'Pancake', icon: '🥞', category: 'bakery', thai: 'แพนเค้ก' },
  cake: { id: 'cake', name: 'Cake', icon: '🍰', category: 'bakery', thai: 'เค้กช็อกโกแลต' },

  pizza: { id: 'pizza', name: 'Pizza', icon: '🍕', category: 'fastfood', thai: 'พิซซ่า' },
  burger: { id: 'burger', name: 'Burger', icon: '🍔', category: 'fastfood', thai: 'เบอร์เกอร์' },
  fries: { id: 'fries', name: 'Fries', icon: '🍟', category: 'fastfood', thai: 'เฟรนช์ฟรายส์' },
  hotdog: { id: 'hotdog', name: 'Hotdog', icon: '🌭', category: 'fastfood', thai: 'ฮอทดอก' },
  taco: { id: 'taco', name: 'Taco', icon: '🌮', category: 'fastfood', thai: 'ทาโก้' },
  popcorn: { id: 'popcorn', name: 'Popcorn', icon: '🍿', category: 'fastfood', thai: 'ป๊อปคอร์น' },

  boba: { id: 'boba', name: 'Boba Tea', icon: '🧋', category: 'drinks', thai: 'ชานมไข่มุก' },
  coffee: { id: 'coffee', name: 'Coffee', icon: '☕', category: 'drinks', thai: 'กาแฟสด' },
  juice: { id: 'juice', name: 'Juice', icon: '🧃', category: 'drinks', thai: 'น้ำผลไม้' },
  soda: { id: 'soda', name: 'Soda', icon: '🥤', category: 'drinks', thai: 'น้ำอัดลม' },
  milk: { id: 'milk', name: 'Milk', icon: '🥛', category: 'drinks', thai: 'นมสด' },
  tea: { id: 'tea', name: 'Hot Tea', icon: '🍵', category: 'drinks', thai: 'ชาเขียว' },

  // Level 4: Space, Magic, Dinosaurs
  astronaut: { id: 'astronaut', name: 'Astronaut', icon: '👨‍🚀', category: 'space', thai: 'นักบินอวกาศ' },
  rocket: { id: 'rocket', name: 'Rocket', icon: '🚀', category: 'space', thai: 'จรวด' },
  ufo: { id: 'ufo', name: 'UFO', icon: '🛸', category: 'space', thai: 'จานบิน' },
  alien: { id: 'alien', name: 'Alien', icon: '👽', category: 'space', thai: 'เอเลี่ยน' },
  planet: { id: 'planet', name: 'Planet', icon: '🪐', category: 'space', thai: 'ดาวเสาร์' },
  telescope: { id: 'telescope', name: 'Telescope', icon: '🔭', category: 'space', thai: 'กล้องดูดาว' },

  wizard: { id: 'wizard', name: 'Wizard', icon: '🧙', category: 'magic', thai: 'พ่อมด' },
  crystal: { id: 'crystal', name: 'Crystal', icon: '🔮', category: 'magic', thai: 'ลูกแก้วพยากรณ์' },
  wand: { id: 'wand', name: 'Magic Wand', icon: '🪄', category: 'magic', thai: 'ไม้กายสิทธิ์' },
  potion: { id: 'potion', name: 'Potion', icon: '🧪', category: 'magic', thai: 'น้ำยาเวทมนตร์' },
  cauldron: { id: 'cauldron', name: 'Cauldron', icon: '🫕', category: 'magic', thai: 'หม้อต้มยา' },
  scroll: { id: 'scroll', name: 'Spell Scroll', icon: '📜', category: 'magic', thai: 'คัมภีร์เวท' },

  trex: { id: 'trex', name: 'T-Rex', icon: '🦖', category: 'dino', thai: 'ทีเร็กซ์' },
  sauropod: { id: 'sauropod', name: 'Brontosaurus', icon: '🦕', category: 'dino', thai: 'คอยาว' },
  pterodactyl: { id: 'pterodactyl', name: 'Pterodactyl', icon: '🦅', category: 'dino', thai: 'เทอโรซอร์' },
  dino_egg: { id: 'dino_egg', name: 'Dino Egg', icon: '🥚', category: 'dino', thai: 'ไข่ไดโนเสาร์' },
  volcano: { id: 'volcano', name: 'Volcano', icon: '🌋', category: 'dino', thai: 'ภูเขาไฟ' },
  meteor: { id: 'meteor', name: 'Meteor', icon: '☄️', category: 'dino', thai: 'อุกกาบาต' },

  // Level 5: ชีวิตผู้ตรวจ อปท. (Audit & Office Life Easter Egg)
  doc_pk4: { id: 'doc_pk4', name: 'แบบ ปค.4', icon: '📁', category: 'audit_docs', thai: 'แบบ ปค.4' },
  doc_pk5: { id: 'doc_pk5', name: 'แบบ ปค.5', icon: '📂', category: 'audit_docs', thai: 'แบบ ปค.5' },
  audit_plan: { id: 'audit_plan', name: 'แผนตรวจสอบ', icon: '📋', category: 'audit_docs', thai: 'แผนประจำปี' },
  disbursement: { id: 'disbursement', name: 'ฎีกาเบิกจ่าย', icon: '📜', category: 'audit_docs', thai: 'ฎีกา' },
  audit_stamp: { id: 'audit_stamp', name: 'ตรายาง สตง.', icon: '🔏', category: 'audit_docs', thai: 'ตรายางตรวจผ่าน' },
  receipt: { id: 'receipt', name: 'ใบเสร็จรับเงิน', icon: '🧾', category: 'audit_docs', thai: 'ใบเสร็จ' },

  coffee_black: { id: 'coffee_black', name: 'อเมริกาโน่เย็น', icon: '☕', category: 'office_fuel', thai: 'กาแฟเข้ม' },
  boba_milk: { id: 'boba_milk', name: 'ชานม 100% หวาน', icon: '🧋', category: 'office_fuel', thai: 'ชานมดับเครียด' },
  yadom: { id: 'yadom', name: 'ยาดมตราโป๊ยเซียน', icon: '🌿', category: 'office_fuel', thai: 'ยาดมแก้เวียน' },
  glasses: { id: 'glasses', name: 'แว่นสายตากรองแสง', icon: '👓', category: 'office_fuel', thai: 'แว่นทำงาน' },
  mama_cup: { id: 'mama_cup', name: 'มาม่าคัพรอบดึก', icon: '🍜', category: 'office_fuel', thai: 'บะหมี่รอบดึก' },
  toast: { id: 'toast', name: 'ขนมปังปิ้งเนย', icon: '🍞', category: 'office_fuel', thai: 'ขนมปัง' },

  hard_hat: { id: 'hard_hat', name: 'หมวกนิรภัยช่าง', icon: '⛑️', category: 'engineer_tools', thai: 'หมวกช่าง' },
  tape_measure: { id: 'tape_measure', name: 'ตลับเมตรเลเซอร์', icon: '📏', category: 'engineer_tools', thai: 'ตลับเมตร' },
  inspect_car: { id: 'inspect_car', name: 'รถตรวจงาน อปท.', icon: '🚙', category: 'engineer_tools', thai: 'รถราชการ' },
  factor_f: { id: 'factor_f', name: 'ตาราง Factor F', icon: '🗂️', category: 'engineer_tools', thai: 'ราคากลาง' },
  calculator: { id: 'calculator', name: 'เครื่องคิดเลข', icon: '🔢', category: 'engineer_tools', thai: 'เครื่องคิดเลข' },
  desktop_pc: { id: 'desktop_pc', name: 'คอมตรวจ e-LAAS', icon: '💻', category: 'engineer_tools', thai: 'ระบบคอม' }
};

// 5 Complete Progressive Level Configurations
const LEVEL_CONFIGS = {
  1: {
    levelNumber: 1,
    title: 'LEVEL 1: สัตว์เลี้ยง ผลไม้ และยานพาหนะ (เริ่มต้น)',
    moves: 40,
    rewardCoins: 100,
    categories: [
      { id: 'pets', name: 'Pets', max: 4, icon: '🐶', thai: 'สัตว์เลี้ยงแสนรัก' },
      { id: 'fruits', name: 'Fruits', max: 4, icon: '🍎', thai: 'ผลไม้สดชื่น' },
      { id: 'vehicles', name: 'Vehicles', max: 4, icon: '🚗', thai: 'ยานพาหนะ' }
    ],
    stacks: [
      [{ top: 'dog', hidden: [] }, { top: 'apple', hidden: [] }, { top: 'car', hidden: [] }, { top: null, hidden: [] }],
      [{ top: 'cat', hidden: [] }, { top: 'banana', hidden: [] }, { top: 'bus', hidden: [] }, { top: null, hidden: [] }],
      [{ top: 'bunny', hidden: [] }, { top: 'strawberry', hidden: [] }, { top: 'airplane', hidden: [] }, { top: null, hidden: [] }],
      [{ top: 'hamster', hidden: [] }, { top: 'grape', hidden: [] }, { top: 'train', hidden: [] }, { top: null, hidden: [] }]
    ]
  },
  2: {
    levelNumber: 2,
    title: 'LEVEL 2: Ocean, Jobs & Can Fly (Cardlings Official)',
    moves: 50,
    rewardCoins: 150,
    categories: [
      { id: 'ocean', name: 'Ocean', max: 6, icon: '🌊', thai: 'สัตว์ใต้ทะเล' },
      { id: 'jobs', name: 'Jobs', max: 6, icon: '💼', thai: 'อาชีพต่างๆ' },
      { id: 'can_fly', name: 'Can fly', max: 6, icon: '🪽', thai: 'สิ่งที่บินได้' }
    ],
    stacks: [
      [{ top: 'phoenix', hidden: [] }, { top: 'firefighter', hidden: ['shark'] }, { top: 'dolphin', hidden: [] }, { top: 'octopus', hidden: [] }],
      [{ top: 'chef', hidden: [] }, { top: 'griffin', hidden: ['doctor'] }, { top: 'eagle', hidden: [] }, { top: 'whale', hidden: [] }],
      [{ top: 'flamingo', hidden: [] }, { top: 'farmer', hidden: [] }, { top: 'princess', hidden: [] }, { top: 'glider', hidden: [] }],
      [{ top: 'scientist', hidden: [] }, { top: 'jellyfish', hidden: [] }, { top: 'hummingbird', hidden: [] }, { top: 'clownfish', hidden: [] }]
    ]
  },
  3: {
    levelNumber: 3,
    title: 'LEVEL 3: เบเกอรี่ อาหารจานด่วน และเครื่องดื่ม',
    moves: 55,
    rewardCoins: 200,
    categories: [
      { id: 'bakery', name: 'Bakery', max: 6, icon: '🧁', thai: 'เบเกอรี่แสนหวาน' },
      { id: 'fastfood', name: 'Fast Food', max: 6, icon: '🍕', thai: 'อาหารจานด่วน' },
      { id: 'drinks', name: 'Drinks', max: 6, icon: '🧋', thai: 'เครื่องดื่มดับร้อน' }
    ],
    stacks: [
      [{ top: 'cupcake', hidden: ['cake'] }, { top: 'pizza', hidden: [] }, { top: 'boba', hidden: [] }, { top: 'croissant', hidden: [] }],
      [{ top: 'burger', hidden: [] }, { top: 'coffee', hidden: ['tea'] }, { top: 'donut', hidden: [] }, { top: 'fries', hidden: [] }],
      [{ top: 'juice', hidden: [] }, { top: 'cookie', hidden: [] }, { top: 'hotdog', hidden: ['popcorn'] }, { top: 'soda', hidden: [] }],
      [{ top: 'pancake', hidden: [] }, { top: 'taco', hidden: [] }, { top: 'milk', hidden: [] }, { top: null, hidden: [] }]
    ]
  },
  4: {
    levelNumber: 4,
    title: 'LEVEL 4: อวกาศ เวทมนตร์ และไดโนเสาร์',
    moves: 55,
    rewardCoins: 250,
    categories: [
      { id: 'space', name: 'Space', max: 6, icon: '🚀', thai: 'อวกาศอันไกลโพ้น' },
      { id: 'magic', name: 'Magic', max: 6, icon: '🪄', thai: 'มนตร์วิเศษ' },
      { id: 'dino', name: 'Dino', max: 6, icon: '🦖', thai: 'โลกล้านปี' }
    ],
    stacks: [
      [{ top: 'astronaut', hidden: ['telescope'] }, { top: 'wizard', hidden: [] }, { top: 'trex', hidden: [] }, { top: 'rocket', hidden: [] }],
      [{ top: 'crystal', hidden: [] }, { top: 'sauropod', hidden: ['meteor'] }, { top: 'ufo', hidden: [] }, { top: 'wand', hidden: [] }],
      [{ top: 'pterodactyl', hidden: [] }, { top: 'alien', hidden: ['planet'] }, { top: 'potion', hidden: [] }, { top: 'dino_egg', hidden: [] }],
      [{ top: 'cauldron', hidden: [] }, { top: 'volcano', hidden: [] }, { top: 'scroll', hidden: [] }, { top: null, hidden: [] }]
    ]
  },
  5: {
    levelNumber: 5,
    title: 'LEVEL 5: ชีวิตผู้ตรวจสอบ อปท. (รอบชิงชนะเลิศ)',
    moves: 60,
    rewardCoins: 300,
    categories: [
      { id: 'audit_docs', name: 'Audit Docs', max: 6, icon: '📂', thai: 'เอกสารรายงานตรวจ' },
      { id: 'office_fuel', name: 'Office Fuel', max: 6, icon: '☕', thai: 'ของยังชีพห้องตรวจ' },
      { id: 'engineer_tools', name: 'Engineering', max: 6, icon: '⛑️', thai: 'งานช่าง & พัสดุ' }
    ],
    stacks: [
      [{ top: 'doc_pk4', hidden: ['receipt'] }, { top: 'coffee_black', hidden: [] }, { top: 'hard_hat', hidden: [] }, { top: 'doc_pk5', hidden: [] }],
      [{ top: 'boba_milk', hidden: ['toast'] }, { top: 'tape_measure', hidden: [] }, { top: 'audit_plan', hidden: [] }, { top: 'yadom', hidden: [] }],
      [{ top: 'inspect_car', hidden: ['desktop_pc'] }, { top: 'disbursement', hidden: [] }, { top: 'glasses', hidden: [] }, { top: 'factor_f', hidden: [] }],
      [{ top: 'audit_stamp', hidden: [] }, { top: 'mama_cup', hidden: [] }, { top: 'calculator', hidden: [] }, { top: null, hidden: [] }]
    ]
  }
};

export default function CardSortPuzzleView() {
  // Start from Level 1 by default
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('card_sort_level');
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  const currentConfig = LEVEL_CONFIGS[level] || LEVEL_CONFIGS[1];

  const [movesLeft, setMovesLeft] = useState(currentConfig.moves);
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
  const [toastMessage, setToastMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);

  // Bench slots on the right
  const [benchSlots, setBenchSlots] = useState([
    { id: 0, card: null, locked: false },
    { id: 1, card: null, locked: false },
    { id: 2, card: null, locked: false },
    { id: 3, card: null, locked: false },
    { id: 4, card: null, locked: true, unlockCost: 250 },
    { id: 5, card: null, locked: true, unlockCost: 250 }
  ]);

  // Dynamic completed categories based on current level
  const [completedCategories, setCompletedCategories] = useState(() => {
    const initial = {};
    currentConfig.categories.forEach((cat) => {
      initial[cat.id] = [];
    });
    return initial;
  });

  // Stacks in the grid
  const [gridStacks, setGridStacks] = useState(() => JSON.parse(JSON.stringify(currentConfig.stacks)));

  // Whenever level changes, reset board cleanly
  const loadLevel = (targetLevel) => {
    const conf = LEVEL_CONFIGS[targetLevel] || LEVEL_CONFIGS[1];
    setLevel(targetLevel);
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
      showToast(`🎉 ชนะเลิศ! คุณเคลียร์ LEVEL ${level} สำเร็จครบทุกหมวด (+${currentConfig.rewardCoins} เหรียญ)`);
    }
  }, [completedCategories, isWon, currentConfig, level, isMuted]);

  // SMART CLICK / AUTO-SEND: คลิกซ้ายที่การ์ดเพื่อส่งไปยังหมวดหมู่ทันที
  const handleCardClick = (cardId, fromLocation) => {
    if (!cardId) return;
    const cardData = ALL_CARDS[cardId];
    if (!cardData) return;

    if (movesLeft <= 0) {
      showToast('⚠️ จำนวน Moves หมดแล้ว!');
      playSound('error', isMuted);
      return;
    }

    const catId = cardData.category;
    const targetCat = currentConfig.categories.find((c) => c.id === catId);

    // If matching category is active on board and has room: send immediately!
    if (targetCat && (completedCategories[catId]?.length || 0) < targetCat.max) {
      sendCardToCategory(cardId, fromLocation, catId);
    } else {
      // Toggle selection to place on bench
      if (selectedCardId === cardId) {
        setSelectedCardId(null);
        setSelectedFrom(null);
      } else {
        setSelectedCardId(cardId);
        setSelectedFrom(fromLocation);
        playSound('select', isMuted);
        showToast(`เลือก "${cardData.name}" (แตะม้านั่งสำรองทางขวาเพื่อพักการ์ด)`);
      }
    }
  };

  // Send card to Category
  const sendCardToCategory = (cardId, from, catId) => {
    saveUndoState();
    setMovesLeft((m) => m - 1);

    // Remove card from source and reveal hidden card if any!
    if (from.type === 'grid') {
      setGridStacks((prev) => {
        const next = prev.map((col, cIdx) =>
          col.map((slot, rIdx) => {
            if (cIdx === from.colIdx && rIdx === from.rowIdx) {
              if (slot.hidden.length > 0) {
                playSound('flip', isMuted);
                return {
                  top: slot.hidden[0],
                  hidden: slot.hidden.slice(1)
                };
              }
              return { top: null, hidden: [] };
            }
            return slot;
          })
        );
        return next;
      });
    } else if (from.type === 'bench') {
      setBenchSlots((prev) =>
        prev.map((s, idx) => (idx === from.benchIdx ? { ...s, card: null } : s))
      );
    }

    // Add to completed category
    setCompletedCategories((prev) => ({
      ...prev,
      [catId]: [...(prev[catId] || []), cardId]
    }));

    setSelectedCardId(null);
    setSelectedFrom(null);
    playSound('match', isMuted);
    const catName = currentConfig.categories.find((c) => c.id === catId)?.name || catId;
    showToast(`✨ ส่ง "${ALL_CARDS[cardId].name}" เข้าหมวด ${catName}!`);
  };

  // Click on Bench slot
  const handleBenchClick = (benchIdx) => {
    const slot = benchSlots[benchIdx];

    // If locked, attempt unlock
    if (slot.locked) {
      if (coins >= slot.unlockCost) {
        setCoins((c) => c - slot.unlockCost);
        setBenchSlots((prev) =>
          prev.map((s, i) => (i === benchIdx ? { ...s, locked: false } : s))
        );
        playSound('match', isMuted);
        showToast('🔓 ปลดล็อกม้านั่งสำรองเรียบร้อยแล้ว!');
      } else {
        showToast(`❌ เหรียญไม่พอปลดล็อกม้านั่ง (ต้องการ ${slot.unlockCost} เหรียญ)`);
        playSound('error', isMuted);
      }
      return;
    }

    // If bench slot has a card: click to auto-send or select!
    if (slot.card) {
      handleCardClick(slot.card, { type: 'bench', benchIdx });
      return;
    }

    // Empty bench slot: place selected card here!
    if (selectedCardId && selectedFrom) {
      placeCardOnBench(selectedCardId, selectedFrom, benchIdx);
    }
  };

  const placeCardOnBench = (cardId, from, benchIdx) => {
    if (movesLeft <= 0) {
      showToast('⚠️ จำนวน Moves หมดแล้ว!');
      playSound('error', isMuted);
      return;
    }

    saveUndoState();
    setMovesLeft((m) => m - 1);

    // Remove from origin
    if (from.type === 'grid') {
      setGridStacks((prev) => {
        const next = prev.map((col, cIdx) =>
          col.map((slot, rIdx) => {
            if (cIdx === from.colIdx && rIdx === from.rowIdx) {
              if (slot.hidden.length > 0) {
                playSound('flip', isMuted);
                return { top: slot.hidden[0], hidden: slot.hidden.slice(1) };
              }
              return { top: null, hidden: [] };
            }
            return slot;
          })
        );
        return next;
      });
    } else if (from.type === 'bench') {
      setBenchSlots((prev) =>
        prev.map((s, idx) => (idx === from.benchIdx ? { ...s, card: null } : s))
      );
    }

    // Place into bench slot
    setBenchSlots((prev) =>
      prev.map((s, idx) => (idx === benchIdx ? { ...s, card: cardId } : s))
    );

    setSelectedCardId(null);
    setSelectedFrom(null);
    playSound('place', isMuted);
    showToast(`🛋️ พักการ์ด "${ALL_CARDS[cardId].name}" บนม้านั่งสำรอง`);
  };

  // Direct click on Category Box
  const handleCategoryBoxClick = (catId) => {
    if (!selectedCardId || !selectedFrom) {
      showToast('👉 คลิกที่การ์ดเพื่อส่งเข้าหมวดหมู่โดยตรงได้เลยครับ!');
      return;
    }

    const cardData = ALL_CARDS[selectedCardId];
    if (cardData.category !== catId) {
      // Penalty: การวางไพ่ผิดหมวดหมู่จะเสีย 1 แต้ม (ตามกฎของเกม)
      setMovesLeft((m) => Math.max(0, m - 1));
      playSound('error', isMuted);
      showToast(`❌ ผิดหมวด! "${cardData.name}" (${cardData.thai}) เสีย 1 Move!`);
      return;
    }

    sendCardToCategory(selectedCardId, selectedFrom, catId);
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

    // Check grid top cards
    gridStacks.forEach((col, cIdx) => {
      col.forEach((slot, rIdx) => {
        if (slot.top && !foundCard) {
          const catId = ALL_CARDS[slot.top]?.category;
          const targetCat = currentConfig.categories.find((c) => c.id === catId);
          if (targetCat && (completedCategories[catId]?.length || 0) < targetCat.max) {
            foundCard = slot.top;
            foundLocation = { type: 'grid', colIdx: cIdx, rowIdx: rIdx };
          }
        }
      });
    });

    // Check bench cards
    if (!foundCard) {
      benchSlots.forEach((slot, bIdx) => {
        if (slot.card && !foundCard) {
          const catId = ALL_CARDS[slot.card]?.category;
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
      showToast(`💡 คำใบ้: แตะส่ง "${ALL_CARDS[foundCard].name}" เข้าหมวด ${ALL_CARDS[foundCard].category}!`);
    } else {
      showToast('💡 ตอนนี้ยังไม่มีการ์ดที่เข้าหมวดหมู่ได้ ลองพักการ์ดบนม้านั่งเพื่อเปิดการ์ดด้านล่าง!');
    }
  };

  // Magnet Booster (Lv 7 Power-up)
  const handleMagnet = () => {
    let target = null;
    gridStacks.forEach((col, cIdx) => {
      col.forEach((slot, rIdx) => {
        if (slot.top && !target) {
          const catId = ALL_CARDS[slot.top]?.category;
          const targetCat = currentConfig.categories.find((c) => c.id === catId);
          if (targetCat && (completedCategories[catId]?.length || 0) < targetCat.max) {
            target = { cardId: slot.top, from: { type: 'grid', colIdx: cIdx, rowIdx: rIdx }, catId };
          }
        }
      });
    });

    if (target) {
      sendCardToCategory(target.cardId, target.from, target.catId);
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
    const nextLvl = level < 5 ? level + 1 : 1;
    loadLevel(nextLvl);
    showToast(`🚀 เข้าสู่ LEVEL ${nextLvl}!`);
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

      {/* Main Wood Plank Board Container - Matching Cardlings by blu studios 1:1 */}
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
                  const card = slot?.top ? ALL_CARDS[slot.top] : null;
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
                      onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx: 0, rowIdx })}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      {slot.hidden.length > 0 && (
                        <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {slot.hidden.length}
                        </div>
                      )}
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full">
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
                  const card = slot?.top ? ALL_CARDS[slot.top] : null;
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
                      onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx: 1, rowIdx })}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      {slot.hidden.length > 0 && (
                        <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {slot.hidden.length}
                        </div>
                      )}
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Column 2: THE 3 ACTIVE CATEGORIES & PLUS EXPANDER */}
              <div className="flex flex-col gap-2.5">
                {currentConfig.categories.map((cat) => {
                  const placedList = completedCategories[cat.id] || [];
                  const isTargetMatch = selectedCardId && ALL_CARDS[selectedCardId]?.category === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryBoxClick(cat.id)}
                      className={`h-24 sm:h-28 rounded-2xl border-3 border-amber-400/90 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_5px_0_#b45309] hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 text-center ${
                        isTargetMatch ? 'ring-4 ring-amber-400 animate-pulse' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-1 text-[11px] font-black text-amber-900">
                        <span>
                          {placedList.length}/{cat.max}
                        </span>
                        <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 truncate max-w-full">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-amber-800 font-bold mt-0.5 truncate max-w-full">
                        {placedList.length > 0
                          ? placedList.map((c) => ALL_CARDS[c]?.icon).join('')
                          : 'แตะเพื่อจัดเก็บ'}
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
                  const card = slot?.top ? ALL_CARDS[slot.top] : null;
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
                      onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx: 2, rowIdx })}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      {slot.hidden.length > 0 && (
                        <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {slot.hidden.length}
                        </div>
                      )}
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full">
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
                  const card = slot?.top ? ALL_CARDS[slot.top] : null;
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
                      onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx: 3, rowIdx })}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      {slot.hidden.length > 0 && (
                        <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {slot.hidden.length}
                        </div>
                      )}
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= BENCH SLOTS (ม้านั่งพักการ์ด) ================= */}
          <div className="flex md:flex-col gap-2.5 shrink-0">
            {benchSlots.map((slot, idx) => {
              const card = slot.card ? ALL_CARDS[slot.card] : null;
              const isSelected = selectedCardId === slot.card && slot.card !== null;

              if (slot.locked) {
                return (
                  <div
                    key={slot.id}
                    onClick={() => handleBenchClick(idx)}
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
                    onClick={() => handleBenchClick(idx)}
                    className={`w-16 h-18 sm:w-18 sm:h-20 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] flex flex-col items-center justify-center p-1 text-center cursor-pointer hover:-translate-y-1 transition-all ${
                      isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl' : ''
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl leading-none">{card.icon}</span>
                    <span className="text-[9px] font-black text-slate-800 mt-1 truncate max-w-full">
                      {card.name}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={slot.id}
                  onClick={() => handleBenchClick(idx)}
                  className={`w-16 h-18 sm:w-18 sm:h-20 rounded-2xl bg-amber-950/60 border-2 border-amber-900/80 shadow-inner flex items-center justify-center cursor-pointer transition-colors ${
                    selectedCardId ? 'hover:bg-amber-800/50 ring-2 ring-amber-400/60' : ''
                  }`}
                  title="ม้านั่งพักการ์ด (คลิกการ์ดแล้วคลิกที่นี่เพื่อนำมาพัก)"
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
            <span className="font-bold">🎯 {currentConfig.title}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowLevelSelect(true)}
              className="text-amber-300 hover:text-white underline font-bold cursor-pointer"
            >
              เลือกด่าน (Level 1-5)
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

      {/* LEVEL SELECT MODAL */}
      {showLevelSelect && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-300/80 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-950 font-mono">
                  เลือกระดับด่าน (Level Select)
                </h3>
                <p className="text-[11px] text-amber-800 font-bold">
                  เลือกด่านที่ต้องการเล่น มีทั้งหมด 5 ระดับความท้าทาย
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
              {[1, 2, 3, 4, 5].map((lvlNum) => {
                const conf = LEVEL_CONFIGS[lvlNum];
                const isCurrent = level === lvlNum;

                return (
                  <div
                    key={lvlNum}
                    onClick={() => {
                      loadLevel(lvlNum);
                      setShowLevelSelect(false);
                      showToast(`เข้าสู่ ${conf.title}`);
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
                        {conf.title.split(': ')[1]}
                      </p>
                      <div className={`text-[10px] mt-1 flex space-x-3 ${isCurrent ? 'text-amber-200' : 'text-slate-500'}`}>
                        <span>Moves: {conf.moves}</span>
                        <span>รางวัล: +{conf.rewardCoins} เหรียญ</span>
                      </div>
                    </div>

                    <div className="text-2xl">
                      {lvlNum === 1 ? '🐶' : lvlNum === 2 ? '🐬' : lvlNum === 3 ? '🧁' : lvlNum === 4 ? '🚀' : '📑'}
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
                สนุกไปกับเกมเรียงการ์ดแสนสนุกนี้ การ์ดแต่ละใบมีรูปภาพน่ารัก และอยู่ในหมวดหมู่ที่กำหนด จับคู่การ์ดแต่ละใบกับหมวดหมู่ เติมให้ครบ และเคลียร์โต๊ะ!
              </p>
              <div className="space-y-2 bg-white/70 p-4 rounded-2xl border border-amber-200">
                <div className="font-extrabold text-amber-900 text-sm">💡 วิธีการเล่น:</div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
                  <li><b>เปิดให้เล่นได้เพียงสามประเภทในแต่ละครั้ง</b> โปรดคิดให้ดีก่อนเข้าร่วม!</li>
                  <li><b>วางบัตรไว้บนม้านั่ง</b> ขณะรอให้หมวดหมู่บัตรนั้นว่าง</li>
                  <li><b>ระวังการเคลื่อนไหวของคุณ:</b> การวางไพ่ผิดหมวดหมู่จะเสียหนึ่งแต้ม (Move)</li>
                  <li><b>ไพ่คว่ำหน้าที่มีเลขบอกจำนวน</b> จะเปิดออกเมื่อนำไพ่ใบบนออก</li>
                  <li><b>คลิกซ้าย</b> ที่การ์ดเพื่อส่งไปยังหมวดหมู่ที่ตรงกันทันที</li>
                  <li>ติดขัดใช่ไหม? ใช้คำใบ้ แม่เหล็ก หรือปุ่มย้อนกลับได้เลย</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm rounded-2xl shadow-[0_4px_0_#92400e] active:translate-y-1 active:shadow-none cursor-pointer"
            >
              เข้าใจแล้ว เริ่มเล่นเลย!
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
                ยินดีด้วย! คุณผ่าน LEVEL {level} สำเร็จครบทุกหมวด (+{currentConfig.rewardCoins} เหรียญทอง)
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
              <span>{level < 5 ? `ไปต่อด่านถัดไป (LEVEL ${level + 1})` : 'จบเกมแล้ว! วนกลับ LEVEL 1'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
