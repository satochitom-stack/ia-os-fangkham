import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  FileText,
  ClipboardCheck,
  FileSpreadsheet,
  ShieldCheck,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Users,
  Wrench,
  ChevronDown,
  ChevronRight,
  Calculator,
  Clock,
  HardHat,
  Building2
} from 'lucide-react';

export default function Sidebar({
  currentTab,
  setCurrentTab,
  session,
  activeToolkitTab = 'factor-f',
  setActiveToolkitTab
}) {
  const isAdmin = session?.role === 'admin';
  const userPermissions = session?.permissions || [];
  const [toolkitSubmenuOpen, setToolkitSubmenuOpen] = useState(true);

  // Grouped Menu Structure organized into 5 Professional Pillars
  const MENU_PILLARS = [
    {
      pillarId: 'pillar-1',
      pillarNumber: 'หมวดที่ 1',
      pillarTitle: 'การวางแผน & ประเมินความเสี่ยง',
      items: [
        { id: 'dashboard', label: 'ภาพรวม & ปฏิทินงาน', icon: LayoutDashboard },
        { id: 'audit-risk', label: 'การประเมินความเสี่ยงแผน', icon: ShieldAlert, badge: 'SOFCK' },
        { id: 'planning', label: 'แผนการตรวจสอบประจำปี', icon: FileText },
        { id: 'engagement-plan', label: 'แผนปฏิบัติงานตรวจ (ว 614)', icon: Sparkles, badge: 'ว 614' }
      ]
    },
    {
      pillarId: 'pillar-2',
      pillarNumber: 'หมวดที่ 2',
      pillarTitle: 'ปฏิบัติการตรวจ & เครื่องมือเชิงเทคนิค',
      items: [
        { id: 'execution', label: 'กระดาษทำการตรวจสอบ', icon: ClipboardCheck },
        {
          id: 'audit-toolkits',
          label: 'เครื่องมือช่วยตรวจเชิงเทคนิค',
          icon: Wrench,
          badge: 'ปี 70 ✨',
          hasSubmenu: true,
          subItems: [
            { toolId: 'factor-f', label: 'ราคากลาง & Factor F', icon: Calculator },
            { toolId: 'penalty', label: 'ค่าปรับจัดซื้อจัดจ้าง', icon: Clock },
            { toolId: 'ordinance', label: 'งานก่อสร้างตามข้อบัญญัติ', icon: HardHat },
            { toolId: 'permit', label: 'ค่าธรรมเนียมใบอนุญาต', icon: Building2 }
          ]
        }
      ]
    },
    {
      pillarId: 'pillar-3',
      pillarNumber: 'หมวดที่ 3',
      pillarTitle: 'รายงานผล สรุปตรวจพบ & ติดตาม',
      items: [
        { id: 'reporting', label: 'รายงานผล & ติดตามข้อเสนอแนะ', icon: FileSpreadsheet, badge: '4 องค์ประกอบ' }
      ]
    },
    {
      pillarId: 'pillar-4',
      pillarNumber: 'หมวดที่ 4',
      pillarTitle: 'ธรรมาภิบาล ควบคุมภายใน & LPA',
      items: [
        { id: 'internal-control', label: 'การควบคุมภายใน (ปค.4/5)', icon: ShieldCheck, badge: 'กค. 2561' },
        { id: 'risk-management', label: 'การบริหารความเสี่ยงองค์กร', icon: AlertTriangle, badge: 'บส.1-5' },
        { id: 'lpa', label: 'เตรียมรับประเมิน LPA', icon: Award, badge: 'ด้านที่ 1' }
      ]
    },
    {
      pillarId: 'pillar-5',
      pillarNumber: 'หมวดที่ 5',
      pillarTitle: 'คลังระเบียบ & บริหารระบบ',
      items: [
        { id: 'knowledge', label: 'คลังระเบียบและกฎหมาย', icon: BookOpen },
        { id: 'forms', label: 'แบบฟอร์มมาตรฐาน', icon: FileSpreadsheet, badge: 'ว 3482' },
        { id: 'users', label: 'จัดการผู้ใช้งาน & กำหนดสิทธิ์', icon: Users, adminOnly: true, badge: 'ADMIN' }
      ]
    }
  ];

  const canAccessItem = (item) => {
    if (isAdmin) return true;
    if (item.adminOnly) return false;
    return userPermissions.includes(item.id);
  };

  return (
    <aside className="w-68 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            ระบบตรวจสอบภายใน อปท.
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            5 เสาหลัก & เครื่องมือปี 70
          </div>
        </div>
        {isAdmin ? (
          <span className="text-[10px] bg-blue-50 dark:bg-indigo-950 border border-blue-200 dark:border-indigo-500/30 text-blue-700 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded">
            ADMIN
          </span>
        ) : (
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
            USER
          </span>
        )}
      </div>

      {/* Navigation Menu List */}
      <nav className="flex-1 p-2.5 space-y-3 overflow-y-auto custom-scrollbar">
        {/* Welcome / Quick Portal Button */}
        <button
          onClick={() => setCurrentTab('welcome')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentTab === 'welcome'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>หน้าแรก / หน้าต้อนรับ</span>
          </div>
          <span className="text-[10px] bg-amber-400/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
            Portal
          </span>
        </button>

        {/* 5 Grouped Pillars */}
        {MENU_PILLARS.map((pillar) => {
          const visibleItems = pillar.items.filter(canAccessItem);
          if (visibleItems.length === 0) return null;

          return (
            <div key={pillar.pillarId} className="space-y-1">
              {/* Pillar Category Header */}
              <div className="px-2 pt-1 pb-1 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {pillar.pillarNumber}: {pillar.pillarTitle}
                </span>
              </div>

              {/* Items in this Pillar */}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  const hasSubmenu = Boolean(item.hasSubmenu && item.subItems);

                  return (
                    <div key={item.id} className="space-y-0.5">
                      <button
                        onClick={() => {
                          setCurrentTab(item.id);
                          if (hasSubmenu) {
                            setToolkitSubmenuOpen(true);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white shadow-xs font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 hover:text-blue-700 dark:hover:text-blue-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span className="truncate text-left">{item.label}</span>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0 ml-1">
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {hasSubmenu && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setToolkitSubmenuOpen(!toolkitSubmenuOpen);
                              }}
                              className="p-0.5 hover:bg-white/10 rounded"
                            >
                              {toolkitSubmenuOpen ? (
                                <ChevronDown className="w-3 h-3 opacity-70" />
                              ) : (
                                <ChevronRight className="w-3 h-3 opacity-70" />
                              )}
                            </button>
                          )}
                        </div>
                      </button>

                      {/* Sub-menu items (สำหรับเมนูเครื่องมือเชิงเทคนิค) */}
                      {hasSubmenu && toolkitSubmenuOpen && (
                        <div className="ml-5 pl-2.5 border-l-2 border-blue-200 dark:border-blue-900/60 space-y-0.5 py-0.5">
                          {item.subItems.map((sub) => {
                            const SubIcon = sub.icon;
                            const isSubActive = currentTab === 'audit-toolkits' && activeToolkitTab === sub.toolId;

                            return (
                              <button
                                key={sub.toolId}
                                onClick={() => {
                                  setCurrentTab('audit-toolkits');
                                  if (setActiveToolkitTab) {
                                    setActiveToolkitTab(sub.toolId);
                                  }
                                }}
                                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                                  isSubActive
                                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <SubIcon className={`w-3 h-3 shrink-0 ${isSubActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                                <span className="truncate text-left">{sub.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Info Card in Sidebar Bottom */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 space-y-1.5">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
            {isAdmin ? '👑' : '🏢'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {session?.displayName || session?.username || 'ผู้ใช้งาน'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {session?.department || 'สังกัดส่วนราชการ'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
            <span>สิทธิ์: {isAdmin ? 'เต็มสิทธิ์ทุกเสาหลัก' : 'ตามที่ได้รับมอบหมาย'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
