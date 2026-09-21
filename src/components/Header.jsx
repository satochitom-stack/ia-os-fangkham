import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Calendar,
  Building2,
  Sun,
  Moon,
  KeyRound,
  LogOut,
  ChevronDown,
  Settings,
  Plus,
  UserCheck,
  Users,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Header({
  orgProfile,
  selectedYear,
  setSelectedYear,
  fiscalYears = ['2567', '2568', '2569', '2570'],
  darkMode,
  onToggleDarkMode,
  session,
  onLogout,
  onChangePassword,
  onOpenSettings,
  onOpenUsersManagement,
  onOpenWelcome
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = session?.role === 'admin';
  const userTitle = session?.displayName || (isAdmin ? orgProfile?.auditorName : session?.username);
  const departmentLabel = session?.department || (isAdmin ? 'หน่วยตรวจสอบภายใน' : 'ส่วนราชการ');

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Agency Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  ระบบปฏิบัติการตรวจสอบภายใน อปท. (IA-OS)
                </h1>
                <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                  พ.ศ. {selectedYear}
                </span>
                {isAdmin ? (
                  <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    👑 ADMIN
                  </span>
                ) : (
                  <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    🏢 USER: {departmentLabel}
                  </span>
                )}
              </div>
              <button
                onClick={isAdmin ? onOpenSettings : undefined}
                className={`text-xs text-slate-500 dark:text-slate-400 flex items-center mt-0.5 transition-colors text-left ${
                  isAdmin ? 'hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer' : 'cursor-default'
                }`}
                title={isAdmin ? 'คลิกเพื่อแก้ไขข้อมูลหน่วยงานและผู้ตรวจสอบ' : ''}
              >
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate max-w-[260px] sm:max-w-md">
                  {orgProfile.name} • {orgProfile.district} {orgProfile.province}
                </span>
              </button>
            </div>
          </div>

          {/* Right Controls: Fiscal Year, Theme, Profile Settings */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Fiscal Year Selector & Add Year button */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200/80 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-1.5 mr-1" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mr-1.5 hidden sm:inline">
                ปีงบ:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white dark:bg-slate-900 text-xs font-bold text-blue-700 dark:text-blue-400 rounded-md px-2 py-1 border-none shadow-xs focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {fiscalYears.map((yr) => (
                  <option key={yr} value={yr}>
                    พ.ศ. {yr}
                  </option>
                ))}
              </select>
              {isAdmin && (
                <button
                  onClick={onOpenSettings}
                  title="เพิ่มหรือจัดการปีงบประมาณ"
                  className="ml-1 px-1.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition-colors flex items-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden md:inline ml-0.5">เพิ่มปี</span>
                </button>
              )}
            </div>

            {/* Welcome Page Button */}
            <button
              onClick={onOpenWelcome}
              title="เปิดหน้าต้อนรับ / ภาพรวมระบบ (Welcome Page)"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition-all text-xs font-semibold cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span className="hidden sm:inline">หน้าแรก / ต้อนรับ</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
              className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-amber-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Account Menu */}
            <div className="relative pl-1 border-l border-slate-200 dark:border-slate-700" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center space-x-2 pl-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shadow-xs shrink-0 ${
                    isAdmin
                      ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400'
                      : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {isAdmin ? '👑' : '🏢'}
                </div>
                <div className="hidden md:block text-left max-w-[150px]">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {userTitle}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {departmentLabel}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden md:block" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-40 text-xs">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{userTitle}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{departmentLabel}</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                      ชื่อผู้ใช้: @{session?.username} • {isAdmin ? 'สิทธิ์ผู้ดูแลระบบ' : 'สิทธิ์ประจำกอง'}
                    </div>
                  </div>

                  {isAdmin && onOpenUsersManagement && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenUsersManagement();
                      }}
                      className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer font-bold border-b border-slate-100 dark:border-slate-800"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>จัดการผู้ใช้งาน & กำหนดสิทธิ์รายกอง</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onOpenWelcome) onOpenWelcome();
                    }}
                    className="w-full flex items-center space-x-2 px-3.5 py-2 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 cursor-pointer font-medium border-b border-slate-100 dark:border-slate-800"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>🌟 หน้าต้อนรับ (Welcome Page)</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer font-medium"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>ตั้งค่าข้อมูล อบต. และผู้ตรวจ</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onChangePassword();
                    }}
                    className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer font-medium"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>เปลี่ยนรหัสผ่านเข้าสู่ระบบ</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer font-semibold border-t border-slate-100 dark:border-slate-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ / สลับบัญชี</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
