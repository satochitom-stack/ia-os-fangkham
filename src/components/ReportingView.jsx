import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Send,
  Calendar,
  Plus,
  Trash2
} from 'lucide-react';

export default function ReportingView({
  orgProfile,
  annualPlans = [],
  workingPapers = []
}) {
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'exit', 'followup'
  const [selectedWpId, setSelectedWpId] = useState(() => workingPapers[0]?.id || '');

  // Persistent Follow-up state
  const [followupItems, setFollowupItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_followup_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ia_followup_items', JSON.stringify(followupItems));
  }, [followupItems]);

  const [showAddFollowup, setShowAddFollowup] = useState(false);
  const [newFollowup, setNewFollowup] = useState({
    topic: '',
    department: 'กองคลัง',
    recommendation: '',
    deadline: '',
    status: 'in_progress',
    auditeeFeedback: ''
  });

  const currentWp = workingPapers.find((w) => w.id === selectedWpId) || workingPapers[0] || {};
  const relatedPlan = annualPlans.find((p) => p.id === currentWp.auditPlanId);

  const handleUpdateFollowupStatus = (id, newStatus) => {
    setFollowupItems(
      followupItems.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
  };

  const handleAddFollowup = (e) => {
    e.preventDefault();
    if (!newFollowup.topic.trim()) return;
    const newItem = {
      ...newFollowup,
      id: `FOL-${Date.now().toString().slice(-4)}`
    };
    setFollowupItems([...followupItems, newItem]);
    setShowAddFollowup(false);
    setNewFollowup({
      topic: '',
      department: 'กองคลัง',
      recommendation: '',
      deadline: '',
      status: 'in_progress',
      auditeeFeedback: ''
    });
  };

  const handleDeleteFollowup = (id) => {
    setFollowupItems(followupItems.filter((f) => f.id !== id));
  };

  const reportTitle = currentWp.topic || 'รายงานผลการตรวจสอบภายใน';
  const reportDept = currentWp.department || 'หน่วยรับตรวจ';
  const auditorName = orgProfile.auditorName?.trim() || 'ผู้ตรวจสอบภายใน';
  const auditorPosition = orgProfile.auditorPosition || 'นักวิชาการตรวจสอบภายใน';
  const approverName = orgProfile.approverName?.trim() || 'นายกองค์กรปกครองส่วนท้องถิ่น';
  const approverPosition = orgProfile.approverPosition || 'นายกองค์กรปกครองส่วนท้องถิ่น';
  const palatName = orgProfile.palatName?.trim() || 'ปลัดองค์กรปกครองส่วนท้องถิ่น';
  const palatPosition = orgProfile.palatPosition || 'ปลัดองค์กรปกครองส่วนท้องถิ่น';

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            ร่างรายงานผลการตรวจสอบ (Audit Report)
          </button>
          <button
            onClick={() => setActiveTab('exit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'exit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            การประชุมปิดตรวจ (Exit Conference)
          </button>
          <button
            onClick={() => setActiveTab('followup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'followup'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            ติดตามผลข้อเสนอแนะ ({followupItems.length})
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === 'report' && workingPapers.length > 0 && (
            <select
              value={selectedWpId}
              onChange={(e) => setSelectedWpId(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer max-w-[260px] truncate"
            >
              {workingPapers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id}: {w.topic.slice(0, 30)}...
                </option>
              ))}
            </select>
          )}

          {activeTab === 'followup' && (
            <button
              onClick={() => setShowAddFollowup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มประเด็นติดตาม</span>
            </button>
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
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* Official Letter Header */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 text-center space-y-2">
            <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">บันทึกข้อความ</div>
            <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700 dark:text-slate-300 pt-3">
              <div className="text-left">
                <span>ส่วนราชการ: </span>
                <span className="font-normal">{orgProfile.agencyName || 'หน่วยตรวจสอบภายใน'} {orgProfile.name}</span>
              </div>
              <div className="text-right">
                <span>ที่: </span>
                <span className="font-normal font-mono">อบ......./.........</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="text-left">
                <span>วันที่: </span>
                <span className="font-normal">...... เดือน ...................... พ.ศ. {orgProfile.fiscalYear || '2568'}</span>
              </div>
              <div className="text-left">
                <span>เรื่อง: </span>
                <span className="font-bold">รายงานผลการตรวจสอบภายใน {reportTitle}</span>
              </div>
            </div>
          </div>

          <div className="text-xs sm:text-sm space-y-4">
            <div>
              <strong>เรียน:</strong> {approverPosition} ผ่าน {palatPosition}
            </div>

            <p className="indent-8 text-justify leading-relaxed">
              ตามที่หน่วยตรวจสอบภายใน {orgProfile.name} ได้ดำเนินการเข้าปฏิบัติงานตรวจสอบ{' '}
              <strong>{reportTitle}</strong> ของ <strong>{reportDept}</strong>{' '}
              ตามแผนการตรวจสอบประจำปีงบประมาณ พ.ศ. {orgProfile.fiscalYear} บัดนี้ การปฏิบัติงานตรวจสอบได้เสร็จสิ้นแล้ว จึงขอรายงานผลการตรวจสอบดังต่อไปนี้
            </p>

            {/* Objective & Scope */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">1. วัตถุประสงค์และขอบเขตการตรวจสอบ</h4>
              <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs leading-relaxed">
                {relatedPlan?.objective || `เพื่อตรวจสอบความถูกต้อง ครบถ้วน และการปฏิบัติตามกฎหมาย ระเบียบ ข้อบังคับ และหนังสือสั่งการที่เกี่ยวข้องของ ${reportDept}`}
              </p>
            </div>

            {/* Findings & Recommendations */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">2. ข้อตรวจพบและข้อเสนอแนะ</h4>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-blue-700 dark:text-blue-400 shrink-0">2.1 สภาพการณ์ที่ตรวจพบ:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {currentWp?.finding?.condition || 'ไม่พบข้อบกพร่องที่มีนัยสำคัญ / อยู่ระหว่างการลงข้อมูล'}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">2.2 สาเหตุ:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {currentWp?.finding?.cause || '-'}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <span className="font-bold text-rose-700 dark:text-rose-400 shrink-0">2.3 ผลกระทบ:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {currentWp?.finding?.effect || '-'}
                  </span>
                </div>

                <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900 space-y-1">
                  <div className="font-bold text-blue-950 dark:text-blue-300">2.4 ข้อเสนอแนะของผู้ตรวจสอบภายใน:</div>
                  <div className="text-blue-900 dark:text-blue-200">
                    {currentWp?.finding?.recommendation || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-8">
                <div>(ลงชื่อ)........................................................</div>
                <div>
                  <div className="font-bold">({auditorName})</div>
                  <div className="text-slate-500 dark:text-slate-400">{auditorPosition}</div>
                  <div className="text-[11px] text-slate-400">ผู้รายงาน</div>
                </div>
              </div>

              <div className="space-y-8">
                <div>(ลงชื่อ)........................................................</div>
                <div>
                  <div className="font-bold">({approverName})</div>
                  <div className="text-slate-500 dark:text-slate-400">{approverPosition}</div>
                  <div className="text-[11px] text-slate-400">ผู้อนุมัติ / สั่งการ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Exit Conference */}
      {activeTab === 'exit' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              การประชุมปิดตรวจ (Exit Conference)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              นำเสนอข้อตรวจพบและร่วมหารือแนวทางแก้ไขกับหัวหน้าส่วนราชการผู้รับตรวจก่อนออกรายงานฉบับสมบูรณ์
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <div className="font-bold text-blue-950 dark:text-blue-300 mb-1">วันและเวลาประชุม</div>
              <div className="text-slate-700 dark:text-slate-300">ตามที่นัดหมายหน่วยรับตรวจ</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <div className="font-bold text-blue-950 dark:text-blue-300 mb-1">สถานที่ประชุม</div>
              <div className="text-slate-700 dark:text-slate-300">ห้องประชุม {orgProfile.name}</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <div className="font-bold text-blue-950 dark:text-blue-300 mb-1">ประธานในที่ประชุม</div>
              <div className="text-slate-700 dark:text-slate-300">{palatName} ({palatPosition})</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">ประเด็นข้อตรวจพบที่นำเสนอในที่ประชุม ({reportTitle})</h4>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>ประเด็น: {currentWp.finding?.condition || 'ยังไม่ได้บันทึกข้อตรวจพบในกระดาษทำการ'}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                ข้อเสนอแนะ: {currentWp.finding?.recommendation || 'สามารถเข้าไปกรอกข้อตรวจพบและข้อเสนอแนะได้ในโมดูลปฏิบัติการตรวจ'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Follow-up Tracker */}
      {activeTab === 'followup' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                กระดานติดตามผลการปฏิบัติตามข้อเสนอแนะ (Follow-up Tracker)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ติดตามความคืบหน้าการแก้ไขข้อบกพร่องตามกำหนดเวลา 30 วัน / 60 วัน ตามระเบียบฯ
              </p>
            </div>
            <button
              onClick={() => setShowAddFollowup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มประเด็นติดตาม</span>
            </button>
          </div>

          {followupItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">ยังไม่มีประเด็นติดตามข้อเสนอแนะ</div>
              <p className="text-xs">เมื่อออกรายงานผลการตรวจสอบแล้ว สามารถกด "+ เพิ่มประเด็นติดตาม" เพื่อติดตามการแก้ไขของแต่ละกองได้ที่นี่</p>
            </div>
          ) : (
            <div className="space-y-3">
              {followupItems.map((item) => {
                const isDone = item.status === 'completed';
                const isInProg = item.status === 'in_progress';
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {item.id}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.topic}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500">สถานะ:</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateFollowupStatus(item.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                              : isInProg
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <option value="completed">ดำเนินการแล้วเสร็จ</option>
                          <option value="in_progress">อยู่ระหว่างดำเนินการ</option>
                          <option value="pending">ยังไม่ดำเนินการ</option>
                        </select>

                        <button
                          onClick={() => handleDeleteFollowup(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
                      <span className="font-bold text-slate-800 dark:text-slate-200">ข้อเสนอแนะ: </span>
                      {item.recommendation}
                    </div>

                    {item.auditeeFeedback && (
                      <div className="text-emerald-900 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <span className="font-bold text-emerald-950 dark:text-emerald-200">
                          รายงานผลการปรับปรุงจากหน่วยรับตรวจ ({item.department}):{' '}
                        </span>
                        {item.auditeeFeedback}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>หน่วยงานรับผิดชอบ: {item.department}</span>
                      <span>กำหนดส่งรายงานผล: {item.deadline || '-'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal: Add Followup */}
          {showAddFollowup && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">เพิ่มประเด็นติดตามข้อเสนอแนะ</h3>
                <form onSubmit={handleAddFollowup} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อประเด็นที่ติดตาม</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น การปรับปรุงทะเบียนคุมค่าเช่าบ้าน..."
                      value={newFollowup.topic}
                      onChange={(e) => setNewFollowup({ ...newFollowup, topic: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">หน่วยงานรับผิดชอบ</label>
                      <select
                        value={newFollowup.department}
                        onChange={(e) => setNewFollowup({ ...newFollowup, department: e.target.value })}
                        className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                      >
                        <option value="กองคลัง">กองคลัง</option>
                        <option value="กองช่าง">กองช่าง</option>
                        <option value="กองการศึกษา">กองการศึกษา</option>
                        <option value="กองสวัสดิการสังคม">กองสวัสดิการสังคม</option>
                        <option value="สำนักปลัด">สำนักปลัด</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">กำหนดส่งรายงานผล</label>
                      <input
                        type="text"
                        placeholder="เช่น 31 มี.ค. 68"
                        value={newFollowup.deadline}
                        onChange={(e) => setNewFollowup({ ...newFollowup, deadline: e.target.value })}
                        className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">ข้อเสนอแนะที่ให้ไว้</label>
                    <textarea
                      rows="2"
                      value={newFollowup.recommendation}
                      onChange={(e) => setNewFollowup({ ...newFollowup, recommendation: e.target.value })}
                      placeholder="ระบุข้อเสนอแนะ..."
                      className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">รายงานผลจากหน่วยรับตรวจ (ถ้ามี)</label>
                    <textarea
                      rows="2"
                      value={newFollowup.auditeeFeedback}
                      onChange={(e) => setNewFollowup({ ...newFollowup, auditeeFeedback: e.target.value })}
                      placeholder="บันทึกผลการปรับปรุงแก้ไข..."
                      className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddFollowup(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                    >
                      บันทึก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
