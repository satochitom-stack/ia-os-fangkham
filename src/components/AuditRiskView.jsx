import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Printer,
  FileText,
  Building,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Info,
  Layers,
  AlertCircle
} from 'lucide-react';

// รายการกิจกรรมมาตรฐานเริ่มต้นในจักรวาลการตรวจสอบ (Standard Audit Universe Activities)
export const defaultAuditUniverse = [
  {
    id: 'AU-01',
    department: 'กองคลัง',
    activity: 'การจัดเก็บภาษี ค่าธรรมเนียม และลูกหนี้ค้างชำระ',
    sScore: 3,
    oScore: 3,
    fScore: 3,
    cScore: 3,
    kScore: 3,
    reason: 'มีลูกหนี้ค้างชำระสะสม ฐานข้อมูลลูกหนี้ขยะและผู้ประกอบการต้องปรับปรุงให้เป็นปัจจุบัน',
    includedInPlan: true
  },
  {
    id: 'AU-02',
    department: 'กองคลัง',
    activity: 'การจัดทำบัญชีและรายงานการเงิน (ระบบ New e-LAAS)',
    sScore: 2,
    oScore: 3,
    fScore: 2,
    cScore: 3,
    kScore: 3,
    reason: 'การบันทึกบัญชีแม่และลูก (ศพด.) และการปรับปรุงระบบ New e-LAAS ให้ตรงตามเกณฑ์กรมบัญชีกลาง',
    includedInPlan: true
  },
  {
    id: 'AU-03',
    department: 'กองช่าง',
    activity: 'งานควบคุมงานก่อสร้างโครงสร้างพื้นฐาน (ถนน คสล. / โครงการตามข้อบัญญัติ)',
    sScore: 2,
    oScore: 3,
    fScore: 3,
    cScore: 2,
    kScore: 2,
    reason: 'งบประมาณก่อสร้างสูง มีความเสี่ยงในการตรวจรับให้ตรงตามแบบรูปรายการและสัญญาจ้าง',
    includedInPlan: true
  },
  {
    id: 'AU-04',
    department: 'กองการศึกษา ศาสนาและวัฒนธรรม',
    activity: 'การจัดทำบัญชีและรายงานการเงินของศูนย์พัฒนาเด็กเล็ก (ศพด.)',
    sScore: 2,
    oScore: 3,
    fScore: 2,
    cScore: 3,
    kScore: 3,
    reason: 'ครูผู้ดูแลเด็กยังขาดทักษะด้านการบันทึกบัญชีและการจัดซื้อจัดจ้างตามระบบ e-LAAS',
    includedInPlan: true
  },
  {
    id: 'AU-05',
    department: 'กองการศึกษา ศาสนาและวัฒนธรรม',
    activity: 'การเบิกจ่ายเงินอุดหนุนอาหารกลางวันและอาหารเสริมนมโรงเรียน',
    sScore: 2,
    oScore: 2,
    fScore: 3,
    cScore: 2,
    kScore: 2,
    reason: 'วงเงินอุดหนุนสูง ต้องสุ่มตรวจการเบิกจ่ายเงินและจำนวนเด็กจริงให้ถูกต้องตามระเบียบฯ',
    includedInPlan: false
  },
  {
    id: 'AU-06',
    department: 'สำนักปลัด',
    activity: 'การใช้และรักษารถยนต์ส่วนกลาง และการเบิกจ่ายน้ำมันเชื้อเพลิง',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 2,
    reason: 'ต้องตรวจสอบสมุดคุมการใช้รถ การขออนุมัติเดินทาง และเกณฑ์การสิ้นเปลืองน้ำมันเชื้อเพลิง',
    includedInPlan: false
  },
  {
    id: 'AU-07',
    department: 'กองช่าง',
    activity: 'งานควบคุมอาคารและการขออนุญาตก่อสร้าง/ดัดแปลงอาคาร',
    sScore: 2,
    oScore: 3,
    fScore: 2,
    cScore: 3,
    kScore: 2,
    reason: 'การกำกับดูแลตาม พรบ.ควบคุมอาคาร พ.ศ. 2522 และการอนุญาตสิ่งปลูกสร้างในพื้นที่',
    includedInPlan: false
  },
  {
    id: 'AU-08',
    department: 'กองคลัง',
    activity: 'การบริหารสัญญาและการควบคุมหลักประกันสัญญา',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 2,
    reason: 'การติดตามคืนหลักประกันสัญญาเมื่อพ้นภาระผูกพัน และการริบหลักประกันกรณีผิดสัญญา',
    includedInPlan: false
  },
  {
    id: 'AU-09',
    department: 'สำนักปลัด',
    activity: 'งานสารบรรณและการรับ-ส่งหนังสือราชการอิเล็กทรอนิกส์',
    sScore: 2,
    oScore: 2,
    fScore: 1,
    cScore: 2,
    kScore: 2,
    reason: 'การจัดเก็บหนังสือราชการให้เป็นระบบ รวดเร็ว และสืบค้นได้ทันท่วงที',
    includedInPlan: false
  },
  {
    id: 'AU-10',
    department: 'กองสวัสดิการสังคม',
    activity: 'การเบิกจ่ายเงินเบี้ยยังชีพผู้สูงอายุและคนพิการ',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 1,
    reason: 'การตรวจสอบคุณสมบัติของผู้มีสิทธิรับเงินเบี้ยยังชีพ และการตรวจสอบรายชื่อผู้เสียชีวิต',
    includedInPlan: false
  }
];

export default function AuditRiskView({
  selectedYear = '2568',
  orgProfile = {},
  auditUniverse = [],
  setAuditUniverse,
  annualPlans = [],
  setAnnualPlans,
  setCurrentTab
}) {
  const [activeSubTab, setActiveSubTab] = useState('matrix'); // 'matrix', 'ranking', 'report'
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    department: 'กองคลัง',
    activity: '',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 2,
    reason: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // คำนวณคะแนนเฉลี่ย SOFCK 5 มิติ
  const calculateScore = (item) => {
    const sum = Number(item.sScore) + Number(item.oScore) + Number(item.fScore) + Number(item.cScore) + Number(item.kScore);
    const avg = sum / 5;
    return Number(avg.toFixed(2));
  };

  // แปลผลระดับความเสี่ยงตามเกณฑ์กระทรวงการคลัง (2.6-3.0 สูงมาก, 2.1-2.5 สูง, 1.6-2.0 ปานกลาง, 1.0-1.5 ต่ำ)
  const getRiskLevelInfo = (score) => {
    if (score >= 2.6) {
      return {
        level: 'สูงมาก',
        badgeClass: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        planDecision: 'ต้องบรรจุในแผนประจำปี (Priority 1)',
        actionClass: 'text-rose-700 dark:text-rose-400 font-bold',
        priority: 1
      };
    } else if (score >= 2.1) {
      return {
        level: 'สูง',
        badgeClass: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        planDecision: 'บรรจุในแผนประจำปี (Priority 2)',
        actionClass: 'text-amber-700 dark:text-amber-400 font-bold',
        priority: 2
      };
    } else if (score >= 1.6) {
      return {
        level: 'ปานกลาง',
        badgeClass: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        planDecision: 'แผนระยะยาว / ตรวจหมุนเวียน 2-3 ปี',
        actionClass: 'text-yellow-700 dark:text-yellow-400',
        priority: 3
      };
    } else {
      return {
        level: 'ต่ำ',
        badgeClass: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        planDecision: 'เฝ้าระวัง / ควบคุมภายในปกติ',
        actionClass: 'text-emerald-700 dark:text-emerald-400',
        priority: 4
      };
    }
  };

  // สถิติภาพรวม
  const scoredItems = auditUniverse.map((item) => {
    const score = calculateScore(item);
    const info = getRiskLevelInfo(score);
    return { ...item, score, ...info };
  });

  const totalActivities = scoredItems.length;
  const veryHighCount = scoredItems.filter((i) => i.level === 'สูงมาก').length;
  const highCount = scoredItems.filter((i) => i.level === 'สูง').length;
  const mediumCount = scoredItems.filter((i) => i.level === 'ปานกลาง').length;
  const lowCount = scoredItems.filter((i) => i.level === 'ต่ำ').length;

  // กรองรายการ
  const filteredItems = scoredItems.filter((item) => {
    if (departmentFilter !== 'all' && item.department !== departmentFilter) return false;
    if (riskLevelFilter !== 'all' && item.level !== riskLevelFilter) return false;
    if (searchQuery.trim() && !item.activity.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // โหลดกิจกรรมมาตรฐานของ อปท. เมื่อยังว่างอยู่
  const handleLoadDefaults = () => {
    if (window.confirm('ท่านต้องการโหลดรายการกิจกรรมมาตรฐานในจักรวาลการตรวจสอบ (Audit Universe) หรือไม่?')) {
      setAuditUniverse(defaultAuditUniverse);
      showToast('โหลดรายการกิจกรรมมาตรฐานเรียบร้อยแล้ว');
    }
  };

  // บันทึกกิจกรรมใหม่ หรือ อัปเดตรายการเดิม
  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!formData.activity.trim()) return;

    if (editingItem) {
      const updated = auditUniverse.map((i) =>
        i.id === editingItem.id ? { ...i, ...formData } : i
      );
      setAuditUniverse(updated);
      showToast('แก้ไขข้อมูลกิจกรรมเรียบร้อยแล้ว');
    } else {
      const newId = `AU-${String(auditUniverse.length + 1).padStart(2, '0')}`;
      const newItem = {
        id: newId,
        ...formData,
        includedInPlan: false
      };
      setAuditUniverse([...auditUniverse, newItem]);
      showToast('เพิ่มกิจกรรมในจักรวาลการตรวจสอบเรียบร้อยแล้ว');
    }

    setShowAddModal(false);
    setEditingItem(null);
    setFormData({
      department: 'กองคลัง',
      activity: '',
      sScore: 2,
      oScore: 2,
      fScore: 2,
      cScore: 2,
      kScore: 2,
      reason: ''
    });
  };

  // ลบกิจกรรม
  const handleDeleteActivity = (id) => {
    if (window.confirm('ท่านแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้ออกจากการประเมินความเสี่ยง?')) {
      setAuditUniverse(auditUniverse.filter((i) => i.id !== id));
      showToast('ลบกิจกรรมเรียบร้อยแล้ว');
    }
  };

  // นำกิจกรรมที่มีความเสี่ยงสูง เข้าสู่แผนการตรวจสอบประจำปี (Push to Annual Plan)
  const handlePushToAnnualPlan = (item) => {
    // ตรวจสอบว่ามีโครงการนี้ในแผนหรือยัง
    const exists = annualPlans.some((p) => p.title === item.activity);
    if (exists) {
      alert(`โครงการ "${item.activity}" มีอยู่ในแผนการตรวจสอบประจำปี ${selectedYear} แล้ว`);
      return;
    }

    const yearSuffix = (selectedYear || '2568').slice(-2);
    const newPlanId = `PLAN-${yearSuffix}-0${annualPlans.length + 1}`;
    const newPlan = {
      id: newPlanId,
      title: item.activity,
      department: item.department,
      quarter: `ไตรมาส 1 (ต.ค. - ธ.ค. ${yearSuffix})`,
      period: `พ.ศ. ${selectedYear}`,
      riskLevel: item.level,
      budget: 5000,
      objective: `เพื่อตรวจสอบการปฏิบัติงานและประเมินประสิทธิภาพกิจกรรม ${item.activity} ตามผลการประเมินความเสี่ยงที่มีคะแนน ${item.score}`,
      status: 'pending',
      progress: 0
    };

    setAnnualPlans([...annualPlans, newPlan]);

    // อัปเดตสถานะ includedInPlan ใน auditUniverse
    const updated = auditUniverse.map((i) =>
      i.id === item.id ? { ...i, includedInPlan: true } : i
    );
    setAuditUniverse(updated);

    showToast(`บรรจุ "${item.activity}" เข้าสู่แผนการตรวจสอบประจำปี ${selectedYear} แล้ว`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 border border-blue-500 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-xs font-medium text-blue-200 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-300" />
              <span>การประเมินความเสี่ยงเพื่อจัดทำแผนการตรวจสอบ ประจำปีงบประมาณ พ.ศ. {selectedYear}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              การประเมินความเสี่ยงของหน่วยตรวจสอบภายใน (Audit Risk Assessment)
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-3xl leading-relaxed">
              วิเคราะห์ความเสี่ยงรายกิจกรรมในจักรวาลการตรวจสอบ (Audit Universe) ตามกรอบ SOFCK 5 มิติ
              ตามมาตรฐานและหลักเกณฑ์กระทรวงการคลัง เพื่อคัดเลือกกิจกรรมความเสี่ยงสูงบรรจุเข้าสู่แผนการตรวจสอบประจำปี
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {auditUniverse.length === 0 && (
              <button
                onClick={handleLoadDefaults}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>โหลดกิจกรรมมาตรฐาน อปท.</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  department: 'กองคลัง',
                  activity: '',
                  sScore: 2,
                  oScore: 2,
                  fScore: 2,
                  cScore: 2,
                  kScore: 2,
                  reason: ''
                });
                setShowAddModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มกิจกรรมประเมินใหม่</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('report');
                setTimeout(() => window.print(), 200);
              }}
              className="no-print bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/20 shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>พิมพ์รายงานความเสี่ยง</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">กิจกรรมทั้งหมด</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{totalActivities}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">ในจักรวาลการตรวจ</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-rose-200/80 dark:border-rose-900/50 shadow-xs">
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>
            สูงมาก (2.6 - 3.0)
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{veryHighCount}</div>
          <div className="text-[10px] text-rose-500/80 mt-0.5">ต้องบรรจุในแผน (Priority 1)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-amber-200/80 dark:border-amber-900/50 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            สูง (2.1 - 2.5)
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{highCount}</div>
          <div className="text-[10px] text-amber-500/80 mt-0.5">บรรจุในแผน (Priority 2)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-yellow-200/80 dark:border-yellow-900/50 shadow-xs">
          <div className="text-[11px] font-bold text-yellow-600 dark:text-yellow-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
            ปานกลาง (1.6 - 2.0)
          </div>
          <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400 mt-1">{mediumCount}</div>
          <div className="text-[10px] text-yellow-500/80 mt-0.5">รอบหมุนเวียน 2-3 ปี</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-emerald-200/80 dark:border-emerald-900/50 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            ต่ำ (1.0 - 1.5)
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{lowCount}</div>
          <div className="text-[10px] text-emerald-500/80 mt-0.5">เฝ้าระวัง / ติดตามผล</div>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-3">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'matrix'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          ตารางประเมินความเสี่ยงรายกิจกรรม (Audit Universe Matrix)
        </button>
        <button
          onClick={() => setActiveSubTab('ranking')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'ranking'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          การจัดลำดับความเสี่ยงและการคัดเลือกเข้าแผน (Prioritization & Plan Selection)
        </button>
        <button
          onClick={() => setActiveSubTab('report')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'report'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          รายงานการประเมินความเสี่ยงเพื่อจัดทำแผนการตรวจสอบ (Official Report)
        </button>
      </div>

      {/* Tab 1: Audit Universe Matrix */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ค้นหากิจกรรมที่ประเมิน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs w-48 sm:w-64"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs font-medium"
              >
                <option value="all">ทุกหน่วยรับตรวจ</option>
                <option value="สำนักปลัด">สำนักปลัด</option>
                <option value="กองคลัง">กองคลัง</option>
                <option value="กองช่าง">กองช่าง</option>
                <option value="กองการศึกษา ศาสนาและวัฒนธรรม">กองการศึกษาฯ</option>
                <option value="กองสวัสดิการสังคม">กองสวัสดิการสังคม</option>
              </select>

              <select
                value={riskLevelFilter}
                onChange={(e) => setRiskLevelFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs font-medium"
              >
                <option value="all">ทุกระดับความเสี่ยง</option>
                <option value="สูงมาก">สูงมาก (2.6 - 3.0)</option>
                <option value="สูง">สูง (2.1 - 2.5)</option>
                <option value="ปานกลาง">ปานกลาง (1.6 - 2.0)</option>
                <option value="ต่ำ">ต่ำ (1.0 - 1.5)</option>
              </select>
            </div>

            <div className="text-slate-500 text-[11px]">
              แสดง {filteredItems.length} จาก {totalActivities} รายการ
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3 py-3 w-14 text-center">รหัส</th>
                    <th className="px-3 py-3 w-32">หน่วยรับตรวจ</th>
                    <th className="px-4 py-3 min-w-[220px]">กิจกรรมที่ประเมินความเสี่ยง</th>
                    <th className="px-2 py-3 text-center w-12" title="S: ด้านกลยุทธ์/นโยบาย (1-3)">S</th>
                    <th className="px-2 py-3 text-center w-12" title="O: ด้านการดำเนินงาน/ขั้นตอน (1-3)">O</th>
                    <th className="px-2 py-3 text-center w-12" title="F: ด้านการเงิน/งบประมาณ (1-3)">F</th>
                    <th className="px-2 py-3 text-center w-12" title="C: ด้านกฎหมาย/ระเบียบ (1-3)">C</th>
                    <th className="px-2 py-3 text-center w-12" title="K: ด้านความรู้/ไอที (1-3)">K</th>
                    <th className="px-3 py-3 text-center w-16">คะแนน</th>
                    <th className="px-3 py-3 text-center w-24">ระดับความเสี่ยง</th>
                    <th className="px-3 py-3 text-center w-32">การคัดเลือกเข้าแผน</th>
                    <th className="px-3 py-3 text-center w-28 no-print">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="text-center py-12 text-slate-400">
                        <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <div>ยังไม่มีข้อมูลกิจกรรมในจักรวาลการตรวจสอบของปีงบประมาณ {selectedYear}</div>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                          กดปุ่ม "+ เพิ่มกิจกรรมประเมินใหม่" หรือ "โหลดกิจกรรมมาตรฐาน อปท." เพื่อเริ่มต้นวิเคราะห์ความเสี่ยง
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const alreadyInPlan = annualPlans.some((p) => p.title === item.activity);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="px-3 py-3 font-mono font-bold text-center text-slate-500">{item.id}</td>
                          <td className="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200">
                            {item.department}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{item.activity}</div>
                            {item.reason && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                {item.reason}
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.sScore}</td>
                          <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.oScore}</td>
                          <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.fScore}</td>
                          <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.cScore}</td>
                          <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.kScore}</td>
                          <td className="px-3 py-3 text-center font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                            {item.score.toFixed(2)}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeClass}`}>
                              {item.level}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center text-[11px]">
                            {alreadyInPlan ? (
                              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                บรรจุในแผนแล้ว
                              </span>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400">{item.planDecision}</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center no-print">
                            <div className="flex items-center justify-center space-x-1">
                              {!alreadyInPlan && (item.level === 'สูงมาก' || item.level === 'สูง') && (
                                <button
                                  onClick={() => handlePushToAnnualPlan(item)}
                                  className="p-1 rounded-md hover:bg-blue-50 text-blue-600 dark:text-blue-400 cursor-pointer"
                                  title="นำเข้าสู่แผนการตรวจสอบประจำปี"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setFormData({
                                    department: item.department,
                                    activity: item.activity,
                                    sScore: item.sScore,
                                    oScore: item.oScore,
                                    fScore: item.fScore,
                                    cScore: item.cScore,
                                    kScore: item.kScore,
                                    reason: item.reason || ''
                                  });
                                  setShowAddModal(true);
                                }}
                                className="p-1 rounded-md hover:bg-slate-100 text-slate-600 dark:text-slate-400 cursor-pointer"
                                title="แก้ไขคะแนน"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(item.id)}
                                className="p-1 rounded-md hover:bg-rose-50 text-rose-600 dark:text-rose-400 cursor-pointer"
                                title="ลบกิจกรรม"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Risk Ranking & Prioritization */}
      {activeSubTab === 'ranking' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  การจัดลำดับคะแนนความเสี่ยงจากสูงสุดไปต่ำสุด (Risk Ranking List)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  กิจกรรมที่มีคะแนนสูงมาก (2.6 - 3.0) และสูง (2.1 - 2.5) ต้องได้รับการพิจารณาบรรจุเข้าแผนการตรวจสอบประจำปี {selectedYear} เป็นอันดับแรก
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[...scoredItems]
                .sort((a, b) => b.score - a.score)
                .map((item, idx) => {
                  const alreadyInPlan = annualPlans.some((p) => p.title === item.activity);
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {item.activity}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeClass}`}>
                              {item.level} ({item.score.toFixed(2)})
                            </span>
                          </div>
                          <div className="text-slate-500 mt-1">
                            หน่วยรับตรวจ: <strong className="text-slate-700 dark:text-slate-300">{item.department}</strong> •
                            คะแนนปัจจัย 5 มิติ: [ S={item.sScore}, O={item.oScore}, F={item.fScore}, C={item.cScore}, K={item.kScore} ]
                          </div>
                          {item.reason && (
                            <p className="text-slate-600 dark:text-slate-400 mt-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                              เหตุผลความเสี่ยง: {item.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-2">
                        {alreadyInPlan ? (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> บรรจุในแผน {selectedYear} แล้ว
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePushToAnnualPlan(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs cursor-pointer"
                          >
                            <span>+ นำเข้าแผนตรวจสอบ</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Official Print Report */}
      {activeSubTab === 'report' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* Header */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 text-center space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              รายงานผลการประเมินความเสี่ยงเพื่อจัดทำแผนการตรวจสอบภายใน
            </h2>
            <div className="text-base font-semibold text-slate-700 dark:text-slate-300">
              ประจำปีงบประมาณ พ.ศ. {selectedYear}
            </div>
            <div className="text-xs text-slate-500">
              {orgProfile.agencyName || 'หน่วยตรวจสอบภายใน'} {orgProfile.name} {orgProfile.district} {orgProfile.province}
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">1. หลักการและเหตุผล</h4>
              <p className="indent-8 text-justify leading-relaxed mt-1 text-slate-700 dark:text-slate-300">
                ตามพระราชบัญญัติวินัยการเงินการคลังของรัฐ พ.ศ. 2561 มาตรา 79 และหลักเกณฑ์กระทรวงการคลังว่าด้วยมาตรฐานและหลักเกณฑ์ปฏิบัติการตรวจสอบภายในสำหรับหน่วยงานของรัฐ พ.ศ. 2561 กำหนดให้ผู้ตรวจสอบภายในต้องจัดทำแผนการตรวจสอบประจำปีที่สอดคล้องกับวัตถุประสงค์เชิงกลยุทธ์และการบริหารความเสี่ยงของหน่วยงาน
                หน่วยตรวจสอบภายใน {orgProfile.name} จึงได้ดำเนินการประเมินความเสี่ยง (Risk Assessment) กิจกรรมในจักรวาลการตรวจสอบ (Audit Universe) ประจำปีงบประมาณ พ.ศ. {selectedYear} เพื่อใช้เป็นเกณฑ์ในการคัดเลือกกิจกรรมที่มีความเสี่ยงสูงบรรจุเข้าสู่แผนการตรวจสอบประจำปี
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">2. กรอบแนวคิดการประเมินความเสี่ยง 5 มิติ (SOFCK Framework)</h4>
              <ul className="list-disc list-inside space-y-1 mt-1 text-slate-700 dark:text-slate-300">
                <li><strong>S (Strategic):</strong> ความสอดคล้องกับยุทธศาสตร์การพัฒนาตำบลและผลกระทบต่อประชาชน</li>
                <li><strong>O (Operational):</strong> ความซับซ้อนของขั้นตอนปฏิบัติงานและความพร้อมของบุคลากร</li>
                <li><strong>F (Financial):</strong> ขนาดวงเงินงบประมาณ ปริมาณเงินหมุนเวียน และโอกาสเกิดความเสียหายทางการเงิน</li>
                <li><strong>C (Compliance):</strong> ความถูกต้องตามกฎหมาย ระเบียบ และประเด็นข้อทักท้วงเดิมจาก สตง.</li>
                <li><strong>K (Knowledge & IT):</strong> ทักษะความรู้เฉพาะทางและการใช้งานระบบสารสนเทศ (New e-LAAS, KTB Online)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">3. สรุปผลกิจกรรมที่ผ่านการคัดเลือกบรรจุเข้าสู่แผนการตรวจสอบประจำปี พ.ศ. {selectedYear}</h4>
              <div className="mt-2 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2 w-12 text-center">ลำดับ</th>
                      <th className="p-2">กิจกรรมที่ได้รับการคัดเลือก</th>
                      <th className="p-2 w-28">หน่วยรับตรวจ</th>
                      <th className="p-2 w-20 text-center">คะแนนเฉลี่ย</th>
                      <th className="p-2 w-24 text-center">ระดับความเสี่ยง</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {scoredItems
                      .filter((i) => i.level === 'สูงมาก' || i.level === 'สูง')
                      .map((item, idx) => (
                        <tr key={item.id}>
                          <td className="p-2 text-center">{idx + 1}</td>
                          <td className="p-2 font-semibold">{item.activity}</td>
                          <td className="p-2">{item.department}</td>
                          <td className="p-2 text-center font-mono font-bold">{item.score.toFixed(2)}</td>
                          <td className="p-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeClass}`}>
                              {item.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-8">
                <div>(ลงชื่อ)........................................................</div>
                <div>
                  <div className="font-bold">({orgProfile.auditorName || 'ผู้ตรวจสอบภายใน'})</div>
                  <div className="text-slate-500">{orgProfile.auditorPosition || 'นักวิชาการตรวจสอบภายใน'}</div>
                  <div className="text-[11px] text-slate-400">ผู้ประเมินความเสี่ยง</div>
                </div>
              </div>

              <div className="space-y-8">
                <div>(ลงชื่อ)........................................................</div>
                <div>
                  <div className="font-bold">({orgProfile.approverName || 'นายกองค์กรปกครองส่วนท้องถิ่น'})</div>
                  <div className="text-slate-500">{orgProfile.approverPosition || 'นายก อปท.'}</div>
                  <div className="text-[11px] text-slate-400">ผู้อนุมัติผลการประเมิน</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Activity */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingItem ? 'แก้ไขการประเมินความเสี่ยงกิจกรรม' : 'เพิ่มกิจกรรมในจักรวาลการตรวจสอบ (Audit Universe)'}
            </h3>

            <form onSubmit={handleSaveActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">หน่วยรับตรวจ</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="กองคลัง">กองคลัง</option>
                  <option value="กองช่าง">กองช่าง</option>
                  <option value="กองการศึกษา ศาสนาและวัฒนธรรม">กองการศึกษา ศาสนาและวัฒนธรรม</option>
                  <option value="กองสวัสดิการสังคม">กองสวัสดิการสังคม</option>
                  <option value="สำนักปลัด">สำนักปลัด</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อกิจกรรมที่ประเมิน</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การจัดซื้อจัดจ้างงานโครงการก่อสร้าง..."
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>คะแนนปัจจัยเสี่ยง 5 มิติ (SOFCK Framework 1-3 คะแนน)</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                    เฉลี่ย: {((Number(formData.sScore) + Number(formData.oScore) + Number(formData.fScore) + Number(formData.cScore) + Number(formData.kScore)) / 5).toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-[11px]">
                  <div>
                    <label className="font-semibold block mb-1">S (กลยุทธ์)</label>
                    <select
                      value={formData.sScore}
                      onChange={(e) => setFormData({ ...formData, sScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">O (การทำงาน)</label>
                    <select
                      value={formData.oScore}
                      onChange={(e) => setFormData({ ...formData, oScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">F (การเงิน)</label>
                    <select
                      value={formData.fScore}
                      onChange={(e) => setFormData({ ...formData, fScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">C (ระเบียบ)</label>
                    <select
                      value={formData.cScore}
                      onChange={(e) => setFormData({ ...formData, cScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">K (ความรู้/IT)</label>
                    <select
                      value={formData.kScore}
                      onChange={(e) => setFormData({ ...formData, kScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">เหตุผลความเสี่ยง / ประเด็นข้อตรวจพบเดิม</label>
                <textarea
                  rows="2"
                  placeholder="ระบุเหตุผลความเสี่ยง หรือประเด็นข้อตรวจพบเดิมในอดีต..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  บันทึกการประเมิน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
