'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Download, Terminal, ShieldCheck, Zap } from 'lucide-react';
import { HERO_DATA } from '@/lib/data';
import { HeroData } from '@/lib/types';

// Dynamically import HeroShader with SSR disabled for optimal loading speed
const HeroShader = dynamic(() => import('./HeroShader'), { ssr: false });

interface HeroSectionProps {
  heroData?: HeroData;
}

// Helper to format yesterday's date (e.g. "30_May_2040" or "17_Aug_2026")
function getYesterdayDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const day = yesterday.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[yesterday.getMonth()];
  const year = yesterday.getFullYear();

  return `${day}_${month}_${year}`;
}

export default function HeroSection({ heroData = HERO_DATA }: HeroSectionProps) {
  const resumeHref = heroData.resumeUrl || '/resume.pdf';
  const isExternalUrl = resumeHref.startsWith('http://') || resumeHref.startsWith('https://');

  // Format dynamic download filename: "developer_name_Resume_date_month_year.pdf"
  const devName = heroData.name
    ? heroData.name.trim().replace(/[^a-zA-Z0-9]/g, '_')
    : 'Developer';

  const dynamicFileName = `${devName}_Resume_${getYesterdayDateString()}.pdf`;

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex flex-col justify-between pt-24 md:pt-32 pb-12 border-b border-[#292929] overflow-hidden"
    >
      {/* Background WebGL Shader */}
      <HeroShader />

      {/* Grid Line Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="max-w-[1440px] h-full mx-auto grid grid-cols-4 md:grid-cols-12 gap-8 px-6 md:px-16">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`border-l border-[#8e9192] h-full ${i > 3 ? 'hidden md:block' : ''}`} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-10 md:col-start-1 flex flex-col items-start">
            
            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-6 bg-[#141313]/80 border border-[#292929] px-4 py-2 rounded-full backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8FF45] pulse-indicator" />
              <span className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-medium">
                {heroData.title}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#e5e2e1] leading-[1.05] tracking-tight mb-8 max-w-[880px] uppercase">
              {heroData.headline}
            </h1>

            {/* Content & Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full mb-12 items-start">
              <div className="md:col-span-7">
                <p className="font-body text-base md:text-lg text-[#c4c7c7] leading-relaxed max-w-[600px]">
                  {heroData.subheadline}
                </p>
                
                {/* Security & Speed Badges */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#c4c7c7] bg-[#1c1b1b] border border-[#292929] px-3 py-1.5 rounded">
                    <ShieldCheck className="w-4 h-4 text-[#D8FF45]" />
                    <span>Hardened Security (CSP / Anti-XSS)</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#c4c7c7] bg-[#1c1b1b] border border-[#292929] px-3 py-1.5 rounded">
                    <Zap className="w-4 h-4 text-[#D8FF45]" />
                    <span>Sub-100ms TTI &amp; RSC</span>
                  </div>
                </div>
              </div>

              {/* Glass Stat Card */}
              <div className="md:col-span-5 flex flex-col justify-start md:items-end">
                <div className="glass-panel p-6 w-full max-w-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-[#292929] pb-3">
                    <span className="font-mono text-xs text-[#c4c7c7] uppercase">EXPERIENCE</span>
                    <span className="font-mono text-xs text-[#e5e2e1] font-bold">{heroData.experienceYears}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#292929] pb-3">
                    <span className="font-mono text-xs text-[#c4c7c7] uppercase">LOCATION</span>
                    <span className="font-mono text-xs text-[#e5e2e1] font-bold">{heroData.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-[#c4c7c7] uppercase">STATUS</span>
                    <span className="font-mono text-xs text-[#D8FF45] font-bold">{heroData.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons with Dynamic Yesterday-Dated Resume Download */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#work"
                className="btn-primary font-mono text-xs uppercase px-8 py-4 flex items-center gap-3 tracking-widest font-bold"
              >
                VIEW MY WORK
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={resumeHref}
                target={isExternalUrl ? "_blank" : undefined}
                rel={isExternalUrl ? "noopener noreferrer" : undefined}
                download={isExternalUrl ? undefined : dynamicFileName}
                className="btn-ghost font-mono text-xs uppercase px-8 py-4 flex items-center gap-2 tracking-widest"
              >
                <Download className="w-4 h-4 text-[#D8FF45]" />
                DOWNLOAD RESUME (PDF)
              </a>
              <a
                href="#contact"
                className="btn-ghost font-mono text-xs uppercase px-6 py-4 flex items-center gap-2 tracking-widest text-[#c4c7c7]"
              >
                <Terminal className="w-4 h-4" />
                GET IN TOUCH
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Tech Stack Ticker Bar */}
      <div className="w-full border-t border-[#292929] py-5 md:py-6 bg-[#141313]/90 relative z-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6">
          <span className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest shrink-0 font-bold">CORE STACK:</span>
          <div className="overflow-x-auto no-scrollbar whitespace-nowrap py-1 max-w-full">
            <div className="inline-flex gap-6 font-mono text-xs text-[#c4c7c7] tracking-widest items-center">
              {heroData.skillsTicker.map((skill, index) => (
                <span key={index} className="flex items-center gap-4">
                  <span className="text-[#e5e2e1] font-semibold">{skill}</span>
                  {index < heroData.skillsTicker.length - 1 && <span className="text-[#292929]">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
