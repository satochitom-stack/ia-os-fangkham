import React, { useState, useRef, useEffect } from 'react';
import { Shield, Calendar, Building2, Sun, Moon, KeyRound, LogOut, ChevronDown } from 'lucide-react';

export default function Header({
  orgProfile,
  selectedYear,
  setSelectedYear,
  darkMode,
  onToggleDarkMode,
  username,
  onLogout,
  onChangePassword
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

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
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
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500" />
                {orgProfile.name} • {orgProfile.agencyName} {orgProfile.district} {orgProfile.province}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200/80 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-2 mr-1.5" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mr-2">ปีงบประมาณ:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white dark:bg-slate-900 text-xs font-bold text-blue-700 dark:text-blue-400 rounded-md px-2.5 py-1 border-none shadow-xs focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="2567">2567</option>
                <option value="2568">2568</option>
                <option value="2569">2569</option>
              </select>
            </div>

            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
              className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-amber-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative pl-1 border-l border-slate-200 dark:border-slate-700" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center space-x-2 pl-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                  ผต.
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{orgProfile.auditorName}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{username}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden md:block" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-40 text-xs">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{orgProfile.auditorName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">ผู้ใช้งาน: {username}</div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onChangePassword();
                    }}
                    className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>เปลี่ยนชื่อผู้ใช้ / รหัสผ่าน</span>
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
