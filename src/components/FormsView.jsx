import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Eye,
  Maximize2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck2,
  Table,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  Send
} from 'lucide-react';

// รายการหัวข้อทั้งหมดจากเอกสารทางราชการ มท 0805.2/ว 3482 ลงวันที่ 18 สิงหาคม 2566
export const officialW3482Topics = [
  {
    id: 'w3482-notice',
    code: 'หนังสือสั่งการ',
    badgeText: 'มท 0805.2/ว 3482',
    title: 'หนังสือกระทรวงมหาดไทย ด่วนที่สุด ที่ มท 0805.2/ว 3482',
    subtitle: 'ซักซ้อมแนวทางในการจัดทำรายงานการบริหารจัดการความเสี่ยงขององค์กรปกครองส่วนท้องถิ่น',
    date: '18 สิงหาคม 2566',
    pageRangeText: 'หน้า 1 จาก 12 หน้า',
    startPage: 1,
    endPage: 1,
    badgeColor: 'blue',
    summary: 'กรมส่งเสริมการปกครองท้องถิ่นกำหนดแบบรายงานการบริหารจัดการความเสี่ยง 5 แบบ เพื่อให้ อปท. ใช้เป็นแนวทางปฏิบัติ และเสนอให้ผู้บริหารท้องถิ่นพิจารณาอย่างน้อยปีละ 1 ครั้ง ตามมาตรฐานและหลักเกณฑ์กระทรวงการคลัง',
    highlights: [
      'อ้างถึงหลักเกณฑ์กระทรวงการคลังว่าด้วยมาตรฐานและหลักเกณฑ์ปฏิบัติการบริหารจัดการความเสี่ยงสำหรับหน่วยงานของรัฐ พ.ศ. 2562',
      'กำหนดสิ่งที่ส่งมาด้วยเป็น แบบรายงานการบริหารจัดการความเสี่ยง จำนวน 5 แบบ (บส. 1 - บส. 5)',
      'เสนอผู้บริหารท้องถิ่นพิจารณาอย่างน้อยปีละ 1 ครั้ง'
    ],
    officialDetails: {
      issuer: 'กรมส่งเสริมการปกครองท้องถิ่น ถนนนครราชสีมา เขตดุสิต กทม. 10300',
      receiver: 'ผู้ว่าราชการจังหวัด ทุกจังหวัด (เพื่อแจ้ง อปท. ในพื้นที่)',
      contact: 'กองตรวจสอบระบบการเงินบัญชีท้องถิ่น กลุ่มงานพัฒนาระบบการตรวจสอบ โทร. 0-2241-9026'
    }
  },
  {
    id: 'bs1',
    code: 'แบบ บส. 1',
    badgeText: 'แบบ บส. ๑',
    title: 'แบบกำหนดขอบเขตความรับผิดชอบตามประเด็นยุทธศาสตร์/ข้อบัญญัติ/เทศบัญญัติ/อื่น ๆ (ถ้ามี)',
    subtitle: 'การกำหนดขอบเขตภารกิจและเชื่อมโยงโครงการสำคัญกับยุทธศาสตร์ของ อปท. ประจำปีงบประมาณ',
    pageRangeText: 'หน้า 2 - 3 จาก 12 หน้า',
    startPage: 2,
    endPage: 3,
    badgeColor: 'indigo',
    onlineFormTab: 'risk-management',
    summary: 'ใช้สำหรับระบุโครงการ/กิจกรรม/ภารกิจสำคัญของ อปท. ที่สอดคล้องกับยุทธศาสตร์ พร้อมระบุงบประมาณ วัตถุประสงค์ ตัวชี้วัด และเป้าหมาย',
    columns: [
      { col: '(1)', title: 'ชื่อหน่วยงาน', detail: 'ชื่อ อปท. หรือส่วนราชการที่รับผิดชอบ' },
      { col: '(2)', title: 'ประจำปีงบประมาณ พ.ศ.', detail: 'ปีงบประมาณในการบริหารจัดการความเสี่ยง' },
      { col: '(3)', title: 'รหัสความเสี่ยง', detail: 'รหัสความเสี่ยงตามลำดับจำนวนความเสี่ยงโครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ (เช่น RS-01, RS-02)' },
      { col: '(4)', title: 'ยุทธศาสตร์ที่รับผิดชอบ', detail: 'ระบุโครงการ/กิจกรรม/ภารกิจ อปท. ที่จัดทำขึ้นเพื่อตอบสนองยุทธศาสตร์ใดหรือภารกิจใดของ อปท.' },
      { col: '(5)', title: 'โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ', detail: 'โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญต่อการบรรลุวัตถุประสงค์ตามยุทธศาสตร์ หรือที่มีความเสี่ยงสูง ตามนโยบายของผู้บริหารท้องถิ่น' },
      { col: '(6)', title: 'งบประมาณ (บาท)', detail: 'จำนวนเงินงบประมาณโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (5) (ถ้ามี)' },
      { col: '(7)', title: 'วัตถุประสงค์', detail: 'วัตถุประสงค์ตามโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (5)' },
      { col: '(8)', title: 'ตัวชี้วัด', detail: 'ตัวชี้วัดของโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (5)' },
      { col: '(9)', title: 'เป้าหมาย', detail: 'เป้าหมายที่ต้องการสูงสุดของโครงการ/กิจกรรม/ภารกิจ อปท.' },
      { col: '(10)-(12)', title: 'ส่วนลงนามกำกับ', detail: 'ลายมือชื่อผู้บริหารท้องถิ่น, ตำแหน่งผู้บริหารท้องถิ่น และวันเดือนปีที่ลงนาม' }
    ],
    explanations: [
      { no: '(1)', text: 'ชื่อ อปท. (เช่น องค์การบริหารส่วนตำบลฝางคำ)' },
      { no: '(2)', text: 'ปีงบประมาณในการบริหารจัดการความเสี่ยง' },
      { no: '(3)', text: 'รหัสความเสี่ยงตามลำดับจำนวนความเสี่ยงโครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ' },
      { no: '(4)', text: 'ยุทธศาสตร์ที่รับผิดชอบ โดยระบุโครงการ/กิจกรรม/ภารกิจ อปท. ที่จัดทำขึ้นเพื่อตอบสนองยุทธศาสตร์ใดหรือภารกิจใดของ อปท.' },
      { no: '(5)', text: 'โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญต่อการบรรลุวัตถุประสงค์ตามยุทธศาสตร์/ภารกิจ อปท. (โดยระบุโครงการ/กิจกรรม/ภารกิจ อปท. ทั้งหมด หรือโครงการที่มีความเสี่ยง หรือที่มีความเสี่ยงสูง ตามนโยบายของผู้บริหารท้องถิ่น)' },
      { no: '(6)', text: 'จำนวนเงินงบประมาณโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (5) (ถ้ามี)' },
      { no: '(7)', text: 'วัตถุประสงค์ตามโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (5)' },
      { no: '(8)', text: 'ตัวชี้วัดของโครงการ/กิจกรรม/ภารกิจ อปท. ตาม (5)' },
      { no: '(9)', text: 'เป้าหมายที่ต้องการสูงสุดของโครงการ/กิจกรรม/ภารกิจ อปท.' },
      { no: '(10)', text: 'ลายมือชื่อผู้บริหารท้องถิ่น' },
      { no: '(11)', text: 'ตำแหน่งผู้บริหารท้องถิ่น' },
      { no: '(12)', text: 'วันเดือนปีที่ลงนาม' }
    ]
  },
  {
    id: 'bs2',
    code: 'แบบ บส. 2',
    badgeText: 'แบบ บส. ๒',
    title: 'การวิเคราะห์โอกาส ผลกระทบ และการตอบสนองความเสี่ยง',
    subtitle: 'การประเมินคะแนนโอกาสและผลกระทบ (Likelihood x Impact) จำแนก 6 ประเภทความเสี่ยง และเลือก 8 วิธีการตอบสนอง',
    pageRangeText: 'หน้า 4 - 6 จาก 12 หน้า',
    startPage: 4,
    endPage: 6,
    badgeColor: 'amber',
    onlineFormTab: 'risk-management',
    summary: 'ใช้สำหรับประเมินโอกาสและผลกระทบของความเสี่ยง คำนวณคะแนนระดับความเสี่ยง (โอกาส x ผลกระทบ) และกำหนดวิธีการตอบสนองความเสี่ยงตามมาตรฐานราชการ',
    columns: [
      { col: '(1)', title: 'ชื่อหน่วยงาน', detail: 'ชื่อ อปท. หรือสำนัก/กองที่รับผิดชอบ' },
      { col: '(2)', title: 'ประจำปีงบประมาณ พ.ศ.', detail: 'ปีงบประมาณที่ทำการประเมิน' },
      { col: '(3)', title: 'รหัสความเสี่ยง', detail: 'รหัสความเสี่ยงตามลำดับ นำข้อมูลมาจาก แบบ บส. 1 (3)' },
      { col: '(4)', title: 'โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ', detail: 'นำข้อมูลมาจาก แบบ บส. 1 (5)' },
      { col: '(5)', title: 'วัตถุประสงค์', detail: 'นำข้อมูลมาจาก แบบ บส. 1 (7)' },
      { col: '(6)', title: 'ผู้รับผิดชอบ', detail: 'บุคคลหรือหน่วยงาน หรือบุคคลและหน่วยงาน' },
      { col: '(7)', title: 'ความเสี่ยง', detail: 'ความเสี่ยงที่มีผลกระทบต่อการบรรลุวัตถุประสงค์' },
      { col: '(8)', title: 'ประเภทความเสี่ยง', detail: 'จำแนก 6 ด้าน (กลยุทธ์, การเงิน, ดำเนินงาน, กฎระเบียบ, ไอที, ภาพลักษณ์)' },
      { col: '(9)', title: 'คะแนนโอกาส', detail: 'คะแนนความถี่/ความเป็นไปได้ (1 - 5)' },
      { col: '(10)', title: 'คะแนนผลกระทบ', detail: 'คะแนนความรุนแรงของผลกระทบ (1 - 5)' },
      { col: '(11)', title: 'คะแนนระดับความเสี่ยง', detail: 'คำนวณจาก (9) x (10) เพื่อจัดระดับ สูงมาก สูง ปานกลาง ต่ำ' },
      { col: '(12)', title: 'วิธีการตอบสนองความเสี่ยง', detail: 'เลือก 1 ใน 8 วิธีตามมาตรฐานกระทรวงการคลัง' },
      { col: '(13)-(15)', title: 'ส่วนลงนามกำกับ', detail: 'ลายมือชื่อ, ตำแหน่งผู้บริหารท้องถิ่น และวันเดือนปีที่ลงนาม' }
    ],
    riskTypes: [
      { id: 1, name: 'ความเสี่ยงด้านกลยุทธ์ (Strategy Risks)', desc: 'เกิดจากการกำหนดแผนกลยุทธ์ที่ไม่เหมาะสม หรือเกิดจากการนำกลยุทธ์ไปใช้ไม่ถูกต้อง' },
      { id: 2, name: 'ความเสี่ยงด้านการเงิน (Financial Risks)', desc: 'เกี่ยวกับการเบิกจ่ายเงินไม่ถูกต้อง การรับเงินไม่ถูกต้อง ไม่ปฏิบัติตามกฎหมายการเงินการคลัง รวมถึงการทุจริต' },
      { id: 3, name: 'ความเสี่ยงด้านการดำเนินงาน (Operation Risks)', desc: 'เกิดจากกระบวนการทำงานที่ไม่มีประสิทธิผลหรือไม่มีประสิทธิภาพ' },
      { id: 4, name: 'ความเสี่ยงด้านการปฏิบัติตามกฎระเบียบ (Legal Risks)', desc: 'หน่วยงานไม่ปฏิบัติตามกฎหมาย ระเบียบ ข้อบังคับ หลักเกณฑ์ มติ ครม. หรือคู่มือปฏิบัติงาน' },
      { id: 5, name: 'ความเสี่ยงด้านเทคโนโลยีสารสนเทศ (Technology Risks)', desc: 'เกิดจากเทคโนโลยีสารสนเทศ ระบบสารสนเทศล่ม ความปลอดภัยข้อมูล' },
      { id: 6, name: 'ความเสี่ยงด้านความน่าเชื่อถือขององค์กร (Reputational Risks)', desc: 'ส่งผลกระทบต่อชื่อเสียง ความเชื่อมั่น และความน่าเชื่อถือขององค์กรต่อประชาชน' }
    ],
    responseMethods: [
      { id: 1, name: 'ปฏิเสธความเสี่ยง (Risk Avoidance)', desc: 'ไม่ดำเนินงานในกิจกรรมที่มีความเสี่ยงสูงที่หน่วยงานยอมรับไม่ได้' },
      { id: 2, name: 'การลดโอกาสของความเสี่ยง (Likelihood Reduction)', desc: 'กำหนดมาตรการควบคุมเพื่อลดโอกาสเกิด เช่น ลดโอกาสการทุจริต' },
      { id: 3, name: 'การลดผลกระทบของความเสี่ยง (Impact Reduction)', desc: 'การทำประกัน หรือการใช้เครื่องมือป้องกันความเสียหาย' },
      { id: 4, name: 'การโอนความเสี่ยง (Risk Sharing/Transfer)', desc: 'ถ่ายโอนความเสี่ยงที่ไม่สามารถทำเองได้ เช่น ให้ภาคเอกชนดำเนินการ' },
      { id: 5, name: 'ยอมรับความเสี่ยง (Risk Acceptance)', desc: 'ไม่ดำเนินการจัดการ เนื่องจากความเสี่ยงอยู่ในระดับที่ยอมรับได้' },
      { id: 6, name: 'ใช้มาตรการการเฝ้าระวัง (Monitoring/Warning)', desc: 'เก็บรวบรวมข้อมูล วิเคราะห์ แจ้งเตือนเมื่อเกิดสัญญาณเตือน' },
      { id: 7, name: 'การทำแผนฉุกเฉิน (Contingency Plan)', desc: 'ระบุขั้นตอนเมื่อเกิดเหตุฉุกเฉิน พร้อมระบุผู้รับผิดชอบชัดเจน' },
      { id: 8, name: 'การส่งเสริมหรือผลักดันเหตุการณ์เชิงบวก (Exploit/Enhance)', desc: 'ส่งเสริมเมื่อเหตุการณ์ที่อาจเกิดขึ้นส่งผลกระทบเชิงบวกต่อองค์กร' }
    ]
  },
  {
    id: 'bs3',
    code: 'แบบ บส. 3',
    badgeText: 'แบบ บส. ๓',
    title: 'รายงานการจัดทำแผนบริหารความเสี่ยง',
    subtitle: 'แผนปฏิบัติการจัดการความเสี่ยง ระบุกระบวนการ ผู้รับผิดชอบ ตัวชี้วัด และกรอบเวลา',
    pageRangeText: 'หน้า 7 - 8 จาก 12 หน้า',
    startPage: 7,
    endPage: 8,
    badgeColor: 'emerald',
    onlineFormTab: 'risk-management',
    summary: 'ใช้สำหรับจัดทำแผนบริหารความเสี่ยงอย่างเป็นรูปธรรม ระบุแนวทางดำเนินงานตามกฎหมายระเบียบ เพื่อให้ความเสี่ยงลดลงอยู่ในระดับที่ยอมรับได้',
    columns: [
      { col: '(1)', title: 'ชื่อหน่วยงาน', detail: 'ชื่อ อปท. หรือสำนัก/กองที่รับผิดชอบ' },
      { col: '(2)', title: 'ประจำปีงบประมาณ พ.ศ.', detail: 'ปีงบประมาณในการบริหารจัดการความเสี่ยง' },
      { col: '(3)', title: 'รหัสความเสี่ยง', detail: 'นำข้อมูลมาจาก แบบ บส. 2 (3)' },
      { col: '(4)', title: 'โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ', detail: 'นำข้อมูลมาจาก แบบ บส. 2 (4)' },
      { col: '(5)', title: 'ความเสี่ยง', detail: 'นำข้อมูลมาจาก แบบ บส. 2 (7)' },
      { col: '(6)', title: 'วิธีการตอบสนองความเสี่ยง', detail: 'นำข้อมูลมาจาก แบบ บส. 2 (12)' },
      { col: '(7)', title: 'ผู้รับผิดชอบ', detail: 'นำข้อมูลมาจาก แบบ บส. 2 (6)' },
      { col: '(8)', title: 'วิธีการจัดการความเสี่ยง', detail: 'ระบุแนวทางการดำเนินงาน/ขั้นตอนการปฏิบัติงาน ตามกฎหมาย ระเบียบ ข้อบังคับ เพื่อให้ความเสี่ยงลดลง' },
      { col: '(9)', title: 'ตัวชี้วัด', detail: 'นำข้อมูลมาจาก แบบ บส. 1 (8)' },
      { col: '(10)', title: 'ระยะเวลาดำเนินการ', detail: 'ระบุช่วงระยะเวลาในการดำเนินการจัดการความเสี่ยง' },
      { col: '(11)', title: 'วิธีการติดตามและการรายงาน', detail: 'วิธีการติดตามและรายงานให้ผู้บริหารทราบ เช่น การประชุมประจำเดือน' },
      { col: '(12)-(14)', title: 'ส่วนลงนามกำกับ', detail: 'ลายมือชื่อ, ตำแหน่งผู้บริหารท้องถิ่น และวันเดือนปีที่ลงนาม' }
    ],
    explanations: [
      { no: '(1)', text: 'ชื่อ อปท.' },
      { no: '(2)', text: 'ปีงบประมาณในการบริหารจัดการความเสี่ยง' },
      { no: '(3)', text: 'รหัสความเสี่ยงตามลำดับ นำข้อมูลมาจาก แบบ บส. 2 (3)' },
      { no: '(4)', text: 'โครงการ/กิจกรรม/ภารกิจ อปท. ที่มีความเสี่ยง นำมาจาก แบบ บส. 2 (4)' },
      { no: '(5)', text: 'ความเสี่ยงที่มีผลกระทบ นำมาจาก แบบ บส. 2 (7)' },
      { no: '(6)', text: 'วิธีการตอบสนองความเสี่ยง นำมาจาก แบบ บส. 2 (12)' },
      { no: '(7)', text: 'ผู้รับผิดชอบ นำมาจาก แบบ บส. 2 (6)' },
      { no: '(8)', text: 'วิธีการจัดการความเสี่ยง โดยระบุขั้นตอนปฏิบัติงานตามระเบียบข้อบังคับ' },
      { no: '(9)', text: 'ตัวชี้วัดของโครงการ/กิจกรรม นำมาจาก แบบ บส. 1 (8)' },
      { no: '(10)', text: 'ระยะเวลาดำเนินการโดยระบุช่วงเวลา' },
      { no: '(11)', text: 'วิธีการติดตามและรายงานให้ผู้บริหารทราบ' },
      { no: '(12)-(14)', text: 'ลายมือชื่อ ตำแหน่งผู้บริหารท้องถิ่น และวันเดือนปีที่ลงนาม' }
    ]
  },
  {
    id: 'bs4',
    code: 'แบบ บส. 4',
    badgeText: 'แบบ บส. ๔',
    title: 'รายงานการติดตามผลการบริหารความเสี่ยง',
    subtitle: 'การติดตามความคืบหน้าตามรอบระยะเวลา (รอบ 3 เดือน / รอบ 6 เดือน / รอบ 12 เดือน)',
    pageRangeText: 'หน้า 9 - 10 จาก 12 หน้า',
    startPage: 9,
    endPage: 10,
    badgeColor: 'purple',
    onlineFormTab: 'risk-management',
    summary: 'ใช้สำหรับติดตามและรายงานผลการดำเนินงานตามแผนจัดการความเสี่ยงตามรอบระยะเวลาที่กำหนด พร้อมเอกสารหลักฐาน ร้อยละความคืบหน้า และปัญหาอุปสรรค',
    columns: [
      { col: '(1)', title: 'ชื่อหน่วยงาน', detail: 'ชื่อ อปท. หรือสำนัก/กองที่รับผิดชอบ' },
      { col: '(2)', title: 'สำหรับปีงบประมาณ พ.ศ.', detail: 'ปีงบประมาณ และเลือกช่อง [ ] รอบ 3 เดือน [ ] รอบ 6 เดือน [ ] รอบ 12 เดือน' },
      { col: '(3)', title: 'รหัสความเสี่ยง', detail: 'นำข้อมูลมาจาก แบบ บส. 3 (3)' },
      { col: '(4)', title: 'โครงการ/กิจกรรม/ภารกิจ อปท. ที่สำคัญ', detail: 'นำข้อมูลมาจาก แบบ บส. 3 (4)' },
      { col: '(5)', title: 'วิธีการจัดการความเสี่ยง', detail: 'นำข้อมูลมาจาก แบบ บส. 3 (8)' },
      { col: '(6)', title: 'ระยะเวลาดำเนินการ', detail: 'นำข้อมูลมาจาก แบบ บส. 3 (10)' },
      { col: '(7)', title: 'ผู้รับผิดชอบ', detail: 'นำข้อมูลมาจาก แบบ บส. 3 (7)' },
      { col: '(8)', title: 'ผลลัพธ์การดำเนินการจัดการความเสี่ยง', detail: 'ระบุผลการดำเนินงาน ได้ดำเนินการหรือไม่ อย่างไร (ระบุแต่ละขั้นตอนหรือภาพรวม)' },
      { col: '(9)', title: 'เอกสาร/หลักฐาน', detail: 'เอกสารหลักฐานอ้างอิงประกอบผลการดำเนินการ' },
      { col: '(10)', title: 'ร้อยละความคืบหน้า', detail: 'ระบุเป็นเปอร์เซ็นต์ความก้าวหน้า เช่น 80% หรือ 100%' },
      { col: '(11)', title: 'ปัญหาอุปสรรคและแนวทางแก้ไขปัญหา', detail: 'ระบุปัญหาที่พบและแนวทางแก้ไข (ถ้ามี)' },
      { col: '(12)-(14)', title: 'ส่วนลงนามกำกับ', detail: 'ลายมือชื่อ, ตำแหน่งผู้บริหารท้องถิ่น และวันเดือนปีที่ลงนาม' }
    ],
    explanations: [
      { no: '(1)', text: 'ชื่อ อปท.' },
      { no: '(2)', text: 'ปีงบประมาณ และระบุรอบระยะเวลา (รอบ 3 เดือน / 6 เดือน / 12 เดือน)' },
      { no: '(3)', text: 'รหัสความเสี่ยง นำมาจาก แบบ บส. 3 (3)' },
      { no: '(4)', text: 'โครงการ/กิจกรรม นำมาจาก แบบ บส. 3 (4)' },
      { no: '(5)', text: 'วิธีการจัดการความเสี่ยง นำมาจาก แบบ บส. 3 (8)' },
      { no: '(6)', text: 'ระยะเวลาดำเนินการ นำมาจาก แบบ บส. 3 (10)' },
      { no: '(7)', text: 'ผู้รับผิดชอบ นำมาจาก แบบ บส. 3 (7)' },
      { no: '(8)', text: 'ผลลัพธ์การดำเนินการจัดการความเสี่ยง' },
      { no: '(9)', text: 'เอกสาร/หลักฐานอ้างอิงประกอบ' },
      { no: '(10)', text: 'ร้อยละความคืบหน้าของการดำเนินการ' },
      { no: '(11)', text: 'ปัญหา อุปสรรค และแนวทางแก้ไขปัญหา (ถ้ามี)' },
      { no: '(12)-(14)', text: 'ลายมือชื่อ ตำแหน่งผู้บริหารท้องถิ่น และวันเดือนปีที่ลงนาม' }
    ]
  },
  {
    id: 'bs5',
    code: 'แบบ บส. 5',
    badgeText: 'แบบ บส. ๕',
    title: 'รายงานผลการดำเนินการและทบทวนแผนการบริหารความเสี่ยง',
    subtitle: 'เปรียบเทียบระดับความเสี่ยงก่อนและหลัง สรุปผลความเสี่ยงคงเหลือ และกำหนดแนวทางสำหรับปีถัดไป',
    pageRangeText: 'หน้า 11 - 12 จาก 12 หน้า',
    startPage: 11,
    endPage: 12,
    badgeColor: 'rose',
    onlineFormTab: 'risk-management',
    summary: 'ใช้สำหรับสรุปผลการประเมินความเสี่ยงประจำปี เปรียบเทียบคะแนนก่อน-หลัง ประเมินความเสี่ยงคงเหลือ สรุปว่าควบคุมได้หรือไม่ และวางแผนสำหรับปีถัดไป',
    columns: [
      { col: '(1)-(2)', title: 'ชื่อหน่วยงาน & ปีงบประมาณ', detail: 'ชื่อ อปท. และประจำปีงบประมาณ พ.ศ. ...' },
      { col: '(3)-(5)', title: 'ข้อมูลความเสี่ยงเดิม', detail: 'รหัสความเสี่ยง, โครงการ/กิจกรรม, ความเสี่ยง' },
      { col: '(6)', title: 'คะแนนระดับความเสี่ยงก่อนดำเนินการ', detail: 'โอกาส (1) x ผลกระทบ (2) = คะแนนระดับความเสี่ยง (3) [นำมาจาก บส.2]' },
      { col: '(7)-(8)', title: 'วิธีการจัดการ & ผลดำเนินการ', detail: 'วิธีการจัดการความเสี่ยง และผลลัพธ์จากการจัดการ' },
      { col: '(9)', title: 'คะแนนระดับความเสี่ยงภายหลังดำเนินการ', detail: 'ประเมินซ้ำ: โอกาส (1) x ผลกระทบ (2) = คะแนนระดับความเสี่ยง (3)' },
      { col: '(10)', title: 'การเปลี่ยนแปลงระดับความเสี่ยง', detail: 'ระบุว่า "ลดลง" หรือ "ไม่ลดลง"' },
      { col: '(11)', title: 'ความเสี่ยงคงเหลือ / เกิดขึ้นใหม่', detail: 'ระบุความเสี่ยงที่ยังหลงเหลืออยู่ หรือความเสี่ยงใหม่ที่ตรวจพบ' },
      { col: '(12)', title: 'สรุปความเสี่ยง', detail: 'เลือกประเมิน: [ควบคุมได้] หรือ [ควบคุมไม่ได้]' },
      { col: '(13)', title: 'แนวทาง/มาตรการจัดการสำหรับปีถัดไป', detail: 'ระบุวิธีการดำเนินการสำหรับปีงบประมาณถัดไป' },
      { col: '(14)-(16)', title: 'ส่วนลงนามกำกับ', detail: 'ลายมือชื่อ, ตำแหน่งผู้บริหารท้องถิ่น และวันเดือนปีที่รายงาน' }
    ],
    explanations: [
      { no: '(1)', text: 'ชื่อ อปท.' },
      { no: '(2)', text: 'ปีงบประมาณในการบริหารจัดการความเสี่ยง' },
      { no: '(3)', text: 'รหัสความเสี่ยง นำมาจาก แบบ บส. 4 (3)' },
      { no: '(4)', text: 'โครงการ/ภารกิจ นำมาจาก แบบ บส. 4 (4)' },
      { no: '(5)', text: 'ความเสี่ยงที่มีผลกระทบ นำมาจาก แบบ บส. 3 (5)' },
      { no: '(6)', text: 'คะแนนระดับความเสี่ยงก่อนดำเนินการ (โอกาส x ผลกระทบ) นำมาจาก แบบ บส. 2' },
      { no: '(7)', text: 'วิธีการจัดการความเสี่ยง นำมาจาก แบบ บส. 4 (5)' },
      { no: '(8)', text: 'ผลการดำเนินการจัดการความเสี่ยง (สรุปเป็นภาพรวม)' },
      { no: '(9)', text: 'คะแนนระดับความเสี่ยงภายหลังการดำเนินการ (ประเมินโอกาส x ผลกระทบใหม่)' },
      { no: '(10)', text: 'การเปลี่ยนแปลงระดับความเสี่ยง (เปรียบเทียบก่อนและหลังว่าลดลงหรือไม่)' },
      { no: '(11)', text: 'ความเสี่ยงคงเหลือหรือเกิดขึ้นใหม่ภายหลังจากดำเนินการ' },
      { no: '(12)', text: 'สรุปความเสี่ยงที่ควบคุมได้/ควบคุมไม่ได้ หรือยอมรับได้/ไม่ได้' },
      { no: '(13)', text: 'แนวทาง/มาตรการจัดการความเสี่ยงสำหรับปีถัดไป' },
      { no: '(14)-(16)', text: 'ลายมือชื่อ ตำแหน่งผู้บริหารท้องถิ่น และวันเดือนปีที่รายงาน' }
    ]
  },
  {
    id: 'full-doc',
    code: 'ฉบับเต็ม',
    badgeText: 'ฉบับเต็ม 12 หน้า',
    title: 'เอกสารต้นฉบับทางราชการ ว 3482 (แบบ บส. 1 - บส. 5 ครบชุด)',
    subtitle: 'หนังสือกระทรวงมหาดไทย ที่ มท 0805.2/ว 3482 ลว. 18 ส.ค. 2566 และแบบรายงานทั้ง 5 แบบ',
    pageRangeText: 'ครบทั้ง 12 หน้าต่อเนื่อง',
    startPage: 1,
    endPage: 12,
    badgeColor: 'slate',
    summary: 'เปิดดูเอกสารทางการตัวจริงฉบับสมบูรณ์ ตั้งแต่หน้า 1 ถึงหน้า 12 ครบทั้งหนังสือสั่งการ ตารางแบบรายงาน บส. 1 - บส. 5 และคำอธิบายทุกข้อ',
    highlights: [
      'หนังสือสั่งการ กรมส่งเสริมการปกครองท้องถิ่น (หน้า 1)',
      'ตารางแบบรายงาน บส. 1 ถึง บส. 5 (หน้า 2, 4, 7, 9, 11)',
      'คำอธิบายและแนวทางการกรอกแบบฟอร์ม บส. 1 ถึง บส. 5 (หน้า 3, 5-6, 8, 10, 12)'
    ]
  }
];

export default function FormsView({
  setCurrentTab,
  session,
  orgProfile = {}
}) {
  // เริ่มต้นด้วยการแสดงหน้ารายการหัวข้อทั้งหมด (selectedTopicId = null)
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTab, setContentTab] = useState('pdf'); // 'pdf' | 'structure'
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  // PDF URL ทางการที่ฝังอยู่ในระบบ
  const pdfFileUrl = '/docs/w3482-risk-forms.pdf';

  // ค้นหาหัวข้อตามคำค้น
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return officialW3482Topics;
    const q = searchQuery.toLowerCase();
    return officialW3482Topics.filter((topic) => {
      const matchTitle = topic.title.toLowerCase().includes(q);
      const matchSubtitle = topic.subtitle.toLowerCase().includes(q);
      const matchCode = topic.code.toLowerCase().includes(q);
      const matchSummary = topic.summary.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchCode || matchSummary;
    });
  }, [searchQuery]);

  // หัวข้อปัจจุบันที่เลือก
  const currentTopic = useMemo(() => {
    return officialW3482Topics.find((t) => t.id === selectedTopicId) || null;
  }, [selectedTopicId]);

  // นำทางไปหัวข้อก่อนหน้า/ถัดไป
  const currentIndex = officialW3482Topics.findIndex((t) => t.id === selectedTopicId);
  const prevTopic = currentIndex > 0 ? officialW3482Topics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < officialW3482Topics.length - 1 ? officialW3482Topics[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner ทางการ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              หนังสือกระทรวงมหาดไทย ด่วนที่สุด มท 0805.2/ว 3482
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ลว. 18 สิงหาคม 2566
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            แบบรายงานการบริหารจัดการความเสี่ยงของ อปท. (แบบ บส. 1 - บส. 5)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            เอกสารทางการตามหลักเกณฑ์กระทรวงการคลังว่าด้วยมาตรฐานและหลักเกณฑ์ปฏิบัติการบริหารจัดการความเสี่ยงสำหรับหน่วยงานของรัฐ พ.ศ. 2562 
            สามารถกดดูเอกสาร PDF ต้นฉบับและคำอธิบายได้โดยตรงในระบบโดยไม่ต้องดาวน์โหลด
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSelectedTopicId('full-doc');
              setContentTab('pdf');
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>เปิดดูเอกสารฉบับเต็ม (12 หน้า)</span>
          </button>
        </div>
      </div>

      {/* 2. กรณีที่ยังไม่ได้เลือกหัวข้อ (แสดงรายการหัวข้อเรื่องก่อน) */}
      {!selectedTopicId && (
        <div className="space-y-5">
          {/* ช่องค้นหาหัวข้อ */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="ค้นหาหัวข้อเรื่อง เช่น บส. 1, บส. 2, ว 3482, ประเภทความเสี่ยง, วิธีการตอบสนอง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium px-2">
              พบ {filteredTopics.length} หัวข้อ
            </div>
          </div>

          {/* รายการหัวข้อเรื่อง (Topics Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic, index) => {
              const isFull = topic.id === 'full-doc';
              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setContentTab('pdf');
                  }}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-lg ${
                    isFull
                      ? 'border-blue-300 dark:border-blue-700 bg-linear-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Badge & Page Range */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
                        {topic.badgeText}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        {topic.pageRangeText}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {topic.subtitle}
                      </p>
                    </div>

                    {/* Summary text */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {topic.summary}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <Eye className="w-3.5 h-3.5" />
                      <span>กดดูเนื้อหาและเอกสาร</span>
                    </span>
                    <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. กรณีที่ผู้ใช้กดเลือกหัวข้อแล้ว (แสดงเนื้อหา + PDF Viewer) */}
      {selectedTopicId && currentTopic && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* แถบย้อนกลับ และตัวเลือกสลับหัวขอด่วน */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <button
              type="button"
              onClick={() => setSelectedTopicId(null)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer w-fit"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span>กลับไปหน้ารายการหัวข้อทั้งหมด</span>
            </button>

            {/* Quick Navigation Tabs for each form */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {officialW3482Topics.map((t) => {
                const isActive = t.id === currentTopic.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTopicId(t.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* รายละเอียดของหัวข้อที่เลือก */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 font-bold">
                    {currentTopic.badgeText}
                  </span>
                  <span>•</span>
                  <span>{currentTopic.pageRangeText}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                  {currentTopic.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentTopic.subtitle}
                </p>
              </div>

              {/* Action Buttons: Fullscreen & Link to online form */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="เปิดดูเต็มหน้าจอ"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>ขยายเต็มจอ</span>
                </button>

                <a
                  href={`${pdfFileUrl}#page=${currentTopic.startPage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="เปิดในแท็บใหม่ของบราวเซอร์"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>เปิดในแท็บใหม่</span>
                </a>

                {currentTopic.onlineFormTab && setCurrentTab && (
                  <button
                    type="button"
                    onClick={() => setCurrentTab(currentTopic.onlineFormTab)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    title="ไปที่หน้าบันทึกและประเมินความเสี่ยงออนไลน์ในระบบ"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ไปกรอกข้อมูลออนไลน์</span>
                  </button>
                )}
              </div>
            </div>

            {/* แถบเลือกสลับระหว่างดู PDF ต้นฉบับ vs ดูโครงสร้างและคำอธิบาย */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setContentTab('pdf')}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                  contentTab === 'pdf'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>เปิดดูเอกสาร PDF ต้นฉบับ (ไม่ต้องดาวน์โหลด)</span>
              </button>

              <button
                type="button"
                onClick={() => setContentTab('structure')}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                  contentTab === 'structure'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Table className="w-4 h-4" />
                <span>โครงสร้างแบบฟอร์มและคำอธิบายราชการ</span>
              </button>
            </div>

            {/* TAB 1: PDF Viewer In-App */}
            {contentTab === 'pdf' && (
              <div className="space-y-2">
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      กำลังแสดงเอกสารต้นฉบับทางราชการ <strong>{currentTopic.title}</strong> (หน้า {currentTopic.startPage} {currentTopic.endPage !== currentTopic.startPage ? `ถึง ${currentTopic.endPage}` : ''})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    ท่านสามารถเลื่อนอ่าน ซูมขยาย หรือค้นหาในเอกสารได้ทันที
                  </span>
                </div>

                <div className="w-full h-[720px] rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-inner">
                  <iframe
                    src={`${pdfFileUrl}#page=${currentTopic.startPage}&view=FitH`}
                    className="w-full h-full border-none"
                    title={currentTopic.title}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: โครงสร้างแบบฟอร์มและคำอธิบาย (Structure & Explanations) */}
            {contentTab === 'structure' && (
              <div className="space-y-6 pt-2">
                {/* สรุปสาระสำคัญ */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>วัตถุประสงค์และสาระสำคัญของ {currentTopic.code}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentTopic.summary}
                  </p>
                </div>

                {/* รายละเอียดคอลัมน์ในแบบฟอร์ม (ถ้ามี) */}
                {currentTopic.columns && (
                  <div className="space-y-3">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Table className="w-4 h-4 text-indigo-600" />
                      <span>โครงสร้างตารางและหัวข้อคอลัมน์ใน {currentTopic.code}</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                            <th className="py-2.5 px-4 w-28">ลำดับคอลัมน์</th>
                            <th className="py-2.5 px-4 w-60">ชื่อหัวตาราง</th>
                            <th className="py-2.5 px-4">คำอธิบายและการใช้งาน</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {currentTopic.columns.map((col, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50">
                              <td className="py-2.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                                {col.col}
                              </td>
                              <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                                {col.title}
                              </td>
                              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                                {col.detail}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ประเภทความเสี่ยง 6 ด้าน (เฉพาะ บส. 2) */}
                {currentTopic.riskTypes && (
                  <div className="space-y-3">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      <span>ประเภทความเสี่ยง 6 ประเภท (ตามคำอธิบายข้อ ๘ ของแบบ บส. ๒)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentTopic.riskTypes.map((rt) => (
                        <div key={rt.id} className="p-3.5 rounded-xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
                          <div className="font-bold text-xs text-amber-900 dark:text-amber-200">
                            {rt.id}. {rt.name}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            {rt.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* วิธีการตอบสนองความเสี่ยง 8 วิธี (เฉพาะ บส. 2) */}
                {currentTopic.responseMethods && (
                  <div className="space-y-3">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>วิธีการตอบสนองความเสี่ยง 8 วิธี (ตามคำอธิบายข้อ ๑๒ ของแบบ บส. ๒)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {currentTopic.responseMethods.map((rm) => (
                        <div key={rm.id} className="p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
                          <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                            {rm.id}. {rm.name}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            {rm.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* คำอธิบายแบบตามระเบียบ (Explanations) */}
                {currentTopic.explanations && (
                  <div className="space-y-3">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>คำอธิบายการกรอกแบบฟอร์ม {currentTopic.code} (ตามเอกสารทางการ)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {currentTopic.explanations.map((exp, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-2.5"
                        >
                          <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                            {exp.no}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {exp.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ข้อมูลหนังสือสั่งการ (สำหรับ w3482-notice) */}
                {currentTopic.officialDetails && (
                  <div className="space-y-3">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>รายละเอียดการติดต่อและส่วนราชการเจ้าของเรื่อง</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs space-y-2">
                      <div><strong>ส่วนราชการ:</strong> {currentTopic.officialDetails.issuer}</div>
                      <div><strong>ผู้รับการแจ้ง:</strong> {currentTopic.officialDetails.receiver}</div>
                      <div><strong>กลุ่มงานรับผิดชอบ:</strong> {currentTopic.officialDetails.contact}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons: Previous / Next topic */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {prevTopic ? (
                <button
                  type="button"
                  onClick={() => setSelectedTopicId(prevTopic.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-blue-600" />
                  <span>หัวข้อก่อนหน้า: {prevTopic.code}</span>
                </button>
              ) : <div />}

              {nextTopic ? (
                <button
                  type="button"
                  onClick={() => setSelectedTopicId(nextTopic.id)}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-blue-200 dark:border-blue-800"
                >
                  <span>หัวข้อถัดไป: {nextTopic.code}</span>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </button>
              ) : <div />}
            </div>
          </div>
        </div>
      )}

      {/* 4. Fullscreen Modal สำหรับอ่าน PDF เต็มจอโดยไม่ต้องดาวน์โหลด */}
      {isFullscreenModalOpen && currentTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[94vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentTopic.title} ({currentTopic.pageRangeText})
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`${pdfFileUrl}#page=${currentTopic.startPage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="เปิดในแท็บใหม่"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>

            {/* Modal Iframe */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 overflow-hidden flex flex-col">
              <iframe
                src={`${pdfFileUrl}#page=${currentTopic.startPage}&view=FitH`}
                className="w-full h-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white"
                title={currentTopic.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
