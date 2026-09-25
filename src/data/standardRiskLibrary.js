/**
 * คลังความเสี่ยงและภารกิจมาตรฐานสำหรับองค์กรปกครองส่วนท้องถิ่น (อปท.)
 * อ้างอิงตาม:
 * 1. หนังสือกระทรวงมหาดไทย ด่วนที่สุด ที่ มท ๐๘๐๕.๒/ว ๓๔๘๒ ลว. ๑๘ สิงหาคม ๒๕๖๖
 * 2. หลักเกณฑ์กระทรวงการคลังว่าด้วยมาตรฐานและหลักเกณฑ์ปฏิบัติการบริหารจัดการความเสี่ยงสำหรับหน่วยงานของรัฐ พ.ศ. ๒๕๖๒
 */

export const RISK_CATEGORIES_LIST = [
  { id: 'strategy', label: 'ด้านกลยุทธ์ (Strategic Risks)', code: 'S', desc: 'ความเสี่ยงจากนโยบาย เป้าหมาย หรือการเปลี่ยนแปลงภายนอก' },
  { id: 'operation', label: 'ด้านการดำเนินงาน (Operation Risks)', code: 'O', desc: 'ความเสี่ยงจากกระบวนการทำงาน บุคลากร หรือระบบงานภายใน' },
  { id: 'financial', label: 'ด้านการเงิน (Financial Risks)', code: 'F', desc: 'ความเสี่ยงด้านรายได้ งบประมาณ การเบิกจ่าย หรือสินทรัพย์' },
  { id: 'compliance', label: 'ด้านการปฏิบัติตามกฎระเบียบ (Compliance / Legal Risks)', code: 'C', desc: 'ความเสี่ยงจากการไม่ปฏิบัติตาม พ.ร.บ. ระเบียบ มท. หรือหนังสือสั่งการ' },
  { id: 'it', label: 'ด้านเทคโนโลยีสารสนเทศ (IT Risks)', code: 'IT', desc: 'ความเสี่ยงด้านความมั่นคงปลอดภัยไซเบอร์ ข้อมูลรั่วไหล หรือระบบขัดข้อง' },
  { id: 'reputation', label: 'ด้านชื่อเสียงและภาพลักษณ์ (Reputation Risks)', code: 'R', desc: 'ความเสี่ยงจากการร้องเรียน ความไม่โปร่งใส หรือทัศนคติประชาชน' }
];

export const RISK_RESPONSES_LIST = [
  { id: 'reduce_likelihood', label: 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)', desc: 'กำหนดการควบคุมหรือวิธีปฏิบัติเพิ่มเติมเพื่อป้องกันไม่ให้เหตุการณ์เกิดขึ้น' },
  { id: 'reduce_impact', label: 'การลดผลกระทบของความเสี่ยง (Reduce Impact)', desc: 'จัดทำแผนเผชิญเหตุหรือมาตรการบรรเทาความเสียหายเมื่อเกิดเหตุ' },
  { id: 'share', label: 'การกระจายความเสี่ยง (Share Risk)', desc: 'กระจายภาระงานหรือขั้นตอนให้หลายฝ่ายร่วมกันตรวจสอบ' },
  { id: 'transfer', label: 'การแบ่งปัน/โอนความเสี่ยง (Transfer Risk)', desc: 'โอนภาระความเสี่ยงให้บุคคลภายนอก เช่น การทำประกันภัย หรือการจ้างเหมา' },
  { id: 'accept', label: 'การยอมรับความเสี่ยง (Accept Risk)', desc: 'ยอมรับความเสี่ยงที่อยู่ในระดับต่ำหรือคุ้มค่ากับค่าใช้จ่ายในการควบคุม' },
  { id: 'avoid', label: 'การหลีกเลี่ยงความเสี่ยง (Avoid Risk)', desc: 'ปรับเปลี่ยนโครงการหรือแนวทางเพื่อไม่ให้เผชิญกับความเสี่ยงนั้น' }
];

/**
 * ฐานข้อมูลภารกิจและความเสี่ยงมาตรฐานรายกอง (Standard Local Gov Risk Database)
 */
export const STANDARD_RISK_LIBRARY = {
  'กองคลัง': [
    {
      riskId: 'LIB-FIN-01',
      activity: 'การจัดเก็บภาษีที่ดินและสิ่งปลูกสร้าง และภาษีป้าย',
      strategy: 'ยุทธศาสตร์การพัฒนาด้านการบริหารจัดการและการคลังท้องถิ่นอย่างยั่งยืน',
      budget: 150000,
      objective: 'เพื่อจัดเก็บรายได้ภาษีท้องถิ่นได้ครบถ้วน ถูกต้องตามเป้าหมายงบประมาณ เป็นธรรม และโปร่งใส',
      kpi: 'ร้อยละของการจัดเก็บภาษีที่ดินและสิ่งปลูกสร้างได้ตามเป้าหมายประมาณการรายรับ (ไม่น้อยกว่า 95%)',
      target: 'จัดเก็บรายได้ครบถ้วนตามเป้าหมาย ไม่มีข้อร้องเรียนการประเมินผิดพลาด ไม่ตกหล่น',
      riskEvent: 'การจัดเก็บภาษีที่ดินและสิ่งปลูกสร้างไม่เป็นไปตามเป้าหมาย หรือตกหล่นแปลงที่ดิน/สิ่งปลูกสร้าง',
      cause: 'ข้อมูลแปลงที่ดินในระบบแผนที่ภาษี (LTAX GIS/LTAX 3000) ยังไม่เป็นปัจจุบัน และการสำรวจภาคสนามไม่ครอบคลุม',
      riskCategory: 'ด้านการเงิน (Financial Risks)',
      likelihood: 4,
      impact: 3,
      riskScore: 12,
      riskLevel: 'สูง',
      riskResponse: 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)',
      treatmentMeasures: '1. จัดโครงการออกสำรวจและปรับปรุงข้อมูลแปลงที่ดินและสิ่งปลูกสร้างเชิงรุกทุกหมู่บ้าน\n2. บูรณาการฐานข้อมูล LTAX ร่วมกับสำนักงานที่ดินจังหวัด\n3. จัดระบบแจ้งเตือนและชำระภาษีผ่านช่องทางอิเล็กทรอนิกส์ (QR Code/ธนาคาร)',
      kpiMeasure: 'ร้อยละของข้อมูลแปลงที่ดินได้รับการปรับปรุงในระบบ LTAX เป็นปัจจุบัน (100%)',
      timeline: 'ต.ค. 2568 - มี.ค. 2569 (รอบ 6 เดือนแรก)',
      responsiblePerson: 'ผู้อำนวยการกองคลัง / หัวหน้าฝ่ายพัฒนารายได้',
      monitoringMethod: 'รายงานผลความคืบหน้าการจัดเก็บภาษีในที่ประชุมประจำเดือนของ อปท. ทุกเดือน',
      expectedPostLikelihood: 2,
      expectedPostImpact: 2,
      expectedResidualScore: 4,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    },
    {
      riskId: 'LIB-FIN-02',
      activity: 'การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ',
      strategy: 'ยุทธศาสตร์การบริหารจัดการบ้านเมืองที่ดีและเสริมสร้างความโปร่งใส',
      budget: 200000,
      objective: 'เพื่อให้การจัดซื้อจัดจ้างถูกต้องตาม พ.ร.บ. จัดซื้อจัดจ้างฯ 2560 คุ้มค่า โปร่งใส และได้พัสดุมีคุณภาพตามกำหนด',
      kpi: 'ร้อยละของกระบวนการจัดซื้อจัดจ้างที่ปฏิบัติตามระเบียบและไม่มีข้อทักท้วงจากหน่วยตรวจสอบ (100%)',
      target: 'ไม่มีการอุทธรณ์ผลจัดซื้อจัดจ้าง ไม่เกิดการตรวจรับพัสดุล่าช้า และไม่มีพัสดุสูญหาย',
      riskEvent: 'การจัดซื้อจัดจ้างล่าช้า หรือพัสดุ/ครุภัณฑ์สูญหาย ไม่มีการควบคุมทะเบียนคุมพัสดุที่รัดกุม',
      cause: 'เจ้าหน้าที่ผู้ปฏิบัติงานขาดความเชี่ยวชาญในระเบียบพัสดุ e-GP และการตรวจนับพัสดุประจำปีไม่ต่อเนื่อง',
      riskCategory: 'ด้านการปฏิบัติตามกฎระเบียบ (Compliance / Legal Risks)',
      likelihood: 3,
      impact: 4,
      riskScore: 12,
      riskLevel: 'สูง',
      riskResponse: 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)',
      treatmentMeasures: '1. จัดทำคู่มือปฏิบัติงาน (SOP) ขั้นตอนการจัดซื้อจัดจ้างและการตรวจรับพัสดุตามระเบียบใหม่\n2. บันทึกและติดบาร์โค้ดครุภัณฑ์ทุกรายการ พร้อมตรวจนับผ่านระบบดิจิทัล\n3. จัดตั้งคณะกรรมการสอบทานราคากลางและเงื่อนไข TOR ก่อนประกาศเชิญชวน',
      kpiMeasure: 'โครงการจัดซื้อจัดจ้างแล้วเสร็จตามแผนและตรวจนับครุภัณฑ์ได้ครบถ้วน (100%)',
      timeline: 'ตลอดปีงบประมาณ',
      responsiblePerson: 'ผู้อำนวยการกองคลัง / หัวหน้าฝ่ายพัสดุและทรัพย์สิน',
      monitoringMethod: 'รายงานสรุปผลการจัดซื้อจัดจ้างและรายงานการตรวจสอบพัสดุประจำปีเสนอผู้บริหาร',
      expectedPostLikelihood: 1,
      expectedPostImpact: 2,
      expectedResidualScore: 2,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    },
    {
      riskId: 'LIB-FIN-03',
      activity: 'การบริหารและเร่งรัดหนี้เงินยืมทดรองราชการ (มท 0808.2/ว 257)',
      strategy: 'ยุทธศาสตร์การพัฒนาวินัยการเงินการคลังขององค์กรปกครองส่วนท้องถิ่น',
      budget: 0,
      objective: 'เพื่อกำกับให้การส่งใช้เงินยืมเป็นไปตามกำหนดเวลา 30 วัน และไม่มีลูกหนี้เงินยืมค้างชำระข้ามปีงบประมาณ',
      kpi: 'ร้อยละของสัญญาเงินยืมที่ส่งใช้เงินยืมภายในกำหนด 30 วันนับแต่วันสิ้นสุดโครงการ (100%)',
      target: 'หนี้เงินยืมคงค้างข้ามปีงบประมาณเป็น 0 บาท',
      riskEvent: 'ผู้ยืมเงินไม่ส่งใช้เงินยืมตามกำหนดเวลา 30 วัน หรือมีหนี้เงินยืมค้างชำระข้ามปีงบประมาณ',
      cause: 'ผู้ยืมเงินรวบรวมเอกสารใบเสร็จล่าช้า และขาดระบบแจ้งเตือนกำหนดเวลาส่งใช้เงินยืมอัตโนมัติ',
      riskCategory: 'ด้านการเงิน (Financial Risks)',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'ปานกลาง',
      riskResponse: 'การลดผลกระทบของความเสี่ยง (Reduce Impact)',
      treatmentMeasures: '1. บันทึกระบบแจ้งเตือนล่วงหน้า 7 วันก่อนครบกำหนด 30 วันไปยังผู้ยืมเงิน\n2. บังคับใช้มาตรการงดอนุมัติเงินยืมสัญญาใหม่หากสัญญายืมเดิมยังไม่ส่งใช้ตามระเบียบ ว 257\n3. จัดทำบัญชีคุมลูกหนี้เงินยืมรายบุคคลรายงานนายก อปท. ทุกสิ้นเดือน',
      kpiMeasure: 'จำนวนสัญญาเงินยืมค้างชำระเกินกำหนดเวลาลดลงเป็นศูนย์ (0 ราย)',
      timeline: 'ตลอดปีงบประมาณ',
      responsiblePerson: 'ผู้อำนวยการกองคลัง / เจ้าหน้าที่การเงินและบัญชี',
      monitoringMethod: 'รายงานสถานะลูกหนี้เงินยืมประจำเดือนต่อนายก อปท. และส่งให้หน่วยตรวจสอบภายใน',
      expectedPostLikelihood: 1,
      expectedPostImpact: 2,
      expectedResidualScore: 2,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    }
  ],

  'กองช่าง': [
    {
      riskId: 'LIB-ENG-01',
      activity: 'โครงการก่อสร้างและปรับปรุงถนน คสล. สะพาน และท่อระบายน้ำ',
      strategy: 'ยุทธศาสตร์การพัฒนาโครงสร้างพื้นฐาน การคมนาคม และผังเมือง',
      budget: 2500000,
      objective: 'เพื่อให้การก่อสร้างโครงสร้างพื้นฐานได้มาตรฐานวิศวกรรม มีความปลอดภัย และแล้วเสร็จตามกำหนดเวลาในสัญญาจ้าง',
      kpi: 'ร้อยละของโครงการก่อสร้างที่แล้วเสร็จและตรวจรับงานจ้างได้ตามสัญญาโดยไม่มีการทิ้งงาน (100%)',
      target: 'โครงการแล้วเสร็จตามกำหนดเวลา ได้มาตรฐานวิศวกรรม ไม่มีข้อพิพาทค่าปรับ',
      riskEvent: 'งานจ้างก่อสร้างไม่แล้วเสร็จตามกำหนดเวลาในสัญญาจ้าง หรือผู้รับจ้างทิ้งงานก่อสร้าง',
      cause: 'สภาพอากาศฤดูฝน ผู้รับจ้างขาดสภาพคล่องทางการเงิน หรือการส่งมอบพื้นที่ก่อสร้างล่าช้าจากข้อพิพาทแนวเขต',
      riskCategory: 'ด้านการดำเนินงาน (Operation Risks)',
      likelihood: 4,
      impact: 4,
      riskScore: 16,
      riskLevel: 'สูงมาก',
      riskResponse: 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)',
      treatmentMeasures: '1. ตรวจสอบความพร้อมและเคลียร์แนวเขตพื้นที่ก่อสร้างร่วมกับราษฎรก่อนลงนามในสัญญาจ้าง\n2. แต่งตั้งผู้ควบคุมงานออกตรวจหน้างานสัปดาห์ละไม่น้อยกว่า 2 ครั้ง พร้อมทำบันทึกรายงานผล\n3. ประชุมเร่งรัดและทำหนังสือแจ้งเตือนผู้รับจ้างทันทีเมื่องานล่าช้ากว่าแผนสะสมเกิน 15%',
      kpiMeasure: 'ร้อยละของโครงการก่อสร้างแล้วเสร็จตามสัญญาจ้าง (ไม่น้อยกว่า 90%)',
      timeline: 'ตลอดปีงบประมาณ',
      responsiblePerson: 'ผู้อำนวยการกองช่าง / วิศวกรโยธา / นายช่างโยธา',
      monitoringMethod: 'รายงานผลความก้าวหน้าโครงการก่อสร้างต่อนายก อปท. ทุก 15 วัน',
      expectedPostLikelihood: 2,
      expectedPostImpact: 2,
      expectedResidualScore: 4,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    },
    {
      riskId: 'LIB-ENG-02',
      activity: 'การคำนวณราคากลางงานก่อสร้าง (Factor F และราคาวัสดุก่อสร้าง)',
      strategy: 'ยุทธศาสตร์การบริหารจัดการบ้านเมืองที่ดีและเสริมสร้างความโปร่งใส',
      budget: 0,
      objective: 'เพื่อให้การกำหนดราคากลางถูกต้องตามหลักเกณฑ์กระทรวงการคลัง สะท้อนราคาตลาด และประหยัดงบประมาณ',
      kpi: 'ร้อยละของแบบรูปรายการและประมาณการราคากลางถูกต้องตามหลักเกณฑ์คำนวณ Factor F (100%)',
      target: 'ไม่มีข้อทักท้วงเรื่องราคากลางคลาดเคลื่อนจาก สตง. หรือหน่วยตรวจสอบ',
      riskEvent: 'การคำนวณราคากลางงานก่อสร้างคลาดเคลื่อน เช่น ใช้ตาราง Factor F ผิดประเภท หรือราคาวัสดุไม่ตรงดัชนีพาณิชย์',
      cause: 'การเปลี่ยนแปลงตาราง Factor F และอัตราดอกเบี้ยเงินกู้ของกรมบัญชีกลางเกิดขึ้นบ่อย และขาดการสอบทานคู่ขนาน',
      riskCategory: 'ด้านการปฏิบัติตามกฎระเบียบ (Compliance / Legal Risks)',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'ปานกลาง',
      riskResponse: 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)',
      treatmentMeasures: '1. ใช้ระบบคำนวณ Factor F อัตโนมัติในโปรแกรม IA-OS ปี 2570 เพื่อป้องกันความผิดพลาดจากการคำนวณมือ\n2. อัปเดตตารางพาณิชย์จังหวัดและราคาวัสดุก่อสร้างเป็นประจำทุกเดือน\n3. ให้มีผู้สอบทานการคำนวณราคากลางอย่างน้อย 2 คน ก่อนเสนอคณะกรรมการกำหนดราคากลาง',
      kpiMeasure: 'ความถูกต้องของเอกสารคำนวณราคากลางผ่านการสอบทาน 100%',
      timeline: 'ตลอดปีงบประมาณ',
      responsiblePerson: 'ผู้อำนวยการกองช่าง / นายช่างโยธาผู้คำนวณราคากลาง',
      monitoringMethod: 'ตรวจสอบบันทึกการคำนวณราคากลางแนบแฟ้มขออนุมัติจัดซื้อจัดจ้างทุกโครงการ',
      expectedPostLikelihood: 1,
      expectedPostImpact: 2,
      expectedResidualScore: 2,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    }
  ],

  'สำนักปลัด': [
    {
      riskId: 'LIB-PLT-01',
      activity: 'การคุ้มครองข้อมูลส่วนบุคคล (PDPA) และระบบสารบรรณอิเล็กทรอนิกส์',
      strategy: 'ยุทธศาสตร์การพัฒนาองค์กรสู่การเป็นรัฐบาลดิจิทัลและการบริการประชาชน',
      budget: 80000,
      objective: 'เพื่อรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคลของประชาชนและเอกสารลับทางราชการตามกฎหมาย PDPA',
      kpi: 'จำนวนครั้งของเหตุการณ์ข้อมูลส่วนบุคคลรั่วไหลหรือการละเมิดสิทธิ์ข้อมูล (0 ครั้ง)',
      target: 'ไม่มีข้อร้องเรียนหรือการดำเนินคดีเกี่ยวกับการละเมิดข้อมูลส่วนบุคคล',
      riskEvent: 'การรั่วไหลหรือการเข้าถึงข้อมูลส่วนบุคคลของประชาชนโดยมิชอบ ผ่านระบบบริการหรือเอกสารคำร้อง',
      cause: 'การกำหนดสิทธิ์เข้าถึงข้อมูลในระบบคอมพิวเตอร์ยังไม่แบ่งแยกชัดเจน และเจ้าหน้าที่ยังขาดความตระหนักรู้กฎหมาย PDPA',
      riskCategory: 'ด้านเทคโนโลยีสารสนเทศ (IT Risks)',
      likelihood: 3,
      impact: 4,
      riskScore: 12,
      riskLevel: 'สูง',
      riskResponse: 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)',
      treatmentMeasures: '1. ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล (Privacy Policy) และแต่งตั้งเจ้าหน้าที่ DPO ประจำ อปท.\n2. กำหนดรหัสผ่านและการเข้าถึงข้อมูลเฉพาะเจ้าหน้าที่ที่ได้รับมอบหมายตามสิทธิ์งาน\n3. จัดอบรมแนวทางปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคลให้แก่พนักงานทุกคน',
      kpiMeasure: 'พนักงานและเจ้าหน้าที่ผ่านการอบรม PDPA ไม่น้อยกว่าร้อยละ 90',
      timeline: 'ต.ค. 2568 - มี.ค. 2569',
      responsiblePerson: 'หัวหน้าสำนักปลัด / เจ้าหน้าที่เทคโนโลยีสารสนเทศ',
      monitoringMethod: 'สุ่มตรวจสิทธิ์การเข้าถึงข้อมูลระบบฐานข้อมูลทุกไตรมาส',
      expectedPostLikelihood: 1,
      expectedPostImpact: 2,
      expectedResidualScore: 2,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    },
    {
      riskId: 'LIB-PLT-02',
      activity: 'การจัดทำข้อบัญญัติงบประมาณรายจ่ายประจำปี และแผนพัฒนาท้องถิ่น',
      strategy: 'ยุทธศาสตร์การบริหารกิจการบ้านเมืองที่ดีและการบริหารงานยุติธรรม',
      budget: 50000,
      objective: 'เพื่อให้การจัดทำร่างข้อบัญญัติงบประมาณรายจ่ายแล้วเสร็จและประกาศใช้ทันก่อนวันที่ 1 ตุลาคม ของทุกปี',
      kpi: 'ข้อบัญญัติงบประมาณรายจ่ายประจำปีได้รับการอนุมัติและประกาศใช้ภายในระยะเวลาตามกฎหมาย (100%)',
      target: 'ประกาศใช้ข้อบัญญัติงบประมาณรายจ่ายประจำปีได้ทันวันที่ 1 ตุลาคม โดยไม่ต้องใช้งบประมาณปีเดิมไปพลางก่อน',
      riskEvent: 'ร่างข้อบัญญัติงบประมาณรายจ่ายไม่ผ่านความเห็นชอบจากสภา อปท. ตามกรอบเวลา หรือประกาศใช้ล่าช้า',
      cause: 'การจัดทำโครงการไม่สอดคล้องกับแผนพัฒนาท้องถิ่น หรือความล่าช้าในการประสานงานแผนรายกอง',
      riskCategory: 'ด้านกลยุทธ์ (Strategic Risks)',
      likelihood: 2,
      impact: 4,
      riskScore: 8,
      riskLevel: 'ปานกลาง',
      riskResponse: 'การลดผลกระทบของความเสี่ยง (Reduce Impact)',
      treatmentMeasures: '1. จัดทำปฏิทินงบประมาณและแจ้งเตือนทุกส่วนราชการล่วงหน้า 60 วัน\n2. จัดประชุมรับฟังความคิดเห็นและชี้แจงรายละเอียดโครงการต่อสมาชิกสภา อปท. ก่อนเปิดสมัยประชุม\n3. จัดทำบัญชีโครงการที่สอดรับกับแผนพัฒนาท้องถิ่น 5 ปีอย่างเคร่งครัด',
      kpiMeasure: 'เสนอญัตติร่างข้อบัญญัติงบประมาณเข้าสู่สภา อปท. ภายในวันที่ 15 สิงหาคม',
      timeline: 'มิ.ย. - ก.ย. ของทุกปี',
      responsiblePerson: 'หัวหน้าสำนักปลัด / เจ้าหน้าที่วิเคราะห์นโยบายและแผน',
      monitoringMethod: 'รายงานความคืบหน้าการจัดทำงบประมาณต่อนายก อปท. ทุกสัปดาห์',
      expectedPostLikelihood: 1,
      expectedPostImpact: 2,
      expectedResidualScore: 2,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    }
  ],

  'กองการศึกษา': [
    {
      riskId: 'LIB-EDU-01',
      activity: 'โครงการอาหารกลางวันและพัฒนาสุขอนามัยในศูนย์พัฒนาเด็กเล็ก (ศพด.)',
      strategy: 'ยุทธศาสตร์การส่งเสริมการศึกษา การพัฒนาคุณภาพชีวิตเด็กและเยาวชน',
      budget: 650000,
      objective: 'เพื่อให้เด็กเล็กได้รับประทานอาหารกลางวันที่มีคุณค่าทางโภชนาการ ถูกสุขลักษณะ ปลอดภัย และครบถ้วนทุกวันทำการ',
      kpi: 'ร้อยละของเด็กเล็กใน ศพด. ได้รับประทานอาหารกลางวันตามระบบ Thai School Lunch ครบถ้วน (100%)',
      target: 'ไม่มีเหตุการณ์อาหารเป็นพิษ และเด็กเล็กได้รับสารอาหารครบถ้วนตามเกณฑ์โภชนาการ',
      riskEvent: 'อาหารกลางวันไม่ได้มาตรฐานโภชนาการ หรือวัตถุดิบอาหารไม่ได้คุณภาพตามมาตรฐานสุขอนามัย',
      cause: 'ผู้รับจ้างส่งมอบวัตถุดิบไม่สดสะอาด หรือผู้จัดทำอาหารขาดความรู้ด้านโภชนาการสำหรับเด็กปฐมวัย',
      riskCategory: 'ด้านการดำเนินงาน (Operation Risks)',
      likelihood: 3,
      impact: 4,
      riskScore: 12,
      riskLevel: 'สูง',
      riskResponse: 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)',
      treatmentMeasures: '1. บังคับใช้โปรแกรม Thai School Lunch ในการจัดทำเมนูอาหารกลางวันล่วงหน้ารายสัปดาห์\n2. แต่งตั้งคณะกรรมการตรวจรับอาหารกลางวันสุ่มตรวจวัตถุดิบสดทุกเช้าก่อนปรุง\n3. จัดตรวจสุขาภิบาลโรงครัวและตรวจสุขภาพผู้ประกอบอาหารประจำปี',
      kpiMeasure: 'ร้อยละความพึงพอใจของผู้ปกครองต่อคุณภาพอาหารกลางวันไม่น้อยกว่าร้อยละ 85',
      timeline: 'ตลอดปีการศึกษา',
      responsiblePerson: 'ผู้อำนวยการกองการศึกษา / หัวหน้าศูนย์พัฒนาเด็กเล็ก',
      monitoringMethod: 'บันทึกภาพถ่ายเมนูอาหารและบันทึกการตรวจรับรายงานต่อนายก อปท. ทุกสัปดาห์',
      expectedPostLikelihood: 1,
      expectedPostImpact: 2,
      expectedResidualScore: 2,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    },
    {
      riskId: 'LIB-EDU-02',
      activity: 'การจัดซื้ออาหารเสริม (นม) โรงเรียนและการเก็บรักษาคุณภาพ',
      strategy: 'ยุทธศาสตร์การศึกษาและสุขอนามัยเด็กเยาวชน',
      budget: 450000,
      objective: 'เพื่อให้นักเรียนและเด็กเล็กได้ดื่มนมโรงเรียนที่มีคุณภาพ สด สะอาด และได้รับครบถ้วนตามจำนวนวันเปิดภาคเรียน',
      kpi: 'ร้อยละของเด็กนักเรียนที่ได้รับนมโรงเรียนครบถ้วนตามวันเปิดเรียน 260 วัน/ปีการศึกษา (100%)',
      target: 'ไม่มีเหตุนมบูด นมเน่าเสีย หรือส่งมอบนมขาดจำนวน',
      riskEvent: 'นมโรงเรียนเสื่อมคุณภาพ บูดเสีย หรือการจัดส่งนมล่าช้ากว่าวันเปิดภาคเรียน',
      cause: 'การขนส่งไม่ได้มาตรฐานอุณหภูมิควบคุม หรือสถานที่จัดเก็บในโรงเรียน/ศพด. อุณหภูมิไม่เหมาะสม',
      riskCategory: 'ด้านการดำเนินงาน (Operation Risks)',
      likelihood: 2,
      impact: 4,
      riskScore: 8,
      riskLevel: 'ปานกลาง',
      riskResponse: 'การลดผลกระทบของความเสี่ยง (Reduce Impact)',
      treatmentMeasures: '1. ตรวจสอบอุณหภูมิรถขนส่งนม (ไม่เกิน 4-8 องศาเซลเซียส) ทุกครั้งที่มีการส่งมอบ\n2. สุ่มชิมและตรวจสภาพกล่อง/ถุงนมทันทีก่อนแจกจ่ายให้นักเรียน\n3. จัดเตรียมตู้เย็น/ถังแช่เก็บรักษานมที่ได้มาตรฐานความเย็นต่อเนื่อง',
      kpiMeasure: 'ไม่มีเหตุนมโรงเรียนบูดเสียในสถานศึกษาตลอดปีการศึกษา',
      timeline: 'ตลอดปีการศึกษา',
      responsiblePerson: 'ผู้อำนวยการกองการศึกษา / ครูผู้ดูแลเด็ก',
      monitoringMethod: 'บันทึกการรับมอบและรายงานผลสภาพนมประจำสัปดาห์',
      expectedPostLikelihood: 1,
      expectedPostImpact: 2,
      expectedResidualScore: 2,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    }
  ],

  'กองสวัสดิการสังคม': [
    {
      riskId: 'LIB-WEL-01',
      activity: 'การจ่ายเงินเบี้ยยังชีพผู้สูงอายุ คนพิการ และผู้ป่วยเอดส์',
      strategy: 'ยุทธศาสตร์การสงเคราะห์และพัฒนาคุณภาพชีวิตผู้สูงอายุและผู้ด้อยโอกาส',
      budget: 3500000,
      objective: 'เพื่อให้การจ่ายเงินเบี้ยยังชีพถูกต้อง ครบถ้วน ตรงกำหนดเวลาทุกวันที่ 10 ของเดือน และไม่มีการจ่ายเงินซ้ำซ้อนหรือตกหล่น',
      kpi: 'ร้อยละความถูกต้องของการจ่ายเงินเบี้ยยังชีพให้แก่ผู้มีสิทธิที่แท้จริงตามระเบียบ มท. (100%)',
      target: 'ไม่มีการจ่ายเงินเบี้ยยังชีพให้แก่ผู้เสียชีวิต/ย้ายภูมิลำเนา และไม่มีการเรียกเงินคืน',
      riskEvent: 'การจ่ายเงินเบี้ยยังชีพซ้ำซ้อน จ่ายให้แก่ผู้เสียชีวิต หรือตกหล่นผู้มีสิทธิที่แท้จริง',
      cause: 'การเชื่อมโยงข้อมูลทะเบียนราษฎรกับสำนักทะเบียนอำเภอไม่เรียลไทม์ และญาติแจ้งการเสียชีวิตล่าช้า',
      riskCategory: 'ด้านการเงิน (Financial Risks)',
      likelihood: 4,
      impact: 3,
      riskScore: 12,
      riskLevel: 'สูง',
      riskResponse: 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)',
      treatmentMeasures: '1. ตรวจสอบและอัปเดตข้อมูลมรณบัตรและย้ายที่อยู่ร่วมกับทะเบียนราษฎรอำเภอก่อนการตัดรอบจ่ายเงินทุกเดือน\n2. ใช้วิธีการโอนเงินเข้าบัญชีธนาคารของผู้มีสิทธิโดยตรง (e-Payment / กรมบัญชีกลาง)\n3. จัดทีมเจ้าหน้าที่ลงพื้นที่ยืนยันตัวตนผู้รับเบี้ยยังชีพประเภทเงินสดทุก 6 เดือน',
      kpiMeasure: 'จำนวนเงินเบี้ยยังชีพจ่ายเกินสิทธิ/จ่ายให้ผู้เสียชีวิตลดลงเป็นศูนย์ (0 บาท)',
      timeline: 'ตลอดปีงบประมาณ (ดำเนินการทุกเดือน)',
      responsiblePerson: 'ผู้อำนวยการกองสวัสดิการสังคม / เจ้าหน้าที่พัฒนาชุมชน',
      monitoringMethod: 'รายงานการตรวจสอบสถานะผู้มีสิทธิรับเบี้ยยังชีพประจำเดือนเสนอนายก อปท.',
      expectedPostLikelihood: 1,
      expectedPostImpact: 2,
      expectedResidualScore: 2,
      expectedResidualLevel: 'ต่ำ',
      controllable: 'ควบคุมได้'
    }
  ]
};

/**
 * คำนวณระดับความเสี่ยงตามเกณฑ์กระทรวงการคลัง (Matrix 5x5)
 */
export function calculateRiskLevel(likelihood, impact) {
  const l = Math.min(5, Math.max(1, Number(likelihood) || 1));
  const i = Math.min(5, Math.max(1, Number(impact) || 1));
  const score = l * i;

  let level = 'ต่ำ';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let levelColor = 'text-emerald-600';

  if (score >= 15) {
    level = 'สูงมาก';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    levelColor = 'text-rose-600';
  } else if (score >= 10) {
    level = 'สูง';
    badgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
    levelColor = 'text-orange-600';
  } else if (score >= 5) {
    level = 'ปานกลาง';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    levelColor = 'text-amber-600';
  }

  return {
    likelihood: l,
    impact: i,
    score,
    level,
    badgeColor,
    levelColor,
    requiresPlan: score >= 10 // ตาม ว 3482 ข้อ 10 ต้องจัดทำแผน บส.๓ หากระดับสูงขึ้นไป
  };
}

/**
 * ดึงรายการความเสี่ยงมาตรฐานตามส่วนราชการ
 */
export function getStandardRisksByDepartment(dept) {
  if (!dept) return [];
  // Match exact or contains
  const clean = dept.trim();
  for (const [key, list] of Object.entries(STANDARD_RISK_LIBRARY)) {
    if (clean.includes(key) || key.includes(clean)) {
      return list;
    }
  }
  // Default fallback across all divisions
  return STANDARD_RISK_LIBRARY['กองคลัง'] || [];
}

/**
 * ระบบวิเคราะห์และสังเคราะห์ความเสี่ยงอัตโนมัติตาม ว 3482
 */
export function analyzeRiskKeyword(keyword, department) {
  const deptList = getStandardRisksByDepartment(department);
  if (!keyword || !keyword.trim()) {
    return deptList[0] || null;
  }

  const q = keyword.toLowerCase();
  const matched = deptList.find((item) =>
    item.activity.toLowerCase().includes(q) ||
    item.riskEvent.toLowerCase().includes(q) ||
    item.objective.toLowerCase().includes(q)
  );

  return matched || deptList[0] || null;
}

/**
 * ดึงความเสี่ยงมาตรฐานทั้งหมดทุกกอง
 */
export function getAllStandardRisks() {
  const all = [];
  for (const [dept, list] of Object.entries(STANDARD_RISK_LIBRARY)) {
    list.forEach((item) => {
      all.push({ ...item, department: dept });
    });
  }
  return all;
}

/**
 * ตรวจสอบความสอดคล้องตามหนังสือสั่งการ มท 0805.2/ว 3482 และหลักเกณฑ์ กค. 2562
 */
export function auditW3482Compliance({ bs1 = [], bs2 = [], bs3 = [], bs4 = [], bs5 = {} }) {
  const bs5Items = bs5?.items || [];
  
  // 1. ตรวจสอบ Matrix 5x5: โอกาส (1-5) x ผลกระทบ (1-5)
  const bs2ScoresValid = bs2.length > 0 && bs2.every(item => {
    const l = Number(item.likelihood);
    const i = Number(item.impact);
    return l >= 1 && l <= 5 && i >= 1 && i <= 5;
  });

  // 2. ตรวจสอบการคัดกรองจัดทำแผน บส.๓ (ตาม ว 3482 ข้อ 10: ความเสี่ยงระดับสูงหรือสูงมาก ต้องมีแผน บส.๓)
  const highRisks = bs2.filter(item => {
    const score = (Number(item.likelihood) || 1) * (Number(item.impact) || 1);
    return score >= 10;
  });

  const highRisksPlanned = highRisks.every(hr => {
    return bs3.some(b3 => b3.riskCode === hr.riskCode || b3.id === hr.id);
  });

  // 3. ตรวจสอบความสอดคล้องของ บส.๔ (มีการติดตามผลตามรอบ 3, 6 หรือ 12 เดือน)
  const bs4Tracked = bs3.length > 0 && bs3.every(b3 => {
    return bs4.some(b4 => b4.riskCode === b3.riskCode || b4.id === b3.id);
  });

  // 4. ตรวจสอบการประเมิน Residual Risk ใน บส.๕ (ระดับความเสี่ยงหลังดำเนินการลดลง และควบคุมได้)
  const bs5Controlled = bs5Items.length > 0 && bs5Items.every(b5 => {
    return (b5.riskChange === 'ลดลง' || b5.postScore < b5.preScore) && b5.controllable === 'ควบคุมได้';
  });

  // 5. ตรวจสอบความครบถ้วนของข้อมูลพื้นฐาน
  const hasData = bs1.length > 0 && bs2.length > 0;

  // คำนวณคะแนนรวม Compliance Score (เต็ม 100%)
  let score = 0;
  if (hasData) score += 20;
  if (bs2ScoresValid) score += 25;
  if (highRisksPlanned) score += 25;
  if (bs4Tracked) score += 15;
  if (bs5Controlled) score += 15;

  return {
    score,
    isCompliant: score >= 85,
    checks: [
      {
        id: 'matrix_5x5',
        title: 'เกณฑ์ประเมินแบบเมทริกซ์ 5x5 (ระดับโอกาส 1-5 และผลกระทบ 1-5)',
        status: bs2ScoresValid ? 'passed' : 'warning',
        detail: bs2ScoresValid ? 'คะแนนการประเมินทุกรายการอยู่ในช่วง 1 - 25 ถูกต้องตามหลักเกณฑ์กระทรวงการคลัง' : 'พบรายการที่คะแนนโอกาสหรือผลกระทบไม่อยู่ในเกณฑ์ 1 - 5'
      },
      {
        id: 'bs3_screening',
        title: 'การคัดกรองจัดทำแผนบริหารความเสี่ยง (แบบ บส. ๓ ตามข้อ ๑๐)',
        status: highRisksPlanned ? 'passed' : 'warning',
        detail: highRisksPlanned
          ? `ความเสี่ยงระดับสูง/สูงมาก ทั้ง ${highRisks.length} รายการ มีการจัดทำแผนมาตรการจัดการใน แบบ บส. ๓ ครบถ้วน 100%`
          : `พบความเสี่ยงระดับสูง/สูงมากที่ยังไม่มีแผนรองรับในแบบ บส. ๓ (${highRisks.length} รายการ)`
      },
      {
        id: 'bs4_tracking',
        title: 'การติดตามผลการบริหารความเสี่ยง (แบบ บส. ๔)',
        status: bs4Tracked ? 'passed' : 'info',
        detail: bs4Tracked ? 'มาตรการในแบบ บส. ๓ ทุกรายการมีการติดตามผลการดำเนินงานและระบุร้อยละความคืบหน้าครบถ้วน' : 'มาตรการบางรายการยังไม่มีข้อมูลติดตามผลในแบบ บส. ๔'
      },
      {
        id: 'bs5_residual',
        title: 'การประเมินความเสี่ยงคงเหลือและการควบคุมระดับองค์กร (แบบ บส. ๕)',
        status: bs5Controlled ? 'passed' : 'info',
        detail: bs5Controlled ? 'ความเสี่ยงหลังมีมาตรการลดลงสู่เกณฑ์ที่ยอมรับได้ และอยู่ในสถานะ "ควบคุมได้" ครบทุกประเด็น' : 'ควรสอบทานผลการประเมินความเสี่ยงหลังดำเนินการและระบุสถานะควบคุมได้'
      }
    ],
    stats: {
      totalRisks: bs1.length,
      highRisks: highRisks.length,
      plansCount: bs3.length,
      trackedCount: bs4.length,
      evaluatedCount: bs5Items.length
    }
  };
}

/**
 * ฟังก์ชันซิงค์เชื่อมโยงข้อมูลอัตโนมัติข้ามแบบฟอร์ม ๑ ➜ ๒ ➜ ๓ ➜ ๔ ➜ ๕ (Auto-Cascade)
 * อ้างอิงตามหนังสือสั่งการ มท 0805.2/ว 3482
 */
export function cascadeAllBsForms({
  bs1List = [],
  targetDepartment = 'all',
  orgProfile = {},
  selectedYear = '2569'
}) {
  const isAll = targetDepartment === 'all';
  const effectiveBs1 = isAll ? bs1List : bs1List.filter(item => item.department === targetDepartment);

  // 1. ซิงค์ไปยัง บส. ๒ (วิเคราะห์ความเสี่ยง)
  const newBs2 = effectiveBs1.map((b1, idx) => {
    // หาข้อมูลวิเคราะห์จากคลังความเสี่ยงมาตรฐาน
    const std = analyzeRiskKeyword(b1.activity || b1.riskEvent, b1.department);
    const l = std?.likelihood || 3;
    const i = std?.impact || 3;
    const score = l * i;
    const level = score >= 15 ? 'สูงมาก' : score >= 10 ? 'สูง' : score >= 5 ? 'ปานกลาง' : 'ต่ำ';

    return {
      id: `BS2-${Date.now()}-${idx}`,
      riskCode: b1.riskCode || `RSK-0${idx + 1}`,
      department: b1.department,
      activity: b1.activity,
      objective: b1.objective,
      responsiblePerson: std?.responsiblePerson || `ผู้อำนวยการ${b1.department}`,
      riskEvent: b1.riskEvent || std?.riskEvent || `ความเสี่ยงต่อการบรรลุวัตถุประสงค์ของ${b1.activity}`,
      riskCategory: std?.riskCategory || b1.riskCategory || 'ด้านการดำเนินงาน (Operation Risks)',
      likelihood: l,
      impact: i,
      riskScore: score,
      riskLevel: level,
      riskResponse: std?.riskResponse || 'การลดโอกาสของความเสี่ยง (Reduce Likelihood)'
    };
  });

  // 2. ซิงค์ไปยัง บส. ๓ (แผนบริหารความเสี่ยง)
  // *** กฎข้อ ๑๐ ตาม ว ๓๔๘๒: ให้คัดเลือกเฉพาะความเสี่ยงระดับ "สูง" หรือ "สูงมาก" มาจัดทำแผน บส.๓ ***
  let eligibleForBs3 = newBs2.filter(b2 => b2.riskScore >= 10);
  // หากไม่มีระดับสูง ให้เลือกรายการที่มีคะแนนสูงสุดเพื่อให้มีแผนบริหารความเสี่ยงของหน่วยงาน
  if (eligibleForBs3.length === 0 && newBs2.length > 0) {
    eligibleForBs3 = [...newBs2].sort((a, b) => b.riskScore - a.riskScore).slice(0, 2);
  }

  const newBs3 = eligibleForBs3.map((b2, idx) => {
    const std = analyzeRiskKeyword(b2.activity || b2.riskEvent, b2.department);
    const matchBs1 = effectiveBs1.find(b => b.riskCode === b2.riskCode);

    return {
      id: `BS3-${Date.now()}-${idx}`,
      riskCode: b2.riskCode,
      department: b2.department,
      activity: b2.activity,
      riskEvent: b2.riskEvent,
      riskResponse: b2.riskResponse,
      responsiblePerson: b2.responsiblePerson,
      measures: std?.treatmentMeasures || `กำหนดมาตรการควบคุมภายในและการกำกับดูแลสำหรับ ${b2.department}`,
      kpi: std?.kpiMeasure || matchBs1?.kpi || 'ร้อยละความสำเร็จตามมาตรการที่กำหนด (ไม่น้อยกว่า 90%)',
      timeline: std?.timeline || 'ตลอดปีงบประมาณ',
      monitoringMethod: std?.monitoringMethod || 'รายงานผลในการประชุมประจำเดือนของ อปท. ทุกเดือน'
    };
  });

  // 3. ซิงค์ไปยัง บส. ๔ (รายงานการติดตามผลการบริหารความเสี่ยง)
  const newBs4 = newBs3.map((b3, idx) => {
    return {
      id: `BS4-${Date.now()}-${idx}`,
      period: '6month',
      riskCode: b3.riskCode,
      department: b3.department,
      activity: b3.activity,
      measures: b3.measures,
      timeline: b3.timeline,
      responsiblePerson: b3.responsiblePerson,
      result: `ได้ดำเนินการตามมาตรการควบคุมภายในแล้วเสร็จตามกำหนด ความเสี่ยงลดลงสู่ระดับที่ยอมรับได้`,
      evidence: 'บันทึกข้อความ, รายงานการประชุม, ภาพถ่ายกิจกรรมและผลตรวจหน้างาน',
      progressPercent: 85,
      problemSolution: 'ไม่มีปัญหาอุปสรรคสำคัญ มีการประสานงานและตรวจทานอย่างต่อเนื่อง'
    };
  });

  // 4. ซิงค์ไปยัง บส. ๕ (รายงานผลการดำเนินงานและทบทวนแผนระดับองค์กร)
  const newBs5Items = effectiveBs1.map((b1, idx) => {
    const m2 = newBs2.find(x => x.riskCode === b1.riskCode);
    const m3 = newBs3.find(x => x.riskCode === b1.riskCode);
    const m4 = newBs4.find(x => x.riskCode === b1.riskCode);
    const std = analyzeRiskKeyword(b1.activity || b1.riskEvent, b1.department);

    const preL = m2?.likelihood || 3;
    const preI = m2?.impact || 3;
    const postL = std?.expectedPostLikelihood || 1;
    const postI = std?.expectedPostImpact || 2;
    const preScore = preL * preI;
    const postScore = postL * postI;

    return {
      id: `BS5-${Date.now()}-${idx}`,
      riskCode: b1.riskCode,
      department: b1.department,
      activity: b1.activity,
      riskEvent: b1.riskEvent || m2?.riskEvent,
      preLikelihood: preL,
      preImpact: preI,
      preScore: preScore,
      measures: m3?.measures || 'กำหนดมาตรการควบคุมภายในและการกำกับดูแล',
      result: m4?.result || 'ดำเนินมาตรการครบถ้วน ความเสี่ยงลดลงสู่ระดับที่ยอมรับได้',
      postLikelihood: postL,
      postImpact: postI,
      postScore: postScore,
      riskChange: postScore < preScore ? 'ลดลง' : 'ไม่ลดลง',
      residualRisk: 'ความเสี่ยงด้านการปฏิบัติงานต่อเนื่องตามภารกิจประจำ',
      controllable: 'ควบคุมได้',
      nextYearMeasures: 'ติดตามผลการควบคุมภายในและทบทวนความเสี่ยงประจำปีงบประมาณถัดไป'
    };
  });

  return {
    bs2: newBs2,
    bs3: newBs3,
    bs4: newBs4,
    bs5Items: newBs5Items
  };
}
