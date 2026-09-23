import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  LogIn,
  Sparkles,
  Building,
  CheckCircle2,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  ShieldAlert,
  ClipboardCheck,
  FileSpreadsheet,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Users,
  ChevronDown
} from 'lucide-react';
import { ResponsiveHeroBanner } from './ui/responsive-hero-banner';
import { verifyLogin, startSession, getUsers, getLastUsername, setLastUsername, getDepartments } from '../utils/auth';

export default function WelcomeView({ session, onLogin, onEnterDashboard }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState(() => getLastUsername());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const passwordInputRef = useRef(null);
  const loginSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const availableUsers = getUsers();
  const departments = getDepartments();

  const heroPartners = [
    { name: 'สำนักปลัด', label: 'งานบริหารทั่วไปและนโยบาย' },
    { name: 'กองคลัง', label: 'งานการเงิน พัสดุ และบัญชี' },
    { name: 'กองช่าง', label: 'งานโยธาและโครงการก่อสร้าง' },
    { name: 'กองการศึกษา', label: 'ศูนย์พัฒนาเด็กเล็กและการศึกษา' },
    { name: 'กองสวัสดิการสังคม', label: 'เบี้ยยังชีพและการพัฒนาชุมชน' },
    { name: 'กองยุทธศาสตร์ฯ', label: 'แผนงานและงบประมาณ' }
  ].map((p) => {
    const matchedUser = availableUsers.find(
      (u) => (u.department && u.department.includes(p.name)) || (u.name && u.name.includes(p.name))
    );
    return {
      ...p,
      onClick: () => {
        if (matchedUser) {
          handleQuickSelect(matchedUser);
        } else {
          scrollToLogin();
        }
      }
    };
  });

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }
    setBusy(true);
    try {
      const user = await verifyLogin(username, password);
      if (!user) {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setBusy(false);
        return;
      }
      setLastUsername(user.username);
      const newSession = startSession(user, remember);
      setShowLoginModal(false);
      onLogin(newSession);
    } catch {
      setError('เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      setBusy(false);
    }
  };

  const handleQuickSelect = (u) => {
    setUsername(u.username);
    setPassword('');
    setError('');
    setLastUsername(u.username);
    setShowLoginModal(true);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 150);
  };

  const scrollToLogin = () => {
    if (session) {
      onEnterDashboard();
      return;
    }
    setShowLoginModal(true);
  };

  const scrollToExplore = () => {
    const el = document.getElementById('welcome-features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7fb] via-[#f8fafc] to-[#edf2f7] text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Soft warm ambient background orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[500px] h-[500px] bg-sky-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Floating Glass Island Header (Appears smoothly when scrolling down) */}
      <div className={`fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 transition-all duration-300 ${
        scrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-6 pointer-events-none'
      }`}>
        <header className="max-w-6xl mx-auto pointer-events-auto rounded-2xl md:rounded-full bg-white/90 backdrop-blur-xl border border-blue-100/80 shadow-[0_8px_30px_rgba(30,58,138,0.12)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all relative overflow-hidden ring-1 ring-blue-900/5">
          {/* Subtle blue shimmer line */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none" />
          <div className="absolute -bottom-6 left-1/4 w-32 h-12 bg-blue-500/10 blur-xl pointer-events-none" />

          {/* Brand & System Status */}
          <div className="flex items-center space-x-3 sm:space-x-3.5">
            <div
              className="relative group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:shadow-blue-500/40 transition-all border border-blue-400/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="text-sm sm:text-base font-black tracking-wider text-slate-900 flex items-center space-x-2">
                <span className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-800 bg-clip-text text-transparent drop-shadow-xs">
                  IA-OS
                </span>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/80 tracking-wide">
                  อบต.ฝางคำ
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>ระบบปฏิบัติการตรวจสอบภายใน</span>
              </div>
            </div>
          </div>

          {/* Navigation Pill Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/70 text-xs font-semibold text-slate-600 backdrop-blur-md">
            <button
              type="button"
              onClick={scrollToExplore}
              className="px-4 py-1.5 rounded-full hover:text-blue-700 hover:bg-white hover:shadow-xs border border-transparent transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>ภาพรวมระบบ</span>
            </button>
            <a
              href="#departments"
              className="px-4 py-1.5 rounded-full hover:text-blue-700 hover:bg-white hover:shadow-xs border border-transparent transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>หน่วยรับตรวจ 6 กอง</span>
            </a>
            <a
              href="#modules"
              className="px-4 py-1.5 rounded-full hover:text-blue-700 hover:bg-white hover:shadow-xs border border-transparent transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ฟังก์ชันการตรวจสอบ</span>
            </a>
          </nav>

          {/* Action / Login CTA Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {session ? (
              <button
                type="button"
                onClick={onEnterDashboard}
                className="relative group p-[1px] rounded-full overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <div className="px-4 sm:px-5 py-2 rounded-full bg-white group-hover:bg-transparent text-slate-800 group-hover:text-white font-bold text-xs flex items-center space-x-2 transition-all">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">ไปยังแดชบอร์ดงาน</span>
                  <span className="text-blue-700 group-hover:text-white">({session.displayName || session.username})</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="relative group p-[1px] rounded-full overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition-all cursor-pointer"
              >
                <div className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center space-x-2 transition-all">
                  <LogIn className="w-3.5 h-3.5 text-blue-100" />
                  <span>เข้าสู่ระบบ (Sign In)</span>
                </div>
              </button>
            )}
          </div>
        </header>
      </div>

      {/* 2. Responsive Hero Banner (Option B: Royal Blue & Cyber Cyan Cosmic Beam) */}
      <section className="relative w-full pt-3 sm:pt-4 pb-6 px-3 sm:px-6 max-w-7xl mx-auto">
        <ResponsiveHeroBanner
          session={session}
          onPrimaryClick={scrollToLogin}
          onSecondaryClick={scrollToExplore}
          onCtaClick={scrollToLogin}
          partners={heroPartners}
        />
      </section>

      {/* 3. Quick Stats & System Pillars */}
      <section id="welcome-features" className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Digital Internal Audit Transformation</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
            ยกระดับงานตรวจสอบภายใน อบต.ฝางคำ สู่มาตรฐานสากล
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            ผสานการประเมินความเสี่ยงตามหลักสากล SOFCK Matrix, แผนการตรวจสอบประจำปี, แนวการตรวจด้วย AI ตามหนังสือ ว 614 และการประเมินการควบคุมภายใน ปอ.1 - ปค.5 ในที่เดียว
          </p>
        </div>

        {/* 4. Departments Grid (6 หน่วยรับตรวจ) */}
        <div id="departments" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>โครงสร้างหน่วยรับตรวจและผู้ใช้งานรายกอง</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                กำหนดสิทธิ์การมองเห็นและการปฏิบัติงานแยกอิสระตามภารกิจของแต่ละกอง
              </p>
            </div>
            <div className="text-xs text-slate-400">
              องค์การบริหารส่วนตำบลฝางคำ อำเภอสิรินธร จ.อุบลราชธานี
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const matchedUser = availableUsers.find((u) => u.department === dept);
              const isAudit = dept === 'หน่วยตรวจสอบภายใน';

              return (
                <div
                  key={dept}
                  onClick={() => {
                    if (matchedUser) handleQuickSelect(matchedUser);
                    else setShowLoginModal(true);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] flex flex-col justify-between ${
                    isAudit
                      ? 'bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white border-blue-200 hover:border-blue-400 shadow-sm shadow-blue-100/60'
                      : 'bg-white border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-xs ${
                          isAudit ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-600 group-hover:bg-blue-50'
                        }`}
                      >
                        {isAudit ? '👑' : '🏢'}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isAudit
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isAudit ? 'ADMIN' : 'หน่วยรับตรวจ'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                        {dept}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {matchedUser?.position || 'บุคลากรและเจ้าหน้าที่ผู้รับผิดชอบงานประจำกอง'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 group-hover:text-blue-700">
                    <span className="font-medium">
                      {matchedUser ? `เข้าใช้งานในฐานะ @${matchedUser.username}` : 'คลิกเพื่อเข้าสู่ระบบ'}
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Core System Modules */}
        <div id="modules" className="space-y-6 pt-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="text-lg md:text-2xl font-bold text-slate-900">
              ระบบงานอัจฉริยะครบวงจร (Audit Modules)
            </h3>
            <p className="text-xs text-slate-500">
              ขับเคลื่อนงานตรวจสอบภายในอย่างเป็นระบบ ตรงตามระเบียบกระทรวงการคลังและมาตรฐานสถ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 shadow-xs hover:shadow-md hover:border-amber-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">การประเมินความเสี่ยง SOFCK</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                จัดลำดับความเสี่ยง 21 กิจกรรม อบต.ฝางคำ ด้วยระบบ 5 ปัจจัย คำนวณความเสี่ยงสูง-กลาง-ต่ำอัตโนมัติ
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">แผนปฏิบัติงานตรวจ (ว 614)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                สร้างแผนรายกิจกรรมอัตโนมัติ พร้อมเทมเพลตและระบบผู้ช่วย AI ช่วยเขียนวัตถุประสงค์และแนวการตรวจ
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">กระดาษทำการตรวจ & LPA</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                บันทึกการสุ่มตรวจ บันทึกผล และเตรียมหลักฐานประเมินประสิทธิภาพ อปท. (LPA) ครบทุกมิติ
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">การควบคุมภายใน ปอ.1 - ปค.5</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ให้แต่ละกองเข้ามาจัดทำและบันทึกรายงานการควบคุมภายในประจำปีได้อย่างถูกต้องตามมาตรฐาน
              </p>
            </div>
          </div>
        </div>

        {/* 6. Call to Action Banner */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 border border-blue-400/20 text-white text-center space-y-5 relative overflow-hidden shadow-xl shadow-blue-900/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-xl md:text-3xl font-extrabold text-white">
            พร้อมเริ่มต้นปฏิบัติงานตรวจสอบภายในแล้วหรือยัง?
          </h3>
          <p className="text-xs md:text-sm text-blue-100 max-w-xl mx-auto">
            เข้าสู่ระบบด้วยชื่อผู้ใช้งานประจำกองของท่าน หรือติดต่อผู้ดูแลระบบ (หน่วยตรวจสอบภายใน) เพื่อเปิดสิทธิ์การใช้งาน
          </p>
          <div>
            {session ? (
              <button
                type="button"
                onClick={onEnterDashboard}
                className="bg-white hover:bg-blue-50 text-blue-950 font-bold text-sm px-6 py-3 rounded-2xl inline-flex items-center space-x-2 shadow-lg shadow-black/10 transition-all cursor-pointer"
              >
                <span>กลับสู่หน้าทำงาน (Dashboard)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="bg-white hover:bg-blue-50 text-blue-950 font-bold text-sm px-6 py-3 rounded-2xl inline-flex items-center space-x-2 shadow-lg shadow-black/10 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-blue-700" />
                <span>เข้าสู่ระบบตรวจสอบภายในทันที</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-200/80 py-8 px-4 text-center text-xs text-slate-500 space-y-1 bg-white/40">
        <p className="font-semibold text-slate-700">
          หน่วยตรวจสอบภายใน องค์การบริหารส่วนตำบลฝางคำ
        </p>
        <p>
          อำเภอสิรินธร จังหวัดอุบลราชธานี | พัฒนาและดูแลระบบโดย: หน่วยตรวจสอบภายใน องค์การบริหารส่วนตำบลฝางคำ
        </p>
        <p className="text-[10px] text-slate-400 pt-2">
          IA-OS: Internal Audit Operating System for Local Administrative Organizations
        </p>
      </footer>

      {/* =========================================================================
          LOGIN MODAL
      ========================================================================= */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 space-y-5 relative text-slate-900">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">เข้าสู่ระบบ IA-OS ฝางคำ</h3>
              <p className="text-xs text-slate-500">
                เลือกหรือกรอกชื่อผู้ใช้ของกองท่านเพื่อเข้าปฏิบัติงาน
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อผู้ใช้งาน (Username):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="เช่น admin, finance, palat..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  รหัสผ่าน (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน (เช่น 1234 หรือ admin123)"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-500 text-[11px]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 bg-slate-100 border-slate-300"
                  />
                  <span>จดจำชื่อผู้ใช้งานในเครื่องนี้</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{busy ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}</span>
              </button>
            </form>

            {/* Quick account selector chips */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <span className="text-[11px] text-slate-500 block font-medium">
                เลือกเข้าสู่ระบบด่วนตามกอง:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {availableUsers.map((u) => {
                  let label = u.displayName || u.username;
                  if (u.role === 'admin' && (label === 'นายศุภมงคล ธรรมพิทักษ์' || !label || label === 'admin')) {
                    label = 'หน่วยตรวจสอบฯ';
                  } else if (label === 'กองสาธารณสุขและสิ่งแวดล้อม') {
                    label = 'กองสวัสดิการสังคม';
                  }
                  return (
                    <button
                      key={u.username}
                      type="button"
                      onClick={() => handleQuickSelect(u)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                        username.toLowerCase() === u.username.toLowerCase()
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      {u.role === 'admin' ? '👑 ' : '🏢 '}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
