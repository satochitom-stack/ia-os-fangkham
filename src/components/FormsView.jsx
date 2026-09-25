import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  ExternalLink,
  Eye,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Search,
  Printer,
  X,
  Maximize2,
  FileDown,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { exportBsToWord, exportBsToExcel } from '../utils/exportRiskDocs';

export default function FormsView({
  setCurrentTab,
  selectedYear = '2570',
  selectedDepartment = 'all',
  orgProfile = {},
  session = null,
  riskManagement = null,
  showToast = (msg) => alert(msg)
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState('/docs/w3482-risk-forms.pdf');
  const [previewTitle, setPreviewTitle] = useState('หนังสือสั่งการ มท 0805.2/ว 3482 (แบบ บส. ๑ ถึง แบบ บส. ๕)');
  const [toastMessage, setToastMessage] = useState('');

  const displayToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const isSubDivision = session?.role !== 'admin' && session?.department && session.department !== 'หน่วยตรวจสอบภายใน';

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'risk', label: 'การบริหารความเสี่ยง (บส.๑ - ๕)', count: 5 },
    { id: 'control', label: 'การควบคุมภายใน (ปค.๑, ๔, ๕)', count: 3 },
    { id: 'audit', label: 'กระดาษทำการตรวจสอบ (WP)', count: 4 },
  ];

  // Live export helper for BS forms
  const handleExportBs = (bsType, exportFormat) => {
    if (!riskManagement) {
      displayToast('ระบบกำลังโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
      return;
    }

    const dept = isSubDivision ? session.department : selectedDepartment;
    const filterByDept = (list = []) => {
      if (dept === 'all') return list;
      return list.filter((item) => item.department === dept);
    };

    const bs1 = filterByDept(riskManagement.bs1);
    const bs2 = filterByDept(riskManagement.bs2);
    const bs3 = filterByDept(riskManagement.bs3);
    const bs4 = filterByDept(riskManagement.bs4);
    const bs5 = riskManagement.bs5 || [];

    const params = {
      activeTab: bsType,
      filteredBs1: bs1,
      filteredBs2: bs2,
      filteredBs3: bs3,
      filteredBs4: bs4,
      filteredBs5: bs5,
      bs4Summary: riskManagement.bs4Summary,
      bs5Data: riskManagement.bs5Data,
      selectedYear,
      selectedDepartment: dept,
      orgProfile,
      isSubDivision
    };

    try {
      if (exportFormat === 'word') {
        exportBsToWord(params);
        displayToast(`ดาวน์โหลดแบบ ${bsType.toUpperCase()} ในรูปแบบ Word (.doc) สำเร็จ`);
      } else {
        exportBsToExcel(params);
        displayToast(`ดาวน์โหลดแบบ ${bsType.toUpperCase()} ในรูปแบบ Excel (.xls) สำเร็จ`);
      }
    } catch (e) {
      console.error(e);
      displayToast('เกิดข้อผิดพลาดในการสร้างไฟล์');
    }
  };

  const formList = [
    {
      id: 'bs1',
      code: 'แบบ บส. ๑',
      category: 'risk',
      title: 'แบบระบุและประเมินความเสี่ยง',
      legalRef: 'มท 0805.2/ว 3482 ลว. 18 ส.ค. 2566',
      desc: 'ระบุภารกิจตามกฎหมาย วัตถุประสงค์ เหตุการณ์ความเสี่ยง ปัจจัยเสี่ยง การควบคุมเดิม และประเมินโอกาส/ผลกระทบเพื่อคำนวณระดับความเสี่ยง (LxI)',
      recommendedFor: 'ทุกสำนัก/กอง (ผู้รับตรวจ) จัดทำต้นปีงบประมาณ',
      pdfPage: 'หน้าที่ 5',
      targetTab: 'risk-management',
      hasDataExport: true
    },
    {
      id: 'bs2',
      code: 'แบบ บส. ๒',
      category: 'risk',
      title: 'แผนบริหารจัดการความเสี่ยง',
      legalRef: 'มท 0805.2/ว 3482 ลว. 18 ส.ค. 2566',
      desc: 'กำหนดกิจกรรม/มาตรการจัดการความเสี่ยง วิธีการควบคุมเพิ่มเติม ผู้รับผิดชอบ และกรอบระยะเวลาแล้วเสร็จสำหรับความเสี่ยงระดับสูง-สูงมาก',
      recommendedFor: 'ทุกสำนัก/กอง จัดทำพร้อมแบบ บส.๑',
      pdfPage: 'หน้าที่ 6',
      targetTab: 'risk-management',
      hasDataExport: true
    },
    {
      id: 'bs3',
      code: 'แบบ บส. ๓',
      category: 'risk',
      title: 'รายงานผลการบริหารจัดการความเสี่ยง (รอบ ๖ เดือน)',
      legalRef: 'มท 0805.2/ว 3482 ลว. 18 ส.ค. 2566',
      desc: 'รายงานความคืบหน้าการปฏิบัติตามแผน บส.๒ รอบ 6 เดือน (ต.ค. - มี.ค.) พร้อมประเมินสถานะและระดับความเสี่ยงที่เหลืออยู่ (Residual Risk)',
      recommendedFor: 'ทุกสำนัก/กอง รายงานภายในเดือนเมษายน',
      pdfPage: 'หน้าที่ 7',
      targetTab: 'risk-management',
      hasDataExport: true
    },
    {
      id: 'bs4',
      code: 'แบบ บส. ๔',
      category: 'risk',
      title: 'รายงานผลการบริหารจัดการความเสี่ยง (รอบ ๑๒ เดือน)',
      legalRef: 'มท 0805.2/ว 3482 ลว. 18 ส.ค. 2566',
      desc: 'รายงานสรุปผลการปฏิบัติตามแผน บส.๒ ตลอดทั้งปีงบประมาณ (ต.ค. - ก.ย.) พร้อมสรุปจำนวนความเสี่ยงที่ลดลงตามเป้าหมาย',
      recommendedFor: 'ทุกสำนัก/กอง รายงานภายในเดือนตุลาคม',
      pdfPage: 'หน้าที่ 8',
      targetTab: 'risk-management',
      hasDataExport: true
    },
    {
      id: 'bs5',
      code: 'แบบ บส. ๕',
      category: 'risk',
      title: 'รายงานการประเมินผลการบริหารจัดการความเสี่ยงในภาพรวมของ อปท.',
      legalRef: 'มท 0805.2/ว 3482 ลว. 18 ส.ค. 2566',
      desc: 'สรุปภาพรวมการบริหารความเสี่ยงทุกหน่วยงาน เสนอต่อนายก อปท. พร้อมผลสัมฤทธิ์ ปัญหาอุปสรรค และข้อเสนอแนะพัฒนาในปีถัดไป',
      recommendedFor: 'หน่วยตรวจสอบภายใน / คณะกรรมการบริหารความเสี่ยง รวบรวมส่งผู้บริหาร',
      pdfPage: 'หน้าที่ 9',
      targetTab: 'risk-management',
      hasDataExport: true
    },
    {
      id: 'pk1',
      code: 'แบบ ปค. ๑',
      category: 'control',
      title: 'หนังสือรับรองการปฏิบัติตามมาตรฐานการควบคุมภายใน',
      legalRef: 'หลักเกณฑ์กระทรวงการคลัง พ.ศ. ๒๕๖๑',
      desc: 'หนังสือรับรองความถูกต้องครบถ้วนและประสิทธิผลของระบบการควบคุมภายในระดับองค์กร เสนอต่อนายก อปท. และส่งผู้ว่าราชการจังหวัด/สตง.',
      recommendedFor: 'นายก อปท. และคณะกรรมการควบคุมภายใน',
      targetTab: 'internal-control',
      hasDataExport: false
    },
    {
      id: 'pk4',
      code: 'แบบ ปค. ๔',
      category: 'control',
      title: 'รายงานการประเมินองค์ประกอบของการควบคุมภายใน (๕ ด้าน)',
      legalRef: 'หลักเกณฑ์กระทรวงการคลัง พ.ศ. ๒๕๖๑',
      desc: 'ประเมิน 5 องค์ประกอบ: สภาพแวดล้อมการควบคุม, การประเมินความเสี่ยง, กิจกรรมการควบคุม, สารสนเทศและการสื่อสาร, และการติดตามประเมินผล',
      recommendedFor: 'ทุกสำนัก/กอง ประเมินตนเองรายปี',
      targetTab: 'internal-control',
      hasDataExport: false
    },
    {
      id: 'pk5',
      code: 'แบบ ปค. ๕',
      category: 'control',
      title: 'รายงานการประเมินผลและการปรับปรุงการควบคุมภายใน',
      legalRef: 'หลักเกณฑ์กระทรวงการคลัง พ.ศ. ๒๕๖๑',
      desc: 'ระบุจุดอ่อน/ความเสี่ยงของการควบคุมเดิม มาตรการปรับปรุง กำหนดเวลาเสร็จ และผู้รับผิดชอบตามเกณฑ์ กค.',
      recommendedFor: 'ทุกสำนัก/กอง ส่งหน่วยตรวจสอบภายใน',
      targetTab: 'internal-control',
      hasDataExport: false
    },
    {
      id: 'wp-borrow',
      code: 'WP-01',
      category: 'audit',
      title: 'กระดาษทำการตรวจสอบเงินยืมและหนี้ค้างชำระ (ว 257)',
      legalRef: 'มท 0808.2/ว 257 & ระเบียบการรับเงินจ่ายเงิน อปท.',
      desc: 'ตารางตรวจสอบสัญญาเงินยืม วันครบกำหนด 30 วัน การติดตามทวงหนี้ และการตั้งงบประมาณชดใช้เงินยืมคงค้าง',
      recommendedFor: 'ผู้ตรวจสอบภายใน ใช้ตรวจกองคลัง',
      targetTab: 'execution',
      hasDataExport: false
    },
    {
      id: 'wp-procurement',
      code: 'WP-02',
      category: 'audit',
      title: 'กระดาษทำการสุ่มตรวจจัดซื้อจัดจ้างและการบริหารพัสดุ',
      legalRef: 'พ.ร.บ. จัดซื้อจัดจ้างฯ 2560 & หนังสือสั่งการ กค.',
      desc: 'แบบตรวจสอบกระบวนการจัดซื้อจัดจ้าง การคำนวณราคากลาง การทำสัญญา การตรวจรับ และการเบิกจ่ายเงินงวด',
      recommendedFor: 'ผู้ตรวจสอบภายใน ใช้ตรวจงานพัสดุกองคลัง/กองช่าง',
      targetTab: 'execution',
      hasDataExport: false
    },
    {
      id: 'wp-rent',
      code: 'WP-03',
      category: 'audit',
      title: 'แบบตรวจสอบสิทธิและการเบิกจ่ายเงินค่าเช่าบ้านข้าราชการ',
      legalRef: 'ระเบียบ มท. ค่าเช่าบ้านข้าราชการส่วนท้องถิ่น พ.ศ. 2548',
      desc: 'แบบตรวจสอบคุณสมบัติการมีสิทธิเบิก การเช่าซื้อ สัญญาเช่า และการไม่ทับซ้อนกับบ้านพักของทางราชการ',
      recommendedFor: 'ผู้ตรวจสอบภายใน ใช้ตรวจสำนักปลัดและกองคลัง',
      targetTab: 'execution',
      hasDataExport: false
    },
    {
      id: 'wp-lead',
      code: 'WP-LEAD',
      category: 'audit',
      title: 'ใบปะหน้ากระดาษทำการตรวจสอบ (Lead Schedule)',
      legalRef: 'มาตรฐานการปฏิบัติงานตรวจสอบภายใน อปท.',
      desc: 'แบบฟอร์มบันทึกสรุปวัตถุประสงค์ ขอบเขตการตรวจ เอกสารอ้างอิง ผลการสุ่มตรวจ และลายมือชื่อผู้จัดทำ/ผู้สอบทาน',
      recommendedFor: 'ผู้ตรวจสอบภายใน ใช้ปะหน้าแฟ้มตรวจทุกเรื่อง',
      targetTab: 'execution',
      hasDataExport: false
    }
  ];

  const filteredForms = formList.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.legalRef.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const openPdfViewer = (title = 'หนังสือสั่งการ มท 0805.2/ว 3482', url = '/docs/w3482-risk-forms.pdf') => {
    setPreviewTitle(title);
    setPreviewDocUrl(url);
    setPdfModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          FEATURED HERO: หนังสือสั่งการ มท 0805.2/ว 3482 (Official Directive & Forms)
      ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-blue-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>เอกสารทางการกระทรวงมหาดไทย (ฉบับหลักที่ใช้งาน)</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              หนังสือกระทรวงมหาดไทย ด่วนที่สุด ที่ มท ๐๘๐๕.๒/ว ๓๔๘๒
            </h2>

            <p className="text-sm font-semibold text-blue-200">
              เรื่อง แนวทางการประเมินและบริหารจัดการความเสี่ยงสำหรับองค์กรปกครองส่วนท้องถิ่น (พร้อมแบบ บส. ๑ - แบบ บส. ๕)
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              ลงวันที่ ๑๘ สิงหาคม ๒๕๖๖ เอกสารต้นฉบับ ๑๒ หน้า ประกอบด้วยคำสั่งการ คำอธิบายวิธีจัดทำ Matrix ความเสี่ยง ๕x๕
              และตัวอย่างแบบฟอร์ม บส.๑ ถึง บส.๕ พร้อมคำอธิบายหมายเลขกำกับทุกขั้นตอน
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10 font-mono">
                📄 ขนาดไฟล์: 805 KB (PDF 12 หน้า)
              </span>
              <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-1 rounded-md font-semibold">
                ✓ บรรจุแบบ บส.๑ - ๕ ครบชุด
              </span>
              <span className="bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-md font-semibold">
                ★ บังคับใช้ อปท. ทั่วประเทศ
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => openPdfViewer()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:shadow-blue-500/30"
            >
              <Eye className="w-4 h-4" />
              <span>เปิดดูเอกสาร PDF (Preview)</span>
            </button>

            <a
              href="/docs/w3482-risk-forms.pdf"
              download="หนังสือสั่งการ_มท_ว3482_แนวทางบริหารความเสี่ยง_อปท.pdf"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>ดาวน์โหลดไฟล์ PDF (ว ๓๔๘๒)</span>
            </a>

            {setCurrentTab && (
              <button
                onClick={() => setCurrentTab('risk-management')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                <span>ไปยังระบบกรอกแบบ บส. ๑ - ๕</span>
                <ChevronRight className="w-4 h-4 text-blue-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEARCH & FILTER HEADER
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-0.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>ศูนย์รวมแบบฟอร์มมาตรฐาน (Standard Forms & Working Papers)</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              ดาวน์โหลดแบบฟอร์มทางการ และเข้าสู่ระบบจัดทำเอกสาร
            </h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ค้นหาแบบฟอร์ม เช่น บส.๑, ปค.๕, ว 3482, เงินยืม, จัดซื้อจัดจ้าง..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-xs bg-slate-50/50 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          FORMS GRID
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                  {item.code}
                </span>

                {item.category === 'risk' && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    ว ๓๔๘๒ {item.pdfPage || ''}
                  </span>
                )}
                {item.category === 'control' && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    กค. ๒๕๖๑
                  </span>
                )}
                {item.category === 'audit' && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    กระดาษทำการ
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {item.title}
                </h4>
                <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium mt-0.5">
                  อ้างอิง: {item.legalRef}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/70 dark:bg-slate-950/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {item.desc}
              </p>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 pt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">หน่วยจัดทำ:</span>
                <span>{item.recommendedFor}</span>
              </div>
            </div>

            {/* Actions for this form */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              {/* If Risk Form (BS.1 - 5) */}
              {item.category === 'risk' && (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleExportBs(item.id, 'word')}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold transition-all cursor-pointer"
                      title="ดาวน์โหลดเป็นไฟล์ Word (.doc)"
                    >
                      <FileDown className="w-3.5 h-3.5 text-blue-600" />
                      <span>โหลด Word</span>
                    </button>

                    <button
                      onClick={() => handleExportBs(item.id, 'excel')}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-all cursor-pointer"
                      title="ดาวน์โหลดเป็นไฟล์ Excel (.xls)"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>โหลด Excel</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <button
                      onClick={() => openPdfViewer(`ตัวอย่าง ${item.code} ในหนังสือสั่งการ ว 3482`)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ดูตัวอย่างใน ว ๓๔๘๒</span>
                    </button>

                    {setCurrentTab && (
                      <button
                        onClick={() => setCurrentTab('risk-management')}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        <span>กรอกข้อมูลในระบบ</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* If Internal Control (PK) */}
              {item.category === 'control' && (
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    ตามแบบกระทรวงการคลัง
                  </span>
                  {setCurrentTab && (
                    <button
                      onClick={() => setCurrentTab('internal-control')}
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      <span>ไปยังระบบ ปค.๔ / ปค.๕</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* If Audit Working Paper (WP) */}
              {item.category === 'audit' && (
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    กระดาษทำการปี {selectedYear}
                  </span>
                  {setCurrentTab && (
                    <button
                      onClick={() => setCurrentTab('execution')}
                      className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                    >
                      <span>ไปยังห้องปฏิบัติการตรวจ</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-2">
          <FileSpreadsheet className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">ไม่พบแบบฟอร์มที่ค้นหา</div>
          <div className="text-xs">ลองค้นหาด้วยคำค้นอื่น เช่น บส., ปค., ว 3482, เงินยืม</div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE PDF PREVIEW MODAL
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
                    {previewTitle}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>หนังสือสั่งการ มท 0805.2/ว 3482 (12 หน้า)</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">พร้อมเปิดดูและดาวน์โหลด</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={previewDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  title="เปิดในแท็บใหม่เต็มจอ"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">เปิดแท็บใหม่</span>
                </a>

                <a
                  href={previewDocUrl}
                  download="หนังสือสั่งการ_มท_ว3482_แนวทางบริหารความเสี่ยง_อปท.pdf"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  title="ดาวน์โหลดไฟล์ PDF เก็บไว้ในเครื่อง"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ดาวน์โหลด PDF</span>
                </a>

                <button
                  onClick={() => setPdfModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="ปิดหน้าต่าง"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Embedded Iframe Viewer */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-1 sm:p-2 overflow-hidden flex flex-col">
              <iframe
                src={`${previewDocUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white"
                title={previewTitle}
              />
            </div>

            {/* Modal Footer Quick Tips */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                💡 คำแนะนำ: หน้ารวมแบบฟอร์ม บส.๑-๕ อยู่ระหว่าง <span className="font-bold text-slate-700 dark:text-slate-200">หน้า ๕ ถึง หน้า ๙</span> และคำอธิบายการกรอกอยู่ท้ายแบบแต่ละฉบับ
              </div>
              <div className="text-right">
                หากเบราว์เซอร์ไม่แสดงไฟล์ สามารถคลิกปุ่ม <span className="font-semibold text-blue-600 dark:text-blue-400">"เปิดแท็บใหม่"</span> หรือ <span className="font-semibold text-blue-600 dark:text-blue-400">"ดาวน์โหลด PDF"</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 dark:bg-slate-950/90 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 border border-slate-700/60 dark:border-slate-800 text-xs font-bold animate-slide-up ring-1 ring-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
