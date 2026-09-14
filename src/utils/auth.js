// ระบบยืนยันตัวตนแบบผู้ใช้คนเดียว (single-user local auth)
// ทำงานฝั่ง client ล้วน ๆ โดยเก็บบัญชีผู้ใช้ (username + ค่าแฮชของรหัสผ่าน) ไว้ใน
// LocalStorage ของเบราว์เซอร์เครื่องนี้เท่านั้น ไม่มีการส่งข้อมูลออกไปที่ใด
// เหมาะสำหรับแอปที่ใช้งานคนเดียวบนเครื่องของตนเอง (ไม่ใช่ระบบรักษาความปลอดภัยระดับองค์กร)

const ACCOUNT_KEY = 'ia_auth_account';
const SESSION_KEY = 'ia_auth_session';

// อายุ session เมื่อไม่ได้ติ๊ก "จดจำการเข้าสู่ระบบ"
const DEFAULT_SESSION_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง

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

export function getAccount() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function hasAccount() {
  return !!getAccount();
}

export async function createAccount(username, password) {
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  const account = { username: username.trim(), salt, hash, createdAt: Date.now() };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  return account;
}

export async function verifyLogin(username, password) {
  const account = getAccount();
  if (!account) return false;
  if (account.username !== username.trim()) return false;
  const hash = await hashPassword(password, account.salt);
  return hash === account.hash;
}

export async function changeCredentials(currentPassword, newUsername, newPassword) {
  const account = getAccount();
  if (!account) throw new Error('ยังไม่มีบัญชีผู้ใช้ในระบบ');
  const currentHash = await hashPassword(currentPassword, account.salt);
  if (currentHash !== account.hash) {
    throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
  }
  const salt = generateSalt();
  const hash = await hashPassword(newPassword, salt);
  const updated = {
    ...account,
    username: (newUsername || account.username).trim(),
    salt,
    hash,
    updatedAt: Date.now(),
  };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(updated));
  // อัปเดตชื่อผู้ใช้ใน session ปัจจุบันด้วย (ถ้ามี)
  const session = getSession();
  if (session) {
    startSession(updated.username, session.remember);
  }
  return updated;
}

export function startSession(username, remember) {
  const session = {
    username,
    remember: !!remember,
    expiresAt: remember ? null : Date.now() + DEFAULT_SESSION_MS,
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
