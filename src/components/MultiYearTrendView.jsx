import React, { useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { getDepartments } from '../utils/auth';

export default function MultiYearTrendView({
  orgProfile = {},
  fiscalYears = ['2569', '2570'],
  annualPlansByYear = {},
  capaFindingsByYear = {},
  riskManagementByYear = {},
  lpaIndicatorsByYear = {},
  auditUniverseByYear = {}
}) {
  const sortedYears = useMemo(() => [...(fiscalYears || ['2569', '2570'])].sort(), [fiscalYears]);
  const departments = useMemo(
    () => getDepartments().filter((d) => d && d !== 'หน่วยตรวจสอบภายใน' && d !== 'ส่วนกลาง'),
    []
  );

  const yearlyStats = useMemo(() => {
    return sortedYears.map((yr) => {
      const plans = Array.isArray(annualPlansByYear[yr]) ? annualPlansByYear[yr] : [];
      const completedPlans = plans.filter((p) => p.status === 'completed').length;
      const planRate = plans.length > 0 ? Math.round((completedPlans / plans.length) * 100) : 0;

      const capas = Array.isArray(capaFindingsByYear[yr]) ? capaFindingsByYear[yr] : [];
      const closedCapas = capas.filter(
        (c) => c.status === 'verified_closed' || c.status === 'closed' || c.status === 'completed'
      ).length;
      const openCapas = capas.length - closedCapas;

      const rm = riskManagementByYear[yr] || {};
      const bs1 = Array.isArray(rm.bs1) ? rm.bs1 : [];
      const bs5Items = Array.isArray(rm.bs5) ? rm.bs5 : Array.isArray(rm.bs5?.items) ? rm.bs5.items : [];
      const avgPreRisk =
        bs5Items.length > 0
          ? (
              bs5Items.reduce((s, i) => s + (Number(i.preLikelihood) || 1) * (Number(i.preImpact) || 1), 0) /
              bs5Items.length
            ).toFixed(1)
          : '0.0';
      const avgPostRisk =
        bs5Items.length > 0
          ? (
              bs5Items.reduce((s, i) => s + (Number(i.postLikelihood) || 1) * (Number(i.postImpact) || 1), 0) /
              bs5Items.length
            ).toFixed(1)
          : '0.0';

      const lpa = Array.isArray(lpaIndicatorsByYear[yr]) ? lpaIndicatorsByYear[yr] : [];
      const lpaScore = lpa.reduce((s, i) => s + (Number(i.score) || 0), 0);
      const lpaMax = lpa.reduce((s, i) => s + (Number(i.maxScore) || 5), 0) || 25;
      const lpaPct = Math.round((lpaScore / lpaMax) * 100);

      const universe = Array.isArray(auditUniverseByYear[yr]) ? auditUniverseByYear[yr] : [];
      const highSofck = universe.filter(
        (u) =>
          (Number(u.sScore) || 0) +
            (Number(u.oScore) || 0) +
            (Number(u.fScore) || 0) +
            (Number(u.cScore) || 0) +
            (Number(u.kScore) || 0) >=
          13
      ).length;

      return {
        year: yr,
        planTotal: plans.length,
        completedPlans,
        planRate,
        capaTotal: capas.length,
        openCapas,
        closedCapas,
        bs1Count: bs1.length,
        bs5Count: bs5Items.length,
        avgPreRisk: Number(avgPreRisk),
        avgPostRisk: Number(avgPostRisk),
        lpaScore,
        lpaMax,
        lpaPct,
        highSofck
      };
    });
  }, [sortedYears, annualPlansByYear, capaFindingsByYear, riskManagementByYear, lpaIndicatorsByYear, auditUniverseByYear]);

  // Department Cross-Year Heatmap Matrix
  const deptMatrix = useMemo(() => {
    return departments.map((dept) => {
      const cells = sortedYears.map((yr) => {
        const rm = riskManagementByYear[yr] || {};
        const bs1Count = (Array.isArray(rm.bs1) ? rm.bs1 : []).filter((i) => i.department === dept).length;
        const bs5Items = (Array.isArray(rm.bs5) ? rm.bs5 : Array.isArray(rm.bs5?.items) ? rm.bs5.items : []).filter(
          (i) => i.department === dept
        );
        const avgPost =
          bs5Items.length > 0
            ? Math.round(
                (bs5Items.reduce((s, i) => s + (Number(i.postLikelihood) || 1) * (Number(i.postImpact) || 1), 0) /
                  bs5Items.length) *
                  10
              ) / 10
            : null;
        const capaOpen = (Array.isArray(capaFindingsByYear[yr]) ? capaFindingsByYear[yr] : []).filter(
          (c) => c.department === dept && c.status !== 'verified_closed' && c.status !== 'closed'
        ).length;
        return { year: yr, bs1Count, avgPost, capaOpen };
      });
      return { dept, cells };
    });
  }, [departments, sortedYears, riskManagementByYear, capaFindingsByYear]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 rounded-2xl p-6 border border-blue-200/80 dark:border-blue-900/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-Year Analytics • อ้างอิงคะแนน LPA & ITA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            รายงานเปรียบเทียบความเสี่ยงและผลการตรวจสอบข้ามปี ({sortedYears.join(' vs ')})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            ภาพรวมพัฒนาการด้านการควบคุมภายใน การลดระดับความเสี่ยง (บส.5) และการปิดข้อทักท้วง CAPA ของ {orgProfile.name || 'อบต.ฝางคำ'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-center"
        >
          <Printer className="w-4 h-4" />
          <span>พิมพ์รายงานเสนอผู้บริหาร</span>
        </button>
      </div>

      {/* Year-over-Year Visual Comparison Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: LPA & Audit Plan Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>เปรียบเทียบความพร้อม LPA & แผนตรวจสอบรายปี</span>
            </h3>
          </div>
          <div className="space-y-4 text-xs">
            {yearlyStats.map((s) => (
              <div key={s.year} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-slate-100">ปีงบประมาณ พ.ศ. {s.year}</span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    LPA: {s.lpaScore}/{s.lpaMax} ({s.lpaPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, s.lpaPct)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>แผนตรวจสอบ: {s.completedPlans}/{s.planTotal} โครงการ ({s.planRate}%)</span>
                  <span>กิจกรรมเสี่ยงสูง SOFCK: {s.highSofck}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Risk Reduction (Pre vs Post BS5) & CAPA */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-rose-600" />
            <span>ประสิทธิผลการลดความเสี่ยง (บส.5) & สถานะ CAPA</span>
          </h3>
          <div className="space-y-4 text-xs">
            {yearlyStats.map((s) => {
              const delta = s.avgPreRisk > 0 ? (s.avgPreRisk - s.avgPostRisk).toFixed(1) : '0.0';
              return (
                <div key={s.year} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900 dark:text-slate-100">ปีงบประมาณ พ.ศ. {s.year}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                      ลดคะแนนเสี่ยงเฉลี่ย -{delta}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>ก่อนจัดการ (เฉลี่ย)</span>
                        <span className="font-bold text-rose-600">{s.avgPreRisk}/25</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (s.avgPreRisk / 25) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>หลังจัดการ (เฉลี่ย)</span>
                        <span className="font-bold text-emerald-600">{s.avgPostRisk}/25</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (s.avgPostRisk / 25) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>รายการ บส.1: {s.bs1Count} ประเด็น</span>
                    <span>CAPA ปิดแล้ว {s.closedCapas} / ค้างติดตาม {s.openCapas}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Department Risk & CAPA Heatmap Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>ตารางเปรียบเทียบความเสี่ยงและข้อทักท้วงรายส่วนราชการ (Department Heatmap)</span>
          </h3>
          <span className="text-[11px] text-slate-400">แสดงจำนวน บส.1 • คะแนนเสี่ยงคงเหลือเฉลี่ย • CAPA ค้างปิด</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <th className="text-left p-3 rounded-tl-xl font-bold">ส่วนราชการ</th>
                {sortedYears.map((yr) => (
                  <th key={yr} className="text-center p-3 font-bold">
                    ปีงบประมาณ พ.ศ. {yr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {deptMatrix.map((row) => (
                <tr key={row.dept} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{row.dept}</td>
                  {row.cells.map((c) => {
                    const riskColor =
                      c.avgPost === null
                        ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'
                        : c.avgPost >= 12
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/70'
                        : c.avgPost >= 6
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/70'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70';
                    return (
                      <td key={c.year} className="p-2.5 text-center">
                        <div className={`inline-flex flex-col items-center px-3 py-1.5 rounded-xl ${riskColor}`}>
                          <span className="font-black text-xs">
                            {c.avgPost !== null ? `เสี่ยงคงเหลือ ${c.avgPost}` : `บส. ${c.bs1Count} รายการ`}
                          </span>
                          <span className="text-[10px] opacity-80 flex items-center gap-1 mt-0.5">
                            {c.capaOpen > 0 ? (
                              <>
                                <AlertTriangle className="w-2.5 h-2.5" /> CAPA ค้าง {c.capaOpen}
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-2.5 h-2.5" /> ไม่มี CAPA ค้าง
                              </>
                            )}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>ข้อมูลนี้คำนวณสดจากฐานข้อมูลจริงทุกปีงบประมาณ สามารถพิมพ์แนบรายงานการประเมินผล LPA และ ITA ได้ทันที</span>
        </div>
      </div>
    </div>
  );
}
