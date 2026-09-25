import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Eye,
  Sparkles,
  ChevronRight,
  Maximize2,
  X,
  FileSpreadsheet,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

const INITIAL_DOCUMENTS = [
  {
    id: 'doc-w3482',
    code: 'มท ๐๘๐๕.๒/ว ๓๔๘๒',
    date: '๑๘ สิงหาคม ๒๕๖๖',
    title: 'หนังสือกระทรวงมหาดไทย ด่วนที่สุด ที่ มท ๐๘๐๕.๒/ว ๓๔๘๒',
    topic: 'แนวทางการประเมินและบริหารจัดการความเสี่ยงสำหรับองค์กรปกครองส่วนท้องถิ่น (พร้อมแบบ บส. ๑ ถึง แบบ บส. ๕)',
    category: 'การบริหารความเสี่ยง (ERM)',
    pages: '๑๒ หน้า',
    fileSize: '805 KB',
    pdfUrl: '/docs/w3482-risk-forms.pdf',
    downloadName: 'หนังสือสั่งการ_มท_ว3482_แนวทางบริหารความเสี่ยง_อปท.pdf',
    description: 'รวบรวมแนวทางปฏิบัติการประเมินความเสี่ยง การวิเคราะห์ระดับความเสี่ยง ๕x๕ พร้อมตัวอย่างแบบฟอร์ม บส.๑ (ระบุและประเมินความเสี่ยง), บส.๒ (แผนบริหารจัดการความเสี่ยง), บส.๓ (รายงานรอบ ๖ เดือน), บส.๔ (รายงานรอบ ๑๒ เดือน) และ บส.๕ (รายงานภาพรวมระดับ อปท.) พร้อมคำอธิบายหมายเลขกำกับทุกขั้นตอน',
    hasOnlineForm: true,
    onlineFormTab: 'risk-management',
    isOfficial: true
  }
];

export default function FormsView({
  setCurrentTab,
  session
}) {
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_forms_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure w3482 is always present and updated
          const hasW3482 = parsed.some((d) => d.id === 'doc-w3482');
          if (!hasW3482) {
            return [...INITIAL_DOCUMENTS, ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DOCUMENTS;
  });

  const [selectedDocId, setSelectedDocId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocForm, setNewDocForm] = useState({
    code: '',
    title: '',
    topic: '',
    date: '',
    pages: '๑ หน้า',
    fileSize: 'PDF',
    pdfUrl: '',
    description: ''
  });

  const isAdmin = session?.role === 'admin';

  const saveDocsToStorage = (updated) => {
    setDocuments(updated);
    try {
      localStorage.setItem('ia_forms_directory', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDocForm.title || !newDocForm.code) {
      alert('กรุณากรอกเลขที่หนังสือและชื่อเอกสาร');
      return;
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      code: newDocForm.code,
      title: newDocForm.title,
      topic: newDocForm.topic || newDocForm.title,
      date: newDocForm.date || 'ไม่ระบุวันที่',
      category: 'แบบฟอร์มราชการ',
      pages: newDocForm.pages || 'PDF',
      fileSize: newDocForm.fileSize || 'ไฟล์แนบ',
      pdfUrl: newDocForm.pdfUrl || '/docs/w3482-risk-forms.pdf',
      downloadName: `${newDocForm.code.replace(/[\/\\:]/g, '_')}.pdf`,
      description: newDocForm.description || '',
      hasOnlineForm: false,
      isOfficial: false
    };

    const updated = [newDoc, ...documents];
    saveDocsToStorage(updated);
    setShowAddModal(false);
    setNewDocForm({
      code: '',
      title: '',
      topic: '',
      date: '',
      pages: '๑ หน้า',
      fileSize: 'PDF',
      pdfUrl: '',
      description: ''
    });
  };

  const handleDeleteDoc = (id, e) => {
    e.stopPropagation();
    if (confirm('ต้องการลบเอกสารนี้ออกจากระบบหรือไม่?')) {
      const updated = documents.filter((d) => d.id !== id);
      saveDocsToStorage(updated);
      if (selectedDocId === id) {
        setSelectedDocId(null);
      }
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const q = searchTerm.toLowerCase();
    return (
      doc.code.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      (doc.topic && doc.topic.toLowerCase().includes(q)) ||
      (doc.description && doc.description.toLowerCase().includes(q))
    );
  });

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>แบบฟอร์มมาตรฐาน (Standard Forms)</span>
            {selectedDoc && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300 font-bold">{selectedDoc.code}</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {selectedDoc ? selectedDoc.title : 'สารบัญแบบฟอร์มและเอกสารคำสั่งการ'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedDoc
              ? `เรื่อง: ${selectedDoc.topic}`
              : 'รายการเอกสารและแบบฟอร์มทางการสำหรับการปฏิบัติงานและตรวจสอบภายใน อปท.'}
          </p>
        </div>

        {selectedDoc && (
          <button
            type="button"
            onClick={() => setSelectedDocId(null)}
            className="self-start sm:self-center flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับไปหน้ารายการ</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          VIEW 1: LIST VIEW (ลำดับชื่อเรื่องของไฟล์ก่อน)
      ========================================================================= */}
      {!selectedDoc && (
        <div className="space-y-4">
          {/* Search & Actions Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="ค้นหาชื่อเอกสาร, เลขที่หนังสือ เช่น ว 3482, ความเสี่ยง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มเอกสารใหม่</span>
              </button>
            )}
          </div>

          {/* Table / List of Documents */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">ลำดับ</th>
                    <th className="py-3.5 px-4 w-48">เลขที่หนังสือ</th>
                    <th className="py-3.5 px-4 min-w-[280px]">ชื่อเรื่อง / สาระสำคัญ</th>
                    <th className="py-3.5 px-4 w-36">วันที่ลงนาม</th>
                    <th className="py-3.5 px-4 w-32 text-center">ขนาดเอกสาร</th>
                    <th className="py-3.5 px-4 w-44 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDocs.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 text-center font-bold text-slate-500 group-hover:text-blue-600">
                        {idx + 1}
                      </td>

                      <td className="py-4 px-4 font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                        <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                          {doc.code}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-snug">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          เรื่อง: {doc.topic}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.date}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {doc.pages} ({doc.fileSize})
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedDocId(doc.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                            title="คลิกเพื่อเปิดดูรายละเอียดและอ่านเอกสาร"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>เปิดดูเอกสาร</span>
                          </button>

                          <a
                            href={doc.pdfUrl}
                            download={doc.downloadName}
                            className="inline-flex items-center space-x-1 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                            title="ดาวน์โหลด PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>

                          {isAdmin && !doc.isOfficial && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDoc(doc.id, e)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="ลบเอกสารนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDocs.length === 0 && (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">ไม่พบเอกสารที่ค้นหา</div>
                <div className="text-xs text-slate-500">ลองค้นหาด้วยคำค้นอื่น หรือเพิ่มเอกสารใหม่เข้าสู่ระบบ</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DETAIL VIEW (หน้ารายละเอียดเมื่อกดเข้าไปตามชื่อเอกสาร)
      ========================================================================= */}
      {selectedDoc && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Detailed Header Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>เอกสารทางการกระทรวงมหาดไทย</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                    {selectedDoc.title}
                  </h3>

                  <div className="text-sm font-semibold text-blue-200">
                    เรื่อง: {selectedDoc.topic}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedDoc.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                    <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10 font-mono">
                      📄 ขนาด: {selectedDoc.pages} ({selectedDoc.fileSize})
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-1 rounded-md font-semibold">
                      ✓ วันที่ลงนาม: {selectedDoc.date}
                    </span>
                    {selectedDoc.isOfficial && (
                      <span className="bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-md font-semibold">
                        ★ บังคับใช้ อปท. ทั่วประเทศ
                      </span>
                    )}
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
                    href={selectedDoc.pdfUrl}
                    download={selectedDoc.downloadName}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>ดาวน์โหลดไฟล์ PDF</span>
                  </a>

                  <a
                    href={selectedDoc.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer text-center"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span>เปิดในแท็บใหม่</span>
                  </a>

                  {selectedDoc.hasOnlineForm && setCurrentTab && (
                    <button
                      type="button"
                      onClick={() => setCurrentTab(selectedDoc.onlineFormTab)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>ไปยังระบบกรอกแบบ บส. ๑ - ๕</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Embedded Interactive PDF Viewer */}
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>เอกสารต้นฉบับ: {selectedDoc.title} ({selectedDoc.pages})</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  สามารถเลื่อนอ่าน ย่อ/ขยาย หรือสั่งพิมพ์ผ่านแถบเครื่องมือของเอกสารได้โดยตรง
                </div>
              </div>

              <div className="w-full h-[750px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white shadow-inner">
                <iframe
                  src={`${selectedDoc.pdfUrl}#toolbar=1&navpanes=1`}
                  className="w-full h-full"
                  title={selectedDoc.title}
                />
              </div>

              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  💡 <strong>คำแนะนำ:</strong> ตัวอย่างแบบ บส. ๑ ถึง บส. ๕ อยู่ในหน้า ๕ ถึง หน้า ๙ ของเอกสารฉบับนี้
                </div>
                <div>
                  หากอุปกรณ์ของท่านไม่แสดงตัวอย่างเอกสาร สามารถคลิก <a href={selectedDoc.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">เปิดแท็บใหม่</a> หรือ <a href={selectedDoc.pdfUrl} download className="text-emerald-600 dark:text-emerald-400 underline font-semibold">ดาวน์โหลด PDF</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: เพิ่มเอกสารใหม่ (รองรับอนาคตตามที่แจ้ง)
      ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-bold">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>เพิ่มเอกสารแบบฟอร์มใหม่</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  เลขที่หนังสือ / รหัสเอกสาร <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น มท 0808.2/ว 257 หรือ แบบ ปค. ๑"
                  value={newDocForm.code}
                  onChange={(e) => setNewDocForm({ ...newDocForm, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  ชื่อหนังสือ / ชื่อเอกสาร <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น หนังสือกระทรวงมหาดไทย ด่วนที่สุด ที่ มท 0808.2/ว..."
                  value={newDocForm.title}
                  onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  เรื่อง / หัวข้อ:
                </label>
                <input
                  type="text"
                  placeholder="เช่น หลักเกณฑ์การยืมเงินขององค์กรปกครองส่วนท้องถิ่น"
                  value={newDocForm.topic}
                  onChange={(e) => setNewDocForm({ ...newDocForm, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    วันที่ลงนาม:
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ๑๕ มกราคม ๒๕๖๔"
                    value={newDocForm.date}
                    onChange={(e) => setNewDocForm({ ...newDocForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    จำนวนหน้า / ขนาดไฟล์:
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ๔ หน้า (652 KB)"
                    value={newDocForm.pages}
                    onChange={(e) => setNewDocForm({ ...newDocForm, pages: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  ที่อยู่ไฟล์ PDF (URL หรือ path ในเครื่อง/เว็บ):
                </label>
                <input
                  type="text"
                  placeholder="เช่น /docs/w3482-risk-forms.pdf หรือ /knowledge/know-02-w257.pdf"
                  value={newDocForm.pdfUrl}
                  onChange={(e) => setNewDocForm({ ...newDocForm, pdfUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  คำอธิบายสรุปสาระสำคัญ:
                </label>
                <textarea
                  rows="3"
                  placeholder="สรุปแนวทางปฏิบัติหรือระเบียบสำคัญในเอกสารนี้..."
                  value={newDocForm.description}
                  onChange={(e) => setNewDocForm({ ...newDocForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกเอกสาร
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULLSCREEN PREVIEW MODAL
      ========================================================================= */}
      {pdfModalOpen && selectedDoc && (
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
                    {selectedDoc.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>{selectedDoc.topic} ({selectedDoc.pages})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={selectedDoc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  title="เปิดในแท็บใหม่"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">เปิดแท็บใหม่</span>
                </a>

                <a
                  href={selectedDoc.pdfUrl}
                  download={selectedDoc.downloadName}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  title="ดาวน์โหลด PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ดาวน์โหลด</span>
                </a>

                <button
                  type="button"
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
                src={`${selectedDoc.pdfUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white"
                title={selectedDoc.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
