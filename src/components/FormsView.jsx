import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Eye,
  Sparkles,
  ChevronRight,
  Maximize2,
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function FormsView({
  setCurrentTab
}) {
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const pdfUrl = '/docs/w3482-risk-forms.pdf';

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
          <FileSpreadsheet className="w-4 h-4" />
          <span>แบบฟอร์มมาตรฐาน (Standard Forms)</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          เอกสารแบบฟอร์มทางการสำหรับการปฏิบัติงาน
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          เอกสารแบบฟอร์มและแนวทางปฏิบัติที่กระทรวงมหาดไทยกำหนดสำหรับองค์กรปกครองส่วนท้องถิ่น
        </p>
      </div>

      {/* =========================================================================
          SINGLE UNIFIED CARD: หนังสือสั่งการ มท 0805.2/ว 3482 (รวมกรอบเดียว)
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Card Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>หนังสือสั่งการกระทรวงมหาดไทย (ฉบับหลักพร้อมแบบ บส. ๑ - ๕)</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                หนังสือกระทรวงมหาดไทย ด่วนที่สุด ที่ มท ๐๘๐๕.๒/ว ๓๔๘๒
              </h3>

              <div className="text-sm font-semibold text-blue-200">
                เรื่อง แนวทางการประเมินและบริหารจัดการความเสี่ยงสำหรับองค์กรปกครองส่วนท้องถิ่น
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                ลงวันที่ ๑๘ สิงหาคม ๒๕๖๖ เอกสารฉบับทางการ ๑๒ หน้า รวบรวมแนวทางปฏิบัติการประเมินความเสี่ยง การวิเคราะห์ระดับความเสี่ยง 
                พร้อมแบบฟอร์มครบชุด ได้แก่ <strong>แบบ บส. ๑ (ระบุและประเมินความเสี่ยง)</strong>, <strong>แบบ บส. ๒ (แผนบริหารจัดการความเสี่ยง)</strong>, 
                <strong>แบบ บส. ๓ (รายงานรอบ ๖ เดือน)</strong>, <strong>แบบ บส. ๔ (รายงานรอบ ๑๒ เดือน)</strong> และ <strong>แบบ บส. ๕ (รายงานภาพรวมระดับ อปท.)</strong> 
                รวมทั้งคำอธิบายหมายเลขกำกับทุกขั้นตอน
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10 font-mono">
                  📄 ไฟล์ PDF 12 หน้า (805 KB)
                </span>
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-1 rounded-md font-semibold">
                  ✓ บรรจุแบบ บส.๑ ถึง บส.๕ ครบชุด
                </span>
                <span className="bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-md font-semibold">
                  ★ บังคับใช้ อปท. ทั่วประเทศ
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setPdfModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:shadow-blue-500/30"
              >
                <Eye className="w-4 h-4" />
                <span>เปิดดูเต็มจอ (Preview Modal)</span>
              </button>

              <a
                href={pdfUrl}
                download="หนังสือสั่งการ_มท_ว3482_แนวทางบริหารความเสี่ยง_อปท.pdf"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>ดาวน์โหลดไฟล์ PDF (ว ๓๔๘๒)</span>
              </a>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer text-center"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>เปิดในแท็บใหม่</span>
              </a>

              {setCurrentTab && (
                <button
                  type="button"
                  onClick={() => setCurrentTab('risk-management')}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <span>ไปยังระบบกรอกแบบ บส. ๑ - ๕</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Interactive PDF Viewer Inside the Frame */}
        <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>เอกสารต้นฉบับ: หนังสือกระทรวงมหาดไทย ที่ มท ๐๘๐๕.๒/ว ๓๔๘๒ (๑๒ หน้า)</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              สามารถเลื่อนอ่าน ย่อ/ขยาย หรือสั่งพิมพ์ผ่านแถบเครื่องมือของเอกสารได้โดยตรง
            </div>
          </div>

          <div className="w-full h-[750px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white shadow-inner">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1`}
              className="w-full h-full"
              title="หนังสือสั่งการ มท 0805.2/ว 3482 ลว. 18 ส.ค. 2566"
            />
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              💡 <strong>คำแนะนำ:</strong> ตัวอย่างแบบ บส. ๑ ถึง บส. ๕ อยู่ในหน้า ๕ ถึง หน้า ๙ ของเอกสารฉบับนี้
            </div>
            <div>
              หากอุปกรณ์ของท่านไม่แสดงตัวอย่างเอกสาร สามารถคลิก <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">เปิดแท็บใหม่</a> หรือ <a href={pdfUrl} download className="text-emerald-600 dark:text-emerald-400 underline font-semibold">ดาวน์โหลด PDF</a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FULLSCREEN PREVIEW MODAL
      ========================================================================= */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    หนังสือกระทรวงมหาดไทย ด่วนที่สุด ที่ มท ๐๘๐๕.๒/ว ๓๔๘๒ ลว. ๑๘ ส.ค. ๒๕๖๖
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>แนวทางการประเมินและบริหารจัดการความเสี่ยงสำหรับ อปท. (๑๒ หน้า)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  title="เปิดในแท็บใหม่"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">เปิดแท็บใหม่</span>
                </a>

                <a
                  href={pdfUrl}
                  download="หนังสือสั่งการ_มท_ว3482_แนวทางบริหารความเสี่ยง_อปท.pdf"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  title="ดาวน์โหลด PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ดาวน์โหลด</span>
                </a>

                <button
                  onClick={() => setPdfModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="ปิด"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Embedded Iframe Viewer */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-1 sm:p-2 overflow-hidden flex flex-col">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white"
                title="หนังสือสั่งการ มท 0805.2/ว 3482 (12 หน้า)"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
