import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  FolderOpen,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function LpaView({
  lpaIndicators = [],
  setLpaIndicators,
  orgProfile,
  selectedYear = '2569'
}) {
  const [expandedId, setExpandedId] = useState(4); // Default expand Indicator 4 (Internal Audit)

  const toggleEvidence = (indicatorId, evidenceIdx) => {
    if (!setLpaIndicators) return;
    setLpaIndicators((prev) =>
      (prev || []).map((ind) => {
        if (ind.id !== indicatorId) return ind;
        const totalItems = ind.evidenceList?.length || 1;
        const currentMap = ind.checkedEvidence || {};
        const nextChecked = !currentMap[evidenceIdx];
        const nextMap = { ...currentMap, [evidenceIdx]: nextChecked };
        const checkedCount = (ind.evidenceList || []).reduce(
          (acc, _, idx) => acc + (nextMap[idx] ? 1 : 0),
          0
        );
        const maxS = Number(ind.maxScore) || 5;
        const nextScore = Math.round((checkedCount / totalItems) * maxS);
        return {
          ...ind,
          checkedEvidence: nextMap,
          score: nextScore
        };
      })
    );
  };

  const totalScore = lpaIndicators.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const maxScore = lpaIndicators.reduce((acc, curr) => acc + (Number(curr.maxScore) || 5), 0) || 25;
  const scorePercent = Math.round((totalScore / maxScore) * 100) || 0;
  const gradeLabel =
    scorePercent >= 85
      ? 'ระดับยอดเยี่ยม'
      : scorePercent >= 70
      ? 'ระดับดี'
      : scorePercent >= 50
      ? 'ระดับปานกลาง'
      : 'อยู่ระหว่างเตรียมเอกสาร';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 rounded-full px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Local Performance Assessment (LPA) ประจำปี พ.ศ. {selectedYear}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            การประเมินประสิทธิภาพ อปท. ด้านที่ 1 การบริหารจัดการ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            ระบบตรวจสอบความพร้อมเอกสารหลักฐานตัวชี้วัดที่ 1 - 5 เพื่อเตรียมรับการตรวจประเมินประสิทธิภาพของ อปท.
          </p>
        </div>

        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl p-4 border border-emerald-200/80 dark:border-emerald-900/50 text-center shrink-0">
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">คะแนนประเมินตนเอง</div>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {totalScore} / {maxScore}
          </div>
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {gradeLabel} ({scorePercent}%)
          </div>
        </div>
      </div>

      {/* Indicator Accordions */}
      <div className="space-y-4">
        {lpaIndicators.map((ind) => {
          const isExpanded = expandedId === ind.id;
          return (
            <div
              key={ind.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : ind.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {ind.id}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {ind.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {ind.criteria}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                    {ind.score} / {ind.maxScore} คะแนน
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">เกณฑ์การประเมิน (Criteria):</h4>
                    <p className="text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                      {ind.criteria}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                      รายการเอกสารหลักฐานที่ต้องจัดเตรียม (Evidence Checklist):
                    </h4>
                    <div className="space-y-2">
                      {ind.evidenceList?.map((item, idx) => {
                        const isChecked = Boolean(ind.checkedEvidence?.[idx]);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleEvidence(ind.id, idx)}
                            className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all"
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 rounded text-emerald-600 dark:text-emerald-400 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 pointer-events-none"
                              />
                              <span
                                className={`text-xs ${
                                  isChecked
                                    ? 'text-slate-800 dark:text-slate-200 font-medium'
                                    : 'text-slate-400 dark:text-slate-500 line-through'
                                }`}
                              >
                                {item}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isChecked
                                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {isChecked ? 'พร้อมรับตรวจ' : 'ยังไม่พร้อม'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
                    <span className="flex items-center text-blue-700 dark:text-blue-400 font-medium">
                      <FolderOpen className="w-3.5 h-3.5 mr-1" />
                      แฟ้มเอกสารหลักฐาน LPA ปีงบประมาณ พ.ศ. {selectedYear} — ตัวชี้วัดที่ {ind.id}
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="no-print text-slate-700 dark:text-slate-300 hover:text-blue-700 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>พิมพ์แบบประเมินตัวชี้วัดนี้</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
