import React, { useState } from 'react';
import {
  Building2,
  Car,
  BadgeDollarSign,
  HardHat,
  GraduationCap,
  HeartHandshake,
  Activity,
  Calendar,
  Clock,
  Download,
  FileText,
  ShieldCheck,
  Phone,
  MapPin,
  Mail,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Globe,
  Sparkles,
  Users
} from 'lucide-react';

export default function PublicOverviewView({
  orgProfile = {},
  selectedYear = '2569',
  setCurrentTab = () => {}
}) {
  const [activeTab, setActiveTab] = useState('divisions'); // divisions, timelines, forms, ita

  const orgName = orgProfile.name || 'องค์การบริหารส่วนตำบลฝางคำ';
  const district = orgProfile.district || 'สิรินธร';
  const province = orgProfile.province || 'อุบลราชธานี';

  // 5 Main Divisions Public Portfolios
  const DIVISIONS_INFO = [
    {
      id: 'office',
      name: 'สำนักปลัด (รวมงานสาธารณสุขและสิ่งแวดล้อม)',
      leader: orgProfile.palatName ? `กำกับโดย ${orgProfile.palatName}` : 'หัวหน้าสำนักปลัด',
      icon: Building2,
      color: 'blue',
      services: [
        'งานสารบรรณ รับ-ส่งหนังสือราชการและออกหนังสือรับรอง',
        'งานนิติการและศูนย์ดำรงธรรม รับเรื่องราวร้องทุกข์ของประชาชน',
        'งานป้องกันและบรรเทาสาธารณภัย (อปพร., รถน้ำ, ระงับอัคคีภัย)',
        'บริการจัดเก็บและขนถ่ายขยะมูลฝอยในเขตตำบล 6 หมู่บ้าน',
        'การควบคุมและป้องกันโรคติดต่อในชุมชน (ไข้เลือดออก, พิษสุนัขบ้า)',
        'งานสุขาภิบาลอาหาร ตรวจมาตรฐานร้านอาหารและตลาดนัดชุมชน'
      ],
      location: 'ชั้น 1 อาคารสำนักงาน อบต.ฝางคำ'
    },
    {
      id: 'finance',
      name: 'กองคลัง',
      leader: 'ผู้อำนวยการกองคลัง',
      icon: BadgeDollarSign,
      color: 'emerald',
      services: [
        'บริการรับชำระภาษีที่ดินและสิ่งปลูกสร้าง (ยื่นภายในเดือน มิ.ย.)',
        'บริการรับชำระภาษีป้ายและค่าธรรมเนียมใบอนุญาตต่างๆ',
        'งานแผนที่ภาษีและทะเบียนทรัพย์สิน (LTAX 3000 / GIS)',
        'งานพัสดุ การจัดซื้อจัดจ้างภาครัฐด้วยความโปร่งใส (e-GP)',
        'งานการเงินและบัญชี การเบิกจ่ายเงินงบประมาณโครงการพัฒนา'
      ],
      location: 'ชั้น 1 อาคารสำนักงาน อบต.ฝางคำ'
    },
    {
      id: 'tech',
      name: 'กองช่าง',
      leader: 'ผู้อำนวยการกองช่าง',
      icon: HardHat,
      color: 'amber',
      services: [
        'บริการรับคำขออนุญาตก่อสร้าง ดัดแปลง หรือรื้อถอนอาคาร (แบบ ข.1)',
        'ตรวจพิจารณาแบบแปลนและออกใบอนุญาตอาคาร (แบบ อ.1 ภายใน 45 วัน)',
        'งานซ่อมบำรุงโครงสร้างพื้นฐาน ถนน สะพาน และทางระบายน้ำ',
        'บริการซ่อมแซมและบำรุงรักษาไฟฟ้าสาธารณะส่องสว่างริมทาง',
        'งานควบคุมและดูแลระบบประปาชนบทเพื่อการอุปโภคบริโภค'
      ],
      location: 'ชั้น 2 อาคารสำนักงาน อบต.ฝางคำ'
    },
    {
      id: 'education',
      name: 'กองการศึกษา ศาสนาและวัฒนธรรม',
      leader: 'ผู้อำนวยการกองการศึกษา',
      icon: GraduationCap,
      color: 'purple',
      services: [
        'บริหารจัดการศูนย์พัฒนาเด็กเล็ก 2 แห่ง (ศพด.วัดเจริญทัศน์ & ศพด.บ้านฝางเทิง)',
        'จัดสรรงบประมาณอาหารกลางวันนักเรียนคุณภาพ (24 บาท/คน/วัน)',
        'จัดหาและแจกจ่ายนมโรงเรียนตามมาตรฐาน (พาสเจอร์ไรส์/ยูเอชที)',
        'ส่งเสริมสนับสนุนการจัดกิจกรรมทางศาสนาและประเพณีวัฒนธรรมท้องถิ่น',
        'สนับสนุนการพัฒนาการเรียนรู้และสุขอนามัยเด็กปฐมวัย'
      ],
      location: 'ชั้น 2 อาคารสำนักงาน อบต.ฝางคำ'
    },
    {
      id: 'welfare',
      name: 'กองสวัสดิการสังคม',
      leader: 'ผู้อำนวยการกองสวัสดิการสังคม',
      icon: HeartHandshake,
      color: 'rose',
      services: [
        'บริการรับลงทะเบียนและจ่ายเงินเบี้ยยังชีพผู้สูงอายุ (600 - 1,000 บาท/เดือน)',
        'บริการรับคำขอลงทะเบียนเบี้ยความพิการ (800 - 1,000 บาท/เดือน)',
        'บริการช่วยเหลือสงเคราะห์ผู้ป่วยเอดส์และผู้ยากไร้ในชุมชน',
        'บริการเงินช่วยเหลือผู้ประสบปัญหาทางสังคมและภัยพิบัติฉุกเฉิน',
        'ส่งเสริมและพัฒนาศักยภาพกลุ่มสตรี เยาวชน และผู้สูงอายุตำบลฝางคำ'
      ],
      location: 'ชั้น 1 อาคารสำนักงาน อบต.ฝางคำ'
    }
  ];

  // Public Service Timelines
  const SERVICE_TIMELINES = [
    {
      title: 'การชำระภาษีที่ดินและสิ่งปลูกสร้าง',
      period: 'มกราคม - มิถุนายน ของทุกปี',
      authority: 'กองคลัง',
      desc: 'ประชาชนผู้ครอบครองที่ดินและสิ่งปลูกสร้าง ยื่นแบบและชำระภาษีตามการประเมิน',
      statusNote: 'เปิดให้บริการตามเวลาราชการ',
      color: 'emerald'
    },
    {
      title: 'การโอนเงินเบี้ยยังชีพผู้สูงอายุและคนพิการ',
      period: 'ทุกวันที่ 10 ของเดือน',
      authority: 'กองสวัสดิการสังคม',
      desc: 'กรมบัญชีกลางโอนเงินเข้าบัญชีเงินฝากธนาคารของผู้มีสิทธิโดยตรง',
      statusNote: 'ตรงตามรอบปฏิทินจ่ายเงินภาครัฐ',
      color: 'rose'
    },
    {
      title: 'การยื่นคำขออนุญาตก่อสร้างอาคาร (แบบ ข.1)',
      period: 'พิจารณาแล้วเสร็จภายใน 45 วัน',
      authority: 'กองช่าง',
      desc: 'ตาม พ.ร.บ. ควบคุมอาคาร พ.ศ. 2522 ตรวจสอบแบบแปลนและแจ้งผลอนุญาต',
      statusNote: 'ยื่นคำขอได้ทุกวันทำการ',
      color: 'amber'
    },
    {
      title: 'รอบการจัดเก็บขยะมูลฝอยชุมชน',
      period: 'สัปดาห์ละ 2 ครั้ง (ทุกหมู่บ้าน)',
      authority: 'สำนักปลัด (งานสาธารณสุขฯ)',
      desc: 'รถเก็บขนมูลฝอยเข้าให้บริการตามรอบเส้นทางที่กำหนด อัตรา 40 บาท/ถัง/เดือน',
      statusNote: 'ให้บริการสม่ำเสมอ',
      color: 'blue'
    },
    {
      title: 'รณรงค์ฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าฟรี',
      period: 'มีนาคม - พฤษภาคม ของทุกปี',
      authority: 'สำนักปลัด (งานสาธารณสุขฯ)',
      desc: 'บริการฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าให้แก่สุนัขและแมวในชุมชนฟรี',
      statusNote: 'จัดบริการเชิงรุกถึงหมู่บ้าน',
      color: 'purple'
    }
  ];

  // Citizen Downloadable Public Forms
  const CITIZEN_FORMS = [
    {
      code: 'แบบ บย.01',
      title: 'คำขอลงทะเบียนรับเงินเบี้ยยังชีพผู้สูงอายุ',
      dept: 'กองสวัสดิการสังคม',
      docs: 'บัตรประชาชนตัวจริง, ทะเบียนบ้าน, สมุดบัญชีเงินฝากธนาคาร',
      size: 'PDF / Word'
    },
    {
      code: 'แบบ คำขอ บพ.',
      title: 'คำขอลงทะเบียนรับเงินเบี้ยความพิการ',
      dept: 'กองสวัสดิการสังคม',
      docs: 'สมุดประจำตัวคนพิการ, บัตรประชาชน, ทะเบียนบ้าน, หน้าสมุดบัญชีธนาคาร',
      size: 'PDF / Word'
    },
    {
      code: 'แบบ ข.1',
      title: 'คำขออนุญาตก่อสร้าง ดัดแปลง หรือรื้อถอนอาคาร',
      dept: 'กองช่าง',
      docs: 'สำเนาโฉนดที่ดิน/น.ส.3, แบบแปลนและผังบริเวณ 3 ชุด, บัตรประชาชนผู้ขอ',
      size: 'PDF / Word'
    },
    {
      code: 'แบบ คำร้องทั่วไป',
      title: 'แบบคำร้องขอรับบริการสาธารณะ / ศูนย์ดำรงธรรม',
      dept: 'สำนักปลัด',
      docs: 'สำเนาบัตรประชาชน และรายละเอียดข้อร้องเรียนหรือเรื่องที่ขอรับบริการ',
      size: 'PDF / Word'
    },
    {
      code: 'แบบ คำขอถังขยะ',
      title: 'แบบคำขอลงทะเบียนถังขยะมูลฝอยและขอรับบริการจัดเก็บ',
      dept: 'สำนักปลัด (งานสาธารณสุขฯ)',
      docs: 'สำเนาบัตรประชาชนเจ้าบ้าน, สำเนาทะเบียนบ้านหลังที่ขอรับบริการ',
      size: 'PDF / Word'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/15 backdrop-blur-md text-blue-200 border border-white/20 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              ศูนย์ข้อมูลข่าวสารและบริการประชาชน (Public Transparency Portal)
            </span>
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs px-2.5 py-1 rounded-full font-semibold">
              เปิดเผยตามเกณฑ์ ITA & พ.ร.บ. ข้อมูลข่าวสารฯ 2540
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              ภาพรวมการดำเนินงานและการให้บริการประชาชน
            </h1>
            <p className="text-blue-100 text-sm sm:text-base font-medium mt-1">
              {orgName} • อำเภอ{district} จังหวัด{province}
            </p>
            <p className="text-xs sm:text-sm text-blue-200/80 max-w-3xl mt-2 leading-relaxed">
              "ตำบลฝางคำน่าอยู่ เชิดชูคุณธรรม นำการพัฒนา ประชาชนมีคุณภาพชีวิตที่ดี" มุ่งมั่นให้บริการด้วยความโปร่งใส รวดเร็ว ถูกต้องตามระเบียบกฎหมาย พร้อมเปิดเผยข้อมูลสาธารณะแก่พี่น้องประชาชนทุกคน
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <span className="text-blue-200 block text-[11px]">การบริหารราชการ:</span>
              <strong className="text-base text-white">5 ส่วนราชการหลัก</strong>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <span className="text-blue-200 block text-[11px]">เขตพื้นที่ให้บริการ:</span>
              <strong className="text-base text-white">6 หมู่บ้านตำบลฝางคำ</strong>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <span className="text-blue-200 block text-[11px]">มาตรฐานความโปร่งใส:</span>
              <strong className="text-base text-emerald-300">No Gift Policy 100%</strong>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <span className="text-blue-200 block text-[11px]">ช่องทางรับเรื่องร้องทุกข์:</span>
              <strong className="text-base text-white">ศูนย์ดำรงธรรม อบต.</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('divisions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'divisions'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>โครงสร้าง 5 ส่วนราชการ & งานบริการ</span>
        </button>

        <button
          onClick={() => setActiveTab('timelines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'timelines'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>ปฏิทินรอบเวลาให้บริการประชาชน</span>
        </button>

        <button
          onClick={() => setActiveTab('forms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'forms'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>แบบฟอร์มคำขอสำหรับประชาชน</span>
        </button>

        <button
          onClick={() => setActiveTab('ita')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'ita'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ความโปร่งใส & ศูนย์ข้อมูลข่าวสาร</span>
        </button>
      </div>

      {/* Tab 1: 5 Divisions Public Structure */}
      {activeTab === 'divisions' && (
        <div className="space-y-4">
          <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>โครงสร้างการบริหารราชการ อบต.ฝางคำ:</strong> ปฏิบัติภารกิจตามพระราชบัญญัติสภาตำบลและองค์การบริหารส่วนตำบล พ.ศ. 2537 โดยแบ่งส่วนราชการออกเป็น 5 หน่วยงาน เพื่ออำนวยความสะดวกและให้บริการประชาชนในตำบลฝางคำอย่างทั่วถึงและเป็นธรรม
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIVISIONS_INFO.map((div) => {
              const Icon = div.icon;
              return (
                <div
                  key={div.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        {div.location}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {div.name}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {div.leader}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        ภารกิจและงานบริการประชาชน:
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {div.services.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold shrink-0">✓</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>เปิดทำการ จันทร์-ศุกร์</span>
                    <span>08.30 - 16.30 น.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Service Timelines & Deadlines */}
      {activeTab === 'timelines' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                กรอบเวลาและรอบปฏิทินการให้บริการประชาชน
              </h2>
              <p className="text-xs text-slate-500">
                กำหนดการสำคัญเพื่อการติดต่อรับบริการและการปฏิบัติตามกฎหมายของประชาชน
              </p>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-xl font-bold">
              ปีงบประมาณ พ.ศ. {selectedYear}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {SERVICE_TIMELINES.map((t, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {t.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    {t.authority}
                  </span>
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.period}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {t.desc}
                </p>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>สถานะการบริการ:</span>
                  <span className="text-emerald-600 font-medium">● {t.statusNote}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Citizen Downloadable Forms */}
      {activeTab === 'forms' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                คลังแบบฟอร์มคำขอสำหรับประชาชน (Citizen Forms)
              </h2>
              <p className="text-xs text-slate-500">
                ดาวน์โหลดแบบคำขอและตรวจสอบเอกสารหลักฐานที่ต้องใช้แนบก่อนเดินทางมาติดต่อ
              </p>
            </div>
            <span className="text-xs text-slate-400">
              ดาวน์โหลดฟรีไม่มีค่าใช้จ่าย
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {CITIZEN_FORMS.map((form, idx) => (
              <div
                key={idx}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {form.code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {form.title}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center space-x-2">
                    <span>หน่วยงานรับผิดชอบ: <strong>{form.dept}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    เอกสารประกอบที่ต้องแนบ: {form.docs}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => alert(`ท่านสามารถขอรับแบบฟอร์ม "${form.title}" ได้ที่สำนักงาน ${orgName} หรือดาวน์โหลดผ่านระบบงานเอกสาร`)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>ตัวอย่างแบบคำขอ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: ITA & Open Government Transparency */}
      {activeTab === 'ita' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  ประกาศเจตจำนงสุจริตและความโปร่งใสในการบริหารงาน (No Gift Policy)
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                องค์การบริหารส่วนตำบลฝางคำ ยึดมั่นในการบริหารงานตามหลักธรรมาภิบาล มุ่งเน้นความโปร่งใส ปราศจากการทุจริตคอร์รัปชัน โดยประกาศนโยบาย <strong>"งดรับ งดให้ ของขวัญและของกำนัลทุกชนิดจากการปฏิบัติหน้าที่ (No Gift Policy)"</strong> เพื่อปลูกฝังค่านิยมความซื่อสัตย์สุจริต และสร้างความเชื่อมั่นแก่ประชาชนผู้รับบริการ
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 text-xs space-y-1">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>โปร่งใส ตรวจสอบได้</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    เปิดเผยข้อมูลข่าวสารภาครัฐ กระบวนการจัดซื้อจัดจ้าง และแผนงานพัฒนาสู่สาธารณะ
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 text-xs space-y-1">
                  <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>เสมอภาค ไม่เลือกปฏิบัติ</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    ให้บริการประชาชนทุกกลุ่มวัยอย่างเท่าเทียม รวดเร็ว ตามมาตรฐานการให้บริการภาครัฐ
                  </p>
                </div>
              </div>
            </div>

            {/* Public Complaint Channel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>ช่องทางร้องเรียนการทุจริตและรับเรื่องราวร้องทุกข์ (ศูนย์ดำรงธรรม อบต.)</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                หากพบเห็นการปฏิบัติหน้าที่โดยมิชอบ หรือมีปัญหาความเดือดร้อนในพื้นที่ สามารถแจ้งเรื่องผ่านศูนย์ดำรงธรรม อบต.ฝางคำ ได้โดยตรง โดยข้อมูลของผู้ร้องเรียนจะถูกเก็บรักษาเป็นความลับตามกฎหมาย
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  ตู้รับเรื่องร้องเรียน ณ ที่ทำการ อบต.
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  โทรศัพท์: ติดต่อสำนักปลัด อบต.
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  ยื่นคำร้องด้วยตนเอง ณ ศูนย์ดำรงธรรม
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 h-fit">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              ข้อมูลติดต่อและสถานที่ทำการ
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100 block">{orgName}</strong>
                  <span>ตำบลฝางคำ อำเภอ{district} จังหวัด{province}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100 block">วันและเวลาทำการ:</strong>
                  <span>จันทร์ - ศุกร์ เวลา 08.30 - 16.30 น.</span>
                  <span className="text-slate-400 block text-[11px]">(เว้นวันหยุดราชการและวันหยุดนักขัตฤกษ์)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100 block">ติดต่อสอบถาม:</strong>
                  <span>สำนักงาน {orgName}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              ระบบตรวจสอบและบริหารจัดการภายใน อปท. (IA-OS) • ฝางคำโปร่งใส พัฒนาอย่างยั่งยืน
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
