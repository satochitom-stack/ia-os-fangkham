'use client'

import React from 'react'
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

export interface SplineSceneBasicProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  subtext?: string;
  buttonText?: string;
  onExplore?: () => void;
  onLogin?: () => void;
  session?: any;
}

export function SplineSceneBasic({
  badge = "⚡ INTERNAL AUDIT OPERATING SYSTEM • อบต.ฝางคำ",
  title = "IA-OS FANG KHAM",
  subtitle = "ระบบปฏิบัติการตรวจสอบภายในยุคดิจิทัล องค์การบริหารส่วนตำบลฝางคำ",
  subtext = "วิเคราะห์ความเสี่ยง SOFCK • แผนปฏิบัติการ ว 614 • การควบคุมภายใน ปอ.1-ปค.5",
  buttonText = "สำรวจระบบงาน",
  onExplore,
  onLogin,
  session,
}: SplineSceneBasicProps) {
  return (
    <Card className="w-full min-h-[580px] lg:h-[640px] bg-black/[0.96] border border-cyan-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.12)] rounded-3xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-6 sm:p-10 md:p-12 relative z-10 flex flex-col justify-center">
          {badge && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 w-fit mb-5 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span>{badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-cyan-50 to-neutral-400 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            {title}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-cyan-200 font-semibold max-w-xl">
            {subtitle}
          </p>

          <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-lg leading-relaxed">
            {subtext}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={session ? onLogin : onLogin}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_24px_rgba(6,182,212,0.4)] transition-all hover:scale-105 cursor-pointer"
            >
              {session ? "ไปยังแดชบอร์ดงาน" : "เข้าสู่ระบบ (Sign In)"}
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="px-6 py-3 rounded-full border border-neutral-700 hover:border-cyan-400 text-neutral-300 hover:text-white text-sm font-semibold transition-all hover:bg-white/5 cursor-pointer"
            >
              {buttonText} ↓
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
