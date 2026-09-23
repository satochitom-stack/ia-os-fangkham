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
  Play,
  CheckCircle2,
  ExternalLink
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
  backgroundImageUrl = "/hero-bg.jpg",
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
    <section className="w-full isolate min-h-[92vh] lg:min-h-screen overflow-hidden relative rounded-3xl sm:rounded-[2.5rem] border border-blue-500/20 shadow-[0_25px_70px_-15px_rgba(2,6,23,0.7)] bg-[#030712] text-white flex flex-col justify-between">
      {/* 1. Cinematic Background with Royal Blue & Cyan Hue Rotation */}
      <img
        src={backgroundImageUrl}
        alt="IA-OS Cosmic Background"
        className="w-full h-full object-cover absolute inset-0 pointer-events-none select-none scale-105"
        style={{
          filter: 'hue-rotate(185deg) saturate(1.4) brightness(1.08) contrast(1.05)'
        }}
      />

      {/* Subtle overlay vignettes for depth & text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#020617]/60 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl sm:rounded-[2.5rem]" />

      {/* Ambient glowing orbs in cyan and royal sapphire */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* 2. Embedded Glassmorphic Header (Exactly like Image 1) */}
      <header className="z-20 relative pt-5 sm:pt-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Modern High-Tech Government Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base sm:text-lg tracking-wider text-white drop-shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  {logoText}
                </span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  {subLogoText}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">ระบบราชการดิจิทัล 24/7</span>
              </div>
            </div>
          </div>

          {/* Center: Frosted Glass Capsule Navigation Pill */}
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/10 px-2 py-1.5 ring-1 ring-white/15 backdrop-blur-xl shadow-lg">
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
                    ? 'bg-white/20 text-white font-bold shadow-xs border border-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Crisp White Pill CTA Button (Reserve Seat style from Image 1) */}
          <div className="hidden sm:flex items-center">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-blue-50 text-slate-900 font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 shadow-md shadow-white/10 hover:shadow-cyan-400/25 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
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
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md text-white"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl space-y-2">
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
                className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white rounded-xl"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onCtaClick) onCtaClick();
              }}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-md"
            >
              <span>{session ? "ไปยังแดชบอร์ดงาน" : ctaButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* 3. Hero Center Body (Title, Badge, Description, CTA Buttons) */}
      <div className="z-10 relative my-auto py-12 sm:py-16 lg:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Frosted Glass Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/20 backdrop-blur-xl shadow-lg animate-fade-slide-in-1">
            <span className="inline-flex items-center text-[11px] font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full py-0.5 px-2.5 shadow-xs font-['Chakra_Petch',sans-serif]">
              {badgeLabel}
            </span>
            <span className="text-xs sm:text-sm font-medium text-white/95">
              {badgeText}
            </span>
          </div>

          {/* Main Title - Modern, Futuristic, Dignified (No Broken Lines) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] animate-fade-slide-in-2 font-['Prompt',sans-serif]">
            <span className="block drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              {title}
            </span>
            <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(56,189,248,0.5)] mt-1 sm:mt-2">
              {titleLine2}
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-200/90 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm animate-fade-slide-in-3">
            {description}
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row mt-8 sm:mt-10 gap-3 sm:gap-4 items-center justify-center animate-fade-slide-in-4">
            <button
              type="button"
              onClick={onPrimaryClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm py-3.5 px-8 shadow-lg shadow-blue-600/35 hover:shadow-cyan-400/30 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer ring-1 ring-white/20"
            >
              <span>⚡</span>
              <span>{session ? "เปิดแดชบอร์ดงานตรวจสอบ" : primaryButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onSecondaryClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm py-3.5 px-6 ring-1 ring-white/20 backdrop-blur-md hover:ring-white/30 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
              <span>{secondaryButtonText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Connected Departments (Matching Image 1's Partner Grid) */}
      <div className="z-10 relative pb-8 sm:pb-10 px-6">
        <div className="max-w-5xl mx-auto pt-6 border-t border-white/10">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-300/80 uppercase tracking-widest text-center animate-fade-slide-in-1">
            {partnersTitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mt-4 gap-2.5 sm:gap-3 animate-fade-slide-in-2">
            {partners.map((partner, index) => (
              <div
                key={index}
                onClick={partner.onClick}
                className="bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-400/50 rounded-2xl p-2.5 sm:p-3 text-center transition-all backdrop-blur-md cursor-pointer group shadow-xs hover:shadow-cyan-500/20"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-500/20 group-hover:bg-cyan-500/30 text-cyan-300 flex items-center justify-center mx-auto mb-1 transition-colors">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {partner.name}
                </div>
                {partner.label && (
                  <div className="text-[9px] text-slate-300/70 line-clamp-1 mt-0.5">
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
