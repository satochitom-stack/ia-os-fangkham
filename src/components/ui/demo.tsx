import React from 'react';
import ResponsiveHeroBanner from './responsive-hero-banner';

export interface HeroDemoProps {
  session?: any;
  onLogin?: () => void;
  onExplore?: () => void;
  onSelectDepartment?: (dept: string) => void;
}

export const HeroDemo: React.FC<HeroDemoProps> = ({
  session,
  onLogin,
  onExplore,
  onSelectDepartment
}) => {
  return (
    <ResponsiveHeroBanner
      badgeLabel="IA-OS 2569"
      badgeText="ระบบปฏิบัติการตรวจสอบภายใน อปท. ยุคดิจิทัล"
      title="ระบบงานตรวจสอบภายใน"
      titleLine2="องค์การบริหารส่วนตำบลฝางคำ"
      description="ยกระดับการปฏิบัติงานตรวจสอบภายในสู่มาตรฐานสากล เชื่อมโยง 6 กองงาน ประเมินความเสี่ยง SOFCK จัดทำแนวการตรวจตามหนังสือสั่งการ ว 614 และรายงานการควบคุมภายใน ปอ.1 - ปค.5 อย่างครบวงจร"
      primaryButtonText="เข้าสู่ระบบงาน (Sign In)"
      secondaryButtonText="สำรวจฟังก์ชันระบบ"
      ctaButtonText="เข้าสู่ระบบ"
      onPrimaryClick={onLogin}
      onSecondaryClick={onExplore}
      onCtaClick={onLogin}
      session={session}
      partners={[
        { name: "สำนักปลัด", label: "งานบริหารทั่วไปและนโยบาย", onClick: () => onSelectDepartment?.("สำนักปลัด") },
        { name: "กองคลัง", label: "งานการเงิน พัสดุ และบัญชี", onClick: () => onSelectDepartment?.("กองคลัง") },
        { name: "กองช่าง", label: "งานโยธาและโครงการก่อสร้าง", onClick: () => onSelectDepartment?.("กองช่าง") },
        { name: "กองการศึกษา", label: "ศูนย์พัฒนาเด็กเล็กและการศึกษา", onClick: () => onSelectDepartment?.("กองการศึกษา") },
        { name: "กองสวัสดิการสังคม", label: "เบี้ยยังชีพและการพัฒนาชุมชน", onClick: () => onSelectDepartment?.("กองสวัสดิการสังคม") },
        { name: "กองสาธารณสุขฯ", label: "สิ่งแวดล้อมและสุขาภิบาล", onClick: () => onSelectDepartment?.("กองสาธารณสุขและสิ่งแวดล้อม") }
      ]}
    />
  );
};

export const SplineSceneBasic = HeroDemo;
export { ResponsiveHeroBanner } from './responsive-hero-banner';
export default HeroDemo;
