'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { AboutData } from '@/lib/types';
import { ABOUT_DATA } from '@/lib/data';

interface AboutSectionProps {
  sectionTag?: string;
  aboutData?: AboutData;
}

export default function AboutSection({
  sectionTag = '// 05_ABOUT_&_PHILOSOPHY',
  aboutData = ABOUT_DATA
}: AboutSectionProps) {
  const data = { ...ABOUT_DATA, ...aboutData };

  return (
    <section id="about" className="py-24 md:py-32 bg-[#171717] border-b border-[#292929] relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest sticky top-28 font-bold">
              {sectionTag}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Portrait Image Card */}
          <div className="md:col-span-5 relative">
            <div className="aspect-[3/4] bg-[#292929] overflow-hidden relative border border-[#444748] group">
              {data.portraitImage ? (
                <Image
                  src={data.portraitImage}
                  alt="Software Engineer Editorial Portrait"
                  fill
                  className="object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1c1b1b] text-[#c4c7c7] font-mono text-xs uppercase">
                  NO PORTRAIT IMAGE SET
                </div>
              )}
              <div className="absolute bottom-4 left-4 z-10 bg-[#141313]/90 border border-[#292929] px-4 py-2 flex items-center gap-2 backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8FF45] pulse-indicator" />
                <span className="font-mono text-xs text-[#e5e2e1] font-bold">AVAILABLE FOR SELECT OPPORTUNITIES</span>
              </div>
            </div>
          </div>

          {/* Editorial Bio & Philosophy */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <span className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">
              // ENGINEERING PHILOSOPHY
            </span>
            
            <h3 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#e5e2e1] uppercase leading-tight tracking-tight">
              {data.title || 'Curious by Default.'}<br />
              <span className="text-[#8e9192]">{data.titleHighlight || 'Obsessed with Building.'}</span>
            </h3>

            {data.paragraph1 && (
              <p className="font-body text-lg text-[#c4c7c7] leading-relaxed">
                {data.paragraph1}
              </p>
            )}

            {data.paragraph2 && (
              <p className="font-body text-base text-[#c4c7c7] leading-relaxed">
                {data.paragraph2}
              </p>
            )}

            {data.highlights && data.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#292929] pt-6 mt-4">
                {data.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D8FF45] shrink-0" />
                    <span className="font-mono text-xs text-[#e5e2e1] font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
