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
    <Card className="w-full min-h-[540px] lg:h-[620px] bg-gradient-to-br from-[#0d3068] via-[#164a94] to-[#0a2452] border border-blue-300/35 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(26,69,153,0.32),0_0_0_1px_rgba(96,165,250,0.2)] rounded-2xl sm:rounded-3xl ring-1 ring-blue-400/25">
      {/* Ambient background glows for seamless integration with warm white theme */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-br from-blue-400/25 via-sky-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-16 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <Spotlight
        fill="rgba(147, 197, 253, 0.45)"
        size={380}
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-6 sm:p-10 md:p-12 lg:p-14 relative z-10 flex flex-col justify-center">
          {/* 1. Top Pill Badge */}
          {badge && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono text-blue-100 bg-blue-900/60 border border-blue-300/40 w-fit mb-4 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>{badge}</span>
            </div>
          )}

          {/* 2. Kicker heading with icon */}
          {kicker && (
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-300 mb-2">
              <span className="text-sky-300">⚡</span>
              <span>{kicker}</span>
            </div>
          )}

          {/* 3. Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            IA-OS <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-blue-200">
              Fang Kham
            </span>
          </h1>

          {/* 4. Thai Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed max-w-xl">
            {subtitle}
          </p>

          {/* 5. Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>⚡</span>
              <span>{session ? "ไปยังแดชบอร์ดงาน" : "เข้าสู่ระบบ (Sign In)"}</span>
              <span className="text-base font-normal">➔</span>
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-all cursor-pointer"
            >
              <span className="text-sky-300">📊</span>
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
