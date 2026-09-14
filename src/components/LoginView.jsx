import React, { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { hasAccount, createAccount, verifyLogin, startSession } from '../utils/auth';

export default function LoginView({ onLogin }) {
  const [isSetup] = useState(() => !hasAccount());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      return;
    }
    if (password.length < 4) {
      setError('รหัสผ่านควรมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      setError('รหัสผ่านที่ยืนยันไม่ตรงกัน');
      return;
    }
    setBusy(true);
    try {
      await createAccount(username, password);
      startSession(username.trim(), remember);
      onLogin(username.trim());
    } catch {
      setError('ไม่สามารถสร้างบัญชีผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setBusy(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }
    setBusy(true);
    try {
      const ok = await verifyLogin(username, password);
      if (!ok) {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setBusy(false);
        return;
      }
      startSession(username.trim(), remember);
      onLogin(username.trim());
    } catch {
      setError('เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-base font-black text-slate-900 dark:text-slate-100 leading-tight">
            ระบบปฏิบัติการตรวจสอบภายใน อปท. (IA-OS)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            องค์การบริหารส่วนตำบลฝางคำ
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              {isSetup ? (
                <>
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>ตั้งค่าบัญชีผู้ใช้ครั้งแรก</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </h2>
            {isSetup && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1.5 leading-relaxed">
                ระบบนี้ใช้งานคนเดียวและเก็บข้อมูลไว้ในเครื่องนี้เท่านั้น
                กรุณาตั้งชื่อผู้ใช้และรหัสผ่านของคุณเอง และจดจำไว้ให้ดี
                เนื่องจากระบบไม่มีฟังก์ชันกู้คืนรหัสผ่านอัตโนมัติ
              </p>
            )}
          </div>

          <form
            onSubmit={isSetup ? handleSetupSubmit : handleLoginSubmit}
            className="space-y-3.5 text-xs"
          >
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อผู้ใช้</label>
              <div className="relative mt-1">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  autoComplete="username"
                  placeholder="เช่น auditor.fangkham"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">รหัสผ่าน</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSetup ? 'new-password' : 'current-password'}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSetup && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ยืนยันรหัสผ่าน</label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
              />
              <span>จดจำการเข้าสู่ระบบไว้ในเครื่องนี้</span>
            </label>

            {error && (
              <div className="flex items-start space-x-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 rounded-xl p-2.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl shadow-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors"
            >
              {isSetup ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isSetup ? 'สร้างบัญชีและเข้าสู่ระบบ' : 'เข้าสู่ระบบ'}</span>
            </button>
          </form>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-4">
          ข้อมูลบัญชีผู้ใช้ถูกเก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น ไม่มีการส่งออกไปที่ใด
        </p>
      </div>
    </div>
  );
}
