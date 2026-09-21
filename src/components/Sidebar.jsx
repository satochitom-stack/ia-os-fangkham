import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  FileText,
  ClipboardCheck,
  FileSpreadsheet,
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Users
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, session }) {
  const menuItems = [
    { id: 'welcome', label: '🌟 หน้าแรก / หน้าต้อนรับ', icon: Sparkles, alwaysVisible: true },
    { id: 'dashboard', label: 'ภาพรวม & ปฏิทินงาน', icon: LayoutDashboard },
    { id: 'audit-risk', label: 'การประเมินความเสี่ยง', icon: ShieldAlert },
    { id: 'planning', label: 'แผน & นโยบายตรวจ', icon: FileText },
    { id: 'engagement-plan', label: 'แผนปฏิบัติงานตรวจ (ว 614)', icon: Sparkles },
    { id: 'execution', label: 'ปฏิบัติการตรวจ & กระดาษทำการ', icon: ClipboardCheck },
    { id: 'reporting', label: 'รายงาน & ติดตามผล', icon: FileSpreadsheet },
    { id: 'control-risk', label: 'ควบคุมภายใน & บริหารความเสี่ยง', icon: ShieldCheck },
    { id: 'lpa', label: 'เตรียมรับประเมิน LPA', icon: Award },
    { id: 'knowledge', label: 'คลังระเบียบ & แบบฟอร์ม', icon: BookOpen },
    { id: 'users', label: 'จัดการผู้ใช้งาน & กำหนดสิทธิ์', icon: Users, adminOnly: true }
  ];

  const isAdmin = session?.role === 'admin';
  const userPermissions = session?.permissions || [];

  // กรองเมนูตามสิทธิ์ของผู้ใช้งาน
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.alwaysVisible) return true;
    if (isAdmin) return true;
    if (item.adminOnly) return false;
    return userPermissions.includes(item.id);
  });

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          เมนูระบบตรวจสอบภายใน
        </div>
        {isAdmin ? (
          <span className="text-[10px] bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
            ADMIN
          </span>
        ) : (
          <span className="text-[10px] bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
            USER
          </span>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate text-left">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Info Card in Sidebar Bottom */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 space-y-1.5">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
            {isAdmin ? '👑' : '🏢'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-200 truncate">
              {session?.displayName || session?.username || 'ผู้ใช้งาน'}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {session?.department || 'สังกัดส่วนราชการ'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>สิทธิ์: {isAdmin ? 'เต็มสิทธิ์ทุกเมนู' : `${visibleMenuItems.length} เมนู`}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
