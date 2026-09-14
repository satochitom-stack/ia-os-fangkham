import React from 'react';
import {
  FileText,
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ClipboardList,
  FolderOpen,
  CalendarDays,
  ChevronRight,
  Plus,
  Settings,
  UserCheck
} from 'lucide-react';

export default function DashboardView({
  orgProfile,
  annualPlans = [],
  workingPapers = [],
  lpaIndicators = [],
  riskAssessments = [],
  setCurrentTab,
  setSelectedWp,
  onOpenSettings
}) {
  const completedPlans = annualPlans.filter((p) => p.status === 'completed').length;
  const inProgressPlans = annualPlans.filter((p) => p.status === 'in_progress').length;
  const pendingPlans = annualPlans.filter((p) => p.status === 'pending').length;

  const totalLpaScore = lpaIndicators.reduce((acc, curr) => acc + curr.score, 0);
  const maxLpaScore = lpaIndicators.reduce((acc, curr) => acc + curr.maxScore, 0) || 25;
  const lpaPercent = Math.round((totalLpaScore / maxLpaScore) * 100) || 0;

  const highRisks = riskAssessments.filter(
    (r) => r.level === 'สูงมาก' || r.level === 'สูง'
  ).length;

  const hasAuditorName = Boolean(orgProfile.auditorName?.trim());
  const orgDisplayName = orgProfile.name || 'องค์กรปกครองส่วนท้องถิ่น';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 dark:bg-slate-900 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/30 border border-blue-400/30 rounded-full px-3 py-1 text-xs font-medium text-blue-100 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ปีงบประมาณ พ.ศ. {orgProfile.fiscalYear || '2568'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              ระบบงานตรวจสอบภายใน {orgDisplayName}
            </h2>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
              {hasAuditorName ? (
                <>ผู้ตรวจสอบภายใน: <strong className="text-white">{orgProfile.auditorName}</strong> ({orgProfile.auditorPosition})</>
              ) : (
                <span className="text-amber-200">
                  ⚠️ ยังไม่ได้ตั้งชื่อผู้ตรวจสอบภายใน กรุณากดปุ่มตั้งค่าโปรไฟล์เพื่อระบุชื่อของท่าน
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!hasAuditorName && (
              <button
                onClick={onOpenSettings}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>ตั้งชื่อผู้ตรวจสอบ</span>
              </button>
            )}
            <button
              onClick={() => setCurrentTab('execution')}
              className="bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-300 hover:bg-blue-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>เปิดกระดาษทำการ</span>
            </button>
            <button
              onClick={() => setCurrentTab('reporting')}
              className="bg-blue-600/80 hover:bg-blue-600 border border-blue-400/30 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>สรุปรายงานผล</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Plans */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">แผนตรวจสอบประจำปี</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{annualPlans.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">โครงการตามแผน</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3 mr-1" /> เสร็จสิ้น {completedPlans}
            </span>
            <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-3 h-3 mr-1" /> กำลังตรวจ {inProgressPlans}
            </span>
            <span className="text-slate-400 dark:text-slate-500">รอตรวจ {pendingPlans}</span>
          </div>
        </div>

        {/* Card 2: LPA Readiness */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ความพร้อมรับตรวจ LPA</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalLpaScore}/{maxLpaScore}</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {lpaPercent}%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>ตัวชี้วัดด้านที่ 1 (ตัวชี้วัด 1-5)</span>
            <button
              onClick={() => setCurrentTab('lpa')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center cursor-pointer"
            >
              ประเมินตนเอง <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Internal Control */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">กระดาษทำการมาตรฐาน</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{workingPapers.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">เรื่องตรวจพร้อมใช้งาน</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>KTB, เช่าบ้าน, จัดซื้อ, อาหารกลางวัน ฯลฯ</span>
            <button
              onClick={() => setCurrentTab('execution')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center cursor-pointer"
            >
              เข้าตรวจ <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: High Risk Items */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ประเด็นความเสี่ยง (Risk)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{highRisks}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">กิจกรรมเสี่ยงสูง</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>{highRisks > 0 ? 'มีกิจกรรมที่ต้องเฝ้าระวัง' : 'ยังไม่มีกิจกรรมเสี่ยงสูง'}</span>
            <button
              onClick={() => setCurrentTab('planning')}
              className="text-rose-600 dark:text-rose-400 font-medium hover:underline flex items-center cursor-pointer"
            >
              ดู Heatmap <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Audit Projects & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Annual Audit Plan Progress */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                สถานะการปฏิบัติงานตามแผนตรวจสอบประจำปี {orgProfile.fiscalYear || '2568'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ติดตามความก้าวหน้าโครงการตรวจสอบทั้ง 4 ไตรมาส
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('planning')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>{annualPlans.length > 0 ? 'ดูแผนทั้งหมด' : '+ เพิ่มโครงการในแผน'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {annualPlans.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl space-y-2">
              <CalendarDays className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                ยังไม่มีโครงการในแผนประจำปี {orgProfile.fiscalYear}
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                เริ่มต้นเพิ่มโครงการตรวจสอบจริงของ อปท. ของท่าน เพื่อกำหนดงวดเวลา งบประมาณ และติดตามความก้าวหน้า
              </p>
              <button
                onClick={() => setCurrentTab('planning')}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มโครงการตรวจสอบตามแผน</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {annualPlans.map((plan) => {
                const isCompleted = plan.status === 'completed';
                const isInProgress = plan.status === 'in_progress';
                return (
                  <div
                    key={plan.id}
                    className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-700 hover:border-blue-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {plan.id}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {plan.department}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            plan.riskLevel === 'สูงมาก'
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300'
                              : plan.riskLevel === 'สูง'
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          เสี่ยง{plan.riskLevel}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {plan.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-3">
                        <span>{plan.quarter}</span>
                        {plan.period && (
                          <>
                            <span>•</span>
                            <span>{plan.period}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : isInProgress
                                ? 'bg-blue-600'
                                : 'bg-slate-300'
                            }`}
                            style={{ width: `${plan.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                          {plan.progress}%
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedWp(workingPapers[0]?.id || 'WP-KTB-01');
                          setCurrentTab('execution');
                        }}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <span>เข้าตรวจ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Quick Working Papers & Reference Directives */}
        <div className="space-y-4">
          {/* Quick Access to Working Paper */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-300 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>กระดาษทำการตรวจสอบมาตรฐาน ({workingPapers.length} เรื่อง)</span>
            </div>
            <h4 className="text-base font-bold text-white leading-tight">
              {workingPapers[0]?.topic || 'ระบบตรวจสอบภายใน'}
            </h4>
            <p className="text-xs text-slate-300 mt-2 line-clamp-2">
              พร้อมเกณฑ์ตรวจสอบตามระเบียบกระทรวงมหาดไทย ระบบสุ่มตรวจฎีกา และส่งออก Excel
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-blue-200">
                {workingPapers[0]?.department}
              </span>
              <button
                onClick={() => {
                  setSelectedWp(workingPapers[0]?.id || 'WP-KTB-01');
                  setCurrentTab('execution');
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                เปิดกระดาษทำการ
              </button>
            </div>
          </div>

          {/* Key Directives Alert */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
              <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>หนังสือสั่งการและระเบียบมาตรฐาน</span>
            </div>
            <div className="space-y-2.5">
              <div
                onClick={() => setCurrentTab('knowledge')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/70 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">หนังสือ ว 119 (จัดงานประเพณี)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  หลักเกณฑ์การเบิกจ่ายงานเทศกาลและประเพณีท้องถิ่น
                </div>
              </div>
              <div
                onClick={() => setCurrentTab('knowledge')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/70 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">หนังสือ ว 257 (หลักเกณฑ์ยืมเงิน)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  กำหนดส่งใช้เงินยืมภายใน 30 วันนับแต่วันสิ้นสุดโครงการ
                </div>
              </div>
              <div
                onClick={() => setCurrentTab('knowledge')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/70 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">หนังสือ ว 11807 (เดินทางไปราชการ)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  วิธีปฏิบัติการเบิกค่าเดินทางฉบับปรับปรุง พ.ย. 67
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
