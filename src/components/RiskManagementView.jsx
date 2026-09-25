import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Printer,
  Building,
  Plus,
  Trash2,
  Pencil,
  BarChart3,
  Layers,
  FileText,
  Filter,
  ShieldCheck,
  Eye,
  Check,
  X,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Sparkles,
  HelpCircle,
  ExternalLink,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { getDepartments, getSession } from '../utils/auth';
import { exportBsToWord, exportBsToExcel } from '../utils/exportRiskDocs';

// 6 ประเภทความเสี่ยง ตามหนังสือสั่งการ มท 0805.2/ว 3482 (แบบ บส.2 ข้อ 8)
export const RISK_CATEGORIES = [
  { id: 'strategy', label: '1. ความเสี่ยงด้านกลยุทธ์ (Strategy Risks)', desc: 'ความเสี่ยงที่เกิดจากการกำหนดแผนกลยุทธ์ที่ไม่เหมาะสม หรือเกิดจากการนำกลยุทธ์ไปใช้ไม่ถูกต้อง' },
  { id: 'financial', label: '2. ความเสี่ยงด้านการเงิน (Financial Risks)', desc: 'ความเสี่ยงเกี่ยวกับการบริหารจัดการด้านการเงิน การเบิกจ่ายเงินไม่ถูกต้อง การรับเงินไม่ถูกต้อง ไม่ปฏิบัติตามกฎหมายการเงินการคลัง หรือการทุจริต' },
  { id: 'operation', label: '3. ความเสี่ยงด้านการดำเนินงาน (Operation Risks)', desc: 'ความเสี่ยงที่เกิดจากกระบวนการทำงานที่ไม่มีประสิทธิผลหรือไม่มีประสิทธิภาพ' },
  { id: 'legal', label: '4. ความเสี่ยงด้านการปฏิบัติตามกฎระเบียบ (Legal Risks)', desc: 'ความเสี่ยงที่หน่วยงานไม่ปฏิบัติตามกฎหมาย ระเบียบ ข้อบังคับ หลักเกณฑ์ มติ ครม. หรือคู่มือแนวทางปฏิบัติงาน' },
  { id: 'technology', label: '5. ความเสี่ยงด้านเทคโนโลยีสารสนเทศ (Technology Risks)', desc: 'ความเสี่ยงที่เกิดจากเทคโนโลยีสารสนเทศ ระบบขัดข้อง หรือความไม่ปลอดภัยของข้อมูล' },
  { id: 'reputational', label: '6. ความเสี่ยงด้านความน่าเชื่อถือขององค์กร (Reputational Risks)', desc: 'ความเสี่ยงที่ส่งผลกระทบต่อชื่อเสียง ความเชื่อมั่น และความน่าเชื่อถือขององค์กร' },
];

// 8 วิธีการตอบสนองความเสี่ยง ตามหนังสือสั่งการ มท 0805.2/ว 3482 (แบบ บส.2 ข้อ 12)
export const RISK_RESPONSES = [
  { id: 'avoid', label: '1. ปฏิเสธความเสี่ยง (Avoid)', desc: 'ไม่ดำเนินงานในกิจกรรมที่มีความเสี่ยงสูง ที่หน่วยงานไม่สามารถยอมรับความเสี่ยงนั้นได้' },
  { id: 'reduce_l', label: '2. การลดโอกาสของความเสี่ยง (Reduce Likelihood)', desc: 'เช่น ลดโอกาสของความเสี่ยงการทุจริตด้านการเงิน การเพิ่มจุดตรวจทาน' },
  { id: 'reduce_i', label: '3. การลดผลกระทบของความเสี่ยง (Reduce Impact)', desc: 'เช่น การทำประกันภัย หรือการใช้เครื่องมือป้องกันความเสี่ยงทางการเงิน' },
  { id: 'transfer', label: '4. การโอนความเสี่ยง (Transfer)', desc: 'ถ่ายโอนความเสี่ยงที่ไม่สามารถดำเนินการเองได้ เช่น ให้ภาคเอกชนดำเนินการ' },
  { id: 'accept', label: '5. ยอมรับความเสี่ยง (Accept)', desc: 'ไม่ดำเนินการจัดการความเสี่ยง เนื่องจากความเสี่ยงอยู่ในระดับที่ยอมรับได้' },
  { id: 'monitor', label: '6. ใช้มาตรการการเฝ้าระวัง (Monitor & Early Warning)', desc: 'กำหนดข้อมูลที่ต้องเก็บรวบรวม การวิเคราะห์ การแจ้งเตือนเมื่อเหตุการณ์เกิดขึ้น' },
  { id: 'contingency', label: '7. การทำแผนฉุกเฉิน (Contingency Plan)', desc: 'ระบุขั้นตอนเมื่อเกิดเหตุการณ์ความเสี่ยงขึ้น โดยระบุบุคคลและวิธีดำเนินการที่ชัดเจน' },
  { id: 'exploit', label: '8. การส่งเสริมหรือผลักดันเหตุการณ์ (Exploit / Enhance)', desc: 'เมื่อเหตุการณ์ที่อาจเกิดขึ้นส่งผลกระทบเชิงบวกกับองค์กร' },
];

// คำอธิบายแบบตามหนังสือสั่งการ มท 0805.2/ว 3482
const FORM_GUIDELINES = {
  bs1: {
    title: 'คำอธิบายแบบกำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)',
    subtitle: 'ตามหนังสือสั่งการ มท 0805.2/ว 3482 ลงวันที่ 18 สิงหาคม 2566',
    items: [
      { num: '๑', title: 'ชื่อ อปท.', desc: 'ระบุชื่อองค์กรปกครองส่วนท้องถิ่น เช่น องค์การบริหารส่วนตำบลฝางคำ' },
      { num: '๒', title: 'ปีงบประมาณ', desc: 'ปีงบประมาณในการบริหารจัดการความเสี่ยง' },
      { num: '๓', title: 'รหัสความเสี่ยง', desc: 'รหัสความเสี่ยงตามลำดับจำนวนความเสี่ยงโครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ (เช่น RSK-01, RSK-02)' },
      { num: '๔', title: 'ยุทธศาสตร์ที่รับผิดชอบ', desc: 'ระบุโครงการ/กิจกรรม/ภารกิจ อปท. ที่จัดทำขึ้นเพื่อตอบสนองยุทธศาสตร์ใดหรือภารกิจใดของ อปท.' },
      { num: '๕', title: 'โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ', desc: 'โครงการ/กิจกรรมที่สำคัญต่อการบรรลุวัตถุประสงค์ตามยุทธศาสตร์ (ระบุทั้งหมด หรือที่มีความเสี่ยง หรือที่มีความเสี่ยงสูง ตามนโยบายผู้บริหาร)' },
      { num: '๖', title: 'งบประมาณ (บาท)', desc: 'จำนวนเงินงบประมาณโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (๕) (ถ้ามี)' },
      { num: '๗', title: 'วัตถุประสงค์', desc: 'วัตถุประสงค์ตามโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (๕)' },
      { num: '๘', title: 'ตัวชี้วัด', desc: 'ตัวชี้วัดของโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (๕)' },
      { num: '๙', title: 'เป้าหมาย', desc: 'เป้าหมายที่ต้องการสูงสุดของโครงการ/กิจกรรม/ภารกิจ อปท.' },
      { num: '๑๐-๑๒', title: 'ลายมือชื่อ ตำแหน่ง วันเดือนปี', desc: 'ลายมือชื่อผู้บริหารท้องถิ่น ตำแหน่ง และวันเดือนปีที่ลงนาม' },
    ]
  },
  bs2: {
    title: 'คำอธิบายแบบการวิเคราะห์โอกาส ผลกระทบ และการตอบสนองความเสี่ยง',
    subtitle: 'ตามหนังสือสั่งการ มท 0805.2/ว 3482 ลงวันที่ 18 สิงหาคม 2566',
    items: [
      { num: '๑ - ๒', title: 'ชื่อ อปท. และปีงบประมาณ', desc: 'ระบุชื่อหน่วยงาน และปีงบประมาณที่บริหารจัดการความเสี่ยง' },
      { num: '๓ - ๕', title: 'รหัส, โครงการ/กิจกรรม, วัตถุประสงค์', desc: 'นำข้อมูลเชื่อมโยงมาจาก แบบ บส. ๑ (ข้อ ๓, ๕, ๗)' },
      { num: '๖', title: 'ผู้รับผิดชอบ', desc: 'ระบุบุคคลหรือหน่วยงาน หรือบุคคลและหน่วยงานผู้รับผิดชอบภารกิจ' },
      { num: '๗', title: 'ความเสี่ยง', desc: 'ความเสี่ยงที่มีผลกระทบต่อการบรรลุวัตถุประสงค์ของโครงการ/กิจกรรม/ภารกิจ อปท.' },
      { num: '๘', title: 'ประเภทความเสี่ยง (๖ ประเภท)', desc: '๑. กลยุทธ์ (Strategy) ๒. การเงิน (Financial) ๓. การดำเนินงาน (Operation) ๔. กฎระเบียบ (Legal) ๕. เทคโนโลยีสารสนเทศ (Technology) ๖. ความน่าเชื่อถือขององค์กร (Reputational)' },
      { num: '๙', title: 'คะแนนโอกาส', desc: 'ระบุคะแนนโอกาสที่จะเกิดความเป็นไปได้หรือความถี่ที่จะเกิดความเสี่ยง (เกณฑ์ ๑ - ๕: สูงมาก, สูง, ปานกลาง, น้อย, น้อยที่สุด)' },
      { num: '๑๐', title: 'คะแนนผลกระทบ', desc: 'ระบุคะแนนผลกระทบต่อโครงการ/กิจกรรม/ภารกิจ (เกณฑ์ ๑ - ๕: สูงมาก, สูง, ปานกลาง, น้อย, น้อยที่สุด)' },
      { num: '๑๑', title: 'คะแนนระดับความเสี่ยง (๙) x (๑๐)', desc: 'คะแนนโอกาส x คะแนนผลกระทบ (๑-๒๕) และจัดระดับความเสี่ยง (สูงมาก, สูง, ปานกลาง, ต่ำ)' },
      { num: '๑๒', title: 'วิธีการตอบสนองความเสี่ยง (๘ วิธี)', desc: '๑. ปฏิเสธความเสี่ยง ๒. ลดโอกาส ๓. ลดผลกระทบ ๔. โอนความเสี่ยง ๕. ยอมรับความเสี่ยง ๖. ใช้มาตรการเฝ้าระวัง ๗. ทำแผนฉุกเฉิน ๘. ส่งเสริม/ผลักดันเหตุการณ์' },
      { num: '๑๓-๑๕', title: 'การลงนาม', desc: 'ลายมือชื่อผู้บริหารท้องถิ่น ตำแหน่ง และวันเดือนปีที่ลงนาม' },
    ]
  },
  bs3: {
    title: 'คำอธิบายแบบรายงานการจัดทำแผนบริหารความเสี่ยง',
    subtitle: 'ตามหนังสือสั่งการ มท 0805.2/ว 3482 ลงวันที่ 18 สิงหาคม 2566',
    items: [
      { num: '๑ - ๒', title: 'ชื่อ อปท. และปีงบประมาณ', desc: 'ระบุชื่อหน่วยงาน และปีงบประมาณ' },
      { num: '๓ - ๗', title: 'รหัส, โครงการ, ความเสี่ยง, การตอบสนอง, ผู้รับผิดชอบ', desc: 'นำข้อมูลเชื่อมโยงมาจาก แบบ บส. ๒ (ข้อ ๓, ๔, ๗, ๑๒, ๖)' },
      { num: '๘', title: 'วิธีการจัดการความเสี่ยง (มาตรการควบคุม)', desc: 'ระบุแนวทางการดำเนินงาน/ขั้นตอนการปฏิบัติงาน ตามกฎหมาย ระเบียบ ข้อบังคับ และหนังสือสั่งการที่กำหนด เพื่อให้ความเสี่ยงลดลงหรืออยู่ในระดับที่ยอมรับได้' },
      { num: '๙', title: 'ตัวชี้วัด', desc: 'ตัวชี้วัดของโครงการ/กิจกรรม/ภารกิจที่มีความเสี่ยง โดยนำข้อมูลมาจาก แบบ บส. ๑ (ข้อ ๘)' },
      { num: '๑๐', title: 'ระยะเวลาดำเนินการ', desc: 'ระบุช่วงระยะเวลาในการดำเนินการจัดการความเสี่ยง (เช่น ตลอดปีงบประมาณ, ไตรมาส 1 - 2)' },
      { num: '๑๑', title: 'วิธีการติดตาม และการรายงาน', desc: 'ระบุวิธีการติดตามและการรายงานให้ผู้บริหารทราบ เช่น การประชุมประจำเดือน, รายงานไตรมาส, สรุปผลต่อคณะกรรมการ' },
      { num: '๑๒-๑๔', title: 'การลงนาม', desc: 'ลายมือชื่อผู้บริหารท้องถิ่น ตำแหน่ง และวันเดือนปีที่ลงนาม' },
    ]
  },
  bs4: {
    title: 'คำอธิบายแบบรายงานการติดตามผลการบริหารความเสี่ยง',
    subtitle: 'ตามหนังสือสั่งการ มท 0805.2/ว 3482 ลงวันที่ 18 สิงหาคม 2566',
    items: [
      { num: 'หัวแบบ', title: 'รอบการติดตามผล', desc: 'เลือกกาเครื่องหมายถูก [✓] รอบ ๓ เดือน หรือ [✓] รอบ ๖ เดือน หรือ [✓] รอบ ๑๒ เดือน' },
      { num: '๑ - ๒', title: 'ชื่อ อปท. และปีงบประมาณ', desc: 'ระบุชื่อหน่วยงาน และปีงบประมาณ' },
      { num: '๓ - ๗', title: 'รหัส, โครงการ, วิธีจัดการ, ระยะเวลา, ผู้รับผิดชอบ', desc: 'นำข้อมูลเชื่อมโยงมาจาก แบบ บส. ๓ (ข้อ ๓, ๔, ๘, ๑๐, ๗)' },
      { num: '๘', title: 'ผลลัพธ์การดำเนินการจัดการความเสี่ยง', desc: 'ระบุผลการดำเนินงาน/ขั้นตอนปฏิบัติงาน ได้ดำเนินการหรือไม่อย่างไร (ระบุแต่ละขั้นตอนหรือภาพรวม)' },
      { num: '๙', title: 'เอกสาร/หลักฐาน', desc: 'เอกสารหลักฐานอ้างอิงประกอบผลการดำเนินการจัดการความเสี่ยง เช่น บันทึกข้อความ, รายงาน, ภาพถ่าย' },
      { num: '๑๐', title: 'ร้อยละความคืบหน้า', desc: 'ระบุความคืบหน้าของการดำเนินการเป็นร้อยละ (%)' },
      { num: '๑๑', title: 'ปัญหาอุปสรรค และแนวทางแก้ไข', desc: 'ระบุปัญหา อุปสรรค และแนวทางแก้ไขปัญหาในการดำเนินมาตรการจัดการความเสี่ยง (ถ้ามี)' },
      { num: '๑๒-๑๔', title: 'การลงนาม', desc: 'ลายมือชื่อผู้บริหารท้องถิ่น ตำแหน่ง และวันเดือนปีที่ลงนาม' },
    ]
  },
  bs5: {
    title: 'คำอธิบายแบบรายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง',
    subtitle: 'ตามหนังสือสั่งการ มท 0805.2/ว 3482 ลงวันที่ 18 สิงหาคม 2566',
    items: [
      { num: '๑ - ๒', title: 'ชื่อ อปท. และปีงบประมาณ', desc: 'ระบุชื่อหน่วยงาน และปีงบประมาณ' },
      { num: '๓ - ๕', title: 'รหัส, โครงการ/กิจกรรม, ความเสี่ยง', desc: 'นำข้อมูลเชื่อมโยงมาจาก แบบ บส. ๔ และ บส. ๓' },
      { num: '๖', title: 'คะแนนระดับความเสี่ยงก่อนดำเนินการ', desc: 'โอกาส (๑) x ผลกระทบ (๒) = คะแนนระดับความเสี่ยง (๓) จากการประเมินในแบบ บส. ๒' },
      { num: '๗', title: 'วิธีการจัดการความเสี่ยง', desc: 'แนวทางการดำเนินงานตามที่ระบุไว้ในแบบ บส. ๔ (ข้อ ๕)' },
      { num: '๘', title: 'ผลดำเนินการจากการจัดการความเสี่ยง', desc: 'สรุปผลการดำเนินการจัดการความเสี่ยงเป็นภาพรวม' },
      { num: '๙', title: 'คะแนนระดับความเสี่ยงภายหลังดำเนินการ', desc: 'ประเมินซ้ำหลังมีมาตรการ: โอกาส (๑) x ผลกระทบ (๒) = คะแนนระดับความเสี่ยง (๓)' },
      { num: '๑๐', title: 'การเปลี่ยนแปลงระดับความเสี่ยง', desc: 'เปรียบเทียบก่อนดำเนินการกับหลังดำเนินการว่า "ลดลง" หรือ "ไม่ลดลง"' },
      { num: '๑๑', title: 'ความเสี่ยงคงเหลือ/เกิดขึ้นใหม่', desc: 'ระบุประเด็นความเสี่ยงที่ยังคงหลงเหลืออยู่ หรือความเสี่ยงใหม่ที่เกิดขึ้นระหว่างปี' },
      { num: '๑๒', title: 'สรุปความเสี่ยง', desc: 'ระบุว่า "ควบคุมได้" หรือ "ควบคุมไม่ได้" (หรืออยู่ในระดับที่ยอมรับได้/ไม่ได้)' },
      { num: '๑๓', title: 'แนวทาง/มาตรการสำหรับปีถัดไป', desc: 'กำหนดแนวทาง มาตรการ หรือวิธีการดำเนินการสำหรับปีงบประมาณถัดไป' },
      { num: '๑๔-๑๖', title: 'การลงนาม', desc: 'ลายมือชื่อผู้บริหารท้องถิ่น ตำแหน่ง และวันเดือนปีที่รายงาน' },
    ]
  }
};

export default function RiskManagementView({
  riskManagement,
  setRiskManagement,
  orgProfile,
  selectedYear = '2569',
  session
}) {
  const currentSession = session || getSession();
  const isAdmin =
    currentSession?.role === 'admin' ||
    currentSession?.department === 'หน่วยตรวจสอบภายใน' ||
    currentSession?.username === 'admin';
  const userDept = currentSession?.department || currentSession?.displayName || 'กองคลัง';

  // Navigation tabs: 'bs1', 'bs2', 'bs3', 'bs4', 'bs5'
  const [activeTab, setActiveTab] = useState('bs1');
  
  // Department filter
  const [filterDept, setFilterDept] = useState(isAdmin ? 'all' : userDept);

  // Toggle official explanation guide
  const [showGuide, setShowGuide] = useState(false);

  // Period for BS.4: '3month', '6month', '12month'
  const [bs4Period, setBs4Period] = useState('6month');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBs1, setEditingBs1] = useState(null);
  const [editingBs2, setEditingBs2] = useState(null);
  const [editingBs3, setEditingBs3] = useState(null);
  const [editingBs4, setEditingBs4] = useState(null);
  const [editingBs5, setEditingBs5] = useState(null);
  const [editingBs5Summary, setEditingBs5Summary] = useState(false);

  // State for Add Modals
  const [formBs1, setFormBs1] = useState({
    department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
    riskCode: '',
    strategy: '',
    activity: '',
    budget: '',
    objective: '',
    kpi: '',
    target: '',
    riskEvent: '',
    cause: '',
    riskCategory: 'ด้านการดำเนินงาน (Operation Risks)'
  });

  const [formBs2, setFormBs2] = useState({
    department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
    riskCode: '',
    activity: '',
    objective: '',
    responsiblePerson: '',
    riskEvent: '',
    riskCategory: 'ด้านการดำเนินงาน (Operation Risks)',
    likelihood: 3,
    impact: 3,
    riskResponse: 'การลดโอกาสของความเสี่ยง'
  });

  const [formBs3, setFormBs3] = useState({
    department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
    riskCode: '',
    activity: '',
    riskEvent: '',
    riskResponse: 'การลดโอกาสของความเสี่ยง',
    responsiblePerson: '',
    measures: '',
    kpi: '',
    timeline: 'ตลอดปีงบประมาณ',
    monitoringMethod: 'รายงานผลในการประชุมประจำเดือนของ อปท.'
  });

  const [formBs4, setFormBs4] = useState({
    department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
    period: '6month',
    riskCode: '',
    activity: '',
    measures: '',
    timeline: 'ตลอดปีงบประมาณ',
    responsiblePerson: '',
    result: '',
    evidence: '',
    progressPercent: 80,
    problemSolution: ''
  });

  const [formBs5, setFormBs5] = useState({
    department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
    riskCode: '',
    activity: '',
    riskEvent: '',
    preLikelihood: 3,
    preImpact: 3,
    measures: '',
    result: '',
    postLikelihood: 1,
    postImpact: 2,
    riskChange: 'ลดลง',
    residualRisk: '',
    controllable: 'ควบคุมได้',
    nextYearMeasures: ''
  });

  // Safe data extraction with normalization
  const bs1List = useMemo(() => {
    return (riskManagement?.bs1 || []).map((item, idx) => ({
      ...item,
      riskCode: item.riskCode || `RSK-0${idx + 1}`,
      activity: item.activity || item.riskEvent || 'โครงการ/ภารกิจสำคัญ',
      strategy: item.strategy || 'ยุทธศาสตร์การพัฒนาด้านการบริหารจัดการบ้านเมืองที่ดี',
      budget: item.budget !== undefined ? item.budget : 0,
      objective: item.objective || '',
      kpi: item.kpi || 'ร้อยละความสำเร็จตามเป้าหมาย (100%)',
      target: item.target || 'บรรลุตามวัตถุประสงค์ ไม่มีความเสียหาย'
    }));
  }, [riskManagement?.bs1]);

  const bs2List = useMemo(() => {
    return (riskManagement?.bs2 || []).map((item, idx) => {
      const matchBs1 = bs1List.find((b) => b.id === item.id || b.riskCode === item.riskCode || b.department === item.department);
      const l = Number(item.likelihood) || 3;
      const i = Number(item.impact) || 3;
      const score = l * i;
      return {
        ...item,
        riskCode: item.riskCode || matchBs1?.riskCode || `RSK-0${idx + 1}`,
        activity: item.activity || matchBs1?.activity || item.riskEvent || 'ภารกิจสำคัญ',
        objective: item.objective || matchBs1?.objective || '',
        responsiblePerson: item.responsiblePerson || `ผู้อำนวยการ${item.department || ''}`,
        riskEvent: item.riskEvent || matchBs1?.riskEvent || '',
        riskCategory: item.riskCategory || 'ด้านการดำเนินงาน (Operation Risks)',
        likelihood: l,
        impact: i,
        riskScore: score,
        riskLevel: item.riskLevel || (score >= 15 ? 'สูงมาก' : score >= 10 ? 'สูง' : score >= 5 ? 'ปานกลาง' : 'ต่ำ'),
        riskResponse: item.riskResponse || 'การลดโอกาสของความเสี่ยง'
      };
    });
  }, [riskManagement?.bs2, bs1List]);

  const bs3List = useMemo(() => {
    return (riskManagement?.bs3 || []).map((item, idx) => {
      const matchBs2 = bs2List.find((b) => b.id === item.id || b.riskCode === item.riskCode);
      const matchBs1 = bs1List.find((b) => b.id === item.id || b.riskCode === item.riskCode);
      return {
        ...item,
        riskCode: item.riskCode || matchBs2?.riskCode || `RSK-0${idx + 1}`,
        activity: item.activity || matchBs2?.activity || matchBs1?.activity || 'ภารกิจสำคัญ',
        riskEvent: item.riskEvent || matchBs2?.riskEvent || '',
        riskResponse: item.riskResponse || matchBs2?.riskResponse || 'การลดโอกาสของความเสี่ยง',
        responsiblePerson: item.responsiblePerson || matchBs2?.responsiblePerson || `ผู้อำนวยการ${item.department || ''}`,
        measures: item.measures || '',
        kpi: item.kpi || matchBs1?.kpi || 'ร้อยละของความสำเร็จตามมาตรการ (100%)',
        timeline: item.timeline || 'ตลอดปีงบประมาณ',
        monitoringMethod: item.monitoringMethod || 'รายงานผลในการประชุมประจำเดือนของ อปท.'
      };
    });
  }, [riskManagement?.bs3, bs2List, bs1List]);

  const bs4List = useMemo(() => {
    return (riskManagement?.bs4 || []).map((item, idx) => {
      const matchBs3 = bs3List.find((b) => b.id === item.id || b.riskCode === item.riskCode);
      return {
        ...item,
        period: item.period || '6month',
        riskCode: item.riskCode || matchBs3?.riskCode || `RSK-0${idx + 1}`,
        activity: item.activity || matchBs3?.activity || 'ภารกิจสำคัญ',
        measures: item.measures || matchBs3?.measures || '',
        timeline: item.timeline || matchBs3?.timeline || 'ตลอดปีงบประมาณ',
        responsiblePerson: item.responsiblePerson || matchBs3?.responsiblePerson || `ผู้อำนวยการ${item.department || ''}`,
        result: item.result || item.progressDetail || '',
        evidence: item.evidence || 'บันทึกข้อความ, รายงานสรุปผล',
        progressPercent: item.progressPercent !== undefined ? item.progressPercent : 80,
        problemSolution: item.problemSolution || ''
      };
    });
  }, [riskManagement?.bs4, bs3List]);

  const bs5Data = useMemo(() => {
    const raw = riskManagement?.bs5 || {};
    const items = (raw.items && Array.isArray(raw.items) && raw.items.length > 0)
      ? raw.items
      : bs1List.map((b, idx) => {
          const m2 = bs2List.find((x) => x.riskCode === b.riskCode || x.id === b.id);
          const m3 = bs3List.find((x) => x.riskCode === b.riskCode || x.id === b.id);
          const m4 = bs4List.find((x) => x.riskCode === b.riskCode || x.id === b.id);
          const preL = m2?.likelihood || 3;
          const preI = m2?.impact || 3;
          const postL = 1;
          const postI = 2;
          return {
            id: `BS5-${idx + 1}`,
            riskCode: b.riskCode,
            department: b.department,
            activity: b.activity,
            riskEvent: b.riskEvent,
            preLikelihood: preL,
            preImpact: preI,
            preScore: preL * preI,
            measures: m3?.measures || 'กำหนดมาตรการควบคุมและกำกับดูแล',
            result: m4?.result || 'ดำเนินมาตรการครบถ้วน ความเสี่ยงลดลงสู่ระดับที่ยอมรับได้',
            postLikelihood: postL,
            postImpact: postI,
            postScore: postL * postI,
            riskChange: 'ลดลง',
            residualRisk: 'ความเสี่ยงด้านการปฏิบัติงานต่อเนื่องตามภารกิจ',
            controllable: 'ควบคุมได้',
            nextYearMeasures: 'ติดตามผลและปรับปรุงมาตรการอย่างสม่ำเสมอ'
          };
        });

    return {
      summary: raw.summary || `ภาพรวมการบริหารจัดการความเสี่ยงระดับองค์กรของ${orgProfile?.name || 'องค์การบริหารส่วนตำบลฝางคำ'} ในรอบปีงบประมาณ พ.ศ. ${selectedYear} มีการระบุและประเมินความเสี่ยงครบถ้วนทุกส่วนราชการ โดยความเสี่ยงระดับสูงได้รับการบริหารจัดการและติดตามผลจนลดระดับลงมาอยู่ในเกณฑ์ที่ยอมรับได้ การดำเนินงานเป็นไปตามเกณฑ์มาตรฐานการบริหารความเสี่ยงของ อปท. ตามหนังสือสั่งการ มท 0805.2/ว 3482`,
      approvedBy: raw.approvedBy || orgProfile?.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ',
      approverPosition: raw.approverPosition || orgProfile?.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ',
      reportDate: raw.reportDate || `30 กันยายน ${selectedYear}`,
      items
    };
  }, [riskManagement?.bs5, bs1List, bs2List, bs3List, bs4List, orgProfile, selectedYear]);

  // Available departments (excluding internal audit as auditee)
  const departmentsList = getDepartments().filter((d) => d !== 'หน่วยตรวจสอบภายใน');

  // Filtered lists based on permission and active department filter
  const effectiveDept = isAdmin ? filterDept : userDept;
  // เป็นกองย่อยหรือไม่ (หากไม่ใช่ Admin หรือ Admin กำลังเลือกดูกองย่อยใดกองหนึ่ง)
  const isSubDivision = !isAdmin || (filterDept !== 'all');

  const filteredBs1 = useMemo(() => {
    if (isAdmin && filterDept === 'all') return bs1List;
    return bs1List.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs1List, isAdmin, filterDept, effectiveDept]);

  const filteredBs2 = useMemo(() => {
    if (isAdmin && filterDept === 'all') return bs2List;
    return bs2List.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs2List, isAdmin, filterDept, effectiveDept]);

  const filteredBs3 = useMemo(() => {
    if (isAdmin && filterDept === 'all') return bs3List;
    return bs3List.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs3List, isAdmin, filterDept, effectiveDept]);

  const filteredBs4 = useMemo(() => {
    let list = bs4List;
    if (bs4Period) {
      list = list.filter((item) => (item.period || '6month') === bs4Period);
    }
    if (isAdmin && filterDept === 'all') return list;
    return list.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs4List, bs4Period, isAdmin, filterDept, effectiveDept]);

  const filteredBs5Items = useMemo(() => {
    if (isAdmin && filterDept === 'all') return bs5Data.items;
    return bs5Data.items.filter((item) => (item.department || '').trim() === effectiveDept.trim());
  }, [bs5Data.items, isAdmin, filterDept, effectiveDept]);

  // Check edit permission for an item
  const canEditItem = (itemDept) => {
    if (isAdmin) return true;
    return (itemDept || '').trim() === userDept.trim();
  };

  const computeRiskLevel = (score) => {
    if (score >= 15) return 'สูงมาก';
    if (score >= 10) return 'สูง';
    if (score >= 5) return 'ปานกลาง';
    return 'ต่ำ';
  };

  const getRiskLevelBadge = (level) => {
    switch (level) {
      case 'สูงมาก':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800';
      case 'สูง':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
      case 'ปานกลาง':
        return 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
    }
  };

  // --- HANDLERS: ADD / EDIT / DELETE ---
  // Add BS.1 (and cascade auto-seed for BS.2, 3, 4, 5)
  const handleAddBs1 = (e) => {
    e.preventDefault();
    if (!formBs1.activity) return;
    const targetDept = isAdmin ? formBs1.department : userDept;
    const newCode = formBs1.riskCode || `RSK-0${bs1List.length + 1}`;
    const newId = `BS1-${Date.now()}`;

    const newBs1Item = {
      ...formBs1,
      id: newId,
      riskCode: newCode,
      department: targetDept
    };

    const newBs2Item = {
      id: `BS2-${Date.now()}`,
      riskCode: newCode,
      department: targetDept,
      activity: formBs1.activity,
      objective: formBs1.objective,
      responsiblePerson: `ผู้อำนวยการ${targetDept}`,
      riskEvent: formBs1.riskEvent || formBs1.activity,
      riskCategory: formBs1.riskCategory || 'ด้านการดำเนินงาน (Operation Risks)',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'ปานกลาง',
      riskResponse: 'การลดโอกาสของความเสี่ยง'
    };

    const newBs3Item = {
      id: `BS3-${Date.now()}`,
      riskCode: newCode,
      department: targetDept,
      activity: formBs1.activity,
      riskEvent: formBs1.riskEvent || formBs1.activity,
      riskResponse: 'การลดโอกาสของความเสี่ยง',
      responsiblePerson: `ผู้อำนวยการ${targetDept}`,
      measures: `กำหนดมาตรการควบคุมภายในและการกำกับดูแลสำหรับ ${targetDept}`,
      kpi: formBs1.kpi || 'ร้อยละความสำเร็จตามมาตรการ (100%)',
      timeline: 'ตลอดปีงบประมาณ',
      monitoringMethod: 'รายงานผลในการประชุมประจำเดือนของ อปท.'
    };

    const newBs4Item = {
      id: `BS4-${Date.now()}`,
      period: '6month',
      riskCode: newCode,
      department: targetDept,
      activity: formBs1.activity,
      measures: `กำหนดมาตรการควบคุมภายในและการกำกับดูแลสำหรับ ${targetDept}`,
      timeline: 'ตลอดปีงบประมาณ',
      responsiblePerson: `ผู้อำนวยการ${targetDept}`,
      result: 'อยู่ระหว่างดำเนินการตามมาตรการที่กำหนด',
      evidence: 'บันทึกข้อความ, รายงานสรุปผล',
      progressPercent: 80,
      problemSolution: ''
    };

    const newBs5Item = {
      id: `BS5-${Date.now()}`,
      riskCode: newCode,
      department: targetDept,
      activity: formBs1.activity,
      riskEvent: formBs1.riskEvent || formBs1.activity,
      preLikelihood: 3,
      preImpact: 3,
      preScore: 9,
      measures: `กำหนดมาตรการควบคุมภายในและการกำกับดูแลสำหรับ ${targetDept}`,
      result: 'ดำเนินมาตรการครบถ้วน ความเสี่ยงลดลงสู่เกณฑ์ที่ยอมรับได้',
      postLikelihood: 1,
      postImpact: 2,
      postScore: 2,
      riskChange: 'ลดลง',
      residualRisk: 'ความเสี่ยงด้านการปฏิบัติงานต่อเนื่อง',
      controllable: 'ควบคุมได้',
      nextYearMeasures: 'ติดตามผลและปรับปรุงมาตรการอย่างสม่ำเสมอ'
    };

    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs1: [...(prev?.bs1 || bs1List), newBs1Item],
        bs2: [...(prev?.bs2 || bs2List), newBs2Item],
        bs3: [...(prev?.bs3 || bs3List), newBs3Item],
        bs4: [...(prev?.bs4 || bs4List), newBs4Item],
        bs5: {
          ...bs5Data,
          items: [...(bs5Data.items || []), newBs5Item]
        }
      }));
    }

    setFormBs1({
      department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
      riskCode: '',
      strategy: '',
      activity: '',
      budget: '',
      objective: '',
      kpi: '',
      target: '',
      riskEvent: '',
      cause: '',
      riskCategory: 'ด้านการดำเนินงาน (Operation Risks)'
    });
    setShowAddModal(false);
  };

  // Save Edit BS.1
  const handleSaveEditBs1 = (e) => {
    e.preventDefault();
    if (!editingBs1) return;
    const finalDept = isAdmin ? editingBs1.department : editingBs1.department || userDept;
    if (setRiskManagement) {
      setRiskManagement((prev) => {
        const updatedBs1 = (prev?.bs1 || bs1List).map((item) =>
          item.id === editingBs1.id ? { ...item, ...editingBs1, department: finalDept } : item
        );
        // Cascade update activity & code to BS.2, 3, 4, 5
        const updatedBs2 = (prev?.bs2 || bs2List).map((item) =>
          item.riskCode === editingBs1.riskCode || item.id === editingBs1.id
            ? { ...item, activity: editingBs1.activity, riskEvent: editingBs1.riskEvent, department: finalDept }
            : item
        );
        const updatedBs3 = (prev?.bs3 || bs3List).map((item) =>
          item.riskCode === editingBs1.riskCode || item.id === editingBs1.id
            ? { ...item, activity: editingBs1.activity, riskEvent: editingBs1.riskEvent, department: finalDept }
            : item
        );
        const updatedBs4 = (prev?.bs4 || bs4List).map((item) =>
          item.riskCode === editingBs1.riskCode || item.id === editingBs1.id
            ? { ...item, activity: editingBs1.activity, department: finalDept }
            : item
        );
        const updatedBs5Items = (bs5Data.items || []).map((item) =>
          item.riskCode === editingBs1.riskCode || item.id === editingBs1.id
            ? { ...item, activity: editingBs1.activity, riskEvent: editingBs1.riskEvent, department: finalDept }
            : item
        );
        return {
          ...prev,
          bs1: updatedBs1,
          bs2: updatedBs2,
          bs3: updatedBs3,
          bs4: updatedBs4,
          bs5: { ...bs5Data, items: updatedBs5Items }
        };
      });
    }
    setEditingBs1(null);
  };

  // Delete BS.1
  const handleDeleteBs1 = (id, riskCode) => {
    if (!window.confirm('คุณต้องการลบรายการนี้ออกจากระบบบริหารความเสี่ยงใช่หรือไม่?')) return;
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs1: (prev?.bs1 || bs1List).filter((item) => item.id !== id && item.riskCode !== riskCode),
        bs2: (prev?.bs2 || bs2List).filter((item) => item.id !== id && item.riskCode !== riskCode),
        bs3: (prev?.bs3 || bs3List).filter((item) => item.id !== id && item.riskCode !== riskCode),
        bs4: (prev?.bs4 || bs4List).filter((item) => item.id !== id && item.riskCode !== riskCode),
        bs5: {
          ...bs5Data,
          items: (bs5Data.items || []).filter((item) => item.id !== id && item.riskCode !== riskCode)
        }
      }));
    }
  };

  // Save Edit BS.2
  const handleSaveEditBs2 = (e) => {
    e.preventDefault();
    if (!editingBs2) return;
    const l = Number(editingBs2.likelihood) || 1;
    const i = Number(editingBs2.impact) || 1;
    const score = l * i;
    const level = computeRiskLevel(score);
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs2: (prev?.bs2 || bs2List).map((item) =>
          item.id === editingBs2.id
            ? { ...item, ...editingBs2, likelihood: l, impact: i, riskScore: score, riskLevel: level }
            : item
        )
      }));
    }
    setEditingBs2(null);
  };

  // Save Edit BS.3
  const handleSaveEditBs3 = (e) => {
    e.preventDefault();
    if (!editingBs3) return;
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs3: (prev?.bs3 || bs3List).map((item) =>
          item.id === editingBs3.id ? { ...item, ...editingBs3 } : item
        )
      }));
    }
    setEditingBs3(null);
  };

  // Save Edit BS.4
  const handleSaveEditBs4 = (e) => {
    e.preventDefault();
    if (!editingBs4) return;
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs4: (prev?.bs4 || bs4List).map((item) =>
          item.id === editingBs4.id ? { ...item, ...editingBs4 } : item
        )
      }));
    }
    setEditingBs4(null);
  };

  // Save Edit BS.5 Row
  const handleSaveEditBs5 = (e) => {
    e.preventDefault();
    if (!editingBs5) return;
    const preScore = Number(editingBs5.preLikelihood) * Number(editingBs5.preImpact);
    const postScore = Number(editingBs5.postLikelihood) * Number(editingBs5.postImpact);
    const change = postScore < preScore ? 'ลดลง' : 'ไม่ลดลง';
    const updated = {
      ...editingBs5,
      preScore,
      postScore,
      riskChange: change
    };
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs5: {
          ...bs5Data,
          items: (bs5Data.items || []).map((item) => (item.id === editingBs5.id ? updated : item))
        }
      }));
    }
    setEditingBs5(null);
  };

  // Save BS.5 Summary
  const handleSaveBs5Summary = (e) => {
    e.preventDefault();
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs5: {
          ...bs5Data,
          summary: e.target.summary.value,
          approvedBy: e.target.approvedBy.value,
          approverPosition: e.target.approverPosition.value,
          reportDate: e.target.reportDate.value
        }
      }));
    }
    setEditingBs5Summary(false);
  };

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  // Handle Download Word (.doc)
  const handleDownloadWord = () => {
    exportBsToWord({
      activeTab,
      filteredBs1,
      filteredBs2,
      filteredBs3,
      filteredBs4,
      filteredBs5Items,
      bs5Data,
      bs4Period,
      orgProfile,
      selectedYear,
      isSubDivision,
      effectiveDept: isAdmin ? filterDept : userDept
    });
  };

  // Handle Download Excel (.xls)
  const handleDownloadExcel = () => {
    exportBsToExcel({
      activeTab,
      filteredBs1,
      filteredBs2,
      filteredBs3,
      filteredBs4,
      filteredBs5Items,
      bs5Data,
      bs4Period,
      orgProfile,
      selectedYear,
      isSubDivision,
      effectiveDept: isAdmin ? filterDept : userDept
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white dark:from-slate-850 dark:to-slate-900 p-6 rounded-2xl border border-blue-200/80 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>มาตรฐานกระทรวงการคลัง พ.ศ. ๒๕๖๒ • หนังสือสั่งการ มท ๐๘๐๕.๒/ว ๓๔๘๒</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            ระบบบริหารจัดการความเสี่ยงองค์กร (Enterprise Risk Management: บส.๑ - บส.๕)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            แบบรายงานการบริหารจัดการความเสี่ยงตามมาตรฐานของกรมส่งเสริมการปกครองท้องถิ่น จัดทำครอบคลุม ๕ แบบ 
            จำแนกตามภารกิจรายกอง ประจำปีงบประมาณ พ.ศ. {selectedYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0 no-print">
          <a
            href="/docs/w3482-risk-forms.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            title="เปิดดูหนังสือสั่งการ มท 0805.2/ว 3482 ฉบับจริง (PDF 12 หน้า)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>เปิด PDF ว ๓๔๘๒</span>
          </a>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            title="คำอธิบายการจัดทำแบบรายงานตามหนังสือสั่งการ"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{showGuide ? 'ซ่อนคำอธิบาย' : 'คำอธิบาย ว ๓๔๘๒'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadWord}
            className="bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            title="ดาวน์โหลดแบบรายงานที่เปิดอยู่ออกมาเป็นไฟล์ Word (.doc)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>ดาวน์โหลด Word</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadExcel}
            className="bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            title="ดาวน์โหลดแบบรายงานที่เปิดอยู่ออกมาเป็นไฟล์ Excel (.xls)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ดาวน์โหลด Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            title="พิมพ์แบบฟอร์มตามหนังสือสั่งการ (A4 แนวนอน)"
          >
            <Printer className="w-3.5 h-3.5 text-blue-100" />
            <span>พิมพ์เอกสาร (A4)</span>
          </button>
        </div>
      </div>

      {/* 2. Role-Based Scope & Department Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs no-print">
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isAdmin 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'bg-indigo-600 text-white shadow-xs'
          }`}>
            {isAdmin ? <ShieldCheck className="w-5 h-5 text-white" /> : <Building className="w-5 h-5 text-white" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                {isAdmin ? 'สิทธิ์หน่วยตรวจสอบภายใน (Admin)' : `สิทธิ์ส่วนราชการ: ${userDept}`}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAdmin 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
              }`}>
                {isAdmin ? 'เห็นข้อมูลทุกกอง' : 'เฉพาะข้อมูลของกองท่าน'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isAdmin 
                ? 'หน่วยตรวจสอบภายในสามารถดู แก้ไข และติดตามความเสี่ยงของทุกส่วนราชการใน อปท. ได้อย่างครบถ้วน' 
                : `ท่านสามารถกรอกและแก้ไขข้อมูลความเสี่ยงเฉพาะส่วนของ "${userDept}" ตามหนังสือสั่งการ`}
            </p>
          </div>
        </div>

        {/* Admin Filter Dropdown */}
        {isAdmin && (
          <div className="flex items-center space-x-2 self-end sm:self-center">
            <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>มุมมองกอง:</span>
            </span>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">🏢 แสดงทุกส่วนราชการ ({departmentsList.length} รายการ)</option>
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>📁 {dept}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 3. Official Form Guidelines (Collapsible Accordion) */}
      {showGuide && (
        <div className="bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 rounded-2xl p-5 border border-amber-200/80 dark:border-amber-900/50 shadow-xs space-y-4 no-print">
          <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {FORM_GUIDELINES[activeTab]?.title}
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  {FORM_GUIDELINES[activeTab]?.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
            {FORM_GUIDELINES[activeTab]?.items.map((item, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-slate-100">
                  <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                    ({item.num})
                  </span>
                  <span>{item.title}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Special Guideline Badges for BS.2 */}
          {activeTab === 'bs2' && (
            <div className="pt-2 border-t border-amber-200/60 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-blue-700 dark:text-blue-300 block mb-1">
                  📌 ประเภทความเสี่ยง ๖ ประเภท (ข้อ ๘):
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside text-[11px]">
                  {RISK_CATEGORIES.map((c) => (
                    <li key={c.id}><strong>{c.label}:</strong> {c.desc}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                  📌 วิธีการตอบสนองความเสี่ยง ๘ วิธี (ข้อ ๑๒):
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside text-[11px]">
                  {RISK_RESPONSES.map((r) => (
                    <li key={r.id}><strong>{r.label}:</strong> {r.desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Tab Navigation (บส. ๑ ถึง บส. ๕) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('bs1')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'bs1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>แบบ บส. ๑: กำหนดขอบเขต ({filteredBs1.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bs2')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'bs2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>แบบ บส. ๒: วิเคราะห์ความเสี่ยง ({filteredBs2.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bs3')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'bs3'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>แบบ บส. ๓: แผนบริหารความเสี่ยง ({filteredBs3.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bs4')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'bs4'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>แบบ บส. ๔: ติดตามผล ({filteredBs4.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bs5')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'bs5'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>แบบ บส. ๕: ทบทวนระดับองค์กร</span>
          </button>
        </div>

        {/* Context Action Button */}
        {setRiskManagement && activeTab === 'bs1' && (
          <button
            type="button"
            onClick={() => {
              setFormBs1({
                department: isAdmin ? (filterDept !== 'all' ? filterDept : 'กองคลัง') : userDept,
                riskCode: `RSK-0${bs1List.length + 1}`,
                strategy: '',
                activity: '',
                budget: '',
                objective: '',
                kpi: '',
                target: '',
                riskEvent: '',
                cause: '',
                riskCategory: 'ด้านการดำเนินงาน (Operation Risks)'
              });
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ กำหนดความเสี่ยงใหม่ (บส.๑)</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: แบบ บส. ๑
      ========================================================================= */}
      {activeTab === 'bs1' && (
        <div className="space-y-4 printable-document">
          {/* Official Document Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1.5 print:p-2 print:border-none print:shadow-none print:rounded-none">
            <div className="flex justify-between items-start text-xs font-bold text-slate-500 mb-1 print:mb-2 print:text-black">
              <span className="no-print">ลำดับที่ ๑ ของชุดแบบรายงาน</span>
              <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 print:text-black print:text-sm ml-auto">แบบ บส. ๑</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 print:text-black print:text-lg">
              ชื่อหน่วยงาน (๑) <span className="underline decoration-blue-500/50 print:decoration-black underline-offset-4">{orgProfile?.name || 'องค์การบริหารส่วนตำบลฝางคำ'}</span>
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 print:text-black print:text-sm">
              กำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 print:text-black print:text-xs">
              ประจำปีงบประมาณ พ.ศ. (๒) <span className="font-mono font-bold text-slate-900 dark:text-slate-100 print:text-black">{selectedYear}</span>
            </p>
          </div>

          {/* Table BS 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden print:border-none print:shadow-none print:rounded-none">
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 border-collapse print:text-black">
                <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700/80 print:bg-slate-100 print:text-black">
                  <tr>
                    <th className="px-3.5 py-3.5 w-24 text-center">
                      (๓)<br />รหัสความเสี่ยง
                    </th>
                    <th className="px-3.5 py-3.5 w-44">
                      (๔)<br />ยุทธศาสตร์ที่รับผิดชอบ
                    </th>
                    <th className="px-4 py-3.5 min-w-[200px]">
                      (๕)<br />โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ
                    </th>
                    <th className="px-3.5 py-3.5 w-28 text-right">
                      (๖)<br />งบประมาณ (บาท)
                    </th>
                    <th className="px-4 py-3.5 min-w-[180px]">
                      (๗)<br />วัตถุประสงค์
                    </th>
                    <th className="px-3.5 py-3.5 min-w-[160px]">
                      (๘)<br />ตัวชี้วัด
                    </th>
                    <th className="px-3.5 py-3.5 min-w-[150px]">
                      (๙)<br />เป้าหมาย
                    </th>
                    <th className="px-3 py-3.5 text-center w-28">
                      ส่วนราชการ
                    </th>
                    {setRiskManagement && <th className="px-3 py-3.5 text-center w-20 no-print">จัดการ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBs1.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                        ไม่พบข้อมูลในแบบ บส. ๑ {filterDept !== 'all' ? `ของ "${filterDept}"` : ''} 
                        <br />
                        <span className="text-[11px] text-slate-400 mt-1 inline-block">
                          คลิกปุ่ม "+ กำหนดความเสี่ยงใหม่ (บส.๑)" เพื่อกรอกข้อมูลตามหนังสือสั่งการ
                        </span>
                      </td>
                    </tr>
                  ) : (
                    filteredBs1.map((item, idx) => {
                      const canManage = canEditItem(item.department);
                      return (
                        <tr key={item.id || idx} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3.5 py-3 font-mono font-bold text-center text-blue-700 dark:text-blue-300 align-top">
                            {item.riskCode || `RSK-0${idx + 1}`}
                          </td>
                          <td className="px-3.5 py-3 text-slate-700 dark:text-slate-300 font-medium align-top">
                            {item.strategy}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 align-top">
                            {item.activity}
                          </td>
                          <td className="px-3.5 py-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200 align-top">
                            {item.budget ? Number(item.budget).toLocaleString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300 align-top">
                            {item.objective}
                          </td>
                          <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300 align-top">
                            {item.kpi}
                          </td>
                          <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300 align-top">
                            {item.target}
                          </td>
                          <td className="px-3 py-3 text-center align-top">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {item.department}
                            </span>
                          </td>
                          {setRiskManagement && (
                            <td className="px-3 py-3 text-center align-top no-print">
                              {canManage ? (
                                <div className="flex items-center justify-center space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingBs1(item)}
                                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="แก้ไขข้อมูล"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteBs1(item.id, item.riskCode)}
                                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="ลบรายการ"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400">ดูเท่านั้น</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signature Section */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-850/50 border-t border-slate-200 dark:border-slate-800 flex flex-col items-end text-xs space-y-1.5 text-slate-700 dark:text-slate-300 print:bg-transparent print:border-none print:text-black print:pt-6">
              <div className="w-72 text-center space-y-2 print:text-xs">
                <div>ลายมือชื่อ...................................................</div>
                {isSubDivision ? (
                  <>
                    <div>( .................................................... )</div>
                    <div>ตำแหน่ง ....................................................</div>
                  </>
                ) : (
                  <>
                    <div>( {orgProfile?.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ'} )</div>
                    <div>ตำแหน่ง {orgProfile?.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ'}</div>
                  </>
                )}
                <div>วันที่......................................................</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: แบบ บส. ๒
      ========================================================================= */}
      {activeTab === 'bs2' && (
        <div className="space-y-4 printable-document">
          {/* Official Document Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1.5 print:p-2 print:border-none print:shadow-none print:rounded-none">
            <div className="flex justify-between items-start text-xs font-bold text-slate-500 mb-1 print:mb-2 print:text-black">
              <span className="no-print">ลำดับที่ ๒ ของชุดแบบรายงาน</span>
              <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 print:text-black print:text-sm ml-auto">แบบ บส. ๒</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 print:text-black print:text-lg">
              ชื่อหน่วยงาน (๑) <span className="underline decoration-blue-500/50 print:decoration-black underline-offset-4">{orgProfile?.name || 'องค์การบริหารส่วนตำบลฝางคำ'}</span>
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 print:text-black print:text-sm">
              การวิเคราะห์โอกาส ผลกระทบ และการตอบสนองความเสี่ยง
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 print:text-black print:text-xs">
              ประจำปีงบประมาณ พ.ศ. (๒) <span className="font-mono font-bold text-slate-900 dark:text-slate-100 print:text-black">{selectedYear}</span>
            </p>
          </div>

          {/* Table BS 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden print:border-none print:shadow-none print:rounded-none">
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 border-collapse print:text-black">
                <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700/80 print:bg-slate-100 print:text-black">
                  <tr>
                    <th className="px-3 py-3.5 w-24 text-center">
                      (๓)<br />รหัสความเสี่ยง
                    </th>
                    <th className="px-4 py-3.5 min-w-[180px]">
                      (๔)<br />โครงการ/กิจกรรม/ภารกิจ
                    </th>
                    <th className="px-4 py-3.5 min-w-[160px]">
                      (๕)<br />วัตถุประสงค์
                    </th>
                    <th className="px-3.5 py-3.5 w-36">
                      (๖)<br />ผู้รับผิดชอบ
                    </th>
                    <th className="px-4 py-3.5 min-w-[170px]">
                      (๗)<br />ความเสี่ยง
                    </th>
                    <th className="px-3.5 py-3.5 min-w-[150px]">
                      (๘)<br />ประเภทความเสี่ยง
                    </th>
                    <th className="px-2.5 py-3.5 text-center w-20">
                      (๙)<br />คะแนนโอกาส
                    </th>
                    <th className="px-2.5 py-3.5 text-center w-20">
                      (๑๐)<br />คะแนนผลกระทบ
                    </th>
                    <th className="px-3 py-3.5 text-center w-24">
                      (๑๑)<br />ระดับความเสี่ยง<br /><span className="text-[10px] font-normal">(๙) x (๑๐)</span>
                    </th>
                    <th className="px-4 py-3.5 min-w-[170px]">
                      (๑๒)<br />วิธีการตอบสนองความเสี่ยง
                    </th>
                    {setRiskManagement && <th className="px-3 py-3.5 text-center w-16 no-print">จัดการ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBs2.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-10 text-center text-slate-400">
                        ไม่พบข้อมูลในแบบ บส. ๒ {filterDept !== 'all' ? `ของ "${filterDept}"` : ''}
                      </td>
                    </tr>
                  ) : (
                    filteredBs2.map((item, idx) => {
                      const canManage = canEditItem(item.department);
                      return (
                        <tr key={item.id || idx} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-3 font-mono font-bold text-center text-blue-700 dark:text-blue-300 align-top">
                            {item.riskCode}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 align-top">
                            {item.activity}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300 align-top">
                            {item.objective}
                          </td>
                          <td className="px-3.5 py-3 text-slate-700 dark:text-slate-300 align-top">
                            {item.responsiblePerson}
                          </td>
                          <td className="px-4 py-3 text-rose-700 dark:text-rose-300 font-semibold align-top">
                            {item.riskEvent}
                          </td>
                          <td className="px-3.5 py-3 text-slate-700 dark:text-slate-300 align-top text-[11px]">
                            {item.riskCategory}
                          </td>
                          <td className="px-2.5 py-3 text-center font-mono font-bold align-top">
                            {item.likelihood}
                          </td>
                          <td className="px-2.5 py-3 text-center font-mono font-bold align-top">
                            {item.impact}
                          </td>
                          <td className="px-3 py-3 text-center align-top">
                            <div className="font-mono font-black text-slate-900 dark:text-slate-100">{item.riskScore}</div>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-block mt-0.5 ${getRiskLevelBadge(item.riskLevel)}`}>
                              {item.riskLevel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-indigo-700 dark:text-indigo-300 font-medium align-top">
                            {item.riskResponse}
                          </td>
                          {setRiskManagement && (
                            <td className="px-3 py-3 text-center align-top no-print">
                              {canManage ? (
                                <button
                                  type="button"
                                  onClick={() => setEditingBs2(item)}
                                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="แก้ไขการประเมิน"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">ดูเท่านั้น</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signature Section */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-850/50 border-t border-slate-200 dark:border-slate-800 flex flex-col items-end text-xs space-y-1.5 text-slate-700 dark:text-slate-300 print:bg-transparent print:border-none print:text-black print:pt-6">
              <div className="w-72 text-center space-y-2 print:text-xs">
                <div>ลายมือชื่อ...................................................</div>
                {isSubDivision ? (
                  <>
                    <div>( .................................................... )</div>
                    <div>ตำแหน่ง ....................................................</div>
                  </>
                ) : (
                  <>
                    <div>( {orgProfile?.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ'} )</div>
                    <div>ตำแหน่ง {orgProfile?.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ'}</div>
                  </>
                )}
                <div>วันที่......................................................</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: แบบ บส. ๓
      ========================================================================= */}
      {activeTab === 'bs3' && (
        <div className="space-y-4 printable-document">
          {/* Official Document Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1.5 print:p-2 print:border-none print:shadow-none print:rounded-none">
            <div className="flex justify-between items-start text-xs font-bold text-slate-500 mb-1 print:mb-2 print:text-black">
              <span className="no-print">ลำดับที่ ๓ ของชุดแบบรายงาน</span>
              <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 print:text-black print:text-sm ml-auto">แบบ บส. ๓</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 print:text-black print:text-lg">
              ชื่อหน่วยงาน (๑) <span className="underline decoration-blue-500/50 print:decoration-black underline-offset-4">{orgProfile?.name || 'องค์การบริหารส่วนตำบลฝางคำ'}</span>
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 print:text-black print:text-sm">
              รายงานการจัดทำแผนบริหารความเสี่ยง
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 print:text-black print:text-xs">
              ประจำปีงบประมาณ พ.ศ. (๒) <span className="font-mono font-bold text-slate-900 dark:text-slate-100 print:text-black">{selectedYear}</span>
            </p>
          </div>

          {/* Table BS 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden print:border-none print:shadow-none print:rounded-none">
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 border-collapse print:text-black">
                <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700/80 print:bg-slate-100 print:text-black">
                  <tr>
                    <th className="px-3 py-3.5 w-24 text-center">
                      (๓)<br />รหัสความเสี่ยง
                    </th>
                    <th className="px-4 py-3.5 min-w-[180px]">
                      (๔)<br />โครงการ/กิจกรรม/ภารกิจ
                    </th>
                    <th className="px-4 py-3.5 min-w-[160px]">
                      (๕)<br />ความเสี่ยง
                    </th>
                    <th className="px-3.5 py-3.5 min-w-[140px]">
                      (๖)<br />วิธีการตอบสนองความเสี่ยง
                    </th>
                    <th className="px-3.5 py-3.5 w-36">
                      (๗)<br />ผู้รับผิดชอบ
                    </th>
                    <th className="px-4 py-3.5 min-w-[220px]">
                      (๘)<br />วิธีการจัดการความเสี่ยง (มาตรการ)
                    </th>
                    <th className="px-3.5 py-3.5 min-w-[140px]">
                      (๙)<br />ตัวชี้วัด
                    </th>
                    <th className="px-3 py-3.5 w-32">
                      (๑๐)<br />ระยะเวลาดำเนินการ
                    </th>
                    <th className="px-3.5 py-3.5 min-w-[160px]">
                      (๑๑)<br />วิธีการติดตาม และการรายงาน
                    </th>
                    {setRiskManagement && <th className="px-3 py-3.5 text-center w-16 no-print">จัดการ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBs3.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-10 text-center text-slate-400">
                        ไม่พบข้อมูลในแบบ บส. ๓ {filterDept !== 'all' ? `ของ "${filterDept}"` : ''}
                      </td>
                    </tr>
                  ) : (
                    filteredBs3.map((item, idx) => {
                      const canManage = canEditItem(item.department);
                      return (
                        <tr key={item.id || idx} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-3 font-mono font-bold text-center text-blue-700 dark:text-blue-300 align-top">
                            {item.riskCode}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 align-top">
                            {item.activity}
                          </td>
                          <td className="px-4 py-3 text-rose-700 dark:text-rose-300 font-semibold align-top">
                            {item.riskEvent}
                          </td>
                          <td className="px-3.5 py-3 text-indigo-700 dark:text-indigo-300 font-medium align-top">
                            {item.riskResponse}
                          </td>
                          <td className="px-3.5 py-3 text-slate-700 dark:text-slate-300 align-top">
                            {item.responsiblePerson}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300 leading-relaxed align-top">
                            {item.measures}
                          </td>
                          <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300 align-top">
                            {item.kpi}
                          </td>
                          <td className="px-3 py-3 text-slate-700 dark:text-slate-300 align-top font-medium">
                            {item.timeline}
                          </td>
                          <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300 align-top">
                            {item.monitoringMethod}
                          </td>
                          {setRiskManagement && (
                            <td className="px-3 py-3 text-center align-top no-print">
                              {canManage ? (
                                <button
                                  type="button"
                                  onClick={() => setEditingBs3(item)}
                                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="แก้ไขแผน บส.3"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">ดูเท่านั้น</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signature Section */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-850/50 border-t border-slate-200 dark:border-slate-800 flex flex-col items-end text-xs space-y-1.5 text-slate-700 dark:text-slate-300 print:bg-transparent print:border-none print:text-black print:pt-6">
              <div className="w-72 text-center space-y-2 print:text-xs">
                <div>ลายมือชื่อ...................................................</div>
                {isSubDivision ? (
                  <>
                    <div>( .................................................... )</div>
                    <div>ตำแหน่ง ....................................................</div>
                  </>
                ) : (
                  <>
                    <div>( {orgProfile?.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ'} )</div>
                    <div>ตำแหน่ง {orgProfile?.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ'}</div>
                  </>
                )}
                <div>วันที่......................................................</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: แบบ บส. ๔
      ========================================================================= */}
      {activeTab === 'bs4' && (
        <div className="space-y-4 printable-document">
          {/* Official Document Header with Period Selectors */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-3 print:p-2 print:border-none print:shadow-none print:rounded-none">
            <div className="flex justify-between items-start text-xs font-bold text-slate-500 mb-1 print:mb-2 print:text-black">
              <span className="no-print">ลำดับที่ ๔ ของชุดแบบรายงาน</span>
              <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 print:text-black print:text-sm ml-auto">แบบ บส. ๔</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 print:text-black print:text-lg">
              ชื่อหน่วยงาน (๑) <span className="underline decoration-blue-500/50 print:decoration-black underline-offset-4">{orgProfile?.name || 'องค์การบริหารส่วนตำบลฝางคำ'}</span>
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black print:text-sm">
              <span>รายงานการติดตามผลการบริหารความเสี่ยง <span className="hidden print:inline">({bs4Period === '3month' ? 'รอบ ๓ เดือน' : bs4Period === '6month' ? 'รอบ ๖ เดือน' : 'รอบ ๑๒ เดือน'})</span></span>
              <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 no-print">
                <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="bs4_period"
                    value="3month"
                    checked={bs4Period === '3month'}
                    onChange={() => setBs4Period('3month')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>รอบ ๓ เดือน</span>
                </label>
                <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="bs4_period"
                    value="6month"
                    checked={bs4Period === '6month'}
                    onChange={() => setBs4Period('6month')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>รอบ ๖ เดือน</span>
                </label>
                <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="bs4_period"
                    value="12month"
                    checked={bs4Period === '12month'}
                    onChange={() => setBs4Period('12month')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>รอบ ๑๒ เดือน</span>
                </label>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 print:text-black print:text-xs">
              สำหรับปีงบประมาณ พ.ศ. (๒) <span className="font-mono font-bold text-slate-900 dark:text-slate-100 print:text-black">{selectedYear}</span>
            </p>
          </div>

          {/* Table BS 4 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden print:border-none print:shadow-none print:rounded-none">
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 border-collapse print:text-black">
                <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700/80 print:bg-slate-100 print:text-black">
                  <tr>
                    <th className="px-3 py-3.5 w-24 text-center">
                      (๓)<br />รหัสความเสี่ยง
                    </th>
                    <th className="px-4 py-3.5 min-w-[170px]">
                      (๔)<br />โครงการ/กิจกรรม/ภารกิจ
                    </th>
                    <th className="px-4 py-3.5 min-w-[200px]">
                      (๕)<br />วิธีการจัดการความเสี่ยง
                    </th>
                    <th className="px-3 py-3.5 w-32">
                      (๖)<br />ระยะเวลาดำเนินการ
                    </th>
                    <th className="px-3.5 py-3.5 w-36">
                      (๗)<br />ผู้รับผิดชอบ
                    </th>
                    <th className="px-4 py-3.5 min-w-[220px]">
                      (๘)<br />ผลลัพธ์การดำเนินการจัดการความเสี่ยง
                    </th>
                    <th className="px-3.5 py-3.5 min-w-[150px]">
                      (๙)<br />เอกสาร/หลักฐาน
                    </th>
                    <th className="px-2.5 py-3.5 text-center w-24">
                      (๑๐)<br />ร้อยละความคืบหน้า
                    </th>
                    <th className="px-4 py-3.5 min-w-[180px]">
                      (๑๑)<br />ปัญหาอุปสรรค และแนวทางแก้ไข
                    </th>
                    {setRiskManagement && <th className="px-3 py-3.5 text-center w-16 no-print">จัดการ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBs4.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-10 text-center text-slate-400">
                        ไม่พบข้อมูลในแบบ บส. ๔ สำหรับรอบ {bs4Period === '3month' ? '๓ เดือน' : bs4Period === '6month' ? '๖ เดือน' : '๑๒ เดือน'} {filterDept !== 'all' ? `ของ "${filterDept}"` : ''}
                      </td>
                    </tr>
                  ) : (
                    filteredBs4.map((item, idx) => {
                      const canManage = canEditItem(item.department);
                      return (
                        <tr key={item.id || idx} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-3 font-mono font-bold text-center text-blue-700 dark:text-blue-300 align-top">
                            {item.riskCode}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 align-top">
                            {item.activity}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300 leading-relaxed align-top">
                            {item.measures}
                          </td>
                          <td className="px-3 py-3 text-slate-700 dark:text-slate-300 align-top">
                            {item.timeline}
                          </td>
                          <td className="px-3.5 py-3 text-slate-700 dark:text-slate-300 align-top">
                            {item.responsiblePerson}
                          </td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200 leading-relaxed align-top">
                            {item.result}
                          </td>
                          <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300 align-top text-[11px]">
                            {item.evidence}
                          </td>
                          <td className="px-2.5 py-3 text-center align-top font-mono font-bold">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                              {item.progressPercent}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300 align-top">
                            {item.problemSolution || '-'}
                          </td>
                          {setRiskManagement && (
                            <td className="px-3 py-3 text-center align-top no-print">
                              {canManage ? (
                                <button
                                  type="button"
                                  onClick={() => setEditingBs4(item)}
                                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="แก้ไขรายงาน บส.4"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">ดูเท่านั้น</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signature Section */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-850/50 border-t border-slate-200 dark:border-slate-800 flex flex-col items-end text-xs space-y-1.5 text-slate-700 dark:text-slate-300 print:bg-transparent print:border-none print:text-black print:pt-6">
              <div className="w-72 text-center space-y-2 print:text-xs">
                <div>ลายมือชื่อ...................................................</div>
                {isSubDivision ? (
                  <>
                    <div>( .................................................... )</div>
                    <div>ตำแหน่ง ....................................................</div>
                  </>
                ) : (
                  <>
                    <div>( {orgProfile?.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ'} )</div>
                    <div>ตำแหน่ง {orgProfile?.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ'}</div>
                  </>
                )}
                <div>วันที่......................................................</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: แบบ บส. ๕
      ========================================================================= */}
      {activeTab === 'bs5' && (
        <div className="space-y-4 printable-document">
          {/* Official Document Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1.5 print:p-2 print:border-none print:shadow-none print:rounded-none">
            <div className="flex justify-between items-start text-xs font-bold text-slate-500 mb-1 print:mb-2 print:text-black">
              <span className="no-print">ลำดับที่ ๕ ของชุดแบบรายงาน</span>
              <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 print:text-black print:text-sm ml-auto">แบบ บส. ๕</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 print:text-black print:text-lg">
              ชื่อหน่วยงาน (๑) <span className="underline decoration-blue-500/50 print:decoration-black underline-offset-4">{orgProfile?.name || 'องค์การบริหารส่วนตำบลฝางคำ'}</span>
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 print:text-black print:text-sm">
              รายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 print:text-black print:text-xs">
              สำหรับปีงบประมาณ พ.ศ. (๒) <span className="font-mono font-bold text-slate-900 dark:text-slate-100 print:text-black">{selectedYear}</span>
            </p>
          </div>

          {/* Official Multi-Header Table BS 5 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden print:border-none print:shadow-none print:rounded-none">
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 border-collapse print:text-black">
                <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700/80 text-center print:bg-slate-100 print:text-black">
                  <tr>
                    <th rowSpan={2} className="px-3 py-2.5 w-24 border-r border-slate-200 dark:border-slate-700">
                      (๓)<br />รหัสความเสี่ยง
                    </th>
                    <th rowSpan={2} className="px-4 py-2.5 min-w-[160px] text-left border-r border-slate-200 dark:border-slate-700">
                      (๔)<br />โครงการ/กิจกรรม/ภารกิจ
                    </th>
                    <th rowSpan={2} className="px-4 py-2.5 min-w-[150px] text-left border-r border-slate-200 dark:border-slate-700">
                      (๕)<br />ความเสี่ยง
                    </th>
                    <th colSpan={3} className="px-2 py-2 border-r border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-950/20">
                      (๖) คะแนนระดับความเสี่ยงก่อนดำเนินการ
                    </th>
                    <th rowSpan={2} className="px-4 py-2.5 min-w-[180px] text-left border-r border-slate-200 dark:border-slate-700">
                      (๗)<br />วิธีการจัดการความเสี่ยง
                    </th>
                    <th rowSpan={2} className="px-4 py-2.5 min-w-[180px] text-left border-r border-slate-200 dark:border-slate-700">
                      (๘)<br />ผลดำเนินการจากการจัดการ
                    </th>
                    <th colSpan={3} className="px-2 py-2 border-r border-slate-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-950/20">
                      (๙) คะแนนระดับความเสี่ยงภายหลังดำเนินการ
                    </th>
                    <th rowSpan={2} className="px-2.5 py-2.5 w-24 border-r border-slate-200 dark:border-slate-700">
                      (๑๐)<br />การเปลี่ยนแปลง
                    </th>
                    <th rowSpan={2} className="px-3.5 py-2.5 min-w-[140px] text-left border-r border-slate-200 dark:border-slate-700">
                      (๑๑)<br />ความเสี่ยงคงเหลือ/เกิดใหม่
                    </th>
                    <th colSpan={2} className="px-2 py-2 border-r border-slate-200 dark:border-slate-700">
                      (๑๒) สรุปความเสี่ยง
                    </th>
                    <th rowSpan={2} className="px-4 py-2.5 min-w-[180px] text-left">
                      (๑๓)<br />มาตรการสำหรับปีถัดไป
                    </th>
                    {setRiskManagement && <th rowSpan={2} className="px-3 py-2.5 w-16 no-print">จัดการ</th>}
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-700 text-[10px]">
                    {/* (6) Pre-score subheaders */}
                    <th className="px-1.5 py-1.5 w-12 border-r border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-950/20">โอกาส (๑)</th>
                    <th className="px-1.5 py-1.5 w-12 border-r border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-950/20">ผลกระทบ (๒)</th>
                    <th className="px-1.5 py-1.5 w-14 border-r border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-950/20">คะแนน (๓)</th>
                    {/* (9) Post-score subheaders */}
                    <th className="px-1.5 py-1.5 w-12 border-r border-slate-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-950/20">โอกาส (๑)</th>
                    <th className="px-1.5 py-1.5 w-12 border-r border-slate-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-950/20">ผลกระทบ (๒)</th>
                    <th className="px-1.5 py-1.5 w-14 border-r border-slate-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-950/20">คะแนน (๓)</th>
                    {/* (12) Controllable subheaders */}
                    <th className="px-2 py-1.5 w-16 border-r border-slate-200 dark:border-slate-700">ควบคุมได้</th>
                    <th className="px-2 py-1.5 w-16 border-r border-slate-200 dark:border-slate-700">ควบคุมไม่ได้</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBs5Items.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="px-4 py-10 text-center text-slate-400">
                        ไม่พบข้อมูลในแบบ บส. ๕ {filterDept !== 'all' ? `ของ "${filterDept}"` : ''}
                      </td>
                    </tr>
                  ) : (
                    filteredBs5Items.map((item, idx) => {
                      const canManage = canEditItem(item.department);
                      const isControllable = (item.controllable || '').includes('ควบคุมได้') && !(item.controllable || '').includes('ไม่ได้');
                      return (
                        <tr key={item.id || idx} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-3 font-mono font-bold text-center text-blue-700 dark:text-blue-300 align-top border-r border-slate-100 dark:border-slate-800">
                            {item.riskCode}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 align-top border-r border-slate-100 dark:border-slate-800">
                            {item.activity}
                          </td>
                          <td className="px-4 py-3 text-rose-700 dark:text-rose-300 font-semibold align-top border-r border-slate-100 dark:border-slate-800">
                            {item.riskEvent}
                          </td>
                          {/* (6) Pre-score */}
                          <td className="px-1.5 py-3 text-center font-mono align-top border-r border-slate-100 dark:border-slate-800 bg-blue-50/20 dark:bg-blue-950/10">
                            {item.preLikelihood}
                          </td>
                          <td className="px-1.5 py-3 text-center font-mono align-top border-r border-slate-100 dark:border-slate-800 bg-blue-50/20 dark:bg-blue-950/10">
                            {item.preImpact}
                          </td>
                          <td className="px-1.5 py-3 text-center font-mono font-bold text-slate-900 dark:text-slate-100 align-top border-r border-slate-100 dark:border-slate-800 bg-blue-50/20 dark:bg-blue-950/10">
                            {item.preScore}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300 align-top border-r border-slate-100 dark:border-slate-800">
                            {item.measures}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300 align-top border-r border-slate-100 dark:border-slate-800">
                            {item.result}
                          </td>
                          {/* (9) Post-score */}
                          <td className="px-1.5 py-3 text-center font-mono align-top border-r border-slate-100 dark:border-slate-800 bg-emerald-50/20 dark:bg-emerald-950/10">
                            {item.postLikelihood}
                          </td>
                          <td className="px-1.5 py-3 text-center font-mono align-top border-r border-slate-100 dark:border-slate-800 bg-emerald-50/20 dark:bg-emerald-950/10">
                            {item.postImpact}
                          </td>
                          <td className="px-1.5 py-3 text-center font-mono font-bold text-emerald-700 dark:text-emerald-300 align-top border-r border-slate-100 dark:border-slate-800 bg-emerald-50/20 dark:bg-emerald-950/10">
                            {item.postScore}
                          </td>
                          {/* (10) Change */}
                          <td className="px-2.5 py-3 text-center align-top border-r border-slate-100 dark:border-slate-800">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.riskChange === 'ลดลง'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {item.riskChange || 'ลดลง'}
                            </span>
                          </td>
                          {/* (11) Residual */}
                          <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300 align-top border-r border-slate-100 dark:border-slate-800 text-[11px]">
                            {item.residualRisk || '-'}
                          </td>
                          {/* (12) Controllable */}
                          <td className="px-2 py-3 text-center align-top border-r border-slate-100 dark:border-slate-800 font-bold text-emerald-600">
                            {isControllable ? '✓' : ''}
                          </td>
                          <td className="px-2 py-3 text-center align-top border-r border-slate-100 dark:border-slate-800 font-bold text-rose-600">
                            {!isControllable ? '✓' : ''}
                          </td>
                          {/* (13) Next Year */}
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300 align-top text-[11px]">
                            {item.nextYearMeasures}
                          </td>
                          {setRiskManagement && (
                            <td className="px-3 py-3 text-center align-top no-print">
                              {canManage ? (
                                <button
                                  type="button"
                                  onClick={() => setEditingBs5(item)}
                                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="แก้ไขการทบทวน บส.5"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">ดูเท่านั้น</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Executive Summary Card */}
            <div className="p-6 bg-slate-50/70 dark:bg-slate-850/60 border-t border-slate-200 dark:border-slate-800 space-y-4 print:bg-slate-50 print:border print:border-black print:p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>สรุปภาพรวมผลการดำเนินการและการทบทวนแผนบริหารความเสี่ยง ประจำปี พ.ศ. {selectedYear}:</span>
                </div>
                {isAdmin && setRiskManagement && (
                  <button
                    type="button"
                    onClick={() => setEditingBs5Summary(true)}
                    className="no-print text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>แก้ไขข้อความสรุป & ลายมือชื่อ</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed indent-6">
                {bs5Data.summary}
              </p>
            </div>

            {/* Official Signature Section */}
            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col items-end text-xs space-y-1.5 text-slate-700 dark:text-slate-300 print:bg-transparent print:border-none print:text-black print:pt-6">
              <div className="w-72 text-center space-y-2 print:text-xs">
                <div>ลายมือชื่อ...................................................</div>
                {isSubDivision ? (
                  <>
                    <div>( .................................................... )</div>
                    <div>ตำแหน่ง ....................................................</div>
                  </>
                ) : (
                  <>
                    <div>( {bs5Data.approvedBy || orgProfile?.approverName || 'นายกองค์การบริหารส่วนตำบลฝางคำ'} )</div>
                    <div>ตำแหน่ง {bs5Data.approverPosition || orgProfile?.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ'}</div>
                  </>
                )}
                <div>วันที่รายงาน {bs5Data.reportDate || `......................................................`}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: ADD / EDIT
      ========================================================================= */}

      {/* Modal: Add BS.1 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>กำหนดขอบเขตและระบุความเสี่ยงใหม่ (แบบ บส. ๑)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBs1} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๓) รหัสความเสี่ยง:
                  </label>
                  <input
                    type="text"
                    required
                    value={formBs1.riskCode}
                    onChange={(e) => setFormBs1({ ...formBs1, riskCode: e.target.value })}
                    placeholder="เช่น RSK-01"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ส่วนราชการผู้รับผิดชอบ:
                  </label>
                  {isAdmin ? (
                    <select
                      value={formBs1.department}
                      onChange={(e) => setFormBs1({ ...formBs1, department: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    >
                      {departmentsList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-bold">
                      {userDept} (ระบบจำกัดเฉพาะกองท่าน)
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๔) ยุทธศาสตร์ที่รับผิดชอบ:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ยุทธศาสตร์การพัฒนาด้านการบริหารจัดการบ้านเมืองที่ดี"
                  value={formBs1.strategy}
                  onChange={(e) => setFormBs1({ ...formBs1, strategy: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๕) โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น โครงการพัฒนาระบบแผนที่ภาษีและทะเบียนทรัพย์สิน (LTAX 3000)"
                  value={formBs1.activity}
                  onChange={(e) => setFormBs1({ ...formBs1, activity: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๖) งบประมาณ (บาท):
                  </label>
                  <input
                    type="number"
                    placeholder="เช่น 150000"
                    value={formBs1.budget}
                    onChange={(e) => setFormBs1({ ...formBs1, budget: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๗) วัตถุประสงค์:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น เพื่อจัดเก็บภาษีได้ครบถ้วน ถูกต้องตามเป้าหมาย"
                    value={formBs1.objective}
                    onChange={(e) => setFormBs1({ ...formBs1, objective: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๘) ตัวชี้วัด:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ร้อยละของแปลงที่ดินที่สำรวจแล้วเสร็จ (100%)"
                    value={formBs1.kpi}
                    onChange={(e) => setFormBs1({ ...formBs1, kpi: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๙) เป้าหมายสูงสุด:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น จัดเก็บภาษีได้ครบถ้วน ไม่ตกหล่น"
                    value={formBs1.target}
                    onChange={(e) => setFormBs1({ ...formBs1, target: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                  ประเด็นความเสี่ยงสำหรับเชื่อมต่อไปยังแบบ บส. ๒:
                </span>
                <input
                  type="text"
                  placeholder="ระบุเหตุการณ์ความเสี่ยง เช่น การจัดเก็บภาษีที่ดินไม่เป็นไปตามเป้าหมาย"
                  value={formBs1.riskEvent}
                  onChange={(e) => setFormBs1({ ...formBs1, riskEvent: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกแบบ บส. ๑
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit BS.1 */}
      {editingBs1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขข้อมูลกำหนดขอบเขตความเสี่ยง (แบบ บส. ๑)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs1(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs1} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๓) รหัสความเสี่ยง:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBs1.riskCode || ''}
                    onChange={(e) => setEditingBs1({ ...editingBs1, riskCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ส่วนราชการผู้รับผิดชอบ:
                  </label>
                  {isAdmin ? (
                    <select
                      value={editingBs1.department}
                      onChange={(e) => setEditingBs1({ ...editingBs1, department: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    >
                      {departmentsList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-bold">
                      {editingBs1.department}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๔) ยุทธศาสตร์ที่รับผิดชอบ:
                </label>
                <input
                  type="text"
                  required
                  value={editingBs1.strategy || ''}
                  onChange={(e) => setEditingBs1({ ...editingBs1, strategy: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๕) โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ:
                </label>
                <input
                  type="text"
                  required
                  value={editingBs1.activity || ''}
                  onChange={(e) => setEditingBs1({ ...editingBs1, activity: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๖) งบประมาณ (บาท):
                  </label>
                  <input
                    type="number"
                    value={editingBs1.budget || ''}
                    onChange={(e) => setEditingBs1({ ...editingBs1, budget: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๗) วัตถุประสงค์:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBs1.objective || ''}
                    onChange={(e) => setEditingBs1({ ...editingBs1, objective: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๘) ตัวชี้วัด:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBs1.kpi || ''}
                    onChange={(e) => setEditingBs1({ ...editingBs1, kpi: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๙) เป้าหมายสูงสุด:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBs1.target || ''}
                    onChange={(e) => setEditingBs1({ ...editingBs1, target: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                  ประเด็นความเสี่ยงสำหรับเชื่อมต่อไปยังแบบ บส. ๒:
                </span>
                <input
                  type="text"
                  value={editingBs1.riskEvent || ''}
                  onChange={(e) => setEditingBs1({ ...editingBs1, riskEvent: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs1(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit BS.2 */}
      {editingBs2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>วิเคราะห์โอกาส ผลกระทบ และการตอบสนองความเสี่ยง (แบบ บส. ๒)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs2(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs2} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-blue-800 dark:text-blue-300">
                  <span>รหัส: {editingBs2.riskCode}</span>
                  <span>{editingBs2.department}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{editingBs2.activity}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๖) ผู้รับผิดชอบ (บุคคลหรือหน่วยงาน):
                </label>
                <input
                  type="text"
                  required
                  value={editingBs2.responsiblePerson || ''}
                  onChange={(e) => setEditingBs2({ ...editingBs2, responsiblePerson: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๗) เหตุการณ์ความเสี่ยง:
                </label>
                <input
                  type="text"
                  required
                  value={editingBs2.riskEvent || ''}
                  onChange={(e) => setEditingBs2({ ...editingBs2, riskEvent: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๘) ประเภทความเสี่ยง (๖ ประเภทตามหนังสือสั่งการ):
                </label>
                <select
                  value={editingBs2.riskCategory || RISK_CATEGORIES[2].label}
                  onChange={(e) => setEditingBs2({ ...editingBs2, riskCategory: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {RISK_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๙) คะแนนโอกาสเกิด (๑ - ๕):
                  </label>
                  <select
                    value={editingBs2.likelihood}
                    onChange={(e) => setEditingBs2({ ...editingBs2, likelihood: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    <option value={1}>1 - น้อยที่สุด</option>
                    <option value={2}>2 - น้อย</option>
                    <option value={3}>3 - ปานกลาง</option>
                    <option value={4}>4 - สูง</option>
                    <option value={5}>5 - สูงมาก</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๑๐) คะแนนผลกระทบ (๑ - ๕):
                  </label>
                  <select
                    value={editingBs2.impact}
                    onChange={(e) => setEditingBs2({ ...editingBs2, impact: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    <option value={1}>1 - น้อยที่สุด</option>
                    <option value={2}>2 - น้อย</option>
                    <option value={3}>3 - ปานกลาง</option>
                    <option value={4}>4 - สูง</option>
                    <option value={5}>5 - สูงมาก</option>
                  </select>
                </div>
              </div>

              {/* Calculated Matrix Level */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 font-medium">คะแนนรวม (๙) x (๑๐): </span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                    {Number(editingBs2.likelihood) * Number(editingBs2.impact)}
                  </span>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${getRiskLevelBadge(computeRiskLevel(Number(editingBs2.likelihood) * Number(editingBs2.impact)))}`}>
                    ระดับความเสี่ยง: {computeRiskLevel(Number(editingBs2.likelihood) * Number(editingBs2.impact))}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๑๒) วิธีการตอบสนองความเสี่ยง (๘ วิธีตามหนังสือสั่งการ):
                </label>
                <select
                  value={editingBs2.riskResponse || RISK_RESPONSES[1].label}
                  onChange={(e) => setEditingBs2({ ...editingBs2, riskResponse: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-indigo-700 dark:text-indigo-300"
                >
                  {RISK_RESPONSES.map((r) => (
                    <option key={r.id} value={r.label}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs2(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกแบบ บส. ๒
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit BS.3 */}
      {editingBs3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขรายงานการจัดทำแผนบริหารความเสี่ยง (แบบ บส. ๓)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs3(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs3} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-blue-700">
                  <span>รหัส: {editingBs3.riskCode}</span>
                  <span>{editingBs3.department}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{editingBs3.activity}</div>
                <div className="text-rose-600 font-medium">ความเสี่ยง: {editingBs3.riskEvent}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๖) วิธีการตอบสนองความเสี่ยง:
                </label>
                <select
                  value={editingBs3.riskResponse || RISK_RESPONSES[1].label}
                  onChange={(e) => setEditingBs3({ ...editingBs3, riskResponse: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {RISK_RESPONSES.map((r) => (
                    <option key={r.id} value={r.label}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๗) ผู้รับผิดชอบ:
                </label>
                <input
                  type="text"
                  required
                  value={editingBs3.responsiblePerson || ''}
                  onChange={(e) => setEditingBs3({ ...editingBs3, responsiblePerson: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๘) วิธีการจัดการความเสี่ยง (แนวทาง/ขั้นตอนการปฏิบัติงาน/มาตรการ):
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingBs3.measures || ''}
                  onChange={(e) => setEditingBs3({ ...editingBs3, measures: e.target.value })}
                  placeholder="ระบุแนวทาง ขั้นตอนปฏิบัติงานตามระเบียบ กฎหมาย หรือหนังสือสั่งการ เพื่อให้ความเสี่ยงลดลง"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๙) ตัวชี้วัด:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBs3.kpi || ''}
                    onChange={(e) => setEditingBs3({ ...editingBs3, kpi: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๑๐) ระยะเวลาดำเนินการ:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBs3.timeline || ''}
                    onChange={(e) => setEditingBs3({ ...editingBs3, timeline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๑๑) วิธีการติดตาม และการรายงาน:
                </label>
                <input
                  type="text"
                  required
                  value={editingBs3.monitoringMethod || ''}
                  onChange={(e) => setEditingBs3({ ...editingBs3, monitoringMethod: e.target.value })}
                  placeholder="เช่น การประชุมประจำเดือน, รายงานไตรมาส"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs3(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกแบบ บส. ๓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit BS.4 */}
      {editingBs4 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขรายงานการติดตามผลการบริหารความเสี่ยง (แบบ บส. ๔)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs4(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs4} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-blue-700">
                  <span>รหัส: {editingBs4.riskCode}</span>
                  <span>{editingBs4.department}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{editingBs4.activity}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    รอบการรายงาน:
                  </label>
                  <select
                    value={editingBs4.period || '6month'}
                    onChange={(e) => setEditingBs4({ ...editingBs4, period: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    <option value="3month">รอบ ๓ เดือน</option>
                    <option value="6month">รอบ ๖ เดือน</option>
                    <option value="12month">รอบ ๑๒ เดือน</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๑๐) ร้อยละความคืบหน้า (%):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editingBs4.progressPercent}
                    onChange={(e) => setEditingBs4({ ...editingBs4, progressPercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๘) ผลลัพธ์การดำเนินการจัดการความเสี่ยง:
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingBs4.result || ''}
                  onChange={(e) => setEditingBs4({ ...editingBs4, result: e.target.value })}
                  placeholder="ระบุว่าได้ดำเนินการหรือไม่อย่างไร ผลสัมฤทธิ์ที่เกิดขึ้นจริง"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๙) เอกสาร/หลักฐานอ้างอิง:
                </label>
                <input
                  type="text"
                  value={editingBs4.evidence || ''}
                  onChange={(e) => setEditingBs4({ ...editingBs4, evidence: e.target.value })}
                  placeholder="เช่น บันทึกข้อความ, รายงานการประชุม, ภาพถ่าย, ทะเบียนคุม"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๑๑) ปัญหาอุปสรรค และแนวทางแก้ไข:
                </label>
                <textarea
                  rows={2}
                  value={editingBs4.problemSolution || ''}
                  onChange={(e) => setEditingBs4({ ...editingBs4, problemSolution: e.target.value })}
                  placeholder="ระบุปัญหาอุปสรรคและแนวทางแก้ไข (ถ้ามี)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs4(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกแบบ บส. ๔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit BS.5 Row */}
      {editingBs5 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>ทบทวนผลการดำเนินการและระดับความเสี่ยง (แบบ บส. ๕)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs5(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBs5} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-blue-700">
                  <span>รหัส: {editingBs5.riskCode}</span>
                  <span>{editingBs5.department}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{editingBs5.activity}</div>
                <div className="text-rose-600">ความเสี่ยง: {editingBs5.riskEvent}</div>
              </div>

              {/* Pre vs Post Score Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2">
                  <span className="font-bold text-blue-800 dark:text-blue-300 block text-[11px]">
                    (๖) คะแนนก่อนดำเนินการ:
                  </span>
                  <div className="flex items-center space-x-2">
                    <label className="w-20">โอกาส:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editingBs5.preLikelihood}
                      onChange={(e) => setEditingBs5({ ...editingBs5, preLikelihood: Number(e.target.value) })}
                      className="p-1.5 rounded-lg border border-slate-300 w-16 text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="w-20">ผลกระทบ:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editingBs5.preImpact}
                      onChange={(e) => setEditingBs5({ ...editingBs5, preImpact: Number(e.target.value) })}
                      className="p-1.5 rounded-lg border border-slate-300 w-16 text-center font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-[11px]">
                    (๙) คะแนนภายหลังดำเนินการ:
                  </span>
                  <div className="flex items-center space-x-2">
                    <label className="w-20">โอกาส:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editingBs5.postLikelihood}
                      onChange={(e) => setEditingBs5({ ...editingBs5, postLikelihood: Number(e.target.value) })}
                      className="p-1.5 rounded-lg border border-slate-300 w-16 text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="w-20">ผลกระทบ:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editingBs5.postImpact}
                      onChange={(e) => setEditingBs5({ ...editingBs5, postImpact: Number(e.target.value) })}
                      className="p-1.5 rounded-lg border border-slate-300 w-16 text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๘) ผลดำเนินการจากการจัดการความเสี่ยง (สรุปเป็นภาพรวม):
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingBs5.result || ''}
                  onChange={(e) => setEditingBs5({ ...editingBs5, result: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๑๑) ความเสี่ยงคงเหลือหรือเกิดขึ้นใหม่:
                  </label>
                  <input
                    type="text"
                    value={editingBs5.residualRisk || ''}
                    onChange={(e) => setEditingBs5({ ...editingBs5, residualRisk: e.target.value })}
                    placeholder="ระบุความเสี่ยงคงเหลือ"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    (๑๒) สรุปความเสี่ยง:
                  </label>
                  <select
                    value={editingBs5.controllable || 'ควบคุมได้'}
                    onChange={(e) => setEditingBs5({ ...editingBs5, controllable: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    <option value="ควบคุมได้">ควบคุมได้ (อยู่ในระดับที่ยอมรับได้)</option>
                    <option value="ควบคุมไม่ได้">ควบคุมไม่ได้</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๑๓) แนวทาง/มาตรการจัดการความเสี่ยงสำหรับปีถัดไป:
                </label>
                <textarea
                  rows={2}
                  value={editingBs5.nextYearMeasures || ''}
                  onChange={(e) => setEditingBs5({ ...editingBs5, nextYearMeasures: e.target.value })}
                  placeholder="ระบุแนวทางหรือมาตรการสำหรับปีถัดไปเพื่อควบคุมความเสี่ยง"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs5(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกแบบ บส. ๕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit BS.5 Summary & Signatures (Admin only) */}
      {editingBs5Summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขข้อความสรุปภาพรวม & ผู้ลงนาม (แบบ บส. ๕)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBs5Summary(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBs5Summary} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ข้อความสรุปภาพรวมผลการดำเนินงานระดับองค์กร:
                </label>
                <textarea
                  name="summary"
                  rows={4}
                  required
                  defaultValue={bs5Data.summary}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๑๔) ลายมือชื่อผู้บริหารท้องถิ่น:
                </label>
                <input
                  type="text"
                  name="approvedBy"
                  required
                  defaultValue={bs5Data.approvedBy}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๑๕) ตำแหน่งผู้บริหารท้องถิ่น:
                </label>
                <input
                  type="text"
                  name="approverPosition"
                  required
                  defaultValue={bs5Data.approverPosition}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  (๑๖) วันเดือนปีที่รายงาน:
                </label>
                <input
                  type="text"
                  name="reportDate"
                  required
                  defaultValue={bs5Data.reportDate}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBs5Summary(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกข้อมูลสรุป
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
