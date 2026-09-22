import React, { useState, useRef } from 'react';
import { Shield, User, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { verifyLogin, startSession, getUsers, getLastUsername, setLastUsername } from '../utils/auth';

export default function LoginView({ onLogin }) {
  const [username, setUsername] = useState(() => getLastUsername());
  const [password, setPassword] = useState(''); // Never prefill password
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(true);
  const passwordInputRef = useRef(null);

  const availableUsers = getUsers();

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
      const session = startSession(user, remember);
      onLogin(session);
    } catch {
      setError('เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      setBusy(false);
    }
  };

  const handleQuickSelect = (u) => {
    setUsername(u.username);
    setPassword(''); // Do NOT remember or autofill password
    setError('');
    setLastUsername(u.username);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        {/* App Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
            ระบบปฏิบัติการตรวจสอบภายใน อปท. (IA-OS)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            องค์การบริหารส่วนตำบลฝางคำ อำเภอสิรินธร จังหวัดอุบลราชธานี
          </p>
          <div className="mt-2 inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3 h-3" />
            <span>ระบบกำหนดสิทธิ์รายกอง (Multi-User RBAC)</span>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>เข้าสู่ระบบตรวจสอบภายใน</span>
            </h2>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ชื่อผู้ใช้งาน (Username):
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น admin, finance, clerk..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  placeholder="รหัสผ่าน"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-slate-600 dark:text-slate-400 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>จดจำการเข้าสู่ระบบ</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
            >
              {busy ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Account Picker */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setShowQuickLogin(!showQuickLogin)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
            >
              <span>⚡ เลือกเข้าสู่ระบบด่วนรายกอง (Quick Switch):</span>
              {showQuickLogin ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showQuickLogin && (
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {availableUsers.map((u) => {
                  const isSelected = username.toLowerCase() === u.username.toLowerCase();
                  const isAdmin = u.role === 'admin';
                  return (
                    <button
                      key={u.username}
                      type="button"
                      onClick={() => handleQuickSelect(u)}
                      className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold ring-1 ring-blue-500/30'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{isAdmin ? '👑' : '🏢'}</span>
                        <span className="truncate font-bold">
                          {isAdmin && (u.displayName === 'นายศุภมงคล ธรรมพิทักษ์' || !u.displayName || u.displayName === 'admin')
                            ? 'หน่วยตรวจสอบฯ'
                            : (u.displayName === 'กองสาธารณสุขและสิ่งแวดล้อม' ? 'กองสวัสดิการสังคม' : (u.displayName || u.username))}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        @{u.username}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          มาตรฐานระบบงานตรวจสอบภายในองค์กรปกครองส่วนท้องถิ่น
        </div>
      </div>
    </div>
  );
}
