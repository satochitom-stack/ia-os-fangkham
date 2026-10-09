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
  Flame,
  Plus
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
    } else if (type === 'match') {
      // Sparkling success chime
      osc.type = 'sine';
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
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
    } else if (type === 'win') {
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.1);
        g.gain.setValueAtTime(0.3, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
        o.start(now + i * 0.1);
        o.stop(now + i * 0.1 + 0.4);
      });
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // AudioContext blocked or unsupported
  }
};

// Item definitions with vibrant 3D stylized emojis matching the reference screenshot
const ALL_CARDS = {
  // Category: Ocean (สิ่งมีชีวิตใต้ทะเล)
  dolphin: { id: 'dolphin', name: 'Dolphin', icon: '🐬', category: 'ocean', thai: 'โลมา' },
  octopus: { id: 'octopus', name: 'Octopus', icon: '🐙', category: 'ocean', thai: 'หมึกยักษ์' },
  whale: { id: 'whale', name: 'Whale', icon: '🐳', category: 'ocean', thai: 'วาฬสีน้ำเงิน' },
  clownfish: { id: 'clownfish', name: 'Clownfish', icon: '🐠', category: 'ocean', thai: 'ปลาการ์ตูน' },
  jellyfish: { id: 'jellyfish', name: 'Jellyfish', icon: '🪼', category: 'ocean', thai: 'แมงกะพรุน' },
  shark: { id: 'shark', name: 'Shark', icon: '🦈', category: 'ocean', thai: 'ฉลาม' },

  // Category: Jobs (อาชีพ)
  chef: { id: 'chef', name: 'Chef', icon: '👨‍🍳', category: 'jobs', thai: 'เชฟ' },
  firefighter: { id: 'firefighter', name: 'Firefighter', icon: '👩‍🚒', category: 'jobs', thai: 'นักดับเพลิง' },
  scientist: { id: 'scientist', name: 'Scientist', icon: '👩‍🔬', category: 'jobs', thai: 'นักวิทยาศาสตร์' },
  farmer: { id: 'farmer', name: 'Farmer', icon: '👨‍🌾', category: 'jobs', thai: 'ชาวสวน' },
  princess: { id: 'princess', name: 'Princess', icon: '👸', category: 'jobs', thai: 'เจ้าหญิง' },
  doctor: { id: 'doctor', name: 'Doctor', icon: '👩‍⚕️', category: 'jobs', thai: 'คุณหมอ' },

  // Category: Can fly (สิ่งที่บินได้)
  phoenix: { id: 'phoenix', name: 'Phoenix', icon: '🦅', category: 'can_fly', thai: 'ฟีนิกซ์' },
  griffin: { id: 'griffin', name: 'Griffin', icon: '🦁', category: 'can_fly', thai: 'กริฟฟอน' },
  eagle: { id: 'eagle', name: 'Eagle', icon: '🦅', category: 'can_fly', thai: 'นกอินทรี' },
  flamingo: { id: 'flamingo', name: 'Flamingo', icon: '🦩', category: 'can_fly', thai: 'ฟลามิงโก' },
  hummingbird: { id: 'hummingbird', name: 'Hummingbird', icon: '🐦', category: 'can_fly', thai: 'ฮัมมิงเบิร์ด' },
  glider: { id: 'glider', name: 'Glider', icon: '🛩️', category: 'can_fly', thai: 'เครื่องร่อน' }
};

const CATEGORIES = {
  ocean: { id: 'ocean', name: 'Ocean', max: 5, icon: '🌊', color: 'text-sky-600', thai: 'สิ่งมีชีวิตใต้ทะเล' },
  jobs: { id: 'jobs', name: 'Jobs', max: 5, icon: '💼', color: 'text-amber-600', thai: 'อาชีพต่างๆ' },
  can_fly: { id: 'can_fly', name: 'Can fly', max: 5, icon: '🪽', color: 'text-emerald-600', thai: 'สิ่งที่บินได้' }
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
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedFrom, setSelectedFrom] = useState(null); // { type: 'grid'|'buffer', colIdx, rowIdx, bufferIdx }
  const [toastMessage, setToastMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);

  // Buffer slots on the right (6 slots: first 3 unlocked, last 3 locked for 250 coins)
  const [bufferSlots, setBufferSlots] = useState([
    { id: 0, card: null, locked: false },
    { id: 1, card: null, locked: false },
    { id: 2, card: null, locked: false },
    { id: 3, card: null, locked: false },
    { id: 4, card: null, locked: true, unlockCost: 250 },
    { id: 5, card: null, locked: true, unlockCost: 250 }
  ]);

  // Target categorized cards placed into target categories
  const [completedCategories, setCompletedCategories] = useState({
    ocean: [],
    jobs: [],
    can_fly: []
  });

  // Main board columns matching the 4 grid columns around the category column
  // Col 0, 1 (Left of Category) and Col 3, 4 (Right of Category)
  const [gridColumns, setGridColumns] = useState(() => initLevelGrid());

  function initLevelGrid() {
    return [
      // Column 0
      ['phoenix', 'firefighter', 'dolphin', 'octopus'],
      // Column 1
      ['chef', 'griffin', 'eagle', 'whale'],
      // Column 3
      ['flamingo', 'farmer', 'princess', 'glider'],
      // Column 4
      ['scientist', 'jellyfish', 'hummingbird', 'clownfish']
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

    if (totalPlaced >= 15 && !isWon) {
      setIsWon(true);
      playSound('win', isMuted);
      setCoins((c) => c + 150);
      showToast('🎉 ชนะเลิศ! คุณจัดหมวดหมู่การ์ดสำเร็จครบทุกใบ!');
    }
  }, [completedCategories, isWon, isMuted]);

  // Handle card selection
  const handleSelectGridCard = (colIdx, rowIdx) => {
    const cardId = gridColumns[colIdx]?.[rowIdx];
    if (!cardId) return;

    if (selectedCardId === cardId) {
      // Deselect
      setSelectedCardId(null);
      setSelectedFrom(null);
      return;
    }

    setSelectedCardId(cardId);
    setSelectedFrom({ type: 'grid', colIdx, rowIdx });
    playSound('select', isMuted);
  };

  const handleSelectBufferCard = (bufferIdx) => {
    const slot = bufferSlots[bufferIdx];
    if (slot.locked) {
      if (coins >= slot.unlockCost) {
        setCoins((c) => c - slot.unlockCost);
        setBufferSlots((prev) =>
          prev.map((s, i) => (i === bufferIdx ? { ...s, locked: false } : s))
        );
        playSound('match', isMuted);
        showToast('🔓 ปลดล็อกช่องพักการ์ดเรียบร้อยแล้ว!');
      } else {
        showToast('❌ เหรียญไม่พอปลดล็อกช่องนี้ (ต้องการ 250 เหรียญ)');
        playSound('error', isMuted);
      }
      return;
    }

    if (!slot.card) {
      // If we have a selected card, move it to this buffer slot!
      if (selectedCardId && selectedFrom) {
        moveCardToBuffer(selectedCardId, selectedFrom, bufferIdx);
      }
      return;
    }

    if (selectedCardId === slot.card) {
      setSelectedCardId(null);
      setSelectedFrom(null);
      return;
    }

    setSelectedCardId(slot.card);
    setSelectedFrom({ type: 'buffer', bufferIdx });
    playSound('select', isMuted);
  };

  // Move card to buffer
  const moveCardToBuffer = (cardId, from, targetBufferIdx) => {
    if (movesLeft <= 0) {
      showToast('⚠️ จำนวน Moves หมดแล้ว!');
      playSound('error', isMuted);
      return;
    }

    // Save history for undo
    setHistory((prev) => [
      ...prev,
      {
        gridColumns: JSON.parse(JSON.stringify(gridColumns)),
        bufferSlots: JSON.parse(JSON.stringify(bufferSlots)),
        completedCategories: JSON.parse(JSON.stringify(completedCategories)),
        movesLeft
      }
    ]);

    setMovesLeft((m) => m - 1);

    // Remove from origin
    if (from.type === 'grid') {
      setGridColumns((prev) => {
        const next = [...prev];
        next[from.colIdx] = [...next[from.colIdx]];
        next[from.colIdx][from.rowIdx] = null;
        return next;
      });
    } else if (from.type === 'buffer') {
      setBufferSlots((prev) =>
        prev.map((s, idx) => (idx === from.bufferIdx ? { ...s, card: null } : s))
      );
    }

    // Place into buffer
    setBufferSlots((prev) =>
      prev.map((s, idx) => (idx === targetBufferIdx ? { ...s, card: cardId } : s))
    );

    setSelectedCardId(null);
    setSelectedFrom(null);
    playSound('place', isMuted);
  };

  // Deposit card into target Category
  const handleDepositToCategory = (targetCatId) => {
    if (!selectedCardId || !selectedFrom) {
      showToast('👉 กรุณาคลิกเลือกการ์ดก่อน แล้วจึงกดที่หมวดหมู่เพื่อจัดเข้ากล่อง');
      return;
    }

    const cardData = ALL_CARDS[selectedCardId];
    if (!cardData) return;

    if (movesLeft <= 0) {
      showToast('⚠️ จำนวน Moves หมดแล้ว!');
      playSound('error', isMuted);
      return;
    }

    if (cardData.category !== targetCatId) {
      playSound('error', isMuted);
      showToast(`❌ "${cardData.name}" (${cardData.thai}) ไม่ได้อยู่ในหมวดหมู่นี้!`);
      return;
    }

    const cat = CATEGORIES[targetCatId];
    if (completedCategories[targetCatId].length >= cat.max) {
      showToast('⚠️ หมวดหมู่นี้จัดครบจำนวนแล้ว!');
      playSound('error', isMuted);
      return;
    }

    // Save for undo
    setHistory((prev) => [
      ...prev,
      {
        gridColumns: JSON.parse(JSON.stringify(gridColumns)),
        bufferSlots: JSON.parse(JSON.stringify(bufferSlots)),
        completedCategories: JSON.parse(JSON.stringify(completedCategories)),
        movesLeft
      }
    ]);

    setMovesLeft((m) => m - 1);

    // Remove from origin
    if (selectedFrom.type === 'grid') {
      setGridColumns((prev) => {
        const next = [...prev];
        next[selectedFrom.colIdx] = [...next[selectedFrom.colIdx]];
        next[selectedFrom.colIdx][selectedFrom.rowIdx] = null;
        return next;
      });
    } else if (selectedFrom.type === 'buffer') {
      setBufferSlots((prev) =>
        prev.map((s, idx) => (idx === selectedFrom.bufferIdx ? { ...s, card: null } : s))
      );
    }

    // Add to completed category
    setCompletedCategories((prev) => ({
      ...prev,
      [targetCatId]: [...prev[targetCatId], selectedCardId]
    }));

    setSelectedCardId(null);
    setSelectedFrom(null);
    playSound('match', isMuted);
    showToast(`✨ ถูกต้อง! จัดเก็บ "${cardData.name}" เข้าหมวด ${cat.name} เรียบร้อย!`);
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

    const lastState = history[history.length - 1];
    setGridColumns(lastState.gridColumns);
    setBufferSlots(lastState.bufferSlots);
    setCompletedCategories(lastState.completedCategories);
    setMovesLeft(lastState.movesLeft);
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

    // Find any card currently on board or in buffer that can be placed in a category
    let found = null;
    gridColumns.forEach((col, colIdx) => {
      col.forEach((cId, rowIdx) => {
        if (cId && !found) {
          const c = ALL_CARDS[cId];
          if (c && completedCategories[c.category].length < CATEGORIES[c.category].max) {
            found = { cId, from: { type: 'grid', colIdx, rowIdx }, targetCat: c.category };
          }
        }
      });
    });

    if (!found) {
      bufferSlots.forEach((slot, bufferIdx) => {
        if (slot.card && !found) {
          const c = ALL_CARDS[slot.card];
          if (c && completedCategories[c.category].length < CATEGORIES[c.category].max) {
            found = { cId: slot.card, from: { type: 'buffer', bufferIdx }, targetCat: c.category };
          }
        }
      });
    }

    if (found) {
      setSelectedCardId(found.cId);
      setSelectedFrom(found.from);
      setHintCount((h) => h - 1);
      playSound('match', isMuted);
      showToast(`💡 คำใบ้: นำ "${ALL_CARDS[found.cId].name}" ไปใส่ในหมวด "${CATEGORIES[found.targetCat].name}"!`);
    } else {
      showToast('ไม่พบการ์ดที่สามารถจัดหมวดได้ในขณะนี้');
    }
  };

  // Magnet Booster (auto places 1 card into its category)
  const handleMagnet = () => {
    let target = null;
    gridColumns.forEach((col, colIdx) => {
      col.forEach((cId, rowIdx) => {
        if (cId && !target) {
          const c = ALL_CARDS[cId];
          if (c && completedCategories[c.category].length < CATEGORIES[c.category].max) {
            target = { cId, from: { type: 'grid', colIdx, rowIdx }, cat: c.category };
          }
        }
      });
    });

    if (target) {
      setSelectedCardId(target.cId);
      setSelectedFrom(target.from);
      setTimeout(() => {
        handleDepositToCategory(target.cat);
      }, 200);
      showToast('🧲 พลังแม่เหล็กดูดการ์ดเข้าหมวดหมู่อัตโนมัติ!');
    }
  };

  // Restart Level
  const handleRestart = () => {
    setGridColumns(initLevelGrid());
    setBufferSlots([
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
    showToast('🔄 เริ่มต้นด่านใหม่แล้ว');
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
        <div className="fixed top-6 right-6 z-50 bg-amber-950/95 text-amber-100 border-2 border-amber-500 shadow-2xl px-5 py-3 rounded-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Wood Plank Board Container - Matching exactly the reference image */}
      <div className="relative w-full min-h-[660px] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden border-8 border-amber-950/80 bg-gradient-to-b from-[#8b5a2b] via-[#75441e] to-[#5d3415] flex flex-col justify-between">
        {/* Subtle wood plank vertical grain texture lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:60px_100%] pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-black/40 pointer-events-none" />

        {/* TOP / MAIN GAMEPLAY AREA */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* ================= LEFT SIDE PANEL ================= */}
          <div className="flex md:flex-col items-center gap-3 shrink-0">
            {/* Settings Button */}
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
          </div>

          {/* ================= CENTER BOARD (GRID & CATEGORIES) ================= */}
          <div className="flex-1 flex flex-col items-center max-w-2xl w-full">
            {/* Top Indicator Bars above the 5 columns */}
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
                  const cardId = gridColumns[0]?.[rowIdx];
                  const card = ALL_CARDS[cardId];
                  const isSelected = selectedCardId === cardId;

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
                      onClick={() => handleSelectGridCard(0, rowIdx)}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
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
                  const cardId = gridColumns[1]?.[rowIdx];
                  const card = ALL_CARDS[cardId];
                  const isSelected = selectedCardId === cardId;

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
                      onClick={() => handleSelectGridCard(1, rowIdx)}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl drop-shadow-sm leading-none">{card.icon}</span>
                      <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Column 2: TARGET CATEGORY SLOTS (The Center Target Lane) */}
              <div className="flex flex-col gap-2.5">
                {/* Category 1: Ocean */}
                <div
                  onClick={() => handleDepositToCategory('ocean')}
                  className={`h-24 sm:h-28 rounded-2xl border-3 border-amber-400/90 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_5px_0_#b45309] hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 text-center ${
                    selectedCardId && ALL_CARDS[selectedCardId]?.category === 'ocean'
                      ? 'ring-4 ring-sky-400 animate-pulse'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-1 text-[11px] font-black text-amber-900">
                    <span>
                      {completedCategories.ocean.length}/{CATEGORIES.ocean.max}
                    </span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">Ocean</div>
                  <div className="text-[10px] text-sky-700 font-bold mt-0.5">
                    {completedCategories.ocean.length > 0
                      ? completedCategories.ocean.map((c) => ALL_CARDS[c]?.icon).join('')
                      : 'แตะเพื่อจัดเก็บ'}
                  </div>
                </div>

                {/* Category 2: Jobs */}
                <div
                  onClick={() => handleDepositToCategory('jobs')}
                  className={`h-24 sm:h-28 rounded-2xl border-3 border-amber-400/90 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_5px_0_#b45309] hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 text-center ${
                    selectedCardId && ALL_CARDS[selectedCardId]?.category === 'jobs'
                      ? 'ring-4 ring-amber-400 animate-pulse'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-1 text-[11px] font-black text-amber-900">
                    <span>
                      {completedCategories.jobs.length}/{CATEGORIES.jobs.max}
                    </span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">Jobs</div>
                  <div className="text-[10px] text-amber-800 font-bold mt-0.5">
                    {completedCategories.jobs.length > 0
                      ? completedCategories.jobs.map((c) => ALL_CARDS[c]?.icon).join('')
                      : 'แตะเพื่อจัดเก็บ'}
                  </div>
                </div>

                {/* Category 3: Can fly */}
                <div
                  onClick={() => handleDepositToCategory('can_fly')}
                  className={`h-24 sm:h-28 rounded-2xl border-3 border-amber-400/90 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_5px_0_#b45309] hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 text-center ${
                    selectedCardId && ALL_CARDS[selectedCardId]?.category === 'can_fly'
                      ? 'ring-4 ring-emerald-400 animate-pulse'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-1 text-[11px] font-black text-amber-900">
                    <span>
                      {completedCategories.can_fly.length}/{CATEGORIES.can_fly.max}
                    </span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">Can fly</div>
                  <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
                    {completedCategories.can_fly.length > 0
                      ? completedCategories.can_fly.map((c) => ALL_CARDS[c]?.icon).join('')
                      : 'แตะเพื่อจัดเก็บ'}
                  </div>
                </div>

                {/* Slot 4: Extra Golden Category Expander */}
                <div className="h-24 sm:h-28 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-950/40 flex flex-col items-center justify-center text-amber-400 cursor-pointer hover:bg-amber-900/40 transition-colors shadow-inner">
                  <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-amber-300 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Column 3: Cards */}
              <div className="flex flex-col gap-2.5">
                {[0, 1, 2, 3].map((rowIdx) => {
                  const cardId = gridColumns[2]?.[rowIdx];
                  const card = ALL_CARDS[cardId];
                  const isSelected = selectedCardId === cardId;

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
                      onClick={() => handleSelectGridCard(2, rowIdx)}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
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
                  const cardId = gridColumns[3]?.[rowIdx];
                  const card = ALL_CARDS[cardId];
                  const isSelected = selectedCardId === cardId;

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
                      onClick={() => handleSelectGridCard(3, rowIdx)}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border-3 border-slate-300 shadow-[0_5px_0_#94a3b8] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-1 text-center select-none ${
                        isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''
                      }`}
                    >
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

          {/* ================= BUFFER HOLDING SLOTS (Column on the right) ================= */}
          <div className="flex md:flex-col gap-2.5 shrink-0">
            {bufferSlots.map((slot, idx) => {
              const card = slot.card ? ALL_CARDS[slot.card] : null;
              const isSelected = selectedCardId === slot.card && slot.card !== null;

              if (slot.locked) {
                return (
                  <div
                    key={slot.id}
                    onClick={() => handleSelectBufferCard(idx)}
                    className="w-16 h-18 sm:w-18 sm:h-20 rounded-2xl bg-amber-950/60 border-2 border-amber-900/70 shadow-inner flex flex-col items-center justify-center cursor-pointer hover:bg-amber-900/60 transition-colors"
                    title="คลิกเพื่อปลดล็อกช่องพักการ์ดด้วย 250 เหรียญ"
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
                    onClick={() => handleSelectBufferCard(idx)}
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
                  onClick={() => handleSelectBufferCard(idx)}
                  className={`w-16 h-18 sm:w-18 sm:h-20 rounded-2xl bg-amber-950/50 border-2 border-amber-900/80 shadow-inner flex items-center justify-center cursor-pointer transition-colors ${
                    selectedCardId ? 'hover:bg-amber-800/40 ring-2 ring-amber-400/50' : ''
                  }`}
                  title="ช่องพักการ์ดชั่วคราว (คลิกการ์ดแล้วคลิกที่นี่เพื่อย้ายมาพัก)"
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
        <div className="relative z-10 mt-4 bg-amber-950/60 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-amber-700/60 flex flex-wrap items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <span className="font-bold">💡 วิธีเล่น:</span>
            <span>
              1. คลิกเลือกการ์ดที่ต้องการจัด ➔ 2. แตะที่กล่องหมวดหมู่ตรงกลาง (Ocean / Jobs / Can fly) เพื่อจัดเก็บ!
            </span>
          </div>
          <div className="text-amber-300/80 italic text-[11px]">
            *หากไม่มีที่วาง สามารถนำการ์ดไปพักไว้ที่ช่องฝั่งขวามือได้
          </div>
        </div>
      </div>

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
                ยินดีด้วย! คุณจัดหมวดหมู่สำเร็จครบทุกใบ (+150 เหรียญทอง)
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
