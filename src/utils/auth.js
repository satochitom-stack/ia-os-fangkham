// ระบบยืนยันตัวตนและการจัดการสิทธิ์ผู้ใช้งานหลายระดับ (Multi-User Role-Based Access Control - RBAC)
// รองรับบัญชี ADMIN (หน่วยตรวจสอบภายใน) และ USER (รายกอง/สำนัก)
// จัดเก็บใน LocalStorage ปลอดภัย และพร้อมสำหรับการเชื่อมต่อ Cloud Database ต่อไป

const USERS_KEY = 'ia_auth_users';
const SESSION_KEY = 'ia_auth_session';
const OLD_ACCOUNT_KEY = 'ia_auth_account';
export const LAST_USERNAME_KEY = 'ia_last_username';

export function getLastUsername() {
  try {
    const saved = localStorage.getItem(LAST_USERNAME_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {
    console.error(e);
  }
  return 'admin';
}

export function setLastUsername(username) {
  try {
    if (username) {
      localStorage.setItem(LAST_USERNAME_KEY, username.trim().toLowerCase());
    }
  } catch (e) {
    console.error(e);
  }
}

export const DEFAULT_DEPARTMENTS = [
  'หน่วยตรวจสอบภายใน',
  'กองคลัง',
  'สำนักปลัด',
  'กองช่าง',
  'กองการศึกษา',
  'กองสวัสดิการสังคม'
];

const DEPARTMENTS_KEY = 'ia_departments';

export function getDepartments() {
  try {
    const raw = localStorage.getItem(DEPARTMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let changed = false;
        const idx = parsed.indexOf('กองสาธารณสุขและสิ่งแวดล้อม');
        if (idx !== -1) {
          parsed[idx] = 'กองสวัสดิการสังคม';
          changed = true;
        }
        if (changed) {
          saveDepartments(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return [...DEFAULT_DEPARTMENTS];
}

export function saveDepartments(departments) {
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(departments));
  try {
    window.dispatchEvent(new Event('ia-departments-changed'));
  } catch (e) {
    console.error(e);
  }
}

export function addDepartment(name) {
  const clean = name.trim();
  if (!clean) throw new Error('กรุณาระบุชื่อสำนัก/กอง');
  const depts = getDepartments();
  if (depts.some((d) => d.toLowerCase() === clean.toLowerCase())) {
    throw new Error(`สำนัก/กอง "${clean}" มีอยู่ในระบบแล้ว`);
  }
  depts.push(clean);
  saveDepartments(depts);
  return depts;
}

export function cascadeDepartmentRenameToStorage(oldName, cleanNew) {
  if (!oldName || !cleanNew || oldName.trim() === cleanNew.trim()) return;
  const from = oldName.trim();
  const to = cleanNew.trim();

  // 1. ia_audit_universe_by_year
  try {
    const raw = localStorage.getItem('ia_audit_universe_by_year');
    if (raw) {
      const data = JSON.parse(raw);
      let changed = false;
      Object.keys(data).forEach((year) => {
        if (Array.isArray(data[year])) {
          data[year].forEach((act) => {
            if (act.department === from) {
              act.department = to;
              changed = true;
            }
          });
        }
      });
      if (changed) {
        localStorage.setItem('ia_audit_universe_by_year', JSON.stringify(data));
      }
    }
  } catch (e) {
    console.error('Cascade error (audit universe):', e);
  }

  // 2. ia_annual_plans_by_year
  try {
    const raw = localStorage.getItem('ia_annual_plans_by_year');
    if (raw) {
      const data = JSON.parse(raw);
      let changed = false;
      Object.keys(data).forEach((year) => {
        if (Array.isArray(data[year])) {
          data[year].forEach((plan) => {
            if (plan.department === from) {
              plan.department = to;
              changed = true;
            }
          });
        }
      });
      if (changed) {
        localStorage.setItem('ia_annual_plans_by_year', JSON.stringify(data));
      }
    }
  } catch (e) {
    console.error('Cascade error (annual plans):', e);
  }

  // 3. ia_engagement_plans_by_year
  try {
    const raw = localStorage.getItem('ia_engagement_plans_by_year');
    if (raw) {
      const data = JSON.parse(raw);
      let changed = false;
      Object.keys(data).forEach((year) => {
        if (Array.isArray(data[year])) {
          data[year].forEach((plan) => {
            if (plan.department === from) {
              plan.department = to;
              changed = true;
            }
            if (plan.targetDepartment === from) {
              plan.targetDepartment = to;
              changed = true;
            }
          });
        }
      });
      if (changed) {
        localStorage.setItem('ia_engagement_plans_by_year', JSON.stringify(data));
      }
    }
  } catch (e) {
    console.error('Cascade error (engagement plans):', e);
  }

  // 4. ia_working_papers_by_year
  try {
    const raw = localStorage.getItem('ia_working_papers_by_year');
    if (raw) {
      const data = JSON.parse(raw);
      let changed = false;
      Object.keys(data).forEach((year) => {
        if (Array.isArray(data[year])) {
          data[year].forEach((wp) => {
            if (wp.department === from) {
              wp.department = to;
              changed = true;
            }
          });
        }
      });
      if (changed) {
        localStorage.setItem('ia_working_papers_by_year', JSON.stringify(data));
      }
    }
  } catch (e) {
    console.error('Cascade error (working papers):', e);
  }
}

export function autoRepairDataLinkages() {
  try {
    const depts = getDepartments();
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return;
    const users = JSON.parse(raw);
    if (!Array.isArray(users) || users.length === 0) return;

    let usersChanged = false;
    users.forEach((u) => {
      // 1. Admin display name: change to หน่วยตรวจสอบฯ
      if (u.role === 'admin' || u.username === 'admin') {
        if (u.displayName === 'นายศุภมงคล ธรรมพิทักษ์' || !u.displayName) {
          u.displayName = 'หน่วยตรวจสอบฯ';
          usersChanged = true;
        }
      }

      // 2. Health -> กองสวัสดิการสังคม
      if (u.username === 'health') {
        if (u.department === 'กองสาธารณสุขและสิ่งแวดล้อม' || u.displayName === 'กองสาธารณสุขและสิ่งแวดล้อม' || (u.department === 'กองสวัสดิการสังคม' && u.displayName !== 'กองสวัสดิการสังคม')) {
          u.department = 'กองสวัสดิการสังคม';
          u.displayName = 'กองสวัสดิการสังคม';
          u.position = 'ผู้อำนวยการกองสวัสดิการสังคม / เจ้าหน้าที่';
          usersChanged = true;
        }
      }
      if (u.department === 'กองสาธารณสุขและสิ่งแวดล้อม') {
        u.department = 'กองสวัสดิการสังคม';
        if (u.displayName === 'กองสาธารณสุขและสิ่งแวดล้อม') {
          u.displayName = 'กองสวัสดิการสังคม';
        }
        usersChanged = true;
      }

      // 3. Generic department sync
      if (u.role !== 'admin') {
        if (DEFAULT_DEPARTMENTS.includes(u.displayName) && u.department && u.displayName !== u.department) {
          if (!depts.includes(u.displayName)) {
            cascadeDepartmentRenameToStorage(u.displayName, u.department);
            u.displayName = u.department;
            usersChanged = true;
          }
        }
      }

      // 4. Migrate 'control-risk' to 'internal-control' and 'risk-management'
      if (Array.isArray(u.permissions) && u.permissions.includes('control-risk')) {
        const set = new Set(u.permissions.filter((p) => p !== 'control-risk'));
        set.add('internal-control');
        set.add('risk-management');
        u.permissions = Array.from(set);
        usersChanged = true;
      }

      // 5. Ensure admin has audit-toolkits permission
      if (u.role === 'admin' || u.username === 'admin') {
        if (!u.permissions?.includes('audit-toolkits')) {
          u.permissions = [...(u.permissions || []), 'audit-toolkits'];
          usersChanged = true;
        }
      }
    });

    cascadeDepartmentRenameToStorage('กองสาธารณสุขและสิ่งแวดล้อม', 'กองสวัสดิการสังคม');

    // Also repair orgProfile auditorName if stored as former developer name
    try {
      const rawProfile = localStorage.getItem('ia_org_profile');
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        if (parsed && (parsed.auditorName === 'นายศุภมงคล ธรรมพิทักษ์' || !parsed.auditorName)) {
          parsed.auditorName = 'หน่วยตรวจสอบภายใน';
          localStorage.setItem('ia_org_profile', JSON.stringify(parsed));
        }
      }
    } catch (_) {}

    if (usersChanged) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Also repair active session
    const currentSession = getSession();
    if (currentSession) {
      let sessChanged = false;
      if (currentSession.username === 'admin' && (currentSession.displayName === 'นายศุภมงคล ธรรมพิทักษ์' || !currentSession.displayName)) {
        currentSession.displayName = 'หน่วยตรวจสอบฯ';
        sessChanged = true;
      }
      if (currentSession.username === 'health' || currentSession.department === 'กองสาธารณสุขและสิ่งแวดล้อม') {
        if (currentSession.displayName === 'กองสาธารณสุขและสิ่งแวดล้อม') {
          currentSession.displayName = 'กองสวัสดิการสังคม';
          sessChanged = true;
        }
        if (currentSession.department === 'กองสาธารณสุขและสิ่งแวดล้อม') {
          currentSession.department = 'กองสวัสดิการสังคม';
          sessChanged = true;
        }
      }
      if (Array.isArray(currentSession.permissions) && currentSession.permissions.includes('control-risk')) {
        const set = new Set(currentSession.permissions.filter((p) => p !== 'control-risk'));
        set.add('internal-control');
        set.add('risk-management');
        currentSession.permissions = Array.from(set);
        sessChanged = true;
      }
      if (sessChanged) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
      }
    }
  } catch (e) {
    console.error('autoRepairDataLinkages error:', e);
  }
}

export function updateDepartment(oldName, newName) {
  const cleanOld = oldName.trim();
  const cleanNew = newName.trim();
  if (!cleanNew) throw new Error('กรุณาระบุชื่อสำนัก/กองใหม่');
  const depts = getDepartments();
  const idx = depts.findIndex((d) => d.toLowerCase() === cleanOld.toLowerCase());
  if (idx === -1) throw new Error('ไม่พบสำนัก/กองเดิมในระบบ');

  if (cleanNew.toLowerCase() !== cleanOld.toLowerCase() && depts.some((d) => d.toLowerCase() === cleanNew.toLowerCase())) {
    throw new Error(`ชื่อสำนัก/กอง "${cleanNew}" มีอยู่ในระบบแล้ว`);
  }
  depts[idx] = cleanNew;
  saveDepartments(depts);

  // Update existing users belonging to oldName or displaying oldName
  const users = getUsers();
  let changed = false;
  users.forEach((u) => {
    const isOldDept = u.department?.toLowerCase() === cleanOld.toLowerCase();
    const isOldDisplay = u.displayName?.toLowerCase() === cleanOld.toLowerCase();

    if (isOldDept || isOldDisplay) {
      u.department = cleanNew;
      // Also update displayName if it was the department name or contains it
      if (isOldDisplay || (u.displayName && u.displayName.includes(cleanOld))) {
        u.displayName = u.displayName ? u.displayName.replaceAll(cleanOld, cleanNew) : cleanNew;
      }
      if (u.position && u.position.includes(cleanOld)) {
        u.position = u.position.replaceAll(cleanOld, cleanNew);
      }
      changed = true;
    }
  });
  if (changed) {
    saveUsers(users);
  }

  // Update current session if matching
  try {
    const currentSession = getSession();
    if (currentSession) {
      let sessChanged = false;
      if (currentSession.department?.toLowerCase() === cleanOld.toLowerCase()) {
        currentSession.department = cleanNew;
        sessChanged = true;
      }
      if (currentSession.displayName?.toLowerCase() === cleanOld.toLowerCase() || (currentSession.displayName && currentSession.displayName.includes(cleanOld))) {
        currentSession.displayName = currentSession.displayName.replaceAll(cleanOld, cleanNew);
        sessChanged = true;
      }
      if (sessChanged) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Cascade to audit universe, annual plans, engagement plans, working papers
  cascadeDepartmentRenameToStorage(cleanOld, cleanNew);

  return depts;
}

export function deleteDepartment(name) {
  const clean = name.trim();
  if (clean === 'หน่วยตรวจสอบภายใน') {
    throw new Error('ไม่สามารถลบ "หน่วยตรวจสอบภายใน" ได้');
  }
  const users = getUsers();
  const activeUsers = users.filter((u) => u.department === clean);
  if (activeUsers.length > 0) {
    throw new Error(`ไม่สามารถลบ "${clean}" ได้ เนื่องจากมีผู้ใช้งาน ${activeUsers.length} บัญชีสังกัดอยู่ (กรุณาย้ายสังกัดผู้ใช้ก่อน)`);
  }
  const depts = getDepartments();
  const updated = depts.filter((d) => d.toLowerCase() !== clean.toLowerCase());
  saveDepartments(updated);
  return updated;
}

const DEFAULT_SESSION_MS = 24 * 60 * 60 * 1000; // 24 ชั่วโมง

export const ALL_MENU_IDS = [
  { id: 'dashboard', label: 'ภาพรวม & ปฏิทินงาน', icon: 'LayoutDashboard', desc: 'แดชบอร์ดสรุปและปฏิทินงานตรวจสอบ' },
  { id: 'audit-risk', label: 'การประเมินความเสี่ยง', icon: 'ShieldAlert', desc: 'วิเคราะห์ SOFCK และจัดลำดับความเสี่ยง 21 กิจกรรม' },
  { id: 'planning', label: 'แผน & นโยบายตรวจ', icon: 'FileText', desc: 'แผนการตรวจสอบประจำปีและกฎบัตร' },
  { id: 'engagement-plan', label: 'แผนปฏิบัติงานตรวจ (ว 614)', icon: 'Sparkles', desc: 'แผนปฏิบัติงานรายกิจกรรมและแนวการตรวจด้วย AI' },
  { id: 'execution', label: 'ปฏิบัติการตรวจ & กระดาษทำการ', icon: 'ClipboardCheck', desc: 'ลงมือตรวจจริง สุ่มตรวจ และบันทึกกระดาษทำการ' },
  { id: 'audit-toolkits', label: 'เครื่องมือช่วยตรวจเชิงเทคนิค (ปี 70)', icon: 'Wrench', desc: 'เครื่องมือคำนวณราคากลาง Factor F, ค่าปรับ, ค่าธรรมเนียมอาคาร และข้อบัญญัติ' },
  { id: 'reporting', label: 'รายงาน & ติดตามผล', icon: 'FileSpreadsheet', desc: 'รายงานผลการตรวจสอบและติดตามข้อเสนอแนะ' },
  { id: 'internal-control', label: 'การควบคุมภายใน', icon: 'ShieldCheck', desc: 'บันทึกแบบ ปค.1, ปค.4, ปค.5 ตามหลักเกณฑ์ กค. พ.ศ. 2561 ของแต่ละกอง' },
  { id: 'risk-management', label: 'การบริหารความเสี่ยง', icon: 'AlertTriangle', desc: 'บันทึกแบบ บส.1 - บส.5 และ Matrix ระดับความเสี่ยง 5x5 ของแต่ละกอง' },
  { id: 'lpa', label: 'เตรียมรับประเมิน LPA', icon: 'Award', desc: 'เช็กลิสต์และหลักฐานเตรียมรับประเมิน LPA' },
  { id: 'knowledge', label: 'คลังระเบียบ & แบบฟอร์ม', icon: 'BookOpen', desc: 'ดาวน์โหลดระเบียบ หนังสือสั่งการ และแบบฟอร์ม' },
  { id: 'users', label: 'จัดการผู้ใช้งาน & กำหนดสิทธิ์', icon: 'Users', desc: 'จัดการบัญชีกองและกำหนดสิทธิ์การมองเห็นเมนู (ADMIN Only)' }
];

export const DEFAULT_INITIAL_USERS = [
  {
    username: 'admin',
    displayName: 'หน่วยตรวจสอบฯ',
    position: 'นักวิชาการตรวจสอบภายในปฏิบัติการ',
    department: 'หน่วยตรวจสอบภายใน',
    role: 'admin',
    passwordText: 'admin123',
    permissions: ALL_MENU_IDS.map((m) => m.id),
    canManageUsers: true,
    createdAt: Date.now()
  },
  {
    username: 'finance',
    displayName: 'กองคลัง',
    position: 'ผู้อำนวยการกองคลัง / เจ้าหน้าที่กองคลัง',
    department: 'กองคลัง',
    role: 'user',
    passwordText: '1234',
    permissions: ['dashboard', 'internal-control', 'risk-management', 'lpa', 'knowledge'],
    canManageUsers: false,
    createdAt: Date.now()
  },
  {
    username: 'palat',
    displayName: 'สำนักปลัด',
    position: 'หัวหน้าสำนักปลัด / เจ้าหน้าที่สำนักปลัด',
    department: 'สำนักปลัด',
    role: 'user',
    passwordText: '1234',
    permissions: ['dashboard', 'internal-control', 'risk-management', 'lpa', 'knowledge'],
    canManageUsers: false,
    createdAt: Date.now()
  },
  {
    username: 'engineering',
    displayName: 'กองช่าง',
    position: 'ผู้อำนวยการกองช่าง / นายช่าง',
    department: 'กองช่าง',
    role: 'user',
    passwordText: '1234',
    permissions: ['dashboard', 'internal-control', 'risk-management', 'knowledge'],
    canManageUsers: false,
    createdAt: Date.now()
  },
  {
    username: 'education',
    displayName: 'กองการศึกษา',
    position: 'ผู้อำนวยการกองการศึกษา / นักวิชาการศึกษา',
    department: 'กองการศึกษา',
    role: 'user',
    passwordText: '1234',
    permissions: ['dashboard', 'internal-control', 'risk-management', 'knowledge'],
    canManageUsers: false,
    createdAt: Date.now()
  },
  {
    username: 'health',
    displayName: 'กองสวัสดิการสังคม',
    position: 'ผู้อำนวยการกองสวัสดิการสังคม / เจ้าหน้าที่',
    department: 'กองสวัสดิการสังคม',
    role: 'user',
    passwordText: '1234',
    permissions: ['dashboard', 'internal-control', 'risk-management', 'knowledge'],
    canManageUsers: false,
    createdAt: Date.now()
  }
];

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}::${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

// -------------------------------------------------------------
// User Management Functions
// -------------------------------------------------------------

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const users = JSON.parse(raw);
      if (Array.isArray(users) && users.length > 0) {
        let changed = false;
        users.forEach((u) => {
          // 1. Admin display name: change to หน่วยตรวจสอบฯ
          if (u.role === 'admin' || u.username === 'admin') {
            if (u.displayName === 'นายศุภมงคล ธรรมพิทักษ์' || !u.displayName) {
              u.displayName = 'หน่วยตรวจสอบฯ';
              changed = true;
            }
          }
          // 2. Health -> กองสวัสดิการสังคม
          if (u.username === 'health') {
            if (u.department === 'กองสาธารณสุขและสิ่งแวดล้อม' || u.displayName === 'กองสาธารณสุขและสิ่งแวดล้อม' || (u.department === 'กองสวัสดิการสังคม' && u.displayName !== 'กองสวัสดิการสังคม')) {
              u.displayName = 'กองสวัสดิการสังคม';
              u.department = 'กองสวัสดิการสังคม';
              if (!u.position || u.position.includes('กองสาธารณสุข')) {
                u.position = 'ผู้อำนวยการกองสวัสดิการสังคม / เจ้าหน้าที่';
              }
              changed = true;
            }
          }
          if (u.department === 'กองสาธารณสุขและสิ่งแวดล้อม') {
            u.department = 'กองสวัสดิการสังคม';
            if (u.displayName === 'กองสาธารณสุขและสิ่งแวดล้อม') {
              u.displayName = 'กองสวัสดิการสังคม';
            }
            changed = true;
          }
        });
        if (changed) {
          saveUsers(users);
        }
        return users;
      }
    }

    // Auto-seed default users and check if there's an existing legacy single account
    const initialUsers = [...DEFAULT_INITIAL_USERS];
    const oldAccountRaw = localStorage.getItem(OLD_ACCOUNT_KEY);
    if (oldAccountRaw) {
      try {
        const old = JSON.parse(oldAccountRaw);
        if (old?.username) {
          const adminIdx = initialUsers.findIndex((u) => u.username === 'admin');
          if (adminIdx !== -1) {
            initialUsers[adminIdx].username = old.username;
            initialUsers[adminIdx].salt = old.salt;
            initialUsers[adminIdx].hash = old.hash;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    saveUsers(initialUsers);
    return initialUsers;
  } catch (e) {
    console.error(e);
    return DEFAULT_INITIAL_USERS;
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  try {
    window.dispatchEvent(new Event('ia-departments-changed'));
  } catch (e) {
    console.error(e);
  }
}

export function getUserByUsername(username) {
  const users = getUsers();
  return users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase()) || null;
}

export async function addUser({ username, displayName, position, department, role, password, permissions }) {
  const users = getUsers();
  const cleanUsername = username.trim().toLowerCase();
  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    throw new Error(`ชื่อผู้ใช้ "${username}" มีอยู่ในระบบแล้ว`);
  }
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  const newUser = {
    username: cleanUsername,
    displayName: displayName.trim(),
    position: position?.trim() || '',
    department: department?.trim() || 'หน่วยงานทั่วไป',
    role: role || 'user',
    salt,
    hash,
    passwordText: password, // For easy admin viewing/recovery in local system
    permissions: permissions || ['dashboard', 'internal-control', 'risk-management', 'knowledge'],
    canManageUsers: role === 'admin',
    createdAt: Date.now()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export async function updateUser(username, updates) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) throw new Error('ไม่พบผู้ใช้งานนี้ในระบบ');

  const oldUsername = users[idx].username;
  let targetUsername = oldUsername;

  if (updates.newUsername) {
    const cleanNew = updates.newUsername.trim().toLowerCase();
    if (!cleanNew) {
      throw new Error('ชื่อผู้ใช้ (Username) ต้องไม่เว้นว่าง');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanNew)) {
      throw new Error('ชื่อผู้ใช้ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข หรือขีดล่าง (_) เท่านั้น');
    }
    if (cleanNew !== oldUsername.toLowerCase()) {
      if (users.some((u, i) => i !== idx && u.username.toLowerCase() === cleanNew)) {
        throw new Error(`ชื่อผู้ใช้ "${updates.newUsername}" มีอยู่ในระบบแล้ว`);
      }
      targetUsername = cleanNew;
    }
  }

  const { newUsername, newPassword, ...restUpdates } = updates;
  const user = { ...users[idx], ...restUpdates, username: targetUsername };

  if (newPassword) {
    user.salt = generateSalt();
    user.hash = await hashPassword(newPassword, user.salt);
    user.passwordText = newPassword;
  }
  users[idx] = user;
  saveUsers(users);

  // If updating currently logged in user, refresh session
  const currentSession = getSession();
  if (currentSession?.username.toLowerCase() === oldUsername.toLowerCase()) {
    startSession(user, currentSession.remember);
  }

  // If the renamed user was the last remembered username, update it to targetUsername
  try {
    const lastUser = localStorage.getItem(LAST_USERNAME_KEY);
    if (lastUser && lastUser.toLowerCase() === oldUsername.toLowerCase()) {
      localStorage.setItem(LAST_USERNAME_KEY, targetUsername);
    }
  } catch (e) {
    console.error(e);
  }

  return user;
}

export function updateUserPermissions(username, permissions) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return null;
  users[idx].permissions = permissions;
  saveUsers(users);

  const currentSession = getSession();
  if (currentSession?.username.toLowerCase() === username.toLowerCase()) {
    startSession(users[idx], currentSession.remember);
  }
  return users[idx];
}

export function deleteUser(username) {
  const users = getUsers();
  const target = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (target?.role === 'admin' && users.filter((u) => u.role === 'admin').length <= 1) {
    throw new Error('ไม่สามารถลบบัญชีผู้ดูแลระบบ (ADMIN) คนสุดท้ายได้');
  }
  const updated = users.filter((u) => u.username.toLowerCase() !== username.toLowerCase());
  saveUsers(updated);

  // If deleted user was the remembered username, clear it
  try {
    const lastUser = localStorage.getItem(LAST_USERNAME_KEY);
    if (lastUser && lastUser.toLowerCase() === username.toLowerCase()) {
      localStorage.removeItem(LAST_USERNAME_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}

export function resetUsersToDefault() {
  saveUsers(DEFAULT_INITIAL_USERS);
  return DEFAULT_INITIAL_USERS;
}

// -------------------------------------------------------------
// Authentication & Session
// -------------------------------------------------------------

export async function verifyLogin(username, password) {
  const user = getUserByUsername(username);
  if (!user) return null;

  // Check hashed password if present
  if (user.hash && user.salt) {
    const hash = await hashPassword(password, user.salt);
    if (hash === user.hash) return user;
  }

  // Check plaintext fallback (default initial seed passwords)
  if (user.passwordText && user.passwordText === password) {
    return user;
  }

  return null;
}

export function startSession(user, remember = true, isImpersonating = false) {
  const session = {
    username: user.username,
    displayName: user.displayName,
    department: user.department,
    position: user.position,
    role: user.role || 'user',
    permissions: user.permissions || [],
    canManageUsers: !!user.canManageUsers,
    remember: !!remember,
    isImpersonating: !!isImpersonating,
    expiresAt: remember ? null : Date.now() + DEFAULT_SESSION_MS,
    loginAt: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getSession();
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// Quick switch session without needing password (useful for Admin previewing user views)
export function switchSessionTo(username, isImpersonating = true) {
  const user = getUserByUsername(username);
  if (!user) return null;
  return startSession(user, true, isImpersonating);
}

// Backward compatibility helpers for ChangePasswordModal
export function getAccount() {
  const session = getSession();
  if (session) {
    return getUserByUsername(session.username);
  }
  const users = getUsers();
  return users[0] || null;
}

export function hasAccount() {
  return getUsers().length > 0;
}

export async function changeCredentials(currentPassword, newUsername, newPassword) {
  const session = getSession();
  const usernameToChange = session ? session.username : 'admin';
  const user = getUserByUsername(usernameToChange);
  if (!user) throw new Error('ไม่พบบัญชีผู้ใช้งานในระบบ');

  const valid = await verifyLogin(user.username, currentPassword);
  if (!valid) throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');

  await updateUser(user.username, {
    displayName: newUsername || user.displayName,
    newPassword
  });
}

