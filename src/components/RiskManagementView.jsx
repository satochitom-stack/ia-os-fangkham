import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  TrendingDown,
  Activity,
  Printer,
  Building,
  Plus,
  Trash2,
  Pencil,
  BarChart3,
  Layers,
  FileText,
  Filter,
  ShieldCheck,
  Eye,
  Check,
  X
} from 'lucide-react';
import { getDepartments, getSession } from '../utils/auth';

export default function RiskManagementView({
  riskManagement,
  setRiskManagement,
  orgProfile,
  selectedYear = '2569',
  session
}) {
  const currentSession = session || getSession();
  const isAdmin =
    currentSession?.role === 'admin' ||
    currentSession?.department === 'หน่วยตรวจสอบภายใน' ||
    currentSession?.username === 'admin';
  const userDept = currentSession?.department || currentSession?.displayName || 'กองคลัง';

  // Navigation tabs
  const [activeTab, setActiveTab] = useState('bs1'); // 'bs1', 'bs2', 'bs3', 'bs4', 'bs5'
  
  // Department filter: Admin can switch between 'all' or specific department; regular department is locked to userDept
  const [filterDept, setFilterDept] = useState(isAdmin ? 'all' : userDept);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBs1, setEditingBs1] = useState(null);
  const [editingBs2, setEditingBs2] = useState(null);
  const [editingBs3, setEditingBs3] = useState(null);
  const [editingBs4, setEditingBs4] = useState(null);

  // New BS.1 form state
  const [newBs1, setNewBs1] = useState({
    department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
    objective: '',
    riskEvent: '',
    cause: '',
    riskCategory: 'ด้านการเงิน (F)'
  });

  const bs1List = riskManagement?.bs1 || [];
  const bs2List = riskManagement?.bs2 || [];
  const bs3List = riskManagement?.bs3 || [];
  const bs4List = riskManagement?.bs4 || [];
  const bs5Data = riskManagement?.bs5 || {};

  // Available departments (excluding internal audit itself as auditee)
  const departmentsList = getDepartments().filter((d) => d !== 'หน่วยตรวจสอบภายใน');

  // Determine effective department filter
  const effectiveDept = isAdmin ? filterDept : userDept;

  // Filtered lists based on permission and department scope
  const filteredBs1 = useMemo(() => {
    if (isAdmin && filterDept === 'all') return bs1List;
    return bs1List.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs1List, isAdmin, filterDept, effectiveDept]);

  const filteredBs2 = useMemo(() => {
    if (isAdmin && filterDept === 'all') return bs2List;
    return bs2List.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs2List, isAdmin, filterDept, effectiveDept]);

  const filteredBs3 = useMemo(() => {
    if (isAdmin && filterDept === 'all') return bs3List;
    return bs3List.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs3List, isAdmin, filterDept, effectiveDept]);

  const filteredBs4 = useMemo(() => {
    if (isAdmin && filterDept === 'all') return bs4List;
    return bs4List.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs4List, isAdmin, filterDept, effectiveDept]);

  // Check if current user can edit a specific item
  const canEditItem = (itemDept) => {
    if (isAdmin) return true;
    return (itemDept || '').trim() === userDept.trim();
  };

  // Recalculate risk level from likelihood & impact (Matrix 5x5)
  const computeRiskLevel = (score) => {
    if (score >= 15) return 'สูงมาก';
    if (score >= 10) return 'สูง';
    if (score >= 5) return 'ปานกลาง';
    return 'ต่ำ';
  };

  // Add BS.1
  const handleAddBs1 = (e) => {
    e.preventDefault();
    if (!newBs1.riskEvent || !newBs1.objective) return;
    const targetDept = isAdmin ? newBs1.department : userDept;
    const newItemId = `BS1-${Date.now()}`;
    const item = {
      ...newBs1,
      department: targetDept,
      id: newItemId
    };

    if (setRiskManagement) {
      setRiskManagement((prev) => {
        // Also auto-seed corresponding BS.2, BS.3, BS.4 templates for smooth ERM workflow
        const newBs2Item = {
          id: `BS2-${Date.now()}`,
          department: targetDept,
          riskEvent: item.riskEvent,
          likelihood: 3,
          impact: 3,
          riskScore: 9,
          riskLevel: 'ปานกลาง'
        };

        const newBs3Item = {
          id: `BS3-${Date.now()}`,
          department: targetDept,
          riskEvent: item.riskEvent,
          riskLevel: 'ปานกลาง',
          riskResponse: 'ควบคุมความเสี่ยง (Control)',
          measures: `กำหนดมาตรการควบคุมภายในและการกำกับดูแลสำหรับ ${targetDept}`,
          responsiblePerson: `ผู้อำนวยการ${targetDept} / เจ้าหน้าที่ผู้รับผิดชอบ`,
          timeline: 'ตลอดปีงบประมาณ'
        };

        const newBs4Item = {
          id: `BS4-${Date.now()}`,
          department: targetDept,
          riskEvent: item.riskEvent,
          progress: 'อยู่ระหว่างดำเนินการ',
          progressDetail: 'เริ่มปฏิบัติตามมาตรการควบคุมที่กำหนดไว้',
          currentRiskLevel: 'ปานกลาง'
        };

        return {
          ...prev,
          bs1: [...(prev?.bs1 || []), item],
          bs2: [...(prev?.bs2 || []), newBs2Item],
          bs3: [...(prev?.bs3 || []), newBs3Item],
          bs4: [...(prev?.bs4 || []), newBs4Item]
        };
      });
    }

    setNewBs1({
      department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
      objective: '',
      riskEvent: '',
      cause: '',
      riskCategory: 'ด้านการเงิน (F)'
    });
    setShowAddModal(false);
  };

  // Save Edit BS.1
  const handleSaveEditBs1 = (e) => {
    e.preventDefault();
    if (!editingBs1 || !editingBs1.riskEvent || !editingBs1.objective) return;

    const oldItem = bs1List.find((i) => i.id === editingBs1.id);
    const oldEventName = oldItem?.riskEvent;
    const finalDept = isAdmin ? editingBs1.department : oldItem?.department || userDept;

    if (setRiskManagement) {
      setRiskManagement((prev) => {
        const updatedBs1 = (prev?.bs1 || []).map((item) =>
          item.id === editingBs1.id
            ? { ...item, ...editingBs1, department: finalDept }
            : item
        );

        // Cascade department & riskEvent name updates to BS.2, BS.3, BS.4
        const updatedBs2 = (prev?.bs2 || []).map((item) => {
          if (item.id === editingBs1.id || (oldEventName && item.riskEvent === oldEventName)) {
            return { ...item, department: finalDept, riskEvent: editingBs1.riskEvent };
          }
          return item;
        });

        const updatedBs3 = (prev?.bs3 || []).map((item) => {
          if (item.id === editingBs1.id || (oldEventName && item.riskEvent === oldEventName)) {
            return { ...item, department: finalDept, riskEvent: editingBs1.riskEvent };
          }
          return item;
        });

        const updatedBs4 = (prev?.bs4 || []).map((item) => {
          if (item.id === editingBs1.id || (oldEventName && item.riskEvent === oldEventName)) {
            return { ...item, department: finalDept, riskEvent: editingBs1.riskEvent };
          }
          return item;
        });

        return {
          ...prev,
          bs1: updatedBs1,
          bs2: updatedBs2,
          bs3: updatedBs3,
          bs4: updatedBs4
        };
      });
    }
    setEditingBs1(null);
  };

  // Delete BS.1
  const handleDeleteBs1 = (id) => {
    if (!window.confirm('คุณต้องการลบรายการระบุความเสี่ยงนี้ใช่หรือไม่?')) return;
    const itemToDelete = bs1List.find((item, index) => item.id === id || index === id);
    const eventNameToDelete = itemToDelete?.riskEvent;

    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs1: (prev?.bs1 || []).filter((item, index) => item.id !== id && index !== id),
        bs2: (prev?.bs2 || []).filter((item) => item.id !== id && item.riskEvent !== eventNameToDelete),
        bs3: (prev?.bs3 || []).filter((item) => item.id !== id && item.riskEvent !== eventNameToDelete),
        bs4: (prev?.bs4 || []).filter((item) => item.id !== id && item.riskEvent !== eventNameToDelete)
      }));
    }
  };

  // Save Edit BS.2
  const handleSaveEditBs2 = (e) => {
    e.preventDefault();
    if (!editingBs2) return;
    const score = Number(editingBs2.likelihood) * Number(editingBs2.impact);
    const level = computeRiskLevel(score);

    if (setRiskManagement) {
      setRiskManagement((prev) => {
        const updatedBs2 = (prev?.bs2 || []).map((item) =>
          item.id === editingBs2.id
            ? { ...item, ...editingBs2, riskScore: score, riskLevel: level }
            : item
        );
        // Also sync updated riskLevel to BS.3 if found
        const updatedBs3 = (prev?.bs3 || []).map((item) =>
          item.id === editingBs2.id || item.riskEvent === editingBs2.riskEvent
            ? { ...item, riskLevel: level }
            : item
        );
        return { ...prev, bs2: updatedBs2, bs3: updatedBs3 };
      });
    }
    setEditingBs2(null);
  };

  // Save Edit BS.3
  const handleSaveEditBs3 = (e) => {
    e.preventDefault();
    if (!editingBs3) return;
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs3: (prev?.bs3 || []).map((item) =>
          item.id === editingBs3.id ? { ...item, ...editingBs3 } : item
        )
      }));
    }
    setEditingBs3(null);
  };

  // Save Edit BS.4
  const handleSaveEditBs4 = (e) => {
    e.preventDefault();
    if (!editingBs4) return;
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs4: (prev?.bs4 || []).map((item) =>
          item.id === editingBs4.id ? { ...item, ...editingBs4 } : item
        )
      }));
    }
    setEditingBs4(null);
  };

  const getRiskLevelBadge = (level) => {
    if (level === 'สูงมาก') {
      return 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700';
    }
    if (level === 'สูง') {
      return 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700';
    }
    if (level === 'ปานกลาง') {
      return 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700';
    }
    return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Enterprise Risk Management (ERM) • สถ./กค.</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            ระบบบริหารจัดการความเสี่ยง (Risk Management)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            การบริหารจัดการความเสี่ยงระดับองค์กรตามแบบ บส.1 ถึง แบบ บส.5 ประจำปีงบประมาณ พ.ศ. {selectedYear}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์เอกสาร บส.</span>
          </button>
        </div>
      </div>

      {/* 2. Role-Based Scope & Department Filter Bar */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900 p-4 rounded-2xl border border-blue-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isAdmin 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' 
              : 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
          }`}>
            {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Building className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                {isAdmin ? 'สิทธิ์หน่วยตรวจสอบภายใน (Admin)' : `สิทธิ์ส่วนราชการ: ${userDept}`}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAdmin 
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' 
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}>
                {isAdmin ? 'เห็นข้อมูลทุกกอง' : 'ดูและแก้ไขเฉพาะกองตนเอง'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isAdmin
                ? 'หน่วยตรวจสอบฯ สามารถดู แก้ไข และติดตามความเสี่ยงของทุกส่วนราชการใน อปท. ได้อย่างครบถ้วน'
                : `ท่านสามารถบันทึกและแก้ไขข้อมูลความเสี่ยงได้เฉพาะส่วนที่อยู่ในความรับผิดชอบของ ${userDept}`}
            </p>
          </div>
        </div>

        {/* Admin Department Filter Dropdown */}
        {isAdmin && (
          <div className="flex items-center space-x-2 shrink-0 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">มุมมองกอง:</span>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">🌐 แสดงทุกส่วนราชการ ({bs1List.length} รายการ)</option>
              {departmentsList.map((dept) => {
                const count = bs1List.filter((item) => item.department === dept).length;
                return (
                  <option key={dept} value={dept}>
                    🏢 {dept} ({count} รายการ)
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* 3. Tab Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('bs1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs1'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            แบบ บส.1: ระบุความเสี่ยง ({filteredBs1.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bs2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs2'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            แบบ บส.2: ประเมินความเสี่ยง ({filteredBs2.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bs3')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs3'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            แบบ บส.3: แผนจัดการความเสี่ยง ({filteredBs3.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bs4')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs4'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            แบบ บส.4: ติดตามผล ({filteredBs4.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bs5')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs5'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            แบบ บส.5: สรุปรายงานระดับองค์กร
          </button>
        </div>

        {activeTab === 'bs1' && setRiskManagement && (
          <button
            type="button"
            onClick={() => {
              setNewBs1({
                department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
                objective: '',
                riskEvent: '',
                cause: '',
                riskCategory: 'ด้านการเงิน (F)'
              });
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ระบุความเสี่ยงใหม่ (บส.1)</span>
          </button>
        )}
      </div>

      {/* 4. Tab BS 1: Risk Identification */}
      {activeTab === 'bs1' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>แบบ บส.1: การระบุความเสี่ยงและปัจจัยเสี่ยง (Risk Identification)</span>
                {!isAdmin && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {userDept}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                จำแนกความเสี่ยง 5 ด้าน: ยุทธศาสตร์ (S), การดำเนินงาน (O), การเงิน (F), กฎหมาย/ระเบียบ (C), สารสนเทศ (I)
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              รวม {filteredBs1.length} รายการ
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700/80">
                  <tr>
                    <th className="px-4 py-3.5 w-40">ส่วนราชการ</th>
                    <th className="px-4 py-3.5 w-56">วัตถุประสงค์ตามภารกิจ</th>
                    <th className="px-4 py-3.5">เหตุการณ์ความเสี่ยง (Risk Event)</th>
                    <th className="px-4 py-3.5">สาเหตุและปัจจัยเสี่ยง</th>
                    <th className="px-4 py-3.5 w-40 text-center">ประเภทความเสี่ยง</th>
                    {setRiskManagement && <th className="px-3 py-3.5 text-center w-24 no-print">จัดการ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBs1.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        {isAdmin && filterDept !== 'all'
                          ? `ไม่พบข้อมูลการระบุความเสี่ยงของ "${filterDept}"`
                          : !isAdmin
                          ? `ไม่พบข้อมูลการระบุความเสี่ยงของ "${userDept}" (คลิกปุ่ม "+ ระบุความเสี่ยงใหม่ (บส.1)" เพื่อเริ่มต้น)`
                          : 'ยังไม่มีข้อมูลการระบุความเสี่ยง (คลิกปุ่ม "+ ระบุความเสี่ยงใหม่ (บส.1)" เพื่อเริ่มต้น)'}
                      </td>
                    </tr>
                  ) : (
                    filteredBs1.map((item, idx) => {
                      const canManage = canEditItem(item.department);
                      return (
                        <tr key={item.id || idx} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 align-top">
                            <span className="inline-flex items-center space-x-1.5">
                              <Building className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>{item.department}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 align-top">
                            {item.objective}
                          </td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-bold align-top">
                            {item.riskEvent}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 align-top">
                            {item.cause}
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-block">
                              {item.riskCategory}
                            </span>
                          </td>
                          {setRiskManagement && (
                            <td className="px-3 py-3 text-center align-top no-print">
                              {canManage ? (
                                <div className="flex items-center justify-center space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingBs1(item)}
                                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="แก้ไขรายการ"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteBs1(item.id || idx)}
                                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="ลบรายการ"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 flex items-center justify-center space-x-1" title="ดูได้อย่างเดียว">
                                  <Eye className="w-3 h-3 text-slate-400" />
                                  <span>ดูเท่านั้น</span>
                                </span>
                              )}
                            </td>
                          )}
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

      {/* 5. Tab BS 2: Risk Assessment */}
      {activeTab === 'bs2' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>แบบ บส.2: การประเมินระดับความเสี่ยง (Risk Assessment Matrix 5x5)</span>
                {!isAdmin && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {userDept}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ระดับคะแนนความเสี่ยง = โอกาสเกิด (Likelihood: 1-5) x ผลกระทบ (Impact: 1-5)
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">1-4: ต่ำ</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">5-9: ปานกลาง</span>
              <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold">10-14: สูง</span>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold">15-25: สูงมาก</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700/80">
                  <tr>
                    <th className="px-4 py-3.5 w-40">ส่วนราชการ</th>
                    <th className="px-4 py-3.5">เหตุการณ์ความเสี่ยง (Risk Event)</th>
                    <th className="px-4 py-3.5 text-center w-28">โอกาสเกิด (L)</th>
                    <th className="px-4 py-3.5 text-center w-28">ผลกระทบ (I)</th>
                    <th className="px-4 py-3.5 text-center w-28">ระดับคะแนน</th>
                    <th className="px-4 py-3.5 text-center w-32">ระดับความเสี่ยง</th>
                    {setRiskManagement && <th className="px-3 py-3.5 text-center w-20 no-print">จัดการ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBs2.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        {isAdmin && filterDept !== 'all'
                          ? `ไม่พบข้อมูลการประเมินความเสี่ยงของ "${filterDept}"`
                          : `ไม่พบข้อมูลการประเมินความเสี่ยงของ "${userDept}"`}
                      </td>
                    </tr>
                  ) : (
                    filteredBs2.map((item, idx) => {
                      const canManage = canEditItem(item.department);
                      return (
                        <tr key={item.id || idx} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{item.department}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.riskEvent}</td>
                          <td className="px-4 py-3 text-center font-mono font-bold">{item.likelihood}/5</td>
                          <td className="px-4 py-3 text-center font-mono font-bold">{item.impact}/5</td>
                          <td className="px-4 py-3 text-center font-mono font-black text-slate-900 dark:text-slate-100">{item.riskScore}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-block ${getRiskLevelBadge(item.riskLevel)}`}>
                              {item.riskLevel}
                            </span>
                          </td>
                          {setRiskManagement && (
                            <td className="px-3 py-3 text-center no-print">
                              {canManage ? (
                                <button
                                  type="button"
                                  onClick={() => setEditingBs2(item)}
                                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="แก้ไขการประเมินความเสี่ยง"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">ดูเท่านั้น</span>
                              )}
                            </td>
                          )}
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

      {/* 6. Tab BS 3: Risk Response Plan */}
      {activeTab === 'bs3' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>แบบ บส.3: แผนบริหารจัดการความเสี่ยงและมาตรการควบคุม (Risk Response Plan)</span>
                {!isAdmin && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {userDept}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                กำหนดกลยุทธ์การจัดการ (หลีกเลี่ยง/ลด/ถ่ายโอน/ยอมรับ) มาตรการควบคุม ผู้รับผิดชอบ และกำหนดเวลา
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              รวม {filteredBs3.length} แผน
            </div>
          </div>

          <div className="space-y-3">
            {filteredBs3.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs">
                {isAdmin && filterDept !== 'all'
                  ? `ไม่พบแผนบริหารจัดการความเสี่ยงของ "${filterDept}"`
                  : `ไม่พบแผนบริหารจัดการความเสี่ยงของ "${userDept}"`}
              </div>
            ) : (
              filteredBs3.map((item, idx) => {
                const canManage = canEditItem(item.department);
                return (
                  <div
                    key={item.id || idx}
                    className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                        <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded text-xs font-mono font-bold border border-amber-300 dark:border-amber-800">
                          {item.department}
                        </span>
                        <span>ประเด็นความเสี่ยง: {item.riskEvent}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getRiskLevelBadge(item.riskLevel)}`}>
                          ระดับ: {item.riskLevel}
                        </span>
                        <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded text-[11px] font-bold border border-blue-200 dark:border-blue-800">
                          กลยุทธ์: {item.riskResponse}
                        </span>
                        {setRiskManagement && canManage && (
                          <button
                            type="button"
                            onClick={() => setEditingBs3(item)}
                            className="text-slate-400 hover:text-blue-600 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                            title="แก้ไขแผนจัดการความเสี่ยง"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200">มาตรการควบคุม / กิจกรรมจัดการความเสี่ยง:</div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.measures}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>ผู้รับผิดชอบดำเนินการ: <strong className="text-slate-700 dark:text-slate-300">{item.responsiblePerson}</strong></span>
                      <span>ระยะเวลาดำเนินงาน: <strong className="text-slate-700 dark:text-slate-300">{item.timeline}</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 7. Tab BS 4: Monitoring */}
      {activeTab === 'bs4' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>แบบ บส.4: รายงานการติดตามผลการบริหารจัดการความเสี่ยง (รอบ 6 เดือน)</span>
                {!isAdmin && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {userDept}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ติดตามความก้าวหน้าของการดำเนินมาตรการจัดการความเสี่ยง และระดับความเสี่ยงที่เปลี่ยนแปลง
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              รวม {filteredBs4.length} รายการ
            </div>
          </div>

          <div className="space-y-3">
            {filteredBs4.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs">
                {isAdmin && filterDept !== 'all'
                  ? `ไม่พบรายงานการติดตามผลของ "${filterDept}"`
                  : `ไม่พบรายงานการติดตามผลของ "${userDept}"`}
              </div>
            ) : (
              filteredBs4.map((item, idx) => {
                const canManage = canEditItem(item.department);
                return (
                  <div
                    key={item.id || idx}
                    className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-mono font-bold">
                          {item.department}
                        </span>
                        <span>ความเสี่ยง: {item.riskEvent}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                          สถานะ: {item.progress}
                        </span>
                        {setRiskManagement && canManage && (
                          <button
                            type="button"
                            onClick={() => setEditingBs4(item)}
                            className="text-slate-400 hover:text-blue-600 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                            title="แก้ไขรายงานติดตามผล"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-800 dark:text-slate-200">ผลการดำเนินงานจริง: </span>
                      {item.progressDetail}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <span>ระดับความเสี่ยงปัจจุบัน: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{item.currentRiskLevel}</strong></span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> อยู่ในเกณฑ์ที่ยอมรับได้
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 8. Tab BS 5: Final Evaluation Summary */}
      {activeTab === 'bs5' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-xs max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-6 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              แบบ บส.5: รายงานสรุปผลการประเมินการบริหารจัดการความเสี่ยงระดับองค์กร
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {orgProfile?.name} {orgProfile?.district} {orgProfile?.province}
            </p>
          </div>

          <div className="space-y-5 leading-relaxed">
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>สรุปภาพรวมการบริหารความเสี่ยงประจำปีงบประมาณ พ.ศ. {selectedYear}:</span>
                {!isAdmin && (
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                    {userDept}
                  </span>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300 indent-6 leading-relaxed">
                {bs5Data?.summary || 'ภาพรวมการบริหารจัดการความเสี่ยงระดับองค์กรของ อปท. มีการดำเนินงานตามแผนบริหารความเสี่ยงครบถ้วนทุกสำนัก/กอง โดยความเสี่ยงระดับสูงได้รับการควบคุมจนลดลงสู่ระดับที่ยอมรับได้'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {isAdmin && filterDept === 'all' ? bs1List.length : filteredBs1.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isAdmin && filterDept === 'all' ? 'ความเสี่ยงที่ระบุทั้งหมด' : `ความเสี่ยง (${effectiveDept})`}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {isAdmin && filterDept === 'all' ? bs3List.length : filteredBs3.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isAdmin && filterDept === 'all' ? 'แผนมาตรการควบคุม' : `แผนมาตรการ (${effectiveDept})`}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">100%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">ความสำเร็จในการติดตาม</div>
              </div>
            </div>

            <div className="pt-10 text-center space-y-3">
              <div className="text-slate-400 font-mono tracking-widest">(ลงชื่อ)........................................................................</div>
              <div>
                <div className="font-bold text-base text-slate-900 dark:text-slate-100">
                  ({orgProfile?.approverName || bs5Data?.approvedBy || 'นายกองค์การบริหารส่วนตำบลฝางคำ'})
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {orgProfile?.approverPosition || bs5Data?.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ'}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">
                  วันที่ {bs5Data?.reportDate || '30 กันยายน 2569'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Modal Add BS.1 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>ระบุความเสี่ยงใหม่ (แบบ บส.1)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBs1} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  สำนัก / กอง:
                </label>
                {isAdmin ? (
                  <select
                    value={newBs1.department}
                    onChange={(e) => setNewBs1({ ...newBs1, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    {departmentsList.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-bold flex items-center space-x-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>{userDept} (ระบบกำหนดสิทธิ์เฉพาะกองของคุณ)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  วัตถุประสงค์ตามภารกิจ:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การจัดเก็บรายได้ภาษีครบถ้วนตามเป้าหมาย"
                  value={newBs1.objective}
                  onChange={(e) => setNewBs1({ ...newBs1, objective: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เหตุการณ์ความเสี่ยง (Risk Event):
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ยอดจัดเก็บภาษีที่ดินตกหล่นหรือไม่ตรงกำหนด"
                  value={newBs1.riskEvent}
                  onChange={(e) => setNewBs1({ ...newBs1, riskEvent: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  สาเหตุและปัจจัยเสี่ยง:
                </label>
                <textarea
                  rows={2}
                  placeholder="ระบุสาเหตุภายในและภายนอก"
                  value={newBs1.cause}
                  onChange={(e) => setNewBs1({ ...newBs1, cause: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ประเภทความเสี่ยง:
                </label>
                <select
                  value={newBs1.riskCategory}
                  onChange={(e) => setNewBs1({ ...newBs1, riskCategory: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="ด้านยุทธศาสตร์ (S)">ด้านยุทธศาสตร์ (S)</option>
                  <option value="ด้านการดำเนินงาน (O)">ด้านการดำเนินงาน (O)</option>
                  <option value="ด้านการเงิน (F)">ด้านการเงิน (F)</option>
                  <option value="ด้านการปฏิบัติตามกฎระเบียบ (C)">ด้านการปฏิบัติตามกฎระเบียบ (C)</option>
                  <option value="ด้านสารสนเทศ (I)">ด้านสารสนเทศ (I)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  บันทึกแบบ บส.1
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Modal Edit BS.1 */}
      {editingBs1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขข้อมูลการระบุความเสี่ยง (แบบ บส.1)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs1(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs1} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ส่วนราชการ:
                </label>
                {isAdmin ? (
                  <select
                    value={editingBs1.department}
                    onChange={(e) => setEditingBs1({ ...editingBs1, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    {departmentsList.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-bold flex items-center space-x-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>{editingBs1.department}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  วัตถุประสงค์ตามภารกิจ:
                </label>
                <input
                  type="text"
                  required
                  value={editingBs1.objective || ''}
                  onChange={(e) => setEditingBs1({ ...editingBs1, objective: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เหตุการณ์ความเสี่ยง (Risk Event):
                </label>
                <input
                  type="text"
                  required
                  value={editingBs1.riskEvent || ''}
                  onChange={(e) => setEditingBs1({ ...editingBs1, riskEvent: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  สาเหตุและปัจจัยเสี่ยง:
                </label>
                <textarea
                  rows={3}
                  value={editingBs1.cause || ''}
                  onChange={(e) => setEditingBs1({ ...editingBs1, cause: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ประเภทความเสี่ยง:
                </label>
                <select
                  value={editingBs1.riskCategory || 'ด้านการเงิน (F)'}
                  onChange={(e) => setEditingBs1({ ...editingBs1, riskCategory: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="ด้านยุทธศาสตร์ (S)">ด้านยุทธศาสตร์ (S)</option>
                  <option value="ด้านการดำเนินงาน (O)">ด้านการดำเนินงาน (O)</option>
                  <option value="ด้านการเงิน (F)">ด้านการเงิน (F)</option>
                  <option value="ด้านการปฏิบัติตามกฎระเบียบ (C)">ด้านการปฏิบัติตามกฎระเบียบ (C)</option>
                  <option value="ด้านสารสนเทศ (I)">ด้านสารสนเทศ (I)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs1(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. Modal Edit BS.2 (Likelihood & Impact) */}
      {editingBs2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>ประเมินระดับความเสี่ยง (แบบ บส.2)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs2(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs2} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold">{editingBs2.department}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">{editingBs2.riskEvent}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  โอกาสเกิด (Likelihood: 1 - 5):
                </label>
                <select
                  value={editingBs2.likelihood}
                  onChange={(e) => setEditingBs2({ ...editingBs2, likelihood: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value={1}>1 - น้อยที่สุด (นานๆ เกิดที)</option>
                  <option value={2}>2 - น้อย (อาจเกิดบางครั้ง)</option>
                  <option value={3}>3 - ปานกลาง (เกิดขึ้นเป็นระยะ)</option>
                  <option value={4}>4 - สูง (เกิดขึ้นบ่อย)</option>
                  <option value={5}>5 - สูงมาก (เกิดขึ้นเป็นประจำ)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ผลกระทบ (Impact: 1 - 5):
                </label>
                <select
                  value={editingBs2.impact}
                  onChange={(e) => setEditingBs2({ ...editingBs2, impact: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value={1}>1 - เล็กน้อย (ไม่กระทบเป้าหมาย)</option>
                  <option value={2}>2 - น้อย (กระทบเล็กน้อย แก้ไขได้ทันที)</option>
                  <option value={3}>3 - ปานกลาง (กระทบต่อการปฏิบัติงานบางส่วน)</option>
                  <option value={4}>4 - รุนแรง (กระทบต่อภารกิจหลัก/เสียหายทางการเงิน)</option>
                  <option value={5}>5 - รุนแรงมาก (กระทบชื่อเสียงร้ายแรง/ผิดกฎหมาย)</option>
                </select>
              </div>

              {/* Matrix Calculated Preview */}
              <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">คะแนนรวม (L x I): </span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                    {Number(editingBs2.likelihood) * Number(editingBs2.impact)}
                  </span>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${getRiskLevelBadge(computeRiskLevel(Number(editingBs2.likelihood) * Number(editingBs2.impact)))}`}>
                    ระดับ: {computeRiskLevel(Number(editingBs2.likelihood) * Number(editingBs2.impact))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs2(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  บันทึกผลประเมิน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. Modal Edit BS.3 (Response Plan) */}
      {editingBs3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขแผนจัดการความเสี่ยง (แบบ บส.3)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs3(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs3} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold">{editingBs3.department}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">{editingBs3.riskEvent}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  กลยุทธ์การจัดการความเสี่ยง (Risk Response):
                </label>
                <select
                  value={editingBs3.riskResponse || 'ควบคุมความเสี่ยง (Control)'}
                  onChange={(e) => setEditingBs3({ ...editingBs3, riskResponse: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="ลดความเสี่ยง (Mitigate)">ลดความเสี่ยง (Mitigate)</option>
                  <option value="ควบคุมความเสี่ยง (Control)">ควบคุมความเสี่ยง (Control)</option>
                  <option value="ป้องกันความเสี่ยง (Prevent)">ป้องกันความเสี่ยง (Prevent)</option>
                  <option value="หลีกเลี่ยงความเสี่ยง (Avoid)">หลีกเลี่ยงความเสี่ยง (Avoid)</option>
                  <option value="ถ่ายโอนความเสี่ยง (Transfer)">ถ่ายโอนความเสี่ยง (Transfer)</option>
                  <option value="ยอมรับความเสี่ยง (Accept)">ยอมรับความเสี่ยง (Accept)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  มาตรการควบคุม / กิจกรรมจัดการความเสี่ยง:
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingBs3.measures || ''}
                  onChange={(e) => setEditingBs3({ ...editingBs3, measures: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ผู้รับผิดชอบดำเนินการ:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBs3.responsiblePerson || ''}
                    onChange={(e) => setEditingBs3({ ...editingBs3, responsiblePerson: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ระยะเวลาดำเนินงาน:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBs3.timeline || ''}
                    onChange={(e) => setEditingBs3({ ...editingBs3, timeline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs3(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  บันทึกแผน บส.3
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. Modal Edit BS.4 (Monitoring) */}
      {editingBs4 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขรายงานติดตามผล (แบบ บส.4)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs4(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs4} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold">{editingBs4.department}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">{editingBs4.riskEvent}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  สถานะความก้าวหน้า:
                </label>
                <select
                  value={editingBs4.progress || 'อยู่ระหว่างดำเนินการ'}
                  onChange={(e) => setEditingBs4({ ...editingBs4, progress: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="แล้วเสร็จต่อเนื่อง">แล้วเสร็จต่อเนื่อง</option>
                  <option value="ดำเนินการตามแผน">ดำเนินการตามแผน</option>
                  <option value="อยู่ระหว่างดำเนินการ">อยู่ระหว่างดำเนินการ</option>
                  <option value="ล่าช้ากว่าแผน">ล่าช้ากว่าแผน</option>
                  <option value="ยังไม่ได้เริ่มดำเนินการ">ยังไม่ได้เริ่มดำเนินการ</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ผลการดำเนินงานจริง:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="ระบุความคืบหน้าของมาตรการและผลสัมฤทธิ์ที่เกิดขึ้นจริง"
                  value={editingBs4.progressDetail || ''}
                  onChange={(e) => setEditingBs4({ ...editingBs4, progressDetail: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ระดับความเสี่ยงปัจจุบัน:
                </label>
                <select
                  value={editingBs4.currentRiskLevel || 'ต่ำ'}
                  onChange={(e) => setEditingBs4({ ...editingBs4, currentRiskLevel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="ต่ำ">ต่ำ (อยู่ในเกณฑ์ที่ยอมรับได้)</option>
                  <option value="ปานกลาง">ปานกลาง</option>
                  <option value="สูง">สูง</option>
                  <option value="สูงมาก">สูงมาก</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs4(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  บันทึกรายงาน บส.4
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
