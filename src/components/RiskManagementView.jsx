import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  TrendingDown,
  Activity,
  Printer,
  Building,
  Plus,
  Trash2,
  BarChart3,
  Layers,
  FileText
} from 'lucide-react';

export default function RiskManagementView({
  riskManagement,
  setRiskManagement,
  orgProfile,
  selectedYear = '2569'
}) {
  const [activeTab, setActiveTab] = useState('bs1'); // 'bs1', 'bs2', 'bs3', 'bs4', 'bs5'
  const [showAddModal, setShowAddModal] = useState(false);

  const [newBs1, setNewBs1] = useState({
    department: 'กองคลัง',
    objective: '',
    riskEvent: '',
    cause: '',
    riskCategory: 'ด้านการเงิน (F)'
  });

  const bs1List = riskManagement?.bs1 || [];
  const bs2List = riskManagement?.bs2 || [];
  const bs3List = riskManagement?.bs3 || [];
  const bs4List = riskManagement?.bs4 || [];
  const bs5Data = riskManagement?.bs5 || {};

  const handleAddBs1 = (e) => {
    e.preventDefault();
    if (!newBs1.riskEvent || !newBs1.objective) return;
    const item = {
      ...newBs1,
      id: `BS1-${Date.now()}`
    };
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs1: [...(prev?.bs1 || []), item]
      }));
    }
    setNewBs1({
      department: 'กองคลัง',
      objective: '',
      riskEvent: '',
      cause: '',
      riskCategory: 'ด้านการเงิน (F)'
    });
    setShowAddModal(false);
  };

  const handleDeleteBs1 = (id) => {
    if (setRiskManagement) {
      setRiskManagement((prev) => ({
        ...prev,
        bs1: (prev?.bs1 || []).filter((item, index) => item.id !== id && index !== id)
      }));
    }
  };

  const getRiskLevelBadge = (level) => {
    if (level === 'สูงมาก') {
      return 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700';
    }
    if (level === 'สูง') {
      return 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700';
    }
    if (level === 'ปานกลาง') {
      return 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700';
    }
    return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Enterprise Risk Management (ERM) • สถ./กค.</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            ระบบบริหารจัดการความเสี่ยง (Risk Management)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            การบริหารจัดการความเสี่ยงระดับองค์กรตามแบบ บส.1 ถึง แบบ บส.5 ประจำปีงบประมาณ พ.ศ. {selectedYear}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์เอกสาร บส.</span>
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('bs1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs1'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            แบบ บส.1: ระบุความเสี่ยง ({bs1List.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bs2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs2'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            แบบ บส.2: ประเมินความเสี่ยง ({bs2List.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bs3')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs3'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            แบบ บส.3: แผนจัดการความเสี่ยง ({bs3List.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bs4')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs4'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            แบบ บส.4: ติดตามผล ({bs4List.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bs5')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs5'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            แบบ บส.5: สรุปรายงานระดับองค์กร
          </button>
        </div>

        {activeTab === 'bs1' && setRiskManagement && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ระบุความเสี่ยงใหม่ (บส.1)</span>
          </button>
        )}
      </div>

      {/* Tab BS 1: Risk Identification */}
      {activeTab === 'bs1' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                แบบ บส.1: การระบุความเสี่ยงและปัจจัยเสี่ยง (Risk Identification)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                จำแนกความเสี่ยง 5 ด้าน: ยุทธศาสตร์ (S), การดำเนินงาน (O), การเงิน (F), กฎหมาย/ระเบียบ (C), สารสนเทศ (I)
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              รวม {bs1List.length} รายการ
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 w-40">ส่วนราชการ</th>
                    <th className="px-4 py-3 w-56">วัตถุประสงค์ตามภารกิจ</th>
                    <th className="px-4 py-3">เหตุการณ์ความเสี่ยง (Risk Event)</th>
                    <th className="px-4 py-3">สาเหตุและปัจจัยเสี่ยง</th>
                    <th className="px-4 py-3 w-40 text-center">ประเภทความเสี่ยง</th>
                    {setRiskManagement && <th className="px-3 py-3 text-center w-16 no-print">จัดการ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bs1List.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        ยังไม่มีข้อมูลการระบุความเสี่ยง (คลิกปุ่ม "+ ระบุความเสี่ยงใหม่ (บส.1)" เพื่อเริ่มต้น)
                      </td>
                    </tr>
                  ) : (
                    bs1List.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 align-top">
                          <span className="inline-flex items-center space-x-1.5">
                            <Building className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{item.department}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 align-top">
                          {item.objective}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 align-top">
                          {item.riskEvent}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 align-top">
                          {item.cause}
                        </td>
                        <td className="px-4 py-3 text-center align-top">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-medium text-[11px] inline-block border border-slate-200 dark:border-slate-700">
                            {item.riskCategory}
                          </span>
                        </td>
                        {setRiskManagement && (
                          <td className="px-3 py-3 text-center align-top no-print">
                            <button
                              type="button"
                              onClick={() => handleDeleteBs1(item.id || idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="ลบรายการ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab BS 2: Risk Assessment & Matrix */}
      {activeTab === 'bs2' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                แบบ บส.2: การประเมินความเสี่ยง (Risk Assessment Matrix 5x5)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ระดับความเสี่ยงคำนวณจาก โอกาสเกิด (Likelihood 1-5) x ผลกระทบ (Impact 1-5)
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">1-4: ต่ำ</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">5-9: ปานกลาง</span>
              <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold">10-14: สูง</span>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold">15-25: สูงมาก</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 w-40">ส่วนราชการ</th>
                    <th className="px-4 py-3">เหตุการณ์ความเสี่ยง (Risk Event)</th>
                    <th className="px-4 py-3 text-center w-28">โอกาสเกิด (L)</th>
                    <th className="px-4 py-3 text-center w-28">ผลกระทบ (I)</th>
                    <th className="px-4 py-3 text-center w-28">ระดับคะแนน</th>
                    <th className="px-4 py-3 text-center w-32">ระดับความเสี่ยง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bs2List.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{item.department}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.riskEvent}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold">{item.likelihood}/5</td>
                      <td className="px-4 py-3 text-center font-mono font-bold">{item.impact}/5</td>
                      <td className="px-4 py-3 text-center font-mono font-black text-slate-900 dark:text-slate-100">{item.riskScore}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-block ${getRiskLevelBadge(item.riskLevel)}`}>
                          {item.riskLevel}
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

      {/* Tab BS 3: Risk Response Plan */}
      {activeTab === 'bs3' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              แบบ บส.3: แผนบริหารจัดการความเสี่ยงและมาตรการควบคุม (Risk Response Plan)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              กำหนดกลยุทธ์การจัดการ (หลีกเลี่ยง/ลด/ถ่ายโอน/ยอมรับ) มาตรการควบคุม ผู้รับผิดชอบ และกำหนดเวลา
            </p>
          </div>

          <div className="space-y-3">
            {bs3List.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                    <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded text-xs font-mono font-bold border border-amber-300 dark:border-amber-800">
                      {item.department}
                    </span>
                    <span>ประเด็นความเสี่ยง: {item.riskEvent}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getRiskLevelBadge(item.riskLevel)}`}>
                      ระดับ: {item.riskLevel}
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded text-[11px] font-bold border border-blue-200 dark:border-blue-800">
                      กลยุทธ์: {item.riskResponse}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">มาตรการควบคุม / กิจกรรมจัดการความเสี่ยง:</div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.measures}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>ผู้รับผิดชอบดำเนินการ: <strong className="text-slate-700 dark:text-slate-300">{item.responsiblePerson}</strong></span>
                  <span>ระยะเวลาดำเนินงาน: <strong className="text-slate-700 dark:text-slate-300">{item.timeline}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab BS 4: Monitoring */}
      {activeTab === 'bs4' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              แบบ บส.4: รายงานการติดตามผลการบริหารจัดการความเสี่ยง (รอบ 6 เดือน)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ติดตามความก้าวหน้าของการดำเนินมาตรการจัดการความเสี่ยง และระดับความเสี่ยงที่เปลี่ยนแปลง
            </p>
          </div>

          <div className="space-y-3">
            {bs4List.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      {item.department}
                    </span>
                    <span>ความเสี่ยง: {item.riskEvent}</span>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                    สถานะ: {item.progress}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-slate-200">ผลการดำเนินงานจริง: </span>
                  {item.progressDetail}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span>ระดับความเสี่ยงปัจจุบัน: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{item.currentRiskLevel}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> อยู่ในเกณฑ์ที่ยอมรับได้
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab BS 5: Final Evaluation Summary */}
      {activeTab === 'bs5' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-xs max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-6 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              แบบ บส.5: รายงานสรุปผลการประเมินการบริหารจัดการความเสี่ยงระดับองค์กร
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {orgProfile?.name} {orgProfile?.district} {orgProfile?.province}
            </p>
          </div>

          <div className="space-y-5 leading-relaxed">
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 dark:text-slate-100">สรุปภาพรวมการบริหารความเสี่ยงประจำปีงบประมาณ พ.ศ. {selectedYear}:</div>
              <p className="text-slate-700 dark:text-slate-300 indent-6 leading-relaxed">
                {bs5Data?.summary || 'ภาพรวมการบริหารจัดการความเสี่ยงระดับองค์กรของ อปท. มีการดำเนินงานตามแผนบริหารความเสี่ยงครบถ้วนทุกสำนัก/กอง โดยความเสี่ยงระดับสูงได้รับการควบคุมจนลดลงสู่ระดับที่ยอมรับได้'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{bs1List.length}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">ความเสี่ยงที่ระบุทั้งหมด</div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{bs3List.length}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">แผนมาตรการควบคุม</div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">100%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">ความสำเร็จในการติดตาม</div>
              </div>
            </div>

            <div className="pt-10 text-center space-y-3">
              <div className="text-slate-400 font-mono tracking-widest">(ลงชื่อ)........................................................................</div>
              <div>
                <div className="font-bold text-base text-slate-900 dark:text-slate-100">
                  ({orgProfile?.approverName || bs5Data?.approvedBy || 'นายกองค์การบริหารส่วนตำบลฝางคำ'})
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {orgProfile?.approverPosition || bs5Data?.approverPosition || 'นายกองค์การบริหารส่วนตำบลฝางคำ'}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">
                  วันที่ {bs5Data?.reportDate || '30 กันยายน 2569'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add BS.1 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                ระบุความเสี่ยงใหม่ (แบบ บส.1)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBs1} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  สำนัก / กอง:
                </label>
                <select
                  value={newBs1.department}
                  onChange={(e) => setNewBs1({ ...newBs1, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="สำนักปลัด">สำนักปลัด</option>
                  <option value="กองคลัง">กองคลัง</option>
                  <option value="กองช่าง">กองช่าง</option>
                  <option value="กองการศึกษา">กองการศึกษา</option>
                  <option value="กองสวัสดิการสังคม">กองสวัสดิการสังคม</option>
                  <option value="กองยุทธศาสตร์และงบประมาณ">กองยุทธศาสตร์และงบประมาณ</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  วัตถุประสงค์ตามภารกิจ:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การจัดเก็บรายได้ภาษีครบถ้วนตามเป้าหมาย"
                  value={newBs1.objective}
                  onChange={(e) => setNewBs1({ ...newBs1, objective: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เหตุการณ์ความเสี่ยง (Risk Event):
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ยอดจัดเก็บภาษีที่ดินตกหล่นหรือไม่ตรงกำหนด"
                  value={newBs1.riskEvent}
                  onChange={(e) => setNewBs1({ ...newBs1, riskEvent: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  สาเหตุและปัจจัยเสี่ยง:
                </label>
                <textarea
                  rows={2}
                  placeholder="ระบุสาเหตุภายในและภายนอก"
                  value={newBs1.cause}
                  onChange={(e) => setNewBs1({ ...newBs1, cause: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ประเภทความเสี่ยง:
                </label>
                <select
                  value={newBs1.riskCategory}
                  onChange={(e) => setNewBs1({ ...newBs1, riskCategory: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="ด้านยุทธศาสตร์ (S)">ด้านยุทธศาสตร์ (S)</option>
                  <option value="ด้านการดำเนินงาน (O)">ด้านการดำเนินงาน (O)</option>
                  <option value="ด้านการเงิน (F)">ด้านการเงิน (F)</option>
                  <option value="ด้านการปฏิบัติตามกฎระเบียบ (C)">ด้านการปฏิบัติตามกฎระเบียบ (C)</option>
                  <option value="ด้านสารสนเทศ (I)">ด้านสารสนเทศ (I)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  บันทึกแบบ บส.1
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
