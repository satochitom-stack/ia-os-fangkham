import React, { useState, useRef } from 'react';
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
import Html from './ui/hero-futuristic';
import { verifyLogin, startSession, getUsers, getLastUsername, setLastUsername, getDepartments } from '../utils/auth';

export default function WelcomeView({ session, onLogin, onEnterDashboard }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState(() => getLastUsername());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const passwordInputRef = useRef(null);
  const loginSectionRef = useRef(null);

  const availableUsers = getUsers();
  const departments = getDepartments();

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* 1. Floating Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/75 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wider text-white flex items-center space-x-2">
              <span>IA-OS</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                อบต.ฝางคำ
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              ระบบปฏิบัติการตรวจสอบภายในยุคดิจิทัล
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
          <button
            type="button"
            onClick={scrollToExplore}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            ภาพรวมระบบ
          </button>
          <a
            href="#departments"
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            หน่วยรับตรวจ 6 กอง
          </a>
          <a
            href="#modules"
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            ฟังก์ชันการตรวจสอบ
          </a>
        </nav>

        <div className="flex items-center space-x-2.5">
          {session ? (
            <button
              type="button"
              onClick={onEnterDashboard}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <span>ไปยังแดชบอร์ดงาน ({session.displayName || session.username})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ (Sign In)</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Futuristic Hero Canvas (Using user provided component) */}
      <section className="relative w-full h-svh">
        <Html
          title="BUILD YOUR DREAMS"
          subtitle="AI-POWERED CREATIVITY FOR THE NEXT GENERATION."
          buttonText="Scroll to explore"
          onExplore={scrollToExplore}
        />
      </section>

      {/* 3. Quick Stats & System Pillars */}
      <section id="welcome-features" className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Internal Audit Transformation</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            ยกระดับงานตรวจสอบภายใน อบต.ฝางคำ สู่มาตรฐานสากล
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            ผสานการประเมินความเสี่ยงตามหลักสากล SOFCK Matrix, แผนการตรวจสอบประจำปี, แนวการตรวจด้วย AI ตามหนังสือ ว 614 และการประเมินการควบคุมภายใน ปอ.1 - ปค.5 ในที่เดียว
          </p>
        </div>

        {/* 4. Departments Grid (6 หน่วยรับตรวจ) */}
        <div id="departments" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center space-x-2">
                <Building className="w-5 h-5 text-cyan-400" />
                <span>โครงสร้างหน่วยรับตรวจและผู้ใช้งานรายกอง</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                กำหนดสิทธิ์การมองเห็นและการปฏิบัติงานแยกอิสระตามภารกิจของแต่ละกอง
              </p>
            </div>
            <div className="text-xs text-slate-500">
              องค์การบริหารส่วนตำบลฝางคำ อำเภอกุดข้าวปุ้น จ.อุบลราชธานี
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
                      ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-500/40 hover:border-cyan-400 shadow-lg shadow-indigo-950/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                          isAudit ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-cyan-400'
                        }`}
                      >
                        {isAudit ? '👑' : '🏢'}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isAudit
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isAudit ? 'ADMIN' : 'หน่วยรับตรวจ'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {dept}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {matchedUser?.position || 'บุคลากรและเจ้าหน้าที่ผู้รับผิดชอบงานประจำกอง'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 group-hover:text-cyan-300">
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
            <h3 className="text-lg md:text-2xl font-bold text-white">
              ระบบงานอัจฉริยะครบวงจร (Audit Modules)
            </h3>
            <p className="text-xs text-slate-400">
              ขับเคลื่อนงานตรวจสอบภายในอย่างเป็นระบบ ตรงตามระเบียบกระทรวงการคลังและมาตรฐานสถ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">การประเมินความเสี่ยง SOFCK</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                จัดลำดับความเสี่ยง 21 กิจกรรม อบต.ฝางคำ ด้วยระบบ 5 ปัจจัย คำนวณความเสี่ยงสูง-กลาง-ต่ำอัตโนมัติ
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">แผนปฏิบัติงานตรวจ (ว 614)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                สร้างแผนรายกิจกรรมอัตโนมัติ พร้อมเทมเพลตและระบบผู้ช่วย AI ช่วยเขียนวัตถุประสงค์และแนวการตรวจ
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">กระดาษทำการตรวจ & LPA</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                บันทึกการสุ่มตรวจ บันทึกผล และเตรียมหลักฐานประเมินประสิทธิภาพ อปท. (LPA) ครบทุกมิติ
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">การควบคุมภายใน ปอ.1 - ปค.5</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ให้แต่ละกองเข้ามาจัดทำและบันทึกรายงานการควบคุมภายในประจำปีได้อย่างถูกต้องตามมาตรฐาน
              </p>
            </div>
          </div>
        </div>

        {/* 6. Call to Action Banner */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-950/60 to-slate-900 border border-cyan-500/30 text-center space-y-5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-xl md:text-3xl font-extrabold text-white">
            พร้อมเริ่มต้นปฏิบัติงานตรวจสอบภายในแล้วหรือยัง?
          </h3>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto">
            เข้าสู่ระบบด้วยชื่อผู้ใช้งานประจำกองของท่าน หรือติดต่อผู้ดูแลระบบ (หน่วยตรวจสอบภายใน) เพื่อเปิดสิทธิ์การใช้งาน
          </p>
          <div>
            {session ? (
              <button
                type="button"
                onClick={onEnterDashboard}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-2xl inline-flex items-center space-x-2 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <span>กลับสู่หน้าทำงาน (Dashboard)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-2xl inline-flex items-center space-x-2 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบตรวจสอบภายในทันที</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">
          หน่วยตรวจสอบภายใน องค์การบริหารส่วนตำบลฝางคำ
        </p>
        <p>
          อำเภอกุดข้าวปุ้น จังหวัดอุบลราชธานี | ผู้พัฒนา: นายศุภมงคล ธรรมพิทักษ์ (นักวิชาการตรวจสอบภายในปฏิบัติการ)
        </p>
        <p className="text-[10px] text-slate-600 pt-2">
          IA-OS: Internal Audit Operating System for Local Administrative Organizations
        </p>
      </footer>

      {/* =========================================================================
          LOGIN MODAL
      ========================================================================= */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">เข้าสู่ระบบ IA-OS ฝางคำ</h3>
              <p className="text-xs text-slate-400">
                เลือกหรือกรอกชื่อผู้ใช้ของกองท่านเพื่อเข้าปฏิบัติงาน
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ชื่อผู้ใช้งาน (Username):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="เช่น admin, finance, palat..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  รหัสผ่าน (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน (เช่น 1234 หรือ admin123)"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-400 text-[11px]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-800 border-slate-700"
                  />
                  <span>จดจำชื่อผู้ใช้งานในเครื่องนี้</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{busy ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}</span>
              </button>
            </form>

            {/* Quick account selector chips */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] text-slate-400 block font-medium">
                เลือกเข้าสู่ระบบด่วนตามกอง:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {availableUsers.map((u) => (
                  <button
                    key={u.username}
                    type="button"
                    onClick={() => handleQuickSelect(u)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      username.toLowerCase() === u.username.toLowerCase()
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {u.role === 'admin' ? '👑 ' : '🏢 '}
                    {u.displayName || u.username}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
