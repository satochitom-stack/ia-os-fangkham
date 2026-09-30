import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Search,
  Printer,
  Layers,
  Check,
  ChevronRight
} from 'lucide-react';
import { initialOfficialDownloadableForms } from '../data/initialData';
import {
  downloadOfficialFormWord,
  downloadOfficialFormExcel
} from '../services/reportExportService';

export default function FormsView({
  setCurrentTab,
  session,
  orgProfile = {}
}) {
  const [selectedFormCategory, setSelectedFormCategory] = useState('all');
  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadWord = (form) => {
    downloadOfficialFormWord(form.id, orgProfile);
    showToast(`ดาวน์โหลดแบบฟอร์ม Word (${form.code}) เรียบร้อยแล้ว`);
  };

  const handleDownloadExcel = (form) => {
    downloadOfficialFormExcel(form.id, orgProfile);
    showToast(`ดาวน์โหลดแบบฟอร์ม Excel (${form.code}) เรียบร้อยแล้ว`);
  };

  const handlePrintPreview = (form) => {
    window.print();
  };

  // Form Categories
  const formCategories = [
    { id: 'all', label: 'ทุกหมวดหมู่แบบฟอร์ม' },
    { id: 'risk', label: 'การบริหารความเสี่ยง (ว 3482)' },
    { id: 'control', label: 'การควบคุมภายใน (ปค.4/5)' },
    { id: 'procurement', label: 'พัสดุและสัญญา (พ.ร.บ. พัสดุฯ)' },
    { id: 'audit', label: 'การตรวจสอบภายในและ สตง.' },
    { id: 'governance', label: 'ธรรมาภิบาลและการประเมิน LPA' }
  ];

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return (initialOfficialDownloadableForms || []).filter((f) => {
      if (selectedFormCategory !== 'all' && f.category !== selectedFormCategory) {
        return false;
      }
      if (formSearchQuery) {
        const q = formSearchQuery.toLowerCase();
        const matchTitle = (f.title || '').toLowerCase().includes(q);
        const matchCode = (f.code || '').toLowerCase().includes(q);
        const matchDesc = (f.description || '').toLowerCase().includes(q);
        const matchRef = (f.legalRef || '').toLowerCase().includes(q);
        return matchTitle || matchCode || matchDesc || matchRef;
      }
      return true;
    });
  }, [selectedFormCategory, formSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>คลังแบบฟอร์มมาตรฐาน (Official Downloadable Forms)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            คลังเอกสารและแบบฟอร์มทางการ อปท.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ดาวน์โหลดแบบฟอร์มมาตรฐานราชการในรูปแบบ Microsoft Word (.doc) และ Excel (.xlsx)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
            <Download className="w-4 h-4 text-blue-600" />
            <span>แบบฟอร์มมาตรฐาน ({initialOfficialDownloadableForms?.length || 12} แบบ)</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ค้นหาชื่อแบบฟอร์ม เช่น ปค.5, บส.1, คป.01, ว 184, อาหารกลางวัน..."
            value={formSearchQuery}
            onChange={(e) => setFormSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedFormCategory}
            onChange={(e) => setSelectedFormCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {formCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((form) => {
          return (
            <div
              key={form.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                {/* Header: Code & Category */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
                    {form.code}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[150px]" title={form.categoryLabel}>
                    {form.categoryLabel}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                    {form.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {form.description}
                  </p>
                </div>

                {/* Legal Ref */}
                {form.legalRef && (
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-100 dark:border-blue-900/40 font-mono">
                    อ้างอิง: {form.legalRef}
                  </div>
                )}
              </div>

              {/* Action Buttons: Word, Excel, Print */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadWord(form)}
                    className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="ดาวน์โหลดไฟล์ Microsoft Word (.doc) มาตรฐาน A4"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>ดาวน์โหลด Word</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadExcel(form)}
                    className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="ดาวน์โหลดไฟล์ Microsoft Excel (.xlsx)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ดาวน์โหลด Excel</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => handlePrintPreview(form)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center space-x-1 text-[11px] py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="พิมพ์หรือบันทึกเป็น PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>พิมพ์ / ส่งออก PDF</span>
                  </button>

                  {form.hasOnlineForm && form.onlineFormTab && (
                    <button
                      type="button"
                      onClick={() => setCurrentTab(form.onlineFormTab)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold flex items-center space-x-1 text-[11px] py-1 px-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                      title="เปิดหน้าบันทึกข้อมูลออนไลน์ในระบบ"
                    >
                      <span>บันทึกออนไลน์</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <div className="font-bold text-sm text-slate-700 dark:text-slate-300">ไม่พบแบบฟอร์มที่ค้นหา</div>
          <div className="text-xs text-slate-500">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</div>
        </div>
      )}
    </div>
  );
}
