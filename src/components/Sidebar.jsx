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
  Sparkles
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'ภาพรวม & ปฏิทินงาน', icon: LayoutDashboard },
    { id: 'audit-risk', label: 'การประเมินความเสี่ยง', icon: ShieldAlert },
    { id: 'planning', label: 'แผน & นโยบายตรวจ', icon: FileText },
    { id: 'engagement-plan', label: 'แผนปฏิบัติงานตรวจ (ว 614)', icon: Sparkles },
    { id: 'execution', label: 'ปฏิบัติการตรวจ & กระดาษทำการ', icon: ClipboardCheck },
    { id: 'reporting', label: 'รายงาน & ติดตามผล', icon: FileSpreadsheet },
    { id: 'control-risk', label: 'ควบคุมภายใน & บริหารความเสี่ยง', icon: ShieldCheck },
    { id: 'lpa', label: 'เตรียมรับประเมิน LPA', icon: Award },
    { id: 'knowledge', label: 'คลังระเบียบ & แบบฟอร์ม', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-4 border-b border-slate-800/80">
        <div className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          เมนูระบบตรวจสอบภายใน
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1.5">
        {menuItems.map((item) => {
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

      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">ระบบปฏิบัติงานตรวจสอบ</span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
          มาตรฐานกระทรวงการคลัง (IA-OS)
        </div>
      </div>
    </aside>
  );
}
