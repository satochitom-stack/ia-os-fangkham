import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Sliders,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Printer,
  FileText,
  Building,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Info,
  Layers,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Scale,
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  ClipboardList,
  Target,
  CheckSquare
} from 'lucide-react';

// =========================================================================
// 1. ฐานข้อมูลเกณฑ์มาตรฐาน 22 ปัจจัยเสี่ยง (ภาคผนวก 4 หน้า 76-82 หนังสือ กค 0416.3/ว 380)
// =========================================================================
export const OFFICIAL_22_RISK_FACTORS = [
  // ด้านกลยุทธ์ (Strategic: S)
  {
    id: 'S-01',
    dimension: 'S',
    dimensionName: 'ด้านกลยุทธ์ (Strategic)',
    title: 'นโยบายของผู้บริหาร',
    description: 'ความชัดเจนของนโยบาย เป้าหมาย ทิศทางองค์กร และการถ่ายทอดสู่การปฏิบัติ',
    criteria: {
      low: 'มีนโยบายและเป้าหมายชัดเจน มีตัวชี้วัดเป็นรูปธรรม สื่อสารทั่วถึงทั้งองค์กร (1 คะแนน)',
      medium: 'มีนโยบายชัดเจนบางส่วน ตัวชี้วัดยังไม่ครอบคลุมทุกภารกิจ สื่อสารระดับปานกลาง (2 คะแนน)',
      high: 'นโยบายไม่ชัดเจน ขาดเป้าหมายและแนวทางปฏิบัติที่ชัดเจน หรือเปลี่ยนบ่อยครั้ง (3 คะแนน)'
    }
  },
  {
    id: 'S-02',
    dimension: 'S',
    dimensionName: 'ด้านกลยุทธ์ (Strategic)',
    title: 'แผนกลยุทธ์และการจัดสรรงบประมาณ',
    description: 'ความสอดคล้องของแผนงานกับยุทธศาสตร์ และการจัดสรรทรัพยากร/งบประมาณรองรับ',
    criteria: {
      low: 'แผนงานสอดคล้องกับยุทธศาสตร์ จัดสรรงบประมาณเหมาะสมเพียงพอตามแผน (1 คะแนน)',
      medium: 'สอดคล้องกับยุทธศาสตร์บางส่วน งบประมาณไม่เพียงพอหรือไม่ทันตามกรอบเวลา (2 คะแนน)',
      high: 'ไม่สอดคล้องกับยุทธศาสตร์ ขาดการจัดสรรงบประมาณ หรือจัดสรรล่าช้ากระทบภารกิจ (3 คะแนน)'
    }
  },
  {
    id: 'S-03',
    dimension: 'S',
    dimensionName: 'ด้านกลยุทธ์ (Strategic)',
    title: 'นโยบายด้านจริยธรรมและค่านิยมร่วม',
    description: 'การกำหนดประมวลจริยธรรม การส่งเสริมความโปร่งใส และการป้องกันผลประโยชน์ทับซ้อน',
    criteria: {
      low: 'มีประมวลจริยธรรมเป็นลายลักษณ์อักษร มีการอบรมปลูกฝังและกำกับดูแลอย่างเคร่งครัด (1 คะแนน)',
      medium: 'มีประมวลจริยธรรม แต่การสื่อสารและติดตามผลยังไม่ทั่วถึงทุกระดับ (2 คะแนน)',
      high: 'ไม่มีประมวลจริยธรรมชัดเจน หรือไม่มีกลไกกำกับดูแลการปฏิบัติตามจริยธรรม (3 คะแนน)'
    }
  },
  {
    id: 'S-04',
    dimension: 'S',
    dimensionName: 'ด้านกลยุทธ์ (Strategic)',
    title: 'การบริหารทรัพยากรบุคคลเชิงกลยุทธ์',
    description: 'อัตรากำลัง ความรู้ความสามารถ ทักษะเฉพาะทาง และการกระจายภาระงาน',
    criteria: {
      low: 'อัตรากำลังเพียงพอ บุคลากรมีทักษะตรงสายงาน อัตราการลาออกหรือโยกย้ายต่ำ (1 คะแนน)',
      medium: 'อัตรากำลังพอปฏิบัติงานได้ แต่ขาดทักษะเฉพาะด้านบางตำแหน่ง หรือภาระงานไม่สมดุล (2 คะแนน)',
      high: 'ขาดแคลนบุคลากรอย่างรุนแรง ขาดทักษะเฉพาะทาง มีอัตราหมุนเวียนสูงกระทบงาน (3 คะแนน)'
    }
  },

  // ด้านการดำเนินงาน/การปฏิบัติงาน (Operation: O)
  {
    id: 'O-05',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'การมอบหมายงานและขอบเขตอำนาจหน้าที่',
    description: 'ความชัดเจนของคำสั่งมอบหมายงาน การแบ่งแยกหน้าที่ (Segregation of Duties) และการอนุมัติ',
    criteria: {
      low: 'มีคำสั่งมอบหมายงานและ Job Description ชัดเจน มีการแบ่งแยกหน้าที่เพื่อตรวจสอบถ่วงดุลครบถ้วน (1 คะแนน)',
      medium: 'มีการมอบหมายงานเป็นลายลักษณ์อักษร แต่ขอบเขตหน้าที่บางตำแหน่งยังทับซ้อน (2 คะแนน)',
      high: 'คำสั่งไม่ชัดเจน มอบหมายด้วยวาจา ขาดการแบ่งแยกหน้าที่สำคัญ เช่น ผู้สั่งจ่ายเป็นผู้เก็บรักษาเงิน (3 คะแนน)'
    }
  },
  {
    id: 'O-06',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'ระบบการควบคุมภายในของกิจกรรม/หน่วยงาน',
    description: 'ความเพียงพอ เหมาะสม และประสิทธิผลของกิจกรรมการควบคุมภายในตามมาตรฐาน',
    criteria: {
      low: 'มีระบบควบคุมภายในที่รัดกุม มีการประเมินและติดตามสม่ำเสมอ ความเสี่ยงคงเหลือต่ำ (1 คะแนน)',
      medium: 'มีระบบควบคุมภายใน แต่ยังหย่อนยานหรือละเลยในบางขั้นตอนสำคัญ (2 คะแนน)',
      high: 'ไม่มีระบบควบคุมภายใน หรือระบบควบคุมที่มีอยู่บกพร่อง ไม่สามารถป้องกันข้อผิดพลาดได้ (3 คะแนน)'
    }
  },
  {
    id: 'O-07',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'กระบวนการและคู่มือการปฏิบัติงาน',
    description: 'การจัดทำมาตรฐานการปฏิบัติงาน (SOP) คู่มือการทำงาน และ flow chart ขั้นตอน',
    criteria: {
      low: 'มีคู่มือปฏิบัติงานมาตรฐานครบถ้วน ปรับปรุงให้เป็นปัจจุบันตามระเบียบสม่ำเสมอ (1 คะแนน)',
      medium: 'มีคู่มือปฏิบัติงาน แต่ไม่ได้ปรับปรุงให้สอดคล้องกับระเบียบหรือระบบใหม่ในปัจจุบัน (2 คะแนน)',
      high: 'ไม่มีคู่มือการปฏิบัติงาน ปฏิบัติงานตามความคุ้นเคยหรือดุลยพินิจส่วนบุคคล (3 คะแนน)'
    }
  },
  {
    id: 'O-08',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'การกระจายของสถานที่ทำงานหรือขนาดและจำนวนกิจกรรม',
    description: 'ความซับซ้อน ปริมาณงาน และการกระจายตัวของหน่วยงานในพื้นที่รับผิดชอบ',
    criteria: {
      low: 'ปฏิบัติงานในจุดเดียว ไม่ซับซ้อน ปริมาณกิจกรรมปกติ อยู่ในวิสัยควบคุมได้ง่าย (1 คะแนน)',
      medium: 'มีหน่วยงานหรือจุดบริการย่อย 2-3 แห่ง ปริมาณงานค่อนข้างมาก ต้องกำกับดูแลใกล้ชิด (2 คะแนน)',
      high: 'กระจายตัวหลายพื้นที่ มีหน่วยงานลูกจำนวนมาก กิจกรรมซับซ้อน ยากต่อการติดตาม (3 คะแนน)'
    }
  },
  {
    id: 'O-09',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'แผนและผลการปฏิบัติงานเทียบเป้าหมาย',
    description: 'ความสำเร็จในการดำเนินงานตามแผนปฏิบัติงาน ประสิทธิภาพ และความรวดเร็ว',
    criteria: {
      low: 'ผลการดำเนินงานบรรลุตามเป้าหมายและระยะเวลาที่กำหนดทุกโครงการ (1 คะแนน)',
      medium: 'ผลงานคลาดเคลื่อนจากแผนเล็กน้อย ล่าช้าบางโครงการแต่ยังควบคุมได้ (2 คะแนน)',
      high: 'ผลงานไม่บรรลุเป้าหมาย โครงการล่าช้าอย่างมีนัยสำคัญ หรือไม่สามารถเปิดใช้งานได้ (3 คะแนน)'
    }
  },
  {
    id: 'O-10',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'ระบบการสื่อสารและสารสนเทศในการทำงาน',
    description: 'ความรวดเร็ว ถูกต้อง ปลอดภัยของช่องทางการสื่อสารและระบบไอทีที่สนับสนุนงาน',
    criteria: {
      low: 'ระบบไอทีเชื่อมโยงอัตโนมัติ รวดเร็ว ปลอดภัย มีระบบป้องกันการเข้าถึงที่รัดกุม (1 คะแนน)',
      medium: 'ระบบสารสนเทศใช้งานได้ดี แต่ยังมีขั้นตอนป้อนข้อมูลด้วยมือ หรือระบบสะดุดเป็นครั้งคราว (2 คะแนน)',
      high: 'ระบบยังเป็นงานกระดาษ ข้อมูลล่าช้า หรือระบบสารสนเทศล่มบ่อยครั้ง ขาดระบบรักษาความปลอดภัย (3 คะแนน)'
    }
  },
  {
    id: 'O-11',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'ประวัติการตรวจสอบและข้อทักท้วงเดิม',
    description: 'ผลการตรวจสอบจาก สตง., ผู้ตรวจราชการ และผู้ตรวจสอบภายในในรอบปีที่ผ่านมา',
    criteria: {
      low: 'ไม่มีประเด็นข้อตรวจพบที่สำคัญ หรือมีข้อสังเกตเล็กน้อยและแก้ไขเสร็จสิ้นแล้ว (1 คะแนน)',
      medium: 'มีข้อทักท้วงระดับปานกลาง ได้รับการปรับปรุงแก้ไขแล้วบางส่วน อยู่ระหว่างติดตาม (2 คะแนน)',
      high: 'มีข้อทักท้วงร้ายแรง ข้อบกพร่องซ้ำซาก หรือยังไม่ได้รับการแก้ไขตามข้อเสนอแนะ (3 คะแนน)'
    }
  },
  {
    id: 'O-12',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'การบริหารพัสดุ ครุภัณฑ์ และสินทรัพย์',
    description: 'การจัดทำทะเบียนคุมพัสดุ การเบิกจ่าย การตรวจนับประจำปี และการเก็บรักษาความปลอดภัย',
    criteria: {
      low: 'มีทะเบียนคุมถูกต้องเป็นปัจจุบัน ตรวจนับประจำปีครบถ้วน สถานที่เก็บรักษาปลอดภัย (1 คะแนน)',
      medium: 'มีทะเบียนคุมแต่บันทึกรายการล่าช้า การตรวจนับประจำปีดำเนินการช้ากว่ากำหนด (2 คะแนน)',
      high: 'ไม่มีทะเบียนคุมที่ถูกต้อง หรือมีพัสดุครุภัณฑ์สูญหาย/ชำรุดโดยไม่รายงาน ขาดการควบคุม (3 คะแนน)'
    }
  },
  {
    id: 'O-13',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'การซ่อมบำรุงรักษาทรัพย์สินและยานพาหนะ',
    description: 'การจัดทำแผนบำรุงรักษาเชิงป้องกัน (PM) การคุมการใช้น้ำมันเชื้อเพลิง และประวัติการซ่อม',
    criteria: {
      low: 'มีแผนบำรุงรักษาเชิงป้องกันชัดเจน บันทึกประวัติการซ่อมและสมุดคุมรถยนต์สม่ำเสมอ (1 คะแนน)',
      medium: 'ไม่มีแผนเชิงป้องกัน ซ่อมแซมตามอาการชำรุด แต่ยังมีการคุมค่าใช้จ่ายพอสมควร (2 คะแนน)',
      high: 'ขาดการบำรุงรักษา อุปกรณ์ชำรุดบ่อยครั้ง มีค่าใช้จ่ายซ่อมแซมสูงผิดปกติ ขาดสมุดคุม (3 คะแนน)'
    }
  },
  {
    id: 'O-14',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'ค่าใช้จ่ายสาธารณูปโภคและค่าใช้จ่ายดำเนินงาน',
    description: 'การประหยัดพลังงาน การควบคุมค่าน้ำ ค่าไฟ ค่าโทรศัพท์ และค่าใช้จ่ายสำนักงาน',
    criteria: {
      low: 'มีมาตรการประหยัดพลังงานชัดเจน ค่าใช้จ่ายสาธารณูปโภคอยู่ในเกณฑ์และมีแนวโน้มลดลง (1 คะแนน)',
      medium: 'ค่าใช้จ่ายอยู่ในเกณฑ์มาตรฐาน แต่ยังไม่มีมาตรการควบคุมเป็นรูปธรรม (2 คะแนน)',
      high: 'ค่าใช้จ่ายสาธารณูปโภคสูงผิดปกติอย่างต่อเนื่อง ขาดการกำกับดูแลหรือมีการรั่วไหล (3 คะแนน)'
    }
  },
  {
    id: 'O-15',
    dimension: 'O',
    dimensionName: 'ด้านการดำเนินงาน (Operation)',
    title: 'ผลกระทบต่อประชาชนและการให้บริการสาธารณะ',
    description: 'คุณภาพการให้บริการ ความเดือดร้อนของประชาชน และสถิติเรื่องร้องเรียน',
    criteria: {
      low: 'ประชาชนพึงพอใจสูง มีช่องทางบริการสะดวก รวดเร็ว ไม่มีเรื่องร้องเรียน (1 คะแนน)',
      medium: 'มีเรื่องร้องเรียนประปราย แต่ได้รับการแก้ไขและชี้แจงทันท่วงที ไม่บานปลาย (2 คะแนน)',
      high: 'มีเรื่องร้องเรียนบ่อยครั้ง ประชาชนเดือดร้อนเป็นวงกว้าง กระทบภาพลักษณ์องค์กรอย่างรุนแรง (3 คะแนน)'
    }
  },

  // ด้านการบริหารความรู้และไอที (Knowledge Management: K)
  {
    id: 'K-16',
    dimension: 'K',
    dimensionName: 'ด้านการบริหารความรู้ (Knowledge Management)',
    title: 'ความรู้ความสามารถและประสบการณ์ของผู้บริหาร/หัวหน้างาน',
    description: 'ความเชี่ยวชาญในสายงาน การตัดสินใจ และภาวะผู้นำในการแก้ไขปัญหาทางเทคนิค',
    criteria: {
      low: 'ผู้บริหารมีประสบการณ์สูง เชี่ยวชาญงาน ถ่ายทอดความรู้และให้คำปรึกษาได้ดีมาก (1 คะแนน)',
      medium: 'ผู้บริหารมีความรู้ทั่วไป แต่ยังขาดความเชี่ยวชาญเฉพาะทางในภารกิจเชิงลึก (2 คะแนน)',
      high: 'เพิ่งย้ายมารับตำแหน่ง ขาดประสบการณ์ในสายงาน หรือขาดภาวะผู้นำในการตัดสินใจ (3 คะแนน)'
    }
  },
  {
    id: 'K-17',
    dimension: 'K',
    dimensionName: 'ด้านการบริหารความรู้ (Knowledge Management)',
    title: 'การจัดการฐานข้อมูลเพื่อสนับสนุนการปฏิบัติงาน',
    description: 'การจัดเก็บฐานข้อมูล การสืบค้น การสำรองข้อมูล (Backup) และการแลกเปลี่ยนความรู้ในองค์กร',
    criteria: {
      low: 'ฐานข้อมูลเป็นระบบดิจิทัล สืบค้นรวดเร็ว สำรองข้อมูลอัตโนมัติ มีการแลกเปลี่ยนความรู้ (1 คะแนน)',
      medium: 'ฐานข้อมูลเป็นระบบกึ่งดิจิทัลกึ่งเอกสาร สืบค้นได้แต่ใช้เวลา ขาดระบบสำรองข้อมูลบางส่วน (2 คะแนน)',
      high: 'ไม่มีการจัดระบบฐานข้อมูล ข้อมูลสูญหายง่าย ไม่มีการสำรองข้อมูล ความรู้ผูกติดกับตัวบุคคล (3 คะแนน)'
    }
  },
  {
    id: 'K-18',
    dimension: 'K',
    dimensionName: 'ด้านการบริหารความรู้ (Knowledge Management)',
    title: 'การฝึกอบรมและพัฒนาบุคลากรอย่างต่อเนื่อง',
    description: 'การวางแผนพัฒนาทักษะ การส่งบุคลากรเข้ารับการอบรมตามเกณฑ์มาตรฐานกำหนดตำแหน่ง',
    criteria: {
      low: 'มีแผนพัฒนาบุคลากรชัดเจน ส่งอบรมตรงตามสายงานสม่ำเสมอ มีการสรุปองค์ความรู้ (1 คะแนน)',
      medium: 'ได้รับการอบรมเป็นครั้งคราว แต่ยังไม่ครอบคลุมบุคลากรทุกระดับ (2 คะแนน)',
      high: 'ไม่เคยได้รับการอบรมพัฒนาทักษะ บุคลากรขาดความรู้ในระเบียบใหม่ๆ ที่ต้องใช้ทำงาน (3 คะแนน)'
    }
  },

  // ด้านการเงินและการบัญชี (Financial: F)
  {
    id: 'F-19',
    dimension: 'F',
    dimensionName: 'ด้านการเงินและการบัญชี (Financial)',
    title: 'ความถูกต้อง ครบถ้วนของรายงานทางการเงินและบัญชี',
    description: 'การบันทึกบัญชีในระบบ e-LAAS / GFMIS ความถูกต้องของงบทดลอง และการส่งรายงานตามกำหนด',
    criteria: {
      low: 'บันทึกบัญชีเป็นปัจจุบันทุกวัน งบการเงินถูกต้องตามมาตรฐาน ส่งรายงานตรงเวลาตามระเบียบ (1 คะแนน)',
      medium: 'บันทึกบัญชีล่าช้าบ้าง มีรายการปรับปรุงยอดบัญชี ส่งรายงานการเงินคลาดเคลื่อนเล็กน้อย (2 คะแนน)',
      high: 'บันทึกบัญชีคั่งค้าง งบทดลองไม่ดุล ข้อมูลขัดแย้งกัน ส่งรายงานการเงินล่าช้าเป็นประจำ (3 คะแนน)'
    }
  },
  {
    id: 'F-20',
    dimension: 'F',
    dimensionName: 'ด้านการเงินและการบัญชี (Financial)',
    title: 'ขนาดวงเงินงบประมาณและปริมาณธุรกรรมการเงิน',
    description: 'ปริมาณเงินหมุนเวียน วงเงินงบประมาณโครงการ ความถี่ในการเบิกจ่าย และเงินนอกงบประมาณ',
    criteria: {
      low: 'วงเงินงบประมาณต่ำ ปริมาณธุรกรรมการเงินน้อย รายการไม่ซับซ้อน ควบคุมได้ง่าย (1 คะแนน)',
      medium: 'วงเงินงบประมาณปานกลาง ธุรกรรมการเงินสม่ำเสมอ มีระเบียบการเบิกจ่ายรองรับ (2 คะแนน)',
      high: 'วงเงินงบประมาณสูงมาก หรือมีเงินนอกงบประมาณ/เงินฝากจำนวนมาก มีธุรกรรมการเงินซับซ้อน (3 คะแนน)'
    }
  },

  // ด้านกฎหมาย ระเบียบ ข้อบังคับ (Compliance: C)
  {
    id: 'C-21',
    dimension: 'C',
    dimensionName: 'ด้านกฎหมายและระเบียบ (Compliance)',
    title: 'กฎหมาย ระเบียบ ข้อบังคับ และมติคณะรัฐมนตรี',
    description: 'ความซับซ้อนของระเบียบที่ใช้บังคับ การเปลี่ยนแปลงระเบียบใหม่ และความเสี่ยงจากการตีความ',
    criteria: {
      low: 'ระเบียบมีความชัดเจน แนวปฏิบัติเป็นมาตรฐาน บุคลากรเข้าใจและปฏิบัติตามถูกต้อง (1 คะแนน)',
      medium: 'ระเบียบมีการปรับปรุงเปลี่ยนแปลงบ่อยครั้ง ต้องอาศัยการตีความหรือขอหารือบางประเด็น (2 คะแนน)',
      high: 'ระเบียบซับซ้อน คลุมเครือ หรือเป็นภารกิจที่มีช่องว่างทางระเบียบ เสี่ยงต่อการปฏิบัติผิดพลาดสูง (3 คะแนน)'
    }
  },
  {
    id: 'C-22',
    dimension: 'C',
    dimensionName: 'ด้านกฎหมายและระเบียบ (Compliance)',
    title: 'การติดตามและการปฏิบัติตามข้อเสนอแนะของผู้ตรวจสอบ',
    description: 'ความรวดเร็วและความตั้งใจในการปรับปรุงแก้ไขข้อบกพร่องตามรายงานการตรวจสอบ',
    criteria: {
      low: 'ดำเนินการปรับปรุงแก้ไขข้อบกพร่องครบถ้วน รายงานผลภายในเวลา และปรับระบบการทำงาน (1 คะแนน)',
      medium: 'อยู่ระหว่างดำเนินการปรับปรุงตามข้อเสนอแนะ มีความคืบหน้าแต่ยังไม่เสร็จสมบูรณ์ (2 คะแนน)',
      high: 'เพิกเฉย ไม่ดำเนินการแก้ไขข้อบกพร่องตามข้อเสนอแนะ หรือไม่รายงานผลความคืบหน้า (3 คะแนน)'
    }
  }
];

// =========================================================================
// 2. ข้อมูลเปรียบเทียบภาคผนวก 1 (หน้า 69-70): ควบคุมภายใน VS ตรวจสอบภายใน
// =========================================================================
export const COMPARISON_TABLE_DATA = [
  {
    aspect: '1. วัตถุประสงค์ (Objective)',
    ic: 'เพื่อระบุความเสี่ยงที่อาจทำให้หน่วยงานไม่บรรลุภารกิจ และกำหนดกิจกรรมการควบคุม (Control Activities) เพื่อลดความเสี่ยงให้อยู่ในระดับที่ยอมรับได้',
    ia: 'เพื่อประเมินความเสี่ยงของกิจกรรม/หน่วยงานในจักรวาลการตรวจสอบ (Audit Universe) แล้วนำผลมาจัดลำดับความสำคัญในการคัดเลือกเรื่องตรวจสอบลงในแผนการตรวจสอบ'
  },
  {
    aspect: '2. ผู้รับผิดชอบ (Responsible Party)',
    ic: 'ฝ่ายบริหารและผู้ปฏิบัติงานของทุกหน่วยงาน (Management & Staff) ตามระเบียบคณะกรรมการตรวจเงินแผ่นดิน / พ.ร.บ. วินัยการเงินการคลังฯ',
    ia: 'ผู้ตรวจสอบภายใน (Internal Auditor) เพื่อรักษาความเป็นอิสระ (Independence) และความเที่ยงธรรม (Objectivity)'
  },
  {
    aspect: '3. ขอบเขตการประเมิน (Scope)',
    ic: 'ครอบคลุมภารกิจทั้งหมดและทุกกระบวนการทำงานของหน่วยงาน รวมทั้งสภาพแวดล้อมการควบคุม การประเมินความเสี่ยง และสารสนเทศ',
    ia: 'ครอบคลุมจักรวาลการตรวจสอบ (Audit Universe) มุ่งเน้นประเมินกิจกรรมและหน่วยงานที่มีความเสี่ยงสูงเพื่อจัดสรรทรัพยากรตรวจสอบที่มีจำกัด'
  },
  {
    aspect: '4. ความถี่และช่วงเวลา (Frequency & Timing)',
    ic: 'ดำเนินการอย่างน้อยปีละ 1 ครั้ง และรายงานตามแบบ ปอ.1 - ปอ.3 ต่อนายก อปท. ผู้ว่าราชการจังหวัด และสำนักงานการตรวจเงินแผ่นดิน (สตง.)',
    ia: 'ดำเนินการก่อนการจัดทำแผนการตรวจสอบระยะยาว (3 ปี) และแผนการตรวจสอบประจำปี เพื่อเสนอขออนุมัติต่อนายก อปท. หรือหัวหน้าส่วนราชการ'
  },
  {
    aspect: '5. เครื่องมือและวิธีการ (Tools & Methodology)',
    ic: 'การประเมินการควบคุมด้วยตนเอง (Control Self-Assessment: CSA), แบบสอบถามการควบคุมภายใน, การวิเคราะห์จุดอ่อนจุดแข็งของระบบควบคุม',
    ia: 'กระดาษทำการสำรวจข้อมูลเบื้องต้น, กรอบปัจจัยเสี่ยง 5 มิติ (SOFCK), เกณฑ์มาตรฐาน 22 ปัจจัยเสี่ยง, การคำนวณช่วงคะแนน และการจัดลำดับคะแนน'
  },
  {
    aspect: '6. ผลลัพธ์และการนำไปใช้ (Output & Utilization)',
    ic: 'ได้แผนปรับปรุงการควบคุมภายใน และรายงานการประเมินผลการควบคุมภายใน (แบบ ปอ.1, ปอ.2, ปอ.3)',
    ia: 'ได้แผนการตรวจสอบระยะยาว (Long-Term Plan), แผนการตรวจสอบประจำปี (Annual Plan), และแผนปฏิบัติงานตรวจสอบเฉพาะเรื่อง (Engagement Plan)'
  }
];

// =========================================================================
// 3. ข้อมูลตัวอย่างระดับหน่วยงาน (Entity Level - ตัวอย่างที่ 1 หน้า 36-52)
// =========================================================================
export const defaultEntityUniverse = [
  {
    id: 'ENT-01',
    name: 'กองคลัง',
    roleDescription: 'รับผิดชอบงานการเงิน บัญชี e-LAAS พัสดุ จัดเก็บภาษี และการบริหารงบประมาณ',
    sScore: 3,
    oScore: 3,
    fScore: 3,
    cScore: 3,
    kScore: 3,
    priority: 'เร่งด่วนที่สุด (Priority 1)',
    focusActivities: 'การจัดเก็บภาษีและลูกหนี้, การจัดทำบัญชี New e-LAAS, การเบิกจ่ายเงิน, การจัดซื้อจัดจ้าง'
  },
  {
    id: 'ENT-02',
    name: 'กองช่าง',
    roleDescription: 'รับผิดชอบงานก่อสร้างโครงสร้างพื้นฐาน การควบคุมงาน การตรวจรับพัสดุ และควบคุมอาคาร',
    sScore: 2,
    oScore: 3,
    fScore: 3,
    cScore: 3,
    kScore: 2,
    priority: 'เร่งด่วน (Priority 2)',
    focusActivities: 'การควบคุมงานก่อสร้าง คสล., การตรวจรับพัสดุ, การขออนุญาตก่อสร้างตาม พ.ร.บ.ควบคุมอาคาร'
  },
  {
    id: 'ENT-03',
    name: 'กองการศึกษา ศาสนาและวัฒนธรรม',
    roleDescription: 'รับผิดชอบศูนย์พัฒนาเด็กเล็ก (ศพด.) อาหารกลางวัน อาหารเสริมนม และเงินอุดหนุนการศึกษา',
    sScore: 2,
    oScore: 3,
    fScore: 3,
    cScore: 2,
    kScore: 3,
    priority: 'เร่งด่วน (Priority 2)',
    focusActivities: 'บัญชีและการเงิน ศพด., การเบิกจ่ายเงินอุดหนุนอาหารกลางวันและนมโรงเรียน'
  },
  {
    id: 'ENT-04',
    name: 'สำนักปลัด',
    roleDescription: 'รับผิดชอบงานสารบรรณ การบริหารงานบุคคล รถยนต์ส่วนกลาง น้ำมันเชื้อเพลิง และความปลอดภัย',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 2,
    priority: 'ปานกลาง (หมุนเวียน 2-3 ปี)',
    focusActivities: 'การใช้และรักษารถยนต์ส่วนกลาง, การเบิกจ่ายน้ำมันเชื้อเพลิง, งานสารบรรณอิเล็กทรอนิกส์'
  },
  {
    id: 'ENT-05',
    name: 'กองสวัสดิการสังคม',
    roleDescription: 'รับผิดชอบงานเบี้ยยังชีพผู้สูงอายุ คนพิการ ผู้ป่วยเอดส์ และการสงเคราะห์ชุมชน',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 1,
    priority: 'ปานกลาง (หมุนเวียน 2-3 ปี)',
    focusActivities: 'การเบิกจ่ายเบี้ยยังชีพผู้สูงอายุและคนพิการ, การตรวจสอบฐานข้อมูลผู้มีสิทธิรับเงิน'
  }
];

// =========================================================================
// 4. รายการกิจกรรมมาตรฐานเริ่มต้นในจักรวาลการตรวจสอบ (Standard Audit Universe Activities)
// =========================================================================
export const defaultAuditUniverse = [
  {
    id: 'AU-01',
    department: 'กองคลัง',
    activity: 'การจัดเก็บภาษี ค่าธรรมเนียม และลูกหนี้ค้างชำระ',
    sScore: 3,
    oScore: 3,
    fScore: 3,
    cScore: 3,
    kScore: 3,
    reason: 'มีลูกหนี้ค้างชำระสะสม ฐานข้อมูลลูกหนี้ขยะและผู้ประกอบการต้องปรับปรุงให้เป็นปัจจุบัน',
    riskScope: 'กระบวนการแจ้งประเมิน การจัดทำบัญชีลูกหนี้ การรับชำระ และการเร่งรัดติดตามหนี้ค้างชำระ',
    riskOwner: 'หัวหน้าฝ่ายพัฒนารายได้ / ผู้อำนวยการกองคลัง',
    tolerance: 'ยอดลูกหนี้ค้างชำระต้องไม่เกิน 5% ของประมาณการรายได้ และต้องมีหนังสือทวงถามครบถ้วน',
    existingControls: 'มีระบบแผนที่ภาษี (LTAX) แต่ฐานข้อมูลยังไม่ได้เชื่อมโยงสมบูรณ์กับระบบ New e-LAAS',
    mitigation: 'สุ่มตรวจสอบการออกหนังสือเตือน การบันทึกบัญชีลูกหนี้ และการตรวจสอบการรับเงินใบเสร็จ',
    includedInPlan: true
  },
  {
    id: 'AU-02',
    department: 'กองคลัง',
    activity: 'การจัดทำบัญชีและรายงานการเงิน (ระบบ New e-LAAS)',
    sScore: 2,
    oScore: 3,
    fScore: 3,
    cScore: 3,
    kScore: 3,
    reason: 'การบันทึกบัญชีแม่และลูก (ศพด.) และการปรับปรุงระบบ New e-LAAS ให้ตรงตามเกณฑ์กรมบัญชีกลาง',
    riskScope: 'การบันทึกบัญชีรายวัน การปรับปรุงงบทดลอง การปิดบัญชี และการจัดทำรายงานการเงินรวมหน่วยงานลูก',
    riskOwner: 'หัวหน้าฝ่ายการเงินและบัญชี / ผู้อำนวยการกองคลัง',
    tolerance: 'งบทดลองต้องดุลทุกสิ้นเดือน และส่งรายงานการเงินให้ สตง. ภายใน 90 วันนับแต่วันสิ้นปีงบประมาณ',
    existingControls: 'ผู้บริหารตรวจสอบงบทดลองประจำเดือนในระบบ New e-LAAS',
    mitigation: 'ตรวจสอบการปรับปรุงรายการบัญชีค้างรับค้างจ่าย และการกระทบยอดเงินฝากธนาคารทุกบัญชี',
    includedInPlan: true
  },
  {
    id: 'AU-03',
    department: 'กองช่าง',
    activity: 'งานควบคุมงานก่อสร้างโครงสร้างพื้นฐาน (ถนน คสล. / โครงการตามข้อบัญญัติ)',
    sScore: 2,
    oScore: 3,
    fScore: 3,
    cScore: 3,
    kScore: 2,
    reason: 'งบประมาณก่อสร้างสูง มีความเสี่ยงในการตรวจรับให้ตรงตามแบบรูปรายการและสัญญาจ้าง',
    riskScope: 'กระบวนการแต่งตั้งผู้ควบคุมงาน บันทึกรายงานประจำวัน และการตรวจรับพัสดุของคณะกรรมการ',
    riskOwner: 'นายช่างโยธาผู้ควบคุมงาน / ผู้อำนวยการกองช่าง',
    tolerance: 'งานก่อสร้างต้องส่งมอบตามกำหนด และได้คุณภาพตามผลการทดสอบแรงอัดคอนกรีต (Cylinder Test)',
    existingControls: 'มีคณะกรรมการตรวจรับพัสดุและช่างควบคุมงานรายงานตามขั้นตอนระเบียบฯ',
    mitigation: 'ลงพื้นที่สุ่มตรวจวัดขนาดมิติความหนา ความกว้าง ความยาว และตรวจดูผลทดสอบคุณภาพวัสดุ',
    includedInPlan: true
  },
  {
    id: 'AU-04',
    department: 'กองการศึกษา ศาสนาและวัฒนธรรม',
    activity: 'การจัดทำบัญชีและรายงานการเงินของศูนย์พัฒนาเด็กเล็ก (ศพด.)',
    sScore: 2,
    oScore: 3,
    fScore: 3,
    cScore: 3,
    kScore: 3,
    reason: 'ครูผู้ดูแลเด็กยังขาดทักษะด้านการบันทึกบัญชีและการจัดซื้อจัดจ้างตามระบบ e-LAAS',
    riskScope: 'สมุดเงินสด การเบิกจ่ายเงินย่อย การตรวจนับเงินสดคงเหลือ และการจัดทำงบทดลองรายเดือน',
    riskOwner: 'หัวหน้าศูนย์พัฒนาเด็กเล็ก / ผู้อำนวยการกองการศึกษาฯ',
    tolerance: 'เอกสารหลักฐานการจ่ายต้องครบถ้วนถูกต้อง 100% ห้ามมีเงินสดคงเหลือเกินวงเงินกำหนด',
    existingControls: 'กองการศึกษาฯ มีเจ้าหน้าที่คอยให้คำแนะนำ แต่ยังขาดการสอบทานสม่ำเสมอ',
    mitigation: 'สุ่มตรวจสมุดเงินสด ทะเบียนคุมเงินฝากธนาคาร และใบเสร็จรับเงินของ ศพด.',
    includedInPlan: true
  },
  {
    id: 'AU-05',
    department: 'กองการศึกษา ศาสนาและวัฒนธรรม',
    activity: 'การเบิกจ่ายเงินอุดหนุนอาหารกลางวันและอาหารเสริมนมโรงเรียน',
    sScore: 2,
    oScore: 2,
    fScore: 3,
    cScore: 2,
    kScore: 2,
    reason: 'วงเงินอุดหนุนสูง ต้องสุ่มตรวจการเบิกจ่ายเงินและจำนวนเด็กจริงให้ถูกต้องตามระเบียบฯ',
    riskScope: 'การคำนวณจำนวนหัวเด็กนักเรียน การจัดซื้อจัดจ้างอาหารกลางวัน และการตรวจรับนมโรงเรียน',
    riskOwner: 'เจ้าหน้าที่ผู้รับผิดชอบโครงการอาหารกลางวัน / ผู้อำนวยการกองการศึกษาฯ',
    tolerance: 'จำนวนเด็กที่เบิกจ่ายต้องตรงกับฐานข้อมูลเด็กที่มีตัวตนจริง ณ วันเปิดภาคเรียน',
    existingControls: 'มีคณะกรรมการตรวจรับอาหารและนมทุกวันทำการ',
    mitigation: 'กระทบยอดบัญชีรายชื่อเด็กนักเรียนกับใบเบิกจ่าย และตรวจนับการส่งมอบนมโรงเรียน',
    includedInPlan: false
  },
  {
    id: 'AU-06',
    department: 'สำนักปลัด',
    activity: 'การใช้และรักษารถยนต์ส่วนกลาง และการเบิกจ่ายน้ำมันเชื้อเพลิง',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 2,
    reason: 'ต้องตรวจสอบสมุดคุมการใช้รถ การขออนุมัติเดินทาง และเกณฑ์การสิ้นเปลืองน้ำมันเชื้อเพลิง',
    riskScope: 'ใบขอใช้รถยนต์ สมุดบันทึกการใช้รถ บิลน้ำมันเชื้อเพลิง และการเก็บรักษารถนอกเวลาราชการ',
    riskOwner: 'หัวหน้าฝ่ายบริหารงานทั่วไป / หัวหน้าสำนักปลัด',
    tolerance: 'อัตราการสิ้นเปลืองน้ำมันต้องเป็นไปตามเกณฑ์มาตรฐานที่ อปท. กำหนด',
    existingControls: 'มีสมุดบันทึกเลขกิโลเมตรและใบสั่งจ่ายน้ำมันเชื้อเพลิง',
    mitigation: 'ตรวจสอบความสอดคล้องระหว่างระยะทางที่เดินทางจริงกับปริมาณน้ำมันที่เบิกจ่าย',
    includedInPlan: false
  },
  {
    id: 'AU-07',
    department: 'กองช่าง',
    activity: 'งานควบคุมอาคารและการขออนุญาตก่อสร้าง/ดัดแปลงอาคาร',
    sScore: 2,
    oScore: 3,
    fScore: 2,
    cScore: 3,
    kScore: 2,
    reason: 'การกำกับดูแลตาม พรบ.ควบคุมอาคาร พ.ศ. 2522 และการอนุญาตสิ่งปลูกสร้างในพื้นที่',
    riskScope: 'คำขออนุญาต แบบแปลน การตรวจสอบความปลอดภัยในเขตทาง และการออกใบอนุญาต (แบบ อ.1)',
    riskOwner: 'นายช่างผู้รับผิดชอบงานผังเมืองและอาคาร / ผู้อำนวยการกองช่าง',
    tolerance: 'ต้องพิจารณาคำขอและออกใบอนุญาตภายในกรอบเวลาที่กฎหมายกำหนด',
    existingControls: 'มีการลงทะเบียนรับคำขอและตรวจสอบแบบแปลนโดยวิศวกร/สถาปนิก',
    mitigation: 'สุ่มตรวจสำนวนคำขออนุญาตก่อสร้างอาคาร และการตรวจตราสิ่งปลูกสร้างที่ยังไม่ได้รับอนุญาต',
    includedInPlan: false
  },
  {
    id: 'AU-08',
    department: 'กองคลัง',
    activity: 'การบริหารสัญญาและการควบคุมหลักประกันสัญญา',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 2,
    reason: 'การติดตามคืนหลักประกันสัญญาเมื่อพ้นภาระผูกพัน และการริบหลักประกันกรณีผิดสัญญา',
    riskScope: 'ทะเบียนคุมหลักประกันสัญญา หนังสือค้ำประกันธนาคาร การส่งคืน และการริบหลักประกัน',
    riskOwner: 'หัวหน้าฝ่ายพัสดุและทรัพย์สิน / ผู้อำนวยการกองคลัง',
    tolerance: 'ต้องไม่ปล่อยให้หนังสือค้ำประกันหมดอายุก่อนสิ้นสุดระยะเวลารับประกันความชำรุดบกพร่อง',
    existingControls: 'มีทะเบียนคุมหลักประกันสัญญาและระบบแจ้งเตือนวันครบกำหนด',
    mitigation: 'ตรวจนับยอดหนังสือค้ำประกันสัญญาตัวจริงเทียบกับยอดในทะเบียนคุม',
    includedInPlan: false
  },
  {
    id: 'AU-09',
    department: 'สำนักปลัด',
    activity: 'งานสารบรรณและการรับ-ส่งหนังสือราชการอิเล็กทรอนิกส์',
    sScore: 2,
    oScore: 2,
    fScore: 1,
    cScore: 2,
    kScore: 2,
    reason: 'การจัดเก็บหนังสือราชการให้เป็นระบบ รวดเร็ว และสืบค้นได้ทันท่วงที',
    riskScope: 'ทะเบียนรับ-ส่งหนังสือ ระบบสารบรรณอิเล็กทรอนิกส์ และการทำลายหนังสือราชการตามกำหนด',
    riskOwner: 'เจ้าหน้าที่งานสารบรรณ / หัวหน้าสำนักปลัด',
    tolerance: 'หนังสือราชการเร่งด่วนต้องส่งถึงผู้รับภายใน 1 วันทำการ',
    existingControls: 'ใช้ระบบสารบรรณอิเล็กทรอนิกส์ในการลงทะเบียนรับส่งหนังสือ',
    mitigation: 'ตรวจสอบความครบถ้วนของการออกเลขหนังสือและการจัดเก็บเอกสารสำคัญ',
    includedInPlan: false
  },
  {
    id: 'AU-10',
    department: 'กองสวัสดิการสังคม',
    activity: 'การเบิกจ่ายเงินเบี้ยยังชีพผู้สูงอายุและคนพิการ',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 1,
    reason: 'การตรวจสอบคุณสมบัติของผู้มีสิทธิรับเงินเบี้ยยังชีพ และการตรวจสอบรายชื่อผู้เสียชีวิต',
    riskScope: 'ฐานข้อมูลระบบสารสนเทศการจัดการฐานข้อมูลเบี้ยยังชีพ (e-Social Welfare) และการโอนเงินกรมบัญชีกลาง',
    riskOwner: 'นักพัฒนาชุมชน / ผู้อำนวยการกองสวัสดิการสังคม',
    tolerance: 'ห้ามมีการจ่ายเงินให้แก่ผู้ที่ขาดคุณสมบัติหรือผู้ที่เสียชีวิตแล้ว',
    existingControls: 'ตรวจสอบข้อมูลทะเบียนราษฎรกับสำนักทะเบียนอำเภอเป็นประจำทุกเดือน',
    mitigation: 'กระทบยอดบัญชีรายชื่อผู้รับเบี้ยยังชีพกับข้อมูลมรณบัตรและระบบ e-Social Welfare',
    includedInPlan: false
  }
];

export default function AuditRiskView({
  selectedYear = '2568',
  orgProfile = {},
  auditUniverse = [],
  setAuditUniverse,
  annualPlans = [],
  setAnnualPlans,
  setCurrentTab
}) {
  // Assessment Mode: 'activity' (ระดับกิจกรรม - ตัวอย่างที่ 2) vs 'entity' (ระดับหน่วยงาน - ตัวอย่างที่ 1)
  const [assessmentMode, setAssessmentMode] = useState('activity');

  // Sub Tabs: 'matrix', 'ranking', 'risk-desc', 'criteria-guide', 'comparison', 'report'
  const [activeSubTab, setActiveSubTab] = useState('matrix');

  // Filters & Search
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedRiskDescItem, setSelectedRiskDescItem] = useState(null);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    department: 'กองคลัง',
    activity: '',
    sScore: 2,
    oScore: 2,
    fScore: 2,
    cScore: 2,
    kScore: 2,
    reason: '',
    riskScope: '',
    riskOwner: '',
    tolerance: '',
    existingControls: '',
    mitigation: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // คำนวณคะแนนเฉลี่ย SOFCK 5 มิติ
  const calculateScore = (item) => {
    const sum = Number(item.sScore || 2) + Number(item.oScore || 2) + Number(item.fScore || 2) + Number(item.cScore || 2) + Number(item.kScore || 2);
    const avg = sum / 5;
    return Number(avg.toFixed(2));
  };

  // แปลผลระดับความเสี่ยงตามเกณฑ์กระทรวงการคลัง (หนังสือ กค 0416.3/ว 380)
  const getRiskLevelInfo = (score) => {
    if (score >= 2.6) {
      return {
        level: 'สูงมาก',
        color: 'rose',
        badgeClass: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        planDecision: 'ต้องบรรจุในแผนประจำปี (Priority 1)',
        actionClass: 'text-rose-700 dark:text-rose-400 font-bold',
        priority: 1
      };
    } else if (score >= 2.1) {
      return {
        level: 'สูง',
        color: 'amber',
        badgeClass: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        planDecision: 'บรรจุในแผนประจำปี (Priority 2)',
        actionClass: 'text-amber-700 dark:text-amber-400 font-bold',
        priority: 2
      };
    } else if (score >= 1.6) {
      return {
        level: 'ปานกลาง',
        color: 'yellow',
        badgeClass: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
        planDecision: 'แผนระยะยาว / รอบหมุนเวียน 2-3 ปี',
        actionClass: 'text-yellow-700 dark:text-yellow-400',
        priority: 3
      };
    } else {
      return {
        level: 'ต่ำ',
        color: 'emerald',
        badgeClass: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        planDecision: 'เฝ้าระวัง / ควบคุมภายในปกติ',
        actionClass: 'text-emerald-700 dark:text-emerald-400',
        priority: 4
      };
    }
  };

  // ประมวลผลคะแนนกิจกรรม
  const scoredActivities = useMemo(() => {
    return (auditUniverse || []).map((item) => {
      const score = calculateScore(item);
      const info = getRiskLevelInfo(score);
      return { ...item, score, ...info };
    });
  }, [auditUniverse]);

  // ประมวลผลคะแนนระดับหน่วยงาน (Entity Level)
  const scoredEntities = useMemo(() => {
    return defaultEntityUniverse.map((entity) => {
      const deptActivities = scoredActivities.filter((a) => a.department === entity.name);
      let avgScore = calculateScore(entity);
      if (deptActivities.length > 0) {
        const sum = deptActivities.reduce((acc, curr) => acc + curr.score, 0);
        avgScore = Number((sum / deptActivities.length).toFixed(2));
      }
      const info = getRiskLevelInfo(avgScore);
      return {
        ...entity,
        activityCount: deptActivities.length,
        score: avgScore,
        ...info
      };
    }).sort((a, b) => b.score - a.score);
  }, [scoredActivities]);

  // สถิติกิจกรรม
  const totalActivities = scoredActivities.length;
  const veryHighCount = scoredActivities.filter((i) => i.level === 'สูงมาก').length;
  const highCount = scoredActivities.filter((i) => i.level === 'สูง').length;
  const mediumCount = scoredActivities.filter((i) => i.level === 'ปานกลาง').length;
  const lowCount = scoredActivities.filter((i) => i.level === 'ต่ำ').length;

  // กรองรายการกิจกรรม
  const filteredActivities = useMemo(() => {
    return scoredActivities.filter((item) => {
      if (departmentFilter !== 'all' && item.department !== departmentFilter) return false;
      if (riskLevelFilter !== 'all' && item.level !== riskLevelFilter) return false;
      if (searchQuery.trim() && !item.activity.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [scoredActivities, departmentFilter, riskLevelFilter, searchQuery]);

  // โหลดกิจกรรมมาตรฐาน
  const handleLoadDefaults = () => {
    if (window.confirm('ท่านต้องการโหลดรายการกิจกรรมมาตรฐานในจักรวาลการตรวจสอบ (Audit Universe) หรือไม่?')) {
      setAuditUniverse(defaultAuditUniverse);
      showToast('โหลดรายการกิจกรรมมาตรฐานเรียบร้อยแล้ว');
    }
  };

  // บันทึกกิจกรรมใหม่ หรือ อัปเดตรายการเดิม
  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!formData.activity.trim()) return;

    if (editingItem) {
      const updated = auditUniverse.map((i) =>
        i.id === editingItem.id ? { ...i, ...formData } : i
      );
      setAuditUniverse(updated);
      showToast('แก้ไขข้อมูลกิจกรรมเรียบร้อยแล้ว');
    } else {
      const newId = `AU-${String(auditUniverse.length + 1).padStart(2, '0')}`;
      const newItem = {
        id: newId,
        ...formData,
        includedInPlan: false
      };
      setAuditUniverse([...auditUniverse, newItem]);
      showToast('เพิ่มกิจกรรมในจักรวาลการตรวจสอบเรียบร้อยแล้ว');
    }

    setShowAddModal(false);
    setEditingItem(null);
    setFormData({
      department: 'กองคลัง',
      activity: '',
      sScore: 2,
      oScore: 2,
      fScore: 2,
      cScore: 2,
      kScore: 2,
      reason: '',
      riskScope: '',
      riskOwner: '',
      tolerance: '',
      existingControls: '',
      mitigation: ''
    });
  };

  // ลบกิจกรรม
  const handleDeleteActivity = (id) => {
    if (window.confirm('ท่านแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้ออกจากการประเมินความเสี่ยง?')) {
      setAuditUniverse(auditUniverse.filter((i) => i.id !== id));
      showToast('ลบกิจกรรมเรียบร้อยแล้ว');
    }
  };

  // นำกิจกรรมที่มีความเสี่ยงสูง เข้าสู่แผนการตรวจสอบประจำปี (Push to Annual Plan)
  const handlePushToAnnualPlan = (item) => {
    const exists = annualPlans.some((p) => p.title === item.activity);
    if (exists) {
      alert(`โครงการ/กิจกรรม "${item.activity}" มีอยู่ในแผนการตรวจสอบประจำปี ${selectedYear} แล้ว`);
      return;
    }

    const yearSuffix = (selectedYear || '2568').slice(-2);
    const newPlanId = `PLAN-${yearSuffix}-0${annualPlans.length + 1}`;
    const newPlan = {
      id: newPlanId,
      title: item.activity,
      department: item.department,
      quarter: `ไตรมาส 1 (ต.ค. - ธ.ค. ${yearSuffix})`,
      period: `พ.ศ. ${selectedYear}`,
      riskLevel: item.level,
      budget: 5000,
      objective: `เพื่อตรวจสอบการปฏิบัติงานและประเมินประสิทธิภาพกิจกรรม ${item.activity} ตามผลการประเมินความเสี่ยงที่มีคะแนน ${item.score.toFixed(2)} (${item.level}) ตามหนังสือ กค 0416.3/ว 380`,
      status: 'pending',
      progress: 0
    };

    setAnnualPlans([...annualPlans, newPlan]);

    // อัปเดตสถานะ includedInPlan ใน auditUniverse
    const updated = auditUniverse.map((i) =>
      i.id === item.id ? { ...i, includedInPlan: true } : i
    );
    setAuditUniverse(updated);

    showToast(`บรรจุ "${item.activity}" เข้าสู่แผนการตรวจสอบประจำปี ${selectedYear} แล้ว`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 border border-blue-500 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Official Reference */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-0.5 text-xs font-medium text-blue-200">
                <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                <span>อ้างอิง: หนังสือกรมบัญชีกลาง ที่ กค 0416.3/ว 380 ลงวันที่ 8 ธ.ค. 2546</span>
              </span>
              <span className="inline-flex items-center space-x-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-2.5 py-0.5 text-xs font-medium text-emerald-200">
                <Award className="w-3 h-3 text-emerald-300" />
                <span>มาตรฐานการตรวจสอบภายใน รหัส 2010</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              การประเมินความเสี่ยงเพื่อวางแผนการตรวจสอบ (Audit Risk Assessment)
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-3xl leading-relaxed">
              เครื่องมือประเมินความเสี่ยงของหน่วยตรวจสอบภายใน เพื่อคัดเลือกกิจกรรมในจักรวาลการตรวจสอบ (Audit Universe)
              บรรจุเข้าสู่แผนการตรวจสอบประจำปี พ.ศ. {selectedYear} และแผนระยะยาว 3 ปี ตามระเบียบกระทรวงการคลัง
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {auditUniverse.length === 0 && (
              <button
                onClick={handleLoadDefaults}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>โหลดกิจกรรมมาตรฐาน อปท.</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  department: 'กองคลัง',
                  activity: '',
                  sScore: 2,
                  oScore: 2,
                  fScore: 2,
                  cScore: 2,
                  kScore: 2,
                  reason: '',
                  riskScope: '',
                  riskOwner: '',
                  tolerance: '',
                  existingControls: '',
                  mitigation: ''
                });
                setShowAddModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มกิจกรรมประเมิน</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('report');
                setTimeout(() => window.print(), 200);
              }}
              className="no-print bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/20 shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>พิมพ์รายงานความเสี่ยง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Activity Level vs. Entity Level */}
      <div className="bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-1 w-full sm:w-auto">
          <button
            onClick={() => setAssessmentMode('activity')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              assessmentMode === 'activity'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span>ระดับกิจกรรม (Activity Level - ตัวอย่างที่ 2)</span>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-md font-mono">
              {totalActivities} กิจกรรม
            </span>
          </button>

          <button
            onClick={() => setAssessmentMode('entity')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              assessmentMode === 'entity'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4 text-indigo-500" />
            <span>ระดับหน่วยงาน (Entity Level - ตัวอย่างที่ 1)</span>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-md font-mono">
              {scoredEntities.length} กอง/สำนัก
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setShowCriteriaModal(true)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 font-semibold cursor-pointer px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>เปิดคู่มือเกณฑ์ 22 ปัจจัยเสี่ยง (ภาคผนวก 4)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {assessmentMode === 'activity' ? 'กิจกรรมทั้งหมด' : 'หน่วยรับตรวจทั้งหมด'}
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {assessmentMode === 'activity' ? totalActivities : scoredEntities.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">ในจักรวาลการตรวจ (Audit Universe)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-rose-200/80 dark:border-rose-900/50 shadow-xs">
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>
            สูงมาก (2.6 - 3.0)
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {assessmentMode === 'activity'
              ? veryHighCount
              : scoredEntities.filter((e) => e.level === 'สูงมาก').length}
          </div>
          <div className="text-[10px] text-rose-500/80 mt-0.5">ต้องบรรจุในแผน (Priority 1)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-amber-200/80 dark:border-amber-900/50 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            สูง (2.1 - 2.5)
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {assessmentMode === 'activity'
              ? highCount
              : scoredEntities.filter((e) => e.level === 'สูง').length}
          </div>
          <div className="text-[10px] text-amber-500/80 mt-0.5">บรรจุในแผน (Priority 2)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-yellow-200/80 dark:border-yellow-900/50 shadow-xs">
          <div className="text-[11px] font-bold text-yellow-600 dark:text-yellow-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
            ปานกลาง (1.6 - 2.0)
          </div>
          <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400 mt-1">
            {assessmentMode === 'activity'
              ? mediumCount
              : scoredEntities.filter((e) => e.level === 'ปานกลาง').length}
          </div>
          <div className="text-[10px] text-yellow-500/80 mt-0.5">รอบหมุนเวียน 2-3 ปี</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-emerald-200/80 dark:border-emerald-900/50 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            ต่ำ (1.0 - 1.5)
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {assessmentMode === 'activity'
              ? lowCount
              : scoredEntities.filter((e) => e.level === 'ต่ำ').length}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-0.5">เฝ้าระวัง / ติดตามผล</div>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 sm:space-x-4 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'matrix'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          {assessmentMode === 'activity' ? 'ตารางเมทริกซ์ประเมินความเสี่ยงรายกิจกรรม' : 'ตารางเมทริกซ์เปรียบเทียบระดับหน่วยงาน'}
        </button>
        <button
          onClick={() => setActiveSubTab('ranking')}
          className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'ranking'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          การจัดลำดับความเสี่ยง & คัดเลือกเข้าแผน
        </button>
        <button
          onClick={() => setActiveSubTab('risk-desc')}
          className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'risk-desc'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          ตารางคำอธิบายความเสี่ยง 8 มิติ (ภาคผนวก 2)
        </button>
        <button
          onClick={() => setActiveSubTab('criteria-guide')}
          className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'criteria-guide'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          เกณฑ์มาตรฐาน 22 ปัจจัยเสี่ยง (ภาคผนวก 4)
        </button>
        <button
          onClick={() => setActiveSubTab('comparison')}
          className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'comparison'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          ตารางเปรียบเทียบ (ควบคุมภายใน VS ตรวจสอบภายใน)
        </button>
        <button
          onClick={() => setActiveSubTab('report')}
          className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'report'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          รายงานทางการเสนอผู้บริหาร (Official Report)
        </button>
      </div>

      {/* =========================================================================
          TAB 1: Matrix View (Activity or Entity Mode)
      ========================================================================= */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          {assessmentMode === 'activity' ? (
            <>
              {/* Controls Bar for Activities */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="ค้นหากิจกรรมที่ประเมิน..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs font-medium"
                  >
                    <option value="all">ทุกหน่วยรับตรวจ</option>
                    <option value="สำนักปลัด">สำนักปลัด</option>
                    <option value="กองคลัง">กองคลัง</option>
                    <option value="กองช่าง">กองช่าง</option>
                    <option value="กองการศึกษา ศาสนาและวัฒนธรรม">กองการศึกษาฯ</option>
                    <option value="กองสวัสดิการสังคม">กองสวัสดิการสังคม</option>
                  </select>

                  <select
                    value={riskLevelFilter}
                    onChange={(e) => setRiskLevelFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs font-medium"
                  >
                    <option value="all">ทุกระดับความเสี่ยง</option>
                    <option value="สูงมาก">สูงมาก (2.6 - 3.0)</option>
                    <option value="สูง">สูง (2.1 - 2.5)</option>
                    <option value="ปานกลาง">ปานกลาง (1.6 - 2.0)</option>
                    <option value="ต่ำ">ต่ำ (1.0 - 1.5)</option>
                  </select>
                </div>

                <div className="text-slate-500 text-[11px]">
                  แสดง {filteredActivities.length} จาก {totalActivities} รายการ
                </div>
              </div>

              {/* Activity Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3 py-3 w-14 text-center">รหัส</th>
                        <th className="px-3 py-3 w-32">หน่วยรับตรวจ</th>
                        <th className="px-4 py-3 min-w-[220px]">กิจกรรมที่ประเมินความเสี่ยง</th>
                        <th className="px-2 py-3 text-center w-12" title="S: ด้านกลยุทธ์/นโยบาย (1-3)">S</th>
                        <th className="px-2 py-3 text-center w-12" title="O: ด้านการดำเนินงาน/ขั้นตอน (1-3)">O</th>
                        <th className="px-2 py-3 text-center w-12" title="F: ด้านการเงิน/งบประมาณ (1-3)">F</th>
                        <th className="px-2 py-3 text-center w-12" title="C: ด้านกฎหมาย/ระเบียบ (1-3)">C</th>
                        <th className="px-2 py-3 text-center w-12" title="K: ด้านความรู้/ไอที (1-3)">K</th>
                        <th className="px-3 py-3 text-center w-16">คะแนน</th>
                        <th className="px-3 py-3 text-center w-24">ระดับความเสี่ยง</th>
                        <th className="px-3 py-3 text-center w-36">การคัดเลือกเข้าแผน</th>
                        <th className="px-3 py-3 text-center w-28 no-print">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredActivities.length === 0 ? (
                        <tr>
                          <td colSpan="12" className="text-center py-12 text-slate-400">
                            <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <div>ยังไม่มีข้อมูลกิจกรรมในจักรวาลการตรวจสอบของปีงบประมาณ {selectedYear}</div>
                            <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                              กดปุ่ม "+ เพิ่มกิจกรรมประเมินใหม่" หรือ "โหลดกิจกรรมมาตรฐาน อปท." เพื่อเริ่มต้นวิเคราะห์ความเสี่ยง
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredActivities.map((item) => {
                          const alreadyInPlan = annualPlans.some((p) => p.title === item.activity);
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                              <td className="px-3 py-3 font-mono font-bold text-center text-slate-500">{item.id}</td>
                              <td className="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200">
                                {item.department}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-slate-900 dark:text-slate-100">{item.activity}</div>
                                {item.reason && (
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                    เหตุผล: {item.reason}
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.sScore}</td>
                              <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.oScore}</td>
                              <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.fScore}</td>
                              <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.cScore}</td>
                              <td className="px-2 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{item.kScore}</td>
                              <td className="px-3 py-3 text-center font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                                {item.score.toFixed(2)}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeClass}`}>
                                  {item.level}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center text-[11px]">
                                {alreadyInPlan ? (
                                  <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                    บรรจุในแผนแล้ว
                                  </span>
                                ) : (
                                  <span className="text-slate-500 dark:text-slate-400">{item.planDecision}</span>
                                )}
                              </td>
                              <td className="px-3 py-3 text-center no-print">
                                <div className="flex items-center justify-center space-x-1">
                                  <button
                                    onClick={() => {
                                      setSelectedRiskDescItem(item);
                                      setActiveSubTab('risk-desc');
                                    }}
                                    className="p-1 rounded-md hover:bg-indigo-50 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                                    title="ดูตารางคำอธิบายความเสี่ยง 8 มิติ"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>

                                  {!alreadyInPlan && (item.level === 'สูงมาก' || item.level === 'สูง') && (
                                    <button
                                      onClick={() => handlePushToAnnualPlan(item)}
                                      className="p-1 rounded-md hover:bg-blue-50 text-blue-600 dark:text-blue-400 cursor-pointer"
                                      title="นำเข้าสู่แผนการตรวจสอบประจำปี"
                                    >
                                      <ArrowRight className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditingItem(item);
                                      setFormData({
                                        department: item.department,
                                        activity: item.activity,
                                        sScore: item.sScore,
                                        oScore: item.oScore,
                                        fScore: item.fScore,
                                        cScore: item.cScore,
                                        kScore: item.kScore,
                                        reason: item.reason || '',
                                        riskScope: item.riskScope || '',
                                        riskOwner: item.riskOwner || '',
                                        tolerance: item.tolerance || '',
                                        existingControls: item.existingControls || '',
                                        mitigation: item.mitigation || ''
                                      });
                                      setShowAddModal(true);
                                    }}
                                    className="p-1 rounded-md hover:bg-slate-100 text-slate-600 dark:text-slate-400 cursor-pointer"
                                    title="แก้ไขคะแนน"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteActivity(item.id)}
                                    className="p-1 rounded-md hover:bg-rose-50 text-rose-600 dark:text-rose-400 cursor-pointer"
                                    title="ลบกิจกรรม"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Entity Level Table (ตัวอย่างที่ 1) */
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  การประเมินความเสี่ยงระดับหน่วยงาน/สำนัก/กอง (Entity Level Assessment)
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  วิเคราะห์เปรียบเทียบระดับความเสี่ยงระหว่างหน่วยรับตรวจ เพื่อจัดสรรทรัพยากรตรวจสอบและกำหนดลำดับความสำคัญในการเข้าตรวจ ตามตัวอย่างที่ 1 (หน้า 36-52)
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-100/70 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-3 py-3 w-16 text-center">รหัส</th>
                      <th className="px-4 py-3 w-44">หน่วยรับตรวจ (สำนัก/กอง)</th>
                      <th className="px-4 py-3 min-w-[200px]">บทบาทภารกิจและกิจกรรมสำคัญ</th>
                      <th className="px-3 py-3 text-center w-24">จำนวนกิจกรรม</th>
                      <th className="px-3 py-3 text-center w-20">คะแนนเฉลี่ย</th>
                      <th className="px-3 py-3 text-center w-28">ระดับความเสี่ยง</th>
                      <th className="px-4 py-3 min-w-[200px]">จุดเน้นการตรวจสอบ (Focus Areas)</th>
                      <th className="px-3 py-3 text-center w-28">ลำดับความสำคัญ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {scoredEntities.map((entity, idx) => (
                      <tr key={entity.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="px-3 py-3 font-mono font-bold text-center text-slate-500">{entity.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {entity.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {entity.roleDescription}
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                          {entity.activityCount} กิจกรรม
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                          {entity.score.toFixed(2)}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${entity.badgeClass}`}>
                            {entity.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">
                          {entity.focusActivities}
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                          {entity.priority}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: Risk Ranking & Prioritization View
      ========================================================================= */}
      {activeSubTab === 'ranking' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  การจัดลำดับคะแนนความเสี่ยงจากสูงสุดไปต่ำสุด (Risk Prioritization Matrix)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  กิจกรรมที่มีคะแนนสูงมาก (2.6 - 3.0) และสูง (2.1 - 2.5) ต้องได้รับการพิจารณาบรรจุเข้าแผนการตรวจสอบประจำปี {selectedYear} เป็นอันดับแรก
                </p>
              </div>

              <div className="text-xs text-slate-500 flex items-center space-x-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">เกณฑ์การตัดสินใจ:</span>
                <span className="text-rose-600 font-bold">สูงมาก = บรรจุทันที</span> •
                <span className="text-amber-600 font-bold">สูง = บรรจุตามกำลังคน</span> •
                <span className="text-yellow-600 font-bold">ปานกลาง = แผน 3 ปี</span>
              </div>
            </div>

            <div className="space-y-3">
              {[...scoredActivities]
                .sort((a, b) => b.score - a.score)
                .map((item, idx) => {
                  const alreadyInPlan = annualPlans.some((p) => p.title === item.activity);
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/40 dark:bg-slate-900/40"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 font-black text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 text-sm">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {item.activity}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeClass}`}>
                              {item.level} ({item.score.toFixed(2)})
                            </span>
                          </div>
                          <div className="text-slate-500">
                            หน่วยรับตรวจ: <strong className="text-slate-700 dark:text-slate-300">{item.department}</strong> •
                            คะแนน 5 มิติ: [ S={item.sScore}, O={item.oScore}, F={item.fScore}, C={item.cScore}, K={item.kScore} ]
                          </div>
                          {item.reason && (
                            <p className="text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                              <strong>เหตุผลความเสี่ยง:</strong> {item.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-2 pt-2 sm:pt-0">
                        {alreadyInPlan ? (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> บรรจุในแผน {selectedYear} แล้ว
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePushToAnnualPlan(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs cursor-pointer text-xs transition-all"
                          >
                            <span>+ นำเข้าแผนตรวจสอบ</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: Risk Description Table (ภาคผนวก 2 หน้า 71)
      ========================================================================= */}
      {activeSubTab === 'risk-desc' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>ตารางคำอธิบายความเสี่ยง (Risk Description / Risk Profile)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  จัดทำตามแบบฟอร์มมาตรฐาน 8 มิติ ภาคผนวก 2 (หน้า 71) ของหนังสือกรมบัญชีกลาง ที่ กค 0416.3/ว 380
                </p>
              </div>

              {/* Selector for Activity */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">เลือกกิจกรรม:</span>
                <select
                  value={selectedRiskDescItem ? selectedRiskDescItem.id : (scoredActivities[0]?.id || '')}
                  onChange={(e) => {
                    const found = scoredActivities.find((a) => a.id === e.target.value);
                    setSelectedRiskDescItem(found || null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none max-w-xs truncate"
                >
                  {scoredActivities.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.id}: {act.activity} ({act.level})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(() => {
              const currentItem = selectedRiskDescItem || scoredActivities[0] || defaultAuditUniverse[0];
              if (!currentItem) {
                return (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    ยังไม่มีข้อมูลกิจกรรม กรุณาเพิ่มกิจกรรมก่อน
                  </div>
                );
              }

              return (
                <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-100 dark:bg-slate-950 p-4 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        คำอธิบายความเสี่ยง: {currentItem.activity}
                      </span>
                      <span className="ml-2 text-slate-500">({currentItem.department})</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentItem.badgeClass || 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                      คะแนน {currentItem.score ? currentItem.score.toFixed(2) : '2.60'} ({currentItem.level || 'สูงมาก'})
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">1. ประเภทความเสี่ยง (Risk Category)</div>
                      <div className="md:col-span-3 text-slate-600 dark:text-slate-400">
                        กรอบ SOFCK 5 มิติ (กลยุทธ์, ปฏิบัติงาน, การเงิน, กฎหมาย, การบริหารความรู้) โดยมีความเสี่ยงเด่นชัดในมิติ {currentItem.score >= 2.6 ? 'Operation (การปฏิบัติงาน) และ Financial (การเงิน)' : 'Operation (การปฏิบัติงาน)'}
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">2. ชื่อปัจจัยเสี่ยง (Risk Factor Name)</div>
                      <div className="md:col-span-3 font-semibold text-slate-800 dark:text-slate-200">
                        {currentItem.reason || currentItem.activity}
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">3. ขอบเขตความเสี่ยง (Scope / Details)</div>
                      <div className="md:col-span-3 text-slate-600 dark:text-slate-400">
                        {currentItem.riskScope || 'กระบวนการดำเนินงาน การรวบรวมเอกสาร การบันทึกข้อมูลในระบบ และการตรวจสอบทานความถูกต้องตามระเบียบที่เกี่ยวข้อง'}
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">4. ผู้รับผิดชอบ (Risk Owner)</div>
                      <div className="md:col-span-3 font-semibold text-slate-800 dark:text-slate-200">
                        {currentItem.riskOwner || `หัวหน้าหน่วยงานและเจ้าหน้าที่ผู้ปฏิบัติงาน ${currentItem.department}`}
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">5. เกณฑ์ความเสี่ยง (Risk Criteria)</div>
                      <div className="md:col-span-3 text-slate-600 dark:text-slate-400">
                        โอกาสเกิดผลกระทบอยู่ในเกณฑ์ระดับ {currentItem.score ? currentItem.score.toFixed(2) : '3.00'} ส่งผลกระทบต่อความถูกต้องของข้อมูลทางการเงินหรือการให้บริการประชาชน
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">6. ขนาดความเสี่ยงที่ยอมรับได้ (Risk Appetite)</div>
                      <div className="md:col-span-3 text-slate-600 dark:text-slate-400">
                        {currentItem.tolerance || 'การปฏิบัติงานต้องเป็นไปตามระเบียบกระทรวงมหาดไทยและกฎหมายที่เกี่ยวข้อง 100% ข้อผิดพลาดทางการเงินต้องเป็น 0%'}
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">7. กลไกการควบคุมภายในที่มีอยู่ (Existing Controls)</div>
                      <div className="md:col-span-3 text-slate-600 dark:text-slate-400">
                        {currentItem.existingControls || 'มีการมอบหมายหน้าที่และหัวหน้าฝ่ายสอบทานเป็นรายบุคคล แต่ยังขาดการสุ่มตรวจประเมินประสิทธิผลอย่างเป็นระบบ'}
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">8. แนวทางการตรวจสอบ / ข้อเสนอแนะ (Audit Recommendation)</div>
                      <div className="md:col-span-3 text-slate-600 dark:text-slate-400">
                        {currentItem.mitigation || 'กำหนดให้บรรจุเป็นเรื่องตรวจสอบหลักในแผนประจำปี ตรวจสอบเอกสารหลักฐาน 100% หรือสุ่มตรวจด้วยวิธี Statistical Sampling และให้คำแนะนำเชิงป้องกัน'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: Official 22 Risk Factors & Criteria Guide (ภาคผนวก 4)
      ========================================================================= */}
      {activeSubTab === 'criteria-guide' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>เกณฑ์มาตรฐาน 22 ปัจจัยเสี่ยง และคำอธิบายระดับคะแนน (ภาคผนวก 4 หน้า 76-82)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                แนวปฏิบัติการตรวจสอบภายในภาคราชการ: การประเมินความเสี่ยงเพื่อวางแผนการตรวจสอบ ตามหนังสือกรมบัญชีกลาง ที่ กค 0416.3/ว 380
              </p>
            </div>

            {/* Formula & Interval Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/60 dark:to-indigo-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>สูตรคำนวณช่วงคะแนนและการแปลผล (Rating Interval Formula)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600 dark:text-slate-400">
                <div>
                  <p><strong>สูตรการคำนวณความกว้างของช่วงคะแนน:</strong></p>
                  <code className="block bg-white dark:bg-slate-900 p-2 rounded-lg mt-1 border border-slate-200 dark:border-slate-700 font-mono text-blue-600 dark:text-blue-400">
                    Interval = (คะแนนสูงสุด - คะแนนต่ำสุด) / จำนวนระดับ = (3 - 1) / 3 = 0.67
                  </code>
                </div>
                <div>
                  <p><strong>เกณฑ์การแปลผลระดับความเสี่ยง 4 ระดับ (สากล):</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li><strong className="text-rose-600">2.60 - 3.00 (สูงมาก):</strong> ต้องบรรจุในแผนประจำปีทันที (Priority 1)</li>
                    <li><strong className="text-amber-600">2.10 - 2.59 (สูง):</strong> บรรจุในแผนประจำปีตามอัตรากำลัง (Priority 2)</li>
                    <li><strong className="text-yellow-600">1.60 - 2.09 (ปานกลาง):</strong> แผนระยะยาว 3 ปี / หมุนเวียน 2-3 ปี</li>
                    <li><strong className="text-emerald-600">1.00 - 1.59 (ต่ำ):</strong> เฝ้าระวัง / ใช้ระบบควบคุมภายในปกติ</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 22 Factors Table */}
            <div className="space-y-4 pt-2">
              {['S', 'O', 'K', 'F', 'C'].map((dim) => {
                const factors = OFFICIAL_22_RISK_FACTORS.filter((f) => f.dimension === dim);
                const dimTitle = factors[0]?.dimensionName || dim;
                return (
                  <div key={dim} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                      <span>{dimTitle}</span>
                      <span className="text-[10px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
                        {factors.length} ปัจจัยเสี่ยง
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {factors.map((factor) => (
                        <div key={factor.id} className="p-4 text-xs space-y-2 hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 mr-2">{factor.id}</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">{factor.title}</span>
                              <p className="text-[11px] text-slate-500 mt-0.5">{factor.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                            <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                              <div className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px] mb-1">
                                ระดับ 1: ความเสี่ยงต่ำ (Low)
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">{factor.criteria.low}</div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-yellow-50/60 dark:bg-yellow-950/20 border border-yellow-200/60 dark:border-yellow-900/40">
                              <div className="font-bold text-yellow-700 dark:text-yellow-300 text-[11px] mb-1">
                                ระดับ 2: ความเสี่ยงปานกลาง (Medium)
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">{factor.criteria.medium}</div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                              <div className="font-bold text-rose-700 dark:text-rose-300 text-[11px] mb-1">
                                ระดับ 3: ความเสี่ยงสูง (High)
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">{factor.criteria.high}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: Comparison Table (ภาคผนวก 1 หน้า 69-70)
      ========================================================================= */}
      {activeSubTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <span>ตารางเปรียบเทียบการประเมินความเสี่ยง (ภาคผนวก 1 หน้า 69-70)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ความแตกต่างระหว่างการประเมินความเสี่ยงเพื่อจัดวางระบบควบคุมภายใน (ฝ่ายบริหาร) กับการประเมินความเสี่ยงเพื่อวางแผนการตรวจสอบ (ผู้ตรวจสอบภายใน)
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 w-1/4">ประเด็นเปรียบเทียบ</th>
                    <th className="p-3.5 w-3/8 text-slate-700 dark:text-slate-300 bg-blue-50/40 dark:bg-blue-950/20">
                      1. การประเมินความเสี่ยงเพื่อจัดวางระบบการควบคุมภายใน<br />
                      <span className="text-[11px] font-normal text-slate-500">(ดำเนินการโดยฝ่ายบริหาร/หน่วยรับตรวจ)</span>
                    </th>
                    <th className="p-3.5 w-3/8 text-slate-700 dark:text-slate-300 bg-indigo-50/40 dark:bg-indigo-950/20">
                      2. การประเมินความเสี่ยงเพื่อวางแผนการตรวจสอบภายใน<br />
                      <span className="text-[11px] font-normal text-slate-500">(ดำเนินการโดยผู้ตรวจสอบภายใน)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {COMPARISON_TABLE_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 leading-relaxed">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 align-top">
                        {row.aspect}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 align-top bg-blue-50/20 dark:bg-blue-950/10">
                        {row.ic}
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 align-top bg-indigo-50/20 dark:bg-indigo-950/10 font-medium">
                        {row.ia}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>ข้อสังเกตสำคัญตามหลักการตรวจสอบภายใน:</span>
              </div>
              <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                ผู้ตรวจสอบภายในต้องไม่เป็นผู้จัดวางหรือกำหนดกิจกรรมการควบคุมภายในให้ฝ่ายบริหาร
                เพราะจะทำให้ขาดความเป็นอิสระ (Loss of Independence) ในการตรวจสอบภายหลัง
                การประเมินความเสี่ยงในเมนูนี้มีวัตถุประสงค์เฉพาะเพื่อจัดทำ <strong>"แผนการตรวจสอบประจำปี (Annual Audit Plan)"</strong> และจัดสรรชั่วโมงตรวจสอบให้เกิดความคุ้มค่าสูงสุดเท่านั้น
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: Official Print Report
      ========================================================================= */}
      {activeSubTab === 'report' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* Header */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 text-center space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              รายงานผลการประเมินความเสี่ยงเพื่อจัดทำแผนการตรวจสอบภายใน
            </h2>
            <div className="text-base font-semibold text-slate-700 dark:text-slate-300">
              ประจำปีงบประมาณ พ.ศ. {selectedYear}
            </div>
            <div className="text-xs text-slate-500">
              {orgProfile.agencyName || 'หน่วยตรวจสอบภายใน'} {orgProfile.name} {orgProfile.district} {orgProfile.province}
            </div>
            <div className="text-[11px] text-slate-400">
              (จัดทำตามแนวปฏิบัติการตรวจสอบภายในภาคราชการ: การประเมินความเสี่ยงเพื่อวางแผนการตรวจสอบ หนังสือกรมบัญชีกลาง ที่ กค 0416.3/ว 380)
            </div>
          </div>

          <div className="space-y-5 text-xs sm:text-sm">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">1. หลักการและเหตุผล</h4>
              <p className="indent-8 text-justify leading-relaxed mt-1 text-slate-700 dark:text-slate-300">
                ตามพระราชบัญญัติวินัยการเงินการคลังของรัฐ พ.ศ. 2561 มาตรา 79 และหลักเกณฑ์กระทรวงการคลังว่าด้วยมาตรฐานและหลักเกณฑ์ปฏิบัติการตรวจสอบภายในสำหรับหน่วยงานของรัฐ พ.ศ. 2561 รหัส 2010 กำหนดให้ผู้ตรวจสอบภายในต้องจัดทำแผนการตรวจสอบประจำปีที่สอดคล้องกับวัตถุประสงค์เชิงกลยุทธ์และการบริหารความเสี่ยงของหน่วยงาน
                ประกอบกับหนังสือกรมบัญชีกลาง ที่ กค 0416.3/ว 380 ลงวันที่ 8 ธันวาคม 2546 เรื่อง แนวปฏิบัติการตรวจสอบภายในภาคราชการ: การประเมินความเสี่ยงเพื่อวางแผนการตรวจสอบ
                หน่วยตรวจสอบภายใน {orgProfile.name} จึงได้ดำเนินการสำรวจข้อมูลเบื้องต้นและประเมินความเสี่ยงกิจกรรมในจักรวาลการตรวจสอบ (Audit Universe) ประจำปีงบประมาณ พ.ศ. {selectedYear}
                เพื่อใช้เป็นเกณฑ์ในการคัดเลือกกิจกรรมที่มีความเสี่ยงสูงบรรจุเข้าสู่แผนการตรวจสอบประจำปี
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">2. กรอบแนวคิดการประเมินความเสี่ยง 5 มิติ (SOFCK Framework)</h4>
              <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                การประเมินความเสี่ยงได้นำปัจจัยเสี่ยง 22 ด้าน ตามภาคผนวก 4 มาจัดกลุ่มใน 5 มิติ ดังนี้:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-slate-700 dark:text-slate-300">
                <li><strong>S (Strategic):</strong> นโยบายผู้บริหาร แผนกลยุทธ์ ค่านิยมร่วม และการบริหารทรัพยากรบุคคล</li>
                <li><strong>O (Operational):</strong> การมอบหมายงาน ระบบการควบคุมภายใน คู่มือปฏิบัติงาน การกระจายตัวของงาน ผลงานเทียบเป้าหมาย ประวัติข้อทักท้วงเดิม พัสดุ และผลกระทบต่อประชาชน</li>
                <li><strong>K (Knowledge & IT):</strong> ความรู้ความสามารถของผู้บริหาร การจัดการฐานข้อมูล และการฝึกอบรมพัฒนาทักษะ</li>
                <li><strong>F (Financial):</strong> ความถูกต้องของรายงานการเงินในระบบ New e-LAAS และขนาดวงเงินงบประมาณ</li>
                <li><strong>C (Compliance):</strong> กฎหมาย ระเบียบ ข้อบังคับ มติ ครม. และการติดตามข้อเสนอแนะของผู้ตรวจสอบ</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">3. สรุปผลกิจกรรมที่ผ่านการคัดเลือกบรรจุเข้าสู่แผนการตรวจสอบประจำปี พ.ศ. {selectedYear}</h4>
              <div className="mt-2 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 w-12 text-center">ลำดับ</th>
                      <th className="p-2.5">กิจกรรมที่ได้รับการคัดเลือก</th>
                      <th className="p-2.5 w-28">หน่วยรับตรวจ</th>
                      <th className="p-2.5 w-20 text-center">คะแนนเฉลี่ย</th>
                      <th className="p-2.5 w-24 text-center">ระดับความเสี่ยง</th>
                      <th className="p-2.5 w-32 text-center">สถานะในแผน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {scoredActivities
                      .filter((i) => i.level === 'สูงมาก' || i.level === 'สูง')
                      .map((item, idx) => (
                        <tr key={item.id}>
                          <td className="p-2.5 text-center">{idx + 1}</td>
                          <td className="p-2.5 font-semibold text-slate-900 dark:text-slate-100">{item.activity}</td>
                          <td className="p-2.5">{item.department}</td>
                          <td className="p-2.5 text-center font-mono font-bold">{item.score.toFixed(2)}</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeClass}`}>
                              {item.level}
                            </span>
                          </td>
                          <td className="p-2.5 text-center text-[11px] text-emerald-600 font-semibold">
                            บรรจุในแผนแล้ว
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">4. ข้อเสนอแนะและการดำเนินการต่อไป</h4>
              <p className="indent-8 text-justify leading-relaxed mt-1 text-slate-700 dark:text-slate-300">
                สำหรับกิจกรรมที่มีความเสี่ยงระดับปานกลางและระดับต่ำ หน่วยตรวจสอบภายในจะจัดทำแผนการตรวจสอบระยะยาว (3 ปี)
                และหมุนเวียนเข้าตรวจสอบตามรอบเวลา พร้อมทั้งประสานให้หน่วยรับตรวจประเมินและปรับปรุงระบบการควบคุมภายในอย่างสม่ำเสมอ
              </p>
            </div>

            {/* Signatures */}
            <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-8">
                <div>(ลงชื่อ)........................................................</div>
                <div>
                  <div className="font-bold">({orgProfile.auditorName || 'ผู้ตรวจสอบภายใน'})</div>
                  <div className="text-slate-500">{orgProfile.auditorPosition || 'นักวิชาการตรวจสอบภายใน'}</div>
                  <div className="text-[11px] text-slate-400">ผู้ประเมินความเสี่ยง</div>
                </div>
              </div>

              <div className="space-y-8">
                <div>(ลงชื่อ)........................................................</div>
                <div>
                  <div className="font-bold">({orgProfile.approverName || 'นายกองค์กรปกครองส่วนท้องถิ่น'})</div>
                  <div className="text-slate-500">{orgProfile.approverPosition || 'นายก อปท.'}</div>
                  <div className="text-[11px] text-slate-400">ผู้อนุมัติผลการประเมิน</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: Add / Edit Activity
      ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingItem ? 'แก้ไขการประเมินความเสี่ยงกิจกรรม' : 'เพิ่มกิจกรรมในจักรวาลการตรวจสอบ (Audit Universe)'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">หน่วยรับตรวจ</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="กองคลัง">กองคลัง</option>
                  <option value="กองช่าง">กองช่าง</option>
                  <option value="กองการศึกษา ศาสนาและวัฒนธรรม">กองการศึกษา ศาสนาและวัฒนธรรม</option>
                  <option value="กองสวัสดิการสังคม">กองสวัสดิการสังคม</option>
                  <option value="สำนักปลัด">สำนักปลัด</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อกิจกรรมที่ประเมิน</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การจัดซื้อจัดจ้างงานโครงการก่อสร้าง..."
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>คะแนนปัจจัยเสี่ยง 5 มิติ (SOFCK Framework 1-3 คะแนน)</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                    เฉลี่ย: {((Number(formData.sScore) + Number(formData.oScore) + Number(formData.fScore) + Number(formData.cScore) + Number(formData.kScore)) / 5).toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-[11px]">
                  <div>
                    <label className="font-semibold block mb-1">S (กลยุทธ์)</label>
                    <select
                      value={formData.sScore}
                      onChange={(e) => setFormData({ ...formData, sScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1 (ต่ำ)</option>
                      <option value="2">2 (กลาง)</option>
                      <option value="3">3 (สูง)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">O (การทำงาน)</label>
                    <select
                      value={formData.oScore}
                      onChange={(e) => setFormData({ ...formData, oScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1 (ต่ำ)</option>
                      <option value="2">2 (กลาง)</option>
                      <option value="3">3 (สูง)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">F (การเงิน)</label>
                    <select
                      value={formData.fScore}
                      onChange={(e) => setFormData({ ...formData, fScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1 (ต่ำ)</option>
                      <option value="2">2 (กลาง)</option>
                      <option value="3">3 (สูง)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">C (ระเบียบ)</label>
                    <select
                      value={formData.cScore}
                      onChange={(e) => setFormData({ ...formData, cScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1 (ต่ำ)</option>
                      <option value="2">2 (กลาง)</option>
                      <option value="3">3 (สูง)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">K (ความรู้/IT)</label>
                    <select
                      value={formData.kScore}
                      onChange={(e) => setFormData({ ...formData, kScore: Number(e.target.value) })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="1">1 (ต่ำ)</option>
                      <option value="2">2 (กลาง)</option>
                      <option value="3">3 (สูง)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">เหตุผลความเสี่ยง / ประเด็นข้อตรวจพบเดิม</label>
                <textarea
                  rows="2"
                  placeholder="ระบุเหตุผลความเสี่ยง หรือประเด็นข้อตรวจพบเดิมในอดีต..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 outline-none"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ผู้รับผิดชอบความเสี่ยง (Risk Owner)</label>
                <input
                  type="text"
                  placeholder="เช่น ผู้อำนวยการกองคลัง / หัวหน้าฝ่ายพัสดุ"
                  value={formData.riskOwner}
                  onChange={(e) => setFormData({ ...formData, riskOwner: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  บันทึกการประเมิน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: Criteria Reference Modal
      ========================================================================= */}
      {showCriteriaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-3xl w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>คู่มือเกณฑ์ 22 ปัจจัยเสี่ยง (ภาคผนวก 4 หนังสือ กค 0416.3/ว 380)</span>
              </h3>
              <button
                onClick={() => setShowCriteriaModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              ใช้ประกอบการกำหนดคะแนน 1, 2, หรือ 3 ในแต่ละมิติ (SOFCK) สำหรับการประเมินความเสี่ยงกิจกรรมหรือหน่วยรับตรวจ:
            </p>

            <div className="space-y-3">
              {OFFICIAL_22_RISK_FACTORS.map((factor) => (
                <div key={factor.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 mb-1">
                    <span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 mr-2">{factor.id}</span>
                      {factor.title} ({factor.dimensionName})
                    </span>
                  </div>
                  <p className="text-slate-500 mb-2">{factor.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                      <strong>1 (ต่ำ):</strong> {factor.criteria.low}
                    </div>
                    <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300">
                      <strong>2 (กลาง):</strong> {factor.criteria.medium}
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300">
                      <strong>3 (สูง):</strong> {factor.criteria.high}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCriteriaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
