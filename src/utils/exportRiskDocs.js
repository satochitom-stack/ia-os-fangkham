/**
 * exportRiskDocs.js
 * ส่งออกรายงานการบริหารจัดการความเสี่ยง (แบบ บส. 1 ถึง บส. 5)
 * ตามหนังสือสั่งการกระทรวงมหาดไทย ที่ มท 0805.2/ว 3482
 * รองรับการส่งออกเป็นไฟล์:
 * 1. Microsoft Word (.doc) - ฟอร์มตรงตามมาตรฐาน ว 3482 สมบูรณ์
 * 2. Adobe PDF (.pdf / Print A4 Landscape) - คุณภาพสูง พิมพ์/บันทึก PDF ทันที
 * 3. Microsoft Excel (.xls) - สรุปตารางคำนวณและวิเคราะห์ผล
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
  let colgroupHtml = '';
  let extraHtml = '';
  let signatureNumber = { sign: '๑๐', pos: '๑๑', date: '๑๒' };

  if (activeTab === 'bs1') {
    formNumber = '1';
    formName = 'บส.1';
    title = 'กำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '๑๐', pos: '๑๑', date: '๑๒' };

    const showDeptCol = (!effectiveDept || effectiveDept === 'all');
    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f8fafc;">
        <th style="width: 55pt; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th style="width: 120pt; text-align: center;">(๔)<br/>ยุทธศาสตร์ที่รับผิดชอบ</th>
        <th style="text-align: center;">(๕)<br/>โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th style="width: 75pt; text-align: center;">(๖)<br/>งบประมาณ (บาท)</th>
        <th style="text-align: center;">(๗)<br/>วัตถุประสงค์</th>
        <th style="width: 90pt; text-align: center;">(๘)<br/>ตัวชี้วัด</th>
        <th style="width: 85pt; text-align: center;">(๙)<br/>เป้าหมาย</th>
        ${showDeptCol ? '<th style="width: 85pt; text-align: center;">ส่วนราชการ</th>' : ''}
      </tr>
    `;

    tableBodyHtml = filteredBs1.map((item, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || `RSK-0${idx + 1}`))}</td>
        <td>${escapeHtml(item.strategy || '')}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
        <td style="text-align: right;">${item.budget ? escapeHtml(toThaiDigits(Number(item.budget).toLocaleString())) : '-'}</td>
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
    signatureNumber = { sign: '๑๓', pos: '๑๔', date: '๑๕' };

    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f8fafc;">
        <th style="width: 55pt; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th style="text-align: center;">(๔)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="text-align: center;">(๕)<br/>วัตถุประสงค์</th>
        <th style="width: 90pt; text-align: center;">(๖)<br/>ผู้รับผิดชอบ</th>
        <th style="text-align: center;">(๗)<br/>ความเสี่ยง</th>
        <th style="width: 95pt; text-align: center;">(๘)<br/>ประเภทความเสี่ยง</th>
        <th style="width: 35pt; text-align: center;">(๙)<br/>คะแนนโอกาส</th>
        <th style="width: 35pt; text-align: center;">(๑๐)<br/>คะแนนผลกระทบ</th>
        <th style="width: 65pt; text-align: center;">(๑๑)<br/>ระดับความเสี่ยง<br/>(๙) x (๑๐)</th>
        <th style="text-align: center;">(๑๒)<br/>วิธีการตอบสนองความเสี่ยง</th>
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
          <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || ''))}</td>
          <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
          <td>${escapeHtml(item.objective || '')}</td>
          <td>${escapeHtml(item.responsiblePerson || '')}</td>
          <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent || '')}</td>
          <td>${escapeHtml(item.riskCategory || '')}</td>
          <td style="text-align: center;">${toThaiDigits(l)}</td>
          <td style="text-align: center;">${toThaiDigits(i)}</td>
          <td style="text-align: center; font-weight: bold;">${toThaiDigits(score)} (${level})</td>
          <td style="color: #1d4ed8;">${escapeHtml(item.riskResponse || '')}</td>
        </tr>
      `;
    }).join('');
  } else if (activeTab === 'bs3') {
    formNumber = '3';
    formName = 'บส.3';
    title = 'รายงานการจัดทำแผนบริหารความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '๑๒', pos: '๑๓', date: '๑๔' };

    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f8fafc;">
        <th style="width: 55pt; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th style="text-align: center;">(๔)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="text-align: center;">(๕)<br/>ความเสี่ยง</th>
        <th style="text-align: center;">(๖)<br/>วิธีการตอบสนองความเสี่ยง</th>
        <th style="width: 85pt; text-align: center;">(๗)<br/>ผู้รับผิดชอบ</th>
        <th style="text-align: center;">(๘)<br/>วิธีการจัดการความเสี่ยง (มาตรการ)</th>
        <th style="width: 85pt; text-align: center;">(๙)<br/>ตัวชี้วัด</th>
        <th style="width: 80pt; text-align: center;">(๑๐)<br/>ระยะเวลาดำเนินการ</th>
        <th style="text-align: center;">(๑๑)<br/>วิธีการติดตาม และการรายงาน</th>
      </tr>
    `;

    tableBodyHtml = filteredBs3.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || ''))}</td>
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
    const periodLabel = bs4Period === '3month' ? 'รอบ 3 เดือน' : bs4Period === '6month' ? 'รอบ 6 เดือน' : 'รอบ 12 เดือน';
    title = `รายงานการติดตามผลการบริหารความเสี่ยง (${periodLabel})`;
    subtitle = `สำหรับปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '๑๒', pos: '๑๓', date: '๑๔' };

    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f8fafc;">
        <th style="width: 55pt; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th style="text-align: center;">(๔)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="text-align: center;">(๕)<br/>วิธีการจัดการความเสี่ยง</th>
        <th style="width: 75pt; text-align: center;">(๖)<br/>ระยะเวลาดำเนินการ</th>
        <th style="width: 85pt; text-align: center;">(๗)<br/>ผู้รับผิดชอบ</th>
        <th style="text-align: center;">(๘)<br/>ผลลัพธ์การดำเนินการจัดการความเสี่ยง</th>
        <th style="width: 85pt; text-align: center;">(๙)<br/>เอกสาร/หลักฐาน</th>
        <th style="width: 55pt; text-align: center;">(๑๐)<br/>ร้อยละความคืบหน้า</th>
        <th style="text-align: center;">(๑๑)<br/>ปัญหาอุปสรรค และแนวทางแก้ไข</th>
      </tr>
    `;

    tableBodyHtml = filteredBs4.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || ''))}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
        <td>${escapeHtml(item.measures || '')}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline || '')}</td>
        <td>${escapeHtml(item.responsiblePerson || '')}</td>
        <td>${escapeHtml(item.result || '')}</td>
        <td>${escapeHtml(item.evidence || '')}</td>
        <td style="text-align: center; font-weight: bold;">${toThaiDigits(item.progressPercent || 0)}%</td>
        <td>${escapeHtml(item.problemSolution || '-')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs5') {
    formNumber = '5';
    formName = 'บส.5';
    title = 'รายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง';
    subtitle = `สำหรับปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '๑๔', pos: '๑๕', date: '๑๖' };

    colgroupHtml = `
      <colgroup>
        <col style="width: 45pt;" />
        <col style="width: 90pt;" />
        <col style="width: 85pt;" />
        <col style="width: 28pt;" />
        <col style="width: 28pt;" />
        <col style="width: 40pt;" />
        <col style="width: 80pt;" />
        <col style="width: 80pt;" />
        <col style="width: 28pt;" />
        <col style="width: 28pt;" />
        <col style="width: 40pt;" />
        <col style="width: 45pt;" />
        <col style="width: 75pt;" />
        <col style="width: 38pt;" />
        <col style="width: 38pt;" />
        <col style="width: 80pt;" />
      </colgroup>
    `;

    tableHeaderHtml = `
      <tr style="mso-yfti-tblheader: yes; background-color: #f8fafc;">
        <th rowspan="2" style="width: 45pt; vertical-align: middle; text-align: center;"><!--[if gte mso 9]><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><![endif]-->(๓)<br/>รหัสความเสี่ยง</th>
        <th rowspan="2" style="width: 90pt; vertical-align: middle; text-align: center;"><!--[if gte mso 9]><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><![endif]-->(๔)<br/>โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th rowspan="2" style="width: 85pt; vertical-align: middle; text-align: center;"><!--[if gte mso 9]><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><![endif]-->(๕)<br/>ความเสี่ยง</th>
        <th colspan="3" style="vertical-align: middle; text-align: center;">(๖)<br/>คะแนนระดับความเสี่ยง<br/>ก่อนการดำเนินการจัดการความเสี่ยง</th>
        <th rowspan="2" style="width: 80pt; vertical-align: middle; text-align: center;"><!--[if gte mso 9]><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><![endif]-->(๗)<br/>วิธีการจัดการความเสี่ยง</th>
        <th rowspan="2" style="width: 80pt; vertical-align: middle; text-align: center;"><!--[if gte mso 9]><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><![endif]-->(๘)<br/>ผลดำเนินการจากการจัดการความเสี่ยง</th>
        <th colspan="3" style="vertical-align: middle; text-align: center;">(๙)<br/>คะแนนระดับความเสี่ยง<br/>ภายหลังการดำเนินการจัดการความเสี่ยง</th>
        <th rowspan="2" style="width: 45pt; vertical-align: middle; text-align: center;"><!--[if gte mso 9]><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><![endif]-->(๑๐)<br/>การเปลี่ยนแปลงระดับความเสี่ยง</th>
        <th rowspan="2" style="width: 75pt; vertical-align: middle; text-align: center;"><!--[if gte mso 9]><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><![endif]-->(๑๑)<br/>ความเสี่ยงคงเหลือ/เกิดขึ้นใหม่</th>
        <th colspan="2" style="vertical-align: middle; text-align: center;">(๑๒)<br/>สรุปความเสี่ยง</th>
        <th rowspan="2" style="width: 80pt; vertical-align: middle; text-align: center;"><!--[if gte mso 9]><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><![endif]-->(๑๓)<br/>แนวทาง/มาตรการจัดการความเสี่ยง/วิธีการดำเนินการ สำหรับปีถัดไป</th>
      </tr>
      <tr style="mso-yfti-tblheader: yes; background-color: #f8fafc;">
        <!--[if gte mso 9]><th style="border-top: none; mso-border-top-alt: none; padding: 0; height: 0;"><w:tcPr><w:vMerge/></w:tcPr></th><![endif]-->
        <!--[if gte mso 9]><th style="border-top: none; mso-border-top-alt: none; padding: 0; height: 0;"><w:tcPr><w:vMerge/></w:tcPr></th><![endif]-->
        <!--[if gte mso 9]><th style="border-top: none; mso-border-top-alt: none; padding: 0; height: 0;"><w:tcPr><w:vMerge/></w:tcPr></th><![endif]-->
        <th style="width: 28pt; vertical-align: middle; text-align: center;">โอกาส<br/>(๑)</th>
        <th style="width: 28pt; vertical-align: middle; text-align: center;">ผลกระทบ<br/>(๒)</th>
        <th style="width: 40pt; vertical-align: middle; text-align: center;">คะแนนระดับความเสี่ยง<br/>(๓) = (๑) x (๒)</th>
        <!--[if gte mso 9]><th style="border-top: none; mso-border-top-alt: none; padding: 0; height: 0;"><w:tcPr><w:vMerge/></w:tcPr></th><![endif]-->
        <!--[if gte mso 9]><th style="border-top: none; mso-border-top-alt: none; padding: 0; height: 0;"><w:tcPr><w:vMerge/></w:tcPr></th><![endif]-->
        <th style="width: 28pt; vertical-align: middle; text-align: center;">โอกาส<br/>(๑)</th>
        <th style="width: 28pt; vertical-align: middle; text-align: center;">ผลกระทบ<br/>(๒)</th>
        <th style="width: 40pt; vertical-align: middle; text-align: center;">คะแนนระดับความเสี่ยง<br/>(๓) = (๑) x (๒)</th>
        <!--[if gte mso 9]><th style="border-top: none; mso-border-top-alt: none; padding: 0; height: 0;"><w:tcPr><w:vMerge/></w:tcPr></th><![endif]-->
        <!--[if gte mso 9]><th style="border-top: none; mso-border-top-alt: none; padding: 0; height: 0;"><w:tcPr><w:vMerge/></w:tcPr></th><![endif]-->
        <th style="width: 38pt; vertical-align: middle; text-align: center;">ควบคุมได้</th>
        <th style="width: 38pt; vertical-align: middle; text-align: center;">ควบคุมไม่ได้</th>
        <!--[if gte mso 9]><th style="border-top: none; mso-border-top-alt: none; padding: 0; height: 0;"><w:tcPr><w:vMerge/></w:tcPr></th><![endif]-->
      </tr>
    `;

    tableBodyHtml = filteredBs5Items.map((item) => {
      const preScore = (Number(item.preLikelihood) || 1) * (Number(item.preImpact) || 1);
      const postScore = (Number(item.postLikelihood) || 1) * (Number(item.postImpact) || 1);
      const isControllable = item.controllable === 'ควบคุมได้';
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || ''))}</td>
          <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
          <td style="color: #b91c1c;">${escapeHtml(item.riskEvent || '')}</td>
          <td style="text-align: center;">${toThaiDigits(item.preLikelihood || 1)}</td>
          <td style="text-align: center;">${toThaiDigits(item.preImpact || 1)}</td>
          <td style="text-align: center; font-weight: bold;">${toThaiDigits(preScore)}</td>
          <td>${escapeHtml(item.measures || '')}</td>
          <td>${escapeHtml(item.result || '')}</td>
          <td style="text-align: center;">${toThaiDigits(item.postLikelihood || 1)}</td>
          <td style="text-align: center;">${toThaiDigits(item.postImpact || 1)}</td>
          <td style="text-align: center; font-weight: bold; color: #15803d;">${toThaiDigits(postScore)}</td>
          <td style="text-align: center;">${escapeHtml(item.riskChange || 'ลดลง')}</td>
          <td>${escapeHtml(item.residualRisk || '-')}</td>
          <td style="text-align: center; font-weight: bold;">${isControllable ? '✓' : ''}</td>
          <td style="text-align: center; font-weight: bold; color: #b91c1c;">${!isControllable ? '✓' : ''}</td>
          <td>${escapeHtml(item.nextYearMeasures || '')}</td>
        </tr>
      `;
    }).join('');

    extraHtml = `
      <div style="margin-top: 15px; padding: 10px; border: 1px solid #ccc; background-color: #f8fafc;">
        <strong>สรุปภาพรวมผลการดำเนินการและการทบทวนแผนบริหารความเสี่ยง ประจำปี พ.ศ. ${toThaiDigits(selectedYear)}:</strong><br/>
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
          font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Angsana New', sans-serif;
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
          font-size: 17pt;
          font-weight: bold;
          margin: 0 0 3px 0;
        }
        .header-center h3 {
          font-size: 16pt;
          font-weight: bold;
          margin: 0 0 3px 0;
        }
        .header-center p {
          font-size: 15pt;
          margin: 0;
        }
        table {
          border-collapse: collapse;
          mso-table-layout-alt: fixed;
          mso-padding-alt: 4pt 4pt 4pt 4pt;
          width: 100%;
          margin-top: 8px;
          margin-bottom: 12px;
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
          width: 380pt;
          float: right;
          text-align: left;
          margin-top: 25pt;
          font-size: 14pt;
          line-height: 1.8;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <div class="header-top">แบบ บส. ${toThaiDigits(formNumber)}</div>
        <div class="header-center">
          <p style="font-size: 16pt; font-weight: bold; margin: 0 0 3px 0;">ชื่อหน่วยงาน ${escapeHtml(orgName)} (๑)</p>
          <h2 style="font-size: 17pt; font-weight: bold; margin: 0 0 3px 0;">${escapeHtml(title)}</h2>
          <p style="font-size: 15pt; margin: 0;">${escapeHtml(subtitle ? subtitle.replace(/[0-9]/g, d => toThaiDigits(d)) : '')} (๒)</p>
        </div>

        <table>
          ${colgroupHtml}
          <thead>
            ${tableHeaderHtml}
          </thead>
          <tbody>
            ${tableBodyHtml || '<tr><td colspan="16" style="text-align:center; padding: 20px;">ไม่พบข้อมูล</td></tr>'}
          </tbody>
        </table>

        ${extraHtml}

        <div style="clear: both;"></div>

        <div class="sig-block">
          <div>ลายมือชื่อ...................................................(${signatureNumber.sign})...................................................</div>
          <div style="text-indent: 40pt;">( ${escapeHtml(approverName)} )</div>
          <div>ตำแหน่ง .................................................(${signatureNumber.pos}).................................................</div>
          <div style="text-indent: 40pt;">${escapeHtml(approverPosition)}</div>
          <div>วันที่............เดือน...............(${signatureNumber.date}).............พ.ศ. .....................</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const fileName = `แบบ_${formName}${deptLabel}_ปี${selectedYear}.doc`;
  downloadBlob(wordHtml, fileName, 'application/msword');
}

// -------------------------------------------------------------
// 2. ส่งออกและพิมพ์เป็น PDF (A4 แนวนอน มาตรฐาน ว 3482)
// -------------------------------------------------------------
export function exportBsToPdf({
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
  let signatureNumber = { sign: '๑๐', pos: '๑๑', date: '๑๒' };

  if (activeTab === 'bs1') {
    formNumber = '1';
    formName = 'บส.1';
    title = 'กำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '๑๐', pos: '๑๑', date: '๑๒' };

    const showDeptCol = (!effectiveDept || effectiveDept === 'all');
    tableHeaderHtml = `
      <tr>
        <th style="width: 55pt; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th style="width: 120pt; text-align: center;">(๔)<br/>ยุทธศาสตร์ที่รับผิดชอบ</th>
        <th style="text-align: center;">(๕)<br/>โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th style="width: 75pt; text-align: center;">(๖)<br/>งบประมาณ (บาท)</th>
        <th style="text-align: center;">(๗)<br/>วัตถุประสงค์</th>
        <th style="width: 90pt; text-align: center;">(๘)<br/>ตัวชี้วัด</th>
        <th style="width: 85pt; text-align: center;">(๙)<br/>เป้าหมาย</th>
        ${showDeptCol ? '<th style="width: 85pt; text-align: center;">ส่วนราชการ</th>' : ''}
      </tr>
    `;

    tableBodyHtml = filteredBs1.map((item, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || `RSK-0${idx + 1}`))}</td>
        <td>${escapeHtml(item.strategy || '')}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
        <td style="text-align: right;">${item.budget ? escapeHtml(toThaiDigits(Number(item.budget).toLocaleString())) : '-'}</td>
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
    signatureNumber = { sign: '๑๓', pos: '๑๔', date: '๑๕' };

    tableHeaderHtml = `
      <tr>
        <th style="width: 55pt; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th style="text-align: center;">(๔)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="text-align: center;">(๕)<br/>วัตถุประสงค์</th>
        <th style="width: 90pt; text-align: center;">(๖)<br/>ผู้รับผิดชอบ</th>
        <th style="text-align: center;">(๗)<br/>ความเสี่ยง</th>
        <th style="width: 95pt; text-align: center;">(๘)<br/>ประเภทความเสี่ยง</th>
        <th style="width: 35pt; text-align: center;">(๙)<br/>คะแนนโอกาส</th>
        <th style="width: 35pt; text-align: center;">(๑๐)<br/>คะแนนผลกระทบ</th>
        <th style="width: 65pt; text-align: center;">(๑๑)<br/>ระดับความเสี่ยง<br/>(๙) x (๑๐)</th>
        <th style="text-align: center;">(๑๒)<br/>วิธีการตอบสนองความเสี่ยง</th>
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
          <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || ''))}</td>
          <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
          <td>${escapeHtml(item.objective || '')}</td>
          <td>${escapeHtml(item.responsiblePerson || '')}</td>
          <td style="color: #b91c1c; font-weight: bold;">${escapeHtml(item.riskEvent || '')}</td>
          <td>${escapeHtml(item.riskCategory || '')}</td>
          <td style="text-align: center;">${toThaiDigits(l)}</td>
          <td style="text-align: center;">${toThaiDigits(i)}</td>
          <td style="text-align: center; font-weight: bold;">${toThaiDigits(score)} (${level})</td>
          <td style="color: #1d4ed8;">${escapeHtml(item.riskResponse || '')}</td>
        </tr>
      `;
    }).join('');
  } else if (activeTab === 'bs3') {
    formNumber = '3';
    formName = 'บส.3';
    title = 'รายงานการจัดทำแผนบริหารความเสี่ยง';
    subtitle = `ประจำปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '๑๒', pos: '๑๓', date: '๑๔' };

    tableHeaderHtml = `
      <tr>
        <th style="width: 55pt; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th style="text-align: center;">(๔)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="text-align: center;">(๕)<br/>ความเสี่ยง</th>
        <th style="text-align: center;">(๖)<br/>วิธีการตอบสนองความเสี่ยง</th>
        <th style="width: 85pt; text-align: center;">(๗)<br/>ผู้รับผิดชอบ</th>
        <th style="text-align: center;">(๘)<br/>วิธีการจัดการความเสี่ยง (มาตรการ)</th>
        <th style="width: 85pt; text-align: center;">(๙)<br/>ตัวชี้วัด</th>
        <th style="width: 80pt; text-align: center;">(๑๐)<br/>ระยะเวลาดำเนินการ</th>
        <th style="text-align: center;">(๑๑)<br/>วิธีการติดตาม และการรายงาน</th>
      </tr>
    `;

    tableBodyHtml = filteredBs3.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || ''))}</td>
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
    const periodLabel = bs4Period === '3month' ? 'รอบ 3 เดือน' : bs4Period === '6month' ? 'รอบ 6 เดือน' : 'รอบ 12 เดือน';
    title = `รายงานการติดตามผลการบริหารความเสี่ยง (${periodLabel})`;
    subtitle = `สำหรับปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '๑๒', pos: '๑๓', date: '๑๔' };

    tableHeaderHtml = `
      <tr>
        <th style="width: 55pt; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th style="text-align: center;">(๔)<br/>โครงการ/กิจกรรม/ภารกิจ</th>
        <th style="text-align: center;">(๕)<br/>วิธีการจัดการความเสี่ยง</th>
        <th style="width: 75pt; text-align: center;">(๖)<br/>ระยะเวลาดำเนินการ</th>
        <th style="width: 85pt; text-align: center;">(๗)<br/>ผู้รับผิดชอบ</th>
        <th style="text-align: center;">(๘)<br/>ผลลัพธ์การดำเนินการจัดการความเสี่ยง</th>
        <th style="width: 85pt; text-align: center;">(๙)<br/>เอกสาร/หลักฐาน</th>
        <th style="width: 55pt; text-align: center;">(๑๐)<br/>ร้อยละความคืบหน้า</th>
        <th style="text-align: center;">(๑๑)<br/>ปัญหาอุปสรรค และแนวทางแก้ไข</th>
      </tr>
    `;

    tableBodyHtml = filteredBs4.map((item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || ''))}</td>
        <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
        <td>${escapeHtml(item.measures || '')}</td>
        <td style="text-align: center;">${escapeHtml(item.timeline || '')}</td>
        <td>${escapeHtml(item.responsiblePerson || '')}</td>
        <td>${escapeHtml(item.result || '')}</td>
        <td>${escapeHtml(item.evidence || '')}</td>
        <td style="text-align: center; font-weight: bold;">${toThaiDigits(item.progressPercent || 0)}%</td>
        <td>${escapeHtml(item.problemSolution || '-')}</td>
      </tr>
    `).join('');
  } else if (activeTab === 'bs5') {
    formNumber = '5';
    formName = 'บส.5';
    title = 'รายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง';
    subtitle = `สำหรับปีงบประมาณ พ.ศ. ${selectedYear}`;
    signatureNumber = { sign: '๑๔', pos: '๑๕', date: '๑๖' };

    tableHeaderHtml = `
      <tr>
        <th rowspan="2" style="width: 45pt; vertical-align: middle; text-align: center;">(๓)<br/>รหัสความเสี่ยง</th>
        <th rowspan="2" style="width: 95pt; vertical-align: middle; text-align: center;">(๔)<br/>โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ</th>
        <th rowspan="2" style="width: 85pt; vertical-align: middle; text-align: center;">(๕)<br/>ความเสี่ยง</th>
        <th colspan="3" style="vertical-align: middle; text-align: center;">(๖)<br/>คะแนนระดับความเสี่ยง<br/>ก่อนการดำเนินการจัดการความเสี่ยง</th>
        <th rowspan="2" style="width: 80pt; vertical-align: middle; text-align: center;">(๗)<br/>วิธีการจัดการความเสี่ยง</th>
        <th rowspan="2" style="width: 80pt; vertical-align: middle; text-align: center;">(๘)<br/>ผลดำเนินการจากการจัดการความเสี่ยง</th>
        <th colspan="3" style="vertical-align: middle; text-align: center;">(๙)<br/>คะแนนระดับความเสี่ยง<br/>ภายหลังการดำเนินการจัดการความเสี่ยง</th>
        <th rowspan="2" style="width: 50pt; vertical-align: middle; text-align: center;">(๑๐)<br/>การเปลี่ยนแปลงระดับความเสี่ยง</th>
        <th rowspan="2" style="width: 75pt; vertical-align: middle; text-align: center;">(๑๑)<br/>ความเสี่ยงคงเหลือ/เกิดขึ้นใหม่</th>
        <th colspan="2" style="vertical-align: middle; text-align: center;">(๑๒)<br/>สรุปความเสี่ยง</th>
        <th rowspan="2" style="width: 85pt; vertical-align: middle; text-align: center;">(๑๓)<br/>แนวทาง/มาตรการจัดการความเสี่ยง/วิธีการดำเนินการ สำหรับปีถัดไป</th>
      </tr>
      <tr>
        <th style="width: 28pt; vertical-align: middle; text-align: center;">โอกาส<br/>(๑)</th>
        <th style="width: 28pt; vertical-align: middle; text-align: center;">ผลกระทบ<br/>(๒)</th>
        <th style="width: 42pt; vertical-align: middle; text-align: center;">คะแนนระดับความเสี่ยง<br/>(๓) = (๑) x (๒)</th>
        <th style="width: 28pt; vertical-align: middle; text-align: center;">โอกาส<br/>(๑)</th>
        <th style="width: 28pt; vertical-align: middle; text-align: center;">ผลกระทบ<br/>(๒)</th>
        <th style="width: 42pt; vertical-align: middle; text-align: center;">คะแนนระดับความเสี่ยง<br/>(๓) = (๑) x (๒)</th>
        <th style="width: 38pt; vertical-align: middle; text-align: center;">ควบคุมได้</th>
        <th style="width: 38pt; vertical-align: middle; text-align: center;">ควบคุมไม่ได้</th>
      </tr>
    `;

    tableBodyHtml = filteredBs5Items.map((item) => {
      const preScore = (Number(item.preLikelihood) || 1) * (Number(item.preImpact) || 1);
      const postScore = (Number(item.postLikelihood) || 1) * (Number(item.postImpact) || 1);
      const isControllable = item.controllable === 'ควบคุมได้';
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${escapeHtml(toThaiDigits(item.riskCode || ''))}</td>
          <td style="font-weight: bold;">${escapeHtml(item.activity || '')}</td>
          <td style="color: #b91c1c;">${escapeHtml(item.riskEvent || '')}</td>
          <td style="text-align: center;">${toThaiDigits(item.preLikelihood || 1)}</td>
          <td style="text-align: center;">${toThaiDigits(item.preImpact || 1)}</td>
          <td style="text-align: center; font-weight: bold;">${toThaiDigits(preScore)}</td>
          <td>${escapeHtml(item.measures || '')}</td>
          <td>${escapeHtml(item.result || '')}</td>
          <td style="text-align: center;">${toThaiDigits(item.postLikelihood || 1)}</td>
          <td style="text-align: center;">${toThaiDigits(item.postImpact || 1)}</td>
          <td style="text-align: center; font-weight: bold; color: #15803d;">${toThaiDigits(postScore)}</td>
          <td style="text-align: center;">${escapeHtml(item.riskChange || 'ลดลง')}</td>
          <td>${escapeHtml(item.residualRisk || '-')}</td>
          <td style="text-align: center; font-weight: bold;">${isControllable ? '✓' : ''}</td>
          <td style="text-align: center; font-weight: bold; color: #b91c1c;">${!isControllable ? '✓' : ''}</td>
          <td>${escapeHtml(item.nextYearMeasures || '')}</td>
        </tr>
      `;
    }).join('');

    extraHtml = `
      <div style="margin-top: 12px; padding: 10px; border: 1px solid #999; background-color: #f8fafc; font-size: 13pt;">
        <strong>สรุปภาพรวมผลการดำเนินการและการทบทวนแผนบริหารความเสี่ยง ประจำปี พ.ศ. ${toThaiDigits(selectedYear)}:</strong>
        <p style="text-indent: 2em; margin-top: 4px; margin-bottom: 0;">${escapeHtml(bs5Data.summary || '')}</p>
      </div>
    `;
  }

  const pdfHtml = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="utf-8">
      <title>แบบ_บส.${toThaiDigits(formNumber)}${deptLabel}_ปี${selectedYear}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap');
        @page {
          size: A4 landscape;
          margin: 10mm 12mm 10mm 12mm;
        }
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', 'Angsana New', sans-serif;
          font-size: 14pt;
          color: #000;
          margin: 0;
          padding: 0;
          line-height: 1.25;
          background: #fff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .header-top {
          text-align: right;
          font-weight: bold;
          font-size: 14pt;
          margin-bottom: 4px;
        }
        .header-center {
          text-align: center;
          margin-bottom: 10px;
        }
        .header-center .org-line {
          font-size: 15pt;
          font-weight: bold;
          margin: 0 0 2px 0;
        }
        .header-center .title-line {
          font-size: 16pt;
          font-weight: bold;
          margin: 0 0 2px 0;
        }
        .header-center .sub-line {
          font-size: 14pt;
          margin: 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin-top: 6px;
          margin-bottom: 10px;
          font-size: 11.5pt;
        }
        thead {
          display: table-header-group;
        }
        tr {
          page-break-inside: avoid;
        }
        th, td {
          border: 1px solid #000;
          padding: 4px 5px;
          vertical-align: top;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
        }
        .sig-block {
          width: 380pt;
          float: right;
          text-align: left;
          margin-top: 20pt;
          font-size: 13.5pt;
          line-height: 1.7;
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>
      <div class="header-top">แบบ บส. ${toThaiDigits(formNumber)}</div>
      <div class="header-center">
        <p class="org-line">ชื่อหน่วยงาน ${escapeHtml(orgName)} (๑)</p>
        <h2 class="title-line">${escapeHtml(title)}</h2>
        <p class="sub-line">${escapeHtml(subtitle ? subtitle.replace(/[0-9]/g, d => toThaiDigits(d)) : '')} (๒)</p>
      </div>

      <table>
        <thead>
          ${tableHeaderHtml}
        </thead>
        <tbody>
          ${tableBodyHtml || '<tr><td colspan="16" style="text-align:center; padding: 20px;">ไม่พบข้อมูล</td></tr>'}
        </tbody>
      </table>

      ${extraHtml}

      <div style="clear: both;"></div>

      <div class="sig-block">
        <div>ลายมือชื่อ...................................................(${signatureNumber.sign})...................................................</div>
        <div style="text-indent: 40pt;">( ${escapeHtml(approverName)} )</div>
        <div>ตำแหน่ง .................................................(${signatureNumber.pos}).................................................</div>
        <div style="text-indent: 40pt;">${escapeHtml(approverPosition)}</div>
        <div>วันที่............เดือน...............(${signatureNumber.date}).............พ.ศ. .....................</div>
      </div>
    </body>
    </html>
  `;

  // Hidden iframe for clean print / PDF export
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
  doc.write(pdfHtml);
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
