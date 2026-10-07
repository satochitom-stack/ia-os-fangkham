import html2pdf from 'html2pdf.js';

/**
 * exportRiskDocs.js
 * ส่งออกรายงานการบริหารจัดการความเสี่ยง (แบบ บส. 1 ถึง บส. 5)
 * ตามหนังสือสั่งการกระทรวงมหาดไทย ที่ มท 0805.2/ว 3482
 * รองรับการส่งออกเป็นไฟล์:
 * 1. Microsoft Word (.doc) - ฟอร์มตรงตามมาตรฐาน ว 3482 สมบูรณ์ ตารางไม่แตก
 * 2. Adobe PDF (.pdf) - ดาวน์โหลดเป็นไฟล์ PDF คุณภาพสูงโดยตรง ไม่เปิดหน้าต่างพิมพ์ ไม่มีหัวท้ายระบบ
 * 3. พิมพ์เอกสาร (Print A4 แนวนอน) - สั่งพิมพ์ผ่านเบราว์เซอร์ ตัดหัวท้าย URL / วันที่อัตโนมัติ
 * 4. Microsoft Excel (.xls) - สรุปตารางคำนวณและวิเคราะห์ผล
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function downloadBlob(content, fileName, mimeType) {
  const blob = new Blob(['\uFEFF' + content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function toThaiDigits(str) {
  if (str === null || str === undefined) return '';
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return String(str).replace(/[0-9]/g, (d) => thaiDigits[d]);
}

/**
 * Helper รวบรวมข้อมูลโครงสร้างและตารางของ แบบ บส. 1 - 5
 * เพื่อให้ Word, PDF และ Print แสดงผลถูกต้องตรงกัน 100% ตามมาตรฐาน ว 3482
 */
function getBsFormData({
  activeTab,
  filteredBs1 = [],
  filteredBs2 = [],
  filteredBs3 = [],
  filteredBs4 = [],
  filteredBs5Items = [],
  bs5Data = {},
  bs4Period = '6month',
  selectedYear = '2569',
  effectiveDept = ''
}) {
  let formNumber = '1';
  let formName = 'บส.1';
  let title = '';
  let subtitle = '';
  let tableHeaderHtml = '';
  let tableBodyHtml = '';
  let extraHtml = '';
  let totalCols = 8;
  let signatureNumber = { sign: '10', pos: '11', date: '12' };

  if (activeTab === 'bs1') {
    formNumber = '1';
    formName = 'บส.1';
    title = 'กำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '10', pos: '11', date: '12' };

    const showDeptCol = (!effectiveDept || effectiveDept === 'all');
    totalCols = showDeptCol ? 8 : 7;

    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f1f5f9;">
        <th style="width: 45pt; text-align: center; vertical-align: middle;">(3)<br/>รหัสความเสี่ยง</th>
        <th style="width: 110pt; text-align: center; vertical-align: middle;">(4)<br/>ยุทธศาสตร์ที่รับผิดชอบ</th>
        <th style="width: 140pt; text-align: center; vertical-align: middle;">(5)<br/>โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th style="width: 65pt; text-align: center; vertical-align: middle;">(6)<br/>งบประมาณ (บาท)</th>
        <th style="width: 130pt; text-align: center; vertical-align: middle;">(7)<br/>วัตถุประสงค์</th>
        <th style="width: 85pt; text-align: center; vertical-align: middle;">(8)<br/>ตัวชี้วัด</th>
        <th style="width: 85pt; text-align: center; vertical-align: middle;">(9)<br/>เป้าหมาย</th>
        ${showDeptCol ? '<th style="width: 75pt; text-align: center; vertical-align: middle;">ส่วนราชการ</th>' : ''}
      </tr>
    `;

    tableBodyHtml = filteredBs1.map((item, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || `RSK-0${idx + 1}`)}</td>
        <td>${escapeHtml(item.strategy || '')}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
        <td style="text-align: right;">${item.budget ? Number(item.budget).toLocaleString() : '-'}</td>
        <td>${escapeHtml(item.objective || '')}</td>
        <td>${escapeHtml(item.kpi || '')}</td>
        <td>${escapeHtml(item.target || '')}</td>
        ${showDeptCol ? `<td style="text-align: center;">${escapeHtml(item.department || '')}</td>` : ''}
      </tr>
    `).join('');
  } else if (activeTab === 'bs2') {
    formNumber = '2';
    formName = 'บส.2';
    title = 'การวิเคราะห์โอกาส ผลกระทบ และการตอบสนองความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '13', pos: '14', date: '15' };
    totalCols = 10;

    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f1f5f9;">
        <th style="width: 45pt; text-align: center; vertical-align: middle;">(3)<br/>รหัสความเสี่ยง</th>
        <th style="width: 95pt; text-align: center; vertical-align: middle;">(4)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="width: 95pt; text-align: center; vertical-align: middle;">(5)<br/>วัตถุประสงค์</th>
        <th style="width: 70pt; text-align: center; vertical-align: middle;">(6)<br/>ผู้รับผิดชอบ</th>
        <th style="width: 95pt; text-align: center; vertical-align: middle;">(7)<br/>ความเสี่ยง</th>
        <th style="width: 75pt; text-align: center; vertical-align: middle;">(8)<br/>ประเภทความเสี่ยง</th>
        <th style="width: 30pt; text-align: center; vertical-align: middle;">(9)<br/>คะแนนโอกาส</th>
        <th style="width: 30pt; text-align: center; vertical-align: middle;">(10)<br/>คะแนนผลกระทบ</th>
        <th style="width: 65pt; text-align: center; vertical-align: middle;">(11)<br/>ระดับความเสี่ยง<br/>(9) x (10)</th>
        <th style="width: 140pt; text-align: center; vertical-align: middle;">(12)<br/>วิธีการตอบสนองความเสี่ยง</th>
      </tr>
    `;

    tableBodyHtml = filteredBs2.map((item) => {
      const l = Number(item.likelihood) || 1;
      const i = Number(item.impact) || 1;
      const score = item.riskScore !== undefined && item.riskScore !== null && item.riskScore !== ''
        ? Number(item.riskScore)
        : (l * i);
      const level = item.riskLevel || (score >= 15 ? 'สูงมาก' : score >= 10 ? 'สูง' : score >= 5 ? 'ปานกลาง' : 'ต่ำ');
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || '')}</td>
          <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
          <td>${escapeHtml(item.objective || '')}</td>
          <td>${escapeHtml(item.responsiblePerson || '')}</td>
          <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent || '')}</td>
          <td>${escapeHtml(item.riskCategory || '')}</td>
          <td style="text-align: center;">${l}</td>
          <td style="text-align: center;">${i}</td>
          <td style="text-align: center; font-weight: bold;">${score} (${level})</td>
          <td style="color: #1d4ed8;">${escapeHtml(item.riskResponse || '')}</td>
        </tr>
      `;
    }).join('');
  } else if (activeTab === 'bs3') {
    formNumber = '3';
    formName = 'บส.3';
    title = 'รายงานการจัดทำแผนบริหารความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '12', pos: '13', date: '14' };
    totalCols = 9;

    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f1f5f9;">
        <th style="width: 45pt; text-align: center; vertical-align: middle;">(3)<br/>รหัสความเสี่ยง</th>
        <th style="width: 95pt; text-align: center; vertical-align: middle;">(4)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="width: 90pt; text-align: center; vertical-align: middle;">(5)<br/>ความเสี่ยง</th>
        <th style="width: 85pt; text-align: center; vertical-align: middle;">(6)<br/>วิธีการตอบสนองความเสี่ยง</th>
        <th style="width: 70pt; text-align: center; vertical-align: middle;">(7)<br/>ผู้รับผิดชอบ</th>
        <th style="width: 120pt; text-align: center; vertical-align: middle;">(8)<br/>วิธีการจัดการความเสี่ยง (มาตรการ)</th>
        <th style="width: 75pt; text-align: center; vertical-align: middle;">(9)<br/>ตัวชี้วัด</th>
        <th style="width: 70pt; text-align: center; vertical-align: middle;">(10)<br/>ระยะเวลาดำเนินการ</th>
        <th style="width: 90pt; text-align: center; vertical-align: middle;">(11)<br/>วิธีการติดตาม และการรายงาน</th>
      </tr>
    `;

    tableBodyHtml = filteredBs3.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || '')}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
        <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent || '')}</td>
        <td>${escapeHtml(item.riskResponse || '')}</td>
        <td>${escapeHtml(item.responsiblePerson || '')}</td>
        <td>${escapeHtml(item.measures || '')}</td>
        <td>${escapeHtml(item.kpi || '')}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline || '')}</td>
        <td>${escapeHtml(item.monitoringMethod || '')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs4') {
    formNumber = '4';
    formName = 'บส.4';
    title = 'รายงานการติดตามผลการบริหารความเสี่ยง';
    subtitle = `สำหรับปีงบประมาณ พ.ศ. ${selectedYear} &nbsp;&nbsp;&nbsp; [${bs4Period === '3month' ? '✓' : ' '}] รอบ 3 เดือน &nbsp;&nbsp;&nbsp; [${bs4Period === '6month' ? '✓' : ' '}] รอบ 6 เดือน &nbsp;&nbsp;&nbsp; [${bs4Period === '12month' ? '✓' : ' '}] รอบ 12 เดือน`;
    signatureNumber = { sign: '12', pos: '13', date: '14' };
    totalCols = 9;

    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f1f5f9;">
        <th style="width: 45pt; text-align: center; vertical-align: middle;">(3)<br/>รหัสความเสี่ยง</th>
        <th style="width: 90pt; text-align: center; vertical-align: middle;">(4)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="width: 100pt; text-align: center; vertical-align: middle;">(5)<br/>วิธีการจัดการความเสี่ยง</th>
        <th style="width: 65pt; text-align: center; vertical-align: middle;">(6)<br/>ระยะเวลาดำเนินการ</th>
        <th style="width: 65pt; text-align: center; vertical-align: middle;">(7)<br/>ผู้รับผิดชอบ</th>
        <th style="width: 110pt; text-align: center; vertical-align: middle;">(8)<br/>ผลลัพธ์การดำเนินการจัดการความเสี่ยง</th>
        <th style="width: 80pt; text-align: center; vertical-align: middle;">(9)<br/>เอกสาร/หลักฐาน</th>
        <th style="width: 45pt; text-align: center; vertical-align: middle;">(10)<br/>ร้อยละความคืบหน้า</th>
        <th style="width: 140pt; text-align: center; vertical-align: middle;">(11)<br/>ปัญหาอุปสรรค และแนวทางแก้ไข</th>
      </tr>
    `;

    tableBodyHtml = filteredBs4.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || '')}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
        <td>${escapeHtml(item.measures || '')}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline || '')}</td>
        <td>${escapeHtml(item.responsiblePerson || '')}</td>
        <td>${escapeHtml(item.result || '')}</td>
        <td>${escapeHtml(item.evidence || '')}</td>
        <td style="text-align: center; font-weight: bold;">${item.progressPercent || 0}%</td>
        <td>${escapeHtml(item.problemSolution || '-')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs5') {
    formNumber = '5';
    formName = 'บส.5';
    title = 'รายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง';
    subtitle = `สำหรับปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '14', pos: '15', date: '16' };
    totalCols = 16;

    // Header 16 คอลัมน์มาตรฐาน ว 3482 (ความกว้างรวม = 744pt พอดีกับขนาดหน้ากระดาษ A4 แนวนอน ไม่แตก ไม่ล้น)
    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f1f5f9;">
        <th rowspan="2" style="width: 38pt; vertical-align: middle; text-align: center;">(3)<br/>รหัสความเสี่ยง</th>
        <th rowspan="2" style="width: 85pt; vertical-align: middle; text-align: center;">(4)<br/>โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th rowspan="2" style="width: 75pt; vertical-align: middle; text-align: center;">(5)<br/>ความเสี่ยง</th>
        <th colspan="3" style="width: 80pt; vertical-align: middle; text-align: center;">(6)<br/>คะแนนระดับความเสี่ยง<br/>ก่อนการดำเนินการ</th>
        <th rowspan="2" style="width: 75pt; vertical-align: middle; text-align: center;">(7)<br/>วิธีการจัดการความเสี่ยง</th>
        <th rowspan="2" style="width: 75pt; vertical-align: middle; text-align: center;">(8)<br/>ผลดำเนินการจากการจัดการความเสี่ยง</th>
        <th colspan="3" style="width: 80pt; vertical-align: middle; text-align: center;">(9)<br/>คะแนนระดับความเสี่ยง<br/>ภายหลังการดำเนินการ</th>
        <th rowspan="2" style="width: 45pt; vertical-align: middle; text-align: center;">(10)<br/>การเปลี่ยนแปลงระดับความเสี่ยง</th>
        <th rowspan="2" style="width: 65pt; vertical-align: middle; text-align: center;">(11)<br/>ความเสี่ยงคงเหลือ/เกิดขึ้นใหม่</th>
        <th colspan="2" style="width: 60pt; vertical-align: middle; text-align: center;">(12)<br/>สรุปความเสี่ยง</th>
        <th rowspan="2" style="width: 75pt; vertical-align: middle; text-align: center;">(13)<br/>แนวทาง/มาตรการจัดการความเสี่ยง สำหรับปีถัดไป</th>
      </tr>
      <tr style="mso-yfti-tblheader: yes; background-color: #f1f5f9;">
        <th style="width: 24pt; vertical-align: middle; text-align: center;">โอกาส<br/>(1)</th>
        <th style="width: 24pt; vertical-align: middle; text-align: center;">ผลกระทบ<br/>(2)</th>
        <th style="width: 32pt; vertical-align: middle; text-align: center;">คะแนน<br/>(3)=(1)x(2)</th>
        <th style="width: 24pt; vertical-align: middle; text-align: center;">โอกาส<br/>(1)</th>
        <th style="width: 24pt; vertical-align: middle; text-align: center;">ผลกระทบ<br/>(2)</th>
        <th style="width: 32pt; vertical-align: middle; text-align: center;">คะแนน<br/>(3)=(1)x(2)</th>
        <th style="width: 30pt; vertical-align: middle; text-align: center;">ควบคุมได้</th>
        <th style="width: 30pt; vertical-align: middle; text-align: center;">ควบคุมไม่ได้</th>
      </tr>
    `;

    tableBodyHtml = filteredBs5Items.map((item) => {
      const preScore = (Number(item.preLikelihood) || 1) * (Number(item.preImpact) || 1);
      const postScore = (Number(item.postLikelihood) || 1) * (Number(item.postImpact) || 1);
      const isControllable = item.controllable === 'ควบคุมได้';
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || '')}</td>
          <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
          <td style="color: #b91c1c;">${escapeHtml(item.riskEvent || '')}</td>
          <td style="text-align: center;">${item.preLikelihood || 1}</td>
          <td style="text-align: center;">${item.preImpact || 1}</td>
          <td style="text-align: center; font-weight: bold;">${preScore}</td>
          <td>${escapeHtml(item.measures || '')}</td>
          <td>${escapeHtml(item.result || '')}</td>
          <td style="text-align: center;">${item.postLikelihood || 1}</td>
          <td style="text-align: center;">${item.postImpact || 1}</td>
          <td style="text-align: center; font-weight: bold; color: #15803d;">${postScore}</td>
          <td style="text-align: center;">${escapeHtml(item.riskChange || 'ลดลง')}</td>
          <td>${escapeHtml(item.residualRisk || '-')}</td>
          <td style="text-align: center; font-weight: bold;">${isControllable ? '✓' : ''}</td>
          <td style="text-align: center; font-weight: bold; color: #b91c1c;">${!isControllable ? '✓' : ''}</td>
          <td>${escapeHtml(item.nextYearMeasures || '')}</td>
        </tr>
      `;
    }).join('');

    extraHtml = `
      <div style="margin-top: 8px; padding: 6px 10px; border: 1px solid #000; background-color: #f8fafc; font-size: 11pt;">
        <b>สรุปภาพรวมผลการดำเนินการและการทบทวนแผนบริหารความเสี่ยง ประจำปี พ.ศ. ${selectedYear}:</b>
        <p style="text-indent: 1.5cm; margin: 3px 0 0 0;">${escapeHtml(bs5Data.summary || '')}</p>
      </div>
    `;
  }

  return {
    formNumber,
    formName,
    title,
    subtitle,
    signatureNumber,
    totalCols,
    tableHeaderHtml,
    tableBodyHtml,
    extraHtml
  };
}

// -------------------------------------------------------------
// 1. ส่งออกเป็น Microsoft Word (.doc)
// -------------------------------------------------------------
export function exportBsToWord({
  activeTab,
  filteredBs1 = [],
  filteredBs2 = [],
  filteredBs3 = [],
  filteredBs4 = [],
  filteredBs5Items = [],
  bs5Data = {},
  bs4Period = '6month',
  orgProfile = {},
  selectedYear = '2569',
  isSubDivision = false,
  effectiveDept = ''
}) {
  const orgName = orgProfile.name || 'องค์การบริหารส่วนตำบลฝางคำ';
  const approverName = isSubDivision ? '....................................................' : (orgProfile.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ');
  const approverPosition = isSubDivision ? '....................................................' : (orgProfile.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ');
  const deptLabel = effectiveDept && effectiveDept !== 'all' ? `_${effectiveDept}` : '';

  const formData = getBsFormData({
    activeTab,
    filteredBs1,
    filteredBs2,
    filteredBs3,
    filteredBs4,
    filteredBs5Items,
    bs5Data,
    bs4Period,
    selectedYear,
    effectiveDept
  });

  const wordHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>แบบ ${formData.formName} - ${escapeHtml(orgName)}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 841.95pt 595.35pt; /* A4 Landscape */
          mso-page-orientation: landscape;
          margin: 1.0cm 1.0cm 1.0cm 1.0cm;
          mso-header-margin: 20pt;
          mso-footer-margin: 20pt;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
        }
        body {
          font-family: 'TH SarabunPSK', 'TH Sarabun New', 'Angsana New', sans-serif;
          font-size: 13pt;
          color: #000000;
          line-height: 1.15;
        }
        .header-top {
          text-align: right;
          font-weight: bold;
          font-size: 14pt;
          margin-bottom: 2px;
        }
        .header-center {
          text-align: center;
          margin-bottom: 6px;
        }
        .header-center h2 {
          font-size: 15pt;
          font-weight: bold;
          margin: 0 0 2px 0;
        }
        .header-center p {
          font-size: 14pt;
          margin: 0 0 2px 0;
        }
        table {
          border-collapse: collapse;
          table-layout: fixed;
          mso-table-layout-alt: fixed;
          width: 100%;
          margin-top: 4px;
          margin-bottom: 8px;
        }
        tr {
          mso-yfti-irow: 0;
          page-break-inside: avoid;
        }
        thead tr {
          mso-yfti-tblheader: yes;
        }
        th, td {
          border: 1px solid #000000;
          padding: 3px 2px;
          vertical-align: top;
          font-size: ${activeTab === 'bs5' ? '10pt' : '10.5pt'};
          line-height: 1.15;
          word-wrap: break-word;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
        }
        .sig-block {
          width: 320pt;
          float: right;
          text-align: left;
          margin-top: 15pt;
          font-size: 12pt;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <div class="header-top">แบบ บส. ${formData.formNumber}</div>
        <div class="header-center">
          <p style="font-weight: bold;">ชื่อหน่วยงาน ${escapeHtml(orgName)} (1)</p>
          <h2>${escapeHtml(formData.title)}</h2>
          <p>${formData.subtitle} (2)</p>
        </div>

        <table>
          <thead>
            ${formData.tableHeaderHtml}
          </thead>
          <tbody>
            ${formData.tableBodyHtml || `<tr><td colspan="${formData.totalCols}" style="text-align:center; padding: 15px;">ไม่พบข้อมูล</td></tr>`}
          </tbody>
        </table>

        ${formData.extraHtml}

        <div style="clear: both;"></div>

        <div class="sig-block">
          <div>ลายมือชื่อ...................................................(${formData.signatureNumber.sign})...................................................</div>
          <div style="text-indent: 40pt;">( ${escapeHtml(approverName)} )</div>
          <div>ตำแหน่ง .................................................(${formData.signatureNumber.pos}).................................................</div>
          <div style="text-indent: 40pt;">${escapeHtml(approverPosition)}</div>
          <div>วันที่............เดือน...............(${formData.signatureNumber.date}).............พ.ศ. .....................</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const fileName = `แบบ_${formData.formName}${deptLabel}_ปี${selectedYear}.doc`;
  downloadBlob(wordHtml, fileName, 'application/msword');
}

// -------------------------------------------------------------
// 2. ดาวน์โหลดเป็นไฟล์ PDF (.pdf) โดยตรง (ไม่มีหน้าต่างพิมพ์ ไม่มีหัวท้ายระบบ)
// -------------------------------------------------------------
export async function exportBsToPdf({
  activeTab,
  filteredBs1 = [],
  filteredBs2 = [],
  filteredBs3 = [],
  filteredBs4 = [],
  filteredBs5Items = [],
  bs5Data = {},
  bs4Period = '6month',
  orgProfile = {},
  selectedYear = '2569',
  isSubDivision = false,
  effectiveDept = ''
}) {
  const orgName = orgProfile.name || 'องค์การบริหารส่วนตำบลฝางคำ';
  const approverName = isSubDivision ? '....................................................' : (orgProfile.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ');
  const approverPosition = isSubDivision ? '....................................................' : (orgProfile.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ');
  const deptLabel = effectiveDept && effectiveDept !== 'all' ? `_${effectiveDept}` : '';

  const formData = getBsFormData({
    activeTab,
    filteredBs1,
    filteredBs2,
    filteredBs3,
    filteredBs4,
    filteredBs5Items,
    bs5Data,
    bs4Period,
    selectedYear,
    effectiveDept
  });

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '1200px';
  iframe.style.height = '1200px';
  iframe.style.zIndex = '-9999';
  iframe.style.border = 'none';
  iframe.style.opacity = '0.01';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="utf-8">
      <style>
        body {
          margin: 0;
          padding: 10px;
          font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', 'Angsana New', sans-serif;
          background: #ffffff;
          color: #000000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-top: 4px;
          margin-bottom: 6px;
          font-size: ${activeTab === 'bs5' ? '9.5pt' : '10.5pt'};
        }
        th, td {
          border: 1px solid #000000;
          padding: 3px 2px;
          vertical-align: top;
          word-wrap: break-word;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
        }
      </style>
    </head>
    <body>
      <div id="pdf-content-root" style="width: 1060px; background: #ffffff; color: #000000;">
        <div style="text-align: right; font-weight: bold; font-size: 13pt; margin-bottom: 2px;">แบบ บส. ${formData.formNumber}</div>
        <div style="text-align: center; margin-bottom: 6px;">
          <p style="font-weight: bold; font-size: 13pt; margin: 0 0 2px 0;">ชื่อหน่วยงาน ${escapeHtml(orgName)} (1)</p>
          <h2 style="font-size: 14pt; font-weight: bold; margin: 0 0 2px 0;">${escapeHtml(formData.title)}</h2>
          <p style="font-size: 12.5pt; margin: 0 0 2px 0;">${formData.subtitle} (2)</p>
        </div>

        <table>
          <thead>
            ${formData.tableHeaderHtml}
          </thead>
          <tbody>
            ${formData.tableBodyHtml || `<tr><td colspan="${formData.totalCols}" style="text-align:center; padding: 15px;">ไม่พบข้อมูล</td></tr>`}
          </tbody>
        </table>

        ${formData.extraHtml}

        <div style="clear: both;"></div>

        <div style="width: 330pt; float: right; margin-top: 15pt; font-size: 12pt; line-height: 1.6;">
          <div>ลายมือชื่อ...................................................(${formData.signatureNumber.sign})...................................................</div>
          <div style="text-indent: 40pt;">( ${escapeHtml(approverName)} )</div>
          <div>ตำแหน่ง .................................................(${formData.signatureNumber.pos}).................................................</div>
          <div style="text-indent: 40pt;">${escapeHtml(approverPosition)}</div>
          <div>วันที่............เดือน...............(${formData.signatureNumber.date}).............พ.ศ. .....................</div>
        </div>
      </div>
    </body>
    </html>
  `);
  doc.close();

  // Wait for fonts to be ready
  if (doc.fonts && doc.fonts.ready) {
    try {
      await doc.fonts.ready;
    } catch {
      // ignore font loading error
    }
  }
  await new Promise(resolve => setTimeout(resolve, 150));

  const targetEl = doc.getElementById('pdf-content-root');

  const opt = {
    margin: [8, 10, 8, 10], // mm: top, left, bottom, right
    filename: `แบบ_${formData.formName}${deptLabel}_ปี${selectedYear}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(targetEl).save();
  } finally {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}

// -------------------------------------------------------------
// 3. สั่งพิมพ์เอกสารทางเครื่องพิมพ์ (Print A4 แนวนอน - ตัดหัวท้ายเบราว์เซอร์อัตโนมัติ)
// -------------------------------------------------------------
export function exportBsToPrint({
  activeTab,
  filteredBs1 = [],
  filteredBs2 = [],
  filteredBs3 = [],
  filteredBs4 = [],
  filteredBs5Items = [],
  bs5Data = {},
  bs4Period = '6month',
  orgProfile = {},
  selectedYear = '2569',
  isSubDivision = false,
  effectiveDept = ''
}) {
  const orgName = orgProfile.name || 'องค์การบริหารส่วนตำบลฝางคำ';
  const approverName = isSubDivision ? '....................................................' : (orgProfile.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ');
  const approverPosition = isSubDivision ? '....................................................' : (orgProfile.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ');
  const deptLabel = effectiveDept && effectiveDept !== 'all' ? `_${effectiveDept}` : '';

  const formData = getBsFormData({
    activeTab,
    filteredBs1,
    filteredBs2,
    filteredBs3,
    filteredBs4,
    filteredBs5Items,
    bs5Data,
    bs4Period,
    selectedYear,
    effectiveDept
  });

  const printHtml = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="utf-8">
      <title>แบบ_${formData.formName}${deptLabel}_ปี${selectedYear}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0; /* ตัดหัวท้าย URL / วันที่ของเบราว์เซอร์ออกโดยอัตโนมัติ */
        }
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', 'Angsana New', sans-serif;
          font-size: 13pt;
          color: #000;
          margin: 8mm 10mm;
          padding: 0;
          line-height: 1.2;
          background: #fff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .header-top {
          text-align: right;
          font-weight: bold;
          font-size: 13pt;
          margin-bottom: 2px;
        }
        .header-center {
          text-align: center;
          margin-bottom: 6px;
        }
        .header-center p {
          font-size: 13pt;
          margin: 0 0 2px 0;
        }
        .header-center h2 {
          font-size: 14pt;
          font-weight: bold;
          margin: 0 0 2px 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          table-layout: fixed;
          margin-top: 4px;
          margin-bottom: 6px;
          font-size: ${activeTab === 'bs5' ? '9.5pt' : '10.5pt'};
        }
        thead {
          display: table-header-group;
        }
        tr {
          page-break-inside: avoid;
        }
        th, td {
          border: 1px solid #000;
          padding: 3px 2px;
          vertical-align: top;
          word-wrap: break-word;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
        }
        .sig-block {
          width: 320pt;
          float: right;
          text-align: left;
          margin-top: 15pt;
          font-size: 12pt;
          line-height: 1.6;
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>
      <div class="header-top">แบบ บส. ${formData.formNumber}</div>
      <div class="header-center">
        <p style="font-weight: bold;">ชื่อหน่วยงาน ${escapeHtml(orgName)} (1)</p>
        <h2>${escapeHtml(formData.title)}</h2>
        <p>${formData.subtitle} (2)</p>
      </div>

      <table>
        <thead>
          ${formData.tableHeaderHtml}
        </thead>
        <tbody>
          ${formData.tableBodyHtml || `<tr><td colspan="${formData.totalCols}" style="text-align:center; padding: 15px;">ไม่พบข้อมูล</td></tr>`}
        </tbody>
      </table>

      ${formData.extraHtml}

      <div style="clear: both;"></div>

      <div class="sig-block">
        <div>ลายมือชื่อ...................................................(${formData.signatureNumber.sign})...................................................</div>
        <div style="text-indent: 40pt;">( ${escapeHtml(approverName)} )</div>
        <div>ตำแหน่ง .................................................(${formData.signatureNumber.pos}).................................................</div>
        <div style="text-indent: 40pt;">${escapeHtml(approverPosition)}</div>
        <div>วันที่............เดือน...............(${formData.signatureNumber.date}).............พ.ศ. .....................</div>
      </div>
    </body>
    </html>
  `;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '1000px';
  iframe.style.height = '1000px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(printHtml);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 400);
}


// -------------------------------------------------------------
// 3. ส่งออกเป็น Microsoft Excel (.xls)
// -------------------------------------------------------------
export function exportBsToExcel({
  activeTab,
  filteredBs1 = [],
  filteredBs2 = [],
  filteredBs3 = [],
  filteredBs4 = [],
  filteredBs5Items = [],
  bs5Data = {},
  bs4Period = '6month',
  orgProfile = {},
  selectedYear = '2569',
  isSubDivision = false,
  effectiveDept = ''
}) {
  const orgName = orgProfile.name || 'องค์การบริหารส่วนตำบลฝางคำ';
  const approverName = isSubDivision ? '....................................................' : (orgProfile.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ');
  const approverPosition = isSubDivision ? '....................................................' : (orgProfile.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ');
  const deptLabel = effectiveDept && effectiveDept !== 'all' ? `_${effectiveDept}` : '';

  let formNumber = '1';
  let formName = 'บส.1';
  let title = '';
  let subtitle = '';
  let tableHeaderHtml = '';
  let tableBodyHtml = '';
  let extraRowsHtml = '';
  let colSpanTotal = 8;

  if (activeTab === 'bs1') {
    formNumber = '1';
    formName = 'บส.1';
    title = 'กำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    const showDeptCol = (!effectiveDept || effectiveDept === 'all');
    colSpanTotal = showDeptCol ? 8 : 7;

    tableHeaderHtml = `
      <tr>
        <th style="background-color: #D9E1F2;">(3) รหัสความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(4) ยุทธศาสตร์ที่รับผิดชอบ</th>
        <th style="background-color: #D9E1F2;">(5) โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th style="background-color: #D9E1F2;">(6) งบประมาณ (บาท)</th>
        <th style="background-color: #D9E1F2;">(7) วัตถุประสงค์</th>
        <th style="background-color: #D9E1F2;">(8) ตัวชี้วัด</th>
        <th style="background-color: #D9E1F2;">(9) เป้าหมาย</th>
        ${showDeptCol ? '<th style="background-color: #D9E1F2;">ส่วนราชการ</th>' : ''}
      </tr>
    `;

    tableBodyHtml = filteredBs1.map((item, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || `RSK-0${idx + 1}`)}</td>
        <td>${escapeHtml(item.strategy || '')}</td>
        <td>${escapeHtml(item.activity || '')}</td>
        <td style="text-align: right;" class="num">${item.budget || 0}</td>
        <td>${escapeHtml(item.objective || '')}</td>
        <td>${escapeHtml(item.kpi || '')}</td>
        <td>${escapeHtml(item.target || '')}</td>
        ${showDeptCol ? `<td style="text-align: center;">${escapeHtml(item.department || '')}</td>` : ''}
      </tr>
    `).join('');
  } else if (activeTab === 'bs2') {
    formNumber = '2';
    formName = 'บส.2';
    title = 'การวิเคราะห์โอกาส ผลกระทบ และการตอบสนองความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    colSpanTotal = 10;

    tableHeaderHtml = `
      <tr>
        <th style="background-color: #D9E1F2;">(3) รหัสความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(4) โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="background-color: #D9E1F2;">(5) วัตถุประสงค์</th>
        <th style="background-color: #D9E1F2;">(6) ผู้รับผิดชอบ</th>
        <th style="background-color: #D9E1F2;">(7) ความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(8) ประเภทความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(9) คะแนนโอกาส</th>
        <th style="background-color: #D9E1F2;">(10) คะแนนผลกระทบ</th>
        <th style="background-color: #D9E1F2;">(11) ระดับความเสี่ยง (9) x (10)</th>
        <th style="background-color: #D9E1F2;">(12) วิธีการตอบสนองความเสี่ยง</th>
      </tr>
    `;

    tableBodyHtml = filteredBs2.map((item) => {
      const l = Number(item.likelihood) || 1;
      const i = Number(item.impact) || 1;
      const score = item.riskScore !== undefined && item.riskScore !== null && item.riskScore !== ''
        ? item.riskScore
        : (l * i);
      const level = item.riskLevel || (score >= 15 ? 'สูงมาก' : score >= 10 ? 'สูง' : score >= 5 ? 'ปานกลาง' : 'ต่ำ');
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || '')}</td>
          <td>${escapeHtml(item.activity || '')}</td>
          <td>${escapeHtml(item.objective || '')}</td>
          <td>${escapeHtml(item.responsiblePerson || '')}</td>
          <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent || '')}</td>
          <td>${escapeHtml(item.riskCategory || '')}</td>
          <td style="text-align: center;">${l}</td>
          <td style="text-align: center;">${i}</td>
          <td style="text-align: center; font-weight: bold;">${score} (${level})</td>
          <td>${escapeHtml(item.riskResponse || '')}</td>
        </tr>
      `;
    }).join('');
  } else if (activeTab === 'bs3') {
    formNumber = '3';
    formName = 'บส.3';
    title = 'รายงานการจัดทำแผนบริหารความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    colSpanTotal = 9;

    tableHeaderHtml = `
      <tr>
        <th style="background-color: #D9E1F2;">(3) รหัสความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(4) โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="background-color: #D9E1F2;">(5) ความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(6) วิธีการตอบสนองความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(7) ผู้รับผิดชอบ</th>
        <th style="background-color: #D9E1F2;">(8) วิธีการจัดการความเสี่ยง (มาตรการ)</th>
        <th style="background-color: #D9E1F2;">(9) ตัวชี้วัด</th>
        <th style="background-color: #D9E1F2;">(10) ระยะเวลาดำเนินการ</th>
        <th style="background-color: #D9E1F2;">(11) วิธีการติดตาม และการรายงาน</th>
      </tr>
    `;

    tableBodyHtml = filteredBs3.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || '')}</td>
        <td>${escapeHtml(item.activity || '')}</td>
        <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent || '')}</td>
        <td>${escapeHtml(item.riskResponse || '')}</td>
        <td>${escapeHtml(item.responsiblePerson || '')}</td>
        <td>${escapeHtml(item.measures || '')}</td>
        <td>${escapeHtml(item.kpi || '')}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline || '')}</td>
        <td>${escapeHtml(item.monitoringMethod || '')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs4') {
    formNumber = '4';
    formName = 'บส.4';
    const periodLabel = bs4Period === '3month' ? 'รอบ 3 เดือน' : bs4Period === '6month' ? 'รอบ 6 เดือน' : 'รอบ 12 เดือน';
    title = `รายงานการติดตามผลการบริหารความเสี่ยง (${periodLabel})`;
    subtitle = `สำหรับปีงบประมาณ พ.ศ. ${selectedYear}`;
    colSpanTotal = 9;

    tableHeaderHtml = `
      <tr>
        <th style="background-color: #D9E1F2;">(3) รหัสความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(4) โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="background-color: #D9E1F2;">(5) วิธีการจัดการความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(6) ระยะเวลาดำเนินการ</th>
        <th style="background-color: #D9E1F2;">(7) ผู้รับผิดชอบ</th>
        <th style="background-color: #D9E1F2;">(8) ผลลัพธ์การดำเนินการจัดการความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(9) เอกสาร/หลักฐาน</th>
        <th style="background-color: #D9E1F2;">(10) ร้อยละความคืบหน้า</th>
        <th style="background-color: #D9E1F2;">(11) ปัญหาอุปสรรค และแนวทางแก้ไข</th>
      </tr>
    `;

    tableBodyHtml = filteredBs4.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || '')}</td>
        <td>${escapeHtml(item.activity || '')}</td>
        <td>${escapeHtml(item.measures || '')}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline || '')}</td>
        <td>${escapeHtml(item.responsiblePerson || '')}</td>
        <td>${escapeHtml(item.result || '')}</td>
        <td>${escapeHtml(item.evidence || '')}</td>
        <td style="text-align: center; font-weight: bold;">${item.progressPercent || 0}%</td>
        <td>${escapeHtml(item.problemSolution || '-')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs5') {
    formNumber = '5';
    formName = 'บส.5';
    title = 'รายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง';
    subtitle = `สำหรับปีงบประมาณ พ.ศ. ${selectedYear}`;
    colSpanTotal = 16;

    tableHeaderHtml = `
      <tr>
        <th rowspan="2" style="background-color: #D9E1F2;">(3) รหัสความเสี่ยง</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(4) โครงการ/กิจกรรม/ภารกิจ</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(5) ความเสี่ยง</th>
        <th colspan="3" style="background-color: #D9E1F2;">(6) คะแนนระดับความเสี่ยงก่อนดำเนินการ</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(7) วิธีการจัดการความเสี่ยง</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(8) ผลดำเนินการจากการจัดการ</th>
        <th colspan="3" style="background-color: #D9E1F2;">(9) คะแนนระดับความเสี่ยงภายหลังดำเนินการ</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(10) การเปลี่ยนแปลง</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(11) ความเสี่ยงคงเหลือ/เกิดใหม่</th>
        <th colspan="2" style="background-color: #D9E1F2;">(12) สรุปความเสี่ยง</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(13) มาตรการสำหรับปีถัดไป</th>
      </tr>
      <tr>
        <th style="background-color: #D9E1F2;">โอกาส (1)</th>
        <th style="background-color: #D9E1F2;">ผลกระทบ (2)</th>
        <th style="background-color: #D9E1F2;">คะแนน (3)</th>
        <th style="background-color: #D9E1F2;">โอกาส (1)</th>
        <th style="background-color: #D9E1F2;">ผลกระทบ (2)</th>
        <th style="background-color: #D9E1F2;">คะแนน (3)</th>
        <th style="background-color: #D9E1F2;">ควบคุมได้</th>
        <th style="background-color: #D9E1F2;">ควบคุมไม่ได้</th>
      </tr>
    `;

    tableBodyHtml = filteredBs5Items.map((item) => {
      const preScore = (Number(item.preLikelihood) || 1) * (Number(item.preImpact) || 1);
      const postScore = (Number(item.postLikelihood) || 1) * (Number(item.postImpact) || 1);
      const isControllable = item.controllable === 'ควบคุมได้';
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode || '')}</td>
          <td>${escapeHtml(item.activity || '')}</td>
          <td style="color: #b91c1c;">${escapeHtml(item.riskEvent || '')}</td>
          <td style="text-align: center;">${item.preLikelihood || 1}</td>
          <td style="text-align: center;">${item.preImpact || 1}</td>
          <td style="text-align: center; font-weight: bold;">${preScore}</td>
          <td>${escapeHtml(item.measures || '')}</td>
          <td>${escapeHtml(item.result || '')}</td>
          <td style="text-align: center;">${item.postLikelihood || 1}</td>
          <td style="text-align: center;">${item.postImpact || 1}</td>
          <td style="text-align: center; font-weight: bold; color: #15803d;">${postScore}</td>
          <td style="text-align: center;">${escapeHtml(item.riskChange || 'ลดลง')}</td>
          <td>${escapeHtml(item.residualRisk || '-')}</td>
          <td style="text-align: center; font-weight: bold;">${isControllable ? '✓' : ''}</td>
          <td style="text-align: center; font-weight: bold; color: #b91c1c;">${!isControllable ? '✓' : ''}</td>
          <td>${escapeHtml(item.nextYearMeasures || '')}</td>
        </tr>
      `;
    }).join('');

    extraRowsHtml = `
      <tr>
        <td colspan="${colSpanTotal}" style="padding: 10px; background-color: #F2F2F2; font-weight: bold;">
          สรุปภาพรวมผลการดำเนินการและการทบทวนแผนบริหารความเสี่ยง ประจำปี พ.ศ. ${selectedYear}:
        </td>
      </tr>
      <tr>
        <td colspan="${colSpanTotal}" style="padding: 10px;">
          ${escapeHtml(bs5Data.summary || '')}
        </td>
      </tr>
    `;
  }

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>แบบ ${formName}</x:Name>
              <x:WorksheetOptions>
                <x:Print>
                  <x:ValidPrinterInfo/>
                  <x:Orientation>Landscape</x:Orientation>
                </x:Print>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'TH Sarabun New', Tahoma, sans-serif; font-size: 13pt; }
        table { border-collapse: collapse; }
        th, td { border: 0.5pt solid #000000; padding: 6px 8px; font-size: 12pt; }
        th { font-weight: bold; text-align: center; }
        .title-row { font-size: 16pt; font-weight: bold; text-align: center; border: none; }
        .subtitle-row { font-size: 13pt; text-align: center; border: none; }
        .header-tag { font-weight: bold; text-align: right; border: none; font-size: 14pt; }
        .num { mso-number-format:"\\#\\,\\#\\#0"; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="${colSpanTotal}" class="header-tag">แบบ บส. ${formNumber}</td>
        </tr>
        <tr>
          <td colspan="${colSpanTotal}" class="title-row">${escapeHtml(orgName)}</td>
        </tr>
        <tr>
          <td colspan="${colSpanTotal}" class="subtitle-row">${escapeHtml(title)}</td>
        </tr>
        <tr>
          <td colspan="${colSpanTotal}" class="subtitle-row">${escapeHtml(subtitle)}</td>
        </tr>
        <tr><td colspan="${colSpanTotal}" style="border:none;"></td></tr>
        ${tableHeaderHtml}
        ${tableBodyHtml || `<tr><td colspan="${colSpanTotal}" style="text-align:center;">ไม่พบข้อมูล</td></tr>`}
        ${extraRowsHtml}
        <tr><td colspan="${colSpanTotal}" style="border:none; height: 20px;"></td></tr>
        <tr>
          <td colspan="${colSpanTotal - 4}" style="border:none;"></td>
          <td colspan="4" style="border:none; text-align: center;">(ลงชื่อ)...................................................</td>
        </tr>
        <tr>
          <td colspan="${colSpanTotal - 4}" style="border:none;"></td>
          <td colspan="4" style="border:none; text-align: center;">( ${escapeHtml(approverName)} )</td>
        </tr>
        <tr>
          <td colspan="${colSpanTotal - 4}" style="border:none;"></td>
          <td colspan="4" style="border:none; text-align: center;">ตำแหน่ง ${escapeHtml(approverPosition)}</td>
        </tr>
        <tr>
          <td colspan="${colSpanTotal - 4}" style="border:none;"></td>
          <td colspan="4" style="border:none; text-align: center;">วันที่..........เดือน........................พ.ศ. ............</td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const fileName = `แบบ_${formName}${deptLabel}_ปี${selectedYear}.xls`;
  downloadBlob(excelHtml, fileName, 'application/vnd.ms-excel');
}
