'use client';

import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, CheckCircle2, Building2 } from 'lucide-react';
import { TESTIMONIALS_DATA } from '@/lib/data';
import { Testimonial } from '@/lib/types';
import { playClickSound } from '@/lib/audio';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  sectionTag?: string;
}

export default function TestimonialsSection({
  testimonials = TESTIMONIALS_DATA,
  sectionTag = '// 06_RECOMMENDATIONS'
}: TestimonialsSectionProps = {}) {
  const list = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS_DATA;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!list || list.length === 0) return null;

  const handlePrev = () => {
    playClickSound();
    setActiveIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playClickSound();
    setActiveIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  const current = list[activeIndex] || list[0];

  return (
    <section id="testimonials" className="py-16 md:py-32 border-b border-[#292929] bg-[#0E0E0E] relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest sticky top-28 font-bold">
              {sectionTag}
            </h2>
          </div>
          <div className="md:col-span-9 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h3 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#e5e2e1] mb-2 sm:mb-4">
                Leadership Endorsements.
              </h3>
              <p className="font-body text-xs sm:text-base text-[#c4c7c7] max-w-2xl">
                Feedback and testimonials from CTOs, Engineering VPs, and Technical Leads I have collaborated with.
              </p>
            </div>

            {/* Slider Controls & Pagination */}
            {list.length > 1 && (
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <span className="font-mono text-xs text-[#8e9192] mr-2">
                  <strong className="text-[#D8FF45]">0{activeIndex + 1}</strong> / 0{list.length}
                </span>
                <button
                  onClick={handlePrev}
                  className="p-2.5 sm:p-3 border border-[#292929] hover:border-[#D8FF45] bg-[#141313] hover:text-[#D8FF45] transition-all cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#e5e2e1]" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 sm:p-3 border border-[#292929] hover:border-[#D8FF45] bg-[#141313] hover:text-[#D8FF45] transition-all cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#e5e2e1]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Testimonial Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-start-3 md:col-span-10">
            <div className="bg-[#111111] border border-[#292929] p-5 sm:p-8 md:p-12 relative flex flex-col gap-6 sm:gap-8 shadow-xl">
              
              <Quote className="w-8 h-8 sm:w-12 sm:h-12 text-[#D8FF45]/15 absolute top-4 right-4 sm:top-8 sm:right-8 pointer-events-none" />

              <p className="font-display text-base sm:text-2xl md:text-3xl text-[#e5e2e1] leading-relaxed italic pr-6 sm:pr-8">
                &quot;{current.quote}&quot;
              </p>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-[#292929] pt-4 sm:pt-6">
                <div>
                  <h4 className="font-display font-extrabold text-base sm:text-xl text-[#e5e2e1]">
                    {current.name}
                  </h4>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-[#D8FF45] mt-1 font-bold">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{current.role} @ {current.company}</span>
                  </div>
                </div>

                {current.relationship && (
                  <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-[#c4c7c7] bg-[#1c1b1b] border border-[#292929] px-2.5 py-1 sm:px-3 sm:py-1.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D8FF45] shrink-0" />
                    <span>{current.relationship}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
