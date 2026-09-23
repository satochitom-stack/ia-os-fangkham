"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Sparkles, 
  LogIn, 
  Menu, 
  X, 
  LayoutDashboard, 
  Building2, 
  FileCheck2, 
  ChevronRight,
  ShieldCheck
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
  hideHeader?: boolean;
}

export const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  logoText = "IA-OS",
  subLogoText = "อบต.ฝางคำ",
  backgroundImageUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  navLinks = [
    { label: "ภาพรวมระบบ", href: "#overview", isActive: true },
    { label: "หน่วยรับตรวจ 6 กอง", href: "#departments" },
    { label: "ฟังก์ชันการตรวจสอบ", href: "#modules" },
    { label: "คลังระเบียบและมาตรฐาน", href: "#standards" }
  ],
  ctaButtonText = "เข้าสู่ระบบ",
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
  partnersTitle = "โครงสร้าง 6 หน่วยรับตรวจที่เชื่อมโยงในระบบ (Connected Departments)",
  partners = [
    { name: "สำนักปลัด", label: "งานบริหารทั่วไปและนโยบาย" },
    { name: "กองคลัง", label: "งานการเงิน พัสดุ และบัญชี" },
    { name: "กองช่าง", label: "งานโยธาและโครงการก่อสร้าง" },
    { name: "กองการศึกษา", label: "ศูนย์พัฒนาเด็กเล็กและการศึกษา" },
    { name: "กองสวัสดิการสังคม", label: "เบี้ยยังชีพและการพัฒนาชุมชน" },
    { name: "กองสาธารณสุขฯ", label: "สิ่งแวดล้อมและสุขาภิบาล" }
  ],
  session,
  hideHeader = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="w-full isolate min-h-[90vh] lg:min-h-[92vh] overflow-hidden relative rounded-3xl border border-blue-200/70 shadow-[0_20px_60px_-15px_rgba(30,58,138,0.1)] bg-white">
      {/* Background image with soft warm light overlay */}
      <img
        src={backgroundImageUrl}
        alt="IA-OS Fang Kham Background"
        className="w-full h-full object-cover absolute inset-0 opacity-25 filter blur-[1px] scale-105 transition-transform duration-1000"
      />
      {/* Soft warm white and sky-blue gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-blue-50/80 to-[#f8fafc]" />
      
      {/* Ambient background light orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[450px] h-[450px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar within Hero */}
      {!hideHeader && (
        <header className="z-20 relative pt-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-blue-100 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-sm text-slate-900 tracking-tight">{logoText}</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                    {subLogoText}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">ระบบปฏิบัติการตรวจสอบภายใน</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 rounded-full bg-white/85 px-2 py-1.5 border border-slate-200/80 shadow-xs backdrop-blur-md">
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
              
              <button
                onClick={onCtaClick}
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
              >
                <span>{session ? "ไปยังแดชบอร์ด" : ctaButtonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
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
            <div className="md:hidden mt-3 p-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg space-y-2">
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
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs"
              >
                <span>{session ? "ไปยังแดชบอร์ดงาน" : ctaButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </header>
      )}

      {/* Hero Body */}
      <div className="z-10 relative">
        <div className={`max-w-7xl mx-auto px-6 pb-16 ${hideHeader ? 'pt-8 sm:pt-12 lg:pt-14' : 'pt-14 sm:pt-20 lg:pt-24'}`}>
          <div className="mx-auto max-w-3xl text-center">
            {/* 1. Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/90 px-3 py-1.5 border border-blue-200/80 shadow-xs backdrop-blur-md animate-fade-slide-in-1">
              <span className="inline-flex items-center text-[11px] font-bold text-white bg-blue-600 rounded-full py-0.5 px-2.5 shadow-2xs">
                {badgeLabel}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {badgeText}
              </span>
            </div>

            {/* 2. Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2] animate-fade-slide-in-2">
              {title}
              <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
                {titleLine2}
              </span>
            </h1>

            {/* 3. Description */}
            <p className="mt-6 text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto animate-fade-slide-in-3">
              {description}
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-col sm:flex-row mt-9 gap-3 items-center justify-center animate-fade-slide-in-4">
              <button
                type="button"
                onClick={onPrimaryClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm py-3.5 px-7 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>⚡</span>
                <span>{session ? "เปิดแดชบอร์ดงานตรวจสอบ" : primaryButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onSecondaryClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-700 font-bold text-sm py-3.5 px-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{secondaryButtonText}</span>
              </button>
            </div>
          </div>

          {/* 5. Department Partners Grid */}
          <div className="mx-auto mt-16 max-w-5xl pt-8 border-t border-slate-200/80">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center animate-fade-slide-in-1">
              {partnersTitle}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mt-6 gap-3 animate-fade-slide-in-2">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  onClick={partner.onClick}
                  className="bg-white/80 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-300/80 rounded-2xl p-3 text-center transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-1.5 transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {partner.name}
                  </div>
                  {partner.label && (
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {partner.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
