import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Copy,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { callGeminiApi, isGeminiConfigured } from '../services/geminiAiService';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

function getTodayThaiDate() {
  const d = new Date();
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}

export default function AutoSarabanView({
  selectedYear = '2570',
  orgProfile = {},
  annualPlans = [],
  capaFindings = [],
  riskManagement = {},
  pbcRequests = []
}) {
  const orgName = orgProfile.name || 'องค์การบริหารส่วนตำบลฝางคำ';
  const auditorName = orgProfile.auditorName || 'หน่วยตรวจสอบภายใน';
  const auditorPos = orgProfile.auditorPosition || 'นักวิชาการตรวจสอบภายในปฏิบัติการ';
  const approverName = orgProfile.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ';
  const approverPos = orgProfile.approverPosition || `นายก${orgName}`;
  const palatName = orgProfile.palatName || 'ปลัดองค์การบริหารส่วนตำบลฝางคำ';

  const templates = useMemo(() => {
    const planLines =
      annualPlans.length > 0
        ? annualPlans.map((p, i) => `   ${i + 1}. ${p.topic || p.title || p.activity} (${p.department || 'ทุกกอง'} - ${p.quarter || 'ตามกำหนด'})`).join('\n')
        : '   1. การตรวจสอบระบบการรับ-จ่ายเงินผ่าน KTB Corporate Online (กองคลัง)\n   2. การตรวจสอบการจัดซื้อจัดจ้างและการบริหารสัญญา (กองคลัง / กองช่าง)';

    const openCapas = capaFindings.filter((c) => c.status !== 'verified_closed' && c.status !== 'closed');
    const capaLines =
      openCapas.length > 0
        ? openCapas.map((c, i) => `   ${i + 1}. [${c.code || `CAPA-${i + 1}`}] ${c.topic} (${c.department}) — ข้อเสนอแนะ: ${c.recommendation || '-'}`).join('\n')
        : '   1. (ระบุข้อตรวจพบและข้อเสนอแนะที่อยู่ระหว่างการติดตาม)';

    const bs1Count = Array.isArray(riskManagement?.bs1) ? riskManagement.bs1.length : 0;
    const pbcPending = pbcRequests.filter((r) => r.status !== 'approved');
    const pbcLines =
      pbcPending.length > 0
        ? pbcPending.slice(0, 8).map((r, i) => `   ${i + 1}. ${r.documentName} (${r.department})`).join('\n')
        : '   1. เอกสารฎีกาเบิกจ่ายและทะเบียนคุมที่เกี่ยวข้อง\n   2. คำสั่งแต่งตั้งคณะกรรมการและรายงานผลการดำเนินงาน';

    return {
      approve_plan: {
        label: '1. ขออนุมัติแผนการตรวจสอบภายในประจำปี',
        docNo: 'อบ 74501/ตสน.',
        subject: `ขออนุมัติแผนการตรวจสอบภายในประจำปีงบประมาณ พ.ศ. ${selectedYear}`,
        recipient: approverPos,
        body: `ตามระเบียบกระทรวงการคลังว่าด้วยมาตรฐานและหลักเกณฑ์ปฏิบัติการตรวจสอบภายในสำหรับหน่วยงานของรัฐ พ.ศ. 2561 และที่แก้ไขเพิ่มเติม กำหนดให้หน่วยตรวจสอบภายในจัดทำแผนการตรวจสอบประจำปีโดยพิจารณาจากผลการประเมินความเสี่ยง และเสนอต่อหัวหน้าหน่วยงานของรัฐเพื่อพิจารณาอนุมัติก่อนเริ่มปีงบประมาณ นั้น

ในการนี้ หน่วยตรวจสอบภายใน ${orgName} ได้ดำเนินการประเมินความเสี่ยงตามเกณฑ์ SOFCK ครบทุกส่วนราชการ และจัดทำแผนการตรวจสอบภายในประจำปีงบประมาณ พ.ศ. ${selectedYear} เรียบร้อยแล้ว โดยมีโครงการตรวจสอบเป้าหมาย จำนวน ${annualPlans.length || 2} โครงการ ดังนี้
${planLines}

จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติแผนการตรวจสอบภายในประจำปีงบประมาณ พ.ศ. ${selectedYear} เพื่อใช้เป็นกรอบแนวทางในการปฏิบัติงานตรวจสอบภายในต่อไป`
      },
      entrance_notice: {
        label: '2. แจ้งขอเข้าปฏิบัติงานตรวจสอบ (Entrance Letter)',
        docNo: 'อบ 74501/ตสน.',
        subject: `แจ้งกำหนดการเข้าปฏิบัติงานตรวจสอบภายใน ประจำปีงบประมาณ พ.ศ. ${selectedYear} และขอความอนุเคราะห์เอกสาร`,
        recipient: 'ผู้อำนวยการกองคลัง / หัวหน้าส่วนราชการที่เกี่ยวข้อง',
        body: `ตามที่ ${approverPos} ได้อนุมัติแผนการตรวจสอบภายในประจำปีงบประมาณ พ.ศ. ${selectedYear} เพื่อสอบทานความเพียงพอของระบบการควบคุมภายในและการปฏิบัติตามกฎหมาย ระเบียบ หนังสือสั่งการที่เกี่ยวข้อง นั้น

หน่วยตรวจสอบภายในจึงขอแจ้งกำหนดการเข้าปฏิบัติงานตรวจสอบภายใน ณ ส่วนราชการของท่าน และขอความอนุเคราะห์จัดเตรียมเอกสารหลักฐานประกอบการตรวจสอบ (PBC Checklist) ดังรายการต่อไปนี้
${pbcLines}

ทั้งนี้ หน่วยตรวจสอบภายในใคร่ขอความร่วมมือจัดเตรียมเอกสารดังกล่าวให้พร้อมภายใน 7 วันทำการ เพื่อประโยชน์ในการปฏิบัติงานตรวจสอบให้เป็นไปด้วยความเรียบร้อยและรวดเร็ว จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์`
      },
      capa_followup: {
        label: '3. ติดตามผลการแก้ไขข้อทักท้วง/ข้อเสนอแนะ (CAPA)',
        docNo: 'อบ 74501/ตสน.',
        subject: `ขอติดตามผลการดำเนินการปรับปรุงแก้ไขตามข้อเสนอแนะการตรวจสอบภายใน ประจำปีงบประมาณ พ.ศ. ${selectedYear}`,
        recipient: approverPos,
        body: `ตามที่หน่วยตรวจสอบภายในได้เสนอรายงานผลการตรวจสอบภายใน พร้อมข้อตรวจพบและข้อเสนอแนะเพื่อให้ส่วนราชการที่รับตรวจดำเนินการปรับปรุงแก้ไขข้อบกพร่องและรายงานผลภายในระยะเวลาที่กำหนด นั้น

บัดนี้ หน่วยตรวจสอบภายในได้ตรวจสอบสถานะการติดตามข้อทักท้วง (CAPA) ประจำปีงบประมาณ พ.ศ. ${selectedYear} พบว่ายังมีประเด็นที่อยู่ระหว่างดำเนินการปรับปรุงแก้ไข จำนวน ${openCapas.length} รายการ ดังนี้
${capaLines}

จึงเรียนมาเพื่อโปรดพิจารณาแจ้งส่วนราชการที่เกี่ยวข้องเร่งรัดดำเนินการปรับปรุงแก้ไขและรายงานผลการดำเนินการพร้อมแนบเอกสารหลักฐานให้หน่วยตรวจสอบภายในทราบเพื่อสอบทานปิดประเด็นต่อไป`
      },
      risk_report: {
        label: '4. รายงานผลการจัดทำแผนบริหารความเสี่ยง (ว 3482)',
        docNo: 'อบ 74501/ตสน.',
        subject: `รายงานผลการจัดทำแผนการบริหารจัดการความเสี่ยง (แบบ บส.1 - บส.5) ประจำปีงบประมาณ พ.ศ. ${selectedYear}`,
        recipient: approverPos,
        body: `ตามหนังสือกระทรวงมหาดไทย ที่ มท 0805.2/ว 3482 เรื่อง แนวทางการบริหารจัดการความเสี่ยงสำหรับองค์กรปกครองส่วนท้องถิ่น กำหนดให้องค์กรปกครองส่วนท้องถิ่นจัดทำแผนการบริหารจัดการความเสี่ยง ติดตามประเมินผล และทบทวนแผนอย่างต่อเนื่อง นั้น

คณะทำงานบริหารจัดการความเสี่ยงและหน่วยตรวจสอบภายใน ${orgName} ได้รวบรวมและสอบทานแบบรายงานการบริหารจัดการความเสี่ยง (แบบ บส.1 ถึง บส.5) ประจำปีงบประมาณ พ.ศ. ${selectedYear} จากทุกส่วนราชการ รวมทั้งสิ้น ${bs1Count} ประเด็นความเสี่ยง เรียบร้อยแล้ว

จึงเรียนมาเพื่อโปรดพิจารณาลงนามอนุมัติรายงานการบริหารจัดการความเสี่ยงประจำปีงบประมาณ พ.ศ. ${selectedYear} เพื่อประกาศใช้และรายงานต่อหน่วยงานที่เกี่ยวข้องตามระเบียบต่อไป`
      },
      audit_report: {
        label: '5. เสนอรายงานผลการตรวจสอบภายในต่อผู้บริหาร',
        docNo: 'อบ 74501/ตสน.',
        subject: `รายงานผลการตรวจสอบภายใน ประจำปีงบประมาณ พ.ศ. ${selectedYear}`,
        recipient: approverPos,
        body: `ตามแผนการตรวจสอบภายในประจำปีงบประมาณ พ.ศ. ${selectedYear} ที่ได้รับอนุมัติ หน่วยตรวจสอบภายในได้ดำเนินการตรวจสอบการปฏิบัติงาน การเงิน การบัญชี และระบบการควบคุมภายในของส่วนราชการตามมาตรฐานการตรวจสอบภายในภาครัฐเสร็จสิ้นแล้ว นั้น

หน่วยตรวจสอบภายในจึงขอเสนอรายงานผลการตรวจสอบภายใน พร้อมข้อสังเกตและข้อเสนอแนะเชิงสร้างสรรค์ เพื่อยกระดับประสิทธิภาพการปฏิบัติงาน การบริหารความเสี่ยง และการกำกับดูแลกิจการที่ดีของ ${orgName} รายละเอียดปรากฏตามเอกสารที่แนบมาพร้อมนี้

จึงเรียนมาเพื่อโปรดพิจารณาและสั่งการให้ส่วนราชการที่เกี่ยวข้องนำข้อเสนอแนะไปดำเนินการปรับปรุงแก้ไขต่อไป`
      }
    };
  }, [selectedYear, orgName, approverPos, annualPlans, capaFindings, riskManagement, pbcRequests]);

  const [selectedTemplateKey, setSelectedTemplateKey] = useState('approve_plan');
  const [docNo, setDocNo] = useState(templates.approve_plan.docNo);
  const [docDate, setDocDate] = useState(getTodayThaiDate());
  const [subject, setSubject] = useState(templates.approve_plan.subject);
  const [recipient, setRecipient] = useState(templates.approve_plan.recipient);
  const [bodyText, setBodyText] = useState(templates.approve_plan.body);
  const [isPolishing, setIsPolishing] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const applyTemplate = (key) => {
    const t = templates[key];
    if (!t) return;
    setSelectedTemplateKey(key);
    setDocNo(t.docNo);
    setSubject(t.subject);
    setRecipient(t.recipient);
    setBodyText(t.body);
  };

  const handleAiPolish = async () => {
    if (!isGeminiConfigured()) {
      showToast('ยังไม่ได้ตั้งค่า Gemini API Key (สามารถใช้งานและแก้ไขร่างหนังสือได้ทันทีโดยไม่ต้องใช้ AI)');
      return;
    }
    setIsPolishing(true);
    try {
      const prompt = `ช่วยเกลาสำนวนบันทึกข้อความราชการไทยต่อไปนี้ให้สละสลวย ถูกต้องตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ โดยคงข้อเท็จจริง ตัวเลข และลำดับข้อเดิมไว้ครบถ้วน (ตอบกลับเฉพาะเนื้อหาบันทึกข้อความ ไม่ต้องใส่คำอธิบายเพิ่มเติม):\n\nเรื่อง: ${subject}\n\n${bodyText}`;
      const polished = await callGeminiApi({ prompt });
      if (polished && polished.trim().length > 20) {
        setBodyText(polished.trim());
        showToast('✓ AI เกลาสำนวนหนังสือราชการเรียบร้อยแล้ว');
      }
    } catch (err) {
      showToast(`ไม่สามารถเรียก AI ได้: ${err.message}`);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleExportWord = () => {
    const escapeHtml = (s = '') =>
      String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const paragraphsHtml = bodyText
      .split(/\n\s*\n/)
      .map(
        (p) =>
          `<p style="text-indent: 2.5cm; margin: 0 0 8pt 0; text-align: justify; line-height: 1.35;">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`
      )
      .join('');

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          @page Section1 { size: 21.0cm 29.7cm; margin: 2.0cm 2.0cm 2.0cm 3.0cm; }
          div.Section1 { page: Section1; }
          body { font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', sans-serif; font-size: 16pt; color: #000000; }
        </style>
      </head>
      <body>
        <div class="Section1">
          <div style="text-align: center; font-size: 26pt; font-weight: bold; margin-bottom: 10pt;">บันทึกข้อความ</div>
          <p style="margin: 0 0 4pt 0;"><b>ส่วนราชการ</b> &nbsp;&nbsp;หน่วยตรวจสอบภายใน ${escapeHtml(orgName)}</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 4pt;">
            <tr>
              <td style="width: 55%; font-size: 16pt; border: none; padding: 0;"><b>ที่</b> &nbsp;&nbsp;${escapeHtml(docNo)}</td>
              <td style="width: 45%; font-size: 16pt; border: none; padding: 0;"><b>วันที่</b> &nbsp;&nbsp;${escapeHtml(docDate)}</td>
            </tr>
          </table>
          <p style="margin: 0 0 8pt 0; border-bottom: 1.5pt solid #000; padding-bottom: 6pt;"><b>เรื่อง</b> &nbsp;&nbsp;${escapeHtml(subject)}</p>
          <p style="margin: 8pt 0 8pt 0;"><b>เรียน</b> &nbsp;&nbsp;${escapeHtml(recipient)}</p>
          ${paragraphsHtml}
          <table style="width: 100%; margin-top: 24pt; border: none;">
            <tr>
              <td style="width: 45%; border: none;"></td>
              <td style="width: 55%; text-align: center; font-size: 16pt; border: none;">
                ลงชื่อ.......................................................<br/>
                (${escapeHtml(auditorName)})<br/>
                ${escapeHtml(auditorPos)}
              </td>
            </tr>
          </table>
          <table style="width: 100%; margin-top: 24pt; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; vertical-align: top; font-size: 15pt; border: 0.5pt solid #000; padding: 8pt;">
                <b>ความเห็นปลัดองค์กรปกครองส่วนท้องถิ่น</b><br/>
                [ &nbsp; ] เห็นควรอนุมัติ &nbsp;&nbsp; [ &nbsp; ] อื่น ๆ .......................<br/><br/>
                <div style="text-align: center;">
                  ลงชื่อ.............................................<br/>
                  (${escapeHtml(palatName)})<br/>
                  ปลัด${escapeHtml(orgName)}
                </div>
              </td>
              <td style="width: 50%; vertical-align: top; font-size: 15pt; border: 0.5pt solid #000; padding: 8pt;">
                <b>คำสั่งผู้บริหารท้องถิ่น</b><br/>
                [ &nbsp; ] อนุมัติ &nbsp;&nbsp; [ &nbsp; ] ทราบ/ดำเนินการตามเสนอ<br/><br/>
                <div style="text-align: center;">
                  ลงชื่อ.............................................<br/>
                  (${escapeHtml(approverName)})<br/>
                  ${escapeHtml(approverPos)}
                </div>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `บันทึกข้อความ_${selectedTemplateKey}_ปี${selectedYear}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ ดาวน์โหลดไฟล์บันทึกข้อความ Word (.doc ฟอนต์ TH Sarabun New 16pt) เรียบร้อยแล้ว');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 rounded-2xl p-6 border border-emerald-200/80 dark:border-emerald-900/40 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <FileText className="w-3.5 h-3.5" />
            <span>Auto Saraban • ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            ระบบร่างบันทึกข้อความราชการอัตโนมัติ (Auto Saraban)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            ดึงข้อมูลจริงจากแผนตรวจสอบ, CAPA, บส.1-5 และ PBC มาสร้างบันทึกข้อความพร้อมส่งออกไฟล์ Word (TH Sarabun New 16pt) เสนอลงนามได้ทันที
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAiPolish}
            disabled={isPolishing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow-xs"
          >
            {isPolishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>ให้ AI เกลาสำนวนราชการ</span>
          </button>
          <button
            type="button"
            onClick={handleExportWord}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด Word (.doc)</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Template Selector */}
      <div className="flex flex-wrap gap-2 no-print">
        {Object.entries(templates).map(([key, t]) => (
          <button
            key={key}
            type="button"
            onClick={() => applyTemplate(key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedTemplateKey === key
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Pane */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs no-print">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">แก้ไขรายละเอียดหนังสือ</h3>
            <button
              type="button"
              onClick={() => applyTemplate(selectedTemplateKey)}
              className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>รีเซ็ตจากข้อมูลล่าสุด</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">ที่ (เลขหนังสือ)</label>
              <input
                type="text"
                value={docNo}
                onChange={(e) => setDocNo(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">วันที่</label>
              <input
                type="text"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">เรื่อง</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">เรียน</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">เนื้อหา (เว้น 1 บรรทัดเพื่อขึ้นย่อหน้าใหม่)</label>
            <textarea
              rows={13}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(`เรื่อง ${subject}\nเรียน ${recipient}\n\n${bodyText}`);
              showToast('✓ คัดลอกข้อความบันทึกข้อความแล้ว');
            }}
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 font-bold cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>คัดลอกข้อความทั้งหมด</span>
          </button>
        </div>

        {/* Live Official A4 Preview */}
        <div className="bg-white text-black rounded-2xl p-8 border border-slate-300 shadow-md space-y-4 font-serif leading-relaxed">
          <div className="text-center text-2xl font-black tracking-wide">บันทึกข้อความ</div>
          <div className="text-sm space-y-1 border-b-2 border-black pb-3">
            <div>
              <strong>ส่วนราชการ</strong>&nbsp;&nbsp;หน่วยตรวจสอบภายใน {orgName}
            </div>
            <div className="grid grid-cols-2">
              <div>
                <strong>ที่</strong>&nbsp;&nbsp;{docNo}
              </div>
              <div>
                <strong>วันที่</strong>&nbsp;&nbsp;{docDate}
              </div>
            </div>
            <div>
              <strong>เรื่อง</strong>&nbsp;&nbsp;{subject}
            </div>
          </div>

          <div className="text-sm">
            <strong>เรียน</strong>&nbsp;&nbsp;{recipient}
          </div>

          <div className="text-sm space-y-3 whitespace-pre-line">
            {bodyText.split(/\n\s*\n/).map((para, idx) => (
              <p key={idx} className="indent-10 text-justify">
                {para}
              </p>
            ))}
          </div>

          <div className="pt-6 flex justify-end text-sm">
            <div className="text-center w-64 space-y-1">
              <div>ลงชื่อ..............................................</div>
              <div>({auditorName})</div>
              <div>{auditorPos}</div>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="border border-slate-400 p-3 space-y-2">
              <div className="font-bold">ความเห็นปลัด{orgName}</div>
              <div>[ &nbsp; ] เห็นควรอนุมัติ &nbsp;&nbsp; [ &nbsp; ] อื่น ๆ ...............</div>
              <div className="text-center pt-4">
                ลงชื่อ....................................
                <br />({palatName})
              </div>
            </div>
            <div className="border border-slate-400 p-3 space-y-2">
              <div className="font-bold">คำสั่งผู้บริหารท้องถิ่น</div>
              <div>[ &nbsp; ] อนุมัติ &nbsp;&nbsp; [ &nbsp; ] ทราบ/ดำเนินการตามเสนอ</div>
              <div className="text-center pt-4">
                ลงชื่อ....................................
                <br />({approverName})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
