import React, { useState, useMemo } from 'react';
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
  AlertTriangle,
  Eye,
  Lock,
  Building,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckSquare,
  Square,
  Save
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import {
  ALL_MENU_IDS,
  getUsers,
  saveUsers,
  addUser,
  updateUser,
  updateUserPermissions,
  deleteUser,
  resetUsersToDefault,
  switchSessionTo,
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
} from '../utils/auth';

export default function UserManagementView({ currentSession, onSwitchSession, onRefreshUser }) {
  const [users, setUsers] = useState(() => getUsers());
  const [departments, setDepartments] = useState(() => getDepartments());
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix', 'accounts', 'departments'
  const [toastMessage, setToastMessage] = useState('');

  // Confirm Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'ยืนยัน',
    type: 'danger',
    onConfirm: () => {}
  });

  const openConfirmModal = (config) => {
    setConfirmModalConfig({
      isOpen: true,
      confirmText: 'ยืนยัน',
      type: 'danger',
      ...config
    });
  };

  const closeConfirmModal = () => {
    setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // New/Edit User Form
  const [formUsername, setFormUsername] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formDepartment, setFormDepartment] = useState('กองคลัง');
  const [isCustomDept, setIsCustomDept] = useState(false);
  const [customDeptName, setCustomDeptName] = useState('');
  const [formPosition, setFormPosition] = useState('');
  const [formRole, setFormRole] = useState('user');
  const [formPassword, setFormPassword] = useState('');
  const [formPermissions, setFormPermissions] = useState(['dashboard', 'control-risk', 'knowledge']);
  const [formError, setFormError] = useState('');

  // Department Tab States
  const [newDeptInput, setNewDeptInput] = useState('');
  const [editingDeptOldName, setEditingDeptOldName] = useState(null);
  const [editingDeptNewName, setEditingDeptNewName] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const refreshList = () => {
    setUsers(getUsers());
    setDepartments(getDepartments());
    if (onRefreshUser) onRefreshUser();
  };

  // Pending permissions map { [username]: string[] } to prevent auto-saving on click
  const [pendingPermissions, setPendingPermissions] = useState({});

  // Check if there are unsaved permission changes
  const hasUnsavedChanges = useMemo(() => {
    return Object.keys(pendingPermissions).some((uname) => {
      const target = users.find((u) => u.username.toLowerCase() === uname.toLowerCase());
      if (!target) return false;
      const orig = [...(target.permissions || [])].sort();
      const curr = [...pendingPermissions[uname]].sort();
      if (orig.length !== curr.length) return true;
      return orig.some((val, i) => val !== curr[i]);
    });
  }, [pendingPermissions, users]);

  const modifiedUsersCount = useMemo(() => {
    return Object.keys(pendingPermissions).filter((uname) => {
      const target = users.find((u) => u.username.toLowerCase() === uname.toLowerCase());
      if (!target) return false;
      const orig = [...(target.permissions || [])].sort();
      const curr = [...pendingPermissions[uname]].sort();
      if (orig.length !== curr.length) return true;
      return orig.some((val, i) => val !== curr[i]);
    }).length;
  }, [pendingPermissions, users]);

  // Toggle permission for a user (stages change, does not auto-save)
  const handleTogglePermission = (username, menuId) => {
    const target = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!target) return;
    if (target.role === 'admin' && menuId === 'users') {
      showToast('⚠️ ไม่สามารถปิดสิทธิ์เมนูผู้ดูแลระบบของบัญชี ADMIN ได้');
      return;
    }

    const currentPerms = pendingPermissions[target.username] !== undefined
      ? pendingPermissions[target.username]
      : (target.permissions || []);

    let updatedPerms = [];
    if (currentPerms.includes(menuId)) {
      updatedPerms = currentPerms.filter((id) => id !== menuId);
    } else {
      updatedPerms = [...currentPerms, menuId];
    }

    setPendingPermissions((prev) => ({
      ...prev,
      [target.username]: updatedPerms
    }));
  };

  // Quick Preset Permissions (also stages to pendingPermissions)
  const handleApplyPreset = (username, presetType) => {
    const target = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!target) return;

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

    setPendingPermissions((prev) => ({
      ...prev,
      [target.username]: perms
    }));
    showToast(`ปรับชุดสิทธิ์ของ "${target.displayName || username}" แล้ว (กดปุ่ม "บันทึกการแก้ไขสิทธิ์" เพื่อยืนยัน)`);
  };

  // Save all pending permissions with confirmation
  const handleSavePermissions = () => {
    if (!hasUnsavedChanges) {
      showToast('ไม่มีการเปลี่ยนแปลงสิทธิ์ที่ต้องบันทึก');
      return;
    }

    openConfirmModal({
      title: 'ยืนยันการบันทึกการกำหนดสิทธิ์',
      message: `คุณต้องการบันทึกการกำหนดสิทธิ์การมองเห็นเมนูของ ${modifiedUsersCount} บัญชีกอง/ผู้ใช้งาน ตามที่แก้ไขใช่หรือไม่? การเปลี่ยนแปลงจะมีผลกับการเข้าใช้งานทันที`,
      confirmText: 'ยืนยันและบันทึกสิทธิ์',
      type: 'info',
      onConfirm: () => {
        Object.keys(pendingPermissions).forEach((uname) => {
          updateUserPermissions(uname, pendingPermissions[uname]);
        });
        setPendingPermissions({});
        refreshList();
        showToast(`บันทึกการกำหนดสิทธิ์ของ ${modifiedUsersCount} บัญชีผู้ใช้เรียบร้อยแล้ว`);
      }
    });
  };

  // Discard pending permission changes
  const handleCancelPermissions = () => {
    setPendingPermissions({});
    showToast('ยกเลิกการเปลี่ยนแปลงสิทธิ์ทั้งหมดแล้ว');
  };

  // Switch to preview view as this user
  const handleImpersonate = (username) => {
    openConfirmModal({
      title: 'สลับมุมมองเข้าใช้งาน',
      message: `คุณต้องการสลับมุมมองเข้าใช้งานในฐานะ "${username}" ใช่หรือไม่? (คุณสามารถสลับกลับมาเป็น ADMIN ได้ที่แถบด้านบน)`,
      confirmText: 'สลับมุมมอง',
      type: 'info',
      onConfirm: () => {
        const sess = switchSessionTo(username);
        if (sess && onSwitchSession) {
          onSwitchSession(sess);
        }
      }
    });
  };

  // Open Edit User
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormDisplayName(user.displayName);
    setFormDepartment(user.department || 'กองคลัง');
    setIsCustomDept(false);
    setCustomDeptName('');
    setFormPosition(user.position || '');
    setFormRole(user.role);
    setFormPassword('');
    setFormPermissions(user.permissions || []);
    setFormError('');
    setShowAddModal(true);
  };

  // Open Add User
  const handleOpenAdd = (defaultDept = null) => {
    setEditingUser(null);
    setFormUsername('');
    setFormDisplayName('');
    setFormDepartment(defaultDept || (departments.length > 1 ? departments[1] : departments[0] || 'กองคลัง'));
    setIsCustomDept(false);
    setCustomDeptName('');
    setFormPosition('');
    setFormRole('user');
    setFormPassword('');
    setFormPermissions(['dashboard', 'control-risk', 'knowledge']);
    setFormError('');
    setShowAddModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setFormError('');

    let chosenDept = formDepartment;
    if (isCustomDept) {
      const cleanCustom = customDeptName.trim();
      if (!cleanCustom) {
        setFormError('กรุณาระบุชื่อสำนัก/กองใหม่');
        return;
      }
      try {
        const updated = addDepartment(cleanCustom);
        setDepartments(updated);
        chosenDept = cleanCustom;
      } catch {
        chosenDept = cleanCustom;
      }
    }

    try {
      if (editingUser) {
        await updateUser(editingUser.username, {
          newUsername: formUsername.trim(),
          displayName: formDisplayName,
          department: chosenDept,
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
          department: chosenDept,
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

  // Department Management Handlers
  const handleAddDeptSubmit = (e) => {
    e.preventDefault();
    const clean = newDeptInput.trim();
    if (!clean) return;
    try {
      const updated = addDepartment(clean);
      setDepartments(updated);
      setNewDeptInput('');
      showToast(`เพิ่มสำนัก/กอง "${clean}" สำเร็จ`);
    } catch (err) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  const handleStartEditDept = (dept) => {
    setEditingDeptOldName(dept);
    setEditingDeptNewName(dept);
  };

  const handleSaveEditDept = (oldName) => {
    const clean = editingDeptNewName.trim();
    if (!clean) return;
    try {
      const updated = updateDepartment(oldName, clean);
      setDepartments(updated);
      setEditingDeptOldName(null);
      refreshList();
      showToast(`เปลี่ยนชื่อกองเป็น "${clean}" สำเร็จ (เชื่อมโยงและอัปเดตบัญชีผู้ใช้และข้อมูลทั้งหมดแล้ว)`);
    } catch (err) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  const handleDeleteDept = (dept) => {
    openConfirmModal({
      title: 'ยืนยันการลบสำนัก / กอง',
      message: `คุณต้องการลบสำนัก/กอง "${dept}" ออกจากระบบใช่หรือไม่? ข้อมูลการตั้งค่าของกองนี้จะถูกนำออกจากระบบ`,
      confirmText: 'ลบสำนัก/กองนี้',
      type: 'danger',
      onConfirm: () => {
        try {
          const updated = deleteDepartment(dept);
          setDepartments(updated);
          showToast(`ลบสำนัก/กอง "${dept}" สำเร็จ`);
        } catch (err) {
          showToast(`⚠️ ${err.message}`);
        }
      }
    });
  };

  const handleDelete = (username) => {
    openConfirmModal({
      title: 'ยืนยันการลบบัญชีผู้ใช้งาน',
      message: `คุณต้องการลบบัญชีผู้ใช้งาน "${username}" ใช่หรือไม่? ข้อมูลและสิทธิ์การเข้าถึงทั้งหมดของบัญชีนี้จะถูกนำออกจากระบบ`,
      confirmText: 'ลบบัญชีผู้ใช้นี้',
      type: 'danger',
      onConfirm: () => {
        try {
          deleteUser(username);
          refreshList();
          showToast(`ลบบัญชี "${username}" สำเร็จ`);
        } catch (err) {
          showToast(`⚠️ ${err.message}`);
        }
      }
    });
  };

  const handleResetDefaults = () => {
    openConfirmModal({
      title: 'รีเซ็ตบัญชีและสิทธิ์เป็นค่าเริ่มต้น',
      message: 'คุณต้องการรีเซ็ตบัญชีผู้ใช้และสิทธิ์การมองเห็นเมนูทั้งหมดกลับเป็นค่าเริ่มต้นตามโครงสร้าง 6 กองหลัก ใช่หรือไม่?',
      confirmText: 'รีเซ็ตเป็นค่าเริ่มต้น',
      type: 'warning',
      onConfirm: () => {
        resetUsersToDefault();
        refreshList();
        showToast('รีเซ็ตข้อมูลผู้ใช้งานและสิทธิ์เป็นค่าเริ่มต้นแล้ว');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Sleek Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 dark:bg-slate-950/90 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 border border-slate-700/60 dark:border-slate-800 text-xs font-bold animate-slide-up ring-1 ring-white/10">
          {toastMessage.startsWith('⚠️') ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="tracking-wide">{toastMessage.replace(/^⚠️\s*/, '')}</span>
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
            <div className="text-xs text-slate-500 font-medium">สำนัก / กอง ในระบบ</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {departments.length} <span className="text-xs font-normal text-slate-400">สำนัก/กอง</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <Building className="w-5 h-5" />
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

        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3 px-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'departments'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>จัดการสำนัก / กอง ({departments.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: เมทริกซ์กำหนดสิทธิ์รายเมนู (Permission Matrix Table)
      ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>ตารางกำหนดการมองเห็นเมนูของแต่ละกอง</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                คลิกที่ช่อง Checkbox เพื่อเปิดหรือปิดสิทธิ์ของเมนูนั้นๆ แล้วกดปุ่ม <strong>"บันทึกการแก้ไขสิทธิ์"</strong> เพื่อยืนยัน
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xs text-slate-500 hidden xl:flex items-center space-x-3 mr-2">
                <span className="flex items-center space-x-1">
                  <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> = มองเห็นและใช้งานได้
                </span>
                <span className="flex items-center space-x-1">
                  <Square className="w-3.5 h-3.5 text-slate-400" /> = ซ่อนเมนูนี้
                </span>
              </div>

              {hasUnsavedChanges && (
                <button
                  type="button"
                  onClick={handleCancelPermissions}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  ยกเลิกการแก้ไข
                </button>
              )}

              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={!hasUnsavedChanges}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all cursor-pointer ${
                  hasUnsavedChanges
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/25 ring-2 ring-blue-500/40 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>บันทึกการแก้ไขสิทธิ์ {hasUnsavedChanges ? `(${modifiedUsersCount} กอง)` : ''}</span>
              </button>
            </div>
          </div>

          {hasUnsavedChanges && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-800 dark:text-amber-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="font-bold">มีการแก้ไขสิทธิ์ของ {modifiedUsersCount} กองที่ยังไม่ได้บันทึก:</span>
                <span className="text-slate-600 dark:text-slate-300">กรุณากดปุ่ม <strong>"บันทึกการแก้ไขสิทธิ์"</strong> เพื่อยืนยันและให้มีผลในระบบ</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCancelPermissions}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
                >
                  คืนค่าเดิม
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  ยืนยันบันทึก
                </button>
              </div>
            </div>
          )}

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
                  const userPerms = pendingPermissions[user.username] !== undefined
                    ? pendingPermissions[user.username]
                    : (user.permissions || []);
                  const isCurrent = currentSession?.username.toLowerCase() === user.username.toLowerCase();
                  
                  const isUserModified = pendingPermissions[user.username] !== undefined && (() => {
                    const orig = [...(user.permissions || [])].sort();
                    const curr = [...pendingPermissions[user.username]].sort();
                    if (orig.length !== curr.length) return true;
                    return orig.some((val, idx) => val !== curr[idx]);
                  })();

                  return (
                    <tr
                      key={user.username}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isUserModified
                          ? 'bg-amber-50/30 dark:bg-amber-950/20'
                          : isCurrent ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
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
                            <div className="font-bold text-slate-800 dark:text-slate-100 truncate flex items-center space-x-1">
                              <span>{user.displayName || user.username}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1 rounded font-normal">
                                  คุณ
                                </span>
                              )}
                              {isUserModified && (
                                <span className="text-[9px] bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300 px-1 py-0.2 rounded font-medium">
                                  รอการบันทึก
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
                                title={`${hasPermission ? 'คลิกเพื่อปิดสิทธิ์' : 'คลิกเพื่อเปิดสิทธิ์'} เมนู ${menu.label} (ต้องกดบันทึกเพื่อยืนยัน)`}
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

          {/* Bottom Sticky Action Bar when there are unsaved changes */}
          {hasUnsavedChanges && (
            <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="font-bold">มีการแก้ไขสิทธิ์ของ {modifiedUsersCount} กองที่ยังไม่ได้บันทึก</span>
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">(คลิกปุ่มด้านขวาเพื่อยืนยันการบันทึก)</span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCancelPermissions}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  ยกเลิกการแก้ไข
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center space-x-2 cursor-pointer ring-2 ring-blue-500/30"
                >
                  <Save className="w-4 h-4" />
                  <span>ยืนยันบันทึกการแก้ไข ({modifiedUsersCount} กอง)</span>
                </button>
              </div>
            </div>
          )}
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
          TAB 3: จัดการสำนัก / กอง (Departments Management)
      ========================================================================= */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          {/* Add Department Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1 flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>เพิ่มสำนัก / กอง ใหม่ในระบบ</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              กำหนดชื่อกองใหม่ตามโครงสร้าง อปท. (เช่น กองสวัสดิการสังคม, กองการเจ้าหน้าที่, หรือหน่วยงานเฉพาะกิจ) เพื่อผูกกับบัญชีผู้ใช้และกำหนดสิทธิ์
            </p>
            <form onSubmit={handleAddDeptSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input
                type="text"
                required
                value={newDeptInput}
                onChange={(e) => setNewDeptInput(e.target.value)}
                placeholder="ระบุชื่อสำนักหรือกองใหม่ เช่น กองสวัสดิการสังคม..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มกองใหม่</span>
              </button>
            </form>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const deptUsers = users.filter((u) => u.department === dept);
              const isAuditDept = dept === 'หน่วยตรวจสอบภายใน';
              const isEditing = editingDeptOldName === dept;

              return (
                <div
                  key={dept}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between relative"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                            isAuditDept
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                          }`}
                        >
                          {isAuditDept ? '👑' : '🏢'}
                        </div>

                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={editingDeptNewName}
                              onChange={(e) => setEditingDeptNewName(e.target.value)}
                              className="bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-blue-500 outline-none w-full"
                              autoFocus
                            />
                            <div className="flex items-center space-x-1.5 pt-0.5">
                              <button
                                type="button"
                                onClick={() => handleSaveEditDept(dept)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer"
                              >
                                บันทึก
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingDeptOldName(null)}
                                className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded cursor-pointer"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                              {dept}
                            </h4>
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                                deptUsers.length > 0
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {deptUsers.length > 0
                                ? `${deptUsers.length} บัญชีผู้ใช้งาน`
                                : 'ยังไม่มีผู้ใช้งานสังกัด'}
                            </span>
                          </div>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditDept(dept)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            title="แก้ไขชื่อสำนัก/กอง"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {!isAuditDept && (
                            <button
                              type="button"
                              onClick={() => handleDeleteDept(dept)}
                              disabled={deptUsers.length > 0}
                              className={`p-1.5 rounded-lg transition-all ${
                                deptUsers.length > 0
                                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 cursor-pointer'
                              }`}
                              title={
                                deptUsers.length > 0
                                  ? `ไม่สามารถลบได้ เนื่องจากมีผู้ใช้งานสังกัดอยู่ ${deptUsers.length} คน`
                                  : 'ลบสำนัก/กองนี้'
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Member Avatars / List */}
                    {deptUsers.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                          ผู้ใช้งานในสังกัด:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {deptUsers.map((u) => (
                            <span
                              key={u.username}
                              className="inline-flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] px-2 py-0.5 rounded-md font-mono"
                            >
                              <span>{u.role === 'admin' ? '👑' : '👤'}</span>
                              <span>@{u.username}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOpenAdd(dept)}
                      className="w-full text-center py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ เพิ่มผู้ใช้งานสังกัดกองนี้</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="เช่น finance, clerk..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {editingUser && (
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      * สามารถเปลี่ยนชื่อล็อกอินได้
                    </span>
                  )}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      สำนัก / กอง:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomDept(!isCustomDept);
                        setCustomDeptName('');
                      }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-[10px] font-semibold cursor-pointer"
                    >
                      {isCustomDept ? '← เลือกจากรายการ' : '+ กำหนดกองใหม่'}
                    </button>
                  </div>
                  {isCustomDept ? (
                    <input
                      type="text"
                      required
                      value={customDeptName}
                      onChange={(e) => setCustomDeptName(e.target.value)}
                      placeholder="ระบุชื่อสำนัก/กองใหม่..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      autoFocus
                    />
                  ) : (
                    <select
                      value={formDepartment}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__NEW__') {
                          setIsCustomDept(true);
                          setCustomDeptName('');
                        } else {
                          // Auto update displayName if it was empty, matched previous department or another department name
                          if (!formDisplayName.trim() || formDisplayName === formDepartment || departments.includes(formDisplayName)) {
                            setFormDisplayName(val);
                          }
                          setFormDepartment(val);
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                      <option value="__NEW__">✍️ + กำหนดชื่อสำนัก/กองใหม่...</option>
                    </select>
                  )}
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

      {/* Reusable Elegant Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        type={confirmModalConfig.type}
        onConfirm={confirmModalConfig.onConfirm}
        onClose={closeConfirmModal}
      />
    </div>
  );
}
