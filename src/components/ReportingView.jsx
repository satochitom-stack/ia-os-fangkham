import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Send,
  Calendar
} from 'lucide-react';

export default function ReportingView({
  orgProfile,
  annualPlans,
  workingPapers
}) {
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'exit', 'followup'
  const [selectedPlanForReport, setSelectedPlanForReport] = useState('PLAN-68-02');

  // Follow-up state
  const [followupItems, setFollowupItems] = useState([
    {
      id: 'FOL-01',
      topic: 'การจัดทำทะเบียนคุมค่าเช่าบ้านให้เป็นปัจจุบัน',
      department: 'กองคลัง',
      recommendation: 'ให้กองคลังจัดทำทะเบียนคุมการเบิกจ่ายให้เป็นปัจจุบันทุกครั้งที่มีการอนุมัติฎีกาเบิกจ่ายเงิน',
      deadline: '31 ม.ค. 68',
      status: 'completed', // completed, in_progress, pending
      auditeeFeedback: 'ได้ดำเนินการปรับปรุงสมุดทะเบียนคุมและลงรายการถึงปัจจุบันแล้ว พร้อมจัดทำไฟล์ Excel สำรอง'
    },
    {
      id: 'FOL-02',
      topic: 'ความปลอดภัยระบบ KTB Corporate Online (การเก็บรักษารหัสผ่าน)',
      department: 'กองคลัง',
      recommendation: 'ให้หัวหน้ากองคลังกำชับผู้ถือสิทธิห้ามจดรหัสผ่านไว้ในที่เปิดเผย และกำหนดให้เปลี่ยนรหัสผ่านทุก 90 วัน',
      deadline: '28 ก.พ. 68',
      status: 'in_progress',
      auditeeFeedback: 'ได้แจ้งเวียนเจ้าหน้าที่ Maker และจัดทำบันทึกรับทราบข้อปฏิบัติแล้ว อยู่ระหว่างกำหนดรอบเปลี่ยนรหัส'
    },
    {
      id: 'FOL-03',
      topic: 'การแนบภาพถ่ายประกอบการตรวจรับพัสดุ',
      department: 'กองช่าง',
      recommendation: 'ให้กำหนดแนวทางปฏิบัติให้แนบภาพถ่ายขณะตรวจรับพัสดุทุกโครงการไว้ในสำนวนฎีกา',
      deadline: '31 พ.ค. 68',
      status: 'pending',
      auditeeFeedback: 'รอกรรมการตรวจรับเข้าประชุมชี้แจงแนวปฏิบัติ'
    }
  ]);

  const currentPlan = annualPlans.find((p) => p.id === selectedPlanForReport) || annualPlans[0];
  const relatedWp = workingPapers.find((w) => w.auditPlanId === currentPlan.id) || workingPapers[0];

  const handleUpdateFollowupStatus = (id, newStatus) => {
    setFollowupItems(
      followupItems.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            ร่างรายงานผลการตรวจสอบ (Audit Report)
          </button>
          <button
            onClick={() => setActiveTab('exit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'exit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            การประชุมปิดตรวจ (Exit Conference)
          </button>
          <button
            onClick={() => setActiveTab('followup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'followup'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            ติดตามผลข้อเสนอแนะ ({followupItems.length})
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === 'report' && (
            <select
              value={selectedPlanForReport}
              onChange={(e) => setSelectedPlanForReport(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              {annualPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  รายงาน: {p.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => window.print()}
            className="no-print bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Official Audit Report Document */}
      {activeTab === 'report' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* Official Letter Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="text-xl font-bold tracking-tight">บันทึกข้อความ</div>
            <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700 dark:text-slate-300 pt-3">
              <div className="text-left">
                <span>ส่วนราชการ: </span>
                <span className="font-normal">{orgProfile.agencyName} {orgProfile.name} โทร. 045-XXXXXX</span>
              </div>
              <div className="text-right">
                <span>ที่: </span>
                <span className="font-normal font-mono">อบ 78401/ว 045</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="text-left">
                <span>วันที่: </span>
                <span className="font-normal">28 กุมภาพันธ์ พ.ศ. {orgProfile.fiscalYear}</span>
              </div>
              <div className="text-left">
                <span>เรื่อง: </span>
                <span className="font-bold">รายงานผลการตรวจสอบภายใน {currentPlan.title}</span>
              </div>
            </div>
          </div>

          <div className="text-xs sm:text-sm space-y-4">
            <div>
              <strong>เรียน:</strong> {orgProfile.approverPosition} ผ่าน {orgProfile.palatPosition}
            </div>

            <p className="indent-8 text-justify">
              ตามที่หน่วยตรวจสอบภายใน {orgProfile.name} ได้ดำเนินการเข้าปฏิบัติงานตรวจสอบ{' '}
              <strong>{currentPlan.title}</strong> ของ <strong>{currentPlan.department}</strong>{' '}
              ตามแผนการตรวจสอบประจำปีงบประมาณ พ.ศ. {orgProfile.fiscalYear} ในห้วงระหว่างวันที่{' '}
              {currentPlan.period} บัดนี้ การปฏิบัติงานตรวจสอบได้เสร็จสิ้นแล้ว จึงขอรายงานผลการตรวจสอบดังต่อไปนี้
            </p>

            {/* Objective & Scope */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">1. วัตถุประสงค์และขอบเขตการตรวจสอบ</h4>
              <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                {currentPlan.objective}
              </p>
            </div>

            {/* Findings & Recommendations */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">2. ข้อตรวจพบและข้อเสนอแนะ</h4>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950 space-y-3 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-blue-700 dark:text-blue-400 shrink-0">2.1 สภาพการณ์ที่ตรวจพบ:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {relatedWp?.finding?.condition || 'ไม่พบข้อบกพร่องที่มีนัยสำคัญ'}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">2.2 สาเหตุ:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {relatedWp?.finding?.cause || '-'}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <span className="font-bold text-rose-700 dark:text-rose-400 shrink-0">2.3 ผลกระทบ:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {relatedWp?.finding?.effect || '-'}
                  </span>
                </div>

                <div className="p-3 bg-blue-50/80 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-800/50 space-y-1">
                  <div className="font-bold text-blue-950 dark:text-blue-100">2.4 ข้อเสนอแนะของผู้ตรวจสอบภายใน:</div>
                  <div className="text-blue-900 dark:text-blue-200">
                    {relatedWp?.finding?.recommendation || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-8">
                <div>(ลงชื่อ)........................................................</div>
                <div>
                  <div className="font-bold">({orgProfile.auditorName})</div>
                  <div className="text-slate-500 dark:text-slate-400">{orgProfile.auditorPosition}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">ผู้รายงาน</div>
                </div>
              </div>

              <div className="space-y-8">
                <div>(ลงชื่อ)........................................................</div>
                <div>
                  <div className="font-bold">({orgProfile.approverName})</div>
                  <div className="text-slate-500 dark:text-slate-400">{orgProfile.approverPosition}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">ผู้อนุมัติ / สั่งการ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Exit Conference */}
      {activeTab === 'exit' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              การประชุมปิดตรวจ (Exit Conference)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              นำเสนอข้อตรวจพบและร่วมหารือแนวทางแก้ไขกับหัวหน้าส่วนราชการผู้รับตรวจก่อนออกรายงานฉบับสมบูรณ์
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800/50">
              <div className="font-bold text-blue-950 dark:text-blue-100 mb-1">วันและเวลาประชุม</div>
              <div className="text-slate-700 dark:text-slate-300">25 กุมภาพันธ์ พ.ศ. 2568 เวลา 10.00 น.</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800/50">
              <div className="font-bold text-blue-950 dark:text-blue-100 mb-1">สถานที่ประชุม</div>
              <div className="text-slate-700 dark:text-slate-300">ห้องประชุม อบต.ฝางคำ ชั้น 2</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800/50">
              <div className="font-bold text-blue-950 dark:text-blue-100 mb-1">ประธานในที่ประชุม</div>
              <div className="text-slate-700 dark:text-slate-300">{orgProfile.palatName} ({orgProfile.palatPosition})</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">ประเด็นข้อตรวจพบที่นำเสนอในที่ประชุม</h4>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>ประเด็น: ความเสี่ยงการควบคุมรหัสผ่านระบบ KTB Corporate Online</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                หน่วยตรวจสอบภายในได้ชี้แจงความเสี่ยงต่อผู้อำนวยการกองคลัง โดยกองคลังได้รับทราบและเห็นพ้องกับข้อเสนอแนะ
                พร้อมรับไปดำเนินการกำหนดรอบเวลาเปลี่ยนรหัสผ่านทุก 90 วัน และกวดขันห้ามจดรหัสผ่านไว้บนโต๊ะทำงาน
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Follow-up Tracker */}
      {activeTab === 'followup' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              กระดานติดตามผลการปฏิบัติตามข้อเสนอแนะ (Follow-up Tracker)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ติดตามความคืบหน้าการแก้ไขข้อบกพร่องตามกำหนดเวลา 30 วัน / 60 วัน ตามระเบียบฯ
            </p>
          </div>

          <div className="space-y-3">
            {followupItems.map((item) => {
              const isDone = item.status === 'completed';
              const isInProg = item.status === 'in_progress';
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {item.id}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.topic}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 dark:text-slate-400">สถานะ:</span>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateFollowupStatus(item.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50'
                            : isInProg
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        <option value="completed">ดำเนินการแล้วเสร็จ</option>
                        <option value="in_progress">อยู่ระหว่างดำเนินการ</option>
                        <option value="pending">ยังไม่ดำเนินการ</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-slate-200">ข้อเสนอแนะ: </span>
                    {item.recommendation}
                  </div>

                  <div className="text-emerald-900 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-500/10 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                    <span className="font-bold text-emerald-950 dark:text-emerald-200">
                      รายงานผลการปรับปรุงจากหน่วยรับตรวจ ({item.department}):{' '}
                    </span>
                    {item.auditeeFeedback}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                    <span>หน่วยงานรับผิดชอบ: {item.department}</span>
                    <span>กำหนดส่งรายงานผล: {item.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
