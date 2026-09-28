import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  BadgeDollarSign,
  HardHat,
  Plus,
  Printer,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  FileText,
  Trash2,
  Search,
  Filter,
  Sparkles,
  Layers,
  Car,
  FileSpreadsheet,
  Users,
  Wrench,
  ShieldAlert,
  ShieldCheck,
  Scale,
  Download,
  TrendingUp,
  FolderPlus,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Info
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import {
  initialOfficeWorkspaceData,
  initialFinanceWorkspaceData,
  initialTechWorkspaceData
} from '../data/initialData';

export default function DepartmentWorkspaceView({
  orgProfile = {},
  selectedYear = '2569',
  session = null,
  capaFindings = [],
  setCapaFindings = () => {},
  initialDepartment = 'สำนักปลัด',
  setCurrentTab = () => {}
}) {
  const isAdmin = session?.role === 'admin' || session?.role === 'executive';
  const userDept = session?.department || 'สำนักปลัด';

  // Determine active department: if non-admin, lock or default to user's dept
  const getDefaultDept = () => {
    if (!isAdmin) {
      if (userDept.includes('คลัง')) return 'กองคลัง';
      if (userDept.includes('ช่าง')) return 'กองช่าง';
      return 'สำนักปลัด';
    }
    return initialDepartment || 'สำนักปลัด';
  };

  const [activeDept, setActiveDept] = useState(getDefaultDept);

  useEffect(() => {
    if (initialDepartment && isAdmin) {
      setActiveDept(initialDepartment);
    }
  }, [initialDepartment, isAdmin]);

  // Sub-tabs per department
  // สำนักปลัด: 'overview', 'vehicles', 'projects', 'saraban', 'complaints', 'capa'
  // กองคลัง: 'overview', 'contracts', 'penalty', 'inventory', 'loans', 'capa'
  // กองช่าง: 'overview', 'estimator', 'projects', 'permits', 'machinery', 'capa'
  const [subTab, setSubTab] = useState('overview');

  // Reset sub-tab when department changes
  useEffect(() => {
    setSubTab('overview');
  }, [activeDept]);

  // Persistent Department States isolated in LocalStorage
  const [officeData, setOfficeData] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_dept_office_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialOfficeWorkspaceData;
  });

  const [financeData, setFinanceData] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_dept_finance_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialFinanceWorkspaceData;
  });

  const [techData, setTechData] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_dept_tech_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialTechWorkspaceData;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('ia_dept_office_data', JSON.stringify(officeData));
  }, [officeData]);

  useEffect(() => {
    localStorage.setItem('ia_dept_finance_data', JSON.stringify(financeData));
  }, [financeData]);

  useEffect(() => {
    localStorage.setItem('ia_dept_tech_data', JSON.stringify(techData));
  }, [techData]);

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Confirm Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'ยืนยัน',
    type: 'danger',
    onConfirm: () => {}
  });

  const openConfirm = (config) => {
    setConfirmModalConfig({
      isOpen: true,
      title: config.title || 'ยืนยันการทำรายการ',
      message: config.message,
      confirmText: config.confirmText || 'ยืนยัน',
      type: config.type || 'danger',
      onConfirm: config.onConfirm || (() => {})
    });
  };

  // =========================================================================
  // SUB-COMPONENTS & TOOL STATES
  // =========================================================================

  // 1. Penalty Calculator State (กองคลัง)
  const [penaltyContractPrice, setPenaltyContractPrice] = useState('850000');
  const [penaltyRate, setPenaltyRate] = useState('0.001'); // 0.1% or 0.2% or 0.01%
  const [penaltyDueDate, setPenaltyDueDate] = useState('2026-08-15');
  const [penaltyDeliveryDate, setPenaltyDeliveryDate] = useState('2026-08-25');
  const [penaltyDeductHolidays, setPenaltyDeductHolidays] = useState(0);

  const penaltyCalculation = useMemo(() => {
    const price = Number(penaltyContractPrice) || 0;
    const rate = Number(penaltyRate) || 0.001;
    if (!penaltyDueDate || !penaltyDeliveryDate) return { days: 0, dailyPenalty: 0, totalPenalty: 0 };
    const due = new Date(penaltyDueDate);
    const deliver = new Date(penaltyDeliveryDate);
    const diffTime = deliver.getTime() - due.getTime();
    let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (days <= 0) return { days: 0, dailyPenalty: Math.round(price * rate), totalPenalty: 0 };
    const netDays = Math.max(0, days - Number(penaltyDeductHolidays || 0));
    const dailyPenalty = Math.round(price * rate);
    const totalPenalty = dailyPenalty * netDays;
    return { days: netDays, dailyPenalty, totalPenalty, rawDays: days };
  }, [penaltyContractPrice, penaltyRate, penaltyDueDate, penaltyDeliveryDate, penaltyDeductHolidays]);

  // 2. Factor F Calculator State (กองช่าง)
  const [factorFWorkType, setFactorFWorkType] = useState('road'); // road, building, bridge, irrigation
  const [factorFDirectCost, setFactorFDirectCost] = useState('1500000');
  const [factorFAdvance, setFactorFAdvance] = useState('0'); // 0, 5, 10, 15
  const [factorFRetention, setFactorFRetention] = useState('0'); // 0, 5, 10
  const [factorFInterest, setFactorFInterest] = useState('6'); // 5, 6, 7
  const [factorFVat] = useState(7);

  const factorFCalculation = useMemo(() => {
    const cost = Number(factorFDirectCost) || 0;
    if (cost <= 0) return { factorF: 1.3000, estimatedPrice: 0 };
    let baseF = 1.3082;
    if (factorFWorkType === 'road') {
      if (cost < 500000) baseF = 1.3624;
      else if (cost < 1000000) baseF = 1.3285;
      else if (cost < 2000000) baseF = 1.3082;
      else if (cost < 5000000) baseF = 1.2844;
      else baseF = 1.2512;
    } else if (factorFWorkType === 'building') {
      if (cost < 500000) baseF = 1.3054;
      else if (cost < 1000000) baseF = 1.2785;
      else if (cost < 2000000) baseF = 1.2592;
      else baseF = 1.2312;
    } else if (factorFWorkType === 'bridge') {
      if (cost < 1000000) baseF = 1.3325;
      else if (cost < 2000000) baseF = 1.3115;
      else baseF = 1.2755;
    } else {
      if (cost < 1000000) baseF = 1.3150;
      else baseF = 1.2820;
    }
    // Adjust interest
    if (factorFInterest === '7') baseF += 0.0075;
    else if (factorFInterest === '5') baseF -= 0.0075;
    const estPrice = Math.round(cost * baseF);
    return { factorF: Number(baseF.toFixed(4)), estimatedPrice: estPrice };
  }, [factorFWorkType, factorFDirectCost, factorFAdvance, factorFRetention, factorFInterest]);

  // Modal Add Item States for All Departments
  const [showAddOfficeLogModal, setShowAddOfficeLogModal] = useState(false);
  const [newVehicleLog, setNewVehicleLog] = useState({
    plate: 'กข-4122 อุบลราชธานี',
    requestDate: new Date().toISOString().slice(0, 10),
    requester: '',
    destination: '',
    startKm: '',
    endKm: '',
    fuelVoucherNo: '',
    fuelLiters: '',
    fuelCost: ''
  });

  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [newContract, setNewContract] = useState({
    contractNo: '',
    title: '',
    method: 'เฉพาะเจาะจง',
    contractPrice: '',
    contractor: '',
    signedDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    guaranteeType: 'หนังสือค้ำประกันธนาคาร (LG)',
    guaranteeAmount: ''
  });

  const [showAddLoanModal, setShowAddLoanModal] = useState(false);
  const [newLoan, setNewLoan] = useState({
    contractNo: '',
    borrower: '',
    purpose: '',
    amount: '',
    borrowDate: new Date().toISOString().slice(0, 10),
    dueDate: ''
  });

  const [showAddConstProjectModal, setShowAddConstProjectModal] = useState(false);
  const [newConstProject, setNewConstProject] = useState({
    projectName: '',
    location: '',
    budget: '',
    contractPrice: '',
    contractor: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    engineerSupervisor: '',
    progress: 0
  });

  const [showAddPermitModal, setShowAddPermitModal] = useState(false);
  const [newPermit, setNewPermit] = useState({
    requestNo: '',
    applicant: '',
    buildingType: 'บ้านพักอาศัย ค.ส.ล. 1-2 ชั้น',
    areaSqM: '',
    location: '',
    submissionDate: new Date().toISOString().slice(0, 10),
    feeAmount: 100
  });

  // Filter CAPA findings belonging to the active department
  const deptCapaFindings = useMemo(() => {
    return capaFindings.filter((f) => f.department?.includes(activeDept.replace('กอง', '').replace('สำนัก', '')));
  }, [capaFindings, activeDept]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 border border-slate-700 text-xs font-bold animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Department Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Department Workspace (Sprint 3)
              </span>
              <span className="text-xs text-slate-500">
                {orgProfile.name || 'อบต.ฝางคำ'} • ปีงบประมาณ พ.ศ. {selectedYear}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2.5">
              <span>พื้นที่ทำงานเฉพาะส่วนราชการ: {activeDept}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              ศูนย์ปฏิบัติงานส่วนราชการที่เชื่อมโยงงานประจำ เครื่องมือเฉพาะทาง (พัสดุ, ราคากลาง, แผนงาน) พร้อมระบบการควบคุมภายในและการตอบข้อทักท้วงตามกฎหมาย
            </p>
          </div>

          {/* Department Switcher Tabs (For Admin/Executive or permitted viewers) */}
          {isAdmin ? (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
              {[
                { id: 'สำนักปลัด', label: 'สำนักปลัด', icon: Building2 },
                { id: 'กองคลัง', label: 'กองคลัง', icon: BadgeDollarSign },
                { id: 'กองช่าง', label: 'กองช่าง', icon: HardHat }
              ].map((d) => {
                const isSelected = activeDept === d.id;
                const Icon = d.icon;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDept(d.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>เข้าสู่ระบบในฐานะ: {session?.displayName || userDept}</span>
            </div>
          )}
        </div>

        {/* Sub-Tabs Navigation for Active Department */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
          {/* 1. สำนักปลัด Sub-Tabs */}
          {activeDept === 'สำนักปลัด' && (
            <>
              <button
                onClick={() => setSubTab('overview')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ภาพรวมสำนักปลัด</span>
              </button>
              <button
                onClick={() => setSubTab('vehicles')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'vehicles' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>ทะเบียนคุมรถ & น้ำมัน ({officeData.vehicleLogs.length})</span>
              </button>
              <button
                onClick={() => setSubTab('projects')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'projects' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>แผนพัฒนาท้องถิ่น ({officeData.developmentProjects.length})</span>
              </button>
              <button
                onClick={() => setSubTab('saraban')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'saraban' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>สารบรรณอิเล็กทรอนิกส์ ({officeData.sarabanBooks.length})</span>
              </button>
              <button
                onClick={() => setSubTab('complaints')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'complaints' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>เรื่องร้องเรียน & นิติการ ({officeData.complaints.length})</span>
              </button>
              <button
                onClick={() => setSubTab('capa')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'capa' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>ตอบข้อทักท้วง (CAPA) ({deptCapaFindings.length})</span>
              </button>
            </>
          )}

          {/* 2. กองคลัง Sub-Tabs */}
          {activeDept === 'กองคลัง' && (
            <>
              <button
                onClick={() => setSubTab('overview')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ภาพรวมกองคลัง</span>
              </button>
              <button
                onClick={() => setSubTab('contracts')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'contracts' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>ทะเบียนจัดซื้อจัดจ้าง & สัญญา ({financeData.contracts.length})</span>
              </button>
              <button
                onClick={() => setSubTab('penalty')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'penalty' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-500" />
                <span>เครื่องมือคำนวณค่าปรับพัสดุ</span>
              </button>
              <button
                onClick={() => setSubTab('inventory')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'inventory' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ตรวจสอบพัสดุประจำปี (ว 184)</span>
              </button>
              <button
                onClick={() => setSubTab('loans')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'loans' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>ลูกหนี้เงินยืม 30 วัน ({financeData.loans.length})</span>
              </button>
              <button
                onClick={() => setSubTab('capa')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'capa' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>ตอบข้อทักท้วง สตง./IA ({deptCapaFindings.length})</span>
              </button>
            </>
          )}

          {/* 3. กองช่าง Sub-Tabs */}
          {activeDept === 'กองช่าง' && (
            <>
              <button
                onClick={() => setSubTab('overview')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ภาพรวมกองช่าง</span>
              </button>
              <button
                onClick={() => setSubTab('estimator')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'estimator' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-blue-500" />
                <span>คำนวณราคากลาง Factor F & ปร.5</span>
              </button>
              <button
                onClick={() => setSubTab('projects')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'projects' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>โครงการก่อสร้างตามข้อบัญญัติ ({techData.constructionProjects.length})</span>
              </button>
              <button
                onClick={() => setSubTab('permits')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'permits' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>ขออนุญาตก่อสร้างอาคาร 45 วัน ({techData.buildingPermits.length})</span>
              </button>
              <button
                onClick={() => setSubTab('machinery')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'machinery' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>เครื่องจักรกล & ยานพาหนะ ({techData.machinery.length})</span>
              </button>
              <button
                onClick={() => setSubTab('capa')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  subTab === 'capa' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>ตอบข้อทักท้วงกองช่าง ({deptCapaFindings.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          WORKSPACE CONTENT: 1. สำนักปลัด
      ========================================================================= */}
      {activeDept === 'สำนักปลัด' && (
        <div className="space-y-6">
          {/* SubTab: Overview */}
          {subTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">ยานพาหนะส่วนกลาง</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{officeData.vehicles.length} คัน</div>
                  <div className="text-[11px] text-blue-600 font-bold">บันทึกเดินทาง {officeData.vehicleLogs.length} เที่ยว</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">โครงการพัฒนาท้องถิ่น</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{officeData.developmentProjects.length} โครงการ</div>
                  <div className="text-[11px] text-emerald-600 font-bold">งบรวม {officeData.developmentProjects.reduce((a,c)=>a+c.budget,0).toLocaleString()} ฿</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">หนังสือสารบรรณในระบบ</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{officeData.sarabanBooks.length} ฉบับ</div>
                  <div className="text-[11px] text-purple-600 font-bold">รับ-ส่งคำสั่งการล่าสุด</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">เรื่องร้องเรียนศูนย์ดำรงธรรม</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{officeData.complaints.length} เรื่อง</div>
                  <div className="text-[11px] text-amber-600 font-bold">ยุติแล้ว {officeData.complaints.filter(c=>c.status==='resolved').length} เรื่อง</div>
                </div>
              </div>

              {/* Action Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/70 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-200 font-bold text-sm">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>งานควบคุมการใช้รถยนต์ส่วนกลางและน้ำมันเชื้อเพลิง</span>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    ควบคุมการบันทึกเลขกิโลเมตรและใบสั่งจ่ายน้ำมันอย่างเคร่งครัดตามระเบียบ มท. ว่าด้วยการใช้และรักษารถยนต์ของ อปท. พ.ศ. 2548
                  </p>
                  <button
                    onClick={() => setSubTab('vehicles')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>เปิดทะเบียนคุมรถยนต์</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>แผนพัฒนาท้องถิ่นและข้อบัญญัติงบประมาณ</span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    ติดตามการดำเนินโครงการตามข้อบัญญัติงบประมาณรายจ่ายประจำปี 2569 ให้แล้วเสร็จตามกำหนด
                  </p>
                  <button
                    onClick={() => setSubTab('projects')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>ดูรายการโครงการ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Vehicles & Fuel Logbook */}
          {subTab === 'vehicles' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    สมุดบันทึกการใช้รถยนต์ส่วนกลางและการใช้น้ำมันเชื้อเพลิง (Vehicle & Fuel Logbook)
                  </h3>
                  <p className="text-xs text-slate-500">
                    บันทึกการเดินทาง เลขไมล์ และใบสั่งจ่ายน้ำมันตามระเบียบกระทรวงมหาดไทย
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAddOfficeLogModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>บันทึกการขอใช้รถ</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="no-print bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Vehicles Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {officeData.vehicles.map((v) => (
                  <div key={v.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{v.plate}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        พร้อมใช้งาน
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{v.type} ({v.brand})</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>คนขับประจำ: {v.driver}</span>
                      <span className="font-mono font-bold">เลขไมล์: {v.currentKm.toLocaleString()} กม.</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Logs Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3.5">วันที่เดินทาง</th>
                        <th className="p-3.5">ทะเบียนรถ</th>
                        <th className="p-3.5">ผู้ขอใช้รถ / วัตถุประสงค์และสถานที่ไป</th>
                        <th className="p-3.5 text-center">เลขไมล์ ไป-กลับ</th>
                        <th className="p-3.5 text-center">ระยะทาง (กม.)</th>
                        <th className="p-3.5 text-right">ใบสั่งจ่ายน้ำมัน (บาท)</th>
                        <th className="p-3.5 text-center">ผู้อนุมัติ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {officeData.vehicleLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3.5 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">{log.requestDate}</td>
                          <td className="p-3.5 whitespace-nowrap font-bold text-blue-600">{log.plate}</td>
                          <td className="p-3.5 max-w-xs">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{log.requester}</div>
                            <div className="text-[11px] text-slate-400">{log.destination}</div>
                          </td>
                          <td className="p-3.5 text-center font-mono whitespace-nowrap">
                            {log.startKm.toLocaleString()} - {log.endKm.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                            {log.totalKm}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{log.fuelCost.toLocaleString()} ฿</div>
                            <div className="text-[10px] text-slate-400 font-mono">{log.fuelVoucherNo} ({log.fuelLiters} ลิตร)</div>
                          </td>
                          <td className="p-3.5 text-center text-slate-500 whitespace-nowrap">{log.approvedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Projects */}
          {subTab === 'projects' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    แผนพัฒนาท้องถิ่นและโครงการตามข้อบัญญัติของสำนักปลัด
                  </h3>
                  <p className="text-xs text-slate-500">
                    ติดตามการขับเคลื่อนโครงการตามยุทธศาสตร์ขององค์กรปกครองส่วนท้องถิ่น
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {officeData.developmentProjects.map((proj) => (
                  <div key={proj.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-2 py-0.5 rounded">
                      {proj.code}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                      {proj.projectName}
                    </h4>
                    <div className="flex justify-between items-center text-slate-500 pt-1">
                      <span>งบประมาณ:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {proj.budget.toLocaleString()} ฿
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>ความคืบหน้า</span>
                        <span className="font-bold">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">ผู้รับผิดชอบ: {proj.responsiblePerson}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: Saraban */}
          {subTab === 'saraban' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ระบบสารบรรณอิเล็กทรอนิกส์ (E-Document Register)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ทะเบียนรับ-ส่งหนังสือราชการ คำสั่งการ และระเบียบปฏิบัติ
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3.5">ประเภท</th>
                      <th className="p-3.5">เลขที่หนังสือ</th>
                      <th className="p-3.5">ลงวันที่</th>
                      <th className="p-3.5">จาก / ถึง</th>
                      <th className="p-3.5">เรื่อง</th>
                      <th className="p-3.5">ผู้รับปฏิบัติ</th>
                      <th className="p-3.5 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {officeData.sarabanBooks.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.type === 'inward' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {b.type === 'inward' ? 'หนังสือรับ' : 'หนังสือส่ง'}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{b.bookNo}</td>
                        <td className="p-3.5 whitespace-nowrap">{b.bookDate}</td>
                        <td className="p-3.5 font-medium whitespace-nowrap">{b.from || b.to}</td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100 max-w-sm">{b.subject}</td>
                        <td className="p-3.5 whitespace-nowrap">{b.assignedTo}</td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {b.status === 'completed' ? 'ดำเนินการแล้ว' : 'อยู่ระหว่างเสนอ'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab: Complaints */}
          {subTab === 'complaints' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ศูนย์รับเรื่องร้องเรียนร้องทุกข์ & งานนิติการ
                  </h3>
                  <p className="text-xs text-slate-500">
                    บันทึกเรื่องร้องทุกข์และติดตามการตรวจสอบข้อเท็จจริง
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {officeData.complaints.map((c) => (
                  <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{c.issue}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status === 'resolved' ? 'ยุติเรื่องแล้ว' : 'อยู่ระหว่างตรวจสอบ'}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      ผู้ร้อง: {c.complainant} • ช่องทาง: {c.channel} • วันที่รับ: {c.receivedDate}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">ผลการดำเนินการ: </span>
                      <p className="text-slate-600 dark:text-slate-400">{c.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: CAPA Response for สำนักปลัด */}
          {subTab === 'capa' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ข้อทักท้วงและข้อสังเกตที่ต้องปรับปรุงแก้ไข (สำนักปลัด)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ติดตามการแก้ไขและจัดทำรายงานผลตอบข้อทักท้วงภายในกรอบเวลา 60 วัน
                  </p>
                </div>
              </div>

              {deptCapaFindings.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 text-slate-500">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="text-sm font-bold">ไม่พบข้อทักท้วงค้างการแก้ไขของสำนักปลัด</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {deptCapaFindings.map((f) => (
                    <div key={f.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{f.title}</span>
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800">{f.id}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{f.condition}</p>
                      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                        <span className="font-bold text-blue-950 dark:text-blue-200">การแก้ไข (CA): </span>
                        <span>{f.correctiveAction || 'อยู่ระหว่างจัดทำรายงานแก้ไข'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          WORKSPACE CONTENT: 2. กองคลัง
      ========================================================================= */}
      {activeDept === 'กองคลัง' && (
        <div className="space-y-6">
          {/* SubTab: Overview */}
          {subTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">สัญญาจัดซื้อจัดจ้าง</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{financeData.contracts.length} สัญญา</div>
                  <div className="text-[11px] text-blue-600 font-bold">มูลค่ารวม {financeData.contracts.reduce((a,c)=>a+c.contractPrice,0).toLocaleString()} ฿</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">ลูกหนี้เงินยืมทดรองราชการ</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{financeData.loans.length} ราย</div>
                  <div className="text-[11px] text-rose-600 font-bold">ค้างเกิน 30 วัน {financeData.loans.filter(l=>l.status==='overdue').length} ราย</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">ตรวจสอบพัสดุ ว 184</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{financeData.inventoryCheck.length} รายการ</div>
                  <div className="text-[11px] text-emerald-600 font-bold">ตรวจนับแล้วเสร็จ 100%</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">ข้อทักท้วง สตง. ของกองคลัง</div>
                  <div className="text-2xl font-black text-amber-600">{deptCapaFindings.length} ประเด็น</div>
                  <div className="text-[11px] text-slate-400">อยู่ระหว่างส่งหลักฐาน</div>
                </div>
              </div>

              {/* Action Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/70 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <span>เครื่องมือคำนวณค่าปรับจัดซื้อจัดจ้างส่งมอบงานล่าช้า</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    คำนวณอัตโนมัติตาม พ.ร.บ. จัดซื้อจัดจ้างฯ 2560 ม. 175 และระเบียบฯ ข้อ 175-182 เพื่อความถูกต้องก่อนหักเงินจ่ายฎีกา
                  </p>
                  <button
                    onClick={() => setSubTab('penalty')}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>เปิดเครื่องคิดค่าปรับ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-blue-50/70 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-200 font-bold text-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>ระบบเตือนลูกหนี้เงินยืมทดรองราชการ (30 วัน)</span>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    แจ้งเตือนและทวงถามสัญญายืมเงินเพื่อป้องกันไม่ให้ค้างส่งใช้เกิน 30 วันตามระเบียบ มท. รับจ่ายเงินฯ 2566
                  </p>
                  <button
                    onClick={() => setSubTab('loans')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>ตรวจสมุดคุมลูกหนี้</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Procurement Contracts */}
          {subTab === 'contracts' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ทะเบียนคุมสัญญาและการจัดซื้อจัดจ้าง (พ.ร.บ. พัสดุฯ 2560)
                  </h3>
                  <p className="text-xs text-slate-500">
                    บันทึกข้อมูลสัญญา วงเงิน วันครบกำหนดส่งมอบ และหลักประกันสัญญา
                  </p>
                </div>
                <button
                  onClick={() => setShowAddContractModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>บันทึกสัญญาใหม่</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3.5">เลขที่สัญญา</th>
                      <th className="p-3.5">ชื่อโครงการ / รายการพัสดุ</th>
                      <th className="p-3.5">วิธีจัดซื้อจัดจ้าง</th>
                      <th className="p-3.5">คู่สัญญา / ผู้รับจ้าง</th>
                      <th className="p-3.5 text-right">วงเงินสัญญา (บาท)</th>
                      <th className="p-3.5">วันสิ้นสุดสัญญา</th>
                      <th className="p-3.5">หลักประกันสัญญา</th>
                      <th className="p-3.5 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {financeData.contracts.map((cn) => (
                      <tr key={cn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{cn.contractNo}</td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100 max-w-xs">{cn.title}</td>
                        <td className="p-3.5 text-[11px] text-slate-500 whitespace-nowrap">{cn.method}</td>
                        <td className="p-3.5 whitespace-nowrap">{cn.contractor}</td>
                        <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {cn.contractPrice.toLocaleString()} ฿
                        </td>
                        <td className="p-3.5 whitespace-nowrap font-medium">{cn.dueDate}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div>{cn.guaranteeType}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{cn.guaranteeAmount?.toLocaleString()} ฿</div>
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cn.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {cn.status === 'completed' ? 'ส่งมอบแล้ว' : 'อยู่ระหว่างสัญญา'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab: Penalty Calculator (เครื่องมือคิดค่าปรับ) */}
          {subTab === 'penalty' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs mb-1">
                    <Calculator className="w-4 h-4" />
                    <span>พ.ร.บ. การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560 ม. 175</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    เครื่องมือคำนวณค่าปรับการส่งมอบพัสดุ/งานจ้างล่าช้า
                  </h3>
                  <p className="text-xs text-slate-500">
                    คำนวณค่าปรับรายวันและยอดค่าปรับรวมที่ต้องหักออกจากฎีกาเบิกจ่ายเงินงวดสุดท้าย
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="no-print bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer self-start"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์ใบคิดค่าปรับ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">วงเงินตามสัญญาจ้าง (บาท)</label>
                    <input
                      type="number"
                      value={penaltyContractPrice}
                      onChange={(e) => setPenaltyContractPrice(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">อัตราค่าปรับต่อวัน</label>
                    <select
                      value={penaltyRate}
                      onChange={(e) => setPenaltyRate(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer"
                    >
                      <option value="0.001">ร้อยละ 0.1 ต่อวัน (ซื้อ/จ้างทั่วไป ไม่กระทบจราจร)</option>
                      <option value="0.002">ร้อยละ 0.2 ต่อวัน (ซื้อ/จ้างทั่วไป ที่ต้องการความเร่งด่วน)</option>
                      <option value="0.0001">ร้อยละ 0.01 ต่อวัน (งานจ้างก่อสร้างสาธารณูปโภคขั้นต่ำ)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">วันครบกำหนดตามสัญญา</label>
                      <input
                        type="date"
                        value={penaltyDueDate}
                        onChange={(e) => setPenaltyDueDate(e.target.value)}
                        className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">วันส่งมอบงานจริง</label>
                      <input
                        type="date"
                        value={penaltyDeliveryDate}
                        onChange={(e) => setPenaltyDeliveryDate(e.target.value)}
                        className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none font-bold text-rose-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      วันหยุดราชการหรือมติ ครม. ที่ได้รับยกเว้น (วัน)
                    </label>
                    <input
                      type="number"
                      value={penaltyDeductHolidays}
                      onChange={(e) => setPenaltyDeductHolidays(e.target.value)}
                      placeholder="0"
                      className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                {/* Calculation Result */}
                <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-900 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                      สรุปผลการคิดค่าปรับตามระเบียบ
                    </div>
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-amber-200/60 dark:border-amber-900">
                        <span className="text-slate-600 dark:text-slate-400">จำนวนวันที่ส่งมอบล่าช้า:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{penaltyCalculation.days} วัน</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-amber-200/60 dark:border-amber-900">
                        <span className="text-slate-600 dark:text-slate-400">อัตราค่าปรับต่อวัน:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {penaltyCalculation.dailyPenalty.toLocaleString()} บาท/วัน
                        </span>
                      </div>
                      <div className="flex justify-between py-2 items-baseline">
                        <span className="font-bold text-amber-950 dark:text-amber-200 text-sm">ยอดเงินค่าปรับรวมทั้งสิ้น:</span>
                        <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                          {penaltyCalculation.totalPenalty.toLocaleString()} ฿
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-800 dark:text-slate-200">ข้อควรระวังสำหรับผู้ตรวจ: </span>
                    กรณีสัญญาจ้างก่อสร้างหากมีค่าปรับเกินร้อยละ 10 ของวงเงินสัญญา อปท. ต้องพิจารณาบอกเลิกสัญญา เว้นแต่ผู้รับจ้างยินยอมเสียค่าปรับโดยไม่มีเงื่อนไข
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Loans 30-Day Tracker */}
          {subTab === 'loans' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ทะเบียนคุมลูกหนี้เงินยืมทดรองราชการ (30-Day Advance Loans)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ติดตามการส่งใช้ใบสำคัญและคืนเงินเหลือจ่ายภายใน 30 วันตามระเบียบ มท. รับจ่ายเงินฯ 2566
                  </p>
                </div>
                <button
                  onClick={() => setShowAddLoanModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>บันทึกสัญญายืมเงิน</span>
                </button>
              </div>

              <div className="space-y-3">
                {financeData.loans.map((loan) => (
                  <div key={loan.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{loan.contractNo}</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{loan.borrower}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        loan.status === 'cleared'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800 animate-pulse'
                      }`}>
                        {loan.status === 'cleared' ? 'ส่งใช้ครบถ้วนแล้ว' : 'ค้างส่งใช้เกิน 30 วัน'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{loan.purpose}</p>
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                      <span>ยืมเมื่อ: {loan.borrowDate} • ครบ 30 วัน: <strong className="text-slate-800 dark:text-slate-200">{loan.dueDate}</strong></span>
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                        วงเงินยืม: {loan.amount.toLocaleString()} ฿
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: Annual Inventory Audit (ว 184) */}
          {subTab === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    การตรวจสอบพัสดุประจำปี (หนังสือสั่งการ ว 184)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ตรวจนับครุภัณฑ์คงเหลือ ตรวจสอบสภาพการใช้งาน และรายงานผลจำหน่ายพัสดุชำรุด
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {financeData.inventoryCheck.map((inv) => (
                  <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {inv.assetCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.condition === 'good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.condition === 'good' ? 'สภาพดี' : 'เสื่อมสภาพ'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">{inv.assetName}</h4>
                    <div className="text-[11px] text-slate-500">ราคาทุน: {inv.costPrice.toLocaleString()} ฿</div>
                    <p className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      ความเห็นกรรมการ: {inv.committeeOpinion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: CAPA Response for กองคลัง */}
          {subTab === 'capa' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ข้อทักท้วงและข้อสังเกตของกองคลัง (CAPA Response)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ประเด็นจาก สตง. และผู้ตรวจสอบภายในที่กองคลังต้องรายงานผลการแก้ไข
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {deptCapaFindings.map((f) => (
                  <div key={f.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{f.title}</span>
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800">{f.id}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{f.condition}</p>
                    <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                      <span className="font-bold text-blue-950 dark:text-blue-200">การแก้ไข (CA): </span>
                      <span>{f.correctiveAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          WORKSPACE CONTENT: 3. กองช่าง
      ========================================================================= */}
      {activeDept === 'กองช่าง' && (
        <div className="space-y-6">
          {/* SubTab: Overview */}
          {subTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">โครงการก่อสร้างตามข้อบัญญัติ</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{techData.constructionProjects.length} โครงการ</div>
                  <div className="text-[11px] text-blue-600 font-bold">งบประมาณ {techData.constructionProjects.reduce((a,c)=>a+c.budget,0).toLocaleString()} ฿</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">คำขออนุญาตก่อสร้าง 45 วัน</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{techData.buildingPermits.length} รายการ</div>
                  <div className="text-[11px] text-emerald-600 font-bold">ออกใบอนุญาต (อ.1) แล้ว</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">เครื่องจักรกล & ยานพาหนะ</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{techData.machinery.length} คัน</div>
                  <div className="text-[11px] text-purple-600 font-bold">พร้อมปฏิบัติการภาคสนาม</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">ข้อทักท้วง สตง. ของกองช่าง</div>
                  <div className="text-2xl font-black text-rose-600">{deptCapaFindings.length} ประเด็น</div>
                  <div className="text-[11px] text-slate-400">ค่าปรับ / คุมงาน</div>
                </div>
              </div>

              {/* Action Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/70 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-200 font-bold text-sm">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <span>คำนวณราคากลางงานก่อสร้าง & Factor F</span>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    คำนวณตาราง Factor F ตามหลักเกณฑ์กรมบัญชีกลาง เพื่อจัดทำแบบ ปร.4, ปร.5 และตารางเปิดเผยราคากลาง บก.01
                  </p>
                  <button
                    onClick={() => setSubTab('estimator')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>เปิดระบบคำนวณราคากลาง</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
                    <HardHat className="w-4 h-4 text-emerald-600" />
                    <span>ทะเบียนคุมโครงการก่อสร้าง & ผล Cylinder Test</span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    บันทึกผู้ควบคุมงาน คณะกรรมการตรวจรับ และผลการทดสอบแรงอัดคอนกรีต 28 วัน
                  </p>
                  <button
                    onClick={() => setSubTab('projects')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>ดูทะเบียนคุมงานก่อสร้าง</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Factor F Estimator */}
          {subTab === 'estimator' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs mb-1">
                    <Calculator className="w-4 h-4" />
                    <span>หลักเกณฑ์การคำนวณราคากลางงานก่อสร้างของราชการ (กรมบัญชีกลาง)</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    เครื่องมือคำนวณราคากลาง Factor F & แบบ ปร.5
                  </h3>
                  <p className="text-xs text-slate-500">
                    คำนวณตัวคูณ Factor F จากค่างานต้นทุน ดอกเบี้ย และภาษีมูลค่าเพิ่ม 7%
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="no-print bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer self-start"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์แบบ ปร.5</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">ประเภทงานก่อสร้าง</label>
                    <select
                      value={factorFWorkType}
                      onChange={(e) => setFactorFWorkType(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer"
                    >
                      <option value="road">งานทาง (ถนน ค.ส.ล. / ถนนลาดยาง / ลูกรัง)</option>
                      <option value="building">งานอาคาร (อาคารสำนักงาน / โรงเรียน / ศพด.)</option>
                      <option value="bridge">งานสะพานและท่อเหลี่ยม</option>
                      <option value="irrigation">งานชลประทาน (คูคลอง / ฝายน้ำล้น)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">ค่างานต้นทุนรวม (Direct Cost - บาท)</label>
                    <input
                      type="number"
                      value={factorFDirectCost}
                      onChange={(e) => setFactorFDirectCost(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-sm outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">เงินล่วงหน้าจ่าย</label>
                      <select
                        value={factorFAdvance}
                        onChange={(e) => setFactorFAdvance(e.target.value)}
                        className="w-full mt-1.5 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold outline-none"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">เงินประกันหัก</label>
                      <select
                        value={factorFRetention}
                        onChange={(e) => setFactorFRetention(e.target.value)}
                        className="w-full mt-1.5 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold outline-none"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">อัตราดอกเบี้ย</label>
                      <select
                        value={factorFInterest}
                        onChange={(e) => setFactorFInterest(e.target.value)}
                        className="w-full mt-1.5 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold outline-none"
                      >
                        <option value="5">5%</option>
                        <option value="6">6%</option>
                        <option value="7">7%</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Result Card */}
                <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-900 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                      ผลการคำนวณราคากลางตามแบบ ปร.5
                    </div>
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-blue-200/60 dark:border-blue-900">
                        <span className="text-slate-600 dark:text-slate-400">ค่างานต้นทุน:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {Number(factorFDirectCost || 0).toLocaleString()} บาท
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-blue-200/60 dark:border-blue-900">
                        <span className="text-slate-600 dark:text-slate-400">ค่า Factor F ที่คำนวณได้:</span>
                        <span className="font-mono font-black text-blue-700 dark:text-blue-300 text-base">
                          {factorFCalculation.factorF.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 items-baseline">
                        <span className="font-bold text-blue-950 dark:text-blue-200 text-sm">ราคากลางรวม (บาท):</span>
                        <span className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono">
                          {factorFCalculation.estimatedPrice.toLocaleString()} ฿
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">เกณฑ์การเปิดเผยราคากลาง: </span>
                    โครงการที่มีวงเงินเกิน 500,000 บาท ต้องจัดทำตารางเปิดเผยราคากลาง (แบบ บก.01) ประกาศบนเว็บไซต์ อปท. และระบบ e-GP
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Construction Projects Logbook */}
          {subTab === 'projects' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ทะเบียนคุมโครงการก่อสร้างตามข้อบัญญัติ (Construction Project Logbook)
                  </h3>
                  <p className="text-xs text-slate-500">
                    บันทึกข้อมูลงานช่าง การคุมงาน และการตรวจรับพัสดุ
                  </p>
                </div>
                <button
                  onClick={() => setShowAddConstProjectModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>บันทึกโครงการก่อสร้างใหม่</span>
                </button>
              </div>

              <div className="space-y-3">
                {techData.constructionProjects.map((p) => (
                  <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded">
                          {p.code}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{p.projectName}</h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] self-start sm:self-center ${
                        p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {p.status === 'completed' ? 'ก่อสร้างแล้วเสร็จ 100%' : `กำลังก่อสร้าง (${p.progress}%)`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-500 text-[11px] pt-1">
                      <div>สถานที่: <strong className="text-slate-700 dark:text-slate-300">{p.location}</strong></div>
                      <div>ผู้รับจ้าง: <strong className="text-slate-700 dark:text-slate-300">{p.contractor}</strong></div>
                      <div>วงเงินสัญญา: <strong className="font-mono text-slate-900 dark:text-slate-100 text-xs">{p.contractPrice.toLocaleString()} ฿</strong></div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>นายช่างผู้ควบคุมงาน: <span className="font-bold text-slate-800 dark:text-slate-200">{p.engineerSupervisor}</span></div>
                      <div>ผลทดสอบคอนกรีต 28 วัน: <span className="font-bold text-blue-600">{p.cylinderTest28Days}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: Building Permits */}
          {subTab === 'permits' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ทะเบียนคุมการขออนุญาตก่อสร้าง ดัดแปลง รื้อถอนอาคาร (พ.ร.บ. ควบคุมอาคาร 2522)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ตรวจแบบแปลนและพิจารณาออกใบอนุญาต (แบบ อ.1) ภายในกรอบเวลา 45 วัน
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPermitModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>บันทึกคำขออนุญาต</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {techData.buildingPermits.map((pm) => (
                  <div key={pm.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{pm.requestNo}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pm.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pm.status === 'approved' ? 'ออกใบอนุญาตแล้ว' : 'อยู่ระหว่างตรวจแบบ'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{pm.applicant}</div>
                    <div className="text-slate-500 text-[11px]">{pm.buildingType} (พื้นที่ {pm.areaSqM} ตร.ม.)</div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px]">
                      <span>ยื่นคำขอ: {pm.submissionDate}</span>
                      <span>ครบ 45 วัน: <strong>{pm.deadline45Days}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: Machinery */}
          {subTab === 'machinery' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ทะเบียนคุมเครื่องจักรกลและยานพาหนะกองช่าง
                  </h3>
                  <p className="text-xs text-slate-500">
                    ติดตามชั่วโมงการทำงานและการบำรุงรักษาเครื่องจักรกลงานก่อสร้าง
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {techData.machinery.map((m) => (
                  <div key={m.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{m.code}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">พร้อมใช้งาน</span>
                    </div>
                    <div className="text-slate-500">ทะเบียน: {m.plate} • คนขับ: {m.driver}</div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px]">
                      <span>ชั่วโมงสะสม: <strong>{m.operatingHours.toLocaleString()} ชม.</strong></span>
                      <span>ซ่อมบำรุงล่าสุด: {m.lastMaintenance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: CAPA Response for กองช่าง */}
          {subTab === 'capa' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ข้อทักท้วงและข้อสังเกตของกองช่าง (CAPA Response)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ติดตามการแก้ไขงานก่อสร้าง การคิดค่าปรับ และเอกสารหลักฐานส่งผู้ตรวจสอบภายใน
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {deptCapaFindings.map((f) => (
                  <div key={f.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{f.title}</span>
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800">{f.id}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{f.condition}</p>
                    <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                      <span className="font-bold text-blue-950 dark:text-blue-200">การแก้ไข (CA): </span>
                      <span>{f.correctiveAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODALS: 1. ADD VEHICLE LOG (สำนักปลัด)
      ========================================================================= */}
      {showAddOfficeLogModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              บันทึกการขอใช้รถยนต์ส่วนกลาง
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const start = Number(newVehicleLog.startKm) || 0;
                const end = Number(newVehicleLog.endKm) || 0;
                const newLog = {
                  ...newVehicleLog,
                  id: `VLOG-${Date.now().toString().slice(-4)}`,
                  startKm: start,
                  endKm: end,
                  totalKm: Math.max(0, end - start),
                  fuelLiters: Number(newVehicleLog.fuelLiters) || 0,
                  fuelCost: Number(newVehicleLog.fuelCost) || 0,
                  approvedBy: 'หัวหน้าสำนักปลัด',
                  status: 'approved'
                };
                setOfficeData({
                  ...officeData,
                  vehicleLogs: [newLog, ...officeData.vehicleLogs]
                });
                setShowAddOfficeLogModal(false);
                showToast('บันทึกการใช้รถยนต์เรียบร้อยแล้ว');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ทะเบียนรถ</label>
                <select
                  value={newVehicleLog.plate}
                  onChange={(e) => setNewVehicleLog({ ...newVehicleLog, plate: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  {officeData.vehicles.map((v) => (
                    <option key={v.id} value={v.plate}>{v.plate} ({v.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ผู้ขอใช้รถ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น หัวหน้าฝ่ายบริหารงานทั่วไป"
                  value={newVehicleLog.requester}
                  onChange={(e) => setNewVehicleLog({ ...newVehicleLog, requester: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">วัตถุประสงค์และสถานที่ไป</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ที่ว่าการอำเภอสิรินธร ประชุมหัวหน้าส่วนราชการ"
                  value={newVehicleLog.destination}
                  onChange={(e) => setNewVehicleLog({ ...newVehicleLog, destination: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">เลขไมล์ก่อนออก</label>
                  <input
                    type="number"
                    required
                    value={newVehicleLog.startKm}
                    onChange={(e) => setNewVehicleLog({ ...newVehicleLog, startKm: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">เลขไมล์กลับ</label>
                  <input
                    type="number"
                    required
                    value={newVehicleLog.endKm}
                    onChange={(e) => setNewVehicleLog({ ...newVehicleLog, endKm: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ใบสั่งจ่ายน้ำมัน (เลขที่)</label>
                  <input
                    type="text"
                    placeholder="VOUCH-69-..."
                    value={newVehicleLog.fuelVoucherNo}
                    onChange={(e) => setNewVehicleLog({ ...newVehicleLog, fuelVoucherNo: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ค่าน้ำมัน (บาท)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newVehicleLog.fuelCost}
                    onChange={(e) => setNewVehicleLog({ ...newVehicleLog, fuelCost: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddOfficeLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALS: 2. ADD CONTRACT (กองคลัง) */}
      {showAddContractModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              บันทึกสัญญาจัดซื้อจัดจ้างใหม่
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newCn = {
                  ...newContract,
                  id: `CN-69-0${financeData.contracts.length + 1}`,
                  contractPrice: Number(newContract.contractPrice) || 0,
                  guaranteeAmount: Number(newContract.guaranteeAmount) || 0,
                  status: 'active'
                };
                setFinanceData({
                  ...financeData,
                  contracts: [newCn, ...financeData.contracts]
                });
                setShowAddContractModal(false);
                showToast('บันทึกสัญญาจัดซื้อจัดจ้างแล้ว');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">เลขที่สัญญา</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สัญญาเลขที่ 15/2569"
                  value={newContract.contractNo}
                  onChange={(e) => setNewContract({ ...newContract, contractNo: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อโครงการ / รายการพัสดุ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น โครงการจัดซื้อกล้องวงจรปิด..."
                  value={newContract.title}
                  onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">วงเงินสัญญา (บาท)</label>
                  <input
                    type="number"
                    required
                    value={newContract.contractPrice}
                    onChange={(e) => setNewContract({ ...newContract, contractPrice: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">คู่สัญญา / ผู้รับจ้าง</label>
                  <input
                    type="text"
                    required
                    value={newContract.contractor}
                    onChange={(e) => setNewContract({ ...newContract, contractor: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">วันสิ้นสุดสัญญา</label>
                  <input
                    type="date"
                    required
                    value={newContract.dueDate}
                    onChange={(e) => setNewContract({ ...newContract, dueDate: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">หลักประกัน 5% (บาท)</label>
                  <input
                    type="number"
                    value={newContract.guaranteeAmount}
                    onChange={(e) => setNewContract({ ...newContract, guaranteeAmount: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddContractModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  บันทึกสัญญา
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALS: 3. ADD CONSTRUCTION PROJECT (กองช่าง) */}
      {showAddConstProjectModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              บันทึกโครงการก่อสร้างใหม่
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newP = {
                  ...newConstProject,
                  id: `PRJ-CONST-0${techData.constructionProjects.length + 1}`,
                  code: 'โครงการตามข้อบัญญัติ 2569',
                  budget: Number(newConstProject.budget) || 0,
                  contractPrice: Number(newConstProject.contractPrice) || 0,
                  cylinderTest28Days: '-',
                  progress: 0,
                  status: 'in_progress'
                };
                setTechData({
                  ...techData,
                  constructionProjects: [newP, ...techData.constructionProjects]
                });
                setShowAddConstProjectModal(false);
                showToast('บันทึกโครงการก่อสร้างเรียบร้อยแล้ว');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อโครงการก่อสร้าง</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น โครงการก่อสร้างถนน ค.ส.ล. สาย..."
                  value={newConstProject.projectName}
                  onChange={(e) => setNewConstProject({ ...newConstProject, projectName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">สถานที่ก่อสร้าง</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น หมู่ที่ 3 ตำบลฝางคำ"
                  value={newConstProject.location}
                  onChange={(e) => setNewConstProject({ ...newConstProject, location: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">งบประมาณ (บาท)</label>
                  <input
                    type="number"
                    required
                    value={newConstProject.budget}
                    onChange={(e) => setNewConstProject({ ...newConstProject, budget: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">วงเงินสัญญา (บาท)</label>
                  <input
                    type="number"
                    required
                    value={newConstProject.contractPrice}
                    onChange={(e) => setNewConstProject({ ...newConstProject, contractPrice: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ผู้รับจ้าง</label>
                <input
                  type="text"
                  required
                  value={newConstProject.contractor}
                  onChange={(e) => setNewConstProject({ ...newConstProject, contractor: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">นายช่างผู้ควบคุมงาน</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นายช่างโยธาปฏิบัติงาน"
                  value={newConstProject.engineerSupervisor}
                  onChange={(e) => setNewConstProject({ ...newConstProject, engineerSupervisor: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddConstProjectModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  บันทึกโครงการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        type={confirmModalConfig.type}
        onConfirm={confirmModalConfig.onConfirm}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
