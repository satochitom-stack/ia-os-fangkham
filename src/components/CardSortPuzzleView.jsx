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
  Move,
  ShieldAlert,
  Key
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
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'ice') {
      // Ice shattering crack sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
      osc.frequency.setValueAtTime(350, now + 0.06);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'unlock') {
      // Metallic chain / lock opening chime
      [784, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.07);
        g.gain.setValueAtTime(0.25, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.2);
        o.start(now + i * 0.07);
        o.stop(now + i * 0.07 + 0.2);
      });
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

// Comprehensive Category & Card Database (19 distinct categories - 114 unique cards)
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
  },
  thai_culture: {
    id: 'thai_culture',
    name: 'Culture',
    icon: '🪷',
    thai: 'ประเพณีและวัฒนธรรมไทย',
    cards: [
      { id: 'krathong', name: 'ลอยกระทง', icon: '🪷', category: 'thai_culture', thai: 'กระทงใบตอง' },
      { id: 'songkran', name: 'สงกรานต์', icon: '💦', category: 'thai_culture', thai: 'ขันน้ำอบ' },
      { id: 'baisri', name: 'บายศรี', icon: '🌿', category: 'thai_culture', thai: 'บายศรีสู่ขวัญ' },
      { id: 'thai_elephant', name: 'ช้างศึก', icon: '🐘', category: 'thai_culture', thai: 'ช้างไทย' },
      { id: 'thai_dance', name: 'รำไทย', icon: '💃', category: 'thai_culture', thai: 'ชฎารำไทย' },
      { id: 'muay_thai', name: 'มวยไทย', icon: '🥊', category: 'thai_culture', thai: 'นวมมวยไทย' }
    ]
  },
  wildlife_thai: {
    id: 'wildlife_thai',
    name: 'Wildlife',
    icon: '🦌',
    thai: 'สัตว์ป่าสงวนไทย',
    cards: [
      { id: 'serow', name: 'เลียงผา', icon: '🐐', category: 'wildlife_thai', thai: 'เลียงผา' },
      { id: 'tapir', name: 'สมเสร็จ', icon: '🦡', category: 'wildlife_thai', thai: 'สมเสร็จ' },
      { id: 'kouprey', name: 'กูปรี', icon: '🐂', category: 'wildlife_thai', thai: 'กูปรี' },
      { id: 'pitta', name: 'นกแต้วแร้ว', icon: '🦜', category: 'wildlife_thai', thai: 'แต้วแร้ว' },
      { id: 'dugong', name: 'พะยูน', icon: '🦭', category: 'wildlife_thai', thai: 'พะยูน' },
      { id: 'eld_deer', name: 'ละองละมั่ง', icon: '🦌', category: 'wildlife_thai', thai: 'ละมั่ง' }
    ]
  },
  thai_food: {
    id: 'thai_food',
    name: 'Thai Food',
    icon: '🍲',
    thai: 'อาหารไทยยอดนิยม',
    cards: [
      { id: 'tomyum', name: 'ต้มยำกุ้ง', icon: '🍲', category: 'thai_food', thai: 'ต้มยำกุ้งแม่น้ำ' },
      { id: 'somtum', name: 'ส้มตำแซ่บ', icon: '🥗', category: 'thai_food', thai: 'ส้มตำปลาร้า' },
      { id: 'padthai', name: 'ผัดไทย', icon: '🍜', category: 'thai_food', thai: 'ผัดไทยกุ้งสด' },
      { id: 'mango_rice', name: 'ข้าวเหนียวมะม่วง', icon: '🥭', category: 'thai_food', thai: 'มะม่วงอกร่อง' },
      { id: 'massaman', name: 'แกงมัสมั่น', icon: '🍛', category: 'thai_food', thai: 'มัสมั่นไก่' },
      { id: 'durian', name: 'ทุเรียน', icon: '🍈', category: 'thai_food', thai: 'ทุเรียนหมอนทอง' }
    ]
  },
  local_gov_fun: {
    id: 'local_gov_fun',
    name: 'Local Gov',
    icon: '🚜',
    thai: 'ภารกิจ อปท. & เทศบาล',
    cards: [
      { id: 'fire_truck', name: 'รถดับเพลิง', icon: '🚒', category: 'local_gov_fun', thai: 'ดับเพลิง อปท.' },
      { id: 'solar_light', name: 'ไฟโซล่าเซลล์', icon: '💡', category: 'local_gov_fun', thai: 'ไฟถนนโซล่า' },
      { id: 'grader', name: 'รถเกรดดิน', icon: '🚜', category: 'local_gov_fun', thai: 'ซ่อมถนนลูกรัง' },
      { id: 'rocket_fest', name: 'บั้งไฟหมื่น', icon: '🎆', category: 'local_gov_fun', thai: 'บุญบั้งไฟ' },
      { id: 'ems_1669', name: 'รถกู้ชีพ 1669', icon: '🚑', category: 'local_gov_fun', thai: 'กู้ชีพ อปท.' },
      { id: 'recycle_bin', name: 'ถังขยะแยกสี', icon: '🗑️', category: 'local_gov_fun', thai: 'ถังขยะชุมชน' }
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

// Curated Progressive Level Presets with thematic combinations
const LEVEL_PRESETS = [
  { level: 1, cats: ['pets', 'fruits', 'vehicles'], moves: 45, cardsPerCat: 4, name: 'เริ่มต้น: สัตว์เลี้ยง, ผลไม้, ยานพาหนะ' },
  { level: 2, cats: ['ocean', 'jobs', 'can_fly'], moves: 50, cardsPerCat: 5, name: 'ท้องทะเล อาชีพ และเวหา' },
  { level: 3, cats: ['bakery', 'fastfood', 'drinks'], moves: 55, cardsPerCat: 6, name: 'เมนูของหวานและเครื่องดื่ม (พบไพ่ปริศนา ❓)' },
  { level: 4, cats: ['space', 'magic', 'dino'], moves: 55, cardsPerCat: 6, name: 'จักรวาลและมนตร์ดำ (พบไพ่แช่แข็ง 🧊)' },
  { level: 5, cats: ['thai_food', 'fruits', 'drinks'], moves: 60, cardsPerCat: 6, name: 'ครัวไทยรสแซ่บและผลไม้สด' },
  { level: 6, cats: ['thai_culture', 'jobs', 'can_fly'], moves: 55, cardsPerCat: 6, name: 'ประเพณีไทยและคนสู้ชีวิต' },
  { level: 7, cats: ['wildlife_thai', 'ocean', 'pets'], moves: 55, cardsPerCat: 6, name: 'สัตว์ป่าสงวนและสัตว์โลก (พบไพ่โซ่ตรวน ⛓️)' },
  { level: 8, cats: ['audit_life', 'office_fuel', 'engineering'], moves: 60, cardsPerCat: 6, name: 'ชีวิตผู้ตรวจ อปท.: เอกสาร, กาแฟ, งานช่าง' },
  { level: 9, cats: ['local_gov_fun', 'vehicles', 'engineering'], moves: 55, cardsPerCat: 6, name: 'ภารกิจพัฒนาท้องถิ่นและยานพาหนะ' },
  { level: 10, cats: ['magic', 'dino', 'thai_culture'], moves: 55, cardsPerCat: 6, name: 'ศึกโลกล้านปีและมนตร์โบราณ' },
  { level: 11, cats: ['thai_food', 'bakery', 'fastfood'], moves: 50, cardsPerCat: 6, name: 'เทศกาลสตรีทฟู้ดและเบเกอรี่' },
  { level: 12, cats: ['wildlife_thai', 'dino', 'can_fly'], moves: 55, cardsPerCat: 6, name: 'ปีกแห่งพงไพรและสัตว์โบราณ' },
  { level: 13, cats: ['space', 'engineering', 'vehicles'], moves: 55, cardsPerCat: 6, name: 'ยานอวกาศและวิศวกรรมชั้นสูง' },
  { level: 14, cats: ['jobs', 'audit_life', 'local_gov_fun'], moves: 60, cardsPerCat: 6, name: 'รวมพลังข้าราชการ อปท.' },
  { level: 15, cats: ['thai_culture', 'local_gov_fun', 'thai_food'], moves: 55, cardsPerCat: 6, name: 'งานบุญประเพณีและงานเทศบาล' },
  { level: 16, cats: ['ocean', 'wildlife_thai', 'can_fly'], moves: 50, cardsPerCat: 6, name: 'มหาสมุทร ป่าไม้ และท้องฟ้า' },
  { level: 17, cats: ['drinks', 'office_fuel', 'bakery'], moves: 50, cardsPerCat: 6, name: 'ร้านกาแฟเติมพลังงานยามดึก' },
  { level: 18, cats: ['space', 'magic', 'engineering'], moves: 55, cardsPerCat: 6, name: 'เทคโนโลยีไฮเทคและพลังเวท' },
  { level: 19, cats: ['pets', 'thai_food', 'fruits'], moves: 50, cardsPerCat: 6, name: 'ปิกนิกน้องหมาแมวและอาหารไทย' },
  { level: 20, cats: ['audit_life', 'engineering', 'magic'], moves: 60, cardsPerCat: 6, name: 'บอสระดับ 20: ภารกิจตรวจขั้นมหาเทพ' }
];

// Helper to get configuration for ANY level (1 to 100+)
const getLevelData = (lvl) => {
  const allCatKeys = Object.keys(MASTER_CATEGORIES);
  let preset;

  if (lvl <= LEVEL_PRESETS.length) {
    preset = LEVEL_PRESETS[lvl - 1];
  } else {
    // Deterministic procedural generation for levels beyond preset range
    const k1 = allCatKeys[(lvl * 3) % allCatKeys.length];
    const k2 = allCatKeys[(lvl * 5 + 1) % allCatKeys.length];
    const k3 = allCatKeys[(lvl * 7 + 2) % allCatKeys.length];
    preset = {
      level: lvl,
      cats: [k1, k2, k3],
      moves: Math.max(45, 65 - Math.floor(lvl / 5)),
      cardsPerCat: 6,
      name: `การท้าทายระดับเซียน (${MASTER_CATEGORIES[k1].thai}, ${MASTER_CATEGORIES[k2].thai})`
    };
  }

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
    const hashA = (a.charCodeAt(0) * 37 + lvl * 23) % 100;
    const hashB = (b.charCodeAt(0) * 37 + lvl * 23) % 100;
    return hashA - hashB;
  });

  // Decide how many obstacles based on level
  const frozenTarget = lvl >= 4 ? Math.min(3, Math.floor(lvl / 3)) : 0;
  const chainedTarget = lvl >= 7 ? Math.min(2, Math.floor((lvl - 3) / 4)) : 0;
  const mysteryTarget = lvl >= 3 ? Math.min(3, Math.floor(lvl / 2.5)) : 0;

  // Distribute into 4 columns (4 slots per column)
  const stacks = [[], [], [], []];
  let cardIndex = 0;
  let frozenAssigned = 0;
  let chainedAssigned = 0;
  let mysteryAssigned = 0;

  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      if (cardIndex < shuffled.length) {
        const top = shuffled[cardIndex++];
        const hidden = [];

        // Assign hidden card depth
        if (lvl >= 2 && cardIndex < shuffled.length && (cardIndex % 2 === 0 || lvl >= 5)) {
          hidden.push(shuffled[cardIndex++]);
        }

        // Assign obstacles deterministically
        let isFrozen = false;
        let isChained = false;
        let isMystery = false;

        if (frozenAssigned < frozenTarget && (c + r * 2 + lvl) % 4 === 1) {
          isFrozen = true;
          frozenAssigned++;
        } else if (chainedAssigned < chainedTarget && (c * 2 + r + lvl) % 5 === 2) {
          isChained = true;
          chainedAssigned++;
        } else if (mysteryAssigned < mysteryTarget && (c + r + lvl) % 3 === 0) {
          isMystery = true;
          mysteryAssigned++;
        }

        stacks[c].push({ top, hidden, isFrozen, isChained, isMystery });
      } else {
        stacks[c].push({ top: null, hidden: [], isFrozen: false, isChained: false, isMystery: false });
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
  // Current active level
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('card_sort_level');
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  // Maximum level unlocked so far (Player cannot select higher levels until beating previous)
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem('card_sort_max_level');
    return saved !== null ? Math.max(1, parseInt(saved, 10)) : 1;
  });

  // Earned stars per level: { [levelNumber]: 1 | 2 | 3 }
  const [levelStars, setLevelStars] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('card_sort_stars') || '{}');
    } catch {
      return {};
    }
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
  const [earnedStarsInWin, setEarnedStarsInWin] = useState(3);

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

  // Save progress & settings
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

      // Calculate Stars (1 - 3 stars based on moves left)
      const ratio = movesLeft / currentConfig.moves;
      let starsCount = 1;
      if (ratio >= 0.35) starsCount = 3;
      else if (ratio >= 0.15) starsCount = 2;
      setEarnedStarsInWin(starsCount);

      // Save Star rating
      setLevelStars((prev) => {
        const next = { ...prev, [level]: Math.max(prev[level] || 0, starsCount) };
        localStorage.setItem('card_sort_stars', JSON.stringify(next));
        return next;
      });

      // Unlock next level immediately upon beating this level
      const nextUnlocked = Math.max(maxUnlockedLevel, level + 1);
      setMaxUnlockedLevel(nextUnlocked);
      localStorage.setItem('card_sort_max_level', nextUnlocked.toString());

      setCoins((c) => c + currentConfig.rewardCoins);
      showToast(`🎉 ชัยชนะ! เคลียร์ LEVEL ${level} สำเร็จ (${starsCount} ดาว ⭐) +${currentConfig.rewardCoins} เหรียญ`);
    }
  }, [completedCategories, isWon, currentConfig, level, isMuted, movesLeft, maxUnlockedLevel]);

  // ==========================================
  // CARD INTERACTION (DRAG & DROP + CLICK-TO-PICK)
  // ==========================================

  // 1. Click on card: Select/pick up (Handles obstacles: Frozen, Chained, Mystery)
  const handleCardClick = (cardId, fromLocation) => {
    if (!cardId) return;

    // Check if slot in grid has obstacles
    if (fromLocation.type === 'grid') {
      const slot = gridStacks[fromLocation.colIdx]?.[fromLocation.rowIdx];

      // A. Frozen card: Crack ice on tap
      if (slot?.isFrozen) {
        playSound('ice', isMuted);
        setMovesLeft((m) => Math.max(0, m - 1));
        setGridStacks((prev) =>
          prev.map((col, cIdx) =>
            col.map((s, rIdx) => {
              if (cIdx === fromLocation.colIdx && rIdx === fromLocation.rowIdx) {
                return { ...s, isFrozen: false };
              }
              return s;
            })
          )
        );
        showToast('🔨 กะเทาะน้ำแข็งแตกแล้ว! สามารถหยิบหรือลากการ์ดได้แล้ว (เสีย 1 Move)');
        return;
      }

      // B. Chained card: Requires key / coins or full category
      if (slot?.isChained) {
        if (coins >= 100) {
          setCoins((c) => c - 100);
          playSound('unlock', isMuted);
          setGridStacks((prev) =>
            prev.map((col, cIdx) =>
              col.map((s, rIdx) => {
                if (cIdx === fromLocation.colIdx && rIdx === fromLocation.rowIdx) {
                  return { ...s, isChained: false };
                }
                return s;
              })
            )
          );
          showToast('🔓 ใช้ 100 เหรียญปลดโซ่ตรวนสำเร็จ!');
        } else {
          playSound('error', isMuted);
          showToast('⛓️ การ์ดติดโซ่ตรวน! เคลียร์หมวดหมู่อื่นให้เต็ม 1 หมวดเพื่อปลดล็อก (หรือใช้ 100 เหรียญ)');
        }
        return;
      }

      // C. Mystery card: Reveal on tap
      if (slot?.isMystery) {
        playSound('flip', isMuted);
        setGridStacks((prev) =>
          prev.map((col, cIdx) =>
            col.map((s, rIdx) => {
              if (cIdx === fromLocation.colIdx && rIdx === fromLocation.rowIdx) {
                return { ...s, isMystery: false };
              }
              return s;
            })
          )
        );
        showToast(`✨ เปิดไพ่ปริศนา: เป็น "${ALL_CARDS_MAP[cardId]?.name}" (${ALL_CARDS_MAP[cardId]?.thai})!`);
        return;
      }
    }

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

  // 2. Drag Start (Blocks frozen and chained cards)
  const handleDragStart = (e, cardId, fromLocation) => {
    if (fromLocation.type === 'grid') {
      const slot = gridStacks[fromLocation.colIdx]?.[fromLocation.rowIdx];
      if (slot?.isFrozen) {
        e.preventDefault();
        playSound('error', isMuted);
        showToast('❄️ การ์ดถูกแช่แข็ง! แตะกะเทาะน้ำแข็งก่อนลากครับ');
        return;
      }
      if (slot?.isChained) {
        e.preventDefault();
        playSound('error', isMuted);
        showToast('⛓️ การ์ดติดโซ่ตรวนอยู่! แตะปลดล็อกด้วย 100 เหรียญ หรือเคลียร์หมวดหมู่อื่นก่อน');
        return;
      }
      if (slot?.isMystery) {
        // Auto-reveal on drag
        playSound('flip', isMuted);
        setGridStacks((prev) =>
          prev.map((col, cIdx) =>
            col.map((s, rIdx) => {
              if (cIdx === fromLocation.colIdx && rIdx === fromLocation.rowIdx) {
                return { ...s, isMystery: false };
              }
              return s;
            })
          )
        );
      }
    }

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
                return {
                  top: slot.hidden[0],
                  hidden: slot.hidden.slice(1),
                  isFrozen: false,
                  isChained: false,
                  isMystery: false
                };
              }
              return { top: null, hidden: [], isFrozen: false, isChained: false, isMystery: false };
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

    // Thaw any remaining frozen cards of the same category
    setGridStacks((prev) =>
      prev.map((col) =>
        col.map((slot) => {
          if (slot.top && ALL_CARDS_MAP[slot.top]?.category === targetCatId && slot.isFrozen) {
            return { ...slot, isFrozen: false };
          }
          return slot;
        })
      )
    );

    // Add to category
    const nextCompletedInCat = [...(completedCategories[targetCatId] || []), activeCardId];
    setCompletedCategories((prev) => ({
      ...prev,
      [targetCatId]: nextCompletedInCat
    }));

    // If category became 100% full: Shatter all chains on the board!
    if (nextCompletedInCat.length >= targetCat.max) {
      setGridStacks((prev) =>
        prev.map((col) =>
          col.map((slot) => ({
            ...slot,
            isChained: false
          }))
        )
      );
      playSound('unlock', isMuted);
      showToast(`🎉 หมวด "${targetCat.name}" เต็มสมบูรณ์! โซ่ตรวนบนกระดานถูกปลดออกทั้งหมด 🔓`);
    } else {
      playSound('match', isMuted);
      showToast(`✨ ยอดเยี่ยม! จัดเก็บ "${cardData.name}" เข้าหมวด ${targetCat.name} สำเร็จ!`);
    }

    setSelectedCardId(null);
    setSelectedFrom(null);
    setDraggedCardInfo(null);
    setDragHoverTarget(null);
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
        playSound('unlock', isMuted);
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
                return {
                  top: s.hidden[0],
                  hidden: s.hidden.slice(1),
                  isFrozen: false,
                  isChained: false,
                  isMystery: false
                };
              }
              return { top: null, hidden: [], isFrozen: false, isChained: false, isMystery: false };
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
        if (slot.top && !slot.isFrozen && !slot.isChained && !foundCard) {
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
      showToast('💡 ตอนนี้ยังไม่มีการ์ดที่พร้อมเข้าหมวดหมู่ ลองลากการ์ดไปพักบนม้านั่งเพื่อเปิดการ์ดด้านล่าง!');
    }
  };

  // Magnet Booster
  const handleMagnet = () => {
    let target = null;
    gridStacks.forEach((col, cIdx) => {
      col.forEach((slot, rIdx) => {
        if (slot.top && !slot.isFrozen && !slot.isChained && !target) {
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

  // Advance to Next Level (Beat previous level unlocks next immediately)
  const handleNextLevel = () => {
    loadLevel(level + 1);
    showToast(`🚀 เข้าสู่ LEVEL ${level + 1}!`);
  };

  // Render a single Card Slot in the Grid
  const renderCardSlot = (colIdx, rowIdx) => {
    const slot = gridStacks[colIdx]?.[rowIdx];
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

    // A. FROZEN CARD
    if (slot.isFrozen) {
      return (
        <div
          key={rowIdx}
          onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx, rowIdx })}
          className="relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-cyan-100 via-sky-50 to-blue-100 border-3 border-cyan-300 shadow-[0_5px_0_#0284c7] ring-2 ring-cyan-400/80 hover:brightness-105 active:scale-98 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none group"
          title="แตะ 1 ครั้งเพื่อกะเทาะน้ำแข็ง (เสีย 1 Move) หรือจัดหมวดหมู่เดียวกันเพื่อละลาย"
        >
          <div className="absolute top-1 right-1.5 bg-cyan-600 text-white rounded-full text-[8px] font-black px-1.5 py-0.2 shadow-xs flex items-center space-x-0.5">
            <span>❄️</span>
            <span>แช่แข็ง</span>
          </div>
          <span className="text-3xl sm:text-4xl opacity-80 filter blur-[0.3px] leading-none pointer-events-none">
            {card.icon}
          </span>
          <span className="text-[10px] font-extrabold text-cyan-900 mt-1 truncate max-w-full pointer-events-none">
            {card.name}
          </span>
          <span className="text-[8px] text-cyan-700 font-bold mt-0.5 animate-pulse">
            แตะกะเทาะ 🔨
          </span>
        </div>
      );
    }

    // B. CHAINED CARD
    if (slot.isChained) {
      return (
        <div
          key={rowIdx}
          onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx, rowIdx })}
          className="relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-slate-200 via-zinc-100 to-slate-300 border-3 border-slate-500 shadow-[0_5px_0_#475569] ring-2 ring-slate-600/70 hover:brightness-105 active:scale-98 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none"
          title="การ์ดติดโซ่ตรวน! เคลียร์หมวดอื่นให้เต็ม หรือแตะปลดด้วย 100 เหรียญ"
        >
          <div className="absolute top-1 right-1.5 bg-slate-800 text-amber-300 rounded-full text-[8px] font-black px-1.5 py-0.2 shadow-xs flex items-center space-x-0.5">
            <span>⛓️</span>
            <span>โซ่ตรวน</span>
          </div>
          <span className="text-3xl sm:text-4xl filter grayscale contrast-125 leading-none pointer-events-none">
            {card.icon}
          </span>
          <span className="text-[10px] font-extrabold text-slate-800 mt-1 truncate max-w-full pointer-events-none">
            {card.name}
          </span>
          <span className="text-[8px] text-amber-800 font-bold mt-0.5">
            100 🪙 ปลดโซ่
          </span>
        </div>
      );
    }

    // C. MYSTERY CARD (?)
    if (slot.isMystery) {
      return (
        <div
          key={rowIdx}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, slot.top, { type: 'grid', colIdx, rowIdx })}
          onDragEnd={handleDragEnd}
          onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx, rowIdx })}
          className="relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-purple-900 via-indigo-900 to-amber-950 border-3 border-amber-400 shadow-[0_5px_0_#78350f] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none group"
          title="ไพ่ปริศนา! แตะเพื่อเปิดดู"
        >
          <span className="text-3xl sm:text-4xl font-black text-amber-300 animate-bounce leading-none drop-shadow-md">
            ❓
          </span>
          <span className="text-[10px] font-black text-amber-200 mt-1 tracking-wider uppercase">
            ไพ่ปริศนา
          </span>
          <span className="text-[8px] text-amber-400 font-bold">
            แตะเพื่อเปิด
          </span>
        </div>
      );
    }

    // D. NORMAL CARD
    return (
      <div
        key={rowIdx}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, slot.top, { type: 'grid', colIdx, rowIdx })}
        onDragEnd={handleDragEnd}
        onClick={() => handleCardClick(slot.top, { type: 'grid', colIdx, rowIdx })}
        className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-1 text-center select-none ${
          isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
        }`}
      >
        {slot.hidden.length > 0 && (
          <div className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
            {slot.hidden.length}
          </div>
        )}
        <span className="text-3xl sm:text-4xl drop-shadow-xs leading-none pointer-events-none">
          {card.icon}
        </span>
        <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full pointer-events-none">
          {card.name}
        </span>
      </div>
    );
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
                {[0, 1, 2, 3].map((rowIdx) => renderCardSlot(0, rowIdx))}
              </div>

              {/* Column 1: Cards */}
              <div className="flex flex-col gap-2.5">
                {[0, 1, 2, 3].map((rowIdx) => renderCardSlot(1, rowIdx))}
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
                {[0, 1, 2, 3].map((rowIdx) => renderCardSlot(2, rowIdx))}
              </div>

              {/* Column 4: Cards */}
              <div className="flex flex-col gap-2.5">
                {[0, 1, 2, 3].map((rowIdx) => renderCardSlot(3, rowIdx))}
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
              เลือกระดับด่าน (Level 1-40)
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

      {/* LEVEL SELECT MODAL (Supports Level 1 to 40, With Locks and Stars) */}
      {showLevelSelect && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-300/80 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-950 font-mono">
                  เลือกระดับด่าน (Level Select)
                </h3>
                <p className="text-[11px] text-amber-800 font-bold">
                  ปลดล็อกตามลำดับความสำเร็จ (ด่านที่ผ่านแล้วเลือกเล่นซ้ำเพื่อเก็บ 3 ดาวได้)
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
              {Array.from({ length: 40 }, (_, i) => i + 1).map((lvlNum) => {
                const conf = getLevelData(lvlNum);
                const isCurrent = level === lvlNum;
                const isUnlocked = lvlNum <= maxUnlockedLevel;
                const starsCount = levelStars[lvlNum] || 0;

                if (!isUnlocked) {
                  return (
                    <div
                      key={lvlNum}
                      onClick={() =>
                        showToast(`🔒 ด่านนี้ยังถูกล็อกอยู่! ต้องเล่นผ่านด่าน ${lvlNum - 1} ก่อนครับ`)
                      }
                      className="p-3 rounded-2xl border-2 border-slate-300 bg-slate-100/70 text-slate-400 flex items-center justify-between opacity-80 cursor-not-allowed select-none"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-sm text-slate-500">LEVEL {lvlNum}</div>
                          <p className="text-[11px] text-slate-400">
                            ล็อกอยู่ (ต้องผ่าน LEVEL {lvlNum - 1} ก่อน)
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">🔒 LOCKED</div>
                    </div>
                  );
                }

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
                        {/* Stars Earned */}
                        <div className="flex space-x-0.5 ml-1">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= starsCount
                                  ? 'fill-amber-400 text-amber-500'
                                  : isCurrent
                                  ? 'text-amber-200/50'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
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
                  กติกา อุปสรรค และเทคนิคการเล่น
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
              <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300">
                <span className="font-black text-amber-900 block mb-1">🎮 วิธีการเล่น:</span>
                <p>• <strong>ลากเมาส์ (Drag & Drop)</strong> การ์ดไปวางในช่องหมวดหมู่ด้านบน หรือแตะการ์ดแล้วแตะช่องหมวดหมู่เพื่อวาง</p>
                <p>• หากช่องเป้าหมายยังไม่ว่าง ให้ลากไปพักที่ <strong>ม้านั่งสำรอง (Bench)</strong> ด้านล่าง</p>
                <p>• วางผิดหมวดจะถูกหัก <strong>1 Move</strong> ระวังอย่าให้ Moves หมดก่อนเคลียร์โต๊ะครบ!</p>
              </div>

              <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200">
                <span className="font-black text-cyan-900 block mb-1">❄️ ไพ่แช่แข็ง (Frozen Ice):</span>
                <p>• การ์ดที่ติดน้ำแข็งจะลากไม่ได้ <strong>แตะ 1 ครั้งเพื่อกะเทาะน้ำแข็ง</strong> (เสีย 1 Move)</p>
                <p>• หรือจัดหมวดหมู่เดียวกันเข้าช่องเป้าหมาย น้ำแข็งบนการ์ดหมวดเดียวกันจะละลายทันที!</p>
              </div>

              <div className="bg-slate-100 p-3 rounded-xl border border-slate-300">
                <span className="font-black text-slate-900 block mb-1">⛓️ ไพ่ติดโซ่ตรวน (Chained):</span>
                <p>• ต้องเคลียร์หมวดหมู่อื่นให้เต็มสมบูรณ์ 1 หมวด โซ่ตรวนจะแตกทั้งหมด</p>
                <p>• หรือแตะที่โซ่เพื่อใช้ 100 เหรียญทองปลดล็อกทันที</p>
              </div>

              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                <span className="font-black text-purple-900 block mb-1">❓ ไพ่ปริศนา (Mystery Card):</span>
                <p>• ไพ่คว่ำหน้า แตะ 1 ครั้งเพื่อเปิดดูว่าเป็นรูปอะไรก่อนนำไปจัดหมวด</p>
              </div>

              <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                <span className="font-black text-amber-900 block mb-1">⭐ ระบบคะแนนดาว:</span>
                <p>• เคลียร์ด่านโดยเหลือ Moves เกิน 35% รับ <strong>3 ดาว ⭐⭐⭐</strong></p>
                <p>• เล่นผ่านด่านเพื่อปลดล็อกด่านถัดไปทีละด่าน</p>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              เข้าใจแล้ว เริ่มลุยเลย!
            </button>
          </div>
        </div>
      )}

      {/* WIN POPUP MODAL (With 3-Star Rating and Next Level Button) */}
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

            {/* Stars Rating Display */}
            <div className="flex items-center justify-center space-x-2 my-2">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-9 h-9 transition-transform duration-300 ${
                    s <= earnedStarsInWin
                      ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-md animate-bounce'
                      : 'text-amber-200/50'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-amber-900">
              {earnedStarsInWin === 3
                ? 'สุดยอดฝีมือ! ผ่านด่านระดับ 3 ดาว ⭐⭐⭐'
                : earnedStarsInWin === 2
                ? 'ยอดเยี่ยม! ผ่านด่านระดับ 2 ดาว ⭐⭐'
                : 'ผ่านด่านระดับ 1 ดาว ⭐'}
            </p>

            <div className="flex items-center justify-center space-x-2 bg-amber-200/60 py-2 rounded-xl text-amber-900 font-black">
              <Star className="w-5 h-5 fill-amber-500 text-amber-600" />
              <span>เหรียญรวม: {coins} เหรียญ</span>
            </div>

            <button
              onClick={handleNextLevel}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-[0_5px_0_#065f46] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>ปลดล็อก & ไปต่อด่านถัดไป (LEVEL {level + 1})</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
