import React, { useState, useEffect, useMemo } from 'react';
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
  FolderOpen,
  Printer,
  Layers,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { initialOfficialDownloadableForms } from '../data/initialData';
import {
  downloadOfficialFormWord,
  downloadOfficialFormExcel
} from '../services/reportExportService';

const INITIAL_DOCUMENTS = [
  {
    id: 'doc-w3482',
    code: 'มท 0805.2/ว 3482',
    date: '18 สิงหาคม 2566',
    title: 'หนังสือกระทรวงมหาดไทย ด่วนที่สุด ที่ มท 0805.2/ว 3482',
    topic: 'แนวทางการประเมินและบริหารจัดการความเสี่ยงสำหรับองค์กรปกครองส่วนท้องถิ่น (พร้อมแบบ บส. 1 ถึง แบบ บส. 5)',
    category: 'การบริหารความเสี่ยง (ERM)',
    pages: '12 หน้า',
    fileSize: '805 KB',
    pdfUrl: '/docs/w3482-risk-forms.pdf',
    downloadName: 'หนังสือสั่งการ_มท_ว3482_แนวทางบริหารความเสี่ยง_อปท.pdf',
    description: 'รวบรวมแนวทางปฏิบัติการประเมินความเสี่ยง การวิเคราะห์ระดับความเสี่ยง 5x5 พร้อมตัวอย่างแบบฟอร์ม บส.1 (ระบุและประเมินความเสี่ยง), บส.2 (แผนบริหารจัดการความเสี่ยง), บส.3 (รายงานรอบ 6 เดือน), บส.4 (รายงานรอบ 12 เดือน) และ บส.5 (รายงานภาพรวมระดับ อปท.) พร้อมคำอธิบายหมายเลขกำกับทุกขั้นตอน',
    hasOnlineForm: true,
    onlineFormTab: 'risk-management',
    isOfficial: true
  }
];

export default function FormsView({
  setCurrentTab,
  session,
  orgProfile = {}
}) {
  const [activeMainTab, setActiveMainTab] = useState('templates'); // 'templates' or 'circulars'
  const [selectedFormCategory, setSelectedFormCategory] = useState('all');
  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Circular Documents State
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_forms_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
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
    pages: '1 หน้า',
    fileSize: 'PDF',
    pdfUrl: '',
    description: ''
  });

  const isAdmin = session?.role === 'admin';

  // Confirm Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'ยืนยัน',
    cancelText: 'ยกเลิก',
    isAlert: false,
    type: 'danger',
    onConfirm: () => {}
  });

  const openConfirmModal = (config) => {
    setConfirmModalConfig({
      isOpen: true,
      title: config.title || 'ยืนยันการทำรายการ',
      message: config.message,
      confirmText: config.confirmText || 'ยืนยัน',
      cancelText: config.cancelText !== undefined ? config.cancelText : 'ยกเลิก',
      isAlert: config.isAlert || false,
      type: config.type || 'danger',
      onConfirm: config.onConfirm || (() => {})
    });
  };

  const closeConfirmModal = () => {
    setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const saveDocsToStorage = (updated) => {
    setDocuments(updated);
    try {
      localStorage.setItem('ia_forms_directory', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadWord = (form) => {
    downloadOfficialFormWord(form.id, orgProfile);
    showToast(`📝 ดาวน์โหลดแบบฟอร์ม Word (${form.code}) เรียบร้อยแล้ว`);
  };

  const handleDownloadExcel = (form) => {
    downloadOfficialFormExcel(form.id, orgProfile);
    showToast(`📗 ดาวน์โหลดแบบฟอร์ม Excel (${form.code}) เรียบร้อยแล้ว`);
  };

  const handlePrintPreview = (form) => {
    window.print();
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDocForm.title || !newDocForm.code) {
      openConfirmModal({
        title: 'กรอกข้อมูลไม่ครบถ้วน',
        message: 'กรุณากรอกเลขที่หนังสือและชื่อเอกสารให้ครบถ้วนก่อนบันทึกเข้าระบบ',
        confirmText: 'ตกลง',
        isAlert: true,
        type: 'warning'
      });
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
      pages: '1 หน้า',
      fileSize: 'PDF',
      pdfUrl: '',
      description: ''
    });
    showToast('บันทึกเอกสารหนังสือสั่งการเข้าระบบแล้ว');
  };

  const handleDeleteDoc = (id, e, docTitle = '') => {
    if (e) e.stopPropagation();
    openConfirmModal({
      title: 'ยืนยันการลบแบบฟอร์ม',
      message: `คุณต้องการลบเอกสาร "${docTitle || 'นี้'}" ออกจากคลังแบบฟอร์มใช่หรือไม่?`,
      confirmText: 'ลบเอกสารนี้',
      type: 'danger',
      onConfirm: () => {
        const updated = documents.filter((d) => d.id !== id);
        saveDocsToStorage(updated);
        if (selectedDocId === id) {
          setSelectedDocId(null);
        }
        showToast('ลบเอกสารเรียบร้อยแล้ว');
      }
    });
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return (initialOfficialDownloadableForms || []).filter((f) => {
      if (selectedFormCategory !== 'all' && f.category !== selectedFormCategory) {
        return false;
      }
      if (formSearchQuery) {
        const q = formSearchQuery.toLowerCase();
        const mCode = f.code.toLowerCase().includes(q);
        const mTitle = f.title.toLowerCase().includes(q);
        const mDesc = f.desc.toLowerCase().includes(q);
        const mRef = f.standardRef?.toLowerCase().includes(q);
        if (!mCode && !mTitle && !mDesc && !mRef) return false;
      }
      return true;
    });
  }, [selectedFormCategory, formSearchQuery]);

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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 border border-slate-700 text-xs font-bold animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>คลังแบบฟอร์มดาวน์โหลดมาตรฐาน & หนังสือสั่งการ (Forms & Regulatory Hub)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            คลังเอกสารและแบบฟอร์มทางการ อปท.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ดาวน์โหลดแบบฟอร์มมาตรฐานราชการในรูปแบบ Microsoft Word (.doc), Excel (.xlsx) และเอกสารคำสั่งการ มท.
          </p>
        </div>

        {/* Tab Switcher: Templates vs Circulars */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMainTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeMainTab === 'templates'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>แบบฟอร์มดาวน์โหลด ({initialOfficialDownloadableForms?.length || 12})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('circulars')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeMainTab === 'circulars'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>หนังสือสั่งการและระเบียบ ({documents.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: OFFICIAL DOWNLOADABLE FORMS (WORD, EXCEL, PRINT)
      ========================================================================= */}
      {activeMainTab === 'templates' && (
        <div className="space-y-4">
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
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedFormCategory}
                onChange={(e) => setSelectedFormCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 font-bold"
              >
                <option value="all">ทุกหมวดหมู่แบบฟอร์ม</option>
                <option value="control">การควบคุมภายใน (กค. 2561)</option>
                <option value="risk">การบริหารความเสี่ยง (ว 3482)</option>
                <option value="procurement">งานพัสดุและจัดซื้อจัดจ้าง (พ.ร.บ. 2560)</option>
                <option value="civil">งานโยธาและราคากลางช่าง</option>
                <option value="clerk">งานสำนักปลัดและยานพาหนะ</option>
                <option value="welfare">งานสวัสดิการสังคมและเบี้ยยังชีพ</option>
                <option value="education">งานการศึกษาและศูนย์เด็กเล็ก</option>
              </select>
            </div>
          </div>

          {/* Form Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((form) => {
              const supportsWord = form.formats?.includes('word');
              const supportsExcel = form.formats?.includes('excel');

              return (
                <div
                  key={form.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                        {form.code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {form.categoryName}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug group-hover:text-blue-600 transition-colors">
                      {form.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {form.desc}
                    </p>

                    {form.standardRef && (
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
                        อ้างอิง: {form.standardRef}
                      </div>
                    )}
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {supportsWord && (
                        <button
                          type="button"
                          onClick={() => handleDownloadWord(form)}
                          className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer"
                          title="ดาวน์โหลดเป็นไฟล์ Microsoft Word (.doc) มาตรฐาน A4"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>ดาวน์โหลด Word</span>
                        </button>
                      )}

                      {supportsExcel && (
                        <button
                          type="button"
                          onClick={() => handleDownloadExcel(form)}
                          className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer"
                          title="ดาวน์โหลดเป็นไฟล์ Microsoft Excel (.xlsx)"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ดาวน์โหลด Excel</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePrintPreview(form)}
                      className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>พิมพ์ / ส่งออก PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <div className="font-bold text-sm text-slate-700 dark:text-slate-300">ไม่พบแบบฟอร์มที่ค้นหา</div>
              <div className="text-xs text-slate-500">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 2: CIRCULAR DOCUMENTS & REGULATIONS (EXISTING LOGIC PRESERVED)
      ========================================================================= */}
      {activeMainTab === 'circulars' && (
        <div className="space-y-4">
          {!selectedDoc ? (
            <div className="space-y-4">
              {/* Search & Actions Bar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
                    <span>เพิ่มเอกสารคำสั่งการ</span>
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
                                className="inline-flex items-center space-x-1 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 transition-all cursor-pointer"
                                title="ดาวน์โหลด PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>

                              {isAdmin && !doc.isOfficial && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteDoc(doc.id, e, doc.title)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
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
              </div>
            </div>
          ) : (
            /* Selected Document Full View */
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 border-b border-blue-200/70 dark:border-slate-800">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-3xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>เอกสารทางการกระทรวงมหาดไทย</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                        {selectedDoc.title}
                      </h3>

                      <div className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-400">
                        เรื่อง: {selectedDoc.topic}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white/80 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200">
                        {selectedDoc.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedDocId(null)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>ย้อนกลับไปหน้ารายการ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPdfModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-blue-100" />
                        <span>เปิดดูเต็มจอ (Preview)</span>
                      </button>

                      <a
                        href={selectedDoc.pdfUrl}
                        download={selectedDoc.downloadName}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-xs transition-all cursor-pointer text-center"
                      >
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>ดาวน์โหลดไฟล์ PDF</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Embedded PDF Viewer */}
                <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-full h-[750px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white shadow-inner">
                    <iframe
                      src={`${selectedDoc.pdfUrl}#toolbar=1&navpanes=1`}
                      className="w-full h-full"
                      title={selectedDoc.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-bold">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>เพิ่มเอกสารแบบฟอร์มคำสั่งการใหม่</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
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
                  placeholder="เช่น มท 0808.2/ว 257 หรือ ว 184"
                  value={newDocForm.code}
                  onChange={(e) => setNewDocForm({ ...newDocForm, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  ชื่อหนังสือ / ชื่อเอกสาร <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น หนังสือกระทรวงมหาดไทย ด่วนที่สุด..."
                  value={newDocForm.title}
                  onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
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
                    placeholder="เช่น 15 มกราคม 2569"
                    value={newDocForm.date}
                    onChange={(e) => setNewDocForm({ ...newDocForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    ที่อยู่ไฟล์ PDF:
                  </label>
                  <input
                    type="text"
                    placeholder="/docs/filename.pdf"
                    value={newDocForm.pdfUrl}
                    onChange={(e) => setNewDocForm({ ...newDocForm, pdfUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  คำอธิบายสรุปสาระสำคัญ:
                </label>
                <textarea
                  rows="3"
                  placeholder="สรุปแนวทางปฏิบัติหรือสาระสำคัญของเอกสารนี้..."
                  value={newDocForm.description}
                  onChange={(e) => setNewDocForm({ ...newDocForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 font-bold"
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

      {/* Fullscreen PDF Modal */}
      {pdfModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {selectedDoc.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPdfModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 overflow-hidden flex flex-col">
              <iframe
                src={`${selectedDoc.pdfUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white"
                title={selectedDoc.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        cancelText={confirmModalConfig.cancelText}
        isAlert={confirmModalConfig.isAlert}
        type={confirmModalConfig.type}
        onConfirm={confirmModalConfig.onConfirm}
        onClose={closeConfirmModal}
      />
    </div>
  );
}
