'use client'

import React from 'react'
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

export interface SplineSceneBasicProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onExplore?: () => void;
  onLogin?: () => void;
  session?: any;
}

export function SplineSceneBasic({
  badge = "⚡ INTERNAL AUDIT OPERATING SYSTEM • อบต.ฝางคำ",
  title = "IA-OS FANG KHAM",
  subtitle = "ระบบปฏิบัติการตรวจสอบภายใน องค์การบริหารส่วนตำบลฝางคำ",
  buttonText = "สำรวจระบบงาน",
  onExplore,
  onLogin,
  session,
}: SplineSceneBasicProps) {
  return (
    <Card className="w-full min-h-[540px] lg:h-[620px] bg-black/[0.96] border border-cyan-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.12)] rounded-3xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-6 sm:p-10 md:p-12 lg:p-14 relative z-10 flex flex-col justify-center">
          {badge && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 w-fit mb-6 shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span>{badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              IA-OS
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              FANG KHAM
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg lg:text-xl text-slate-200 font-medium leading-relaxed max-w-xl">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={onLogin}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_24px_rgba(6,182,212,0.45)] transition-all hover:scale-105 cursor-pointer flex items-center space-x-2"
            >
              <span>{session ? "ไปยังแดชบอร์ดงาน" : "เข้าสู่ระบบ (Sign In)"}</span>
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="px-6 py-3 rounded-full border border-slate-700/80 hover:border-cyan-400/80 text-slate-300 hover:text-white text-sm font-medium transition-all hover:bg-slate-800/50 cursor-pointer backdrop-blur-sm"
            >
              <span>{buttonText}</span>
              <span className="ml-1 opacity-70">↓</span>
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
