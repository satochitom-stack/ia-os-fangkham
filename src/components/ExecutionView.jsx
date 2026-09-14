import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  Plus,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  BookmarkCheck,
  ChevronDown,
  Building,
  Calendar,
  UserCheck
} from 'lucide-react';
import { exportWorkingPaperToExcel } from '../utils/exportExcel';

export default function ExecutionView({
  workingPapers,
  setWorkingPapers,
  selectedWp,
  setSelectedWp,
  orgProfile
}) {
  const currentWp = workingPapers.find((w) => w.id === selectedWp) || workingPapers[0];
  const isSubsidyWp = currentWp.id.startsWith('WP-SUBSIDY');
  const docNoLabel = isSubsidyWp ? 'เลขที่โครงการ / บันทึกข้อตกลง' : 'เลขที่เอกสาร / ฎีกา';
  const payeeLabel = isSubsidyWp ? 'หน่วยงาน / องค์กรที่ขอรับเงินอุดหนุน' : 'ผู้รับเงิน / คู่สัญญา';
  const amountLabel = isSubsidyWp ? 'วงเงินอุดหนุน (บาท)' : 'จำนวนเงิน (บาท)';

  const [showAddSample, setShowAddSample] = useState(false);
  const [newSample, setNewSample] = useState({
    docNo: '',
    date: '',
    payee: '',
    amount: '',
    testResult: 'ปกติ',
    note: ''
  });

  // Toggle checklist item result
  const handleToggleChecklist = (checkId) => {
    const updated = workingPapers.map((wp) => {
      if (wp.id === currentWp.id) {
        const nextChecklist = wp.checklist.map((item) => {
          if (item.id === checkId) {
            let nextResult = 'passed';
            if (item.result === 'passed') nextResult = 'failed';
            else if (item.result === 'failed') nextResult = 'na';
            else nextResult = 'passed';
            return { ...item, result: nextResult };
          }
          return item;
        });
        return { ...wp, checklist: nextChecklist };
      }
      return wp;
    });
    setWorkingPapers(updated);
  };

  // Add new sample row
  const handleAddSample = (e) => {
    e.preventDefault();
    if (!newSample.docNo) return;
    const updated = workingPapers.map((wp) => {
      if (wp.id === currentWp.id) {
        const samples = wp.samples || [];
        return {
          ...wp,
          samples: [
            ...samples,
            {
              ...newSample,
              id: `SMP-${Date.now().toString().slice(-4)}`,
              amount: Number(newSample.amount) || 0
            }
          ]
        };
      }
      return wp;
    });
    setWorkingPapers(updated);
    setShowAddSample(false);
    setNewSample({
      docNo: '',
      date: '',
      payee: '',
      amount: '',
      testResult: 'ปกติ',
      note: ''
    });
  };

  // Update findings
  const handleUpdateFinding = (field, value) => {
    const updated = workingPapers.map((wp) => {
      if (wp.id === currentWp.id) {
        return {
          ...wp,
          finding: {
            ...wp.finding,
            [field]: value
          }
        };
      }
      return wp;
    });
    setWorkingPapers(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Topic Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <ClipboardCheck className="w-4 h-4" />
            <span>กระดาษทำการตรวจสอบ (Working Paper)</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
            {currentWp.topic}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span className="flex items-center">
              <Building className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500" />
              หน่วยรับตรวจ: <strong className="ml-1 text-slate-700 dark:text-slate-300">{currentWp.department}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500" />
              งวดตรวจสอบ: <strong className="ml-1 text-slate-700 dark:text-slate-300">{currentWp.auditPeriod}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500" />
              ผู้ตรวจสอบ: <strong className="ml-1 text-slate-700 dark:text-slate-300">{orgProfile.auditorName || currentWp.auditor || 'ผู้ตรวจสอบภายใน'}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative">
            <select
              value={currentWp.id}
              onChange={(e) => setSelectedWp(e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 text-slate-800 dark:text-slate-200 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl border border-slate-300 dark:border-slate-600 outline-none cursor-pointer"
            >
              {workingPapers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id}: {w.topic.slice(0, 30)}...
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          <button
            onClick={() => exportWorkingPaperToExcel(currentWp, orgProfile)}
            className="no-print bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="no-print bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์กระดาษทำการ</span>
          </button>
        </div>
      </div>

      {/* Criteria / Regulations Box */}
      <div className="bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-800/50 rounded-xl p-4 text-xs">
        <div className="flex items-center space-x-2 font-bold text-amber-950 dark:text-amber-200 mb-1.5">
          <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>เกณฑ์มาตรฐาน / ระเบียบกฎหมายที่ใช้ตรวจสอบ (Criteria)</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-amber-900/90 dark:text-amber-300 pl-1">
          {currentWp.criteria?.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Section 1: Audit Program Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              1. แนวทางการตรวจสอบและการควบคุมภายใน (Audit Program Checklist)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              คลิกที่ปุ่มผลการตรวจเพื่อสลับสถานะ: ผ่าน / ไม่ผ่าน / ไม่เกี่ยวข้อง
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {currentWp.checklist.filter((c) => c.result === 'passed').length} / {currentWp.checklist.length} ผ่านเกณฑ์
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {currentWp.checklist.map((item, idx) => {
            const isPassed = item.result === 'passed';
            const isFailed = item.result === 'failed';
            return (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs shrink-0">{idx + 1}.</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {item.question}
                    </span>
                  </div>
                  {item.note && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-4">
                      <strong>หมายเหตุตรวจพบ:</strong> {item.note}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isPassed
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                        : isFailed
                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 hover:bg-rose-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {isPassed ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ปฏิบัติถูกต้อง</span>
                      </>
                    ) : isFailed ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>มีข้อบกพร่อง</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>ไม่เกี่ยวข้อง</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Sample Testing (สุ่มตรวจฎีกา / เอกสาร) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              2. ตารางบันทึกการสุ่มตรวจตัวอย่าง (Sample Testing Records)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              รายการเอกสาร ฎีกาเบิกจ่าย หรือสัญญาที่ทำการสุ่มตรวจ
            </p>
          </div>
          <button
            onClick={() => setShowAddSample(true)}
            className="no-print bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มตัวอย่าง</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-2.5">ลำดับ</th>
                <th className="px-4 py-2.5">{docNoLabel}</th>
                <th className="px-4 py-2.5">วันที่</th>
                <th className="px-4 py-2.5">{payeeLabel}</th>
                <th className="px-4 py-2.5 text-right">{amountLabel}</th>
                <th className="px-4 py-2.5 text-center">ผลการตรวจ</th>
                <th className="px-4 py-2.5">ข้อสังเกต / เอกสารแนบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentWp.samples?.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2.5 font-bold text-slate-400 dark:text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-slate-100">{s.docNo}</td>
                  <td className="px-4 py-2.5">{s.date}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{s.payee}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold">
                    {s.amount?.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      {s.testResult}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Audit Findings (ข้อตรวจพบ 4 องค์ประกอบ) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-bold text-sm border-b border-slate-200 dark:border-slate-700 pb-3">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>3. สรุปข้อตรวจพบและข้อเสนอแนะ (Audit Findings - 4 Elements)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Condition */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              1. สภาพการณ์ที่ตรวจพบ (Condition)
            </label>
            <textarea
              rows="3"
              value={currentWp.finding?.condition || ''}
              onChange={(e) => handleUpdateFinding('condition', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 leading-relaxed"
              placeholder="ระบุข้อเท็จจริงที่ตรวจพบ..."
            ></textarea>
          </div>

          {/* Cause */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              2. สาเหตุของข้อบกพร่อง (Cause)
            </label>
            <textarea
              rows="3"
              value={currentWp.finding?.cause || ''}
              onChange={(e) => handleUpdateFinding('cause', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 leading-relaxed"
              placeholder="ระบุสาเหตุ เช่น ขาดความรู้ ขาดการควบคุม..."
            ></textarea>
          </div>

          {/* Effect */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              3. ผลกระทบ / ความเสียหาย (Effect)
            </label>
            <textarea
              rows="3"
              value={currentWp.finding?.effect || ''}
              onChange={(e) => handleUpdateFinding('effect', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 leading-relaxed"
              placeholder="ระบุความเสี่ยงหรือความเสียหายที่เกิดขึ้น..."
            ></textarea>
          </div>

          {/* Recommendation */}
          <div className="space-y-1.5">
            <label className="font-bold text-blue-900 dark:text-blue-200">
              4. ข้อเสนอแนะของผู้ตรวจสอบภายใน (Recommendation)
            </label>
            <textarea
              rows="3"
              value={currentWp.finding?.recommendation || ''}
              onChange={(e) => handleUpdateFinding('recommendation', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-blue-300 dark:border-blue-700/60 bg-blue-50/40 dark:bg-blue-500/10 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed text-blue-950 dark:text-blue-100 font-medium"
              placeholder="ระบุแนวทางแก้ไขที่ชัดเจน สามารถปฏิบัติได้จริง..."
            ></textarea>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            * ข้อมูลข้อตรวจพบนี้จะถูกดึงไปจัดทำรายงานผลการตรวจสอบอัตโนมัติในโมดูลถัดไป
          </span>
          <button
            onClick={() => alert('บันทึกกระดาษทำการเรียบร้อยแล้ว')}
            className="no-print bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
          >
            บันทึกกระดาษทำการ
          </button>
        </div>
      </div>

      {/* Modal: Add Sample */}
      {showAddSample && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">เพิ่มรายการสุ่มตรวจ</h3>
            <form onSubmit={handleAddSample} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">{docNoLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={isSubsidyWp ? 'เช่น บันทึกข้อตกลง 12/68' : 'เช่น ฎีกา 214/68'}
                  value={newSample.docNo}
                  onChange={(e) => setNewSample({ ...newSample, docNo: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">วันที่</label>
                  <input
                    type="text"
                    placeholder="เช่น 15 ก.พ. 68"
                    value={newSample.date}
                    onChange={(e) => setNewSample({ ...newSample, date: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">{amountLabel}</label>
                  <input
                    type="number"
                    placeholder="เช่น 15000"
                    value={newSample.amount}
                    onChange={(e) => setNewSample({ ...newSample, amount: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">{payeeLabel}</label>
                <input
                  type="text"
                  placeholder={isSubsidyWp ? 'เช่น โรงเรียนบ้านฝางคำ' : 'เช่น หจก. สมบูรณ์ก่อสร้าง'}
                  value={newSample.payee}
                  onChange={(e) => setNewSample({ ...newSample, payee: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ผลการตรวจ</label>
                <select
                  value={newSample.testResult}
                  onChange={(e) => setNewSample({ ...newSample, testResult: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                >
                  <option value="ปกติ">ปกติ (ถูกต้องตามระเบียบ)</option>
                  <option value="มีข้อสังเกต">มีข้อสังเกต</option>
                  <option value="ไม่ถูกต้อง">ไม่ถูกต้อง</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ข้อสังเกต / หมายเหตุ</label>
                <input
                  type="text"
                  placeholder="ระบุข้อสังเกต..."
                  value={newSample.note}
                  onChange={(e) => setNewSample({ ...newSample, note: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSample(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  บันทึกตัวอย่าง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
