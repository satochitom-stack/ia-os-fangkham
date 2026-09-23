"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Sparkles, 
  LogIn, 
  Menu, 
  X, 
  Building2, 
  Play
} from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface Partner {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface ResponsiveHeroBannerProps {
  logoText?: string;
  subLogoText?: string;
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  onCtaClick?: () => void;
  badgeLabel?: string;
  badgeText?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  partnersTitle?: string;
  partners?: Partner[];
  session?: any;
}

export const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  logoText = "IA-OS",
  subLogoText = "อบต.ฝางคำ",
  backgroundImageUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  navLinks = [
    { label: "ภาพรวมระบบ", href: "#welcome-features", isActive: true },
    { label: "หน่วยรับตรวจ 6 กอง", href: "#departments" },
    { label: "ฟังก์ชันการตรวจสอบ", href: "#modules" },
    { label: "คลังระเบียบ ว 614", href: "#standards" }
  ],
  ctaButtonText = "เข้าสู่ระบบ (Sign In)",
  onCtaClick,
  badgeLabel = "IA-OS 2569",
  badgeText = "ระบบปฏิบัติการตรวจสอบภายใน อปท. ยุคดิจิทัล",
  title = "ระบบงานตรวจสอบภายใน",
  titleLine2 = "องค์การบริหารส่วนตำบลฝางคำ",
  description = "ยกระดับการปฏิบัติงานตรวจสอบภายในสู่มาตรฐานสากล เชื่อมโยง 6 กองงาน ประเมินความเสี่ยง SOFCK จัดทำแนวการตรวจตามหนังสือสั่งการ ว 614 และรายงานการควบคุมภายใน ปอ.1 - ปค.5 อย่างครบวงจร",
  primaryButtonText = "เข้าสู่ระบบงาน (Sign In)",
  onPrimaryClick,
  secondaryButtonText = "สำรวจฟังก์ชันระบบ",
  onSecondaryClick,
  partnersTitle = "โครงสร้าง 6 หน่วยรับตรวจที่เชื่อมโยงในระบบ (CONNECTED DEPARTMENTS)",
  partners = [
    { name: "สำนักปลัด", label: "งานบริหารทั่วไปและนโยบาย" },
    { name: "กองคลัง", label: "งานการเงิน พัสดุ และบัญชี" },
    { name: "กองช่าง", label: "งานโยธาและโครงการก่อสร้าง" },
    { name: "กองการศึกษา", label: "ศูนย์พัฒนาเด็กเล็กและการศึกษา" },
    { name: "กองสวัสดิการสังคม", label: "เบี้ยยังชีพและการพัฒนาชุมชน" },
    { name: "กองยุทธศาสตร์ฯ", label: "แผนงานและงบประมาณ" }
  ],
  session
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="w-full isolate min-h-[92vh] lg:min-h-screen overflow-hidden relative rounded-3xl sm:rounded-[2.5rem] border border-blue-200/80 shadow-[0_20px_60px_-15px_rgba(30,58,138,0.12)] bg-gradient-to-br from-white via-[#f4f8fe] to-[#eaf2fc] text-slate-800 flex flex-col justify-between">
      {/* 1. Bright Architectural Building Photo Background */}
      <img
        src={backgroundImageUrl}
        alt="IA-OS Building Background"
        className="w-full h-full object-cover absolute inset-0 opacity-[0.22] filter blur-[0.5px] scale-105 pointer-events-none select-none"
      />

      {/* Soft warm-white and sky-blue gradient wash for daylight clarity */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-blue-50/70" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-blue-900/5 rounded-3xl sm:rounded-[2.5rem]" />

      {/* 2. Dynamic Electric Royal Blue & Cyan Cutting Light Beam (เส้นแสงโค้งตามรูปวาด ผ่าน ภายใน และ ฝางคำ) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <svg 
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full object-cover animate-beam-pulse"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Main beam gradient flowing along path from top-left to bottom-right */}
            <linearGradient id="beamGradient" x1="430" y1="-20" x2="1260" y2="920" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
              <stop offset="12%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="42%" stopColor="#0ea5e9" stopOpacity="1" />
              <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="88%" stopColor="#2563eb" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>

            {/* Core laser white-cyan hot gradient */}
            <linearGradient id="coreGradient" x1="430" y1="-20" x2="1260" y2="920" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="18%" stopColor="#bae6fd" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>

            {/* Radiant lens glow around ภายใน and ฝางคำ */}
            <radialGradient id="textBacklight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            {/* Laser blur filters */}
            <filter id="glowWide" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="34" result="blurWide" />
            </filter>
            <filter id="glowMed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="blurMed" />
            </filter>
            <filter id="glowSharp" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blurSharp" />
            </filter>
          </defs>

          {/* Soft radiant aura behind text intersection at ภายใน and ฝางคำ */}
          <circle cx="885" cy="350" r="140" fill="url(#textBacklight)" />
          <circle cx="965" cy="440" r="140" fill="url(#textBacklight)" />

          {/* Smooth circular arc beam: M 430 -20 C 796 201, 1086 529, 1260 920 smoothly curving across ภายใน and ฝางคำ */}
          {/* Layer 1: Wide atmospheric blue dispersion aura */}
          <path 
            d="M 430 -20 C 796 201, 1086 529, 1260 920" 
            stroke="#0284c7" 
            strokeWidth="94" 
            strokeOpacity="0.22"
            filter="url(#glowWide)"
            pathLength="1000"
            className="animate-draw-beam"
          />

          {/* Layer 2: Medium vibrant cyan/royal beam body */}
          <path 
            d="M 430 -20 C 796 201, 1086 529, 1260 920" 
            stroke="url(#beamGradient)" 
            strokeWidth="25" 
            strokeOpacity="0.82"
            filter="url(#glowMed)"
            pathLength="1000"
            className="animate-draw-beam"
          />

          {/* Layer 3: Neon electric line */}
          <path 
            d="M 430 -20 C 796 201, 1086 529, 1260 920" 
            stroke="url(#beamGradient)" 
            strokeWidth="8.5" 
            strokeOpacity="0.95"
            filter="url(#glowSharp)"
            pathLength="1000"
            className="animate-draw-beam"
          />

          {/* Layer 4: Razor-sharp white-hot laser core */}
          <path 
            d="M 430 -20 C 796 201, 1086 529, 1260 920" 
            stroke="url(#coreGradient)" 
            strokeWidth="3.2" 
            strokeOpacity="1"
            pathLength="1000"
            className="animate-draw-beam"
          />
        </svg>
      </div>

      {/* Ambient soft glow bubbles */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-300/12 rounded-full blur-3xl pointer-events-none" />

      {/* 3. Integrated Modern Glass Header */}
      <header className="z-20 relative pt-5 sm:pt-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Modern Government Tech Brand */}
          <div className="flex items-center space-x-3 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-blue-100/80 shadow-xs">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-sm sm:text-base tracking-wider text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {logoText}
                </span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 rounded-full">
                  {subLogoText}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">ระบบราชการดิจิทัล 24/7</span>
              </div>
            </div>
          </div>

          {/* Center: Frosted Glass Capsule Navigation Pill */}
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/85 px-2 py-1.5 border border-slate-200/80 shadow-xs backdrop-blur-md">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  link.isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: CTA Button */}
          <div className="hidden sm:flex items-center">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <span>{session ? "ไปยังแดชบอร์ดงาน" : ctaButtonText}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 border border-slate-200 shadow-xs text-slate-700"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl space-y-2">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onCtaClick) onCtaClick();
              }}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md"
            >
              <span>{session ? "ไปยังแดชบอร์ดงาน" : ctaButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* 4. Hero Center Body (Title, Badge, Description, CTA Buttons) */}
      <div className="z-10 relative my-auto py-10 sm:py-14 lg:py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Frosted Glass Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/90 px-3.5 py-1.5 border border-blue-200/80 shadow-xs backdrop-blur-md animate-fade-slide-in-1">
            <span className="inline-flex items-center text-[11px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full py-0.5 px-2.5 shadow-2xs font-['Chakra_Petch',sans-serif]">
              {badgeLabel}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              {badgeText}
            </span>
          </div>

          {/* Main Title - No awkward wrapping, guaranteed 2 balanced lines */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] animate-fade-slide-in-2 font-['Prompt',sans-serif]">
            <span className="block drop-shadow-xs">
              {title}
            </span>
            <span className="inline-block whitespace-nowrap bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-xs mt-1 sm:mt-2">
              {titleLine2}
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-2xs animate-fade-slide-in-3">
            {description}
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row mt-8 sm:mt-10 gap-3 sm:gap-4 items-center justify-center animate-fade-slide-in-4">
            <button
              type="button"
              onClick={onPrimaryClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm py-3.5 px-8 shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>⚡</span>
              <span>{session ? "เปิดแดชบอร์ดงานตรวจสอบ" : primaryButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onSecondaryClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-blue-700 font-bold text-sm py-3.5 px-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span>{secondaryButtonText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom Connected Departments (6 หน่วยรับตรวจ) */}
      <div className="z-10 relative pb-7 sm:pb-8 px-6">
        <div className="max-w-5xl mx-auto pt-5 border-t border-slate-200/80">
          <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center animate-fade-slide-in-1">
            {partnersTitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mt-4 gap-2.5 sm:gap-3 animate-fade-slide-in-2">
            {partners.map((partner, index) => (
              <div
                key={index}
                onClick={partner.onClick}
                className="bg-white/85 hover:bg-blue-50/90 border border-slate-200/80 hover:border-blue-300 rounded-2xl p-2.5 sm:p-3 text-center transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-1 transition-colors">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {partner.name}
                </div>
                {partner.label && (
                  <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">
                    {partner.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
