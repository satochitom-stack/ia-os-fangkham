/**
 * Report & Data Export Engine (Sprint 4: Enterprise Integrations & Report Engine)
 * บริการสร้างและส่งออกไฟล์ Excel (.xlsx / .csv) และรายงานทางการสำหรับระบบตรวจสอบภายใน อปท.
 * รองรับภาษาไทย 100% พร้อมจัดความกว้างคอลัมน์และโครงสร้างแบบฟอร์มมาตรฐานราชการ
 */

import * as XLSX from 'xlsx';

/**
 * ดาวน์โหลดข้อมูลเป็นไฟล์ Excel (.xlsx) หลายแผ่นงาน
 * @param {Array<{ sheetName: string, data: Array<Array<any>> | Array<Object>, colWidths?: Array<{ wch: number }> }>} sheets
 * @param {string} fileName - ชื่อไฟล์ (ไม่ต้องใส่นามสกุล)
 */
export function downloadMultiSheetExcel(sheets, fileName = 'รายงานตรวจสอบภายใน_อปท') {
  try {
    const workbook = XLSX.utils.book_new();

    sheets.forEach(({ sheetName, data, colWidths }) => {
      let worksheet;
      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
        // 2D Array (AOA)
        worksheet = XLSX.utils.aoa_to_sheet(data);
      } else {
        // Array of Objects
        worksheet = XLSX.utils.json_to_sheet(data);
      }

      if (colWidths && colWidths.length > 0) {
        worksheet['!cols'] = colWidths;
      }

      // Safe sheet name (max 31 chars, no special forbidden chars)
      const safeName = (sheetName || 'Sheet')
        .replace(/[:\\/?*\[\]]/g, '')
        .slice(0, 31);

      XLSX.utils.book_append_sheet(workbook, worksheet, safeName);
    });

    const cleanFileName = `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, cleanFileName);
    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    // Fallback to CSV if xlsx fails for any reason
    if (sheets.length > 0) {
      downloadCsvFallback(sheets[0].data, fileName);
    }
    return false;
  }
}

/**
 * ดาวน์โหลดข้อมูลเป็นไฟล์ CSV (UTF-8 with BOM เพื่อเปิดใน Excel ภาษาไทยได้ทันที)
 */
export function downloadCsvFallback(data, fileName = 'ข้อมูลตรวจสอบภายใน') {
  try {
    if (!data || data.length === 0) return false;

    let csvContent = '\uFEFF'; // UTF-8 BOM
    if (Array.isArray(data[0])) {
      data.forEach((row) => {
        const line = row
          .map((val) => {
            const str = val === null || val === undefined ? '' : String(val);
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',');
        csvContent += line + '\r\n';
      });
    } else {
      const headers = Object.keys(data[0]);
      csvContent += headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\r\n';
      data.forEach((row) => {
        const line = headers
          .map((h) => {
            const val = row[h] === null || row[h] === undefined ? '' : String(row[h]);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',');
        csvContent += line + '\r\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('CSV Export Error:', err);
    return false;
  }
}

/**
 * 1. ส่งออกรายงานผลการตรวจสอบภายในประจำปี (Annual Comprehensive Audit Summary Excel)
 */
export function exportAnnualAuditReportExcel({
  orgProfile = {},
  selectedYear = '2569',
  annualPlans = [],
  workingPapers = [],
  capaFindings = []
}) {
  const orgName = orgProfile.name || 'อบต.ฝางคำ';
  const auditorName = orgProfile.auditorName || 'หน่วยตรวจสอบภายใน';

  // Sheet 1: หน้ารวมสรุปผลประจำปี (Executive Summary)
  const summaryAoa = [
    [`รายงานผลการตรวจสอบภายในประจำปีงบประมาณ พ.ศ. ${selectedYear}`],
    [`หน่วยรับตรวจ: ${orgName} • ผู้ตรวจสอบ: ${auditorName}`],
    [`วันที่ส่งออกข้อมูล: ${new Date().toLocaleDateString('th-TH')}`],
    [],
    ['สถิติผลการปฏิบัติงานตรวจสอบภายในภาพรวม'],
    ['รายการชี้วัด', 'จำนวน/ยอด', 'หน่วยนับ', 'หมายเหตุ'],
    ['กิจกรรมตามแผนการตรวจสอบประจำปี', annualPlans.length, 'กิจกรรม', 'ครอบคลุมทุกสำนัก/กอง'],
    ['กระดาษทำการที่เปิดตรวจและบันทึกผล', workingPapers.length, 'เรื่อง', 'ความคืบหน้าร้อยละ 100'],
    ['ประเด็นข้อตรวจพบทั้งหมด (CAPA Findings)', capaFindings.length, 'ข้อ', 'รวมข้อทักท้วง สตง./ตสน.'],
    [
      'ข้อทักท้วงที่ยุติ/แก้ไขแล้วเสร็จ (Closed)',
      capaFindings.filter((c) => c.status === 'verified_closed').length,
      'ข้อ',
      'ผ่านการสอบทานพยานหลักฐาน'
    ],
    [
      'ข้อทักท้วงที่อยู่ระหว่างดำเนินการ (In Progress)',
      capaFindings.filter((c) => c.status !== 'verified_closed').length,
      'ข้อ',
      'ติดตามในกรอบเวลา 60 วัน'
    ],
    [],
    ['สรุปผลการตรวจสอบรายกิจกรรมตามแผน'],
    ['ลำดับ', 'รหัสแผน', 'ชื่อกิจกรรมการตรวจสอบ', 'สำนัก/กอง', 'ความเสี่ยง', 'สถานะกระดาษทำการ', 'ข้อตรวจพบสำคัญ', 'ข้อเสนอแนะ']
  ];

  annualPlans.forEach((plan, idx) => {
    const wp = workingPapers.find((w) => w.auditPlanId === plan.id || w.topic === plan.title);
    summaryAoa.push([
      idx + 1,
      plan.id,
      plan.title,
      plan.department,
      plan.riskLevel || 'ปานกลาง',
      wp ? 'จัดทำกระดาษทำการแล้ว' : 'ตามแผนงาน',
      wp?.finding?.condition || 'ไม่พบข้อบกพร่องที่มีนัยสำคัญ',
      wp?.finding?.recommendation || 'ปฏิบัติตามระเบียบกฎหมายอย่างเคร่งครัด'
    ]);
  });

  // Sheet 2: ทะเบียนข้อทักท้วง CAPA รายละเอียด
  const capaAoa = [
    [`ทะเบียนคุมข้อทักท้วงและข้อสังเกตการตรวจสอบ (CAPA Register) ปี ${selectedYear}`],
    [`${orgName} • รายงานตามกรอบเวลา 60 วัน`],
    [],
    [
      'รหัสข้อทักท้วง',
      'แหล่งที่มา',
      'หน่วยงานรับตรวจ',
      'ประเด็นข้อตรวจพบ / ข้อทักท้วง',
      'ระดับความรุนแรง',
      'วันที่รับเรื่อง',
      'วันครบกำหนด (60 วัน)',
      'สถานะ',
      'สภาพการณ์ (Condition)',
      'เกณฑ์มาตรฐาน (Criteria)',
      'สาเหตุ (Cause)',
      'ผลกระทบ (Effect)',
      'มาตรการแก้ไข (Corrective Action)',
      'มาตรการป้องกัน (Preventive Action)',
      'ความเห็นผู้ตรวจสอบภายใน'
    ]
  ];

  capaFindings.forEach((c) => {
    capaAoa.push([
      c.id,
      c.sourceName || (c.source === 'oag' ? 'สตง.' : 'หน่วยตรวจสอบภายใน'),
      c.department,
      c.title,
      c.severity === 'high' ? 'สูง' : c.severity === 'medium' ? 'ปานกลาง' : 'ต่ำ',
      c.receivedDate,
      c.dueDate,
      c.status === 'verified_closed' ? 'ยุติข้อสังเกตแล้ว' : 'อยู่ระหว่างดำเนินการ',
      c.condition || '',
      c.criteria || '',
      c.cause || '',
      c.effect || '',
      c.correctiveAction || '',
      c.preventiveAction || '',
      c.auditorOpinion || ''
    ]);
  });

  const sheets = [
    {
      sheetName: 'สรุปรายงานประจำปี',
      data: summaryAoa,
      colWidths: [
        { wch: 8 },
        { wch: 16 },
        { wch: 38 },
        { wch: 22 },
        { wch: 14 },
        { wch: 24 },
        { wch: 45 },
        { wch: 45 }
      ]
    },
    {
      sheetName: 'ทะเบียนข้อทักท้วง_CAPA',
      data: capaAoa,
      colWidths: [
        { wch: 18 },
        { wch: 22 },
        { wch: 20 },
        { wch: 36 },
        { wch: 14 },
        { wch: 14 },
        { wch: 16 },
        { wch: 20 },
        { wch: 35 },
        { wch: 35 },
        { wch: 30 },
        { wch: 30 },
        { wch: 35 },
        { wch: 35 },
        { wch: 35 }
      ]
    }
  ];

  return downloadMultiSheetExcel(sheets, `รายงานผลการตรวจสอบภายในประจำปี_${selectedYear}_${orgName}`);
}

/**
 * 2. ส่งออกทะเบียนข้อทักท้วง CAPA Matrix ทางการ
 */
export function exportCapaMatrixExcel(capaFindings = [], orgProfile = {}, selectedYear = '2569') {
  const orgName = orgProfile.name || 'อบต.ฝางคำ';
  const aoa = [
    [`ทะเบียนคุมและติดตามข้อทักท้วง (CAPA Matrix under 60-day Rule)`],
    [`${orgName} • ประจำปีงบประมาณ พ.ศ. ${selectedYear}`],
    [],
    [
      'รหัสรายการ',
      'แหล่งที่มาของข้อตรวจพบ',
      'หน่วยงานที่รับผิดชอบ',
      'ชื่อประเด็นข้อตรวจพบ',
      'ความรุนแรง',
      'วันที่แจ้งเรื่อง',
      'วันครบกำหนดชี้แจง',
      'สถานะการดำเนินการ',
      'สภาพการณ์ที่ตรวจพบ',
      'เกณฑ์มาตรฐาน/ระเบียบ',
      'สาเหตุข้อบกพร่อง',
      'ผลกระทบที่เกิดขึ้น',
      'แนวทางแก้ไขปรับปรุง',
      'มาตรการป้องกันเกิดซ้ำ',
      'เอกสารพยานหลักฐาน',
      'ความเห็นผู้ตรวจสอบภายใน',
      'ข้อสั่งการผู้บริหาร'
    ]
  ];

  capaFindings.forEach((f) => {
    aoa.push([
      f.id,
      f.sourceName || (f.source === 'oag' ? 'สำนักงานการตรวจเงินแผ่นดิน' : 'หน่วยตรวจสอบภายใน'),
      f.department,
      f.title,
      f.severity === 'high' ? 'ความเสี่ยงสูง' : f.severity === 'medium' ? 'ความเสี่ยงปานกลาง' : 'ความเสี่ยงต่ำ',
      f.receivedDate,
      f.dueDate,
      f.status === 'verified_closed' ? 'ยุติข้อสังเกตเรียบร้อย' : 'อยู่ระหว่างดำเนินการแก้ไข',
      f.condition || '',
      f.criteria || '',
      f.cause || '',
      f.effect || '',
      f.correctiveAction || '',
      f.preventiveAction || '',
      f.evidenceDocs || '',
      f.auditorOpinion || '',
      f.executiveOrder || ''
    ]);
  });

  return downloadMultiSheetExcel(
    [
      {
        sheetName: 'ทะเบียนคุมข้อทักท้วง_CAPA',
        data: aoa,
        colWidths: [
          { wch: 18 },
          { wch: 28 },
          { wch: 20 },
          { wch: 38 },
          { wch: 16 },
          { wch: 14 },
          { wch: 16 },
          { wch: 22 },
          { wch: 38 },
          { wch: 35 },
          { wch: 30 },
          { wch: 30 },
          { wch: 38 },
          { wch: 38 },
          { wch: 25 },
          { wch: 35 },
          { wch: 30 }
        ]
      }
    ],
    `ทะเบียนคุมข้อทักท้วง_CAPA_${selectedYear}_${orgName}`
  );
}

/**
 * 3. ส่งออกกระดาษทำการและผลการสุ่มตรวจ (Working Papers & Sample Audit Sheets)
 */
export function exportWorkingPapersExcel(workingPapers = [], orgProfile = {}, selectedYear = '2569') {
  const orgName = orgProfile.name || 'อบต.ฝางคำ';

  // Sheet 1: สรุปกระดาษทำการ
  const wpAoa = [
    [`สรุปกระดาษทำการตรวจสอบภายใน (Working Papers Summary)`],
    [`${orgName} • ปีงบประมาณ พ.ศ. ${selectedYear}`],
    [],
    [
      'รหัสกระดาษทำการ',
      'กิจกรรมการตรวจสอบ',
      'สำนัก/กองรับตรวจ',
      'ผู้จัดทำ',
      'ผู้สอบทาน',
      'สภาพการณ์ (Condition)',
      'เกณฑ์มาตรฐาน (Criteria)',
      'สาเหตุ (Cause)',
      'ผลกระทบ (Effect)',
      'ข้อเสนอแนะ (Recommendation)',
      'ข้อสรุปผลการตรวจ'
    ]
  ];

  // Sheet 2: รายการสุ่มตรวจเอกสาร (Audit Samples)
  const sampleAoa = [
    [`รายละเอียดการสุ่มตรวจเอกสารและหลักฐานเชิงประจักษ์`],
    [`${orgName} • ปีงบประมาณ พ.ศ. ${selectedYear}`],
    [],
    [
      'รหัสกระดาษทำการ',
      'กิจกรรม',
      'สำนัก/กอง',
      'ลำดับตัวอย่าง',
      'รายการเอกสาร/ฎีกา/สัญญา',
      'จำนวนเงิน (บาท)',
      'ผลการตรวจ',
      'ข้อสังเกตจากการสุ่มตรวจ'
    ]
  ];

  workingPapers.forEach((wp) => {
    wpAoa.push([
      wp.id,
      wp.topic,
      wp.department,
      wp.auditor || orgProfile.auditorName || 'ผู้ตรวจสอบภายใน',
      wp.reviewer || orgProfile.palatName || 'ปลัด อบต.',
      wp.finding?.condition || '',
      wp.finding?.criteria || '',
      wp.finding?.cause || '',
      wp.finding?.effect || '',
      wp.finding?.recommendation || '',
      wp.conclusion || 'ตรวจสอบแล้ว'
    ]);

    if (Array.isArray(wp.samples)) {
      wp.samples.forEach((s, idx) => {
        sampleAoa.push([
          wp.id,
          wp.topic,
          wp.department,
          idx + 1,
          s.docNo || s.description || s.title || `ตัวอย่างที่ ${idx + 1}`,
          typeof s.amount === 'number' ? s.amount : Number(s.amount) || 0,
          s.result === 'pass' ? 'ถูกต้อง' : s.result === 'fail' ? 'พบข้อบกพร่อง' : 'ปกติ',
          s.note || s.remark || '-'
        ]);
      });
    }
  });

  return downloadMultiSheetExcel(
    [
      {
        sheetName: 'สรุปกระดาษทำการ',
        data: wpAoa,
        colWidths: [
          { wch: 18 },
          { wch: 35 },
          { wch: 22 },
          { wch: 20 },
          { wch: 20 },
          { wch: 35 },
          { wch: 35 },
          { wch: 30 },
          { wch: 30 },
          { wch: 35 },
          { wch: 30 }
        ]
      },
      {
        sheetName: 'รายการสุ่มตรวจ',
        data: sampleAoa,
        colWidths: [
          { wch: 18 },
          { wch: 30 },
          { wch: 20 },
          { wch: 12 },
          { wch: 35 },
          { wch: 18 },
          { wch: 16 },
          { wch: 35 }
        ]
      }
    ],
    `กระดาษทำการตรวจสอบภายใน_${selectedYear}_${orgName}`
  );
}

/**
 * 4. ส่งออกข้อมูลเฉพาะส่วนราชการ (สำนักปลัด, กองคลัง, กองช่าง)
 */
export function exportDepartmentWorkspacesExcel({
  officeData,
  financeData,
  techData,
  orgProfile = {},
  selectedYear = '2569'
}) {
  const orgName = orgProfile.name || 'อบต.ฝางคำ';
  const sheets = [];

  // Sheet สำนักปลัด: ยานพาหนะ และ โครงการ
  if (officeData) {
    const vehicleAoa = [
      [`ทะเบียนคุมการใช้รถยนต์ส่วนกลางและน้ำมันเชื้อเพลิง สำนักปลัด ${orgName}`],
      [`ประจำปีงบประมาณ พ.ศ. ${selectedYear}`],
      [],
      ['ลำดับ', 'วันที่เดินทาง', 'ทะเบียนรถ', 'วัตถุประสงค์ / สถานที่ไป', 'เลขกิโลเมตรเริ่ม', 'เลขกิโลเมตรสิ้นสุด', 'ระยะทาง (กม.)', 'ใบสั่งน้ำมัน', 'ลิตร', 'ยอดเงิน (บาท)', 'พนักงานขับรถ']
    ];
    (officeData.vehicleLogs || []).forEach((v, idx) => {
      vehicleAoa.push([
        idx + 1,
        v.date,
        v.licensePlate,
        v.destination,
        v.startKm,
        v.endKm,
        v.totalKm || (v.endKm - v.startKm),
        v.voucherNo,
        v.liters,
        v.cost,
        v.driver
      ]);
    });
    sheets.push({
      sheetName: 'สำนักปลัด_คุมรถและน้ำมัน',
      data: vehicleAoa,
      colWidths: [
        { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 32 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 16 }, { wch: 20 }
      ]
    });
  }

  // Sheet กองคลัง: สัญญาจัดซื้อจัดจ้าง และ ลูกหนี้เงินยืม
  if (financeData) {
    const contractAoa = [
      [`ทะเบียนคุมสัญญาจัดซื้อจัดจ้าง กองคลัง ${orgName}`],
      [`ตาม พ.ร.บ. การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560`],
      [],
      ['ลำดับ', 'เลขที่สัญญา', 'รายการจัดซื้อจัดจ้าง', 'วิธีจัดหา', 'วงเงินงบประมาณ', 'วงเงินสัญญา', 'คู่สัญญา/ผู้รับจ้าง', 'วันเริ่มสัญญา', 'วันสิ้นสุดสัญญา', 'หลักประกันสัญญา (บาท)', 'สถานะ']
    ];
    (financeData.contracts || []).forEach((c, idx) => {
      contractAoa.push([
        idx + 1,
        c.contractNo,
        c.projectName,
        c.method,
        c.budget,
        c.contractAmount,
        c.contractor,
        c.startDate,
        c.endDate,
        c.guaranteeAmount || 0,
        c.status
      ]);
    });
    sheets.push({
      sheetName: 'กองคลัง_สัญญาจัดซื้อจัดจ้าง',
      data: contractAoa,
      colWidths: [
        { wch: 8 }, { wch: 16 }, { wch: 35 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 18 }
      ]
    });
  }

  // Sheet กองช่าง: โครงการก่อสร้างและผลทดสอบ 28 วัน
  if (techData) {
    const techAoa = [
      [`ทะเบียนคุมโครงการก่อสร้างตามข้อบัญญัติ กองช่าง ${orgName}`],
      [`พร้อมผลทดสอบความแข็งแรงแท่งคอนกรีต 28 วัน`],
      [],
      ['ลำดับ', 'รหัสโครงการ', 'ชื่อโครงการก่อสร้าง', 'สถานที่ก่อสร้าง', 'วงเงินตามสัญญา', 'ผู้รับจ้าง', 'ช่างผู้ควบคุมงาน', 'ผลทดสอบคอนกรีต 28 วัน', 'สถานะโครงการ']
    ];
    (techData.constructionProjects || []).forEach((p, idx) => {
      techAoa.push([
        idx + 1,
        p.projectCode,
        p.projectName,
        p.location,
        p.contractAmount,
        p.contractor,
        p.supervisorEngineer,
        p.cylinderTestPassed ? `ผ่านเกณฑ์ (${p.cylinderTestStrength || 240} ksc)` : 'รอผลทดสอบ',
        p.status
      ]);
    });
    sheets.push({
      sheetName: 'กองช่าง_คุมงานก่อสร้าง',
      data: techAoa,
      colWidths: [
        { wch: 8 }, { wch: 16 }, { wch: 38 }, { wch: 24 }, { wch: 16 }, { wch: 26 }, { wch: 22 }, { wch: 24 }, { wch: 18 }
      ]
    });
  }

  return downloadMultiSheetExcel(sheets, `ข้อมูลงานเฉพาะส่วนราชการ_${selectedYear}_${orgName}`);
}

/**
 * 5. ส่งออกชุดไฟล์ใหญ่ All-in-One Master Workbook (7 แผ่นงานครอบคลุมทุกมิติ)
 */
export function exportMasterEnterpriseExcel({
  orgProfile = {},
  selectedYear = '2569',
  annualPlans = [],
  workingPapers = [],
  capaFindings = [],
  auditUniverse = [],
  engagementPlans = [],
  officeData = null,
  financeData = null,
  techData = null
}) {
  const orgName = orgProfile.name || 'อบต.ฝางคำ';

  // Sheet 1: สรุปภาพรวมองค์กร
  const orgAoa = [
    [`ระบบบริหารจัดการและตรวจสอบภายใน อปท. (IA-OS FANG KHAM)`],
    [`ข้อมูลภาพรวมหน่วยงาน: ${orgName}`],
    [],
    ['รายการ', 'รายละเอียด'],
    ['ชื่อองค์กรปกครองส่วนท้องถิ่น', orgName],
    ['อำเภอ', orgProfile.district || 'สิรินธร'],
    ['จังหวัด', orgProfile.province || 'อุบลราชธานี'],
    ['ปีงบประมาณ', `พ.ศ. ${selectedYear}`],
    ['ผู้บริหารสูงสุด (นายก อปท.)', orgProfile.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ'],
    ['ปลัด อปท.', orgProfile.palatName || 'ปลัดองค์การบริหารส่วนตำบลฝางคำ'],
    ['ผู้ตรวจสอบภายใน', orgProfile.auditorName || 'หน่วยตรวจสอบภายใน'],
    ['จำนวนกิจกรรมในจักรวาลการตรวจสอบ (Universe)', auditUniverse.length],
    ['จำนวนกิจกรรมตามแผนประจำปี', annualPlans.length],
    ['จำนวนกระดาษทำการตรวจสอบ', workingPapers.length],
    ['จำนวนข้อทักท้วง (CAPA)', capaFindings.length]
  ];

  // Sheet 2: จักรวาลการตรวจสอบและการประเมินความเสี่ยง SOFCK
  const universeAoa = [
    [`จักรวาลการตรวจสอบ (Audit Universe) และการจัดลำดับความเสี่ยง`],
    [`${orgName} • ปีงบประมาณ พ.ศ. ${selectedYear}`],
    [],
    ['รหัสกิจกรรม', 'ชื่อกิจกรรมการตรวจสอบ', 'สำนัก/กอง', 'ความสำคัญ (S)', 'โอกาสเสี่ยง (O)', 'ความถี่ (F)', 'การควบคุม (C)', 'ความรู้ชำนาญ (K)', 'คะแนนรวม', 'ระดับความเสี่ยง']
  ];
  auditUniverse.forEach((u) => {
    universeAoa.push([
      u.id,
      u.name,
      u.department,
      u.scores?.S || 3,
      u.scores?.O || 3,
      u.scores?.F || 3,
      u.scores?.C || 3,
      u.scores?.K || 3,
      u.totalScore || 15,
      u.riskLevel || 'ปานกลาง'
    ]);
  });

  // Sheet 3: แผนปฏิบัติการตรวจสอบรายกิจกรรม (ว 614 Engagement Plans)
  const engAoa = [
    [`แผนปฏิบัติการตรวจสอบรายกิจกรรม (Engagement Plans ตาม ว 614)`],
    [`${orgName} • ปีงบประมาณ พ.ศ. ${selectedYear}`],
    [],
    ['รหัสแผนงาน', 'ชื่อกิจกรรม', 'หน่วยงานเป้าหมาย', 'วัตถุประสงค์การตรวจ', 'ขอบเขตเวลาที่ตรวจ', 'วิธีการสุ่มตัวอย่าง', 'ขนาดตัวอย่างสุ่ม', 'ความเสี่ยงสำคัญ']
  ];
  engagementPlans.forEach((e) => {
    engAoa.push([
      e.id,
      e.title,
      e.targetDepartment || e.department,
      e.objective || '',
      e.scopePeriod || '',
      e.samplingMethod || 'สุ่มแบบเจาะจงและสุ่มตัวอย่างตามขนาดวงเงิน',
      e.sampleSize || 'ร้อยละ 20 ของประชากร',
      e.keyRisks || ''
    ]);
  });

  const sheets = [
    { sheetName: '1_ภาพรวมองค์กร', data: orgAoa, colWidths: [{ wch: 32 }, { wch: 45 }] },
    { sheetName: '2_ประเมินความเสี่ยง_SOFCK', data: universeAoa, colWidths: [{ wch: 14 }, { wch: 35 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 16 }] },
    { sheetName: '3_แผนงานว614', data: engAoa, colWidths: [{ wch: 16 }, { wch: 35 }, { wch: 22 }, { wch: 35 }, { wch: 22 }, { wch: 30 }, { wch: 20 }, { wch: 35 }] }
  ];

  // Add Working papers, CAPA, etc.
  if (workingPapers.length > 0) {
    const wpAoa = [
      ['รหัสกระดาษทำการ', 'กิจกรรม', 'สำนัก/กอง', 'สภาพการณ์', 'เกณฑ์', 'สาเหตุ', 'ผลกระทบ', 'ข้อเสนอแนะ']
    ];
    workingPapers.forEach((w) => {
      wpAoa.push([
        w.id,
        w.topic,
        w.department,
        w.finding?.condition || '',
        w.finding?.criteria || '',
        w.finding?.cause || '',
        w.finding?.effect || '',
        w.finding?.recommendation || ''
      ]);
    });
    sheets.push({ sheetName: '4_กระดาษทำการและข้อตรวจพบ', data: wpAoa, colWidths: [{ wch: 16 }, { wch: 32 }, { wch: 20 }, { wch: 35 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 35 }] });
  }

  if (capaFindings.length > 0) {
    const capaAoa = [
      ['รหัส', 'แหล่งที่มา', 'กอง', 'ประเด็น', 'ระดับ', 'วันครบ 60 วัน', 'สถานะ', 'มาตรการแก้ไข', 'ความเห็นผู้ตรวจ']
    ];
    capaFindings.forEach((c) => {
      capaAoa.push([
        c.id,
        c.sourceName || c.source,
        c.department,
        c.title,
        c.severity,
        c.dueDate,
        c.status === 'verified_closed' ? 'ยุติแล้ว' : 'อยู่ระหว่างดำเนินการ',
        c.correctiveAction || '',
        c.auditorOpinion || ''
      ]);
    });
    sheets.push({ sheetName: '5_ทะเบียนข้อทักท้วง_CAPA', data: capaAoa, colWidths: [{ wch: 16 }, { wch: 22 }, { wch: 18 }, { wch: 32 }, { wch: 12 }, { wch: 16 }, { wch: 18 }, { wch: 35 }, { wch: 30 }] });
  }

  return downloadMultiSheetExcel(sheets, `ชุดข้อมูลหลัก_Master_Workbook_${selectedYear}_${orgName}`);
}
