/**
 * exportRiskDocs.js
 * ส่งออกรายงานการบริหารจัดการความเสี่ยง (แบบ บส. 1 ถึง บส. 5)
 * ตามหนังสือสั่งการกระทรวงมหาดไทย ที่ มท 0805.2/ว 3482
 * เป็นไฟล์ Microsoft Word (.doc) และ Microsoft Excel (.xls)
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

  let formNumber = '1';
  let formName = 'บส.1';
  let title = '';
  let subtitle = '';
  let tableHeaderHtml = '';
  let tableBodyHtml = '';
  let extraHtml = '';
  let signatureNumber = { sign: '10', name: '', pos: '11', date: '12' };

  if (activeTab === 'bs1') {
    formNumber = '1';
    formName = 'บส.1';
    title = 'กำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)';
    subtitle = `ประจำปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    signatureNumber = { sign: '10', pos: '11', date: '12' };

    tableHeaderHtml = `
      <tr>
        <th style="width: 70px;">(3)<br/>รหัสความเสี่ยง</th>
        <th>(4)<br/>ยุทธศาสตร์ที่รับผิดชอบ</th>
        <th>(5)<br/>โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th style="width: 100px;">(6)<br/>งบประมาณ (บาท)</th>
        <th>(7)<br/>วัตถุประสงค์</th>
        <th>(8)<br/>ตัวชี้วัด</th>
        <th>(9)<br/>เป้าหมาย</th>
        <th style="width: 110px;">ส่วนราชการ</th>
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
        <td style="text-align: center;">${escapeHtml(item.department || '')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs2') {
    formNumber = '2';
    formName = 'บส.2';
    title = 'การวิเคราะห์โอกาส ผลกระทบ และการตอบสนองความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    signatureNumber = { sign: '13', pos: '14', date: '15' };

    tableHeaderHtml = `
      <tr>
        <th style="width: 70px;">(3)<br/>รหัส</th>
        <th>(4)<br/>โครงการ/กิจกรรม</th>
        <th>(5)<br/>วัตถุประสงค์</th>
        <th>(6)<br/>เหตุการณ์ความเสี่ยง</th>
        <th>(7)<br/>ปัจจัยเสี่ยง</th>
        <th>(8)<br/>ประเภทความเสี่ยง</th>
        <th>(9)<br/>การควบคุมที่มีอยู่</th>
        <th style="width: 45px;">(10)<br/>โอกาส(L)</th>
        <th style="width: 45px;">(10)<br/>ผลกระทบ(I)</th>
        <th style="width: 65px;">(10)<br/>ระดับ(LxI)</th>
        <th>(11)<br/>วิธีการตอบสนองความเสี่ยง</th>
        <th style="width: 100px;">ส่วนราชการ</th>
      </tr>
    `;

    tableBodyHtml = filteredBs2.map((item) => {
      const l = Number(item.likelihood) || 1;
      const i = Number(item.impact) || 1;
      const score = l * i;
      const level = score >= 15 ? 'สูงมาก' : score >= 10 ? 'สูง' : score >= 5 ? 'ปานกลาง' : 'ต่ำ';
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode)}</td>
          <td style="font-weight: bold;">${escapeHtml(item.activity)}</td>
          <td>${escapeHtml(item.objective || '')}</td>
          <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent)}</td>
          <td>${escapeHtml(item.cause || '')}</td>
          <td>${escapeHtml(item.riskCategory || '')}</td>
          <td>${escapeHtml(item.existingControl || '-')}</td>
          <td style="text-align: center;">${l}</td>
          <td style="text-align: center;">${i}</td>
          <td style="text-align: center; font-weight: bold;">${score} (${level})</td>
          <td style="color: #1d4ed8;">${escapeHtml(item.riskResponse || '')}</td>
          <td style="text-align: center;">${escapeHtml(item.department || '')}</td>
        </tr>
      `;
    }).join('');
  } else if (activeTab === 'bs3') {
    formNumber = '3';
    formName = 'บส.3';
    title = 'รายงานการจัดทำแผนบริหารความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    signatureNumber = { sign: '12', pos: '13', date: '14' };

    tableHeaderHtml = `
      <tr>
        <th style="width: 70px;">(3)<br/>รหัส</th>
        <th>(4)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th>(5)<br/>ความเสี่ยง</th>
        <th>(6)<br/>วิธีการตอบสนองความเสี่ยง</th>
        <th style="width: 100px;">(7)<br/>ผู้รับผิดชอบ</th>
        <th>(8)<br/>วิธีการจัดการความเสี่ยง (มาตรการ)</th>
        <th>(9)<br/>ตัวชี้วัด</th>
        <th style="width: 100px;">(10)<br/>ระยะเวลา</th>
        <th>(11)<br/>วิธีการติดตามและการรายงาน</th>
      </tr>
    `;

    tableBodyHtml = filteredBs3.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode)}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity)}</td>
        <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent)}</td>
        <td>${escapeHtml(item.riskResponse)}</td>
        <td>${escapeHtml(item.responsiblePerson)}</td>
        <td>${escapeHtml(item.measures)}</td>
        <td>${escapeHtml(item.kpi)}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline)}</td>
        <td>${escapeHtml(item.monitoringMethod)}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs4') {
    formNumber = '4';
    formName = 'บส.4';
    const periodLabel = bs4Period === '3month' ? 'รอบ 3 เดือน' : bs4Period === '6month' ? 'รอบ 6 เดือน' : 'รอบ 12 เดือน';
    title = `รายงานการติดตามผลการบริหารความเสี่ยง (${periodLabel})`;
    subtitle = `ประจำปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    signatureNumber = { sign: '12', pos: '13', date: '14' };

    tableHeaderHtml = `
      <tr>
        <th style="width: 70px;">(3)<br/>รหัส</th>
        <th>(4)<br/>โครงการ/กิจกรรม</th>
        <th>(5)<br/>วิธีการจัดการความเสี่ยง</th>
        <th style="width: 90px;">(6)<br/>ระยะเวลา</th>
        <th style="width: 100px;">(7)<br/>ผู้รับผิดชอบ</th>
        <th>(8)<br/>ผลการดำเนินงาน</th>
        <th>(9)<br/>หลักฐานอ้างอิง</th>
        <th style="width: 65px;">(10)<br/>ร้อยละ</th>
        <th>(11)<br/>ปัญหา อุปสรรค และแนวทางแก้ไข</th>
      </tr>
    `;

    tableBodyHtml = filteredBs4.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode)}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity)}</td>
        <td>${escapeHtml(item.measures)}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline)}</td>
        <td>${escapeHtml(item.responsiblePerson)}</td>
        <td>${escapeHtml(item.result)}</td>
        <td>${escapeHtml(item.evidence)}</td>
        <td style="text-align: center; font-weight: bold;">${item.progressPercent}%</td>
        <td>${escapeHtml(item.problemSolution || '-')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs5') {
    formNumber = '5';
    formName = 'บส.5';
    title = 'รายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง';
    subtitle = `สำหรับปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    signatureNumber = { sign: '14', pos: '15', date: '16' };

    tableHeaderHtml = `
      <tr>
        <th rowspan="2" style="width: 60px;">(3)<br/>รหัส</th>
        <th rowspan="2">(4)<br/>โครงการ/กิจกรรม</th>
        <th rowspan="2">(5)<br/>ความเสี่ยง</th>
        <th colspan="3">(6) คะแนนก่อนดำเนินการ</th>
        <th rowspan="2">(7)<br/>วิธีการจัดการ</th>
        <th rowspan="2">(8)<br/>ผลการจัดการ</th>
        <th colspan="3">(9) คะแนนหลังดำเนินการ</th>
        <th rowspan="2" style="width: 60px;">(10)<br/>การเปลี่ยน</th>
        <th rowspan="2">(11)<br/>ความเสี่ยงคงเหลือ</th>
        <th colspan="2">(12) สรุปผล</th>
        <th rowspan="2">(13)<br/>มาตรการปีถัดไป</th>
      </tr>
      <tr>
        <th style="width: 35px;">(1)L</th>
        <th style="width: 35px;">(2)I</th>
        <th style="width: 45px;">(3)คะแนน</th>
        <th style="width: 35px;">(1)L</th>
        <th style="width: 35px;">(2)I</th>
        <th style="width: 45px;">(3)คะแนน</th>
        <th style="width: 50px;">ควบคุมได้</th>
        <th style="width: 55px;">ควบคุมไม่ได้</th>
      </tr>
    `;

    tableBodyHtml = filteredBs5Items.map((item) => {
      const preScore = (Number(item.preLikelihood) || 1) * (Number(item.preImpact) || 1);
      const postScore = (Number(item.postLikelihood) || 1) * (Number(item.postImpact) || 1);
      const isControllable = item.controllable === 'ควบคุมได้';
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode)}</td>
          <td style="font-weight: bold;">${escapeHtml(item.activity)}</td>
          <td style="color: #b91c1c;">${escapeHtml(item.riskEvent)}</td>
          <td style="text-align: center;">${item.preLikelihood}</td>
          <td style="text-align: center;">${item.preImpact}</td>
          <td style="text-align: center; font-weight: bold;">${preScore}</td>
          <td>${escapeHtml(item.measures)}</td>
          <td>${escapeHtml(item.result)}</td>
          <td style="text-align: center;">${item.postLikelihood}</td>
          <td style="text-align: center;">${item.postImpact}</td>
          <td style="text-align: center; font-weight: bold; color: #15803d;">${postScore}</td>
          <td style="text-align: center;">${escapeHtml(item.riskChange || 'ลดลง')}</td>
          <td>${escapeHtml(item.residualRisk || '-')}</td>
          <td style="text-align: center; font-weight: bold;">${isControllable ? '✓' : ''}</td>
          <td style="text-align: center; font-weight: bold; color: #b91c1c;">${!isControllable ? '✓' : ''}</td>
          <td>${escapeHtml(item.nextYearMeasures)}</td>
        </tr>
      `;
    }).join('');

    extraHtml = `
      <div style="margin-top: 15px; padding: 10px; border: 1px solid #ccc; background-color: #f8fafc;">
        <strong>สรุปภาพรวมผลการดำเนินการและการทบทวนแผนบริหารความเสี่ยง ประจำปี พ.ศ. ${selectedYear}:</strong><br/>
        <p style="text-indent: 2em; margin-top: 5px;">${escapeHtml(bs5Data.summary || '')}</p>
      </div>
    `;
  }

  const wordHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>แบบ ${formName} - ${escapeHtml(orgName)}</title>
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
          margin: 1.0cm 1.2cm 1.0cm 1.2cm;
          mso-header-margin: 35.4pt;
          mso-footer-margin: 35.4pt;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
        }
        body {
          font-family: 'TH Sarabun PSK', 'TH Sarabun New', 'Angsana New', sans-serif;
          font-size: 15pt;
          color: #000000;
          line-height: 1.25;
        }
        .header-top {
          text-align: right;
          font-weight: bold;
          font-size: 15pt;
          margin-bottom: 6px;
        }
        .header-center {
          text-align: center;
          margin-bottom: 14px;
        }
        .header-center h2 {
          font-size: 18pt;
          font-weight: bold;
          margin: 0 0 4px 0;
        }
        .header-center h3 {
          font-size: 16pt;
          font-weight: bold;
          margin: 0 0 4px 0;
        }
        .header-center p {
          font-size: 15pt;
          margin: 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin-top: 8px;
          margin-bottom: 12px;
        }
        th, td {
          border: 1px solid #000000;
          padding: 5px 6px;
          vertical-align: top;
          font-size: 13pt;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: center;
        }
        .sig-block {
          width: 320px;
          float: right;
          text-align: center;
          margin-top: 25px;
          font-size: 14pt;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <div class="header-top">แบบ บส. ${formNumber}</div>
        <div class="header-center">
          <h2>ชื่อหน่วยงาน (1) ${escapeHtml(orgName)}</h2>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(subtitle)}</p>
        </div>

        <table>
          <thead>
            ${tableHeaderHtml}
          </thead>
          <tbody>
            ${tableBodyHtml || '<tr><td colspan="15" style="text-align:center; padding: 20px;">ไม่พบข้อมูล</td></tr>'}
          </tbody>
        </table>

        ${extraHtml}

        <div style="clear: both;"></div>

        <div class="sig-block">
          <div>ลายมือชื่อ...................................................</div>
          <div>( ${escapeHtml(approverName)} )</div>
          <div>ตำแหน่ง ${escapeHtml(approverPosition)}</div>
          <div>วันที่......................................................</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const fileName = `แบบ_${formName}${deptLabel}_ปี${selectedYear}.doc`;
  downloadBlob(wordHtml, fileName, 'application/msword');
}

// -------------------------------------------------------------
// 2. ส่งออกเป็น Microsoft Excel (.xls)
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
  let signatureNumber = { sign: '10', pos: '11', date: '12' };

  if (activeTab === 'bs1') {
    formNumber = '1';
    formName = 'บส.1';
    title = 'กำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)';
    subtitle = `ประจำปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    colSpanTotal = 8;
    signatureNumber = { sign: '10', pos: '11', date: '12' };

    tableHeaderHtml = `
      <tr>
        <th style="background-color: #D9E1F2;">(3) รหัสความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(4) ยุทธศาสตร์ที่รับผิดชอบ</th>
        <th style="background-color: #D9E1F2;">(5) โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th style="background-color: #D9E1F2;">(6) งบประมาณ (บาท)</th>
        <th style="background-color: #D9E1F2;">(7) วัตถุประสงค์</th>
        <th style="background-color: #D9E1F2;">(8) ตัวชี้วัด</th>
        <th style="background-color: #D9E1F2;">(9) เป้าหมาย</th>
        <th style="background-color: #D9E1F2;">ส่วนราชการ</th>
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
        <td style="text-align: center;">${escapeHtml(item.department || '')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs2') {
    formNumber = '2';
    formName = 'บส.2';
    title = 'การวิเคราะห์โอกาส ผลกระทบ และการตอบสนองความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    colSpanTotal = 12;
    signatureNumber = { sign: '13', pos: '14', date: '15' };

    tableHeaderHtml = `
      <tr>
        <th style="background-color: #D9E1F2;">(3) รหัส</th>
        <th style="background-color: #D9E1F2;">(4) โครงการ/กิจกรรม</th>
        <th style="background-color: #D9E1F2;">(5) วัตถุประสงค์</th>
        <th style="background-color: #D9E1F2;">(6) เหตุการณ์ความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(7) ปัจจัยเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(8) ประเภทความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(9) การควบคุมที่มีอยู่</th>
        <th style="background-color: #D9E1F2;">(10) โอกาส(L)</th>
        <th style="background-color: #D9E1F2;">(10) ผลกระทบ(I)</th>
        <th style="background-color: #D9E1F2;">(10) ระดับ(LxI)</th>
        <th style="background-color: #D9E1F2;">(11) วิธีการตอบสนองความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">ส่วนราชการ</th>
      </tr>
    `;

    tableBodyHtml = filteredBs2.map((item) => {
      const l = Number(item.likelihood) || 1;
      const i = Number(item.impact) || 1;
      const score = l * i;
      const level = score >= 15 ? 'สูงมาก' : score >= 10 ? 'สูง' : score >= 5 ? 'ปานกลาง' : 'ต่ำ';
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode)}</td>
          <td>${escapeHtml(item.activity)}</td>
          <td>${escapeHtml(item.objective || '')}</td>
          <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent)}</td>
          <td>${escapeHtml(item.cause || '')}</td>
          <td>${escapeHtml(item.riskCategory || '')}</td>
          <td>${escapeHtml(item.existingControl || '-')}</td>
          <td style="text-align: center;">${l}</td>
          <td style="text-align: center;">${i}</td>
          <td style="text-align: center; font-weight: bold;">${score} (${level})</td>
          <td>${escapeHtml(item.riskResponse || '')}</td>
          <td style="text-align: center;">${escapeHtml(item.department || '')}</td>
        </tr>
      `;
    }).join('');
  } else if (activeTab === 'bs3') {
    formNumber = '3';
    formName = 'บส.3';
    title = 'รายงานการจัดทำแผนบริหารความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    colSpanTotal = 9;
    signatureNumber = { sign: '12', pos: '13', date: '14' };

    tableHeaderHtml = `
      <tr>
        <th style="background-color: #D9E1F2;">(3) รหัส</th>
        <th style="background-color: #D9E1F2;">(4) โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="background-color: #D9E1F2;">(5) ความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(6) วิธีการตอบสนองความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(7) ผู้รับผิดชอบ</th>
        <th style="background-color: #D9E1F2;">(8) วิธีการจัดการความเสี่ยง (มาตรการ)</th>
        <th style="background-color: #D9E1F2;">(9) ตัวชี้วัด</th>
        <th style="background-color: #D9E1F2;">(10) ระยะเวลา</th>
        <th style="background-color: #D9E1F2;">(11) วิธีการติดตามและการรายงาน</th>
      </tr>
    `;

    tableBodyHtml = filteredBs3.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode)}</td>
        <td>${escapeHtml(item.activity)}</td>
        <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent)}</td>
        <td>${escapeHtml(item.riskResponse)}</td>
        <td>${escapeHtml(item.responsiblePerson)}</td>
        <td>${escapeHtml(item.measures)}</td>
        <td>${escapeHtml(item.kpi)}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline)}</td>
        <td>${escapeHtml(item.monitoringMethod)}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs4') {
    formNumber = '4';
    formName = 'บส.4';
    const periodLabel = bs4Period === '3month' ? 'รอบ 3 เดือน' : bs4Period === '6month' ? 'รอบ 6 เดือน' : 'รอบ 12 เดือน';
    title = `รายงานการติดตามผลการบริหารความเสี่ยง (${periodLabel})`;
    subtitle = `ประจำปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    colSpanTotal = 9;
    signatureNumber = { sign: '12', pos: '13', date: '14' };

    tableHeaderHtml = `
      <tr>
        <th style="background-color: #D9E1F2;">(3) รหัส</th>
        <th style="background-color: #D9E1F2;">(4) โครงการ/กิจกรรม</th>
        <th style="background-color: #D9E1F2;">(5) วิธีการจัดการความเสี่ยง</th>
        <th style="background-color: #D9E1F2;">(6) ระยะเวลา</th>
        <th style="background-color: #D9E1F2;">(7) ผู้รับผิดชอบ</th>
        <th style="background-color: #D9E1F2;">(8) ผลการดำเนินงาน</th>
        <th style="background-color: #D9E1F2;">(9) หลักฐานอ้างอิง</th>
        <th style="background-color: #D9E1F2;">(10) ร้อยละความก้าวหน้า</th>
        <th style="background-color: #D9E1F2;">(11) ปัญหา อุปสรรค และแนวทางแก้ไข</th>
      </tr>
    `;

    tableBodyHtml = filteredBs4.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode)}</td>
        <td>${escapeHtml(item.activity)}</td>
        <td>${escapeHtml(item.measures)}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline)}</td>
        <td>${escapeHtml(item.responsiblePerson)}</td>
        <td>${escapeHtml(item.result)}</td>
        <td>${escapeHtml(item.evidence)}</td>
        <td style="text-align: center; font-weight: bold;">${item.progressPercent}%</td>
        <td>${escapeHtml(item.problemSolution || '-')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs5') {
    formNumber = '5';
    formName = 'บส.5';
    title = 'รายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง';
    subtitle = `สำหรับปีงบประมาณ พ.ศ. (2) ${selectedYear}`;
    colSpanTotal = 16;
    signatureNumber = { sign: '14', pos: '15', date: '16' };

    tableHeaderHtml = `
      <tr>
        <th rowspan="2" style="background-color: #D9E1F2;">(3) รหัส</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(4) โครงการ/กิจกรรม</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(5) ความเสี่ยง</th>
        <th colspan="3" style="background-color: #D9E1F2;">(6) คะแนนก่อนดำเนินการ</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(7) วิธีการจัดการ</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(8) ผลการจัดการ</th>
        <th colspan="3" style="background-color: #D9E1F2;">(9) คะแนนหลังดำเนินการ</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(10) การเปลี่ยน</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(11) ความเสี่ยงคงเหลือ</th>
        <th colspan="2" style="background-color: #D9E1F2;">(12) สรุปผล</th>
        <th rowspan="2" style="background-color: #D9E1F2;">(13) มาตรการปีถัดไป</th>
      </tr>
      <tr>
        <th style="background-color: #D9E1F2;">(1)L</th>
        <th style="background-color: #D9E1F2;">(2)I</th>
        <th style="background-color: #D9E1F2;">(3)คะแนน</th>
        <th style="background-color: #D9E1F2;">(1)L</th>
        <th style="background-color: #D9E1F2;">(2)I</th>
        <th style="background-color: #D9E1F2;">(3)คะแนน</th>
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
          <td style="text-align: center; font-weight: bold;">${escapeHtml(item.riskCode)}</td>
          <td>${escapeHtml(item.activity)}</td>
          <td style="color: #b91c1c;">${escapeHtml(item.riskEvent)}</td>
          <td style="text-align: center;">${item.preLikelihood}</td>
          <td style="text-align: center;">${item.preImpact}</td>
          <td style="text-align: center; font-weight: bold;">${preScore}</td>
          <td>${escapeHtml(item.measures)}</td>
          <td>${escapeHtml(item.result)}</td>
          <td style="text-align: center;">${item.postLikelihood}</td>
          <td style="text-align: center;">${item.postImpact}</td>
          <td style="text-align: center; font-weight: bold; color: #15803d;">${postScore}</td>
          <td style="text-align: center;">${escapeHtml(item.riskChange || 'ลดลง')}</td>
          <td>${escapeHtml(item.residualRisk || '-')}</td>
          <td style="text-align: center; font-weight: bold;">${isControllable ? '✓' : ''}</td>
          <td style="text-align: center; font-weight: bold; color: #b91c1c;">${!isControllable ? '✓' : ''}</td>
          <td>${escapeHtml(item.nextYearMeasures)}</td>
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
          <td colspan="${colSpanTotal}" class="title-row">ชื่อหน่วยงาน (1) ${escapeHtml(orgName)}</td>
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
          <td colspan="4" style="border:none; text-align: center;">ลายมือชื่อ...................................................</td>
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
          <td colspan="4" style="border:none; text-align: center;">วันที่......................................................</td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const fileName = `แบบ_${formName}${deptLabel}_ปี${selectedYear}.xls`;
  downloadBlob(excelHtml, fileName, 'application/vnd.ms-excel');
}
