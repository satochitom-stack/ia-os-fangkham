import React, { useState } from 'react';
import {
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Printer,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function ControlRiskView({
  internalControls,
  riskAssessments,
  orgProfile,
  selectedYear = '2568'
}) {
  const [activeTab, setActiveTab] = useState('pk4'); // 'pk1', 'pk4', 'pk5', 'bs'

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('pk4')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pk4'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            รายงานประเมินการควบคุมภายใน (แบบ ปค.4)
          </button>
          <button
            onClick={() => setActiveTab('pk5')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pk5'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            รายงานติดตามการปรับปรุง (แบบ ปค.5)
          </button>
          <button
            onClick={() => setActiveTab('pk1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pk1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            หนังสือรับรองระดับ อปท. (แบบ ปค.1)
          </button>
          <button
            onClick={() => setActiveTab('bs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            บริหารจัดการความเสี่ยง (แบบ บส.1 - บส.5)
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="no-print bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>พิมพ์เอกสาร ปค./บส.</span>
        </button>
      </div>

      {/* Tab: PK 4 */}
      {activeTab === 'pk4' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              แบบ ปค.4: รายงานการประเมินผลการควบคุมภายใน (ระดับส่วนราชการ / สำนัก / กอง)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              อ้างอิงตามหลักเกณฑ์กระทรวงการคลังว่าด้วยมาตรฐานและหลักเกณฑ์ปฏิบัติการควบคุมภายในสำหรับหน่วยงานของรัฐ พ.ศ. 2561
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">ส่วนราชการ</th>
                    <th className="px-4 py-3">กระบวนการปฏิบัติงานที่ประเมิน</th>
                    <th className="px-4 py-3">ผลการประเมินการควบคุมภายใน</th>
                    <th className="px-4 py-3 text-center">ความเสี่ยงที่ยังมีอยู่</th>
                    <th className="px-4 py-3">แผนการปรับปรุงการควบคุมภายใน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {internalControls.pk4.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{item.department}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.evaluatedProcess}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-sm">{item.controlEvaluation}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            item.residualRisk === 'สูง'
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300'
                              : item.residualRisk === 'ปานกลาง'
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {item.residualRisk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-blue-700 dark:text-blue-400 font-medium">{item.improvementPlan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: PK 5 */}
      {activeTab === 'pk5' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              แบบ ปค.5: รายงานการติดตามประเมินผลการควบคุมภายใน
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ติดตามผลการดำเนินงานตามแผนการปรับปรุงการควบคุมภายในประจำงวด 6 เดือน และ 12 เดือน
            </p>
          </div>

          <div className="space-y-3">
            {internalControls.pk5.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    ประเด็นความเสี่ยง: {item.riskIssue}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                      item.status === 'ดำเนินการแล้วเสร็จ'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300">กิจกรรมควบคุมที่กำหนด: </span>
                  {item.controlActivity}
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>ผู้รับผิดชอบ: <strong className="text-slate-700 dark:text-slate-300">{item.responsiblePerson}</strong></span>
                  <span>กำหนดเวลาแล้วเสร็จ: <strong className="text-slate-700 dark:text-slate-300">{item.timeline}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: PK 1 */}
      {activeTab === 'pk1' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-xs max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-6 space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              หนังสือรับรองการปฏิบัติตามมาตรฐานการควบคุมภายใน (แบบ ปค.1)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {orgProfile.name} {orgProfile.district} {orgProfile.province}
            </p>
          </div>

          <div className="space-y-4 leading-relaxed">
            <p className="indent-8 text-justify">
              {orgProfile.name} ได้ประเมินผลการควบคุมภายในของหน่วยงานตามมาตรฐานและหลักเกณฑ์ปฏิบัติการควบคุมภายในสำหรับหน่วยงานของรัฐที่กระทรวงการคลังกำหนด
              สำหรับปีงบประมาณสิ้นสุดวันที่ 30 กันยายน พ.ศ. {selectedYear}
            </p>

            <p className="indent-8 text-justify">
              จากผลการประเมินดังกล่าว เห็นว่า ระบบการควบคุมภายในของ {orgProfile.name} มีความเพียงพอและมีประสิทธิผลตามสมควร
              ที่จะให้ความเชื่อมั่นอย่างสมเหตุสมผลว่า การดำเนินงานจะบรรลุวัตถุประสงค์ด้านการดำเนินงาน
              ด้านการรายงานทางการเงิน และด้านการปฏิบัติตามกฎหมายและระเบียบ
            </p>

            <div className="pt-8 text-center space-y-4">
              <div>(ลงชื่อ)........................................................................</div>
              <div>
                <div className="font-bold">({orgProfile.approverName})</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{orgProfile.approverPosition}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">วันที่ {internalControls.pk1?.signDate || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: BS 1 - 5 */}
      {activeTab === 'bs' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              ระบบบริหารจัดการความเสี่ยง (แบบ บส.1 - แบบ บส.5) ประจำปีงบประมาณ พ.ศ. {selectedYear}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              การบริหารจัดการความเสี่ยงตามมาตรฐานกระทรวงการคลังและหลักเกณฑ์การควบคุมภายใน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-slate-100">แบบ บส.1: การระบุความเสี่ยง</div>
              <p className="text-slate-600 dark:text-slate-400">
                รวบรวมปัจจัยเสี่ยงจาก 5 ส่วนราชการ (สำนักปลัด, กองคลัง, กองช่าง, กองการศึกษา, กองสวัสดิการ)
              </p>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> จัดทำครบทั้ง 5 ส่วนราชการ
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-slate-100">แบบ บส.2: การประเมินความเสี่ยง</div>
              <p className="text-slate-600 dark:text-slate-400">
                วิเคราะห์ Likelihood x Impact ด้วย Risk Matrix 5x5 แบ่งระดับความเสี่ยง 4 ระดับ
              </p>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> วิเคราะห์ครบถ้วนทุกกิจกรรม
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-slate-100">แบบ บส.3: แผนบริหารจัดการความเสี่ยง</div>
              <p className="text-slate-600 dark:text-slate-400">
                กำหนดมาตรการควบคุม (Risk Response) ผู้รับผิดชอบ และกำหนดเสร็จ
              </p>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> มีแผนมาตรการรองรับครบถ้วน
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-slate-100">แบบ บส.4 - บส.5: รายงานและติดตามผล</div>
              <p className="text-slate-600 dark:text-slate-400">
                รายงานผลการบริหารความเสี่ยงเสนอต่อนายก อปท. และคณะกรรมการบริหารความเสี่ยง
              </p>
              <div className="text-blue-600 dark:text-blue-400 font-bold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> รายงานรอบ 6 เดือนเรียบร้อยแล้ว
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
