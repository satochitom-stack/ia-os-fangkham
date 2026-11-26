import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  FileWarning,
  Layers,
  Sparkles
} from 'lucide-react';

export default function YearEndRolloverModal({
  isOpen,
  onClose,
  fiscalYears = ['2569', '2570'],
  selectedYear = '2570',
  riskManagementByYear = {},
  capaFindingsByYear = {},
  auditUniverseByYear = {},
  onExecuteRollover
}) {
  const defaultSource = useMemo(() => {
    const prevYr = String((Number(selectedYear) || 2570) - 1);
    if (fiscalYears.includes(prevYr)) return prevYr;
    return fiscalYears[0] || '2569';
  }, [fiscalYears, selectedYear]);

  const [sourceYear, setSourceYear] = useState(defaultSource);
  const [targetYear, setTargetYear] = useState(selectedYear);
  const [includeResidualRisks, setIncludeResidualRisks] = useState(true);
  const [includeOpenCapa, setIncludeOpenCapa] = useState(true);
  const [includeAuditUniverse, setIncludeAuditUniverse] = useState(true);
  const [resultMsg, setResultMsg] = useState(null);

  const previewStats = useMemo(() => {
    const srcRm = riskManagementByYear[sourceYear] || {};
    const bs5Items = Array.isArray(srcRm.bs5)
      ? srcRm.bs5
      : Array.isArray(srcRm.bs5?.items)
      ? srcRm.bs5.items
      : [];
    const bs1Items = Array.isArray(srcRm.bs1) ? srcRm.bs1 : [];
    const riskSourceList = bs5Items.length > 0 ? bs5Items : bs1Items;

    const srcCapa = Array.isArray(capaFindingsByYear[sourceYear]) ? capaFindingsByYear[sourceYear] : [];
    const openCapaList = srcCapa.filter(
      (c) => c.status !== 'verified_closed' && c.status !== 'closed' && c.status !== 'completed'
    );

    const srcAu = Array.isArray(auditUniverseByYear[sourceYear]) ? auditUniverseByYear[sourceYear] : [];

    return {
      riskCount: riskSourceList.length,
      riskFromBs5: bs5Items.length > 0,
      openCapaCount: openCapaList.length,
      universeCount: srcAu.length
    };
  }, [sourceYear, riskManagementByYear, capaFindingsByYear, auditUniverseByYear]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (sourceYear === targetYear) {
      setResultMsg({ type: 'error', text: 'ปีงบประมาณต้นทางและปลายทางต้องเป็นคนละปีกัน' });
      return;
    }
    if (!includeResidualRisks && !includeOpenCapa && !includeAuditUniverse) {
      setResultMsg({ type: 'error', text: 'กรุณาเลือกอย่างน้อย 1 รายการที่ต้องการยกยอด' });
      return;
    }

    const summary = onExecuteRollover({
      sourceYear,
      targetYear,
      includeResidualRisks,
      includeOpenCapa,
      includeAuditUniverse
    });

    setResultMsg({
      type: 'success',
      text: `ยกยอดจากปีงบ ${sourceYear} ไปยังปีงบ ${targetYear} สำเร็จ! (ความเสี่ยง ${summary.risksAdded} รายการ, CAPA ค้างติดตาม ${summary.capaAdded} รายการ, Audit Universe ${summary.universeAdded} กิจกรรม)`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-white dark:from-slate-850 dark:to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                ยกยอดข้อมูลขึ้นปีงบประมาณใหม่ (Year-End Rollover)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ดึงความเสี่ยงคงเหลือ บส.5, ข้อทักท้วง CAPA ค้างปิด และฐานกิจกรรม SOFCK ข้ามปีในคลิกเดียว
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Year Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                ปีงบประมาณต้นทาง (ปีเก่า)
              </label>
              <select
                value={sourceYear}
                onChange={(e) => {
                  setSourceYear(e.target.value);
                  setResultMsg(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {fiscalYears.map((yr) => (
                  <option key={yr} value={yr}>
                    พ.ศ. {yr}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                ปีงบประมาณปลายทาง (ปีใหม่)
              </label>
              <select
                value={targetYear}
                onChange={(e) => {
                  setTargetYear(e.target.value);
                  setResultMsg(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 font-bold text-indigo-700 dark:text-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Array.from(new Set([...fiscalYears, String((Number(selectedYear) || 2570) + 1)]))
                  .sort()
                  .map((yr) => (
                    <option key={yr} value={yr}>
                      พ.ศ. {yr}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Checklist Options */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>เลือกรายการข้อมูลที่ต้องการยกยอด (ไม่ลบข้อมูลเดิมในปลายทาง — เพิ่มเฉพาะรายการใหม่)</span>
            </div>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 cursor-pointer bg-white dark:bg-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={includeResidualRisks}
                onChange={(e) => setIncludeResidualRisks(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600"
              />
              <div className="flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    ความเสี่ยงคงเหลือ ({previewStats.riskFromBs5 ? 'จาก บส.5' : 'จาก บส.1'}) ➡️ ตั้งต้น บส.1 ปี {targetYear}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-[11px]">
                    {previewStats.riskCount} รายการ
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  นำความเสี่ยงคงเหลือ/แนวทางปีถัดไปมาสร้างเป็นรายการตั้งต้นในแบบ บส.1 ของปีงบ {targetYear}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 cursor-pointer bg-white dark:bg-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={includeOpenCapa}
                onChange={(e) => setIncludeOpenCapa(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600"
              />
              <div className="flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileWarning className="w-3.5 h-3.5 text-amber-500" />
                    ข้อทักท้วง CAPA ที่ยังไม่ปิดเรื่อง ➡️ ยกยอดติดตามต่อปี {targetYear}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                    {previewStats.openCapaCount} รายการ
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  ยกยอดข้อทักท้วงที่ยังมีสถานะเปิด/อยู่ระหว่างแก้ไข มาติดตามต่อเนื่องโดยติดป้าย [ยกยอดจากปี {sourceYear}]
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 cursor-pointer bg-white dark:bg-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={includeAuditUniverse}
                onChange={(e) => setIncludeAuditUniverse(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600"
              />
              <div className="flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    ฐานกิจกรรมตรวจสอบ (Audit Universe / SOFCK)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                    {previewStats.universeCount} กิจกรรม
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  คัดลอกรายการกิจกรรมทุกส่วนราชการไปเป็นฐานประเมินความเสี่ยง SOFCK ของปี {targetYear} (รีเซ็ตสถานะเข้าแผนเป็นยังไม่เข้าแผน)
                </p>
              </div>
            </label>
          </div>

          {resultMsg && (
            <div
              className={`p-3.5 rounded-2xl flex items-start gap-2 font-semibold ${
                resultMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
              }`}
            >
              {resultMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{resultMsg.text}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>เริ่มยกยอดไปยังปี {targetYear}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
