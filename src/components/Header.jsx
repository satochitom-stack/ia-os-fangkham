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
  UserCheck
} from 'lucide-react';

export default function Header({
  orgProfile,
  selectedYear,
  setSelectedYear,
  fiscalYears = ['2567', '2568', '2569', '2570'],
  darkMode,
  onToggleDarkMode,
  username,
  onLogout,
  onChangePassword,
  onOpenSettings
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

  const auditorDisplay = orgProfile.auditorName?.trim() || 'ยังไม่ได้ระบุชื่อ';
  const hasAuditorName = Boolean(orgProfile.auditorName?.trim());

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
              </div>
              <button
                onClick={onOpenSettings}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center mt-0.5 transition-colors cursor-pointer text-left"
                title="คลิกเพื่อแก้ไขข้อมูลหน่วยงานและผู้ตรวจสอบ"
              >
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate max-w-[260px] sm:max-w-md">
                  {orgProfile.name} • {orgProfile.agencyName} {orgProfile.district} {orgProfile.province}
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
              <button
                onClick={onOpenSettings}
                title="เพิ่มหรือจัดการปีงบประมาณ"
                className="ml-1 px-1.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition-colors flex items-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline ml-0.5">เพิ่มปี</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
              className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-amber-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auditor & Account Menu */}
            <div className="relative pl-1 border-l border-slate-200 dark:border-slate-700" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center space-x-2 pl-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shadow-xs shrink-0 ${
                    hasAuditorName
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                      : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-left max-w-[150px]">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {auditorDisplay}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {hasAuditorName ? orgProfile.auditorPosition : 'คลิกเพื่อตั้งชื่อผู้ตรวจ'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden md:block" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-40 text-xs">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{auditorDisplay}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{orgProfile.auditorPosition}</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">ผู้ใช้งาน: {username}</div>
                  </div>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>เปลี่ยนชื่อผู้ตรวจ / ตั้งค่าระบบ</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onChangePassword();
                    }}
                    className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>เปลี่ยนรหัสผ่านเข้าสู่ระบบ</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
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
