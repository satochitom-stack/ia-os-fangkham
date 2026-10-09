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
  Layers
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
      // Wood tap sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'flip') {
      // Card flip card deck sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'match') {
      // Sparkling success chime
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

// Rich Card Database matching Cardlings
const ALL_CARDS = {
  // Ocean
  dolphin: { id: 'dolphin', name: 'Dolphin', icon: '🐬', category: 'ocean', thai: 'โลมา' },
  octopus: { id: 'octopus', name: 'Octopus', icon: '🐙', category: 'ocean', thai: 'หมึกยักษ์' },
  whale: { id: 'whale', name: 'Whale', icon: '🐳', category: 'ocean', thai: 'วาฬสีน้ำเงิน' },
  clownfish: { id: 'clownfish', name: 'Clownfish', icon: '🐠', category: 'ocean', thai: 'ปลาการ์ตูน' },
  jellyfish: { id: 'jellyfish', name: 'Jellyfish', icon: '🪼', category: 'ocean', thai: 'แมงกะพรุน' },
  shark: { id: 'shark', name: 'Shark', icon: '🦈', category: 'ocean', thai: 'ฉลาม' },

  // Jobs
  chef: { id: 'chef', name: 'Chef', icon: '👨‍🍳', category: 'jobs', thai: 'เชฟ' },
  firefighter: { id: 'firefighter', name: 'Firefighter', icon: '👩‍🚒', category: 'jobs', thai: 'นักดับเพลิง' },
  scientist: { id: 'scientist', name: 'Scientist', icon: '👩‍🔬', category: 'jobs', thai: 'นักวิทยาศาสตร์' },
  farmer: { id: 'farmer', name: 'Farmer', icon: '👨‍🌾', category: 'jobs', thai: 'ชาวสวน' },
  princess: { id: 'princess', name: 'Princess', icon: '👸', category: 'jobs', thai: 'เจ้าหญิง' },
  doctor: { id: 'doctor', name: 'Doctor', icon: '👩‍⚕️', category: 'jobs', thai: 'คุณหมอ' },

  // Can fly
  phoenix: { id: 'phoenix', name: 'Phoenix', icon: '🦅', category: 'can_fly', thai: 'ฟีนิกซ์' },
  griffin: { id: 'griffin', name: 'Griffin', icon: '🦁', category: 'can_fly', thai: 'กริฟฟอน' },
  eagle: { id: 'eagle', name: 'Eagle', icon: '🦅', category: 'can_fly', thai: 'นกอินทรี' },
  flamingo: { id: 'flamingo', name: 'Flamingo', icon: '🦩', category: 'can_fly', thai: 'ฟลามิงโก' },
  hummingbird: { id: 'hummingbird', name: 'Hummingbird', icon: '🐦', category: 'can_fly', thai: 'ฮัมมิงเบิร์ด' },
  glider: { id: 'glider', name: 'Glider', icon: '🛩️', category: 'can_fly', thai: 'เครื่องร่อน' }
};

const CATEGORIES_DATA = {
  ocean: { id: 'ocean', name: 'Ocean', max: 6, icon: '🌊', color: 'text-sky-600', thai: 'สัตว์ใต้ทะเล' },
  jobs: { id: 'jobs', name: 'Jobs', max: 6, icon: '💼', color: 'text-amber-600', thai: 'อาชีพต่างๆ' },
  can_fly: { id: 'can_fly', name: 'Can fly', max: 6, icon: '🪽', color: 'text-emerald-600', thai: 'สิ่งที่บินได้' }
};

export default function CardSortPuzzleView() {
  const [level, setLevel] = useState(() => {
    return parseInt(localStorage.getItem('card_sort_level') || '2', 10);
  });
  const [movesLeft, setMovesLeft] = useState(50);
  const [coins, setCoins] = useState(() => {
    return parseInt(localStorage.getItem('card_sort_coins') || '935', 10);
  });
  const [hintCount, setHintCount] = useState(3);
  const [undoCount, setUndoCount] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedFrom, setSelectedFrom] = useState(null); // { type: 'grid'|'bench', colIdx, rowIdx, benchIdx }
  const [toastMessage, setToastMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);

  // Bench (ม้านั่งพักการ์ด) on the right (6 slots)
  const [benchSlots, setBenchSlots] = useState([
    { id: 0, card: null, locked: false },
    { id: 1, card: null, locked: false },
    { id: 2, card: null, locked: false },
    { id: 3, card: null, locked: false },
    { id: 4, card: null, locked: true, unlockCost: 250 },
    { id: 5, card: null, locked: true, unlockCost: 250 }
  ]);

  // Three Active Categories
  const [completedCategories, setCompletedCategories] = useState({
    ocean: [],
    jobs: [],
    can_fly: []
  });

  // Stacks in the grid (Each cell can have 1 top card + hidden cards underneath!)
  // Columns: 0, 1 (left) and 2, 3 (right of category column)
  const [gridStacks, setGridStacks] = useState(() => initGridStacks());

  function initGridStacks() {
    return [
      // Col 0
      [
        { top: 'phoenix', hidden: [] },
        { top: 'firefighter', hidden: ['shark'] },
        { top: 'dolphin', hidden: [] },
        { top: 'octopus', hidden: [] }
      ],
      // Col 1
      [
        { top: 'chef', hidden: [] },
        { top: 'griffin', hidden: ['doctor'] },
        { top: 'eagle', hidden: [] },
        { top: 'whale', hidden: [] }
      ],
      // Col 2
      [
        { top: 'flamingo', hidden: [] },
        { top: 'farmer', hidden: [] },
        { top: 'princess', hidden: [] },
        { top: 'glider', hidden: [] }
      ],
      // Col 3
      [
        { top: 'scientist', hidden: [] },
        { top: 'jellyfish', hidden: [] },
        { top: 'hummingbird', hidden: [] },
        { top: 'clownfish', hidden: [] }
      ]
    ];
  }

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
    const totalPlaced =
      completedCategories.ocean.length +
      completedCategories.jobs.length +
      completedCategories.can_fly.length;

    // 6 in each category = 18 total cards
    if (totalPlaced >= 18 && !isWon) {
      setIsWon(true);
      playSound('win', isMuted);
      setCoins((c) => c + 150);
      showToast('🎉 VICTORY! คุณจับคู่การ์ดครบทุกหมวดหมู่ เคลียร์โต๊ะสำเร็จ!');
    }
  }, [completedCategories, isWon, isMuted]);

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
    const cat = CATEGORIES_DATA[catId];

    // Check if category has room
    if (cat && completedCategories[catId].length < cat.max) {
      // Auto-send card to its matching category!
      sendCardToCategory(cardId, fromLocation, catId);
    } else {
      // Category is either not on board or full: select the card so player can place on bench
      if (selectedCardId === cardId) {
        setSelectedCardId(null);
        setSelectedFrom(null);
      } else {
        setSelectedCardId(cardId);
        setSelectedFrom(fromLocation);
        playSound('select', isMuted);
        showToast(`เลือก "${cardData.name}" (แตะม้านั่งสำรองเพื่อนำไปพัก)`);
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
                // Reveal the next hidden card!
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
      [catId]: [...prev[catId], cardId]
    }));

    setSelectedCardId(null);
    setSelectedFrom(null);
    playSound('match', isMuted);
    showToast(`✨ ส่ง "${ALL_CARDS[cardId].name}" เข้าหมวด ${CATEGORIES_DATA[catId].name}!`);
  };

  // Click on Bench slot
  const handleBenchClick = (benchIdx) => {
    const slot = benchSlots[benchIdx];

    // If locked, attempt unlock
    if (slot.locked) {
      if (coins >= slot.unlockCost) {
        setCoins((c) => c - slot.unlockCost);
        setBufferSlots((prev) =>
          prev.map((s, i) => (i === benchIdx ? { ...s, locked: false } : s))
        );
        playSound('match', isMuted);
        showToast('🔓 ปลดล็อกม้านั่งพักการ์ดเรียบร้อยแล้ว!');
      } else {
        showToast(`❌ เหรียญไม่พอปลดล็อกม้านั่ง (ต้องการ ${slot.unlockCost} เหรียญ)`);
        playSound('error', isMuted);
      }
      return;
    }

    // If bench slot has a card
    if (slot.card) {
      handleCardClick(slot.card, { type: 'bench', benchIdx });
      return;
    }

    // Empty bench slot: if a card is currently selected, place it here!
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
          const catId = ALL_CARDS[slot.top].category;
          if (completedCategories[catId].length < CATEGORIES_DATA[catId].max) {
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
          const catId = ALL_CARDS[slot.card].category;
          if (completedCategories[catId].length < CATEGORIES_DATA[catId].max) {
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
      showToast(`💡 คำใบ้: คลิกส่ง "${ALL_CARDS[foundCard].name}" เข้าหมวด ${CATEGORIES_DATA[ALL_CARDS[foundCard].category].name}!`);
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
          const catId = ALL_CARDS[slot.top].category;
          if (completedCategories[catId].length < CATEGORIES_DATA[catId].max) {
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

  // Restart Level
  const handleRestart = () => {
    setGridStacks(initGridStacks());
    setBenchSlots([
      { id: 0, card: null, locked: false },
      { id: 1, card: null, locked: false },
      { id: 2, card: null, locked: false },
      { id: 3, card: null, locked: false },
      { id: 4, card: null, locked: true, unlockCost: 250 },
      { id: 5, card: null, locked: true, unlockCost: 250 }
    ]);
    setCompletedCategories({ ocean: [], jobs: [], can_fly: [] });
    setMovesLeft(50);
    setSelectedCardId(null);
    setSelectedFrom(null);
    setHistory([]);
    setIsWon(false);
    playSound('place', isMuted);
    showToast('🔄 รีเซ็ตกระดานเรียบร้อยแล้ว');
  };

  // Next Level
  const handleNextLevel = () => {
    setLevel((l) => l + 1);
    handleRestart();
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

            {/* Level & Moves Counter Pill */}
            <div className="relative flex flex-col items-center">
              <div className="bg-[#115e59] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full border border-teal-300/40 shadow-xs z-10 -mb-2">
                LEVEL {level}
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
                      {/* Stack depth indicator if hidden cards exist */}
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
                {/* Category 1: Ocean */}
                <div
                  onClick={() => handleCategoryBoxClick('ocean')}
                  className={`h-24 sm:h-28 rounded-2xl border-3 border-amber-400/90 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_5px_0_#b45309] hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 text-center ${
                    selectedCardId && ALL_CARDS[selectedCardId]?.category === 'ocean'
                      ? 'ring-4 ring-sky-400 animate-pulse'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-1 text-[11px] font-black text-amber-900">
                    <span>
                      {completedCategories.ocean.length}/{CATEGORIES_DATA.ocean.max}
                    </span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">Ocean</div>
                  <div className="text-[10px] text-sky-700 font-bold mt-0.5 truncate max-w-full">
                    {completedCategories.ocean.length > 0
                      ? completedCategories.ocean.map((c) => ALL_CARDS[c]?.icon).join('')
                      : 'แตะเพื่อจัดเก็บ'}
                  </div>
                </div>

                {/* Category 2: Jobs */}
                <div
                  onClick={() => handleCategoryBoxClick('jobs')}
                  className={`h-24 sm:h-28 rounded-2xl border-3 border-amber-400/90 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_5px_0_#b45309] hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 text-center ${
                    selectedCardId && ALL_CARDS[selectedCardId]?.category === 'jobs'
                      ? 'ring-4 ring-amber-400 animate-pulse'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-1 text-[11px] font-black text-amber-900">
                    <span>
                      {completedCategories.jobs.length}/{CATEGORIES_DATA.jobs.max}
                    </span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">Jobs</div>
                  <div className="text-[10px] text-amber-800 font-bold mt-0.5 truncate max-w-full">
                    {completedCategories.jobs.length > 0
                      ? completedCategories.jobs.map((c) => ALL_CARDS[c]?.icon).join('')
                      : 'แตะเพื่อจัดเก็บ'}
                  </div>
                </div>

                {/* Category 3: Can fly */}
                <div
                  onClick={() => handleCategoryBoxClick('can_fly')}
                  className={`h-24 sm:h-28 rounded-2xl border-3 border-amber-400/90 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_5px_0_#b45309] hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 text-center ${
                    selectedCardId && ALL_CARDS[selectedCardId]?.category === 'can_fly'
                      ? 'ring-4 ring-emerald-400 animate-pulse'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-1 text-[11px] font-black text-amber-900">
                    <span>
                      {completedCategories.can_fly.length}/{CATEGORIES_DATA.can_fly.max}
                    </span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">Can fly</div>
                  <div className="text-[10px] text-emerald-800 font-bold mt-0.5 truncate max-w-full">
                    {completedCategories.can_fly.length > 0
                      ? completedCategories.can_fly.map((c) => ALL_CARDS[c]?.icon).join('')
                      : 'แตะเพื่อจัดเก็บ'}
                  </div>
                </div>

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
            <span className="font-bold">🎯 กฎการเล่น:</span>
            <span>
              คลิกการ์ดเพื่อส่งเข้าหมวดหมู่ทันที | วางการ์ดบนม้านั่งเพื่อรอหมวดหมู่ว่าง | ระวัง: วางผิดหมวดจะเสีย 1 Move!
            </span>
          </div>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="text-amber-300 hover:text-white underline font-bold cursor-pointer"
          >
            อ่านกติกาฉบับเต็ม
          </button>
        </div>
      </div>

      {/* HOW TO PLAY MODAL (ตรงตามคำอธิบาย Cardlings) */}
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
                ยินดีด้วย! คุณเคลียร์โต๊ะสำเร็จครบทุกหมวดหมู่ (+150 เหรียญทอง)
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
