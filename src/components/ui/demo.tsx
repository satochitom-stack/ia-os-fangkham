'use client'

import React from 'react'
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

export interface SplineSceneBasicProps {
  badge?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onExplore?: () => void;
  onLogin?: () => void;
  session?: any;
}

export function SplineSceneBasic({
  badge = "IA-OS 24/7 Engine • 6 Departments Linked",
  kicker = "INTERNAL AUDIT OPERATING SYSTEM",
  title = "IA-OS Fang Kham",
  subtitle = "ระบบปฏิบัติการตรวจสอบภายใน องค์การบริหารส่วนตำบลฝางคำ",
  buttonText = "สำรวจระบบงาน",
  onExplore,
  onLogin,
  session,
}: SplineSceneBasicProps) {
  return (
    <Card className="w-full min-h-[540px] lg:h-[620px] bg-[#070b13] border border-white/[0.08] relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-2xl sm:rounded-3xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
        size={480}
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-6 sm:p-10 md:p-12 lg:p-14 relative z-10 flex flex-col justify-center">
          {/* 1. Top Pill Badge (like reference) */}
          {badge && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-slate-900/90 border border-slate-800 w-fit mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>{badge}</span>
            </div>
          )}

          {/* 2. Kicker heading with icon */}
          {kicker && (
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <span className="text-cyan-400">⚡</span>
              <span>{kicker}</span>
            </div>
          )}

          {/* 3. Main Title (Plus Jakarta Sans, bold, modern title case) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            IA-OS <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
              Fang Kham
            </span>
          </h1>

          {/* 4. Thai Subtitle (Prompt font, clean, modern) */}
          <p className="mt-4 text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
            {subtitle}
          </p>

          {/* 5. Buttons (Matching reference app buttons) */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>⚡</span>
              <span>{session ? "ไปยังแดชบอร์ดงาน" : "เข้าสู่ระบบ (Sign In)"}</span>
              <span className="text-base font-normal">➔</span>
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-white text-sm font-medium transition-all hover:bg-slate-800/60 cursor-pointer"
            >
              <span className="text-cyan-400">📊</span>
              <span>{buttonText}</span>
            </button>
          </div>
        </div>

        {/* Right content: Interactive 3D Spline Scene */}
        <div className="flex-1 relative min-h-[350px] md:min-h-0 w-full h-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}

export default SplineSceneBasic
