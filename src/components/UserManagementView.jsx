import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Key,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
  Building,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  ALL_MENU_IDS,
  getUsers,
  saveUsers,
  addUser,
  updateUser,
  updateUserPermissions,
  deleteUser,
  resetUsersToDefault,
  switchSessionTo
} from '../utils/auth';

export default function UserManagementView({ currentSession, onSwitchSession, onRefreshUser }) {
  const [users, setUsers] = useState(() => getUsers());
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix', 'accounts'
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // New/Edit User Form
  const [formUsername, setFormUsername] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formDepartment, setFormDepartment] = useState('กองคลัง');
  const [formPosition, setFormPosition] = useState('');
  const [formRole, setFormRole] = useState('user');
  const [formPassword, setFormPassword] = useState('');
  const [formPermissions, setFormPermissions] = useState(['dashboard', 'control-risk', 'knowledge']);
  const [formError, setFormError] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const refreshList = () => {
    setUsers(getUsers());
    if (onRefreshUser) onRefreshUser();
  };

  // Toggle permission for a user
  const handleTogglePermission = (username, menuId) => {
    const target = users.find((u) => u.username === username);
    if (!target) return;
    if (target.role === 'admin' && menuId === 'users') {
      showToast('⚠️ ไม่สามารถปิดสิทธิ์เมนูผู้ดูแลระบบของบัญชี ADMIN ได้');
      return;
    }

    const currentPerms = target.permissions || [];
    let updatedPerms = [];
    if (currentPerms.includes(menuId)) {
      updatedPerms = currentPerms.filter((id) => id !== menuId);
    } else {
      updatedPerms = [...currentPerms, menuId];
    }

    updateUserPermissions(username, updatedPerms);
    refreshList();
    showToast(`อัปเดตสิทธิ์ของ "${target.displayName || username}" เรียบร้อยแล้ว`);
  };

  // Quick Preset Permissions
  const handleApplyPreset = (username, presetType) => {
    let perms = [];
    if (presetType === 'all') {
      perms = ALL_MENU_IDS.map((m) => m.id);
    } else if (presetType === 'control_only') {
      perms = ['dashboard', 'control-risk', 'knowledge'];
    } else if (presetType === 'control_lpa') {
      perms = ['dashboard', 'control-risk', 'lpa', 'knowledge'];
    } else if (presetType === 'read_only') {
      perms = ['dashboard', 'knowledge'];
    }

    updateUserPermissions(username, perms);
    refreshList();
    showToast(`ใช้ชุดสิทธิ์มาตรฐานกับ "${username}" เรียบร้อยแล้ว`);
  };

  // Switch to preview view as this user
  const handleImpersonate = (username) => {
    if (confirm(`คุณต้องการสลับมุมมองเข้าใช้งานในฐานะ "${username}" ใช่หรือไม่?\n(คุณสามารถคลิกสลับกลับมาเป็น ADMIN ได้ที่แถบด้านบน)`)) {
      const sess = switchSessionTo(username);
      if (sess && onSwitchSession) {
        onSwitchSession(sess);
      }
    }
  };

  // Open Edit User
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormDisplayName(user.displayName);
    setFormDepartment(user.department);
    setFormPosition(user.position || '');
    setFormRole(user.role);
    setFormPassword(user.passwordText || '');
    setFormPermissions(user.permissions || []);
    setFormError('');
    setShowAddModal(true);
  };

  // Open Add User
  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormDisplayName('');
    setFormDepartment('กองคลัง');
    setFormPosition('');
    setFormRole('user');
    setFormPassword('1234');
    setFormPermissions(['dashboard', 'control-risk', 'knowledge']);
    setFormError('');
    setShowAddModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingUser) {
        await updateUser(editingUser.username, {
          displayName: formDisplayName,
          department: formDepartment,
          position: formPosition,
          role: formRole,
          newPassword: formPassword || undefined,
          permissions: formPermissions
        });
        showToast(`บันทึกข้อมูล "${formDisplayName}" สำเร็จ`);
      } else {
        await addUser({
          username: formUsername,
          displayName: formDisplayName,
          department: formDepartment,
          position: formPosition,
          role: formRole,
          password: formPassword || '1234',
          permissions: formPermissions
        });
        showToast(`เพิ่มผู้ใช้งาน "${formUsername}" สำเร็จ`);
      }
      setShowAddModal(false);
      refreshList();
    } catch (err) {
      setFormError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = (username) => {
    if (confirm(`ยืนยันการลบบัญชีผู้ใช้งาน "${username}" ใช่หรือไม่?`)) {
      try {
        deleteUser(username);
        refreshList();
        showToast(`ลบบัญชี "${username}" สำเร็จ`);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleResetDefaults = () => {
    if (confirm('คุณต้องการรีเซ็ตบัญชีและสิทธิ์ทั้งหมดกลับเป็นค่าเริ่มต้น 6 กองหลัก ใช่หรือไม่?')) {
      resetUsersToDefault();
      refreshList();
      showToast('รีเซ็ตข้อมูลผู้ใช้งานและสิทธิ์เป็นค่าเริ่มต้นแล้ว');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 border border-blue-500 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>ระบบกำหนดสิทธิ์การเข้าถึงเมนู (Role-Based Access Control)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            จัดการผู้ใช้งาน & กำหนดสิทธิ์เมนูรายกอง
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            ผู้ตรวจสอบภายใน (ADMIN) สามารถเปิด-ปิดเมนูที่แต่ละกองจะมองเห็นและปฏิบัติงานได้ เพื่อความปลอดภัย
            และแบ่งแยกบทบาทการทำงานระหว่างผู้ตรวจสอบกับหน่วยรับตรวจอย่างชัดเจน
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มผู้ใช้งาน / กองใหม่</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="รีเซ็ตสิทธิ์เป็นค่าเริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
            <span>รีเซ็ตสิทธิ์เริ่มต้น</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">ผู้ใช้งานในระบบทั้งหมด</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              {users.length} <span className="text-xs font-normal text-slate-400">บัญชี</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">ผู้ดูแลระบบ (ADMIN)</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {users.filter((u) => u.role === 'admin').length}{' '}
              <span className="text-xs font-normal text-slate-400">บัญชี</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">บัญชีสำนัก/กอง (USERS)</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {users.filter((u) => u.role === 'user').length}{' '}
              <span className="text-xs font-normal text-slate-400">กอง</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">เมนูทั้งหมดในระบบ</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {ALL_MENU_IDS.length} <span className="text-xs font-normal text-slate-400">เมนู</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3 px-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'matrix'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>เมทริกซ์กำหนดสิทธิ์รายเมนู (Permissions Matrix)</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`pb-3 px-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'accounts'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>จัดการบัญชีและรหัสผ่าน ({users.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: เมทริกซ์กำหนดสิทธิ์รายเมนู (Permission Matrix Table)
      ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>ตารางกำหนดการมองเห็นเมนูของแต่ละกอง</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                คลิกที่ช่อง Checkbox เพื่อเปิดหรือปิดสิทธิ์ของเมนูนั้นๆ ระบบจะบันทึกผลทันที
              </p>
            </div>
            <div className="text-xs text-slate-500 flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> = มองเห็นและใช้งานได้
              </span>
              <span className="flex items-center space-x-1">
                <Square className="w-3.5 h-3.5 text-slate-400" /> = ซ่อนเมนูนี้
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 w-52 sticky left-0 bg-slate-100 dark:bg-slate-800 z-10">
                    ผู้ใช้งาน / สำนัก-กอง
                  </th>
                  {ALL_MENU_IDS.map((menu) => (
                    <th key={menu.id} className="py-3 px-2 text-center min-w-28 font-medium">
                      <div className="font-bold text-slate-700 dark:text-slate-200">{menu.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">({menu.id})</div>
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center min-w-36">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => {
                  const isAdmin = user.role === 'admin';
                  const userPerms = user.permissions || [];
                  const isCurrent = currentSession?.username.toLowerCase() === user.username.toLowerCase();

                  return (
                    <tr
                      key={user.username}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isCurrent ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* User Info Column */}
                      <td className="py-3 px-4 sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              isAdmin
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {isAdmin ? '👑' : '🏢'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                              {user.displayName || user.username}
                              {isCurrent && (
                                <span className="ml-1 text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1 rounded font-normal">
                                  คุณ
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              @{user.username} ({user.department})
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Menu Checkboxes */}
                      {ALL_MENU_IDS.map((menu) => {
                        const hasPermission = isAdmin || userPerms.includes(menu.id);
                        const isMenuLockedForAdmin = isAdmin;

                        return (
                          <td key={menu.id} className="py-3 px-2 text-center">
                            {isMenuLockedForAdmin ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold" title="ผู้ดูแลระบบมีสิทธิ์ทุกเมนู">
                                ✓
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleTogglePermission(user.username, menu.id)}
                                className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all cursor-pointer ${
                                  hasPermission
                                    ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                                title={`${hasPermission ? 'คลิกเพื่อปิดสิทธิ์' : 'คลิกเพื่อเปิดสิทธิ์'} เมนู ${menu.label}`}
                              >
                                {hasPermission ? '✓' : ''}
                              </button>
                            )}
                          </td>
                        );
                      })}

                      {/* Actions Column */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleImpersonate(user.username)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                            title="สลับไปทดสอบดูหน้าจอในมุมมองของกองนี้"
                          >
                            <Eye className="w-3 h-3 text-blue-500" />
                            <span>ทดสอบมุมมอง</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: รายชื่อและจัดการบัญชีผู้ใช้ (Account List & Password Reset)
      ========================================================================= */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => {
            const isAdmin = user.role === 'admin';
            return (
              <div
                key={user.username}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold ${
                        isAdmin
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {isAdmin ? '👑' : '🏢'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {user.displayName || user.username}
                      </h4>
                      <div className="text-xs text-slate-400 font-mono">@{user.username}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isAdmin
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {isAdmin ? 'ผู้ดูแลระบบ (ADMIN)' : 'ผู้ใช้งาน (USER)'}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div><strong>สังกัด:</strong> {user.department}</div>
                  {user.position && <div><strong>ตำแหน่ง:</strong> {user.position}</div>}
                  <div className="flex items-center space-x-1.5 pt-1">
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    <span><strong>รหัสผ่าน:</strong> <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{user.passwordText || '••••••••'}</span></span>
                  </div>
                  <div>
                    <strong>สิทธิ์เมนู:</strong>{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {isAdmin ? 'ทุกเมนู (100%)' : `${user.permissions?.length || 0} เมนู`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => handleImpersonate(user.username)}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>เข้าสู่ระบบเป็นบัญชีนี้</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(user)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="แก้ไขข้อมูล/เปลี่ยนรหัสผ่าน"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {!isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDelete(user.username)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800"
                        title="ลบบัญชีผู้ใช้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL: เพิ่ม / แก้ไข ผู้ใช้งาน
      ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {editingUser ? `แก้ไขข้อมูลผู้ใช้: @${editingUser.username}` : 'เพิ่มบัญชีผู้ใช้งาน / สำนัก-กองใหม่'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ชื่อผู้ใช้ (Username):
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingUser}
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="เช่น finance, clerk..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 font-mono disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    รหัสผ่าน (Password):
                  </label>
                  <input
                    type="text"
                    required={!editingUser}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={editingUser ? 'เว้นว่างถ้าไม่เปลี่ยน' : 'รหัสผ่าน'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อแสดงผล / กอง:
                </label>
                <input
                  type="text"
                  required
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                  placeholder="เช่น กองคลัง (นางบุณณดา ผงผ่าน)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    สำนัก / กอง:
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="หน่วยตรวจสอบภายใน">หน่วยตรวจสอบภายใน</option>
                    <option value="กองคลัง">กองคลัง</option>
                    <option value="สำนักปลัด">สำนักปลัด</option>
                    <option value="กองช่าง">กองช่าง</option>
                    <option value="กองการศึกษา">กองการศึกษา</option>
                    <option value="กองสาธารณสุขและสิ่งแวดล้อม">กองสาธารณสุขและสิ่งแวดล้อม</option>
                    <option value="กองยุทธศาสตร์และงบประมาณ">กองยุทธศาสตร์และงบประมาณ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    บทบาท (Role):
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="user">ผู้ใช้งานประจำกอง (USER)</option>
                    <option value="admin">ผู้ดูแลระบบ (ADMIN)</option>
                  </select>
                </div>
              </div>

              {/* Menu Permissions selection */}
              {formRole !== 'admin' && (
                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    เลือกเมนูที่อนุญาตให้ผู้ใช้นี้เข้าถึงได้:
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                    {ALL_MENU_IDS.filter((m) => m.id !== 'users').map((menu) => {
                      const checked = formPermissions.includes(menu.id);
                      return (
                        <label
                          key={menu.id}
                          className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setFormPermissions(formPermissions.filter((id) => id !== menu.id));
                              } else {
                                setFormPermissions([...formPermissions, menu.id]);
                              }
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="truncate">{menu.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  {editingUser ? 'บันทึกการแก้ไข' : 'สร้างผู้ใช้งาน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
