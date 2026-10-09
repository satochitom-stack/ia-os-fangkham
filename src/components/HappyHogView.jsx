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
  DollarSign
} from 'lucide-react';

// Web Audio sound synthesizer for retro pixel effects
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
      osc.frequency.setValueAtTime(500, now + 0.08);
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
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.2, now);
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
    }
  } catch (e) {
    // AudioContext not allowed or not supported
  }
};

const PIG_BREEDS = {
  pink: {
    id: 'pink',
    name: 'หมูชมพูพันธุ์พื้นเมือง',
    tag: 'ธรรมดา',
    color: '#f472b6',
    bellyColor: '#fbcfe8',
    earColor: '#ec4899',
    rarity: 'Common',
    maxWeight: 120,
    pricePerKg: 15,
    description: 'เลี้ยงง่าย อารมณ์ดี ชอบกินรำข้าวเป็นชีวิตจิตใจ',
    badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
  },
  auditor: {
    id: 'auditor',
    name: 'หมูผู้ตรวจสอบ ปค.5',
    tag: 'นักตรวจมือฉมัง',
    color: '#60a5fa',
    bellyColor: '#bfdbfe',
    earColor: '#3b82f6',
    rarity: 'Rare',
    maxWeight: 150,
    pricePerKg: 28,
    description: 'ใส่แว่นตา ชอบเดินตรวจคอก คอยดูว่าใครเบิกอาหารเกินงบ',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    accessory: 'glasses'
  },
  engineer: {
    id: 'engineer',
    name: 'หมูช่างตรวจงาน Factor F',
    tag: 'สายลุยหน้างาน',
    color: '#fbbf24',
    bellyColor: '#fef08a',
    earColor: '#f59e0b',
    rarity: 'Rare',
    maxWeight: 160,
    pricePerKg: 32,
    description: 'สวมหมวกนิรภัยสีเหลือง ตัวแน่นบึ้ก ชอบตรวจงานก่อสร้าง',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    accessory: 'helmet'
  },
  golden: {
    id: 'golden',
    name: 'หมูพัสดุทองคำแท้',
    tag: 'พรีเมียม',
    color: '#eab308',
    bellyColor: '#fef08a',
    earColor: '#ca8a04',
    rarity: 'Epic',
    maxWeight: 200,
    pricePerKg: 65,
    description: 'ตัวสีทองอร่าม สวมมงกุฎ นำโชคด้านการจัดซื้อจัดจ้างไร้ข้อทักท้วง',
    badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    accessory: 'crown'
  },
  rainbow: {
    id: 'rainbow',
    name: 'หมูสายรุ้ง สตง. ผ่านฉลุย',
    tag: 'ในตำนาน (Legendary)',
    color: '#c084fc',
    bellyColor: '#f5d0fe',
    earColor: '#a855f7',
    rarity: 'Legendary',
    maxWeight: 250,
    pricePerKg: 120,
    description: 'ส่องประกายออร่าสีรุ้ง หายากที่สุด ใครเลี้ยงไว้จะตรวจผ่าน 100% ทุกโครงการ',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    accessory: 'aura'
  }
};

const FOODS = [
  { id: 'bran', name: 'รำข้าวผสมผักบุ้ง', cost: 10, weightGain: 4, fullness: 20, icon: '🌾' },
  { id: 'corn', name: 'ข้าวโพดหวานคัดเกรด', cost: 25, weightGain: 10, fullness: 45, icon: '🌽' },
  { id: 'carrot', name: 'แครอททองคำบำรุงตับ', cost: 60, weightGain: 25, fullness: 80, icon: '🥕' }
];

export default function HappyHogView() {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('happy_hog_coins');
    return saved !== null ? parseInt(saved, 10) : 150;
  });

  const [pigs, setPigs] = useState(() => {
    const saved = localStorage.getItem('happy_hog_pigs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 1,
        name: 'น้องสมพร',
        breed: 'pink',
        weight: 24,
        hunger: 70,
        cleanliness: 90,
        health: 100,
        x: 30,
        y: 45,
        targetX: 30,
        targetY: 45,
        direction: 1,
        isSleeping: false,
        isSick: false
      },
      {
        id: 2,
        name: 'ผู้ช่วยตรวจเอก',
        breed: 'auditor',
        weight: 42,
        hunger: 85,
        cleanliness: 60,
        health: 100,
        x: 65,
        y: 60,
        targetX: 65,
        targetY: 60,
        direction: -1,
        isSleeping: false,
        isSick: false
      }
    ];
  });

  const [selectedPigId, setSelectedPigId] = useState(1);
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem('happy_hog_fence_locked') === 'true';
  });
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('farm'); // 'farm' | 'shop' | 'breed' | 'stats'
  const [bubbles, setBubbles] = useState([]);
  const [hearts, setHearts] = useState([]);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('happy_hog_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('happy_hog_pigs', JSON.stringify(pigs));
  }, [pigs]);

  useEffect(() => {
    localStorage.setItem('happy_hog_fence_locked', isLocked ? 'true' : 'false');
  }, [isLocked]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Ambient wandering loop for pigs inside the pen
  useEffect(() => {
    const interval = setInterval(() => {
      setPigs((prevPigs) =>
        prevPigs.map((p) => {
          if (p.isSleeping) return p;
          // Random movement
          if (Math.random() < 0.4) {
            const nextX = Math.max(15, Math.min(85, p.x + (Math.random() * 24 - 12)));
            const nextY = Math.max(25, Math.min(78, p.y + (Math.random() * 16 - 8)));
            return {
              ...p,
              x: nextX,
              y: nextY,
              direction: nextX >= p.x ? 1 : -1,
              // Slow hunger & cleanliness decay
              hunger: Math.max(0, p.hunger - 0.2),
              cleanliness: Math.max(0, p.cleanliness - 0.15)
            };
          }
          return p;
        })
      );
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const selectedPig = pigs.find((p) => p.id === selectedPigId) || pigs[0];

  // Actions
  const handleFeed = (food) => {
    if (!selectedPig) return;
    if (coins < food.cost) {
      showToast('❌ เหรียญไม่พอซื้ออาหาร!');
      return;
    }

    setCoins((c) => c - food.cost);
    playSound('feed', isMuted);

    setPigs((prev) =>
      prev.map((p) => {
        if (p.id === selectedPig.id) {
          const breed = PIG_BREEDS[p.breed] || PIG_BREEDS.pink;
          const newWeight = Math.min(breed.maxWeight, Math.round((p.weight + food.weightGain) * 10) / 10);
          return {
            ...p,
            weight: newWeight,
            hunger: Math.min(100, p.hunger + food.fullness)
          };
        }
        return p;
      })
    );

    // Floating heart
    setHearts((h) => [...h, { id: Date.now(), x: selectedPig.x, y: selectedPig.y - 12 }]);
    setTimeout(() => {
      setHearts((h) => h.slice(1));
    }, 1200);

    showToast(`🍽️ ให้น้องกิน ${food.name} (+${food.weightGain} kg)`);
  };

  const handleBath = () => {
    if (!selectedPig) return;
    playSound('bubble', isMuted);
    setPigs((prev) =>
      prev.map((p) => (p.id === selectedPig.id ? { ...p, cleanliness: 100 } : p))
    );

    // Add soap bubbles
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
      prev.map((p) => (p.id === selectedPig.id ? { ...p, health: 100, isSick: false } : p))
    );
    showToast('💉 ฉีดยาป้องกันโรคเรียบร้อย สุขภาพแข็งแรง!');
  };

  const handleSellPig = (pig) => {
    if (pigs.length <= 1) {
      showToast('⚠️ ไม่ควรขายหมูตัวสุดท้าย เดี๋ยวฟาร์มจะร้างนะ!');
      return;
    }

    const breed = PIG_BREEDS[pig.breed] || PIG_BREEDS.pink;
    const earnings = Math.round(pig.weight * breed.pricePerKg);

    setCoins((c) => c + earnings);
    playSound('coin', isMuted);

    setPigs((prev) => prev.filter((p) => p.id !== pig.id));
    if (selectedPigId === pig.id) {
      const remaining = pigs.filter((p) => p.id !== pig.id);
      setSelectedPigId(remaining[0]?.id || null);
    }

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
      direction: 1,
      isSleeping: false,
      isSick: false
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

    // Roll for rare breeds!
    const roll = Math.random();
    let resultBreed = 'pink';
    if (roll > 0.9) resultBreed = 'rainbow';
    else if (roll > 0.7) resultBreed = 'golden';
    else if (roll > 0.45) resultBreed = 'engineer';
    else if (roll > 0.25) resultBreed = 'auditor';

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
      direction: 1,
      isSleeping: false,
      isSick: false
    };

    setPigs((prev) => [...prev, baby]);
    setSelectedPigId(baby.id);
    showToast(`✨ ลูกหมูเกิดแล้ว! พันธุ์: ${PIG_BREEDS[resultBreed].name}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900/95 text-white border border-amber-500/50 shadow-2xl px-5 py-3 rounded-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-20 text-9xl select-none">🐷</div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest font-black bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-xs mb-2">
              <span>🎮 Cozy Breakroom Mini-Game</span>
              <span>•</span>
              <span>สไตล์ที่ 3 Pixel Art</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center space-x-3 font-mono">
              <span>แฮปปี้ฟาร์มหมูผู้ตรวจ (Happy Hog Farm)</span>
              <span className="text-xl">🌾</span>
            </h1>
            <p className="text-pink-100 text-xs sm:text-sm mt-1">
              เลี้ยงหมูคลายเครียด ป้องกันการขโมยหมู สะสมเหรียญ และลุ้นสายพันธุ์ สตง. ผ่านฉลุยในตำนาน!
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-400 text-slate-900 rounded-xl font-black text-sm shadow-xs">
              <Coins className="w-4 h-4 text-amber-800" />
              <span>{coins.toLocaleString()} เหรียญ</span>
            </div>

            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isLocked
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                  : 'bg-rose-500/80 hover:bg-rose-500 text-white'
              }`}
              title={isLocked ? 'คอกล็อกกุญแจแน่นหนาแล้ว' : 'กดเพื่อล็อกกุญแจคอกหมู'}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'ล็อกคอกแล้ว' : 'คอกยังไม่ล็อก'}</span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors cursor-pointer"
              title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('farm')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'farm'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <span>🐷 หน้าฟาร์ม ({pigs.length} ตัว)</span>
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'shop'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ร้านขายลูกหมู</span>
        </button>
        <button
          onClick={() => setActiveTab('breed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'breed'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Dna className="w-4 h-4" />
          <span>ห้องผสมพันธุ์วิจัย</span>
        </button>
      </div>

      {/* Tab: FARM VIEW */}
      {activeTab === 'farm' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Pig Pen (Grassy Canvas Area) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-full h-112 rounded-3xl overflow-hidden border-4 border-amber-900/40 shadow-inner bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-600 select-none">
              {/* Grassy textures & pen details */}
              <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              {/* Wooden Fence Top */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-amber-800/80 border-b-4 border-amber-950 flex items-center justify-around px-4">
                <span className="text-amber-200 text-xs font-mono font-bold">🪵 รั้วคอกไม้ อปท.</span>
                {isLocked ? (
                  <span className="text-xs bg-emerald-700/80 text-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-500">
                    <Lock className="w-3 h-3" />
                    <span>ติดกุญแจแน่นหนา (กันแอบอุ้มหมู 100%)</span>
                  </span>
                ) : (
                  <span className="text-xs bg-rose-700/80 text-rose-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-rose-500">
                    <Unlock className="w-3 h-3" />
                    <span>ไม่ได้ล็อก! ระวังเพื่อนข้างเคียงแอบย่องมาอุ้ม</span>
                  </span>
                )}
              </div>

              {/* Farm elements: Mud puddle, hay pile, trough */}
              <div className="absolute top-16 left-6 w-24 h-16 bg-amber-950/25 rounded-[40%] blur-[1px] border border-amber-900/30 flex items-center justify-center">
                <span className="text-xs text-amber-900/60 font-mono">บ่อโคลน</span>
              </div>

              <div className="absolute bottom-6 left-8 bg-amber-700/90 text-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-950 shadow-md flex items-center space-x-2">
                <span>🥣 รางอาหารกลาง</span>
                <span className="text-xs bg-amber-950 px-2 py-0.5 rounded-full text-amber-300">พร้อมกิน</span>
              </div>

              <div className="absolute top-16 right-8 bg-amber-100/90 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 px-3 py-1.5 rounded-2xl border border-amber-300 text-xs font-mono shadow-xs">
                🌾 กองฟางนอนอุ่น
              </div>

              {/* Render Floating Hearts */}
              {hearts.map((h) => (
                <div
                  key={h.id}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className="absolute pointer-events-none text-2xl animate-bounce z-30 drop-shadow-md"
                >
                  💖
                </div>
              ))}

              {/* Render Bubbles */}
              {bubbles.map((b) => (
                <div
                  key={b.id}
                  style={{ left: `${b.x}%`, top: `${b.y}%` }}
                  className="absolute pointer-events-none text-xl animate-ping z-30"
                >
                  🫧
                </div>
              ))}

              {/* Render Pigs */}
              {pigs.map((pig) => {
                const breed = PIG_BREEDS[pig.breed] || PIG_BREEDS.pink;
                const isSelected = selectedPigId === pig.id;
                const sizeScale = Math.min(1.4, 0.85 + (pig.weight / breed.maxWeight) * 0.55);

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
                    className={`absolute cursor-pointer select-none group z-20 ${
                      isSelected ? 'ring-4 ring-amber-300 ring-offset-2 rounded-full' : ''
                    }`}
                  >
                    {/* Name tag and Weight over pig head */}
                    <div
                      style={{ transform: `scaleX(${pig.direction})` }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-xs flex items-center space-x-1 pointer-events-none border border-slate-700"
                    >
                      <span>{pig.name}</span>
                      <span className="text-amber-300 font-mono">({pig.weight}kg)</span>
                    </div>

                    {/* SVG Pixel/Chibi Pig Sprite */}
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

                      {/* Accessory: Glasses */}
                      {breed.accessory === 'glasses' && (
                        <g>
                          <circle cx="17" cy="21" r="5" fill="none" stroke="#1e293b" strokeWidth="2" />
                          <circle cx="9" cy="21" r="5" fill="none" stroke="#1e293b" strokeWidth="2" />
                          <line x1="14" y1="21" x2="12" y2="21" stroke="#1e293b" strokeWidth="2" />
                        </g>
                      )}

                      {/* Accessory: Helmet */}
                      {breed.accessory === 'helmet' && (
                        <g>
                          <path d="M6 16 Q18 4 28 16 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                          <rect x="4" y="15" width="26" height="3" rx="1.5" fill="#facc15" />
                        </g>
                      )}

                      {/* Accessory: Crown */}
                      {breed.accessory === 'crown' && (
                        <polygon points="8,14 11,6 15,11 19,4 23,11 27,6 30,14" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                      )}

                      {/* Accessory: Aura */}
                      {breed.accessory === 'aura' && (
                        <circle cx="18" cy="26" r="18" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="3 2" />
                      )}
                    </svg>
                  </div>
                );
              })}
            </div>

            {/* Farm status indicators */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold">📊 สถิติฟาร์ม:</span>
                <span>จำนวนหมู: <b>{pigs.length}/8</b> ตัว</span>
                <span>•</span>
                <span>น้ำหนักรวม: <b>{pigs.reduce((a, b) => a + b.weight, 0).toFixed(1)} kg</b></span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 italic">
                *คลิกที่ตัวหมูในคอก เพื่อเลือกตัวที่ต้องการดูแล
              </div>
            </div>
          </div>

          {/* Pig Detail & Care Panel */}
          <div className="space-y-4">
            {selectedPig ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${PIG_BREEDS[selectedPig.breed]?.badgeColor}`}>
                      {PIG_BREEDS[selectedPig.breed]?.tag}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                      {selectedPig.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-pink-600 dark:text-pink-400 font-mono">
                      {selectedPig.weight} <span className="text-xs text-slate-500 font-sans">kg</span>
                    </span>
                    <p className="text-[11px] text-slate-500">
                      สูงสุด {PIG_BREEDS[selectedPig.breed]?.maxWeight} kg
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {PIG_BREEDS[selectedPig.breed]?.description}
                </p>

                {/* Status Gauges */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="flex items-center space-x-1">
                        <span>🥣 ความอิ่ม (Hunger)</span>
                      </span>
                      <span>{Math.round(selectedPig.hunger)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${selectedPig.hunger}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="flex items-center space-x-1">
                        <span>🧼 ความสะอาด (Cleanliness)</span>
                      </span>
                      <span>{Math.round(selectedPig.cleanliness)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${selectedPig.cleanliness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="flex items-center space-x-1">
                        <span>❤️ สุขภาพ (Health)</span>
                      </span>
                      <span>{Math.round(selectedPig.health)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full transition-all duration-300"
                        style={{ width: `${selectedPig.health}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Feeding actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <Utensils className="w-3.5 h-3.5 text-amber-500" />
                    <span>เลือกอาหารให้น้องกิน:</span>
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {FOODS.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleFeed(food)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-750 text-center transition-all cursor-pointer group hover:bg-amber-50/50"
                      >
                        <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{food.icon}</div>
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{food.name}</div>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold mt-0.5">
                          {food.cost} เหรียญ
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Care buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleBath}
                    className="py-2.5 px-3 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Bath className="w-4 h-4" />
                    <span>อาบน้ำขัดสีฉวีวรรณ</span>
                  </button>

                  <button
                    onClick={handleVaccine}
                    className="py-2.5 px-3 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Syringe className="w-4 h-4" />
                    <span>ฉีดยากันโรค (20฿)</span>
                  </button>
                </div>

                {/* Sell pig button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleSellPig(selectedPig)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>
                      ขายส่งโรงงาน (ได้รับ ~{Math.round(selectedPig.weight * (PIG_BREEDS[selectedPig.breed]?.pricePerKg || 15)).toLocaleString()} เหรียญ)
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center text-slate-500 border border-slate-200 dark:border-slate-700">
                ไม่มีหมูที่ถูกเลือก
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: SHOP VIEW */}
      {activeTab === 'shop' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                🏪 ตลาดซื้อขายลูกหมู อปท.
              </h2>
              <p className="text-xs text-slate-500">เลือกซื้อลูกหมูสายพันธุ์พิเศษ เพื่อนำไปขุนในคอก</p>
            </div>
            <div className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-bold">
              เงินคงเหลือ: {coins.toLocaleString()} เหรียญ
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { breedKey: 'pink', price: 100 },
              { breedKey: 'auditor', price: 250 },
              { breedKey: 'engineer', price: 320 },
              { breedKey: 'golden', price: 650 },
              { breedKey: 'rainbow', price: 1500 }
            ].map(({ breedKey, price }) => {
              const breed = PIG_BREEDS[breedKey];
              return (
                <div
                  key={breedKey}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${breed.badgeColor}`}>
                        {breed.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {breed.pricePerKg} ฿/kg
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100">{breed.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {breed.description}
                    </p>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      น้ำหนักสูงสุด: <b>{breed.maxWeight} kg</b>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyPiglet(breedKey, price)}
                    className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>ซื้อลูกหมู ({price.toLocaleString()} เหรียญ)</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: BREED VIEW */}
      {activeTab === 'breed' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 rounded-3xl flex items-center justify-center mx-auto text-3xl">
            🧬
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              ห้องปฏิบัติการผสมพันธุ์ลูกหมู
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              ผสมพันธุ์หมูที่โตเต็มวัย (หนักมากกว่า 60 kg) เพื่อลุ้นรับสายพันธุ์หายาก เช่น หมูทองคำ หรือหมูสายรุ้ง สตง. ผ่านฉลุย!
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-left">
            <div className="font-bold text-slate-700 dark:text-slate-300">💡 อัตราความน่าจะเป็นในการลุ้นลูกหมู:</div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
              <div>• หมูสายรุ้งในตำนาน: 10%</div>
              <div>• หมูพัสดุทองคำแท้: 20%</div>
              <div>• หมูช่างตรวจงาน: 25%</div>
              <div>• หมูผู้ตรวจสอบ ปค.5: 20%</div>
              <div>• หมูชมพูธรรมดา: 25%</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleBreed}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md cursor-pointer flex items-center justify-center space-x-2"
            >
              <Dna className="w-4 h-4" />
              <span>ผสมพันธุ์ลูกหมูทันที (ค่าบริการ 80 เหรียญ)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
