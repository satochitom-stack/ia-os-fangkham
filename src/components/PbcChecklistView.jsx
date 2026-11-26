import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Printer,
  Trash2,
  Link2,
  Building2,
  Send,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import { getDepartments } from '../utils/auth';

const PBC_PRESETS = {
  ktb_finance: {
    label: 'ชุดตรวจ KTB Corporate Online / รับ-จ่ายเงิน (กองคลัง)',
    department: 'กองคลัง',
    items: [
      'คำสั่งแต่งตั้งผู้มีอำนาจอนุมัติ (Maker / Checker / Authorizer) ระบบ KTB Corporate Online',
      'รายงานสถานะการเงินประจำวัน และสมุดเงินสดรับ-จ่าย ประจำเดือน',
      'งบพิสูจน์ยอดเงินฝากธนาคาร (Bank Reconciliation) พร้อม Statement ธนาคาร',
      'ทะเบียนคุมเช็ค และใบเสร็จรับเงิน (เล่มที่ใช้แล้วและคงเหลือ)',
      'ฎีกาเบิกจ่ายเงินพร้อมเอกสารประกอบตามตัวอย่างที่สุ่มตรวจ'
    ]
  },
  procurement: {
    label: 'ชุดตรวจจัดซื้อจัดจ้าง พ.ร.บ. 2560 (กองคลัง/พัสดุ)',
    department: 'กองคลัง',
    items: [
      'แผนการจัดซื้อจัดจ้างประจำปี และประกาศเผยแพร่ในระบบ e-GP',
      'รายงานขอซื้อขอจ้าง (ข้อ 22) และตารางแสดงวงเงินงบประมาณ/ราคากลาง (บก.01)',
      'คำสั่งแต่งตั้งคณะกรรมการพิจารณาผล และคณะกรรมการตรวจรับพัสดุ',
      'สัญญาจ้าง/ใบสั่งซื้อ พร้อมหลักประกันสัญญา 5% และอากรแสตมป์',
      'รายงานผลการตรวจรับพัสดุ ใบส่งมอบงาน และทะเบียนคุมการคืนหลักประกันสัญญา'
    ]
  },
  construction: {
    label: 'ชุดตรวจงานก่อสร้าง & ราคากลาง (กองช่าง)',
    department: 'กองช่าง',
    items: [
      'แบบรูปรายการก่อสร้าง (Drawing) และประมาณราคา ปร.4, ปร.5, ปร.6',
      'เอกสารคำนวณ Factor F และราคาพาณิชย์จังหวัดที่ใช้กำหนดราคากลาง',
      'คำสั่งแต่งตั้งผู้ควบคุมงาน และสมุดบันทึกรายงานประจำวันของผู้ควบคุมงาน (Daily Report)',
      'ผลทดสอบกำลังอัดคอนกรีต 28 วัน (Cylinder Test) จากสถาบันที่เชื่อถือได้',
      'ภาพถ่ายก่อน-ระหว่าง-หลังก่อสร้าง และป้ายประชาสัมพันธ์โครงการ'
    ]
  },
  lunch_cdc: {
    label: 'ชุดตรวจอาหารกลางวัน & นมโรงเรียน (กองการศึกษา/ศพด.)',
    department: 'กองการศึกษา',
    items: [
      'ทะเบียนรายชื่อเด็กนักเรียน/เด็กเล็ก และบัญชีลงชื่อรับประทานอาหารกลางวันประจำวัน',
      'เมนูอาหารกลางวันตามโปรแกรม Thai School Lunch (TSL)',
      'เอกสารจัดซื้อวัตถุดิบ/จ้างเหมาประกอบอาหาร และใบตรวจรับอาหารประจำวัน',
      'ใบส่งมอบและใบตรวจรับอาหารเสริม (นม) โรงเรียน พร้อมบันทึกอุณหภูมิการจัดเก็บ'
    ]
  },
  welfare: {
    label: 'ชุดตรวจเบี้ยยังชีพผู้สูงอายุ/คนพิการ (กองสวัสดิการสังคม)',
    department: 'กองสวัสดิการสังคม',
    items: [
      'ทะเบียนประวัติผู้มีสิทธิรับเบี้ยยังชีพผู้สูงอายุ/คนพิการ และแบบคำขอขึ้นทะเบียน',
      'รายงานการตรวจสอบข้อมูลผู้เสียชีวิต/ย้ายภูมิลำเนาจากทะเบียนราษฎรประจำเดือน',
      'หลักฐานการโอนเงินเบี้ยยังชีพเข้าบัญชี (กรมบัญชีกลาง) และบัญชีจ่ายเงินสด (ถ้ามี)'
    ]
  }
};

export default function PbcChecklistView({
  selectedYear = '2570',
  orgProfile = {},
  session = null,
  annualPlans = [],
  pbcRequests = [],
  setPbcRequests
}) {
  const isAdmin = session?.role === 'admin' || session?.role === 'executive';
  const userDept = session?.department || 'สำนักปลัด';
  const departments = useMemo(
    () => getDepartments().filter((d) => d && d !== 'หน่วยตรวจสอบภายใน' && d !== 'ส่วนกลาง'),
    []
  );

  const [filterDept, setFilterDept] = useState(isAdmin ? 'all' : userDept);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState('');

  const [newItem, setNewItem] = useState({
    department: isAdmin ? 'กองคลัง' : userDept,
    planTopic: annualPlans[0]?.topic || annualPlans[0]?.title || '',
    documentName: '',
    dueDate: '',
    note: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const visibleRequests = useMemo(() => {
    return (pbcRequests || []).filter((item) => {
      if (!isAdmin && item.department !== userDept) return false;
      if (isAdmin && filterDept !== 'all' && item.department !== filterDept) return false;
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      return true;
    });
  }, [pbcRequests, isAdmin, userDept, filterDept, filterStatus]);

  const stats = useMemo(() => {
    const base = isAdmin ? pbcRequests || [] : (pbcRequests || []).filter((r) => r.department === userDept);
    return {
      total: base.length,
      pending: base.filter((r) => r.status === 'pending' || r.status === 'revision').length,
      submitted: base.filter((r) => r.status === 'submitted').length,
      approved: base.filter((r) => r.status === 'approved').length
    };
  }, [pbcRequests, isAdmin, userDept]);

  const handleAddSingle = (e) => {
    e.preventDefault();
    if (!newItem.documentName.trim() || !setPbcRequests) return;
    const entry = {
      id: `PBC-${Date.now()}`,
      code: `PBC-${String(selectedYear).slice(-2)}-${String((pbcRequests?.length || 0) + 1).padStart(2, '0')}`,
      department: newItem.department,
      planTopic: newItem.planTopic || `งานตรวจสอบประจำปี ${selectedYear}`,
      documentName: newItem.documentName.trim(),
      dueDate: newItem.dueDate,
      status: 'pending', // pending | submitted | approved | revision
      fileLink: '',
      deptRemark: '',
      note: newItem.note.trim(),
      requestedAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setPbcRequests((prev) => [entry, ...(prev || [])]);
    setNewItem({ ...newItem, documentName: '', note: '' });
    setShowAddModal(false);
    showToast(`✓ เพิ่มรายการขอเอกสาร "${entry.code}" เรียบร้อยแล้ว`);
  };

  const handleLoadPreset = (presetKey) => {
    const preset = PBC_PRESETS[presetKey];
    if (!preset || !setPbcRequests) return;
    const baseLen = pbcRequests?.length || 0;
    const due = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const created = preset.items.map((doc, idx) => ({
      id: `PBC-${Date.now()}-${idx}`,
      code: `PBC-${String(selectedYear).slice(-2)}-${String(baseLen + idx + 1).padStart(2, '0')}`,
      department: preset.department,
      planTopic: preset.label,
      documentName: doc,
      dueDate: due,
      status: 'pending',
      fileLink: '',
      deptRemark: '',
      note: 'กรุณาเตรียมเอกสารตัวจริงหรือแนบลิงก์ไฟล์สำเนา',
      requestedAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    }));
    setPbcRequests((prev) => [...created, ...(prev || [])]);
    showToast(`✓ สร้างรายการขอเอกสารมาตรฐาน "${preset.label}" จำนวน ${created.length} รายการแล้ว`);
  };

  const updateItem = (id, patch) => {
    if (!setPbcRequests) return;
    setPbcRequests((prev) =>
      (prev || []).map((item) =>
        item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString().slice(0, 10) } : item
      )
    );
  };

  const deleteItem = (id) => {
    if (!setPbcRequests) return;
    setPbcRequests((prev) => (prev || []).filter((item) => item.id !== id));
  };

  const handleCopyLineText = () => {
    const pendingList = visibleRequests.filter((r) => r.status !== 'approved');
    if (pendingList.length === 0) {
      showToast('ไม่มีรายการเอกสารค้างส่งสำหรับคัดลอก');
      return;
    }
    const targetLabel = filterDept === 'all' ? 'ส่วนราชการที่เกี่ยวข้อง' : filterDept;
    const lines = [
      `📋 [แจ้งขอรับเอกสารประกอบการตรวจสอบภายใน - ปีงบ ${selectedYear}]`,
      `เรียน ผอ.${targetLabel} (${orgProfile.name || 'อบต.ฝางคำ'})`,
      `หน่วยตรวจสอบภายในขอความอนุเคราะห์จัดเตรียมเอกสาร (PBC List) ดังนี้ครับ:`,
      '',
      ...pendingList.map(
        (r, i) =>
          `${i + 1}. [${r.code}] ${r.documentName}${r.dueDate ? ` (กำหนดส่ง: ${r.dueDate})` : ''} — สถานะ: ${
            r.status === 'submitted' ? 'ส่งแล้วรอตรวจ' : r.status === 'revision' ? 'ขอเอกสารเพิ่มเติม' : 'รอจัดส่ง'
          }`
      ),
      '',
      `สามารถแจ้งสถานะหรือแนบลิงก์เอกสารในระบบ IA-OS ได้ทันที ขอบคุณครับ 🙏`
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    showToast('✓ คัดลอกข้อความแจ้งขอเอกสารสำหรับส่งเข้า LINE แล้ว!');
  };

  const statusMeta = {
    pending: { label: 'รอจัดส่ง', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' },
    submitted: { label: 'ส่งแล้ว-รอตรวจ', cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' },
    approved: { label: 'รับครบแล้ว', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' },
    revision: { label: 'ขอเพิ่มเติม', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200' }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50/60 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 rounded-2xl p-6 border border-indigo-200/80 dark:border-indigo-900/40 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-indigo-100/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-full px-3 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Provided By Client (PBC) • ปีงบประมาณ พ.ศ. {selectedYear}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            ระบบใบขอรับเอกสารประกอบการตรวจสอบ (PBC Checklist)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            สร้างรายการเอกสารขอรับตรวจก่อนลงพื้นที่ ให้กองรับตรวจเข้ามาอัปเดตสถานะ แนบลิงก์ไฟล์ พร้อมคัดลอกข้อความแจ้งเตือนส่ง LINE ได้ในคลิกเดียว
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button
            type="button"
            onClick={handleCopyLineText}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>คัดลอกส่ง LINE</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์ใบขอเอกสาร</span>
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มรายการขอเอกสาร</span>
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500">เอกสารที่ขอทั้งหมด</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/40">
          <div className="text-xs font-semibold text-amber-600">รอจัดส่ง / ขอเพิ่มเติม</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-200/70 dark:border-blue-900/40">
          <div className="text-xs font-semibold text-blue-600">ส่งแล้ว (รอผู้ตรวจรับ)</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.submitted}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200/70 dark:border-emerald-900/40">
          <div className="text-xs font-semibold text-emerald-600">รับเอกสารครบถ้วน</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.approved}</div>
        </div>
      </div>

      {/* Quick Preset Generator (Admin) */}
      {isAdmin && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 no-print">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>สร้างชุดใบขอเอกสารสำเร็จรูป (1 คลิกตามเรื่องตรวจมาตรฐาน อปท.):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PBC_PRESETS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleLoadPreset(key)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 hover:text-indigo-700 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
              >
                + {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 no-print">
        {isAdmin && (
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
          >
            <option value="all">ทุกส่วนราชการ</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รอจัดส่ง</option>
          <option value="submitted">ส่งแล้ว-รอตรวจ</option>
          <option value="revision">ขอเพิ่มเติม</option>
          <option value="approved">รับครบแล้ว</option>
        </select>
      </div>

      {/* Checklist Table / Cards */}
      {visibleRequests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">ยังไม่มีรายการขอเอกสาร (PBC)</div>
          <p className="text-xs text-slate-500">
            คลิกเลือก "ชุดใบขอเอกสารสำเร็จรูป" ด้านบน หรือกด "+ เพิ่มรายการขอเอกสาร" เพื่อเริ่มต้น
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleRequests.map((item) => {
            const meta = statusMeta[item.status] || statusMeta.pending;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${meta.cls}`}>{meta.label}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                      <Building2 className="w-3 h-3" />
                      {item.department}
                    </span>
                    {item.dueDate && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        กำหนดส่ง: {item.dueDate}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.documentName}</div>
                  <div className="text-[11px] text-slate-500">เรื่องตรวจ: {item.planTopic}</div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
                      <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={item.fileLink || ''}
                        onChange={(e) => updateItem(item.id, { fileLink: e.target.value })}
                        placeholder="แนบลิงก์ Google Drive / เลขแฟ้มอ้างอิง..."
                        className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
                  {item.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, { status: 'submitted' })}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>แจ้งส่งเอกสารแล้ว</span>
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, { status: item.status === 'approved' ? 'pending' : 'approved' })}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{item.status === 'approved' ? 'ยกเลิกรับ' : 'ยืนยันรับครบ'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, { status: 'revision' })}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold cursor-pointer"
                        title="ขอเอกสารเพิ่มเติม"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">เพิ่มรายการขอเอกสารประกอบการตรวจ</h3>
            <form onSubmit={handleAddSingle} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ส่วนราชการผู้รับตรวจ</label>
                <select
                  value={newItem.department}
                  onChange={(e) => setNewItem({ ...newItem, department: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">เรื่องตรวจ / โครงการ</label>
                <input
                  type="text"
                  value={newItem.planTopic}
                  onChange={(e) => setNewItem({ ...newItem, planTopic: e.target.value })}
                  placeholder="เช่น การตรวจสอบการรับ-จ่ายเงิน KTB Corporate Online"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ชื่อเอกสารหลักฐานที่ขอรับตรวจ *</label>
                <textarea
                  rows={2}
                  required
                  value={newItem.documentName}
                  onChange={(e) => setNewItem({ ...newItem, documentName: e.target.value })}
                  placeholder="เช่น งบพิสูจน์ยอดเงินฝากธนาคารเดือน ต.ค. - ธ.ค. พร้อม Statement"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">กำหนดส่งเอกสาร</label>
                <input
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
