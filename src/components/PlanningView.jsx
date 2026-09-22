import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  ChevronRight,
  Printer
} from 'lucide-react';

export default function PlanningView({
  auditCharter,
  annualPlans,
  setAnnualPlans,
  riskAssessments,
  setRiskAssessments,
  orgProfile,
  selectedYear = '2569'
}) {
  const [activeTab, setActiveTab] = useState('plan'); // 'charter', 'risk', 'plan'
  const [selectedRiskFilter, setSelectedRiskFilter] = useState(null);

  // New Plan Modal State
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    department: 'กองคลัง',
    quarter: `ไตรมาส 1 (ต.ค. - ธ.ค. ${selectedYear.slice(-2)})`,
    period: '',
    riskLevel: 'สูง',
    budget: 5000,
    objective: ''
  });

  // New Risk State
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRisk, setNewRisk] = useState({
    agency: 'กองคลัง',
    activity: '',
    riskFactor: '',
    likelihood: 3,
    impact: 3,
    treatment: ''
  });

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!newPlan.title) return;
    const yearSuffix = (selectedYear || orgProfile?.fiscalYear || '2568').slice(-2);
    const planId = `PLAN-${yearSuffix}-0${annualPlans.length + 1}`;
    setAnnualPlans([
      ...annualPlans,
      {
        ...newPlan,
        id: planId,
        status: 'pending',
        progress: 0,
        budget: Number(newPlan.budget)
      }
    ]);
    setShowAddPlan(false);
    setNewPlan({
      title: '',
      department: 'กองคลัง',
      quarter: `ไตรมาส 1 (ต.ค. - ธ.ค. ${yearSuffix})`,
      period: '',
      riskLevel: 'สูง',
      budget: 5000,
      objective: ''
    });
  };

  const handleAddRisk = (e) => {
    e.preventDefault();
    if (!newRisk.activity) return;
    const score = newRisk.likelihood * newRisk.impact;
    let level = 'ต่ำ';
    if (score >= 15) level = 'สูงมาก';
    else if (score >= 10) level = 'สูง';
    else if (score >= 5) level = 'ปานกลาง';

    setRiskAssessments([
      ...riskAssessments,
      {
        ...newRisk,
        id: `RISK-0${riskAssessments.length + 1}`,
        riskScore: score,
        level: level
      }
    ]);
    setShowAddRisk(false);
    setNewRisk({
      agency: 'กองคลัง',
      activity: '',
      riskFactor: '',
      likelihood: 3,
      impact: 3,
      treatment: ''
    });
  };

  const filteredRisks = selectedRiskFilter
    ? riskAssessments.filter((r) => r.level === selectedRiskFilter)
    : riskAssessments;

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'plan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            แผนการปฏิบัติงานประจำปี ({annualPlans.length})
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'risk'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            ประเมินความเสี่ยง (5x5 Matrix)
          </button>
          <button
            onClick={() => setActiveTab('charter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'charter'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            กฎบัตรการตรวจสอบภายใน
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'plan' && (
            <button
              onClick={() => setShowAddPlan(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มโครงการตรวจสอบ</span>
            </button>
          )}
          {activeTab === 'risk' && (
            <button
              onClick={() => setShowAddRisk(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ประเมินกิจกรรมใหม่</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Annual Audit Plan */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-800/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
            <div>
              <span className="font-bold text-blue-950 dark:text-blue-100">
                แผนการปฏิบัติงานตรวจสอบ ประจำปีงบประมาณ พ.ศ. {selectedYear}
              </span>
              <p className="text-blue-800/80 dark:text-blue-300 mt-0.5">
                จัดทำขึ้นจากการประเมินความเสี่ยงของกิจกรรมสำคัญในองค์กร ได้รับความเห็นชอบจากปลัด อปท. และอนุมัติโดยนายก อปท.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="no-print bg-white dark:bg-slate-900 hover:bg-blue-100 text-blue-700 dark:text-blue-400 font-bold px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700/60 shadow-xs flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์เล่มแผน</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700/80">
                  <tr>
                    <th className="px-4 py-3.5">รหัส</th>
                    <th className="px-4 py-3.5">ชื่อเรื่อง / กิจกรรมที่ตรวจสอบ</th>
                    <th className="px-4 py-3.5">หน่วยรับตรวจ</th>
                    <th className="px-4 py-3.5">ระยะเวลาดำเนินการ</th>
                    <th className="px-4 py-3.5 text-center">ระดับความเสี่ยง</th>
                    <th className="px-4 py-3.5 text-right">งบประมาณ (บาท)</th>
                    <th className="px-4 py-3.5 text-center">ความก้าวหน้า</th>
                    <th className="px-4 py-3.5 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {annualPlans.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">{p.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 max-w-xs">{p.title}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.department}</td>
                      <td className="px-4 py-3">
                        <div>{p.quarter}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">{p.period}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.riskLevel === 'สูงมาก'
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300'
                              : p.riskLevel === 'สูง'
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {p.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium">
                        {p.budget?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${p.progress}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-[11px]">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            p.status === 'completed'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                              : p.status === 'in_progress'
                              ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {p.status === 'completed'
                            ? 'เสร็จสิ้น'
                            : p.status === 'in_progress'
                            ? 'กำลังตรวจ'
                            : 'รอตรวจ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Risk Assessment & Matrix */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 5x5 Heatmap */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                ผังวิเคราะห์ระดับความเสี่ยง (5x5 Risk Heatmap)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                โอกาสเกิด (Likelihood: 1-5) x ผลกระทบ (Impact: 1-5)
              </p>

              <div className="relative">
                {/* Vertical label: Impact */}
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                  ▲ ผลกระทบ (Impact)
                </div>

                <div className="grid grid-rows-5 gap-1 text-center text-xs font-bold">
                  {[5, 4, 3, 2, 1].map((impactVal) => (
                    <div key={impactVal} className="grid grid-cols-5 gap-1 h-12">
                      {[1, 2, 3, 4, 5].map((likeVal) => {
                        const score = impactVal * likeVal;
                        let bg = 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200';
                        if (score >= 15) bg = 'bg-rose-500 text-white hover:bg-rose-600';
                        else if (score >= 10) bg = 'bg-amber-400 text-slate-900 dark:text-slate-100 hover:bg-amber-500';
                        else if (score >= 5) bg = 'bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-200 hover:bg-yellow-300';

                        // Check items in this cell
                        const items = riskAssessments.filter(
                          (r) => r.impact === impactVal && r.likelihood === likeVal
                        );

                        return (
                          <div
                            key={likeVal}
                            className={`${bg} rounded-lg p-1 flex flex-col items-center justify-center transition-colors cursor-pointer relative shadow-2xs`}
                            title={`L: ${likeVal}, I: ${impactVal} (คะแนน: ${score})`}
                          >
                            <span className="text-[10px] opacity-70">{score}</span>
                            {items.length > 0 && (
                              <span className="mt-0.5 bg-slate-900 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold animate-bounce">
                                {items.length}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2">
                  โอกาสเกิด (Likelihood) ▶
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-[11px] mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'สูงมาก' ? null : 'สูงมาก')}
                  className={`flex items-center space-x-1 cursor-pointer px-2 py-1 rounded ${
                    selectedRiskFilter === 'สูงมาก' ? 'bg-slate-200 dark:bg-slate-700 font-bold' : ''
                  }`}
                >
                  <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
                  <span>สูงมาก (15-25)</span>
                </button>
                <button
                  onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'สูง' ? null : 'สูง')}
                  className={`flex items-center space-x-1 cursor-pointer px-2 py-1 rounded ${
                    selectedRiskFilter === 'สูง' ? 'bg-slate-200 dark:bg-slate-700 font-bold' : ''
                  }`}
                >
                  <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
                  <span>สูง (10-14)</span>
                </button>
                <button
                  onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'ปานกลาง' ? null : 'ปานกลาง')}
                  className={`flex items-center space-x-1 cursor-pointer px-2 py-1 rounded ${
                    selectedRiskFilter === 'ปานกลาง' ? 'bg-slate-200 dark:bg-slate-700 font-bold' : ''
                  }`}
                >
                  <span className="w-3 h-3 rounded bg-yellow-200 dark:bg-yellow-500/30 inline-block"></span>
                  <span>ปานกลาง (5-9)</span>
                </button>
                <button
                  onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'ต่ำ' ? null : 'ต่ำ')}
                  className={`flex items-center space-x-1 cursor-pointer px-2 py-1 rounded ${
                    selectedRiskFilter === 'ต่ำ' ? 'bg-slate-200 dark:bg-slate-700 font-bold' : ''
                  }`}
                >
                  <span className="w-3 h-3 rounded bg-emerald-200 inline-block"></span>
                  <span>ต่ำ (1-4)</span>
                </button>
              </div>
            </div>

            {/* Risk Activities List */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  กิจกรรมที่ได้รับการประเมินความเสี่ยง ({filteredRisks.length})
                </h3>
                {selectedRiskFilter && (
                  <button
                    onClick={() => setSelectedRiskFilter(null)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                  >
                    ล้างตัวกรอง
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredRisks.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.activity}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          item.level === 'สูงมาก'
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300'
                            : item.level === 'สูง'
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                            : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {item.level} (คะแนน {item.riskScore})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      หน่วยรับตรวจ: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.agency}</span> • โอกาส: {item.likelihood} • ผลกระทบ: {item.impact}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300">ปัจจัยเสี่ยง:</span> {item.riskFactor}
                    </p>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1 bg-emerald-50/70 dark:bg-emerald-500/10 p-2 rounded-lg border border-emerald-100">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300">มาตรการควบคุม (บส.3):</span> {item.treatment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Charter */}
      {activeTab === 'charter' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{auditCharter.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{orgProfile.name} {orgProfile.district} {orgProfile.province}</p>
            <span className="inline-block mt-2 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs px-3 py-1 rounded-full font-semibold border border-blue-200 dark:border-blue-800/50">
              อนุมัติเมื่อ: {auditCharter.approvedDate} โดย {orgProfile.approverName} ({orgProfile.approverPosition})
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <section>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">1. วัตถุประสงค์ (Objective)</h3>
              <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                {auditCharter.objective}
              </p>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">2. อำนาจหน้าที่ (Authority)</h3>
              <ul className="space-y-2 list-disc list-inside bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                {auditCharter.authority.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">3. ขอบเขตและความรับผิดชอบ (Responsibilities)</h3>
              <ul className="space-y-2 list-disc list-inside bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                {auditCharter.responsibilities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">4. จรรยาบรรณวิชาชีพ (Code of Ethics)</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {auditCharter.codeOfEthics.map((code, idx) => (
                  <div key={idx} className="bg-blue-50/50 dark:bg-blue-500/10 p-2.5 rounded-lg border border-blue-100 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{code}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              สถานะ: <span className="font-bold text-emerald-600 dark:text-emerald-400">อนุมัติและบังคับใช้แล้ว</span> (ตรวจ LPA ตัวชี้วัดที่ 4 ผ่านเกณฑ์ 100%)
            </div>
            <button
              onClick={() => window.print()}
              className="no-print bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์กฎบัตร</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add Plan */}
      {showAddPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">เพิ่มโครงการตรวจสอบในแผนประจำปี</h3>
            <form onSubmit={handleAddPlan} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อเรื่อง / โครงการที่ตรวจสอบ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การตรวจสอบการจัดซื้อจัดจ้างโครงการก่อสร้าง..."
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">หน่วยรับตรวจ</label>
                  <select
                    value={newPlan.department}
                    onChange={(e) => setNewPlan({ ...newPlan, department: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                  >
                    <option value="กองคลัง">กองคลัง</option>
                    <option value="กองช่าง">กองช่าง</option>
                    <option value="กองการศึกษา">กองการศึกษา</option>
                    <option value="กองสวัสดิการสังคม">กองสวัสดิการสังคม</option>
                    <option value="สำนักปลัด">สำนักปลัด</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ระดับความเสี่ยง</label>
                  <select
                    value={newPlan.riskLevel}
                    onChange={(e) => setNewPlan({ ...newPlan, riskLevel: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                  >
                    <option value="สูงมาก">สูงมาก</option>
                    <option value="สูง">สูง</option>
                    <option value="ปานกลาง">ปานกลาง</option>
                    <option value="ต่ำ">ต่ำ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ไตรมาสที่ดำเนินการ</label>
                <input
                  type="text"
                  value={newPlan.quarter}
                  onChange={(e) => setNewPlan({ ...newPlan, quarter: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">วัตถุประสงค์การตรวจสอบ</label>
                <textarea
                  rows="2"
                  value={newPlan.objective}
                  onChange={(e) => setNewPlan({ ...newPlan, objective: e.target.value })}
                  placeholder="ระบุวัตถุประสงค์..."
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlan(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  บันทึกแผน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Risk */}
      {showAddRisk && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">ประเมินความเสี่ยงกิจกรรมใหม่</h3>
            <form onSubmit={handleAddRisk} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อกิจกรรมที่ประเมิน</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การจัดเก็บภาษีที่ดินและสิ่งปลูกสร้าง"
                  value={newRisk.activity}
                  onChange={(e) => setNewRisk({ ...newRisk, activity: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ปัจจัยความเสี่ยง</label>
                <input
                  type="text"
                  placeholder="เช่น การประเมินล่าช้า ข้อมูลไม่เป็นปัจจุบัน..."
                  value={newRisk.riskFactor}
                  onChange={(e) => setNewRisk({ ...newRisk, riskFactor: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">โอกาสเกิด (Likelihood 1-5)</label>
                  <select
                    value={newRisk.likelihood}
                    onChange={(e) => setNewRisk({ ...newRisk, likelihood: Number(e.target.value) })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 font-bold"
                  >
                    <option value="1">1 - ต่ำมาก</option>
                    <option value="2">2 - ต่ำ</option>
                    <option value="3">3 - ปานกลาง</option>
                    <option value="4">4 - สูง</option>
                    <option value="5">5 - สูงมาก</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ผลกระทบ (Impact 1-5)</label>
                  <select
                    value={newRisk.impact}
                    onChange={(e) => setNewRisk({ ...newRisk, impact: Number(e.target.value) })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 font-bold"
                  >
                    <option value="1">1 - ต่ำมาก</option>
                    <option value="2">2 - ต่ำ</option>
                    <option value="3">3 - ปานกลาง</option>
                    <option value="4">4 - สูง</option>
                    <option value="5">5 - สูงมาก</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
                <span>คะแนนความเสี่ยง (L x I):</span>
                <span className="text-base font-black text-blue-700 dark:text-blue-400">
                  {newRisk.likelihood * newRisk.impact}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">มาตรการควบคุม / แผนลดความเสี่ยง (บส.3)</label>
                <textarea
                  rows="2"
                  value={newRisk.treatment}
                  onChange={(e) => setNewRisk({ ...newRisk, treatment: e.target.value })}
                  placeholder="ระบุกิจกรรมควบคุม..."
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRisk(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  บันทึกการประเมิน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
