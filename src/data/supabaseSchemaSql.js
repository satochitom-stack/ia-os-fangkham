// SQL Schema script for Supabase setup
export const SUPABASE_SCHEMA_SQL = `-- =========================================================================
-- สคริปต์โครงสร้างฐานข้อมูลระบบตรวจสอบภายใน อปท. (IA-OS Enterprise)
-- สำหรับรันใน Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- =========================================================================

-- 1. สร้างตาราง profiles (ขยายข้อมูลจาก auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  department TEXT NOT NULL,
  position TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'executive', 'dept_head', 'staff')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  permissions TEXT[] DEFAULT ARRAY['risk-management', 'forms'],
  can_manage_users BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- เปิดใช้งาน Row Level Security (RLS) สำหรับ profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- นโยบาย RLS สำหรับ profiles
CREATE POLICY "Users can view own profile or Admin can view all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'executive')
    )
  );

CREATE POLICY "Users can update own profile, Admins can update all"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. สร้าง Trigger อัตโนมัติเมื่อมีผู้ใช้งานสมัครสมาชิกผ่าน Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_display_name TEXT;
  v_department TEXT;
  v_position TEXT;
  v_role TEXT;
BEGIN
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  v_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', v_username);
  v_department := COALESCE(NEW.raw_user_meta_data->>'department', 'กองคลัง');
  v_position := COALESCE(NEW.raw_user_meta_data->>'position', 'เจ้าหน้าที่');
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'staff');

  INSERT INTO public.profiles (id, username, display_name, department, position, role, status, permissions)
  VALUES (
    NEW.id,
    v_username,
    v_display_name,
    v_department,
    v_position,
    v_role,
    'pending',
    ARRAY['risk-management', 'forms']
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. ตาราง department_permissions (กำหนดสิทธิ์การมองเห็นเมนูรายกอง)
CREATE TABLE IF NOT EXISTS public.department_permissions (
  department TEXT PRIMARY KEY,
  permissions TEXT[] NOT NULL DEFAULT ARRAY['risk-management', 'forms'],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.department_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view department permissions"
  ON public.department_permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can modify department permissions"
  ON public.department_permissions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ข้อมูลสิทธิ์เริ่มต้นรายกอง (2 เมนู: บริหารความเสี่ยง และ แบบฟอร์มมาตรฐาน)
INSERT INTO public.department_permissions (department, permissions)
VALUES 
  ('หน่วยตรวจสอบภายใน', ARRAY['dashboard', 'audit-risk', 'planning', 'engagement-plan', 'execution', 'audit-toolkits', 'reporting', 'internal-control', 'risk-management', 'lpa', 'knowledge', 'forms', 'users']),
  ('กองคลัง', ARRAY['risk-management', 'forms']),
  ('สำนักปลัด', ARRAY['risk-management', 'forms']),
  ('กองช่าง', ARRAY['risk-management', 'forms']),
  ('กองการศึกษา', ARRAY['risk-management', 'forms']),
  ('กองสวัสดิการสังคม', ARRAY['risk-management', 'forms'])
ON CONFLICT (department) DO NOTHING;

-- 4. ตาราง risk_management_data (ข้อมูลแบบ บส.1 ถึง บส.5 รายกองและรายปี)
CREATE TABLE IF NOT EXISTS public.risk_management_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fiscal_year TEXT NOT NULL,
  department TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fiscal_year, department)
);

ALTER TABLE public.risk_management_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dept risk or Admin can view all"
  ON public.risk_management_data
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.status = 'active'
      AND (p.role IN ('admin', 'executive') OR p.department = risk_management_data.department)
    )
  );

CREATE POLICY "Users can update own dept risk or Admin can update all"
  ON public.risk_management_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.status = 'active'
      AND (p.role = 'admin' OR p.department = risk_management_data.department)
    )
  );

-- 5. ตาราง internal_controls_data (ข้อมูลแบบ ปค.1, ปค.4, ปค.5 รายกองและรายปี)
CREATE TABLE IF NOT EXISTS public.internal_controls_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fiscal_year TEXT NOT NULL,
  department TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fiscal_year, department)
);

ALTER TABLE public.internal_controls_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dept controls or Admin can view all"
  ON public.internal_controls_data
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.status = 'active'
      AND (p.role IN ('admin', 'executive') OR p.department = internal_controls_data.department)
    )
  );

CREATE POLICY "Users can update own dept controls or Admin can update all"
  ON public.internal_controls_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.status = 'active'
      AND (p.role = 'admin' OR p.department = internal_controls_data.department)
    )
  );
`;
