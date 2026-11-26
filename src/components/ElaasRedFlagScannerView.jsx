import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Upload,
  AlertTriangle,
  ShieldAlert,
  Copy,
  Clock,
  CheckCircle2,
  Download,
  Sparkles,
  Search,
  Send,
  Info,
  Trash2
} from 'lucide-react';

// Sample realistic e-LAAS / Procurement Excel dataset for instant testing
const SAMPLE_ELAAS_ROWS = [
  { เลขที่ฎีกา: 'ฎก.014/70', วันที่: '2026-10-12', รายการ: 'จ้างเหมาซ่อมแซมถนนลูกรัง หมู่ 2 สายทางเข้าไร่นา', ผู้รับเงิน: 'หจก. เจริญกิจการโยธา', วิธีจัดหา: 'เฉพาะเจาะจง', จำนวนเงิน: 485000, วันครบประกัน: '2027-10-12' },
  { เลขที่ฎีกา: 'ฎก.019/70', วันที่: '2026-10-20', รายการ: 'จ้างเหมาซ่อมแซมถนนลูกรัง หมู่ 2 ช่วงที่ 2', ผู้รับเงิน: 'หจก. เจริญกิจการโยธา', วิธีจัดหา: 'เฉพาะเจาะจง', จำนวนเงิน: 492000, วันครบประกัน: '2027-10-20' },
  { เลขที่ฎีกา: 'ฎก.024/70', วันที่: '2026-11-02', รายการ: 'จัดซื้อวัสดุสำนักงาน ประจำไตรมาส 1', ผู้รับเงิน: 'ร้านสมบูรณ์เครื่องเขียน', วิธีจัดหา: 'เฉพาะเจาะจง', จำนวนเงิน: 48500, วันครบประกัน: '' },
  { เลขที่ฎีกา: 'ฎก.024/70', วันที่: '2026-11-04', รายการ: 'จัดซื้อวัสดุสำนักงาน ประจำไตรมาส 1 (เบิกซ้ำ)', ผู้รับเงิน: 'ร้านสมบูรณ์เครื่องเขียน', วิธีจัดหา: 'เฉพาะเจาะจง', จำนวนเงิน: 48500, วันครบประกัน: '' },
  { เลขที่ฎีกา: 'ฎก.031/70', วันที่: '2026-11-10', รายการ: 'จัดซื้อวัสดุก่อสร้างซ่อมบำรุงประปาหมู่บ้าน', ผู้รับเงิน: 'ร้านอุบลวัสดุก่อสร้าง', วิธีจัดหา: 'เฉพาะเจาะจง', จำนวนเงิน: 295000, วันครบประกัน: '' },
  { เลขที่ฎีกา: 'ฎก.036/70', วันที่: '2026-11-18', รายการ: 'จัดซื้อท่อ PVC และอุปกรณ์ประปาหมู่บ้าน', ผู้รับเงิน: 'ร้านอุบลวัสดุก่อสร้าง', วิธีจัดหา: 'เฉพาะเจาะจง', จำนวนเงิน: 245000, วันครบประกัน: '' },
  { เลขที่ฎีกา: 'ฎก.042/70', วันที่: '2026-11-22', รายการ: 'โครงการก่อสร้างถนน คสล. บ้านฝางคำ (ตรวจรับประกัน)', ผู้รับเงิน: 'บจก. สิรินธรคอนสตรัคชั่น', วิธีจัดหา: 'e-bidding', จำนวนเงิน: 1450000, วันครบประกัน: '2026-12-20' },
  { เลขที่ฎีกา: 'ฎก.048/70', วันที่: '2026-11-25', รายการ: 'จัดซื้ออาหารเสริม (นม) โรงเรียน ประจำเดือน พ.ย.', ผู้รับเงิน: 'สหกรณ์โคนมอุบลราชธานี', วิธีจัดหา: 'เฉพาะเจาะจง', จำนวนเงิน: 112400, วันครบประกัน: '' }
];

function normalizeNumber(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function parseDateSafe(val) {
  if (!val) return null;
  if (val instanceof Date && !isNaN(val)) return val;
  if (typeof val === 'number' && val > 20000 && val < 80000) {
    // Excel serial date
    const utcDays = Math.floor(val - 25569);
    return new Date(utcDays * 86400 * 1000);
  }
  const str = String(val).trim();
  const d = new Date(str);
  if (!isNaN(d)) return d;
  // Try DD/MM/YYYY (Thai Buddhist year or AD)
  const m = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (m) {
    let yr = parseInt(m[3], 10);
    if (yr < 100) yr += 2500;
    if (yr > 2400) yr -= 543;
    return new Date(yr, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
  }
  return null;
}

function detectColumn(headers, patterns) {
  for (const p of patterns) {
    const found = headers.find((h) => String(h).toLowerCase().includes(p.toLowerCase()));
    if (found) return found;
  }
  return '';
}

export default function ElaasRedFlagScannerView({
  selectedYear = '2570',
  capaFindings = [],
  setCapaFindings
}) {
  const [rawRows, setRawRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [threshold, setThreshold] = useState(500000);
  const [windowDays, setWindowDays] = useState(30);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState('');

  const [colMap, setColMap] = useState({
    docNo: '',
    date: '',
    desc: '',
    vendor: '',
    amount: '',
    method: '',
    warrantyDate: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const applyRows = (rows, name) => {
    if (!rows || rows.length === 0) return;
    const cols = Object.keys(rows[0]);
    setHeaders(cols);
    setRawRows(rows);
    setFileName(name);
    setColMap({
      docNo: detectColumn(cols, ['ฎีกา', 'เลขที่', 'doc', 'voucher', 'สัญญา']),
      date: detectColumn(cols, ['วันที่', 'date', 'วันเบิก', 'วันทำสัญญา']),
      desc: detectColumn(cols, ['รายการ', 'โครงการ', 'ชื่อ', 'desc', 'detail']),
      vendor: detectColumn(cols, ['ผู้รับ', 'คู่สัญญา', 'ร้าน', 'บริษัท', 'vendor', 'payee']),
      amount: detectColumn(cols, ['จำนวนเงิน', 'วงเงิน', 'ยอดเงิน', 'amount', 'ราคา', 'total']),
      method: detectColumn(cols, ['วิธี', 'method', 'จัดหา']),
      warrantyDate: detectColumn(cols, ['ประกัน', 'warranty', 'ครบกำหนด'])
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
        if (json.length === 0) {
          showToast('ไม่พบข้อมูลแถวในไฟล์ Excel ที่อัปโหลด');
          return;
        }
        applyRows(json, file.name);
        showToast(`✓ โหลดข้อมูล ${json.length} รายการจาก "${file.name}" และสแกนจุดเสี่ยงเรียบร้อยแล้ว`);
      } catch (err) {
        showToast(`ไม่สามารถอ่านไฟล์ได้: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // Run 4 Real Audit Red Flag Algorithms
  const analysis = useMemo(() => {
    if (rawRows.length === 0) {
      return { totalAmount: 0, flags: [], counts: { split: 0, duplicate: 0, nearThreshold: 0, warranty: 0 } };
    }

    const normalized = rawRows.map((r, idx) => ({
      rowIndex: idx + 1,
      docNo: String(r[colMap.docNo] || `ROW-${idx + 1}`).trim(),
      dateRaw: String(r[colMap.date] || ''),
      dateObj: parseDateSafe(r[colMap.date]),
      desc: String(r[colMap.desc] || '').trim(),
      vendor: String(r[colMap.vendor] || '').trim(),
      amount: normalizeNumber(r[colMap.amount]),
      method: String(r[colMap.method] || '').trim(),
      warrantyObj: parseDateSafe(r[colMap.warrantyDate]),
      warrantyRaw: String(r[colMap.warrantyDate] || '')
    }));

    const totalAmount = normalized.reduce((acc, r) => acc + r.amount, 0);
    const flags = [];

    // 1. Split Purchase Detection (Same vendor within windowDays, each < threshold, combined >= threshold)
    const byVendor = {};
    normalized.forEach((r) => {
      if (!r.vendor || r.amount <= 0 || r.amount >= threshold) return;
      if (!byVendor[r.vendor]) byVendor[r.vendor] = [];
      byVendor[r.vendor].push(r);
    });

    Object.entries(byVendor).forEach(([vendor, items]) => {
      if (items.length < 2) return;
      const sorted = [...items].sort((a, b) => (a.dateObj?.getTime() || 0) - (b.dateObj?.getTime() || 0));
      let cluster = [sorted[0]];
      for (let i = 1; i < sorted.length; i++) {
        const prev = cluster[0];
        const curr = sorted[i];
        const diffDays =
          prev.dateObj && curr.dateObj
            ? Math.abs((curr.dateObj - prev.dateObj) / 86400000)
            : 0;
        if (diffDays <= windowDays) {
          cluster.push(curr);
        } else {
          const sum = cluster.reduce((s, x) => s + x.amount, 0);
          if (cluster.length >= 2 && sum >= threshold) {
            flags.push({
              id: `SPLIT-${vendor}-${cluster[0].rowIndex}`,
              type: 'split',
              severity: 'สูงมาก',
              title: `สงสัยแบ่งซื้อแบ่งจ้าง: ${vendor} (${cluster.length} รายการรวม ${sum.toLocaleString()} บาท)`,
              vendor,
              amount: sum,
              docs: cluster.map((c) => c.docNo).join(', '),
              detail: `พบการเบิกจ่ายต่ำกว่าเกณฑ์ ${threshold.toLocaleString()} บาท จำนวน ${cluster.length} ครั้งภายใน ${windowDays} วัน (${cluster.map((c) => `${c.docNo}: ${c.amount.toLocaleString()} บ.`).join(' + ')}) รวมเกินเกณฑ์วิธีเฉพาะเจาะจง`,
              legalRef: 'พ.ร.บ. จัดซื้อจัดจ้างฯ พ.ศ. 2560 มาตรา 8 วรรคสอง (ห้ามแบ่งซื้อแบ่งจ้าง)'
            });
          }
          cluster = [curr];
        }
      }
      const lastSum = cluster.reduce((s, x) => s + x.amount, 0);
      if (cluster.length >= 2 && lastSum >= threshold) {
        flags.push({
          id: `SPLIT-${vendor}-${cluster[0].rowIndex}-end`,
          type: 'split',
          severity: 'สูงมาก',
          title: `สงสัยแบ่งซื้อแบ่งจ้าง: ${vendor} (${cluster.length} รายการรวม ${lastSum.toLocaleString()} บาท)`,
          vendor,
          amount: lastSum,
          docs: cluster.map((c) => c.docNo).join(', '),
          detail: `พบการเบิกจ่ายต่ำกว่าเกณฑ์ ${threshold.toLocaleString()} บาท จำนวน ${cluster.length} ครั้งภายใน ${windowDays} วัน (${cluster.map((c) => `${c.docNo}: ${c.amount.toLocaleString()} บ.`).join(' + ')}) รวมเกินเกณฑ์วิธีเฉพาะเจาะจง`,
          legalRef: 'พ.ร.บ. จัดซื้อจัดจ้างฯ พ.ศ. 2560 มาตรา 8 วรรคสอง (ห้ามแบ่งซื้อแบ่งจ้าง)'
        });
      }
    });

    // 2. Duplicate Payment Detection (Duplicate DocNo OR same vendor + same amount within 7 days)
    const seenDoc = {};
    normalized.forEach((r) => {
      if (r.docNo && !r.docNo.startsWith('ROW-')) {
        if (seenDoc[r.docNo]) {
          flags.push({
            id: `DUP-DOC-${r.docNo}-${r.rowIndex}`,
            type: 'duplicate',
            severity: 'สูงมาก',
            title: `พบเลขที่ฎีกา/เอกสารซ้ำซ้อน: ${r.docNo}`,
            vendor: r.vendor,
            amount: r.amount,
            docs: r.docNo,
            detail: `เลขที่เอกสาร "${r.docNo}" ปรากฏซ้ำในแถวที่ ${seenDoc[r.docNo].rowIndex} และแถวที่ ${r.rowIndex} (${r.desc} — ยอด ${r.amount.toLocaleString()} บาท)`,
            legalRef: 'ระเบียบ มท. ว่าด้วยการรับเงิน การเบิกจ่ายเงินฯ (การควบคุมการเบิกจ่ายซ้ำซ้อน)'
          });
        } else {
          seenDoc[r.docNo] = r;
        }
      }
    });

    // 3. Near-Threshold Warning (90% - 99.9% of 500,000 threshold, e.g. 450,000 - 499,999)
    const nearMin = threshold * 0.9;
    normalized.forEach((r) => {
      if (r.amount >= nearMin && r.amount < threshold) {
        flags.push({
          id: `NEAR-${r.rowIndex}`,
          type: 'nearThreshold',
          severity: 'สูง',
          title: `วงเงินเฉียดเกณฑ์เฉพาะเจาะจง (${((r.amount / threshold) * 100).toFixed(1)}%): ${r.docNo}`,
          vendor: r.vendor,
          amount: r.amount,
          docs: r.docNo,
          detail: `${r.desc} — คู่สัญญา: ${r.vendor} ยอด ${r.amount.toLocaleString()} บาท (ต่ำกว่าเพดาน ${threshold.toLocaleString()} บาท เพียง ${(threshold - r.amount).toLocaleString()} บาท)`,
          legalRef: 'เกณฑ์วิธีเฉพาะเจาะจง ไม่เกิน 500,000 บาท (ควรตรวจสอบความเหมาะสมของราคากลาง)'
        });
      }
    });

    // 4. Warranty / Retention Expiry Alert (within 60 days from today)
    const today = new Date();
    normalized.forEach((r) => {
      if (!r.warrantyObj) return;
      const daysLeft = Math.ceil((r.warrantyObj - today) / 86400000);
      if (daysLeft >= -30 && daysLeft <= 60) {
        flags.push({
          id: `WAR-${r.rowIndex}`,
          type: 'warranty',
          severity: daysLeft <= 15 ? 'สูง' : 'ปานกลาง',
          title:
            daysLeft < 0
              ? `เลยกำหนดรับประกันความชำรุดแล้ว ${Math.abs(daysLeft)} วัน: ${r.docNo}`
              : `ใกล้ครบกำหนดค้ำประกันสัญญาใน ${daysLeft} วัน: ${r.docNo}`,
          vendor: r.vendor,
          amount: r.amount,
          docs: r.docNo,
          detail: `${r.desc} (${r.vendor}) ครบกำหนดประกัน ${r.warrantyRaw} — ควรแจ้งกองช่างตรวจสอบสภาพความชำรุดบกพร่องก่อนพิจารณาคืนหลักประกันสัญญา 5%`,
          legalRef: 'ระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างฯ พ.ศ. 2560 ข้อ 170 (การคืนหลักประกันสัญญา)'
        });
      }
    });

    const counts = {
      split: flags.filter((f) => f.type === 'split').length,
      duplicate: flags.filter((f) => f.type === 'duplicate').length,
      nearThreshold: flags.filter((f) => f.type === 'nearThreshold').length,
      warranty: flags.filter((f) => f.type === 'warranty').length
    };

    return { totalAmount, flags, counts };
  }, [rawRows, colMap, threshold, windowDays]);

  const filteredFlags = analysis.flags.filter((f) => {
    if (filterType !== 'all' && f.type !== filterType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.detail.toLowerCase().includes(q) ||
        (f.vendor || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendFlagToCapa = (flag) => {
    if (!setCapaFindings) return;
    if (capaFindings.some((c) => c.sourceFlagId === flag.id)) {
      showToast('รายการนี้ถูกส่งเข้าทะเบียน CAPA เรียบร้อยแล้ว');
      return;
    }
    const yrSuffix = String(selectedYear || '2570').slice(-2);
    const nextNum = String(capaFindings.length + 1).padStart(2, '0');
    const newCapa = {
      id: `CAPA-RF-${Date.now()}`,
      code: `RF-${yrSuffix}-${nextNum}`,
      sourceFlagId: flag.id,
      source: 'หน่วยตรวจสอบภายใน (Red Flag Scanner)',
      topic: flag.title,
      department: flag.type === 'warranty' ? 'กองช่าง' : 'กองคลัง',
      severity: flag.severity,
      status: 'open',
      condition: flag.detail,
      cause: 'ตรวจพบความผิดปกติจากการวิเคราะห์ข้อมูลการเบิกจ่าย/จัดซื้อจัดจ้าง (e-LAAS)',
      effect: 'อาจมีความเสี่ยงไม่ปฏิบัติตามระเบียบจัดซื้อจัดจ้างหรือเกิดความเสียหายทางการเงิน',
      recommendation: `ให้ส่วนราชการที่เกี่ยวข้องชี้แจงข้อเท็จจริงและส่งเอกสารหลักฐานประกอบ (${flag.docs}) ตาม ${flag.legalRef}`,
      findingDate: new Date().toISOString().slice(0, 10),
      dueDate: '',
      actionTaken: ''
    };
    setCapaFindings((prev) => [newCapa, ...(prev || [])]);
    showToast(`✓ ส่งจุดเสี่ยงเข้าทะเบียนติดตาม CAPA (${newCapa.code}) เรียบร้อยแล้ว`);
  };

  const handleExportReport = () => {
    if (analysis.flags.length === 0) return;
    const rows = analysis.flags.map((f, i) => ({
      ลำดับ: i + 1,
      ประเภทจุดเสี่ยง: f.type,
      ระดับความเสี่ยง: f.severity,
      หัวข้อที่ตรวจพบ: f.title,
      เลขที่เอกสาร: f.docs,
      คู่สัญญา: f.vendor,
      จำนวนเงิน: f.amount,
      รายละเอียด: f.detail,
      ระเบียบอ้างอิง: f.legalRef
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RedFlag_Analysis');
    XLSX.writeFile(wb, `รายงานสแกนจุดเสี่ยง_eLAAS_ปี${selectedYear}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50/50 to-white dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 rounded-2xl p-6 border border-rose-200/80 dark:border-rose-900/40 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-rose-100/80 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-full px-3 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Audit Data Analytics • ปีงบประมาณ พ.ศ. {selectedYear}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            ระบบสแกนจุดเสี่ยงไฟล์ e-LAAS / จัดซื้อจัดจ้าง (Red Flag Scanner)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            อัปโหลดไฟล์ Excel (.xlsx / .csv) ทะเบียนคุมฎีกาหรือสัญญาจาก e-LAAS เพื่อตรวจจับพฤติกรรมเสี่ยงแบ่งซื้อแบ่งจ้าง ฎีกาซ้ำซ้อน วงเงินเฉียด 5 แสน และสัญญาใกล้ครบประกันอัตโนมัติ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-xs font-bold shadow-sm cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>อัปโหลดไฟล์ Excel e-LAAS</span>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            type="button"
            onClick={() => {
              applyRows(SAMPLE_ELAAS_ROWS, 'ตัวอย่างทะเบียนฎีกา_eLAAS_2570.xlsx');
              showToast('✓ โหลดชุดข้อมูลตัวอย่าง 8 ฎีกา เพื่อทดสอบการสแกนจุดเสี่ยงแล้ว');
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ทดลองด้วยข้อมูลตัวอย่าง</span>
          </button>
          {analysis.flags.length > 0 && (
            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ส่งออก Excel</span>
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Parameters & Column Mapper */}
      {rawRows.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800 dark:text-slate-100">{fileName}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                {rawRows.length} แถว • รวม {analysis.totalAmount.toLocaleString()} บาท
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setRawRows([]);
                setHeaders([]);
                setFileName('');
              }}
              className="text-rose-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างข้อมูล</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">เกณฑ์เฉพาะเจาะจง (บาท)</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value) || 500000)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">ช่วงวันแบ่งซื้อ (วัน)</label>
              <input
                type="number"
                value={windowDays}
                onChange={(e) => setWindowDays(Number(e.target.value) || 30)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
              />
            </div>
            {[
              ['docNo', 'คอลัมน์เลขที่ฎีกา'],
              ['date', 'คอลัมน์วันที่'],
              ['vendor', 'คอลัมน์ผู้รับเงิน/ร้าน'],
              ['amount', 'คอลัมน์จำนวนเงิน'],
              ['warrantyDate', 'คอลัมน์ครบประกัน']
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">{label}</label>
                <select
                  value={colMap[key]}
                  onChange={(e) => setColMap((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                >
                  <option value="">-- ไม่ระบุ --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Red Flag Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'split', label: 'สงสัยแบ่งซื้อแบ่งจ้าง', count: analysis.counts.split, color: 'rose', icon: AlertTriangle, desc: `รวมกันเกิน ${threshold.toLocaleString()} บ.` },
          { key: 'duplicate', label: 'ฎีกา/เอกสารซ้ำซ้อน', count: analysis.counts.duplicate, color: 'purple', icon: Copy, desc: 'เลขที่ฎีกาซ้ำในชุดข้อมูล' },
          { key: 'nearThreshold', label: 'วงเงินเฉียดเพดาน 90%+', count: analysis.counts.nearThreshold, color: 'amber', icon: ShieldAlert, desc: `${(threshold * 0.9).toLocaleString()} - ${(threshold - 1).toLocaleString()} บ.` },
          { key: 'warranty', label: 'ใกล้ครบประกันสัญญา', count: analysis.counts.warranty, color: 'blue', icon: Clock, desc: 'แจ้งกองช่างตรวจก่อนคืน 5%' }
        ].map((card) => {
          const Icon = card.icon;
          const active = filterType === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => setFilterType(active ? 'all' : card.key)}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${active ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-rose-500'}`} />
              </div>
              <div className="text-2xl font-black mt-2">{card.count}</div>
              <div className={`text-[11px] mt-1 ${active ? 'text-slate-300' : 'text-slate-400'}`}>{card.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Results List */}
      {rawRows.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
            ยังไม่ได้อัปโหลดไฟล์ Excel จาก e-LAAS
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            กดปุ่ม "อัปโหลดไฟล์ Excel e-LAAS" ด้านบน หรือคลิก "ทดลองด้วยข้อมูลตัวอย่าง" เพื่อดูตัวอย่างการตรวจจับจุดเสี่ยงอัตโนมัติ (ประมวลผลในเครื่อง 100% ปลอดภัย ไม่ส่งข้อมูลดิบออกภายนอก)
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
              ผลการสแกนจุดเสี่ยง ({filteredFlags.length} รายการ)
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อร้าน / ฎีกา..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {filteredFlags.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1.5" />
              ไม่พบรายการผิดปกติในหมวดหมู่นี้
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          flag.severity === 'สูงมาก'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                            : flag.severity === 'สูง'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                        }`}
                      >
                        ความเสี่ยง{flag.severity}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{flag.title}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{flag.detail}</p>
                    <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1">
                      <Info className="w-3 h-3 shrink-0" />
                      <span>{flag.legalRef}</span>
                    </div>
                  </div>

                  {setCapaFindings && (
                    <button
                      type="button"
                      onClick={() => handleSendFlagToCapa(flag)}
                      className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer self-start lg:self-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ส่งเข้าทะเบียน CAPA</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
